
import { View } from 'react-native'
import React , {useEffect, useState , useRef} from 'react'
import { Constants } from '../../../../../constants';
import SimScanView from '../components/SimScanView';

export default function SimScanContainer(props) {
    
    const addData = (value) => {
        console.log("add data" , value)
        props.onButtonAction({type: Constants.actionType.ACTION_CAPTURE, value: value});
    }

    return (
        <View style={{alignSelf:'stretch' , flex:1}}>
            <SimScanView                 
                onButtonAction={addData}                
                {...props}
            />
        </View>
    )
}