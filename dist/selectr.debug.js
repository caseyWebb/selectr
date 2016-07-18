(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["selectr"] = factory(require("jquery"));
	else
		root["selectr"] = factory(root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var jQuery,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	jQuery = __webpack_require__(1);
	
	if (!window.NO_STYLES) {
	  __webpack_require__(2);
	  if (window.POLYFILL_BOOTSTRAP_STYLES) {
	    __webpack_require__(6);
	  }
	}
	
	(function($, window) {
	  var Selectr;
	  Selectr = (function() {
	    Selectr.prototype.defaults = {
	      title: 'Select Options',
	      noMatchingOptionsText: 'No options found',
	      placeholder: 'Search',
	      resetText: 'Clear All',
	      width: '300px',
	      maxListHeight: '250px',
	      tooltipBreakpoint: 25,
	      maxSelection: Infinity,
	      panelStyle: 'default',
	      alwaysShowFooter: false
	    };
	
	    function Selectr(source1, args1) {
	      this.source = source1;
	      this.args = args1;
	      this.updateFooter = bind(this.updateFooter, this);
	      this.deselectOption = bind(this.deselectOption, this);
	      this.selectOption = bind(this.selectOption, this);
	      this.triggerChange = bind(this.triggerChange, this);
	      this.args = $.extend({}, this.defaults, this.args, this.source.data('selectr-opts'));
	      this.multi = this.source.prop('multiple');
	      this.createSelectr();
	      this.monitorSource();
	      this.selectrContainer.insertAfter(this.source);
	      this.selectrContainer = $(this.source.next());
	      this.bindEventListeners();
	      this.source.hide();
	    }
	
	    Selectr.prototype.createSelectr = function() {
	      this.selectrContainer = this.createContainer();
	      $('.list-group', this.selectrContainer).append(this.createOpts());
	      return this.updateFooter();
	    };
	
	    Selectr.prototype.createContainer = function() {
	      return $(document.createElement('div')).addClass("selectr panel panel-" + this.args.panelStyle + " " + (this.multi ? 'multi' : void 0)).css('width', this.args.width).html("<div class='panel-heading " + (this.args.title === '' ? "no-title" : void 0) + "'> <h4 class='panel-title'> " + this.args.title + " </h4> </div> <div class='panel-body'> <input class='form-control' placeholder='" + this.args.placeholder + "'> <span class='clear-search hidden'>&times;</span> </div> <ul class='list-group' style='max-height: " + this.args.maxListHeight + "'> </ul> <div class='no-matching-options hidden'> <strong>" + this.args.noMatchingOptionsText + "</strong> </div> <div class='panel-footer " + (!this.multi && !this.args.alwaysShowFooter ? 'hidden' : void 0) + "'> <button class='reset btn btn-sm btn-default' type='button'> " + this.args.resetText + " </button> " + (this.multi ? "<span class='current-selection badge'></span>" : '') + " </div>");
	    };
	
	    Selectr.prototype.createOpts = function() {
	      var i, len, opt, ref, results;
	      ref = $('option', this.source);
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        opt = ref[i];
	        results.push($(document.createElement('li')).addClass("list-group-item " + ($(opt).is(':selected') ? 'selected' : void 0)).data('val', $(opt).val()).append($(document.createElement('div')).addClass("color-code " + (!$(opt).data('selectr-color') ? 'no-color' : void 0)).css('background-color', $(opt).data('selectr-color'))).append($(document.createElement('div')).text($(opt).text()).addClass('option-name').attr({
	          title: $(opt).text().length > this.args.tooltipBreakpoint ? $(opt).text() : ''
	        })).append($(document.createElement('div')).html('&times').addClass("add-remove " + (!this.multi ? 'hidden' : void 0))));
	      }
	      return results;
	    };
	
	    Selectr.prototype.monitorSource = function() {
	      var _sync;
	      _sync = (function(_this) {
	        return function() {
	          var updatedList;
	          updatedList = $(document.createElement('ul')).addClass('list-group').css('max-height', _this.args.maxListHeight).append(_this.createOpts());
	          $('.list-group', _this.selectrContainer).replaceWith(updatedList);
	          return _this.updateFooter();
	        };
	      })(this);
	
	      /*
	      Update selectr on source element 'change' event
	      
	      Ideally, this should handle added/removed opts, as well
	      as a programatic changes to the selection, but many
	      popular data-binding frameworks do not fire change events,
	      so in that case, you will have to do so manually.
	       */
	      return this.source.on('change', function(e, selectrInitiated) {
	        if (selectrInitiated !== 'selectrInitiated') {
	          return _sync();
	        }
	      });
	    };
	
	    Selectr.prototype.bindEventListeners = function() {
	      var addRemoveHandler, clearSearchHandler, ctrlKeyDownHandler, ctrlKeyUpHandler, deselect, listItemHandler, multi, resetOptsHandler, searchHandler, select, selectrContainer, source, triggerChange, updateFooter;
	      multi = this.multi;
	      selectrContainer = this.selectrContainer;
	      source = this.source;
	      select = this.selectOption;
	      deselect = this.deselectOption;
	      triggerChange = this.triggerChange;
	      updateFooter = this.updateFooter;
	      listItemHandler = function(e) {
	        var modifyCurrentSelection, ref;
	        e.stopPropagation();
	        if (((ref = e.originalEvent) != null ? ref.detail : void 0) === 2) {
	          return;
	        }
	        modifyCurrentSelection = (e.ctrlKey || e.metaKey) && multi;
	        if ($(this).hasClass('selected') && (modifyCurrentSelection || $(this).siblings('.selected').length === 0) && multi) {
	          return deselect(this);
	        } else {
	          return select(modifyCurrentSelection, this);
	        }
	      };
	      addRemoveHandler = function(e) {
	        var opt;
	        e.stopPropagation();
	        if (e.originalEvent.detail && e.originalEvent.detail === 2) {
	          return;
	        }
	        opt = $(e.target).parents('.list-group-item');
	        if (opt.hasClass('selected')) {
	          return deselect(opt);
	        } else {
	          return select(true, opt);
	        }
	      };
	      searchHandler = function(e) {
	        var $clearSearchX, $noOptionsFoundMessage, escapedSearchTerm, noMatchingOptions;
	        e.stopPropagation();
	        escapedSearchTerm = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
	        noMatchingOptions = true;
	        $('.list-group-item', selectrContainer).each(function(index, option) {
	          if (!$(option).text().match(escapedSearchTerm)) {
	            $(option).addClass('hidden');
	          } else {
	            $(option).removeClass('hidden');
	            noMatchingOptions = false;
	          }
	        });
	        $clearSearchX = $('.clear-search', selectrContainer);
	        if ($(this).val().length > 0) {
	          $clearSearchX.removeClass('hidden');
	        } else {
	          $clearSearchX.addClass('hidden');
	        }
	        $noOptionsFoundMessage = $('.no-matching-options', selectrContainer);
	        if (noMatchingOptions) {
	          return $noOptionsFoundMessage.removeClass('hidden');
	        } else {
	          return $noOptionsFoundMessage.addClass('hidden');
	        }
	      };
	      clearSearchHandler = function(e) {
	        return $(this).siblings('input').val('').trigger('change');
	      };
	      resetOptsHandler = function(e) {
	        selectrContainer.find('ul > li').removeClass('selected');
	        $('option', source).prop('selected', false);
	        triggerChange(source);
	        return updateFooter();
	      };
	      ctrlKeyDownHandler = function(e) {
	        if (e.ctrlKey) {
	          return $('.list-group', selectrContainer).addClass('ctrl-key');
	        }
	      };
	      ctrlKeyUpHandler = function(e) {
	        if (!e.ctrlKey) {
	          return $('.list-group', selectrContainer).removeClass('ctrl-key');
	        }
	      };
	      $(selectrContainer).on('click', '.list-group-item', listItemHandler);
	      $(selectrContainer).on('click', '.add-remove', addRemoveHandler);
	      $(selectrContainer).on('click change keyup', '.form-control', searchHandler);
	      $(selectrContainer).on('click', '.clear-search', clearSearchHandler);
	      $(selectrContainer).on('click', '.reset', resetOptsHandler);
	      $(document).on('keydown', ctrlKeyDownHandler);
	      return $(document).on('keyup', ctrlKeyUpHandler);
	    };
	
	    Selectr.prototype.triggerChange = function() {
	      return this.source.trigger('change', ['selectrInitiated']);
	    };
	
	    Selectr.prototype.selectOption = function(modifyCurrentSelection, opt) {
	      var i, len, ref, sibling;
	      if (this.args.maxSelection <= $(opt).siblings('.selected').length && modifyCurrentSelection) {
	        return;
	      }
	      if (!modifyCurrentSelection) {
	        $('option', this.source).prop('selected', false);
	        ref = $(opt).siblings();
	        for (i = 0, len = ref.length; i < len; i++) {
	          sibling = ref[i];
	          $(sibling).removeClass('selected');
	        }
	      }
	      $(opt).addClass('selected');
	      $("option[value='" + ($(opt).data('val')) + "']", this.source).prop('selected', true);
	      this.updateFooter();
	      return this.triggerChange();
	    };
	
	    Selectr.prototype.deselectOption = function(opt) {
	      this.selectrContainer.removeClass('max-selection-reached');
	      $(opt).removeClass('selected');
	      $("option[value=" + ($(opt).data('val')) + "]", this.source).prop('selected', false);
	      this.updateFooter();
	      return this.triggerChange();
	    };
	
	    Selectr.prototype.updateFooter = function() {
	      var $footer, count;
	      if (!this.multi) {
	        return;
	      }
	      count = $('option:selected', this.source).length;
	      $('.current-selection', this.selectrContainer).text(count > 0 ? count : '');
	      if (count === this.args.maxSelection) {
	        this.selectrContainer.addClass('max-selection-reached');
	      } else {
	        this.selectrContainer.removeClass('max-selection-reached');
	      }
	      if (this.args.alwaysShowFooter) {
	        return;
	      }
	      $footer = $('.panel-footer', this.selectrContainer);
	      if (count === 0) {
	        return $footer.addClass('hidden');
	      } else {
	        return $footer.removeClass('hidden');
	      }
	    };
	
	    return Selectr;
	
	  })();
	  return $.fn.extend({
	    selectr: function(args) {
	      return this.each(function() {
	        var $el;
	        $el = $(this);
	        if ($el.data('selectr-initialized')) {
	          return;
	        }
	        new Selectr($el, args);
	        return $el.data('selectr-initialized', true);
	      });
	    }
	  });
	})(jQuery, this);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js!./selectr.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js!./selectr.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".selectr {\n  margin: 0;\n  display: inline-block;\n  max-width: 100%;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n  .selectr *:not(input) {\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none; }\n  .selectr .panel-heading {\n    cursor: default; }\n    .selectr .panel-heading.no-title {\n      padding: 0;\n      border-bottom: none; }\n  .selectr .panel-body {\n    position: relative; }\n  .selectr input::-ms-clear {\n    display: none;\n    width: 0;\n    height: 0; }\n  .selectr .clear-search {\n    position: absolute;\n    right: 25px;\n    top: 12px;\n    font-size: 28px;\n    font-weight: bold;\n    color: #333;\n    opacity: 0.8;\n    cursor: pointer; }\n    .selectr .clear-search:hover {\n      opacity: 1; }\n  .selectr .list-group {\n    overflow-x: hidden;\n    -ms-overflow-y: auto; }\n  .selectr .list-group-item {\n    padding: 0 !important;\n    overflow: hidden;\n    cursor: pointer; }\n    .selectr .list-group-item.selected {\n      background-color: #4679bd;\n      color: white;\n      font-weight: 700; }\n      .selectr .list-group-item.selected .add-remove {\n        -webkit-transform: rotate(0deg);\n                transform: rotate(0deg); }\n  .selectr.multi .list-group-item:hover .option-name {\n    margin-right: 50px;\n    border-right: 1px solid #ddd; }\n  .selectr.multi .list-group-item:hover .selected .option-name {\n    border-right: 1px solid white; }\n  .selectr.multi .list-group-item:hover .add-remove {\n    display: block; }\n  .selectr .option-name {\n    height: 100%;\n    padding: 10px 15px;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    overflow: hidden; }\n  .selectr .color-code {\n    width: 20px;\n    height: 20px;\n    margin: 10px;\n    margin-right: 0;\n    float: left;\n    border-radius: 5px; }\n    .selectr .color-code.no-color {\n      width: 0;\n      height: 0;\n      margin: 0; }\n  .selectr .add-remove {\n    -webkit-transform: rotate(45deg);\n            transform: rotate(45deg);\n    -webkit-transition: -webkit-transform 0.2s linear;\n    transition: -webkit-transform 0.2s linear;\n    transition: transform 0.2s linear;\n    transition: transform 0.2s linear, -webkit-transform 0.2s linear;\n    opacity: 0.5;\n    display: none;\n    cursor: pointer;\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n    font-size: 24px;\n    font-weight: 900;\n    position: absolute;\n    right: 0px;\n    top: 0px;\n    width: 50px;\n    padding: 8px;\n    line-height: 24px;\n    text-align: center;\n    vertical-align: middle; }\n  .selectr .ctrl-key .add-remove, .selectr .add-remove:hover {\n    opacity: 0.8; }\n  .selectr .current-selection {\n    float: right;\n    margin-top: 5px;\n    cursor: default; }\n  .selectr.max-selection-reached li:not(.selected) .option-name {\n    margin-right: 0 !important;\n    border-right: none !important; }\n  .selectr.max-selection-reached li:not(.selected) .add-remove {\n    display: none !important; }\n  .selectr.max-selection-reached .current-selection {\n    background-color: #d9534f; }\n  .selectr .no-matching-options {\n    padding: 10px;\n    padding-top: 0;\n    text-align: center; }\n", ""]);
	
	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
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
		if(true) {
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js!./bs-polyfill.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js!./bs-polyfill.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".selectr {\n  margin-bottom: 20px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); }\n  .selectr * {\n    box-sizing: border-box; }\n  .selectr .hidden {\n    display: none !important; }\n  .selectr .panel-heading {\n    color: #333;\n    background-color: #f5f5f5;\n    border-color: #ddd;\n    padding: 10px 15px;\n    border-bottom: 1px solid transparent;\n    border-top-right-radius: 3px;\n    border-top-left-radius: 3px; }\n  .selectr .panel-title {\n    margin-top: 0;\n    margin-bottom: 0;\n    font-size: 16px;\n    color: inherit; }\n  .selectr .panel-body {\n    padding: 15px; }\n  .selectr .form-control {\n    display: block;\n    width: 100%;\n    height: 34px;\n    padding: 6px 12px;\n    font-size: 14px;\n    line-height: 1.42857143;\n    color: #555;\n    background-color: #fff;\n    background-image: none;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;\n    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s; }\n  .selectr .list-group {\n    margin: 0;\n    padding: 0; }\n  .selectr .list-group-item {\n    border-width: 1px 0;\n    border-radius: 0;\n    position: relative;\n    display: block;\n    padding: 10px 15px;\n    margin-bottom: -1px;\n    background-color: #fff;\n    border: 1px solid #ddd; }\n  .selectr .panel-footer {\n    padding: 10px 15px;\n    background-color: #f5f5f5;\n    border-top: 1px solid #ddd;\n    border-bottom-right-radius: 3px;\n    border-bottom-left-radius: 3px; }\n  .selectr .btn {\n    display: inline-block;\n    margin-bottom: 0;\n    font-weight: 400;\n    text-align: center;\n    vertical-align: middle;\n    cursor: pointer;\n    background-image: none;\n    border: 1px solid transparent;\n    white-space: nowrap;\n    padding: 6px 12px;\n    font-size: 14px;\n    line-height: 1.42857143;\n    border-radius: 4px;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    color: #333;\n    background-color: #fff;\n    border-color: #ccc; }\n  .selectr .badge {\n    display: inline-block;\n    min-width: 10px;\n    padding: 3px 7px;\n    font-size: 12px;\n    font-weight: 700;\n    color: #fff;\n    line-height: 1;\n    vertical-align: baseline;\n    white-space: nowrap;\n    text-align: center;\n    background-color: #999;\n    border-radius: 10px; }\n", ""]);
	
	// exports


/***/ }
/******/ ])
});
;
//# sourceMappingURL=selectr.debug.js.map