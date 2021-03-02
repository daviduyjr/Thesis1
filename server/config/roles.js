// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user").readOwn("profile").updateOwn("profile");

  ac.grant("supervisor").extend("user").readAny("profile");

  ac.grant("admin")
    .extend("user")
    .extend("supervisor")
    .readAny("profile")
    .createAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .readAny("category")
    .createAny("category")
    .updateAny("category")
    .deleteAny("category");

  return ac;
})();
