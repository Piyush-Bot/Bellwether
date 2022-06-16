import React, {Component} from "react";
import TaskContext from "./TaskContext";
import helper from "../../../helpers";
import axios from "axios";
import {COMMENTS_LIST, GET_TASK, GET_TASK_MASTER_DATA, UPDATE_TASK} from "../../Auth/Context/AppConstant";
import toast from "react-hot-toast";

let singleDate = null;
export default class TaskProvider extends Component {

    state = {
        masterData: {},
        filters: {
            search_text: '',
            status: 'All',
            assigned_to_user: '',
            assigned_to_user_obj: '',
            assigned_by_user: '',
            assigned_by_user_obj: '',
            date: '',
            to_date: '',
            date_range: ''
        },
        taskData: [],
        toggledTask: null,
        serialNo: 1,
        paginate: {
            currentPage: 0,
            perPage: 10,
            itemCount: 0
        },
        nextPage: 0,
        totalItemCount: 0,
        commentsItemList: [],
        cancelModuleData: ''
    }

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

    fetchMasterData = () => {
        axios.get(GET_TASK_MASTER_DATA)
            .then(res => {
                if (res.data && res.data.success) {
                   // console.log(res.data.data);
                   this.setState({ masterData: {...res.data.data}}, () => {
                       // console.log(this.state.masterData);
                   });
                }
            });
    }

    fetchTaskData = (query) => {
        axios.get(GET_TASK + query)
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({taskData: res.data.data.task_data.itemsList})
                    this.setState({serialNo: res.data.data.task_data.paginator.slNo})
                    this.setState({paginate: res.data.data.task_data.paginator})
                    this.setState({cancelModuleData: res.data.data.cancel_module_val})
                }
            })
    }

    handleFilterInputsChangeEvent = (key, value) => {
        let filter = {...this.state.filters};
        if(key === 'date'){
            console.log(value);
            const date = value.split(" to ");
            if(date.length === 1){
                console.log("From Date - "+date[0]);
                singleDate = date[0];
                // filter['date'] = date[0];
                // filter['to_date'] = date[0];
                // filter['date_range'] = value;
                return false;
            }else{
                console.log(date[0]+"- From To Data -"+date[1]);
                filter['date'] = date[0];
                filter['to_date'] = date[1];
                filter['date_range'] = value;
                singleDate = null;
            }
        }
        else{
            if(key == "assigned_to_user"){
                filter['assigned_to_user_obj'] = value;
                filter[key] = value ? value.id : '';
            }
            else if(key == "assigned_by_user"){
                filter['assigned_by_user_obj'] = value;
                filter[key] = value ? value.id : '';
            }
            else{
                filter[key] = value;
            }
        }
        this.setState({ filters: {...filter} });
        console.log(filter);
    }

    /**
     * Handle Filter Task
     */
    handleFilterTask = (date) => {
        const filter = {...this.state.filters};
        if(singleDate !== null){
            filter['date'] = singleDate;
            filter['to_date'] = singleDate;
            filter['date_range'] = singleDate;
            this.setState({ filters: {...filter} });
        }
        console.log(filter);
        let queryString = '?' + Object.keys(filter).map(key => key + '=' + filter[key]).join('&');
        this.fetchTaskData(queryString);
        singleDate = null;
    }

    /**
     * Pagination change event
     */
    handlePageChange = (page) => {
        const filter = {...this.state.filters};
        let queryString = '?' + Object.keys(filter).map(key => key + '=' + filter[key]).join('&');
        queryString += "&page=" + page;
        this.fetchTaskData(queryString);
    }

    /**
     * update status & get latest task list
     */
    updateStatus = (taskId, statusId) => {
        axios.post(UPDATE_TASK + taskId, {task_status: statusId})
            .then(res => {
                if (res.data && res.data.success) {
                    this.handlePageChange(this.state.paginate.currentPage);
                }
            })
    }

    /**
     * Update status on click on nav tabs
     */
    handleChangeStatusOnTab = (id) => {
        let filters = {...this.state.filters};
        filters.status = id;
        this.setState({ filters: filters}, () => {
            this.handlePageChange(1);
        });
    }

    resetFilter = () => {
        let filters = {...this.state.filters};
        filters.search_text = '';
        filters.assigned_to_user = '';
        filters.assigned_to_user_obj = '';
        filters.assigned_by_user = '';
        filters.assigned_by_user_obj = '';
        filters.date = '';
        filters.to_date = '';
        filters.date_range = '';
        singleDate = null;
        this.setState({ filters: filters}, () => {
            this.handlePageChange(1);
        });
    }

    /**
     * To get the comments with pagination
     */
     getComments = (taskId, defaultStatus) => {
        console.log("First - "+defaultStatus);
        let nextPageId = this.state.nextPage + 1;
        if(defaultStatus == "list"){
            nextPageId = 1;
            this.setState({totalItemCount: 0});
            this.setState({commentsItemList: []});
        }
        if(defaultStatus === undefined){
            nextPageId = 1;
            this.setState({totalItemCount: 0});
            this.setState({commentsItemList: []});
        }
        console.log(COMMENTS_LIST + taskId + '?source=web'+ '&page=' +nextPageId);
        return axios.get(COMMENTS_LIST + taskId + '?source=web'+ '&page=' +nextPageId)
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({nextPage: res.data.data.paginator.currentPage});
                    this.setState({totalItemCount: res.data.data.paginator.itemCount});
                    if(res.data.data.itemsList.length == 0){
                        this.setState({commentsItemList: []});
                    }
                    var mergeCommentData = [...this.state.commentsItemList, ...res.data.data.itemsList];
                    this.setState({commentsItemList: mergeCommentData});

                    let returnObj = {
                        itemsList: this.state.commentsItemList,
                        buttonStatus: this.state.commentsItemList.length == this.state.totalItemCount ? "hide" : "show"
                    };

                    if(defaultStatus == "list"){
                        nextPageId = 1;
                        this.setState({totalItemCount: 0});
                        this.setState({commentsItemList: []});
                        this.setState({nextPage: 0});
                    }

                    return returnObj;
                }
            })
    }

    /**
     * Toggle Table's Quick view
     */
    toggleTaskId = (task) => {
         if(this.state.toggledTask && this.state.toggledTask.task_id === task.task_id){
             this.setState({ toggledTask: null })
         } else {
             this.setState({ toggledTask: {...task} })
         }
    }

    // Life-Cycle Methods
    componentDidMount() {
        /** common error handler when auth failed */
        helper.handlePreRequest();
        this.handleErrors();

        const token = localStorage.getItem('app-ll-token');
        helper.validateBrowserToken(token);

        this.fetchMasterData();
        this.fetchTaskData('');
    }

    render() {
        return (
            <TaskContext.Provider value={{
                masterData: this.state.masterData,
                filters: this.state.filters,
                taskData: this.state.taskData,
                cancelModuleData: this.state.cancelModuleData,
                toggledTask: this.state.toggledTask,
                serialNo: this.state.serialNo,
                paginate: this.state.paginate,

                handleFilterInputsChangeEvent: this.handleFilterInputsChangeEvent,
                handleFilterTask: this.handleFilterTask,
                handlePageChange: this.handlePageChange,
                updateStatus: this.updateStatus,
                handleChangeStatusOnTab: this.handleChangeStatusOnTab,
                getComments: this.getComments,
                resetFilter: this.resetFilter,
                toggleTaskId: this.toggleTaskId
            }}>
                {this.props.children}
            </TaskContext.Provider>
        )
    }
}