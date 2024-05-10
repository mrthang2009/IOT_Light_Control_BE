/* eslint-disable camelcase */
const fs = require('fs');
const ejs = require('ejs');
const {
  apiErrors, apiResponse, generateRandStr, utils,
} = require('../../../../helpers');
const { User } = require('../../../../models');
const Jwt = require('../../../../services/jwt');
const smtpTransport = require('../../../../services/nodemailer');

const VERIFICATION_LENGTH = 25;
const VERIFICATION_EXPIRES = 15;

const tokenList = {};

const getUserInfo = (user, token, refreshToken = '') => ({
  _id: user._id,
  token,
  refreshToken,
});

// const sendMailActivate = async (user, activateUrl) => {
//   const file = fs.readFileSync('src/views/client/email/account-verification.ejs', {
//     encoding: 'utf8',
//   });
//   const template = ejs.compile(file);
//   const mailOptions = {
//     to: user.email,
//     from: 'Dashment',
//     subject: 'Kích hoạt tài khoản',
//     html: template({
//       name: 'Dashment',
//       logo: '',
//       user,
//       activateUrl,
//       limit: VERIFICATION_EXPIRES,
//     }),
//   };
//   await smtpTransport.sendMail(mailOptions);
// };

module.exports = {
  onRegister: async (req, res, next) => {
    try {
      const {
        email, password, firstName, lastName, middleName, avatar,
      } = req.body;

      let user = await User.findOne({ email });

      if (user) {
        return next(apiErrors.emailAlreadyExists);
      }

      const userData = {
        email,
        firstName,
        lastName,
        middleName,
        password,
        avatar,
      };

      user = new User(userData);
      await user.save();

      // sendMailActivate(user, `${req.get('origin') || ''}/verify/${user.verification}`);

      res.json(apiResponse({
        // eslint-disable-next-line max-len
        // message: 'Đăng ký thành công. Một email đã được gửi đến tài khoản email của bạn, vui lòng kiểm tra',
        payload: user,
      }));
    } catch (error) {
      next(error);
    }
  },

  // verifyEmail: async (req, res, next) => {
  //   try {
  //     const { token } = req.params;

  //     const user = await User.findOne({ verifyToken: token });

  //     if (!user || !user.verifyToken) {
  //       return res.json(
  //         apiErrors.getBadRequestError('Thông tin không hợp lệ', apiErrors.INVALID_ACCOUNT),
  //       );
  //     }
  //     if (user.verificationExpires.getTime() < new Date().getTime()) {
  //       return res.json(
  //         apiErrors.getBadRequestError('Mã xác thực đã hết hạn', apiErrors.INVALID_VERIFICATION)
  //         );
  //     }

  //     user.isVerified = true;
  //     user.verifyToken = undefined;

  //     await user.save();

  //     res.json(apiResponse(getUserInfo(user, token)));
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  onLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      // if (user && user.isBlocked) {
      //   return next(apiErrors.userIsBlocked);
      // }
      if (!user || !user.password || !user.comparePassword(password)) {
        return next(apiErrors.invalidEmailOrPassword);
      }

      // if (!user.isVerify) {
      //   return next(
      //     apiErrors.getBadRequestError(
      //       'Tài khoản chưa kích hoạt!', apiErrors.INACTIVATE_ACCOUNT
      //     ),
      //   );
      // }

      const token = Jwt.generateUserToken(user);
      const refreshToken = Jwt.generateUserRefreshToken(user);
      tokenList[refreshToken] = user;
      res.json(apiResponse(getUserInfo(user, token, refreshToken)));
    } catch (error) {
      next(error);
    }
  },

  onRefreshLoginToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (refreshToken && refreshToken in tokenList) {
        await utils.verifyJwtToken(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = tokenList[refreshToken];
        const token = Jwt.generateUserToken(user);
        res.json(apiResponse(getUserInfo(user, token)));
      } else {
        return res.json(apiErrors.badRequest);
      }
    } catch (error) {
      next(error);
    }
  },

  handleForgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.json(apiErrors.notFound);
      }

      const tokenExpires = new Date();
      tokenExpires.setMinutes(tokenExpires.getMinutes() + VERIFICATION_EXPIRES);
      user.resetPasswordToken = generateRandStr(VERIFICATION_LENGTH);
      user.resetPasswordExpires = tokenExpires;
      await user.save();

      const file = fs.readFileSync('src/views/email/reset-password.ejs', {
        encoding: 'utf8',
      });
      const template = ejs.compile(file);
      const mailOptions = {
        to: user.email,
        from: 'Dashment',
        subject: 'Đổi mật khẩu',
        html: template({
          name: 'Dashment',
          logo: '',
          user,
          activateUrl: `${req.get('origin') || ''}/reset-password/${user.resetPasswordToken}`,
          limit: VERIFICATION_EXPIRES,
        }),
      };
      smtpTransport.sendMail(mailOptions);

      return res.json(apiResponse({ message: 'Gửi email thành công' }));
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token, password } = req.body;
      const user = await User.findOne({ resetPasswordToken: token });

      if (!user) {
        return res.json(apiErrors.notFound);
      }
      if (user.resetPasswordExpires.getTime() < new Date().getTime()) {
        return res.json(apiErrors.getBadRequestError('Mã xác thực đã hết hạn', apiErrors.INVALID_TOKEN));
      }
      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.json(apiResponse({ message: 'Thay đổi mật khẩu thành công' }));
    } catch (error) {
      next(error);
    }
  },
};
