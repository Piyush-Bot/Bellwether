import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link, Switch} from "react-router-dom";

import ConfigurationProvider from "./Context/ConfigurationProvider";

import ConfigurationList from "./Config/ConfigurationList";
import ConfigurationSubList from "./Config/ConfigurationSublist";
import AddConfiguration from "./Config/AddConfiguration";
import AddConfigurationSublist from "./Config/AddConfigurationSublist";

import CommonModuleList from "./CommonModule/CommonModuleList";
import CommonModuleSublist from "./CommonModule/CommonModuleSublist";
import AddCommonModule from "./CommonModule/AddCommonModule";
import AddCommonModuleSublist from "./CommonModule/AddCommonModuleSublist";

import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import {Toaster} from 'react-hot-toast';
import helpers from "../../helpers";

const loggedInUserDetails = localStorage.getItem('loggedInUserDetails');

export default class App extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <ConfigurationProvider value={{...this.props}}>
                        <div id="wrapper">
                            <Header/>
                            <Sidebar/>
                            <div className="content-page">
                                <Switch>
                                    {
                                        helpers.showSocketAndBookingControlMenu(loggedInUserDetails) &&
                                        <>
                                            <Route exact path="/app/configuration-app/list" component={ConfigurationList}/>
                                            <Route exact path="/app/configuration-app/sub/list/:id" component={ConfigurationSubList}/>
                                            <Route exact path="/app/configuration-app/add" component={AddConfiguration}/>
                                            <Route exact path="/app/configuration-app/add/sublist/:id" component={AddConfigurationSublist}/>

                                            <Route exact path="/app/configuration-app/common-module/list" component={CommonModuleList}/>
                                            <Route exact path="/app/configuration-app/common-module/add/:moduleCode" component={AddCommonModule}/>
                                            <Route exact path="/app/configuration-app/common-module/sub/list/:id/:subModulePrefix/:moduleNameTitle" component={CommonModuleSublist}/>
                                            <Route exact path="/app/configuration-app/common-module/add/sublist/:id/:actiontype/:updatId/:subModuleCode/:moduleNameTitle" component={AddCommonModuleSublist}/>
                                        </>
                                    }
                                </Switch>
                                <Toaster position="top-right"
                                         reverseOrder={false}
                                         toastOptions={{
                                             style: {border: '1px solid #4ac1bd', padding: '16px', color: '#4ac1bd'},
                                             iconTheme: {primary: '#4ac1bd', secondary: '#FFFAEE'}
                                         }}
                                />
                                <Footer> </Footer>
                            </div>
                        </div>
                    </ConfigurationProvider>
                </BrowserRouter>
            </React.Fragment>
        )
    }
}


document.querySelectorAll('#root').forEach(domContainer => {
    ReactDOM.render(
        <App/>,
        domContainer
    );
});


//status confirmation pop up
function showpopUp(dhis) {
    var statusValue = dhis.options[dhis.selectedIndex].value;
    document.getElementById('modal-popup').style.display = "block";
    document.getElementById('modal-popup').style.opacity = "1";
    document.getElementById('modal-popup').style.background = "rgba(0,0,0,0.3)";
}

function closePopup() {
    document.getElementById('modal-popup').style.display = "none";
}

//side menu collapse
function myFunction() {
    var element = document.getElementById("wrapper");
    element.classList.toggle("controls_expand");
}



