import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import Login from "./Login";
import VerifyOtp from "./VerifyOtp";

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
                    <AuthProvider value={{...this.props}}>
                        <div className="fw_login_wrapper">
                            <div className="outer">
                                <div className="inner">
                                    <Switch>
                                        <Route exact path="/" component={Login}/>
                                        <Route exact path="/verify/otp" component={VerifyOtp}/>
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </AuthProvider>
                </BrowserRouter>
            </div>
        )
    }
}



document.querySelectorAll('#root').forEach(domContainer => {
    ReactDOM.render(
        <App/>,
        domContainer
    );
});
