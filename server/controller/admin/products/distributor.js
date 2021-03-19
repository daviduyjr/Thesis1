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
    const { distributorName, address, contact_number } = req.body;
    const foundDist = await Distributor.findOne({
      distributor_name: distributorName,
    });
    if (foundDist) {
      return res.status(400).json({
        msg: `Distributor ${distributorName} is already in use`,
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
      distributor_name: distributorName,
      address: address,
      contact_number: contact_number,
      date_updated: Date.now(),
    });

    await newDistributor.save().then((distributor) => {
      res.status(200).json({
        success: true,
        message: 'Succesfully Saved',
        distributor: distributor,
      });
    });
  },

  updateDistributor: async (req, res, next) => {
    try {
      const { dist_no, distributor_name, address, contact_number } = req.body;
      const dist = await Distributor.findOne({ dist_no });
      console.log(dist);
      if (dist) {
        if (dist.distributor_name === distributor_name.toUpperCase()) {
          console.log('existing na yung name');
          // updateCatName(catName, catStatus, _id).then((data) => {
          //   return res.status(200).json({ categories: data, success: true });
          // });
        } else {
          let catNameToFind = await Category.findOne({ category_name: catName });

          if (catNameToFind) {
            return res.status(400).json({ err: `Category ${catName} already exist`, success: false });
          } else {
            updateCatName(catName, catStatus, _id).then((data) => {
              return res.status(200).json({ categories: data, success: true });
            });
          }
        }
      }
    } catch (err) {
      res.status(400).json({ err: "Category doesn't exist", success: false });
    }
  },
};
