import { View , Platform , TouchableOpacity } from 'react-native'
import React , { useState , useEffect , useRef } from 'react'
import SetupFieldView from '../components/SetupFieldView';
import { GetRequestSetupFieldDAO } from '../../../../DAO';
import { expireToken } from '../../../../constants/Helper';
import {  useSelector, useDispatch } from 'react-redux';
import { Constants } from '../../../../constants';
import { getBottomTabs } from '../../../../components/helper';
import BottomTabItem from '../../../../components/common/BottomTabItem';
import { getJsonData, getLocalData } from '../../../../constants/Storage';
import { SHOW_MORE_COMPONENT } from '../../../../actions/actionTypes';
import { SafeAreaView } from 'react-native-safe-area-context';

const  SetupFieldContainer = (props) => {

    const { closableWithOutsideTouch } = props;
    
    const [transaction_types , setTransactinTypes] = useState(null);
    const [warehouse , setWarehouse] = useState(null);
    const [currency , setCurrency] = useState(null);
    const [setupField, setSetupField] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bottomTabs, setBottomTabs] = useState([]);
    const [apiCallType, setApiCallType] = useState('load');
    
    const payload = useSelector(state => state.selection.payload);
    const selectProject = useSelector(state => state.selection.selectProject);
    const setupFieldViewRef = useRef(null);
    
    const dispatch = useDispatch()
    let isMount = true;

    useEffect(() => {
        initBottomTab();        
        callDefineSetUp();
        return () => {
            isMount = false;
        }
    }, []);

    const callDefineSetUp = async () => {                
        var defineSetup = await getJsonData('@setup');        
        if(defineSetup != null ){            
            if(defineSetup.location != undefined && defineSetup.location.location_id){
                callSetupFieldOptions( defineSetup.location.location_id , 'load');
            }
        }else{
            const location_id = await getLocalData("@specific_location_id");            
            callSetupFieldOptions( location_id , 'change');
        }
    }

    const callSetupFieldOptions = (location_id , type) => {
        if(!isLoading){
            setIsLoading(true);
            var param = {};        
            if(location_id  != undefined && location_id != ''){
                param = {
                    location_id: location_id
                }
            }
            
            GetRequestSetupFieldDAO.find(param).then((res) => {
                console.log("res.warehouse", res.warehouse);
                setTransactinTypes(res.transaction_types);
                setWarehouse(res.warehouse);
                setCurrency(res.currency);
                setSetupField(res);

                if(setupFieldViewRef.current)
                    setupFieldViewRef.current.updateSetupData(type);
                setIsLoading(false)
            }).catch((e) => {
                expireToken(dispatch, e);
                setIsLoading(false)
            });
        }        
    }

    const initBottomTab = () => {
        const tabs = getBottomTabs(payload, selectProject);
        setBottomTabs(tabs)
    }
 
    const onContinue = (data) => {             
        props.onButtonAction({type: Constants.actionType.ACTION_CLOSE, value: data});
    }

    const onClose = () => {
        props.onButtonAction({type: Constants.actionType.ACTION_CLOSE, value: null});
    }

    const onChangeLocation = (location) => {        
        if(location)
            callSetupFieldOptions(location.location_id , 'change')
    }
    
    const getPadding = () => {
        if(Platform.OS == 'android'){
            return 0;
        }else{
            const majorVersionIOS = parseInt(Platform.Version, 10);
            console.log("majorVersionIOS => ",majorVersionIOS);
            return 4;
            if(majorVersionIOS == 7){
                return 25
            }else{
                return 28;
            }
        }
    }

    return (
        <SafeAreaView >
        
        {
            Platform.OS == 'ios' && <View style={{position:'absolute', backgroundColor:'white', height:35, width: '100%' , bottom : 0  }}></View>
        }
        
        {closableWithOutsideTouch && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onClose}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
        )}

        <View style={{
            alignSelf:'stretch' , 
            flex:1 ,            
            flexDirection:'column',            
            alignItems:'center',
            justifyContent:'center',            
            minHeight:250
        }}>
           
            <SetupFieldView 
                ref={setupFieldViewRef}
                setupField={setupField}
                transaction_types={transaction_types} 
                currency={currency}
                warehouse={warehouse}
                isLoading={isLoading}
                apiCallType={apiCallType}
                onContinue={onContinue}
                onClose={onClose}
                onChangeLocation={onChangeLocation}
                {...props} />
            
            <View style={{
                    backgroundColor:'white', 
                    position:'absolute' ,
                    bottom:0, 
                    width:'100%', 
                    flexDirection:'row' , 
                    paddingBottom: getPadding()
                }}>

                {
                    bottomTabs.map((item, index) =>{
                        return (
                            <BottomTabItem  
                                onItemPressed={() => {                                    
                                    if(item?.name != 'Sales'){
                                        if(item?.name != 'More') {
                                            dispatch({type: SHOW_MORE_COMPONENT, payload: ''});
                                        }                                 
                                        props.onButtonAction({type: Constants.actionType.ACTION_DONE, value: item});                                    
                                    }                                    
                                }}
                                key={index} item={item} 
                            />
                        )
                    })
                }                                            
            </View>
        </View>
       
        </SafeAreaView>
    )
}

export default SetupFieldContainer;