import React, { Fragment, useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, View, TouchableOpacity, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setWidthBreakpoints, parse } from 'react-native-extended-stylesheet-breakpoints';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import AddLead from '../../components/AddLead';
import LocationInfo from '../../components/LocationInfo';
import FilterView from '../../components/FilterView';
import MarkerIcon from '../../components/Marker';
import SvgIcon from '../../components/SvgIcon';
import Divider from '../../components/Divider';
import GrayBackground from '../../components/GrayBackground';
import { PRIMARY_COLOR, BG_COLOR, TEXT_COLOR } from '../../constants/Colors';
import { boxShadow } from '../../constants/Styles';
import { breakPoint } from '../../constants/Breakpoint';
import { SLIDE_STATUS } from '../../actions/actionTypes';

const markerIcons = [
  {
    icon: 'Purple_X',
    text: 'Invalid Lead / Vacant'
  },
  {
    icon: 'Red_X',
    text: 'DNK Request'
  },
  {
    icon: 'Red_Star',
    text: 'No Contant - DM (F)'
  },
  {
    icon: 'Red_Triangle',
    text: 'No Access - Final'
  },
  {
    icon: 'Grey_Triangle',
    text: 'Not Interested'
  },
  {
    icon: 'Gold_Star',
    text: 'Closed Won'
  },
  {
    icon: 'Green_Star',
    text: 'Re-loop'
  },
  {
    icon: 'Orange_Star',
    text: 'Priority Re-loop'
  },
  {
    icon: 'Turquoise',
    text: 'Language Barrier'
  }
];

const MarkerView = () => {
  const dispatch = useDispatch();
  return (
    <Fragment>
      <TouchableOpacity style={{padding: 6}} onPress={() => dispatch({type: SLIDE_STATUS, payload: false})}>
        <Divider />
      </TouchableOpacity>
      <View style={styles.markerContent}>
        {markerIcons.map((markerIcon, key) => (
          <View style={styles.markerBox} key={key}>
            <MarkerIcon style={styles.markerIcon} icon={markerIcon.icon} width="28px" height="28px" />
            <Text style={styles.markerText}>{markerIcon.text}</Text>
          </View>
        ))}
      </View>
    </Fragment>
  )
};

const SlidUpArrow = () => (
  <View style={styles.slidUpArrow}>
    <Text style={styles.slidUpArrowText}>Pin Key</Text>
    <FontAwesomeIcon size={12} icon={faChevronUp} color={PRIMARY_COLOR} />
  </View>
)

