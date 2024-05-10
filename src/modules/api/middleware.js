const { apiErrors } = require('../../helpers');

module.exports = {
  catch404: (req, res, next) => next(apiErrors.notFound),

  catchError: (err, req, res, next) => { // eslint-disable-line
    if (err.status) {
      return res.status(err.status).json(err);
    }

    return res.status(500).json({
      ...apiErrors.serverError,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  },
};
