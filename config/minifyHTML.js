const minifyHTML = require('express-minify-html');

module.exports = minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    html5: true,
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
  },
});
