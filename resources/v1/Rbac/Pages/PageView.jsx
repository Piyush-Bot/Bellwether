import React, { useEffect, useState, } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { PAGE_VIEW } from "../../Auth/Context/AppConstant";
import BreadCrumb from "../../Common/BreadCrumb";
import Title from "../../Common/Title";

const PageView = () => {
    const [pageData, setPageData] = useState([]);

    const breadCrumbs = [
        { name: "Access Control", url: "#", class: "breadcrumb-item" },
        { name: "PageView", url: "#", class: "breadcrumb-item active" }
    ];

    let { id } = useParams();

    useEffect(() => {
        axios.get(PAGE_VIEW + '/' + id)
            .then(res => {
                if (res.data && res.data.success) {
                    setPageData(res.data.data.page_details);
                }
            })
    }, []);

    return (
        <React.Fragment>
                <div className="content">
                        <div className="container-fluid">
                            <div className="page-title-box">
                                <div className="row align-items-center">
                                    <Title title={'Page View'} />
                                </div>


                                <BreadCrumb breadCrumbs={breadCrumbs}
                                    backButton={{ url: '/app/access-app/page/list', label: 'Back' }}> </BreadCrumb>

                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card m-b-30">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Page Code</label>
                                                        <span className="d-block mt-1 font-weight-600">{pageData.page_code}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Name</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600"> {pageData.name} </span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="form-group">
                                                        <label className="font-weight-normal viewlabel">Status</label>
                                                        <span
                                                            className="d-block mt-1 font-weight-600"> {pageData.status === 275 ? 'Active' : 'InActive'} </span>
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
export default PageView;
