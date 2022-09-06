import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import QRScanModal from '../../../../components/common/QRScanModal';
import SearchBar from '../../../../components/SearchBar';
import {SubmitButton} from '../../../../components/shared/SubmitButton';
import {Constants} from '../../../../constants';
import ShipmentScanResultView from './components/ShipmentScanResultView';
import StagingShipmentList from './components/StagingShipmentList';
import ScanningListViewModal from './modals/ScanningListViewModal';

const StagingView = props => {
  const {shipments} = props;
  const [keyword, setKeyword] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastScanedQrCode, setLastScannedQrCode] = useState('');
  const captureModalRef = useRef(null);
  const scanningListViewModalRef = useRef(null);

  const onCapture = () => {
    if (captureModalRef && captureModalRef.current) {
      captureModalRef.current.showModal();
    }
  };
  const onCaptureAction = ({type, value}) => {
    if (type == Constants.actionType.ACTION_CAPTURE) {
      setLastScannedQrCode(value);
    }
  };
  const onSearch = keyword => {
    setKeyword(keyword);
  };
  const onItemAction = ({type, item}) => {
    if (type == Constants.actionType.ACTION_VIEW) {
      scanningListViewModalRef.current.showModal();
    }
  };
  return (
    <View style={[styles.container, props.style]}>
      <SearchBar
        isFilter
        onSearch={onSearch}
        suffixButtonIcon="Scan_Icon"
        onSuffixButtonPress={onCapture}
      />
      <QRScanModal
        ref={captureModalRef}
        onButtonAction={onCaptureAction}
        renderLastScanResultView={() => {
          return (
            <ShipmentScanResultView
              items={selectedItems}
              lastScanedQrCode={lastScanedQrCode}
              style={{marginBottom: 20}}
              onClose={() => captureModalRef.current.hideModal()}
              onSubmit={() => captureModalRef.current.hideModal()}
            />
          );
        }}
      />
      <StagingShipmentList
        items={shipments}
        style={{flex: 1}}
        onItemAction={onItemAction}
      />
      <SubmitButton
        title={'Accept All'}
        onSubmit={() => {
          if (props.onPress) {
            props.onPress();
          }
        }}
        style={styles.submitButton}
      />
      <ScanningListViewModal
        ref={scanningListViewModalRef}
        title="Item: 20 00"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submitButton: {
    alignSelf: 'stretch',
    marginHorizontal: 10,
    marginBottom: 16,
  },
});

export default StagingView;
