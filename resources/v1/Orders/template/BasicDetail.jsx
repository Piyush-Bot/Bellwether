import React, {useEffect, useState} from 'react';
import axios from "axios";
import { 
    GET_ORDERS_DETAIL
} from "../../Auth/Context/AppConstant";

import {MomentDateFormat} from "../../Common/MomentDateFormat";


const BasicDetail = (props) => {
    useEffect(() => {
        // orderDetail();
    },[]);

    console.log('Basic Data - ', props.ordersData.ll_fleet_id);

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card m-b-30">
                        <div className="card-body">
                            <h4 className="mt-0 header-title  width-auto">Basic Details</h4>

                            <div className="row">
                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">Fleet Id</label>
                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.ll_fleet_id ? props.ordersData.ll_fleet_id : '-'}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">Delivery Date
                                        </label>

                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.delivery_date ? <MomentDateFormat datetime={props.ordersData.delivery_date}/> : '-'}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">FMS Oreder Id
                                        </label>
                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.fms_order_id ? props.ordersData.fms_order_id : '-'}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">Client Order Id</label>
                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.ll_client_order_id ? props.ordersData.ll_client_order_id : '-'}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">Delivery Time</label>
                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.delivery_time ? <MomentDateFormat datetime={props.ordersData.delivery_time}/> : '-'}</span>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">Order Rating</label>
                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.order_rating ? props.ordersData.order_rating : '-'}</span>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">Order Type</label>
                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.order_type ? props.ordersData.order_type : '-'}</span>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-4">
                                    <div className="form-group">
                                        <label className="font-weight-normal viewlabel">Order Value</label>
                                        <span
                                            className="d-block mt-1 font-weight-600">{props.ordersData && props.ordersData.order_value ? props.ordersData.order_value : '-'}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    

}
export default BasicDetail;