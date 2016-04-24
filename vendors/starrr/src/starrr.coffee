(($, window) ->

  window.Starrr = class Starrr
    defaults:
      rating: undefined
      max: 5
      readOnly: false
      emptyClass: 'fa fa-star-o'
      fullClass: 'fa fa-star'
      change: (e, value) ->

    constructor: ($el, options) ->
      @options = $.extend({}, @defaults, options)
      @$el = $el
      @createStars()
      @syncRating()

      return if @options.readOnly

      @$el.on 'mouseover.starrr', 'a', (e) =>
        @syncRating(@getStars().index(e.currentTarget) + 1)

      @$el.on 'mouseout.starrr', =>
        @syncRating()

      @$el.on 'click.starrr', 'a', (e) =>
        @setRating(@getStars().index(e.currentTarget) + 1)

      @$el.on 'starrr:change', @options.change

    getStars: ->
      @$el.find('a')

    createStars: ->
      @$el.append("<a href='#' />") for [1..@options.max]

    setRating: (rating) ->
      rating = undefined if @options.rating == rating
      @options.rating = rating
      @syncRating()
      @$el.trigger('starrr:change', rating)

    getRating: ->
      @options.rating

    syncRating: (rating) ->
      rating ||= @options.rating
      $stars = @getStars()
      for i in [1..@options.max]
        $stars.
          eq(i - 1).
          removeClass(if rating >= i then @options.emptyClass else @options.fullClass).
          addClass(if rating >= i then @options.fullClass else @options.emptyClass)

  # Define the plugin
  $.fn.extend starrr: (option, args...) ->
    @each ->
      data = $(@).data('starrr')

      if !data
        $(@).data 'starrr', (data = new Starrr($(@), option))
      if typeof option == 'string'
        data[option].apply(data, args)

) window.jQuery, window
