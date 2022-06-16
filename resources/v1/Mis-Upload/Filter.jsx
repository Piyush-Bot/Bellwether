import React, {useEffect, useState} from "react";
import {Modal, Button} from 'react-bootstrap';
import Select from "react-select";
import axios from "axios";
import {STATE_CITY_DATA,STATES_CITY_DATA,CLIENT_DATA ,HUB_DATA ,CITY_HUB_DATA} from "../Auth/Context/AppConstant";
import { map } from "leaflet";


const Filter = (props) => {

    let cityOptions=[];
    let stateOptions=[];
    let  hubOptions=[];
    let clientOptions=[];

    let options = [
        { value: 'No', label: 'No' },
        { value: 'Yes', label: 'Yes' },
        
      ];

    const [selectedOption, setSelectedOption] = useState(null)
    const [FilterPopupShow, setFilterPopupShow] = useState(false);
    const [filterData, SetFilterData] = useState({});

    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [optionData, setOptionData] = useState(options);
    const [clientData,setClientData ] = useState([])

    const [hubData,setHubData]= useState([])
    const[stateDisable,setStateDisable] = useState([])
    const[clientDisable,setClientDisable] = useState([])


    const [selectedState,setSelectedState] =useState([]);
    const [selectedCity,setSelectedCity] =useState([]);
    const [selectedHub,setSelectedHub] =useState([]);
    const [selectedClient,setSelectedClient] =useState([]);
    const [selectedCheckinStatus, setSelectedCheckinStatus] = useState([]);

    useEffect(() => {

        if(selectedCheckinStatus.length ==0){
            setSelectedCheckinStatus("No");
        }
        getStateCity();
        getHubData();
        getClientData();
    }, []);

     const search = () => {
        props.handleFilterEvent();
        setFilterPopupShow(false);
    };


    const frameFilterData = (key, value,selectType) => {

       
        if(selectType =="City"){
           
            setSelectedCity(value)

            
            if(selectedState.length == 0 && value.length > 0){
                setStateDisable(1)
            }
            else{
                setStateDisable(2)
            }
            
        }
        if(selectType =="Hub"){


            setSelectedHub(value)
            if(selectedClient.length == 0 && value.length > 0){
                setClientDisable(1)
            }
            else{
                setClientDisable(2)
            }
            
        }

        if(selectType =="Checkin_status"){
         
            setSelectedCheckinStatus(value);

        }
        
        

        if(selectType =="State"){

            let stateArray=[];

            if(value.length == 0){
               getStateCity();
            }
           

            for(let i=0;i<value.length;i++){
                stateArray.push(value[i].value)

            }

            setSelectedState(value)
           
                
            axios.get(STATES_CITY_DATA + '/' +stateArray)
            .then(res => {
                if (res.data.success === true) {
                    for(let i=0;i<res.data.data.city.length;i++){
                        cityOptions.push({"value": res.data.data.city[i].geoname_id,"label":res.data.data.city[i].city_name})
                    }
                }
              
                setCityData(cityOptions)
                
            });

            }

            if(selectType == "Client"){

                let clientArray=[];
                
                for(let i=0;i<value.length;i++){
                    clientArray.push(value[i].value)
    
                }
    
                setSelectedClient(value)
                
                if(clientArray.length >= 1){
                   
                    axios.get(CITY_HUB_DATA + '/' +clientArray)
                    .then(res => {
                        if (res.data.success === true) {
                            for(let i=0;i<res.data.data.length;i++){
                                 hubOptions.push({"value": res.data.data[i].id,"label":res.data.data[i].ll_hub_name})
                            }
                        }    
                         setHubData(hubOptions)
                    });
                }
                else{
                   getHubData();
                }
            }
               
        props.getSearchData(state => ({
            ...state,
            [selectType]: {...value}
        }));
        SetFilterData(state => ({
            ...state,

             [selectType]: {...value}

            
        }));

    };



    const FrameStateCityData=(data)=>{

        for(let i=0;i<data.city.length;i++){
            cityOptions.push({"value": data.city[i].geoname_id,"label":data.city[i].city_name})
        }

        setCityData(cityOptions)

        for(let i=0;i<data.state.length;i++){
            stateOptions.push({"value": data.state[i].subdivision_1_iso_code,"label":data.state[i].subdivision_1_name})

     }

     setStateData(stateOptions);



    };

    /**
     * get All seltected cites based on selected state
     */
    const getSelectedState=()=>{

    

        if(selectedState.length > 0){
            
            axios.get(STATES_CITY_DATA + '/' +selectedState)
            .then(res => {
                if (res.data.success === true) {
                    
                    setCityData(res.data.data.city);


                }
            });

        }

        

    }


    /**
     *Get ALL Hubs
     * */
     const  getHubData = () => {
        axios.get(HUB_DATA)
        .then(res => {
            if (res.data && res.data.success) {

                frameHubdata(res.data.data);
                                
              
            }
        })
    };

   const frameHubdata = (data)=>{
   
    for(let i=0;i<data.length;i++){
        hubOptions.push({"value": data[i].id,"label":data[i].ll_hub_name})
    
         }
     
   setHubData(hubOptions)

   }
              

    /**
     *Get ALL Hubs
     * */
     const getClientData = () => {
        axios.get(CLIENT_DATA)
        .then(res => {
            if (res.data && res.data.success) {
               
                for(let i=0;i<res.data.data.length;i++){
                    clientOptions.push({"value": res.data.data[i].id,"label":res.data.data[i].ll_client_name})
                
                }
                 
                setClientData(clientOptions)
            }
        })
    };

    /***
     * get All the state and cities
     */
    const getStateCity = () => {
       
        axios.get(STATE_CITY_DATA )
            .then(res => {
                if (res.data.success === true) {
                  
                    FrameStateCityData(res.data.data)

                } else {
                    //setCheckinOutData([]);
                }
            }).catch(function (error) {
                if (!error) {
                    alert(error.response.data.errors);
                } else {
                    alert('unauthorized action');
                }
            });
    };


    
   
    
    return (
        <React.Fragment>
            <a
                className="opsreport-filter-btn btn btn-primary btn-sm waves-effect waves-light"
                data-toggle="modal" data-target=".filter-popup"
                onClick={() => { setFilterPopupShow(true)}}>
                <i className="fa fa-filter mr-1"> </i>Filter</a>
            {
                <Modal show={FilterPopupShow}>
                    <Modal.Body>
                        <div className="row">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" onClick={() => {
                                            setFilterPopupShow(false);
                                        }}>&times;</span>
                            </button>
                            

                            <div className="col-md-12"  key={"state"}>
                                <div className="form-group"key={"state"} >
                               
                                    <label htmlFor="trans-type">{"State"}</label>
                                    {
                                         stateDisable ==1 ? <Select defaultValue={selectedState}
                                            
                                         options={stateData}
                                         isMulti
                                         isDisabled
                                         onChange={(e) => {
                                             frameFilterData(options.value,e,"State");
                                         }}

                                         
                                        
                                     /> :    <Select defaultValue={selectedState}
                                            
                                     options={stateData}
                                     isMulti
                                     onChange={(e) => {
                                         frameFilterData(options.value,e,"State");
                                     }}

                                     
                                    
                                 />   
                                         
                                        
                                        
                                    }
                                </div>
                                            
                            </div>
                           
    
                            <div className="col-md-12" key={"City"}>
                                <div className="form-group"key={"City"} >
                                    <label htmlFor="trans-type">{"City"}</label>
                                                
                                        <Select defaultValue={selectedCity}
                                            options={ cityData}
                                            isMulti
                                            onChange={(e) => {
                                                frameFilterData(options.value,e,"City");
                                            }}

                                        > 
                                        
                                        </Select>

                                </div>
                                            
                            </div>

                            <div className="col-md-12" key={"client"}>
                                <div className="form-group" key={"client"}>
                                    <label htmlFor="trans-type">{"Client"}</label>

                                    {
                                        clientDisable == 1 ? <Select defaultValue={selectedClient}
                                        options={ clientData}
                                        isMulti
                                        isDisabled
                                        onChange={(e) => {
                                            frameFilterData(options.value,e,"Client");
                                        }}
                                    />
                                    :
                                    <Select defaultValue={selectedClient}
                                        options={ clientData}
                                        isMulti
                                        onChange={(e) => {
                                            frameFilterData(options.value,e,"Client");
                                        }}
                                    />

                                    }
                                                
                                        
                                        
                                      

                                </div>
                                            
                            </div>

                            <div className="col-md-12"  key={"bub"}>
                                <div className="form-group"  key={"hub"}>
                                    <label htmlFor="trans-type">{"Hub"}</label>
                                                
                                        <Select defaultValue={selectedHub}
                                            options={ hubData}
                                            isMulti
                                            onChange={(e) => {
                                                frameFilterData(options.value,e,"Hub");
                                            }}
                                        > 
                                        
                                        </Select>

                                </div>
                                            
                            </div>
                            <div className="col-md-12" >
                                <div className="form-group"  >
                                    <label htmlFor="trans-type">Checkin Status</label>
                                   
                                                <Select  
                                                defaultValue={selectedCheckinStatus} 
                                                options={options}
                                                isMulti
                                                onChange={(e) => {
                                                                        //setSelectedCheckinStatus(e.target.value);
                                                                       frameFilterData(options.value,e,"Checkin_status");

                                                                    }}
                                                />
                                                     
                                                   
                                                   
                                                
                                                
                                </div>
                            </div>
                          

                            <div className="col-md-12">
                                <div className="act-links mt-2 text-center">
                                    <a className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                       onClick={search}>Search</a>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </React.Fragment>
    );
}

export default Filter;
