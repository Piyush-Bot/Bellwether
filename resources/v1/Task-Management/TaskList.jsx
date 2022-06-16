import React, { Component, useEffect, useState } from "react";
import TaskContext from "./Context/TaskContext";
import PrimaryContainer from "./templates/PrimaryContainer";
import NavigationTab from "./templates/NavigationTab";
import TaskTable from "./TaskTable";
import Filter from "./Filter";

const TaskList = () => {
  useEffect(() => {}, []);

  return (
    <TaskContext.Consumer>
      {(context) => (
        <PrimaryContainer>
          <div className="row">
            <div className="col-md-12">
              <div className="text-right position-absolute calendar-btn">
                <a className="btn btn-secondary btn-sm mr-2" href="#">
                  Calendar
                </a>
              </div>

              <NavigationTab
                masterData={context.masterData}
                cb={context.handleChangeStatusOnTab}
              />

              <div className="tab-content">
                <div className="tab-pane p-3 active" id="all" role="tabpanel">
                  <Filter />
                  <TaskTable />
                </div>
              </div>
            </div>
          </div>
        </PrimaryContainer>
      )}
    </TaskContext.Consumer>
  );
};

export default TaskList;
