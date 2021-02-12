var mongoose = require("mongoose");

// define the schema for our user model
var counterSchema = mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// counterSchema.index({ _id: 1, seq: 1 }, { unique: true });

// const counterModel = mongoose.model("counter", counterSchema);

// const autoIncrementModelID = function (modelName, doc, next) {
//   counterModel.findByIdAndUpdate(
//     modelName,
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true },
//     function (error, counter) {
//       if (error) return next(error);

//       doc.id = counter.seq;
//       next();
//     }
//   );
// };

// module.exports = autoIncrementModelID;
module.exports = mongoose.model("counter", counterSchema);
