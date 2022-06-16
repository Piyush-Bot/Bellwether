import React, {Component} from 'react';
import MisUploadContext from './MisUploadContext';
import helper from "../../../helpers";
import axios from "axios";
import {SOCKET_MODULE,STATE_CITY_DATA,HUB_DATA,CLIENT_DATA} from "../../Auth/Context/AppConstant";

let token = localStorage.getItem('app-ll-token');
export default class MisUploadProvider extends Component {

    
   
    state = {
        isAuthenticated: true,
        moduleData: [],
        stateData:[],
        cityData:[],
        opsListFilterList:  [],
        stateCityData:[],
        stateDataArray :[],
        cityDataArray :[],  
        hubDataArray :[],
        clientDataArray :[]
      
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
            this.setOpsFilterData();
    };


    /**
     *Get ALL Hubs
     * */
     getHubData = () => {
        axios.get(HUB_DATA, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.data && res.data.success) {

                for(let i=0;i<res.data.data.length;i++){
                    this.state.hubDataArray.push(  {'id': res.data.data[i].id, 'name':res.data.data[i].ll_hub_name});
                                           
                }

                
              
            }
        })
    };


    /**
     *Get ALL Hubs
     * */
     getClientData = () => {
        axios.get(CLIENT_DATA, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.data && res.data.success) {

                for(let i=0;i<res.data.data.length;i++){
                    this.state.clientDataArray.push(  {'id': res.data.data[i].id, 'name':res.data.data[i].ll_client_name});
                                           
                }

                
              
            }
        })
    };



    
    /**
     * Get All State City Data
     */

     getStateCityData = () => {
        axios.get(STATE_CITY_DATA, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data && res.data.success) {

                    for(let i=0;i<res.data.data.state.length;i++){
                        this.state.stateDataArray .push(  {'id': res.data.data.state[i].subdivision_1_name, 'name':res.data.data.state[i].subdivision_1_name});
                                               
                    }

                       for(let i=0;i<res.data.data.city.length;i++){
                     
                        this.state.cityDataArray.push({'id': res.data.data.city[i].geoname_id,  'name':res.data.data.city[i].city_name});
                    }
                  
                }
            })

            
    };



    setOpsFilterData =  () => {

        this.setState({
            opsListFilterList: [
                
                
                                
                {

                    label: 'State',
                    type: 'select',
                    id: 'state',
                    name: 'state',
                    display_column_name: 'name',
                    data: this.state.stateDataArray ? this.state.stateDataArray : null,
                }
		        ,
                
                {

                    label: 'City',
                    type: 'select',
                    id: 'city',
                    name: 'city',
                    display_column_name: 'name',
                    data: this.state.cityDataArray ? this.state.cityDataArray : null,
                },
                {

                    label: 'Client',
                    type: 'select',
                    id: 'client',
                    name: 'client',
                    display_column_name: 'name',
                    data: this.state.clientDataArray ? this.state.clientDataArray : null,
                },

                {

                    label: 'Hub',
                    type: 'select',
                    id: 'hub',
                    name: 'hub',
                    display_column_name: 'name',
                    data: this.state.hubDataArray ? this.state.hubDataArray : null,
                },

                {

                    label: 'CheckedIn Status',
                    type: 'select',
                    id: 'status',
                    name: 'status',
                    display_column_name: 'name',
                    
                    data: [
                        {name: 'Yes', id: 'Yes'},
                        {name: 'No', id: 'Yes'}
			        ]
                },

                
                

            ]
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
       /* this.getStateCityData();
        this.getHubData();
        this.getClientData();*/
        
    }


    render() {
       
        return (
            <MisUploadContext.Provider value={{
                isAuthenticated: this.state.isAuthenticated,
                moduleData: this.state.moduleData,
                opsListFilterData: this.state.opsListFilterList,
                hubData: this.state.hubDataArray,
                clientData: this.state.clientDataArray
                
            }}>
                {this.props.children}
            </MisUploadContext.Provider>
        )
    }
}