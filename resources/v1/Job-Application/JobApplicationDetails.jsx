import React, { useEffect, useState } from "react";
import VerificationDetails from "../Verification/VerificationDetails";
import { Link } from "react-router-dom";
import BreadCrumb from "../Common/BreadCrumb";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import TableHeader from "../Common/TableHeader";
import { statusVerification } from "../Verification/Status";
import ReactTooltip from "react-tooltip";
import TableNoDataFound from "../Common/TableNoDataFound";
import moment from "moment";

const centerAlign = {
  display: "flex",
  justifyContent: "center",
};

const endAlign = {
  display: "flex",
  justifyContent: "end",
};

const HeaderText = ({ text, style }) => {
  return (
    <h1
      style={{
        fontSize: "18px",
        fontWeight: 500,
        ...style,
      }}
    >
      {text}
    </h1>
  );
};

let token = localStorage.getItem("app-ll-token");

const JobApplicationDetails = (props) => {
  console.log("props -> " + props?.location?.state);

  const [jobDetails, setJobDetails] = useState({});
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    var axios = require("axios");

    var config = {
      method: "get",
      url:
        "https://testdashboard.lightninglogistics.in/hrms/api/v1/get-jobs-by-lead-id/" +
        props?.location?.state,
      headers: {
        Authorization: "llBearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        var data = response.data;
        console.log("data -> ", data["data"]);
        setJobDetails(data["data"][0]);
        console.log("jobDetails -> ", jobDetails);

        var cityId = data["data"][0]["llbPreferredCity"];

        console.log("cityId -> ", cityId);

        if (cityId != null) {
          var cityConfig = {
            method: "get",
            url:
              "https://testdashboard.lightninglogistics.in/hrms/api/v1//getCityById/" +
              cityId,
            headers: {
              Authorization: "llBearer " + token,
            },
          };

          axios(cityConfig)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
              var data = response.data["data"];
              if (data != null) {
                console.log("data?.cityName -> " + data?.cityName);
                setCityName(data?.cityName ?? "");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const breadCrumbs = [
    { name: "HRMS", url: "/app/job-app", class: "breadcrumb-item" },
    { name: "Job Application", url: "/app/job-app", class: "breadcrumb-item" },
    {
      name: "Job Application Details",
      url: "#",
      class: "breadcrumb-item active",
    },
  ];

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
              <div className="col-sm-6">
                <h4 className="page-title mt-1 width-auto">
                  Job Application Details
                </h4>
              </div>
              <div className="col-md-6  text-right">
                <Link
                  to={"/app/task-app"}
                  className="btn btn-primary btn-sm waves-effect waves-light"
                >
                  <i className="fa fa-angle-left"> </i> Back
                </Link>
              </div>
            </div>
            <BreadCrumb breadCrumbs={breadCrumbs} />
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card m-b-30">
                <div className="card-body">
                  <HeaderText text="Job Details" />
                  <Container
                    style={{
                      margin: 0,
                      padding: 0,
                      maxWidth: "100%",
                      width: "100%",
                    }}
                  >
                    <Row>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Job Application Id</span>
                            <h5>{jobDetails?.id ? jobDetails?.id : " - "}</h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Lead Id</span>
                            <h5>
                              {jobDetails?.llempLeadId
                                ? jobDetails?.llempLeadId
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Mobile No</span>
                            <h5>
                              {jobDetails?.leadData?.llempContactNumber
                                ? jobDetails?.leadData?.llempContactNumber
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="padding-top">
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Name</span>
                            <h5>
                              {jobDetails?.leadData?.llempFirstname
                                ? jobDetails?.leadData?.llempFirstname
                                : "" + jobDetails?.leadData?.llempLastname
                                ? jobDetails?.leadData?.llempLastname
                                : ""}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Status</span>
                            <h5>
                              {jobDetails?.applicationStatus
                                ? userStatusMap[jobDetails?.applicationStatus]
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Applied Date</span>
                            <h5>
                              {jobDetails?.appliedOn
                                ? moment(jobDetails?.appliedOn).format(
                                    "DD-MM-YYYY, h:mm:ss a"
                                  )
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="padding-top">
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Preferred City</span>
                            <h5>{cityName != "" ? cityName : " - "}</h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Job Opening</span>
                            <h5>
                              {jobDetails?.jobs?.llbTitle
                                ? jobDetails?.jobs?.llbTitle
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Vehicle Preference</span>
                            <h5>
                              {jobDetails?.llbHasOwnVehicle
                                ? "Own Vehicle"
                                : "Company Vehicle"}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/*<Row className="padding-top">
                                            <Col>
                                                 Lead Id
                                                <div className="d-flex  align-items-center assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Lead Id</span>
                                                        <h5>
                                                            {profileDetails.id
                                                                ? profileDetails.id
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Employee Id
                                                <div className="d-flex align-items-center assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Employee Id</span>
                                                        <h5>
                                                            {profileDetails.llempCode
                                                                ? profileDetails.llempCode
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Rider Name
                                                <div className="d-flex assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Rider Name</span>
                                                        <h5>
                                                            {profileDetails.llempFirstname
                                                                ? profileDetails.llempFirstname
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="padding-top">
                                            <Col>
                                                 Rider Number
                                                <div className="d-flex align-items-center assigned-details ">
                                                    <div className="assined-name pl-2">
                                                        <span>Rider Number</span>
                                                        <h5>
                                                            {profileDetails.llempContactNumber
                                                                ? profileDetails.llempContactNumber
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Rider City
                                                <div
                                                    className="d-flex assigned-details"
                                                    style={{
                                                        marginRight: "1rem",
                                                    }}
                                                >
                                                    <div className="assined-name pl-2">
                                                        <span>Rider City</span>
                                                        <h5>
                                                            {profileDetails.llempCity
                                                                ? profileDetails.llempCity
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Rider Hub
                                                <div
                                                    className="d-flex align-items-center assigned-details"
                                                    style={{
                                                        marginRight: "1rem",
                                                    }}
                                                >
                                                    <div className="assined-name pl-2">
                                                        <span>Rider Hub</span>
                                                        <h5>
                                                            {profileDetails.llHubName
                                                                ? profileDetails.llHubName
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="padding-top">
                                            <Col>
                                                 Rider Status
                                                <div className="d-flex align-items-center assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Rider Status</span>
                                                        <h5>
                                                            {profileDetails.riderStatusDetails
                                                                ?.description
                                                                ? profileDetails.riderStatusDetails
                                                                    ?.description
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Employee Id
                                                <div
                                                    className="d-flex align-items-center assigned-details"
                                                    style={{
                                                        marginRight: "1rem",
                                                    }}
                                                >
                                                    <div className="assined-name pl-2">
                                                        <span>Permanent Address</span>
                                                        <h5>
                                                            {profileDetails.permanentAddress
                                                                ? profileDetails.permanentAddress
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Rider Name
                                                <div className="d-flex assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Residential Address</span>
                                                        <h5>
                                                            {profileDetails.llempResidenceAddress
                                                                ? profileDetails.llempResidenceAddress
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="padding-top">
                                            <Col>
                                                 Rider Status
                                                <div className="d-flex align-items-center assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Alternate Number</span>
                                                        <h5>
                                                            {profileDetails.llempContactNumber_2
                                                                ? profileDetails.llempContactNumber_2
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Employee Id
                                                <div
                                                    className="d-flex align-items-center assigned-details"
                                                    style={{
                                                        marginRight: "1rem",
                                                    }}
                                                >
                                                    <div className="assined-name pl-2">
                                                        <span>Email</span>
                                                        <h5>
                                                            {profileDetails.llempPersonalEmail
                                                                ? profileDetails.llempPersonalEmail
                                                                : " - "}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col>
                                                 Rider Name
                                                <div className="d-flex assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Permanent Address Proof Type</span>
                                                        <h5>
                                                            {profileDetails?.permanentAddressProof
                                                                ? identificationEnums[profileDetails?.permanentAddressProof]
                                                                : "-"}
                                                            <span>
                                <div
                                    className="act-links btn btn-warning btn-sm"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title=""
                                    data-original-title="View"
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                    onClick={async () => {
                                        setModalResponse(proofType);
                                        await loadImage(
                                            proofType?.picFront,
                                            proofType?.picBack
                                        );
                                        setModalType("view");
                                        setShow(true);
                                    }}
                                >
                                  <i className="fa fa-eye"> </i>
                                </div>
                              </span>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>

                                        </Row>
                                        <Row className="padding-top">
                                            <Col>
                                                 Rider Name
                                                <div className="d-flex assigned-details">
                                                    <div className="assined-name pl-2">
                                                        <span>Residential Address Proof Type</span>
                                                        <h5>
                                                            {profileDetails?.llempResidentAddressProofType
                                                                ? identificationEnums[profileDetails?.llempResidentAddressProofType]
                                                                : "-"}
                                                            <span>
                                                    <div
                                                        className="act-links btn btn-warning btn-sm"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title=""
                                                        data-original-title="View"
                                                        style={{
                                                            marginLeft: "10px",
                                                        }}
                                                        onClick={async () => {
                                                            setModalResponse(proofType);
                                                            await loadImage(
                                                                proofType?.picFront,
                                                                proofType?.picBack
                                                            );
                                                            setModalType("view");
                                                            setShow(true);
                                                        }}
                                                    >
                                                      <i className="fa fa-eye"> </i>
                                                    </div>
                                                  </span>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>*/}
                  </Container>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card m-b-30">
                <div className="card-body">
                  <HeaderText text="Vehical Details" />
                  <Container
                    style={{
                      margin: 0,
                      padding: 0,
                      maxWidth: "100%",
                      width: "100%",
                    }}
                  >
                    <Row>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Vehicle Type</span>
                            <h5>{jobDetails?.id ? jobDetails?.id : " - "}</h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>EV or Not EV</span>
                            <h5>
                              {jobDetails?.llempLeadId
                                ? jobDetails?.llempLeadId
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Vehicle No</span>
                            <h5>
                              {jobDetails?.leadData?.llempContactNumber
                                ? jobDetails?.leadData?.llempContactNumber
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="padding-top">
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>RC Document</span>
                            <h5>
                              {jobDetails?.leadData?.llempFirstname
                                ? jobDetails?.leadData?.llempFirstname
                                : "" + jobDetails?.leadData?.llempLastname
                                ? jobDetails?.leadData?.llempLastname
                                : ""}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default JobApplicationDetails;
