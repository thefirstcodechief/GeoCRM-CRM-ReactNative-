import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Fragment, useState, useEffect } from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import { useDispatch, useSelector } from 'react-redux';
import GetLocation from 'react-native-get-location';

import HomeScreen from '../screens/GeoRep/HomeScreen';
import CRMScreen from '../screens/GeoRep/CRMScreen';
import CalendarScreen from '../screens/GeoRep/CalendarScreen';
import RepFormsScreen from '../screens/GeoRep/FormsScreen';
import RepContentLibraryScreen from '../screens/GeoRep/ContentLibraryScreen';
import ProductSalesScreen from '../screens/GeoRep/ProductSalesScreen';
import NotificationsScreen from '../screens/GeoRep/NotificationsScreen';
import RepWebLinksScreen from '../screens/GeoRep/WebLinksScreen';
import RepMessagesScreen from '../screens/GeoRep/MessagesScreen';
import OfflineSyncScreen from '../screens/GeoRep/OfflineSyncScreen';
import RecordedSalesScreen from '../screens/GeoRep/RecordedSalesScreen';
import RepSalesPipelineScreen from '../screens/GeoRep/SalesPipelineScreen';

import CRMContentLibraryScreen from '../screens/GeoCRM/ContentLibraryScreen';
import CRMLocationsScreen from '../screens/GeoCRM/CRMLocationsScreen';
import CRMSalesPipelineScreen from '../screens/GeoCRM/SalesPipelineScreen';

import HomeLifeScreen from '../screens/GeoLife/HomeLifeScreen';
import NewsScreen from '../screens/GeoLife/NewsScreen';
import LocationsLifeScreen from '../screens/GeoLife/LocationsLifeScreen';
import CheckInScreen from '../screens/GeoLife/CheckInScreen';
import AccessScreen from '../screens/GeoLife/AccessScreen';
import ClubScreen from '../screens/GeoLife/ClubScreen';
import FlashbookScreen from '../screens/GeoLife/FlashbookScreen';
import BusinessDirectoryScreen from '../screens/GeoLife/BusinessDirectoryScreen';
import LifeContentLibraryScreen from '../screens/GeoLife/ContentLibraryScreen';
import LifeFormsScreen from '../screens/GeoLife/FormsScreen';
import LoyaltyCardsScreen from '../screens/GeoLife/LoyaltyCardsScreen';
import LunchOrdersScreen from '../screens/GeoLife/LunchOrdersScreen';
import LifeMessagesScreen from '../screens/GeoLife/MessagesScreen';
import ReportFraudScreen from '../screens/GeoLife/ReportFraudScreen';
import LifeWebLinksScreen from '../screens/GeoLife/WebLinksScreen';
import WellBeingScreen from '../screens/GeoLife/WellBeingScreen';

import MoreNavigator from './MoreNavigator';

import SvgIcon from './SvgIcon';
import { PRIMARY_COLOR } from '../constants/Colors';
import { 
  SLIDE_STATUS,
  CHANGE_MORE_STATUS,
  CHANGE_PROFILE_STATUS,
  SHOW_MORE_COMPONENT,
  CHANGE_LIBRARY_CHILD_STATUS,
} from '../actions/actionTypes';
import { getLocationsMap, getLocationInfo } from '../actions/location.action';

import {
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  View,
  Text
} from 'react-native'

const BottomTab = createBottomTabNavigator();

