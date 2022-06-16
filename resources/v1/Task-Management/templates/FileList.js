import React, {useEffect, useState} from "react";
import TableHeader from "../../Common/TableHeader";
import moment from "moment";
import TableNoDataFound from "../../Common/TableNoDataFound";
import { DOWNLOAD_FILE, GET_TASK_DETAIL, UPLOAD_FILE, DELETE_FILE } from "../../Auth/Context/AppConstant";
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";
let user_data = JSON.parse(localStorage.getItem('user-data'));

const tableHead = [
    {label: "Sl.No", scope: "col"},
    {label: "Name", scope: "col"},
    {label: "Size", scope: "col"},
    {label: "Upload On", scope: "col"},
    {label: "Action", scope: "col", class: "text-right"}
];

const FileList = (props) => {
    let {task_id} = props.task_id;
    const [files, setFiles] = useState(false);
    const [taskCreated, setTaskCreated] = useState("");

    const [enableSweetAlert, setEnableSweetAlert] = useState(null);

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

    const taskDetail = () => {
        console.log(GET_TASK_DETAIL + props.task_id);
        axios.get(GET_TASK_DETAIL + props.task_id)
            .then(res => {
                    if (res.data && res.data.success) {
                        // console.log('File Data', res.data.data.data.upload_file);
                        setFiles(res.data.data.data.upload_file);
                        setTaskCreated(res.data.data.data.created_by);
                    }
                })
            .then(error => {
                console.log(error);
            })
    }

    const deleteFile = (id) => {
        console.log("Delete File URL - "+DELETE_FILE+id);
        axios.get(DELETE_FILE+id).then(res => {
            if (res.data && res.data.success) {
                console.log("File Removed Successfully");
                showAlert("success", "File Removed Successfully");
            }
        });
    }

    const showAlert = (alertType, alertMsg) => {
        const getSuccessAlert = () => (
            <SweetAlert success title="" onConfirm={() => hideAlert(alertType)}> {alertMsg} </SweetAlert>
        );

        const getAddFile = () => (
            <SweetAlert  title="Add File" onConfirm={() => hideAlert(alertType)} showConfirm={false} showCancel={false}> 
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
            if(props.pageName == "list"){
                return window.location.href = "/app/task-app";
            }
            else{
                return window.location.href = "/app/task-app/detail/"+props.task_id;
            }
        }
    }

    useEffect(() => {
        taskDetail();
    }, []);

    const onFileChange = (event) => {
        console.log(event.target.files[0]);
        showAlert("loading", "Loading");
        const body = new FormData();
        body.append('file', event.target.files[0]);
        axios.post(UPLOAD_FILE+"?type=task_detail&id="+props.task_id, body).then(res => {
            if (res.data && res.data.success) {
                hideAlert("loading");
                console.log("File Uploaded Successfully");
                console.log(res.data.data._id);
                showAlert("success", "File Uploaded Successfully");
            }
        });
    }; 

    return (
            <div className={props.class ? props.class : "col-xl-6 col-md-12"}>
                <div className="card m-b-30">
                    <div className="card-body table-card fix-height">
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="mt-0 header-title  pl-3">Files</h4>
                            </div>
                            { taskCreated !== user_data.id ?  "" :
                                <div className="col-md-6 pr-3 text-right">
                                    <button className="btn btn-primary btn-sm waves-effect waves-light mr-3" 
                                            onClick={() => showAlert("add_file", "add_file")}>
                                        <i className="fa fa-plus mr-1" aria-hidden="true"> </i>
                                        Add File
                                    </button>
                                </div>
                            }
                        </div>

                        <div className="table-responsive">
                            <table className="table">
                                <TableHeader data={tableHead}/>
                                <tbody>
                                {
                                    files.length > 0 ? files.map((value, i) => (
                                        <tr key={i}>
                                            <th>{i + 1}</th>
                                            <td><img className="file-img" src={'/v1/images/doc.svg'} alt="pdf"/>
                                                <a onClick={() => fileDownload(value.s3_key, value.file_name)} href="#" title="click to download">{value.file_name.substring(0, 30)}</a>
                                            </td>
                                            <td>{value.file_size ? (value.file_size/1000).toFixed(0) + " KB" : 0} </td>
                                            <td>{value.created_at ? moment(value.created_at).format('YYYY-MM-DD') : '-'}</td>
                                            <td className="text-right">
                                                <div className="act-links">
                                                { taskCreated == user_data.id ?
                                                    <button className="btn btn-danger" onClick={() => deleteFile(value._id)} title="Delete File">
                                                        <i className="fa fa-trash"></i>
                                                    </button>  : "-"
                                                }
                                                </div>
                                            </td>
                                        </tr>
                                    )) : <TableNoDataFound message={'No Files Found!'}
                                                           frontSpan={2} backSpan={2}/>
                                }
                                </tbody>
                            </table>
                           
                            {enableSweetAlert}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default FileList;