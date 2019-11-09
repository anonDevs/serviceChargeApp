const express = require('express');
const router = express.Router();

const {
  addUser,
  loginUser,
  logoutUser,
  editUser,
  deleteUser
} = require('../controllers/userController');

const {
  renderLogin,
  renderAddUser,
  renderEditUser,
  renderDeleteUser,
  renderUsersManager,
  redirectCpanel
} = require('../controllers/viewsController');

router.route('/users/').get(renderUsersManager);

router
  .route('/users/add')
  .get(renderAddUser)
  .post(addUser);

router
  .route('/users/edit/:id')
  .get(renderEditUser)
  .patch(editUser);

router
  .route('/users/delete/:id')
  .get(renderDeleteUser)
  .delete(deleteUser);

router.route('/logout').get(logoutUser);

router
  .route('/login')
  .get(redirectCpanel, renderLogin)
  .post(loginUser);

module.exports = router;
