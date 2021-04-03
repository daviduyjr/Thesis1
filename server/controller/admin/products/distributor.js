const bcrypt = require('bcryptjs');
const Distributor = require('../../../models/inventory/Distributor');
const { roles } = require('../../../config/roles');

const Counter = require('../../../models/inventory/counter');

module.exports = {
  distributorList: async (req, res, next) => {
    const distributors = await Distributor.find();
    if (distributors.length === 0) {
      res.status(200).json({ distributors: 'No Data Available', success: true });
    } else {
      res.status(200).json({ distributors: distributors, success: true });
    }
  },

  addDistributor: async (req, res, next) => {
    try {
      const newDist = {
        distributorName: req.body.distributor.name,
        address: req.body.distributor.address,
        contact_number: req.body.distributor.contact_number,
      };
      const foundDist = await Distributor.findOne({
        distributor_name: newDist.distributorName,
      });
      if (foundDist) {
        return res.status(400).json({
          msg: `Distributor ${newDist.distributorName} is already existing.`,
          success: false,
        });
      }

      const id = 'distributorID';
      const dist = await Counter.findOneAndUpdate({ id }, { $inc: { seq: 1 } }, { new: true, useFindAndModify: false });

      if (!dist) {
        c = await new Counter({ id: 'distributorID', seq: 1 });
        await c.save();
      }
      const DistID = await Counter.findOne({ id: 'distributorID' });

      const newDistID = `Dist-0${DistID.seq}`;

      const newDistributor = new Distributor({
        dist_no: newDistID,
        distributor_name: newDist.distributorName,
        address: newDist.address,
        contact_number: newDist.contact_number,
        date_updated: Date.now(),
      });

      await newDistributor.save().then((distributor) => {
        res.status(200).json({
          success: true,
          message: 'Succesfully Saved',
          distributor: distributor,
        });
      });
    } catch (err) {
      return res.status(400).json({
        msg: `Error ${err}`,
        success: false,
      });
    }
  },

  updateDistributor: async (req, res, next) => {
    try {
      const newDistributor = {
        new_dist_no: req.body.dist_no,
        new_distributor_name: req.body.distributor_name,
        new_address: req.body.address,
        new_contact_number: req.body.contact_number,
      };

      const dist = await Distributor.findOne({ dist_no: newDistributor.new_dist_no });

      if (dist) {
        if (dist.distributor_name === newDistributor.new_distributor_name.toUpperCase()) {
          updateDistributor(newDistributor).then((data) => {
            return res.status(200).json({ distributor: data, success: true });
          });
        } else {
          let updateDistName = await Distributor.findOne({
            distributor_name: newDistributor.new_distributor_name.toUpperCase(),
          });

          if (updateDistName) {
            return res.status(400).json({
              err: `Distributor ${newDistributor.new_distributor_name.toUpperCase()} already exist`,
              success: false,
            });
          } else {
            updateDistributor(newDistributor).then((data) => {
              return res.status(200).json({ distributor: data, success: true });
            });
          }
        }
      }
    } catch (err) {
      res.status(400).json({ err: "Category doesn't exist", success: false });
    }
  },
};

var updateDistributor = async (newDistributor) => {
  let result = await Distributor.findOneAndUpdate(
    { dist_no: newDistributor.new_dist_no },
    {
      dist_no: newDistributor.new_dist_no,
      distributor_name: newDistributor.new_distributor_name.toUpperCase(),
      address: newDistributor.new_address,
      contact_number: newDistributor.new_contact_number,
      date_updated: Date.now(),
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  if (!result) {
    const err = 'may mali eh';
    return err;
  } else {
    return result;
  }
};
