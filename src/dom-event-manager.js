function DOMEventHandler(spec) {
  this.el = spec.el;
  this.type = spec.type;
  this.fn = spec.fn;
}

DOMEventHandler.prototype = {
  bind: function () {
    this.el.addEventListener(this.type, this.fn);
  },
  unbind: function () {
    this.el.removeEventListener(this.type, this.fn);
  }
};

function DOMEventManager(el) {
  this.handlers = [];
  this.el = el;
}

DOMEventManager.prototype = {
  add: function (spec) {
    var handler;
    if (!spec.el && this.el) {
      spec.el = this.el;
    }
    if (!spec.el) {
      throw new Error('DOM event must have a reference to a valid window or element.');
    }
    handler = new DOMEventHandler(spec);
    this.handlers.push(handler);
    handler.bind();
  },
  remove: function (obj) {
    var handlers = this.handlers, handler;
    if (obj instanceof Function) {
      for (var i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i].fn === obj) {
          handler = handlers[i];
        }
      }
    }
    handlers.splice(handlers.indexOf(handler), 1);
    handler.unbind();
  },
  removeAll: function () {
    var handler;
    for (var i = this.handlers.length - 1; i >= 0; i--) {
      this.handlers[i].unbind();
    }
  }
};

module.exports = DOMEventManager;