export default function RepBottomTabNavigator({navigation}) {
  const dispatch = useDispatch();
  const payload = useSelector(state => state.selection.payload);
  const selectProject = useSelector(state => state.selection.selectProject);
  const visibleMore = useSelector(state => state.rep.visibleMore);

  const [ bottomListOne, setBottomListOne ] = useState([]);
  const [ bottomListTwo, setBottomListTwo ] = useState([]);
  const [ bottomListThree, setBottomListThree ] = useState([]);

  useEffect(() => {
    if (payload.user_scopes.geo_rep) {
      setBottomListOne([
        payload.user_scopes.geo_rep.modules_nav_order[0],
        payload.user_scopes.geo_rep.modules_nav_order[1],
        payload.user_scopes.geo_rep.modules_nav_order[2],
        payload.user_scopes.geo_rep.modules_nav_order[3]
      ]);
    }
    if (payload.user_scopes.geo_life) {
      setBottomListTwo([
        payload.user_scopes.geo_life.modules_nav_order[0],
        payload.user_scopes.geo_life.modules_nav_order[1],
        payload.user_scopes.geo_life.modules_nav_order[2],
        payload.user_scopes.geo_life.modules_nav_order[3]
      ]);
    }
    if (payload.user_scopes.geo_crm) {
      setBottomListThree([
        payload.user_scopes.geo_crm.modules_nav_order[0],
        payload.user_scopes.geo_crm.modules_nav_order[1],
        payload.user_scopes.geo_crm.modules_nav_order[2],
        payload.user_scopes.geo_crm.modules_nav_order[3]
      ])
    }
  }, [payload]);

  useEffect(() => {
    navigation.navigate('Root', { screen: 'Home' });
    if (selectProject == 'geo_rep') {
      switch(payload.user_scopes.geo_rep.modules_nav_order[0]) {
        case 'home_geo':
          navigation.navigate('Root', { screen: 'Home' });
          return;
        case 'crm_locations':
          navigation.navigate('Root', { screen: 'CRM' });
          return;
        case 'web_links':
          navigation.navigate('Root', { screen: 'RepWebLinks' });
          return;
        case 'calendar':
          navigation.navigate('Root', { screen: 'Calendar' });
          return;
        case 'forms':
          navigation.navigate('Root', { screen: 'RepForms' });
          return;
        case 'content_library':
          navigation.navigate('Root', { screen: 'RepContentLibrary' });
          return;
        case 'product_sales':
          navigation.navigate('Root', { screen: 'ProductSales' });
          return;
        case 'notifications':
          navigation.navigate('Root', { screen: 'Notifications' });
          return;
        case 'messages':
          navigation.navigate('Root', { screen: 'RepMessages' });
          return;
        case 'offline_sync':
          navigation.navigate('Root', { screen: 'OfflineSync' });
          return;
        case 'recorded_sales':
          navigation.navigate('Root', { screen: 'RecordedSales' });
          return;
        case 'sales_pipeline':
          navigation.navigate('Root', { screen: 'RepSalesPipeline' });
          return;
      }
    } else if (selectProject == 'geo_life') {
      switch(payload.user_scopes.geo_life.modules_nav_order[0]) {
        case 'home_life':
          navigation.navigate('Root', { screen: 'HomeLife' });
          return;
        case 'news':
          navigation.navigate('Root', { screen: 'News' });
          return;
        case 'locations_life':
          navigation.navigate('Root', { screen: 'LocationsLife' });
          return;
        case 'check_in':
          navigation.navigate('Root', { screen: 'CheckIn' });
          return;
        case 'access':
          navigation.navigate('Root', { screen: 'Access' });
          return;
        case 'club':
          navigation.navigate('Root', { screen: 'Club' });
          return;
        case 'flashbook':
          navigation.navigate('Root', { screen: 'Flashbook' });
          return;
        case 'business_directory':
          navigation.navigate('Root', { screen: 'BusinessDirectory' });
          return;
        case 'content_library':
          navigation.navigate('Root', { screen: 'LifeContentLibrary' });
          return;
        case 'forms':
          navigation.navigate('Root', { screen: 'LifeForms' });
          return;
        case 'loyalty_cards':
          navigation.navigate('Root', { screen: 'LoyaltyCards' });
          return;
        case 'lunch_orders':
          navigation.navigate('Root', { screen: 'LunchOrdersScreen' });
          return;
        case 'messages':
          navigation.navigate('Root', { screen: 'LifeMessagesScreen' });
          return;
        case 'report_fraud':
          navigation.navigate('Root', { screen: 'ReportFraudScreen' });
          return;
        case 'web_links':
          navigation.navigate('Root', { screen: 'LifeWebLinksScreen' });
          return;
        case 'well_being':
          navigation.navigate('Root', { screen: 'WellBeingScreen' });
          return;
      }
    } else if (selectProject == 'geo_crm') {
      switch(payload.user_scopes.geo_crm.modules_nav_order[0]) {
        case 'crm_locations':
          navigation.navigate('Root', { screen: 'CRMLocations' });
          return;
        case 'sales_pipeline':
          navigation.navigate('Root', { screen: 'CRMSalesPipeline' });
          return;
        case 'content_library':
          navigation.navigate('Root', { screen: 'CRMContentLibrary' });
          return;
      }
    }
  }, [bottomListOne, bottomListTwo, bottomListThree]);

  useEffect(() => {
    if (visibleMore != '') {
      navigation.navigate("More");
      setTimeout(() => {
        dispatch({type: SHOW_MORE_COMPONENT, payload: ''});
      });
    }
  }, [visibleMore]);

  useEffect(() => {
    dispatch(getLocationsMap());
    dispatch(getLocationInfo(1005));
  }, [])

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarHideOnKeyboard: true,
        headerStyle: {
          backgroundColor: PRIMARY_COLOR,
        },
        tabBarShowLabel: true,
        headerTitleStyle:  {
          color: "#fff",
          fontFamily: 'Product Sans-Regular'
        },
        tabBarIconStyle: {
          color: "#fff",
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          paddingTop: 10,
          paddingBottom: 10,
        }
      }}>

      {/* Rep Bottom Navigator */}

      {selectProject == 'geo_rep' && bottomListOne.includes('home_geo') && <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Home_Black_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Home_Black" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('crm_locations') && <BottomTab.Screen
        name="CRM"
        component={CRMScreen}
        options={{
          title: 'CRM',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Location_Arrow_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Location_Arrow" width='20px' height='20px' />}
            </Fragment>
          ),
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.header} 
              activeOpacity={1}
              onPress={() => dispatch({type: SLIDE_STATUS, payload: false})}
            >
            </TouchableOpacity>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            dispatch({type: SLIDE_STATUS, payload: false});
            dispatch(getLocationsMap());
            navigation.navigate('CRM', { screen: 'Root' });
          },
        })}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('web_links') && <BottomTab.Screen
        name="RepWebLinks"
        component={RepWebLinksScreen}
        options={{
          title: 'Web Links',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Travel_Explore_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Travel_Explore" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('calendar') && <BottomTab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Calendar_Event_Fill_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Calendar_Event_Fill" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('forms') && <BottomTab.Screen
        name="RepForms"
        component={RepFormsScreen}
        options={{
          title: 'Forms',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('content_library') && <BottomTab.Screen
        name="RepContentLibrary"
        component={RepContentLibraryScreen}
        options={{
          title: 'Content Library',
          tabBarLabel: 'Content',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Ballot_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Ballot" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            dispatch({type: CHANGE_LIBRARY_CHILD_STATUS, payload: false});
            navigation.navigate("RepContentLibrary");
          },
        })}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('product_sales') && <BottomTab.Screen
        name="ProductSales"
        component={ProductSalesScreen}
        options={{
          title: 'Sales',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('notifications') && <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('messages') && <BottomTab.Screen
        name="RepMessages"
        component={RepMessagesScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('offline_sync') && <BottomTab.Screen
        name="OfflineSync"
        component={OfflineSyncScreen}
        options={{
          title: 'Offline Sync Items',
          tabBarLabel: 'Sync',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('recorded_sales') && <BottomTab.Screen
        name="RecordedSales"
        component={RecordedSalesScreen}
        options={{
          title: 'Recorded Sales',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_rep' && bottomListOne.includes('sales_pipeline') && <BottomTab.Screen
        name="RepSalesPipeline"
        component={RepSalesPipelineScreen}
        options={{
          title: 'Pipeline',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {/* Life Bottom Navigator */}

      {selectProject == 'geo_life' && bottomListTwo.includes('home_life') && <BottomTab.Screen
        name="HomeLife"
        component={HomeLifeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Home_Black_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Home_Black" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('news') && <BottomTab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: 'News',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Location_Arrow_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Location_Arrow" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('locations_life') && <BottomTab.Screen
        name="LocationsLife"
        component={LocationsLifeScreen}
        options={{
          title: 'Locations',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Calendar_Event_Fill_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Calendar_Event_Fill" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('check_in') && <BottomTab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          title: 'Check In',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('access') && <BottomTab.Screen
        name="Access"
        component={AccessScreen}
        options={{
          title: 'Access Control',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('club') && <BottomTab.Screen
        name="Club"
        component={ClubScreen}
        options={{
          title: 'Club',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('flashbook') && <BottomTab.Screen
        name="Flashbook"
        component={FlashbookScreen}
        options={{
          title: 'FlashBook',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('business_directory') && <BottomTab.Screen
        name="BusinessDirectory"
        component={BusinessDirectoryScreen}
        options={{
          title: 'Business Directory',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('content_library') && <BottomTab.Screen
        name="LifeContentLibrary"
        component={LifeContentLibraryScreen}
        options={{
          title: 'Content Library',
          tabBarLabel: 'Content',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Ballot_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Ballot" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            dispatch({type: CHANGE_LIBRARY_CHILD_STATUS, payload: false});
            navigation.navigate("LifeContentLibrary");
          },
        })}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('forms') && <BottomTab.Screen
        name="LifeForms"
        component={LifeFormsScreen}
        options={{
          title: 'Forms',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('loyalty_cards') && <BottomTab.Screen
        name="LoyaltyCards"
        component={LoyaltyCardsScreen}
        options={{
          title: 'Loyalty Cards',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('lunch_orders') && <BottomTab.Screen
        name="LunchOrdersScreen"
        component={LunchOrdersScreen}
        options={{
          title: 'Lunch Orders',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('messages') && <BottomTab.Screen
        name="LifeMessagesScreen"
        component={LifeMessagesScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('report_fraud') && <BottomTab.Screen
        name="ReportFraudScreen"
        component={ReportFraudScreen}
        options={{
          title: 'Report Fraud',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('web_links') && <BottomTab.Screen
        name="LifeWebLinksScreen"
        component={LifeWebLinksScreen}
        options={{
          title: 'Web Links',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Travel_Explore_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Travel_Explore" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_life' && bottomListTwo.includes('well_being') && <BottomTab.Screen
        name="WellBeingScreen"
        component={WellBeingScreen}
        options={{
          title: 'Well-being',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {/* CRM Bottom navigator */}

      {selectProject == 'geo_crm' && bottomListThree.includes('crm_locations') && <BottomTab.Screen
        name="CRMLocations"
        component={CRMLocationsScreen}
        options={{
          title: 'CRM',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Home_Black_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Home_Black" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_crm' && bottomListThree.includes('sales_pipeline') && <BottomTab.Screen
        name="CRMSalesPipeline"
        component={CRMSalesPipelineScreen}
        options={{
          title: 'Pipeline',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {selectProject == 'geo_crm' && bottomListThree.includes("content_library") && <BottomTab.Screen
        name="CRMContentLibrary"
        component={CRMContentLibraryScreen}
        options={{
          title: 'Content Library',
          tabBarLabel: 'Content',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Ballot_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Ballot" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />}

      {/* More Screen */}

      <BottomTab.Screen
        name="More"
        component={MoreNavigator}
        options={{
          title: 'More',
          tabBarLabel: 'More',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Android_More_Horizontal_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Android_More_Horizontal" width='20px' height='20px' />}
            </Fragment>
          ),
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.header} 
              activeOpacity={1}
              onPress={() => dispatch({type: SLIDE_STATUS, payload: false})}
            >
            </TouchableOpacity>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            dispatch({type: SLIDE_STATUS, payload: false});
            if (visibleMore != '') {
              navigation.navigate("More");
              dispatch({type: SHOW_MORE_COMPONENT, payload: ''});
            } else {
              dispatch({type: CHANGE_MORE_STATUS, payload: 0});   
            }
          },
        })}
      />
    </BottomTab.Navigator>
  );
}

function HeaderRightView() {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.auth.userInfo);

  const [toggleSwitch, setToggleSwitch] = useState(true);

  return (
    <View style={styles.headerRightView}>
      <ToggleSwitch
        style={styles.toggleSwitch}
        label={toggleSwitch ? "Online" : "Offline"}
        labelStyle={styles.toggleSwitchLabel}
        onColor="#fff"
        offColor="#a3c0f9"
        size="small"
        thumbOnStyle={{ backgroundColor: PRIMARY_COLOR }}
        thumbOffStyle={{ backgroundColor: PRIMARY_COLOR }}
        isOn={toggleSwitch}
        onToggle={toggleSwitch => {
          setToggleSwitch(toggleSwitch);
        }}
      />
      <TouchableOpacity style={styles.headerAvatar} onPress={() => dispatch({type: CHANGE_PROFILE_STATUS, payload: 0})}>
        <Text style={styles.headerAvatarText}>
          {userInfo.user_name.split(' ')[0] && userInfo.user_name.split(' ')[0][0].toUpperCase()}
          {userInfo.user_name.split(' ')[1] && userInfo.user_name.split(' ')[1][0].toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY_COLOR,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: '100%'
  },
  headerRightView: {
    flexDirection: 'row',
    marginRight: 12
  },
  toggleSwitch: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggleSwitchLabel: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium'
  },
  headerAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    width: 32,
    height: 32,
    borderRadius: 20
  },
  headerAvatarText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Gilroy-Bold'
  }
})