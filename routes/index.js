const { default: axios } = require("axios");
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("v1/index", { title: "Login" });
});

/* GET OTP verification page */
router.get("/verify/otp", function (req, res, next) {
  res.render("v1/index", { title: "OTP" });
});

/* GET OTP verification page */
router.get("/test", function (req, res, next) {
  axios
    .post(
      "https://testdashboard.lightninglogistics.in/hrms/api/v1/generate/otp",
      { llbContactNumber: "0101010101", code: "123456" },
      {
        headers: {
          type: "SRT-82-0",
        },
      }
    )
    .then((resp) => {
      res.send({
        data: resp?.data,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
