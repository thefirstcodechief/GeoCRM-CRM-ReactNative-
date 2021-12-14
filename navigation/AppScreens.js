import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StatusBar, Animated, Easing, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import SignIn from '../screens/SignIn';
import BottomTabNavigator from '../components/BottomTabNavigator';
import Profile from '../components/Profile';
import More from '../components/More';
import { PRIMARY_COLOR } from '../constants/Colors';
import { grayBackground } from '../constants/Styles';
import { CHANGE_PROFILE_STATUS, CHANGE_MORE_STATUS } from '../actions/actionTypes';

const Stack = createNativeStackNavigator();

export default function AppScreens() {
  const dispatch = useDispatch();
  const showProfile = useSelector(state => state.rep.showProfile);
  const showMoreScreen = useSelector(state => state.rep.showMoreScreen);
  const statusLogin = useSelector(state => state.rep.statusLogin);

  useEffect(() => {
    moreStartAnimation(showMoreScreen);
    profileStartAnimation(showProfile);
  });

  const moreRef = useRef(null);
  const profileRef = useRef(null);

  const moreAnimatedValue = useRef(new Animated.Value(1)).current;
  const profileAnimatedValue = useRef(new Animated.Value(1)).current;

  const moreStartAnimation = (toValue) => {
    Animated.timing(moreAnimatedValue, {
      toValue,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  const profileStartAnimation = (toValue) => {
    Animated.timing(profileAnimatedValue, {
      toValue,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const moreTranslateX = moreAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').width + 100],
    extrapolate: 'clamp',
  });
  const profileTranslateX = profileAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Dimensions.get('window').width - 100],
    extrapolate: 'clamp',
  });
  if (!statusLogin) {
    return (
      <SignIn />
    )
  }
  return (
    <SafeAreaView style={styles.container}>

      {(showProfile == 0 || showMoreScreen == 0) && <TouchableOpacity
        activeOpacity={1} 
        style={grayBackground}
        onPress={() => {
          dispatch({type: CHANGE_PROFILE_STATUS, payload: 1});
          dispatch({type: CHANGE_MORE_STATUS, payload: 1});
        }}
      >
      </TouchableOpacity>}

      <Animated.View
        ref={profileRef}
        style={[styles.transitionView, { transform: [{ translateX: profileTranslateX }], left: 0 }]}
      >
        <Profile />
      </Animated.View>
      
      <Animated.View
        ref={moreRef}
        style={[styles.transitionView, { transform: [{ translateX: moreTranslateX }], right: 0 }]}
      >
        <More />
      </Animated.View>

      <StatusBar translucent backgroundColor={PRIMARY_COLOR} />
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: PRIMARY_COLOR,
          }
        }}
      >
        <Stack.Screen 
          name="Root" 
          component={BottomTabNavigator}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  transitionView: {
    position: 'absolute',
    top: 0,
    width: '90%',
    height: '100%',
    zIndex: 2,
    elevation: 2,
  }
})