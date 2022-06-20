import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CloseButton,
  Modal,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import ReactTooltip from "react-tooltip";

import { HRMS_BASE_URL } from "../Auth/Context/AppConstant";
import BreadCrumb from "../Common/BreadCrumb";
import TableHeader from "../Common/TableHeader";
import TableNoDataFound from "../Common/TableNoDataFound";
import { statusVerification } from "./Status";
import { Aadhar, Bank, License, Pancard, EmptyData } from "./";

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

function verifyDocuments(status, leadId, identificationId) {
  console.log("status", status, leadId, identificationId);
  try {
    axios
      .put(
        `${HRMS_BASE_URL}/update-status`,
        {
          llempLeadId: leadId,
          identificationTypeId: identificationId,
          picFrontStatus: status,
          picBackStatus: status,
        },
        {
          headers: {
            Authorization: `llBearer ${token}`,
          },
        }
      )
      .then((resp) => {
        console.log(resp, "resps");
        //   setOtpVerify(true);
        //   setAdharResp(resp?.data?.data);
        //   setIsEnableButtons(true);
      })
      .catch((err) => {
        // setIsVerify("e");
        //   setOtpVerify(false);
        //   setIsEnableButtons(true);
      });
  } catch (error) {
    //   setErrorMessage(true);
  }
}

let token = localStorage.getItem("app-ll-token");

