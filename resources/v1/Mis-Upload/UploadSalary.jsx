import React, { useEffect, useState, } from 'react';
import MisUploadContext from './Context/MisUploadContext';
import ValidationError from "../Common/ValidationError";
import { ADD_XL_DATA } from "../Auth/Context/AppConstant";
import axios from "axios";
import BreadCrumb from "../Common/BreadCrumb";
import helper from "../../helpers";
import toast from 'react-hot-toast';
import xlsx from 'xlsx';

const UploadSalary = (props) => {

    const [errors, setErrors] = useState([]);

    helper.handlePreRequest();

    const breadCrumbs = [
        { name: "Reports", url: "#", class: "breadcrumb-item" },
        { name: "Upload Salary Datas", url: "#", class: "breadcrumb-item active" }
    ];

    function onCreatePost(e) {
        e.preventDefault();

       

    }

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsondata = xlsx.utils.sheet_to_json(worksheet);
                
                axios.post(ADD_XL_DATA, jsondata).then((res) => {
                    setErrors([]);
                    if (res.data && (res.data.success)) {
                        toast.success(res.data.msg);
                        return props.history.push('/app/mis-upload-app/mis-salary/list');
                        
                    }
                })
                    .then(res => {
        
                        if (res.data && res.data.success) {
                            toast.success(res.data.msg);
                            return props.history.push('/app/mis-upload-app/mis-salary/list');
                        }
                    })
                    .catch((error) => {
                        console.log(error.response.data.errors)
                        toast.success("Unauthorized Action");
                        if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                            setErrors(error.response.data.errors);
                        }
                    })
                
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

    return (
        <React.Fragment>
                    <MisUploadContext.Consumer>
                        {(context) => (
                            <div className="content">
                                <div className="container-fluid">
                                    <div className="page-title-box">
                                        <div className="row align-items-center">
                                            <div className="col-sm-6">
                                                <h4 className="page-title mt-1 width-auto">Upload Salary Data</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <BreadCrumb breadCrumbs={breadCrumbs}
                                                    backButton={{ url: '/app/mis-upload-app/mis-salary/list', label: 'Back' }}> </BreadCrumb>

                                            </div>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="card m-b-30">
                                                <div className="card-body table-card">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h4 className="mt-0 header-title  pl-3">Upload  Salary File </h4>
                                                        </div>
                                                    </div>
                                                    <form onSubmit={onCreatePost}>
                                                        <div className="row  pl-3 pr-3">
                                                            <div className="col-md-12  ">
                                                                <div className="form-group">
                                                                    <label>Choose File</label>
                                                                    <input  type="file"   
                                                                            name="upload" 
                                                                            id="upload"
                                                                            onChange={readUploadFile}
        
                                                                    />
                                                                    
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6  mt-5">
                                                                <span>&nbsp;</span>

                                                            </div>

                                                        </div>
                                                    </form>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                        )}

                    </MisUploadContext.Consumer>
            </React.Fragment>
    );

}

export default UploadSalary
