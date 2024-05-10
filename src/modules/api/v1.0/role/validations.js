// const { check } = require('express-validator');
const yup = require('yup');

module.exports = {
  roleSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required('Tên vai trò không được để trống')
        .max(150, 'Tên vai trò không vượt quá 150 ký tự'),
      description: yup
        .string()
        .max(300, 'Mô tả vai trò không vượt quá 300 ký tự'),
      permissions: yup
        .array()
        .of(yup.string().required('Quyền truy cập của vai trò không được để trống'))
        .min(1, 'Vai trò phải có ít nhất một quyền truy cập'),
    }),
  }),
};
