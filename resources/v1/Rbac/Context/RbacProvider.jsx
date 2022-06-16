import React, {Component} from 'react';
import RbacContext from "./RbacContext";
import helper from "../../../helpers";
import axios from "axios";
import {SOCKET_MODULE} from "../../Auth/Context/AppConstant";


let token = localStorage.getItem('app-ll-token');
export default class RbacProvider extends Component {
    state = {
        isAuthenticated: true,
        moduleData: [],
      
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



    /**
     *Get ALL Modules
     * */
     getModuleData = () => {
        axios.get(SOCKET_MODULE, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {

                    let dataArray =[];
                    
                    for(let i=0;i<res.data.data.length;i++){
                        let moduleArray = res.data.data[i].module_values;
                        if(moduleArray.length> 0){
                            for(let j=0;j<moduleArray.length;j++)
                            {
                                dataArray.push(moduleArray[j])
                            }
                        }
                    }
                    this.setState({moduleData: dataArray});
                }
            })
    }


    // Life-Cycle Methods
    componentDidMount() {
        /**
         * common error handler when auth failed
         */
        helper.handlePreRequest();
        this.handleErrors();

        const token = localStorage.getItem('app-ll-token');
        helper.validateBrowserToken(token);
        this.getModuleData();

    }


    render() {
        return (
            <RbacContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                moduleData: this.state.moduleData,
                statusData: this.state.statusData
            }}>
                {this.props.children}
            </RbacContext.Provider>
        )
    }
}