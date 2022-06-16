import React, {Component} from 'react';
import axios from "axios";
import {GENERATE_OTP} from "./Context/AppConstant";
import helper from "../helpers";
import AuthContext from "./Context/AuthContext";
import Logo from "./Logo";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            mobileNo: '',
            validationErrorBags: {
                mobile: [],
                mobileNotFound: []
            }
        };
    }

    /**
     * Reset validation error bag
     */
    resetErrorBag = () => {
        let validationErrorBags = {mobile: [], mobileNotFound: []};
        this.setState({
            validationErrorBags: validationErrorBags
        });
    };

    /**
     * Update mobile no state
     */
    handleMobileNoEvent = (value) => {
        const re = /^[0-9\b]+$/;
        if ((value === '' || re.test(value)) && value.length < 11) {
            this.setState({mobileNo: value})
        }
    };

    /**
     * handle button click event
     */
    handleLoginButtonEvent = () => {
        this.setState({ loader: true }, () => {
            this.resetErrorBag();
            const body = { mobile: this.state.mobileNo };

            axios.post(GENERATE_OTP, body).then((response) => {
                const data = response.data;
                if(data.success){
                    localStorage.setItem('app-ll-mobile', (body.mobile));
                    window.location.href = '/verify/otp';
                } else {
                    let validationMessage = {...this.state.validationErrorBags};
                    validationMessage.mobileNotFound.push('Mobile no can\'t be found');
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
                                                <label>Mobile No</label>
                                                <input className="form-control"
                                                       onChange={(e) => this.handleMobileNoEvent(e.target.value)}
                                                       value={this.state.mobileNo} type="text"
                                                       placeholder="Mobile No"/>
                                                {helper.displayMessage(this.state.validationErrorBags.mobile)}
                                                {helper.displayMessage(this.state.validationErrorBags.mobileNotFound)}
                                            </div>
                                        </div>

                                        <div className="form-group text-center m-t-20">
                                            <div className="col-12">
                                                <div className="btn-with-loader">
                                                    {
                                                        this.state.loader && <img src="images/spinner.gif" alt='loading...'/>
                                                    }

                                                    {
                                                        !this.state.loader && <button type="submit"
                                                                          onClick={(e) => this.handleLoginButtonEvent()}
                                                                          className="btn btn-primary btn-block btn-lg waves-effect waves-light">Log In</button>

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
