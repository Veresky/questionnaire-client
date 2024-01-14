const mocks = require('require-all')(__dirname);

module.exports = function(app) {
  Object.keys(mocks).forEach((key) => {
    if (key != "index") {
      mocks[key](app);
    }
  });
}
