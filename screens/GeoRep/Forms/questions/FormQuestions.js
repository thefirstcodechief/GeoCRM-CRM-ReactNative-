import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Colors from '../../../../constants/Colors';
import Images from '../../../../constants/Images';
import {style} from '../../../../constants/Styles';
import {useSelector, useDispatch} from 'react-redux';
import {expireToken} from '../../../../constants/Helper';
import {
  getApiRequest,
  postApiRequestMultipart,
} from '../../../../actions/api.action';
import {
  clearNotification,
  showNotification,
} from '../../../../actions/notification.action';
import * as RNLocalize from 'react-native-localize';
import {FormQuestionView} from '../../CRM/add_lead/components/FormQuestionView';
import {
  filterTriggeredQuestions,
  getFormQuestionData,
  getFormQuestionFile,
  validateFormQuestionData,
} from './helper';
import {
  deleteFormTable,
  getFormTableData,
  insertTable,
} from '../../../../sqlite/FormDBHelper';
import {getDBConnection} from '../../../../sqlite/DBHelper';
import uuid from 'react-native-uuid';
import {getLocalData} from '../../../../constants/Storage';
import LoadingBar from '../../../../components/LoadingView/loading_bar';
import {Strings} from '../../../../constants';
import {Notification} from '../../../../components/modal/Notification';
var indempotencyKey;

