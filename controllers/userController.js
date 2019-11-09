const dateFormat = require('dateformat');
const Svc = require('../models/svcModel');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

exports.addUser = async (req, res) => {
  if (req.session.user.role != 'superAdmin') {
    return res.status(200).redirect('/error?errorCode=1002');
  }

  try {
    await User.create(req.body);

    return res.redirect('/users');
  } catch (err) {
    console.log('**************************\n\n');
    console.log(err);
    console.log('\n\n**************************');
    return res.redirect('/error?errorCode=1000');
  }
};

exports.editUser = async (req, res) => {
  if (!req.body.password) {
    delete req.body.password;
  } else if (!req.body.username) {
    delete req.body.username;
  } else if (!req.body.role) {
    delete req.body.role;
  }

  if (req.session.user.role != 'superAdmin') {
    return res.status(200).redirect('/error?errorCode=1002');
  }

  try {
    const editedUser = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).redirect('/users');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const usersArr = await User.find({
      role: user.role
    });

    if (req.session.user.role != 'superAdmin') {
      return res.status(200).redirect('/error?errorCode=1002');
    }

    if (usersArr.length < 2 && user.role == 'superAdmin') {
      return res.status(200).redirect('/error?errorCode=1001');
    }

    if (usersArr.length) await User.findByIdAndDelete(req.params.id);

    res.status(200).redirect('/users');
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
