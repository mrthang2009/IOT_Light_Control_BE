const express = require('express');
const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
} = require('../../../../helpers');
const {
  create,
  all,
  list,
  detail,
  updateInformation,
  updateStatus,
  deleteSingle,
  deleteMultiple,
} = require('./controllers');
const { deviceSchema } = require('./validation');

const router = express.Router();

router.route('/create').post(validateSchema(deviceSchema), create);

router.get('/all', all);
router.get('/list', list);
router
  .route('/delete/')
  .patch(validateSchema(checkArrayIdSchema), deleteMultiple);
router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), detail)
  .patch(validateSchema(checkIdSchema), deleteSingle);
router
  .route('/update-information/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(deviceSchema),
    updateInformation,
  );
router
  .route('/update-status/:id')
  .patch(validateSchema(checkIdSchema), updateStatus);

module.exports = router;
