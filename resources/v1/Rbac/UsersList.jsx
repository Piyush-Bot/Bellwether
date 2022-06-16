import React, {useEffect, useState,} from 'react';
import axios from "axios";
import Pagination from "react-js-pagination";
import {USERS_DATA,ROLES_SELECT_DATA} from "../Auth/Context/AppConstant";
import {PaginationCount} from "../Common/PaginationCount";
import Title from "../Common/Title";
import BreadCrumb from "../Common/BreadCrumb";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import TableTitle from "../Common/TableTitle";
import toast from "react-hot-toast";
let search_value = '';

const UsersList = () => {
    const [usersData, setUserData] = useState([]);
    const [serialNo, setSerialNo] = useState(1);
    const [rolesData, setRolesData] = useState([]);


    const [paginationValues, setPaginationValues] = useState({
       currentPage: 1,
       perPage: 10,
       totalRecords: 0
    });

    const breadCrumbs = [
            { name: "Access Control",  url: "#", class:"breadcrumb-item"},
            { name: "Users",  url: "#", class: "breadcrumb-item active"}
        ];

    const tableHead = [
        { label: "Sl.No", scope: "col"},
        { label: "Name", scope: "col"},
        { label: "Title", scope: "col"},
        { label: "Mobile", scope: "col"},
        { label: "Email", scope: "col"},
    ];

    useEffect(() => {
        getRoles(1);
            getUsers(1);

    }, [searchValue]);

    const getRoles = (activePage) => {
        axios.get(ROLES_SELECT_DATA + '?q=' + search_value + '&page=' + activePage)
            .then(res => {
                if (res.data.success) {
                    setRolesData(res.data.data);
                }
            }).catch(function (error) {
            if(error) { toast.error(error.response.data.errors);}
            else {  toast.error('unauthorized action'); }
        });
    };
    const getUsers = (activePage) => {
        axios.get(USERS_DATA + '?q=' + search_value + '&role='+ rolesInput.current.value +'&page=' + activePage)
            .then(res => {
                if (res.data.success) {
                    setDataAndPagination(res.data.data);
                }
            }).catch(function (error) {
            if(error) { toast.error(error.response.data.errors);}
            else { toast.error('unauthorized action'); }
        });
    };

    let textInput = React.createRef();
    let rolesInput = React.createRef();

    const searchValue = () => {
        search_value = textInput.current.value;
        
        axios.get(USERS_DATA + '?q=' + textInput.current.value +'&role='+ rolesInput.current.value +'&page=' + 1)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination(res.data.data);
                } else {
                    setUserData([]);
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
       getUsers(pageNumber);
    };

   const setDataAndPagination = (data) => {
       setUserData(data.user_details);
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
                                <Title title={'Users List'} />
                            </div>
                            <BreadCrumb breadCrumbs={breadCrumbs} />
                            <div className="row align-items-center">
                                <div className="col-sm-3">
                                    <input  ref={textInput} type="text" className="form-control" placeholder="Name/Mobile/Email"/>
                                </div>
                                <div className="col-sm-4">
                                    <select className="form-control" ref={rolesInput}>
                                    <option key={0}  value={0}>{'Select All'}</option>
                                        {
                                            
                                         rolesData.map((roles, i) => (
                                            <option key={i}  value={roles.id}>{roles.role}</option>))    
                                        }
                                                                                 
                                    </select>
                                </div>
                                <div className="col-sm-5">
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
                                            <TableTitle title={'Users'} />
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table">
                                                {/* Table Header render component */}
                                                <TableHeader data={tableHead} />
                                                <tbody>
                                                {
                                                    usersData.length > 0 ? usersData.map((user, i) => (
                                                            <tr key={i}>
                                                                <th>{ serialNo + (i)}</th>
                                                                <td>{user.name}</td>
                                                                <td className={'word-break'}>{user.title}</td>
                                                                <td className={'word-break'}> {user.mobile}</td>
                                                                <td className={'word-break'}> {user.email_work}</td>
                                                            </tr>)) :
                                                        <TableNoDataFound message={'No User Found!'} frontSpan={3} backSpan={2} />
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
export default UsersList;
