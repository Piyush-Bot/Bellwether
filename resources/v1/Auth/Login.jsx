import React, { Component } from "react";
import axios from "axios";
import { GENERATE_OTP } from "./Context/AppConstant";
import helper from "../../helpers";
import AuthContext from "./Context/AuthContext";
import LeftSection from "./LeftSection";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      mobileNo: "",
      validationErrorBags: {
        mobile: [],
        mobileNotFound: [],
      },
    };
  }

  /**
   * Reset validation error bag
   */
  resetErrorBag = () => {
    let validationErrorBags = { mobile: [], mobileNotFound: [] };
    this.setState({
      validationErrorBags: validationErrorBags,
    });
  };

  /**
   * Update mobile no state
   */
  handleMobileNoEvent = (value) => {
    const re = /^[0-9\b]+$/;
    if ((value === "" || re.test(value)) && value.length < 11) {
      this.setState({ mobileNo: value });
    }
  };

  /**
   * handle button click event
   */
  handleLoginButtonEvent = (e) => {
    e.preventDefault();
    this.setState({ loader: true }, () => {
      this.resetErrorBag();
      const body = { mobile: this.state.mobileNo, source: "web" };

      axios
        .post(GENERATE_OTP, body)
        .then((response) => {
          const data = response.data;
          if (data.success) {
            localStorage.setItem("app-ll-mobile", body.mobile);
            window.location.href = "/verify/otp";
          } else {
            let validationMessage = { ...this.state.validationErrorBags };
            validationMessage.mobileNotFound.push("Mobile no can't be found");
            this.setState({ validationErrorBags: validationMessage });
          }
          this.setState({ loader: false });
        })
        .catch((error) => {
          if (error.response.status === 422) {
            let validationMessage = { ...this.state.validationErrorBags };
            this.setState({
              validationErrorBags: helper.validationParsers(
                error.response.data.errors,
                validationMessage
              ),
            });
          }
          this.setState({ loader: false });
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
        {(context) => (
          <div className="login-form">
            <LeftSection text={""}></LeftSection>

            <div className="login-right">
              <div className="outer">
                <div className="inner">
                  <div className="logo-login mb-3">
                    <img src="/v1/images/ll-logo.png" alt="" />
                  </div>
                  <form
                    onSubmit={(e) => context.handleFormSubmit(e)}
                    encType="multipart/form-data"
                  >
                    <div className="row">
                      <div className="col-md-12  text-left">
                        <div className="form-group">
                          <label>Mobile Numbers</label>
                          <input
                            type="text"
                            placeholder="Enter Mobile No"
                            onChange={(e) =>
                              this.handleMobileNoEvent(e.target.value)
                            }
                            value={this.state.mobileNo}
                            className="form-control"
                          />
                          {helper.displayMessage(
                            this.state.validationErrorBags.mobile
                          )}
                          {helper.displayMessage(
                            this.state.validationErrorBags.mobileNotFound
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 mt-2">
                        <button
                          type={"submit"}
                          onClick={(e) => this.handleLoginButtonEvent(e)}
                          className="btn btn-theme btn-block"
                        >
                          Log In
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
}
