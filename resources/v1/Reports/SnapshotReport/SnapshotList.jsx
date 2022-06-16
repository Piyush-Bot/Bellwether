import React, { useEffect, useState, } from 'react';
import axios from "axios";
import Pagination from "react-js-pagination";
import {  CHECKIN_CHECKOUT_DATA,CHECKIN_CHECKOUT_EXCEL_DATA ,DAILY_COUNT_DATA} from "../../Auth/Context/AppConstant";
import { PaginationCount } from "../../Common/PaginationCount";
import ReportContext from '../context/ReportContext';

import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";
import {MomentDateFormat} from "../../Common/MomentDateFormat";
const moment = require("moment");
import {Link} from "react-router-dom";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import helpers from "../../../helpers";
import Modal from 'react-modal';
import Filter  from "../OpsReport/Filter";
import Select from "react-select";
import CheckinDetail from "./CheckinDetail";
import CheckinDeail from "./CheckinDetailView";

import CheckinOutMap from "./CheckinOutMap"; 



let search_value = '';
let reset = false;

const customStyles = {
    content: {
      top: '12%',
      left: '17%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-10%',
      width: '80%',
      height: '90%',
      //transform: 'translate(-50%, -50%)',
    },
  };

const SnapshotList = (props) => {

    let custs = [];
    let excelDownloadData = [];
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const [searchShow, setSearchShow] = useState(false);        
    const [filterObject, setFilterObject] = useState({});
    const [checkinOutDateWise, setCheckinOutDateWise] = useState([]);
    const [checkinOutRiderWise,setCheckinOutRiderWise] = useState([]);
    const [checkinOutData, setCheckinOutData] = useState([]);
    const [serialNo, setSerialNo] = useState(1);
    const [q, setQ] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [initialRender, setInitialRender] = useState(true);
   
    const [selectedState,setSelectedState] =useState([]);
    const [displayText,setDisplayText] =useState([]);
    const [selectedCity,setSelectedCity] =useState([]);
    const [selectedHub,setSelectedHub] =useState([]);
    const [selectedClient,setSelectedClient] =useState([]);
    const [selectedCheckinStatus,setSelectedCheckinStatus ]= useState([]);

    const [displaySelectedState,setDisplaySelectedState] =useState([]);
    const [displaySelectedCity,setDisplaySelectedCity] =useState([]);
    const [displaySelectedHub,setDisplaySelectedHub] =useState([]);
    const [displaySelectedClient,setDisplaySelectedClient] =useState([]);
    const [displaySelectedCheckinStatus,setDisplaySelectedCheckinStatus ]= useState([]);
    


    const[tabDisplay,setTabDisplay] =useState(1);
   
    const [paginationDateWiseValues, setPaginationDateWiseValues] = useState({
        currentPage: 1,
        perPage: 10,
        totalRecords: 0
    });

    const [paginationRiderWiseValues, setPaginationRiderWiseValues] = useState({
        currentPage: 1,
        perPage: 10,
        totalRecords: 0
    });

    const [mapValues, setMapValues] = useState({});

    const [currenDate, setCurrenDate] = useState( []);
    const [toDate, setToDate] = useState([]);

   

    const[startDate,setStartDate]= useState([] );
    const[endDate,setEndDate]= useState([] );

    const [divClass, setDivClass] = useState("tableFixHead");
    const [riderTabClass, setRiderTabClass] = useState("tab-rider-active");
    const [dateWiseTabClass, setDateWiseTabClass] = useState("tab-rider-inactive");
    

  
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [detalModalIsOpen, setIsDetailOpen] = React.useState(false);

  
  function openModal(tabDisplay,selectedDate) {
    setMapValues({
        tabDisplay: tabDisplay ,
        selectedCheckinStatus:selectedCheckinStatus,
        client_id: selectedClient ,
        hub_id:selectedHub,
        state: selectedState,
        city: selectedCity,
        start_date:startDate,
        end_date:endDate ,
        selectedDate: selectedDate, 
        search: q    

    })
    setDivClass("responsive");
    setIsOpen(true);
  }

  function openDetailListModal(tabDisplay,empid,riderName,lastName) {

    setMapValues({
        tabDisplay: tabDisplay ,
        selectedCheckinStatus:selectedCheckinStatus,
        client_id: selectedClient ,
        hub_id:selectedHub,
        state: selectedState,
        city: selectedCity,
        start_date:startDate,
        end_date:endDate ,
        selectedDate: "",
        empid:empid ,
        riderName: riderName ,
        lastname:lastName  

    })
    setDivClass("responsive");
    setIsOpen(false);
    setIsDetailOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  function closeModal() {
    setDivClass("tableFixHead")
    setIsOpen(false);
    setIsDetailOpen(false);
  }




   
    const breadCrumbs = [
        { name: "Reports", url: "#", class: "breadcrumb-item" },
        { name: "Checkin Check Out List", url: "#", class: "breadcrumb-item active" }
    ];

    const tableHead = [
        { label: "Date",scope: "col" },
        { label: "Total Active",scope: "col" },
        { label: "Total Not CheckedIn",scope: "col" },
        { label: "Total Checked In",scope: "col" },
        { label: "Total LL 360 Checked In",scope: "col" },
        { label: "Total Charging App Checked In",scope: "col" },
        { label: "Total Not Checked Out",scope: "col" }
        
    ];
	

    const tableHead1 = [
      
        { label: "Rider Name",scope: "col"},
        { label: "Emp Id",scope: "col" },
        { label: "Mob Number ",scope: "col" },
        { label: "State ",scope: "col" },
        { label: "City",scope: "col" },
        { label: "Client ",scope: "col" },
        { label: "Hub ",scope: "col" },
        
        
    ];

    useEffect(() => {
   
        if (initialRender) {

       // getDailyCheckinCountData(startDate,endDate);
        getCheckinList();

       }

       if (reset) {
        //getCheckinList();

        reset = false;
       }

       if(startDate == "" && endDate=="")
       {
            setCurrenDate(moment().format("DD-MM-YYYY"));
            setDisplayText(moment().format("DD-MM-YYYY"))
           
       }
       else{
           
           let displayText = startDate +" To "+endDate;   
           setDisplayText(displayText)   
        
        }

      
       
       
    }, [searchValue,filterObject]);

    const checkValidDate =()=>{
        if(startDate !="" && endDate ==""){

            alert("Select End Date ")
            return
        }
        if(startDate =="" && endDate !=""){
            alert("Select Start Date ")
            return
        }

        if(startDate > endDate ){
            alert("From Date should be less than  End Date")
            return
        }
    }

    const getRiderDateWisePage = (activePage) => {
           
              axios.get( DAILY_COUNT_DATA + '?q=' + search_value + '&page=' + activePage+'&checkedin_status=' + selectedCheckinStatus + '&client_id=' + selectedClient + '&hub_id=' + selectedHub+ '&state=' + selectedState + '&city=' + selectedCity +"&start_date="+startDate+"&end_date="+endDate)
            .then(res => {

                if (res.data.success) {
                    setDataAndPagination(res.data.data);
                }

            }).catch(function (error) {
               
                if (error) { alert(error.response.data.errors); }
                else { //alert('unauthorized action');
             }
            });
    };


    const getRiderWisePage = (activePage) => {

          axios.get( CHECKIN_CHECKOUT_DATA + '?q=' + search_value + '&page=' + activePage+'&checkedin_status=' + selectedCheckinStatus + '&client_id=' + selectedClient + '&hub_id=' + selectedHub + '&state=' + selectedState + '&city=' + selectedCity +"&start_date="+startDate+"&end_date="+endDate)
        .then(res => {

            if (res.data.success) {
                setDataAndPagination1(res.data.data);
            }
            
        }).catch(function (error) {
           
            if (error) { alert(error.response.data.errors); }
            else { //alert('unauthorized action'); 
        }
        });
    };

    let textInput = React.createRef();


    const showRiderTabData = (tabtype,e ) =>{
        checkValidDate();
        
        if(startDate !=""  && endDate !=""){
            setDisplayText('')
        }
        if(tabtype=="ridertab"){
            setTabDisplay(2)
            getCheckinList();
        }
    }

    const showDateTabData = (tabtype,e ) =>{
        checkValidDate();
        if(startDate !=""  && endDate !=""){
            setDisplayText('')
        }
        
        if(tabtype=="datetab"){
            setTabDisplay(1)
            getDailyCheckinCountData();
        }

    }

    const getDailyCheckinCountData =()=>{

        axios.get(DAILY_COUNT_DATA  + '?q=' + q + '&page=' + 1+'&checkedin_status=' + selectedCheckinStatus + '&client_id=' + selectedClient + '&hub_id=' + selectedHub + '&state=' + selectedState+ '&city=' + selectedCity +"&start_date="+startDate+"&end_date="+endDate)
            .then(res => {
                if (res.data.success === true) {
                  setDataAndPagination(res.data.data);
                } else {
                    setCheckinOutData([]);
                }
            }).catch(function (error) {
                if (!error) {
                    alert(error.response.data.errors);
                } else {
                    //alert('unauthorized action');
                }
            });

    }

    
   
    const searchValue = () => {

        if(startDate !=""  && endDate !=""){
            setDisplayText('')
        }
          
      
   
        if(tabDisplay ==1){
            getDailyCheckinCountData(startDate,endDate)
        }
        else{

        
            
        
       
        let cliend_id =  selectedClient;
        let hub_id    =  selectedHub;
        let state     =  selectedState;
        let city      =  selectedCity;

        checkValidDate();

        axios.get(CHECKIN_CHECKOUT_DATA  + '?q=' + q + '&page=' + 1+'&checkedin_status=' + selectedCheckinStatus + '&client_id=' + cliend_id + '&hub_id=' + hub_id+ '&state=' + state+ '&city=' + city+"&start_date="+startDate+"&end_date="+endDate)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination1(res.data.data);
                } else {
                    setCheckinOutData([]);
                }
            }).catch(function (error) {
                if (!error) {
                    alert(error.response.data.errors);
                } else {
                   // alert('unauthorized action');
                }
            });
        }
    };

    const getFilterList = async () => {

             
       
        if (q.length > 0) {
            setSearchShow(false);
            setSearchClose(true);
        }

    
         let checkedin_status =""; 
      
        let fitlerStateArray = [];
        let filterCityArray = [];
        let filterClientArray = [];
        let filterHubArray = [];
        let filterStatusArray = [];
        

        let state = filterObject && filterObject.State ? filterObject.State:'';
        let city = filterObject && filterObject.City ? filterObject.City:'';
        let client = filterObject && filterObject.Client ? filterObject.Client:'';
        let hub = filterObject && filterObject.Hub ? filterObject.Hub:'';

        checkedin_status = filterObject && filterObject.Checkin_status ? filterObject.Checkin_status :'';
       
        let checkinStr ="";
       if(checkedin_status !== "undefined"){
        let objectarray =(Object.keys(checkedin_status).length);
     
        if(objectarray > 0){
            
         for (let i=0;i< objectarray;i++ ){
            filterStatusArray.push(checkedin_status[i].value);
            checkinStr +=","+checkedin_status[i].label
            }
            checkinStr = checkinStr.substring(1,checkinStr.length)
            setSelectedCheckinStatus(filterStatusArray);
        }
        else{
            setSelectedCheckinStatus("");
        }
    }
    setDisplaySelectedCheckinStatus(checkinStr); 
       
    
    
        let stateStr ="";
        if(state !== "undefined"){
           let objectarray =(Object.keys(state).length);
          
           if(objectarray > 0){
               
            for (let i=0;i< objectarray;i++ ){
                fitlerStateArray.push(state[i].value);
                stateStr +=","+state[i].label
            }

             stateStr = stateStr.substring(1,stateStr.length)
             setSelectedState(fitlerStateArray);
           }
           else{
            setSelectedState("");
           }
        }
       
        setDisplaySelectedState(stateStr);
             
      
       let cityStr ="";
       if(city !== "undefined"){
            let objectarray =(Object.keys(city).length);
            
            if(objectarray > 0){
                for (let i=0;i< objectarray;i++ ){
                    filterCityArray.push(city[i].value);
                    cityStr +=","+city[i].label

                }
                cityStr = cityStr.substring(1,cityStr.length)
               
                setSelectedCity(filterCityArray);
            }
            else{
                setSelectedCity("");
            }
        }
       
        setDisplaySelectedCity(cityStr);
         

        
        let clientStr="";
        if(client !== "undefined"){
            let objectarray =(Object.keys(client).length);
        
            if(objectarray > 0){
            for (let i=0;i< objectarray;i++ ){
               filterClientArray.push(client[i].value);
                clientStr +=","+client[i].label

            }
            clientStr = clientStr.substring(1,clientStr.length)
             
             setSelectedClient(filterClientArray);
            }
            else{
                setSelectedClient("");
            }
            
        }
        setDisplaySelectedClient(clientStr);
   
        let hubStr ="";
        if(hub !== "undefined"){
            let objectarray =(Object.keys(hub).length);
            
            if(objectarray > 0){
            for (let i=0;i< objectarray;i++ ){
                filterHubArray.push(hub[i].value);
                hubStr +=","+hub[i].label

            }
            hubStr = hubStr.substring(1,hubStr.length)
            setSelectedHub(filterHubArray);
            }
            else{
                setSelectedHub("");
            }
        }
        setDisplaySelectedHub(hubStr);
    
        if(tabDisplay == 2){
       
            await axios.get(CHECKIN_CHECKOUT_DATA + '?q=' + q + '&page=' + activePage + '&checkedin_status=' + filterStatusArray + '&client_id=' + filterClientArray + '&hub_id=' + filterHubArray+ '&state=' + fitlerStateArray+ '&city=' + filterCityArray+"&start_date="+startDate+"&end_date="+endDate)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination1(res.data.data);
                }
            });

        setQ('');
        setInitialRender(false);

       }
       else{

        axios.get(DAILY_COUNT_DATA  + '?q=' + q + '&page=' + 1+'&checkedin_status=' + filterStatusArray + '&client_id=' + filterClientArray + '&hub_id=' + filterHubArray+ '&state=' + fitlerStateArray+ '&city=' + filterCityArray+"&start_date="+startDate+"&end_date="+endDate)
        .then(res => {
            if (res.data.success === true) {
              setDataAndPagination(res.data.data);
            } else {
                setCheckinOutData([]);
            }
        }).catch(function (error) {
            if (!error) {
                alert(error.response.data.errors);
            } else {
                //alert('unauthorized action');
            }
        });

       }

      
      
        
    };

    /**
     * Used for getting the checkin out data when page loads or search is called
     */
    const getCheckinList = async () => {
       
       
        if (q.length > 0) {
            setSearchShow(false);
           // setSearchClose(true);
        }

             
            await axios.get(CHECKIN_CHECKOUT_DATA + '?q=' + q + '&page=' + activePage + '&checkedin_status=' + selectedCheckinStatus + '&client_id=' + selectedClient + '&hub_id=' + selectedHub+ '&state=' + selectedState+ '&city=' + selectedCity+"&start_date="+startDate+"&end_date="+endDate)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination1(res.data.data);
                }
            });

        setQ('');
        setInitialRender(false);

               
    };

    const handlePageChange = (pageNumber) => {
        getRiderDateWisePage(pageNumber);

    };

    const handleRiderWisePageChange = (pageNumber) => {

        getRiderWisePage(pageNumber);
       
    }

    const setDataAndPagination = (data) => {
       setCheckinOutDateWise(data.action_details);   
       setTabDisplay(1);
        
          
       setPaginationDateWiseValues({
            perPage: 10,
            totalRecords: data.paginator.itemCount,
            currentPage: parseInt( data.paginator.currentPage)
        });
        setSerialNo((data.paginator.currentPage * 10) - 9);
sear
    };

    const setDataAndPagination1 = (data) => {
      

        setCheckinOutRiderWise(data.action_details);
        setTabDisplay(2);
                   
        setPaginationRiderWiseValues({
            perPage: 10,
            totalRecords: data.paginator.itemCount,
            currentPage: parseInt( data.paginator.currentPage)
        });
        setSerialNo((data.paginator.currentPage * 10) - 9);

    };


    const checkvaliddate =(date) =>{
   
        if(date){
            return  moment(date).format('DD-MMM-YYYY')
        }
        else{
         return moment().format('DD-MMM-YYYY')
     
        }
     }
     
   const setExcelData = (checkinOutData,moduleData) => {
       
       excelDownloadData = checkinOutData;
      
      
       if(excelDownloadData.length > 0 ){

        excelDownloadData.map((attendance, i) => (

            custs.push({
                SlNo:i+1,
                CheckinDate:attendance  ?  checkvaliddate(attendance.date) : '',
                Rider_Name : attendance ? attendance.llemp_firstname +" "+attendance.llemp_lastname : "" ,
                Emp_Id:  attendance ? attendance.llemp_code : "",
                Rider_Phone_Number: attendance ? attendance.llemp_contact_number : '',
                Checkin_Status : attendance.attendance_status,
                Checkin_App : attendance ?  helpers.checkinMode(attendance.vehicle_type) : '',
                Checkin_Time: attendance && attendance.ll_logintime  != "No Checkin Done" ? moment(attendance.ll_logintime).format('HH:mm:ss') :'',
                Checkout_Time : attendance && attendance.ll_logouttime  != "No Checkout Done" ?  moment(attendance.ll_logouttime).format('HH:mm:ss') :'',
                Total_Time :  attendance && attendance.ll_logouttime  != "No Checkout Done" ?  helpers.dateDifference(attendance.ll_logintime,attendance.ll_logouttime ):'' ,
                State: attendance ? attendance.state : '',
                City: attendance ? attendance.city : '',
                Client_Name: attendance ? attendance.client_name : '',
                Hub_Name : attendance ? attendance.hub_name : '',
                Checkin_Latitue: attendance ? attendance.checkin_latitude : '',
                Checkin_Longitute: attendance ? attendance.checkin_longitude : '',
                Checkout_Latitue: attendance ? attendance.checkout_latitude : '',
                Checkout_Longitute: attendance ? attendance.checkout_longitude : '',
                Vehicle_Type: attendance ?  helpers.getModuleValue(moduleData,  attendance.vehicle_type) : '',
                Start_km: attendance ? attendance.start_km : '',
                End_km: attendance ? attendance.end_km : '',
                Order_Assigned: attendance ? attendance.final_tot_orders : '',
                Order_Deliverd: attendance ? attendance.final_tot_orders: '',
                Certified:  attendance ? helpers.getModuleValue(moduleData,  attendance.confirm_rider_data) : '',
                Certified_By: attendance  && attendance.confirm_rider_data ==652 ?  attendance.certifiedBy   : '',
                Vehicle_Number:attendance ? attendance.vehicle_reg_no : '',
                Battery_1: attendance ? attendance.battery_serial_1 :'',
                Battery_2: attendance ? attendance.battery_serial_2 : '',
                Charger_1: attendance ? attendance.charger_serial_1 :'',
                Charger_2:attendance ? attendance.charger_serial_2 : '',
                Next_Day_Availability: attendance ? helpers.getModuleValue(moduleData,  attendance.next_day_attn) : '',
                Rider_Remarks: attendance ? attendance.remarks : '',
                
                }
         )
        ));
             
        const ws = XLSX.utils.json_to_sheet(custs);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data1 = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data1, 'Check_in_out_detail' + fileExtension);

       }
        
        
    };

   
   
    /**
     *  Api to export to xls
     * @param {*} moduleData 
     */
    const exportToCSVData = (moduleData)=>{
       
             
        let cliend_id =  selectedClient;
        let hub_id    =  selectedHub;
        let state     =  selectedState;
        let city      =  selectedCity;

        
       axios.get(CHECKIN_CHECKOUT_EXCEL_DATA  + '?q=' + q + '&page=' + 1+'&checkedin_status=' + selectedCheckinStatus + '&client_id=' + cliend_id + '&hub_id=' + hub_id+ '&state=' + state+ '&city=' + city+"&start_date="+startDate+"&end_date="+endDate)
        
            .then(res => {
                if (res.data.success === true) {
                   
                    setExcelData(res.data.data.action_details,moduleData);
                    
                } 
            }).catch(function (error) {

                console.log(error);
                if (!error) {
                    alert(error.response.data.errors);
                } else {
                    alert('unauthorized action');
                }
            });
          

    }
   
    const resetCommonFilters = () => {

        setStartDate("");
        setEndDate("");
        setFilterObject({});
       
        if (q.length >= 0) {
            setQ('');
        }
        
    };

    const resetFilter = () => {
        setQ('');
        setSelectedCity('');
        setSelectedHub('');
        setSelectedState('');
        setSelectedCity('');
        resetCommonFilters();

        reset = true;
        location.reload();

    };

    return (
        
        <ReportContext.Consumer>
            {
                context => (
                    <React.Fragment>
            
                    <div className="content">
                        <div className="container-fluid">
                            <div className="page-title-box">
                                <div className="row align-items-center">
                                    <div className="col-sm-2">
                                    <label htmlFor="textInput">Type Search Text
                                        <input  type="text" className="form-control selectpicker" placeholder=" EMPID "  value={q ? q : ''}  
                                        onChange={(e) => {
                                            setQ(e.target.value)
                                        }}
                                        />
                                        </label>
                                                                                
                                    </div>
                                    
                                    <div className="col-sm-2">
                                        
                                        <label htmlFor="fromDate">From Date
                                        <input  type="date" className="form-control" name="from_Date" placeholder="formDate" value={startDate ? startDate : '' }
                                             onChange={(e) => setStartDate(e.target.value, e)}/>
                                        </label>
                                        
                                    </div>
                                    <div className="col-sm-2">
                                    <label htmlFor="toDate">To Date
                                        <input type="date" className="form-control" name="tod_Date" placeholder="toDate" 
                                        
                                         onChange={(e) => setEndDate(e.target.value)} value={endDate ? endDate : ''}/>
                                        </label>
                                    </div>
                                    <div className="col-sm-6 report-buttons-div">
                                        <div className="row align-items-left ml-2">
                                            <div>&nbsp;</div>
                                            <button type="button" className="btn btn-primary waves-effect waves-light"
                                            onClick={searchValue}><i className="fa fa-search mr-2"> </i>Search
                                            </button>
                                            <div>&nbsp;</div>
                                            <a
                                                className="btn btn-primary waves-effect waves-light ml-2"
                                                data-toggle="modal" data-target=".filter-popup"
                                                onClick={resetFilter}>
                                                <i className="fa fa-refresh mr-2"> </i>Reset</a>
                                        
                                       
                                            <div>&nbsp;</div>
                                            <div className="ml-2">
                                            {
                                                            context.opsListFilterData.length > 0 ?
                                                                <Filter filterData={context.opsListFilterData}
                                                                        searchShow={searchShow}
                                                                        getSearchData={setFilterObject}
                                                                        selectedValues={filterObject}
                                                                        handleFilterEvent={getFilterList}
                                                                > </Filter> : null
                                                        }



                                             </div> 
                                             <div>&nbsp;</div>
                                        <div className="btn btn-primary waves-effect waves-light ml-2 exceldownload-btn"
                                            onClick={(e) =>exportToCSVData(context.moduleData)}><i className="fa fa-file-excel-o mr-2"> </i>Export
                                           
                                                   
                                              
                                 
                                       
                                        </div>  
                                    
                                    
                                                           

                                            
                                        
                                        </div>
                                       
                                        
                                      
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card m-b-30">
                                        <div className="card-body table-card">
                                            <div className="row">
                                                <div className="col-md-6">

                                                    { displayText ? <h2 className="mt-0 header-title  pl-3">{tabDisplay == 1 ? "Attendance Report - Order By Date": "Attendance Report - Order By Rider"} { displayText }</h2> :<h2 className="mt-0 header-title  pl-3">{tabDisplay == 1 ? "Attendance Report - Order By Date": "Attendance Report - Order By Rider"} {startDate } To {endDate } </h2>}
                                                    
                                                    
    
                                                </div>
                                                </div>
                                                <div className="row">
                                                <div className="col-md-12 mt-0 ml-2">

                                                { displaySelectedState.length > 0 || displaySelectedCity.length > 0 || displaySelectedHub.length > 0 || displaySelectedClient.length > 0 || displaySelectedCheckinStatus.length > 0 ? <span className="filter-applied1 mr-2" > &nbsp; <b> {'Filters Applied :'}</b></span> :null}
                                                    { displaySelectedState.length > 0 ? <span className="filter-span mr-2" ><b>&nbsp;&nbsp; State : </b> {displaySelectedState}</span> :null}
                                                    { displaySelectedCity.length > 0 ? <span className="filter-span mr-2"><b>&nbsp; City : </b> {displaySelectedCity}</span> :null} 
                                                    { displaySelectedHub.length > 0 ? <span className="filter-span mr-2"><b>&nbsp; Hub : </b> {displaySelectedHub}</span>:null} 
                                                    { displaySelectedClient.length > 0 ? <span className="filter-span mr-2"  ><b>&nbsp; Client : </b>{displaySelectedClient}</span> :null}
                                                    { displaySelectedCheckinStatus.length > 0 ? <span className="filter-span mr-2"><b>&nbsp; Checkin Status : </b> {displaySelectedCheckinStatus}</span> :null}
     
    
                                                </div>
                                                
                                                
                                            </div>
                                            <div className="row mb-1 mt-1">
                                            <div className="col-md-6 ml-1">
                                            <ul className="nav nav-tabs py-4" role="tablist">
                                                        <li className="nav-item" >
                                                            <a className="nav-link active" data-toggle="tab" href="#" role="tab" aria-selected="true"  >
                                                                <span className="d-none d-md-block" onClick={(e) =>showRiderTabData("ridertab",e)}>Order By Rider</span>
                                                                <span className="d-block d-md-none">
                                                                    <i className="mdi mdi-home-variant h5" ></i>
                                                                </span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link" data-toggle="tab" href="#" role="tab" aria-selected="false" onClick={(e) =>showDateTabData("datetab",e)}>
                                                                <span className="d-none d-md-block" >Order By Date</span>
                                                                <span className="d-block d-md-none">
                                                                    <i className="mdi mdi-email h5"> </i>
                                                                </span>
                                                            </a>
                                                        </li>
                                                                
                                                    </ul>
                                                    </div>
                                                
                                            </div>

                                    
                                        { tabDisplay && tabDisplay == 1 || tabDisplay == "" ?                    
                                        <div>

                                            <div className="table-responsive">
                                                <table className="table">
                                                    <TableHeader data={tableHead} />
                                                    <tbody>
                                                        {
                                                            checkinOutDateWise.length > 0 ? checkinOutDateWise.map((riderDateWiseData, i) => (
                                                                <tr key={i}>
                                                                   <td className="lat-long-color" onClick  ={() => openModal(tabDisplay,riderDateWiseData.checkin_date)}>{moment(riderDateWiseData.checkin_date).format('DD-MMM-YYYY')} </td>
                                                                    <td>{riderDateWiseData.total_active_riders}</td>
                                                                    <td>{riderDateWiseData.total_not_checkin}</td>
                                                                    <td>{riderDateWiseData.total_checkin}</td>
                                                                    <td>{riderDateWiseData.total_ll_360}</td>
                                                                    <td>{riderDateWiseData.total_charging_app}</td>
                                                                    <td>{riderDateWiseData.logout_count}</td>



                                                                </tr>)) :
                                                                <TableNoDataFound message={'No Checkin Data Found!'} frontSpan={3} backSpan={4} />
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                                                                     
                                        
                                        </div>    
                                    
                                        :  
                                        <div>

                                            
                                                
                                            <div className="float-left mb-2 pr-3">
                                                <PaginationCount currentPage={paginationRiderWiseValues.currentPage} totalRecords={paginationRiderWiseValues.totalRecords} />
                                            </div>
                                            <div className="float-right mb-2 pr-3 paginationtab-righ">
                                                <div className="Page navigation example ">
                                                    {
                                                        paginationRiderWiseValues.totalRecords > 0 ?
                                                            <Pagination
                                                                activePage={paginationRiderWiseValues.currentPage}
                                                                itemsCountPerPage={paginationRiderWiseValues.perPage}
                                                                totalItemsCount={paginationRiderWiseValues.totalRecords}
                                                                pageRangeDisplayed={10}
                                                                onChange={handleRiderWisePageChange.bind(this)}
                                                            /> : null
                                                    }
                                                </div>
                                            </div>
                                            
                                            <div className="table-responsive  mt-1">
                                                <table className="table">
                                                    <TableHeader data={tableHead1} />
                                                    <tbody>
                                                        {
                                                            checkinOutRiderWise.length  > 1 ? checkinOutRiderWise.map((riderWiseData, i) => (
                                                                                                                               
                                                                <tr key={i}> 
                                                                
                                                                
                                                                <td className="lat-long-color" onClick  ={() => openDetailListModal(tabDisplay,riderWiseData.emp_id ,riderWiseData.llemp_firstname, riderWiseData.llemp_lastname)}>
                                                            
                                                                    {riderWiseData ? riderWiseData.llemp_firstname : ''} {riderWiseData ? riderWiseData.llemp_lastname : ''} </td>
                                                                    <td > {riderWiseData ? riderWiseData.llemp_code : ''}</td>
                                                                    <td > {riderWiseData ? riderWiseData.llemp_contact_number : ''}</td>
                                                                    <td> {riderWiseData ? riderWiseData.state : ''}</td>
                                                                    <td> {riderWiseData ? riderWiseData.city : ''}</td>
                                                                    <td> {riderWiseData ? riderWiseData.client_name : ''}</td>
                                                                    <td> {riderWiseData ? riderWiseData.hub_name : ''}</td>

                                                                </tr>))
                                                                 :
                                                                <TableNoDataFound message={'No Checkin Data Found!'} frontSpan={3} backSpan={4} />
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="float-left mb-2 pr-3">
                                                <PaginationCount currentPage={paginationRiderWiseValues.currentPage} totalRecords={paginationRiderWiseValues.totalRecords} />
                                            </div>
                                            <div className="float-right mb-2 pr-3">
                                                <div className="Page navigation example">
                                                    {
                                                        paginationRiderWiseValues.totalRecords > 0 ?
                                                            <Pagination
                                                                activePage={paginationRiderWiseValues.currentPage}
                                                                itemsCountPerPage={paginationRiderWiseValues.perPage}
                                                                totalItemsCount={paginationRiderWiseValues.totalRecords}
                                                                pageRangeDisplayed={10}
                                                                onChange={handleRiderWisePageChange.bind(this)}
                                                            /> : null
                                                    }
                                                </div>
                                            </div>
                                            
                                        
                                        </div>    
                                        
                                        
                                       
                                        
                                    }
                                    
                                
                                
                            </div>
                                    
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
           
        >
        <button onClick={closeModal}>close</button>
        <br></br>
            <CheckinDetail data={mapValues} />
            <br></br>
            <button onClick={closeModal}>close</button>
        </Modal>


        <Modal
            isOpen={detalModalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
           
        >
        <button onClick={closeModal}>close</button>
        <br></br>
            <CheckinDeail data={mapValues} />
            <br></br>
            <button onClick={closeModal}>close</button>
        </Modal>
                   
        </React.Fragment>

            )
            }
        </ReportContext.Consumer>
    );

}




export default SnapshotList;


