// const aws = require('aws-sdk');
// const multerS3 = require('multer-s3-transform');
// const sharp = require('sharp');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
// aws.config.update({
//   secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
//   accessKeyId: process.env.AWS_ID_ACCESS_KEY,
//   region: process.env.AWS_REGION_CODE,
// });

// const s3 = new aws.S3();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// const storage = multerS3({
//   s3,
//   bucket: process.env.AWS_BUCKET,
//   acl: 'public-read',
//   cacheControl: 'max-age=31536000',
//   contentType: (req, file, cb) => {
//     cb(null, file.mimetype);
//   },
//   key: (req, file, cb) => {
//     const token = Math.random().toString(36).substr(7);
//     const filename = file.originalname;
//     const fileExtension = filename.split('.').reverse()[0].toLowerCase();

//     const now = new Date();

//     const uploadFileName =
// `${now.getFullYear()}/${now.getMonth() + 1}/${now.getTime() + token}.${fileExtension}`;

//     cb(null, uploadFileName);
//   },
//   shouldTransform: (req, file, cb) => {
//     cb(null, /^image/i.test(file.mimetype));
//   },
//   transforms: [{
//     id: 'original',
//     key: (req, file, cb) => {
//       const token = Math.random().toString(36).substr(7);
//       const filename = file.originalname;
//       const fileExtension = filename.split('.').reverse()[0].toLowerCase();

//       const now = new Date();

//       const uploadFileName =
// `${now.getFullYear()}/${now.getMonth() + 1}/${now.getTime() + token}.${fileExtension}`;

//       cb(null, uploadFileName);
//     },
//     transform: (req, file, cb) => {
//       cb(null, sharp());
//     },
//   }],
// });

// const limits = {
//   fileSize: 15 * 1024 * 1024,
// };

// function fileFilter(req, file, cb) {
//   const arr = [
//     'image/png',
//     'image/jpeg',
//     'application/pdf',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-powerpoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//   ];
//   if (arr.indexOf(file.mimetype) === -1) {
//     return cb({
//       status: 400,
//       message: 'File không hợp lệ',
//     });
//   }

//   cb(null, true);
// }

// const upload = multer({ storage, fileFilter, limits });

module.exports = { upload, S3 };
