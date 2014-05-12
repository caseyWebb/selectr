(function() {
  (function($, window) {
    var Selectr;
    Selectr = (function() {
      Selectr.prototype.defaults = {
        Selectr: Selectr,
        title: 'Select Options',
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

      Selectr.prototype.CreateContainer = function() {
        return $(document.createElement('div')).attr({
          'class': "selectr panel panel-default " + (this.$el.prop('multiple') ? 'multi' : void 0),
          'style': "width: " + this.args.width + ";"
        }).html("<div class='panel-heading " + (this.args.title === "" ? "no-title" : void 0) + "'>\n  <h4 class='panel-title'>\n    " + this.args.title + "\n  </h4>\n</div>\n<div class='panel-body'>\n  <input class='form-control' placeholder='" + this.args.placeholder + "'>\n  <span class='clear-search hidden'>&times;</span>\n</div>\n<ul class='list-group' style='max-height: " + this.args.maxListHeight + "'>\n</ul>\n<div class='panel-footer " + (!this.$el.prop('multiple') ? 'hidden' : void 0) + "'>\n  <button class='reset btn btn-sm btn-default'>\n    " + this.args.resetText + "\n  </button>\n  " + (this.$el.prop('multiple') ? "<span class='current-selection badge'></span>" : void 0) + "\n</div>");
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
        var self;
        self = this;
        return this.$el.on('change', function(e) {
          var currentSelectionCount, opts, updatedList;
          if (!$(this).data('selectr-change-triggered')) {
            updatedList = $(document.createElement('ul')).attr({
              'class': 'list-group',
              'style': "max-height: " + self.args.maxListHeight + ";"
            });
            opts = self.PrepareOpts($('option', this));
            updatedList.append(opts);
            $('.list-group', $(this).next()).replaceWith(updatedList);
            currentSelectionCount = $('option:selected', this).length;
            $('.current-selection', $(this).next()).text(currentSelectionCount > 0 ? currentSelectionCount : '');
            if (currentSelectionCount > 0 && $(this).prop('multiple')) {
              return $('.panel-footer', $(this).next()).removeClass('hidden');
            } else {
              return $('.panel-footer', $(this).next()).addClass('hidden');
            }
          }
        });
      };

      Selectr.TriggerChange = function(el) {
        el.data('selectr-change-triggered', true);
        el.trigger({
          type: 'change'
        });
        return el.data('selectr-change-triggered', false);
      };

      Selectr.SelectOption = function(modifyCurrentSelection, opt) {
        var currentSelectionCount, el, foo, _i, _len, _ref;
        el = $(opt).parents('.selectr').prev();
        if ($(el).data('selectr-opts').maxSelection <= $(opt).siblings('.selected').length && modifyCurrentSelection) {
          return;
        }
        if (!modifyCurrentSelection) {
          $('option', el).prop('selected', false);
          _ref = $(opt).siblings();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            foo = _ref[_i];
            $(foo).removeClass('selected');
          }
        }
        $(opt).addClass('selected');
        $("option[value=" + ($(opt).data('val')) + "]", el).prop('selected', true);
        currentSelectionCount = $('option:selected', el).length;
        $('.current-selection', $(opt).parents('.selectr')).text(currentSelectionCount > 0 ? currentSelectionCount : '');
        if (el.prop('multiple')) {
          $('.panel-footer', $(opt).parents('.selectr')).removeClass('hidden');
        }
        if (currentSelectionCount === $(el).data('selectr-opts').maxSelection) {
          $(opt).parents('.selectr').addClass('max-selection-reached');
        } else {
          $(opt).parents('.selectr').removeClass('max-selection-reached');
        }
        return this.TriggerChange(el);
      };

      Selectr.DeselectOption = function(opt) {
        var currentSelectionCount, el;
        el = $(opt).parents('.selectr').prev();
        $(opt).parents('.selectr').removeClass('max-selection-reached');
        $(opt).removeClass('selected');
        $("option[value=" + ($(opt).data('val')) + "]", el).prop('selected', false);
        currentSelectionCount = $('option:selected', el).length;
        $('.current-selection', $(opt).parents('.selectr')).text(currentSelectionCount > 0 ? currentSelectionCount : '');
        if (currentSelectionCount === 0) {
          $('.panel-footer', $(opt).parents('.selectr')).addClass('hidden');
        }
        return this.TriggerChange(el);
      };

      Selectr.bindingsInitialized = false;

      Selectr.InstallBindings = function() {
        if (Selectr.bindingsInitialized) {
          return;
        }
        $(document).on('click', '.selectr .list-group-item', function(e) {
          var el, modifyCurrentSelection;
          if (e.originalEvent.detail && e.originalEvent.detail === 2) {
            return;
          }
          el = $(this).parents('.selectr').prev();
          modifyCurrentSelection = (e.ctrlKey || e.metaKey) && el.prop('multiple');
          if ($(this).hasClass('selected') && (modifyCurrentSelection || $(this).siblings('.selected').length === 0) && el.prop('multiple')) {
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
          var regex, selectr;
          selectr = $(this).parents('.selectr');
          regex = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
          $('.list-group-item', selectr).each(function(index, option) {
            if (!$(option).text().match(regex)) {
              return $(option).addClass('hidden');
            } else {
              return $(option).removeClass('hidden');
            }
          });
          if ($(this).val().length > 0) {
            $('.clear-search', selectr).removeClass('hidden');
          } else {
            $('.clear-search', selectr).addClass('hidden');
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
          var el;
          el = $(this).parents('.selectr').prev();
          $(this).parents('.selectr').find('ul > li').removeClass('selected');
          $('option', el).prop('selected', false);
          Selectr.TriggerChange(el);
          $('.current-selection', $(this).parents('.selectr')).text('');
          $('.panel-footer', $(this).parents('.selectr')).addClass('hidden');
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
