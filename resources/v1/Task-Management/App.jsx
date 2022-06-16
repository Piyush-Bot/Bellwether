import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import { Toaster } from "react-hot-toast";
import Footer from "../Common/Footer";
import TaskList from "./TaskList";
import ReactDOM from "react-dom";
import TaskProvider from "./Context/TaskProvider";
import AddTask from "./AddTask";
import DetailView from "./DetailView";
import AddBulkTask from "./BulkUpload";

export default class App extends Component {
  render() {
    console.log("TASK APP");
    return (
      <React.Fragment>
        <BrowserRouter>
          <TaskProvider value={{ ...this.props }}>
            <div id="wrapper">
              <Header />
              <Sidebar />
              <div className="content-page">
                <Route exact path="/app/task-app" component={TaskList} />
                <Route exact path="/app/task-app/add" component={AddTask} />
                <Route
                  exact
                  path="/app/task-app/bulk/upload"
                  component={AddBulkTask}
                />
                <Route
                  exact
                  path="/app/task-app/detail/:task_id"
                  component={DetailView}
                />

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