export default function LocationScreen(props) {
  const crmStatus = useSelector(state => state.rep.crmSlideStatus);
  const dispatch = useDispatch();

  const [showItem, setShowItem] = useState(0);

  useEffect(() => {
    props.screenProps.setOptions({
      tabBarStyle: {
        height: 60,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#fff",
      },
    });
    if (crmStatus) {
      props.screenProps.setOptions({
        tabBarStyle: {
          display: 'none',
        },
      });
    }
  });

  const [mapRegion, setMapRegion] = useState({
    latitude: -33.891321,
    longitude: 18.505649,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });

  const [markers, setMarkers] = useState([
    {
      latlng: {
        latitude: -33.896821,
        longitude: 18.506450
      },
      icon: "Green_Star"
    },
    {
      latlng: {
        latitude: -33.891248,
        longitude: 18.510959
      },
      icon: "Red_Triangle"
    },
    {
      latlng: {
        latitude: -33.888103,
        longitude: 18.501482
      },
      icon: "Purple_X"
    }
  ]);

  const animation = (name) => {
    dispatch({type: SLIDE_STATUS, payload: true});
    switch(name) {
      case "marker":
        setShowItem(1);
        return;
      case "filter":
        setShowItem(2);
        return;
      case "addLead":
        setShowItem(3);
        return;
      case "locationInfo":
        setShowItem(4);
        return;
      default:
        return;
    }
  }
  
  return (
    <SafeAreaView>
      <GrayBackground />
      {crmStatus && <View
        style={[styles.transitionView, showItem == 0 ? { transform: [{ translateY: Dimensions.get('window').height + 100 }] } : { transform: [{ translateY: 0 }] } ]}
      >
        {showItem == 1 && <MarkerView />}
        {showItem == 2 && <FilterView navigation={props.navigation} />}
        {showItem == 3 && <AddLead screenProps={props.screenProps} />}
        {showItem == 4 && <LocationInfo navigation={props.navigation} />}
      </View>}
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={()=> {
              dispatch({type: SLIDE_STATUS, payload: false});
              props.navigation.navigate("LocationSearch");
            }}
          >
            <View pointerEvents='none'>
              <TextInput
                style={[styles.searchInput, boxShadow]}
                placeholder='Search.....'
              />
            </View>
          </TouchableOpacity>
          <FontAwesomeIcon style={styles.searchIcon} size={16} color="#9D9FA2" icon={ faSearch } />
          <TouchableOpacity style={styles.filterImageButton} onPress={() => animation("filter")}>
            <SvgIcon icon="Filter" width="30px" height="30px" />
          </TouchableOpacity>
        </View>
        <MapView
          moveOnMarkerPress={false}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation = {true}
          followUserLocation = {true}
          showsMyLocationButton = {true}
          zoomEnabled = {true}
          region={mapRegion}
          onPress={(e) => console.log(e)}
        >
          {markers.map((marker, key) => (
            <Marker
              key={key}
              coordinate={marker.latlng}
              onPress={() => animation("locationInfo")}
            >
              <MarkerIcon style={styles.markerIcon} icon={marker.icon} width="34px" height="34px" />
            </Marker>
          ))}
          <MapView.Circle
            center = {mapRegion}
            radius = { 200 }
            strokeWidth = { 1 }
            strokeColor = {PRIMARY_COLOR}
            fillColor = { 'rgba(230,238,255,0.5)' }
          />
          <MapView.Circle
            center = {mapRegion}
            radius = { 30 }
            strokeWidth = { 3 }
            strokeColor = { '#fff' }
            fillColor = { PRIMARY_COLOR }
          />
        </MapView>
        <TouchableOpacity 
          style={styles.plusButton} 
          onPress={() => animation("addLead")}
        >
          <SvgIcon icon="Round_Btn_Default_Dark" width='70px' height='70px' />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.pinKeyButton}
          onPress={() => animation("marker")}
        >
          <SlidUpArrow />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const perWidth = setWidthBreakpoints(breakPoint);

const styles = EStyleSheet.create(parse({
  container: {
    position: 'relative',
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: BG_COLOR,
  },
  map: {
    flexGrow: 1
  },
  plusButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
  },
  pinKeyButton: {
    position: 'absolute',
    right: perWidth('auto', 9),
    left: perWidth(9, 'auto'),
    bottom: perWidth(40, 10),
    padding: 5
  },
  slidUpArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2
  },
  slidUpArrowText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    marginRight: 8,
  },
  pinKey: {
    width: 80,
    height: 18,
  },
  transitionView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG_COLOR,
    elevation: 2,
    zIndex: 2,
    padding: 10,
  },
  searchBox: {
    position: perWidth('absolute', 'relative'),
    width: '100%',
    padding: 10,
    zIndex: 1,
    elevation: 1
  },
  searchInput: {
    paddingLeft: 36,
    paddingRight: 50,
    color: '#5d5d5d',
    fontSize: 12,
    backgroundColor: '#fff',
    borderRadius: 7,
    fontFamily: 'Gilroy-Medium',
    height: 45,
  },
  searchIcon: {
    position: 'absolute',
    top: 24,
    left: 20,
  },
  filterImageButton: {
    position: 'absolute',
    top: 18,
    right: 20,
  },
  markerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  markerBox: {
    width: perWidth('30%', '45%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  markerIcon: {
    marginRight: 10
  },
  markerText: {
    fontSize: 12,
    color: TEXT_COLOR,
    fontFamily: 'Gilroy-Medium'
  },
  goToAddLead: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: '#fff',
    borderColor: PRIMARY_COLOR,
    borderRadius: 4,
    borderWidth: 1,
    padding: 2
  },
  goToAddLeadText: {
    color: PRIMARY_COLOR
  },
}));
