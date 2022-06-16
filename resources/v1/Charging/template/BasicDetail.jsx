import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    GET_AMS_ASSET,
    GET_AMS_LOCATION,
    SOCKET_MODULE,
    SOCKET_UPDATE, VENDORS_LIST_BY_MODULE,
} from "../../Auth/Context/AppConstant";
import ChargingContext from "../Context/ChargingContext";
import helpers from "../../../helpers";
import {useParams} from "react-router-dom";
import EditDataEntry from "../EditDataEntry";
import toast from "react-hot-toast";
import moment from "moment";
import ValidationError from "../../Common/ValidationError";

let token = localStorage.getItem('app-ll-token');
let status = "";
const BasicDetail = (props) => {
    let vendor_socket_id = React.createRef();
    let qr_enabled = React.createRef();
    let is_public = React.createRef();
    let socket_owner_type = React.createRef();


    let {socket_id} = useParams();

    const [show, setShow] = useState(false);
    const [showBasic, setShowBasic] = useState(true);

    const [moduleData, setModuleData] = useState([]);
    const [ownerType, setOwnerType] = useState('');
    const [socketOwner, setSocketOwner] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedQrValue, setSelectedQrValue] = useState('');
    const [seletedIsPublic, setSeletedIsPublic] = useState('');
    const [selectedType, setSelectedType] = useState(props.socketData.socket_owner_type_value.module_code);
    const [selectedOwner, setSelectedOwner] = useState(props.socketData.socket_owner);
    const [dataEntryObject, setDataEntryObject] = useState({});
    const [selectedVendor, setSelectedVendor] = useState('');
    const [errors, setErrors] = useState([]);
    const [restrictMaintenanceDuration, setMaintenanceDuration] = useState(0);

    const [AMSLocationData, setAMSLocationData] = useState([]);
    const [AMSAssetPurchaseData, setAMSAssetPurchaseData] = useState([]);
    const [selectedAMSLocation, setSelectedAMSLocation] = useState(props.socketData.location_id ? props.socketData.location_id : 0);
    const [selectedAMSAsset, setSelectedAMSAsset] = useState(props.socketData.ams_asset_purchase_id ? props.socketData.ams_asset_purchase_id : 0);
    const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState(props.socketData.invoice_num ? props.socketData.invoice_num : 0);

    useEffect(() => {
        getModuleData();
        setIsPublic(props.socketData.is_public);
        calculateMaintenanceDuration();
        fetchSocketOwnerData();
        fetchAmsLocation();
        fetchAmsAssetPurchase();
    }, [selectedType, selectedAMSLocation]);

    const handleShow = async () => {
        setShowBasic(false);
        status = await helpers.findObject(moduleData, "module_code", 'MC14');
        setOwnerType(helpers.findObject(moduleData, "module_code", 'ASOR01'));
        if(show === false){
            setShow(true);
        }
    }

    /**
     * fetch Ams location
     */
    const fetchAmsLocation = () => {
        axios.get(GET_AMS_LOCATION)
            .then(res => {
                if (res.status === 200 && res.data.success) {
                    setAMSLocationData(res.data.data);
                }
            });
    };

    /**
     * fetch Ams asset purchase
     */
    const fetchAmsAssetPurchase = (id) => {
        axios.get(GET_AMS_ASSET + selectedAMSLocation)
            .then(res => {
                if (res.status === 200 && res.data.success) {
                    setAMSAssetPurchaseData(res.data.data);
                }
            });
    };

    /**
     * Fetch socket owner vendor data
     */
    const fetchSocketOwnerData = () => {

        let code = selectedType === 'ASOR003' ? 'VT08' : selectedType;
        axios.get(VENDORS_LIST_BY_MODULE + '?module_code=' + code)
            .then(res => {
                if (res.status === 200 && res.data.success) {
                    setSocketOwner(res.data.data);
                } else {
                    setSocketOwner('');
                }
            });

    };

    const calculateMaintenanceDuration = () => {
        setMaintenanceDuration(moment.duration(moment(props.socketData.updated_at).diff(moment())).asHours());
    }
    const getModuleData = async () => {
        await axios.get(SOCKET_MODULE)
            .then(res => {
                if (res.data && res.data.success) {
                    setModuleData(res.data.data);
                }
            })
    }
    const setIsPublic = (value) => {
        setSeletedIsPublic(value);
    }
    const submit = () => {
        props.updatedStatus(selectedModel ? selectedModel : props.socketData.model_id);
        props.landMark(dataEntryObject.cs_landmark);
        props.isPublic(seletedIsPublic ? seletedIsPublic : props.socketData.is_public);
        props.reType(dataEntryObject.re_type);

        let frameData = {
            model_id: selectedModel ? selectedModel : props.socketData.model_id,
            location_id: selectedAMSLocation,
            ams_asset_purchase_id: selectedAMSAsset,
            invoice_num: selectedInvoiceNumber,
            socket_owner_type: selectedType ? selectedType : props.socketData.socket_owner_type,
            ll_vendor_id: selectedVendor ? selectedVendor : props.socketData.ll_vendor_id,
            qr_enabled: selectedQrValue ? selectedQrValue : props.socketData.qr_enabled,
            is_public: seletedIsPublic ? seletedIsPublic : props.socketData.is_public,
            _id: props.socketData._id,
            socket_id: props.socketData.ll_vendor_socket_id,
            previous_cluster_id: props.socketData.cluster_id,
            address: dataEntryObject.address,
            latitude: dataEntryObject.latitude,
            longitude: dataEntryObject.longitude,
            cs_landmark: dataEntryObject.cs_landmark,
            re_location: dataEntryObject.re_location,
            re_owner: dataEntryObject.re_owner,
            re_type: dataEntryObject.re_type,
            socket_status: props.socketData.socket_status && props.socketData.socket_status === "UNDER_MAINTENANCE" ? "FREE" : props.socketData.socket_status
        }
        let is_public = seletedIsPublic ? seletedIsPublic : props.socketData.is_public;
        let url = parseInt(is_public) === 322 ? SOCKET_UPDATE + '/' + socket_id : SOCKET_UPDATE + '/data-entry/' + socket_id;

        axios.put(url, frameData)
            .then(res => {
                if (res.data && res.data.success) {
                    setShow(false);
                    setShowBasic(true);
                    toast.success("Updated successfully!");
                    setErrors([]);
                } else {
                    setErrors([]);
                    toast.error("Update Failure!");
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                    setErrors(error.response.data.errors);
                }
            })
    }

    return (
        <ChargingContext.Consumer>
            {
                context => (
                    <>
                        {showBasic ? <div className="row">
                                <div className="col-xl-12">
                                    <div className="card m-b-30">
                                        <div className="card-body">
                                            <h4 className="mt-0 header-title  width-auto">Basic Details</h4>
                                            {
                                                props.socketData && props.socketData.socket_status !== "FREE" && props.socketData.socket_status !== "INUSE" && props.socketData.socket_status !== "UNDER_MAINTENANCE" ?
                                                    <div className="float-right width-auto  pencil-icon">
                                                        <a className="edit" href="#" onClick={handleShow}><i
                                                            className="icon-pen"
                                                            aria-hidden="true"> </i></a>
                                                    </div> : null
                                            }
                                            {
                                                props.socketData && props.socketData.socket_status === "UNDER_MAINTENANCE" && props.socketData.undermaintenance_duration > 3 ?
                                                    <div className="float-right width-auto  pencil-icon">
                                                        <a className="edit" href="#" onClick={handleShow}><i
                                                            className="icon-pen"
                                                            aria-hidden="true"> </i></a>
                                                    </div> : null
                                            }

                                            <div className="row">
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Socket Id</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600">{props.socketData ? props.socketData.ll_sno : '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Vendor Socket
                                                            Id</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600">{props.socketData ? props.socketData.ll_vendor_socket_id : '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Socket Sl Number
                                                        </label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600">{props.socketData ? props.socketData.socket_srl_no : '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">QR Enabled</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.qr_enabled ? helpers.findvaluefromObject(moduleData, "id", props.socketData.qr_enabled) : '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Is Public</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.is_public ? helpers.findvaluefromObject(moduleData, "id", props.socketData.is_public) : '-'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}

                        {show ? <div className="row">
                            <div className="col-xl-12">
                                <div className="card m-b-30">
                                    <div className="card-body">
                                        <h4 className="mt-0 header-title">Basic Details</h4>
                                        <div className="row">
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="socket-id">LL Socket
                                                        Id</label>
                                                    <input className="form-control" type="text" readOnly={true}
                                                           value={props.socketData ? props.socketData._id : '-'}
                                                           id="socket-id"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="socket-id">Vendor Socket
                                                        Id</label>
                                                    <input className="form-control" type="text" ref={vendor_socket_id}
                                                           value={props.socketData ? props.socketData.ll_vendor_socket_id : '-'}
                                                           readOnly={true}
                                                           id="socket-id"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="si-number">Socket Sl
                                                        Number</label>
                                                    <input className="form-control" type="text" readOnly={true}
                                                           value={props.socketData ? props.socketData.socket_srl_no : '-'}
                                                           id="si-number"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500"
                                                           htmlFor="type">Ams Location<span
                                                        className="text-danger">*</span></label>
                                                    <select className="form-control"
                                                            value={selectedAMSLocation ? selectedAMSLocation : props.socketData.location_id}
                                                            onChange={(e) => {
                                                                setSelectedAMSLocation(e.target.value);
                                                                setSelectedAMSAsset('');
                                                            }}>
                                                        <option value={''}>Select</option>
                                                        {
                                                            AMSLocationData && AMSLocationData.length > 0 ? AMSLocationData.map((value, i) => (
                                                                <option value={value.id}
                                                                        key={i}>{value.name}</option>
                                                            )) : null
                                                        }
                                                    </select>
                                                    {
                                                        errors && errors.length > 0 ?
                                                            <ValidationError array={errors}
                                                                             param={'location_id'}> </ValidationError> : ''
                                                    }
                                                </div>

                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="type"
                                                           className="width-100">Ams Asset Purchase
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <div className=" left-side un-pop">
                                                        <select className="form-control"
                                                                value={selectedAMSAsset ? selectedAMSAsset : props.socketData.ams_asset_purchase_id}
                                                                onChange={(e) => {
                                                                    setSelectedAMSAsset(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                AMSAssetPurchaseData && AMSAssetPurchaseData.length > 0 ? AMSAssetPurchaseData.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.po_number + '-' + value.name}</option>
                                                                )) : null
                                                            }
                                                        </select>
                                                        {
                                                            errors && errors.length > 0 ?
                                                                <ValidationError array={errors}
                                                                                 param={'ams_asset_purchase_id'}> </ValidationError> : ''
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="si-number">Invoice
                                                        Number<span
                                                            className="text-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                           value={selectedInvoiceNumber ? selectedInvoiceNumber : ''}
                                                           id="si-number" onChange={(e) => {
                                                        setSelectedInvoiceNumber(e.target.value)
                                                    }}/>
                                                    {
                                                        errors && errors.length > 0 ?
                                                            <ValidationError array={errors}
                                                                             param={'invoice_num'}> </ValidationError> : ''
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500"
                                                           htmlFor="type">Model Id<span
                                                        className="text-danger">*</span></label>
                                                    <select className="form-control"
                                                            value={selectedModel ? selectedModel : props.socketData.model_id}
                                                            onChange={(e) => {
                                                                setSelectedModel(e.target.value)
                                                            }}>
                                                        <option value={''}>Select</option>
                                                        {
                                                            context.model && context.model.length > 0 ? context.model.map((value, i) => (
                                                                <option value={value.id}
                                                                        key={i}>{value.ll_model_name}</option>
                                                            )) : null
                                                        }
                                                    </select>
                                                </div>

                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="type"
                                                           className="width-100">Socket OwnerType
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <div className=" left-side un-pop">
                                                        <select className="form-control" ref={socket_owner_type}
                                                                value={selectedType ? selectedType : props.socketData ? props.socketData.socket_owner_type : selectedType}
                                                                onChange={(e) => {
                                                                    setSelectedType(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                ownerType && ownerType.module_values.length > 0 ? ownerType.module_values.map((value, i) => (
                                                                    <option value={value.module_code}
                                                                            key={i}>{value.description}</option>
                                                                )) : ''
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500"
                                                           htmlFor="socket_owner">Socket Owner
                                                        {
                                                            selectedType === 'ASOR003' || props.socketData.socket_owner_type === 'ASOR003' ?
                                                                <span className="text-danger">*</span> : null
                                                        }
                                                    </label>

                                                    <select className="form-control" id="socket_owner"
                                                            value={props.socketData.socket_owner ? props.socketData.socket_owner : ''}
                                                            onChange={(e) => setSelectedOwner(e.target.value)}
                                                            name="socket_owner">
                                                        <option value={''}>Select</option>
                                                        {
                                                            socketOwner.length > 0 && socketOwner.map((value, i) => (
                                                                <option value={value.id}
                                                                        key={i}>{value.ll_vendor_name}</option>
                                                            ))
                                                        }
                                                    </select>

                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500"
                                                           htmlFor="vendor">Vendor <span
                                                        className="text-danger">*</span></label>
                                                    <select className="form-control" name="vendor"
                                                            value={selectedVendor ? selectedVendor : props.socketData.ll_vendor_id}
                                                            onChange={(e) => setSelectedVendor(e.target.value)}>
                                                        <option value={''}>Select</option>
                                                        {
                                                            context.socketVendors.length > 0 ? context.socketVendors.map((value, i) => (
                                                                <option value={value.id}
                                                                        key={i}>{value.ll_vendor_name}</option>
                                                            )) : null
                                                        }
                                                    </select>
                                                </div>

                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="qr">QR
                                                        Enabled</label>
                                                    <div className=" left-side un-pop">
                                                        <select className="form-control" ref={qr_enabled}
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
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-500" htmlFor="public"
                                                           className="width-100">Is
                                                        Public</label>
                                                    <div className=" left-side un-pop">
                                                        <select className="form-control" ref={is_public}
                                                                value={seletedIsPublic ? seletedIsPublic : props.socketData ? props.socketData.is_public : seletedIsPublic}
                                                                onChange={(e) => {
                                                                    setIsPublic(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                status && status.module_values.length > 0 ? status.module_values.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.description}</option>
                                                                )) : ''
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                props.socketData ?
                                                    <EditDataEntry socket_id={socket_id} socketData={props.socketData}
                                                                   is_public={seletedIsPublic ? seletedIsPublic : props.socketData.is_public}
                                                                   dataEntryObject={setDataEntryObject}
                                                                   errors={errors}> </EditDataEntry> : null
                                            }

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
                                                       onClick={submit}>Save</a>
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
export default BasicDetail;


