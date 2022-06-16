import React, { useEffect, useState } from "react";
import {
  CloseButton,
  Modal,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";

import { HRMS_BASE_URL } from "../Auth/Context/AppConstant";

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

const Aadhar = ({ employeeData,setIsEnableButtons,setSelectedIdentificationRecord }) => {
  const [captcha, setCaptcha] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [aadharError, setAadharError] = useState("");
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [isVerify, setIsVerify] = useState("");
  const [isOtpVerify, setOtpVerify] = useState(false);
  const [adharResp, setAdharResp] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false);

  console.log(employeeData, "sss");

  useEffect(() => {
    console.log("========= call")
    try {
      axios
        .get(`${HRMS_BASE_URL}/get-aadhaar-captcha`, {
          headers: {
            Authorization: `llBearer ${token}`,
          },
        })
        .then((resp) => {
          setCaptcha(resp?.data?.data);
          setIsEnableButtons(false);
        })
        .catch((err) => {
          setErrorMessage(true);
          setIsEnableButtons(true);
        });
    } catch (error) {
      setErrorMessage(true);
      setIsEnableButtons(true);
    }
  }, []);

  useEffect(() => {
    setIsImageLoaded(true);
    setSelectedIdentificationRecord(employeeData.identificationTypeId)
    // Front Image
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
          setBackImage(resp?.data?.data?.file_path);
          setIsImageLoaded(false);
        })
        .catch((err) => {
          setErrorMessage(true);
          setIsImageLoaded(false);
        });
    } catch (error) {
      setErrorMessage(true);
      setIsImageLoaded(false);
      setIsEnableButtons(true);
    }

    // Back Image
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
          setFrontImage(resp?.data?.data?.file_path);
          setIsImageLoaded(false);
        })
        .catch((err) => {
          setIsImageLoaded(false);
        });
    } catch (error) {
      setErrorMessage(true);
      setIsImageLoaded(false);
      setIsEnableButtons(true);
    }
  }, []);

  function verifyCaptcha() {
    setIsCaptchaLoaded(true);
    try {
      axios
        .post(
          `${HRMS_BASE_URL}/get-aadhaar-otp`,
          {
            sessionId: captcha?.sessionId,
            securityCode: securityCode,
            aadhaar: employeeData?.uniqueNo,
          },
          {
            headers: {
              Authorization: `llBearer ${token}`,
            },
          }
        )
        .then((resp) => {
          setIsVerify("s");
          setIsCaptchaLoaded(false);
          setIsEnableButtons(false);
        })
        .catch((err) => {
          setIsVerify("e");
          setIsCaptchaLoaded(false);
          setIsEnableButtons(true);
        });
    } catch (error) {
      setIsCaptchaLoaded(false);
    }
  }

  function verifyOtp() {
    try {
      axios
        .post(
          `${HRMS_BASE_URL}/get-aadhaar-xml`,
          {
            sessionId: captcha?.sessionId,
            otp: securityCode,
            referenceId: "tests",
            shareCode: "2087",
            fileUrl: true,
          },
          {
            headers: {
              Authorization: `llBearer ${token}`,
            },
          }
        )
        .then((resp) => {
          console.log(resp, "resps");
          setOtpVerify(true);
          setAdharResp(resp?.data?.data);
          setIsEnableButtons(true);
        })
        .catch((err) => {
          // setIsVerify("e");
          setOtpVerify(false);
          setIsEnableButtons(true);
        });
    } catch (error) {
      setErrorMessage(true);
    }
  }

  return (
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
      {isVerify != "s" && !isOtpVerify && (
        <div
          style={{
            marginTop: "10px",
          }}
        >
          {isCaptchaLoaded ? (
            <div className="text-center">
              <p>Captcha Loading ......</p>
            </div>
          ) : (
            <img
              src={`data:image/png;base64, ${captcha?.captchaImage}`}
              alt="Captcha Loading"
            />
          )}
          <Row>
            <Col className="col-md-8">
              <div className="search-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Captcha"
                  onChange={(e) => setSecurityCode(e?.target?.value)}
                />
              </div>
            </Col>
            <Col>
              <Button
                variant="primary"
                onClick={verifyCaptcha}
                disabled={securityCode.length == 0}
              >
                Verify
              </Button>
            </Col>
          </Row>
        </div>
      )}

      {isVerify == "s" && !isOtpVerify && (
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <Row>
            <Col className="col-md-8">
              <div className="search-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  onChange={(e) => setSecurityCode(e?.target?.value)}
                />
              </div>
            </Col>
            <Col>
              <Button
                variant="primary"
                onClick={verifyOtp}
                disabled={securityCode.length == 0}
              >
                Verify OTP
              </Button>
            </Col>
          </Row>
        </div>
      )}

      {isVerify == "e" && (
        <h1
          style={{
            fontSize: "13px",
            marginTop: "10px",
            color: "#e70000",
          }}
        >
          Please enter valid captcha
        </h1>
      )}

      {isVerify == "s" && !isOtpVerify && (
        <h1
          style={{
            fontSize: "13px",
            marginTop: "10px",
            color: "green",
          }}
        >
          OTP sent to mobile number
        </h1>
      )}

      {isOtpVerify && (
        <>
          <Row>
            <Col>
              <VerifyText
                header="Name"
                value={adharResp?.details?.name?.value}
              />
            </Col>
            <Col>
              <VerifyText
                header="Date of Birth"
                value={adharResp?.details?.dob?.value}
              />
            </Col>
            <Col>
              <VerifyText
                header="Gender"
                value={adharResp?.details?.gender?.value}
              />
            </Col>
            <Col>
              <VerifyText
                header="Phone Verified"
                value={adharResp?.details?.isVerifiedPhone}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <VerifyText
                header="Email Verified"
                value={adharResp?.details?.isVerifiedEmail}
              />
            </Col>
            <Col>
              <VerifyText
                header="Signature Verified"
                value={adharResp?.details?.isVerifiedSignature}
              />
            </Col>
            <Col>
              <VerifyText
                header="Generated Time"
                value={
                  adharResp?.details?.generatedTimestamp
                    ? moment(
                        new Date(adharResp?.details?.generatedTimestamp)
                      ).format("DD-MM-YYYY, h:mm:ss a")
                    : "-"
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <VerifyText
                header="Address"
                value={`${adharResp?.details?.address?.careof},
              ${adharResp?.details?.address?.house},
              ${adharResp?.details?.address?.vtc},
              ${adharResp?.details?.address?.street}, 
              ${adharResp?.details?.address?.postoffice}, 
              ${adharResp?.details?.address?.district}, 
              ${adharResp?.details?.address?.state}, 
              ${adharResp?.details?.address?.country}.`}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Aadhar;
