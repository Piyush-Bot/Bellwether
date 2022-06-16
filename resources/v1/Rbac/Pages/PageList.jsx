import React, { useEffect, useState, } from 'react';
import axios from "axios";
import Pagination from "react-js-pagination";
import { PAGE_DATA } from "../../Auth/Context/AppConstant";
import { PaginationCount } from "../../Common/PaginationCount";
import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";
import {Link} from "react-router-dom";

let search_value = '';


const PageList = () => {

    const [pageData, setPageData] = useState([]);
    const [serialNo, setSerialNo] = useState(1);

    const [paginationValues, setPaginationValues] = useState({
        currentPage: 1,
        perPage: 10,
        totalRecords: 0
    });

    const breadCrumbs = [
        { name: "Access Control", url: "#", class: "breadcrumb-item" },
        { name: "Pages", url: "#", class: "breadcrumb-item active" }
    ];

    const tableHead = [
        { label: "Sl.No", scope: "col" },
        { label: "Name", scope: "col" },
        { label: "Page Code", scope: "col" },
        { label: "Action", scope: "col", class: "text-right" },

    ];

    useEffect(() => {
        getPage(1);
    }, [searchValue]);

    const getPage = (activePage) => {
              axios.get(PAGE_DATA + '?q=' + search_value + '&page=' + activePage)
            .then(res => {
                if (res.data.success) {
                    setDataAndPagination(res.data.data);
                }
            }).catch(function (error) {
                if (error) { alert(error.response.data.errors); }
                else { alert('unauthorized action'); }
            });
    };

    let textInput = React.createRef();
    const searchValue = () => {
        search_value = textInput.current.value;
        axios.get(PAGE_DATA + '?q=' + textInput.current.value + '&page=' + 1)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination(res.data.data);
                } else {
                    setPageData([]);
                }
            }).catch(function (error) {
                if (!error) {
                    alert(error.response.data.errors);
                } else {
                    alert('unauthorized action');
                }
            });
    };

    const handlePageChange = (pageNumber) => {
        getPage(pageNumber);
    };

    const setDataAndPagination = (data) => {
        setPageData(data.page_details);
        setPaginationValues({
            perPage: data.per_page,
            totalRecords: data.total,
            currentPage: parseInt(data.current_page)
        });
        setSerialNo((data.current_page * 10) - 9);
    };


    return (
        <React.Fragment>
            
                    <div className="content">
                        <div className="container-fluid">
                            <div className="page-title-box">
                                <div className="row align-items-center">
                                    <Title title={'Page List'} />
                                </div>
                                <BreadCrumb breadCrumbs={breadCrumbs} />
                                <div className="row align-items-center">
                                    <div className="col-sm-3">
                                        <input ref={textInput} type="text" className="form-control" placeholder="Page Code/Name" />
                                    </div>
                                    <div className="col-sm-9">
                                        <button type="button" className="btn btn-primary waves-effect waves-light"
                                            onClick={searchValue}><i className="fa fa-search mr-2"> </i>Search
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card m-b-30">
                                        <div className="card-body table-card">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h4 className="mt-0 header-title  pl-3">Pages</h4>
                                                </div>
                                                <div className="col-md-6 text-right ">
                                                    <Link to="/app/access-app/page/add"
                                                        className="btn btn-primary btn-sm waves-effect waves-light mr-3">
                                                        <i className="fa fa-plus mr-1"> </i>Add New</Link>
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <TableHeader data={tableHead} />
                                                    <tbody>
                                                        {
                                                            pageData.length > 0 ? pageData.map((page, i) => (
                                                                <tr key={i}>
                                                                    <th>{serialNo + (i)}</th>

                                                                    <td>
                                                                        <Link
                                                                            to={'/app/access-app/page/view/' + page.id}>{page.name}
                                                                        </Link>
                                                                    </td>
                                                                                                                                 
                                                                    <td className={'word-break'}> {page.page_code}</td>
                                                                    <td className="text-right">
                                                                        <Link
                                                                            to={'/app/access-app/page/edit/' + page.id + '/' + page.page_code + '/' + page.name}>
                                                                            <div className="act-links btn btn-warning btn-sm " data-toggle="tooltip"
                                                                                data-placement="top" title="" data-original-title="View"><i className="fa fa-eye"> </i>
                                                                            </div>
                                                                        </Link>
                                                                    </td>
                                                                </tr>)) :
                                                                <TableNoDataFound message={'No Page Found!'} frontSpan={2} backSpan={2} />
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
                        </div>
                    </div>
        </React.Fragment>

    );

}
export default PageList;
