import React, {useEffect, useState} from "react";
import moment from "moment";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import {Typeahead} from "react-bootstrap-typeahead";
import {Modal, Spinner, Alert} from "react-bootstrap";
import Select from "react-select";

import {HRMS_BASE_URL} from "../Auth/Context/AppConstant";
import Title from "../Common/Title";
import {statusVerification} from "./Status";
import BreadCrumb from "../Common/BreadCrumb";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import {PaginationCount} from "../Common/PaginationCount";
import Pagination from "react-js-pagination";
import ReactTooltip from "react-tooltip";

const DOCS_CODE = {
    aadhar: 341,
    panCard: 343,
    drivingLicense: 342,
    bank: 268,
};

const textWrap = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    minWidth: "160px",
    maxWidth: "160px",
};

let token = localStorage.getItem("app-ll-token");

const JobApplication = () => {
    const history = useHistory();

    const [jobDetails, setJobDetails] = useState([]);
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

    const [leadIdValue, setLeadIdValue] = useState("");
    const [riderValue, setRiderValue] = useState("");
    const [riderStatusValue, setRiderStatusValue] = useState("");

    const breadCrumbs = [
        {name: "HRMS", url: "/app/job-app", class: "breadcrumb-item"},
        {name: "Job Application", url: "#", class: "breadcrumb-item active"},
    ];

    // pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = React.useState(1);

    const tableHead = [
        {label: "Id", scope: "col"},
        {label: "Mobile Number", scope: "col"},
        {label: "Name", scope: "col"},
        {label: "Lead Id", scope: "col"},
        {label: "Status", scope: "col"},
        {label: "Applied Date & Time", scope: "col"},
        {label: "Prefered City", scope: "col"},
        {label: "Job Opening", scope: "col"},
        {label: "Vehicle Preference", scope: "col"},
        {label: "Action", scope: "col"},
    ];

    useEffect(() => {
        setIsLoaded(true);
        axios
            .get(`${HRMS_BASE_URL}/get-all-applied-jobs`, {
                headers: {
                    Authorization: `llBearer ${token}`,
                },
            })
            .then((resp) => {
                if (resp?.data?.data?.length != 0) {
                    setIsLoaded(false);
                    setJobDetails(resp?.data?.data?.content);
                    setSearchResult(resp?.data?.data?.content);
                } else {
                    setErrorMessage("Data not found");
                }
            })
            .catch((err) => {
                setIsLoaded(false);
                setErrorMessage("Something went to wrong!");
            });
    }, []);

    function handleSort() {
        let tempData = searchResult.slice();

        console.log(tempData);
        tempData = tempData.filter((data) => {
            return (
                data?.id == leadIdValue ||
                data?.llempFirstname == riderValue ||
                data?.riderStatusDetails?.description == riderStatusValue
            );
        });
        // setEmployeeDetails(tempData);
    }

    function resetHandler() {
        let tempData = searchResult.slice();
        // setEmployeeDetails(tempData);
    }

    const CloseButton = (props) => {
        const {closeModal} = props;
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

    function searchHandler(e) {
        console.log(e, "sdsssssss");

        let tempData = searchResult.slice();
        if (e) {
            tempData = tempData.filter((data) =>
                data?.leadData?.llempFirstname.toLowerCase().includes(e?.toLowerCase())
            );
        }
        console.log(tempData);
        setJobDetails(tempData);
    }

    const handleFilterInputsChangeEvent = (key, value) => {
        if (key == "lead_id") {
            setLeadIdValue(value);
        } else if (key == "rider_name") {
            setRiderValue(value);
        } else if (key == "rider_status") {
            console.log(value);
            setRiderStatusValue(value);
        }
    };

    function handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        setPaginationValues({
            activePage: pageNumber,
        });
    }

    const userStatusMap = {
        270: "Not Interested",
        271: "Shortlisted by Micelio",
        272: "Rejected by Micelio",
        273: "Rejected Micelio-Location Mismatch",
        278: "Shortlisted Micelio-On Hold",
        279: "Selected by Client",
        280: "Shortlisted Client-On Hold",
        281: "Rejected by Client",
        282: "Shortlisted Client-Not Reported On Date",
        283: "Shortlisted Micelio-Not Reported Client Interview",
        275: "Active",
        276: "InActive",
        750: "Other Operations Issues",
        751: "Salary Processing",
        752: "Personal Reasons",
        753: "Other Reasons",
        285: "Active",
        286: "Undertraining",
        287: "Terminated",
        288: "Resigned",
        289: "Absconded",
        290: "Drop-outs",
        291: "Willing to join",
        292: "Duplicate",
    };

    return (
        <React.Fragment>
            <div className="content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <div className="row align-items-center">
                            <Title title={"Job Application"}/>
                        </div>
                        <BreadCrumb breadCrumbs={breadCrumbs}/>
                    </div>

                    <div className="tab-content">
                        <div className="tab-pane p-3 active" id="all" role="tabpanel">
                            <div className="row align-items-center mb-4 px-3">
                                <div className="col-sm-4">
                                    <div className="search-input">
                                        <Typeahead
                                            id="basic-typeahead-single"
                                            // labelKey="llempFirstname"
                                            labelKey={(option) =>
                                                `${option?.llempLeadId} - ${option?.leadData?.llempFirstname} - ${option?.leadData?.llempContactNumber}`
                                            }
                                            options={jobDetails}
                                            onChange={(e) => {
                                                setSearchText(`${e?.[0]?.leadData?.llempFirstname}`);
                                                searchHandler(e?.[0]?.leadData?.llempFirstname);
                                                console.log(e);
                                            }}
                                            placeholder="Search by id-name-mobile"
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
                                            <TableHeader data={tableHead}/>
                                            <tbody>
                                            {jobDetails &&
                                                jobDetails?.length > 0 &&
                                                jobDetails
                                                    ?.slice(
                                                        (page - 1) * itemsPerPage,
                                                        page * itemsPerPage
                                                    )
                                                    .map((job, i) => {
                                                        return (
                                                            <React.Fragment key={i}>
                                                                <tr>
                                                                    <td>{job?.id ? job?.id : "-"}</td>
                                                                    <td>
                                                                        {job?.leadData?.llempContactNumber
                                                                            ? job?.leadData?.llempContactNumber
                                                                            : "-"}
                                                                    </td>
                                                                    <td>
                                                                        {job?.leadData?.llempFirstname
                                                                            ? `${job?.leadData?.llempFirstname} ${job?.leadData?.llempLastname}`
                                                                            : "-"}
                                                                    </td>
                                                                    <td>
                                                                        {job?.llempLeadId
                                                                            ? job?.llempLeadId
                                                                            : "-"}
                                                                    </td>
                                                                    <td>
                                                                        {/*{job?.jobs?.status &&
                                                                        job?.jobs?.status == 275
                                                                            ? "Approved"
                                                                            : "Rejected"}*/}
                                                                        {job?.applicationStatus ? userStatusMap[job?.applicationStatus] : "-"}
                                                                    </td>
                                                                    <td>
                                                                        {job?.appliedOn
                                                                            ? moment(job?.appliedOn).format(
                                                                                "DD-MM-YYYY, h:mm:ss a"
                                                                            )
                                                                            : "-"}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {job?.llbPreferredCity
                                                                            ? job?.llbPreferredCity
                                                                            : "-"}
                                                                    </td>

                                                                    <td className="text-center">
                                                                        {job?.jobs?.llbTitle
                                                                            ? job?.jobs?.llbTitle
                                                                            : "-"}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {job?.llbHasOwnVehicle
                                                                            ? "Own Vehicle"
                                                                            : "Company Vehicle"}
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            className="act-links btn btn-warning btn-sm "
                                                                            data-toggle="tooltip"
                                                                            data-placement="top"
                                                                            title=""
                                                                            data-tip="View"
                                                                            data-original-title="View"
                                                                            onClick={() => {
                                                                                var id = job?.llempLeadId;
                                                                                history.push(
                                                                                    "/app/job-app/job-details",
                                                                                    id,
                                                                                )
                                                                            }

                                                                            }
                                                                        >
                                                                            <i className="fa fa-eye"/>
                                                                        </div>
                                                                        <ReactTooltip place="top" type="dark"/>
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                            {isLoaded == false && erroMessage.length != 0 && (
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
                                            totalRecords={jobDetails?.length}
                                        />
                                    </div>
                                    <div className="float-right mt-2 pr-3">
                                        <div className="Page navigation example">
                                            <Pagination
                                                activePage={page}
                                                totalItemsCount={jobDetails?.length}
                                                itemsCountPerPage={Math.ceil(
                                                    jobDetails?.length % itemsPerPage === 0
                                                        ? jobDetails?.length / itemsPerPage
                                                        : jobDetails?.length / itemsPerPage
                                                )}
                                                pageRangeDisplayed={
                                                    jobDetails?.length / itemsPerPage > 1
                                                        ? jobDetails?.length / itemsPerPage
                                                        : 1
                                                }
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
                        <CloseButton closeModal={setShowModal}/>

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
                                    onChange={(e) =>
                                        handleFilterInputsChangeEvent("lead_id", e?.value)
                                    }
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
                                    onChange={(e) =>
                                        handleFilterInputsChangeEvent("rider_name", e?.value)
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
                                    onChange={(e) =>
                                        handleFilterInputsChangeEvent("rider_status", e?.value)
                                    }
                                    defaultValue={riderStatusValue}
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

export default JobApplication;
