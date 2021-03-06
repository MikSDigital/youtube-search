/******/ (function(modules) { // webpackBootstrap
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

	'use strict';

	var _App = __webpack_require__(1);

	var _App2 = _interopRequireDefault(_App);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var style = __webpack_require__(10);
	var app = new _App2.default();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(2);

	var _SearchEngine = __webpack_require__(3);

	var _SearchEngine2 = _interopRequireDefault(_SearchEngine);

	var _ControlsView = __webpack_require__(4);

	var _ControlsView2 = _interopRequireDefault(_ControlsView);

	var _MarksView = __webpack_require__(7);

	var _MarksView2 = _interopRequireDefault(_MarksView);

	var _constants = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var App = function App() {
	  var _this = this;

	  _classCallCheck(this, App);

	  this.init = function () {
	    _this.$videoElement = (0, _util.$)(_constants.VIDEO_ELEMENT_CLASS);
	  };

	  this.createViews = function () {
	    _this.resultView = new _MarksView2.default({
	      onTimeChange: _this.goToTime
	    });
	    _this.controlsView = new _ControlsView2.default({
	      onSearchQueryChange: _this.onSearchQueryChange,
	      onClose: _this.clear
	    });
	  };

	  this.removeViews = function () {
	    if (_this.controlsView) {
	      _this.controlsView.remove();
	      _this.controlsView = null;
	      _this.resultView.remove();
	      _this.resultView = null;
	    }
	  };

	  this.onSearchQueryChange = function (query) {
	    _this.clear();
	    if (query.length < 3) {
	      return;
	    }
	    var occurrences = _this.searchEngine.search(query);
	    _this.resultView.render(occurrences);
	  };

	  this.clear = function () {
	    _this.resultView.clear();
	  };

	  this.goToTime = function (time) {
	    _this.$videoElement.currentTime = time - 1;
	  };

	  this.handleSubtitlesLoad = function (response) {
	    _this.removeViews();
	    _this.searchEngine = new _SearchEngine2.default(response);
	    _this.createViews();
	  };

	  this.httpSpy = function (xhr) {
	    if (!xhr.responseURL.includes('timedtext')) {
	      return;
	    }

	    _this.handleSubtitlesLoad(xhr.responseText);
	  };

	  (0, _util.spyOnHttp)(this.httpSpy);
	  (0, _util.onUrlChange)(this.removeViews);
	  _util.$.on(document, 'DOMContentLoaded', this.init);
	}

	/**
	 * @param  {number} time
	 */


	/**
	 * @param  {string} response - text that represents subtitles
	 */


	/**
	 * @param {XMLHttpRequest} xhr
	 */
	;

	exports.default = App;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.$ = $;
	exports.formatTime = formatTime;
	exports.triggerEvent = triggerEvent;
	exports.padWithZero = padWithZero;
	exports.debounce = debounce;
	exports.spyOnHttp = spyOnHttp;
	exports.getParent = getParent;


	/**
	 * @param {string} className
	 * @return {HTMLElement}
	 */
	function $(className) {
	  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

	  return element.getElementsByClassName(className)[0];
	}

	$.createElement = document.createElement.bind(document);

	$.on = function (element, eventName, callback) {
	  element.addEventListener(eventName, callback, false);
	};

	/**
	 * templating
	 * @param  {string} string
	 * @param  {Object} data   data for template
	 * @return {HTMLElement}
	 */
	$.renderFromString = function (string) {
	  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  var wrapper = $.createElement('div');

	  for (var key in data) {
	    string = string.replace('{{' + key + '}}', data[key]);
	  }
	  wrapper.innerHTML = string;
	  return wrapper.children[0];
	};

	/**
	 * @param  {number} time time in seconds
	 * @return {string}      string in [hh:]MM:ss format
	 */
	function formatTime(time) {
	  var hours = Math.floor(time / 3600);
	  var rest = time % 3600;
	  var minutes = Math.floor(rest / 60);
	  var seconds = Math.round(rest % 60);
	  var result = '';
	  if (hours) {
	    result = hours + ':';
	  }
	  result += padWithZero(minutes) + ':' + padWithZero(seconds);
	  return result;
	};

	/**
	 * @param  {HTMLElement} $element 
	 * @param  {string} eventName
	 */
	function triggerEvent($element, eventName) {
	  var event;
	  event = document.createEvent('HTMLEvents');
	  event.initEvent(eventName, true, true);
	  event.eventName = eventName;
	  $element.dispatchEvent(event);
	};

	/**
	 * @param  {number} number
	 * @return {string}
	 */
	function padWithZero(number) {
	  return number > 9 ? number : '0' + number;
	};

	/**
	 * debounce
	 * @param  {number}   delay
	 * @param  {Function} callback
	 * @return {Funciton}
	 */
	function debounce(delay, callback) {
	  var timeout = null;

	  return function () {
	    var _arguments = arguments;

	    clearTimeout(timeout);
	    timeout = setTimeout(function () {
	      callback.apply(null, _arguments);
	    });
	  };
	}

	/**
	 * track http requirest
	 * @param  {Function} callback
	 */
	function spyOnHttp(callback) {
	  var send = XMLHttpRequest.prototype.send;

	  XMLHttpRequest.prototype.send = function () {
	    this.onload = function () {
	      callback(this);
	    };
	    send.apply(this, arguments);
	  };
	}

	/**
	 * get parent that mathes filter
	 * @param  {HTMLElement} $node  startNode
	 * @param  {Function} filter
	 * @return {HTMLElement}
	 */
	function getParent($node, filter) {
	  var $currentNode = $node;

	  while (!filter($currentNode) && $currentNode) {
	    $currentNode = $currentNode.parentNode;
	  }

	  return $currentNode;
	}

	var onUrlChange = exports.onUrlChange = function () {
	  var lastHref = location.href;
	  return function (callback) {
	    setInterval(function () {
	      var newHref = location.href;
	      if (lastHref !== newHref) {
	        lastHref = newHref;
	        callback(newHref);
	      }
	    }, 1000);
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SearchEngine = function () {
	  function SearchEngine(text) {
	    _classCallCheck(this, SearchEngine);

	    this.setData(text);
	  }
	  /**
	   *
	   * @param {string} query
	   * @returns {Array}
	   */


	  _createClass(SearchEngine, [{
	    key: 'searchInChunks',
	    value: function searchInChunks(query) {
	      var currentOffset = 0;
	      var currentSearchResult = void 0;
	      var result = [];
	      query = query.trim().replace(/\s+/, ' ');

	      do {
	        currentSearchResult = this.searchFromIndex(query, currentOffset);
	        if (currentSearchResult) {
	          result.push(currentSearchResult);
	          currentOffset = currentSearchResult.offsetEnd;
	        }
	      } while (currentSearchResult);

	      return result;
	    }
	  }, {
	    key: 'searchFromIndex',
	    value: function searchFromIndex(query, startIndex) {
	      var offsetStart = this.getSubstringStart(query, startIndex);
	      if (offsetStart === -1) {
	        return null;
	      }
	      var offsetEnd = offsetStart + query.length;

	      var firstChunkOffset = this.getClosestLeftChunkOffset(offsetStart);
	      var lastChunkOffset = this.getClosestLeftChunkOffset(offsetEnd);
	      var chunks = this.getChunksInSegment(firstChunkOffset, lastChunkOffset);
	      var time = this.getChunksStartTime(chunks);

	      return {
	        chunks: chunks,
	        offsetStart: offsetStart,
	        offsetEnd: offsetEnd,
	        time: time
	      };
	    }
	  }, {
	    key: 'getChunksStartTime',
	    value: function getChunksStartTime(chunks) {
	      var firstChunk = chunks[0].data;
	      return this.getTime(firstChunk);
	    }
	  }, {
	    key: 'getChunksInSegment',
	    value: function getChunksInSegment(start, end) {
	      var result = [];
	      for (var offset = start; offset <= end; offset++) {
	        var chunk = this.mapOffsetToChunk(offset);
	        if (chunk) {
	          result.push({
	            offset: offset,
	            data: chunk
	          });
	        }
	      }
	      return result;
	    }
	  }, {
	    key: 'getClosestLeftChunkOffset',
	    value: function getClosestLeftChunkOffset(offset) {
	      var result = void 0;
	      do {
	        result = this.mapOffsetToChunk(offset);
	        offset--;
	      } while (offset && !result);

	      return offset + 1;
	    }
	  }, {
	    key: 'getSubstringStart',
	    value: function getSubstringStart(query, startIndex) {
	      return this.subtitles.indexOf(query, startIndex);
	    }

	    /**
	     * get time offset of specified sentence
	     * @param  {HTMLElement} chunk
	     * @return {number} time in seconds
	     */

	  }, {
	    key: 'getTime',
	    value: function getTime(chunk) {
	      return chunk.getAttribute('t') / 1000;
	    }

	    /**
	     * init textChunks
	     * @param  {string} text - text that represents subtitles
	     */

	  }, {
	    key: 'setData',
	    value: function setData(text) {
	      var parser = new DOMParser();
	      var subtitles = parser.parseFromString(text, 'text/xml');
	      var sentences = subtitles.getElementsByTagName('p');

	      // remove spaces
	      this.textChunks = [].slice.call(sentences, 0).map(function (chunk) {
	        var cleanText = chunk.textContent.replace(/\s+/g, ' ');
	        chunk.textContent = cleanText;
	        return chunk;
	      });
	      this.subtitles = this.textChunks.map(function (chunk) {
	        return chunk.textContent.trim();
	      }).filter(function (item) {
	        return item;
	      }).join(' ');
	      this.initOffsets();
	    }
	  }, {
	    key: 'initOffsets',
	    value: function initOffsets() {
	      var offsets = {};
	      var currentOffset = 0;
	      this.textChunks.forEach(function (chunk) {
	        offsets[currentOffset] = chunk;
	        currentOffset += chunk.textContent.length;
	      });
	      this.offsets = offsets;
	    }
	  }, {
	    key: 'mapOffsetToChunk',
	    value: function mapOffsetToChunk(offset) {
	      return this.offsets[offset];
	    }

	    /**
	     * @param  {string} query
	     * @return {Array<string>} occurrences
	     */

	  }, {
	    key: 'search',
	    value: function search(query) {
	      var res = this.searchInChunks(query);
	      return res;
	    }
	  }]);

	  return SearchEngine;
	}();

	exports.default = SearchEngine;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	var _constants = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ControlsView = function () {
	  function ControlsView(props) {
	    var _this = this;

	    _classCallCheck(this, ControlsView);

	    this.handleKeyDown = function (event) {
	      // prevent default actions (i.e. full screen)
	      event.stopPropagation();
	      // close on escape
	      if (event.keyCode === 27) {
	        _this.close();
	        return;
	      } else {
	        _this.handleChange();
	      }
	    };

	    this.handleChange = function () {
	      var query = _this.$input.value;
	      _this.props.onSearchQueryChange(query);
	    };

	    this.open = function () {
	      _this.opened = true;
	      _this.render();
	    };

	    this.close = function () {
	      _this.opened = false;
	      _this.$input.value = '';
	      _this.render();
	      _this.props.onClose();
	    };

	    this.opened = false;
	    this.handleChange = (0, _util.debounce)(1000, this.handleChange);
	    this.props = props;
	    this.init();
	    this.render();
	  }

	  _createClass(ControlsView, [{
	    key: 'init',
	    value: function init() {
	      this.$container = (0, _util.$)(_constants.CONTAINER_CLASS);
	      this.$videoElement = (0, _util.$)(_constants.VIDEO_ELEMENT_CLASS);
	      this.remplate = __webpack_require__(6);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.$node) {
	        this.$container.removeChild(this.$node);
	      }

	      var tabIndexInput = this.open ? '' : 'tabindex="-1"';
	      var tabIndexClose = this.open ? 'tabindex="-1"' : '';
	      this.$node = _util.$.renderFromString(this.remplate, {
	        className: this.opened ? _constants.OPENED_FORM_CLASS : '',
	        tabIndexInput: tabIndexInput,
	        tabIndexClose: tabIndexClose
	      });

	      this.initEvents();

	      var $firstControl = this.$container.children[0];
	      this.$container.insertBefore(this.$node, $firstControl);
	    }
	  }, {
	    key: 'initEvents',
	    value: function initEvents() {
	      var $buttonOpen = (0, _util.$)(_constants.BUTTON_OPEN_CLASS, this.$node);
	      var $buttonClose = (0, _util.$)(_constants.BUTTON_CLOSE_CLASS, this.$node);
	      var $input = (0, _util.$)(_constants.INPUT_CLASS, this.$node);
	      this.$input = $input;
	      _util.$.on($buttonOpen, 'click', this.open);
	      _util.$.on($buttonClose, 'click', this.close);
	      _util.$.on($input, 'keydown', this.handleKeyDown);
	    }

	    /**
	     * @param  {Event} event
	     */


	    /**
	     */


	    /**
	     * open controls popup
	     */


	    /**
	     * close controls popup
	     */

	  }, {
	    key: 'remove',
	    value: function remove() {
	      this.$container.removeChild(this.$node);
	      this.$node = null;
	    }
	  }]);

	  return ControlsView;
	}();

	exports.default = ControlsView;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CONTAINER_CLASS = exports.CONTAINER_CLASS = 'ytp-right-controls';
	var TIMELINE_CLASS = exports.TIMELINE_CLASS = 'ytp-progress-bar-padding';
	var SUBTITLES_BUTTON_CLASS = exports.SUBTITLES_BUTTON_CLASS = 'ytp-subtitles-button';
	var DURATION_CLASS = exports.DURATION_CLASS = 'ytp-time-duration';
	var VIDEO_ELEMENT_CLASS = exports.VIDEO_ELEMENT_CLASS = 'video-stream';
	var PROGRESS_BAR_CLASS = exports.PROGRESS_BAR_CLASS = 'ytp-progress-bar';
	var BOTTOM_PANE_CLASS = exports.BOTTOM_PANE_CLASS = 'ytp-chrome-bottom';

	var OPENED_FORM_CLASS = exports.OPENED_FORM_CLASS = 'ms-search-form-opened';
	var BUTTON_OPEN_CLASS = exports.BUTTON_OPEN_CLASS = 'ms-search-button';
	var BUTTON_CLOSE_CLASS = exports.BUTTON_CLOSE_CLASS = 'ms-close-button';
	var INPUT_CLASS = exports.INPUT_CLASS = 'ms-search-input';

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ms-search-form {{className}}\">\n  <input\n    type=\"text\"\n    class=\"ms-search-input\"\n    {{tabIndexInput}}\n    placeholder=\"Search...\"\n    autofocus\n  >\n  <button class=\"ms-search-button\">\n    <span class=\"ms-search-icon\"></span>\n  </button>\n  <button class=\"ms-close-button\">\n    <span class=\"ms-search-icon\"></span>\n  </button>\n</div>\n"

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	var _constants = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MarksView = function () {
	  function MarksView(props) {
	    var _this = this;

	    _classCallCheck(this, MarksView);

	    this.clickHandler = function (event) {
	      var $target = event.target;
	      var $mark = (0, _util.getParent)($target, function ($node) {
	        return $node.hasAttribute('data-time');
	      });
	      var timeString = $mark.getAttribute('data-time');
	      var time = Number.parseInt(timeString, 10);
	      _this.onTimeChange(time);
	    };

	    this.onTimeChange = props.onTimeChange;

	    this.$timeline = (0, _util.$)(_constants.TIMELINE_CLASS);
	    this.$progressBar = (0, _util.$)(_constants.PROGRESS_BAR_CLASS);
	    this.$bottomPane = (0, _util.$)(_constants.BOTTOM_PANE_CLASS);
	    this.markTemplate = __webpack_require__(8);
	    this.markContainerTemplate = __webpack_require__(9);

	    this.renderContainer();
	  }

	  /**
	   * get duration in seconds
	   * @return {number}
	   */


	  _createClass(MarksView, [{
	    key: 'getDuration',
	    value: function getDuration() {
	      if (!this.duration) {
	        var stringValue = this.$progressBar.getAttribute('aria-valuemax');
	        var value = Number.parseInt(stringValue, 10);
	        this.duration = value;
	      }

	      return this.duration;
	    }

	    /**
	     * get width of one second (in pixels)
	     * @return {number}
	     */

	  }, {
	    key: 'getSecondWidth',
	    value: function getSecondWidth() {
	      return this.$timeline.offsetWidth / this.getDuration();
	    }

	    /**
	     * @param  {number} time - time in seconds
	     */

	  }, {
	    key: 'appendMark',
	    value: function appendMark(time) {
	      var timeString = (0, _util.formatTime)(time);
	      var markWidth = 50;
	      var left = time * this.getSecondWidth() - markWidth / 2;

	      var $node = _util.$.renderFromString(this.markTemplate, {
	        time: timeString,
	        timeValue: time,
	        left: left
	      });

	      this.$container.appendChild($node);
	    }

	    /**
	     * create container, save ref to the node
	     */

	  }, {
	    key: 'renderContainer',
	    value: function renderContainer() {
	      var $node = _util.$.renderFromString(this.markContainerTemplate);
	      this.$container = $node;
	      _util.$.on(this.$container, 'click', this.clickHandler);
	      this.$bottomPane.appendChild($node);
	    }
	  }, {
	    key: 'render',


	    /**
	     * @param  {Array<Object>} list
	     */
	    value: function render(list) {
	      var _this2 = this;

	      list.forEach(function (item) {
	        _this2.appendMark(item.time);
	      });
	    }

	    /**
	     */

	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.$container.innerHTML = '';
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      this.$container.parentNode.removeChild(this.$container);
	      this.$container = null;
	    }
	  }]);

	  return MarksView;
	}();

	exports.default = MarksView;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "<span\n  class=\"ms-timeline-mark\"\n  style=\"left: {{left}}px\"\n  data-time=\"{{timeValue}}\"\n>\n  <span>{{time}}</span>\n</span>\n"

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ms-mark-container\"></div>\n"

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(12)();
	// imports


	// module
	exports.push([module.id, "\n.ms-timeline-mark {\n  position: absolute;\n  top: -50px;\n  width: 20px;\n  height: 20px;\n  background: #333;\n  border-radius: 3px 3px 0 0;\n  text-align: center;\n  line-height: 20px;\n  display: inline-block;\n  z-index: 1;\n  font-size: 0;\n  margin-left: 15px;\n  border: 1px solid #f2f2f2;\n  cursor: pointer;\n}\n\n.ms-timeline-mark span {\n  z-index: 1;\n  position: relative;\n}\n\n.ms-timeline-mark:hover {\n  width: 50px;\n  font-size: 11px;\n  border-radius: 3px;\n  margin-left: 0;\n  z-index: 10;\n}\n\n.ytp-chrome-bottom {\n  z-index: 1002 !important;\n}\n\n.ytp-popup {\n  z-index: 1003 !important;\n}\n\n.ytp-chrome-controls {\n  position: relative;\n  z-index: 1 !important;\n}\n\n.ms-timeline-mark:after {\n  content: ' ';\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-style: solid;\n  background-color: #333;\n  width: 14px;\n  height: 14px;\n  left: 50%;\n  bottom: -8px;\n  margin-left: -7px;\n  border: 1px solid #f2f2f2;\n  border-left: none;\n  border-top: none;\n  transform: rotate(45deg);\n  -webkit-transform: rotate(45deg);\n}\n\n.ms-search-form {\n  display: inline-block;\n  vertical-align: top;\n}\n\n.ms-search-form button {\n  color: #f2f2f2;\n  font-weight: bold;\n  display: inline-block;\n  width: 35px;\n  height: 35px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n\n.ms-search-form input {\n  background-color: rgba(0, 0, 0, .5);\n  border: 1px solid #777;\n  height: 26px;\n  border-radius: 5px;\n  color: #f2f2f2;\n  font-size: 16px;\n  text-indent: 10px;\n}\n\n.ms-search-form input:focus,\n.ms-search-form button:focus {\n  box-shadow: inset 0 0 0 2px rgba(27, 127, 204, .8);\n}\n.ms-search-form input::-webkit-input-placeholder {\n  color: #777;\n  font-weight: normal;\n  font-style: italic;\n}\n\n.ms-search-form input,\n.ms-search-form .ms-close-button {\n  display: none;\n}\n\n.ms-search-form.ms-search-form-opened input,\n.ms-search-form.ms-search-form-opened .ms-close-button {\n  display: inline-block;\n}\n\n.ms-search-form.ms-search-form-opened .ms-search-button {\n  display: none;\n}\n\n.ms-mark-container {\n  position: absolute;\n  bottom: 30px;\n  width: 100%;\n}\n\n.ms-search-icon {\n  background-image: url(" + __webpack_require__(13) + ");\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center bottom;\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  position: relative;\n  top: 2px;\n}", ""]);

	// exports


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);