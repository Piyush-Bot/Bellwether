import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    RE_VENDOR_LIST,
    RE_VENDOR_LOCATION
} from "../Auth/Context/AppConstant";
import ChargingContext from "./Context/ChargingContext";
import ValidationError from "../Common/ValidationError";

const EditDataEntry = (props) => {
    let data = {
        re_type: props.socketData.re_type !== 0 ? props.socketData.re_type : '',
        re_owner: props.socketData.re_owner !== 0 ? props.socketData.re_owner : '',
        re_location: props.socketData.re_location !== 0 ? props.socketData.re_location : '',
        cs_landmark: props.socketData.cs_landmark,
        latitude: props.socketData.latitude,
        longitude: props.socketData.longitude,
        address: props.socketData.address
    }
    const [dataEntryValue, setDataEntryValue] = useState(data);
    props.dataEntryObject(dataEntryValue);
    const [ReVendor, setReVendor] = useState([]);
    const [vendorLocation, setVendorLocation] = useState([]);
    const [errors, setErrors] = useState([]);
    let type = parseInt(dataEntryValue.re_type) === 0 ? props.socketData.re_type : dataEntryValue.re_type;
    let owner = parseInt(dataEntryValue.re_owner) === 0 ? props.socketData.re_owner : dataEntryValue.re_owner;
    useEffect(() => {
        getREVendorLocation();
        getREVendor();
    }, [type, owner]);

    const [dataEntryStatus, setDataEntryStatus] = useState(props.socketData && props.socketData.re_type !== 0 ? 'YES' : 'NO');

    /**
     *Get RE Vendor
     * */
    const getREVendor = () => {

        //re_type
        axios.get(RE_VENDOR_LIST + '?type_id=' + type)
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

        axios.get(RE_VENDOR_LOCATION + '/' + owner)
            .then(res => {
                if (res.data && res.data.success) {
                    setVendorLocation(res.data.data);
                }
            })
    }
    const frameDataEntry = (key, value) => {
        setDataEntryValue(state => ({...state, [key]: value}));
    }
    /**/
    return (
        <ChargingContext.Consumer>
            {
                context => (
                    props.socketData ?
                        <>
                            <div className="col-md-6 col-lg-4">
                                <div className="form-group">
                                    <label className="font-weight-500" htmlFor="public"
                                           className="width-100">
                                        CS
                                        Landmark<span
                                        className="text-danger">*</span></label>
                                    <div className=" left-side un-pop">
                                        <input className="form-control" type="text"
                                               value={dataEntryValue ? dataEntryValue.cs_landmark : '-'}
                                               onChange={(e) => {
                                                   frameDataEntry('cs_landmark', e.target.value)
                                               }}
                                               id="socket-id"/>
                                        {
                                            props.errors && props.errors.length > 0 ?
                                                <ValidationError array={props.errors}
                                                                 param={'cs_landmark'}> </ValidationError> : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="form-group">
                                    <label className="font-weight-500" htmlFor="public"
                                           className="width-100">
                                        Latitude<span
                                        className="text-danger">*</span></label>
                                    <div className=" left-side un-pop">
                                        <input className="form-control" type="text"
                                               value={dataEntryValue ? dataEntryValue.latitude : '-'}
                                               onChange={(e) => {
                                                   frameDataEntry('latitude', e.target.value)
                                               }}
                                               id="socket-id"/>
                                        {
                                            props.errors && props.errors.length > 0 ?
                                                <ValidationError array={props.errors}
                                                                 param={'latitude'}> </ValidationError> : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="form-group">
                                    <label className="font-weight-500 width-100" htmlFor="public">
                                        Longitude <span className="text-danger">*</span></label>
                                    <div className=" left-side un-pop">
                                        <input className="form-control" type="text"
                                               value={dataEntryValue ? dataEntryValue.longitude : '-'}
                                               onChange={(e) => {
                                                   frameDataEntry('longitude', e.target.value)
                                               }}
                                               id="socket-id"/>
                                        {
                                            props.errors && props.errors.length > 0 ?
                                                <ValidationError array={props.errors}
                                                                 param={'longitude'}> </ValidationError> : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                props.is_public && parseInt(props.is_public) === parseInt(context.moduleIsPubLicId.id) ? <>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label className="font-weight-500" htmlFor="public"
                                                   className="width-100">
                                                Address <span
                                                className="text-danger">*</span></label>
                                            <div className=" left-side un-pop">
                                                {
                                                    props.is_public && parseInt(props.is_public) === parseInt(context.moduleIsPubLicId.id) ?
                                                        <input className="form-control" type="text"
                                                               value={dataEntryValue ? dataEntryValue.address : '-'}
                                                               onChange={(e) => {
                                                                   frameDataEntry('address', e.target.value)
                                                               }}
                                                               id="socket-id"/>
                                                        :
                                                        <input className="form-control" type="text" disabled={true}
                                                               value={dataEntryValue ? dataEntryValue.address : '-'}
                                                               onChange={(e) => {
                                                                   frameDataEntry('address', e.target.value)
                                                               }}
                                                               id="socket-id"/>
                                                }
                                                {
                                                    props.errors && props.errors.length > 0 ?
                                                        <ValidationError array={props.errors}
                                                                         param={'address'}> </ValidationError> : ''
                                                }

                                            </div>
                                        </ div>
                                    </ div>
                                </> : null
                            }

                            {
                                props.is_public && parseInt(props.is_public) !== parseInt(context.moduleIsPubLicId.id) ?
                                    <>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-500" htmlFor="re-type">Select
                                                    RE
                                                    Type<span
                                                        className="text-danger">*</span></label>
                                                <select className="form-control" name="vendor"
                                                        value={dataEntryValue.re_type !== 0 ? dataEntryValue.re_type : props.socketData.re_type}
                                                        onChange={(e) => {
                                                            frameDataEntry('re_type', e.target.value)
                                                        }}>
                                                    <option value={''}>Select</option>
                                                    {
                                                        context.ownerType && context.ownerType.module_values.length > 0 ? context.ownerType.module_values.map((value, i) => (
                                                            <option value={value.id}
                                                                    key={i}>{value.description}</option>
                                                        )) : null
                                                    }
                                                </select>
                                                {
                                                    props.errors && props.errors.length > 0 ?
                                                        <ValidationError array={props.errors}
                                                                         param={'re_type'}> </ValidationError> : ''
                                                }

                                            < /div>
                                        < /div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-500" htmlFor="re-type">Select
                                                    RE
                                                    Owner<span
                                                        className="text-danger">*</span></label>
                                                <select className="form-control" name="vendor"
                                                        value={dataEntryValue.re_owner !== 0 ? dataEntryValue.re_owner : props.socketData.re_owner}
                                                        onChange={(e) => {
                                                            frameDataEntry('re_owner', e.target.value)
                                                        }}>
                                                    <option value={''}>Select</option>
                                                    {
                                                        ReVendor && ReVendor.length > 0 ? ReVendor.map((value, i) => (
                                                            <option value={value.id} key={i}>{value.ll_name}</option>
                                                        )) : null
                                                    }
                                                </ select>
                                                {
                                                    props.errors && props.errors.length > 0 ?
                                                        <ValidationError array={props.errors}
                                                                         param={'re_owner'}> </ValidationError> : ''
                                                }
                                            </ div>

                                        </ div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="form-group">
                                                <label className="font-weight-500" htmlFor="re-type">Select
                                                    RE
                                                    Location<span
                                                        className="text-danger">*</span></label>
                                                <select className="form-control" name="vendor"
                                                        value={dataEntryValue.re_location !== 0 ? dataEntryValue.re_location : props.socketData.re_location}
                                                        onChange={(e) => {
                                                            frameDataEntry('re_location', e.target.value)
                                                        }}>
                                                    <option value={''}>Select</option>
                                                    {
                                                        vendorLocation && vendorLocation.length > 0 ? vendorLocation.map((value, i) => (
                                                            <option value={value.id}
                                                                    key={i}>{value.ll_address_line1 ? value.ll_name + '-' + value.ll_address_line1 : value.ll_name + '-' + value.ll_address_line2}</option>
                                                        )) : null
                                                    }
                                                </select>
                                                {
                                                    props.errors && props.errors.length > 0 ?
                                                        <ValidationError array={props.errors}
                                                                         param={'re_location'}> </ValidationError> : ''
                                                }
                                            </div>

                                        </div>
                                    </> : null
                            }
                        </> : null
                )

            }
        </ChargingContext.Consumer>
    )
}
export default EditDataEntry