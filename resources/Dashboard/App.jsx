import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import DashboardProvider from "./Context/DashboardProvider";
import DashboardContext from "./Context/DashboardContext";
import "./Styles/app.css";
import Home from "./Home";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <BrowserRouter>
          <DashboardProvider value={{ ...this.props }}>
            <div className="main_dboard">
              <Switch>
                <Route exact path="/app/dashboard" component={Home} />
                <Route
                  exact
                  path="/dashboard/stats"
                  component={DashBoardStats}
                />
              </Switch>
            </div>
          </DashboardProvider>
        </BrowserRouter>
      </div>
    );
  }
}

class DashBoardStats extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <DashboardContext.Consumer>
        {(context) => (
          <div>
            <h1>Welcome to Stats, {context.loggedUser.name}</h1>
          </div>
        )}
      </DashboardContext.Consumer>
    );
  }
}

document.querySelectorAll("#root").forEach((domContainer) => {
  ReactDOM.render(<App />, domContainer);
});
