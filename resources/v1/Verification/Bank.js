import React, {useEffect, useState} from "react";
import axios from "axios";

import {HRMS_BASE_URL} from "../Auth/Context/AppConstant";
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

const VerifyText = ({header, value}) => {
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

const Bank = ({employeeData, personalDetail,setIsEnableButtons,setSelectedIdentificationRecord}) => {

    console.log("personalDetail ->" + personalDetail?.ifscCode)

    const [frontImage, setFrontImage] = useState("");
    const [backImage, setBackImage] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [bankDetails, setbankDetails] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        setSelectedIdentificationRecord(employeeData.identificationTypeId)
        setIsImageLoaded(true);
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
        }
    }, []);

    useEffect(() => {
        console.log("employeeData")
        console.log(employeeData)
        setIsLoaded(true);
        try {
            axios
                .post(
                    `${HRMS_BASE_URL}/check-bank-account`,
                    {
                        ifsc: personalDetail?.ifscCode,
                        accountNumber: employeeData?.uniqueNo,
                    },
                    {
                        headers: {
                            Authorization: `llBearer ${token}`,
                        },
                    }
                )
                .then((resp) => {
                    setIsEnableButtons(true);
                    setbankDetails(resp?.data?.data?.result);
                    setIsLoaded(false);
                })
                .catch((err) => {
                    setIsEnableButtons(true);
                    setIsLoaded(false);
                });
        } catch (error) {
            setIsEnableButtons(true);
            setErrorMessage(true);
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
                                    <embed src={frontImage} height="300px" width="200px"/>
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
                                    <embed src={backImage} height="200px" width="200px"/>
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
                            <Spinner animation="border" role="status" variant="secondary"/>
                        </div>
                    ) : (
                        <>
                            <Row>
                                <Col>
                                    <VerifyText header="Name" value={bankDetails?.accountName}/>
                                </Col>
                                <Col>
                                    <VerifyText
                                        header="Account Number"
                                        value={bankDetails?.accountNumber}
                                    />
                                </Col>
                                <Col>
                                    <VerifyText header="IFSC" value={bankDetails?.ifsc}/>
                                </Col>
                                <Col>
                                    <VerifyText
                                        header="Status"
                                        value={bankDetails?.bankTxnStatus ? "Success" : "Failed"}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <VerifyText
                                        header="Bank Response"
                                        value={bankDetails?.bankResponse}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            )}
        </>
    );
};

export default Bank;
