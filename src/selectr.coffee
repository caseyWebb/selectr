jQuery = require 'jquery'

unless window.NO_STYLES
  require './selectr.scss'
  require './bs-polyfill.scss' if window.POLYFILL_BOOTSTRAP_STYLES

do ($ = jQuery, window = @) ->

  class Selectr

    defaults:
      title:                  'Select Options'
      noMatchingOptionsText:  'No options found'
      placeholder:            'Search'
      resetText:              'Clear All'
      width:                  '300px'
      maxListHeight:          '250px'
      tooltipBreakpoint:      25
      maxSelection:           Infinity
      panelStyle:             'default'
      alwaysShowFooter:       false

    constructor: (@source, @args) ->
      @args   = $.extend {}, @defaults, @args, @source.data('selectr-opts')
      @multi  = @source.prop 'multiple'

      @createSelectr()

      @monitorSource()

      @selectrContainer.insertAfter(@source)
      @selectrContainer = $ @source.next()

      @bindEventListeners()

      @source.hide()

    createSelectr: ->
      @selectrContainer = @createContainer()

      $('.list-group', @selectrContainer).append @createOpts()

      @updateFooter()

    createContainer: ->
      $(document.createElement 'div')
        .addClass "selectr panel panel-#{@args.panelStyle} #{'multi' if @multi}"
        .css      'width', @args.width
        .html "
          <div class='panel-heading #{"no-title" if @args.title == ''}'>
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
          <div class='panel-footer #{'hidden' if !@multi && !@args.alwaysShowFooter}'>
            <button class='reset btn btn-sm btn-default' type='button'>
              #{@args.resetText}
            </button>
            #{if @multi then "<span class='current-selection badge'></span>" else ''}
          </div>
        "

    createOpts: ->
      for opt in $('option', @source)
        $(document.createElement 'li')
          .addClass "list-group-item #{'selected' if $(opt).is(':selected')}"
          .data     'val', $(opt).val()

          # insert color-code square
          .append(
            $(document.createElement 'div')
              .addClass "color-code #{'no-color' if !$(opt).data 'selectr-color'}"
              .css      'background-color', $(opt).data 'selectr-color'
          )

          # insert name
          .append(
            $(document.createElement 'div')
              .html     $(opt).text().split(@args.separator).map((elm) -> "<span>#{elm}</span>").join(@args.separator || '')
              .addClass 'option-name'
              .attr     title: $(opt).text()
          )

          # insert add/remove
          .append(
            $(document.createElement 'div')
              .html     '&times'
              .addClass "add-remove #{'hidden' if !@multi}"
          )

    monitorSource: ->

      _sync = =>
        updatedList = $(document.createElement 'ul')
          .addClass 'list-group'
          .css      'max-height', @args.maxListHeight
          .append   @createOpts()

        $('.list-group', @selectrContainer).replaceWith(updatedList)

        @updateFooter()

      ###
      Update selectr on source element 'change' event

      Ideally, this should handle added/removed opts, as well
      as a programatic changes to the selection, but many
      popular data-binding frameworks do not fire change events,
      so in that case, you will have to do so manually.
      ###
      @source.on 'change', (e, selectrInitiated) ->
        _sync() if selectrInitiated != 'selectrInitiated'

      # The below causes issues in IE, remove and improve in v3

      # observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      # return if !observer?

      # propertyObserver = new observer (mutations) ->
      #   $.each mutations, _sync

      # propertyObserver.observe @source.get(0), attributes: false, childList: true, subtree: true

    bindEventListeners: ->

      # accessors for handler functions
      multi             = @multi
      selectrContainer  = @selectrContainer
      source            = @source
      select            = @selectOption
      deselect          = @deselectOption
      triggerChange     = @triggerChange
      updateFooter      = @updateFooter

      listItemHandler = (e) ->
        e.stopPropagation()

        # debounce double-clicks
        return if e.originalEvent?.detail == 2

        modifyCurrentSelection = (e.ctrlKey || e.metaKey) && multi

        if $(@).hasClass('selected') && (modifyCurrentSelection || $(@).siblings('.selected').length == 0) && multi
          deselect @

        else
          select modifyCurrentSelection, @

      addRemoveHandler = (e) ->
        e.stopPropagation()

        return if e.originalEvent.detail && e.originalEvent.detail == 2

        opt = $(e.target).parents('.list-group-item')

        if opt.hasClass 'selected'
          deselect opt

        else
          select true, opt

      searchHandler = (e) ->
        e.stopPropagation()

        escapedSearchTerm = new RegExp $(@).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i'
        noMatchingOptions = true

        # show/hide options
        $('.list-group-item', selectrContainer).each (index, option) ->

          unless $(option).text().match(escapedSearchTerm)
            $(option).addClass 'hidden'

          else
            $(option).removeClass 'hidden'
            noMatchingOptions = false

          return # ohh coffeescript...

        # show/hide clear search 'X'
        $clearSearchX = $('.clear-search', selectrContainer)

        if $(@).val().length > 0
          $clearSearchX.removeClass 'hidden'

        else
          $clearSearchX.addClass 'hidden'

        # show/hide 'No options found' message
        $noOptionsFoundMessage = $('.no-matching-options', selectrContainer)

        if noMatchingOptions
          $noOptionsFoundMessage.removeClass 'hidden'

        else
          $noOptionsFoundMessage.addClass 'hidden'

      clearSearchHandler = (e) ->
        $(@).siblings('input').val('').trigger('change')

      resetOptsHandler = (e) ->
        # deselect all on selectr and source
        selectrContainer.find('ul > li').removeClass('selected')
        $('option', source).prop('selected', false)

        triggerChange source
        updateFooter()

      ctrlKeyDownHandler = (e) ->
        $('.list-group', selectrContainer).addClass 'ctrl-key' if e.ctrlKey

      ctrlKeyUpHandler = (e) ->
        $('.list-group', selectrContainer).removeClass 'ctrl-key' if not e.ctrlKey

      $(selectrContainer).on 'click',               '.list-group-item', listItemHandler
      $(selectrContainer).on 'click',               '.add-remove',      addRemoveHandler
      $(selectrContainer).on 'click change keyup',  '.form-control',    searchHandler
      $(selectrContainer).on 'click',               '.clear-search',    clearSearchHandler
      $(selectrContainer).on 'click',               '.reset',           resetOptsHandler
      $(document).on         'keydown',                                 ctrlKeyDownHandler
      $(document).on         'keyup',                                   ctrlKeyUpHandler

    triggerChange: =>
      @source.trigger 'change', ['selectrInitiated']

    selectOption: (modifyCurrentSelection, opt) =>
      # prevent >maxSelection
      return if @args.maxSelection <= $(opt).siblings('.selected').length && modifyCurrentSelection

      # clear current selection unless CTRL key pressed
      if !modifyCurrentSelection

        $('option', @source).prop('selected', false)

        for sibling in $(opt).siblings()
          $(sibling).removeClass('selected')

      # select selectr option
      $(opt).addClass('selected')

      # select source option
      $("option[value='#{$(opt).data('val')}']", @source).prop 'selected', true

      @updateFooter()
      @triggerChange()

    deselectOption: (opt) =>
      @selectrContainer.removeClass('max-selection-reached')

      $(opt).removeClass('selected')
      $("option[value=#{$(opt).data('val')}]", @source).prop 'selected', false

      @updateFooter()
      @triggerChange()

    updateFooter: =>
      return if !@multi

      count = $('option:selected', @source).length
      $('.current-selection', @selectrContainer).text(if count > 0 then count else '')

      if count == @args.maxSelection
        @selectrContainer.addClass('max-selection-reached')
      else
        @selectrContainer.removeClass('max-selection-reached')

      return if @args.alwaysShowFooter

      $footer = $('.panel-footer', @selectrContainer)
      if count == 0
        $footer.addClass('hidden')
      else
        $footer.removeClass('hidden')

  $.fn.extend selectr: (args) ->
    @each ->
      $el = $ @

      return if $el.data 'selectr-initialized'

      new Selectr $el, args
      $el.data 'selectr-initialized', true
