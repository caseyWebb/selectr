do ($, window) ->

  class Selectr
        
    defaults:
      Selectr: this
      title:              'Select Options'
      placeholder:        'Search'
      resetText:          'Clear All'
      width:              '300px'
      maxListHeight:      '250px'
      tooltipBreakpoint:  25
      maxSelection:       NaN

    constructor: (@el, @args) ->
      @$el = $(el)
      @args = $.extend @defaults, @args, @$el.data('selectr-opts')
      @$el.data 'selectr-opts', @args
        
      @container = @CreateContainer()
      @opts = @PrepareOpts($('option', @el))
      $('.list-group', @container).append(@opts)
        
      selectedCount = 0
      for opt in @opts
        selectedCount++ if opt.hasClass 'selected'
      $('.current-selection', @container).text(selectedCount if selectedCount > 0)
      if selectedCount == 0
        $('.panel-footer', @container).addClass('hidden')
        
      @MonitorSource()
      
      @container.insertAfter(@el)
      @$el.hide()        
        
    CreateContainer: ->
      $(document.createElement 'div').attr({
        'class': "selectr panel panel-default #{if @$el.prop 'multiple' then 'multi'}",
        'style': "width: #{@args.width};"
      }).html("""
        <div class='panel-heading #{if @args.title is "" then "no-title"}'>
          <h4 class='panel-title'>
            #{@args.title}
          </h4>
        </div>
        <div class='panel-body'>
          <input class='form-control' placeholder='#{@args.placeholder}'>
          <span class='clear-search hidden'>&times;</span>
        </div>
        <ul class='list-group' style='max-height: #{@args.maxListHeight}'>
        </ul>
        <div class='panel-footer #{'hidden' if not @$el.prop 'multiple'}'>
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
                .attr({ 'class': "color-code #{'no-color' if not $(opt).data 'selectr-color'}" })
                .css('background-color', $(opt).data 'selectr-color'))
        .append($(document.createElement 'div')
                .text($(opt).text())
                .attr({ 'class': 'option-name', 'title': if $(opt).text().length > @args.tooltipBreakpoint then $(opt).text() }))
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
          if currentSelectionCount > 0 && $(this).prop('multiple')
            $('.panel-footer', $(this).next()).removeClass('hidden')
          else
            $('.panel-footer', $(this).next()).addClass('hidden')

    # Static selectr methods
        
    @TriggerChange: (el) ->
    
      el.data 'selectr-change-triggered', true
      el.trigger { type: 'change' }
      el.data 'selectr-change-triggered', false
        
    @SelectOption: (modifyCurrentSelection, opt) ->
      el = $(opt).parents('.selectr').prev()

      if $(el).data('selectr-opts').maxSelection <= $(opt).siblings('.selected').length && modifyCurrentSelection
        return

      if not modifyCurrentSelection
        $('option', el).prop('selected', false)
        for foo in $(opt).siblings()
          $(foo).removeClass('selected')
            
      $(opt).addClass('selected')
           
      $("option[value=#{$(opt).data('val')}]", el).prop('selected', true)
           
      currentSelectionCount = $('option:selected', el).length
      $('.current-selection', $(opt).parents('.selectr')).text(if currentSelectionCount > 0 then currentSelectionCount else '')
      $('.panel-footer', $(opt).parents('.selectr')).removeClass('hidden') if el.prop('multiple')

      if currentSelectionCount == $(el).data('selectr-opts').maxSelection
        $(opt).parents('.selectr').addClass('max-selection-reached')
      else
        $(opt).parents('.selectr').removeClass('max-selection-reached')
            
      @TriggerChange(el)
            
    @DeselectOption: (opt) ->
      el = $(opt).parents('.selectr').prev()

      $(opt).parents('.selectr').removeClass('max-selection-reached')

      $(opt).removeClass('selected')
      $("option[value=#{$(opt).data('val')}]", el).prop('selected', false)
        
      currentSelectionCount = $('option:selected', el).length
      $('.current-selection', $(opt).parents('.selectr')).text(if currentSelectionCount > 0 then currentSelectionCount else '')
      if currentSelectionCount == 0
        $('.panel-footer', $(opt).parents('.selectr')).addClass('hidden');

      @TriggerChange(el)

    @bindingsInitialized: false
    @InstallBindings: ->

      return if Selectr.bindingsInitialized

      # Click option
      $(document).on 'click', '.selectr .list-group-item', (e) ->
        if e.originalEvent.detail && e.originalEvent.detail == 2
          return

        el = $(this).parents('.selectr').prev()
        modifyCurrentSelection = (e.ctrlKey or e.metaKey) and el.prop 'multiple'
        
        if $(this).hasClass('selected') and (modifyCurrentSelection or $(this).siblings('.selected').length is 0) and el.prop 'multiple'
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
        if e.originalEvent.detail && e.originalEvent.detail == 2
          return

        option = $(e.target).parents('.selectr .list-group-item')
        if option.hasClass 'selected'
          Selectr.DeselectOption option
        else
          Selectr.SelectOption true, option
            
        e.stopPropagation()
        e.preventDefault()
        
      # Type in search
      $(document).on 'click change keyup', '.selectr .form-control', (e) ->
        selectr = $(this).parents('.selectr')
        regex = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
        $('.list-group-item', selectr).each (index, option) ->
          unless $(option).text().match(regex)
            $(option).addClass 'hidden'
          else
            $(option).removeClass 'hidden'
            
        if $(this).val().length > 0
          $('.clear-search', selectr).removeClass 'hidden' 
        else
          $('.clear-search', selectr).addClass 'hidden'
            

        e.stopPropagation();
        e.preventDefault();
        
      # Clear search
      $(document).on 'click', '.selectr .clear-search', (e) ->
        $(this).siblings('input').val('').click()

        e.stopPropagation();
        e.preventDefault();

      # Clear selected options          
      $(document).on 'click', '.selectr .reset', (e) ->
        el = $(this).parents('.selectr').prev()
        $(this).parents('.selectr').find('ul > li').removeClass('selected')
        $('option', el).prop('selected', false)
        Selectr.TriggerChange(el)
        
        $('.current-selection', $(this).parents('.selectr')).text('')
        $('.panel-footer', $(this).parents('.selectr')).addClass('hidden')

        e.stopPropagation();
        e.preventDefault();

      Selectr.bindingsInitialized = true

  $.fn.extend selectr: (args) ->
    @each ->
      $this = $(this)
      data = $this.data('selectr')

      if !data
        $this.data 'selectr', (data = new Selectr(this, args))

    Selectr.InstallBindings()