const express = require('express');

const router = express.Router();

const {
  onLogin,
  onRefreshLoginToken,
} = require('./controllers');

const {
  checkLogin,
  checkRefreshToken,
} = require('./validations');

const { handleValidate } = require('../middleware');

router.route('/login')
  .post(checkLogin, handleValidate, onLogin);

router.route('/token')
  .post(checkRefreshToken, handleValidate, onRefreshLoginToken);

module.exports = router;
