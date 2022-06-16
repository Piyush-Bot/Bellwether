import React, {useEffect, useState} from "react";
import axios from "axios";
import {SOCKET_MODEL_EDIT, SOCKET_MODEL_LIST} from "../../Auth/Context/AppConstant";
import ChargingContext from "../Context/ChargingContext";
import helpers from "../../../helpers";
let token = localStorage.getItem('app-ll-token');

const ModelDetail = (props) => {
    const [socketModelData, setSocketModelData] = useState([]);
    const [show, setShow] = useState(false);
    const [showBasic, setShowBasic] = useState(true);
    useEffect(() => {
         getModelData();
    }, [props.model_id, props.socketData]);

    const handleShow = async () => {
        setShow(true);
        setShowBasic(false);
    }
    const getModelData = async () => {
            axios.get(SOCKET_MODEL_EDIT + props.model_id,  {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.data && res.data.success) {
                       setSocketModelData(res.data.data);
                    }
                })
    };

    return (
        <ChargingContext.Consumer>
            {
                context => (
                    <>
                    { showBasic ? <div className="row">
                        <div className="col-xl-12">
                            <div className="card m-b-30">
                                <div className="card-body">
                                    <h4 className="mt-0 header-title  width-auto">Model Details</h4>
                                    {/*<div className="float-right width-auto  pencil-icon">
                                        <a className="edit" href="#" onClick={handleShow}><i className="icon-pen"
                                                                                             aria-hidden="true"> </i></a>
                                    </div>*/}

                                    <div className="row">
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Model Name
                                                    </label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData ? socketModelData.ll_model_name : '-'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Manufacture Name
                                                </label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData && socketModelData.manufacture && socketModelData.manufacture ? socketModelData.manufacture.name : '-'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Connector
                                                    Type</label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData && socketModelData.connector_type && socketModelData.connector_type ? socketModelData.connector_type.description : '-'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Connector
                                                    Format</label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData && socketModelData.connector_format && socketModelData.connector_format ? socketModelData.connector_format.description : '-'}</span>
                                            </div>
                                        </div>
                                         <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Power Type</label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData && socketModelData.power_type && socketModelData.power_type ? socketModelData.power_type.description : '-'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Frequency</label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData && socketModelData.frequency && socketModelData.frequency ? socketModelData.frequency.description : '-'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Voltage</label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData && socketModelData.ll_voltage ? socketModelData.ll_voltage: '-'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Amperage</label>
                                                <span className="d-block mt-1 font-weight-600">{socketModelData && socketModelData.ll_amperage ? socketModelData.ll_amperage: '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null}
                        {show ? <div className="row">
                            <div className="col-xl-12">
                                <div className="card m-b-30">
                                    <div className="card-body">
                                        <h4 className="mt-0 header-title">Model Details</h4>
                                        <div className="row">
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="socket-id">Model Name
                                                        Id</label>
                                                    {/*<input className="form-control" type="text" readOnly={true}
                                                           value={props.socketData ? props.socketData._id : '-'}
                                                           id="socket-id"/>*/}
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="socket-id">Manufacture Name
                                                        Id</label>
                                                    {/*<input className="form-control" type="text" ref={vendor_socket_id}
                                                           value={props.socketData ? props.socketData.ll_vendor_socket_id : '-'}
                                                           id="socket-id"/>*/}
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="si-number">Connector</label>
                                                    <input className="form-control" type="text"
                                                           value={props.socketData ? props.socketData.socket_srl_no : '-'}
                                                           id="si-number"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500"
                                                           htmlFor="type">Power Type<span
                                                        className="text-danger">*</span></label>
                                                    {/*<select className="form-control" onChange={(e) => {
                                                        setSelectedModel(e.target.value)
                                                    }}>
                                                        <option value={''}>Select</option>
                                                        {
                                                            context.model && context.model.length > 0 ? context.model.map((value, i) => (
                                                                <option value={value.id}
                                                                        key={i}>{value.ll_model_name}</option>
                                                            )) : null
                                                        }
                                                    </select>*/}
                                                </div>

                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="type"
                                                           className="width-100">Frequency</label>
                                                    <div className=" left-side un-pop">
                                                        {/*<select className="form-control" ref={socket_owner_type}
                                                                value={selectedType ? selectedType : props.socketData ? props.socketData.socket_owner_type : selectedType}
                                                                onChange={(e) => {
                                                                    setSelectedType(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                ownerType && ownerType.module_values.length > 0 ? ownerType.module_values.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.description}</option>
                                                                )) : ''
                                                            }
                                                        </select>*/}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500"
                                                           htmlFor="vendor">Voltage <span
                                                        className="text-danger">*</span></label>
                                                    {/*<select className="form-control" name="vendor"
                                                            onChange={(e) => setSelectedVendor(e.target.value)}>
                                                        <option value={''}>Select</option>
                                                        {
                                                            context.socketVendors.length > 0 ? context.socketVendors.map((value, i) => (
                                                                <option value={value.id}
                                                                        key={i}>{value.ll_vendor_name}</option>
                                                            )) : null
                                                        }
                                                    </select>*/}
                                                </div>

                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="qr">Amperage</label>
                                                    <div className=" left-side un-pop">
                                                        {/*<select className="form-control" ref={qr_enabled}
                                                                value={selectedQrValue ? selectedQrValue : props.socketData ? props.socketData.qr_enabled : selectedQrValue}
                                                                onChange={(e) => {
                                                                    setSelectedQrValue(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                status && status.module_values.length > 0 ? status.module_values.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.description}</option>
                                                                )) : null
                                                            }
                                                        </select>*/}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="act-links mt-4 text-right">
                                                    <a href="#"
                                                       className="btn btn-danger waves-effect waves-light mr-3"
                                                       onClick={() => {
                                                           setShow(false)
                                                           setShowBasic(true)
                                                       }}>Cancel</a>
                                                    <a href="#"
                                                       className="btn btn-success waves-effect waves-light"
                                                       onClick="">Save</a>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div> : null}
                    </>
                )
            }
        </ChargingContext.Consumer>
    )
}
export default ModelDetail;
