import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import { UPLOAD_FILE, UPLOAD_FILE_BULK, GET_TASK_ID, FIND_USER_IDS, GET_BULK_UPLOAD_TASK_HISTORY, DOWNLOAD_FILE, DELETE_FILE} from "../Auth/Context/AppConstant";
import toast from "react-hot-toast";
import TaskContext from "./Context/TaskContext";
import {Link} from "react-router-dom";
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import xlsx from 'xlsx';
import moment from "moment";
import BreadCrumb from "../Common/BreadCrumb";
import Pagination from "react-js-pagination";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import { PaginationCount } from "../Common/PaginationCount";
import SweetAlert from "react-bootstrap-sweetalert";

let search_value = '';

const BulkUpload = (props) => {

    const [taskHistoryData, setTaskHistoryData] = useState([]);
    const [serialNo, setSerialNo] = useState(1);

    const [paginationValues, setPaginationValues] = useState({
        currentPage: 1,
        perPage: 10,
        totalRecords: 0
    });

    const [batchDetails, setBatchDetails] = useState([]);
    const [fileDetails, setFileDetails] = useState([]);

    const [excelSheetData, setExcelSheetData] = useState([]);
    const [submitButtonFlag, setSubmitButtonFlag] = useState(false);
    const [mainTaskIds, setMainTaskIds] = useState([]);

    const [enableSweetAlert, setEnableSweetAlert] = useState(null);

    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Uploaded File", scope: "col"},
        {label: "Upload Date Time", scope: "col"},
        {label: "Upload Result", scope: "col"},
        {label: "File Size", scope: "col"},
        {label: "Total", scope: "col"},
        {label: "Success", scope: "col"},
        {label: "Failure", scope: "col"}
    ];

    const breadCrumbs = [
        {name: "Task Management", url: "/app/task-app", class: "breadcrumb-item"},
        {name: "Excel File Upload", url: "", class: "breadcrumb-item active"}
    ];

    useEffect(() => {
        getBulkUploadTaskList(1);
    }, []);

    const getBulkUploadTaskList = (activePage) => {
        axios.get(GET_BULK_UPLOAD_TASK_HISTORY + '?q=' + search_value + '&page=' + activePage).then(res => {
            if (res.data.success) {
                setDataAndPagination(res.data);
            }
        }).catch(function (error) {
            if (error) { alert(error.response.data.errors); }
            else { alert('unauthorized action'); }
        });
    };

    const handlePageChange = (pageNumber) => {
        getBulkUploadTaskList(pageNumber);
    };

    const setDataAndPagination = (data) => {
        console.log("setDataAndPagination - ", data.data.task_data.paginator);
        setTaskHistoryData(data.data.task_data.itemsList);
        setPaginationValues({
            perPage: data.data.task_data.paginator.perPage,
            totalRecords: data.data.task_data.paginator.itemCount,
            currentPage: parseInt(data.data.task_data.paginator.currentPage)
        });
        setSerialNo((data.data.task_data.paginator.currentPage * 10) - 9);
    };
    
    const getUploadParams = ({ meta }) => { 
        const url = 'https://httpbin.org/post';
        return { url, meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` } }
    }

    const showAlert = (alertType, alertMsg) => {
        const getSuccessAlert = () => (
            <SweetAlert success title="" onConfirm={() => hideAlert(alertType)}> {alertMsg} </SweetAlert>
        );

        const getWarningAlert = () => (
            <SweetAlert warning title="" onConfirm={() => hideAlert(alertType)}> {alertMsg} </SweetAlert>
        );

        const getLoadingAlert = () => (
            <SweetAlert  title="" onConfirm={() => hideAlert(alertType)} showConfirm={false} showCancel={false}> 
                <img style={{ "width": "50%", "height": "30%" }} src="https://www.boasnotas.com/img/loading2.gif" /> 
            </SweetAlert>
        );

        console.log("enableSweetAlert -"+enableSweetAlert);
        if(alertType == "success"){
            setEnableSweetAlert(getSuccessAlert());
        }
        else if(alertType == "warning"){
            setEnableSweetAlert(getWarningAlert());
        }
        else if(alertType == "loading"){
            setEnableSweetAlert(getLoadingAlert());
        }
    }

    const hideAlert = (alertType) => {
        console.log('Hiding alert...');
        if(alertType == "success"){
            setEnableSweetAlert(null);
            return window.location.href = "/app/task-app/bulk/upload";
        }
        else if(alertType == "warning"){
            setEnableSweetAlert(null);
            return window.location.href = "/app/task-app/bulk/upload";
        }
        else if(alertType == "loading"){
            setEnableSweetAlert(null);
        }
    }

    const handleChangeStatus = async ({ meta, file }, status) => { 
        console.log("handleChangeStatus - ",status);
        if(status == "preparing"){
            console.log(status+" - File Upload");
            const body = new FormData();
            body.append('file', file);
            await axios.post(UPLOAD_FILE+"?type=bulk_task", body).then(res => {
                if (res.data && res.data.success) {
                    console.log("File Uploaded Successfully");
                    console.log(res.data.data);
                    setBatchDetails(res.data.data);
                    setFileDetails(res.data.data);
                }
            });
        }
        else if(status == "getting_upload_params"){
        }
        else if(status == "uploading"){
            const reader = new FileReader();
            reader.onload = async (file) => {
                const data = file.target.result;
                const workbook = xlsx.read(data, { type: "array", cellDates:true, cellNF: false, cellText:false});
                const sheetName = workbook.SheetNames;
                console.log(sheetName.length);

                let sheetData = [];
                for(let i=0; i<sheetName.length; i++){
                    console.log("Sheet Name - "+sheetName[i]);
                    if(sheetName[i] == "Task List"){
                        const myHeader = ["assigned_to_user_name","assigned_to_user_phone","eng_title","task_category","recurrence","expected_completion_date_time","frequency","variations"];
                        sheetData = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName[i]], {
                            blankrows: false,
                            header: myHeader,
                            raw: false,
                            dateNF:"DD/MM/YYYY"
                        });
                        let newSheetArr = [];
                        sheetData.some(sheet => { 
                            if(sheet.assigned_to_user_name && sheet.assigned_to_user_name != "ERP Username"){
                                sheet.rowNo = sheet.__rowNum__; newSheetArr.push(sheet); 
                            }
                            else if(sheet.assigned_to_user_phone && sheet.assigned_to_user_name != "ERP Username"){
                                sheet.rowNo = sheet.__rowNum__; newSheetArr.push(sheet); 
                            }
                        });
                        console.log("Excel Sheet Data's - ",newSheetArr);
                        setExcelSheetData(newSheetArr);
                    }
                    
                }
            };
            reader.readAsArrayBuffer(file);
        }
        else if(status == "headers_received"){
        }
        else if(status == "done"){
            console.log("Maximum allowed - "+excelSheetData.length+"-"+fileDetails);
            if(parseInt(excelSheetData.length) > 100){
                if(fileDetails){
                    console.log(DELETE_FILE+fileDetails._id);
                    axios.get(DELETE_FILE+fileDetails._id).then(res => {
                        if (res.data && res.data.success) {
                            console.log("File Removed Successfully");
                        }
                    });
                }
                showAlert("warning", "Maximum 100 rows allowed to upload.");
            }
            else{
                console.log(status+" - Find User Details - ", excelSheetData);
                await axios.post(FIND_USER_IDS, { sheet_data: excelSheetData }).then(res => {
                    if (res.data && res.data.success) {
                        setExcelSheetData(res.data.data);
                        setSubmitButtonFlag(true);
                        console.log("Add User IDs and Task IDs to Excel sheet data - ", res.data.data);
                         /*
                        let sheetDataLength = excelSheetData.length;
                        let taskIds = [];
                        console.log(status+" - Get Main Task Ids");
                        console.log(excelSheetData);
                       
                        axios.get(GET_TASK_ID+sheetDataLength).then(res => {
                            console.log(res.data.data);
                            if (res.data && res.data.success) {
                                excelSheetData.map((sheetdet, i) => {
                                    i++;
                                    sheetdet.main_task_id
                                    taskIds.push({main_task_id: parseInt(res.data.data.task_id)+parseInt(i), mobile: sheetdet.assigned_to_user_phone, batch_id: batchDetails.batch_id, rowNo: sheetdet.rowNo});
                                    console.log(sheetDataLength+"=="+i); 
                                    if(sheetDataLength == i){
                                        setMainTaskIds(taskIds);
                                        
                                    }
                                });
                            }
                        });
                        */
                    }
                });
            }
        }
    }

    const createTask = async () => {
        console.log("Batch Details - ", batchDetails);
        console.log("File Details - ", fileDetails);
        console.log("Excel Sheet Details - ", excelSheetData);
        console.log("Main Task Ids - ", mainTaskIds);
        showAlert("loading", "Loading");
        await axios.post(UPLOAD_FILE_BULK, { sheet_data: excelSheetData, taskIds: mainTaskIds, batch_id: batchDetails.batch_id }).then(res => {
            console.log(res);
            if (res.data && res.data.success) {
                hideAlert("loading");
                showAlert("success", "Uploaded Successfully");
                // return window.location.href = "/app/task-app/bulk/upload";
            }
            else{
                hideAlert("loading");
                showAlert("warning", "Something went wrong, Please try adain");
            }
        });
    }
    
    const formatFileSize = (bytes, decimalPoint) => {
        if(bytes == 0) return '0 Bytes';
        let k = 1000;
        let dm = decimalPoint || 2;
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

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
        <TaskContext.Consumer>
            {
                context => (
                    <React.Fragment>
                        <div className="content">
                            <div className="container-fluid">
                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <div className="col-sm-12 pr-0">
                                            <h4 className="page-title width-auto pr-3">Excel File Upload</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <BreadCrumb breadCrumbs={breadCrumbs}> </BreadCrumb>
                                        </div>
                                        <div className="col-md-6  text-right">
                                            <Link to={"/app/task-app"} className="btn btn-primary btn-sm"><i
                                                className="fa fa-angle-left" aria-hidden="true"> </i> Back</Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="card m-b-30">
                                            <div className="col-md-6 col-lg-12 mt-2 text-right">
                                                <a className="btn btn-secondary btn-sm" href="/task-app/api-guest/task/download-format" target="_blank">Download Format</a>
                                            </div>

                                            <div className="card-body">
                                                <div className="row ">
                                                    <div className="col-md-6 col-lg-12">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="date">File
                                                                Upload<span className="text-danger">*</span></label>
                                                                <Dropzone
                                                                    getUploadParams={getUploadParams}
                                                                    onChangeStatus={handleChangeStatus}
                                                                    onSubmit={false}
                                                                    maxFiles={1}
                                                                    multiple={false}
                                                                    canRemove={false}
                                                                    accept=".xls, .xlsx"
                                                                    inputContent={(files, extra) => (extra.reject ? 'excel files only' : 'Upload File')}
                                                                    styles={{
                                                                        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
                                                                        inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
                                                                    }}
                                                                />
                                                        </div>
                                                    </div>
                                                    { submitButtonFlag && 
                                                        <div className="col-md-12 col-lg-12">
                                                            <div className="act-links mt-3 text-right">
                                                                <button
                                                                    className="btn btn-success waves-effect waves-light"
                                                                    onClick={createTask}>Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {enableSweetAlert}
                                
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-md-12">
                                        <div className="card m-b-30">
                                            <div className="card-body table-card">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4 className="mt-0 header-title  pl-3">History</h4>
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                            <table className="table">
                                                <TableHeader data={tableHead}/>
                                                <tbody>
                                                {
                                                    taskHistoryData.length > 0 ? taskHistoryData.map((task, i) => (
                                                        <tr key={i}>
                                                            <th>{serialNo + (i)}</th>
                                                            <td>
                                                                <img className="file-img" src={'/v1/images/doc.svg'} alt="pdf"/>
                                                                <a onClick={() => fileDownload(task.s3_key, task.file_name)} href="#" title="click to download Uploaded File">
                                                                    {task.file_name.substring(0, 50)}
                                                                </a>
                                                            </td>
                                                            <td>{moment(task.created_at).format('YYYY-MM-DD hh:mm a')}</td>
                                                            <td>
                                                                <img className="file-img" src={'/v1/images/doc.svg'} alt="pdf"/>
                                                                <Link title="Click to Download"
                                                                    to={'/task-app/api-guest/task/download-batch/' + task.batch_id} target="_blank">
                                                                    {task.file_name.length > 50 ? task.file_name.substring(0, 50) + '.....' : task.file_name}
                                                                </Link>
                                                            </td>
                                                            <td>{task.file_size ? formatFileSize(task.file_size, 2) : "-"}</td>
                                                            <td>{task.total_task_count ? task.total_task_count : "-"}</td>
                                                            <td>{task.success_task_count ? task.success_task_count : "-"}</td>
                                                            <td>{task.failure_task_count ? task.failure_task_count: "-"}</td>
                                                        </tr>)) :
                                                    <TableNoDataFound message={'No datas Found!'} frontSpan={3} backSpan={2} />
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                                <div className="float-left">
                                            <PaginationCount currentPage={paginationValues.currentPage} totalRecords={paginationValues.totalRecords} />
                                        </div>
                                                <div className="float-right mt-2 pr-3">
                                            <div className="Page navigation example">
                                                {
                                                    paginationValues.totalRecords > 0 ?
                                                        <Pagination
                                                            activePage={paginationValues.currentPage}
                                                            itemsCountPerPage={paginationValues.perPage}
                                                            totalItemsCount={paginationValues.totalRecords}
                                                            pageRangeDisplayed={10}
                                                            onChange={handlePageChange.bind(this)}
                                                        /> : null
                                                }
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

export default BulkUpload;