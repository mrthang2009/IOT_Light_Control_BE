const express = require('express');
const {
  checkAuth,
  // checkEmployeeAuth,
  // checkOrganizationDeleted,
  // checkPermission,
} = require('./middleware');

const router = express.Router();

const deviceRouters = require('./device/router');
const userRoutes = require('./user/router');
const roleRoutes = require('./role/routes');
const userAuthRouters = require('./userAuth/routes');


router.use('/user-auth', userAuthRouters);
router.use('/users', checkAuth, userRoutes);
router.use('/devices', deviceRouters);
router.use('/roles', roleRoutes);

module.exports = router;
