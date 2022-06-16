import SweetAlert from "react-bootstrap-sweetalert";
import React from "react";

const ConfirmationAlert = (props) => {
    const { onConfirm, cancel } = props;
    return (
        <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, Change it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={onConfirm}
            onCancel={cancel}
            focusCancelBtn
        >
        </SweetAlert>
    )
}

export default ConfirmationAlert;