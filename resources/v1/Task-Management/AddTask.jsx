import React, {Fragment, useContext, useEffect, useState} from "react";
import axios from "axios";
import {CREATE_TASK, GET_NON_RIDER_LIST, GET_TASK_MASTER_DATA, UPLOAD_FILE, DELETE_FILE} from "../Auth/Context/AppConstant";
import toast from "react-hot-toast";
import TaskContext from "./Context/TaskContext";
import {Link} from "react-router-dom";
import ValidationError from "../Common/ValidationError";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import Select from 'react-select';
import BreadCrumb from "../Common/BreadCrumb";
let token = localStorage.getItem('app-ll-token');

const breadCrumbs = [
    {name: "Tasks", url: "/app/task-app", class: "breadcrumb-item"},
    {name: "Add New", url: "", class: "breadcrumb-item active"}
];

const AddTask = (props) => {
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
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [fileUpload, setFileUpload] = useState([]);
    const [fileRemove, setFileRemove] = useState([]);
    const [categoryMaster, setCategoryMaster] = useState([]);
    const [category, setCategory] = useState('');

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
                })
            .catch(err => {
                toast.error(err);
            })
    }

    const getMasterData = () => {
        axios.get(GET_TASK_MASTER_DATA)
            .then(res => {
                if (res.data && res.data.success) {
                    console.log(res.data.data);
                    setFrequencyMaster(res.data.data.recurring_type);
                    setCategoryMaster(res.data.data.task_category);
                }
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

    const handleCategoryChange = (value) => {
        setCategory(value);
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
        console.log(completionDate);
        const convertDateTime = moment(completionDate).add(-5, 'hours').add(-30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        console.log(convertDateTime);
        console.log(fileUpload); 
        axios.post(CREATE_TASK, {
            eng_title: engTitle,
            assigned_to_user: assignedToUser,
            recurrence: recurrence ? 1 : 0,
            frequency: frequency,
            eng_lang_type: "en-IN",
            variations: variation,
            expected_completion_date_time: convertDateTime,
            upload_file: fileUpload,
            task_category: category,
        })
            .then(res => {
                if (res.data && res.data.success) {
                    toast.success(res.data.msg);
                    // return props.history.push('/app/task-app');
                    return window.location.href='/app/task-app';
                }
            }).catch((error) => {
                setErrors([]);
                if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                    setErrors(error.response.data.errors);
                }
        })
    }

    const getUploadParams = ({ file }) => { 
        return { url: 'https://httpbin.org/post' }
     }

    const handleChangeStatus = ({ meta, file }, status) => { 
        console.log(status);
        console.log("file List - ",fileRemove);
        if(status == "done"){
            const body = new FormData();
            body.append('file', file);
            axios.post(UPLOAD_FILE+"?type=task", body).then(res => {
                if (res.data && res.data.success) {
                    console.log("File Uploaded Successfully");
                    console.log(res.data.data._id);
                    setFileUpload([...fileUpload, res.data.data._id]);
                    setFileRemove([...fileRemove, {file_name: meta.name, id: res.data.data._id }]);
                }
            });
            
        } else if(status == "removed"){
            console.log("Remove Image Backend - ", meta.name);
            const fileNameFilter = [meta.name];
            console.log(fileNameFilter);
            let filteredFilePath = fileRemove.filter(i => fileNameFilter.includes(i.file_name));
            console.log(filteredFilePath);
            console.log(DELETE_FILE+filteredFilePath[0].id);
            axios.get(DELETE_FILE+filteredFilePath[0].id).then(res => {
                if (res.data && res.data.success) {
                    console.log("File Removed Successfully");
                    // fileRemove.splice(fileRemove.findIndex(function(i){ return i.file_name === meta.name; }), 1);
                }
            });
        }
        console.log(fileRemove);
    }

    const handleSubmit = (files, allFiles) => {
        console.log('All Files', allFiles);
        console.log('Files', files);
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

                                    <BreadCrumb breadCrumbs={breadCrumbs}> </BreadCrumb>
                                </div>

                                <div className="row">
                                    <div className="col-xl-12">

                                        <div className="card m-b-30">
                                            <div className="card-body">
                                                <div className={"row"}>
                                                    <div className="col-md-5 col-lg-5">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="task-title">
                                                                Enter your Task<span className="text-danger">*</span>
                                                            </label>
                                                            <textarea className="form-control" value={engTitle}
                                                                      name="task-title" id="task-title" rows={6}
                                                                      onChange={(e) => setEngTitle(e.target.value)}> </textarea>
                                                            {
                                                                errors && errors.length > 0 ?
                                                                    <ValidationError array={errors}
                                                                                     param={'eng_title'}> </ValidationError> : ''
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-md-7 col-lg-7">
                                                        <div className={"row"}>
                                                            <div className="col-md-6 col-lg-6">
                                                                <div className="form-group">
                                                                    <label className="font-weight-500" htmlFor="order-code">
                                                                        Assign To <span className="text-danger">*</span>
                                                                    </label>
                                                                    <Select
                                                                        className="basic-single"
                                                                        classNamePrefix="Select User"
                                                                        isClearable={isClearable}
                                                                        isSearchable={isSearchable}
                                                                        options={nonRider}
                                                                        onChange={(e) => setAssignedToUser(e.value)}
                                                                    />

                                                                    {
                                                                        errors && errors.length > 0 ?
                                                                            <ValidationError array={errors}
                                                                                             param={'assigned_to_user'}> </ValidationError> : ''
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-6 mt-4">
                                                                <div className="form-group mb-2">
                                                                    <div className="check-cus">
                                                                        <input type="checkbox" id="check-1"
                                                                               value={recurrence} onChange={(e) => handleRecurrenceCheckBox(e.target.checked)} />
                                                                        <label htmlFor="check-1">Recurring </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {
                                                                recurrence && <>
                                                                    <div className="col-md-4 col-lg-4">
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
                                                                    <div className="col-md-4 col-lg-4">
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

                                                                    <div className="col-md-4 col-lg-4">
                                                                        <div className="form-group">
                                                                            <label className="font-weight-500"
                                                                                   htmlFor="order-code">Category <span
                                                                                className="text-danger">*</span>
                                                                            </label>
                                                                            <select className="form-control" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                                                                                <option value={''} disabled={true}>{"Select Category"}</option>
                                                                                {
                                                                                    categoryMaster.length > 0 && categoryMaster.map((value, i) => (
                                                                                        <option key={i} value={value._id}> {value.module_name}</option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                            {
                                                                                errors && errors.length > 0 && <ValidationError array={errors} param={'category'} />
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            }

                                                            {
                                                                !recurrence &&
                                                                <Fragment>
                                                                    <div className="col-md-6 col-lg-6">
                                                                        <div className="form-group">
                                                                            <label className="font-weight-500" htmlFor="date">Completion Date
                                                                                <span className="text-danger">*</span>
                                                                            </label>
                                                                            <Flatpickr className="form-control remove-grey"
                                                                                       data-enable-time
                                                                                       options={{minDate: moment().format('YYYY-MM-DD hh:mm a')}}
                                                                                       value={selectedDate}
                                                                                       onChange={(date, dateStr) => { setCompletionDate(dateStr); setSelectedDate(dateStr)}}
                                                                            />
                                                                            { errors && errors.length > 0 && <ValidationError array={errors} param={'expected_completion_date_time'} /> }
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-6 col-lg-6">
                                                                        <div className="form-group">
                                                                            <label className="font-weight-500"
                                                                                   htmlFor="order-code">Category <span
                                                                                className="text-danger">*</span>
                                                                            </label>
                                                                            <select className="form-control" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                                                                                <option value={''} disabled={true}>{"Select Category"}</option>
                                                                                {
                                                                                    categoryMaster.length > 0 && categoryMaster.map((value, i) => (
                                                                                        <option key={i} value={value._id}> {value.module_name}</option>
                                                                                    ))
                                                                                }
                                                                            </select>
                                                                            {
                                                                                errors && errors.length > 0 && <ValidationError array={errors} param={'category'} />
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Fragment>
                                                            }

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row align-items-center">
                                                    <div className="col-md-12 col-lg-12">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="date">File
                                                                Upload<span className="text-danger">*</span></label>
                                                            <Dropzone
                                                                getUploadParams={getUploadParams}
                                                                onChangeStatus={handleChangeStatus}
                                                                onSubmit={false}
                                                                canRemove={true}
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
    )
}

export default AddTask;