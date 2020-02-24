const path = require('path');

module.exports = {
  entry: './lesson-8\\homework\\express-generator\\firstapp\\client.js',
  output: {
    path: path.join(__dirname, './lesson-8\\homework\\express-generator\\firstapp', 'public', 'javascripts'),
    publicPath: '',
    filename: 'client.js',
  },
};
