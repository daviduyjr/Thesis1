const bcrypt = require('bcryptjs');

const User = require('../.././models/User');
const Counter = require('../../models/inventory/counter');
const { roles } = require('../../config/roles');

module.exports = {
  grantAccess: (action, resource) => {
    return async (req, res, next) => {
      try {
        const permission = roles.can(req.user.role)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action.",
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
    const role = req.user.role;
    const permission = roles.can(role).readAny('profile');
    if (permission.granted) {
      const users = await User.find();

      // users.map((result) => {
      //   return (usersToPass = {
      //     id: result.id,
      //     name: result.name,
      //     contact_number: users.contact_number,
      //     address: result.address,
      //     role: result.role,
      //   });
      // });

      if (users.length === 0) {
        res.status(200).json({ users: 'No Data Available.', success: true });
      } else {
        res.status(200).json({ users: users, success: true });
      }
    } else {
      res.status(403).json({ msg: 'You dont have access in this files.', success: false }).end();
    }
  },

  register: async (req, res, next) => {
    let { name, contact_number, address, email, password, role } = req.body;

    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res.status(400).json({
        msg: `Email "${email}" is already in use`,
        success: false,
      });
    }

    const foundName = await User.findOne({ name: name });
    if (foundName) {
      return res.status(400).json({ msg: `${name} has already a role.`, success: false });
    }
    const userID = await genUserCode(role);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      user_id: userID,
      name,
      contact_number,
      address,
      email,
      password: passwordHash,
      role,
      date_updated: Date.now(),
    });

    await newUser.save().then((newUser) => {
      res.status(200).json({
        success: true,
        message: 'Succesfully Saved',
        newUser: newUser,
      });
    });
  },

  updateUsersProfile: async (req, res, next) => {
    try {
      const newUserData = {
        id: req.body.id,
        name: req.body.name,
        contact_number: req.body.contact_number,
        address: req.body.address,
        email: req.body.email,
        role: req.body.role,
        isActive: req.body.isActive,
      };

      const user = await User.findById({ _id: newUserData.id });

      if (user) {
        if (user.email === newUserData.email) {
          updateUsers(newUserData).then((data) => {
            // console.log(data);
            // if (data.msg != null) {
            //   return res.status(400).json({ msg: msg, success: false });
            // } else {
            // }
            return res.status(200).json({ user: data, success: true });
          });
        } else {
          const checkIfEmailExist = await User.findOne({ email: newUserData.email });
          if (checkIfEmailExist) {
            return res.status(400).json({ msg: 'Email already exist!', success: false });
          } else {
            updateUsers(newUserData).then((data) => {
              if (data.msg != null) {
                return res.status(400).json({ msg: msg, success: false });
              } else {
                return res.status(200).json({ user: data.user, success: true });
              }
            });
          }
        }
      }
    } catch (err) {
      return res.status(400).json({
        msg: `Error ${err}`,
        success: false,
      });
    }
  },
  usersProfile: async (req, res, next) => {
    const role = req.user.role;
    const permission = roles.can(role).readAny('profile');
    if (permission.granted) {
      const { id } = req.user._id;

      const result = await User.findById({ _id: id }, function (error, data) {
        if (error) {
          res.status(400).json({ msg: 'Users not found.', success: false });
        }
      });
      res.status(200).json({ newUser: result, success: true });
    } else {
      res.status(403).end();
    }
  },
};

const updateUsers = async (newUserData) => {
  const user = await User.findById({ _id: newUserData.id });

  const newUser = await User.findByIdAndUpdate(
    { _id: newUserData.id },
    {
      name: newUserData.name,
      contact_number: newUserData.contact_number,
      address: newUserData.address,
      email: newUserData.email,
      password: user.password,
      role: newUserData.role,
      isActive: newUserData.isActive,
      date_updated: Date.now(),
    },
    { new: true, useFindAndModify: false }
  );
  if (!newUser) {
    const msg = 'Something Went Wrong!';
    return msg;
  } else {
    return newUser;
  }
};

const genUserCode = async (role) => {
  try {
    const date = new Date();
    const currentYear = date.getFullYear();

    const result = await Counter.findOneAndUpdate({ id: 'user' }, { $inc: { seq: 1 } }, { new: true, useFindAndModify: false });

    if (!result) {
      userCounter = await new Counter({ id: 'user', seq: 1 });
      await userCounter.save();

      const newCounter = await Counter.findOne({ id: 'user' });

      if (role === 'admin') return `ADMIN-${currentYear}-0${newCounter.seq}`;
      if (role === 'suprevisor') return `SUPV-${currentYear}-0${newCounter.seq}`;
      if (role === 'user') return `USER-${currentYear}-0${newCounter.seq}`;
    }
    if (role === 'admin') return `ADMIN-${currentYear}-0${result.seq}`;
    if (role === 'supervisor') return `SUPV-${currentYear}-0${result.seq}`;
    if (role === 'user') return `USER-${currentYear}-0${result.seq}`;
  } catch (err) {
    return err;
  }
};
