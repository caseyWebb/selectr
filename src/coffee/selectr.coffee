###
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
###

do ($, window) ->

  class Selectr
        
    defaults:
      Selectr: this
      title:          '',
      placeholder:    'Search',
      resetText:      'Clear All'
      width:          '300px'
      maxListHeight:  '250px'

    constructor: (@el, @args) ->
      @args = $.extend @defaults, @args
      @$el = $(el)
        
      @container = @CreateContainer()
      @opts = @PrepareOpts($('option', @el))
      $('.selectr-list-group', @container).append(@opts)
        
      selectedCount = 0
      for opt in @opts
        selectedCount++ if opt.hasClass 'selectr-selected'
      $('.selectr-current-selection', @container).text(selectedCount)
        
      @MonitorSource()
      
      @container.insertAfter(@el)
      @$el.hide()        
        
    CreateContainer: ->
      $(document.createElement 'div').attr({
        'class': 'selectr selectr-container panel panel-default',
        'style': "width: #{@args.width};"
      }).html("""
        <div class='selectr-panel-heading panel-heading #{if @args.title is "" then "no-title"}'>
          <h4 class='selectr-panel-title panel-title'>
            #{@args.title}
          </h4>
        </div>
        <div class='selectr-panel-body panel-body'>
          <input class='selectr-form-control form-control' placeholder='#{@args.placeholder}'>
        </div>
        <ul class='selectr-list-group list-group' style='max-height: #{@args.maxListHeight}'>
        </ul>
        <div class='selectr-panel-footer panel-footer'>
          <button class='selectr-reset btn btn-sm btn-default'>
            #{@args.resetText}
          </button>
          #{if @$el.prop 'multiple' then "<span class='selectr-current-selection pull-right badge'></span>"}
        </div>
        """)

    PrepareOpts: (opts) ->
      for opt in opts
        $(document.createElement 'li').attr({
          'class': "selectr-list-group-item list-group-item #{if opt.selected then 'selectr-selected' else ''}"              
        }).text($(opt).text())
        .data('val', $(opt).val())
        .append($(document.createElement 'span').html('&times')
                .attr({ 'class': "selectr-pull-right selectr-add-remove pull-right #{if not @$el.prop 'multiple' then 'hidden'}"}))

    MonitorSource: ->
      self = this
      @$el.on 'change', (e) ->
        unless $(e.target).data 'selectr-change-triggered'
          updatedList = $(document.createElement 'ul').attr({ 'class': 'selectr-list-group list-group', 'style': "max-height: #{self.args.maxListHeight};"}) 
          opts = self.PrepareOpts($('option', this))
          updatedList.append(opts)
          $('.selectr-list-group', $(this).next()).replaceWith(updatedList)

    # Static selectr methods
        
    @TriggerChange: (el) ->
    
      el.data 'selectr-change-triggered', true
      el.trigger { type: 'change' }
      el.data 'selectr-change-triggered', false
        
    @SelectOption: (modifyCurrentSelection, opt) ->
      el = $(opt).parents('.selectr-container').prev()
       
      if not modifyCurrentSelection
        $('option', el).prop('selected', false)
        for foo in $(opt).siblings()
          $(foo).removeClass('selectr-selected')
            
      $(opt).addClass('selectr-selected')
           
      $("option[value=#{$(opt).data('val')}]", el).prop('selected', true)
           
      currentSelectionCount = $('option:selected', el).length
      $('.selectr-current-selection', $(opt).parents('.selectr-container')).text(if currentSelectionCount > 0 then currentSelectionCount else '')
            
      @TriggerChange($(opt).parents('.selectr-container').prev())
            
    @DeselectOption: (opt) ->
      el = $(opt).parents('.selectr-container').prev()
      $(opt).removeClass('selectr-selected')
      $("option[value=#{$(opt).data('val')}]", el).prop('selected', false)
        
      currentSelectionCount = $('option:selected', el).length
      $('.selectr-current-selection', $(opt).parents('.selectr-container')).text(if currentSelectionCount > 0 then currentSelectionCount else '')

    @InstallBindings: ->

      # Click option
      $(document).on 'click', '.selectr-list-group-item', (e) ->
        modifyCurrentSelection = e.ctrlKey and $(this).parents('.selectr-container').prev().prop 'multiple'
        
        if $(this).hasClass('selectr-selected') and (modifyCurrentSelection or $(this).siblings('.selectr-selected').length is 0)
          Selectr.DeselectOption this
        else
          Selectr.SelectOption modifyCurrentSelection, this
        
        e.stopPropagation()
        e.preventDefault()

      # Click add/remove button
      $(document).on 'click', '.selectr-add-remove', (e) ->
        option = $(e.target).parents('.selectr-list-group-item')
        if option.hasClass 'selectr-selected'
          Selectr.DeselectOption option
        else
          Selectr.SelectOption true, option
            
        e.stopPropagation()
        e.preventDefault()
        
      # Type in search
      $(document).on 'change keyup', '.selectr-form-control', (e) ->
        regex = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
        $(this).parents('.selectr-container').find('ul > li').each (index, option) ->
          unless $(option).text().match(regex)
            $(option).addClass 'hidden'
          else
            $(option).removeClass 'hidden'

        e.stopPropagation();
        e.preventDefault();

      # Clear selected options          
      $(document).on 'click', '.selectr-reset', (e) ->
        el = $(this).parents('.selectr-container').prev()
        $(this).parents('.selectr-container').find('ul > li').removeClass('selectr-selected')
        $('option', el).prop('selected', false)
        Selectr.TriggerChange(el)
        
        $('.selectr-current-selection', $(this).parents('.selectr-container')).text('')

        e.stopPropagation();
        e.preventDefault();

  $.fn.extend selectr: (args) ->
    @each ->
      $this = $(this)
      data = $this.data('selectr')

      if !data
        $this.data 'selectr', (data = new Selectr(this, args))

    Selectr.InstallBindings()