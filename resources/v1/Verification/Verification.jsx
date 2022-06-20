import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Typeahead } from "react-bootstrap-typeahead";
import { Modal, Spinner, Alert } from "react-bootstrap";
import Select from "react-select";

import { HRMS_BASE_URL } from "../Auth/Context/AppConstant";
import Title from "../Common/Title";
import BreadCrumb from "../Common/BreadCrumb";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import { statusVerification } from "./Status";
import { PaginationCount } from "../Common/PaginationCount";
import Pagination from "react-js-pagination";
import ReactTooltip from "react-tooltip";

const DOCS_CODE = {
  aadhar: 341,
  panCard: 343,
  drivingLicense: 342,
  bank: 268,
};

let token = localStorage.getItem("app-ll-token");

const Verification = () => {
  const history = useHistory();

  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [searchResult, setSearchResult] = useState();
  const [searchText, setSearchText] = useState([]);
  const [isSort, setIsSort] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [erroMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const [leadIdData, setLeadIdData] = useState([]);
  const [riderData, setRiderData] = useState([]);
  const [riderStatusData, setRiderStatusData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [leadIdValue, setLeadIdValue] = useState("");
  const [riderValue, setRiderValue] = useState("");
  const [riderStatusValue, setRiderStatusValue] = useState("");
  const [cityValue, setCityValue] = useState("");

  const breadCrumbs = [
    { name: "HRMS", url: "#", class: "breadcrumb-item" },
    {
      name: "Document Verification",
      url: "#",
      class: "breadcrumb-item active",
    },
  ];

  // pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = React.useState(1);
  // total records per page to display
  const recordPerPage = 10;

  // range of pages in paginator
  const pageRange = 10;

  const tableHead = [
    { label: "Lead Id", scope: "col" },
    { label: "Emp Code", scope: "col" },
    { label: "Name", scope: "col" },
    { label: "Mobile Number", scope: "col" },
    { label: "City", scope: "col" },
    { label: "Hub", scope: "col" },
    { label: "status", scope: "col" },
    { label: "Aadhar", scope: "col" },
    { label: "Pancard", scope: "col" },
    { label: "License", scope: "col" },
    { label: "Bank Details", scope: "col" },
    { label: "Action", scope: "col" },
  ];

  useEffect(() => {
    setIsLoaded(true);
    axios
      .get(`${HRMS_BASE_URL}/get-profiles`, {
        headers: {
          Authorization: `llBearer ${token}`,
        },
      })
      .then((resp) => {
        if (resp?.data?.data?.length != 0) {
          setIsLoaded(false);
          setEmployeeDetails(resp?.data?.data);
          setSearchResult(resp?.data?.data);

          const leadId = resp?.data?.data;
          const riderName = resp?.data?.data;
          const riderStatus = resp?.data?.data;

          setLeadIdData(
            leadId.map((e) => {
              return {
                value: e.id,
                label: e.id,
              };
            })
          );

          setRiderData(
            riderName.map((e) => {
              return {
                value: e.llempFirstname,
                label: e.llempFirstname,
              };
            })
          );

          setCityData(
            riderName
              .map((e) => {
                return {
                  value: e?.llempCity,
                  label: e?.llempCity,
                };
              })
              .filter((el) => el?.value && el?.label)
              .filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              )
          );

          let filteredValue = riderStatus.map((e) => {
            return {
              value: e?.riderStatusDetails?.description,
              label: e?.riderStatusDetails?.description,
            };
          });
          let unique = Array.from(
            new Set(filteredValue.map(JSON.stringify))
          ).map(JSON.parse);
          setRiderStatusData(unique);
        } else {
          setErrorMessage("Data not found");
        }
      })
      .catch((err) => {
        setIsLoaded(false);
        setErrorMessage("Something went to wrong!");
      });
  }, []);

  //filter
  function handleSort() {
    let tempData = searchResult.slice();
    const temp = [
      leadIdValue?.value,
      riderValue?.value,
      riderStatusValue?.value,
      cityValue?.value,
    ];
    const keys = [
      "id",
      "llempFirstname",
      "riderStatusDetails.description",
      "llempCity",
    ];
    temp.forEach((element, index) => {
      if (element) {
        tempData = tempData.filter((item) => {
          return keys[index].includes(".")
            ? item[keys[index].split(".")[0]][keys[index].split(".")[1]]
                .toString()
                .toLowerCase() === element.toString().toLowerCase()
            : item[keys[index]].toString().toLowerCase() ===
                element.toString().toLowerCase();
        });
      }
    });
    setEmployeeDetails(tempData);
  }

  // function handleSort() {
  //   let tempData = searchResult.slice();
  //   tempData = tempData.filter((data) => {
  //     return (
  //       data?.id == leadIdValue.value ||
  //       data?.llempFirstname == riderValue.value ||
  //       data?.riderStatusDetails?.description == riderStatusValue.value ||
  //       data?.llempCity === cityValue.value
  //     );
  //   });
  //   setEmployeeDetails(tempData);
  // }

  function resetHandler() {
    setLeadIdValue("");
    setRiderValue("");
    setRiderStatusValue("");
    setCityValue("");
    let tempData = searchResult.slice();
    setEmployeeDetails(tempData);
  }

  const CloseButton = (props) => {
    const { closeModal } = props;
    return (
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span
          aria-hidden="true"
          onClick={() => {
            closeModal(false);
          }}
        >
          &times;
        </span>
      </button>
    );
  };

  function searchHandler(event) {
    let tempData = searchResult.slice();
    tempData = tempData.filter(
      (data) =>
        data?.llempFirstname?.toLowerCase().includes(event?.toLowerCase()) ||
        data?.llempContactNumber
          ?.toLowerCase()
          .includes(event?.toLowerCase()) ||
        data?.llempContactNumber_2?.toLowerCase().includes(event?.toLowerCase())
    );

    setEmployeeDetails(tempData);
  }

  const handleFilterInputsChangeEvent = (key, value) => {
    if (key == "lead_id") {
      setLeadIdValue(value);
    } else if (key == "rider_name") {
      setRiderValue(value);
    } else if (key == "rider_status") {
      setRiderStatusValue(value);
    } else if (key == "city_name") {
      setCityValue(value);
    }
  };

  function handlePageChange(pageNumber) {
    setPaginationValues({
      activePage: pageNumber,
    });
  }

  return (
    <React.Fragment>
      <div className="content">
        <div className="container-fluid">
          <div className="page-title-box">
            <div className="row align-items-center">
              <Title title={"Document Verification"} />
            </div>
            <BreadCrumb breadCrumbs={breadCrumbs} />
          </div>

          <div className="tab-content">
            <div className="tab-pane p-3 active" id="all" role="tabpanel">
              <div className="row align-items-center mb-4 px-3">
                <div className="col-sm-4">
                  <div className="search-input">
                    <Typeahead
                      id="basic-typeahead-single"
                      // labelKey="llempFirstname"
                      labelKey={(option) => `${option.llempFirstname}`}
                      options={employeeDetails}
                      onChange={(e) => {
                        setSearchText(e?.[0]?.llempFirstname);
                        searchHandler(e?.[0]?.llempFirstname);
                      }}
                      placeholder="Search by name..."
                      onInputChange={(e) => {
                        searchHandler(e);
                      }}
                    />
                    <div className="search-icons">
                      <button
                        type="button"
                        onClick={() => handleSearchTextTask()}
                      >
                        <i className="fa fa-search mr-2"> </i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 pr-0 text-right">
                  <a
                    className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                    data-toggle="modal"
                    data-target=".filter-popup"
                    onClick={() => resetHandler()}
                  >
                    <i className="fa fa-refresh mr-1"> </i>Reset
                  </a>

                  <a
                    className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fa fa-filter mr-1"> </i>Filter
                  </a>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12">
                  <div className="table-responsive">
                    <table className="table" id={"TaskTable"}>
                      <TableHeader data={tableHead} />
                      <tbody>
                        {employeeDetails &&
                          employeeDetails?.length > 0 &&
                          employeeDetails
                            ?.slice(
                              (page - 1) * itemsPerPage,
                              page * itemsPerPage
                            )
                            .map((employee, i) => {
                              return (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td>{employee?.id ? employee?.id : "-"}</td>
                                    <td data-tip={employee?.llempCode}>
                                      {employee?.llempCode
                                        ? employee?.llempCode
                                        : "-"}
                                    </td>
                                    <td>
                                      {employee?.llempFirstname
                                        ? `${employee?.llempFirstname} ${
                                            employee?.llempLastname ?? ""
                                          }`
                                        : "-"}
                                    </td>
                                    <td>
                                      {employee?.llempContactNumber
                                        ? employee?.llempContactNumber
                                        : "-"}
                                    </td>
                                    <td>
                                      {employee?.llempCity
                                        ? employee?.llempCity
                                        : "-"}
                                    </td>
                                    <td>
                                      {employee?.llHubName
                                        ? employee?.llHubName
                                        : "-"}
                                    </td>
                                    <td>
                                      {employee?.riderStatusDetails?.description
                                        ? employee?.riderStatusDetails
                                            ?.description
                                        : "-"}
                                    </td>
                                    <td className="text-center">
                                      {employee?.llEmpIdentificationList &&
                                      employee?.llEmpIdentificationList?.length
                                        ? statusVerification(
                                            employee?.llEmpIdentificationList.find(
                                              (e) =>
                                                e?.identificationTypeId ==
                                                DOCS_CODE.aadhar
                                            )
                                          )
                                        : "-"}
                                    </td>
                                    <td className="text-center">
                                      {employee?.llEmpIdentificationList &&
                                      employee?.llEmpIdentificationList?.length
                                        ? statusVerification(
                                            employee?.llEmpIdentificationList.find(
                                              (e) =>
                                                e?.identificationTypeId ==
                                                DOCS_CODE.aadhar
                                            )
                                          )
                                        : "-"}
                                    </td>

                                    <td className="text-center">
                                      {employee?.llEmpIdentificationList &&
                                      employee?.llEmpIdentificationList?.length
                                        ? statusVerification(
                                            employee?.llEmpIdentificationList.find(
                                              (e) =>
                                                e?.identificationTypeId ==
                                                DOCS_CODE.aadhar
                                            )
                                          )
                                        : "-"}
                                    </td>

                                    <td className="text-center">
                                      {employee?.llEmpIdentificationList &&
                                      employee?.llEmpIdentificationList?.length
                                        ? statusVerification(
                                            employee?.llEmpIdentificationList.find(
                                              (e) =>
                                                e?.identificationTypeId ==
                                                DOCS_CODE.aadhar
                                            )
                                          )
                                        : "-"}
                                    </td>
                                    <td>
                                      <div
                                        className="act-links btn btn-warning btn-sm "
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title=""
                                        data-original-title="View"
                                        onClick={() =>
                                          history.push(
                                            "/app/verification-app/details",
                                            employee
                                          )
                                        }
                                        data-tip="View"
                                      >
                                        <i className="fa fa-eye" />
                                      </div>
                                      <ReactTooltip place="top" type="dark" />
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            })}
                        {isLoaded == false && employeeDetails?.length === 0 && (
                          <Alert key="info" variant="info">
                            {erroMessage}
                          </Alert>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="float-left">
                    <PaginationCount
                      currentPage={page}
                      totalRecords={employeeDetails?.length}
                    />
                  </div>

                  <div className="float-right mt-2 pr-3">
                    <div className="Page navigation example">
                      <Pagination
                        activePage={page}
                        totalItemsCount={employeeDetails?.length}
                        itemsCountPerPage={recordPerPage}
                        // itemsCountPerPage={Math.ceil(
                        //   employeeDetails?.length % itemsPerPage === 0
                        //     ? employeeDetails?.length / itemsPerPage
                        //     : employeeDetails?.length / itemsPerPage
                        // )}
                        pageRangeDisplayed={pageRange}
                        // pageRangeDisplayed={
                        //   employeeDetails.length / itemsPerPage > 1
                        //     ? employeeDetails.length / itemsPerPage
                        //     : 1
                        // }
                        onChange={(event) => setPage(event)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {isLoaded && (
                <div className="text-center">
                  <Spinner
                    animation="border"
                    role="status"
                    variant="secondary"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal}>
        <Modal.Body>
          <div className="row">
            <CloseButton closeModal={setShowModal} />

            <div className="col-md-12">
              <div className="form-group">
                <label className="font-weight-500" htmlFor="order-code">
                  Lead Id<span className="text-danger">*</span>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="Select Category"
                  isClearable={isClearable}
                  isSearchable={isSearchable}
                  options={leadIdData}
                  value={leadIdValue}
                  onChange={(e) => handleFilterInputsChangeEvent("lead_id", e)}
                  defaultValue={leadIdValue}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label className="font-weight-500" htmlFor="order-code">
                  Rider Name<span className="text-danger">*</span>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="Select Category"
                  isClearable={isClearable}
                  isSearchable={isSearchable}
                  options={riderData}
                  value={riderValue}
                  onChange={(e) =>
                    handleFilterInputsChangeEvent("rider_name", e)
                  }
                  defaultValue={riderValue}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label className="font-weight-500" htmlFor="order-code">
                  Rider Status<span className="text-danger">*</span>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="Select Category"
                  isClearable={isClearable}
                  isSearchable={isSearchable}
                  options={riderStatusData}
                  value={riderStatusValue}
                  onChange={(e) =>
                    handleFilterInputsChangeEvent("rider_status", e)
                  }
                  defaultValue={riderStatusValue}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label className="font-weight-500" htmlFor="order-code">
                  City <span className="text-danger">*</span>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="Select Category"
                  isClearable={isClearable}
                  isSearchable={isSearchable}
                  options={cityData}
                  value={cityValue}
                  onChange={(e) =>
                    handleFilterInputsChangeEvent("city_name", e)
                  }
                  defaultValue={cityValue}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="act-links mt-2 text-center">
                <a
                  onClick={() => {
                    handleSort();
                    setShowModal(false);
                  }}
                  className="btn btn-primary btn-sm waves-effect waves-light mr-3"
                >
                  Search
                </a>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Verification;
