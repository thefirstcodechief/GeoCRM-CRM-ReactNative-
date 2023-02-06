import { StyleSheet, Text, View } from 'react-native'
import React , { useState  , useEffect } from 'react'
import FilterButton from '../../../FilterButton';
import { useSelector } from 'react-redux';
import { DateStartEndTimePickerView } from '../../../DateStartEndTimePickerView';
import { DatetimePickerView } from '../../../DatetimePickerView';
import { useDispatch } from 'react-redux';
import { generateKey } from '../../../../constants/Utils';
import { Colors, Constants, Strings } from '../../../../constants';
import { clearLoadingBar, showLoadingBar, showNotification } from '../../../../actions/notification.action';
import { expireToken, getPostParameter } from '../../../../constants/Helper';
import { PostRequestDAO } from '../../../../DAO';
import { Notification } from '../../Notification';
import AlertDialog from '../../AlertDialog';

var indempotencyKey = '';

const AddToCalendarContainer = (props) => {

    const { selectedItems } = props;

    const dispatch = useDispatch();

    const currentLocation = useSelector(state => state.rep.currentLocation);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
    const [isStartEndTimePicker, setStartEndTimePicker] = useState(false);
    const [dateTimeType, setDateTimeType] = useState('date');
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
        
    useEffect(() => {
        indempotencyKey = generateKey();
    }, []);

    const handleScheduleDate = date => {    
        let datetime = date;    
        if (selectedItems != undefined) {
        selectedItems.forEach((item, index) => {
            item.schedule_order = (index + 1).toString();
            item.schedule_date = datetime;
        });
        callApi(selectedItems);
        }
    };

    
    const callApi = (schedules) => {
        
        if(!isLoading){
            setStartEndTimePicker(false);
            setIsLoading(true);                 
            var userParam = getPostParameter(currentLocation);
            let postData = {
                schedules: schedules,
                user_local_data: userParam.user_local_data,
            };

            PostRequestDAO.find(0, postData, 'calenderadd' , 'calenderadd' , ''  , '' , indempotencyKey , dispatch).then((res) => {              
                setIsLoading(false);                
                setMessage(Strings.Calendar.Added_Calendar_Successfully);
                setIsConfirmModal(true);
            }).catch(( error ) => {     
                expireToken(dispatch, error);
                setMessage(error.toString());
                setIsConfirmModal(true);
                setIsLoading(false);
            });                          
        }
    };

  return (
    <View style={styles.refreshSliderContainer}>
        
        <AlertDialog
          visible={isConfirmModal}
          onModalClose={() => {
            setIsConfirmModal(false);
            if(props.onButtonAction){
              props.onButtonAction({type: Constants.actionType.ACTION_DONE});  
            }            
          }}
        message={message}></AlertDialog>


        <FilterButton
            text="Today"
            onPress={() => {
            if (selectedItems.length === 1) {
                setDateTimeType('time');
                setStartEndTimePicker(true);
            } else {
                if (selectedItems != undefined) {
                selectedItems.forEach((item, index) => {
                    item.schedule_order = (index + 1).toString();
                    item.schedule_date = 'Today';
                });              
                callApi(selectedItems);
                }
            }
            }}
        />
      
      <FilterButton
        text="Schedule Date"
        onPress={() => {
          if(!isLoading){
            if (selectedItems.length === 1) {
              setDateTimeType('datetime');
              setStartEndTimePicker(true);
            } else {              
              setIsDateTimePickerVisible(true);              
            }
          }
          
        }}
      />

      <DateStartEndTimePickerView
        title={
          dateTimeType === 'time'
            ? 'Please select time: '
            : 'Please Select date and time:'
        }
        visible={isStartEndTimePicker}        
        onModalClose={() => setStartEndTimePicker(false)}
        mode={dateTimeType}
        close={(startDate, endDate, startTime, endTime) => {
          selectedItems.forEach((item, index) => {
            item.schedule_order = (index + 1).toString();
            if (dateTimeType === 'time') {
              item.schedule_date = 'Today';
            } else {
              item.schedule_date = startDate
                .replace('/', '-')
                .replace('/', '-');
            }
            item.schedule_time = startTime;
            item.schedule_end_time = endTime;
          });
          callApi(selectedItems);
        }}></DateStartEndTimePickerView>
        

        <DatetimePickerView
            isLoading={isLoading}
            visible={isDateTimePickerVisible}
            value={''}
            onModalClose={() => {
                setIsDateTimePickerVisible(false);
            }}
            close={date => {
            if (date.length > 0) {
                handleScheduleDate(date.replace('/', '-').replace('/', '-'));
            }
            setIsDateTimePickerVisible(false);
        }}></DatetimePickerView>      


    </View>
  )
}

export default AddToCalendarContainer

const styles = StyleSheet.create({

    refreshSliderContainer: {
        backgroundColor: Colors.bgColor,
        padding: 10,
        alignSelf: 'stretch',
    },

})