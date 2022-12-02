import { StyleSheet, Image,  Text, View, TouchableOpacity } from 'react-native'
import React , { useState ,useEffect } from 'react'
import { AppText } from '../../../../../components/common/AppText'
import { Colors, Strings } from '../../../../../constants'
import { whiteLabel } from '../../../../../constants/Colors'
import NumberCounter from '../../../../../components/shared/SKUCount/components/NumberCounter'
import { style } from '../../../../../constants/Styles'
import FastImage from 'react-native-fast-image';
import { useSelector , useDispatch } from 'react-redux';
import { formattedPrice } from '../../../../../helpers/formatHelpers'
import SvgIcon from '../../../../../components/SvgIcon'


const ProductItem = (props) => {

    const {item , settings} = props;
    const productPriceLists = useSelector(
        state => state.sales.productPriceLists,
    );

    if (!item) return null;
    const dispatch = useDispatch() 

    const [qty, setQty] = useState(item.qty != undefined ? item.qty : 0);

    useEffect(() => {
       if(productPriceLists.length == 0){
           setQty(0);
       }
       var check = productPriceLists.find(element => element.product_id == item.product_id);              
       if(check != undefined){
           setQty(check.qty);
       }
    }, [productPriceLists])

    const onCount = (qty) => {        

        setQty(qty);        
        // if(props.geProductPrice){    
        //     props.geProductPrice( item.product_id, qty);
        // }
    }

    const onChangeText = (qty) => {
        setQty(qty);
    }

    const onEditDone = (qty) => {   
        setQty(qty);       
        if(props.geProductPrice){    
            props.geProductPrice( item, qty);
        }
    }

           
    return (
        <View style={[styles.container, style.card , item.qty > 0 ? styles.redBorder : {} ]}>
            <FastImage style={styles.imgStyle}  source={{uri:item.product_images != undefined ? item.product_images[0] : ''  }} />        
            <View style={{flex:1, marginLeft:5}}>
                
                <View style={{flexDirection:'row'}}>
                    <AppText title={item.product_name} size="big" type="secondaryBold" style={{flex:1}} ></AppText>

                    {
                        (settings.allow_edit_price === "1" || settings.allow_discount === "1") &&
                        <TouchableOpacity onPress={()=> {
                            if(props.openProductDetail){
                                props.openProductDetail(item);
                            }
                        }}>
                            <SvgIcon icon="Bottom_Arrow" height="25" width="25" />
                        </TouchableOpacity>                    
                    }
                    
                </View> 

                <View style={{flexDirection:'row', marginTop:5}}>
                    <AppText title={item.warehouse_name}  color={whiteLabel().subText}></AppText>
                    <AppText title="  |  " color={whiteLabel().subText}></AppText>
                    <AppText title={"Stock: " + item.soh}  color={whiteLabel().subText}></AppText>
                </View>
                <View style={{flexDirection:'row',  alignItems:'center', marginTop:5 }}>
                    <AppText title="Qty"  color={whiteLabel().subText} style={{marginRight:10}}></AppText>
                    
                    <NumberCounter
                        btnStyle={styles.addContainer}
                        btnTextStyle={styles.btnTextStyle}
                        inputBoxStyle={styles.inputBoxStyle}
                        style={{marginTop:0 , marginBottom:0}}
                        step={parseInt(item.qty_increments)}
                        count={qty} 
                        onCount={onCount}          
                        //onChangeText={onChangeText}     
                        fixed={1}     
                        onEditDone={onEditDone}
                    />

                    <View style={{flex:1, flexDirection:'row' , alignItems:'center', justifyContent:'flex-end'}}>
                        {
                            item.special == "1" &&
                            <SvgIcon icon="Special" width="15" height="15" style={{marginRight:5}} />
                        }                    
                        <AppText 
                            style={[item.special == "1" ? {textDecorationLine: 'underline'} : {}]}
                            title={item.symbol + formattedPrice(parseFloat(item.price))} size="medium" color={Colors.primaryColor}/>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ProductItem

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        marginHorizontal: 10,
        
    },  
    imgStyle:{
        width: 100,
        height: 100,                
    },

    addContainer: {
        color:Colors.whiteColor,
        marginLeft:0,
        marginRight:0,
        width : 21,
        height: 21,
        borderRadius: 3,
        backgroundColor: whiteLabel().actionFullButtonBackground
    },
    btnTextStyle :{
        color: Colors.whiteColor
    },
    inputBoxStyle :{
        borderWidth:0
    },
    redBorder : {
        borderColor: whiteLabel().mainText,
        borderWidth:1,
        borderRadius:3
    }
    
})