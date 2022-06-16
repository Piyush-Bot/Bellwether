import React, {Component} from 'react';
import axios from "axios";
import AuthContext from './AuthContext';
import helper from "../../helpers";
import {VALIDATE_TOKEN} from "./AppConstant";

export default class AuthProvider extends Component {

    state = {
        isAuthenticated: true,
        loggedUser: {
            name: "Naranz"
        }
    };


    handleFormSubmit = (e) => {
        e.preventDefault();
    };

    /**
     * Validate base token
     */
    validateToken = (token) => {
        axios.post(VALIDATE_TOKEN, null, {
            headers: {
                Authorization: 'llBearer ' + token //the token is a variable which holds the token
            }
        }).then((response) => {
            console.log(response);
            window.location.href = '/app/dashboard';
        })
            .catch((error) => {
                console.log(error);
            })
    };


    // Life-Cycle Methods
    componentDidMount() {
        /**
         * common error handler when auth failed
         */
        helper.handleErrors();

        console.log('Provider Mounted');

        const token = localStorage.getItem('app-ll-token');
        if(token){
            this.validateToken(token);
        }
    }


    render() {
        return (
            <AuthContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                loggedUser: this.state.loggedUser,

                handleFormSubmit: this.handleFormSubmit
            }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}
