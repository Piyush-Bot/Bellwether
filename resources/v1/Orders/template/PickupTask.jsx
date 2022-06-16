import React, {useEffect, useState} from 'react';
import axios from "axios";
import { 
    GET_ORDERS_DETAIL
} from "../../Auth/Context/AppConstant";

import {MomentDateFormat} from "../../Common/MomentDateFormat";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";

const PickupTask = (props) => {

    useEffect(() => {
        // getPickupDetail();
    },[]);
    console.log('Pickup Data', props.pickupData);

    const tableHead = [
        {label: "S.No", scope: "col"},
        {label: "Pickup Job ID", scope: "col"},
        {label: "Store Name", scope: "col"},
        {label: "Acknowledged DateTime", scope: "col"},
        {label: "Arrived DateTime", scope: "col"},
        {label: "Completed DateTime", scope: "col"},
        {label: "Store Address", scope: "col"},
        {label: "Store Contact Number", scope: "col"},
        {label: "Store Latitude", scope: "col"},
        {label: "Store Longitude", scope: "col"}
    ];
  
    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card m-b-30">
                        <div className="card-body table-card">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mt-0 header-title  pl-3">Pickup Task</h4>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <TableHeader data={tableHead} />
                                    <tbody>
                                    {
                                        props.pickupData && props.pickupData.store_address ? props.pickupData.store_address.map((value, i) => (
                                            <tr key={i}>
                                                <th> { 1+ i }</th>
                                                <td>{value.fms_order_id ? value.fms_order_id : '-'}</td>
                                                <td>{value.store_name ? value.store_name : '-'}</td>
                                                <td> {value.acknowledged_datetime ? <MomentDateFormat datetime={value.acknowledged_datetime}/> : '-'} </td>
                                                <td>{value.arrived_datetime ? <MomentDateFormat datetime={value.arrived_datetime}/> : '-'}</td>
                                                <td>{value.completed_datetime ? <MomentDateFormat datetime={value.completed_datetime}/> : '-'}</td>
                                                
                                                <td>{value.store_address ? value.store_address : '-'}</td>
                                                <td>{value.store_contact_number ? value.store_contact_number : '-'}</td>
                                                <td>{value.store_latitude ? value.store_latitude : '-'}</td>
                                                <td>{value.store_longitude ? value.store_longitude : '-'}</td>
                                            </tr>)) :
                                        <TableNoDataFound message={'No Pickup Task Data!'} frontSpan={5} backSpan={2} />
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
export default PickupTask;