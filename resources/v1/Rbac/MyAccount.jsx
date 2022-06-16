import React from 'react'

const userDetail = JSON.parse(localStorage.getItem('user-data'));

const MyAccount = () => {
    return (
        <div className="content">
            <div className="container-fluid">
                <div className="page-title-box">
                    <div className="row align-items-center">
                        <div className="col-sm-6">
                            <h4 className="page-title mt-1 width-auto">My Account Details</h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card m-b-30">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-3">
                                        <div className="form-group">
                                            <label className="font-weight-normal viewlabel">Name</label>
                                            <span className="d-block mt-1 font-weight-600">{userDetail?.name}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="form-group">
                                            <label className="font-weight-normal viewlabel">Mobile Number</label>
                                            <span className="d-block mt-1 font-weight-600">{userDetail?.mobile}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="form-group">
                                            <label className="font-weight-normal viewlabel">Email id</label>
                                            <span className="d-block mt-1 font-weight-600">{userDetail?.email_work}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MyAccount
