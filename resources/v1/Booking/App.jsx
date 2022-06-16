import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import BookingProvider from "./Context/BookingProvider";
import BookingLists from "./BookingLists";
import BookingDetails from "./BookingDetails";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import helpers from "../../helpers";
const loggedInUserDetails = localStorage.getItem("loggedInUserDetails");
import BookedLocation from "./BookedLocationMap";
import { Toaster } from "react-hot-toast";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <BookingProvider value={{ ...this.props }}>
            <div id="wrapper">
              <Header />
              <Sidebar />
              <div className="content-page">
                <Switch>
                  {helpers.showSocketAndBookingControlMenu(
                    loggedInUserDetails
                  ) && (
                    <>
                      <Route
                        exact
                        path="/app/booking-app"
                        component={BookingLists}
                      />
                      <Route
                        exact
                        path="/app/booking-app/booking/details/:id"
                        component={BookingDetails}
                      />
                      <Route
                        exact
                        path="/app/booking-app/booking/map/view"
                        component={BookedLocation}
                      />
                    </>
                  )}
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
                <Footer> </Footer>
              </div>
            </div>
          </BookingProvider>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

document.querySelectorAll("#root").forEach((domContainer) => {
  ReactDOM.render(<App />, domContainer);
});

//status confirmation pop up
function showpopUp(dhis) {
  var statusValue = dhis.options[dhis.selectedIndex].value;
  document.getElementById("modal-popup").style.display = "block";
  document.getElementById("modal-popup").style.opacity = "1";
  document.getElementById("modal-popup").style.background = "rgba(0,0,0,0.3)";
}
function closePopup() {
  document.getElementById("modal-popup").style.display = "none";
}

//side menu collapse
function myFunction() {
  var element = document.getElementById("wrapper");
  element.classList.toggle("controls_expand");
}
