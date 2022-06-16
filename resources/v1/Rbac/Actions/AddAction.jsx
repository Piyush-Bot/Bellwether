import React, { useEffect, useState, } from 'react';
import RbacContext from "../Context/RbacContext";
import ValidationError from "../../Common/ValidationError";
import { ADD_ACTIONS_DATA } from "../../Auth/Context/AppConstant";
import axios from "axios";
import BreadCrumb from "../../Common/BreadCrumb";
import helper from "../../../helpers";
import toast from 'react-hot-toast';

const AddAction = (props) => {

    const [actionCode, setActionCode] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([]);

    helper.handlePreRequest();

    const breadCrumbs = [
        { name: "Access Control", url: "#", class: "breadcrumb-item" },
        { name: "AddAction", url: "#", class: "breadcrumb-item active" }
    ];

    function onCreatePost(e) {
        e.preventDefault();

        const postData = {
            id: "new",
            actionCode,
            name
        };

        
        axios.post(ADD_ACTIONS_DATA, postData).then((res) => {
            setErrors([]);
            if (res.data && (res.data.success)) {
                    toast.success(res.data.msg);
                return props.history.push('/app/access-app/action/list');
            }
        })
            .then(res => {

                if (res.data && res.data.success) {
                    toast.success(res.data.msg);
                    return props.history.push('/app/access-app/action/list');
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data && error.response.data.errors.length > 0) {
                    setErrors(error.response.data.errors);
                }
            })

    }


    return (
        <React.Fragment>

                <RbacContext.Consumer>
                    {(context) => (
                        <div className="content">
                            <div className="container-fluid">
                                <div className="page-title-box">
                                    <div className="row align-items-center">
                                        <div className="col-sm-6">
                                            <h4 className="page-title mt-1 width-auto">Add Action</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <BreadCrumb breadCrumbs={breadCrumbs}
                                                backButton={{ url: '/app/access-app/action/list', label: 'Back' }}> </BreadCrumb>

                                        </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="card m-b-30">
                                            <div className="card-body table-card">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4 className="mt-0 header-title  pl-3">Add Action</h4>
                                                    </div>
                                                </div>
                                                <form onSubmit={onCreatePost}>
                                                    <div className="row  pl-3 pr-3">
                                                        <div className="col-md-12  ">
                                                            <div className="form-group">
                                                                <label>Action Code</label>
                                                                <input type="text" name="actionCode" placeholder="Enter Action Code"

                                                                    value={actionCode}
                                                                    onChange={(e) => setActionCode(e.target.value)}

                                                                    className="form-control" />
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                            param={'actionCode'}> </ValidationError> : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12  text-left">
                                                            <div className="form-group">
                                                                <label>Name</label>
                                                                <input type="text" name="name" placeholder="Enter Action Name"

                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                    className="form-control" />
                                                                {
                                                                    errors && errors.length > 0 ?
                                                                        <ValidationError array={errors}
                                                                            param={'name'}> </ValidationError> : ''
                                                                }

                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6  mt-5">

                                                            <button type="submit" className="btn btn-success btn-sm ml-3 " >Save</button>
                                                            <span>&nbsp;</span>


                                                        </div>

                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </RbacContext.Consumer>
        </React.Fragment>
    );

}

export default AddAction
