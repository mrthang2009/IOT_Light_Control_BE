const express = require('express');

const router = express.Router();

const {
  create,
  all,
  getPermissions,
  list,
  detail,
  update,
  deleteSingle,
  deleteMultiple,
} = require('./controllers');
const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
} = require('../../../../helpers');

const { roleSchema } = require('./validations');

router.route('/permissions').get(getPermissions);
router.route('/create').post(validateSchema(roleSchema), create);

router.get('/list', list);
router.get('/all', all);
router.route('/delete').patch(validateSchema(checkArrayIdSchema), deleteMultiple);

router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), detail)
  .patch(validateSchema(checkIdSchema), deleteSingle);


router.route('/update/:id').patch(validateSchema(checkIdSchema), update);
module.exports = router;
