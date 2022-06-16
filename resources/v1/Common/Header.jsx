import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import helper from "../../helpers";
import { Dropdown } from 'react-bootstrap';

const userDetail = JSON.parse(localStorage.getItem('user-data'));

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.addClass();
    }
    addClass(){
        var element = document.getElementById("wrapper");
        element.classList.toggle("controls_expand");
    };
    /**
     * Logout from local storage
     */
    logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('app-ll-token');
        window.location.href = '/';
    };
    render() {
        return (
        <div className="topbar">
            <div className="topbar-left">
                <a href={'/app/task-app'} className="logo">
                    <span className="logo-light">
                        <img src="/v1/images/ll-logo-light.png" alt="logo"></img>
                     </span>
                    <span className="logo-sm">
                <img src="/v1/images/min-logo.png" alt="logo"></img>
                        </span>
                    <span className="logo-main">
                           <img src="/v1/images/ll-logo.png" alt="logo" />
                        </span>
                </a>
            </div>
            <nav className="navbar-custom">
                <ul className="navbar-right list-inline float-right mb-0">
                    <li className="dropdown notification-list list-inline-item d-none d-md-inline-block">
                        <h5 className="user-title">{helper.capitalizeTheFirstLetterOfEachWord(userDetail?.login)}</h5>
                    </li>
                    <li className="dropdown notification-list list-inline-item">
                        <div className="dropdown notification-list nav-pro-img">
                            <a className="dropdown-toggle nav-link arrow-none nav-user three-dots" data-toggle="dropdown"
                               href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <span className="dots"> </span>
                                <span className="dots"> </span>
                                <span className="dots"> </span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
{/*                                <a className="dropdown-item" href="#">
                                    <i className="icon-email primary-text mr-2" aria-hidden="true"> </i> rohith@gmail.com</a>
                                <div className="dropdown-divider"> </div>
                                <a className="dropdown-item" href="#"><i className="icon-phone-call primary-text mr-2" aria-hidden="true"> </i> +91 9012345678</a>
                                <div className="dropdown-divider"> </div>
                                <a className="dropdown-item" href="#"><i className="icon-avatar primary-text mr-2" aria-hidden="true"> </i>Manager</a>
                                <div className="dropdown-divider"> </div>*/}
                                <a className="dropdown-item text-danger" onClick={(e) => this.logout(e)}><i className="icon-logout mr-2"aria-hidden="true"> </i> Logout</a>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul className="list-inline menu-left mb-0">
                    <li className="float-left">
                        <button onClick={this.addClass} className="button-menu-mobile open-left waves-effect">
                            <i className="fa fa-bars" aria-hidden="true"> </i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
        )
    }
}
