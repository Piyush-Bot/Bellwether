var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/dashboard*", function (req, res, next) {
  res.render("user", { title: "Express" });
});

router.get("/charging-app*", function (req, res, next) {
  res.render("v1/charging_point", { title: "Charging App" });
});

router.get("/access-app*", function (req, res, next) {
  res.render("v1/access", { title: "Access App" });
});

router.get("/booking-app*", function (req, res, next) {
  res.render("v1/booking_list", { title: "Booking App" });
});

router.get("/configuration-app*", function (req, res, next) {
  res.render("v1/configuration_list", { title: "Configuration App" });
});

router.get("/order-app*", function (req, res, next) {
  res.render("v1/order_list", { title: "Order App" });
});

router.get("/task-app*", function (req, res, next) {
  res.render("v1/task_list", { title: "Task App" });
});

router.get("/reports-app*", function (req, res, next) {
  res.render("v1/report_list", { title: "Report App" });
});

router.get("/mis-upload-app*", function (req, res, next) {
  res.render("v1/misupload_list", { title: "Mis Upload App" });
});

router.get("/verification-app*", function (req, res, next) {
  res.render("v1/verification", { title: "Verification" });
});

router.get("/job-app*", function (req, res, next) {
  res.render("v1/job_application", { title: "Job Application" });
});

module.exports = router;