const VerificationDetails = (props) => {
  console.log(props, "propsss");
  const [show, setShow] = useState(false);
  const [modalResponse, setModalResponse] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [proofType, setProofType] = useState({});
  const [isEnableButtons, setIsEnableButtons] = useState(false);
  const [selectedIdentificationId, setSelectedIdentificationId] = useState(0);
  const [profileDetails, setProfileDetails] = useState({});
  const [userImage, setUserImage] = useState("");

  const setIsEnableButton = (value) => {
    setIsEnableButtons(value);
  };

  const setSelectedIdentificationRecord = (value) => {
    setSelectedIdentificationId(value);
  };
  const identificationEnums = {
    341: "Aadhaar",
    342: "Driving License",
    343: "Pan",
    268: "Bank",
    10038: "Nominee Aadhaar",
  };

  const breadCrumbs = [
    { name: "Document Verification", url: "#", class: "breadcrumb-item" },
    { name: "Verification Details", url: "#", class: "breadcrumb-item active" },
  ];

  const [relationsEnums, setRelationEnums] = useState({});

  const tableHead = [
    { label: "S.No", scope: "col", class: "text-center" },
    { label: "Proof Type", scope: "col", class: "text-center" },
    { label: "Number", scope: "col", class: "text-center" },
    { label: "Validity", scope: "col", class: "text-center" },
    { label: "Status", scope: "col", class: "text-center" },
    { label: "Actions", scope: "col", class: "text-right" },
    { label: "", scope: "col", class: "text-right" },
  ];

  //added extra col. for licence
  function getValidity(time) {
    return new Date(time).getTime() - new Date().getTime() > 0
      ? time
      : "Invalid";
  }

  useEffect(() => {
    let data = props?.location?.state?.llEmpIdentificationList?.find((e) => {
      return (
        props?.location?.state?.llempResidentAddressProofType ==
        e?.identificationTypeId
      );
    });
    setProofType(data);

    var axios = require("axios");

    var enumsConfig = {
      method: "get",
      url: "https://testdashboard.lightninglogistics.in/hrms/api/v1/modules?moduleCode=MC16",
      headers: {
        Authorization: "llBearer " + token,
      },
    };

    // get-enums
    axios(enumsConfig)
      .then(function (response) {
        console.log(response.data);
        var data = response.data;
        var modules = data["data"][0]["modules"];
        var enums = {};
        modules.map((module) => {
          console.log(module.id);
          enums[module.id] = module.description;
        });
        console.log(enums);
        setRelationEnums(enums);
      })
      .catch(function (error) {
        console.log(error);
      });

    // get-profiles
    var profileConfig = {
      method: "get",
      url:
        "https://testdashboard.lightninglogistics.in/hrms/api/v1/get-profiles/" +
        props?.location?.state?.id,
      headers: {
        Authorization: "llBearer " + token,
      },
    };

    var profileImage = {
      method: "get",
      url: `${HRMS_BASE_URL}/file-upload/get-file-url/`,
      headers: {
        Authorization: `llBearer ${token}`,
      },
    };

    axios(profileConfig)
      .then(function (response) {
        //   console.log(JSON.stringify(response.data));
        profileImage.url += response.data.data?.llempProfileImage;
        var data = response.data;
        console.log("profile data -> " + data["data"]);
        setProfileDetails(data["data"]);
        return axios(profileImage);
      })
      .then((resp) => {
        setUserImage(resp.data.data.file_path);
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log("identificationEnums" + identificationEnums);
  }, []);

  const handleClose = () => setShow(false);

  const loadImage = async (front, back) => {
    console.log(front, back);
    console.log(errorMessage);
    setFrontImage("");
    setBackImage("");
    setIsLoaded(true);
    if (front && front != "")
      axios
        .get(`${HRMS_BASE_URL}/file-upload/get-file-url/${front}`, {
          headers: {
            Authorization: `llBearer ${token}`,
          },
        })
        .then((resp) => {
          console.log("front");
          setFrontImage(resp?.data?.data?.file_path);
          setIsLoaded(false);
        })
        .catch((err) => {
          console.log("front err");
          setIsLoaded(false);
          setErrorMessage("Something went to wrong");
        });
    if (back & (back != ""))
      axios
        .get(`${HRMS_BASE_URL}/file-upload/get-file-url/${back}`, {
          headers: {
            Authorization: `llBearer ${token}`,
          },
        })
        .then((resp) => {
          console.log("back");
          setBackImage(resp?.data?.data?.file_path);
          setIsLoaded(false);
        })
        .catch((err) => {
          setIsLoaded(false);
          console.log("back err");
          setErrorMessage("Something went to wrong");
        });
  };

  function renderSwitch(param) {
    switch (param?.identificationTypeDetails?.id) {
      case 341:
        return (
          <Aadhar
            employeeData={param}
            personalDetail={profileDetails}
            setIsEnableButtons={setIsEnableButton}
            setSelectedIdentificationRecord={setSelectedIdentificationRecord}
          />
        );
      case 343:
        return (
          <Pancard
            employeeData={param}
            personalDetail={profileDetails}
            setIsEnableButtons={setIsEnableButton}
            setSelectedIdentificationRecord={setSelectedIdentificationRecord}
          />
        );
      case 342:
        return (
          <License
            employeeData={param}
            personalDetail={profileDetails}
            setIsEnableButtons={setIsEnableButton}
            setSelectedIdentificationRecord={setSelectedIdentificationRecord}
          />
        );
      case 268:
        return (
          <Bank
            employeeData={param}
            personalDetail={profileDetails}
            setIsEnableButtons={setIsEnableButton}
            setSelectedIdentificationRecord={setSelectedIdentificationRecord}
          />
        );
      default:
        return <EmptyData />;
    }
  }

  return (
    <React.Fragment>
      <div className="content">
        <div className="container-fluid">
          <div className="page-title-box">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <h4 className="page-title mt-1 width-auto">
                  Verification Details
                </h4>
              </div>
              <div className="col-md-6  text-right">
                <Link
                  to={"/app/verification-app"}
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
                  <HeaderText text="Basic Details" />
                  <Container
                    style={{
                      margin: 0,
                      padding: 0,
                      maxWidth: "100%",
                      width: "100%",
                    }}
                  >
                    <Row className="assined-name pl-2">
                      <img
                        style={{
                          marginLeft: "12px",
                          height: "60px",
                          width: "60px",
                          borderRadius: "50%",
                        }}
                        src={userImage}
                      />
                    </Row>
                    <Row className="padding-top">
                      <Col>
                        {/* Lead Id */}
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name pl-2">
                            <span>Lead Id</span>
                            <h5>
                              {profileDetails.id ? profileDetails.id : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        {/* Employee Id */}
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
                        {/* Rider Name */}
                        <div className="d-flex assigned-details">
                          <div className="assined-name pl-2">
                            <span>Name</span>
                            <h5>
                              {profileDetails?.llempFirstname
                                ? profileDetails?.llempFirstname
                                : "-"}
                              {"  "}
                              {profileDetails?.llempLastname
                                ? profileDetails?.llempLastname
                                : ""}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="padding-top">
                      <Col>
                        {/* Rider Number */}
                        <div className="d-flex align-items-center assigned-details ">
                          <div className="assined-name pl-2">
                            <span>Number</span>
                            <h5>
                              {profileDetails.llempContactNumber
                                ? profileDetails.llempContactNumber
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        {/* Rider City */}
                        <div
                          className="d-flex assigned-details"
                          style={{
                            marginRight: "1rem",
                          }}
                        >
                          <div className="assined-name pl-2">
                            <span>City</span>
                            <h5>
                              {profileDetails.llempCity
                                ? profileDetails.llempCity
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        {/* Rider Hub */}
                        <div
                          className="d-flex align-items-center assigned-details"
                          style={{
                            marginRight: "1rem",
                          }}
                        >
                          <div className="assined-name pl-2">
                            <span>Hub</span>
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
                        {/* Rider Status */}
                        <div className="d-flex align-items-center assigned-details">
                          <div className="assined-name pl-2">
                            <span>Status</span>
                            <h5>
                              {profileDetails.riderStatusDetails?.description
                                ? profileDetails.riderStatusDetails?.description
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        {/* Rider Status */}
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
                        {/* Employee Id */}
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
                    </Row>
                    <Row className="padding-top">
                      <Col className="col-sm-8 col-md-8">
                        {/* Permanent Address */}
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

                      <Col className="col-sm-4 col-md-4">
                        {/* Permanent Address Proof Type */}
                        <div className="d-flex assigned-details">
                          <div className="assined-name pl-2">
                            <span>Permanent Address Proof Type</span>
                            <h5>
                              {profileDetails?.permanentAddressProof
                                ? identificationEnums[
                                    profileDetails?.permanentAddressProof
                                  ]
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
                      <Col className="col-sm-8 col-md-8">
                        {/* Residential Address */}
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
                      <Col className="col-sm-4 col-md-4">
                        {/* Residential Address Proof Type */}
                        <div className="d-flex assigned-details">
                          <div className="assined-name pl-2">
                            <span>Residential Address Proof Type</span>
                            <h5>
                              {profileDetails?.llempResidentAddressProofType
                                ? identificationEnums[
                                    profileDetails
                                      ?.llempResidentAddressProofType
                                  ]
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
                  </Container>
                  <HeaderText
                    text="Nominee Details"
                    style={{
                      marginTop: "2rem",
                    }}
                  />
                  <Container
                    style={{
                      margin: 0,
                      padding: 0,
                      maxWidth: "100%",
                      width: "100%",
                    }}
                  >
                    <Row className="padding-top">
                      <Col>
                        {/* Nominee Name */}
                        <div className="d-flex  align-items-center assigned-details">
                          <div className="assined-name pl-2">
                            <span>Nominee Name</span>
                            <h5>
                              {profileDetails.nomineeName
                                ? profileDetails.nomineeName
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        {/* Employee Id */}
                        <div className="d-flex align-items-center assigned-details">
                          <div className="assined-name pl-2">
                            <span>Nominee Phone Number</span>
                            <h5>
                              {profileDetails.nomineePhoneNumber
                                ? profileDetails.nomineePhoneNumber
                                : " - "}
                            </h5>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        {/* Rider Name */}
                        <div className="d-flex assigned-details">
                          <div className="assined-name pl-2">
                            <span>Relationship Type</span>
                            <h5>
                              {profileDetails.nomineeRelation
                                ? relationsEnums[profileDetails.nomineeRelation]
                                : " - "}
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

          {/* Verification Table */}
          <div className="row">
            <div className="col-md-12">
              <div className="card m-b-30">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <TableHeader data={tableHead} />
                      <tbody>
                        {profileDetails.llEmpIdentificationList?.length > 0 ? (
                          <>
                            {profileDetails.llEmpIdentificationList?.map(
                              (data, i) => (
                                <tr key={i}>
                                  <th className="text-center">{i + 1}</th>
                                  <td className="text-center">
                                    {data?.identificationTypeDetails
                                      ?.description
                                      ? data?.identificationTypeDetails
                                          ?.description
                                      : "-"}
                                  </td>
                                  <td className="text-center">
                                    {data?.uniqueNo ? data?.uniqueNo : "-"}
                                  </td>
                                  <td className="text-center">
                                    {data?.identificationTypeDetails
                                      ?.description !== "Driving License"
                                      ? "-"
                                      : getValidity(data?.validity)}
                                  </td>
                                  <td className="text-center">
                                    {data ? statusVerification(data) : "-"}
                                  </td>
                                  <td className="text-right">
                                    <div>
                                      <div
                                        className="act-links btn btn-warning btn-sm "
                                        data-toggle="tooltip"
                                        data-tip="Approve"
                                        data-placement="top"
                                        title=""
                                        data-original-title="View"
                                        onClick={async () => {
                                          setModalResponse(data);
                                          await loadImage(
                                            data?.picFront,
                                            data?.picBack
                                          );
                                          setModalType("verify");
                                          setShow(true);
                                        }}
                                      >
                                        <i className="fa fa-check"> </i>
                                      </div>
                                      <div
                                        className="act-links btn btn-warning btn-sm"
                                        data-toggle="tooltip"
                                        data-tip="View"
                                        data-placement="top"
                                        title=""
                                        data-original-title="View"
                                        style={{
                                          marginLeft: "10px",
                                        }}
                                        onClick={async () => {
                                          setModalResponse(data);
                                          await loadImage(
                                            data?.picFront,
                                            data?.picBack
                                          );
                                          setModalType("view");
                                          setShow(true);
                                        }}
                                      >
                                        <i className="fa fa-eye"> </i>
                                        <ReactTooltip place="top" type="dark" />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </>
                        ) : (
                          <TableNoDataFound
                            message={"No Files Found!"}
                            frontSpan={2}
                            backSpan={2}
                          />
                        )}
                      </tbody>
                    </table>
                  </div>
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

export default VerificationDetails;
