const dateFormat = require('dateformat');
const Svc = require('../models/svcModel');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

exports.redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

exports.redirectCpanel = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/cpanel');
  }
  next();
};

exports.renderIndex = async (req, res) => {
  try {
    const svcData = await Svc.findById(`${process.env.DB_ID}`);

    const { svcAmount, svcDate, occToday, occYesterday } = svcData;

    res.render('index', {
      isLoggedOn: req.session.user,
      svcAmount,
      svcDate: dateFormat(svcDate, 'dd/mm/yyyy'),
      occYesterday,
      occToday
    });
  } catch (err) {}
};

exports.renderLogin = (req, res) => {
  res.render('login', {
    error: req.query.loginStatus,
    isLoggedOn: req.session.user
  });
};

exports.renderCpanel = async (req, res) => {
  try {
    const svcObj = await Svc.findById(`${process.env.DB_ID}`);
    const { svcAmount, svcDate, occYesterday, occToday } = svcObj;

    res.render('cpanel', {
      isLoggedOn: req.session.user,
      username: req.session.user.username,
      svcAmount,
      svcDate: dateFormat(svcDate, 'yyyy-mm-dd'),
      occToday,
      occYesterday
    });
  } catch (err) {
    console.log(err);
  }
};

exports.renderUsersManager = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).render('manageUsers', {
      isLoggedOn: req.session.user,
      users
    });
  } catch (err) {
    res.status(500).render('manageUsers', {
      isLoggedOn: req.session.user
    });
  }
};

exports.renderAddUser = (req, res) => {
  res.status(200).render('addUser', {
    isLoggedOn: req.session.user
  });
};

exports.renderEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    var selectAdmin = null;
    var selectSuperAdmin = null;

    if (user.role == 'Administrator') {
      selectAdmin = 'selected';
    }
    if (user.role == 'superAdmin') {
      selectSuperAdmin = 'selected';
    }

    res.status(200).render('editUser', {
      isLoggedOn: req.session.user,
      user,
      selectAdmin,
      selectSuperAdmin
    });
  } catch (err) {
    res.send(err);
  }
};

exports.renderDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).render('deleteUser', {
      isLoggedOn: req.session.user,
      user
    });
  } catch (err) {
    res.send(err);
  }
};

// Error Codes
// 404 - Not Found
// 1000 - Contact Admin
// 1001 - This is the last admin user. You  Cannot  remove it
// 1002 - Insufficient privillages

exports.renderError = (req, res) => {
  let error;

  switch (req.query.errorCode) {
    case '404':
      error = 'Sorry, we could not find what you were looking for...';
      break;
    case '1001':
      error = 'You cannot delete the last super admin user.';
      break;
    case '1000':
      error = 'Please contact the administrator';
      break;
    case '1002':
      error = 'Insufficient Privileges';
      break;
    default:
      error = null;
      break;
  }

  if (!error) {
    return res.redirect('/');
  }

  res.status(200).render('error', {
    isLoggedOn: req.session.user,
    error
  });
};
