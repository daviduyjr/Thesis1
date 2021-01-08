const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/User");
const key = require("./keys").secret;

const opt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opt, async (payload, done) => {
      const user = await User.findById(payload.sub.id);

      //if users does not exist, handle it
      if (!user) {
        return done(null, false);
      }

      //otherwise, return the user
      done(null, user);
    })
  );
};
