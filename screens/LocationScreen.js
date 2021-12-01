import React, { Fragment, useState, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated,
  Easing,
  ScrollView,
  Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import OutsideView from 'react-native-detect-press-outside';
import { Button, Title } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import SearchResult from '../components/SearchResult';
import FilterButton from '../components/FilterButton';
import Divider from '../components/Divider';
import { PRIMARY_COLOR, BG_COLOR } from '../constants/Colors';
import { SLIDE_STATUS } from '../actions/actionTypes';

const markers = [
  {
    path: require('../assets/images/map-marker/Purple_X.png'),
    text: 'Invalid Lead / Vacant'
  },
  {
    path: require('../assets/images/map-marker/Red_X.png'),
    text: 'DNK Request'
  },
  {
    path: require('../assets/images/map-marker/Red_Star.png'),
    text: 'No Contant - DM (F)'
  },
  {
    path: require('../assets/images/map-marker/Red_Triangle.png'),
    text: 'No Access - Final'
  },
  {
    path: require('../assets/images/map-marker/Grey_Triangle.png'),
    text: 'Not Interested'
  },
  {
    path: require('../assets/images/map-marker/Gold_Star.png'),
    text: 'Closed Won'
  },
  {
    path: require('../assets/images/map-marker/Green_Star.png'),
    text: 'Re-loop'
  },
  {
    path: require('../assets/images/map-marker/Orange_Star.png'),
    text: 'Priority Re-loop'
  },
  {
    path: require('../assets/images/map-marker/Turquoise.png'),
    text: 'Language Barrier'
  }
];

const filterButtonList = [
  "Campaign",
  "Lead Bucket",
  "Stage",
  "Outcome",
  "Outcome Modified Date",
  "Lead Status"
]

const MarkerView = () => (
  <Fragment>
    <Divider style={{marginBottom: 20}} />
    <View style={styles.markerContent}>
      {markers.map((marker, key) => (
        <View style={styles.markerBox} key={key}>
          <Image style={styles.markerImage} source={marker.path} />
          <Text style={styles.markerText}>{marker.text}</Text>
        </View>
      ))}
    </View>
  </Fragment>
);

const FilterView = () => {
  return (
    <ScrollView style={{maxHeight: 420, backgroundColor: '#F9F9F9'}}>
      <Divider style={{marginBottom: 20}} />
      <View style={styles.filterHeader}>
        <Title style={{fontFamily: 'Product Sans-Bold'}}>Filter your search</Title>
        <Button 
          labelStyle={{
            fontFamily: 'Product Sans-Regular', 
            letterSpacing: 0.2
          }}
          color="#DC143C" 
          uppercase={false} 
          onPress={() => console.log('Pressed')}
        >
          Clear Filters
        </Button>
      </View>
      {filterButtonList.map((list, key) => (
        <FilterButton text={list} key={key} />
      ))}
      <Button 
        mode="contained" 
        color={PRIMARY_COLOR} 
        uppercase={false} 
        labelStyle={{
          fontSize: 18, 
          fontFamily: 'Gilroy-Bold', 
          letterSpacing: 0.2
        }} 
        onPress={() => console.log("pressed")}>
        Apply Filters
      </Button>
    </ScrollView>
  )
}

const SlidUpArrow = () => (
  <View style={styles.slidUpArrow}>
    <Text style={styles.slidUpArrowText}>Pin Key</Text>
    <FontAwesomeIcon size={12} icon={faChevronUp} color={PRIMARY_COLOR} />
  </View>
)

export default function LocationScreen(props) {
  const crmStatus = useSelector(state => state.crm);
  const dispatch = useDispatch();

  const markerRef = useRef(null);
  const filterRef = useRef(null);
  const searchResultRef = useRef(null);

  useEffect(() => {
    console.log(crmStatus.crmSlideStatus)
    props.screenProps.setOptions({
      tabBarStyle: {
        display: 'flex',
        height: 60,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#fff",
      },
    });
  });

  const markerAnimatedValue = useRef(new Animated.Value(1)).current;
  const filterAnimatedValue = useRef(new Animated.Value(1)).current;
  const searchResultAnimatedValue = useRef(new Animated.Value(1)).current;

  const markerStartAnimation = (toValue) => {
    Animated.timing(markerAnimatedValue, {
      toValue,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const filterStartAnimation = (toValue) => {
    Animated.timing(filterAnimatedValue, {
      toValue,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const searchResultStartAnimation = (toValue) => {
    Animated.timing(searchResultAnimatedValue, {
      toValue,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const markerTranslateY = markerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
    extrapolate: 'clamp',
  });

  const filterTranslateY = filterAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 550],
    extrapolate: 'clamp',
  });

  const searchResultTranslateY = searchResultAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').height],
    extrapolate: 'clamp',
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
      path: require('../assets/images/map-marker/Green_Star.png')
    },
    {
      latlng: {
        latitude: -33.891248,
        longitude: 18.510959
      },
      path: require('../assets/images/map-marker/Red_Triangle.png')
    },
    {
      latlng: {
        latitude: -33.888103,
        longitude: 18.501482
      },
      path: require('../assets/images/map-marker/Purple_X.png')
    }
  ])
  
  return (
    <SafeAreaView>
      <OutsideView
        childRef={filterRef}
        onPressOutside={() => {
          markerStartAnimation(1);
          filterStartAnimation(1);
          dispatch({ type: SLIDE_STATUS, payload: false });
        }}>
        <View style={styles.container}>
          <Animated.View
            ref={markerRef}
            style={[styles.transitionView, { transform: [{ translateY: markerTranslateY }] }]}
          >
            {crmStatus.crmSlideStatus && <MarkerView />}
          </Animated.View>
          <Animated.View
            ref={filterRef}
            style={[styles.transitionView, { transform: [{ translateY: filterTranslateY }] }]}
          >
            {crmStatus.crmSlideStatus && <FilterView />}
          </Animated.View>
          <Animated.View
            ref={searchResultRef}
            style={[styles.transitionView, { transform: [{ translateY: searchResultTranslateY }] }]}
          >
            {crmStatus.crmSlideStatus && <SearchResult 
              navigation={props.navigation} 
              onClose={() => { 
                searchResultStartAnimation(1); 
                dispatch({ type: SLIDE_STATUS, payload: false });
              }}
            />}
          </Animated.View>
          <View style={styles.autoCompleteBox}>
            <Text>{crmStatus.crmSlideStatus}</Text>
            <GooglePlacesAutocomplete
              styles={{
                textInput: {
                  paddingLeft: 36,
                  paddingRight: 50,
                  color: '#5d5d5d',
                  fontSize: 12,
                  backgroundColor: '#fff',
                  fontFamily: 'Gilroy-Medium',
                  shadowColor: '#808080',
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 1,
                  elevation: 1,
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
              placeholder='Search.....'
              onPress={(data, details = null) => {
                console.log(data, details);
              }}
              textInputProps={{
                onChange: () => { 
                  searchResultStartAnimation(0); 
                  dispatch({type: SLIDE_STATUS, payload: true});  
                }
              }}
              query={{
                key: 'AIzaSyA36_9T7faYSK-w84OhxTe9CIbx4THru3o',
                language: 'en',
              }}
            />
            <FontAwesomeIcon style={styles.searchIcon} size={16} color="#9D9FA2" icon={ faSearch } />
            <TouchableOpacity style={styles.filterImageButton} onPress={() => {
              filterStartAnimation(0);
              markerStartAnimation(1);
              dispatch({type: SLIDE_STATUS, payload: true});
            }}>
              <Image style={styles.filterImage} source={require('../assets/images/Filter.png')} />
            </TouchableOpacity>
          </View>
          <MapView
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
                onPress={() => props.navigation.navigate('LocationInfo')}
              >
                <Image style={{width: 24, height: 30}} source={marker.path}/>
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
          <TouchableOpacity style={styles.plusButton} onPress={() => props.navigation.navigate("AddLead")}>
            <Image style={styles.plusButtonImage} source={require("../assets/images/Round_Btn_Default_Dark.png")}/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.pinKeyButton}
            onPress={() => {
              markerStartAnimation(0);
              filterStartAnimation(1);
              dispatch({type: SLIDE_STATUS, payload: true});
            }}
          >
            <SlidUpArrow />
          </TouchableOpacity>
        </View>
      </OutsideView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    display: 'flex',
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
  plusButtonImage: {
    width: 70,
    height: 70
  },
  pinKeyButton: {
    position: 'absolute',
    right: 9,
    bottom: 10,
    padding: 5
  },
  slidUpArrow: {
    display: 'flex',
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
    backgroundColor: '#F9F9F9',
    elevation: 2,
    zIndex: 2,
    padding: 10,
  },
  autoCompleteBox: {
    position: 'relative',
    padding: 10,
    height: 66,
  },
  searchIcon: {
    position: 'absolute',
    top: 24,
    left: 20,
    elevation: 1
  },
  filterImageButton: {
    position: 'absolute',
    top: 18,
    right: 20,
    zIndex: 10,
    elevation: 1
  },
  filterImage: {
    width: 30,
    height: 30,
    zIndex: 10,
  },
  markerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  markerBox: {
    width: '45%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  markerImage: {
    width: 18,
    height: 26,
    marginRight: 10
  },
  markerText: {
    fontSize: 12,
    color: '#23282D',
    fontFamily: 'Gilroy-Medium'
  },
  filterHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
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
});
