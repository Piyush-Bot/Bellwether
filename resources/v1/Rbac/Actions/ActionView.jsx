import React, { useEffect, useState, } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { ACTIONS_VIEW } from "../../Auth/Context/AppConstant";
import BreadCrumb from "../../Common/BreadCrumb";
import Title from "../../Common/Title";

const ActionView = () => {
    const [actionData, setActionData] = useState([]);

    const breadCrumbs = [
        { name: "Access Control", url: "#", class: "breadcrumb-item" },
        { name: "ActionView", url: "#", class: "breadcrumb-item active" }
    ];

    let { id } = useParams();

    useEffect(() => {
        axios.get(ACTIONS_VIEW + '/' + id)
            .then(res => {
                if (res.data && res.data.success) {
                    setActionData(res.data.data.action_details);
                }
            })
    }, []);


    return (
        <React.Fragment>
            <div className="content">
                    <div className="container-fluid">
                        <div className="page-title-box">
                            <div className="row align-items-center">
                                <Title title={'Action View'} />
                            </div>


                            <BreadCrumb breadCrumbs={breadCrumbs}
                                backButton={{ url: '/app/access-app/action/list', label: 'Back' }}> </BreadCrumb>

                        </div>

                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card m-b-30">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Action Code</label>
                                                    <span className="d-block mt-1 font-weight-600">{actionData.action_code}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Name</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600"> {actionData.name} </span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="form-group">
                                                    <label className="font-weight-normal viewlabel">Status</label>
                                                    <span
                                                        className="d-block mt-1 font-weight-600"> {actionData.status === 275 ? 'Active' : 'InActive'} </span>
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
    );

}
export default ActionView;
