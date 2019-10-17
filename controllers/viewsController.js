const dateFormat = require('dateformat');
const Svc = require('../models/svcModel');
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
      svcAmount,
      svcDate: dateFormat(svcDate, 'yyyy-mm-dd'),
      occToday,
      occYesterday
    });
  } catch (err) {
    console.log(err);
  }
};
