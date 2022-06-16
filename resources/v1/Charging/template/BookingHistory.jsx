import React, {useEffect, useState} from "react";
import axios from "axios";
import {BOOKING_HISTORY} from "../../Auth/Context/AppConstant";
import Pagination from "react-js-pagination";
let token = localStorage.getItem('app-ll-token');
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";
import {PaginationCount} from "../../Common/PaginationCount";
import helpers from "../../../helpers";
import {MomentDateFormat} from "../../Common/MomentDateFormat";
import 'moment-timezone';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const   BookingHistory = (props) => {
    const[bookingData, setBookingData] = useState([]);
    const [serialNo, setSerialNo] = useState(1);
    const [paginationValues, setPaginationValues] = useState({
        currentPage: 1,
        perPage: 10,
        totalRecords: 0
    });

    const tableHead = [
        { label: "Sl.No", scope: "col", class: ""},
        { label: "Booking Id", scope: "col"},
        { label: "Rider Name", scope: "col"},
        { label: "Start Date & Time", scope: "col"},
        { label: "End Date & Time", scope: "col"},
        { label: "Status", scope: "col", class: ""},

    ];

    let queryParam = helpers.useQueryParams();

    useEffect(() => {
        getBookingData(1);
    }, []);
    const getBookingData = (pageNumber) => {
        axios.get(BOOKING_HISTORY + '?socket_id=' + props.socket_id + '&page=' + pageNumber,  {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data) {
                   
                    setBookingData(res.data.data.itemsList);
                    setDataAndPagination(res.data.data);
                }
            })
    }
    const handlePageChange = (pageNumber) => {
        getBookingData(pageNumber);
    };
    const setDataAndPagination = (data) => {
        setBookingData(data.itemsList);
            setPaginationValues({
            perPage: data.paginator.perPage,
            totalRecords: data.paginator.itemCount,
            currentPage: parseInt(data.paginator.currentPage)
        });
        setSerialNo((data.paginator.slNo * 10) - 9);
    };
    return(
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card m-b-30">
                        <div className="card-body table-card">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mt-0 header-title  pl-3">Booking History</h4>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <TableHeader data={tableHead} />
                                    <tbody>
                                    {
                                        bookingData.length > 0 ? bookingData.map((booking, i) => (
                                                <tr key={i}>
                                                    <th> { serialNo + i }</th>
                                                    <td>
                                                        <OverlayTrigger
                                                            placement="bottom"
                                                            overlay={<Tooltip id="button-tooltip-2">{booking ? booking.ll_vendor_booking_id : '-'}</Tooltip>}
                                                        >
                                                            <a className="id-link" href={'/app/booking-app/booking/details/' +booking._id + '?src=crg&id='+booking.socket_id}>
                                                                            
                                                            {booking ? booking.ll_booking_no : '-'} </a>
                                                           
                                                        </OverlayTrigger>
                                                    </td>
                                                    <td>{booking.lead ? booking.lead.name : '-'}</td>
                                                    <td><MomentDateFormat datetime={booking.start_time}/></td>
                                                    <td><MomentDateFormat datetime={booking.end_time}/></td>
                                                    <td>{booking ? helpers.replaceUderscoreWithSpace(booking.booking_status) : '-'}</td>

                                                </tr>)) :
                                            <TableNoDataFound message={'No Booking Data!'} frontSpan={3} backSpan={2} />
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className="float-left">
                                <PaginationCount currentPage={paginationValues.currentPage} totalRecords={paginationValues.totalRecords} />
                            </div>
                            <div className="float-right mt-2 pr-3">
                                <div className="Page navigation example">
                                    {
                                        paginationValues.totalRecords > 0 ?
                                            <Pagination
                                                activePage={paginationValues.currentPage}
                                                itemsCountPerPage={paginationValues.perPage}
                                                totalItemsCount={paginationValues.totalRecords}
                                                pageRangeDisplayed={10}
                                                onChange={handlePageChange.bind(this)}
                                            /> : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BookingHistory;
