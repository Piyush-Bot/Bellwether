import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import {
  CHECKIN_CHECKOUT_DATA,
  CHECKIN_CHECKOUT_EXCEL_DATA,
  STATE_CITY_DATA,
  STATES_CITY_DATA,
  CLIENT_DATA,
  HUB_DATA,
  CITY_HUB_DATA,
} from "../../Auth/Context/AppConstant";
import { PaginationCount } from "../../Common/PaginationCount";
import ReportContext from "../context/ReportContext";

import Title from "../../Common/Title";
import BreadCrumb from "../../Common/BreadCrumb";
import TableHeader from "../../Common/TableHeader";
import TableNoDataFound from "../../Common/TableNoDataFound";
import { MomentDateFormat } from "../../Common/MomentDateFormat";
const moment = require("moment");
import { Link } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import helpers from "../../../helpers";
import Modal from "react-modal";
import Filter from "../OpsReport/Filter";
import Select from "react-select";

import CheckinOutMap from "./CheckinOutMap";

let search_value = "";
let reset = false;

const customStyles = {
  content: {
    top: "10%",
    left: "20%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "75%",
    height: "90%",
    //transform: 'translate(-50%, -50%)',
  },
};

const CheckinOutList = (props) => {
  let custs = [];
  let excelDownloadData = [];
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const [searchShow, setSearchShow] = useState(false);
  const [filterObject, setFilterObject] = useState({});

  const [checkinOutData, setCheckinOutData] = useState([]);
  const [serialNo, setSerialNo] = useState(1);
  const [q, setQ] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [initialRender, setInitialRender] = useState(true);

  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [clientData, setClientData] = useState([]);

  const [hubData, setHubData] = useState([]);

  const [selectedState, setSelectedState] = useState([]);
  const [filterSelectedState, setFilterSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedHub, setSelectedHub] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [selectedCheckinStatus, setSelectedCheckinStatus] = useState([]);

  const [paginationValues, setPaginationValues] = useState({
    currentPage: 1,
    perPage: 10,
    totalRecords: 0,
  });

  const [mapValues, setMapValues] = useState({});

  const [fromDate, setFromDate] = useState(moment().format("DD-MM-YYYY"));
  const [toDate, setToDate] = useState([]);

  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);

  const [divClass, setDivClass] = useState("tableFixHead");

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal(
    checkin_latitude,
    checkin_longitude,
    checkout_latitude,
    checkout_longitude,
    client_lat,
    client_long,
    hub_name,
    checkin_distance,
    checkout_distance,
    llemp_firstname
  ) {
    setMapValues({
      hub_name: hub_name,
      rider_name: llemp_firstname,
      checkin_distance: checkin_distance,
      checkout_distance: checkout_distance,
      checkin_latitute: checkin_latitude,
      checkin_longitute: checkin_longitude,
      checkout_latitute: checkout_latitude,
      checkout_longitute: checkout_longitude,
      hub_latitute: client_lat,
      hub_longitute: client_long,
    });
    setDivClass("responsive");
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  function closeModal() {
    setDivClass("tableFixHead");
    setIsOpen(false);
  }

  const breadCrumbs = [
    { name: "Reports", url: "#", class: "breadcrumb-item" },
    {
      name: "Checkin Check Out List",
      url: "#",
      class: "breadcrumb-item active",
    },
  ];

  const tableHead = [
    { label: "Checkin Date", scope: "col", class: "sticky-col first-col" },
    { label: "Rider Name", scope: "col", class: "sticky-col second-col" },
    { label: "Emp Id", scope: "col", class: "sticky-col third-col" },
    { label: "Mob Number ", scope: "col" },
    { label: "State", scope: "col" },
    { label: "City", scope: "col" },
    { label: "Client Name", scope: "col" },
    { label: "Hub Name", scope: "col" },
    { label: "Checkin Status", scope: "col" },
    { label: "Checkin App", scope: "col" },
    { label: "Checkin Time", scope: "col" },
    { label: "Checkout Time", scope: "col" },
    { label: "Total Time", scope: "col" },
    { label: "Checkin Location", scope: "col" },
    { label: "Checkout Location", scope: "col" },
    { label: "Vehicle Type", scope: "col" },
    { label: "Start km", scope: "col" },
    { label: "End km", scope: "col" },
    { label: "Order Assigned", scope: "col" },
    { label: "Order Deliverd", scope: "col" },
    { label: "Linked Orders", scope: "col" },
    { label: "Certified", scope: "col" },
    { label: "Certified BY", scope: "col" },
    { label: "Vehicle Number", scope: "col" },
    { label: "Battery 1", scope: "col" },
    { label: "Battery 2", scope: "col" },
    { label: "Charger 1", scope: "col" },
    { label: "Charger 2", scope: "col" },
    { label: "Next Day Availability", scope: "col" },
    { label: "Rider Remarks", scope: "col" },
    { label: "lead Id", scope: "col" },
  ];

  useEffect(() => {
    dateDifference();

    if (initialRender) {
      getCheckinList();
    }

    if (reset) {
      getCheckinList();

      reset = false;
    }
  }, [searchValue, filterObject]);

  const getPage = (activePage) => {
    let hub_id = selectedHub;
    let state = selectedState;
    let city = selectedCity;
    let client_id = selectedClient;

    axios
      .get(
        CHECKIN_CHECKOUT_DATA +
          "?q=" +
          search_value +
          "&page=" +
          activePage +
          "&checkedin_status=" +
          selectedCheckinStatus +
          "&client_id=" +
          client_id +
          "&hub_id=" +
          hub_id +
          "&state=" +
          state +
          "&city=" +
          city +
          "&start_date=" +
          startDate +
          "&end_date=" +
          endDate
      )
      .then((res) => {
        if (res.data.success) {
          setDataAndPagination(res.data.data);
        }
      })
      .catch(function (error) {
        if (error) {
          alert(error.response.data.errors);
        } else {
          alert("unauthorized action");
        }
      });
  };

  let textInput = React.createRef();

  const searchValue = () => {
    let cliend_id = selectedClient;
    let hub_id = selectedHub;
    let state = selectedState;
    let city = selectedCity;

    if (startDate != "" && endDate == "") {
      alert("Select End Date ");
      return;
    }
    if (startDate == "" && endDate != "") {
      alert("Select Start Date ");
      return;
    }

    axios
      .get(
        CHECKIN_CHECKOUT_DATA +
          "?q=" +
          q +
          "&page=" +
          1 +
          "&checkedin_status=" +
          selectedCheckinStatus +
          "&client_id=" +
          cliend_id +
          "&hub_id=" +
          hub_id +
          "&state=" +
          state +
          "&city=" +
          city +
          "&start_date=" +
          startDate +
          "&end_date=" +
          endDate
      )
      .then((res) => {
        if (res.data.success === true) {
          setDataAndPagination(res.data.data);
        } else {
          setCheckinOutData([]);
        }
      })
      .catch(function (error) {
        if (!error) {
          alert(error.response.data.errors);
        } else {
          alert("unauthorized action");
        }
      });
  };

  /**
   * Used for getting the checkin out data when page loads or search is called
   */
  const getCheckinList = async () => {
    if (q.length > 0) {
      setSearchShow(false);
      setSearchClose(true);
    }

    let checkedin_status = "";

    let fitlerStateArray = [];
    let filterCityArray = [];
    let filterClientArray = [];
    let filterHubArray = [];
    let statusArray = [];
    let state = filterObject && filterObject.State ? filterObject.State : "";
    let city = filterObject && filterObject.City ? filterObject.City : "";
    let client = filterObject && filterObject.Client ? filterObject.Client : "";
    let hub = filterObject && filterObject.Hub ? filterObject.Hub : "";

    checkedin_status =
      filterObject && filterObject.Checkin_status
        ? filterObject.Checkin_status
        : "";

    if (state !== "undefined") {
      let objectarray = Object.keys(checkedin_status).length;

      if (objectarray > 0) {
        for (let i = 0; i < objectarray; i++) {
          statusArray.push(checkedin_status[i].value);
        }
        setSelectedCheckinStatus(statusArray);
      }
    }

    if (state !== "undefined") {
      let objectarray = Object.keys(state).length;

      if (objectarray > 0) {
        for (let i = 0; i < objectarray; i++) {
          console.log(state[i].value);
          fitlerStateArray.push(state[i].value);
        }
        setSelectedState(fitlerStateArray);
      }
    }
    if (city !== "undefined") {
      let objectarray = Object.keys(city).length;

      if (objectarray > 0) {
        for (let i = 0; i < objectarray; i++) {
          console.log(city[i].value);
          filterCityArray.push(city[i].value);
        }
        setSelectedCity(filterCityArray);
      }
    }

    if (client !== "undefined") {
      let objectarray = Object.keys(client).length;

      if (objectarray > 0) {
        for (let i = 0; i < objectarray; i++) {
          console.log(client[i].value);
          filterClientArray.push(client[i].value);
        }
        setSelectedClient(filterClientArray);
      }
    }

    if (hub !== "undefined") {
      let objectarray = Object.keys(hub).length;

      if (objectarray > 0) {
        for (let i = 0; i < objectarray; i++) {
          filterHubArray.push(hub[i].value);
        }
        setSelectedHub(filterHubArray);
      }
    }

    await axios
      .get(
        CHECKIN_CHECKOUT_DATA +
          "?q=" +
          q +
          "&page=" +
          activePage +
          "&checkedin_status=" +
          statusArray +
          "&client_id=" +
          filterClientArray +
          "&hub_id=" +
          filterHubArray +
          "&state=" +
          fitlerStateArray +
          "&city=" +
          filterCityArray +
          "&start_date=" +
          startDate +
          "&end_date=" +
          endDate
      )
      .then((res) => {
        if (res.data.success === true) {
          setDataAndPagination(res.data.data);
        }
      });

    setQ("");
    setInitialRender(false);
  };

  const handlePageChange = (pageNumber) => {
    getPage(pageNumber);
  };

  const setDataAndPagination = (data) => {
    setCheckinOutData(data.action_details);

    setPaginationValues({
      perPage: 10,
      totalRecords: data.paginator.itemCount,
      currentPage: parseInt(data.paginator.currentPage),
    });
    setSerialNo(data.paginator.currentPage * 10 - 9);
  };

  const setExcelData = (checkinOutData, moduleData) => {
    excelDownloadData = checkinOutData;

    if (excelDownloadData.length > 0) {
      excelDownloadData.map((attendance, i) =>
        custs.push({
          SlNo: i + 1,
          CheckinDate:
            attendance && attendance.date == null
              ? moment().format("YYYY-MM-DD")
              : attendance.date,
          Rider_Name: attendance ? attendance.llemp_firstname : "-",
          Emp_Id: attendance ? attendance.llemp_code : "-",
          State: attendance ? attendance.state : "-",
          City: attendance ? attendance.city : "-",
          Client_Name: attendance ? attendance.client_name : "",
          Hub_Name: attendance ? attendance.hub_name : "",
          Checkin_Status: attendance.attendance_status,
          Checkin_App: attendance ? checkinMode(attendance.vehicle_type) : "",
          Checkin_Time:
            attendance && attendance.ll_logintime == "No Checkin Done"
              ? attendance.ll_logintime
              : moment(attendance.ll_logintime).format("HH:mm:ss"),
          Checkout_Time:
            attendance && attendance.ll_logouttime == "No Checkout Done"
              ? attendance.ll_logouttime
              : moment(attendance.ll_logouttime).format("HH:mm:ss"),
          Total_Time:
            attendance && attendance.ll_logouttime == "No Checkout Done"
              ? attendance.ll_logouttime
              : dateDifference(
                  attendance.ll_logintime,
                  attendance.ll_logouttime
                ),
          Checkin_Latitue: attendance ? attendance.checkin_latitude : "",
          Checkin_Longitute: attendance ? attendance.checkin_longitude : "",
          Checkout_Latitue: attendance ? attendance.checkout_latitude : "",
          Checkout_Longitute: attendance ? attendance.checkout_longitude : "",
          Vehicle_Type: attendance
            ? helpers.getModuleValue(moduleData, attendance.vehicle_type)
            : "",
          Start_km: attendance ? attendance.start_km : "",
          End_km: attendance ? attendance.end_km : "",
          Order_Assigned: attendance ? attendance.final_tot_orders : "",
          Order_Deliverd: attendance ? attendance.final_tot_orders : "",
          Certified: attendance
            ? helpers.getModuleValue(moduleData, attendance.confirm_rider_data)
            : "",
          Certified_By:
            attendance && attendance.confirm_rider_data == 652
              ? attendance.certifiedBy
              : "",
          Vehicle_Number: attendance ? attendance.vehicle_reg_no : "",
          Battery_1: attendance ? attendance.battery_serial_1 : "",
          Battery_2: attendance ? attendance.battery_serial_2 : "",
          Charger_1: attendance ? attendance.charger_serial_1 : "",
          Charger_2: attendance ? attendance.charger_serial_2 : "",
          Next_Day_Availability: attendance
            ? helpers.getModuleValue(moduleData, attendance.next_day_attn)
            : "",
          Rider_Remarks: attendance ? attendance.remarks : "",
          Lead_Id: attendance ? attendance.emp_id : "",
        })
      );

      const ws = XLSX.utils.json_to_sheet(custs);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data1 = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data1, "Check_in_out_detail" + fileExtension);
    }
  };

  /**
   *  Api to export to xls
   * @param {*} moduleData
   */
  const exportToCSVData = (moduleData) => {
    let cliend_id = selectedClient;
    let hub_id = selectedHub;
    let state = selectedState;
    let city = selectedCity;

    axios
      .get(
        CHECKIN_CHECKOUT_EXCEL_DATA +
          "?q=" +
          q +
          "&page=" +
          1 +
          "&checkedin_status=" +
          selectedCheckinStatus +
          "&client_id=" +
          cliend_id +
          "&hub_id=" +
          hub_id +
          "&state=" +
          state +
          "&city=" +
          city +
          "&start_date=" +
          startDate +
          "&end_date=" +
          endDate
      )

      .then((res) => {
        if (res.data.success === true) {
          setExcelData(res.data.data.action_details, moduleData);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (!error) {
          alert(error.response.data.errors);
        } else {
          alert("unauthorized action");
        }
      });
  };

  const resetCommonFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilterObject({});

    if (q.length >= 0) {
      setQ("");
    }
  };

  const resetFilter = () => {
    setQ("");
    setSelectedCity("");
    setSelectedHub("");
    setSelectedState("");
    setSelectedCity("");
    resetCommonFilters();

    reset = true;
    location.reload();
  };

  const dateDifference = (now, then) => {
    if (now != null && then != null) {
      let start = moment(now).format("DD-MM-YYYY HH:mm:ss");
      let end = moment(then).format("DD-MM-YYYY HH:mm:ss");

      var now = start;
      var then = end;
      var ms = moment(end, "DD/MM/YYYY HH:mm:ss").diff(
        moment(start, "DD/MM/YYYY HH:mm:ss")
      );

      var d = moment.duration(ms);
      var s = d.format("HH:mm:");

      if (s.indexOf(":") > 0) {
        var date1 = s.split(":");
        return date1[0] + " Hrs " + date1[1] + " mins";
      } else {
        return s + " mins";
      }
    } else {
      return "No Checkout Done";
    }
  };

  const checkinMode = (typevalue) => {
    if (typevalue != null) {
      if (typevalue == 754 || typevalue == 755) {
        return " LL360";
      } else if (typevalue == 10032 || typevalue == 10033) {
        return "Charging APP";
      }
    }
  };

  return (
    <ReportContext.Consumer>
      {(context) => (
        <React.Fragment>
          <div className="content">
            <div className="container-fluid">
              <div className="page-title-box">
                <div className="row align-items-center">
                  <div className="col-sm-2">
                    <label htmlFor="textInput">
                      Type Search Text
                      <input
                        type="text"
                        className="form-control selectpicker"
                        placeholder=" EMPID "
                        value={q ? q : ""}
                        onChange={(e) => {
                          setQ(e.target.value);
                        }}
                      />
                    </label>
                  </div>
                  <div className="col-sm-2">
                    <label htmlFor="fromDate">
                      From Date
                      <input
                        type="date"
                        className="form-control"
                        name="from_Date"
                        placeholder="formDate"
                        value={startDate ? startDate : ""}
                        onChange={(e) => setStartDate(e.target.value, e)}
                      />
                    </label>
                  </div>
                  <div className="col-sm-2">
                    <label htmlFor="toDate">
                      To Date
                      <input
                        type="date"
                        className="form-control"
                        name="tod_Date"
                        placeholder="toDate"
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate ? endDate : ""}
                      />
                    </label>
                  </div>
                  <div className="col-sm-6 report-buttons-div">
                    <div className="row align-items-left ml-2">
                      <div>&nbsp;</div>
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light"
                        onClick={searchValue}
                      >
                        <i className="fa fa-search mr-2"> </i>Search
                      </button>

                      <div>&nbsp;</div>
                      <a
                        className="btn btn-primary waves-effect waves-light ml-2"
                        data-toggle="modal"
                        data-target=".filter-popup"
                        onClick={resetFilter}
                      >
                        <i className="fa fa-refresh mr-2"> </i>Reset
                      </a>

                      <div>&nbsp;</div>
                      <div className="ml-2">
                        {context.opsListFilterData.length > 0 ? (
                          <Filter
                            filterData={context.opsListFilterData}
                            searchShow={searchShow}
                            getSearchData={setFilterObject}
                            selectedValues={filterObject}
                            handleFilterEvent={getCheckinList}
                          >
                            {" "}
                          </Filter>
                        ) : null}
                      </div>

                      <div>&nbsp;</div>
                      <div
                        className="btn btn-primary waves-effect waves-light ml-2 exceldownload-btn"
                        onClick={(e) => exportToCSVData(context.moduleData)}
                      >
                        <i className="fa fa-file-excel-o mr-2"> </i>Export
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
                          <h2 className="mt-0 header-title  pl-3">
                            Attendance Report
                          </h2>
                        </div>
                      </div>

                      <div className="table-responsive">
                        <table className="table">
                          <TableHeader data={tableHead} />

                          <tbody>
                            {checkinOutData.length > 0 ? (
                              checkinOutData.map((attendance, i) => (
                                <tr key={i}>
                                  <td className="sticky-col first-col">
                                    {" "}
                                    {attendance && attendance.date == null
                                      ? moment().format("YYYY-MM-DD")
                                      : attendance.date}{" "}
                                  </td>
                                  <td className="sticky-col second-col">
                                    {" "}
                                    {attendance
                                      ? attendance.llemp_firstname
                                      : "-"}{" "}
                                  </td>
                                  <td className="sticky-col third-col">
                                    {" "}
                                    {attendance ? attendance.llemp_code : "-"}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.llemp_contact_number
                                      : "-"}
                                  </td>

                                  <td>
                                    {" "}
                                    {attendance ? attendance.state : "-"}
                                  </td>
                                  <td> {attendance ? attendance.city : "-"}</td>
                                  <td>
                                    {" "}
                                    {attendance ? attendance.client_name : ""}
                                  </td>

                                  <td>
                                    {" "}
                                    {attendance ? attendance.hub_name : ""}
                                  </td>
                                  <td> {attendance.attendance_status}</td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? checkinMode(attendance.vehicle_type)
                                      : ""}
                                  </td>

                                  <td>
                                    {" "}
                                    {attendance &&
                                    attendance.ll_logintime == "No Checkin Done"
                                      ? attendance.ll_logintime
                                      : moment(attendance.ll_logintime).format(
                                          "HH:mm:ss"
                                        )}{" "}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance &&
                                    attendance.ll_logouttime ==
                                      "No Checkout Done"
                                      ? attendance.ll_logouttime
                                      : moment(attendance.ll_logouttime).format(
                                          "HH:mm:ss"
                                        )}
                                  </td>
                                  <td>
                                    {attendance &&
                                    attendance.ll_logouttime ==
                                      "No Checkout Done"
                                      ? attendance.ll_logouttime
                                      : dateDifference(
                                          attendance.ll_logintime,
                                          attendance.ll_logouttime
                                        )}
                                  </td>

                                  {attendance &&
                                  attendance.checkin_latitude != null ? (
                                    <td
                                      className="lat-long-color"
                                      onClick={() =>
                                        openModal(
                                          attendance.checkin_latitude,
                                          attendance.checkin_longitude,
                                          attendance.checkout_latitude,
                                          attendance.checkout_longitude,
                                          attendance.client_lat,
                                          attendance.client_long,
                                          attendance.hub_name,
                                          attendance.checkin_distance,
                                          attendance.checkout_distance,
                                          attendance.llemp_firstname
                                        )
                                      }
                                    >
                                      {attendance
                                        ? attendance.checkin_latitude
                                        : ""}
                                      ,{" "}
                                      {attendance
                                        ? attendance.checkin_longitude
                                        : ""}
                                    </td>
                                  ) : (
                                    <td></td>
                                  )}
                                  {attendance &&
                                  attendance.checkout_latitude != null ? (
                                    <td
                                      className="lat-long-color"
                                      onClick={() =>
                                        openModal(
                                          attendance.checkin_latitude,
                                          attendance.checkin_longitude,
                                          attendance.checkout_latitude,
                                          attendance.checkout_longitude,
                                          attendance.client_lat,
                                          attendance.client_long,
                                          attendance.hub_name,
                                          attendance.checkin_distance,
                                          attendance.checkout_distance,
                                          attendance.llemp_firstname
                                        )
                                      }
                                    >
                                      {attendance
                                        ? attendance.checkout_latitude
                                        : ""}{" "}
                                      ,
                                      {attendance
                                        ? attendance.checkout_longitude
                                        : ""}
                                    </td>
                                  ) : (
                                    <td></td>
                                  )}

                                  <td>
                                    {" "}
                                    {attendance
                                      ? helpers.getModuleValue(
                                          context.moduleData,
                                          attendance.vehicle_type
                                        )
                                      : ""}
                                  </td>

                                  <td>
                                    {" "}
                                    {attendance ? attendance.start_km : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance ? attendance.end_km : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.final_tot_orders
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.final_tot_del_orders
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.final_tot_linked_orders
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? helpers.getModuleValue(
                                          context.moduleData,
                                          attendance.confirm_rider_data
                                        )
                                      : ""}{" "}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance &&
                                    attendance.confirm_rider_data == 652
                                      ? attendance.certifiedBy
                                      : ""}{" "}
                                  </td>

                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.vehicle_reg_no
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.battery_serial_1
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.battery_serial_1
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.charger_serial_1
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? attendance.charger_serial_2
                                      : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance
                                      ? helpers.getModuleValue(
                                          context.moduleData,
                                          attendance.next_day_attn
                                        )
                                      : ""}{" "}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance ? attendance.remarks : ""}
                                  </td>
                                  <td>
                                    {" "}
                                    {attendance ? attendance.emp_id : ""}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <TableNoDataFound
                                message={"No Checkin Checkout Data Found!"}
                                frontSpan={7}
                                backSpan={25}
                              />
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="float-left">
                        <PaginationCount
                          currentPage={paginationValues.currentPage}
                          totalRecords={paginationValues.totalRecords}
                        />
                      </div>
                      <div className="float-right mt-2 pr-3">
                        <div className="Page navigation example">
                          {paginationValues.totalRecords > 0 ? (
                            <Pagination
                              activePage={paginationValues.currentPage}
                              itemsCountPerPage={10}
                              totalItemsCount={paginationValues.totalRecords}
                              pageRangeDisplayed={10}
                              onChange={handlePageChange.bind(this)}
                            />
                          ) : null}
                        </div>
                      </div>
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
            <h6>&nbsp;</h6>
            <CheckinOutMap data={mapValues} />
            <br></br>
            <button onClick={closeModal}>close</button>
          </Modal>
        </React.Fragment>
      )}
    </ReportContext.Consumer>
  );
};

export default CheckinOutList;
