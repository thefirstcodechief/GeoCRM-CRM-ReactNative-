
import React from 'react'
import CModal from '../../../../components/common/CModal';
import { Constants } from '../../../../constants';
import AddLeadContainer from './containers/AddLeadContainer';

const AddLeadModal = React.forwardRef((props, ref) => {
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
            modalType={Constants.modalType.MODAL_TYPE_BOTTOM}
            closableWithOutsideTouch
            onClear={() => {
                onButtonAction({ type: Constants.actionType.ACTION_FORM_CLEAR });
            }}
            {...props}>
            <AddLeadContainer {...props} />
        </CModal>        
    )
});

export default AddLeadModal;
