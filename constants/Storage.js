
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
export const storeUserData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@user', jsonValue)
    } catch (e) {      
      console.log("error", e);
    }
}

export const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
}

export const setToken = async (value) => {
    try {
      await AsyncStorage.setItem('@token', String(value))
    } catch (e) {
      // saving error
    }
}

export const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token')
      if(value !== null) {
          return value;        
      }
    } catch(e) {
        return null;      
    }
}

export const getBaseUrl = async () => {  
  try{
    var token = await getToken();  
    var data = token != null ? jwt_decode(token) : null;
    var base_url =  data.user_scopes.geo_rep.base_url;
    return base_url;
  }catch(e) {
    console.log(e);
    return null;
  }  
}

export const getUserId = async () => {  
  try{
    var token = await getToken();  
    var data = token != null ? jwt_decode(token) : null;
    var base_url =  data.user_scopes.geo_rep.user_id;
    return base_url;
  }catch(e) {
    console.log(e);
    return null;
  }
}

export const getOpenReplaceCheckin = async () => {  
  try{
    var token = await getToken();  
    var data = token != null ? jwt_decode(token) : null;
    var features =  data.user_scopes.geo_rep.features;
    if(features !== undefined){
      return features.includes("open_replace_checkin") ;    
    }else{
      return false;
    }
  }catch(e) {
    console.log(e);
    return false;
  }  
}

export const getCalendarAdd = async () => {  
  try{
    var token = await getToken();  
    var data = token != null ? jwt_decode(token) : null;
    var features =  data.user_scopes.geo_rep.features; 
    if( features !== undefined){
      return features.includes("calendar_add") ;    
    }else{
      return false;
    }    
  }catch(e) {
    console.log(e);
    return false;
  }  
}

export const getCalendarOptimize = async () => {  
  try{
    var token = await getToken();  
    var data = token != null ? jwt_decode(token) : null;
    var features =  data.user_scopes.geo_rep.features;    
    console.log("my features", features);
    if(features !== undefined){
      var res =  features.includes("calendar_optimize") ;        
      return res;
    }else{
      return false;
    }      
  }catch(e) {
    console.log(e);
    return false;
  }
}


export const storeFilterData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@filter', jsonValue)
  } catch (e) {      
    console.log("error", e);
  }
}
export const clearFilterData = async () => {
  try {
    let value = {
      stage_id : [],
      outcome_id : [],
      dispositions : [],
      customs : []
    };
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@filter', jsonValue)
  } catch (e) {      
    console.log("error", e);
  }
}

export const getFilterData = async () => {
  try {
    let initialParam = {
      stage_id : [],
      outcome_id : [],
      dispositions : [],
      customs : []
    };
    const jsonValue = await AsyncStorage.getItem('@filter')
    return jsonValue != null && jsonValue !== '' ? JSON.parse(jsonValue) : initialParam;
  } catch(e) {
    // error reading value
  }
}


export const storeCurrentDate = async (value) => {
  try {
    await AsyncStorage.setItem('@current_date', String(value))
  } catch (e) {
    // saving error
  }
}

export const getCurrentDate = async () => {
  try {
    const value = await AsyncStorage.getItem('@current_date')
    if(value !== null) {
        return value;        
    }
  } catch(e) {
      return null;      
  }
}

export const storeLocationLoop = async(value) => {
  try {

    var date = new Date().getDate();
    var month = new Date().getMonth();
    await storeCurrentDate(month.toString() + date.toString());

    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@location_loop', jsonValue)
  } catch (e) {      
    console.log("error", e);
  }
}

export const getLocationLoop = async() => {
  try{
    let initialVal = [];
    const jsonValue = await AsyncStorage.getItem('@location_loop')
    return jsonValue != null && jsonValue !== '' ? JSON.parse(jsonValue) : initialVal;
  }catch(e){

  }
}