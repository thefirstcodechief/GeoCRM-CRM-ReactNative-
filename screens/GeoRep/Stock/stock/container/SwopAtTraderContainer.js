import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  getApiRequest,
  postApiRequestMultipart,
} from '../../../../../actions/api.action';
import SwopAtTraderView from '../components/SwopAtTraderView';
import * as RNLocalize from 'react-native-localize';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {
  clearNotification,
  showNotification,
} from '../../../../../actions/notification.action';
import {Constants} from '../../../../../constants';
import {expireToken, getFileFormat} from '../../../../../constants/Helper';
import {Notification} from '../../../../../components/modal/Notification';

const SwopAtTraderContainer = props => {
  const {locationId, item} = props;
  const [lists, setLists] = useState([]);
  const currentLocation = useSelector(state => state.rep.currentLocation);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMount = true;
    let param = {
      location_id: locationId,
    };

    getApiRequest('locations/location-devices', param)
      .then(res => {
        if (isMount) {
          setLists(res.devices);
        }
      })
      .catch(e => {
        console.log('location-devices api error:', e);
        expireToken(dispatch, e);
      });
    return () => {
      isMount = false;
    };
  }, []);

  const onSwop = data => {
    const {reason, photos, device} = data;
    setIsLoading(true);
    var postData = new FormData();
    postData.append('stock_type', Constants.stockType.DEVICE);
    postData.append('location_id', props.locationId);
    postData.append(
      'return_device[location_device_id]',
      device.location_device_id,
    );
    postData.append('return_device[return_reason]', reason);
    postData.append('allocate_device[stock_item_id]', item.stock_item_id);
    postData.append('allocate_device[assigned_msisdn]', data?.msisdn);
    photos.map((path, index) => {
      var fileFormats = getFileFormat(path);
      var key = `return_image[${index}]`;
      postData.append(key, fileFormats);
    });
    var time_zone = RNLocalize.getTimeZone();
    postData.append('user_local_data[time_zone]', time_zone);
    postData.append(
      'user_local_data[latitude]',
      currentLocation && currentLocation.latitude != null
        ? currentLocation.latitude
        : '0',
    );
    postData.append(
      'user_local_data[longitude]',
      currentLocation && currentLocation.longitude != null
        ? currentLocation.longitude
        : '0',
    );

    postApiRequestMultipart('stockmodule/swop-at-trader', postData)
      .then(res => {
        setIsLoading(false);
        dispatch(
          showNotification({
            type: 'success',
            message: res.message,
            buttonText: 'Ok',
            buttonAction: async () => {
              props.onButtonAction({type: Constants.actionType.ACTION_CLOSE});
              dispatch(clearNotification());
            },
          }),
        );
      })
      .catch(e => {
        setIsLoading(false);
        expireToken(dispatch, e);
      });
  };

  return (
    <View style={{alignSelf: 'stretch'}}>
      <SwopAtTraderView
        onSwop={onSwop}
        lists={lists}
        {...props}
        isLoading={isLoading}
      />
      <Notification />
    </View>
  );
};

export default SwopAtTraderContainer;
