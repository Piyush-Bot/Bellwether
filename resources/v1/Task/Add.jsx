import React, {Component, useEffect, useState, useCallback} from 'react';
import ValidationError from "../Common/ValidationError";
import TaskContext from "./Context/TaskContext";
import toast from "react-hot-toast";
import {GET_NON_RIDER_LIST, GET_MASTER_LIST, CREATE_TASK} from "../Auth/Context/AppConstant";
import axios from "axios";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import {Link} from "react-router-dom";
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';

const Add = (props) => {
    const breadCrumbs = [
        {name: "Task List", url: "#", class: "breadcrumb-item"},
        {name: "Add Task", url: "#", class: "breadcrumb-item active"}
    ];
    const [masterData, setMasterData] = useState({});
    const [frequencyMaster, setFrequencyMaster] = useState([]);
    const [variationMaster, setVariationMaster] = useState([]);
    const [nonRider, setNonRider] = useState();
    const [errors, setErrors] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [engTitle, setEngTitle] = useState('');
    const [assignedToUser, setAssignedToUser] = useState('');
    const [completionDate, setCompletionDate] = useState(null);
    const [recurrence, setRecurrence] = useState(false);
    const [frequency, setFrequency] = useState('');
    const [variation, setVariation] = useState('');

    useEffect(() => {
        nonRiderList();
        getMasterData();
    }, []);

    const nonRiderList = () => {
        axios.get(GET_NON_RIDER_LIST)
            .then(res => {
                    if (res.data && res.data.success) {
                        setNonRider(res.data.data);
                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }

    const getMasterData = () => {
         axios.get(GET_MASTER_LIST)
             .then((response) => {
                 if (response.data && response.data.success) {
                     setFrequencyMaster(response.data.data.recurring_type);
                 }
             })
             .catch((error) => {

             });
    }

    const handleFrequencyChange = (value) => {
        setFrequency(value);
        const selectedFrequency = frequencyMaster.filter(val => val.type === value);
        setVariation('');
        if(selectedFrequency.length > 0){
            setVariationMaster(selectedFrequency[0].value);
        } else {
            setVariationMaster([]);
        }
    }

    const handleRecurrenceCheckBox = (value) => {
        setRecurrence(value);
        if(!value){
            setFrequency('');
            setVariation('');
            setVariationMaster([]);
        }
        if(value){ setSelectedDate(null); }
    }

    const createTask = () => {
        axios.post(CREATE_TASK, {
            eng_title: engTitle,
            assigned_to_user: assignedToUser,
            recurrence: recurrence,
            frequency: frequency,
            eng_lang_type: "en-IN",
            variations: variation,
            expected_completion_date_time: completionDate
        })
            .then(res => {
                if (res.data && res.data.success) {
                    toast.success(res.data.msg);
                    return props.history.push('/app/task-app');
                }
            }).catch((error) => {
                setErrors([]);

                if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                    setErrors(error.response.data.errors);
                }
        })
    }

        const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }


        const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }


        const handleSubmit = (files, allFiles) => {
            console.log('All Files', allFiles);
            console.log('Files', files);
            /*console.log(files.map(f => f.meta))*/
            /*allFiles.forEach(f => f.remove())*/
        }


    return (
        <TaskContext.Consumer>
            {
                context => (
                    <React.Fragment>
                        <div className="content">
                            <div className="container-fluid">
                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <div className="col-sm-6">
                                            <h4 className="page-title">Add Task</h4>
                                        </div>
                                        <div className="col-md-6  text-right">
                                            <Link to={"/app/task-app"} className="btn btn-primary btn-sm"><i
                                                className="fa fa-angle-left" aria-hidden="true"> </i> Back</Link>
                                        </div>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-xl-12">

                                        <div className="card m-b-30">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12 col-lg-12">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="task-title">
                                                                Enter your Task<span className="text-danger">*</span>
                                                            </label>
                                                            <textarea className="form-control" value={engTitle}
                                                                      name="task-title" id="task-title"
                                                                      onChange={(e) => setEngTitle(e.target.value)}> </textarea>
                                                            {
                                                                errors && errors.length > 0 ?
                                                                    <ValidationError array={errors}
                                                                                     param={'eng_title'}> </ValidationError> : ''
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 col-lg-6">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="order-code">
                                                                Assign To <span className="text-danger">*</span>
                                                            </label>
                                                            <select className="form-control" value={assignedToUser}
                                                                    onChange={(e) => setAssignedToUser(e.target.value)}>
                                                                <option value={''} disabled={true}>{"Select User"}</option>
                                                                {
                                                                    nonRider && nonRider.map((value, i) => (
                                                                        <option key={value.id} value={value.id}>{value.name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                            {
                                                                errors && errors.length > 0 ?
                                                                    <ValidationError array={errors}
                                                                                     param={'assigned_to_user'}> </ValidationError> : ''
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 col-lg-6">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="date">Completion Date
                                                                { !recurrence && <span className="text-danger">*</span> }
                                                                { recurrence && <span className="text-danger"> (Date disabled)</span> }
                                                            </label>
                                                            <Flatpickr className="form-control"
                                                                       data-enable-time
                                                                       options={{minDate: moment().format('YYYY-MM-DD hh:mm a')}}
                                                                       value={selectedDate}
                                                                       onChange={(date) => { setCompletionDate(date[0]); setSelectedDate(date[0])}}
                                                            />
                                                            { errors && errors.length > 0 && <ValidationError array={errors} param={'expected_completion_date_time'} /> }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12 col-lg-12">
                                                        <div className="form-group mb-2">
                                                            <div className="check-cus">
                                                                <input type="checkbox" id="check-1"
                                                                       value={recurrence} onChange={(e) => handleRecurrenceCheckBox(e.target.checked)} />
                                                                <label htmlFor="check-1">Recurring </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 col-lg-6">
                                                        <div className="form-group">
                                                            <label className="font-weight-500"
                                                                   htmlFor="order-code">Frequency <span
                                                                className="text-danger">*</span>
                                                            </label>
                                                            <select className={!recurrence ? "form-control disabled" : "form-control"} value={frequency}
                                                                    onChange={(e) => handleFrequencyChange(e.target.value)}>
                                                                <option value={''} disabled={true}>{"Select Frequency"}</option>
                                                                {
                                                                    frequencyMaster.length > 0 && frequencyMaster.map((value, i) => (
                                                                        <option key={i} value={value.type}> {value.type}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                            {
                                                                errors && errors.length > 0 && <ValidationError array={errors} param={'frequency'} />
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 col-lg-6">
                                                        <div className="form-group">
                                                            <label className="font-weight-500"
                                                                   htmlFor="order-code">Variations <span
                                                                className="text-danger">*</span></label>
                                                            <select className={variationMaster.length === 0 ? "form-control disabled" : "form-control"}
                                                                    value={variation} disabled={variationMaster.length === 0}
                                                                    onChange={(e) => setVariation(e.target.value)}>
                                                                <option value={''} disabled={true}>{"Select Variation"}</option>
                                                                {
                                                                    variationMaster.length > 0 && variationMaster.map((value, i) =>
                                                                        <option key={i} value={value}> {value}</option>)
                                                                }
                                                            </select>
                                                            { errors && errors.length > 0 && <ValidationError array={errors} param={'variations'} /> }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 col-lg-12">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="date">File
                                                                Upload<span className="text-danger">*</span></label>
                                                            <Dropzone
                                                                getUploadParams={getUploadParams}
                                                                onChangeStatus={handleChangeStatus}
                                                                onSubmit={handleSubmit}
                                                                /*accept="image/!*,audio/!*,video/!*"*/
                                                            />
                                                            {/*<div className="file-upload">

                                                            </div>*/}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12 col-lg-12">
                                                        <div className="act-links mt-3 text-right">
                                                            <Link to={"/app/task-app"}
                                                                  className="btn btn-danger waves-effect waves-light mr-3">Cancel</Link>
                                                            <button
                                                                className="btn btn-success waves-effect waves-light"
                                                                onClick={createTask}>Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </React.Fragment>
                )
            }
        </TaskContext.Consumer>
    );
}
export default Add;