import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import DashboardProvider from "./Context/DashboardProvider";
import DashboardContext from "./Context/DashboardContext";
import Home from "./Home";


export default class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <DashboardProvider value={{...this.props}}>
                        <body>

                        <div id="overlay">
                            <div className="outer">
                                <div className="inner">
                                    <div className="loader3">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="wrapper">
                            <div className="topbar">

                                <!-- LOGO -->
                                <div className="topbar-left">
                                    <a href="charging-sockets.html" className="logo">
                    <span className="logo-light">
                        <img src="/v1/images/ll-logo-light.png" alt="logo"></img>
                     </span>
                                        <span className="logo-sm">
                <img src="/v1/images/min-logo.png" alt="logo"></img>
                        </span>
                                    </a>
                                </div>
                                <nav className="navbar-custom">
                                    <ul className="navbar-right list-inline float-right mb-0">
                                        <li className="dropdown notification-list list-inline-item d-none d-md-inline-block">
                                            <h5 className="user-title">Rohith Kumar</h5>
                                        </li>
                                        <li className="dropdown notification-list list-inline-item">
                                            <div className="dropdown notification-list nav-pro-img">
                                                <a className="dropdown-toggle nav-link arrow-none nav-user three-dots" data-toggle="dropdown"
                                                   href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                                    <span className="dots"></span>
                                                    <span className="dots"></span>
                                                    <span className="dots"></span>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                                    <!-- item-->
                                                    <a className="dropdown-item" href="#"><i className="icon-email primary-text mr-2"
                                                                                             aria-hidden="true"></i> rohith@gmail.com</a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item" href="#"><i className="icon-phone-call primary-text mr-2"
                                                                                             aria-hidden="true"></i> +91 9012345678</a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item" href="#"><i className="icon-avatar primary-text mr-2"
                                                                                             aria-hidden="true"></i>Manager</a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item text-danger" href="index.html"><i className="icon-logout mr-2"
                                                                                                                  aria-hidden="true"></i> Logout</a>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    <ul className="list-inline menu-left mb-0">
                                        <li className="float-left">
                                            <button onClick="myFunction()" className="button-menu-mobile open-left waves-effect">
                                                <i className="fa fa-bars" aria-hidden="true"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <!-- Top Bar End -->
                        </div>
                        </body>
                    </DashboardProvider>
                </BrowserRouter>
            </div>
        )
    }
}


class DashBoardStats extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <DashboardContext.Consumer>
                {
                    context => (
                        <div>
                            <h1>Welcome to Stats, {context.loggedUser.name}</h1>
                        </div>
                    )
                }
            </DashboardContext.Consumer>
        )
    }
}

document.querySelectorAll('#root').forEach(domContainer => {
    ReactDOM.render(
        <App/>,
        domContainer
    );
});
