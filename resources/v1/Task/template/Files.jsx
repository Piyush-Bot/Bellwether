import React, {useEffect, useState} from "react";
import moment from "moment";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";
import axios from "axios";
import {GET_TASK_DETAIL} from "../../Auth/Context/AppConstant";
import toast from "react-hot-toast";

const Files = (props) => {
    const [taskData, setTaskData] = useState([]);
    const [data, setData] = useState([]);
    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Name", scope: "col"},
        {label: "Size", scope: "col"},
        {label: "Upload On", scope: "col"},
        {label: "Action", scope: "col", class: "text-right"}
    ];

    useEffect(() => {
        console.log('TaskIdbbbb', props.task_id);
        props.task_id ? taskDetail() : '';
    }, [props.task_id]);

    const taskDetail = () => {
        axios.get(GET_TASK_DETAIL + props.task_id)
            .then(res => {
                    if (res.data && res.data.success) {
                        console.log('Detail Data', res.data.data);
                        setTaskData(res.data.data);
                        setData(res.data.data);
                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }

    return (
        <>

            <div className="table-responsive">
                <table className="table">
                    <TableHeader data={tableHead}/>
                    <tbody>
                    {
                        taskData && taskData.data && taskData.data.upload_file.length > 0 ? taskData.data.upload_file.map((value, i) => (
                            <tr key={i}>
                                <th>{i + 1}</th>
                                <td><img className="file-img" src={'/v1/images/doc.svg'}
                                         alt="pdf"/> {value.file_name} </td>

                                {/*value.filetype === "doc" ?
                                                                <img className="file-img" src="/v1/images/pdf.svg"
                                                                     alt="pdf"/> {value.file_name} : null
                                                                value.filetype === "doc" ?
                                                                <img className="file-img" src="/v1/images/pdf.svg"
                                                                     alt="pdf"/> {value.file_name} : null*/
                                }
                                <td>{value.file_size ? value.file_size + " Bytes" : 0} </td>
                                <td>{value.created_at ? moment(value.created_at).format('YYYY-MM-DD') : '-'}</td>
                                <td className="text-right">
                                    <div className="act-links">
                                        <a href={value.file_path}
                                           className="btn btn-primary btn-sm "
                                           data-toggle="tooltip"
                                           data-placement="top" title=""
                                           data-original-title="Download"> <i
                                            className="fa fa-download"> </i> </a>
                                    </div>
                                </td>
                            </tr>
                        )) : <TableNoDataFound message={'No Files Found!'}
                                               frontSpan={3} backSpan={2}/>
                    }
                    </tbody>
                </table>
            </div>

        </>

    )
}
export default Files;
