import React, {useEffect, useState} from "react";
import ChargingContext from "../Context/ChargingContext";
import {useParams} from "react-router-dom";
import axios from "axios";
import {RE_VENDOR_LOCATION, SOCKET_DATA_ENTRY_UPDATE} from "../../Auth/Context/AppConstant";
import ValidationError from "../../Common/ValidationError";

let token = localStorage.getItem('app-ll-token')

const DataEntry = (props) => {
    const [selectedReVendor, setSelectedReVendor] = useState(props.socketData.re_owner);
    const [show, setShow] = useState(false);
    const [showDataEntry, setShowDataEntry] = useState(true);
    let {socket_id} = useParams();
    let model_id = React.createRef();
    let socket_owner = React.createRef();
    let socket_owner_type = React.createRef();
    let re_type = React.createRef();
    let re_owner = React.createRef();
    let re_location = React.createRef();
    let cs_landmark = React.createRef();
    let latitude = React.createRef();
    let longitude = React.createRef();
    const [vendorLocation, setVendorLocation] = useState([]);
    const [errors, setErrors] = useState([]);

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedOwnerType, setSelectedOwnerType] = useState('');
    const [selectedSocketOwner, setSelectedSocketOwner] = useState('');
    const [selectedReType, setSelectedReType] = useState('');
    const [selectedReOwner, setSelectedReOwner] = useState('');
    const [selectedReLocation, setSelectedReLocation] = useState('');

    const [selectedLandmark, setSelectedLandmark] = useState('');
    const [selectedLatitude, setSelectedLatitude] = useState('');
    const [selectedLongitude, setSelectedLongitude] = useState('');

    useEffect(() => {
        setTimeout(() => {
            getREVendorLocation();
        }, 1000);
    }, [selectedReVendor]);

    /**
     *Get RE Location
     * */
    const getREVendorLocation = () => {
        if (selectedReVendor) {
            axios.get(RE_VENDOR_LOCATION + '/' + selectedReVendor, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.data && res.data.success) {
                        setVendorLocation(res.data.data);
                    }
                })
        }
    };

    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
        setShowDataEntry(false);
        setSelectedReVendor(props.socketData ? props.socketData.re_owner : 0);
    };

    const submit = () => {
        let postData = {
            socket_owner: socket_owner.current.value,
            socket_owner_type: socket_owner_type.current.value,
            re_type: re_type.current.value,
            re_owner: re_owner.current.value,
            re_location: re_location.current.value,
            cs_landmark: cs_landmark.current.value,
            latitude: latitude.current.value,
            longitude: longitude.current.value,
            model_id: model_id.current.value,
            socket_status: 'READY_TO_INSTALL'
        };

        axios.put(SOCKET_DATA_ENTRY_UPDATE + '/' + socket_id, postData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                setErrors([]);
                if (res.data && res.data.success) {
                    alert(res.data.msg);
                    window.location.href = '/app/charging-app';
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                    setErrors(error.response.data.errors);
                }
            })
    };


    return (
        <ChargingContext.Consumer>
            {
                context => (
                    <>
                        {showDataEntry ? <div className="row">
                            <div className="col-xl-12">
                                <div className="card m-b-30">
                                    <div className="card-body">
                                        <h4 className="mt-0 header-title  width-auto">Data entry</h4>

                                        <div className="row">
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Owner Type</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.socket_owner_type && props.socketData.socket_owner_type_value ? props.socketData.socket_owner_type_value.description : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Socket Owner</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.socket_owner && props.socketData.socket_owner_value ? props.socketData.socket_owner_value.ll_vendor_name : '-'}</span>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">AMS Location</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.ams_location && props.socketData.ams_location.name ? props.socketData.ams_location.name : '-'}</span>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">AMS Asset
                                                        purchase</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.ams_asset_purchase && props.socketData.ams_asset_purchase.name ? props.socketData.ams_asset_purchase.po_number + '-' + props.socketData.ams_asset_purchase.name : '-'}</span>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Invoice Number
                                                        </label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.invoice_num ? props.socketData.invoice_num : '-'}</span>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">RE Type</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.re_type && props.socketData.re_type_value ? props.socketData.re_type_value.description : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">RE Owner</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.re_owner && props.socketData.re_owner_value ? props.socketData.re_owner_value.ll_name : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">RE Location</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.re_location && props.socketData.re_owner_location ? props.socketData.re_owner_location.ll_name + '-' + props.socketData.re_owner_location.ll_address_line1 : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">CS Landmark</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.cs_landmark ? props.socketData.cs_landmark : '-'}</span>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Latitude</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.latitude ? props.socketData.latitude : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Longitude</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600">{props.socketData && props.socketData.longitude ? props.socketData.longitude : '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> : null}
                        {show ?
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card m-b-30">
                                        <div className="card-body">
                                            <h4 className="mt-0 header-title">Data entry</h4>
                                            <div className="row">
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500"
                                                               htmlFor="type">Model Id<span
                                                            className="text-danger">*</span></label>
                                                        <select className="form-control" ref={model_id}
                                                                value={selectedModel ? selectedModel : props.socketData ? props.socketData.model_id : selectedModel}
                                                                onChange={(e) => {
                                                                    setSelectedModel(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                context.model && context.model.length > 0 ? context.model.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.ll_model_name}</option>
                                                                )) : ''
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'model_id'}> </ValidationError> : ''
                                                    }
                                                </div>

                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="owner-type">Owner
                                                            Type<span
                                                                className="text-danger">*</span></label>
                                                        <div className=" left-side un-pop">
                                                            <select className="form-control" ref={socket_owner_type}
                                                                    value={selectedOwnerType ? selectedOwnerType : props.socketData ? props.socketData.socket_owner_type : selectedOwnerType}
                                                                    onChange={(e) => {
                                                                        setSelectedOwnerType(e.target.value)
                                                                    }}>
                                                                <option value={''}>Select</option>
                                                                {
                                                                    context.ownerType && context.ownerType.module_values.length > 0 ? context.ownerType.module_values.map((value, i) => (
                                                                        <option value={value.id}
                                                                                key={i}>{value.description}</option>
                                                                    )) : ''
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'socket_owner_type'}> </ValidationError> : ''
                                                    }
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="socket-owner">Select
                                                            Socket
                                                            Owner<span
                                                                className="text-danger">*</span></label>
                                                        <select className="form-control" name="vendor"
                                                                ref={socket_owner}
                                                                value={selectedSocketOwner ? selectedSocketOwner : props.socketData ? props.socketData.socket_owner : selectedSocketOwner}
                                                                onChange={(e) => {
                                                                    setSelectedSocketOwner(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                context.vendors.length > 0 ? context.vendors.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.ll_vendor_name}</option>
                                                                )) : <option value={0} key={0}>No Socket Owner</option>
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'socket_owner'}> </ValidationError> : ''
                                                    }
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="re-type">Select
                                                            RE
                                                            Type<span
                                                                className="text-danger">*</span></label>
                                                        <select className="form-control" name="vendor" ref={re_type}
                                                                value={selectedReType ? selectedReType : props.socketData ? props.socketData.re_type : selectedReType}
                                                                onChange={(e) => {
                                                                    setSelectedReType(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                context.reType && context.reType.module_values.length > 0 ? context.reType.module_values.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.description}</option>
                                                                )) : <option value={0} key={0}>No RE Locations</option>
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'re_type'}> </ValidationError> : ''
                                                    }
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="re-type">Select
                                                            RE
                                                            Owner<span
                                                                className="text-danger">*</span></label>
                                                        <select className="form-control" name="vendor" ref={re_owner}
                                                                value={selectedReOwner ? selectedReOwner : props.socketData ? props.socketData.re_owner : selectedReOwner}
                                                                onChange={(e) => {
                                                                    setSelectedReOwner(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                context.ReVendor && context.ReVendor.length > 0 ? context.ReVendor.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.ll_name}</option>
                                                                )) : <option value={0} key={0}>No Re Owner</option>
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'re_owner'}> </ValidationError> : ''
                                                    }
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="re-type">Select
                                                            RE
                                                            Location<span
                                                                className="text-danger">*</span></label>
                                                        <select className="form-control" name="vendor" ref={re_location}
                                                                value={selectedReLocation ? selectedReLocation : props.socketData ? props.socketData.re_location : selectedReLocation}
                                                                onChange={(e) => {
                                                                    setSelectedReLocation(e.target.value)
                                                                }}>
                                                            <option value={''}>Select</option>
                                                            {
                                                                vendorLocation && vendorLocation.length > 0 ? vendorLocation.map((value, i) => (
                                                                    <option value={value.id}
                                                                            key={i}>{value.ll_address_line1 ? value.ll_address_line1 : value.ll_address_line2}</option>
                                                                )) : <option value={0} key={0}>No Type</option>
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'re_location'}> </ValidationError> : ''
                                                    }
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="landmark">CS
                                                            Landmark<span
                                                                className="text-danger">*</span></label>
                                                        <input className="form-control" type="text" ref={cs_landmark}
                                                               value={props.socketData ? props.socketData.cs_landmark : selectedLandmark}
                                                               id="landmark"
                                                               onChange={(e) => {
                                                                   setSelectedLandmark(e.target.value)
                                                               }}
                                                        />
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'cs_landmark'}> </ValidationError> : ''
                                                    }
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="latitude"
                                                               className="width-100">Latitude<span
                                                            className="text-danger">*</span></label>
                                                        <input className="form-control" type="text" ref={latitude}
                                                               value={props.socketData ? props.socketData.latitude : selectedLatitude}
                                                               id="latitude" onChange={(e) => {
                                                            setSelectedLatitude(e.target.value)
                                                        }}/>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'latitude'}> </ValidationError> : ''
                                                    }
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="form-group">
                                                        <label className="font-weight-500" htmlFor="longitude"
                                                               className="width-100">Longitude<span
                                                            className="text-danger">*</span></label>
                                                        <input className="form-control" type="text" ref={longitude}
                                                               value={props.socketData ? props.socketData.longitude : ''}
                                                               id="longitude" onChange={(e) => {
                                                            setSelectedLongitude(e.target.value)
                                                        }}/>
                                                    </div>
                                                    {
                                                        errors && errors.length > 0 ? <ValidationError array={errors}
                                                                                                       param={'longitude'}> </ValidationError> : ''
                                                    }
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="act-links mt-4 text-right">
                                                        <a href="#"
                                                           className="btn btn-danger waves-effect waves-light mr-3"
                                                           onClick={() => {
                                                               setShow(false)
                                                               setShowDataEntry(true)
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
export default DataEntry;
