import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import ReportProvider from "./context/ReportProvider";

import CheckinOutList from "./CheckinReport/CheckinOutList";
import CheckinOutMap from "./CheckinReport/CheckinOutMap";
import SnapshotList from "./SnapshotReport/SnapshotList";
import TaskList from "./TaskReport/TaskList";

import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import { Toaster } from "react-hot-toast";

const loggedInUserDetails = localStorage.getItem("loggedInUserDetails");

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <ReportProvider value={{ ...this.props }}>
            <div id="wrapper">
              <Header />
              <Sidebar />
              <div className="content-page">
                <p>Inside </p>
                <Switch>
                  <Route
                    exact
                    path="/app/reports-app/checkin-out/list"
                    component={CheckinOutList}
                  />
                  <Route
                    exact
                    path="/app/reports-app/checkin-out/map-view/:id"
                    component={CheckinOutMap}
                  />
                  <Route
                    exact
                    path="/app/reports-app/checkin-out-snapshot/list"
                    component={SnapshotList}
                  />
                  <Route
                    exact
                    path="/app/reports-app/task/list"
                    component={TaskList}
                  />
                </Switch>

                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  toastOptions={{
                    style: {
                      border: "1px solid #4ac1bd",
                      padding: "16px",
                      color: "#4ac1bd",
                    },
                    iconTheme: { primary: "#4ac1bd", secondary: "#FFFAEE" },
                  }}
                />
                <Footer />
              </div>
            </div>
          </ReportProvider>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
document.querySelectorAll("#root").forEach((domContainer) => {
  ReactDOM.render(<App />, domContainer);
});
