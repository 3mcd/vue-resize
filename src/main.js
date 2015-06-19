var directives = {
  'resize': require('./directives/resize')
};

module.exports = {
  install: function (Vue) {
    for (var prop in directives) {
      Vue.directive(prop, directives[prop]);
    }
  }
};