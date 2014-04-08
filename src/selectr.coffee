#TODO shift+click

do ($, window) ->

  class Selectr
        
    defaults:
      Selectr: this
      title:          'Select Options',
      placeholder:    'Search',
      resetText:      'Clear All'
      width:          '300px'
      maxListHeight:  '250px'

    constructor: (@el, @args) ->
      @args = $.extend @defaults, @args
      @$el = $(el)
        
      @container = @CreateContainer()
      @opts = @PrepareOpts($('option', @el))
      $('.list-group', @container).append(@opts)
        
      selectedCount = 0
      for opt in @opts
        selectedCount++ if opt.hasClass 'selected'
      $('.current-selection', @container).text(selectedCount)
        
      @MonitorSource()
      
      @container.insertAfter(@el)
      @$el.hide()        
        
    CreateContainer: ->
      $(document.createElement 'div').attr({
        'class': 'selectr panel panel-default',
        'style': "width: #{@args.width};"
      }).html("""
        <div class='panel-heading #{if @args.title is "" then "no-title"}'>
          <h4 class='panel-title'>
            #{@args.title}
          </h4>
        </div>
        <div class='panel-body'>
          <input class='form-control' placeholder='#{@args.placeholder}'>
        </div>
        <ul class='list-group' style='max-height: #{@args.maxListHeight}'>
        </ul>
        <div class='panel-footer'>
          <button class='reset btn btn-sm btn-default'>
            #{@args.resetText}
          </button>
          #{if @$el.prop 'multiple' then "<span class='current-selection badge'></span>"}
        </div>
        """)

    PrepareOpts: (opts) ->
      for opt in opts
        $(document.createElement 'li').attr({
          'class': "list-group-item #{if opt.selected then 'selected' else ''}"              
        }).data('val', $(opt).val())
        .append($(document.createElement 'div')
                .attr({ 'class': 'color-code'})
                .css('background-color', $(opt).data 'selectr-color'))
        .append($(document.createElement 'div')
                .text($(opt).text())
                .attr({ 'class': 'option-name' }))
        .append($(document.createElement 'div')
                .html('&times')
                .attr({ 'class': "add-remove #{if not @$el.prop 'multiple' then 'hidden'}"}))

    MonitorSource: ->
      self = this
      @$el.on 'change', (e) ->
        unless $(this).data 'selectr-change-triggered'
          updatedList = $(document.createElement 'ul').attr({ 'class': 'list-group', 'style': "max-height: #{self.args.maxListHeight};"}) 
          opts = self.PrepareOpts($('option', this))
          updatedList.append(opts)
          $('.list-group', $(this).next()).replaceWith(updatedList)
            
          currentSelectionCount = $('option:selected', this).length
          $('.current-selection', $(this).next()).text(if currentSelectionCount > 0 then currentSelectionCount else '')

    # Static selectr methods
        
    @TriggerChange: (el) ->
    
      el.data 'selectr-change-triggered', true
      el.trigger { type: 'change' }
      el.data 'selectr-change-triggered', false
        
    @SelectOption: (modifyCurrentSelection, opt) ->
      el = $(opt).parents('.selectr').prev()
       
      if not modifyCurrentSelection
        $('option', el).prop('selected', false)
        for foo in $(opt).siblings()
          $(foo).removeClass('selected')
            
      $(opt).addClass('selected')
           
      $("option[value=#{$(opt).data('val')}]", el).prop('selected', true)
           
      currentSelectionCount = $('option:selected', el).length
      $('.current-selection', $(opt).parents('.selectr')).text(if currentSelectionCount > 0 then currentSelectionCount else '')
            
      @TriggerChange($(opt).parents('.selectr').prev())
            
    @DeselectOption: (opt) ->
      el = $(opt).parents('.selectr').prev()
      $(opt).removeClass('selected')
      $("option[value=#{$(opt).data('val')}]", el).prop('selected', false)
        
      currentSelectionCount = $('option:selected', el).length
      $('.current-selection', $(opt).parents('.selectr')).text(if currentSelectionCount > 0 then currentSelectionCount else '')

    @InstallBindings: ->

      # Click option
      $(document).on 'click', '.selectr .list-group-item', (e) ->
        modifyCurrentSelection = (e.ctrlKey || e.metaKey) and $(this).parents('.selectr').prev().prop 'multiple'
        
        if $(this).hasClass('selected') and (modifyCurrentSelection or $(this).siblings('.selected').length is 0)
          Selectr.DeselectOption this
        else
          Selectr.SelectOption modifyCurrentSelection, this
        
        e.stopPropagation()
        e.preventDefault()
        
      # CTRL depressed
      $(document).on 'keydown', (e) ->
        $('.selectr .list-group').addClass 'ctrl-key' if e.ctrlKey
        
      $(document).on 'keyup', (e) ->
        $('.selectr .list-group').removeClass 'ctrl-key' if not e.ctrlKey

      # Click add/remove button
      $(document).on 'click', '.selectr .add-remove', (e) ->
        option = $(e.target).parents('.selectr .list-group-item')
        if option.hasClass 'selected'
          Selectr.DeselectOption option
        else
          Selectr.SelectOption true, option
            
        e.stopPropagation()
        e.preventDefault()
        
      # Type in search
      $(document).on 'change keyup', '.selectr .form-control', (e) ->
        regex = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
        $(this).parents('.selectr').find('ul > li').each (index, option) ->
          unless $(option).text().match(regex)
            $(option).addClass 'hidden'
          else
            $(option).removeClass 'hidden'

        e.stopPropagation();
        e.preventDefault();

      # Clear selected options          
      $(document).on 'click', '.selectr .reset', (e) ->
        el = $(this).parents('.selectr').prev()
        $(this).parents('.selectr').find('ul > li').removeClass('selected')
        $('option', el).prop('selected', false)
        Selectr.TriggerChange(el)
        
        $('.current-selection', $(this).parents('.selectr')).text('')

        e.stopPropagation();
        e.preventDefault();

  $.fn.extend selectr: (args) ->
    @each ->
      $this = $(this)
      data = $this.data('selectr')

      if !data
        $this.data 'selectr', (data = new Selectr(this, args))

    Selectr.InstallBindings()