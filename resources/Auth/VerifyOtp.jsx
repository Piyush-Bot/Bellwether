import React, {Component} from 'react';
import axios from "axios";
import {VERIFY_OTP} from "./Context/AppConstant";
import helper from "../helpers";
import AuthContext from "./Context/AuthContext";
import Logo from "./Logo";


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
        const re = /^[0-9\b]+$/;
        if ((value === '' || re.test(value)) && value.length < 7) {
            this.setState({otp: value})
        }
    };

    /**
     * handle otp validate click event for api call
     */
    handleOtpValidateButtonEvent = () => {
        this.setState({ loader: true}, () => {
            this.resetErrorBag();
            const body = { otp: this.state.otp,  mobile: localStorage.getItem('app-ll-mobile') };

            axios.post(VERIFY_OTP, body).then((response) => {
                const data = response.data;
                if(data.success){
                    localStorage.removeItem('app-ll-mobile');
                    localStorage.setItem('app-ll-token', data.data.token);
                    localStorage.setItem('user-data', data.data);
                    window.location.href = '/app/dashboard';
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
                        <div className="wrapper-page">
                            <div className="card card-pages shadow-none">
                                <div className="card-body">
                                    <Logo />
                                    <form className="form-horizontal m-t-30"
                                          onSubmit={(e) => context.handleFormSubmit(e)}>

                                        <div className="form-group">
                                            <div className="col-12">
                                                <label>OTP</label>
                                                <input className="form-control"
                                                       onChange={(e) => this.handleOtpEvent(e.target.value)}
                                                       value={this.state.otp} type="text"
                                                       placeholder="6 digit OTP"/>
                                                {helper.displayMessage(this.state.validationErrorBags.otp)}
                                                {helper.displayMessage(this.state.validationErrorBags.invalidOtp)}
                                            </div>
                                        </div>

                                        <div className="form-group text-center m-t-20">
                                            <div className="col-12">
                                                <div className={'btn-with-loader'}>
                                                    {
                                                        this.state.loader && <img src="images/spinner.gif" alt='loading...'/>
                                                    }
                                                    {
                                                        !this.state.loader && <button type="submit"
                                                                                     onClick={(e) => this.handleOtpValidateButtonEvent()}
                                                                                     className="btn btn-primary btn-block btn-lg waves-effect waves-light">Validate</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    )
                }
            </AuthContext.Consumer>
        )
    }
}
