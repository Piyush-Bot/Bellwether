import React, { Component } from "react";
import ReactDOM from "react-dom";
import { NavLink, matchPath } from "react-router-dom";
import { FakeNavLink } from "./FakeNavLink";
import { GET_USER_ROLE_PERMISSION } from "../Auth/Context/AppConstant";
import axios from "axios";

const userDetail = JSON.parse(localStorage.getItem("user-data"));

const loggedInUserDetails = localStorage.getItem("loggedInUserDetails");
let token = localStorage.getItem("app-ll-token");
export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { rolesData: [] };
  }

  componentDidMount() {
    this.getRolePermission();
  }

  isParentPath = (url) => {
    return matchPath(url, {
      path: window.location.pathname,
      exact: false,
      strict: false,
    });
  };

  /**
   * To Display dropdown value
   */
  showAccessControl = () => {
    return (
      this.isParentPath("/app/access-app/role/list") ||
      this.isParentPath("/app/access-app/user/list") ||
      this.isParentPath("/app/access-app/module/list") ||
      this.isParentPath("/app/access-app/page/list") ||
      this.isParentPath("/app/access-app/action/list")
    );
  };

  /**
   * To Display dropdown value
   */
  showReportsMenu = () => {
    return (
      this.isParentPath("/app/reports-app/ops-salary/list") ||
      this.isParentPath("/app/reports-app/checkin-out/list") ||
      this.isParentPath("/app/reports-app/checkin-out-snapshot/list") ||
      this.isParentPath("/app/reports-app/task/list")
    );
  };

  showConfigMenu = () => {
    return (
      this.isParentPath("/app/configuration-app/list") ||
      this.isParentPath("/app/configuration-app/common-module/list")
    );
  };

  getRolePermission = async () => {
    await axios
      .get(GET_USER_ROLE_PERMISSION, {
        headers: {
          Authorization: "llBearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data && res.data.success) {
          this.setState({ rolesData: res.data.data });
          this.setState((previousState) => ({
            rolesData: [
              ...previousState.rolesData,
              {
                index: 6,
                name: "HRMS",
                page_code: "main_menu1",
                url: "",
                icon_class: "fa fa-handshake-o",
                sub_menu1: [
                  {
                    index: 2,
                    name: "Verification",
                    page_code: "LLCKNR01",
                    action_code: "LLAC02",
                    url: "/app/verification-app",
                    icon_class: "fa fa-angle-right mr-2",
                  },
                  {
                    index: 3,
                    name: "Job Application",
                    page_code: "LLCKNR01",
                    action_code: "LLAC02",
                    url: "/app/job-app",
                    icon_class: "fa fa-angle-right mr-2",
                  },
                ],
              },
            ],
          }));
        }
      });
  };

  render() {
    return (
      <div className="left side-menu" id="side-menu">
        <div className="slimscroll-menu" id="remove-scroll">
          <div id="sidebar-menu">
            <ul className="metismenu" id="side-menu">
              <li>
                <FakeNavLink
                  to="/app/task-app"
                  className="waves-effect"
                  activeClassName={"mm-active"}
                >
                  <i className="fa icon1-task"> </i>
                  <span>Task List</span>
                </FakeNavLink>
              </li>
              {console.log(this.state.rolesData, "role data")}
              {this.state.rolesData.length > 0 &&
                this.state.rolesData.map((value, i) => (
                  <React.Fragment key={i}>
                    {value.sub_menu_config &&
                    value.sub_menu_config.length > 0 &&
                    value.page_code === "main_menu2" ? (
                      <li key={i + 1}>
                        <a
                          className={
                            this.showConfigMenu()
                              ? "waves-effect mm-active"
                              : "waves-effect"
                          }
                          href={"#config_sub_menu" + i}
                          data-toggle="collapse"
                          aria-expanded="false"
                          data-target={"#config_sub_menu" + i}
                        >
                          <i className={value.icon_class}> </i>
                          <span>
                            {value.name}
                            <span className="float-right menu-arrow">
                              <i
                                className="fa fa-angle-right"
                                aria-hidden="true"
                              >
                                {" "}
                              </i>
                            </span>
                          </span>
                        </a>

                        <div
                          className={
                            this.showConfigMenu() ? "collapse show" : "collapse"
                          }
                          id={"config_sub_menu" + i}
                          data-parent="#side-menu"
                          aria-expanded="false"
                        >
                          <ul className="submenu mm-collapse mm-show">
                            {value.sub_menu_config &&
                              value.sub_menu_config &&
                              value.sub_menu_config.map((value, i) => (
                                <li key={i}>
                                  <FakeNavLink
                                    to={value.url}
                                    className="waves-effect"
                                    activeClassName={"submenu-active"}
                                  >
                                    <i
                                      className={value.class_name}
                                      aria-hidden="true"
                                    >
                                      {" "}
                                    </i>
                                    {value.name}
                                  </FakeNavLink>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </li>
                    ) : value.sub_menu1 &&
                      value.sub_menu1.length > 0 &&
                      value.page_code === "main_menu1" ? (
                      <li key={i + 1}>
                        <a
                          className={
                            this.showReportsMenu()
                              ? "waves-effect mm-active"
                              : "waves-effect"
                          }
                          href={"#reports_sub_menu" + i}
                          data-toggle="collapse"
                          aria-expanded="false"
                          data-target={"#reports_sub_menu" + i}
                        >
                          <i className={value.icon_class}> </i>
                          <span>
                            {value.name}
                            <span className="float-right menu-arrow">
                              <i
                                className="fa fa-angle-right"
                                aria-hidden="true"
                              >
                                {" "}
                              </i>
                            </span>
                          </span>
                        </a>

                        <div
                          className={
                            this.showReportsMenu()
                              ? "collapse show"
                              : "collapse"
                          }
                          id={"reports_sub_menu" + i}
                          data-parent="#side-menu"
                          aria-expanded="false"
                        >
                          <ul className="submenu mm-collapse mm-show">
                            {value.sub_menu1 &&
                              value.sub_menu1 &&
                              value.sub_menu1.map((value, i) => (
                                <li key={i}>
                                  <FakeNavLink
                                    to={value.url}
                                    className="waves-effect"
                                    activeClassName={"submenu-active"}
                                  >
                                    <i className="" aria-hidden="true">
                                      {" "}
                                    </i>
                                    {value.name}
                                  </FakeNavLink>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </li>
                    ) : value.sub_menu &&
                      value.sub_menu.length > 0 &&
                      value.page_code === "main_menu" ? (
                      <li key={i}>
                        <a
                          className={
                            this.showAccessControl()
                              ? "waves-effect mm-active"
                              : "waves-effect"
                          }
                          href={"#submenu" + i}
                          data-toggle="collapse"
                          aria-expanded="false"
                          data-target={"#submenu" + i}
                        >
                          <i className={value.icon_class}> </i>
                          <span>
                            {value.name}
                            <span className="float-right menu-arrow">
                              <i
                                className="fa fa-angle-right"
                                aria-hidden="true"
                              >
                                {" "}
                              </i>
                            </span>
                          </span>
                        </a>

                        <div
                          className={
                            this.showAccessControl()
                              ? "collapse show"
                              : "collapse"
                          }
                          id={"submenu" + i}
                          data-parent="#side-menu"
                          aria-expanded="false"
                        >
                          <ul className="submenu mm-collapse mm-show">
                            {value.sub_menu &&
                              value.sub_menu &&
                              value.sub_menu.map((value, i) => (
                                <li key={i}>
                                  <FakeNavLink
                                    to={value.url}
                                    className="waves-effect"
                                    activeClassName={"submenu-active"}
                                  >
                                    <i className="" aria-hidden="true">
                                      {" "}
                                    </i>
                                    {value.name}
                                  </FakeNavLink>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </li>
                    ) : (
                      <li>
                        <FakeNavLink
                          to={value.url}
                          className="waves-effect"
                          activeClassName={"mm-active"}
                        >
                          <i className={value.icon_class}> </i>
                          <span> {value.name} </span>
                        </FakeNavLink>
                      </li>
                    )}
                  </React.Fragment>
                ))}

              <li>
                <FakeNavLink
                  to="/app/access-app/my-account/details"
                  className="waves-effect"
                  activeClassName={"mm-active"}
                >
                  <i className="fa icon-user"> </i>
                  <span>My Account</span>
                </FakeNavLink>
              </li>

              {/* <li>
                <FakeNavLink
                  to="/app/verification-app"
                  className="waves-effect"
                  activeClassName={"mm-active"}
                >
                  <i className="fa icon-user"> </i>
                  <span>Verification</span>
                </FakeNavLink>
              </li>

              <li>
                <FakeNavLink
                  to="/app/job-app"
                  className="waves-effect"
                  activeClassName={"mm-active"}
                >
                  <i className="fa icon-user"> </i>
                  <span>Job Application</span>
                </FakeNavLink>
              </li> */}
            </ul>
          </div>
          <div className="clearfix"> </div>
        </div>
      </div>
    );
  }
}
