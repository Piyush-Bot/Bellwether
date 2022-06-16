import React, {useEffect, useState} from 'react';
import axios from "axios";
import { 
    GET_ORDERS_DETAIL
} from "../../Auth/Context/AppConstant";

import toast from "react-hot-toast";
import {MomentDateFormat} from "../../Common/MomentDateFormat";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";

const DeliveryTask = (props) => {
    useEffect(() => {
        // getDeliveryDetail();
    },[]);
    console.log('Delivery Data', props.deliveryData);
  
    const tableHead = [
        {label: "S.No", scope: "col"},
        {label: "Delivery Job ID", scope: "col"},
        {label: "Customer Name", scope: "col"},
        {label: "Acknowledged DateTime", scope: "col"},
        {label: "Arrived DateTime", scope: "col"},
        {label: "Completed DateTime", scope: "col"},
        {label: "Customer Address", scope: "col"},
        {label: "Customer Contact Number", scope: "col"},
        {label: "Customer Latitude", scope: "col"},
        {label: "Customer Longitude", scope: "col"}
    ];

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card m-b-30">
                        <div className="card-body table-card">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mt-0 header-title  pl-3">Delivery Task</h4>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <TableHeader data={tableHead} />
                                    <tbody>
                                        {
                                            props.deliveryData && props.deliveryData.customer_address ? props.deliveryData.customer_address.map((value, i) => (
                                                    <tr key={i}>
                                                        <th> { 1+ i }</th>
                                                        <td>{value.fms_order_id ? value.fms_order_id : '-'}</td>
                                                        <td>{value.customer_name ? value.customer_name : '-'}</td>
                                                        <td> {value.acknowledged_datetime ? <MomentDateFormat datetime={value.acknowledged_datetime}/> : '-'} </td>
                                                        <td>{value.arrived_datetime ? <MomentDateFormat datetime={value.arrived_datetime}/> : '-'}</td>
                                                        <td>{value.completed_datetime ? <MomentDateFormat datetime={value.completed_datetime}/> : '-'}</td>
                                                        <td>{value.customer_address ? value.customer_address : '-'}</td>
                                                        <td>{value.customer_contact_number ? value.customer_contact_number : '-'}</td>
                                                        <td>{value.customer_latitude ? value.customer_latitude : '-'}</td>
                                                        <td>{value.customer_longitude ? value.customer_longitude : '-'}</td>

                                                    </tr>)) :
                                                <TableNoDataFound message={'No Drop Task Data!'} frontSpan={5} backSpan={2} />
                                        }
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    

}
export default DeliveryTask;