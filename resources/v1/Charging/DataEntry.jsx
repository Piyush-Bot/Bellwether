import React, {useEffect, useState, Consumer} from "react";
import axios from "axios";
import {
    RE_VENDOR_LIST,
    RE_VENDOR_LOCATION, SOCKET_DATA_ENTRY_UPDATE, SOCKET_STORE
} from "../Auth/Context/AppConstant";
import ValidationError from "../Common/ValidationError";
import ChargingContext from "./Context/ChargingContext";
import {Link, useParams} from "react-router-dom";
import toast from 'react-hot-toast';

let token = localStorage.getItem('app-ll-token');

const DataEntry = (props) => {
    let {socket_id} = useParams();
    const[selectedReType, setSelectedReType] = useState(0);
    const [ReVendor, setReVendor] = useState([]);
    const [selectedReVendor, setSelectedReVendor] = useState(0);
    const [vendorLocation, setVendorLocation] = useState([]);
    const [selectedReLocation, setSelectedReLocation] = useState(0);
    const [errors, setErrors] = useState([]);
    const [csLandmark, setCsLandmark] = useState('');
    const[latitude, setLatitude] = useState('');
    const[longitude, setLongitude] = useState('')

    useEffect(() => {
        getREVendorLocation();
        getREVendor();
    }, [selectedReType,selectedReVendor]);
    /**
     *Get RE Vendor
     * */
    const getREVendor = () => {
        axios.get(RE_VENDOR_LIST + '?type_id=' + selectedReType, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {
                    setReVendor(res.data.data);
                }
            })
    }

    /**
     *Get RE Location
     * */
    const getREVendorLocation = () => {
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

    const submit = () => {
        let postData = {
            re_type: selectedReType === 0 ? '' : selectedReType,
            re_owner: selectedReVendor === 0 ? '' : selectedReVendor,
            re_location: selectedReLocation === 0 ? '' : selectedReLocation,
            socket_status: 'READY_TO_INSTALL',
            cs_landmark:  csLandmark,
            latitude:  latitude ? latitude : '',
            longitude: longitude ? longitude : '',
        }
      
        axios.put(SOCKET_DATA_ENTRY_UPDATE + '/' +socket_id, postData)
            .then(res => {
                setErrors([]);
                if (res.data && res.data.success) {
                    toast.success(res.data.msg);
                    return props.history.push('/app/charging-app');
                }
            })
            .catch((error) => {
                if(error && error.response && error.response.data && error.response.data.errors.length > 0) {
                    setErrors(error.response.data.errors);
                }
            })
    }

    return (
        <ChargingContext.Consumer>
            {
                context => (
                        <div className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="card m-b-30">
                                            <div className="card-body">
                                                <h4 className="mt-0 header-title">Data entry</h4>
                                                <div className="row">
                                                    <div className="col-md-6 col-lg-4">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="re-type">Select
                                                                RE
                                                                Type<span
                                                                    className="text-danger">*</span></label>
                                                            <select className="form-control" name="vendor" onChange={(e) => {
                                                                setSelectedReType(e.target.value)
                                                            }}>
                                                                <option value={''}>Select</option>
                                                                {
                                                                   context.ownerType && context.ownerType.module_values.length > 0 ? context.ownerType.module_values.map((value, i) =>(
                                                                        <option value={value.id} key={i}>{value.description}</option>
                                                                    )): null
                                                                }
                                                            </select>
                                                            {
                                                                errors && errors.length > 0 ? <ValidationError array={ errors } param={'re_type'}> </ValidationError> : ''
                                                            }
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6 col-lg-4">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="re-type">Select
                                                                RE
                                                                Owner<span
                                                                    className="text-danger">*</span></label>
                                                            <select className="form-control" name="vendor"  onChange={(e) => {
                                                                setSelectedReVendor(e.target.value)
                                                            }}>
                                                                <option value={''}>Select</option>
                                                                {
                                                                    ReVendor && ReVendor.length > 0 ? ReVendor.map((value, i) =>(
                                                                        <option value={value.id} key={i}>{value.ll_name}</option>
                                                                    )): null
                                                                }
                                                            </select>
                                                            {
                                                                errors && errors.length > 0 ? <ValidationError array={ errors } param={'re_owner'}> </ValidationError> : ''
                                                            }
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6 col-lg-4">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="re-type">Select
                                                                RE
                                                                Location<span
                                                                    className="text-danger">*</span></label>
                                                            <select className="form-control" name="vendor" onChange={(e)=>{
                                                                setSelectedReLocation(e.target.value)
                                                            }}>
                                                                <option value={''}>Select</option>
                                                                {
                                                                    vendorLocation && vendorLocation.length > 0 ? vendorLocation.map((value, i) =>(
                                                                        <option value={value.id} key={i}>{value.ll_address_line1 ? value.ll_name + '-' + value.ll_address_line1 : value.ll_name + '-' + value.ll_address_line2}</option>
                                                                    )): null
                                                                }
                                                            </select>
                                                            {
                                                                errors && errors.length > 0 ? <ValidationError array={ errors } param={'re_location'}> </ValidationError> : ''
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="col-md-6 col-lg-4">
                                                        <div className="form-group">
                                                            <label className="font-weight-500"
                                                                   htmlFor="landmark">CS
                                                                Landmark</label>
                                                            <input className="form-control" type="text" onChange={(e) => {setCsLandmark(e.target.value)}}


                                                                   id="landmark"/>
                                                            {
                                                                errors && errors.length > 0 ?
                                                                    <ValidationError array={errors}
                                                                                     param={'cs_landmark'}> </ValidationError> : ''
                                                            }
                                                        </div>

                                                    </div>
                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="latitude"
                                                                       className="width-100">Latitude</label>
                                                                <input className="form-control" type="text" onChange={(e) => {setLatitude(e.target.value)}}

                                                                       id="latitude"/>
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                                         param={'latitude'}> </ValidationError> : ''
                                                                }
                                                            </div>

                                                        </div>

                                                    <div className="col-md-6 col-lg-4">
                                                        <div className="form-group">
                                                            <label className="font-weight-500" htmlFor="longitude"
                                                                   className="width-100">Longitude</label>
                                                            <input className="form-control" type="text" onChange={(e) => { setLongitude(e.target.value)}}

                                                                   id="longitude"/>
                                                            {
                                                                errors && errors.length > 0 ?
                                                                    <ValidationError array={errors}
                                                                                     param={'longitude'}> </ValidationError> : ''
                                                            }
                                                        </div>

                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="act-links mt-4 text-right">
                                                            <Link className="btn btn-danger waves-effect waves-light mr-3"
                                                                  to={'/app/charging-app'}>
                                                                {' '} Cancel
                                                            </Link>
                                                            <a href="#"
                                                               className="btn btn-success waves-effect waves-light" onClick={submit}>Save</a>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                )
            }
        </ChargingContext.Consumer>
    )
}
export default DataEntry;
