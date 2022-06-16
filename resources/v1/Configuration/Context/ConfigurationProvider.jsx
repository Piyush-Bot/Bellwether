import React, {Component} from "react";
import ConfigurationContext from "./ConfigurationContext";
import helper from "../../../helpers";
import axios from "axios";
import helpers from "../../../helpers";
let token = localStorage.getItem('app-ll-token');

export default class ConfigurationProvider extends Component {
    state = {
        isAuthenticated: true,
        status: [],
        bookingListFilter: [],
    };

    /**
     * Handle common errors & invalid api requests
     */
    handleErrors = () => {
        axios.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
        }, function (error) {
            if (!error.response) {
                // alert('There is a network error, please reload the page.');
                console.log('There is a network error, please reload the page.');
                console.log(error);
            }

            if (error.response.status === 401) {
                // window.location.reload();
            }
            // Do something with response error
            return Promise.reject(error);
        });
    };

    // Life-Cycle Methods
    componentDidMount() {
        /**
         * common error handler when auth failed
         */
        helper.handlePreRequest();
        this.handleErrors();

        const token = localStorage.getItem('app-ll-token');
        helper.validateBrowserToken(token);

    }

    render() {
        return (
            <ConfigurationContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
            }}>
                {this.props.children}
            </ConfigurationContext.Provider>
        )
    }
}