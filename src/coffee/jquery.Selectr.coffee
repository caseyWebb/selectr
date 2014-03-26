do ($) ->

  class AbstractSelectr

    Init: (args, element, opts) ->
    
      # build container
      @container = @CreateContainer()
      @opts = @PrepareOpts(opts)
      $('.selectr-list-group', @container).append(@opts)
        
      # install bindings
      @InstallBindings()
      @MonitorSource(element)
        
      # add selectr to DOM and hide element
      @container.insertAfter(element)
    
    CreateContainer: ->
      $(document.createElement 'div').attr({
        'class': 'selectr-container panel panel-default'
      }).html("""
          <div class='selectr-panel-heading panel-heading'>
            <h4 class='selectr-panel-title panel-title'>
              // TODO
            </h4>
          </div>
          <div class='selectr-panel-body panel-body'>
            <input class='selectr-form-control form-control' placeholder='// TODO'>
          </div>
          <ul class='selectr-list-group list-group'>
          </ul>
          <div class='selectr-panel-footer panel-footer'>
            <button class='selectr-reset btn btn-sm btn-default'>
              Reset Filter
            </button>
          </div>
          """)

    PrepareOpts: (opts) ->
      for opt in opts
        $(document.createElement 'li').attr({
          'class': "selectr-list-group-item list-group-item #{if opt.selected then 'list-group-item-success'}"
        }).text($(opt).text())
        
    TriggerChange: -> #TODO
      console.log 'change'

    InstallBindings: -> # TODO
      console.log @container

    MonitorSource: (source) -> # TODO
      console.log source

  class SingleSelectr extends AbstractSelectr

  class MultiSelectr extends AbstractSelectr

  $.fn.selectr = (args) ->
    `var selectr, element, opts`

    @each () ->

      element = $(this)
      opts = $('option', this)

      selectr = if element.prop('multiple') then new MultiSelectr else new SingleSelectr

      selectr.Init(args, element, opts)

    return this

$('select').selectr()