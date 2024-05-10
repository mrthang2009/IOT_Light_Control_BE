const yup = require('yup');
const { isMongoId } = require('../../../../helpers');
const { REGEX } = require('../../../../constants');

module.exports = {
  createUserSchema: yup.object({
    body: yup.object({
      firstName: yup
        .string()
        .required('Tên người dùng không được để trống')
        .max(50, 'Tên người dùng không vượt quá 50 ký tự'),
      lastName: yup
        .string()
        .required('Họ người dùng không được để trống')
        .max(50, 'Họ người dùng không vượt quá 50 ký tự'),
      email: yup
        .string()
        .required('Email không được để trống')
        .test('email type', 'Email không hợp lệ', (value) => {
          const emailRegex = REGEX.MAIL;
          return emailRegex.test(value);
        }),
      password: yup
        .string()
        .required('Mật khẩu không được để trống')
        .test('password type', 'Mật khẩu không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      confirmPassword: yup
        .string()
        .required('Xác nhận mật khẩu không được để trống')
        .test(
          'confirmPassword type',
          'Xác nhận mật khẩu: giá trị không hợp lệ',
          (value) => {
            const passwordRegex = REGEX.PASSWORD;
            return passwordRegex.test(value);
          },
        )
        .min(8)
        .max(20),
      avatarId: yup
        .string()
        .test('isValid', 'avatarId sai định dạng', (value) => {
          if (value) {
            return isMongoId(value);
          }
          return true;
        }),
      roleId: yup.string().test('isValid', 'roleId sai định dạng', (value) => {
        if (value) {
          return isMongoId(value);
        }
        return true;
      }),
    }),
  }),

  editProfileUserSchema: yup.object({
    body: yup.object({
      firstName: yup
        .string()
        .required('Tên người dùng không được để trống')
        .max(50, 'Tên người dùng không vượt quá 50 ký tự'),
      lastName: yup
        .string()
        .required('Họ người dùng bắt buộc điền')
        .max(50, 'Họ người dùng không vượt quá 50 ký tự'),
      email: yup
        .string()
        .required('Email bắt buộc điền')
        .test('email type', 'Email không hợp lệ', (value) => {
          const emailRegex = REGEX.MAIL;
          return emailRegex.test(value);
        }),
    }),
  }),

  passwordUserSchema: yup.object({
    body: yup.object({
      oldPassword: yup
        .string()
        .required('Mật khẩu hiện tại không được để trống')
        .test('password type', 'Mật khẩu không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      newPassword: yup
        .string()
        .required('Mật khẩu mới không được để trống')
        .test('password type', 'Mật khẩu không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
      confirmPassword: yup
        .string()
        .required('Xác nhận mật khẩu không được để trống')
        .test('password type', 'Mật khẩu xác nhận không hợp lệ', (value) => {
          const passwordRegex = REGEX.PASSWORD;
          return passwordRegex.test(value);
        })
        .min(8)
        .max(20),
    }),
  }),
};
