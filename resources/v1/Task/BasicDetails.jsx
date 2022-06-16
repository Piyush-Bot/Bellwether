import React, {useEffect, useState} from 'react';
import {MomentDateFormat} from "../Common/MomentDateFormat";
import toast from "react-hot-toast";
import moment from "moment";
import axios from "axios";
import {UPDATE_TASK} from "../Auth/Context/AppConstant";
import TaskContext from "./Context/TaskContext";
import { confirm } from "react-confirm-box";
let statusName = '';
let title = "";
let showMoreStatus = "";
const BasicDetail = (props) => {
    const[sourceTitle, setSourceTitle] = useState(props.taskData.data.source_title && props.taskData.data.source_title.length > 150 ?  props.taskData.data.source_title.substring(0, 150) + '......' : props.taskData.data.source_title);
    const[englishTitle, setEnglishTitle] = useState(props.taskData.data.eng_title.length > 150 ?  props.taskData.data.eng_title.substring(0, 150) + '......' : props.taskData.data.eng_title);
    const [showAction, setShowAction ] =  useState(props.taskData.data.eng_title.length > 150 ? "Show More" : '');
    useEffect(() => {

    }, []);

    const updateStatus = async (task_id, status_id, module_name) => {
        const result = await confirm("Are you sure?");
        if (result) {
            statusName = module_name;
            axios.post(UPDATE_TASK + task_id, {task_status: status_id})
                .then(res => {
                    if (res.data && res.data.success) {
                        props.getTaskData();
                        toast.success(res.data.msg);
                    }
                })
        }

    }

    const showMore = () => {
        setShowAction(showAction === "Show More" ? "Show Less" : "Show More");
       props.languageStatus === false ? setEnglishTitle(showAction === "Show More" ? props.taskData.data.eng_title : props.taskData.data.eng_title.substring(0, 150) + '......'):
       setSourceTitle(showAction === "Show More" ? props.taskData.data.source_title : props.taskData.data.source_title.substring(0, 150) + '......')

    }
    return (
        <TaskContext.Consumer>
            {
                context => (
                    <>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card m-b-30">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">

                                            <h5 className="pending-clr ">{props.taskData && props.taskData.data && props.taskData.data.task_id ? props.taskData.data.task_id : '-'}</h5>
                                            <div className="dropdown card-dropdown">
                                                <div className="dropdown-toggle card-dots" type="button"
                                                     id="dropdownMenuButton"
                                                     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <span className="dots"> </span>
                                                    <span className="dots"> </span>
                                                    <span className="dots"> </span>
                                                </div>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    {
                                                        context.masterData && context.masterData.data.length > 0 ? context.masterData.data[0].task_status.map((option, i) => (
                                                            <a key={i} className="dropdown-item" href="#" onClick={() => {
                                                                updateStatus(props.task_id, option._id, option.module_name)
                                                            }}>
                                                                {option.module_name}</a>
                                                        )) : null
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                        <h4>
                                            { props.languageStatus === true ? sourceTitle : englishTitle }
                                        </h4>
                                        {
                                            showAction ?
                                                <div className="text-right  mb-3">
                                                    <a href="#" className="showMorebtn" onClick={showMore}
                                                       id="textButton">
                                                        {showAction}
                                                    </a>
                                                </div>
                                                : null
                                        }

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center assigned-details">
                                                <div className="circle light-blue-clr">N</div>
                                                <div className="assined-name pl-2">
                                                    <span>Assigned By</span>
                                                    <h5>{props.taskData && props.taskData.assign_by_user_name ? props.taskData.assign_by_user_name : '-'}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center assigned-details">
                                                <div className="circle light-red-clr">P</div>
                                                <div className="assined-name pl-2">
                                                    <span>Assigned To</span>
                                                    <h5>{props.taskData && props.taskData.assign_to_user_name ? props.taskData.assign_to_user_name : '-'}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center assigned-details">
                                                <div
                                                    className="badge badge-pending pending-clr">{props.taskData && props.taskData.data && props.taskData.data.task_status_details.description && statusName === '' ?  props.taskData.data.task_status_details.description : statusName}</div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div className="d-flex align-items-center date-details">
                                                <div className="pending-clr"><i className="fa fa-calendar-check-o"
                                                                                aria-hidden="true"> </i></div>
                                                <div className="assined-name pl-2">
                                                    <span>Created</span>
                                                    <h5>{props.taskData && props.taskData.data && props.taskData.data.task_date_time ? moment(props.taskData.data.task_date_time).format('YYYY-MM-DD hh:mm a') : '-'}</h5>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center date-details">
                                                <div className="pending-clr"><i className="fa fa-calendar-check-o"
                                                                                aria-hidden="true"> </i></div>
                                                <div className="assined-name pl-2">
                                                    <span>Expected</span>
                                                    <h5>{props.taskData && props.taskData.data && props.taskData.data.completion_date_time ? moment(props.taskData.data.completion_date_time).format('YYYY-MM-DD hh:mm a') : '-'}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </TaskContext.Consumer>
    );


}
export default BasicDetail;