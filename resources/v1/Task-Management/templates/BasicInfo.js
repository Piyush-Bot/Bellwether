import React, { useEffect, useState, Fragment } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import axios from "axios";
import {
  UPDATE_TASK,
  GET_NON_RIDER_LIST,
  GET_TASK_MASTER_DATA,
  EDIT_TASK,
} from "../../Auth/Context/AppConstant";
import TaskContext from "../Context/TaskContext";
import { confirm } from "react-confirm-box";
import ConfirmationAlert from "./CommonTemplates";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import ValidationError from "../../Common/ValidationError";
import { Modal } from "react-bootstrap";
let user_data = JSON.parse(localStorage.getItem("user-data"));
import CancelTaskModal from "./CancelTask";

const BasicInfo = (props) => {
  const [sourceTitle, setSourceTitle] = useState(
    props.taskData.data.source_title &&
      props.taskData.data.source_title.length > 150
      ? props.taskData.data.source_title.substring(0, 150) + "......"
      : props.taskData.data.source_title
  );
  const [englishTitle, setEnglishTitle] = useState(
    props.taskData.data.eng_title.length > 150
      ? props.taskData.data.eng_title.substring(0, 150) + "......"
      : props.taskData.data.eng_title
  );
  const [showAction, setShowAction] = useState(
    props.taskData.data.eng_title.length > 150 ? "Show More" : ""
  );
  const [showAlert, setShowAlert] = useState(false);
  const [changeStatus, setChangeStatus] = useState(0);
  const [taskEditorPopupShow, setTaskEditorPopupShow] = useState(false);

  const [errors, setErrors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayTaskDate, setDisplayTaskDate] = useState(null);
  const [engTitle, setEngTitle] = useState("");
  const [assignedToUser, setAssignedToUser] = useState("");
  const [assignedToUserObj, setAssignedToUserObj] = useState("");
  const [completionDate, setCompletionDate] = useState(null);
  const [categoryMaster, setCategoryMaster] = useState([]);
  const [nonRider, setNonRider] = useState();
  const [category, setCategory] = useState("");
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [taskCancelOptions, setTaskCancelOptions] = useState([]);

  const [titleFlag, setTitleFlag] = useState(true);

  useEffect(() => {
    getMasterData();
  }, []);

  const updateStatus = (status_id) => {
    axios
      .post(UPDATE_TASK + props.task_id, { task_status: status_id })
      .then((res) => {
        if (res.data && res.data.success) {
          props.getTaskData();
          toast.success(res.data.msg);
        }
      });
  };

  const showMore = () => {
    setTitleFlag(true);
    setShowAction(showAction === "Show More" ? "Show Less" : "Show More");
    props.languageStatus === false
      ? setEnglishTitle(
          showAction === "Show More"
            ? props.taskData.data.eng_title
            : props.taskData.data.eng_title.substring(0, 150) + "......"
        )
      : setSourceTitle(
          showAction === "Show More"
            ? props.taskData.data.source_title
            : props.taskData.data.source_title.substring(0, 150) + "......"
        );
  };

  const onConfirm = (value) => {
    setShowAlert(false);
    updateStatus(changeStatus);
  };

  const openConfirmation = (statusId) => {
    if (statusId == props.taskData.cancel_module_val._id) {
      setShowCancelAlert(true);
      setShowAlert(false);
    } else {
      setShowAlert(true);
      setShowCancelAlert(false);
    }
    setChangeStatus(statusId);
  };

  const closeConfirmation = () => {
    setShowAlert(false);
    setChangeStatus(0);
  };

  const closeCancelModal = () => {
    setShowCancelAlert(false);
  };

  const editTaskDetails = (taskDetails) => {
    console.log("editTaskDetails", taskDetails);
    nonRiderList();

    setEngTitle(taskDetails.eng_title);
    console.log(
      moment(taskDetails.task_date_time)
        .add(5, "hours")
        .add(30, "minutes")
        .format("YYYY-MM-DD HH:mm a")
    );
    console.log(
      moment(taskDetails.task_date_time).format("YYYY-MM-DD HH:mm a")
    );
    let current_date_time = moment().format("YYYY-MM-DD HH:mm a");
    let task_date_time = moment(taskDetails.task_date_time).format(
      "YYYY-MM-DD HH:mm a"
    );
    setSelectedDate(task_date_time);
    console.log(task_date_time + "<" + current_date_time);
    if (current_date_time < task_date_time) {
      console.log("if");
      setDisplayTaskDate(current_date_time);
    } else {
      console.log("else");
      setDisplayTaskDate(task_date_time);
    }

    setCompletionDate(
      moment(taskDetails.task_date_time).format("YYYY-MM-DD HH:mm")
    );
    console.log("task_category:-" + taskDetails.task_category);
    if (taskDetails.task_category) {
      setCategory(taskDetails.task_category);
    }
  };

  const nonRiderList = () => {
    axios
      .get(GET_NON_RIDER_LIST)
      .then((res) => {
        if (res.data && res.data.success) {
          setNonRider(res.data.data);
          var item = res.data.data.find(
            (item) => item.value === props.taskData.data.assigned_to_user
          );
          console.log("item", item);
          setAssignedToUserObj(item);
          setAssignedToUser(props.taskData.data.assigned_to_user);
          console.log(
            "setAssignedToUser",
            props.taskData.data.assigned_to_user
          );
        }
        setTaskEditorPopupShow(true);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const getMasterData = () => {
    axios.get(GET_TASK_MASTER_DATA).then((res) => {
      if (res.data && res.data.success) {
        console.log(res.data.data);
        setCategoryMaster(res.data.data.task_category);
        setTaskCancelOptions(res.data.data.task_cancel_options);
        console.log("cancel - ", res.data.data.task_cancel_options);
      }
    });
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const updateTaskDetails = () => {
    console.log(completionDate);
    const convertDateTime =
      moment(completionDate)
        .add(-5, "hours")
        .add(-30, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss") + ".000+00:00";
    console.log(convertDateTime);
    const params = {
      eng_title: engTitle,
      assigned_to_user: assignedToUser,
      expected_completion_date_time: convertDateTime,
      task_category: category,
    };
    console.log(EDIT_TASK + props.task_id);
    console.log("updateTaskDetails - ", params);
    axios
      .post(EDIT_TASK + props.task_id, params)
      .then((res) => {
        if (res.data && res.data.success) {
          setTaskEditorPopupShow(false);
          props.getTaskData();
          setTitleFlag(false);
          setShowAction(engTitle.length > 150 ? "Show More" : "");
          toast.success("Task Updated Successfully");
        }
      })
      .catch((error) => {
        setErrors([]);
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.errors.length > 0
        ) {
          setErrors(error.response.data.errors);
        }
      });
  };

  return (
    <TaskContext.Consumer>
      {(context) => (
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="card m-b-30">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="pending-clr ">
                      #
                      {props.taskData &&
                      props.taskData.data &&
                      props.taskData.data.task_id
                        ? props.taskData.data.task_id
                        : "-"}{" "}
                      &nbsp;{" "}
                    </h5>
                    {props.taskData.next_status_allowed &&
                      props.taskData.next_status_allowed.length > 0 && (
                        <div className="dropdown card-dropdown">
                          <div
                            className="dropdown-toggle card-dots"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="dots mr-1"> </span>
                            <span className="dots mr-1"> </span>
                            <span className="dots mr-1"> </span>
                          </div>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            {props.taskData.data.created_by == user_data.id && (
                              <a
                                key="0"
                                className="dropdown-item"
                                href="#"
                                onClick={() => {
                                  editTaskDetails(props.taskData.data);
                                }}
                              >
                                Edit Task
                              </a>
                            )}
                            {props.taskData.next_status_allowed &&
                              props.taskData.next_status_allowed.length > 0 &&
                              props.taskData.next_status_allowed.map(
                                (option, i) => (
                                  <a
                                    key={i}
                                    className="dropdown-item"
                                    href="#"
                                    onClick={() => {
                                      openConfirmation(option._id);
                                    }}
                                  >
                                    {option.module_name}
                                  </a>
                                )
                              )}
                          </div>
                        </div>
                      )}
                  </div>

                  <h5>
                    {titleFlag == true
                      ? props.languageStatus === true
                        ? sourceTitle
                        : englishTitle
                      : props.taskData.data.eng_title.length > 150
                      ? props.taskData.data.eng_title.substring(0, 150) +
                        "......"
                      : props.taskData.data.eng_title}
                  </h5>
                  {showAction ? (
                    <div className="text-right  mb-3">
                      <a
                        href="#"
                        className="showMorebtn"
                        onClick={showMore}
                        id="textButton"
                      >
                        {showAction}
                      </a>
                    </div>
                  ) : null}

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center assigned-details">
                      <div className="circle light-blue-clr">
                        {props.taskData && props.taskData.assign_by_user_name
                          ? props.taskData.assign_by_user_name.charAt(0)
                          : "-"}
                      </div>
                      <div className="assined-name pl-2">
                        <span>Assigned By</span>
                        <h5>
                          {props.taskData && props.taskData.assign_by_user_name
                            ? props.taskData.assign_by_user_name
                            : "-"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-center assigned-details">
                      <div className="circle light-red-clr">
                        {props.taskData && props.taskData.assign_to_user_name
                          ? props.taskData.assign_to_user_name.charAt(0)
                          : "-"}
                      </div>
                      <div className="assined-name pl-2">
                        <span>Assigned To</span>
                        <h5>
                          {props.taskData && props.taskData.assign_to_user_name
                            ? props.taskData.assign_to_user_name
                            : "-"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-center assigned-details">
                      <div className="circle">C</div>
                      <div className="assined-name pl-2">
                        <span>Task Category</span>
                        <h5>
                          {props.taskData.data.task_category_details &&
                          props.taskData.data.task_category_details.module_name
                            ? props.taskData.data.task_category_details
                                .module_name
                            : "-"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-center assigned-details">
                      <div className="badge badge-pending pending-clr">
                        {props.taskData &&
                        props.taskData.data &&
                        props.taskData.data.task_status_details.description
                          ? props.taskData.data.task_status_details.description
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center date-details">
                      <div className="pending-clr">
                        <i
                          className="fa fa-calendar-check-o"
                          aria-hidden="true"
                        >
                          {" "}
                        </i>
                      </div>
                      <div className="assined-name pl-2">
                        <span>Created</span>
                        <h5>
                          {props.taskData &&
                          props.taskData.data &&
                          props.taskData.data.created_at
                            ? moment(props.taskData.data.created_at).format(
                                "YYYY-MM-DD hh:mm a"
                              )
                            : "-"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-center date-details">
                      <div className="pending-clr">
                        <i
                          className="fa fa-calendar-check-o"
                          aria-hidden="true"
                        >
                          {" "}
                        </i>
                      </div>
                      <div className="assined-name pl-2">
                        <span>Expected</span>
                        <h5>
                          {props.taskData &&
                          props.taskData.data &&
                          props.taskData.data.task_date_time
                            ? moment(props.taskData.data.task_date_time).format(
                                "YYYY-MM-DD hh:mm a"
                              )
                            : "-"}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal show={taskEditorPopupShow}>
            <Modal.Header>
              <Modal.Title> Edit Task Details </Modal.Title>
              <button
                type="button"
                className="close mt-0"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span
                  aria-hidden="true"
                  onClick={() => {
                    setTaskEditorPopupShow(false);
                  }}
                >
                  &times;
                </span>
              </button>
            </Modal.Header>
            <Modal.Body>
              <>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card m-b-30">
                      <div className="card-body">
                        <div className={"row"}>
                          <div className="col-md-12 col-lg-12">
                            <div className="form-group">
                              <label
                                className="font-weight-500"
                                htmlFor="task-title"
                              >
                                Enter your Task
                                <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control"
                                value={engTitle}
                                name="task-title"
                                id="task-title"
                                rows={6}
                                onChange={(e) => setEngTitle(e.target.value)}
                              >
                                {" "}
                              </textarea>
                              {errors && errors.length > 0 ? (
                                <ValidationError
                                  array={errors}
                                  param={"eng_title"}
                                >
                                  {" "}
                                </ValidationError>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={"row"}>
                          <div className="col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                className="font-weight-500"
                                htmlFor="order-code"
                              >
                                Assign To <span className="text-danger">*</span>
                              </label>
                              <Select
                                className="basic-single"
                                classNamePrefix="Select User"
                                isClearable={isClearable}
                                isSearchable={isSearchable}
                                options={nonRider}
                                defaultValue={assignedToUserObj}
                                onChange={(e) => setAssignedToUser(e.value)}
                              />
                              {errors && errors.length > 0 ? (
                                <ValidationError
                                  array={errors}
                                  param={"assigned_to_user"}
                                >
                                  {" "}
                                </ValidationError>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <Fragment>
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group">
                                <label
                                  className="font-weight-500"
                                  htmlFor="date"
                                >
                                  Completion Date
                                  <span className="text-danger">*</span>
                                </label>
                                <Flatpickr
                                  className="form-control remove-grey"
                                  data-enable-time
                                  options={{ minDate: displayTaskDate }}
                                  value={selectedDate}
                                  onChange={(date, dateStr) => {
                                    setCompletionDate(dateStr);
                                    setSelectedDate(dateStr);
                                  }}
                                />
                                {errors && errors.length > 0 && (
                                  <ValidationError
                                    array={errors}
                                    param={"expected_completion_date_time"}
                                  />
                                )}
                              </div>
                            </div>

                            <div className="col-md-6 col-lg-6">
                              <div className="form-group">
                                <label
                                  className="font-weight-500"
                                  htmlFor="order-code"
                                >
                                  Category{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select
                                  className="form-control"
                                  value={category}
                                  onChange={(e) =>
                                    handleCategoryChange(e.target.value)
                                  }
                                >
                                  <option value={""} disabled={true}>
                                    {"Select Category"}
                                  </option>
                                  {categoryMaster.length > 0 &&
                                    categoryMaster.map((value, i) => (
                                      <option key={i} value={value._id}>
                                        {" "}
                                        {value.module_name}
                                      </option>
                                    ))}
                                </select>
                                {errors && errors.length > 0 && (
                                  <ValidationError
                                    array={errors}
                                    param={"task_category"}
                                  />
                                )}
                              </div>
                            </div>
                          </Fragment>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              <div className="col-md-12">
                <div className="act-links mt-2 text-center">
                  <a
                    className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                    onClick={() => updateTaskDetails()}
                  >
                    Save
                  </a>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {showAlert && (
            <ConfirmationAlert
              onConfirm={onConfirm}
              cancel={closeConfirmation}
            />
          )}

          {showCancelAlert && (
            <CancelTaskModal
              pageName="detail"
              taskDataId={props.taskData.data._id}
              cb={closeCancelModal}
              taskCompletionDate={props.taskData.data.task_date_time}
              changeStatus={changeStatus}
              cancelOptions={taskCancelOptions}
            />
          )}
        </>
      )}
    </TaskContext.Consumer>
  );
};
export default BasicInfo;
