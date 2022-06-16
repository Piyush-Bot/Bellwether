import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link, Switch} from "react-router-dom";
import ChargingProvider from "./Context/ChargingProvider";
import ChargingSockets from "./ChargingSockets";
import SocketDetail from "./SocketDetail";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import DataEntry from "./DataEntry";
import AddSocketClass from "./AddSocketClass";
import ChargingLocationMap from "./ChargingLocationMap";
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
                    <ChargingProvider value={{...this.props}}>
                        <div id="wrapper">
                            <Header/>
                            <Sidebar/>
                            <div className="content-page">
                                <Switch>
                                    {
                                        helpers.showSocketAndBookingControlMenu(loggedInUserDetails) &&
                                        <>
                                            <Route exact path="/app/charging-app" component={ChargingSockets}/>
                                            <Route exact path="/app/charging-app/data/entry/:socket_id"
                                                   component={DataEntry}/>
                                            <Route exact path="/app/charging-app/socket/details/:socket_id"
                                                   component={SocketDetail}/>
                                            <Route exact path="/app/charging-app/add/socket"
                                                   component={AddSocketClass}/>
                                            <Route exact path="/app/charging-app/map-view" component={ChargingLocationMap}/>
                                        </>}
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
                    </ChargingProvider>
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

