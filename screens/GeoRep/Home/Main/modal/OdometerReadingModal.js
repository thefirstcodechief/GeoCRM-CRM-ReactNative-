import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {
  getApiRequest,
  postApiRequestMultipart,
} from '../../../../../actions/api.action';
import {AppText} from '../../../../../components/common/AppText';
import CModal from '../../../../../components/common/CModal';
import CTextInput from '../../../../../components/common/CTextInput';
import {SubmitButton} from '../../../../../components/shared/SubmitButton';
import SvgIcon from '../../../../../components/SvgIcon';
import {Constants, Strings} from '../../../../../constants';
import {whiteLabel} from '../../../../../constants/Colors';
import * as ImagePicker from 'react-native-image-picker';
import PhotoCameraPickerDialog from '../../../../../components/modal/PhotoCameraPickerDialog';
import * as RNLocalize from 'react-native-localize';
import {Notification} from '../../../../../components/modal/Notification';
import { useDispatch } from 'react-redux';
import { expireToken } from '../../../../../constants/Helper';
import { clearLoadingBar, showLoadingBar } from '../../../../../actions/notification.action';

const OdometerReadingModal = React.forwardRef((props, ref) => {

  const {title, isStart, startEndDayId, currentLocation} = props;

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [image, setImage] = useState(null);
  const [isPicker, setIsPicker] = useState(false);
  const [distanceMeasure, setDistanceMeasure] = useState('km');
  const [imageRequired, setImageRequired] = useState(false);
  const [isStartRequired, setIsStartRequired] = useState(false);
  const [isEndRequired, setIsEndRequired] = useState(false);
  const [isSubmit , setIsSubmit] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    _callGetOdometer();

  }, []);

  const onButtonAction = data => {
    if (props.onButtonAction) {
      props.onButtonAction(data);
    }
    if (ref) {
      ref.current.hideModal();
    }
  };

  const _callGetOdometer = () => {    
    getApiRequest('home/odometer', {})
      .then(res => {        
        setDistanceMeasure(res.distance_measure);
        setImageRequired(res.image_required === '1' ? true : false);
      })
      .catch(e => {
        expireToken(dispatch, e);
      });
  };

  const _callOdometer = () => {

    let hasError = false;
    if (imageRequired && image === null) {
      message = Strings.Please_Take_Photo;
      hasError = true;
    }

    if (isStart && (end == '' || end == undefined)) {
      message = Strings.Home.Input_End_Reading;
      hasError = true;
      setIsEndRequired(true);
      return;
    }

    if (!isStart && (start == '' || start == undefined)) {
      message = Strings.Home.Input_Start_Reading;
      hasError = true;
      setIsStartRequired(true);
      return;
    }
    if (hasError) return;
    
    var postData = new FormData();
    postData.append('startEndDay_id', startEndDayId);
    postData.append('reading_type', isStart ? 'end_reading' : 'start_reading');
    postData.append('reading', isStart ? end : start);
    if (image) {
      postData.append('image_included', '1');
      postData.append('File[odometer_image]', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    }else{
      postData.append('image_included', '0');
    }
    
    var time_zone = RNLocalize.getTimeZone();
    postData.append('user_local_data[time_zone]', time_zone);
    postData.append(
      'user_local_data[latitude]',
      currentLocation && currentLocation.latitude != null
        ? currentLocation.latitude
        : '0',
    );

    postData.append(
      'user_local_data[longitude]',
      currentLocation && currentLocation.longitude != null
        ? currentLocation.longitude
        : '0',
    );

    if(isSubmit){
      return ;
    }

    setIsSubmit(true);
    dispatch(showLoadingBar({'type' :  'loading'}));

    postApiRequestMultipart('home/odometer', postData)
      .then(res => {
        if (res.status === Strings.Success) {
          setImage(null);
          onButtonAction({
            type: Constants.actionType.ACTION_DONE,
            value: res.message,
          });
        }
        setIsSubmit(false);
        dispatch(clearLoadingBar());
      })
      .catch(error => {
        console.log('home/odometer post api error:', error);
        setIsSubmit(false);
        dispatch(clearLoadingBar());
        expireToken(dispatch, e);        
      });
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        launchCamera();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      setIsPicker(false);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (response.assets != null && response.assets.length > 0) {
          setImage(response.assets[0]);
        }
      }
    });
  };

  const launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      console.log('Response = ', response);
      setIsPicker(false);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        if (response.assets != null && response.assets.length > 0) {
          setImage(response.assets[0]);
        }
      }
    });
  };

  return (
    <CModal
      ref={ref}
      title={title}
      closableWithOutsideTouch
      modalType={Constants.modalType.MODAL_TYPE_BOTTOM}
      onClear={() => {
        onButtonAction({
          type: Constants.actionType.ACTION_FORM_CLEAR,
        });
      }}
      {...props}>
      <View style={styles.container}>
        <Notification></Notification>
        <View style={styles.inputContainer}>
          <CTextInput
            label={Strings.Home.Start_Reading}
            disabled={isStart}
            value={start}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            hasError={!isStart && isStartRequired}
            right={
              isStartRequired ? null : (
                <TextInput.Affix
                  textStyle={{marginTop: 8}}
                  text={distanceMeasure}
                />
              )
            }
            isRequired={true}
            onChangeText={text => {
              setStart(text);
              setIsStartRequired(false);
            }}
          />
        </View>

        {isStart && (
          <View style={styles.inputContainer}>
            <CTextInput
              label="End Reading"
              value={end}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              style={{marginTop: 10}}
              hasError={isEndRequired}
              right={
                isEndRequired ? null : (
                  <TextInput.Affix
                    textStyle={{marginTop: 8}}
                    text={distanceMeasure}
                  />
                )
              }
              isRequired
              onChangeText={text => {
                setEnd(text);
                setIsEndRequired(false);
              }}
            />
          </View>
        )}

        {imageRequired && (
          <View
            style={{
              margsinBottom: 10,
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <AppText
                type="secondaryBold"
                size="big"
                title={Strings.Home.Take_Photo}></AppText>
            </View>
            {image && (
              <TouchableOpacity
                style={[{marginLeft: 10, marginRight: 20}]}
                onPress={() => {
                  setIsPicker(true);
                }}>
                <Image
                  style={styles.imageContainer}
                  source={{uri: image.uri}}
                />
              </TouchableOpacity>
            )}
            {image === null && (
              <TouchableOpacity
                style={[
                  styles.imageContainer,
                  {marginLeft: 10, marginRight: 20},
                ]}
                onPress={() => {
                  setIsPicker(true);
                }}>
                <SvgIcon icon="Add_Image" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <SubmitButton
          style={{marginTop: 10}}
          title="Submit"
          onSubmit={() => {
            _callOdometer();
          }}
        />

        <PhotoCameraPickerDialog
          visible={isPicker}
          message={'Choose Image'}
          onCamera={() => {
            if (Platform.OS === 'android') {
              requestCameraPermission();
            } else {
              launchCamera();
            }
          }}
          onGallery={launchImageLibrary}
          onModalClose={() => {
            setIsPicker(false);
          }}></PhotoCameraPickerDialog>
      </View>
    </CModal>
  );
});

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  imageContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: whiteLabel().fieldBorder,
    borderRadius: 5,
    width: Dimensions.get('screen').width / 4.5 + 7,
    height: Dimensions.get('screen').width / 4.5,
  },
  inputContainer: {
    justifyContent: 'center',
  },
  
});

export default OdometerReadingModal;
