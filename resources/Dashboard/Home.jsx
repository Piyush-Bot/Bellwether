import React, { Component } from "react";
import DashboardContext from "./Context/DashboardContext";
import Header from "../Common/Header";
import RBAC from "./RBAC";

export default class Home extends Component {
  render() {
    return (
      <DashboardContext.Consumer>
        {(context) => (
          <>
            <Header />
            <RBAC />
          </>
        )}
      </DashboardContext.Consumer>
    );
  }
}
