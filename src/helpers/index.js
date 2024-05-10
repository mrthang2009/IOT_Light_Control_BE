const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const crypto = require('crypto');
const yup = require('yup');

const { checkPermission } = require('../helpers/permission');

const apiErrors = require('./apiErrors');
const utils = require('./utils');

const { ObjectId } = mongoose.Types;

module.exports = {
  isMongoId: (id) => {
    try {
      return ObjectId.isValid(id);
    } catch (error) {
      return false;
    }
  },

  toObjectId: id => ObjectId(id),

  formatDate: (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);

    return `${dateTime.getDate()}/${
      dateTime.getMonth() + 1
    }/${dateTime.getFullYear()}`;
  },

  padZero: (number, length) => {
    let str = `${number}`;
    while (str.length < length) {
      str = `0${str}`;
    }
    return str;
  },

  removeVnDiacritics: (str) => {
    let string = str;
    string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    string = string.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    string = string.replace(/đ/g, 'd');
    string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    string = string.replace(/Đ/g, 'D');
    return string;
  },

  generatePassword: (
    length = 20,
    wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$',
  ) => Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map(x => wishlist[x % wishlist.length])
    .join(''),

  truncateText: (txt, limit = 65) => {
    if (txt.length <= limit) return txt;

    return `${txt.slice(0, limit).trim()}...`;
  },

  countPerPage: (no, currentPage, perPage = 20) => perPage * (currentPage - 1) + 1 + no,

  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array); // eslint-disable-line
    }
  },

  checkValidateErrors: (req) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return false;

    errors.array().forEach((error) => {
      req.flash('danger', error.msg);
    });

    return true;
  },

  genCryptoToken: () => new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err) reject(err);

      const token = buf.toString('hex');

      resolve(token);
    });
  }),

  generateRandStr: (length, type = 'mix') => {
    let characters;
    if (type === 'mix') {
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    } else if (type === 'numeric') {
      characters = '0123456789';
    }
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  fuzzySearch: (text) => {
    const regex = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    return new RegExp(regex, 'gi');
  },

  checkPermission,

  apiErrors,
  utils,

  apiResponse: (obj = {}, message = 'Thành công') => ({
    status: 200,
    code: 200,
    message,
    ...obj,
  }),

  validateSchema: schema => async (req, res, next) => {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        },
        {
          abortEarly: false,
        },
      );

      return next();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('««««« err »»»»»', err);
      return res
        .status(400)
        .json({ type: err.name, errors: err.errors, provider: 'YUP' });
    }
  },

  checkIdSchema: yup.object({
    params: yup.object({
      id: yup
        .string()
        .test('inValid', 'ID sai định dạng', value => ObjectId.isValid(value)),
    }),
  }),

  checkArrayIdSchema: yup.object({
    body: yup.object({
      idSelected: yup
        .array()
        .of(
          yup
            .string()
            .test('inValid', 'ID sai định dạng', value => ObjectId.isValid(value)),
        ),
    }),
  }),

  generateUniqueFileName: () => {
    const timestamp = Date.now();
    const randomChars = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomChars}`;
  },
};
