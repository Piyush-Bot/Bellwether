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
import { HRMS_BASE_URL } from "../Auth/Context/AppConstant";
import axios from "axios";

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
  const [jobDetails, setJobDetails] = useState({});
  const [cityName, setCityName] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [show, setShow] = useState(false);
  const [modalResponse, setModalResponse] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    var axios = require("axios");

    var vehicleConfig = {
      method: "get",
      url: `${HRMS_BASE_URL}/find-rc-details-by-lead-id/`,
      headers: {
        Authorization: `llBearer ${token}`,
      },
    };

    var rcImageConfig = {
      method: "get",
      url: `${HRMS_BASE_URL}/file-upload/get-file-url/`,
      headers: {
        Authorization: `llBearer ${token}`,
      },
    };

    var config = {
      method: "get",
      url:
        "https://testdashboard.lightninglogistics.in/hrms/api/v1/get-jobs-by-lead-id/" +
        props?.location?.state,
      headers: {
        Authorization: "llBearer " + token,
      },
    };

    var dummyConfig = {
      headers: {
        Authorization: "llBearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        var data = response.data;
        setJobDetails(data["data"][0]);
        var cityId = data["data"][0]["llbPreferredCity"];
        vehicleConfig.url += data["data"][0].leadData.id;
        return axios(vehicleConfig);
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
              var data = response.data["data"];
              if (data != null) {
                setCityName(data?.cityName ?? "");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .then((res) => {
        setVehicleDetails(res.data.data);
        console.log("hellllllooo", res.data.data);
        // const isFrontImgExist = !!res.data.data.llbRcCopyFront;
        // const isBackImgExist = !!res.data.data.llbRcCopyBack;
        // const vehicleDetailsCopy = {
        //   ...vehicleDetails,
        //   isFrontImgExist,
        //   isBackImgExist,
        // };
        // setVehicleDetails(vehicleDetailsCopy);

        const frontUrl = `${rcImageConfig.url}${res.data.data?.llbRcCopyFront}`;
        const backUrl = `${rcImageConfig.url}${res.data.data?.llbRcCopyBack}`;
        const url = [frontUrl, backUrl];

        return axios.all(
          url.map((endpoint) => axios.get(endpoint, dummyConfig))
        );
      })
      .then((data) => console.log("ppppp", data))
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleClose = () => setShow(false);

  const loadImage = async (front, back) => {
    console.log(errorMessage);
    setFrontImage("");
    setBackImage("");
    setIsLoaded(true);
    if (front && front.length > 0)
      axios
        .get(`${HRMS_BASE_URL}/file-upload/get-file-url/${front}`, {
          headers: {
            Authorization: `llBearer ${token}`,
          },
        })
        .then((resp) => {
          console.log("front-----hit", resp?.data?.data);
          setFrontImage(resp?.data?.data?.file_path);
          setIsLoaded(false);
        })
        .catch((err) => {
          console.log("front err");
          setIsLoaded(false);
          setErrorMessage("Something went to wrong");
        });

    if (back && back.length > 0)
      axios
        .get(`${HRMS_BASE_URL}/file-upload/get-file-url/${back}`, {
          headers: {
            Authorization: `llBearer ${token}`,
          },
        })
        .then((resp) => {
          console.log("back-----hit", resp?.data?.data);
          setBackImage(resp?.data?.data?.file_path);
          setIsLoaded(false);
        })
        .catch((err) => {
          setIsLoaded(false);
          console.log("back err");
          setErrorMessage("Something went to wrong");
        });
  };

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
                  to={"/app/job-app/"}
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
                                : ""}{" "}
                              {jobDetails?.leadData?.llempLastname
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
                            <h5>
                              {jobDetails?.jobs?.cities?.[0]?.city?.cityName
                                ? jobDetails?.jobs?.cities?.[0]?.city?.cityName
                                : " - "}
                            </h5>

                            {/* <h5>{cityName != "" ? cityName : " - "}</h5> */}
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
                            <h5>
                              {vehicleDetails?.llbVehicleType
                                ? vehicleDetails?.llbVehicleType
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>EV or Not EV</span>
                            <h5>
                              {vehicleDetails?.llbHasEvVehicle === true
                                ? "EV"
                                : " Not EV "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name ">
                            <span>Vehicle No</span>
                            <h5>
                              {vehicleDetails?.llbRegistrationNumber
                                ? vehicleDetails?.llbRegistrationNumber
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
                              {vehicleDetails?.llbHasEvVehicle
                                ? vehicleDetails?.llbHasEvVehicle
                                : " - "}
                            </h5>
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
                                  setModalResponse(vehicleDetails);
                                  await loadImage(
                                    vehicleDetails?.llbRcCopyFront,
                                    vehicleDetails?.llbRcCopyBack
                                  );
                                  setModalType("view");
                                  setShow(true);
                                }}
                              >
                                <i className="fa fa-eye"> </i>
                              </div>
                            </span>
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
      {show && (
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header>
            <Modal.Title>{modalResponse?.type}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessage ? (
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                }}
              >
                Can't able to load the data
              </h1>
            ) : (
              <>
                {modalType === "view" ? (
                  <Container>
                    <Row>
                      <Col>
                        {frontImage.split(".").pop().toLowerCase() == "pdf" ? (
                          <embed
                            src={frontImage}
                            height="350px"
                            width="350px"
                          />
                        ) : (
                          <img
                            src={frontImage}
                            style={{
                              height: "350px",
                              width: "350px",
                            }}
                          />
                        )}
                      </Col>
                      <Col>
                        {backImage.split(".").pop().toLowerCase() == "pdf" ? (
                          <embed src={backImage} height="350px" width="350px" />
                        ) : (
                          <img
                            src={backImage}
                            style={{
                              height: "350px",
                              width: "350px",
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Container>
                ) : (
                  <>{renderSwitch(modalResponse)}</>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            {modalType === "verify" && (
              <div>
                <Button
                  variant="success"
                  disabled={isEnableButtons == false}
                  onClick={async () => {
                    verifyDocuments(
                      346,
                      profileDetails.id,
                      selectedIdentificationId
                    );
                    handleClose();
                  }}
                >
                  Approve
                </Button>

                <Button
                  variant="danger"
                  // onClick={handleClose}
                  onClick={async () => {
                    verifyDocuments(
                      347,
                      profileDetails.id,
                      selectedIdentificationId
                    );
                    handleClose();
                  }}
                  disabled={isEnableButtons == false}
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default JobApplicationDetails;
