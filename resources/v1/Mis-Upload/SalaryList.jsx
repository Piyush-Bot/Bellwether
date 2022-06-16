import React, { useEffect, useState, } from 'react';
import axios from "axios";
import Pagination from "react-js-pagination";
import {  LIST_XL_DATA,DOWNLOAD_XL_DATA } from "../Auth/Context/AppConstant"
import { PaginationCount } from "../Common/PaginationCount";
import MisUploadContext from './Context/MisUploadContext';
import Title from "../Common/Title";
import BreadCrumb from "../Common/BreadCrumb";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import {Link} from "react-router-dom";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import helpers from '../../helpers';
import Filter from "./Filter";
let search_value = '';
let reset = false;


const SalaryList = (props) => {

    let custs = [];
    let excelDownloadData = [];
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const [searchShow, setSearchShow] = useState(false);        
    const [filterObject, setFilterObject] = useState({});
    const [paymentData, setPaymentData] = useState([]);
    const [serialNo, setSerialNo] = useState(1);
    const [q, setQ] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [initialRender, setInitialRender] = useState(true);
    const [paginationValues, setPaginationValues] = useState({
        currentPage: 1,
        perPage: 10,
        totalRecords: 0
    });

    const breadCrumbs = [
        { name: "Reports", url: "#", class: "breadcrumb-item" },
        { name: "Upload Salary List", url: "#", class: "breadcrumb-item active" }
    ];

    const tableHead = [
        { label: "Sl.No", scope: "col" },
        { label: "Month",scope: "col" },
        { label: "Year",scope: "col" },
        { label: "EmpId",scope: "col" },
        { label: "Name",scope: "col" },
        { label: "Gender",scope: "col" },
        { label: "Phone Number",scope: "col" },
        { label: "Date Of Joining ",scope: "col" },
        { label: "Date Of Leaving",scope: "col" },
        { label: "ERP Status",scope: "col" },
        { label: "Driving License",scope: "col" },
        { label: "Aadhar No",scope: "col" },
        { label: "PAN No",scope: "col" },
        { label: "IFSC",scope: "col" },
        { label: "Unique Bank ID",scope: "col" },
        { label: "Bank Name",scope: "col" },
        { label: "Bank Account No",scope: "col" },
        { label: "Nominee",scope: "col" },
        { label: "Nominee No",scope: "col" },
        { label: "Recruiter",scope: "col" },
        { label: "Client EMP id",scope: "col" },
        { label: "Client",scope: "col" },
        { label: "Hub Location",scope: "col" },
        { label: "City",scope: "col" },
        { label: "State",scope: "col" },
        { label: "Full Time",scope: "col" },
        { label: "Vendor",scope: "col" },
        { label: "Vendor Type",scope: "col" },
        { label: "Vehicle Type",scope: "col" },
        { label: "Vehicle Model",scope: "col" },
        { label: "Rate",scope: "col" },
        { label: "1",scope: "col" },
        { label: "2",scope: "col" },
        { label: "3",scope: "col" },
        { label: "4",scope: "col" },
        { label: "5",scope: "col" },
        { label: "6",scope: "col" },
        { label: "7",scope: "col" },
        { label: "8",scope: "col" },
        { label: "9",scope: "col" },
        { label: "10",scope: "col" },
        { label: "11",scope: "col" },
       { label: "12",scope: "col" },
        { label: "13",scope: "col" },
        { label: "14",scope: "col" },
        { label: "15",scope: "col" },
        { label: "16",scope: "col" },
        { label: "17",scope: "col" },
        { label: "18",scope: "col" },
        { label: "19",scope: "col" },
        { label: "20",scope: "col" },
        { label: "21",scope: "col" },
        { label: "22",scope: "col" },
        { label: "23",scope: "col" },
        { label: "24",scope: "col" },
        { label: "25",scope: "col" },
        { label: "26",scope: "col" },
        { label: "27",scope: "col" },
        { label: "28",scope: "col" },
        { label: "29",scope: "col" },
        { label: "30",scope: "col" },
        { label: "31",scope: "col" },
        { label: "TDP1",scope: "col" },
        { label: "TDP2",scope: "col" },
        { label: "TDP3",scope: "col" },
        { label: "FN1",scope: "col" },
        { label: "FN2",scope: "col" },
        { label: "Monthly Orders",scope: "col" },
        { label: "Mondays",scope: "col" },
        { label: "Deductible Days",scope: "col" },
        { label: "Extra Paydays Based on Attn",scope: "col" },
        { label: "Incentives",scope: "col" },
         { label: "Other Incentives",scope: "col" },
         { label: "Arrears Days/ Orders",scope: "col" },
         { label: "Arrears Salary",scope: "col" },
         { label: "No.Of Trip",scope: "col" },
         { label: "NJIT No.Of.order",scope: "col" },
         { label: "Amount",scope: "col" },
         { label: "Van Order Count",scope: "col" },
         { label: "Traning Amount",scope: "col" },
         { label: "Normal Order Count",scope: "col" },
         { label: "Refund",scope: "col" },
         { label: "Traffic Challan",scope: "col" },
         { label: "Vehicle Damage",scope: "col" },
         { label: "Tshirt",scope: "col" },
         { label: "Bag",scope: "col" },
         { label: "Short Cash",scope: "col" },
         { label: "Raincoat Deduction",scope: "col" },
         { label: "Vehicle Usage",scope: "col" },
         { label: "TDP1 Net Amount",scope: "col" },
         { label: "TDP2 Net Amount",scope: "col" },
         { label: "TDP3 Net Amount",scope: "col" },
         { label: "FN1 Net Amount",scope: "col" },
         { label: "FN2 Net Amount",scope: "col" },
         { label: "Monthly Net Amount",scope: "col" },
         { label: "Remarks",scope: "col" },
         { label: "View",scope: "col" },
  
    ];

    useEffect(() => {
       // getPage(1);

       if (initialRender) {
        getOpsSalaryList();
    }

       if (reset) {
        getOpsSalaryList();
        reset = false;
    }

       
    }, [searchValue,filterObject]);

    const getPage = (activePage) => {
              axios.get( LIST_XL_DATA + '?q=' + search_value + '&page=' + activePage)
            .then(res => {

                
                if (res.data.success) {
                    setDataAndPagination(res.data.data);
                }

               
                
            }).catch(function (error) {
               
                if (error) { alert(error.response.data.errors); }
                else { alert('unauthorized action'); }
            });
    };

    let textInput = React.createRef();

    const searchValue = () => {
        search_value = textInput.current.value;
        axios.get(LIST_XL_DATA + '?q=' + textInput.current.value + '&page=' + 1)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination(res.data.data);
                } else {
                    setPaymentData([]);
                }
            }).catch(function (error) {
                if (!error) {
                    alert(error.response.data.errors);
                } else {
                    alert('unauthorized action');
                }
            });
    };


    const getOpsSalaryList = async () => {

        if (q.length > 0) {
            setSearchShow(false);
            setSearchClose(true);
        }
       
        let month='';
        let year = '';
        let state = '';
        let city = '';
       
        month =  filterObject.month_data && filterObject.month_data.name ? filterObject.month_data.name : '';
        year =   filterObject.year && filterObject.year.name ? filterObject.year.name : '';
        state =  filterObject.state && filterObject.state.name ? filterObject.state.name : '';
        city =  filterObject.city && filterObject.city.name ? filterObject.city.name : '';

        

        await axios.get(LIST_XL_DATA + '?q=' + q + '&page=' + activePage + '&month=' + month + '&year=' + year + '&state=' + state+ '&city=' + city)
            .then(res => {
                if (res.data.success === true) {
                    setDataAndPagination(res.data.data);
                }
            });

         setQ('');
         setInitialRender(false);
    };

    const handlePageChange = (pageNumber) => {
        getPage(pageNumber);
    };

    const setDataAndPagination = (data) => {
        setPaymentData(data.itemsList);
        
          
        setPaginationValues({
            perPage: data.paginator.perPage,
            totalRecords: data.paginator.itemCount,
            currentPage: parseInt( data.paginator.currentPage)
        });
        setSerialNo((data.paginator.currentPage * 10) - 9);
    };


   const setExcelData = (data,moduleData) => {
          
       excelDownloadData = data;
      
       if(excelDownloadData.length > 0 ){

        excelDownloadData.map((payment, i) => (

            custs.push({
                SlNo:i+1,
                Month: payment.month,
                Year: payment.year,
                EmpId:  payment.empleads.llemp_code,
                Gender: helpers.getModuleValue(moduleData, payment.empleads.llemp_gender),
                Name : payment.empleads.llemp_firstname+" "+payment.empleads.llemp_lastname ,
                PhoneNumber: payment.empleads.llemp_contact_number,
                DateOfJoining: payment.empleads.llemp_date_of_join,
                DOL: payment.empleads.llemp_relieving_date,
                ERPStatus : helpers.getModuleValue(moduleData, payment.empleads.last_known_status_id),
                DrivingLicence : helpers.findDocumentType(payment.document, 342),
                AadharNo : helpers.findDocumentType(payment.document, 341),
                PanNo: helpers.findDocumentType(payment.document, 343),
                IFSC : payment.empleads.ifsc_code,
                UniqueBankId :  payment.empleads.ifsc_code,
                BankName:   payment.empleads.bank_name,          
                BankAccountNo: payment.empleads.nominee_phone_number,
                Nominee: payment.empleads.nominee_name,
                NomineePhoneNo: payment.empleads.nominee_phone_number,
                Recruiter: payment.recruiter.recruiter,
                ClientEmpId: payment.client_emp_id,
                client: payment.client,
                HubLocation: payment.hub_location,
                City: payment.city,
                State: payment.state,
                FullTime: payment.full_time,
                Vendor: payment.vendor,
                VendorType: payment.vendor_type,
                VehicleType: payment.vehicle_type,
                Rate: payment.rate,
                Day1: payment.day1,
                Day2: payment.day2,
                Day3: payment.day3,
                Day4: payment.day4,
                Day5: payment.day5,
                Day6: payment.day6,
                Day7: payment.day7,
                Day8: payment.day8,
                Day9: payment.day9,
                Day10: payment.day10,
                Day11: payment.day11,
                Day12: payment.day12,
                Day13: payment.day13,
                Day14: payment.day14,
                Day15: payment.day15,
                Day16: payment.day16,
                Day17: payment.day17,
                Day18: payment.day18,
                Day19: payment.day19,
                Day20: payment.day20,
                Day21: payment.day21,
                Day22: payment.day22,
                Day23: payment.day23,
                Day24: payment.day24,
                Day25: payment.day25,
                Day26: payment.day26,
                Day27: payment.day27,
                Day28: payment.day28,
                Day29: payment.day29,
                Day30: payment.day30,
                Day31: payment.day31,
                TDP1: payment.tdp1,
                TDP2: payment.tdp2,
                TDP3: payment.tdp3,
                FN1: payment.fn1,
                FN2: payment.fn2,
                MonthlyOrders: payment.monthy_orders,
                Mondays: payment.mondays,
                DeductibleDays: payment.deductible_days,
                ExtraPayDaysBasedOnAttn: payment.extra_paydays_based_on_attn,
                Incetive: payment.incentive,
                OtherIncentive: payment.other_incentive,
                ArrearsDays: payment.arrears_days,
                ArrearsSalary: payment.arrears_salary,
                NJITNoOf_Order:  payment.njit_no_of_order,
                VanOrderCount: payment.van_order_count,
                VanOrderAmount: payment.van_order_amount,
                TraningAmount: payment.traning_amount,
                NormalOrderCount: payment.normal_order_count,
                Refund: payment.refund,
                TrafficChallan: payment.traffic_challan,
                VehicleDamage: payment.vehicle_damage,
                Tshirt: payment.tshirt,
                Bag: payment.bag,
                ShortCase: payment.short_case,
                Raincoat: payment.rain_coat,
                VehicleUsage: payment.vehicle_usage,
                NetTdp1:payment.net_tdp1,
                NetTdp2:  payment.net_tdp2,
                NetTdp3: payment.net_tdp3,
                NetFn1: payment.net_fn1,
                NetFn2: payment.net_fn2,
                Monthly: payment.monthly,
                Remarks: payment.remarks
            }
         )
        ));
             
        const ws = XLSX.utils.json_to_sheet(custs);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data1 = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data1, 'employee_payrol' + fileExtension);

       }
        
        
    };

   
   
    
    const exportToCSVData = (moduleData)=>{

        let month =  filterObject.month_data && filterObject.month_data.name ? filterObject.month_data.name : '';
        let year =   filterObject.year && filterObject.year.name ? filterObject.year.name : '';
        let state =  filterObject.state && filterObject.state.name ? filterObject.state.name : '';
        let city =  filterObject.city && filterObject.city.name ? filterObject.city.name : '';

             
        search_value = textInput.current.value;
        axios.get(DOWNLOAD_XL_DATA + '?q=' + textInput.current.value + '&page=' + 1 + '&month=' + month + '&year=' + year + '&state=' + state+ '&city=' + city)
            .then(res => {
                if (res.data.success === true) {
                    setExcelData(res.data.data,moduleData);
                    
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
        setFilterObject({});

        if (q.length >= 0) {
            setQ('');
        }
        
    };

    const resetFilter = () => {
        
        resetCommonFilters();
        reset = true;
    };

    
     
    return (
        <MisUploadContext.Consumer>
            {

                context => (
                    <React.Fragment>
            
                        <div className="content">
                        <div className="container-fluid">
                            <div className="page-title-box">
                                <div className="row align-items-center">
                                    <Title title={'Upload Salary List'} />
                                </div>
                                <BreadCrumb breadCrumbs={breadCrumbs} />
                                <div className="row align-items-center">
                                    <div className="col-sm-3">
                                        <input ref={textInput} type="text" className="form-control" placeholder="ClientEMPID/ Client" />
                                    </div>
                                    <div className="col-sm-9">
                                        <button type="button" className="btn btn-primary waves-effect waves-light"
                                            onClick={searchValue}><i className="fa fa-search mr-2"> </i>Search
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card m-b-30">
                                        <div className="card-body table-card">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h4 className="mt-0 header-title  pl-3">Uploaded Salary List</h4>
                                                </div>
                                                <div className="col-md-6 text-right ">

                                                <a
                                                            className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                                                            data-toggle="modal" data-target=".filter-popup"
                                                            onClick={resetFilter}>
                                                            <i className="fa fa-refresh mr-1"> </i>Reset</a>
                                                            {
                                                    context.opsListFilterData.length > 0 ?
                                                        <Filter filterData={context.opsListFilterData}
                                                                searchShow={searchShow}
                                                                getSearchData={setFilterObject}
                                                                selectedValues={filterObject}
                                                                 handleFilterEvent={getOpsSalaryList}
                                                                
                                                        > </Filter> : null
                                                }    
                                                        
                                                    <Link to="/app/mis-upload-app/mis-salary/add"
                                                        className="btn btn-primary btn-sm waves-effect waves-light opssalary-upload">
                                                        <i className="fa fa-plus mr-1"> </i>Upload New</Link>


                                                        <div className="btn btn-primary waves-effect waves-light mr-3 exceldownload-btn opsexcel"
                                            onClick={(e) =>exportToCSVData(context.moduleData)}><i className="fa fa-file-excel-o mr-2"> </i>Export
                                        </div>

                                                       
                                                        
                                                </div>
                                                
                                            </div>
                                           
                                            <div className="table-responsive">
                                            
                                                <table className="table">
                                                <thead>    
                                                    <tr >
                                                        <td colSpan="30">Basic Details</td>
                                                        <td colSpan="37">MIS Order Data</td>
                                                        <td colSpan="4">Orders</td>
                                                        <td colSpan="11">Additions</td>
                                                        <td colSpan="7">Deductions</td>
                                                        <td colSpan="13">Net Pay</td>
                                                    
                                                    </tr>
                                                    
                                                </thead>
                                                    <TableHeader data={tableHead} />
                                                   
                                                    <tbody>
                                                        {
                                                            paymentData.length > 0 ? paymentData.map((payment, i) => (
                                                                
                                                                <tr key={i}>
                                                                    <th>{serialNo + (i)}</th>

                                                                                                                                                                                                 
                                                                    <td className={'word-break'}> {payment.month}</td>
                                                                    <td className={'word-break'}> {payment.year}</td>
                                                                    <td className={'word-break'}> {payment.empleads.llemp_code}</td>
                                                                   <td className={'word-break'}> 
                                                                     <Link
                                                                            to={'/app/mis-upload-app/mis-salary/edit/' + payment._id}>{payment.empleads.llemp_firstname}{payment.empleads.llemp_lastname}
                                                                        </Link> </td>
                                                                    <td className={'word-break'}> {helpers.getModuleValue(context.moduleData,  payment.empleads.llemp_gender) }</td>
                                                                    <td className={'word-break'}> {payment.empleads.llemp_contact_number}</td>
                                                                    <td className={'word-break'}> {payment.empleads.llemp_date_of_join}</td>
                                                                    <td className={'word-break'}> {payment.empleads.llemp_relieving_date}</td>
                                                                    <td className={'word-break'}> { helpers.getModuleValue(context.moduleData, payment.empleads.last_known_status_id)}</td>
                                                                    <td className={'word-break'}> {helpers.findDocumentType(payment.document, 342)}</td>
                                                                    <td className={'word-break'}> {helpers.findDocumentType(payment.document, 341) }</td>
                                                                    <td className={'word-break'}> {helpers.findDocumentType(payment.document, 343)}</td>
                                                                    <td className={'word-break'}> {payment.empleads.ifsc_code  }</td>
                                                                    <td className={'word-break'}> {payment.empleads.llemp_relieving_date}</td>
                                                                    <td className={'word-break'}> {payment.empleads.bank_name}</td>
                                                                    <td className={'word-break'}> {payment.empleads.account_number}</td>
                                                                    <td className={'word-break'}> {payment.empleads.nominee_name}</td>
                                                                    <td className={'word-break'}> {payment.empleads.nominee_phone_number}</td>
                                                                    <td className={'word-break'}> {payment.recruiter.recruiter}</td>
                                                                    <td className={'word-break'}> {payment.client_emp_id}</td>
                                                                    <td className={'word-break'}> {payment.cleintdetail ? payment.cleintdetail.client_name :  ''}</td>
                                                                    <td className={'word-break'}> {payment.cleintdetail ? payment.cleintdetail.hub_name : ''}</td>
                                                                    <td className={'word-break'}> {payment.cleintdetail ? payment.cleintdetail.city : ''}</td>
                                                                    <td className={'word-break'}> {payment.cleintdetail ? payment.cleintdetail.state : ''}</td>
                                                                    
                                                                    <td className={'word-break'}>  { helpers.getModuleValue(context.moduleData, payment.empleads.llemp_model_type_id)}</td>
                                                                    <td className={'word-break'}> {payment.vendor}</td>
                                                                    <td className={'word-break'}> { helpers.getModuleValue(context.moduleData, payment.empleads.llemp_model_id)}</td>
                                                                    <td className={'word-break'}> {payment.vehicle_type}</td>
                                                                    <td className={'word-break'}> { helpers.getModuleValue(context.moduleData, payment.empleads.llemp_model_id)}</td>
                                                                    <td className={'word-break'}> {payment.rate}</td>
                                                                    <td className={'word-break'}> {payment.day1}</td>
                                                                    <td className={'word-break'}> {payment.day2}</td>
                                                                    <td className={'word-break'}> {payment.day3}</td>
                                                                    <td className={'word-break'}> {payment.day4}</td>
                                                                    <td className={'word-break'}> {payment.day5}</td>
                                                                    <td className={'word-break'}> {payment.day6}</td>
                                                                    <td className={'word-break'}> {payment.day7}</td>
                                                                    <td className={'word-break'}> {payment.day8}</td>
                                                                    <td className={'word-break'}> {payment.day9}</td>
                                                                    <td className={'word-break'}> {payment.day10}</td>
                                                                    <td className={'word-break'}> {payment.day11}</td>
                                                                    <td className={'word-break'}> {payment.day12}</td>
                                                                    <td className={'word-break'}> {payment.day13}</td>
                                                                    <td className={'word-break'}> {payment.day14}</td>
                                                                    <td className={'word-break'}> {payment.day15}</td>
                                                                    <td className={'word-break'}> {payment.day16}</td>
                                                                    <td className={'word-break'}> {payment.day17}</td>
                                                                    <td className={'word-break'}> {payment.day18}</td>
                                                                    <td className={'word-break'}> {payment.day19}</td>
                                                                    <td className={'word-break'}> {payment.day20}</td>
                                                                    <td className={'word-break'}> {payment.day21}</td>
                                                                    <td className={'word-break'}> {payment.day22}</td>
                                                                    <td className={'word-break'}> {payment.day23}</td>
                                                                    <td className={'word-break'}> {payment.day24}</td>
                                                                    <td className={'word-break'}> {payment.day25}</td>
                                                                    <td className={'word-break'}> {payment.day26}</td>
                                                                    <td className={'word-break'}> {payment.day27}</td>
                                                                    <td className={'word-break'}> {payment.day28}</td>
                                                                    <td className={'word-break'}> {payment.day29}</td>
                                                                    <td className={'word-break'}> {payment.day30}</td>
                                                                    <td className={'word-break'}> {payment.day31}</td>
                                                                    <td className={'word-break'}> {payment.tdp1}</td>
                                                                    <td className={'word-break'}> {payment.tdp2}</td>
                                                                    <td className={'word-break'}> {payment.tdp3}</td>
                                                                    <td className={'word-break'}> {payment.fn1}</td>
                                                                    <td className={'word-break'}> {payment.fn2}</td>
                                                                    <td className={'word-break'}> {payment.monthy_orders}</td>
                                                                    <td className={'word-break'}> {payment.mondays}</td>
                                                                    <td className={'word-break'}> {payment.deductible_days}</td>
                                                                    <td className={'word-break'}> {payment.extra_paydays_based_on_attn}</td>
                                                                    <td className={'word-break'}> {payment.incentive}</td>
                                                                    <td className={'word-break'}> {payment.other_incentive}</td>
                                                                    <td className={'word-break'}> {payment.arrears_days}</td>
                                                                    <td className={'word-break'}> {payment.arrears_salary}</td>
                                                                    <td className={'word-break'}> {payment.no_of_trip}</td>
                                                                    <td className={'word-break'}> {payment.njit_no_of_order}</td>
                                                                    <td className={'word-break'}> {payment.van_order_count}</td>
                                                                    <td className={'word-break'}> {payment.van_order_amount}</td>
                                                                    <td className={'word-break'}> {payment.traning_amount}</td>
                                                                    <td className={'word-break'}> {payment.normal_order_count}</td>
                                                                    <td className={'word-break'}> {payment.refund}</td>
                                                                    <td className={'word-break'}> {payment.traffic_challan}</td>
                                                                    <td className={'word-break'}> {payment.vehicle_damage}</td>
                                                                    <td className={'word-break'}> {payment.tshirt}</td>
                                                                    <td className={'word-break'}> {payment.bag}</td>
                                                                    <td className={'word-break'}> {payment.short_case}</td>
                                                                    <td className={'word-break'}> {payment.rain_coat}</td>
                                                                    <td className={'word-break'}> {payment.vehicle_usage}</td>
                                                                    <td className={'word-break'}> {payment.net_tdp1}</td>
                                                                    <td className={'word-break'}> {payment.net_tdp2}</td>
                                                                    <td className={'word-break'}> {payment.net_tdp3}</td>
                                                                    <td className={'word-break'}> {payment.net_fn1}</td>
                                                                    <td className={'word-break'}> {payment.net_fn2}</td>
                                                                    <td className={'word-break'}> {payment.monthly}</td>
                                                                    <td className={'word-break'}> {payment.remarks}</td>
                                                                    <td className="text-right">
                                                                    <Link
                                                                        to={'/app/reports-app/ops-salary/edit/' + payment._id }>
                                                                        <div className="act-links btn btn-warning btn-sm " data-toggle="tooltip"
                                                                            data-placement="top" title="" data-original-title="View"><i className="fa fa-eye"> </i>
                                                                        </div>
                                                                </Link>
                                                            </td>
                                                                    
                                                                   
                                                                   
                                                                </tr>)) :
                                                                <TableNoDataFound message={'No Payment Data Found!'} frontSpan={8} backSpan={88} />
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="float-left">
                                                <PaginationCount currentPage={paginationValues.currentPage} totalRecords={paginationValues.totalRecords} />
                                            </div>
                                            <div className="float-right mt-2 pr-3">
                                                <div className="Page navigation example">
                                                    {
                                                        paginationValues.totalRecords > 0 ?
                                                            <Pagination
                                                                activePage={paginationValues.currentPage}
                                                                itemsCountPerPage={paginationValues.perPage}
                                                                totalItemsCount={paginationValues.totalRecords}
                                                                pageRangeDisplayed={10}
                                                                onChange={handlePageChange.bind(this)}
                                                            /> : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        </React.Fragment>

            )
            }
        </MisUploadContext.Consumer>
    );

}
export default SalaryList;
