import TableHeader from "../Common/TableHeader";
import React, { useContext, useState } from "react";
import TaskContext from "./Context/TaskContext";
import moment from "moment";
import { Link } from "react-router-dom";
import TableNoDataFound from "../Common/TableNoDataFound";
import { PaginationCount } from "../Common/PaginationCount";
import Pagination from "react-js-pagination";
import ConfirmationAlert from "./templates/CommonTemplates";
import { ConvertUTCtoISTDateFormat } from "../Common/ConvertUTCtoISTDateFormat";
import FileList from "./templates/FileList";
import Comments from "./templates/Comments";
import CancelTaskModal from "./templates/CancelTask";

const tableHead = [
  { label: "Sl.No", scope: "col" },
  { label: "Task Id", scope: "col" },
  { label: "Description", scope: "col" },
  { label: "Assigned By", scope: "col" },
  { label: "Assigned To", scope: "col" },
  { label: "Created At", scope: "col" },
  { label: "Expected By", scope: "col" },
  { label: "Status", scope: "col" },
  { label: "Action", scope: "col", class: "text-right" },
];

const TaskTable = (props) => {
  const contextValue = useContext(TaskContext);

  const [showAlert, setShowAlert] = useState(false);
  const [changeStatus, setChangeStatus] = useState(0);
  const [taskId, setTaskId] = useState(0);
  const [taskCompletionDate, setTaskCompletionDate] = useState();
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  const onConfirm = (value) => {
    setShowAlert(false);
    contextValue.updateStatus(taskId, changeStatus);
  };

  const openConfirmation = (id, status, task_date_time) => {
    console.log(id + "-" + status + "-" + contextValue.cancelModuleData._id);
    if (status == contextValue.cancelModuleData._id) {
      setShowCancelAlert(true);
      setShowAlert(false);
    } else {
      setShowAlert(true);
      setShowCancelAlert(false);
    }
    setChangeStatus(status);
    setTaskId(id);
    setTaskCompletionDate(task_date_time);
  };

  const closeConfirmation = () => {
    setShowAlert(false);
    setChangeStatus(0);
    setTaskId(0);
  };

  const closeCancelModal = () => {
    setShowCancelAlert(false);
  };

  return (
    <TaskContext.Consumer>
      {(context) => (
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="table-responsive">
              <table className="table" id={"TaskTable"}>
                <TableHeader data={tableHead} />

                <tbody>
                  {context.taskData &&
                    context.taskData.length > 0 &&
                    context.taskData.map((value, i) => (
                      <React.Fragment key={i}>
                        <tr>
                          <th className="text-center">
                            {context.serialNo + i}
                          </th>
                          <td>
                            <a
                              className="id-link accordion-toggle"
                              href={"#"}
                              onClick={() => context.toggleTaskId(value)}
                            >
                              #{value.task_id ? value.task_id : "-"}
                            </a>
                          </td>
                          <td>
                            {value.eng_title.length > 30
                              ? value.eng_title.substring(0, 30) + "....."
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
                            <select
                              className="form-control table-select-box task-status"
                              onChange={(e) =>
                                openConfirmation(
                                  value._id,
                                  e.target.value,
                                  value.task_date_time
                                )
                              }
                              value={value.task_status ? value.task_status : ""}
                            >
                              <option
                                key={value.task_status_details._id}
                                value={value.task_status_details._id}
                              >
                                {value.task_status_details.module_name}
                              </option>
                              {value.next_status_allowed.length > 0 &&
                                value.next_status_allowed.map((option, i) => (
                                  <option key={option._id} value={option._id}>
                                    {option.module_name}
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td>
                            <Link to={"/app/task-app/detail/" + value._id}>
                              <div
                                className="act-links btn btn-warning btn-sm "
                                data-toggle="tooltip"
                                data-placement="top"
                                title=""
                                data-original-title="View"
                              >
                                <i className="fa fa-eye"> </i>
                              </div>
                            </Link>
                          </td>
                        </tr>
                        {context.toggledTask &&
                          context.toggledTask.task_id === value.task_id && (
                            <tr className="accordian-body collapse show">
                              <td
                                className=""
                                colSpan="9"
                                style={{
                                  whiteSpace: "unset",
                                  padding: "15px",
                                  background: "rgba(74,193,189, 0.02)",
                                }}
                              >
                                <div className="collapse-table-cnt">
                                  <ul
                                    className="nav nav-tabs collapse-tab mb-3"
                                    role="tablist"
                                  >
                                    <li className="nav-item">
                                      <a
                                        className="nav-link active"
                                        data-toggle="tab"
                                        href={
                                          value.task_id
                                            ? "#description" + value.task_id
                                            : "#description-"
                                        }
                                        role="tab"
                                      >
                                        <span className="d-none d-md-block">
                                          Description
                                        </span>
                                        <span className="d-block d-md-none">
                                          <i className="mdi mdi-home-variant h5" />
                                        </span>
                                      </a>
                                    </li>
                                    <li className="nav-item">
                                      <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href={
                                          value.task_id
                                            ? "#command" + value.task_id
                                            : "#command-"
                                        }
                                        role="tab"
                                      >
                                        <span className="d-none d-md-block">
                                          Comments
                                        </span>
                                        <span className="d-block d-md-none">
                                          <i className="mdi mdi-email h5" />
                                        </span>
                                      </a>
                                    </li>
                                    <li className="nav-item">
                                      <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href={
                                          value.task_id
                                            ? "#file" + value.task_id
                                            : "#file-"
                                        }
                                        role="tab"
                                      >
                                        <span className="d-none d-md-block">
                                          Attachments
                                        </span>
                                        <span className="d-block d-md-none">
                                          <i className="mdi mdi-account h5" />
                                        </span>
                                      </a>
                                    </li>
                                  </ul>
                                  <div className="tab-content collapse-table-tab-pane">
                                    <div
                                      className="tab-pane collapse-tab-cnt active mt-0 p-0"
                                      id={
                                        value.task_id
                                          ? "description" + value.task_id
                                          : "description-"
                                      }
                                      role="tabpanel"
                                    >
                                      <p className="mt-2 ml-2 mb-0 pb-0">
                                        {" "}
                                        {value.eng_title}{" "}
                                      </p>
                                    </div>
                                    <div
                                      className="tab-pane collapse-tab-cnt mt-0 p-0"
                                      id={
                                        value.task_id
                                          ? "command" + value.task_id
                                          : "command-"
                                      }
                                      role="tabpanel"
                                    >
                                      <div className="row">
                                        <Comments
                                          class="col-xl-12 col-md-12"
                                          getComments={context.getComments}
                                          task_id={value._id}
                                          hide_load_more="hide"
                                        >
                                          {" "}
                                        </Comments>
                                      </div>
                                    </div>
                                    <div
                                      className="tab-pane collapse-tab-cnt mt-0 p-0"
                                      id={
                                        value.task_id
                                          ? "file" + value.task_id
                                          : "file-"
                                      }
                                      role="tabpanel"
                                    >
                                      <div className="row">
                                        <FileList
                                          class="col-xl-12 col-md-12"
                                          task_id={value._id}
                                          pageName="list"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                      </React.Fragment>
                    ))}
                  {context.taskData && context.taskData.length === 0 && (
                    <TableNoDataFound
                      message={"No Task Found!"}
                      frontSpan={4}
                      backSpan={4}
                    />
                  )}
                </tbody>
              </table>
            </div>

            <div className="float-left">
              {context.paginate && context.paginate.itemCount > 0 && (
                <PaginationCount
                  currentPage={context.paginate.currentPage}
                  totalRecords={context.paginate.itemCount}
                />
              )}
            </div>

            <div className="float-right mt-2 pr-3">
              <div className="Page navigation example">
                {context.paginate && context.paginate.itemCount > 0 && (
                  <Pagination
                    activePage={context.paginate.currentPage}
                    itemsCountPerPage={context.paginate.perPage}
                    totalItemsCount={context.paginate.itemCount}
                    pageRangeDisplayed={context.paginate.perPage}
                    onChange={context.handlePageChange.bind(this)}
                  />
                )}
              </div>
            </div>

            {showAlert && (
              <ConfirmationAlert
                onConfirm={onConfirm}
                cancel={closeConfirmation}
              />
            )}

            {showCancelAlert && (
              <CancelTaskModal
                pageName="list"
                taskDataId={taskId}
                cb={closeCancelModal}
                taskCompletionDate={taskCompletionDate}
                changeStatus={contextValue.cancelModuleData._id}
                cancelOptions={context.masterData.task_cancel_options}
              />
            )}
          </div>
        </div>
      )}
    </TaskContext.Consumer>
  );
};

export default TaskTable;
