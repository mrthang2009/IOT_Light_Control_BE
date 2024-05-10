const jwt = require('jsonwebtoken');

const { promisify } = require('util');

const verify = promisify(jwt.verify);

module.exports = {
  verifyToken: token => verify(token, process.env.JWT_SECRET),

  generateUserToken: user => jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE },
  ),

  generateUserRefreshToken: user => jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE },
  ),

  generateEmployeeToken: employee => jwt.sign(
    {
      _id: employee._id,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE },
  ),

  generateEmployeeRefreshToken: employee => jwt.sign(
    {
      _id: employee._id,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE },
  ),

  generatePurchaseToken: userProduct => jwt.sign(
    userProduct,
    process.env.JWT_SECRET,
  ),

  decodedToken: token => jwt.decode(token),
};
