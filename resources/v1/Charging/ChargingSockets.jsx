import React, {useEffect, useState,} from 'react';
import {Link} from "react-router-dom";
import Filter from "../Common/Filter";
import ChargingContext from "./Context/ChargingContext";

import axios from "axios";
import {
    SOCKET_LIST, UPDATE_SOCKET_STATUS, SOCKET_MODULE
} from "../Auth/Context/AppConstant";
import Pagination from "react-js-pagination";
import helpers from "../../helpers";
import {PaginationCount} from "../Common/PaginationCount";
import toast from "react-hot-toast";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import TableNoDataFound from "../Common/TableNoDataFound";

let reset = false;

const ChargingSocket = () => {
    const [initialRender, setInitialRender] = useState(true);
    const [activePage, setActivePage] = useState(1);
    const [searchShow, setSearchShow] = useState(false);
    const [searchClose, setSearchClose] = useState(false);
    const [socketData, setSocketData] = useState([]);
    const [data, setData] = useState([]);
    const [q, setQ] = useState('');
    const [slNo, setSlNo] = useState(1);

    const [filterObject, setFilterObject] = useState({});

    useEffect(() => {
        if (initialRender) {
            getSocketData();
        }

        if (reset) {
            getSocketData();
            reset = false;
        }

    }, [filterObject, activePage]);

    const refreshSocketData = async () => {
        setQ('');
        setSearchShow(true);
        setSearchClose(false);

    };

    const getSocketData = async () => {

        if (q.length > 0) {
            setSearchShow(false);
            setSearchClose(true);
        }
        let socket_vendor = Object.keys(filterObject).length > 0 && filterObject.socket_vendor ? filterObject.socket_vendor.id : '';
        let socket_model = Object.keys(filterObject).length > 0 && filterObject.socket_model ? filterObject.socket_model.id : '';
        let is_public = Object.keys(filterObject).length > 0 && filterObject.is_public ? filterObject.is_public.id : '';
        let qr_enable = Object.keys(filterObject).length > 0 && filterObject.qr_status ? filterObject.qr_status.id : '';
        let socket_status = Object.keys(filterObject).length > 0 && filterObject.socket_status ? filterObject.socket_status.id : '';

        await axios.get(SOCKET_LIST + '?q=' + q + '&page=' + activePage + '&vendor_id=' + socket_vendor + '&model_id=' + socket_model + '&is_public=' + is_public + '&qr_enabled=' + qr_enable + '&socket_status=' + socket_status)
            .then(res => {
                if (res.data && res.data.success) {
                    setSocketData(res.data.data.itemsList);
                    setData(res.data.data.paginator);
                    setSlNo(res.data.data.paginator.slNo);
                    enableSearchButton();
                }
            });

        setInitialRender(false);
    };

    const updateStatus = (socket_id, socketStatus) => {

        axios.put(UPDATE_SOCKET_STATUS + '/' + socket_id)
            .then(res => {
                if (res.data && res.data.success) {
                    toast.success('Update Successfully');
                    getSocketData();
                }
            })
    };
    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
        // hooks to work
        reset = true;
    };


    const resetCommonFilters = () => {
        setFilterObject({});
    };

    const resetFilter = () => {
        setQ('');
        resetCommonFilters();
        reset = true;
    };

    const resetSearchFilter = () => {
        resetCommonFilters();
    };

    const resetAllFilter = () => {
        resetCommonFilters();
        setSearchShow(true);
        setSearchClose(false);
    };

    const enableSearchButton = () => {
        setSearchShow(true);
        setSearchClose(false);
    }

    const refreshQ = () => {
        setSearchShow(false);
        setSearchClose(true);
        getSocketData();
    };

    const enterKeyRelease = (event) => {
        if (event.charCode === 13) {
            getSocketData();

        }
    };

    return (
        <ChargingContext.Consumer>
            {

                context => (
                    <React.Fragment>
                        <div className="content">
                            <div className="container-fluid">
                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <div className="col-sm-5">
                                            <div className="search-input">
                                                <input type="text" className="form-control"
                                                       placeholder="Vendor socket id" value={q ? q : ''}
                                                       onChange={(e) => {
                                                           setQ(e.target.value)

                                                       }}
                                                       onKeyPress={enterKeyRelease}
                                                />
                                                <div className="search-icons">
                                                    {searchShow ?
                                                        <button onClick={refreshQ}><i
                                                            className="fa fa-search mr-2"> </i>
                                                        </button> : null}
                                                    {searchClose ? <button onClick={refreshSocketData}><i
                                                        className="fa fa-times mr-2"> </i></button> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 text-right">
                                            <a className="btn btn-secondary mr-3" href="/app/charging-app/map-view"><i className="fa fa-map mr-1"
                                                                                                                       aria-hidden="true"></i> Map View
                                            </a>

                                        </div>

                                        {/*<div className="col-sm-2 text-right">
                                            <a className="btn btn-secondary btn-sm mr-2" href="csv-file.html">
                                                Bulk Upload</a>
                                        </div>*/}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="card m-b-30">
                                            <div className="card-body table-card">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4 className="mt-0 header-title  pl-3">Charging Sockets</h4>
                                                    </div>
                                                    <div className="col-md-6 text-right ">
                                                        <a
                                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                            data-toggle="modal" data-target=".filter-popup"
                                                            onClick={resetFilter}>
                                                            <i className="fa fa-refresh mr-1"> </i>Reset</a>
                                                        {
                                                            context.socketListFilterData.length > 0 ?
                                                                <Filter filterData={context.socketListFilterData}
                                                                        searchShow={searchShow}
                                                                        getSearchData={setFilterObject}
                                                                        selectedValues={filterObject}
                                                                        handleFilterEvent={getSocketData}
                                                                > </Filter> : null
                                                        }

                                                        <Link
                                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                            to={'/app/charging-app/add/socket'}>
                                                            <i className="fa fa-plus mr-1" aria-hidden="true"> </i>
                                                            Add New
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col">Sl.No</th>
                                                            <th scope="col">Socket Id</th>
                                                            <th scope="col">Vendor</th>
                                                            <th scope="col">Model</th>
                                                            <th scope="col">Is Public</th>
                                                            <th scope="col">QR Enabled</th>
                                                            <th scope="col">Status</th>
                                                            <th scope="col">Next Action</th>
                                                            <th className="text-right">Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            socketData && socketData.length > 0 ? socketData.map((socket, i) => (
                                                                    <tr key={i}>

                                                                        <th>{slNo + i}</th>
                                                                        <td>
                                                                            <OverlayTrigger
                                                                                placement="bottom"
                                                                                overlay={<Tooltip id="button-tooltip-2">
                                                                                    {socket.ll_vendor_socket_id}
                                                                                </Tooltip>}
                                                                            >
                                                                                <Link
                                                                                    to={'/app/charging-app/socket/details/' + socket._id}>
                                                                                    {socket.ll_sno}
                                                                                </Link>
                                                                            </OverlayTrigger>
                                                                        </td>
                                                                        <td>{socket.vendor ? socket.vendor.ll_vendor_name : ''}</td>
                                                                        <td>{socket.model ? socket.model.ll_model_name : ''}</td>
                                                                        <td>{socket.is_public ? helpers.findNamefromObject(context.moduleData, 'id', socket.is_public, 'description') : '-'}</td>
                                                                        <td>{socket.qr_enabled ? helpers.findNamefromObject(context.moduleData, 'id', socket.qr_enabled, 'description') : '-'}</td>
                                                                        <td>
                                                                            {socket.socket_status ? helpers.replaceUderscoreWithSpace(socket.socket_status) : '-'}
                                                                        </td>
                                                                        <td>
                                                                            <div className="act-links">
                                                                                {
                                                                                    socket.socket_status === "RECEIVED" ?
                                                                                        <a href="#"
                                                                                           className="btn btn-success btn-sm custom-btn-sm"
                                                                                           onClick={() => updateStatus(socket._id)}>Quality
                                                                                            Check</a> : ''
                                                                                }
                                                                                {
                                                                                    socket.socket_status === "QUALITY_CHECK_APPROVED" ?
                                                                                        <a href={'/app/charging-app/data/entry/' + socket._id}
                                                                                           className="btn btn-success btn-sm custom-btn-sm">Data
                                                                                            Entry</a> : ''
                                                                                }
                                                                                {
                                                                                    socket.socket_status === "READY_TO_INSTALL" ?
                                                                                        <a href="#"
                                                                                           className="btn btn-success btn-sm custom-btn-sm"
                                                                                           onClick={() => updateStatus(socket._id)}>Complete
                                                                                            Installation</a> : ''
                                                                                }
                                                                                {
                                                                                    socket.socket_status === "FREE" ?
                                                                                        <a href="#"
                                                                                           className="btn btn-success btn-sm custom-btn-sm"
                                                                                           onClick={() => updateStatus(socket._id)}>Mark as Under Maintenance</a> : ''
                                                                                }
                                                                                {
                                                                                    socket.socket_status === "UNDER_MAINTENANCE" ?
                                                                                        <a href="#"
                                                                                           className="btn btn-success btn-sm custom-btn-sm"
                                                                                           onClick={() => updateStatus(socket._id)}>Complete
                                                                                            Installation</a> : ''
                                                                                }

                                                                            </div>
                                                                        </td>
                                                                        <td className="text-right">
                                                                            <div className="act-links">
                                                                                <Link className="btn btn-warning btn-sm"
                                                                                      to={'/app/charging-app/socket/details/' + socket._id}>
                                                                                    <i
                                                                                        className="fa fa-eye"> </i>
                                                                                </Link>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )) :
                                                                <TableNoDataFound message={'No Socket Found!'} frontSpan={4} backSpan={5} />
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
                                                                : ''
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
        </ChargingContext.Consumer>

    )
};

export default ChargingSocket;


