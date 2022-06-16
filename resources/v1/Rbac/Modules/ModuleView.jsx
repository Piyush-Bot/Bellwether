import React, { useEffect, useState, } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { MODULE_VIEW } from "../../Auth/Context/AppConstant";
import BreadCrumb from "../../Common/BreadCrumb";
import Title from "../../Common/Title";

const ModuleView = () => {
    const [moduleData, setModuleData] = useState([]);

    const breadCrumbs = [
        { name: "Access Control", url: "#", class: "breadcrumb-item" },
        { name: "ModuleView", url: "#", class: "breadcrumb-item active" }
    ];

    let { id } = useParams();


    useEffect(() => {
        axios.get(MODULE_VIEW + '/' + id)
            .then(res => {
                if (res.data && res.data.success) {
                   
                    setModuleData(res.data.data.module_details);
                }
            })
    }, []);


    return (
        <React.Fragment>
            
                    <div className="content">
                        <div className="container-fluid">
                            <div className="page-title-box">
                                <div className="row align-items-center">
                                    <Title title={'Module View'} />
                                </div>

                                <BreadCrumb breadCrumbs={breadCrumbs}
                                    backButton={{ url: '/app/access-app/module/list', label: 'Back' }}> </BreadCrumb>

                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card m-b-30">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Module Code</label>
                                                        <span className="d-block mt-1 font-weight-600">{moduleData.module_code}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Name</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600"> {moduleData.name} </span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Status</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600"> {moduleData.status === 275 ? 'Active' : 'InActive'} </span>
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
export default ModuleView;
