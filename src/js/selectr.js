/*
Written by Casey Webb, 2014

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($, window) {
  var Selectr;
  Selectr = (function() {
    Selectr.prototype.defaults = {
      Selectr: Selectr,
      title: '',
      placeholder: 'Search',
      resetText: 'Clear All',
      width: '300px',
      maxListHeight: '250px'
    };

    function Selectr(el, args) {
      var opt, selectedCount, _i, _len, _ref;
      this.el = el;
      this.args = args;
      this.args = $.extend(this.defaults, this.args);
      this.$el = $(el);
      this.container = this.CreateContainer();
      this.opts = this.PrepareOpts($('option', this.el));
      $('.selectr-list-group', this.container).append(this.opts);
      selectedCount = 0;
      _ref = this.opts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        opt = _ref[_i];
        if (opt.hasClass('selectr-selected')) {
          selectedCount++;
        }
      }
      $('.selectr-current-selection', this.container).text(selectedCount);
      this.MonitorSource();
      this.container.insertAfter(this.el);
      this.$el.hide();
    }

    Selectr.prototype.CreateContainer = function() {
      return $(document.createElement('div')).attr({
        'class': 'selectr selectr-container panel panel-default',
        'style': "width: " + this.args.width + ";"
      }).html("<div class='selectr-panel-heading panel-heading " + (this.args.title === "" ? "no-title" : void 0) + "'>\n  <h4 class='selectr-panel-title panel-title'>\n    " + this.args.title + "\n  </h4>\n</div>\n<div class='selectr-panel-body panel-body'>\n  <input class='selectr-form-control form-control' placeholder='" + this.args.placeholder + "'>\n</div>\n<ul class='selectr-list-group list-group' style='max-height: " + this.args.maxListHeight + "'>\n</ul>\n<div class='selectr-panel-footer panel-footer'>\n  <button class='selectr-reset btn btn-sm btn-default'>\n    " + this.args.resetText + "\n  </button>\n  " + (this.$el.prop('multiple') ? "<span class='selectr-current-selection pull-right badge'></span>" : void 0) + "\n</div>");
    };

    Selectr.prototype.PrepareOpts = function(opts) {
      var opt, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = opts.length; _i < _len; _i++) {
        opt = opts[_i];
        _results.push($(document.createElement('li')).attr({
          'class': "selectr-list-group-item list-group-item " + (opt.selected ? 'selectr-selected' : '')
        }).text($(opt).text()).data('val', $(opt).val()).append($(document.createElement('span')).html('&times').attr({
          'class': "selectr-pull-right selectr-add-remove pull-right " + (!this.$el.prop('multiple') ? 'hidden' : void 0)
        })));
      }
      return _results;
    };

    Selectr.prototype.MonitorSource = function() {
      var self;
      self = this;
      return this.$el.on('change', function(e) {
        var opts, updatedList;
        if (!$(e.target).data('selectr-change-triggered')) {
          updatedList = $(document.createElement('ul')).attr({
            'class': 'selectr-list-group list-group',
            'style': "max-height: " + self.args.maxListHeight + ";"
          });
          opts = self.PrepareOpts($('option', this));
          updatedList.append(opts);
          return $('.selectr-list-group', $(this).next()).replaceWith(updatedList);
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
      el = $(opt).parents('.selectr-container').prev();
      if (!modifyCurrentSelection) {
        $('option', el).prop('selected', false);
        _ref = $(opt).siblings();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          foo = _ref[_i];
          $(foo).removeClass('selectr-selected');
        }
      }
      $(opt).addClass('selectr-selected');
      $("option[value=" + ($(opt).data('val')) + "]", el).prop('selected', true);
      currentSelectionCount = $('option:selected', el).length;
      $('.selectr-current-selection', $(opt).parents('.selectr-container')).text(currentSelectionCount > 0 ? currentSelectionCount : '');
      return this.TriggerChange($(opt).parents('.selectr-container').prev());
    };

    Selectr.DeselectOption = function(opt) {
      var currentSelectionCount, el;
      el = $(opt).parents('.selectr-container').prev();
      $(opt).removeClass('selectr-selected');
      $("option[value=" + ($(opt).data('val')) + "]", el).prop('selected', false);
      currentSelectionCount = $('option:selected', el).length;
      return $('.selectr-current-selection', $(opt).parents('.selectr-container')).text(currentSelectionCount > 0 ? currentSelectionCount : '');
    };

    Selectr.InstallBindings = function() {
      $(document).on('click', '.selectr-list-group-item', function(e) {
        var modifyCurrentSelection;
        modifyCurrentSelection = e.ctrlKey && $(this).parents('.selectr-container').prev().prop('multiple');
        if ($(this).hasClass('selectr-selected') && (modifyCurrentSelection || $(this).siblings('.selectr-selected').length === 0)) {
          Selectr.DeselectOption(this);
        } else {
          Selectr.SelectOption(modifyCurrentSelection, this);
        }
        e.stopPropagation();
        return e.preventDefault();
      });
      $(document).on('click', '.selectr-add-remove', function(e) {
        var option;
        option = $(e.target).parents('.selectr-list-group-item');
        if (option.hasClass('selectr-selected')) {
          Selectr.DeselectOption(option);
        } else {
          Selectr.SelectOption(true, option);
        }
        e.stopPropagation();
        return e.preventDefault();
      });
      $(document).on('change keyup', '.selectr-form-control', function(e) {
        var regex;
        regex = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
        $(this).parents('.selectr-container').find('ul > li').each(function(index, option) {
          if (!$(option).text().match(regex)) {
            return $(option).addClass('hidden');
          } else {
            return $(option).removeClass('hidden');
          }
        });
        e.stopPropagation();
        return e.preventDefault();
      });
      return $(document).on('click', '.selectr-reset', function(e) {
        var el;
        el = $(this).parents('.selectr-container').prev();
        $(this).parents('.selectr-container').find('ul > li').removeClass('selectr-selected');
        $('option', el).prop('selected', false);
        Selectr.TriggerChange(el);
        $('.selectr-current-selection', $(this).parents('.selectr-container')).text('');
        e.stopPropagation();
        return e.preventDefault();
      });
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