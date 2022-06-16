import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link, Switch} from "react-router-dom";
import OrderDetail from "./OrderDetail";
import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import OrderContext from "./Context/OrderContext";
import {Toaster} from 'react-hot-toast';
import helpers from "../../helpers";
import ConfigurationProvider from "../Configuration/Context/ConfigurationProvider";
import OrderList from "./OrderList";

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
                                <Route exact path="/app/order-app" component={OrderList}/>
                                <Route exact path="/app/order-app/detail/:order_id" component={OrderDetail}/>
                                {/*<Switch>
                                    {
                                        helpers.showSocketAndBookingControlMenu(loggedInUserDetails) &&
                                        <>
                                            <Route exact path="/app/order-app" component={OrderList}/>

                                        </>}
                                </Switch>*/}
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