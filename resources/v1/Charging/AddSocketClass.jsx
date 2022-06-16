import React, {Component} from "react";
import axios from "axios";
import {
    GET_AMS_ASSET,
    GET_AMS_LOCATION,
    SOCKET_MODULE, SOCKET_STORE,
    VENDORS_LIST_BY_MODULE
} from "../Auth/Context/AppConstant";

import ValidationError from "../Common/ValidationError";
import BreadCrumb from "../Common/BreadCrumb";
import Title from "../Common/Title";
import ChargingContext from "./Context/ChargingContext";
import helpers from "../../helpers";
import {Link} from "react-router-dom";
import toast from 'react-hot-toast';



const loggedInUserDetails = localStorage.getItem('loggedInUserDetails');
const dashboardAdmin = helpers.showSocketAndBookingControlMenu(loggedInUserDetails);


const breadCrumbs = [
    {name: "Charging Sockets", url: "/app/charging-app", class: "breadcrumb-item"},
    {name: "Add", url: "/app/charging-app/add/socket", class: "breadcrumb-item active"}
];

export default class AddSocketClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formField: {
                vendor_socket_id: '',
                socket_srl_no: '',
                model: '',
                socket_owner_type: '',
                socket_owner: '',
                vendor: '',
                qr_enabled: '',
                is_public: '',
                addition_field: false,
                landmark: '',
                latitude: '',
                longitude: '',
                address: '',
                location_id: '',
                ams_asset_purchase_id: '',
                invoice_num: ''

            },
            master: {
                socket_owner_type: [],
                socket_owner: [],
                yes_no: [],
                ams_location: [],
                ams_asset_purchase: [],
            },
            errors: []
        };
    }

    componentDidMount() {
        console.log('component mount');
        this.fetchModuleData();
        this.fetchAmsLocation();
    }

    /**
     * To change the value of fields
     */
    onFieldChangeHandler = (key, value) => {
        let formField = {...this.state.formField};
        formField[key] = value;
        if(key === 'socket_owner_type'){
            this.fetchSocketOwnerData(value);
            formField['socket_owner'] = '';
        }

        if(key === "location_id") {
            this.fetchAmsAssetPurchase(value);
        }

        if(key === 'is_public'){
            const yesNo = [...this.state.master.yes_no];
            const yes =  helpers.findObject(yesNo, "module_code", "YN001");
            formField['addition_field'] = yes && parseInt(yes.id) === parseInt(value);
        }

        this.setState({ formField: formField});
    };

    /**
     * fetch module data's & assign to separate states
     */
    fetchModuleData = () => {
        axios.get(SOCKET_MODULE)
            .then(res => {
                if(res.status === 200 && res.data.success){
                    const modules = res.data.data;
                    let master = {...this.state.master};
                    master.socket_owner_type = [...helpers.findObject(modules, "module_code", 'ASOR01').module_values];
                    master.yes_no = [...helpers.findObject(modules, "module_code", 'MC14').module_values];
                    this.setState({ master: master });
                }
            });
    };

    /**
     * fetch Ams location
     */
    fetchAmsLocation = () => {
        axios.get(GET_AMS_LOCATION)
            .then(res => {
                if(res.status === 200 && res.data.success){
                    const data = res.data.data;
                    let master = {...this.state.master};
                    master.ams_location = data;
                    this.setState({ master: master });
                }
            });
    };

    /**
     * fetch Ams asset purchase
     */
    fetchAmsAssetPurchase = (id) => {
        axios.get(GET_AMS_ASSET + id)
            .then(res => {
                if(res.status === 200 && res.data.success){
                    const data = res.data.data;
                    let master = {...this.state.master};
                    master.ams_asset_purchase = data;
                    this.setState({ master: master });
                }
            });
    };

    /**
     * Fetch socket owner vendor data
     */
    fetchSocketOwnerData = (value) => {
        let code = value === 'ASOR003' ? 'VT08' : value;
        axios.get(VENDORS_LIST_BY_MODULE + '?module_code=' + code)
            .then(res => {
                if(res.status === 200 && res.data.success){
                    console.log(res.data.data);
                    let master = {...this.state.master};
                    master.socket_owner = [...res.data.data];
                    this.setState({ master:master });
                }
            });
    };

    /**
     * handle form submit event
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const formData = {...this.state.formField};

        let postData = {
            model_id: formData.model,
            vendor_socket_id: formData.vendor_socket_id,
            socket_srl_no: formData.socket_srl_no,
            vendor: formData.vendor,
            socket_owner_type: formData.socket_owner_type !== '' ? helpers.findNamefromObject(this.state.master.socket_owner_type, 'module_code', formData.socket_owner_type, 'id') : null,
            socket_owner: formData.socket_owner,
            qr_enabled: formData.qr_enabled,
            is_public: formData.is_public,
            socket_status: formData.addition_field ? "READY_TO_INSTALL" : "RECEIVED",
            cs_landmark: formData.landmark,
            latitude: formData.latitude,
            longitude: formData.longitude,
            address: formData.address,
            location_id: formData.location_id,
            ams_asset_purchase_id: formData.ams_asset_purchase_id,
            invoice_num: formData.invoice_num
        };

        this.setState({ errors: []});

        axios.post(SOCKET_STORE, postData)
            .then(res => {
                if (res.data && res.data.success) {
                    toast.success(res.data.msg);
                    return this.props.history.push('/app/charging-app');
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                    this.setState({errors: error.response.data.errors});
                }
            });
    };

    render() {
        return (
            <ChargingContext.Consumer>
                {
                    context => (
                        <div className="content">
                            <div className="container-fluid">
                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <Title title={'Add Charging Socket'}/>
                                    </div>
                                    <BreadCrumb breadCrumbs={breadCrumbs}
                                                backButton={{url: '/app/charging-app', label: 'Back'}}> </BreadCrumb>
                                </div>

                                <div className="row">
                                    <div className="col-xl-12">
                                        <form onSubmit={(e) => this.handleSubmit(e)}>

                                            <div className="card m-b-30">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="vendor_socket_id">
                                                                    Vendor Socket Id
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                                <input className="form-control" onChange={(e) => this.onFieldChangeHandler('vendor_socket_id', e.target.value)}
                                                                       type="text" name="vendor_socket_id"
                                                                       id="vendor_socket_id" value={this.state.formField.vendor_socket_id} />
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'vendor_socket_id'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="socket_srl_no">Socket Sl Number
                                                                    <span className="text-danger">*</span></label>
                                                                <input className="form-control" type="text" name="socket_srl_no"
                                                                       onChange={(e) => this.onFieldChangeHandler('socket_srl_no', e.target.value)}
                                                                       id="socket_srl_no" value={this.state.formField.socket_srl_no} />
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'socket_srl_no'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="model">Model<span
                                                                    className="text-danger">*</span></label>
                                                                <select id="model" name="model"
                                                                        onChange={(e) => this.onFieldChangeHandler('model', e.target.value)}
                                                                        value={this.state.formField.model} className="form-control">
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        context.model && context.model.length > 0 && context.model.map((value, i) => (
                                                                            <option value={value.id}
                                                                                    key={i}>{value.ll_model_name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'model_id'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="socket_owner_type">Socket Owner Type
                                                                    <span className="text-danger">*</span></label>
                                                                <select className="form-control" id="socket_owner_type"
                                                                        onChange={(e) => this.onFieldChangeHandler('socket_owner_type', e.target.value)}
                                                                        value={this.state.formField.socket_owner_type}
                                                                        name="socket_owner_type" >
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        this.state.master.socket_owner_type.length > 0 && this.state.master.socket_owner_type.map((value, i) => (
                                                                            <option value={value.module_code}
                                                                                    key={i}>{value.description}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'socket_owner_type'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="socket_owner">Socket Owner
                                                                    {
                                                                        this.state.formField.socket_owner_type === 'ASOR003' &&
                                                                            <span className="text-danger">*</span>
                                                                    }
                                                                </label>
                                                                <select className="form-control" id="socket_owner"
                                                                        value={this.state.formField.socket_owner}
                                                                        onChange={(e) => this.onFieldChangeHandler('socket_owner', e.target.value)}
                                                                        name="socket_owner">
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        this.state.master.socket_owner.length > 0 && this.state.master.socket_owner.map((value, i) => (
                                                                            <option value={value.id}
                                                                                    key={i}>{value.ll_vendor_name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'socket_owner'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500"
                                                                       htmlFor="vendor">Vendor
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                                <select className="form-control" name="vendor" id="vendor"
                                                                        value={this.state.formField.vendor}
                                                                        onChange={(e) => this.onFieldChangeHandler('vendor', e.target.value)}>
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        context.socketVendors.length > 0 ? context.socketVendors.map((value, i) => (
                                                                            <option value={value.id}
                                                                                    key={i}>{value.ll_vendor_name}</option>
                                                                        )) : null
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'vendor'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="qr_enabled">Ams Location
                                                                    <span className="text-danger">*</span></label>
                                                                <select className="form-control" id="ams_location"
                                                                        value={this.state.formField.location_id}
                                                                        onChange={(e) => this.onFieldChangeHandler("location_id", e.target.value)}
                                                                        name="qr_enabled">
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        this.state.master.ams_location.length > 0 && this.state.master.ams_location.map((value, i) => (
                                                                            <option value={value.id}
                                                                                    key={i}>{value.name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'location_id'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="qr_enabled">Ams Asset Purchase
                                                                    <span className="text-danger">*</span></label>
                                                                <select className="form-control" id="ams_asset_purchase_id"
                                                                        value={this.state.formField.ams_asset_purchase_id}
                                                                        onChange={(e) => this.onFieldChangeHandler("ams_asset_purchase_id", e.target.value)}
                                                                        name="qr_enabled">
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        this.state.master.ams_asset_purchase.length > 0 && this.state.master.ams_asset_purchase.map((value, i) => (
                                                                            <option value={value.id}
                                                                                    key={i}>{value.po_number + '-' + value.name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'ams_asset_purchase_id'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="qr_enabled">Invoice Number
                                                                    <span className="text-danger">*</span></label>
                                                                <input className="form-control" onChange={(e) => this.onFieldChangeHandler('invoice_num', e.target.value)}
                                                                       type="text" name="vendor_socket_id"
                                                                       id="invoice_num" value={this.state.formField.invoice_num} />

                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'invoice_num'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="qr_enabled">QR Enabled
                                                                    <span className="text-danger">*</span></label>
                                                                <select className="form-control" id="qr_enabled"
                                                                        value={this.state.formField.qr_enabled}
                                                                        onChange={(e) => this.onFieldChangeHandler('qr_enabled', e.target.value)}
                                                                        name="qr_enabled">
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        this.state.master.yes_no.length > 0 && this.state.master.yes_no.map((value, i) => (
                                                                            <option value={value.id}
                                                                                    key={i}>{value.description}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'qr_enabled'} /> }
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4">
                                                            <div className="form-group">
                                                                <label className="font-weight-500" htmlFor="is_public">Is Public
                                                                    <span className="text-danger">*</span></label>
                                                                <select className="form-control" id="is_public"
                                                                        value={this.state.formField.is_public}
                                                                        onChange={(e) => this.onFieldChangeHandler('is_public', e.target.value)}
                                                                        name="is_public">
                                                                    <option value={''} disabled={true}>Select</option>
                                                                    {
                                                                        this.state.master.yes_no.length > 0 && this.state.master.yes_no.map((value, i) => (
                                                                            <option value={value.id}
                                                                                    key={i}>{value.description}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'is_public'} /> }
                                                            </div>
                                                        </div>

                                                        {
                                                            this.state.formField.addition_field &&
                                                                <div className="col-md-6 col-lg-4">
                                                                    <div className="form-group">
                                                                        <label className="font-weight-500"
                                                                               htmlFor="landmark">CS Landmark
                                                                            <span className="text-danger">*</span>
                                                                        </label>
                                                                        <input name="landmark" className="form-control" type="text"
                                                                               value={this.state.formField.landmark}
                                                                               onChange={(e) => this.onFieldChangeHandler('landmark', e.target.value)}
                                                                               id="landmark"/>
                                                                        { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'cs_landmark'} /> }
                                                                    </div>
                                                                </div>
                                                        }


                                                        {
                                                            this.state.formField.addition_field &&
                                                                <div className="col-md-6 col-lg-4">
                                                                    <div className="form-group">
                                                                        <label className="font-weight-500 width-100"
                                                                               htmlFor="latitude">Latitude
                                                                            <span className="text-danger">*</span>
                                                                        </label>
                                                                        <input className="form-control" type="text"
                                                                               value={this.state.formField.latitude} name="latitude"
                                                                               onChange={(e) => this.onFieldChangeHandler('latitude', e.target.value)}
                                                                               id="latitude"/>
                                                                        { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'latitude'} /> }
                                                                    </div>
                                                                </div>
                                                        }
                                                        {
                                                            this.state.formField.addition_field &&
                                                                <div className="col-md-6 col-lg-4">
                                                                    <div className="form-group">
                                                                        <label className="font-weight-500 width-100"
                                                                               htmlFor="longitude">Longitude
                                                                            <span className="text-danger">*</span>
                                                                        </label>
                                                                        <input className="form-control" type="text"
                                                                               value={this.state.formField.longitude} name="longitude"
                                                                               onChange={(e) => this.onFieldChangeHandler('longitude', e.target.value)}
                                                                               id="longitude"/>
                                                                        { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'longitude'} /> }
                                                                    </div>
                                                                </div>
                                                        }

                                                        {
                                                            this.state.formField.addition_field &&
                                                            <div className="col-md-6 col-lg-4">
                                                                <div className="form-group">
                                                                    <label className="font-weight-500 width-100"
                                                                           htmlFor="longitude">Address
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                    <input className="form-control" type="text"
                                                                           value={this.state.formField.address} name="address"
                                                                           onChange={(e) => this.onFieldChangeHandler('address', e.target.value)}
                                                                           id="address"/>
                                                                    { this.state.errors.length > 0 && <ValidationError array={this.state.errors}  param={'address'} /> }
                                                                </div>
                                                            </div>
                                                        }

                                                        <div className="col-md-12 col-lg-8\12">
                                                            <div className="act-links mt-2 text-right">

                                                                <Link className="btn btn-danger waves-effect waves-light mr-3"
                                                                      to={'/app/charging-app'}>
                                                                    Cancel
                                                                </Link>
                                                                <button type={"submit"}
                                                                        className="btn btn-success waves-effect waves-light">Save</button>
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
                    
                 )
                     
                 }
            </ChargingContext.Consumer>
        )
    }
}
