import React, {useEffect, useState,} from 'react';
import {Link, useParams} from "react-router-dom";

import ConfigurationContext from "../Context/ConfigurationContext";
import { ADD_SUB_MODULE, UPDATE_SUB_MODULE_DATA, SUB_MODULE_DETAILS } from "../../Auth/Context/AppConstant";

import axios from "axios";
import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import toast from 'react-hot-toast';


const AddCommonModuleSublist = (props) => {

    useEffect(() => {
        getSubModuleDetail();
    }, []);

    let {id} = useParams();
    let { actiontype } = useParams();
    let { updatId } = useParams();
    let { subModuleCode } = useParams();
    let { moduleNameTitle } = useParams();

    const breadCrumbs = [
        {name: "Common Module List", url: "/app/configuration-app/common-module/list", class: "breadcrumb-item"},
        {name: "Add", url: "#", class: "breadcrumb-item active"}
    ];

    let [name, setName] = useState("");
    let [type, setType] = useState("");
    let [additionalField1, setAdditionalField1] = useState("");
    let [additionalField2, setAdditionalField2] = useState("");
    let [displayOrder, setDisplayOrder] = useState("");
    const [subModuleCodeText, setSubModuleCodeText] = useState(subModuleCode);
    let [title, setTitle] = useState("Add");

    if(actiontype == "update"){
        [title, setTitle] = useState("Update");
    }
    
    const [errors, setErrors] = useState([]);

    const getSubModuleDetail = () => {
        if(actiontype == "update"){
            axios.get(SUB_MODULE_DETAILS+ '?sub_module_id=' + updatId)
            .then(res => {
                if (res.data && res.data.success) {
                    let data = res.data.data;
                    console.log("Sub Module Details Data: "+data);
                    if(data){
                        console.log(data.module_name);
                        setName(data.module_name);
                        setType(data.description);
                        let af1 = data.additional_field1 && data.additional_field1 != "undefined" ? setAdditionalField1(data.additional_field1) : setAdditionalField1("");
                        let af2 = data.additional_field2 && data.additional_field2 != "undefined" ? setAdditionalField2(data.additional_field2) : setAdditionalField2("");
                        let dorder = data.display_order && data.display_order != "undefined" ? setDisplayOrder(data.display_order) : setDisplayOrder("");
                    }
                }
            },(error) => {
                toast.error('Unauthorized Action');
            })
        }
    }

    const submit = () => {
        let addupdateURL = ADD_SUB_MODULE;
        let reqParam = { module_name: name, description: type, module_code: subModuleCodeText, 
                        additional_field1: additionalField1 ? additionalField1 : null, 
                        additional_field2: additionalField2 ? additionalField2 : null, 
                        display_order: displayOrder ? displayOrder : null  };
        if(actiontype == "update"){
            addupdateURL = UPDATE_SUB_MODULE_DATA;
            reqParam._id = updatId;
        }
        console.log(reqParam);
        axios.post(addupdateURL+id, reqParam).then(res => {
            if (res.data && res.data.success) {
                toast.success(res.data.msg);
                return props.history.push('/app/configuration-app/common-module/sub/list/' + id +'/'+(subModuleCodeText.slice(0, subModuleCodeText.lastIndexOf('_')))+'/'+moduleNameTitle);
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
                                        <Title title= {title+' Common Module Sublist : '+moduleNameTitle}/>
                                    </div>
                                    <BreadCrumb breadCrumbs={breadCrumbs}
                                                backButton={{
                                                    url: '/app/configuration-app/common-module/sub/list/'+id+'/'+(subModuleCodeText.slice(0, subModuleCodeText.lastIndexOf('_')))+'/'+moduleNameTitle,
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
                                                                <input className="form-control" type="text" value={subModuleCodeText} readOnly
                                                                       name="subModuleCodeText" id="subModuleCodeText"
                                                                       onChange={(e) => setSubModuleCodeText(e.target.value)}/>
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'subModuleCodeText'}> </ValidationError> : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-6">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="model">Module Name<span
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
                                                                       htmlFor="model">Module Description<span
                                                                    className="text-danger">*</span></label>
                                                                <input className="form-control" type="text" value={type}
                                                                       name="type" id="type" 
                                                                       onChange={(e) => setType(e.target.value)}/>
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
                                                                       htmlFor="model">Additional Field 1</label>
                                                                <input className="form-control" type="text" value={additionalField1}
                                                                       name="additional_field1" id="additional_field1" 
                                                                       onChange={(e) => setAdditionalField1(e.target.value)}/>
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
                                                                       htmlFor="model">Additional Field 2</label>
                                                                <input className="form-control" type="text" value={additionalField2}
                                                                       name="additional_field2" id="additional_field2" 
                                                                       onChange={(e) => setAdditionalField2(e.target.value)}/>
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
                                                                       htmlFor="model">Display Order</label>
                                                                <input className="form-control" type="text" value={displayOrder}
                                                                       name="display_order" id="display_order" 
                                                                       onChange={(e) => setDisplayOrder(e.target.value)}/>
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
                                                                    to={'/app/configuration-app/common-module/sub/list/' + id+'/'+(subModuleCodeText.slice(0, subModuleCodeText.lastIndexOf('_')))+'/'+moduleNameTitle}>
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

export default AddCommonModuleSublist;