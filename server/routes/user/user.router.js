const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");

const userController = require("../../controller/user/user.controller");

const passportSignIn = passport.authenticate("jwt", { session: false });

router.route("/profile").get(passportSignIn, userController.profile);

module.exports = router;
