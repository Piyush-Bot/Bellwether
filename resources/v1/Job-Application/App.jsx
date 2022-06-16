import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import JobApplication from "./JobApplication";
import JobApplicationDetails from "./JobApplicationDetails";

export default class App extends Component {
  render() {
    console.log("Job APP");
    return (
      <React.Fragment>
        <BrowserRouter>
          <div id="wrapper">
            <Header />
            <Sidebar />
            <div className="content-page">
              <Route exact path="/app/job-app" component={JobApplication} />

              <Route exact path="/app/job-app/job-details" component={JobApplicationDetails} />

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
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

document.querySelectorAll("#root").forEach((domContainer) => {
  ReactDOM.render(<App />, domContainer);
});
