import axios from "axios";
import { GET_TASK_DETAIL, HISTORY } from "../Auth/Context/AppConstant";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Comments from "./templates/Comments";
import TaskContext from "./Context/TaskContext";
import BasicInfo from "./templates/BasicInfo";
import FileList from "./templates/FileList";
import TaskHistory from "./templates/TaskHistory";
import TaskEditHistory from "./templates/TaskEditHistory";
import BreadCrumb from "../Common/BreadCrumb";

const breadCrumbs = [
  { name: "Tasks", url: "/app/task-app", class: "breadcrumb-item" },
  { name: "Detail View", url: "", class: "breadcrumb-item active" },
];

const DetailView = () => {
  let { task_id } = useParams();
  const [taskData, setTaskData] = useState([]);
  const [language, setLanguage] = useState(false);
  const [statusHistoryData, setStatusHistoryData] = useState([]);

  const taskDetail = () => {
    axios
      .get(GET_TASK_DETAIL + task_id)
      .then((res) => {
        if (res.data && res.data.success) {
          console.log("Detail Data", res.data.data);
          setTaskData(res.data.data);
          historyDetail();
        }
      })
      .then((error) => {
        console.log(error);
      });
  };

  const historyDetail = () => {
    axios
      .get(HISTORY + task_id)
      .then((res) => {
        if (res.data && res.data.success) {
          setStatusHistoryData(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeLanguage = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setLanguage(value);
  };

  useEffect(() => {
    taskDetail();
  }, []);

  return (
    <TaskContext.Consumer>
      {(context) => (
        <React.Fragment>
          <div className="content">
            <div className="container-fluid">
              <div className="page-title-box">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <h4 className="page-title mt-1 width-auto">Task Details</h4>
                  </div>

                  <div className="col-md-5  text-right">
                    {taskData &&
                    taskData.data &&
                    taskData.data.source_lang_type ? (
                      <label className="toggleSwitch nolabel">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            changeLanguage(e);
                          }}
                          checked={language}
                        />
                        <span>
                          <span>
                            {taskData && taskData.data
                              ? taskData.data.eng_lang_type
                              : ""}
                          </span>
                          <span>
                            {taskData && taskData.data
                              ? taskData.data.source_lang_type
                              : ""}
                          </span>
                        </span>
                        <a> </a>
                      </label>
                    ) : null}
                  </div>

                  <div className="col-md-1  text-right">
                    {/*<a href="/app/task-app" className="btn btn-primary btn-sm waves-effect waves-light"><i
                                                className="fa fa-angle-left"> </i> Back</a>*/}
                    <Link
                      to={"/app/task-app"}
                      className="btn btn-primary btn-sm waves-effect waves-light"
                    >
                      <i className="fa fa-angle-left"> </i> Back
                    </Link>
                  </div>
                </div>

                <BreadCrumb breadCrumbs={breadCrumbs}> </BreadCrumb>
              </div>

              {taskData && taskData.data && (
                <BasicInfo
                  taskData={taskData}
                  task_id={task_id}
                  getTaskData={taskDetail}
                  languageStatus={language}
                />
              )}

              <Comments getComments={context.getComments}> </Comments>

              <div className="row">
                {taskData && taskData.data && (
                  <FileList
                    task_id={task_id}
                    files={taskData.data.upload_file}
                  />
                )}
                {taskData && taskData.data && (
                  <TaskHistory status_history={statusHistoryData} />
                )}
                {taskData && taskData.data && (
                  <TaskEditHistory
                    edit_history={taskData.data.ll_dp_transaction}
                  />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </TaskContext.Consumer>
  );
};

export default DetailView;