export const FormQuestions = props => {
  const form = props.route.params.data;
  const pageType = props.route.params.pageType;
  const currentLocation = useSelector(state => state.rep.currentLocation);
  const [formQuestions, setFormQuestions] = useState([]);
  const [isDateTimeView, setIsDateTimeView] = useState(false);
  const [isSign, setIsSign] = useState(false);
  const formQuestionViewRef = useRef();
  const loadingBarRef = useRef();
  const dispatch = useDispatch();
  const isShowCustomNavigationHeader = !props.screenProps;

  useEffect(() => {
    refreshHeader();
    loadFromDB(form.form_id);
  }, [form]);

  const loadFromDB = async formId => {
    const db = await getDBConnection();
    if (db != null) {
      const res = await getFormTableData(db, formId);
      if (res.length > 0) {
        updateFormQuestions(JSON.parse(res.item(0).formQuestions));
        indempotencyKey = res.item(0).indempotencyKey;
        return;
      }
    }
    _callFormQuestions();
  };

  const saveDb = async (formQuestions, indempotencyKey) => {
    const db = await getDBConnection();
    if (db != null)
      await insertTable(db, form.form_id, formQuestions, indempotencyKey);
  };

  const refreshHeader = () => {
    if (props.screenProps) {
      props.screenProps.setOptions({
        headerTitle: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (isDateTimeView) {
                  closeDateTime();
                } else if (isSign) {
                  closeSignView();
                } else {
                  if (pageType === 'CRM') {
                    props.navigation.navigate('CRM', {screen: 'Root'});
                  } else {
                    if (props.navigation.canGoBack()) {
                      props.navigation.goBack();
                    }
                  }
                }
              }}>
              <View style={style.headerTitleContainerStyle}>
                <Image
                  resizeMethod="resize"
                  style={{width: 15, height: 20, marginRight: 5}}
                  source={Images.backIcon}
                />
                <Text style={style.headerTitle}>Forms</Text>
              </View>
            </TouchableOpacity>
          );
        },
        tabBarStyle: {
          position: 'absolute',
          height: 50,
          paddingBottom: Platform.OS == 'android' ? 5 : 0,
          backgroundColor: Colors.whiteColor,
        },
      });
    }
  };

  const _callFormQuestions = () => {
    let param = {
      form_id: form.form_id,
    };
    getApiRequest('forms/forms-questions', param)
      .then(res => {
        console.log('question lists', JSON.stringify(res.questions));
        groupByQuestions(res.questions);
      })
      .catch(e => {
        expireToken(dispatch, e);
      });
  };

  const groupByQuestions = data => {
    var newData = [];
    data.forEach(element => {
      if (!isInNewData(newData, element)) {
        var ques = [element];
        newData.push({
          question_group_id: element.question_group_id,
          question_group: element.question_group,
          questions: ques,
        });
      } else {
        var tmp = newData.find(
          item => item.question_group_id === element.question_group_id,
        );
        var newTmp = [...tmp.questions, element];
        tmp.questions = [...newTmp];
      }
    });
    updateFormQuestions(newData);
  };

  const isInNewData = (data, value) => {
    return data.find(item => item.question_group_id === value.question_group_id)
      ? true
      : false;
  };

  const clearAll = () => {
    var tmp = [...formQuestions];
    tmp.forEach(element => {
      element.questions.forEach(item => {
        item.value = null;
        if (item.yes_image) {
          item.yes_image = undefined;
        }
        if (item.no_image) {
          item.no_image = undefined;
        }
      });
    });
    updateFormQuestions(tmp);
    indempotencyKey = null;
  };

  const closeDateTime = () => {
    setIsDateTimeView(false);
  };

  const closeSignView = () => {
    setIsSign(false);
  };

  const _onSubmit = async () => {
    if (
      indempotencyKey === null ||
      indempotencyKey === undefined ||
      indempotencyKey.trim() === ''
    ) {
      indempotencyKey = uuid.v4();
    }
    saveDb(formQuestions, indempotencyKey);
    var flag = true;
    flag = validateFormQuestionData(formQuestions);
    if (!flag) {
      dispatch(
        showNotification({
          type: 'success',
          message: Strings.Complete_Compulsory_Questions,
          buttonText: Strings.Ok,
        }),
      );
      return;
    }

    loadingBarRef.current.showModal();
    var lat = await getLocalData('@latitude');
    var lon = await getLocalData('@longitude');
    var form_answers = [];
    form_answers = getFormQuestionData(formQuestions);

    var files = [];

    files = getFormQuestionFile(formQuestions);

    var postData = new FormData();
    postData.append('form_id', form.form_id);
    var locationId = await getLocalData('@specific_location_id');
    postData.append('location_id', locationId);
    postData.append('online_offline', 'online');

    var time_zone = '';
    try {
      time_zone = RNLocalize.getTimeZone();
    } catch (e) {}
    postData.append('user_local_data[time_zone]', time_zone);
    postData.append(
      'user_local_data[latitude]',
      currentLocation && currentLocation.latitude != null
        ? currentLocation.latitude
        : lat != null
        ? lat
        : '0',
    );
    postData.append(
      'user_local_data[longitude]',
      currentLocation && currentLocation.longitude != null
        ? currentLocation.longitude
        : lon != null
        ? lon
        : '0',
    );

    form_answers.map(item => {
      if (
        item.key != undefined &&
        item.value != undefined &&
        item.value != null &&
        item.valuel != ''
      ) {
        postData.append(item.key, item.value);
      }
    });

    files.map(item => {
      if (item.key != undefined && item.value != undefined) {
        if (item.type === 'upload_file') {
          postData.append(item.key, {
            uri: item.value.uri,
            type: item.value.type,
            name: item.value.name,
          });
        } else {
          var words = item.value.split('/');
          var ext = words[words.length - 1].split('.');
          postData.append(item.key, {
            uri: item.value,
            type: 'image/' + ext[1],
            name: words[words.length - 1],
          });
        }
      }
    });

    postApiRequestMultipart('forms/forms-submission', postData, indempotencyKey)
      .then(res => {
        loadingBarRef.current.hideModal();
        dispatch(
          showNotification({
            type: 'success',
            message: res.message,
            buttonText: Strings.Ok,
            buttonAction: async () => {
              const db = await getDBConnection();
              if (db != null) await deleteFormTable(db, form.form_id);
              clearAll();
              dispatch(clearNotification());
              formQuestionViewRef.current.openModal(res);
            },
          }),
        );
      })
      .catch(e => {
        loadingBarRef.current.hideModal();
      });
  };

  const updateFormQuestionsAndClearDB = value => {
    updateFormQuestions(value);
    saveDb(value, '');
  };
  const updateFormQuestions = formQuestionGroups => {
    filterTriggeredQuestions(formQuestionGroups);
    setFormQuestions(formQuestionGroups);
  };

  const onBackPressed = value => {
    props.navigation.goBack();
  };

  return (
    <View style={{flexDirection: 'column', alignSelf: 'stretch', flex: 1}}>
      <FormQuestionView
        ref={formQuestionViewRef}
        isShowCustomNavigationHeader={isShowCustomNavigationHeader}
        form={form}
        formQuestions={formQuestions}
        pageType={pageType}
        updateFormQuestions={updateFormQuestionsAndClearDB}
        onBackPressed={onBackPressed}
        onSubmit={_onSubmit}
      />

      <LoadingBar ref={loadingBarRef} />
    </View>
  );
};

const styles = StyleSheet.create({});
