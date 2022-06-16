import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import TaskContext from "../Context/TaskContext";
import moment from "moment";
import toast from "react-hot-toast";
import {ADD_COMMENT} from "../../Auth/Context/AppConstant";
let user_data = JSON.parse(localStorage.getItem('user-data'));
import axios from "axios";
let TaskId = 0;

const LoggedUserComment = ({created_at, created, comments}) => {
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
                                <p className="command-txt mt-1">{/*<a href="#">@{value.created.name}</a>*/}{comments}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const UserComment = ({created_at, created, comments}) => {
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
                                        className="circle light-blue-clr">{created.name.charAt(0)}
                                    </div>
                                    <div
                                        className="assined-name pl-2">
                                        <h5>{created.name} <span>{moment(created_at).format('DD-MM-YYYY hh:mm a')}</span>
                                        </h5>
                                    </div>
                                </div>
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
    const language = 'en-IN';

    const sendComment = () => {
        axios.post(ADD_COMMENT + TaskId,{source_comments: comment, eng_comments: comment, source_lang_type: language, eng_lang_type: language})
            .then(async res => {
                    if (res.data && res.data.success) {
                        toast.success(res.data.msg);
                        cb();
                    }
                },
                (error) => {
                console.log(error);
                    toast.error('Unauthorized Action');
                }
            )
    }

    return (
        <div className="col-xl-12 col-md-12">
            <div className="card mb-0 mx-1">
                <div className="card-body p-3">
                    <div className="command-box1 mt-0">
                        <div className="d-flex align-items-center assigned-details">
                            <div className="circle light-red-clr mr-3">{name.charAt(0)}</div>
                            <div className="assined-name1">
                                 <textarea className="form-control" placeholder="Ask a question or an post update.."
                                           onChange={(e) => setComment(e.target.value)} value={comment} />
                            </div>
                            <button className="btn btn-md btn-primary ml-3" onClick={() => sendComment()}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Comments = (props) => {
    let {task_id} = useParams();
    TaskId = task_id ? task_id: props.task_id
    const [commentsData, setCommentsData] = useState([]);

    useEffect(async () => {
        console.log('Comments TaskId', task_id ? task_id: props.task_id);
        await getComments();
    }, [props.task_id]);

    const getComments = async () => {
        const { paginator, itemsList } = await props.getComments(TaskId);
        setCommentsData(itemsList);
    }

    return (
        <TaskContext.Consumer>
            {
                context => (
                    <>
                        <div className="row">
                            <div className="col-md-12">

                                <div className="row">
                                    { task_id && <PostComment cb={getComments} name={user_data.name} /> }
                                </div>

                                <div className="card">
                                    <div className="card-body">
                                       {/* <h4 className="mt-0 header-title">{commentsData && commentsData.length > 0 ? "Comments" : "No Comments"}</h4>*/}

                                        <div className="command-card-sec">
                                            <div className="row">
                                                {
                                                    commentsData && commentsData ? commentsData.map((value, i) => (
                                                        <React.Fragment key={i}>
                                                            { value.created.id !== user_data.id && <UserComment created_at={value.created_at} created={value.created} comments={value.eng_comments} /> }
                                                            { value.created.id === user_data.id && <LoggedUserComment created_at={value.created_at} created={null} comments={value.eng_comments} /> }
                                                        </React.Fragment>
                                                    )) : "No Comments!"
                                                }
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
    )
}

export default Comments;