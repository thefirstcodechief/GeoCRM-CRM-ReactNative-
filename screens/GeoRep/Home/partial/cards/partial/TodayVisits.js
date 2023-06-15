import {View, Dimensions} from 'react-native';
import React, {useRef} from 'react';
import ProgressBar from '../../ProgressBar';
import CircularProgress from 'react-native-circular-progress-indicator';
import {whiteLabel} from '../../../../../../constants/Colors';
import {AppText} from '../../../../../../components/common/AppText';
import VisitCheckinItem from '../components/VisitCheckinItem';
import Legend from '../../../../../../components/common/Legend';
import LoadingBar from '../../../../../../components/LoadingView/loading_bar';


const TodayVisits = props => {

  const {today} = props;
  const loadingBarRef = useRef();

  const barTypes = [
    {color: whiteLabel().graphs.primary, name: 'Completed'},
    {color: whiteLabel().graphs.color_1, name: 'Additional'},
    {color: whiteLabel().graphs.color_3, name: 'Remaining'},
  ];

  const colors = [
    whiteLabel().graphs.primary,
    whiteLabel().graphs.color_1,
    whiteLabel().graphs.color_3,
  ];

  const renderCheckin = (item, index) => {
    return <VisitCheckinItem 
      showLoadingBar={showLoadingBar}
      hideLoadingBar={hideLoadingBar}
      item={item} key={index}></VisitCheckinItem>;
  };

  const showLoadingBar = ()=> {
    if(loadingBarRef.current){
      loadingBarRef.current.showModal()
    }
  }

  const hideLoadingBar = ()=> {
    if(loadingBarRef.current){
      loadingBarRef.current.hideModal()
    }
  }

  return (
    <View style={{flexDirection: 'column'}}>

      <LoadingBar ref={loadingBarRef} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <View style={{marginBottom: 10, flex: 1, marginRight: 10}}>
          <ProgressBar
            colors={colors}
            steps={[
              parseInt(today.completed),
              parseInt(today.additional),
              parseInt(today.remaining),
            ]}
            height={25}></ProgressBar>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: -30,
          }}>
          <AppText
            color={whiteLabel().mainText}
            style={{marginBottom: 5, marginTop: 0}}
            title="Strike Rate"></AppText>
          <CircularProgress
            radius={Dimensions.get('window').width * 0.105}
            //radius={40}
            value={today.strike_rate}
            valueSuffix="%"
            progressValueStyle={{fontSize: 14}}
            activeStrokeWidth={12}
            progressValueColor={whiteLabel().graphs.primary}
            activeStrokeColor={whiteLabel().graphs.primary}
          />
        </View>
      </View>

      <Legend types={barTypes}></Legend>

      <View style={{marginTop: 10, marginHorizontal: 10}}>
        {today?.next_calls?.map((item, index) => {
          return renderCheckin(item, index);
        })}
      </View>
    </View>
  );
};
export default TodayVisits;
