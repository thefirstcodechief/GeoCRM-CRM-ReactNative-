import { View, Text , StyleSheet ,ScrollView ,Keyboard ,ToastAndroid,
    Platform,
    AlertIOS, } from 'react-native'
import React , { useRef , useState ,useEffect ,useImperativeHandle} from 'react'
import SearchBar from '../../../SearchBar'
import SKUCaptureModal from '../../SKUSelect/modals/SKUCaptureModal'
import CSingleSelectInput from '../../../common/SelectInput/CSingleSelectInput';
import { style } from '../../../../constants/Styles';
import { whiteLabel } from '../../../../constants/Colors';
import CardView from '../../../common/CardView';
import SectionList from './SectionList';
import { Constants, Values } from '../../../../constants';
import { AppText } from '../../../common/AppText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../../../actions/notification.action';

//export default function ProductSelectFormView(props) {
const ProductSelectFormView = React.forwardRef((props, ref) => {

    const {  questionType, item , typeLists, brandLists , productIssues  , selectedLists } = props;
    const skuCaptureModalRef = useRef(null);
    const [formData, setFormData] = useState(null);
    const [brand, setBrand] = useState("");
    const [type, setType] = useState("");
    const [productIssue, setProductIssue] = useState('');
    const [searchKey, setSearchKey] = useState("");         
    const [products, setProducts] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([])
    const dispatch = useDispatch();

    var previousCode = ''
    useImperativeHandle(
        ref,
        () => ({
          updatedSelectedLists(item) {                      
            var tmp = selectedProductIds.filter(element => element != item.product_id );            
            setSelectedProductIds(tmp);
          },
          initSelectedLists(ids) {
            setSelectedProductIds(ids);
          }
        }),
        [selectedProductIds],
    );
    
    useEffect(() => {        
        filterProduct();
    },[item, brand, type , searchKey])

    const onCaptureAction = ({type, value}) => {
        if (type == Constants.actionType.ACTION_CAPTURE) {
            if(questionType == Constants.questionType.FORM_TYPE_PRODUCT_ISSUES && productIssue == ''){
                dispatch(showNotification({type:'success' , message: 'Please choose an issue before making a selection or scanning'  , buttonText:'Ok'}))
            }else{
                var tmp = item.products.find(element => element.barcode == value );            
                if(tmp != null && tmp != undefined){
                    if(questionType == Constants.questionType.FORM_TYPE_PRODUCT_ISSUES){                                    
                        tmp = { ...tmp, productIssue }                    
                    }
                    setSelectedProductIds([...selectedProductIds, tmp.product_id]);
                    props.changedSelectedProducts(tmp , "add");
                }else if(value != previousCode){
                    if (Platform.OS === 'android') {
                        ToastAndroid.show("Product not found", ToastAndroid.SHORT)
                    } else {
                        AlertIOS.alert("Product not found");
                    }
                }
                previousCode = value;
            }            
        }
    };
    const onSearch = (key) => {
        setSearchKey(key)
    }

    const onCapture = () => {
        if (skuCaptureModalRef && skuCaptureModalRef.current) {
          skuCaptureModalRef.current.showModal();
        }
    };

    const filterProduct = () => {
        console.log("origin length",item.products.length)
        var tmp = item.products.filter( (item) => {
            var flag = true;
            if(brand != '' && item.brand !=  brand){
                flag = false
            }
            if(type  != '' && item.product_type != type){
                flag = false;
            }
            if(searchKey != '' 
                && ( !item.label.toLowerCase().includes(searchKey.toLowerCase()) 
                && !item.barcode.toLowerCase().includes(searchKey.toLowerCase()) 
                && !item.product_code.toLowerCase().includes(searchKey.toLowerCase())
                && !item.product_type.toLowerCase().includes(searchKey.toLowerCase()) ) ){
                flag = false;
            }
            return flag;
        });
        console.log("filter length",tmp.length)
        setProducts(tmp)
    }

    const onItemAction = ({type , item, value}) =>{
        if(type == Constants.actionType.ACTION_CHECK){

            if(questionType == Constants.questionType.FORM_TYPE_PRODUCT_ISSUES && productIssue == ''){
                dispatch(showNotification({type:'success' , message: 'Please choose an issue before making a selection or scanning'  , buttonText:'Ok'}))
            }else{
                if(questionType == Constants.questionType.FORM_TYPE_PRODUCT_ISSUES){                                    
                    item = { ...item, productIssue }                    
                }
                if(value){
                    setSelectedProductIds([...selectedProductIds, item.product_id]);                    
                    props.changedSelectedProducts(item , "add");
                }else{
                    var tmp = selectedProductIds.filter(element => element != item.product_id );
                    setSelectedProductIds(tmp)    
                    props.changedSelectedProducts(item, "remove");                            
                }
            }            
        }
    }

    return (
        <View style={styles.container}>
            <SearchBar
                isFilter
                onSearch={onSearch}
                suffixButtonIcon="Scan_Icon"
                onSuffixButtonPress={onCapture}
            />            

            <View style={{flexDirection:'row', marginHorizontal:10}}>
                <CSingleSelectInput 
                    bgType="card"
                    bgStyle={[style.card, {borderWidth:0}]}
                    placeholderStyle={{color: whiteLabel().mainText, fontWeight:'700' }}
                    description={'Brand'}
                    placeholder={'Brand'}
                    checkedValue={brand}
                    items={brandLists}
                    hasError={false}
                    disabled={false}
                    onSelectItem={item => {      
                        setBrand(item.label);

                    }}
                    onClear={() => setBrand('') }
                    containerStyle={{marginTop: 0, flex:1}}
                />

                <CSingleSelectInput
                    bgType="card"
                    bgStyle={[style.card, {borderWidth:0}]}
                    placeholderStyle={{color: whiteLabel().mainText, fontWeight:'700' }}
                    description={'Type'}
                    placeholder={'Type'}
                    checkedValue={type}
                    items={typeLists}
                    hasError={false}
                    disabled={false}
                    onSelectItem={item => {                        
                        setType(item.label)
                    }}
                    onClear={() => setType('') }
                    containerStyle={{marginTop: 0 , marginLeft:5, flex:1}}
                /> 
            </View>            

            {
                questionType == Constants.questionType.FORM_TYPE_PRODUCT_ISSUES &&
                <CSingleSelectInput
                    bgType="card"
                    bgStyle={[style.card, {borderWidth:0}]}
                    placeholderStyle={{color: whiteLabel().mainText, fontWeight:'700' }}
                    description={'Product Issues'}
                    placeholder={'Product Issues'}
                    checkedValue={productIssue}
                    items={productIssues}
                    hasError={false}
                    disabled={false}
                    onSelectItem={item => {                        
                        setProductIssue(item.label)
                    }}
                    onClear={() => setProductIssue('') }
                    containerStyle={{marginTop: 0 ,marginHorizontal:10, flex:1}}
                /> 
            }
            
            <View style={{flexDirection:'row' ,marginHorizontal: 15, marginBottom:5}}>
                <View style={{flex:1,marginLeft:5}}>
                <AppText title='Type' size="medium" color={whiteLabel().mainText} ></AppText>
                </View>        
                <View style={{flex:2, alignItems:'center'}}>
                <AppText title='Product' size="medium" color={whiteLabel().mainText} ></AppText>
                </View>
                <View style={{width:100}}></View>
            </View>        

            <CardView style={{marginHorizontal: 10}}>
                <View>                                                                              
                    <SectionList
                        questionType={questionType}
                        productIssue={productIssue}
                        sections={products}
                        checkedItemIds={selectedProductIds}
                        selectedLists={selectedLists}
                        onItemAction={onItemAction}
                        style={{padding: 8}}
                    />
                </View>
            </CardView>
            
            <SKUCaptureModal
                ref={skuCaptureModalRef}                
                formData={formData}
                onButtonAction={onCaptureAction}
            />   
        </View>
    )

});
export default ProductSelectFormView;

const styles = StyleSheet.create({
    container:{
        alignSelf: 'stretch',
    }
})

