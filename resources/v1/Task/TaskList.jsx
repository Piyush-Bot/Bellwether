import React, { Component, useEffect, useState } from "react";
import NavTab from "./template/NavTab";
import TaskContext from "./Context/TaskContext";
import toast from "react-hot-toast";
import Filter from "./template/Filter";
import ContentBody from "./template/ContentBody";

const TaskList = () => {
  useEffect(() => {}, []);

  return (
    <TaskContext.Consumer>
      {(context) => (
        <React.Fragment>
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="text-right position-absolute calendar-btn">
                    {/* <a className="btn btn-secondary btn-sm mr-2" href="#">
                      Calendar
                    </a> */}
                  </div>

                  <NavTab> </NavTab>
                  <div className="tab-content">
                    <div
                      className="tab-pane p-3 active"
                      id="all"
                      role="tabpanel"
                    >
                      <Filter />
                      <ContentBody
                        activePage={context.activePage}
                        getTaskData={context.getTaskData}
                      />
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

export default TaskList;
