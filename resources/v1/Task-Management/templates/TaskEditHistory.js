import React, {useState, useEffect} from "react";
import moment from "moment";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {HISTORY} from "../../Auth/Context/AppConstant";


const TaskEditHistory = (props) => {
    let {task_id} = useParams();
    // const [data, setData] = useState([]);
    // const [editHistory, setEditHistory] = useState(props.edit_history);
    // console.log(props.edit_history);
   
    // const editHistoryVal = props.edit_history.map((history, i) => {
    //     if(history.action == "EDIT_TASK"){
    //         setData([...data, history]);
    //     }
    //     return history;
    // });

    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Edit Field", scope: "col"},
        {label: "Old Value", scope: "col"},
        {label: "New Value", scope: "col"},
        {label: "Datetime", scope: "col"},
        {label: "Changed By", scope: "col"}
    ];

    useEffect(() => {
    }, []);
    
    return (
        <div className="col-xl-12 col-md-12">
            <div className="card">
                <div className="card-body table-card fix-height-edit">
                    <div className="row">
                        <div className="col-md-6">
                            <h4 className="mt-0 header-title  pl-3">Edit History</h4>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <TableHeader data={tableHead}> </TableHeader>
                            <tbody>
                            {
                                props.edit_history && props.edit_history.length > 0 ? props.edit_history.map((value, i) => (
                                    value.action === "EDIT_TASK" && 
                                    <tr key={i}>
                                        <th>{i + 1}</th>
                                        <td>{value.old_status ? value.old_status : '-'}</td>
                                        <td>{value.old_status_text ? (value.old_status_text.length > 30 ? value.old_status_text.substring(0, 30) + '.....' : value.old_status_text) : '-'}</td>
                                        <td>{value.new_status_text ? (value.old_status == "task_date_time" ? moment(value.new_status_text).format('YYYY-MM-DD HH:mm a') : (value.new_status_text.length > 30 ? value.new_status_text.substring(0, 30) + '.....' : value.new_status_text)) : '-'}</td>
                                        <td>{value.created_at ? moment(value.created_at).format('YYYY-MM-DD hh:mm a') : '-'}</td>
                                        <td>{value.created_user_name ? value.created_user_name : '-'}</td>
                                    </tr>
                                )) : <TableNoDataFound message={'No History Found!'}
                                                       frontSpan={2} backSpan={3}/>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskEditHistory;