import React, { Fragment, useState, useEffect ,useRef} from 'react';
import { SafeAreaView, Text, TextInput, View, TouchableOpacity, Dimensions, BackHandler , Image, Platform } from 'react-native';
import { Provider } from 'react-native-paper';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setWidthBreakpoints, parse } from 'react-native-extended-stylesheet-breakpoints';
import { useSelector, useDispatch } from 'react-redux';
import MapView , { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import AddLead from './popup/AddLead';
import FilterView from '../../../components/FilterView';
import SvgIcon from '../../../components/SvgIcon';
import GrayBackground from '../../../components/GrayBackground';
import Colors, { PRIMARY_COLOR, BG_COLOR, TEXT_COLOR, DISABLED_COLOR } from '../../../constants/Colors';
import { boxShadow, style } from '../../../constants/Styles';
import { breakPoint } from '../../../constants/Breakpoint';
import {  LOCATION_LOOP_LISTS, SLIDE_STATUS } from '../../../actions/actionTypes';
import { getLocationPinKey, getLocationFilters, getLocationSearchList, getLocationInfo, getLocationsMap } from '../../../actions/location.action';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import { MarkerView } from './partial/MarkerView';
import MarkerIcon from '../../../components/Marker';
import ClusteredMapView from './components/ClusteredMapView'
import { LocationInfoDetails } from './locationInfoDetails/LocationInfoDetails';
import { getDistance } from '../../../constants/Consts';
import LoadingView from '../../../components/LoadingView/LoadingView';

const SlidUpArrow = () => (
  <View style={styles.slidUpArrow}>
    <Text style={styles.slidUpArrowText}>Pin Key</Text>
    <FontAwesomeIcon size={12} icon={faChevronUp} color={PRIMARY_COLOR} />
  </View>
)

export default function LocationScreen(props) {

  const navigation = props.navigation;
  const crmStatus = useSelector(state => state.rep.crmSlideStatus);
  const locationMaps = useSelector(state => state.location.locationMaps);
  const currentLocation = useSelector(state => state.rep.currentLocation);
  const filterParmeterChanged = useSelector(state => state.selection.mapFilters);
  const dispatch = useDispatch();
  const [showItem, setShowItem] = useState(0);
  const [locationInfo, setLocationInfo] = useState();  
  const [isRequest, setIsRequest] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const map = useRef(null)
  const [pageType, setPageType ] = useState({name:"search-lists"});
  const [isLoading , setIsLoading] = useState(false);

  useEffect(() => {
    props.screenProps.setOptions({           
      headerTitle:() =>{
        return(<TouchableOpacity                     
           onPress={
          () =>{
            dispatch({type: SLIDE_STATUS, payload: false});
            setIsBack(false);            
            if(navigation.canGoBack()){              
              navigation.goBack();              
            }
          }}>            
          <View style={style.headerTitleContainerStyle}>            
              {
                isBack &&
                <Image
                  resizeMethod='resize'  
                  style={{width:15,height:20, marginRight:5}}
                  source={Images.backIcon}
                />
              }
            <Text style={style.headerTitle} >CRM</Text>
        </View></TouchableOpacity>)
      },

      headerLeft: () => (
        <TouchableOpacity 
          style={style.headerLeftStyle} 
          activeOpacity={1}
          onPress={() => {
            dispatch({type: SLIDE_STATUS, payload: false});
            setIsBack(false);            
            if(navigation.canGoBack()){              
              navigation.goBack();              
            }
          }}
        >
        </TouchableOpacity>
      ),      
      tabBarStyle: {
        position: 'absolute',
        height: 50,      
        paddingBottom: Platform.OS == "android" ? 5 : 0,          
        backgroundColor: Colors.whiteColor,
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

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, [crmStatus]);

  useEffect(() => {      

    setIsBack(false);    
    if(locationMaps.length > 0){
      let items = [];    
      locationMaps.map((list, key) => {        
        let item = {
          name: list.location_name.value !== "" ? list.location_name.value : "Location",
          address: '',
          distance: getDistance(list.coordinates, currentLocation).toFixed(2),
          status: '',
          location_id: list.location_id,
          status_text_color:list.pin_image
        }
        items.push(item);        
      });
      items.sort((a, b) => a.distance > b.distance ? 1 : -1);    
      console.log("loopList updated in map page");
      dispatch({type: LOCATION_LOOP_LISTS, payload:[...items]})
      //console.log("location map" , locationMaps);
    }      
  }, [locationMaps]);
  
  useEffect(() => {    
    dispatch(getLocationsMap());  
  }, [filterParmeterChanged]);  

  const handleBackButtonClick = () => {
    if (crmStatus) {
      dispatch({type: SLIDE_STATUS, payload: false});
      return true;
    }
    props.navigation.goBack();
    return true;
  }

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
        setIsBack(true);
        return;
      case "locationInfo":
        setShowItem(4);
        setIsBack(true);        
        return;
      default:
        return;
    }
  }
  

  return (
    <Provider>
      <SafeAreaView style={{flex:1}}>

        <LoadingView visible={isRequest}></LoadingView>

        <GrayBackground />        
        {
          crmStatus && (showItem == 1 || showItem == 2) && 
          <View style={[styles.transitionView, showItem == 0 ? { transform: [{ translateY: Dimensions.get('window').height + 100 }] } : { transform: [{ translateY: 0 }] } ]} >
            {showItem == 1 && <MarkerView isRequest={isRequest} />}
            {showItem == 2 && 
            <FilterView navigation={props.navigation} page={"map"} onClose={() =>{
              setShowItem(0);
              dispatch({type: SLIDE_STATUS, payload: false});
            }} />
            }
          </View>
        }
        
        {crmStatus && (showItem == 3 || showItem == 4) && <View
          style={[styles.transitionView, { top: 0 }, showItem == 0 ? { transform: [{ translateY: Dimensions.get('window').height + 100 }] } : { transform: [{ translateY: 0 }] } ]}
        >
          {showItem == 3 && <AddLead screenProps={props.screenProps} onClose={() => {
            setIsBack(false);
            dispatch(getLocationsMap());
            dispatch({type: SLIDE_STATUS, payload: false});
            }} />}
          {showItem == 4 && <LocationInfoDetails navigation={props.navigation} screenProps={props.screenProps}  locInfo={locationInfo} pageType={pageType} />}
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

            <FontAwesomeIcon style={styles.searchIcon} size={16} color={DISABLED_COLOR} icon={ faSearch } />
              <TouchableOpacity style={styles.filterImageButton} onPress={() => {
                dispatch(getLocationFilters());         
                animation("filter");
              }}>
              <SvgIcon icon="Filter" width="30px" height="30px" />
            </TouchableOpacity>
          </View>
       


          

 
            {
              currentLocation.latitude !== undefined && currentLocation.longitude !== undefined &&
              <View style={styles.mapContainer}>
                    <ClusteredMapView
                      clusterColor="red"
                      ref={map}
                      //mapType="hybrid"
                      clusteringEnabled={true}
                      style={styles.mapView}
                      initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.015,
                      }}                      
                      currentLocation={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                      }}
                      
                      >
                      {locationMaps.map((item , key) => (
                        <Marker
                          key={key}
                          onPress={() =>{                            
                            setIsRequest(true);
                            getLocationInfo( Number(item.location_id))
                            .then((res) => {                              
                              setLocationInfo(res);                                      
                              animation("locationInfo");
                              setIsRequest(false);
                            })
                            .catch((e) =>{
                              setIsRequest(false);
                            })      
                          }}
                          coordinate={{
                            latitude: Number(item.coordinates.latitude),
                            longitude: Number(item.coordinates.longitude),
                          }}                
                        >
                          <MarkerIcon style={styles.markerIcon} icon={item.pin_image} width="34px" height="34px" />
                        </Marker>

                      ))}
                        
                        <MapView.Circle
                          center = {{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude
                          }}
                          radius = { 200 }
                          strokeWidth = { 1 }
                          strokeColor = {PRIMARY_COLOR}
                          fillColor = { 'rgba(230,238,255,0.5)' }
                        />
                        
                    </ClusteredMapView> 
                    
                    {/* <MapZoomPanel
                      onZoomIn={() => {
                        mapZoomIn()
                      }}
                      onZoomOut={() => {
                        mapZoomOut()
                      }}
                    /> */}
              </View>
            }
                                        
            <TouchableOpacity
              style={styles.plusButton} 
              onPress={() => {                
                animation("addLead");
              }}>
              <SvgIcon icon="Round_Btn_Default_Dark" width='70px' height='70px' />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pinKeyButton}
              onPress={() => {                
                dispatch(getLocationPinKey());
                animation("marker");
              }}>
              <SlidUpArrow />
            </TouchableOpacity>


        </View>
      </SafeAreaView>
    </Provider>
  )
}

const perWidth = setWidthBreakpoints(breakPoint);

const styles = EStyleSheet.create(parse({
  container: {
    flex:1,
    justifyContent: 'space-between',
    backgroundColor: BG_COLOR,        
    paddingBottom: Platform.OS == "android" ? 50 : 50,    
  },
  map: {
    flexGrow: 1,
    height:Dimensions.get("screen").height - 150,    
  },
  plusButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
  },
  pinKeyButton: {
    position: 'absolute',
    right: perWidth('auto', 9),
    left: perWidth(9, 'auto'),
    bottom: perWidth(100, 70),
    padding: 5
  },
  slidUpArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    backgroundColor: Colors.whiteColor,
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2
  },
  slidUpArrowText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontFamily: Fonts.secondaryMedium,
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
    padding: 0,
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
    backgroundColor: Colors.whiteColor,
    borderRadius: 7,
    fontFamily: Fonts.secondaryMedium,
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
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: { flex: 1, width: '100%', height: '100%' },
    
}));
