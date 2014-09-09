do ($, window) ->

  class Selectr

    defaults:
      Selectr: this
      title:                  'Select Options'
      noMatchingOptionsText:  'No options found'
      placeholder:            'Search'
      resetText:              'Clear All'
      width:                  '300px'
      maxListHeight:          '250px'
      tooltipBreakpoint:      25
      maxSelection:           NaN

    constructor: (@el, @args) ->
      @$el = $(el)
      @args = $.extend @defaults, @args, @$el.data('selectr-opts')
      @$el.data 'selectr-opts', @args

      # create container
      @container = @CreateContainer()

      # populate options
      @opts = @PrepareOpts($('option', @el))
      $('.list-group', @container).append(@opts)

      # set current selection badge
      selectedCount = 0
      for opt in @opts
        selectedCount++ if opt.hasClass 'selected'
      $('.current-selection', @container).text(selectedCount if selectedCount > 0)
      if selectedCount == 0
        $('.panel-footer', @container).addClass('hidden')

      # watch for programatic changes
      @MonitorSource()

      # insert selectr instance in DOM
      @container.insertAfter(@el)

      # hide source
      @$el.hide()

    ##############################
    ### Initialization methods ###
    ##############################

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
        <div class='no-matching-options hidden'>
          <strong>#{@args.noMatchingOptionsText}</strong>
        </div>
        <div class='panel-footer #{'hidden' if not @$el.prop 'multiple'}'>
          <button class='reset btn btn-sm btn-default'>
            #{@args.resetText}
          </button>
          #{if @$el.prop 'multiple' then "<span class='current-selection badge'></span>"}
        </div>
        """)

    PrepareOpts: (opts) ->
      for opt in opts
        # create li
        $(document.createElement 'li').attr({
          'class': "list-group-item #{if opt.selected then 'selected' else ''}"
        }).data('val', $(opt).val())
        # insert color-code square
        .append($(document.createElement 'div')
                .attr({ 'class': "color-code #{'no-color' if not $(opt).data 'selectr-color'}" })
                .css('background-color', $(opt).data 'selectr-color'))
        # insert name
        .append($(document.createElement 'div')
                .text($(opt).text())
                .attr({ 'class': 'option-name', 'title': if $(opt).text().length > @args.tooltipBreakpoint then $(opt).text() }))
        # insert add/remove
        .append($(document.createElement 'div')
                .html('&times')
                .attr({ 'class': "add-remove #{if not @$el.prop 'multiple' then 'hidden'}"}))

    MonitorSource: ->
      self = this

      @sync = =>

        # if not triggered by selectr
        unless @$el.data 'selectr-change-triggered'

          thisSelectr = @$el.next()
          updatedList = $(document.createElement 'ul').attr({ 'class': 'list-group', 'style': "max-height: #{self.args.maxListHeight};"})
          opts = @PrepareOpts($('option', @$el))

          updatedList.append(opts)
          $('.list-group', thisSelectr).replaceWith(updatedList)

          #update current selection counter
          currentSelectionCount = $('option:selected', @$el).length
          $('.current-selection', thisSelectr).text(if currentSelectionCount > 0 then currentSelectionCount else '')

          #show/hide footer
          $selectrFooter = $('.panel-footer', thisSelectr)
          if currentSelectionCount > 0 && $(@$el).prop('multiple')
           $selectrFooter.removeClass('hidden')
          else
           $selectrFooter.addClass('hidden')

      # IE8-10 (what did you expect...)
      if @$el.length && @$el[0].attachEvent
        @$el.each ->
          this.attachEvent("onpropertychange", self.sync)

      # chrome, safari, firefox, IE11
      observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      if observer?

        if @propertyObserver
          delete @propertyObserver
          @propertyObserver = null

        @propertyObserver = new observer (mutations) ->
          $.each(mutations, self.sync)

        @propertyObserver.observe(@$el.get(0), { attributes: false, childList: true })


    ##############################
    ### Static selectr methods ###
    ##############################

    @TriggerChange: (el) ->

      el.data 'selectr-change-triggered', true
      el.trigger { type: 'change' }
      el.data 'selectr-change-triggered', false

    @SelectOption: (modifyCurrentSelection, opt) ->
      thisSelectr = $(opt).parents('.selectr')
      sourceElement = $(opt).parents('.selectr').prev()

      # prevent >maxSelection
      if $(sourceElement).data('selectr-opts').maxSelection <= $(opt).siblings('.selected').length && modifyCurrentSelection
        return

      # clear current selection unless CTRL key pressed
      if !modifyCurrentSelection
        $('option', sourceElement).prop('selected', false)
        for foo in $(opt).siblings()
          $(foo).removeClass('selected')

      # select this option
      $(opt).addClass('selected')

      # select option on source
      $("option[value=#{$(opt).data('val')}]", sourceElement).prop('selected', true)

      # change current selection count
      currentSelectionCount = $('option:selected', sourceElement).length
      $('.current-selection', thisSelectr).text(if currentSelectionCount > 0 then currentSelectionCount else '')
      $('.panel-footer', thisSelectr).removeClass('hidden') if sourceElement.prop('multiple')

      if currentSelectionCount == $(sourceElement).data('selectr-opts').maxSelection
        thisSelectr.addClass('max-selection-reached')
      else
       thisSelectr.removeClass('max-selection-reached')

      @TriggerChange(sourceElement)

    @DeselectOption: (opt) ->
      sourceElement = $(opt).parents('.selectr').prev()

      $(opt).parents('.selectr').removeClass('max-selection-reached')

      $(opt).removeClass('selected')
      $("option[value=#{$(opt).data('val')}]", sourceElement).prop('selected', false)

      currentSelectionCount = $('option:selected', sourceElement).length
      $('.current-selection', $(opt).parents('.selectr')).text(if currentSelectionCount > 0 then currentSelectionCount else '')
      if currentSelectionCount == 0
        $('.panel-footer', $(opt).parents('.selectr')).addClass('hidden');

      @TriggerChange(sourceElement)

    @bindingsInitialized: false
    @InstallBindings: ->

      # bail if already initialized
      return if Selectr.bindingsInitialized

      # Click option
      $(document).on 'click', '.selectr .list-group-item', (e) ->

        # debounce double-clicks
        if e.originalEvent.detail && e.originalEvent.detail == 2
          return

        sourceElement = $(this).parents('.selectr').prev()
        modifyCurrentSelection = (e.ctrlKey || e.metaKey) && sourceElement.prop 'multiple'

        if $(this).hasClass('selected') && (modifyCurrentSelection || $(this).siblings('.selected').length == 0) && sourceElement.prop 'multiple'
          Selectr.DeselectOption this
        else
          Selectr.SelectOption modifyCurrentSelection, this

        e.stopPropagation()
        e.preventDefault()

        # CTRL key handler
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
        thisSelectr = $(this).parents('.selectr')
        escapedSearchTerm = new RegExp($(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
        noMatchingOptions = true

        # show/hide options
        $('.list-group-item', thisSelectr).each (index, option) ->
          unless $(option).text().match(escapedSearchTerm)
            $(option).addClass 'hidden'
          else
            $(option).removeClass 'hidden'
            noMatchingOptions = false
          return # ohh coffeescript...

        # show/hide clear search 'X'
        $clearSearchX = $('.clear-search', thisSelectr)
        if $(this).val().length > 0
          $clearSearchX.removeClass 'hidden'
        else
          $clearSearchX.addClass 'hidden'

        # show/hide 'No options found' message
        $noOptionsFoundMessage = $('.no-matching-options', thisSelectr)
        if noMatchingOptions
          $noOptionsFoundMessage.removeClass 'hidden'
        else
          $noOptionsFoundMessage.addClass 'hidden'

        e.stopPropagation();
        e.preventDefault();

      # Clear search
      $(document).on 'click', '.selectr .clear-search', (e) ->
        $(this).siblings('input').val('').click()

        e.stopPropagation();
        e.preventDefault();

      # Clear selected options
      $(document).on 'click', '.selectr .reset', (e) ->
        thisSelectr = $(this).parents('.selectr')
        sourceElement = thisSelectr.prev()

        # deselect all on selectr and source
        thisSelectr.find('ul > li').removeClass('selected')
        $('option', sourceElement).prop('selected', false)
        Selectr.TriggerChange(sourceElement)

        # clear selection count and hide footer
        $('.current-selection', thisSelectr).text('')
        $('.panel-footer', thisSelectr).addClass('hidden')

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