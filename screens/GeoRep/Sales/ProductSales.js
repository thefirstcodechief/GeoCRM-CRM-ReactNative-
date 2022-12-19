import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {style} from '../../../constants/Styles';
import {Strings} from '../../../constants';
import GetRequestProductsList from '../../../DAO/sales/GetRequestProductsList';
import {useDispatch} from 'react-redux';
import {expireToken} from '../../../constants/Helper';
import ProductSalesContainer from './containers/ProductSalesContainer';
import {getJsonData, storeJsonData} from '../../../constants/Storage';
import {setSalesSetting} from '../../../actions/sales.action';


export default function ProductSales(props) {

  const [settings, setSettings] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const navigation = props.navigation;

  const dispatch = useDispatch();
  let isMount = true;


  useEffect(() =>{
    refreshHeader();
    return () => {
      isMount = false;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshHeader();
    });
    return unsubscribe;
  }, [navigation]);

  const refreshHeader = () => {
    if (props.screenProps) {
      props.screenProps.setOptions({
        headerTitle: () => {
          return (
            <TouchableOpacity onPress={() => {}}>
              <View style={style.headerTitleContainerStyle}>
                <Text style={style.headerTitle}>Sales</Text>
              </View>
            </TouchableOpacity>
          );
        },
      });
    }
  }

  const getParamData = data => {
    if (data != null && data != undefined) {
      var postParam = {
        page_no: 0,
        transaction_type: data.transaction_type.type,
        currency_id: data.currency_id ? data.currency_id.id : '',
        warehouse_id: data.warehouse_id
          ? data.warehouse_id.map(item => item.id).join(',')
          : '',
        filters: '',
      };
      return postParam;
    }
    return {};
  };

  const getProductLists = async (data, search_text, pageNumber) => {
    if (data != undefined) {
      storeJsonData('@setup', data);
      const param = getParamData(data);
      await storeJsonData('@sale_product_parameter', param);
    }
    getApiData('', 0);
  };

  const getProductListsByFilter = async data => {
    var paramData = await getJsonData('@sale_product_parameter');
    if (paramData != null) {
      paramData['filters'] = data;
      await storeJsonData('@sale_product_parameter', paramData);
      getApiData('', 0);
    }
  };

  const getApiData = async (search_text, pageNumber) => {

    setIsLoading(true);
    var paramData = await getJsonData('@sale_product_parameter');
    if (paramData != null) {
      paramData['page_no'] = pageNumber;
      if (search_text != undefined) {
        paramData['search_text'] = search_text;
      }
      storeJsonData('@sale_product_parameter', paramData);      
      console.log("param", paramData)
      GetRequestProductsList.find(paramData)
        .then(res => {
          if(isMount){
            setIsLoading(false);
            if (res.status == Strings.Success) {
              setSettings(res.settings);
              dispatch(setSalesSetting(res.settings));
              if (pageNumber == 0) {
                setItems(res.items);
              } else {
                setItems([...items, ...res.items]);
              }
              setPage(pageNumber + 1);
            }
          }                    
        })
        .catch(e => {
          setIsLoading(false);
          expireToken(dispatch, e);          
        });
    }
  };

  return (
    <View style={{paddingTop: 20, alignSelf: 'stretch', flex: 1}}>
      <ProductSalesContainer
        getProductLists={getProductLists}
        getProductListsByFilter={getProductListsByFilter}
        items={items}
        settings={settings}
        page={page}
        isLoading={isLoading}
        loadMoreData={(pageNumber, searchText) => {
          console.log('load more api ', pageNumber, searchText);
          getApiData(searchText, pageNumber);
        }}
        {...props}
      />
    </View>
  );
}
