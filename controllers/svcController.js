const Svc = require('../models/svcModel');
const dateFormat = require('dateformat');
const dotenv = require('dotenv');
const User = require('../models/userModel');

const addUser = async (username, password) => {
  const newUser = await User.create({
    username,
    password
  });
  console.log(newUser);
};

dotenv.config({ path: `${__dirname}/../config.env` });

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

exports.loginUser = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    if (
      user.password == req.body.password &&
      user.username == req.body.username
    ) {
      req.session.user = user;
      console.log('A User has logged in');
      return res.redirect('/cpanel');
    }
  }

  res.redirect('/login?loginStatus=UnamePassError');
};

exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    return res.redirect('/cpanel');
  });

  return res.redirect('/login');
};
