const express = require("express");
const router = require("express-promise-router")();

const authController = require("../.././controller/auth");

router.post("/login", authController.logIn);

module.exports = router;
