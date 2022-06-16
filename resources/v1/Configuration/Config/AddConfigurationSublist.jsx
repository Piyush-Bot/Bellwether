import React, {useEffect, useState,} from 'react';
import {Link, useParams} from "react-router-dom";

import ConfigurationContext from "../Context/ConfigurationContext";
import { ADD_CONFIGURATION_SUBDOCUMENT } from "../../Auth/Context/AppConstant";

import axios from "axios";
import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import toast from 'react-hot-toast';

let token = localStorage.getItem('app-ll-token');
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const AddConfigurationSublist = (props) => {

    useEffect(() => {

    }, []);
    let {id} = useParams();
    const breadCrumbs = [
        {name: "Configuration List", url: "/app/configuration-app/list", class: "breadcrumb-item"},
        {name: "Add", url: "app/configuration-app/add", class: "breadcrumb-item active"}
    ];
    const defaultJsonData = {};
    const [storeJsonData, setStoreJsonData] = useState({});

    const submit = () => {
        axios.post(ADD_CONFIGURATION_SUBDOCUMENT + id, storeJsonData, {
            headers: {
                'Authorization': 'llBearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(res => {
                if (res.data && res.data.success) {
                    toast.success(res.data.msg);
                    return props.history.push('/app/configuration-app/sub/' + id);
                }
                else {
                    toast.error(res.data.msg);
                }
            }, (error) => {
                toast.error('Unauthorized Action');
            })
            .catch((error) => {
                if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
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
                                        <Title title={'Add Configuration Sublist'}/>
                                    </div>
                                    <BreadCrumb breadCrumbs={breadCrumbs}
                                                backButton={{
                                                    url: '/app/configuration-app/sub/list/' + id,
                                                    label: 'Back'
                                                }}> </BreadCrumb>
                                </div>

                                <div className="row">
                                    <div className="col-xl-12">
                                        <form>

                                            <div className="card m-b-30">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-12 col-lg-12">
                                                            <div className="form-group json-editor">
                                                                <div style={{maxWidth: "100%", maxHeight: "100%"}}>
                                                                    <JSONInput onChange={(e) => {
                                                                        setStoreJsonData(e.jsObject)
                                                                    }}
                                                                               placeholder={storeJsonData}
                                                                               theme="light_mitsuketa_tribute"
                                                                               locale={locale}
                                                                               colors={{
                                                                                   string: "#DAA520"
                                                                               }}
                                                                               height="550px"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="col-md-12 col-lg-8\12">
                                                            <div className="act-links mt-2 text-right">

                                                                <Link
                                                                    className="btn btn-danger waves-effect waves-light mr-3"
                                                                    to={'/app/configuration-app/sub/list/' + id}>
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

export default AddConfigurationSublist;