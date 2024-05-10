const { check } = require('express-validator');

module.exports = {
  checkLogin: [
    check('username')
      .not().isEmpty().withMessage('Username không được để trống'),
    check('password').not().isEmpty().withMessage('Mật khẩu không được để trống')
      .custom((value) => {
        if (!/\s/g.test(value)) {
          return true;
        }
        throw new Error('Mật khẩu không được chứa kí tự trống');
      }),
  ],

  checkRefreshToken: [
    check('refreshToken')
      .not().isEmpty().withMessage('Refresh Token không được để trống'),
  ],
};
