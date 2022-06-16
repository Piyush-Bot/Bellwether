import React, {Component} from 'react';
import { Dropdown } from 'react-bootstrap';


export default class Header extends Component {

    /**
     * Logout from local storage
     */
    logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('app-ll-token');
        localStorage.removeItem('loggedInUserDetails');
        window.location.href = '/';
    };

    render() {
        return (
            <header className="cus_header">
                <div className="top-bar">
                    <div className="logo">
                        <a href="#"><img src="/images/logo.png" alt="logo" /></a>
                    </div>
                    <div className="right-nav">
                        <div className="right-nav-menu">
                            <div className="usr-sts dropdown custom-menu">
                                <a className="dropdown-toggle" href="#" role="button" data-toggle="dropdown">
                                    <i className="ti-layout-grid2"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right dropdown-menu-animated">
                                    <Dropdown>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="usr-sts dropdown">
                                <Dropdown>
                                    <Dropdown.Toggle  id="dropdown-basic">
                                        Administrator
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown.Toggle>
                               {/* <a className="dropdown-toggle" href="#" role="button" data-toggle="dropdown">
                                    <i className="icon icon-user">{null}</i> <span>Administrator</span>
                                </a>
*/}
                                {/*<div className="dropdown-menu dropdown-menu-right">*/}
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                   {/* <a className="dropdown-item" href="#">Profile</a>
                                    <a className="dropdown-item" href="#">Settings</a>
                                    <div className="dropdown-divider m-0">{null}</div>
                                    <a className="dropdown-item" href="#">Logout</a>*/}
                                {/*</div>*/}
                                </Dropdown>
                            </div>
                            <div className="logout">
                                <a href="#" onClick={(e) => this.logout(e)}><i className="fa fa-power-off">{null}</i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}
