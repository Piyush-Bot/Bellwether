import React, {useState, useEffect} from "react";
import TaskContext from "../Context/TaskContext";
import moment from "moment";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {HISTORY} from "../../Auth/Context/AppConstant";
import toast from "react-hot-toast";

const History = () => {
    let {task_id} = useParams();
    const [data, setData] = useState([]);
    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Current Status", scope: "col"},
       /* {label: "Changed By", scope: "col"},*/
        {label: "Changed On", scope: "col"},
        {label: "Status", scope: "col"}
    ];
    useEffect(() => {
        historyDetail();
    }, []);
    const historyDetail = () => {
        axios.get(HISTORY + task_id)
            .then(res => {
                    if (res.data && res.data.success) {
                        setData(res.data.data);
                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }
    return (

        <TaskContext.Consumer>
            {
                context => (
                    <>
                        <div className="col-xl-6 col-md-12">
                            <div className="card">
                                <div className="card-body table-card">
                                    <div className="row">
                                            <div className="col-md-6">
                                                <h4 className="mt-0 header-title  pl-3">History</h4>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <TableHeader data={tableHead}> </TableHeader>
                                                <tbody>
                                                {
                                                    data && data.length > 0 ? data.map((value, i) => (
                                                        <tr key={i}>
                                                            <th>{i + 1}</th>
                                                            <td>{value.task_status_details.length > 0 ? value.task_status_details[0].module_name : '-'}</td>
                                                            {/*<td>{'-'}</td>*/}
                                                            <td>{value.updatedAt ? moment(value.updatedAt).format('YYYY-MM-DD hh:mm a') : '-'}</td>
                                                            <td>{value.task_status_details.length > 0 ? value.task_status_details[1].module_name : '-'}</td>
                                                        </tr>
                                                    )) : <TableNoDataFound message={'No History Found!'}
                                                                           frontSpan={3} backSpan={2}/>

                                                }
                                                </tbody>
                                            </table>
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

export default History;