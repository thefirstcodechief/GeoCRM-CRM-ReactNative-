
import React , { useState , useEffect, useRef} from 'react'
import CModal from '../../../../../components/common/CModal';
import { Constants } from '../../../../../constants';
import ReturnDeviceDetailContainer from '../container/ReturnDeviceDetailContainer';

const ReturnDeviceDetailModal = React.forwardRef((props, ref) => {

    const onButtonAction = data => {
        if (props.onButtonAction) {
          props.onButtonAction(data);
        }
        if (ref) {
          ref.current.hideModal();
        }
    };    
    return (        
        <CModal
            ref={ref}
            clearText="Back"
            modalType={Constants.modalType.MODAL_TYPE_BOTTOM}            
            closableWithOutsideTouch
            onClear={() => {
                onButtonAction({ type: Constants.actionType.ACTION_FORM_CLEAR });
            }}
            {...props}>
            <ReturnDeviceDetailContainer {...props} />
        </CModal>  
    )

});

export default ReturnDeviceDetailModal;
