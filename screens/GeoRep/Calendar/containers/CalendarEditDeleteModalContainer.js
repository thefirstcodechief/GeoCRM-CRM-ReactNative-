
import { View, Text } from 'react-native'
import React , { useState , useRef } from 'react'
import CalendarEditDeleteView from '../components/CalendarEditDeleteView'
import { expireToken, getPostParameter } from '../../../../constants/Helper';
import { useSelector  } from 'react-redux';
import { PostRequestDAO } from '../../../../DAO';
import LoadingBar from '../../../../components/LoadingView/loading_bar';
import ConfirmDialog from '../../../../components/modal/ConfirmDialog';
import { Constants } from '../../../../constants';

const CalendarEditDeleteModalContainer = (props) => {

  const { location } = props;

  const currentLocation = useSelector(state => state.rep.currentLocation);
  const [isLoading, setIsLoading] = useState(false);
  const loadingBar = useRef(null);
  const confirmModalRef = useRef(null)

  const onEdit = (data) => {
    if(data && !isLoading){
      var userParam = getPostParameter(currentLocation);
      var postData = {
        schedule_id : location.schedule_id,
        ...data,
        user_local_data: userParam.user_local_data,
      };  
      console.log(postData);
      setIsLoading(true);
      showLoadingBar();
      PostRequestDAO.find(0, postData, 'update-single' , 'calender/update-single' , '', '', null , null).then((res) => {
        console.log("update single api result => ", res);
        setIsLoading(false);
        hideLoadingBar();
        props.onButtonAction({type: Constants.actionType.ACTION_DONE });
      }).catch((e) => {
        setIsLoading(false);
        hideLoadingBar();
        expireToken(e);
      })      
    }
  }

  const  onDelete = () => {        
    console.log(location.schedule_id);
    if(location.schedule_id && !isLoading){
      var userParam = getPostParameter(currentLocation);
      const postData = {
        schedule_id : location.schedule_id,
        user_local_data: userParam.user_local_data,
      };
      setIsLoading(true);
      showLoadingBar();
      PostRequestDAO.find(0, postData , 'delete-single' , 'calender/delete-single' , '' ,'' , null , null  ).then((res) => {
        console.log("delete single api result => ", res)
        setIsLoading(false);
        hideLoadingBar();
        props.onButtonAction({type: Constants.actionType.ACTION_DONE });
      }).catch((e) => {
        setIsLoading(false);
        hideLoadingBar();
        expireToken(e);
      })
    }
  }

  const showLoadingBar = () => {
    if(loadingBar.current){
      loadingBar.current.showModal();
    }
  }

  const hideLoadingBar = () => {
    if(loadingBar.current){
      loadingBar.current.hideModal();
    }
  }

  const showConfirmModal = () => {
    if(confirmModalRef.current){
      confirmModalRef.current.showModal();
    }
  }

  const hideConfirmModal = () => {
    if(confirmModalRef.current){
      confirmModalRef.current.hideModal();
    }
  }


  return (
    <View style={{alignSelf:'stretch'}}>
        <CalendarEditDeleteView 
          location={location} 
          onEdit={(data) => {
            onEdit(data)
          }}
          onDelete = {() => {
            showConfirmModal()
          }}
        />

        <LoadingBar 
          ref={loadingBar}
        />

        <ConfirmDialog
          message='Are you sure you want to delete this scheduled visit' 
          ref={confirmModalRef}
          onBack={() => {
            hideConfirmModal()
          }}
          onDone={() => {
            hideConfirmModal();
            onDelete();
          }}
        />

    </View>
  )
   
}

export default CalendarEditDeleteModalContainer