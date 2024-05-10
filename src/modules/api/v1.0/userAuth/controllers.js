
const { Employee } = require('../../../../models');
const { apiErrors, apiResponse, utils } = require('../../../../helpers');
const Jwt = require('../../../../services/jwt');

const getEmployeeInfo = (employee, token, refreshToken = '') => ({
  _id: employee._id,
  token,
  refreshToken,
});

const tokenList = {};

module.exports = {
  onLogin: async (req, res, next) => {
    try {
      const { username, password, organizationID } = req.body;
      const employees = await Employee
        .find({ username })
        .select('password organization deletedAt')
        .populate('organization', 'organizationId deletedAt');

      const employee = employees.find(el => el.organization.organizationId === organizationID);

      if (!employee || !employee.password || !employee.comparePassword(password)) {
        return next(apiErrors.invalidUsernameOrPasswordOrOrganizationID);
      }

      if (
        employee
        && employee.organization
        && employee.organization.organizationId !== organizationID
      ) {
        return next(apiErrors.organizationIdNotMatch);
      }

      if (
        employee
        && employee.organization
        && employee.organization.deletedAt
      ) {
        return next(apiErrors.organizationNoLongerActive);
      }

      if (employee.deletedAt) {
        return next(apiErrors.employeeAccountDisabled);
      }

      const token = Jwt.generateEmployeeToken(employee);
      const refreshToken = Jwt.generateEmployeeRefreshToken(employee);
      tokenList[refreshToken] = employee;
      res.json(apiResponse(getEmployeeInfo(employee, token, refreshToken)));
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

        const employee = await Employee
          .findById(user._id)
          .select('deletedAt');

        if (employee.deletedAt) {
          return next(apiErrors.employeeAccountDisabled);
        }

        const token = Jwt.generateEmployeeToken(user);
        res.json(apiResponse(getEmployeeInfo(user, token)));
      } else {
        return res.json(apiErrors.badRequest);
      }
    } catch (error) {
      next(error);
    }
  },
};
