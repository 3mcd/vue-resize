var DOMEventManager = require('../dom-event-manager');

function noop() { return false; }

function getRect($el) {
  return $el.getBoundingClientRect();
}

function Handle(spec) {
  var _this = this;

  this.$el = document.createElement('div');
  this.$target = spec.target;
  this.type = spec.type;
  this.events = new DOMEventManager();

  this.$el.style.position = 'fixed';

  ['update', 'onMousedown', 'onMousemove', 'onMouseup'].forEach(function (fn) {
    _this[fn] = _this[fn].bind(_this);
  });

  this.events.add({ type: 'resize', el: window, fn: this.update });
  this.events.add({ type: 'mousedown', el: this.$el, fn: this.onMousedown });

  Handle._handles.push(this);
}

Handle.prototype = {

  onMousedown: function (e) {
    this.events.add({ type: 'mouseup', el: window, fn: this.onMouseup });
    this.events.add({ type: 'mousemove', el: window, fn: this.onMousemove });
  },

  onMousemove: function (e) {
    var v1, v2, x, y, diff, rect, afterRect, handler, undo;

    rect = getRect(this.$target);

    x = this.type === 'left' ? rect.left : this.type === 'right' ? rect.right : e.clientX;
    y = this.type === 'top' ? rect.top : this.type === 'bottom' ? rect.bottom : e.clientY;

    v1 = new Vec2(x, y);
    v2 = new Vec2(e.clientX, e.clientY);

    diff = this.type === 'left' || this.type === 'top' ? v1.diff(v2) : v2.diff(v1);

    this.resize(diff);

    afterRect = getRect(this.$target);

    Handle.updateAll();
  },

  onMouseup: function (e) {
    this.events.remove(this.onMouseup);
    this.events.remove(this.onMousemove);
  },

  update: function () {
    var _this = this;

    var rect = getRect(_this.$target);
    var handleWidth = 16;

    if (_this.type === 'top' || _this.type === 'bottom') {
      _this.$el.style.width = rect.width + 'px';
      _this.$el.style.height = handleWidth + 'px';
    }

    if (_this.type === 'left' || _this.type === 'right') {
      _this.$el.style.height = rect.height + 'px';
      _this.$el.style.width = handleWidth + 'px';
    }

    switch (_this.type) {
      case 'bottom':
        _this.$el.style.left = rect.left + 'px';
        _this.$el.style.top = rect.bottom - (handleWidth / 2) + 'px';
        break;
      case 'top':
        _this.$el.style.left = rect.left + 'px';
        _this.$el.style.top = rect.top - (handleWidth / 2) + 'px';
        break;
      case 'right':
        _this.$el.style.top = rect.top + 'px';
        _this.$el.style.left = rect.right - (handleWidth / 2) + 'px';
        break;
      case 'left':
        _this.$el.style.top = rect.top + 'px';
        _this.$el.style.left = rect.left - (handleWidth / 2) + 'px';
        break;
    }
  },

  appendTo: function ($el) {
    var result = ($el || this.$target).appendChild(this.$el);
    return result;
  },

  remove: function () {
    if (this.$el.parentElement)
      return this.$el.parentElement.removeChild(this.$el);
  },

  resize: function (vec2) {
    var _this = this;
    var rect = getRect(this.$target);
    var $siblings = this.$target.parentElement.children;

    var captures = [];

    for (var i = 0; i < $siblings.length; i++) {
      captures.push($siblings[i].style.flexGrow);
      $siblings[i].style.flexGrow = 0;
    }

    var shrink = this.$target.style.flexShrink = 0;

    if (vec2.x) {
      this.$target.style.width = rect.width + vec2.x + 'px';
    }

    if (vec2.y) {
      this.$target.style.height = rect.height + vec2.y + 'px';
    }

    for (var j = 0; j < $siblings.length; j++) {
      $siblings[j].style.flexGrow = captures[j];
    }

    this.$target.style.flexShrink = shrink;
  }

};

Handle._handles = [];

Handle.updateAll = function() {
  for (var i = this._handles.length - 1; i >= 0; i--) {
    this._handles[i].update();
  }
}.bind(Handle);

function Vec2(x, y) {
  this.x = x;
  this.y = y;
}

Vec2.prototype.diff = function diff(v1) {
    return new Vec2(this.x - v1.x, this.y - v1.y);
};

document.addEventListener('scroll', Handle.updateAll, true);

module.exports = {

  bind: function () {
    this.handles = [];
  },

  removeAll: function () {
    var handles = this.handles, handle;
    for (var i = handles.length - 1; i >= 0; i--) {
      handles[i].events.removeAll();
      handles[i].remove();
    }
  },

  update: function (spec) {
    var _this = this, before, handles, handle;

    handles = spec instanceof Array ? spec : spec.handles;

    if (spec instanceof Function) {
      spec = spec.call(this);
    }

    before = spec.before || noop;

    (function createHandle(i) {
      handles[i].target = _this.el;

      var handle = new Handle(handles[i]);

      (handles[i].before instanceof Function ? handles[i].before : before)(handle);

      handle.appendTo(_this.el);

      _this.vm.$root.constructor.nextTick(function () {
        handle.update();
      });

      _this.handles.push(handle);

      if (i > 0) createHandle(--i);
    }(handles.length - 1));
  },

  unbind: function () {
    this.removeAll();
  }

};
