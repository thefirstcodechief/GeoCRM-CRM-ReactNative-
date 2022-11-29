import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {expireToken, getPostParameter} from '../../../constants/Helper';
import {getDateTime} from '../../../helpers/formatHelpers';
import {useSelector, useDispatch} from 'react-redux';
import {
  getJsonData,
  getLocalData,
  storeJsonData,
  storeLocalValue,
} from '../../../constants/Storage';
import {
  CHECKIN,
  LOCATION_CHECK_OUT_COMPULSORY,
} from '../../../actions/actionTypes';
import HomeCheckOut from '../../../screens/GeoRep/Home/partial/CheckOut';
import SpecificCheckOut from '../../../screens/GeoRep/CRM/checkin/partial/CheckoutButton';
import {PostRequestDAO} from '../../../DAO';
import {
  clearNotification,
  showNotification,
} from '../../../actions/notification.action';
import {Constants, Strings} from '../../../constants';
import {useNavigation} from '@react-navigation/native';
import CalendarCheckOutButton from '../../../screens/GeoRep/Calendar/partial/CalendarCheckOutButton';

var specificLocationId;

export default function CheckOutViewContainer(props) {
  const {type, currentCall} = props;
  const dispatch = useDispatch();
  const currentLocation = useSelector(state => state.rep.currentLocation);
  const locationCheckOutCompulsory = useSelector(
    state => state.rep.locationCheckOutCompulsory,
  );

  const navigationMain = useNavigation();

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    console.log('updated location com', locationCheckOutCompulsory);
  }, [locationCheckOutCompulsory]);

  const initData = async () => {
    specificLocationId = await getLocalData('@specific_location_id');
  };

  const checkOutLocation = useCallback(() => {
    _callCheckOut();
  }, [locationCheckOutCompulsory]);

  const _callCheckOut = () => {
    console.log('locationCheckOutCompulsory', locationCheckOutCompulsory);
    if (locationCheckOutCompulsory) {
      dispatch(
        showNotification({
          type: Strings.Success,
          message: Strings.CRM.Complete_Compulsory_Form,
          buttonText: Strings.Ok,
          buttonAction: async () => {
            // if(type == 'home'){
            // }else if(type == "specificInfo"){
            // }else if(type == "calendar"){
            // }

            const location = await getJsonData('@checkin_location');
            navigationMain.navigate('DeeplinkRepForms', {
              locationInfo: location,
            });
            dispatch(clearNotification());
          },
        }),
      );
    } else {
      var userParam = getPostParameter(currentLocation);
      var currentTime = getDateTime();

      let postData = {
        location_id: specificLocationId,
        checkout_time: currentTime,
        user_local_data: userParam.user_local_data,
      };

      PostRequestDAO.find(
        specificLocationId,
        postData,
        'checkout',
        'location-info/check-out',
        '',
        '',
      )
        .then(async res => {
          console.log('RES : ', res);
          await storeLocalValue('@checkin', '0');
          await storeLocalValue('@checkin_type_id', '');
          await storeLocalValue('@checkin_reason_id', '');
          await storeLocalValue('@specific_location_id', '');
          await storeLocalValue(Constants.storageKey.CHECKIN_SCHEDULE_ID, '');
          await storeJsonData('@form_ids', []);
          console.log(' pooo  ====== ');
          dispatch({type: CHECKIN, payload: false});
          dispatch({type: LOCATION_CHECK_OUT_COMPULSORY, payload: true});
          if (type == 'specificInfo') {
            if (props.goBack) {
              props.goBack(res);
            }
          } else {
          }
        })
        .catch(e => {
          console.log('checkout error:', e);
          expireToken(dispatch, e);
        });
    }
  };

  return (
    <View>
      {type == 'home' && (
        <HomeCheckOut
          currentCall={currentCall}
          _callCheckOut={checkOutLocation}
        />
      )}

      {type == 'specificInfo' && (
        <SpecificCheckOut _callCheckOut={checkOutLocation} />
      )}

      {type == 'calendar' && (
        <CalendarCheckOutButton _callCheckOut={checkOutLocation} />
      )}
    </View>
  );
}
