

import { View, Text ,FlatList } from 'react-native'
import React , {useState} from 'react'
import ProgressBar from '../../ProgressBar'
import CircularProgress from 'react-native-circular-progress-indicator';
import Colors, { whiteLabel } from '../../../../../../constants/Colors';
import { AppText } from '../../../../../../components/common/AppText';
import VisitCheckinItem from '../components/VisitCheckinItem';
import { ScrollView } from 'react-native-gesture-handler';
import Legend from '../../../../../../components/common/Legend';
import WeeklyBar from '../../../../../../components/common/WeeklyBar/WeeklyBar';

export default function WeeklyVisits(props) {

    const {week} = props;
    const barTypes = [
        {color:whiteLabel().graphs.primary, name:'Completed'} ,
        {color:whiteLabel().graphs.color_1, name:'Additional'} ,
        {color:whiteLabel().graphs.color_2, name:'Missed'}  ,
        {color:whiteLabel().graphs.color_3, name:'Remaining'}  ,        
    ];
    const colors = [whiteLabel().graphs.primary, whiteLabel().graphs.color_1 , whiteLabel().graphs.color_2, whiteLabel().graphs.color_3];

  return (
    <View style={{ flexDirection:'column' }}>
              
        <View style={{flexDirection:'row', alignItems:'center' ,  marginHorizontal:10}}>
            <View style={{marginBottom:10, flex:1 , marginRight:25}}>
                <ProgressBar colors={colors} steps={[ parseInt(week.completed) , parseInt(week.additional), parseInt(week.missed), parseInt(week.remaining)]} height={25} ></ProgressBar>
            </View>
            <View style={{flexDirection:'column' , alignItems:'center' , marginTop:-30}}>
                <AppText color={whiteLabel().mainText} style={{marginBottom:0, marginTop:0}} title="Strike Rate"></AppText>
                <CircularProgress
                    radius={40}
                    value={week.strike_rate}            
                    valueSuffix='%'       
                    progressValueStyle={{fontSize:14}}         
                    titleStyle={{fontWeight: 'bold' ,  fontSize:12,color:'black'}}                            
                    activeStrokeWidth={12}
                    progressValueColor={whiteLabel().graphs.primary}
                    activeStrokeColor={whiteLabel().graphs.primary}                    
                />
            </View>
        </View>
       
        <Legend types={barTypes} ></Legend>
       
        <WeeklyBar graph={week.graph}></WeeklyBar>
    </View>
  )
}
