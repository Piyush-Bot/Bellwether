import React, {Component, useEffect, useState} from 'react';
import ChargingContext from './ChargingContext';
import helper from "../../../helpers";
import axios from "axios";
import {
    SOCKET_MODEL_LIST,
    SOCKET_MODULE,
    VENDORS_LIST_BY_MODULE
} from "../../Auth/Context/AppConstant";
import helpers from "../../../helpers";
import toast from "react-hot-toast";

let token = localStorage.getItem('app-ll-token');
export default class ChargingProvider extends Component {
    state = {
        isAuthenticated: true,
        vendors: [],
        socketVendors: [],
        model: [],
        ReVendor: [],
        AllReLocation: [],
        moduleData: [],
        ownerType: '',
        reType: '',
        moduleOwnerTypeId: 0,
        moduleIsPubLicId: 0,
        socketListFilter: [],
        status: []
    };

    /**
     * To find vendor data by module code
     */
    findSocketVendors =  (code) => {
        axios.get(VENDORS_LIST_BY_MODULE + '?module_code=' + code, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({socketVendors: res.data.data},  () => {
                         this.modelData();
                         this.getModuleData();
                    });
                }
            })
    };

    /**
     *Get Socket Model
     * */
    modelData = () => {
        axios.get(SOCKET_MODEL_LIST, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({model: res.data.data});
                    let socketListFilter = [...this.state.socketListFilter];
                    const index = socketListFilter.findIndex((n) => n.id === 'socket_model');
                    if(index > 0){
                        socketListFilter[index].data = [...res.data.data];
                        this.setState({ socketListFilter: socketListFilter });
                    }
                }
            })
    }
    /**
     *Get ALL Modules
     * */
    getModuleData = () => {
        axios.get(SOCKET_MODULE, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({status:helpers.findObject(res.data.data, "module_code", 'MC14')},  () => {  this.setSocketFilterData();});
                    this.setState({moduleData: res.data.data});
                    this.setState({ownerType: helpers.findObject(res.data.data, "module_code", 'ASOR01')});
                    this.setState({reType: helpers.findObject(res.data.data, "module_code", 'REVL01')})
                    this.setState({moduleOwnerTypeId: helpers.findObject(res.data.data, 'module_code', 'ASOR003')});
                    this.setState({moduleIsPubLicId: helpers.findObject(res.data.data, 'module_code', 'YN001')});
                }
            })
    }

    /**
     * Handle common errors & invalid api requests
     */
    handleErrors = () => {
        axios.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
        }, function (error) {
            if (!error.response) {
                // alert('There is a network error, please reload the page.');
                console.log('There is a network error, please reload the page.');
                console.log(error);
            }

            if (error.response.status === 401) {
                // window.location.reload();
                toast.error('unauthorised action');
            }
            // Do something with response error
            return Promise.reject(error);
        });
    };
    // frame socket filter data
    setSocketFilterData =  () => {

         this.setState({
            socketListFilter: [
                {
                    label: 'Socket Vendor',
                    type: 'select',
                    id: 'socket_vendor',
                    name: 'socket_vendor',
                    display_column_name: 'll_vendor_name',
                    data: this.state.socketVendors ? this.state.socketVendors : null,
                },
                {
                    label: 'Socket Model',
                    type: 'select',
                    id: 'socket_model',
                    name: 'socket_model',
                    display_column_name: 'll_model_name',
                    data: this.state.model ? this.state.model : null,
                },
                {
                    label: 'Socket Status',
                    type: 'select',
                    id: 'socket_status',
                    name: 'socket_status',
                    display_column_name: 'name',
                    data: [
                        {name: 'Received', id: 'RECEIVED'},
                        {name: 'Quality Check Approved', id: 'QUALITY_CHECK_APPROVED'},
                        {name: 'Ready To Install', id: 'READY_TO_INSTALL'},
                        {name: 'Free', id: 'FREE'}]
                },

                {
                    label: 'QR Enable',
                    type: 'select',
                    id: 'qr_status',
                    name: 'qr_status',
                    display_column_name: 'description',
                    data: this.state.status ? this.state.status : null,
                },
                {
                    label: 'Is Public',
                    type: 'select',
                    id: 'is_public',
                    name: 'is_public',
                    display_column_name: 'description',
                    data: this.state.status ? this.state.status : null,
                }

            ]
        })
    }


    // Life-Cycle Methods
    componentDidMount() {

        /*common error handler when auth failed*/
        helper.handlePreRequest();
        this.handleErrors();
        this.findSocketVendors('VT08');
        const token = localStorage.getItem('app-ll-token');
        helper.validateBrowserToken(token);

    }

    render() {
        return (
            <ChargingContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                vendors: this.state.vendors,
                socketVendors: this.state.socketVendors,
                model: this.state.model,
                ReVendor: this.state.ReVendor,
                ownerType: this.state.ownerType,
                reType: this.state.reType,
                moduleData: this.state.moduleData,
                moduleOwnerTypeId: this.state.moduleOwnerTypeId,
                moduleIsPubLicId: this.state.moduleIsPubLicId,
                AllReLocation: this.state.AllReLocation,
                socketListFilterData:  this.state.socketListFilter,
            }}>
                {this.props.children}
            </ChargingContext.Provider>
        )
    }
}
