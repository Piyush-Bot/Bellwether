import React, { useState, useEffect } from 'react';
import axios from "axios";
import { GENERATE_OTP } from "./Context/AppConstant";

const OtpTimer = () => {

    var [seconds, setSeconds] = React.useState(60);
    const [show, setShow] = React.useState(true);

    const mobileno = localStorage.getItem('app-ll-mobile');
    React.useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => setSeconds('0' + seconds - 1), 1000);

        } else {
            setShow(false);

        }
    });

    const resendOtp = () => {

        const body = { mobile: mobileno, source: 'web' };
        axios.post(GENERATE_OTP, body).then((response) => {
            const data = response.data;
            if (data.success) {
                alert("OTP Resent Successfully")
                setSeconds(60);
                setShow(true);

            } else {
                alert("Try after some time");
            }

        }).catch(error => {
            console.log(error)
        });
    }

    seconds = seconds
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

      return (
            <>
                {
                    show ? (
                        <div className="col-md-6">
                            <p> <span id="timer">00:{seconds}</span></p>
                        </div>)
                        :
                        (<div id="resend" className="col-md-12">
                            <p> <a className="resend-otp" href="#" onClick={resendOtp}>Resend OTP</a></p>
                        </div>)
                }
            </>
        )
   
}
    export default OtpTimer
