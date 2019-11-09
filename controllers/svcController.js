const Svc = require('../models/svcModel');
const dateFormat = require('dateformat');
const dotenv = require('dotenv');

exports.updateSc = async (req, res) => {
  try {
    const updatedValues = await Svc.findByIdAndUpdate(
      `${process.env.DB_ID}`,
      req.body
    );
    console.log(updatedValues);
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};
