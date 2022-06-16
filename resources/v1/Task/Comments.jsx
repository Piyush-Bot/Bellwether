import React, {Component, useEffect, useState,} from 'react';
import {Link} from "react-router-dom";
import TaskContext from "./Context/TaskContext";
import axios from "axios";
import {
    GET_TASK
} from "../Auth/Context/AppConstant";

import TableNoDataFound from "../Common/TableNoDataFound";
import Title from "../Common/Title";
import BreadCrumb from "../Common/BreadCrumb";
import {MomentDateFormat} from "../Common/MomentDateFormat";
import toast from "react-hot-toast";

let token = localStorage.getItem('app-ll-token');

const Comments = () => {

    const breadCrumbs = [
        {name: "Task", url: "/app/task-app", class: "breadcrumb-item"},
        {name: "List", url: "/app/task-app", class: "breadcrumb-item active"}
    ];

    useEffect(() => {

    }, []);

    const getComments = async () => {
        await axios.get(GET_TASK)
            .then(res => {
                    if (res.data && res.data.success) {

                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }

    return(
        <TaskContext.Consumer>
            {
                context => (
                    <React.Fragment>

                    </React.Fragment>
                )
            }
        </TaskContext.Consumer>
    );
}

export default Comments;
