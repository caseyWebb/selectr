(function() {
  (function($, window) {
    var Selectr;
    Selectr = (function() {
      Selectr.prototype.defaults = {
        Selectr: Selectr,
        title: 'Select Options',
        noMatchingOptionsText: 'No options found',
        placeholder: 'Search',
        resetText: 'Clear All',
        width: '300px',
        maxListHeight: '250px',
        tooltipBreakpoint: 25,
        maxSelection: NaN
      };

      function Selectr(el, args) {
        var opt, selectedCount, _i, _len, _ref;
        this.el = el;
        this.args = args;
        this.$el = $(el);
        this.args = $.extend(this.defaults, this.args, this.$el.data('selectr-opts'));
        this.$el.data('selectr-opts', this.args);
        this.container = this.CreateContainer();
        this.opts = this.PrepareOpts($('option', this.el));
        $('.list-group', this.container).append(this.opts);
        selectedCount = 0;
        _ref = this.opts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          opt = _ref[_i];
          if (opt.hasClass('selected')) {
            selectedCount++;
          }
        }
        $('.current-selection', this.container).text(selectedCount > 0 ? selectedCount : void 0);
        if (selectedCount === 0) {
          $('.panel-footer', this.container).addClass('hidden');
        }
        this.MonitorSource();
        this.container.insertAfter(this.el);
        this.$el.hide();
      }


      /* Initialization methods */

      Selectr.prototype.CreateContainer = function() {
        return $(document.createElement('div')).attr({
          'class': "selectr panel panel-default " + (this.$el.prop('multiple') ? 'multi' : void 0),
          'style': "width: " + this.args.width + ";"
        }).html("<div class='panel-heading " + (this.args.title === "" ? "no-title" : void 0) + "'>\n  <h4 class='panel-title'>\n    " + this.args.title + "\n  </h4>\n</div>\n<div class='panel-body'>\n  <input class='form-control' placeholder='" + this.args.placeholder + "'>\n  <span class='clear-search hidden'>&times;</span>\n</div>\n<ul class='list-group' style='max-height: " + this.args.maxListHeight + "'>\n</ul>\n<div class='no-matching-options hidden'>\n  <strong>" + this.args.noMatchingOptionsText + "</strong>\n</div>\n<div class='panel-footer " + (!this.$el.prop('multiple') ? 'hidden' : void 0) + "'>\n  <button class='reset btn btn-sm btn-default'>\n    " + this.args.resetText + "\n  </button>\n  " + (this.$el.prop('multiple') ? "<span class='current-selection badge'></span>" : void 0) + "\n</div>");
      };

      Selectr.prototype.PrepareOpts = function(opts) {
        var opt, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = opts.length; _i < _len; _i++) {
          opt = opts[_i];
          _results.push($(document.createElement('li')).attr({
            'class': "list-group-item " + (opt.selected ? 'selected' : '')
          }).data('val', $(opt).val()).append($(document.createElement('div')).attr({
            'class': "color-code " + (!$(opt).data('selectr-color') ? 'no-color' : void 0)
          }).css('background-color', $(opt).data('selectr-color'))).append($(document.createElement('div')).text($(opt).text()).attr({
            'class': 'option-name',
            'title': $(opt).text().length > this.args.tooltipBreakpoint ? $(opt).text() : void 0
          })).append($(document.createElement('div')).html('&times').attr({
            'class': "add-remove " + (!this.$el.prop('multiple') ? 'hidden' : void 0)
          })));
        }
        return _results;
      };

      Selectr.prototype.MonitorSource = function() {
        var observer, self;
        self = this;
        this.sync = (function(_this) {
          return function() {
            var $selectrFooter, currentSelectionCount, opts, thisSelectr, updatedList;
            if (!_this.$el.data('selectr-change-triggered')) {
              console.log('sync');
              thisSelectr = _this.$el.next();
              updatedList = $(document.createElement('ul')).attr({
                'class': 'list-group',
                'style': "max-height: " + self.args.maxListHeight + ";"
              });
              opts = _this.PrepareOpts($('option', _this.$el));
              updatedList.append(opts);
              $('.list-group', thisSelectr).replaceWith(updatedList);
              currentSelectionCount = $('option:selected', _this.$el).length;
              $('.current-selection', thisSelectr).text(currentSelectionCount > 0 ? currentSelectionCount : '');
              $selectrFooter = $('.panel-footer', thisSelectr);
              if (currentSelectionCount > 0 && $(_this.$el).prop('multiple')) {
                return $selectrFooter.removeClass('hidden');
              } else {
                return $selectrFooter.addClass('hidden');
              }
            }
          };
        })(this);
        observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        this.$el.on('change', function(e) {
          console.log('change');
          return self.sync();
        });
        if (observer != null) {
          if (this.propertyObserver) {
            delete this.propertyObserver;
            this.propertyObserver = null;
          }
          this.propertyObserver = new observer(function(mutations) {
            return $.each(mutations, self.sync);
          });
          return this.propertyObserver.observe(this.$el.get(0), {
            attributes: false,
            childList: true
          });
        }
      };


      /* Static selectr methods */

      Selectr.TriggerChange = function(el) {
        el.data('selectr-change-triggered', true);
        el.trigger({
          type: 'change'
        });
        return el.data('selectr-change-triggered', false);
      };

      Selectr.SelectOption = function(modifyCurrentSelection, opt) {
        var currentSelectionCount, foo, sourceElement, thisSelectr, _i, _len, _ref;
        thisSelectr = $(opt).parents('.selectr');
        sourceElement = $(opt).parents('.selectr').prev();
        if ($(sourceElement).data('selectr-opts').maxSelection <= $(opt).siblings('.selected').length && modifyCurrentSelection) {
          return;
        }
        if (!modifyCurrentSelection) {
          $('option', sourceElement).prop('selected', false);
          _ref = $(opt).siblings();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            foo = _ref[_i];
            $(foo).removeClass('selected');
          }
        }
        $(opt).addClass('selected');
        $("option[value=" + ($(opt).data('val')) + "]", sourceElement).prop('selected', true);
        currentSelectionCount = $('option:selected', sourceElement).length;
        $('.current-selection', thisSelectr).text(currentSelectionCount > 0 ? currentSelectionCount : '');
        if (sourceElement.prop('multiple')) {
          $('.panel-footer', thisSelectr).removeClass('hidden');
        }
        if (currentSelectionCount === $(sourceElement).data('selectr-opts').maxSelection) {
          thisSelectr.addClass('max-selection-reached');
        } else {
          thisSelectr.removeClass('max-selection-reached');
        }
        return this.TriggerChange(sourceElement);
      };

      Selectr.DeselectOption = function(opt) {
        var currentSelectionCount, sourceElement;
        sourceElement = $(opt).parents('.selectr').prev();
        $(opt).parents('.selectr').removeClass('max-selection-reached');
        $(opt).removeClass('selected');
        $("option[value=" + ($(opt).data('val')) + "]", sourceElement).prop('selected', false);
        currentSelectionCount = $('option:selected', sourceElement).length;
        $('.current-selection', $(opt).parents('.selectr')).text(currentSelectionCount > 0 ? currentSelectionCount : '');
        if (currentSelectionCount === 0) {
          $('.panel-footer', $(opt).parents('.selectr')).addClass('hidden');
        }
        return this.TriggerChange(sourceElement);
      };

      Selectr.bindingsInitialized = false;

      Selectr.InstallBindings = function() {
        if (Selectr.bindingsInitialized) {
          return;
        }
        $(document).on('click', '.selectr .list-group-item', function(e) {
          var modifyCurrentSelection, sourceElement;
          if (e.originalEvent.detail && e.originalEvent.detail === 2) {
            return;
          }
          sourceElement = $(this).parents('.selectr').prev();
          modifyCurrentSelection = (e.ctrlKey || e.metaKey) && sourceElement.prop('multiple');
          if ($(this).hasClass('selected') && (modifyCurrentSelection || $(this).siblings('.selected').length === 0) && sourceElement.prop('multiple')) {
            Selectr.DeselectOption(this);
          } else {
            Selectr.SelectOption(modifyCurrentSelection, this);
          }
          e.stopPropagation();
          e.preventDefault();
          $(document).on('keydown', function(e) {
            if (e.ctrlKey) {
              return $('.selectr .list-group').addClass('ctrl-key');
            }
          });
          return $(document).on('keyup', function(e) {
            if (!e.ctrlKey) {
              return $('.selectr .list-group').removeClass('ctrl-key');
            }
          });
        });
        $(document).on('click', '.selectr .add-remove', function(e) {
          var option;
          if (e.originalEvent.detail && e.originalEvent.detail === 2) {
            return;
          }
          option = $(e.target).parents('.selectr .list-group-item');
          if (option.hasClass('selected')) {
            Selectr.DeselectOption(option);
          } else {
            Selectr.SelectOption(true, option);
          }
          e.stopPropagation();
          return e.preventDefault();
        });
        $(document).on('click change keyup', '.selectr .form-control', function(e) {
          var $clearSearchX, $noOptionsFoundMessage, escapedSearchTerm, noMatchingOptions, thisSelectr;
          thisSelectr = $(this).parents('.selectr');
          escapedSearchTerm = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
          noMatchingOptions = true;
          $('.list-group-item', thisSelectr).each(function(index, option) {
            if (!$(option).text().match(escapedSearchTerm)) {
              $(option).addClass('hidden');
            } else {
              $(option).removeClass('hidden');
              noMatchingOptions = false;
            }
          });
          $clearSearchX = $('.clear-search', thisSelectr);
          if ($(this).val().length > 0) {
            $clearSearchX.removeClass('hidden');
          } else {
            $clearSearchX.addClass('hidden');
          }
          $noOptionsFoundMessage = $('.no-matching-options', thisSelectr);
          if (noMatchingOptions) {
            $noOptionsFoundMessage.removeClass('hidden');
          } else {
            $noOptionsFoundMessage.addClass('hidden');
          }
          e.stopPropagation();
          return e.preventDefault();
        });
        $(document).on('click', '.selectr .clear-search', function(e) {
          $(this).siblings('input').val('').click();
          e.stopPropagation();
          return e.preventDefault();
        });
        $(document).on('click', '.selectr .reset', function(e) {
          var sourceElement, thisSelectr;
          thisSelectr = $(this).parents('.selectr');
          sourceElement = thisSelectr.prev();
          thisSelectr.find('ul > li').removeClass('selected');
          $('option', sourceElement).prop('selected', false);
          Selectr.TriggerChange(sourceElement);
          $('.current-selection', thisSelectr).text('');
          $('.panel-footer', thisSelectr).addClass('hidden');
          e.stopPropagation();
          return e.preventDefault();
        });
        return Selectr.bindingsInitialized = true;
      };

      return Selectr;

    })();
    return $.fn.extend({
      selectr: function(args) {
        this.each(function() {
          var $this, data;
          $this = $(this);
          data = $this.data('selectr');
          if (!data) {
            return $this.data('selectr', (data = new Selectr(this, args)));
          }
        });
        return Selectr.InstallBindings();
      }
    });
  })($, window);

}).call(this);

//# sourceMappingURL=selectr.js.map
