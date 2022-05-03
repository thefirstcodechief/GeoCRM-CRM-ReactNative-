import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import SvgIcon from '../../../../components/SvgIcon';
import Colors, {whiteLabel} from '../../../../constants/Colors';
import Fonts from '../../../../constants/Fonts';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import {getDistance} from '../../../../constants/Helper';
import {
  checkFeatureIncludeParam,
  getLocalData,
} from '../../../../constants/Storage';
import {useDispatch} from 'react-redux';
import {LOCATION_ID_CHANGED} from '../../../../actions/actionTypes';
import {style} from '../../../../constants/Styles';
let isCheckIn = '0';

export function CalendarItem({
  navigation,
  item,
  current,
  tabIndex,
  onItemSelected,
}) {
  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    isCheckIn = await getLocalData('@checkin');
  };

  const dispatch = useDispatch();
  const getButtonColor = checkin_state => {
    if (checkFeatureIncludeParam('open_replace_checkin')) {
      return whiteLabel().actionFullButtonBackground;
    } else {
      if (checkin_state === 'checkin_required') {
        return whiteLabel().actionFullButtonBackground;
      } else if (checkin_state === 'checkin_completed') {
        return '#eee';
      } else if (checkin_state === 'checkin_current') {
        return Colors.selectedRedColor;
      }
    }
  };

  const getButtonText = checkin_state => {
    if (checkFeatureIncludeParam('open_replace_checkin')) {
      return 'Open';
    } else {
      if (checkin_state === 'checkin_required') {
        return 'Check In';
      } else if (checkin_state === 'checkin_completed') {
        return 'Check In';
      } else if (checkin_state === 'checkin_current') {
        return 'Check Out';
      }
    }
  };

  if (item != undefined && item.coordinates != undefined) {
    return (
      <View style={[styles.itemContainer, style.card]}>
        <View style={styles.itemLeft}>
          <View style={styles.itemTitleBox}>
            <SvgIcon
              style={{marginRight: 4}}
              icon="Location_Arrow"
              width="12px"
              height="12px"
            />
            <Text style={styles.itemTitle}>{item.location_name}</Text>
          </View>
          <Text style={styles.itemText}>{item.address}</Text>
        </View>

        <View style={styles.itemRight}>
          <Text style={[styles.itemTitle, {textAlign: 'center'}]}>
            {' '}
            {item.schedule_time}
          </Text>
          <TouchableOpacity
            style={[
              styles.itemButton,
              {backgroundColor: getButtonColor(item.checkin_state)},
            ]}
            onPress={() => {
              if (checkFeatureIncludeParam('open_replace_checkin')) {
                dispatch({
                  type: LOCATION_ID_CHANGED,
                  payload: {value: item.location_id, type: tabIndex},
                });
                navigation.navigate('CRM', {
                  screen: 'LocationSearch',
                  params: {location_id: item.location_id},
                });
                onItemSelected();
              }
            }}>
            <Text style={styles.itemButtonText}>
              {' '}
              {getButtonText(item.checkin_state)}{' '}
            </Text>
            <FontAwesomeIcon
              style={styles.itemButtonIcon}
              size={16}
              color={whiteLabel().actionFullButtonIcon}
              icon={faCheckCircle}
            />
          </TouchableOpacity>
          {/* <Text style={[styles.itemText, {textAlign: 'center'}]}>{getDistance(item.coordinates, current).toFixed(2)}km</Text> */}
        </View>
      </View>
    );
  }
  return <View></View>;
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
    backgroundColor: Colors.whiteColor,
    borderWidth: 1.5,
    borderColor: whiteLabel().fieldBorder,
  },
  itemLeft: {
    width: '60%',
  },
  itemRight: {
    width: '35%',
  },

  itemTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  itemTitle: {
    fontSize: 14,
    fontFamily: Fonts.secondaryMedium,
    color: whiteLabel().mainText,
  },
  itemText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: Fonts.secondaryMedium,
    color: Colors.disabledColor,
    maxHeight: 36,
  },
  itemButton: {
    position: 'relative',
    justifyContent: 'center',
    padding: 4,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 4,
  },
  itemButtonText: {
    fontSize: 14,
    fontFamily: Fonts.secondaryMedium,
    textAlign: 'center',
    color: '#fff',
  },
  itemButtonIcon: {
    position: 'absolute',
    right: 8,
  },
});
