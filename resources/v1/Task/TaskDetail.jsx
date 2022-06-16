import React, { Component, useEffect, useState } from "react";
import TaskContext from "./Context/TaskContext";
import BasicDetail from "./BasicDetails";
import Files from "./template/Files";
import History from "./template/History";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { GET_TASK_DETAIL } from "../Auth/Context/AppConstant";
import toast from "react-hot-toast";
import Comments from "./template/Comments";

let token = localStorage.getItem("app-ll-token");
const TaskDetail = () => {
  let { task_id } = useParams();
  const [taskData, setTaskData] = useState([]);
  const [data, setData] = useState([]);
  const [language, setLanguage] = useState(false);
  const breadCrumbs = [
    { name: "Task", url: "/app/task-app", class: "breadcrumb-item" },
    { name: "List", url: "/app/task-app", class: "breadcrumb-item active" },
  ];

  useEffect(() => {
    taskDetail();
  }, []);

  const taskDetail = () => {
    axios.get(GET_TASK_DETAIL + task_id).then(
      (res) => {
        if (res.data && res.data.success) {
          console.log("Detail Data", res.data.data);
          setTaskData(res.data.data);
          setData(res.data.data);
        }
      },
      (error) => {
        toast.error("Unauthorized Action");
      }
    );
  };
  const changeLanguage = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setLanguage(value);
    const name = target.name;
    /*setLanguage(e.target.value)*/
  };
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
                  {/*<div className="col-md-7 pr-0 text-right">

                                        </div>*/}
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
                          <span
                            value={
                              taskData && taskData.data
                                ? taskData.data.eng_lang_type
                                : ""
                            }
                          >
                            {taskData && taskData.data
                              ? taskData.data.eng_lang_type
                              : ""}
                          </span>
                          <span
                            value={
                              taskData && taskData.data
                                ? taskData.data.source_lang_type
                                : ""
                            }
                          >
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
                    <a
                      href="/app/task-app"
                      className="btn btn-primary btn-sm waves-effect waves-light"
                    >
                      <i className="fa fa-angle-left"> </i> Back
                    </a>
                  </div>
                </div>
              </div>
              {taskData && taskData.data ? (
                <>
                  <BasicDetail
                    taskData={taskData}
                    task_id={task_id}
                    getTaskData={context.getTaskData}
                    languageStatus={language}
                  >
                    {" "}
                  </BasicDetail>
                  <div className="row">
                    <div className="col-xl-6 col-md-12">
                      <div className="card m-b-30">
                        <div className="card-body table-card">
                          <div className="row">
                            <div className="col-md-6">
                              <h4 className="mt-0 header-title  pl-3">Files</h4>
                            </div>
                          </div>
                          <Files task_id={task_id}> </Files>
                        </div>
                      </div>
                    </div>
                    <History taskData={taskData}> </History>
                  </div>
                </>
              ) : null}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="mt-0 header-title">Comments</h4>
                      <Comments getComments={context.getComments}> </Comments>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </TaskContext.Consumer>
  );
};

export default TaskDetail;
