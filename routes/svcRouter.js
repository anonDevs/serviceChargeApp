const express = require('express');
const router = express.Router();

const {
  renderIndex,
  renderCpanel,
  redirectLogin,
  renderError
} = require('../controllers/viewsController');

const { updateSc } = require('../controllers/svcController');

router.route('/').get(renderIndex);

router
  .route('/cpanel')
  .get(redirectLogin, renderCpanel)
  .patch(updateSc);

router.route('/error').get(renderError);
module.exports = router;
