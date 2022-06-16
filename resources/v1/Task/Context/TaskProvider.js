import React, {Component, useState} from "react";
import helper from "../../../helpers";
import axios from "axios";
import TaskContext from "./TaskContext";
import {COMMENTS_LIST, GET_TASK, GET_TASK_DETAIL, GET_TASK_MASTER_DATA} from "../../Auth/Context/AppConstant";
import moment from "moment";
import toast from "react-hot-toast";

let token = localStorage.getItem('app-ll-token');
let user_data = JSON.parse(localStorage.getItem('user-data'));
let assign_user = '&assigned_to_user=';
let search_query = '&search_text=';
let date = '&to_date=' + moment().format('YYYY-MM-DD');
let filterStatus = '';
let activePage = 1;
export default class TaskProvider extends Component {
    state = {
        isAuthenticated: true,
        taskData: [],
        masterData: '',
        activePage: 1,
        slNo: 1,
        paginate: {},
        taskComments: [],
        taskDetailData: [],
        searchQuery: '',
        filters: {
            search_text: '',
            assigned_user: '',
            status: ''
        }
    };

    /**
     * Handle common errors & invalid api requests
     */
    handleErrors = () => {
        axios.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
        }, function (error) {
            if (!error.response) {
                // alert('There is a network error, please reload the page.');
                console.log('There is a network error, please reload the page.');
                console.log(error);
            }

            if (error.response.status === 401) {
                // window.location.reload();
            }
            // Do something with response error
            return Promise.reject(error);
        });
    };

    frameFilterData = (key, value) => {
        if (key === "assigned_to_me") {
            assign_user = "&assigned_to_user=" + user_data.id;
        } else if (key === "assigned_by_me") {
            assign_user = "&assigned_by_user=" + user_data.id;
        }
        if (key === "to_date") {
            date = '&to_date=' + moment(value).format('YYYY-MM-DD');
        } if(key === "search_query") {
            search_query = "&search_text=" + value;
        }
        console.log('check');
    }

    /**
     * To Handle input change event for filter data
     */
    handleFilterInputEvent = (key, value) => {
        if(key === "search_query") {
            this.setState({ searchQuery: value});
        }
    }

    getTaskData = () => {
        axios.get(GET_TASK + '?page=' + activePage + '&task_status=' + filterStatus + search_query + assign_user + date)
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({taskData: res.data.data.task_data})
                    this.setState({slNo: res.data.data.task_data.paginator.slNo})
                    this.setState({paginate: res.data.data.task_data.paginator})
                }
            })
    }

    getMasterData = () => {
        this.setState({
            masterData: {
                "success": true,
                "data": [
                    {
                        "common_status": [
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf64",
                                "module_id": "61efbe7dff96a4cf5beedf63",
                                "module_code": "LL_CS_001",
                                "module_name": "Active",
                                "description": "Active",
                                "__v": 0
                            },
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf65",
                                "module_id": "61efbe7dff96a4cf5beedf63",
                                "module_code": "LL_CS_002",
                                "module_name": "InActive",
                                "description": "InActive",
                                "__v": 0
                            }
                        ],
                        "task_status": [
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf67",
                                "module_id": "61efbe7dff96a4cf5beedf66",
                                "module_code": "LL_TS_001",
                                "module_name": "PENDING",
                                "description": "PENDING",
                                "__v": 0
                            },
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf68",
                                "module_id": "61efbe7dff96a4cf5beedf66",
                                "module_code": "LL_TS_002",
                                "module_name": "IN PROCESS",
                                "description": "IN PROCESS",
                                "__v": 0
                            },
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf69",
                                "module_id": "61efbe7dff96a4cf5beedf66",
                                "module_code": "LL_TS_003",
                                "module_name": "UNDER CLARIFICATIONS",
                                "description": "UNDER CLARIFICATIONS",
                                "__v": 0
                            },
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf70",
                                "module_id": "61efbe7dff96a4cf5beedf66",
                                "module_code": "LL_TS_004",
                                "module_name": "COMPLETE",
                                "description": "COMPLETE",
                                "__v": 0
                            },
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf71",
                                "module_id": "61efbe7dff96a4cf5beedf66",
                                "module_code": "LL_TS_005",
                                "module_name": "CANCEL",
                                "description": "CANCEL",
                                "__v": 0
                            },
                            {
                                "status": true,
                                "_id": "61efbeb3ff96a4cf5beedf72",
                                "module_id": "61efbe7dff96a4cf5beedf66",
                                "module_code": "LL_TS_006",
                                "module_name": "UPCOMING",
                                "description": "UPCOMING",
                                "__v": 0
                            }
                        ],
                        "recurring_type": [
                            {
                                "type": "DAILY",
                                "value": []
                            },
                            {
                                "type": "WEEKLY",
                                "value": [
                                    "SUNDAY",
                                    "MONDAY",
                                    "TUESDAY",
                                    "WEDNESDAY",
                                    "THURSDAY",
                                    "FRIDAY",
                                    "SATURDAY"
                                ]
                            },
                            {
                                "type": "MONTHLY",
                                "value": [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8,
                                    9,
                                    10,
                                    11,
                                    12,
                                    13,
                                    14,
                                    15,
                                    16,
                                    17,
                                    18,
                                    19,
                                    20,
                                    21,
                                    22,
                                    23,
                                    24,
                                    25,
                                    26,
                                    27,
                                    28,
                                    29,
                                    30,
                                    31
                                ]
                            }
                        ],
                        "task_language": [
                            {
                                "_id": "61e693e73456a2e52e2931a3",
                                "event": "en-IN",
                                "title": "English",
                                "message": "English India"
                            },
                            {
                                "_id": "61e693e73456a2e52e2931a4",
                                "event": "ta-IN",
                                "title": "Tamil",
                                "message": "Tamil India"
                            },
                            {
                                "_id": "61e693e73456a2e52e2931a5",
                                "event": "ml-IN",
                                "title": "Malayalam",
                                "message": "Malayalam India"
                            },
                            {
                                "_id": "61e693e73456a2e52e2931a6",
                                "event": "te-IN",
                                "title": "Telugu",
                                "message": "Telugu India"
                            },
                            {
                                "_id": "61e693e73456a2e52e2931a7",
                                "event": "kn-IN",
                                "title": "Kannada",
                                "message": "Kannada India"
                            },
                            {
                                "_id": "61e693e73456a2e52e2931a8",
                                "event": "hi-IN",
                                "title": "Hindi",
                                "message": "Hindi India"
                            }
                        ]
                    }
                ],
                "msg": null
            }
        });
         /*axios.get(GET_TASK_MASTER_DATA, {
             headers: {
                 'Authorization': 'Bearer ' + token,
                 'Content-Type': 'application/json'
             }
         })
             .then(res => {
                 if (res.data && res.data.success) {
                     this.setState({masterData: res.data.data})
                 }
             })*/
    }

    getFilterStatus = (status) => {
        activePage = 1;
        filterStatus = status;
        axios.get(GET_TASK + '?page=' + activePage + '&task_status=' + status)
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({taskData: res.data.data.task_data, activePage: Math.random() })
                    this.setState({slNo: res.data.data.task_data.paginator.slNo})
                    this.setState({paginate: res.data.data.task_data.paginator})
                }
            })
    }

    searchTask = () => {
        filterStatus = '';
        this.getTaskData();
    }

    getComments = (taskId) => {
       return axios.get(COMMENTS_LIST + taskId)
            .then(res => {
                if (res.data && res.data.success) {
                    return  res.data.data;
                }
            })
    }

    taskDetail = (task_id) => {
       return axios.get(GET_TASK_DETAIL + task_id)
            .then(res => {
                    if (res.data && res.data.success) {
                        return res.data.data;
                    }
                },
                (error) => {
                    toast.error('Unauthorized Action');
                }
            )
    }

    handlePageChange = (pageNumber) => {
        activePage =   pageNumber;     // hooks to work
        this.getTaskData();
    };


    // Life-Cycle Methods
    componentDidMount() {
        /**
         * common error handler when auth failed
         */
        helper.handlePreRequest();
        this.handleErrors();

        const token = localStorage.getItem('app-ll-token');
        helper.validateBrowserToken(token);
        this.getTaskData();
        this.getMasterData();
    }

    render() {
        return (
            <TaskContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                taskStatus: this.state.taskStatus,
                taskData: this.state.taskData,
                masterData: this.state.masterData,
                searchQuery: this.state.searchQuery,
                filters: this.state.filters,
                slNo: this.state.slNo,
                paginate: this.paginate,
                taskComments: this.taskComments,
                activePage: this.state.activePage,
                getFilterStatus: this.getFilterStatus,
                searchTask: this.searchTask,
                frameFilterData: this.frameFilterData,
                getTaskData: this.getTaskData,
                handlePageChange: this.handlePageChange,
                getComments: this.getComments,
                taskDetail: this.taskDetail,
                handleFilterInputEvent: this.handleFilterInputEvent
            }}>
                {this.props.children}
            </TaskContext.Provider>
        )
    }
}