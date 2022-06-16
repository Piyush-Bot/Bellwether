import React, {useEffect, useState,} from 'react';
import {Link, useParams} from "react-router-dom";

import ConfigurationContext from "../Context/ConfigurationContext";
import { ACCESS_COMMON_MODULE_SUBLIST, UPDATE_SUB_MODULE_DATA } from "../../Auth/Context/AppConstant";

import axios from "axios";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";

import { Modal, Button, closeButton } from "react-bootstrap";
import toast from "react-hot-toast";

const CommonModuleSubList = () => {
    const [q, setQ] = useState('');
    useEffect(() => {
        commonModuleSubList();
    }, [q]);

    let {id} = useParams();
    let {subModulePrefix} = useParams();
    let {moduleNameTitle} = useParams();

    const [slNo, setSlNo] = useState(1);
    const [EditorJsonPopupShow, setEditorJsonPopupShow] = useState(false);
    const breadCrumbs = [
        {name: "Common Module SubList", url: "/app/configuration-app/common-module/list", class: "breadcrumb-item"},
        {name: "Add", url: "/app/configuration-app/common-module/add/sublist", class: "breadcrumb-item active"}
    ];

    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Module Code", scope: "col"},
        {label: "Module Name", scope: "col"},
        {label: "Description", scope: "col"},
        {label: "Action", scope: "col", class: "text-right"}
    ];
    const [commonModuleData, setCommonModuleData] = useState([]);
    const [updatedJsonData, setUpdatedJsonData] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [upcomongSubModuleCode, setUpcomingSubModuleCode] = useState(subModulePrefix+"_001");

    const actionType = "create";
    const actionModuleId = 1;

    const commonModuleSubList = () => {
        axios.get(ACCESS_COMMON_MODULE_SUBLIST + '?module_id=' + id + '&search_text=' + q)
            .then(res => {
                if (res.data && res.data.success) {
                    let data = res.data.data;
                    console.log("Sub Module List Data: "+data.length);
                    if(data.length > 0){
                        let upSubModuleCode = data.length + 1;
                        console.log("subModulePrefix - "+subModulePrefix);
                        if(subModulePrefix == 'undefined'){
                            subModulePrefix =  data[0].module_code.slice(0, data[0].module_code.lastIndexOf('_'));
                            console.log("in"+subModulePrefix);
                        }
                        let autoGenerateSubModuleCode = subModulePrefix+'_'+upSubModuleCode;
                        if(upSubModuleCode <= 9){
                            autoGenerateSubModuleCode = subModulePrefix+'_00'+upSubModuleCode;
                        }else if(upSubModuleCode > 9 && upSubModuleCode <= 99){
                            autoGenerateSubModuleCode = subModulePrefix+'_0'+upSubModuleCode;
                        }
                        console.log(autoGenerateSubModuleCode);
                        setUpcomingSubModuleCode(autoGenerateSubModuleCode);
                    }
                    setCommonModuleData(data);
                }
            },(error) => {
                toast.error('Unauthorized Action');
            })
    }

    const submit = () => {
        axios.post(UPDATE_SUB_MODULE_DATA + id + "?selectedIndex=" + selectedIndex, updatedJsonData)
            .then(res => {
                if (res.data && res.data.success) {
                    console.log(res.data);
                    setEditorJsonPopupShow(false);
                    setCommonModuleData(res.data.data);
                    toast.success(res.data.msg);
                    commonModuleSubList();
                    return this.props.history.push('/app/configuration-app/common-module/list');
                }
                else {
                    toast.error(res.data.msg);
                }
            }, (errors => {
                setEditorJsonPopupShow(false);
                toast.error('Unauthorized Action');
            }))
    }

    const getSelectedJson = (event, i) => {
        console.log(event);
        setSelectedIndex(event._id);
        setEditorJsonPopupShow(true);
    }

    const deleteSubModule = () => {
        console.log(id+"-"+selectedIndex);
        setEditorJsonPopupShow(false);
        commonModuleSubList();
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
                                        <div className="col-sm-5">
                                            <div className="search-input">
                                                <input type="text" className="form-control"
                                                       placeholder="Search By Module Name" value={q ? q : ''}
                                                       onChange={(e) => {
                                                           setQ(e.target.value)
                                                       }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="card m-b-30">
                                            <div className="card-body table-card">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4 className="mt-0 header-title  pl-3">Common Module SubList : {moduleNameTitle}</h4>
                                                    </div>
                                                    <div className="col-md-6 text-right ">
                                                        <Link
                                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                            to={'/app/configuration-app/common-module/add/sublist/' + id+'/'+actionType+'/'+actionModuleId+'/'+upcomongSubModuleCode+'/'+moduleNameTitle}>
                                                            <i className="fa fa-plus mr-1" aria-hidden="true"> </i>
                                                            Add New
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <TableHeader data={tableHead}/>
                                                        <tbody>
                                                        {
                                                            commonModuleData && commonModuleData.length > 0 ? commonModuleData.map((data, i) => (
                                                                <tr key={i}>
                                                                    <th>{slNo + (i)}</th>
                                                                    <td> {data.module_code} </td>
                                                                    <td> {data.module_name} </td>
                                                                    <td> {data.description} </td>
                                                                    <td className="text-right">
                                                                       {/* <div
                                                                            onClick={() => getSelectedJson(data, i)}
                                                                            className="act-links btn btn-danger btn-sm "
                                                                            data-toggle="tooltip"
                                                                            data-placement="top" title=""
                                                                            data-original-title="Edit"><i className="fa fa-trash-o"> </i>
                                                                        </div> &nbsp; &nbsp;  */}
                                                                        <Link
                                                                            to={'/app/configuration-app/common-module/add/sublist/' + id+'/update/'+data._id+'/'+data.module_code+'/'+moduleNameTitle}>
                                                                            <div className="act-links btn btn-warning btn-sm " data-toggle="tooltip"
                                                                                data-placement="top" title="" data-original-title="View"><i className="fa fa-eye"> </i>
                                                                            </div>
                                                                           
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            )) :
                                                            <TableNoDataFound message={'No Sub Module Found!'} frontSpan={2} backSpan={2}/>
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Modal show={EditorJsonPopupShow}>
                            {/* <Modal.Header>
                                <Modal.Title> </Modal.Title>
                            </Modal.Header> */}
                            <Modal.Body>Are you sure want to Delete?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => { setEditorJsonPopupShow(false); }}> Close </Button>
                                <Button variant="primary" onClick={() => deleteSubModule()}> Delete </Button>
                            </Modal.Footer>
                        </Modal>
                    </React.Fragment>
                )
            }
        </ConfigurationContext.Consumer>
    )
}

export default CommonModuleSubList;