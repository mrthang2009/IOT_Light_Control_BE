const [
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
] = [400, 401, 403, 404, 409, 500];

module.exports = {
  // 400
  badRequest: {
    status: BAD_REQUEST,
    code: 400,
    message: 'Bad Request',
  },
  fileTooLarge: {
    status: BAD_REQUEST,
    code: 4001,
    message: 'Tệp quá lớn. Kích thước tối đa được phép là 15MB',
  },
  needExpectedDateOrTransactionDate: {
    status: BAD_REQUEST,
    code: 4002,
    message:
      'Creat new cashflow require at least one of two: expectedDate or transactionDate',
  },
  leaveRequestRequireStartDateAndEndDate: {
    status: FORBIDDEN,
    code: 4003,
    message: 'Leave request require start date and end date',
  },
  actionApproveDenyPendingCancel: {
    status: FORBIDDEN,
    code: 4004,
    message: 'Action must be APPROVED, DENIED, PENDING or CANCELLED',
  },
  statusCancelledOrPending: {
    status: FORBIDDEN,
    code: 4005,
    message: 'Status must be CANCELLED or PENDING',
  },
  statusPendingOrSuccess: {
    status: FORBIDDEN,
    code: 4006,
    message: 'Status must be PENDING or SUCCESS',
  },

  // 401
  invalidFbToken: {
    status: UNAUTHORIZED,
    code: 4011,
    message: 'Invalid Facebook Token',
  },
  requireAuthToken: {
    status: UNAUTHORIZED,
    code: 4012,
    message: 'Không có quyền truy cập',
  },
  userNotExists: {
    status: UNAUTHORIZED,
    code: 4013,
    message: 'User is not exists',
  },
  invalidAuthToken: {
    status: UNAUTHORIZED,
    code: 4014,
    message: 'Invalid Authorization',
  },
  tokenExpired: {
    status: UNAUTHORIZED,
    code: 4015,
    message: 'Authorization Expired',
  },
  invalidEmailOrPassword: {
    status: UNAUTHORIZED,
    code: 4016,
    message: 'Invalid email or password',
  },
  employeeNotExists: {
    status: UNAUTHORIZED,
    code: 4017,
    message: 'Employee is not exists',
  },
  organizationIdNotMatch: {
    status: UNAUTHORIZED,
    code: 4018,
    message: 'Organization ID does not match',
  },
  invalidUsernameOrPassword: {
    status: UNAUTHORIZED,
    code: 4019,
    message: 'Invalid username or password',
  },
  invalidUsernameOrPasswordOrOrganizationID: {
    status: UNAUTHORIZED,
    code: 40110,
    message: 'Invalid username or password or organization ID',
  },

  // 403
  forbidden: {
    status: FORBIDDEN,
    code: 403,
    message: 'Forbidden',
  },
  employeeAccountDisabled: {
    status: FORBIDDEN,
    code: 4031,
    message: 'Your employee account has been disabled',
  },
  listIsBlocked: {
    status: FORBIDDEN,
    code: 4032,
    message: 'User of list is blocked',
  },
  cantSendNotification: {
    status: FORBIDDEN,
    code: 4033,
    message: "You can't send notification",
  },
  organizationNoLongerActive: {
    status: FORBIDDEN,
    code: 4034,
    message: 'This organization is no longer active',
  },
  notInTheOrganization: {
    status: FORBIDDEN,
    code: 4035,
    message: 'You are not in this organization',
  },
  permissionDenied: {
    status: FORBIDDEN,
    code: 4036,
    message: 'Permission denied',
  },
  canNotEditRootRole: {
    status: FORBIDDEN,
    code: 4037,
    message: 'Bạn không thể xóa vai trò',
  },
  canNotEditYourRole: {
    status: FORBIDDEN,
    code: 4038,
    message: 'You can not edit your role',
  },
  canNotEditRootEmployeeRole: {
    status: FORBIDDEN,
    code: 4039,
    message: 'You can not edit root employee',
  },
  canNotAssignRootRole: {
    status: FORBIDDEN,
    code: 40310,
    message: 'You can not assign root role to employee',
  },
  cashflowTypeAssigned: {
    status: FORBIDDEN,
    code: 40311,
    message:
      'The cashflow type you delete is assigned for another cashflows, please select another cashflow type to replace the cashflow type that you delete',
  },
  cashflowTypeReplaceSameAsDeleted: {
    status: FORBIDDEN,
    code: 40312,
    message:
      'The cashflow type to you choose to replace is same as the one that you delete',
  },
  canNotDeleteYourOwnAccount: {
    status: FORBIDDEN,
    code: 40313,
    message: 'You can not delete your own account',
  },
  canNotDeleteRootEmployee: {
    status: FORBIDDEN,
    code: 40314,
    message: 'You can not delete root employee',
  },
  canNotApproveYourRequest: {
    status: FORBIDDEN,
    code: 40315,
    message: 'You can not approve your request',
  },
  notYourRequest: {
    status: FORBIDDEN,
    code: 40316,
    message: 'This is not your request',
  },
  requestHasBeenApproved: {
    status: FORBIDDEN,
    code: 40317,
    message: 'Your request has been approved, you can not edit it anymore',
  },
  requestHasBeenDenied: {
    status: FORBIDDEN,
    code: 40318,
    message: 'Your request has been denied, you can not edit it anymore',
  },
  projectManagerDeleted: {
    status: FORBIDDEN,
    code: 40319,
    message: 'Employee for the position of Project Manager has been deleted',
  },

  // 404
  notFound: {
    status: NOT_FOUND,
    code: 404,
    message: 'Không tìm thấy',
  },
  userNotFound: {
    status: NOT_FOUND,
    code: 4044,
    message: 'User not found',
  },
  listNotFound: {
    status: NOT_FOUND,
    code: 4045,
    message: 'List not found',
  },
  searchNotFound: {
    status: NOT_FOUND,
    code: 4046,
    message: 'Tìm kiếm không được tìm thấy',
  },
  friendNotFound: {
    status: NOT_FOUND,
    code: 4047,
    message: 'Friend not found',
  },
  notificationNotFound: {
    status: NOT_FOUND,
    code: 4048,
    message: 'Notification not found',
  },
  cashflowTypeNotFound: {
    status: NOT_FOUND,
    code: 4049,
    message: 'Cashflow Type not found',
  },
  projectManagerNotFound: {
    status: NOT_FOUND,
    code: 40410,
    message: 'Employee for the position of Project Manager not found',
  },

  // 409
  conflict: {
    status: CONFLICT,
    code: 409,
    message: 'Conflict',
  },
  friendExists: {
    status: CONFLICT,
    code: 4091,
    message: 'Friend is exists',
  },
  friendNotExists: {
    status: CONFLICT,
    code: 4092,
    message: 'Friend is not exists',
  },
  listExists: {
    status: CONFLICT,
    code: 4093,
    message: 'List is exists',
  },
  emailAlreadyExists: {
    status: CONFLICT,
    code: 4094,
    message: 'Email already exists',
  },
  usernameAlreadyExists: {
    status: CONFLICT,
    code: 4095,
    message: 'Username already exists',
  },
  organizationNameAlreadyExists: {
    status: CONFLICT,
    code: 4096,
    message: 'Organization name already exists',
  },

  // 500
  serverError: {
    status: INTERNAL_SERVER_ERROR,
    code: 500,
    message: 'Internal Server Error',
  },

  INVALID_ID: 'INVALID_ID',
  INVALID_ACCOUNT: 'INVALID_ACCOUNT',
  INVALID_VERIFICATION: 'INVALID_VERIFICATION',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  BAD_REQUEST: 'BAD_REQUEST',
  INACTIVATE_ACCOUNT: 'INACTIVATE_ACCOUNT',

  getBadRequestError(message, code, body = {}) {
    return {
      status: BAD_REQUEST,
      code,
      message,
      body,
    };
  },

  getConflictError(message, code, body = {}) {
    return {
      status: CONFLICT,
      code,
      message,
      body,
    };
  },
};
