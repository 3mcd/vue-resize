(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["VueResize"] = factory();
	else
		root["VueResize"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var directives = {
	  'resize': __webpack_require__(1)
	};

	module.exports = {
	  install: function (Vue) {
	    for (var prop in directives) {
	      Vue.directive(prop, directives[prop]);
	    }
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var DOMEventManager = __webpack_require__(2);

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

	      this.vm.constructor.nextTick(function () {
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ }
/******/ ])
});
;