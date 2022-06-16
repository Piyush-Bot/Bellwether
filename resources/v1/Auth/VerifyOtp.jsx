import React, {Component} from 'react';
import axios from "axios";
import {VERIFY_OTP} from "./Context/AppConstant";
import helper from "../../helpers";
import AuthContext from "./Context/AuthContext";
import OtpInput from "react-otp-input";
import LeftSection from "./LeftSection";
import OtpTimer from './OtpTimer';
import helpers from "../../helpers";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const mobileno = localStorage.getItem('app-ll-mobile');

let splitedMobileNo = mobileno?.substring(0, 3)  + 'xxxX' + mobileno?.substring(5+2);

export default class VerifyOtp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loader: false,
            otp: "",
            validationErrorBags: {
                otp: [],
                invalidOtp: []
            }
        };
    }

   

    /**
     * Reset validation error bag
     */
    resetErrorBag = () => {
        let validationErrorBags = {otp: [], invalidOtp: []};
        this.setState({
            validationErrorBags: validationErrorBags
        });
    };

    /**
     * Update mobile no state
     */
    handleOtpEvent = (value) => {
        this.setState({otp: value});
    };

    /**
     * handle otp validate click event for api call
     */
    handleOtpValidateButtonEvent = (e) => {
        e.preventDefault();
        this.setState({ loader: true}, () => {
            this.resetErrorBag();
            const body = { otp: this.state.otp,  source: "web", mobile: localStorage.getItem('app-ll-mobile') };

            axios.post(VERIFY_OTP, body).then((response) => {
                const data = response.data;
                if(data.success){
                    localStorage.removeItem('app-ll-mobile');
                    localStorage.setItem('app-ll-token', data.data.token);
                    localStorage.setItem('user-data', JSON.stringify(data.data.user));

                    const userRoleData = data.data.user?.roles;
                    const loggedInUserDetails = helpers.createArrayOfString(userRoleData);
                    localStorage.setItem('loggedInUserDetails', JSON.stringify(loggedInUserDetails));

                    window.location.href = '/app/task-app';
                } else {
                    let validationMessage = {...this.state.validationErrorBags};
                    validationMessage.invalidOtp.push('OTP invalid/Expired');
                    this.setState({validationErrorBags: validationMessage})
                }
                this.setState({loader: false});
            }).catch(error => {
                if(error.response.status === 422){
                    let validationMessage = {...this.state.validationErrorBags};
                    this.setState({ validationErrorBags: helper.validationParsers(error.response.data.errors, validationMessage) });
                }
                this.setState({loader: false});
            });
        });
    };

    componentDidMount() {
        /**
         * common error handler when auth failed
         */
        helper.handleErrors();
        
        if(!localStorage.getItem('app-ll-mobile')){
            window.location.href = '/';
        }
    }

    render() {
        return (
            <AuthContext.Consumer>
                {
                    context => (
                        <div className="login-form">

                            <LeftSection text={''}>
                            </LeftSection>

                            <div className="login-right">
                                <div className="outer">
                                    <div className="inner">
                                        <div className="logo-login mb-3">
                                            <img src="/v1/images/ll-logo.png" alt="" />
                                        </div>
                                        <form action="" method="post" encType="multipart/form-data">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <p className="pb-3 text-left">Enter the OTP sent to <span className="phone-no"><b>+91-{splitedMobileNo}</b></span></p>
                                                    
                                                </div>
                                                <div className="col-md-12  text-left">
                                                    <div className="form-group">
                                                        <label>OTP Number</label>
                                                        <div className="d-flex">
                                                            <OtpInput
                                                                value={this.state.otp}
                                                                onChange={this.handleOtpEvent}
                                                                numInputs={6}
                                                                inputStyle={' otp-text mr-2'}
                                                                separator={<span>{null}</span>}
                                                                autoFocus={0}
                                                            />
                                                        </div>
                                                        {helper.displayMessage(this.state.validationErrorBags.otp)}
                                                        {helper.displayMessage(this.state.validationErrorBags.invalidOtp)}
                                                    </div>
                                                </div>

                                                <div className="col-md-12 mt-2">

                                                    
                                                    <a href="#"
                                                       onClick={(e) => this.handleOtpValidateButtonEvent(e)}
                                                       className="btn btn-theme btn-block">Verify</a>
                                                </div>
                                                
                                                <div  className="col-md-12 mt-4">
                                                    <div className="col-md-12 d-flex" >
                                                        <span className="col-md-6 text-left"> Didn't receive OTP?</span>
                                                        <span className="col-md-6 text-left"> <OtpTimer/></span>
                                                    </div>
                                                </div>
                                              
                                            </div>
                                        </form>
                                        <div className="back-btn">
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={<Tooltip id="button-tooltip-2">{'Back To Login Page'}</Tooltip>}
                                            >
                                                <a href="/" className="btn btn-primary btn-sm"
                                                    data-toggle="tooltip" data-placement="top" title=""
                                                    data-original-title="Back"><i className="fa fa-angle-left"
                                                        aria-hidden="true">{null}</i></a>


                                            </OverlayTrigger>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </AuthContext.Consumer>
        )
    }
}
