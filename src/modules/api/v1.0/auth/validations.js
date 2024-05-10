const { check, query } = require('express-validator');

module.exports = {
  checkLogin: [
    check('email')
      .not().isEmpty().withMessage('Email không được để trống')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .isLength({ max: 50 })
      .withMessage('Email chỉ được nhập tối đa 50 kí tự'),
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

  checkRegister: [
    check('firstName')
      .trim().not().isEmpty()
      .withMessage('Tên không được để trống')
      .isLength({ max: 150 })
      .withMessage('Tên chỉ được nhập tối đa 150 kí tự')
      .custom((value) => {
        if (!value || /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/.test(value)) {
          return true;
        }
        throw new Error('Tên không thể chưa kí tự đặc biệt');
      }),
    check('lastName').trim().isLength({ max: 150 }).withMessage('Tên chỉ được nhập tối đa 150 kí tự')
      .custom((value) => {
        if (!value || /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/.test(value)) {
          return true;
        }
        throw new Error('Tên không thể chưa kí tự đặc biệt');
      }),
    check('middleName').trim().isLength({ max: 150 }).withMessage('Tên chỉ được nhập tối đa 150 kí tự')
      .custom((value) => {
        if (!value || /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/.test(value)) {
          return true;
        }
        throw new Error('Tên không thể chưa kí tự đặc biệt');
      }),
    check('email')
      .not().isEmpty().withMessage('Email không được để trống')
      .isEmail()
      .withMessage('Email không đúng định dạng')
      .isLength({ max: 50 })
      .withMessage('Email chỉ được nhập tối đa 50 kí tự'),
    check('password')
      .not().isEmpty().withMessage('Mật khẩu không được để trống')
      .isLength({ min: 6 })
      .withMessage('Mật khẩu phải có tối thiểu 6 kí tự')
      .custom((value) => {
        if (!/\s/g.test(value)) {
          return true;
        }
        throw new Error('Mật khẩu không được chứa kí tự trống');
      }),
    check('confirmPassword', 'Mật khẩu xác thực không khớp').custom((value, { req }) => (req.body.password === value)),
  ],

  checkActivateAccount: [
    query('token').not().isEmpty().withMessage('Thông tin xác thực không được để trống')
      .isString()
      .withMessage('Thông tin xác thực không hợp lệ'),
  ],

  checkForgetPassword: [
    check('email').not().isEmpty().withMessage('Email không được để trống')
      .isEmail()
      .withMessage('Email không hợp lệ')
      .isLength({ max: 50 })
      .withMessage('Email chỉ được nhập tối đa 50 kí tự'),
  ],

  checkResetPassword: [
    check('token').not().isEmpty().withMessage('Thông tin xác thực không được để trống')
      .isString()
      .withMessage('Thông tin xác thực không hợp lệ'),
    check('password').not().isEmpty().withMessage('Mật khẩu không được để trống')
      .isString()
      .withMessage('Mật khẩu không hợp lệ')
      .isLength({ min: 6 })
      .withMessage('Mật khẩu phải có tối thiểu 6 kí tự')
      .custom((value) => {
        if (!/\s/g.test(value)) {
          return true;
        }
        throw new Error('Mật khẩu không được chứa kí tự trống');
      }),
    check('confirmPassword').not().isEmpty().withMessage('Bạn phải xác nhận mật khẩu')
      .custom((value, { req }) => (req.check.password === value))
      .withMessage('Mật khẩu xác thực không khớp'),
  ],
};
