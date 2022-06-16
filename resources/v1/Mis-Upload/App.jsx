import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link, Switch} from "react-router-dom";
import SalaryList from "./SalaryList";
import UploadSalary from "./UploadSalary";
import EditSalary from "./EditSalary";

import Header from "../Common/Header";
import Sidebar from "../Common/Sidebar";
import Footer from "../Common/Footer";
import MisUploadProvider from "./Context/MisUploadProvider";


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
                    <MisUploadProvider value={{...this.props}}>
                        <div id="wrapper">
                            <Header/>
                            <Sidebar/>
                            <div className="content-page">
                                    <Route exact path="/app/mis-upload-app/mis-salary/list" component={SalaryList}/>
                                    <Route exact path="/app/mis-upload-app/mis-salary/add" component={UploadSalary}/>
                                    <Route exact path="/app/mis-upload-app/mis-salary/edit/:id" component={EditSalary}/>
                                
                                
                                <Footer> </Footer>
                            </div>
                        </div>
                    </MisUploadProvider>
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