import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import RbacProvider from "./Context/RbacProvider";
import RolesList from "./RolesList";
import RolesView from "./RolesView";
import RolesEdit from "./RolesEdit";
import UsersList from "./UsersList";
import ModuleList from "./Modules/ModuleList";
import ModuleView from "./Modules/ModuleView";
import ModuleEdit from "./Modules/ModuleEdit";
import AddModule from "./Modules/AddModule";
import PageList from "./Pages/PageList";
import PageView from "./Pages/PageView";
import PageEdit from "./Pages/PageEdit";
import AddPage from "./Pages/AddPage";

import FileUpload from "./FileUpload/List";
import EditFileUpload from "./FileUpload/Edit";
import UploadData from "./FileUpload/UploadData";
import AddAction from "./Actions/AddAction";
import ActionList from "./Actions/ActionList";
import ActionEdit from "./Actions/ActionEdit";
import ActionView from "./Actions/ActionView";
import MyAccount from "./MyAccount";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import { Toaster } from "react-hot-toast";
import helpers from "../../helpers";

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
          <RbacProvider value={{ ...this.props }}>
            <div id="wrapper">
              <Header />
              <Sidebar />
              <div className="content-page">
                <Switch>
                  <Route
                    exact
                    path="/app/access-app/my-account/details"
                    component={MyAccount}
                  />
                  <Route
                    exact
                    path="/app/access-app/fileupload/list"
                    component={FileUpload}
                  />
                  <Route
                    exact
                    path="/app/access-app/fileupload/add"
                    component={UploadData}
                  />
                  <Route
                    exact
                    path="/app/access-app/fileupload/edit/:id"
                    component={EditFileUpload}
                  />
                  {helpers.showAccessControlMenu(loggedInUserDetails) && (
                    <>
                      <Route
                        exact
                        path="/app/access-app/role/list"
                        component={RolesList}
                      />
                      <Route
                        exact
                        path="/app/access-app/role/view/:id"
                        component={RolesView}
                      />
                      <Route
                        exact
                        path="/app/access-app/role/edit/:id/:name"
                        component={RolesEdit}
                      />
                      <Route
                        exact
                        path="/app/access-app/user/list"
                        component={UsersList}
                      />
                    </>
                  )}
                </Switch>

                <Switch>
                  {helpers.showAccessControlSubMenu(loggedInUserDetails) && (
                    <>
                      <Route
                        exact
                        path="/app/access-app/module/list"
                        component={ModuleList}
                      />
                      <Route
                        exact
                        path="/app/access-app/module/view/:id"
                        component={ModuleView}
                      />
                      <Route
                        exact
                        path="/app/access-app/module/edit/:id/:modulecode/:pname"
                        component={ModuleEdit}
                      />
                      <Route
                        exact
                        path="/app/access-app/add/module"
                        component={AddModule}
                      />
                      <Route
                        exact
                        path="/app/access-app/page/list"
                        component={PageList}
                      />
                      <Route
                        exact
                        path="/app/access-app/page/view/:id"
                        component={PageView}
                      />
                      <Route
                        exact
                        path="/app/access-app/page/edit/:id/:pagecode/:pname"
                        component={PageEdit}
                      />
                      <Route
                        exact
                        path="/app/access-app/page/add"
                        component={AddPage}
                      />
                      <Route
                        exact
                        path="/app/access-app/action/list"
                        component={ActionList}
                      />
                      <Route
                        exact
                        path="/app/access-app/action/view/:id"
                        component={ActionView}
                      />
                      <Route
                        exact
                        path="/app/access-app/action/edit/:id/:actioncode/:pname"
                        component={ActionEdit}
                      />
                      <Route
                        exact
                        path="/app/access-app/action/add"
                        component={AddAction}
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
                <Footer />
              </div>
            </div>
          </RbacProvider>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
document.querySelectorAll("#root").forEach((domContainer) => {
  ReactDOM.render(<App />, domContainer);
});
