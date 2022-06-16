import React, {useEffect, useState,} from 'react';
import {Link} from "react-router-dom";

import ConfigurationContext from "../Context/ConfigurationContext";
import { ADD_CONFIGURATION } from "../../Auth/Context/AppConstant";

import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import ValidationError from "../../Common/ValidationError";
import toast from 'react-hot-toast';

let token = localStorage.getItem('app-ll-token');
import axios from "axios";

const AddConfiguration = (props) => {

    useEffect(() => {

    }, []);

    const breadCrumbs = [
        {name: "Configuration List", url: "/app/configuration-app/list", class: "breadcrumb-item"},
        {name: "Add", url: "app/configuration-app/add", class: "breadcrumb-item active"}
    ];

    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const [errors, setErrors] = useState([]);

    const submit = () => {
        axios.post(ADD_CONFIGURATION, {name: name, type: type}, {
            headers: {
                'Authorization': 'llBearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                    setErrors([]);
                    if (res.data && res.data.success) {
                        toast.success(res.data.msg);
                        return props.history.push('/app/configuration-app/list');
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
                                        <Title title={'Add Configuration'}/>
                                    </div>
                                    <BreadCrumb breadCrumbs={breadCrumbs}
                                                backButton={{
                                                    url: '/app/configuration-app/list',
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
                                                                       htmlFor="model">Name<span
                                                                    className="text-danger">*</span></label>
                                                                <input className="form-control" type="text" value={name}
                                                                       name="name" id="name"
                                                                       onChange={(e) => setName(e.target.value)}/>
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
                                                                       htmlFor="model">Type<span
                                                                    className="text-danger">*</span></label>
                                                                <input className="form-control" type="text"
                                                                       name="type" id="type"
                                                                       onChange={(e) => setType(e.target.value)}/>
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'type'}> </ValidationError> : ''
                                                                }
                                                            </div>
                                                        </div>


                                                        <div className="col-md-12 col-lg-8\12">
                                                            <div className="act-links mt-2 text-right">

                                                                <Link
                                                                    className="btn btn-danger waves-effect waves-light mr-3"
                                                                    to={'/app/configuration-app/list'}>
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

export default AddConfiguration;