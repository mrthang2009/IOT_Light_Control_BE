const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const {
  onLogin,
  onRefreshLoginToken,
  onRegister,
  //  verifyEmail,
  handleForgotPassword,
  resetPassword,
} = require('./controllers');

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // start blocking after 10 requests
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

const {
  checkLogin,
  checkRefreshToken,
  checkRegister,
  // checkActivateAccount,
  checkForgetPassword,
  checkResetPassword,
} = require('./validations');

const { handleValidate } = require('../middleware');

router.route('/login')
  .post(checkLogin, handleValidate, onLogin);

router.route('/token')
  .post(checkRefreshToken, handleValidate, onRefreshLoginToken);

router.route('/register')
  .post(checkRegister, handleValidate, onRegister);

// router.get('/activate', authLimiter, checkActivateAccount, handleValidate, verifyEmail);

router.post('/forgot-password', authLimiter, checkForgetPassword, handleValidate, handleForgotPassword);

router.post('/reset-password', authLimiter, checkResetPassword, handleValidate, resetPassword);

module.exports = router;
