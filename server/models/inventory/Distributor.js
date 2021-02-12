const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
// var autoIncrement = require("mongoose-auto-increment");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// const autoIncrementModelID = require("../inventory/counter");

const distributorSchema = new Schema({
  dist_no: {
    type: String,
    required: true,
  },
  distributor_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_updated: {
    type: Date,
    required: true,
  },
});
// distributorSchema.pre("validate", true, function (next) {
//   console.log("presave");

//   var doc = this;
//   debugger;
//   counter.findOneAndUpdate(
//     { _id: "distributorID" },
//     { $inc: { seq: 1 } },
//     function (error, c /*counter*/) {
//       if (error) return next(error);
//       else if (!c) {
//         console.log("presave1");
//         c = new counter({ _id: "distributorID", seq: 1 });
//         c.save(function () {
//           doc.dist_id = c.seq;
//           return doc;
//           next();
//         });
//       } else {
//         console.log("presave2");
//         doc.dist_id = counter.seq;
//         return doc;
//         next();
//       }
//     }
//   );
// });

// distributorSchema.plugin(autoIncrement.plugin, {
//   model: "distributor",
//   field: "distributor_no",
//   startAt: 1,
//   incrementBy: 100,
//   type: Number,
//   unique: false,
// });

// distributorSchema.pre("save", function (next) {
//   const test = this;
//   if (!this.isNew) {
//     next();
//     return;
//   }

//   autoIncrementModelID("activities", test, next);
// });
// distributorSchema.plugin(AutoIncrement, { inc_field: "id" });
const Distributor = mongoose.model("distributor", distributorSchema);

module.exports = Distributor;
