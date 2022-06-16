import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import { Toaster } from "react-hot-toast";
import TaskProvider from "./Context/TaskProvider";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import Calendar from "./Calendar";
import Add from "./Add";

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
          <TaskProvider value={{ ...this.props }}>
            <div id="wrapper">
              <Header />
              <Sidebar />
              <div className="content-page">
                <Route exact path="/app/task-app" component={TaskList} />
                <Route
                  exact
                  path="/app/task-app/detail/:task_id"
                  component={TaskDetail}
                />
                <Route
                  exact
                  path="/app/task-app/calendar"
                  component={Calendar}
                />
                <Route exact path="/app/task-app/add" component={Add} />

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
                <Footer> </Footer>
              </div>
            </div>
          </TaskProvider>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

document.querySelectorAll("#root").forEach((domContainer) => {
  ReactDOM.render(<App />, domContainer);
});
