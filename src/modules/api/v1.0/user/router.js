const express = require('express');

const router = express.Router();

const {
  create,
  all,
  list,
  detail,
  updateInformation,
  changePassword,
  deleteSigle,
  deleteMultiple,
} = require('./controllers');

const {
  createUserSchema,
  editProfileUserSchema,
  passwordUserSchema,
} = require('./validation');

const {
  validateSchema,
  checkIdSchema,
  checkArrayIdSchema,
} = require('../../../../helpers');

router
  .route('/create')
  .post(validateSchema(createUserSchema), create);

router.get('/all', all);
router.get('/list', list);
router
  .route('/delete/')
  .patch(validateSchema(checkArrayIdSchema), deleteMultiple);
router
  .route('/detail/:id')
  .get(validateSchema(checkIdSchema), detail)
  .patch(validateSchema(checkIdSchema), deleteSigle);
router
  .route('/update-information/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(editProfileUserSchema),
    updateInformation,
  );
router
  .route('/change-password/:id')
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(passwordUserSchema),
    changePassword,
  );

module.exports = router;
