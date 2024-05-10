module.exports = {
  DEFAULT_PAGINATION: {
    LIMIT: 10,
    SKIP: 0,
  },

  REGEX: {
    // eslint-disable-next-line no-useless-escape
    MAIL: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    PHONE: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
    PASSWORD: /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  },
};
