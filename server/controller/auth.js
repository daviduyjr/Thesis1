const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require(".././models/User");
const key = require("../config/keys").secret;

module.exports = {
  logIn: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "username or password is incorrect", success: false });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        msg: "username or password is incorrect",
        success: false,
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    const token = await jwt.sign(
      {
        // iss: 'DavidUy',
        sub: payload,
        iat: new Date().getTime(),
        expiresIn: 604800,
      },
      key
    );

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: user,
      msg: "you got your token",
    });
  },
};
