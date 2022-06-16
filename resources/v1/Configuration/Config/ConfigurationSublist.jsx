import React, {useEffect, useState,} from 'react';
import {Link, useParams} from "react-router-dom";

import ConfigurationContext from "../Context/ConfigurationContext";
import { ACCESS_CONFIGURATION_SUBLIST, UPDATE_CONFIGURATION_DATA } from "../../Auth/Context/AppConstant";

import axios from "axios";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import {Modal} from "react-bootstrap";
import helpers from "../../../helpers";
import toast from "react-hot-toast";

let token = localStorage.getItem('app-ll-token');

const ConfigurationSubList = () => {
    const [q, setQ] = useState('');
    useEffect(() => {
        configurationList();
    }, [q]);
    let {id} = useParams();
    const [slNo, setSlNo] = useState(1);
    const [EditorJsonPopupShow, setEditorJsonPopupShow] = useState(false);
    const breadCrumbs = [
        {name: "Configuration SubList", url: "/app/configuration-app/list", class: "breadcrumb-item"},
        {name: "Add", url: "/app/configuration-app/add/sublist", class: "breadcrumb-item active"}
    ];
    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Event", scope: "col"},
        {label: "Field1", scope: "col"},
        {label: "Field2", scope: "col"},
        {label: "Action", scope: "col", class: "text-right"}
    ];
    const [configurationData, setConfigurationData] = useState([]);
    const [jsonData, setJsonData] = useState({});
    const [updatedJsonData, setUpdatedJsonData] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const maxStrlength = 50;
    const configurationList = () => {
        axios.get(ACCESS_CONFIGURATION_SUBLIST + '?configuration_id=' + id + '&q=' + q)
            .then(res => {
                if (res.data && res.data.success) {
                    let data = res.data.data.sub_documents;
                    if (q && res.data.data.sub_documents) {
                        setConfigurationData([]);
                        let res = data.filter((item) => {
                            return (
                                item.event
                                    .toString()
                                    .toLowerCase()
                                    .indexOf(q.toLowerCase()) > -1
                            );
                        });
                        setConfigurationData(res);
                    } else {
                        setConfigurationData(res.data.data.sub_documents);
                    }
                }
            },(error) => {
                toast.error('Unauthorized Action');
            })
    }

    const getSelectedJson = (event, i) => {
        setSelectedIndex(i);
        setJsonData(helpers.findObject(configurationData, 'event', event));
        setEditorJsonPopupShow(true);
    }

    const submit = () => {
        axios.post(UPDATE_CONFIGURATION_DATA + id + "?selectedIndex=" + selectedIndex, updatedJsonData)
            .then(res => {
                if (res.data && res.data.success) {
                    setEditorJsonPopupShow(false);
                    setConfigurationData(res.data.data.sub_documents);
                    toast.success(res.data.msg);
                    configurationList();
                    return this.props.history.push('/app/configuration-app/list');
                }
                else {
                    toast.error(res.data.msg);
                }
            }, (errors => {
                setEditorJsonPopupShow(false);
                toast.error('Unauthorized Action');
            }))
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
                                                       placeholder="Search By Event Name" value={q ? q : ''}
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
                                                        <h4 className="mt-0 header-title  pl-3">Configuration
                                                            SubList</h4>
                                                    </div>
                                                    <div className="col-md-6 text-right ">

                                                        <Link
                                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                            to={'/app/configuration-app/add/sublist/' + id}>
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
                                                            configurationData && configurationData.length > 0 ? configurationData.map((data, i) => (

                                                                    <tr key={i}>
                                                                        <th>{slNo + (i)}</th>
                                                                        <td> {data.event} </td>
                                                                        <td> {data.event === "DISTANCE" ? data.api_url && data.api_url.length > maxStrlength ? data.api_url.substring(0, maxStrlength) : data.api_url + '...' : data.title && data.title.length > maxStrlength ? data.title.substring(0, maxStrlength) + '...' : data.title} </td>
                                                                        <td> {data.event === "DISTANCE" ? data.access_token && data.access_token.length > maxStrlength ? data.access_token.substring(0, maxStrlength) + '...' : data.access_token : data.message && data.message.length > maxStrlength ? data.message.substring(0, maxStrlength) + '...' : data.message} </td>
                                                                        <td className="text-right">
                                                                            <div
                                                                                onClick={() => getSelectedJson(data.event, i)}
                                                                                className="act-links btn btn-warning btn-sm "
                                                                                data-toggle="tooltip"
                                                                                data-placement="top" title=""
                                                                                data-original-title="Edit"><i
                                                                                className="fa fa-eye"> </i>
                                                                            </div>

                                                                        </td>

                                                                    </tr>
                                                                )) :
                                                                <TableNoDataFound message={'No Configuration Found!'}
                                                                                  frontSpan={3} backSpan={1}/>

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
                            <Modal.Body>
                                <div className="row">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" onClick={() => {
                                            setEditorJsonPopupShow(false);
                                        }}>&times;</span>
                                    </button>
                                    <>
                                        <div style={{maxWidth: "100px", maxHeight: "100%"}}>
                                            <JSONInput onChange={(e) => {
                                                setUpdatedJsonData(e.jsObject)
                                            }}
                                                       placeholder={jsonData}
                                                       theme="light_mitsuketa_tribute"
                                                       locale={locale}
                                                       colors={{
                                                           string: "#DAA520"
                                                       }}
                                                       height="550px"
                                            />
                                        </div>
                                    </>

                                    <div className="col-md-12">
                                        <div className="act-links mt-2 text-center">
                                            <a className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                               onClick={() => submit()}
                                            >Save</a>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </React.Fragment>
                )
            }
        </ConfigurationContext.Consumer>
    )
}

export default ConfigurationSubList;