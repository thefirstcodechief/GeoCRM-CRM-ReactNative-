import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Colors, { whiteLabel } from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import { CHANGE_OFFLINE_STATUS, CHANGE_PROFILE_STATUS } from '../../actions/actionTypes';
import { checkFeatureIncludeParam, getLocalData, storeLocalValue } from '../../constants/Storage';
import { clearNotification, showNotification } from '../../actions/notification.action';
import Strings from '../../constants/Strings';
import Fonts from '../../constants/Fonts';


export default function HeaderRightView({navigation}) {

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.auth.userInfo);
  const [toggleSwitch, setToggleSwitch] = useState(true);
  const [canShowToggle, setShowToggle] = useState(true);
  const offlineStatus = useSelector(state => state.auth.offlineStatus);

  useEffect(() => {
    getToggleStatus();
    setOnlineOffline();
  },[]);

  // useEffect(() => {   
  //    setToggleSwitch(!offlineStatus)
  // }, [offlineStatus]);


  const showMessage = (toggleSwitch) => {
    dispatch(showNotification({
      type: Strings.Success , 
      message: toggleSwitch ? Strings.Online_Mode : Strings.Offline_Mode , 
      buttonText: 'Ok',
      buttonAction: () => {
        dispatch({type: CHANGE_OFFLINE_STATUS , payload: !toggleSwitch });
        dispatch(clearNotification())
        if(toggleSwitch){
          navigation.navigate('Home' , {sync: true});
        }
      }
    })); 
  }

  const getToggleStatus = async () => {
    let res = await checkFeatureIncludeParam("offline_toggle");    
    setShowToggle(res);
  }

  const setOnlineOffline = async () => {
    var isOnline = await getLocalData("@online");  
    console.log("initialize setOnlineOffline ==== ", isOnline)  
    if(isOnline === "1" || isOnline === undefined){
      setToggleSwitch(true);
      dispatch({type: CHANGE_OFFLINE_STATUS , payload: false});
    }else{
      setToggleSwitch(false);
      console.log("initialize setOnlineOffline ==== ", isOnline)  
      dispatch({type: CHANGE_OFFLINE_STATUS , payload: true});
    }
  }

  return (
    <View style={styles.headerRightView}>
      {canShowToggle &&
        <ToggleSwitch
          style={styles.toggleSwitch}
          label={!offlineStatus ? "Online" : "Offline"}
          labelStyle={styles.toggleSwitchLabel}
          onColor={Colors.whiteColor}
          offColor={Colors.redColor}
          size="small"
          thumbOnStyle={{ backgroundColor: whiteLabel().headerBackground }}
          thumbOffStyle={{ backgroundColor: whiteLabel().headerBackground }}
          isOn={!offlineStatus}
          onToggle={ async (toggleSwitch)  => {            
            await storeLocalValue("@online", toggleSwitch ? "1" : "0");   
            if(!toggleSwitch){ // offline
              await storeLocalValue("@manual_online_offline" , "1");
            }else{
              await storeLocalValue("@manual_online_offline" , "0");
            }
            setToggleSwitch(toggleSwitch);
            showMessage(toggleSwitch);
          }}
        />}
      <TouchableOpacity style={styles.headerAvatar} onPress={() => dispatch({ type: CHANGE_PROFILE_STATUS, payload: 0 })}>
        <Text style={styles.headerAvatarText}>
          {userInfo.user_name.split(' ')[0] && userInfo.user_name.split(' ')[0][0].toUpperCase()}
          {userInfo.user_name.split(' ')[1] && userInfo.user_name.split(' ')[1][0].toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

  layoutBarContent: {
    height: 62,
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: whiteLabel().headerBackground,
  },

  headerRightView: {
    flexDirection: 'row',
    marginRight: 12,
    marginBottom: 20,
    marginTop: 20
  },

  toggleSwitch: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },

  toggleSwitchLabel: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.secondaryMedium
  },

  headerAvatar: {
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    paddingTop: Platform.OS == 'ios' ? 2 : 0,
    width: 32,
    height: 32,
    borderRadius: 20
  },

  headerAvatarText: {
    fontSize: 17,
    color: '#fff',
    fontFamily: Fonts.secondaryBold,
    alignSelf: 'center'
  }
})
