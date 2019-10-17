const express = require('express');
const router = express.Router();

const {
  renderIndex,
  renderLogin,
  renderCpanel,
  redirectCpanel,
  redirectLogin
} = require('../controllers/viewsController');

const {
  updateSc,
  loginUser,
  logoutUser
} = require('../controllers/svcController');

router.route('/').get(renderIndex);

router
  .route('/login')
  .get(redirectCpanel, renderLogin)
  .post(loginUser);

router
  .route('/cpanel')
  .get(redirectLogin, renderCpanel)
  .patch(updateSc);

router.route('/logout').get(logoutUser);

module.exports = router;
