import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import TaskContext from "../Context/TaskContext";
import moment from "moment";
import toast from "react-hot-toast";
import {ADD_COMMENT, DOWNLOAD_FILE, UPLOAD_FILE} from "../../Auth/Context/AppConstant";
let user_data = JSON.parse(localStorage.getItem('user-data'));
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";

let TaskId = 0;
let hideLoadMore = "";

const LoggedUserComment = ({created_at, created, comments, files}) => {
    const fileDownload = (filePath,fileName) => {
        axios.get(DOWNLOAD_FILE + '?key=' + filePath)
        .then(res => {
            if (res.data && res.data.success) {
                let url = res.data.data.file;
                // Create blob link to download
                // const url = window.URL.createObjectURL(new Blob([blob]));
                // console.log(url);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',fileName);

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            }
        })
        .catch((error) => {
            if(error && error.response && error.response.data && error.response.data.errors.length > 0) {
                setErrors(error.response.data.errors);
            }

            if (error && error.response.status === 401) {
                toast.error('unauthorised action');
            }
        })
    }
    return (
        <div className="col-xl-12 col-md-12 text-right" >
            <div
                className="card card-bg cmnt-card-width float-right mb-3">
                <div className="card-body p-3">
                    <div className="command-sec1">
                        <div className="row">
                            <div
                                className="col-md-12 text-right float-right">
                                <div
                                    className="d-flex align-items-center assigned-details  justify-content-end">
                                    <div className="assined-name pl-2">
                                        <h5><span>{moment(created_at).format('DD-MM-YYYY hh:mm a')}</span></h5>
                                    </div>
                                </div>
                                {
                                    files.length > 0 && <>
                                    <img className="file-img" src={'/v1/images/doc.svg'} alt="pdf"/>
                                    <a onClick={() => fileDownload(files[0].s3_key, files[0].file_name)} href="#" title="click to download">{files[0].file_name.substring(0, 50)}</a>
                                    </>
                                }
                                <p className="command-txt mt-1">{/*<a href="#">@{value.created.name}</a>*/}{comments}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const UserComment = ({created_at, created, comments, files}) => {
    const fileDownload = (filePath,fileName) => {
        axios.get(DOWNLOAD_FILE + '?key=' + filePath)
        .then(res => {
            if (res.data && res.data.success) {
                let url = res.data.data.file;
                // Create blob link to download
                // const url = window.URL.createObjectURL(new Blob([blob]));
                // console.log(url);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',fileName);

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            }
        })
        .catch((error) => {
            if(error && error.response && error.response.data && error.response.data.errors.length > 0) {
                setErrors(error.response.data.errors);
            }

            if (error && error.response.status === 401) {
                toast.error('unauthorised action');
            }
        })
    }

    return (
        <div className="col-xl-12 col-md-12" >
            <div
                className="card card-bg-1 cmnt-card-width mb-3">
                <div className="card-body p-3">
                    <div className="command-sec1">
                        <div className="row">
                            <div
                                className="col-md-12 text-left">
                                <div
                                    className="d-flex align-items-center assigned-details">
                                    <div
                                        className="circle light-blue-clr">{ created.name.charAt(0) }
                                    </div>
                                    <div
                                        className="assined-name pl-2">
                                        <h5>{created.name} <span>{moment(created_at).format('DD-MM-YYYY hh:mm a')}</span>
                                        </h5>
                                    </div>
                                </div>
                                {
                                    files.length > 0 && <>
                                    <img className="file-img" src={'/v1/images/doc.svg'} alt="pdf"/>
                                    <a onClick={() => fileDownload(files[0].s3_key, files[0].file_name)} href="#" title="click to download">{files[0].file_name.substring(0, 50)}</a>
                                    </>
                                }
                                <p className="command-txt">{/*<a href="#">@{user_data.name}</a>*/}{comments}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PostComment = ({name, cb}) => {
    const [comment, setComment] = useState('');
    let {task_id} = useParams();
    const language = 'en-IN';

    const [enableSweetAlert, setEnableSweetAlert] = useState(null);

    const sendComment = () => {
        axios.post(ADD_COMMENT + task_id,{source_comments: comment, eng_comments: comment, source_lang_type: language, eng_lang_type: language})
            .then(async res => {
                    if (res.data && res.data.success) {
                        toast.success(res.data.msg);
                        cb();
                        setComment('');
                    }
                },
                (error) => {
                    console.log(error);
                   // toast.error('Unauthorized Action');
                }
            )
    }

    const showAlert = (alertType, alertMsg) => {
        const getSuccessAlert = () => (
            <SweetAlert success title="" onConfirm={() => hideAlert(alertType)}> {alertMsg} </SweetAlert>
        );

        const getAddFile = () => (
            <SweetAlert  title="Add Comments File" onConfirm={() => hideAlert(alertType)} showConfirm={false} showCancel={false}> 
                <div className="row">
                    <div className="col-md-12 pr-3 text-right">
                        <input type="file" onChange={(e) => onFileChange(e)}  /> 
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 pr-3 text-right">
                        <button className="btn btn-info" onClick={() => hideAlert("loading")} title="">
                            <i className="fa fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </SweetAlert>
        );

        const getLoadingAlert = () => (
            <SweetAlert  title="" onConfirm={() => hideAlert(alertType)} showConfirm={false} showCancel={false}> 
               <img style={{ "width": "50%", "height": "30%" }} src="https://www.boasnotas.com/img/loading2.gif" /> 
            </SweetAlert>
        );
        
        console.log(alertType+" - enableSweetAlert - "+enableSweetAlert);
        if(alertType == "success"){
            setEnableSweetAlert(getSuccessAlert());
        }
        else if(alertType == "add_file"){
            setEnableSweetAlert(getAddFile());
        }
        else if(alertType == "loading"){
            setEnableSweetAlert(getLoadingAlert());
        }
    }

    const hideAlert = (alertType) => {
        console.log('Hiding alert...');
        if(alertType == "loading"){
            setEnableSweetAlert(null);
        }
        else{
            setEnableSweetAlert(null);
            return window.location.href = "/app/task-app/detail/"+task_id;
        }
    }

    const onFileChange = (event) => {
        console.log(event.target.files[0]);
        showAlert("loading", "Loading");
        const body = new FormData();
        body.append('file', event.target.files[0]);
        axios.post(UPLOAD_FILE+"?type=comment&task_comment_id="+task_id, body).then(res => {
            if (res.data && res.data.success) {
                hideAlert("loading");
                console.log("File Uploaded Successfully");
                console.log(res.data.data._id);
                showAlert("success", "File Uploaded Successfully");
            }
        });
    }; 

    return (
        <div className="command-box1 mt-0 mb-3">
            <div className="d-flex align-items-center assigned-details">
                <div className="circle light-red-clr mr-3">{name.charAt(0)}</div>
                <div className="assined-name1">
                    <textarea className="form-control" placeholder="Ask a question or an post update.."
                            onChange={(e) => setComment(e.target.value)} value={comment} />
                </div>

                <div className="btn-group dropdown ml-2">
                    <a onClick={() => sendComment()} className="btn btn-primary btn-sm waves-effect waves-light">Send</a>
                    <button type="button" className="btn btn-primary-dark btn-sm waves-effect waves-light dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="#" onClick={() => showAlert("add_file", "add_file")}>Add Attachment</a>
                    </div>
                </div>

            </div>
            {enableSweetAlert}
        </div>
    )
}

const Comments = (props) => {
    let {task_id} = useParams();
    TaskId = task_id ? task_id: props.task_id;
    hideLoadMore = props.hide_load_more == "hide" ? props.hide_load_more : "";
    const [commentsData, setCommentsData] = useState([]);
    const [buttonStatus, setButtonStatus] = useState("show");
    const [defaultStatus, setDefaultStatus] = useState("get");

    useEffect(async () => {
        console.log('Comments TaskId', task_id ? task_id: props.task_id);
        await getComments(defaultStatus);
    }, [props.task_id]);

    const getComments = async (defaultStatus) => {
        if(defaultStatus === undefined){
            setDefaultStatus("insert");
            console.log('Comments Insert');
        }
        if(hideLoadMore == "hide"){
            setDefaultStatus("list");
            const {itemsList, buttonStatus} = await props.getComments(TaskId, "list");
            console.log("Comments List - ", itemsList);
            console.log("Comments Button Status", buttonStatus);
            setCommentsData(itemsList);
            setButtonStatus(buttonStatus);
        }
        else{
            console.log("Call get Comments");
            const {itemsList, buttonStatus} = await props.getComments(TaskId, defaultStatus);
            console.log("Comments List - ", itemsList);
            console.log("Comments Button Status", buttonStatus);
            setCommentsData(itemsList);
            setButtonStatus(buttonStatus);
        }
    }

    return (
        <TaskContext.Consumer>
            {
                context => (
                    <>
                        <div className={props.class ? props.class : "row"}>
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="mt-0 header-title">Comments</h4>
                                        </div>
                                    </div>

                                        { task_id && <PostComment cb={getComments} name={user_data.name} /> }

                                        <div className="command-card-sec">
                                            <div className="row">
                                                {
                                                    commentsData && commentsData ? commentsData.map((value, i) => (
                                                        <React.Fragment key={i}>
                                                            { value.created.id !== user_data.id && <UserComment created_at={value.created_at} created={value.created} comments={value.eng_comments} files={value.upload_file} /> }
                                                            { value.created.id === user_data.id && <LoggedUserComment created_at={value.created_at} created={null} comments={value.eng_comments} files={value.upload_file} /> }
                                                        </React.Fragment>
                                                    )) : "No Comments!"
                                                }
                                            </div>
                                            {props.hide_load_more == "hide" ? "" : 
                                            <div className="col-xl-12 col-md-12 text-center">
                                                { buttonStatus == "show" ? <button className="btn btn-md btn-primary ml-3" onClick={() => getComments("get")}>Load More</button> : ""}
                                            </div> } <br/>
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </TaskContext.Consumer>
    )
}

export default Comments;