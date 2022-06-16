import React, {useEffect, useState} from 'react';
import axios from "axios";
import { 
    GET_ORDERS_DETAIL
} from "../../Auth/Context/AppConstant";

import toast from "react-hot-toast";
import {MomentDateFormat} from "../../Common/MomentDateFormat";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";

const TransactionHistory = (props) => {
    useEffect(() => {
        // getTransactionDetail();
    },[]);
    console.log('Transaction Data', props.transactionData);
  
    const tableHead = [
        {label: "S.No", scope: "col"},
        {label: "Job Id", scope: "col"},
        {label: "Order Id", scope: "col"},
        {label: "Acknowledged DateTime", scope: "col"},
        {label: "Agent Workflow", scope: "col"},
        {label: "Customer Comment", scope: "col"},
        {label: "Customer Email", scope: "col"},
        {label: "Customer Id", scope: "col"},
        {label: "Customer Phone", scope: "col"},
        {label: "Customer Rating", scope: "col"},
        {label: "Customer Username", scope: "col"},
        {label: "Driver Comment", scope: "col"},
        {label: "Fleet Email", scope: "col"},
        {label: "Fleet Id", scope: "col"},
        {label: "Fleet Latitude", scope: "col"},
        {label: "Fleet Longitude", scope: "col"},
        {label: "Fleet Name", scope: "col"},
        {label: "Fleet Phone", scope: "col"},
        {label: "Job Address", scope: "col"},
        {label: "Job Date", scope: "col"},
        {label: "Job Delivery Datetime", scope: "col"},
        {label: "Job Latitude", scope: "col"},
        {label: "Job Longitude", scope: "col"},
        {label: "Job Pickup Address", scope: "col"},
        {label: "Job Pickup Datetime", scope: "col"},
        {label: "Job Pickup Latitude", scope: "col"},
        {label: "Job Pickup Longitude", scope: "col"},
        {label: "Job Pickup Name", scope: "col"},
        {label: "Job Pickup Phone", scope: "col"},
        {label: "Job Time", scope: "col"},
        {label: "Task_State", scope: "col"}
    ];

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card m-b-30">
                        <div className="card-body table-card">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mt-0 header-title  pl-3">Transaction History</h4>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <TableHeader data={tableHead} />
                                        <tbody>
                                        {
                                            props.transactionData && props.transactionData.transaction_data ? props.transactionData.transaction_data.map((value, i) => (
                                                <tr key={i}>
                                                    <th> { 1 + i }</th>
                                                    <td>{value.job_id ? value.job_id : '-'}</td>
                                                    <td> {value.order_id ? value.order_id : '-'}</td>
                                                    <td>{value.acknowledged_datetime ? <MomentDateFormat datetime={value.acknowledged_datetime}/> : '-'}</td>
                                                    <td> {value.agent_workflow ? value.agent_workflow : '-'}</td>
                                                    <td>{value.customer_comment ? value.customer_comment : '-'} </td>
                                                    <td>{value.customer_email ? value.customer_email : '-'} </td>

                                                    <td>{value.customer_id ? value.customer_id : '-'} </td>
                                                    <td> {value.customer_phone ? value.customer_phone : '-'}</td>
                                                    <td> {value.customer_rating ? value.customer_rating : '-'}</td>
                                                    <td>{value.customer_username ? value.customer_username : '-'} </td>
                                                    <td>{value.driver_comment ? value.driver_comment : '-'} </td>

                                                    <td>{value.fleet_email ? value.fleet_email : '-'} </td>
                                                    <td> {value.fleet_id ? value.fleet_id : '-'}</td>
                                                    <td>{value.fleet_latitude ? value.fleet_latitude : '-'} </td>
                                                    <td> {value.fleet_longitude ? value.fleet_longitude : '-'}</td>
                                                    <td> {value.fleet_name ? value.fleet_name : '-'}</td>

                                                    <td>{value.fleet_phone ? value.fleet_phone : '-'} </td>
                                                    <td>{value.job_address ? value.job_address : '-'} </td>
                                                    <td>{value.job_date ? <MomentDateFormat datetime={value.job_date}/> : '-'}</td>
                                                    <td>{value.job_delivery_datetime ? <MomentDateFormat datetime={value.job_delivery_datetime}/> : '-'} </td>

                                                    <td>{value.job_latitude ? value.job_latitude : '-'} </td>
                                                    <td>{value.job_longitude ? value.job_longitude : '-'} </td>
                                                    <td>{value.job_pickup_address ? value.job_pickup_address : '-'} </td><td>{value.job_pickup_datetime ? <MomentDateFormat datetime={value.job_pickup_datetime}/> : '-'} </td>
                                                    <td> {value.job_pickup_latitude ? value.job_pickup_latitude : '-'}</td>
                                                    <td> {value.job_pickup_longitude ? value.job_pickup_longitude : '-'}</td>

                                                    <td>{value.job_pickup_name ? value.job_pickup_name : '-'}</td>
                                                    <td>{value.job_pickup_phone ? value.job_pickup_phone : '-'}</td>
                                                    <td>{value.job_time ? <MomentDateFormat datetime={value.job_time}/> : '-'}</td>
                                                    <td>{value.task_state ? value.task_state : '-'}</td>

                                                </tr>)) :
                                            <TableNoDataFound message={'No  Transaction Data!'} frontSpan={4} backSpan={2} />
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
export default TransactionHistory;