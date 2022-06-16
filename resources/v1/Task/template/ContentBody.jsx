import React, {useEffect, useState} from "react";
import TaskContext from "../Context/TaskContext";
import moment from "moment";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";
import {UPDATE_TASK} from "../../Auth/Context/AppConstant";
import axios from "axios";
import {PaginationCount} from "../../Common/PaginationCount";
import Pagination from "react-js-pagination";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";
import Files from "./Files";
import Comments from "./Comments";
import { confirm } from "react-confirm-box";

let token = localStorage.getItem('app-ll-token');

const ContentBody = (props) => {
    const [taskStatus, setTaskStatus] = useState('');
    const [trAction, setTrAction] = useState('active-table');
    const [activeClass, setActiveClass] = useState('');
    const [selectedTr, setSelectedTr] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const[activeDiv, setActiveDiv] = useState('description');
    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Task Id", scope: "col"},
        {label: "Task Title", scope: "col"},
        {label: "Assigned By", scope: "col"},
        {label: "Assigned To", scope: "col"},
        {label: "Created At", scope: "col"},
        {label: "Expected At", scope: "col"},
        {label: "Status", scope: "col"},
        {label: "Action", scope: "col", class: "text-right"}
    ];
    useEffect(() => {
        setSelectedTr(null)
    }, [props.activePage]);

    const activeRow = (value) => {
        setActiveDiv('description');
        setSelectedTr(value);
        setTrAction(trAction === 'active-table' ? '' : 'active-table');
        setActiveClass(trAction === 'active-table' ? "accordian-body collapse show" : 'collapse');
    }
    const updateTaskId = (task_id, tab) => {
        setActiveDiv(tab);
        console.log('TaskIssue', task_id);
        setSelectedTaskId(task_id)
    }
    const updateStatus = async (task_id, status_id, previousStatus) => {
        const result = await confirm("Are you sure?");
        if (result) {
            setTaskStatus(status_id);
            task_id !==0 ?  axios.post(UPDATE_TASK + task_id, {task_status: status_id})
                .then(res => {
                    if (res.data && res.data.success) {
                        props.getTaskData();
                        toast.success(res.data.msg);
                    }
                }) : null
        }
        else {
            task_id !==0 ?   props.getTaskData() : null;
        }

    }
    return (
        <TaskContext.Consumer>
            {
                context => (
                    <>
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <TableHeader data={tableHead}/>
                                        <tbody>
                                        <>
                                            {
                                                 context.taskData && context.taskData.itemsList && context.taskData.itemsList.length > 0 ? context.taskData.itemsList.map((value, i) => (
                                                    <React.Fragment key={i}>
                                                        <tr id={"Id" + i + 1}
                                                            className={"Id" + selectedTr + 1 === "Id" + i + 1 ? trAction : ''}>
                                                            <th className="text-center">{context.slNo + (i)}</th>
                                                            <td>
                                                                <a id="collapse" className="id-link accordion-toggle" href="#" onClick={() => activeRow(i)}
                                                                   data-toggle="collapse" data-target="#demo1">#{value.task_id ? value.task_id : '-'}</a>
                                                            </td>
                                                            <td>{value.eng_title.length > 50 ? value.eng_title.substring(0, 50) + '.....' : value.eng_title}</td>
                                                            <td>{value.assigned_by_user ? value.assigned_by_user.name : '-'}</td>
                                                            <td>{value.assigned_to_user ? value.assigned_to_user.name : '-'}</td>
                                                            <td>{value.task_date_time ? moment(value.task_date_time).format('YYYY-MM-DD') : '-'}</td>
                                                            <td>{value.task_date_time ? moment(value.task_date_time).format('YYYY-MM-DD') : '-'}</td>
                                                            <td>
                                                                <select
                                                                    className="form-control table-select-box task-status"
                                                                    onChange={(e) => {
                                                                        updateStatus(value.id, e.target.value, value.task_status);
                                                                       task_id !==0 ? context.getFilterStatus('') : null;
                                                                    }}
                                                                    value={value.task_status ? value.task_status : ''}>
                                                                    <option key={value.task_status_details._id}
                                                                            value={value.task_status_details._id}>{value.task_status_details.module_name}</option>
                                                                    {
                                                                         value.next_status_allowed.length > 0 && value.next_status_allowed.map((option, i) => (
                                                                            <option key={option._id}
                                                                                value={option._id}>{option.module_name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <Link
                                                                    to={'/app/task-app/detail/' + value._id}>
                                                                    <div className="act-links btn btn-warning btn-sm "
                                                                         data-toggle="tooltip"
                                                                         data-placement="top" title=""
                                                                         data-original-title="View"><i
                                                                        className="fa fa-eye"> </i>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                        <tr key={"demo" + i + 1} className={"demo" + selectedTr + 1 === "demo" + i + 1 ? activeClass : 'collapse'}
                                                            id={"demo" + i + 1}>
                                                            <td className="" colSpan="9">
                                                                <div className="collapse-table-cnt">
                                                                    <ul className="nav nav-tabs collapse-tab mb-3"
                                                                        role="tablist">
                                                                        <li className="nav-item"
                                                                            onClick={() => updateTaskId(value._id, 'description')}>
                                                                            <a className="nav-link active"
                                                                               data-toggle="tab"
                                                                               href={'#description' + selectedTr}
                                                                               role="tab">
                                                                    <span
                                                                        className="d-none d-md-block">Description</span><span
                                                                                className="d-block d-md-none"><i
                                                                                className="mdi mdi-home-variant h5"> </i></span>
                                                                            </a>
                                                                        </li>
                                                                        <li className="nav-item"
                                                                            onClick={() => updateTaskId(value._id, 'file')}>
                                                                            <a className="nav-link" data-toggle="tab"
                                                                               href={'#file' + selectedTr}
                                                                               role="tab">
                                                                    <span
                                                                        className="d-none d-md-block">Files</span><span
                                                                                className="d-block d-md-none"><i
                                                                                className="mdi mdi-account h5"> </i> </span>
                                                                            </a>
                                                                        </li>
                                                                        <li className="nav-item"
                                                                            onClick={() => updateTaskId(value._id, 'command')}>
                                                                            <a className="nav-link" data-toggle="tab"
                                                                               href={'#command' + selectedTr}
                                                                               role="tab">
                                                                    <span
                                                                        className="d-none d-md-block">Comments</span><span
                                                                                className="d-block d-md-none"><i
                                                                                className="mdi mdi-email h5"> </i></span>
                                                                            </a>
                                                                        </li>
                                                                    </ul>

                                                                    <div
                                                                        className="tab-content collapse-table-tab-pane">
                                                                        <div
                                                                            className={activeDiv === "description" && 'description' + selectedTr === 'description' + i ? "tab-pane collapse-tab-cnt mt-0 p-0 active" : 'tab-pane collapse-tab-cnt mt-0 p-0'}
                                                                            id={'description' + selectedTr}
                                                                            role="tabpanel">
                                                                            <div className="card mb-0">
                                                                                <div className="card-body">
                                                                                    <p className="mb-0 pb-0">
                                                                                        {value.eng_title ? value.eng_title : '-'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className={activeDiv === "file" && 'file' + selectedTr === 'file' + i ? "tab-pane collapse-tab-cnt mt-0 p-0 active" : 'tab-pane collapse-tab-cnt mt-0 p-0'}
                                                                            id={'file' + selectedTr}
                                                                            role="tabpanel">
                                                                            <div className="row">
                                                                                <div
                                                                                    className="col-xl-12 col-lg-12 col-md-12">
                                                                                    <div className="card mb-0">
                                                                                        <div
                                                                                            className="card-body table-card py-0">
                                                                                            { "demo" + selectedTr + 1 === "demo" + i + 1 && <Files task_id={selectedTaskId} /> }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div
                                                                            className={activeDiv === "command" && 'command' + selectedTr === 'command' + i ? "tab-pane collapse-tab-cnt mt-0 p-0 active" : 'tab-pane collapse-tab-cnt mt-0 p-0'}
                                                                            id={'command' + selectedTr}
                                                                            role="tabpanel">


                                                                            {
                                                                                "demo" + selectedTr + 1 === "demo" + i + 1 ?
                                                                                    <Comments
                                                                                        task_id={selectedTaskId}
                                                                                        getComments={context.getComments}> </Comments> : null
                                                                            }

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                )) : <TableNoDataFound message={'No Task Found!'}
                                                                       frontSpan={4} backSpan={4}/>
                                            }
                                        </>
                                        </tbody>

                                    </table>
                                </div>
                                <div className="float-left">
                                    {
                                        context.taskData.paginator && context.taskData.paginator.itemCount > 0 ?
                                            <PaginationCount currentPage={context.taskData.paginator.currentPage}
                                                             totalRecords={context.taskData.paginator.itemCount}/> : null
                                    }

                                </div>
                                <div className="float-right mt-2 pr-3">
                                    <div className="Page navigation example">
                                        {
                                            context.taskData.paginator && context.taskData.paginator.itemCount > 0 ?
                                                <Pagination
                                                    activePage={context.taskData.paginator.currentPage ? context.taskData.paginator.currentPage : 0}
                                                    itemsCountPerPage={context.taskData.paginator.perPage ? context.taskData.paginator.perPage : 0}
                                                    totalItemsCount={context.taskData.paginator.itemCount ? context.taskData.paginator.itemCount : 0}
                                                    pageRangeDisplayed={context.taskData.paginator.perPage ? context.taskData.paginator.perPage : 0}
                                                    onChange={context.handlePageChange.bind(this)}
                                                />
                                                : null
                                        }
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
export default ContentBody;