import * as React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import SvgIcon from './SvgIcon';
import { boxShadow, style } from '../constants/Styles';
import { PRIMARY_COLOR, TEXT_COLOR, whiteLabel } from '../constants/Colors';
import Fonts from '../constants/Fonts';

export default function FilterButton(props) {
  return (
    <TouchableOpacity style={[style.card, boxShadow]} onPress={props.onPress}>
      <View style={{flexDirection:'row' , alignItems:'center'}}>
        <Text style={styles.cardtitle}>{props.text}</Text>       
        {
          props.startDate != undefined && props.endDate != undefined &&
          <View style={{marginLeft:10}}><Text style={styles.cardSubtitle}>Start: {props.startDate}</Text><Text style={styles.cardSubtitle} >End: {props.endDate}</Text></View>
        }        
        {props.subText && props.subText != "" && <Text style={styles.cardSubtitle}> ({props.subText})</Text>}
      </View>
      <SvgIcon icon="Right_Arrow" width='23px' height='23px' />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  
  cardtitle: {
    color: TEXT_COLOR,
    fontSize: 14,
    fontFamily:Fonts.secondaryMedium,
  },
  cardSubtitle: {
    fontFamily:Fonts.secondaryMedium,
    fontSize: 14,
    color: whiteLabel().mainText
  },
})
