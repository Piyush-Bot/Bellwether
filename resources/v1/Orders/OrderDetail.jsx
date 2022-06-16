import React, {Component, useEffect, useState,} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import {useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {
    GET_ORDERS_DETAIL
} from "../Auth/Context/AppConstant";
import BreadCrumb from "../Common/BreadCrumb";

import BasicDetail from "./template/BasicDetail";
import PickupTask from "./template/PickupTask";
import DeliveryTask from "./template/DeliveryTask";
import TransactionHistory from "./template/TransactionHistory";


const OrderDetail = () => {
    useEffect(() => {
        orderDetail();
    },[]);
    
    const breadCrumbs = [
        {name: "Orders", url: "/app/order-app", class: "breadcrumb-item"},
        {name: "Order Details", url: "", class: "breadcrumb-item active"}
    ];
    let {order_id} = useParams();
    const [ordersData, setOrdersData] = useState([]);

    const orderDetail = () => {
        axios.get(GET_ORDERS_DETAIL + order_id)
            .then(res => {
                    if (res.data && res.data.success) {
                        console.log('Detail Data', res.data.data);
                        setOrdersData(res.data.data);
                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }

    return (
        <React.Fragment>
            <div className="content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <div className="row align-items-center">
                            <div className="col-sm-6">
                                <h4 className="page-title mt-1 width-auto">Order Details</h4>
                                {/*<div className="font-15 width-auto ml-3">
                                    <span
                                        className="badge badge-pill badge-primary">{socketDetail.socket_status ? helpers.replaceUderscoreWithSpace(socketDetail.socket_status) : ''}</span>
                                </div>*/}
                            </div>
                        </div>
                        <BreadCrumb breadCrumbs={breadCrumbs}></BreadCrumb>
                        <div className="col-md-12  text-right">
                            <Link to={'/app/order-app'} className="btn btn-primary btn-sm"><i
                                className="fa fa-angle-left" aria-hidden="true"></i> Back</Link>
                        </div>
                    </div>
                    
                    <BasicDetail ordersData={ordersData}> </BasicDetail>     

                    <PickupTask pickupData={ordersData}> </PickupTask>              

                    <DeliveryTask deliveryData={ordersData}> </DeliveryTask>       
                    
                    <TransactionHistory transactionData={ordersData}> </TransactionHistory>       
                    
                </div>
            </div>
        </React.Fragment>
    );

}
export default OrderDetail;