import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Styles/app.css';
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
                        <div className="wrapper">
                            <div className="out">
                                <div className="in">
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
