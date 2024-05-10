/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const middleware = require('./middleware');

const v1_0_Routes = require('./v1.0/routes');

router.use('/v1.0', v1_0_Routes);

router.use(middleware.catch404);
router.use(middleware.catchError);

module.exports = router;
