import React, {useEffect, useState,} from 'react';
import {Link, useParams} from "react-router-dom";

import ConfigurationContext from "../Context/ConfigurationContext";
import { ADD_COMMON_MODULE } from "../../Auth/Context/AppConstant";

import axios from "axios";
import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import ValidationError from "../../Common/ValidationError";
import toast from 'react-hot-toast';

let token = localStorage.getItem('app-ll-token');

const AddCommonModule = (props) => {

    useEffect(() => {}, []);

    let { moduleCode } = useParams();

    const breadCrumbs = [
        {name: "Common Module List", url: "/app/configuration-app/common-module/list", class: "breadcrumb-item"},
        {name: "Add", url: "#", class: "breadcrumb-item active"}
    ];

    const [module_code, setModuleCode] = useState(moduleCode);
    const [name, setModuleName] = useState("");
    const [type, setModuleDescription] = useState("");
    const [sub_module_prefix, setSubModulePrefix] = useState("");
    const [errors, setErrors] = useState([]);

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
      };

    const submit = () => {
        axios.post(ADD_COMMON_MODULE, { module_name: name, description: type, module_code: module_code, sub_module_prefix: sub_module_prefix })
        .then(res => {
                setErrors([]);
                console.log(res.data);
                if (res.data && res.data.success) {
                    toast.success(res.data.msg);
                    return props.history.push('/app/configuration-app/common-module/list');
                }
                else{
                    toast.error(res.data.msg);
                    $('#sub_module_prefix').val("");
                }
            },
            (error) => {
                toast.error('Unauthorized Action');
            }
        )
        .catch((error) => {
            if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                setErrors(error.response.data.errors);
            }
        })
    }

    return (
        <ConfigurationContext.Consumer>
            {
                context => (
                    <React.Fragment>
                        <div className="content">
                            <div className="container-fluid">

                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <Title title={'Add Common Module'}/>
                                    </div>
                                    <BreadCrumb breadCrumbs={breadCrumbs}
                                                backButton={{
                                                    url: '/app/configuration-app/common-module/list',
                                                    label: 'Back'
                                                }}> </BreadCrumb>
                                </div>

                                <div className="row">
                                    <div className="col-xl-12">
                                        <form>

                                            <div className="card m-b-30">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="model">Module Code<span
                                                                    className="text-danger">*</span></label>
                                                                <input className="form-control" type="text" value={module_code} readOnly required
                                                                       name="module_code" id="module_code"
                                                                       onChange={(e) => setModuleCode(e.target.value)}/>
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'module_code'}> </ValidationError> : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="model">Module Name<span
                                                                    className="text-danger">*</span></label>
                                                                <input className="form-control" type="text" value={name} required
                                                                       name="name" id="name"
                                                                       onChange={(e) => setModuleName(e.target.value)}/>
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'name'}> </ValidationError> : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="model">Module Description<span
                                                                    className="text-danger">*</span></label>
                                                                <input className="form-control" type="text" required
                                                                       name="type" id="type"
                                                                       onChange={(e) => setModuleDescription(e.target.value)}/>
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'type'}> </ValidationError> : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="model">Sub Module Prefix<span
                                                                    className="text-danger">*</span></label>
                                                                <input className="form-control" type="text" placeholder='LL_TLS' onInput={toInputUppercase}
                                                                       name="sub_module_prefix" id="sub_module_prefix" required
                                                                       onChange={(e) => setSubModulePrefix(e.target.value)}/>
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'sub_module_prefix'}> </ValidationError> : ''
                                                                }
                                                            </div>
                                                        </div>


                                                        <div className="col-md-12 col-lg-8\12">
                                                            <div className="act-links mt-2 text-right">

                                                                <Link
                                                                    className="btn btn-danger waves-effect waves-light mr-3"
                                                                    to={'/app/configuration-app/common-module/list'}>
                                                                    Cancel
                                                                </Link>
                                                                <button type={"button"} onClick={submit}
                                                                        className="btn btn-success waves-effect waves-light">Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )
            }
        </ConfigurationContext.Consumer>
    )
}

export default AddCommonModule;