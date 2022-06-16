import React, {useEffect, useState,} from 'react';
import axios from "axios";
import {
    useParams
} from "react-router-dom";
import {ROLES_DATA_EDIT} from "../Auth/Context/AppConstant";
import BreadCrumb from "../Common/BreadCrumb";
import Title from "../Common/Title";


const RolesView = () => {
    const [rolesData, setRolesData] = useState([]);

    const breadCrumbs = [
        {name: "Access Control", url: "#", class: "breadcrumb-item"},
        {name: "RolesView", url: "#", class: "breadcrumb-item active"}
    ];

    let {id} = useParams();

    useEffect(() => {
        axios.get(ROLES_DATA_EDIT + '/' + id)
            .then(res => {
                if (res.data && res.data.success) {
                    setRolesData(res.data.data.role_details);
                }
            })
    }, []);

    return (
        <React.Fragment>

            <div className="content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <div className="row align-items-center">
                            <Title title={'Roles View'}/>
                        </div>

                        <BreadCrumb breadCrumbs={breadCrumbs}/>

                    </div>

                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card m-b-30">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Role Name</label>
                                                <span className="d-block mt-1 font-weight-600">{rolesData.role}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Role Condition</label>
                                                <span
                                                    className="d-block mt-1 font-weight-600"> {rolesData.role_condition} </span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-3">
                                            <div className="form-group">
                                                <label className="font-weight-normal viewlabel">Status</label>
                                                <span
                                                    className="d-block mt-1 font-weight-600"> {rolesData.status === 274 ? 'Active' : 'InActive'} </span>
                                            </div>
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
export default RolesView;
