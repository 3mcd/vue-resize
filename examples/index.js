(function () {

  'use-strict';

  Vue.use(VuePanel);
  Vue.use(VueResize);

  function processHandle(handle) {
    handle.$el.classList.add('Handle');
    handle.$el.classList.add('Handle--' + handle.type);
  }

  var app = new Vue({
    el: '#app',
    data: {
      resizeA: {
        before: processHandle,
        handles: [
          { type: 'left' }
        ]
      },
      resizeB: {
        before: processHandle,
        handles: [
          { type: 'left' },
          { type: 'right' }
        ]
      },
      resizeC: {
        before: processHandle,
        handles: [
          { type: 'bottom' }
        ]
      }
    }
  });

  window.app = app;
}());