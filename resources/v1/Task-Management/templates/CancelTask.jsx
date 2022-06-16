import SweetAlert from "react-bootstrap-sweetalert";
import React, {useEffect, useState, Fragment} from 'react';
import {Modal} from "react-bootstrap";
import {UPDATE_TASK} from "../../Auth/Context/AppConstant";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";

let singleDate = null;

const ConfirmationAlert = (props) => {
    const { pageName, taskDataId, taskCompletionDate, cancelOptions, changeStatus } = props;
    const [errors, setErrors] = useState([]);
    const [taskCancelEditorPopupShow, setTaskCancelEditorPopupShow] = useState(true);
    const [selectedTaskOptions, setSelectedTaskOptions] = useState('CANCEL THIS TASK');
    const [dateRange, setDateRange] = useState(false);
    const [date, setDate] = useState('');
    const [toDate, setToDate] = useState('');

    let taskId = taskDataId;
    let taskCompletionData = taskCompletionDate;

    const closeCancelTaskModal = () => {
        setTaskCancelEditorPopupShow(false);
        props.cb();
    }

    const updateTaskStatus = () => {
        console.log(singleDate);
        let updateParams = {task_status: changeStatus, options: selectedTaskOptions, start_date:date, end_date: toDate };
        if(singleDate){
            const date = singleDate.split(" to ");
            updateParams.start_date=date[0];
            updateParams.end_date=date[1];
        }
        console.log(updateParams);
        axios.post(UPDATE_TASK +taskId, updateParams).then(res => {
            if (res.data && res.data.success) {
                toast.success(res.data.msg);
                setTaskCancelEditorPopupShow(false);
                if(pageName == "list"){
                    return window.location.href = "/app/task-app";
                }
                else{
                    return window.location.href = "/app/task-app/detail/"+taskId;
                }
               
            }
        })
      
    }

    const handleCancelChange = (value) => {
        setSelectedTaskOptions(value);
        if(value == "CANCEL WITH DATE RANGE"){
            setDateRange(true);
        }
        else{
            singleDate = null;
            setDateRange(false);
        }
    }

    const handleFilterInputsChangeEvent = (value) => {
        const date = value.split(" to ");
        // setDate(date[0]);
        singleDate = value;
        console.log("From Date -"+date[0]+" To Date -"+date[1]);
    }


    return (
        <Modal show={taskCancelEditorPopupShow}>
            <Modal.Header>
                <Modal.Title> Cancel Task </Modal.Title>
                <button type="button" className="close mt-0" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" onClick={() => { closeCancelTaskModal(false); }}>&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                    <>
                    <div className="row">
                        <div className="col-xl-12">

                            <div className="m-b-30">
                                <div className="card-body">
                                    <div className={"row"}>
                                        <Fragment>
                                            <div className="col-md-12 col-lg-12">
                                                <div className="form-group">
                                                    <label className="font-weight-500"
                                                        htmlFor="order-code">Cancel Options <span
                                                        className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-control" onChange={(e) => handleCancelChange(e.target.value)}>
                                                        <option value={''} disabled={true}>{"Select Cancel Options"}</option>
                                                        {
                                                            cancelOptions.length > 0 && cancelOptions.map((value, i) => (
                                                                <option key={i} value={value.value}> {value.label}</option>
                                                            )) 
                                                        }
                                                    </select>
                                                    {
                                                        errors && errors.length > 0 && <ValidationError array={errors} param={'category'} />
                                                    }
                                                </div>
                                            </div>
                                           
                                            { dateRange && 
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="trans-type">Date Range</label>
                                                        <Flatpickr className="form-control"
                                                            options={{mode: 'range', dateFormat: "Y-m-d", minDate: moment(taskCompletionData).format('YYYY-MM-DD') }} 
                                                            onChange={(date,dateStr) => handleFilterInputsChangeEvent(dateStr)} //, 
                                                        />
                                                    </div> 
                                                </div>
                                            }
                                        </Fragment>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    </>
                    <div className="col-md-12">
                        <div className="act-links mt-2 text-center">
                            <a className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                onClick={() => updateTaskStatus()}
                            >Save</a>
                        </div>
                    </div>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmationAlert;