const bcrypt = require("bcryptjs");
const User = require("../.././models/User");
const { roles } = require("../../config/roles");

module.exports = {
  grantAccess: (action, resource) => {
    return async (req, res, next) => {
      try {
        const permission = roles
          .can(req.body.currentUserRole)
          [action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action",
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  },
  profile: async (req, res, next) => {
    res.status(200).json({ user: req.user });
  },

  usersList: async (req, res, next) => {
    const role = req.query.role;
    const permission = roles.can(role).readAny("profile");
    if (permission.granted) {
      const users = await User.find();

      if (users.length === 0) {
        res.status(200).json({ users: "No Data Available", success: true });
      } else {
        res.status(200).json({ users: users, success: true });
      }
    } else {
      res
        .status(403)
        .json({ msg: "You dont have access in this files", success: false })
        .end();
    }
  },

  register: async (req, res, next) => {
    let { name, contact_number, address, username, password, role } = req.body;

    const foundUser = await User.findOne({ username: username });
    if (foundUser) {
      return res
        .status(400)
        .json({ msg: "username is already in use", success: false });
    }

    const foundName = await User.findOne({ name: name });
    if (foundName) {
      return res
        .status(400)
        .json({ msg: `${name} has already a role`, success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      contact_number,
      address,
      username,
      password: passwordHash,
      role,
      date_updated: Date.now(),
    });

    await newUser.save().then((user) => {
      res.status(200).json({
        success: true,
        message: "Succesfully Saved",
        user: user,
      });
    });
  },

  updateAdminProfile: async (req, res, next) => {
    const { id } = req.body;
    const {
      name,
      contact_number,
      address,
      username,
      password,
      role,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        contact_number,
        address,
        username,
        password,
        role,
        date_updated: Date.now(),
      },
      { new: true, useFindAndModify: false }
    );
    if (!user) {
      res.status(400).json({ err: "User doesn't exist", success: false });
    } else {
      res.status(200).json({ user: user, success: true });
    }
  },
  usersProfile: async (req, res, next) => {
    const role = req.query.role;
    const permission = roles.can(role).readAny("profile");
    if (permission.granted) {
      console.log("newUser got called");
      const { id } = req.query;

      const result = await User.findById({ _id: id }, function (error, data) {
        if (error) {
          res.status(400).json({ msg: "Users not found.", success: false });
        }
      });
      res.status(200).json({ user: result, success: true });
    } else {
      res.status(403).end();
    }
  },
};
