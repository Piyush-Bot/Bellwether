import axios from "axios";
import Pagination from "react-js-pagination";
import {SOCKET_BOOKING_LIST,SOCKET_MODULE} from "../Auth/Context/AppConstant";
import {PaginationCount} from "../Common/PaginationCount";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import 'moment-timezone';
import {Link} from "react-router-dom";
import helpers from "../../helpers";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import React, { useEffect, useState,} from 'react';
import BookingContext from "./Context/BookingContext";
import Filter from "../Common/Filter";
import {MomentDateFormat} from "../Common/MomentDateFormat";
import toast from "react-hot-toast";
let search_value = '';
let reset = false;
const BookingLists= () => {
    const [initialRender, setInitialRender] = useState(true);
    const [bookingData, setBookingData] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [moduleData, setModuleData] = useState([]);
    const [searchShow, setSearchShow] = useState(false);
    const [searchClose, setSearchClose] = useState(false);
    const [data, setData] = useState([]);
    const [q, setQ] = useState('');
    const [slNo, setSlNo] = useState(1);
    const [paginationValues, setPaginationValues] = useState({
       currentPage: 1,
       perPage: 10,
       totalRecords: 0
    });


    const [filterObject, setFilterObject] = useState({});

    const tableHead = [
        { label: "Sl.No", scope: "col"},
        { label: "Booking Id", scope: "col"},
        { label: "Booked For", scope: "col"},
        { label: "Booking Type", scope: "col"},
        { label: "Rider Name", scope: "col"},
        { label: "Mobile No", scope: "col"},
        { label: "Socket Id", scope: "col"},
        { label: "Is Public", scope: "col"},
        { label: "Booking Status", scope: "col"},
        { label: "Action", scope: "col"},
        
    ];

    const breadCrumbs = [
            { name: "Booking List",  url: "#", class:"breadcrumb-item"},
            { name: "Booking",  url: "#", class: "breadcrumb-item active"}
        ];

    useEffect(() => {
        if(initialRender){
            getBooking();
        }
        getModuleData();
        if(reset){ getBooking(); reset = false; }
    }, [activePage, filterObject]);


    const getModuleData = () => {
        axios.get(SOCKET_MODULE)
            .then(res => {
                if (res.data && res.data.success) {
                    setModuleData(res.data.data);
                }
            })
    };

    const getBooking= () => {
        if (q.length > 0) {
            setSearchShow(false);
            setSearchClose(true);
        }
        let booking_status = Object.keys(filterObject).length > 0 && filterObject.booking_status ? filterObject.booking_status.id : '';
        let booking_type = Object.keys(filterObject).length > 0 && filterObject.booking_type ? filterObject.booking_type.id : '';
        let is_public = Object.keys(filterObject).length > 0 && filterObject.is_public ? filterObject.is_public.id : '';

        axios.get(SOCKET_BOOKING_LIST + '?q=' + q + '&page=' + activePage + '&booking_status=' + booking_status + '&booking_type=' + booking_type + '&is_public=' + is_public)
            .then(res => {
                if (res.data.success) {
                    setDataAndPagination(res.data.data);
                    setData(res.data.data.paginator);
                    setSlNo(res.data.data.paginator.slNo);
                    enableSearchButton();
                }
            }).catch(function (error) {
            if(error) { toast.success(error.response.data.errors);}
            else { alert('unauthorized action'); }
        });
        setInitialRender(false);
    };

    let textInput = React.createRef();
    let locInput = React.createRef();
    
    const searchValue = () => {

        search_value = textInput.current.value;
        axios.get(BOOKING_LIST + '?q=' + textInput.current.value +  '&page=' + 1)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination(res.data.data);
                } else {
                    setBookingData([]);
                }
            }).catch(function (error) {
            if(!error) {
                alert(error.response.data.errors);
            } else {
                alert ('unauthorized action');
            }
        });
    };

   const handlePageChange = (pageNumber) => {
       setActivePage(pageNumber);
       reset = true;
    };
    const enableSearchButton = () => {
        setSearchShow(true);
        setSearchClose(false);
    }
   const setDataAndPagination = (data) => {
       setBookingData(data.itemsList);
       setPaginationValues({
           perPage: data.paginator.perPage,
           totalRecords: data.paginator.itemCount,
           currentPage: parseInt(data.paginator.currentPage)
       });
   };

    const refreshBookingData = async () => {
        setQ('');
        setSearchShow(true);
        setSearchClose(false);

    };
    const refreshQ = () => {
        setSearchShow(false);
        setSearchClose(true);
        getBooking();
    };

    const enterKeyRelease = (event) =>{
        if (event.charCode === 13) {
            getBooking();

          }
    };

    const resetFilter = () => {
        setQ('');
        setFilterObject({});
        reset = true;

    };

    return (
        <BookingContext.Consumer>
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
                                           placeholder="Vendor booking Id / Vendor socket Id" value={q ? q : ''}
                                           onChange={(e) => {
                                               setQ(e.target.value)
                                           }}
                                           onKeyPress={enterKeyRelease}
                                    />
                                    <div className="search-icons">
                                        {searchShow ?
                                            <button onClick={refreshQ}><i className="fa fa-search mr-2"> </i>
                                            </button> : null}
                                        {searchClose ? <button onClick={refreshBookingData}><i
                                            className="fa fa-times mr-2"> </i></button> : null}
                                    </div>
                                </div>
                                </div>
                                <div className="col-sm-7 text-right">
                                    <a className="btn btn-secondary mr-3" href="/app/booking-app/booking/map/view"><i className="fa fa-map mr-1"
                                                                                                               aria-hidden="true"></i> Map View
                                    </a>

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card m-b-30">
                                    <div className="card-body table-card">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h4 className="mt-0 header-title  pl-3">Booking</h4>
                                            </div>
                                            <div className="col-md-6 text-right ">
                                                <a
                                                    className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                    data-toggle="modal" data-target=".filter-popup"
                                                    onClick={resetFilter}>
                                                    <i className="fa fa-refresh mr-1"> </i>Reset</a>
                                                {
                                                    context.bookingListFilterData.length > 0 ?
                                                        <Filter filterData={context.bookingListFilterData}
                                                                searchShow={searchShow}
                                                                getSearchData={setFilterObject}
                                                                selectedValues={filterObject}
                                                                handleFilterEvent={getBooking}
                                                        > </Filter> : null
                                                }
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <TableHeader data={tableHead} />
                                                <tbody>
                                                {
                                                    bookingData.length > 0 ? bookingData.map((booking, i) => (
                                                             <tr key={i}>
                                                                <th>{ slNo + (i)}</th>
                                                            <td >

                                                                <OverlayTrigger
                                                                    placement="bottom"
                                                                    overlay={<Tooltip id="button-tooltip-2">{booking ? booking.ll_vendor_booking_id : '-'}</Tooltip>}
                                                                >
                                                                    <Link
                                                                        to={'/app/booking-app/booking/details/' + booking._id+"?src=bkg"}
                                                                    >{booking.ll_booking_no}

                                                                    </Link>
                                                                </OverlayTrigger>

                                                            </td>
                                                                
                                                                <td><MomentDateFormat datetime={booking.start_time ?  booking.start_time : ''}/></td>
                                                                <td>{helpers.replaceUderscoreWithSpace(booking.booking_type)}</td>
                                                                <td>{booking.rider ?  booking.rider.name : ''}</td>
                                                                <td>{booking.rider ?  booking.rider.mobile : ''}</td>
                                                                <td >
                                                                    <OverlayTrigger
                                                                        placement="bottom"
                                                                        overlay={<Tooltip id="button-tooltip-2">{booking ? booking.ll_vendor_socket_id : '-'}</Tooltip>}
                                                                    >
                                                                        <a className="id-link" href={'charging-app/socket/details/' + booking.socket_id + '?src=bkg&id='+booking.id}>
                                                                            {booking && booking.ll_sno ? booking.ll_sno : '-' }</a>
                                                                    </OverlayTrigger>
                                                                </td>
                                                                <td>{booking && booking.is_public ? helpers.findNamefromObject(moduleData, 'id', booking.is_public, 'description') : '-'}</td>


                                                                <td>{helpers.replaceUderscoreWithSpace(booking.booking_status)}</td>

                                                                <td className="text-right">
                                                                    <Link
                                                                        to={'/app/booking-app/booking/details/'+ booking._id+"?src=bkg"}>
                                                                        <div className="act-links btn btn-warning btn-sm " data-toggle="tooltip"
                                                                            data-placement="top" title="" data-original-title="View"><i className="fa fa-eye"> </i>
                                                                        </div>
                                                                    </Link>
                                                                </td>

                                                            </tr>
                                                        )) :
                                                        <TableNoDataFound message={'No Booking Found!'} frontSpan={5} backSpan={5}  />

                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="float-left">
                                            {
                                                data.itemCount > 0 ?
                                                    <PaginationCount currentPage={data.currentPage}
                                                                     totalRecords={data.itemCount}/>
                                                    :null
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
        </BookingContext.Consumer>
    )
}
export default BookingLists;
