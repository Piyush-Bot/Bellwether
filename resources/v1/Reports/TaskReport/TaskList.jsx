import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import {
  GET_TASK,
  GET_NON_RIDER_LIST,
  GET_TASK_MASTER_DATA,
} from "../../Auth/Context/AppConstant";
import { PaginationCount } from "../../Common/PaginationCount";
import ReportContext from "../context/ReportContext";

import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";
import { Link } from "react-router-dom";

import { Modal } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import Select from "react-select";
import toast from "react-hot-toast";
import moment from "moment";

let search_value = "";
let reset = false;
let singleDate = null;

const TaskList = (props) => {
  const [defaultStatus, setDefaultStatus] = useState("Report");

  const [taskData, setTaskData] = useState([]);
  const [serialNo, setSerialNo] = useState(1);
  const [paginate, setpaginate] = useState({
    currentPage: 0,
    perPage: 10,
    itemCount: 0,
  });
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const [nonRider, setNonRider] = useState([]);
  const [assignedToUserObj, setAssignedToUserObj] = useState("");
  const [assignedToUser, setAssignedToUser] = useState("");
  const [assignedByUserObj, setAssignedByUserObj] = useState("");
  const [assignedByUser, setAssignedByUser] = useState("");

  const [taskCategoryData, setTaskCategoryData] = useState([]);
  const [taskCategoryObj, setTaskCategoryObj] = useState("");
  const [taskCategory, setTaskCategory] = useState("");

  const [taskStatusData, setTaskStatusData] = useState([]);
  const [taskStatusObj, setTaskStatusObj] = useState("");
  const [taskStatus, setTaskStatus] = useState("");

  const [date, setDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateRange, setDateRange] = useState("");

  const breadCrumbs = [
    { name: "Reports", url: "#", class: "breadcrumb-item" },
    { name: "Task Management List", url: "#", class: "breadcrumb-item active" },
  ];

  const tableHead = [
    { label: "Category", scope: "col" },
    { label: "Task Id", scope: "col" },
    { label: "Description", scope: "col" },
    { label: "Assigned By", scope: "col" },
    { label: "Assigned To", scope: "col" },
    { label: "Created At", scope: "col" },
    { label: "Expected By", scope: "col" },
    { label: "Status", scope: "col" },
  ];

  useEffect(() => {
    let queryString = "?status=" + defaultStatus + "&api_call=Reports";
    getTaskList(queryString);
    nonRiderList();
    fetchMasterData();
  }, []);

  const getTaskList = async (query) => {
    await axios.get(GET_TASK + query).then((res) => {
      if (res.data && res.data.success) {
        setDataAndPagination(res.data.data);
      }
    });
  };

  const setDataAndPagination = (data) => {
    setTaskData(data.task_data.itemsList);
    setpaginate(data.task_data.paginator);
    setSerialNo(data.task_data.paginator.slNo);
  };

  const handlePageChange = (page) => {
    let taskDefultStatus = defaultStatus;
    if (taskStatus) {
      taskDefultStatus = taskStatus;
    }

    let queryString =
      "?page=" +
      page +
      "&date=" +
      date +
      "&to_date=" +
      toDate +
      "&assigned_to_user=" +
      assignedToUser +
      "&assigned_by_user=" +
      assignedByUser +
      "&search_text=" +
      searchText +
      "&status=" +
      taskDefultStatus +
      "&api_call=Reports&task_category=" +
      taskCategory;
    getTaskList(queryString);
  };

  const handleSearchTextTask = () => {
    let taskDefultStatus = defaultStatus;
    if (taskStatus) {
      taskDefultStatus = taskStatus;
    }
    let queryString =
      "?search_text=" +
      searchText +
      "&date=" +
      date +
      "&to_date=" +
      toDate +
      "&assigned_to_user=" +
      assignedToUser +
      "&assigned_by_user=" +
      assignedByUser +
      "&status=" +
      taskDefultStatus +
      "&api_call=Reports&task_category=" +
      taskCategory;
    getTaskList(queryString);
  };

  const nonRiderList = () => {
    axios
      .get(GET_NON_RIDER_LIST)
      .then((res) => {
        if (res.data && res.data.success) {
          setNonRider(res.data.data);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const fetchMasterData = () => {
    axios.get(GET_TASK_MASTER_DATA).then((res) => {
      if (res.data && res.data.success) {
        setTaskStatusData(res.data.data.task_status);
        setTaskCategoryData(res.data.data.task_category);
        // console.log(res.data.data.task_status);
      }
    });
  };

  const CloseButton = (props) => {
    const { closeModal } = props;
    return (
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span
          aria-hidden="true"
          onClick={() => {
            closeModal(false);
          }}
        >
          &times;
        </span>
      </button>
    );
  };

  const handleFilterInputsChangeEvent = (key, value) => {
    if (key == "assigned_to_user") {
      setAssignedToUserObj(value);
      setAssignedToUser(value ? value.id : "");
    } else if (key == "assigned_by_user") {
      setAssignedByUserObj(value);
      setAssignedByUser(value ? value.id : "");
    } else if (key == "date") {
      console.log(value);
      const date = value.split(" to ");
      console.log(date.length);
      if (date.length === 1) {
        singleDate = date[0];
        console.log(singleDate);
        return false;
      } else {
        setDate(date[0]);
        setToDate(date[1]);
        setDateRange(value);
        singleDate = null;
      }
    } else if (key == "task_status") {
      setTaskStatusObj(value);
      setTaskStatus(value ? value._id : "");
    } else if (key == "task_category") {
      setTaskCategoryObj(value);
      setTaskCategory(value ? value._id : "");
    }
  };

  const handleFilterTask = () => {
    let taskDefultStatus = defaultStatus;
    if (taskStatus) {
      taskDefultStatus = taskStatus;
    }

    console.log("singleDate - " + singleDate);
    let queryString = "";
    if (singleDate !== null) {
      setDate(singleDate);
      setToDate(singleDate);
      setDateRange(singleDate);
      console.log("inside date-" + date);
      queryString =
        "?date=" +
        singleDate +
        "&to_date=" +
        singleDate +
        "&assigned_to_user=" +
        assignedToUser +
        "&assigned_by_user=" +
        assignedByUser +
        "&search_text=" +
        searchText +
        "&status=" +
        taskDefultStatus +
        "&api_call=Reports&task_category=" +
        taskCategory;
    } else {
      queryString =
        "?date=" +
        date +
        "&to_date=" +
        toDate +
        "&assigned_to_user=" +
        assignedToUser +
        "&assigned_by_user=" +
        assignedByUser +
        "&search_text=" +
        searchText +
        "&status=" +
        taskDefultStatus +
        "&api_call=Reports&task_category=" +
        taskCategory;
    }
    getTaskList(queryString);
  };

  const resetFilter = () => {
    setSearchText("");

    setAssignedToUserObj("");
    setAssignedToUser("");

    setAssignedByUserObj("");
    setAssignedByUser("");

    setTaskStatusObj("");
    setTaskStatus("");

    setTaskCategoryObj("");
    setTaskCategory("");

    setDateRange("");
    setDate("");
    setToDate("");
    singleDate = null;

    let queryString = "?status=" + defaultStatus + "&api_call=Reports";
    getTaskList(queryString);
  };

  return (
    <ReportContext.Consumer>
      {(context) => (
        <React.Fragment>
          <div className="content">
            <div className="container-fluid">
              <div className="page-title-box">
                <div className="row align-items-center">
                  <Title title={"Task Management List"} />
                </div>
                <BreadCrumb breadCrumbs={breadCrumbs} />
              </div>
              <div className="tab-content">
                <div className="tab-pane p-3 active" id="all" role="tabpanel">
                  <div className="row align-items-center mb-4 px-3">
                    <div className="col-sm-4">
                      <div className="search-input">
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" Search Task Id/ Task / User"
                          onChange={(e) => setSearchText(e.target.value)}
                          value={searchText}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              handleSearchTextTask();
                            }
                          }}
                        />
                        <div className="search-icons">
                          <button
                            type="button"
                            onClick={() => handleSearchTextTask()}
                          >
                            <i className="fa fa-search mr-2"> </i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8 pr-0 text-right">
                      <a
                        className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                        data-toggle="modal"
                        data-target=".filter-popup"
                        onClick={() => resetFilter()}
                      >
                        <i className="fa fa-refresh mr-1"> </i>Reset
                      </a>

                      <a
                        className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                        onClick={() => setShowModal(true)}
                      >
                        <i className="fa fa-filter mr-1"> </i>Filter
                      </a>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12">
                      <div className="table-responsive">
                        <table className="table" id={"TaskTable"}>
                          <TableHeader data={tableHead} />
                          <tbody>
                            {taskData &&
                              taskData.length > 0 &&
                              taskData.map((value, i) => (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td>
                                      {value.task_category_details
                                        ? value.task_category_details
                                            .module_name
                                        : "-"}
                                    </td>
                                    <td>
                                      <a
                                        className="id-link accordion-toggle"
                                        href={"#"}
                                      >
                                        #{value.task_id ? value.task_id : "-"}
                                      </a>
                                    </td>
                                    <td>
                                      {value.eng_title.length > 30
                                        ? value.eng_title.substring(0, 30) +
                                          "....."
                                        : value.eng_title}
                                    </td>
                                    <td>
                                      {value.assigned_by_user
                                        ? value.assigned_by_user.name
                                        : "-"}
                                    </td>
                                    <td>
                                      {value.assigned_to_user
                                        ? value.assigned_to_user.name
                                        : "-"}
                                    </td>
                                    <td>
                                      {moment(value.created_at).format(
                                        "YYYY-MM-DD hh:mm a"
                                      )}
                                    </td>
                                    <td>
                                      {moment(value.task_date_time).format(
                                        "YYYY-MM-DD hh:mm a"
                                      )}
                                    </td>
                                    <td>
                                      {value.task_status_details.module_name}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            {taskData && taskData.length === 0 && (
                              <TableNoDataFound
                                message={"No Task Found!"}
                                frontSpan={4}
                                backSpan={3}
                              />
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="float-left">
                        {paginate && paginate.itemCount > 0 && (
                          <PaginationCount
                            currentPage={paginate.currentPage}
                            totalRecords={paginate.itemCount}
                          />
                        )}
                      </div>

                      <div className="float-right mt-2 pr-3">
                        <div className="Page navigation example">
                          {paginate && paginate.itemCount > 0 && (
                            <Pagination
                              activePage={paginate.currentPage}
                              itemsCountPerPage={paginate.perPage}
                              totalItemsCount={paginate.itemCount}
                              pageRangeDisplayed={paginate.perPage}
                              onChange={handlePageChange.bind(this)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal show={showModal}>
            <Modal.Body>
              <div className="row">
                <CloseButton closeModal={setShowModal} />

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="font-weight-500" htmlFor="order-code">
                      Task Category<span className="text-danger">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="Select Category"
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      options={taskCategoryData}
                      onChange={(e) =>
                        handleFilterInputsChangeEvent("task_category", e)
                      }
                      defaultValue={taskCategoryObj}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="font-weight-500" htmlFor="order-code">
                      Assign To User<span className="text-danger">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="Select User"
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      options={nonRider}
                      onChange={(e) =>
                        handleFilterInputsChangeEvent("assigned_to_user", e)
                      }
                      defaultValue={assignedToUserObj}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="font-weight-500" htmlFor="order-code">
                      Assign By User<span className="text-danger">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="Select User"
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      options={nonRider}
                      onChange={(e) =>
                        handleFilterInputsChangeEvent("assigned_by_user", e)
                      }
                      defaultValue={assignedByUserObj}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="trans-type">Date Range</label>
                    <Flatpickr
                      className="form-control"
                      options={{ mode: "range", dateFormat: "Y-m-d" }}
                      defaultValue={dateRange}
                      onChange={(date, dateStr) =>
                        handleFilterInputsChangeEvent("date", dateStr)
                      } //minDate: moment().format('YYYY-MM-DD'),
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="font-weight-500" htmlFor="order-code">
                      Task Status<span className="text-danger">*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="Select Status"
                      isClearable={isClearable}
                      isSearchable={isSearchable}
                      options={taskStatusData}
                      onChange={(e) =>
                        handleFilterInputsChangeEvent("task_status", e)
                      }
                      defaultValue={taskStatusObj}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="act-links mt-2 text-center">
                    <a
                      onClick={() => {
                        handleFilterTask();
                        setShowModal(false);
                      }}
                      className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                    >
                      Search
                    </a>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </React.Fragment>
      )}
    </ReportContext.Consumer>
  );
};
export default TaskList;
