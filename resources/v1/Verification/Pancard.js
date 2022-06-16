import React, { useEffect, useState } from "react";
import axios from "axios";

import { HRMS_BASE_URL } from "../Auth/Context/AppConstant";
import {
  CloseButton,
  Modal,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

let token = localStorage.getItem("app-ll-token");

const VerifyText = ({ header, value }) => {
  return (
    <div
      style={{
        marginTop: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "15px",
          fontSeight: 500,
          paddingBottom: 0,
        }}
      >
        {header}
      </h1>
      <p
        style={{
          fontSize: "11px",
          color: "#867c7c",
        }}
      >
        {value}
      </p>
    </div>
  );
};

const Pancard = ({ employeeData, personalDetail, setIsEnableButtons, setSelectedIdentificationRecord }) => {
  console.log(employeeData, personalDetail, "empllll");
  const [errorMessage, setErrorMessage] = useState(false);
  const [panDetails, setPanDetails] = useState({
    status: "success",
    statusCode: "200",
    result: {
      name: "VIJAYMURUGAN RAMALINGAM",
    },
  });
  const [panVerification, setPanVerification] = useState({
    status: "success",
    statusCode: "200",
    result: {
      nameMatchdobMatch: false,
      nameMatch: true,
      status: "Active",
      duplicate: null,
    },
  });

  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setSelectedIdentificationRecord(employeeData.identificationTypeId)
    try {
      axios
        .post(
          `${HRMS_BASE_URL}/get-name-from-pan`,
          {
            pan: employeeData?.uniqueNo,
          },
          {
            headers: {
              Authorization: `llBearer ${token}`,
            },
          }
        )
        .then((resp) => {
          setPanDetails(resp?.data?.data);
          console.log(personalDetail);
          setIsEnableButtons(false);
          var dob = personalDetail?.llempDateOfBirth?.split("-");
          try {
            axios
              .post(
                `${HRMS_BASE_URL}/verify-pan-details`,
                {
                  pan: employeeData?.uniqueNo,
                  name: resp?.data?.data?.result?.name,
                  dob: dob[2] + "/" + dob[1] + "/" + dob[0],
                },
                {
                  headers: {
                    Authorization: `llBearer ${token}`,
                  },
                }
              )
              .then((resp) => {
                setIsEnableButtons(true);
                setPanVerification(resp?.data?.data);
              })
              .catch((err) => {
                setIsEnableButtons(true);
                setErrorMessage(true);
              });
          } catch (error) {
            setIsEnableButtons(true);
            setErrorMessage(true);
          }
        })
        .catch((err) => {
          setIsEnableButtons(true);
          setErrorMessage(true);
        });
    } catch (error) {
      setIsEnableButtons(true);
      setErrorMessage(true);
    }
  }, []);

  useEffect(() => {
    setIsImageLoaded(true);
    // Front Image
    try {
      axios
        .get(
          `${HRMS_BASE_URL}/file-upload/get-file-url/${employeeData?.picFront}`,
          {
            headers: {
              Authorization: `llBearer ${token}`,
            },
          }
        )
        .then((resp) => {
          setBackImage(resp?.data?.data?.file_path);
          setIsImageLoaded(false);
        })
        .catch((err) => {
          setIsImageLoaded(false);
        });
    } catch (error) {
      setErrorMessage(true);
      setIsImageLoaded(false);
    }

    // Back Image
    try {
      axios
        .get(
          `${HRMS_BASE_URL}/file-upload/get-file-url/${employeeData?.picBack}`,
          {
            headers: {
              Authorization: `llBearer ${token}`,
            },
          }
        )
        .then((resp) => {
          setFrontImage(resp?.data?.data?.file_path);
          setIsImageLoaded(false);
        })
        .catch((err) => {
          setIsImageLoaded(false);
        });
    } catch (error) {
      setErrorMessage(true);
      setIsImageLoaded(false);
    }
  }, []);

  return (
    <>
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
        <Container>
          {isImageLoaded ? (
            <div className="text-center">
              <p>Image Loading ......</p>
            </div>
          ) : (
            <Row>
              <Col>
                {frontImage.split(".").pop().toLowerCase() == "pdf" ? (
                  <embed src={frontImage} height="300px" width="200px" />
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
                  <embed src={backImage} height="200px" width="200px" />
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
          )}
          {isLoaded ? (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="secondary" />
            </div>
          ) : (
            <>
              <Row>
                <Col>
                  <VerifyText header="PanCard" value={employeeData?.uniqueNo} />
                </Col>
                <Col>
                  <VerifyText header="Name" value={panDetails?.result?.name} />
                </Col>
                <Col>
                  <VerifyText
                    header="Date of Birth"
                    value={employeeData?.validity}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <VerifyText
                    header="Date of Birth"
                    value={
                      panVerification?.result?.dobMatch ? "Match" : "No Match"
                    }
                  />
                </Col>
                <Col>
                  <VerifyText
                    header="Name"
                    value={
                      panVerification?.result?.nameMatch ? "Match" : "No Match"
                    }
                  />
                </Col>
                <Col>
                  <VerifyText
                    header="Duplicate"
                    value={panVerification?.duplicate == null ? "No" : "Yes"}
                  />
                </Col>
                <Col>
                  <VerifyText header="Status" value={panVerification?.status} />
                </Col>
              </Row>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default Pancard;
