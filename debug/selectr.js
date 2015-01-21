(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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

      function Selectr(source, args) {
        this.source = source;
        this.args = args;
        this.updateFooter = __bind(this.updateFooter, this);
        this.deselectOption = __bind(this.deselectOption, this);
        this.selectOption = __bind(this.selectOption, this);
        this.triggerChange = __bind(this.triggerChange, this);
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
        return $(document.createElement('div')).addClass("selectr panel panel-" + this.args.panelStyle + " " + (this.multi ? 'multi' : void 0)).css('width', this.args.width).html("<div class='panel-heading " + (this.args.title === '' ? "no-title" : void 0) + "'> <h4 class='panel-title'> " + this.args.title + " </h4> </div> <div class='panel-body'> <input class='form-control' placeholder='" + this.args.placeholder + "'> <span class='clear-search hidden'>&times;</span> </div> <ul class='list-group' style='max-height: " + this.args.maxListHeight + "'> </ul> <div class='no-matching-options hidden'> <strong>" + this.args.noMatchingOptionsText + "</strong> </div> <div class='panel-footer " + (!this.multi && !this.args.alwaysShowFooter ? 'hidden' : void 0) + "'> <button class='reset btn btn-sm btn-default'> " + this.args.resetText + " </button> " + (this.multi ? "<span class='current-selection badge'></span>" : '') + " </div>");
      };

      Selectr.prototype.createOpts = function() {
        var opt, _i, _len, _ref, _results;
        _ref = $('option', this.source);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          opt = _ref[_i];
          _results.push($(document.createElement('li')).addClass("list-group-item " + (opt.selected ? 'selected' : void 0)).data('val', $(opt).val()).append($(document.createElement('div')).addClass("color-code " + (!$(opt).data('selectr-color') ? 'no-color' : void 0)).css('background-color', $(opt).data('selectr-color'))).append($(document.createElement('div')).text($(opt).text()).addClass('option-name').attr({
            title: $(opt).text().length > this.args.tooltipBreakpoint ? $(opt).text() : ''
          })).append($(document.createElement('div')).html('&times').addClass("add-remove " + (!this.multi ? 'hidden' : void 0))));
        }
        return _results;
      };

      Selectr.prototype.monitorSource = function() {
        var observer, propertyObserver, sync;
        sync = (function(_this) {
          return function() {
            var updatedList;
            updatedList = $(document.createElement('ul')).addClass('list-group').css('max-height', _this.args.maxListHeight).append(_this.createOpts());
            $('.list-group', _this.selectrContainer).replaceWith(updatedList);
            _this.updateFooter();
            return _this.bind;
          };
        })(this);
        this.source.on('change', function(e) {
          if (e.namespace !== 'selectr') {
            return sync();
          }
        });

        /*
        In modern browsers, watch for changes to the source
        element's options (think Angular/Knockout/etc. bound opts)
        and update accordingly.
        
        To observe changes to the options in legacy IE,
        you'll have to manually trigger a change event
        on the source element when the options change. Sorry.
        I'm done wasting time on this.
         */
        observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (observer == null) {
          return;
        }
        propertyObserver = new observer(function(mutations) {
          return $.each(mutations, sync);
        });
        return propertyObserver.observe(this.source.get(0), {
          attributes: false,
          childList: true
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
          var modifyCurrentSelection, _ref;
          if (((_ref = e.originalEvent) != null ? _ref.detail : void 0) === 2) {
            return;
          }
          modifyCurrentSelection = (e.ctrlKey || e.metaKey) && multi;
          if ($(this).hasClass('selected') && (modifyCurrentSelection || $(this).siblings('.selected').length === 0) && this.multi) {
            deselect(this);
          } else {
            select(modifyCurrentSelection, this);
          }
          e.stopPropagation();
          return e.preventDefault();
        };
        addRemoveHandler = function(e) {
          var opt;
          if (e.originalEvent.detail && e.originalEvent.detail === 2) {
            return;
          }
          opt = $(e.target).parents('.list-group-item');
          if (opt.hasClass('selected')) {
            deselect(opt);
          } else {
            select(true, opt);
          }
          e.stopPropagation();
          return e.preventDefault();
        };
        searchHandler = function(e) {
          var $clearSearchX, $noOptionsFoundMessage, escapedSearchTerm, noMatchingOptions;
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
            $noOptionsFoundMessage.removeClass('hidden');
          } else {
            $noOptionsFoundMessage.addClass('hidden');
          }
          e.stopPropagation();
          return e.preventDefault();
        };
        clearSearchHandler = function(e) {
          $(this).siblings('input').val('');
          e.stopPropagation();
          return e.preventDefault();
        };
        resetOptsHandler = function(e) {
          selectrContainer.find('ul > li').removeClass('selected');
          $('option', source).prop('selected', false);
          triggerChange(source);
          updateFooter();
          e.stopPropagation();
          return e.preventDefault();
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
        return this.source.trigger('change.selectr');
      };

      Selectr.prototype.selectOption = function(modifyCurrentSelection, opt) {
        var sibling, _i, _len, _ref;
        if (this.args.maxSelection <= $(opt).siblings('.selected').length && modifyCurrentSelection) {
          return;
        }
        if (!modifyCurrentSelection) {
          $('option', this.source).prop('selected', false);
          _ref = $(opt).siblings();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sibling = _ref[_i];
            $(sibling).removeClass('selected');
          }
        }
        $(opt).addClass('selected');
        $("option[value=" + ($(opt).data('val')) + "]", this.source).prop('selected', true);
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
  })($, window);

}).call(this);

//# sourceMappingURL=selectr.js.map
