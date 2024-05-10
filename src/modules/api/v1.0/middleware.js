const { validationResult } = require('express-validator');

const { User, Employee, Organization } = require('../../../models');
const { apiErrors, checkPermission } = require('../../../helpers');
const Jwt = require('../../../services/jwt');

module.exports = {
  checkAuth: async (req, res, next) => {
    try {
      const { authorization: token } = req.headers;

      if (!token) {
        return next(apiErrors.requireAuthToken);
      }

      const { _id: userId } = await Jwt.verifyToken(token);

      const user = await User.findById(userId).lean();

      if (!user) {
        return next(apiErrors.userNotExists);
      }

      if (user.isBlocked) {
        return next(apiErrors.userIsBlocked);
      }

      req.user = {
        id: user._id,
      };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(apiErrors.invalidAuthToken);
      }

      if (error.name === 'TokenExpiredError') {
        return next(apiErrors.tokenExpired);
      }

      next(error);
    }
  },

  checkEmployeeAuth: async (req, res, next) => {
    try {
      const { authorization: token } = req.headers;

      if (!token) {
        return next(apiErrors.requireAuthToken);
      }

      const { _id: employeeId } = await Jwt.verifyToken(token);

      const employee = await Employee.findById(employeeId).lean();

      if (!employee) {
        return next(apiErrors.employeeNotExists);
      }

      if (employee.deletedAt) {
        return next(apiErrors.employeeAccountDisabled);
      }

      req.employee = {
        id: employee._id,
        organization: employee.organization,
      };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(apiErrors.invalidAuthToken);
      }

      if (error.name === 'TokenExpiredError') {
        return next(apiErrors.tokenExpired);
      }

      next(error);
    }
  },

  handleValidate: (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    return res.status(400).json({
      ...apiErrors.badRequest,
      errors: errors.array(),
    });
  },

  checkOrganizationDeleted: async (req, res, next) => {
    try {
      const { organization: organizationId } = req.employee;

      const organization = await Organization.findById(organizationId).select(
        'deletedAt',
      );

      if (!organization || organization.deletedAt) {
        return next(apiErrors.organizationNoLongerActive);
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  checkPermission: async (req, res, next) => {
    const currentEmployee = await Employee.findById(req.employee.id)
      .select(
        'firstName lastName middleName avatar deletedAt role organization',
      )
      .populate('role', 'isRoot organization permissions deletedAt')
      .lean();

    if (currentEmployee.deletedAt) {
      return next(apiErrors.employeeAccountDisabled);
    }

    if (!currentEmployee.role) {
      return next(apiErrors.permissionDenied);
    }

    res.locals.currentEmployee = {
      _id: currentEmployee._id,
      firstName: currentEmployee.firstName,
      lastName: currentEmployee.lastName,
      middleName: currentEmployee.middleName,
      avatar: currentEmployee.avatar,
      organization: currentEmployee.organization,
    };

    if (currentEmployee.role && currentEmployee.role.deletedAt) {
      currentEmployee.role.permissions = [];
    }

    const { isAllow, denyRoutes } = checkPermission(
      req._parsedOriginalUrl.pathname,
      req.method.toLowerCase(),
      currentEmployee.role.permissions,
    );

    res.locals.denyRoutes = currentEmployee.role.isRoot ? [] : denyRoutes;

    if (
      currentEmployee.organization.toString()
        !== currentEmployee.role.organization.toString()
      || (!isAllow && !currentEmployee.role.isRoot)
    ) {
      // if (req.xhr) {
      //   return res.status(403).json('Bạn không có quyền thực hiện việc này!');
      // }
      return next(apiErrors.permissionDenied);
    }

    next();
  },
};
