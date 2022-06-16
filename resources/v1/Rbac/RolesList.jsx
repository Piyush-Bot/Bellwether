import React, {useEffect, useState,} from 'react';
import axios from "axios";
import Pagination from "react-js-pagination";
import {ROLES_DATA} from "../Auth/Context/AppConstant";
import {PaginationCount} from "../Common/PaginationCount";
import Title from "../Common/Title";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import BreadCrumb from "../Common/BreadCrumb";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
let search_value = '';

const RolesList = () => {
    const [rolesData, setRolesData] = useState([]);

    const [serialNo, setSerialNo] = useState(1);

    const [paginationValues, setPaginationValues] = useState({
       currentPage: 1,
       perPage: 10,
       totalRecords: 0
    });

    const tableHead = [
        { label: "Sl.No", scope: "col", class: ""},
        { label: "Role Name", scope: "col"},
        { label: "Role Condition", scope: "col"},
        { label: "Action", scope: "col", class: "text-right"},
        
    ];

    const breadCrumbs = [
            { name: "Access Control",  url: "#", class:"breadcrumb-item"},
            { name: "Roles",  url: "#", class: "breadcrumb-item active"}
        ];

    useEffect(() => {
        getRoles(1);

    }, [searchValue]);

    const getRoles = (activePage) => {
        axios.get(ROLES_DATA + '?q=' + search_value + '&page=' + activePage)
            .then(res => {
                if (res.data.success) {
                    setDataAndPagination(res.data.data);
                }
            }).catch(function (error) {
            if(error) { toast.error(error.response.data.errors);}
            else {
                toast.error('unauthorized action');
            }
        });
    };

    let textInput = React.createRef();
    const searchValue = () => {
        search_value = textInput.current.value;
        axios.get(ROLES_DATA + '?q=' + textInput.current.value +  '&page=' + 1)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination(res.data.data);
                } else {
                    setRolesData([]);
                }
            }).catch(function (error) {
            if(!error) {
                toast.error(error.response.data.errors);
            } else {
                toast.error(error.response.data.errors);
            }
        });
    };

   const handlePageChange = (pageNumber) => {
       getRoles(pageNumber);
    };

   const setDataAndPagination = (data) => {
       setRolesData(data.role_details);
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
                                <Title title={'Roles List'} />
                            </div>
                            <BreadCrumb breadCrumbs={breadCrumbs} />
                            <div className="row align-items-center">
                                <div className="col-sm-3">
                                    <input  ref={textInput} type="text" className="form-control" placeholder="Role Name/Role Condition"/>
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
                                                <h4 className="mt-0 header-title  pl-3">Roles</h4>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <TableHeader data={tableHead} />
                                                <tbody>
                                                {
                                                    rolesData.length > 0 ? rolesData.map((role, i) => (
                                                            <tr key={i}>
                                                                <th>{ serialNo + (i)}</th>
                                                                <td>
                                                                    <Link
                                                                        to={'/app/access-app/role/view/' + role.id}>{role.role}
                                                                    </Link>
                                                                </td>
                                                                
                                                                <td className={'word-break'}> {role.role_condition}</td>
                                                                <td className="text-right">
                                                                    <Link
                                                                        to={'/app/access-app/role/edit/' + role.id + '/' + role.role}>
                                                                        <div className="act-links btn btn-warning btn-sm " data-toggle="tooltip"
                                                                            data-placement="top" title="" data-original-title="View"><i className="fa fa-eye"> </i>
                                                                        </div>
                                                                </Link>
                                                            </td>
                                                            </tr>)) :
                                                        <TableNoDataFound message={'No Roles Found!'} frontSpan={2} backSpan={1} />

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
    )
}
export default RolesList;
