import React, {useState, useEffect} from "react";
import moment from "moment";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {HISTORY} from "../../Auth/Context/AppConstant";


const TaskHistory = (props) => {
    let {task_id} = useParams();
    // const [data, setData] = useState([]);
    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Status", scope: "col"},
        {label: "Changed to", scope: "col"},
        {label: "Datetime", scope: "col"},
        {label: "Changed By", scope: "col"}
    ];

    useEffect(() => {
        // historyDetail();
    }, []);

    /*
    const historyDetail = () => {
        axios.get(HISTORY + task_id)
            .then(res => {
                    if (res.data && res.data.success) {
                        setData(res.data.data);
                    }
                })
            .catch((error) => {
                console.log(error);
            })
    }
    */
    return (
        <div className="col-xl-6 col-md-12">
            <div className="card">
                <div className="card-body table-card fix-height">
                    <div className="row">
                        <div className="col-md-6">
                            <h4 className="mt-0 header-title  pl-3">Status History</h4>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <TableHeader data={tableHead}> </TableHeader>
                            <tbody>
                            {
                                props.status_history && props.status_history.length > 0 ? props.status_history.map((value, i) => (
                                    <tr key={i}>
                                        <th>{i + 1}</th>
                                        <td>{value.task_status_details.length > 0 ? value.task_status_details[1].module_name : '-'}</td>
                                        <td>{value.task_status_details.length > 0 ? value.task_status_details[0].module_name : '-'}</td>
                                        <td>{value.updatedAt ? moment(value.updatedAt).format('YYYY-MM-DD hh:mm a') : '-'}</td>
                                        <td>{value.diff.ll_dp_transaction[i] && value.diff.ll_dp_transaction[i].length > 0 ? value.diff.ll_dp_transaction[i][0].created_user_name ? value.diff.ll_dp_transaction[i][0].created_user_name : "-"  : "-"}</td>
                                    </tr>
                                )) : <TableNoDataFound message={'No History Found!'}
                                                       frontSpan={2} backSpan={2}/>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskHistory;