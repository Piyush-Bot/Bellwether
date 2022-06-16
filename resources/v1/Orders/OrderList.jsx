import React, {Component, useEffect, useState,} from 'react';
import {Link} from "react-router-dom";
import OrderContext from "./Context/OrderContext";
import axios from "axios";
import {
    GET_ORDERS
} from "../Auth/Context/AppConstant";

import TableNoDataFound from "../Common/TableNoDataFound";
import TableHeader from "../Common/TableHeader";
import Pagination from "react-js-pagination";
import {PaginationCount} from "../Common/PaginationCount";

import Title from "../Common/Title";
import BreadCrumb from "../Common/BreadCrumb";
import toast from "react-hot-toast";

let token = localStorage.getItem('app-ll-token');

const OrderList = () => {
    const [slNo, setSlNo] = useState(1);
    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "OrderId", scope: "col"},
        {label: "Delivery type", scope: "col"},
        {label: "Order Type", scope: "col"},
        {label: "Order Value", scope: "col"},
        {label: "Order Rating", scope: "col"},
        {label: "Action", scope: "col", class: "text-right"}
    ];

    const [ordersData, setOrdersData] = useState([]);
    const [data, setData] = useState([]);
    const [activePage, setActivePage] = useState(1);

    const breadCrumbs = [
        {name: "Order", url: "/app/order-app", class: "breadcrumb-item"},
        {name: "List", url: "/app/order-app", class: "breadcrumb-item active"}
    ];

    useEffect(() => {
        orderList();
    }, [activePage]);
   
    const orderList = () => {
        axios.get(GET_ORDERS +'?page=' + activePage)
            .then(res => {
                    if (res.data && res.data.success) {
                        console.log(res.data);
                        setOrdersData(res.data.data.itemsList);
                        setData(res.data.data.paginator);
                        setSlNo(res.data.data.paginator.slNo);
                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }

    const handlePageChange = (pageNumber) => {
        console.log("handlePageChange - "+pageNumber);
        setActivePage(pageNumber);        // hooks to work
    };

    return(
        <OrderContext.Consumer>
            {
                context => (
                    <React.Fragment>
                        <div className="content">
                            <div className="container-fluid">
                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <Title title={'Order List'}/>
                                    </div>
                                    <BreadCrumb breadCrumbs={breadCrumbs}
                                                backButton={""}> </BreadCrumb>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="card m-b-30">
                                            <div className="card-body table-card">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4 className="mt-0 header-title  pl-3">Order List</h4>
                                                    </div>
                                                    {/*<div className="col-md-6 text-right ">

                                                        <Link
                                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                            to={'/app/configuration-app/add'}>
                                                            <i className="fa fa-plus mr-1" aria-hidden="true"> </i>
                                                            Add New
                                                        </Link>
                                                    </div>*/}
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <TableHeader data={tableHead}/>
                                                        <tbody>
                                                        {
                                                            ordersData && ordersData.length > 0 ? ordersData.map((data, i) => (
                                                                    <tr key={i}>
                                                                        <th>{slNo + (i)}</th>
                                                                        <td> {data.fms_order_id ? data.fms_order_id :''} </td>
                                                                        <td> {data.delivery_type ? data.delivery_type : ''} </td>
                                                                        <td> {data.order_type ? data.order_type : ''} </td>

                                                                        <td> {data.order_value ? data.order_value : ''} </td>
                                                                        <td> {data.order_rating ? data.order_rating : ''} </td>
                                                                        <td className="text-right">
                                                                            <Link
                                                                                to={'/app/order-app/detail/' + data._id}>
                                                                                <div
                                                                                    className="act-links btn btn-warning btn-sm "
                                                                                    data-toggle="tooltip"
                                                                                    data-placement="top" title=""
                                                                                    data-original-title="View"><i
                                                                                    className="fa fa-eye"> </i>
                                                                                </div>
                                                                            </Link>
                                                                        </td>

                                                                    </tr>
                                                                )) :
                                                                <TableNoDataFound message={'No Orders Found!'}
                                                                                  frontSpan={4} backSpan={2}/>


                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="float-left">
                                                    {
                                                        data && data.itemCount > 0 ?
                                                            <PaginationCount currentPage={data.currentPage}
                                                                             totalRecords={data.itemCount}/> : null
                                                    }

                                                </div>
                                                <div className="float-right mt-2 pr-3">
                                                    <div className="Page navigation example">
                                                        {
                                                            data &&  data.itemCount > 0 ?
                                                                <Pagination
                                                                    activePage={data.currentPage ? data.currentPage : 0}
                                                                    itemsCountPerPage={data.perPage ? data.perPage : 0}
                                                                    totalItemsCount={data.itemCount ? data.itemCount : 0}
                                                                    pageRangeDisplayed={data.perPage ? data.perPage : 0}
                                                                    onChange={handlePageChange.bind(this)}
                                                                />
                                                                : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )
            }
        </OrderContext.Consumer>
    );
}

export default OrderList;