const yup = require('yup');

module.exports = {
  deviceSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required('Tên thiết bị không được để trống')
        .max(100, 'Tên thiết bị không được vượt quá 100 kí tự'),
      description: yup
        .string()
        .max(500, 'Mô tả thiết bị không được vượt quá 500 kí tự'),
    }),
  }),
};
