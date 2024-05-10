const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  // port: process.env.EMAIL_PORT,
  service: process.env.EMAIL_SERVICE,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = smtpTransport;
