const minify = require('@node-minify/core');
const cleanCSS = require('@node-minify/clean-css');
const uglifyES = require('@node-minify/uglify-es');

/* Minify css */
minify({
  compressor: cleanCSS,
  input: './src/public/admin/css/adminlte.css',
  output: './src/public/admin/css/adminlte.min.css',
  callback(err) {
    // eslint-disable-next-line no-console
    if (err) return console.log(err);

    // eslint-disable-next-line no-console
    console.log('Compressed adminlte.css 📺 👌');
  },
});

/* Minify js */
minify({
  compressor: uglifyES,
  publicFolder: './src/public/admin/js/',
  input: ['adminlte.js', 'custom.js'],
  output: '$1.min.js',
  callback(err) {
    // eslint-disable-next-line no-console
    if (err) return console.log(err);

    // eslint-disable-next-line no-console
    console.log('Compressed JS 📺 👌');
  },
});
