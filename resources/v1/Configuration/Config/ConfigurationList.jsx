import React, {useEffect, useState,} from 'react';
import {Link} from "react-router-dom";

import ConfigurationContext from "../Context/ConfigurationContext";
import { ACCESS_CONFIGURATION } from "../../Auth/Context/AppConstant";

import axios from "axios";
import TableNoDataFound from "../../Common/TableNoDataFound";
import TableHeader from "../../Common/TableHeader";
import { PaginationCount } from "../../Common/PaginationCount";
import Pagination from "react-js-pagination";
import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import toast from "react-hot-toast";

let token = localStorage.getItem('app-ll-token');

const ConfigurationList = () => {

    useEffect(() => {
        configurationList();
    }, []);
    const [slNo, setSlNo] = useState(1);
    const tableHead = [
        {label: "Sl.No", scope: "col"},
        {label: "Name", scope: "col"},
        {label: "Type", scope: "col"},
        {label: "Action", scope: "col", class: "text-right"}
    ];

    const [configurationData, setConfigurationData] = useState([]);
    const [data, setData] = useState([]);
    const [activePage, setActivePage] = useState(1);

    const breadCrumbs = [
        {name: "Configuration", url: "/app/configuration-app/list", class: "breadcrumb-item"},
        {name: "List", url: "/app/configuration-app/list", class: "breadcrumb-item active"}
    ];

    const configurationList = () => {
        axios.get(ACCESS_CONFIGURATION + '?configuration_id=')
            .then(res => {
                    console.log('check1');
                    if (res.data && res.data.success) {
                        setConfigurationData(res.data.data.itemsList);
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
        setActivePage(pageNumber);
        // hooks to work
    };

    return (
        <ConfigurationContext.Consumer>
            {
                context => (
                    <React.Fragment>
                        <div className="content">
                            <div className="container-fluid">
                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <Title title={'Configuration List'}/>
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
                                                        <h4 className="mt-0 header-title  pl-3">Configuration List</h4>
                                                    </div>
                                                    <div className="col-md-6 text-right ">

                                                        <Link
                                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                            to={'/app/configuration-app/add'}>
                                                            <i className="fa fa-plus mr-1" aria-hidden="true"> </i>
                                                            Add New
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <TableHeader data={tableHead}/>
                                                        <tbody>
                                                        {
                                                            configurationData.length > 0 ? configurationData.map((data, i) => (
                                                                    <tr key={i}>
                                                                        <th>{slNo + (i)}</th>
                                                                        <td> {data.name} </td>
                                                                        <td> {data.type} </td>
                                                                        <td className="text-right">
                                                                            <Link
                                                                                to={'/app/configuration-app/sub/list/' + data._id}>
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
                                                                <TableNoDataFound message={'No Configuration Found!'}
                                                                                  frontSpan={2} backSpan={1}/>


                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="float-left">
                                                    {
                                                        data.itemCount > 0 ?
                                                            <PaginationCount currentPage={data.currentPage}
                                                                             totalRecords={data.itemCount}/> : null
                                                    }

                                                </div>
                                                <div className="float-right mt-2 pr-3">
                                                    <div className="Page navigation example">
                                                        {
                                                            data.itemCount > 0 ?
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
        </ConfigurationContext.Consumer>
    )
}

export default ConfigurationList;