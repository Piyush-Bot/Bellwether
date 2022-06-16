import React, { useEffect } from "react";
import TaskContext from "../Context/TaskContext";

const NavTab = () => {
  useEffect(() => {}, []);

  const getTaskStatus = () => {};

  return (
    <TaskContext.Consumer>
      {(context) => (
        <>
          <ul className="nav nav-tabs py-4" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                data-toggle="tab"
                href="#all"
                role="tab"
                aria-selected="true"
                onClick={() => context.getFilterStatus("")}
              >
                <span className="d-none d-md-block">All</span>
                <span className="d-block d-md-none">
                  <i className="mdi mdi-home-variant h5"> </i>
                </span>
              </a>
            </li>
            {context.masterData && context.masterData.data.length > 0
              ? context.masterData.data[0].task_status.map((value, i) => (
                  <li className="nav-item" key={i}>
                    <a
                      className="nav-link"
                      data-toggle="tab"
                      href="#all"
                      role="tab"
                      aria-selected="true"
                      onClick={() => context.getFilterStatus(value._id)}
                    >
                      <span className="d-none d-md-block">
                        {value.module_name}
                      </span>
                      <span className="d-block d-md-none">
                        <i className="mdi mdi-email h5"> </i>
                      </span>
                    </a>
                  </li>
                ))
              : null}
          </ul>
        </>
      )}
    </TaskContext.Consumer>
  );
};
export default NavTab;
