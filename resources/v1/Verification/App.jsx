import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import Verification from "./Verification";
import VerificationDetails from "./VerificationDetails";

export default class App extends Component {
  render() {
    console.log("Verifica APP");
    return (
      <React.Fragment>
        <BrowserRouter>
          <div id="wrapper">
            <Header />
            <Sidebar />
            <div className="content-page">
              <Route
                exact
                path="/app/verification-app"
                component={Verification}
              />

              <Route
                exact
                path="/app/verification-app/details"
                component={VerificationDetails}
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
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

document.querySelectorAll("#root").forEach((domContainer) => {
  ReactDOM.render(<App />, domContainer);
});
