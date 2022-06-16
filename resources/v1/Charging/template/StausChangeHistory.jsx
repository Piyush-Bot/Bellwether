import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {SOCKET_CHANGE_HISTORY} from "../../Auth/Context/AppConstant";
import {PaginationCount} from "../../Common/PaginationCount";
import Pagination from "react-js-pagination";
import helpers from "../../../helpers";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";
import {MomentDateFormat} from "../../Common/MomentDateFormat";
import 'moment-timezone';

let token = localStorage.getItem('app-ll-token');
let reset = false;
const StausChangeHistory = () => {
    let {socket_id} = useParams();
    const [statusHistory, setStatusHistory] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [data, setData] = useState([]);
    const [serialNo, setSerialNo] = useState(1);
    const [paginationValues, setPaginationValues] = useState({
        currentPage: 1,
        perPage: 10,
        totalRecords: 0
    });

    const tableHead = [
        { label: "Sl.No", scope: "col", class: ""},
        { label: "From Status", scope: "col"},
        { label: "To Status", scope: "col"},
        { label: "User", scope: "col"},
        { label: "Date & Time", scope: "col"}
    ];

    useEffect(() => {
        getStatusHistory();
    }, [socket_id, activePage]);

    /**
     *Get RE Vendor
     * */
    const getStatusHistory = async () => {
        await axios.get(SOCKET_CHANGE_HISTORY + socket_id + '?page=' + activePage, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {
                    setStatusHistory(res.data.data.itemsList);
                    setData(res.data.data.paginator);
                    setDataAndPagination(res.data.data);
                }
            })
    };
    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
        // hooks to work
        reset = true;
    };
    const setDataAndPagination = (data) => {
        setStatusHistory(data.itemsList);
        setPaginationValues({
            perPage: data.paginator.perPage,
            totalRecords: data.paginator.itemCount,
            currentPage: parseInt(data.paginator.currentPage)
        });
        setSerialNo((data.paginator.slNo * 10) - 9);
    };
    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card m-b-30">
                        <div className="card-body table-card">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mt-0 header-title  pl-3">Status Change History</h4>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <TableHeader data={tableHead} />
                                    <tbody>
                                    {
                                        statusHistory.length > 0 ? statusHistory.map((data, i) => (
                                                <tr key={i}>
                                                    <th> { serialNo + i }</th>
                                                    <td>{data.diff && data.diff.socket_status ? helpers.replaceUderscoreWithSpace(data.diff.socket_status[0]) : '-'}</td>
                                                    <td>{data.diff && data.diff.socket_status && data.diff.socket_status[1] ? helpers.replaceUderscoreWithSpace(data.diff.socket_status[1]) : '-'}</td>
                                                    <td>{data.member ? data.member.name : '-'}</td>
                                                    <td><MomentDateFormat datetime={data.diff && data.diff.socket_status ? data.updatedAt : '-'}/></td>
                                                </tr>
                                        )) :
                                            <TableNoDataFound message={'No History!'} frontSpan={3} backSpan={2} />
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className="float-left">
                                <PaginationCount currentPage={data.currentPage}
                                                 totalRecords={data.itemCount}/>
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
        </>
    )
}
export default StausChangeHistory;