!(function ($) {

  var UWidget = function (element, options) {
    this.init($(element), options);
  };

  UWidget.prototype = {
    options: {
      url: null,
      handler: null,
      template: null,
      sort: {
        enabled: false,
        name: 'sort',
        values: ['id', 'date'],
        labels: ['Identifier', 'Date']
      },
      direction: {
        enabled: false,
        name: 'direction',
        values: ['desc', 'asc'],
        labels: ['Descending', 'Ascending']
      },
      filters: {
        ebabled: false,
        name: 'filters',
        values: [],
        labels: []
      }
    },

    init: function ($element, options) {
      this.$element = $element;
      this.options = $.extend(true, {}, this.options, options);
      this._xhrCache = {};

      if (!this.options.url || !this.options.handler || !this.options.template)
        throw new Error('You must define a widget url, an ajax handler and a template');

      this
        ._initActions()
        ._initFromDOM()
        .fetch();
    },

    _initActions: function () {
      var i, checked;
      this.$actions = $('<span class="uwidget-actions"></span>');

      if (this.options.sort.enabled) {
        this.$sort = $('<select name="'+ this.options.sort.name +'"></select>')
          .on('change', false, $.proxy(this._updateActions, this));

        for (i = 0; i < this.options.sort.values.length; i++)
          this.$sort.append('<option value="' + this.options.sort.values[i] + '">' + this.options.sort.labels[i] + '</option>');

        this.$actions.append(this.$sort);
      }

      if (this.options.direction.enabled) {
        this.$direction = $('<select name="'+ this.options.direction.name +'"></select>')
          .on('change', false, $.proxy(this._updateActions, this));

        for (i = 0; i < this.options.direction.values.length; i++)
          this.$direction.append('<option value="' + this.options.direction.values[i] + '">' + this.options.direction.labels[i] + '</option>');

        this.$actions.append(this.$direction);
      }

      if (this.options.filters.enabled) {
        this.$filters = $('<span class="filters"></span>')
          .on('change', false, $.proxy(this._updateActions, this));

        for (i = 0; i < this.options.filters.values.length; i++) {
          checked = this.$element.data('filters') && new RegExp(this.options.filters.labels[i], 'i').test(this.$element.data('filters'));
          this.$filters.append(this.options.filters.labels[i] + ' <input type="checkbox" name="filters[]" value="' + this.options.filters.values[i] + '" ' + (checked ? 'checked' : '') + '/>');
        }

        this.$actions.append(this.$filters);
      }

      this.$container = $('<ul class="uwidget-container"></ul>');
      this.$info = $('<span class="uwidget-info"><a href="#" target="_blank">UWidget</a></span>');

      this.$element
        .append(this.$actions)
        .append(this.$container)
        .append(this.$info);

      this._updateActions();

      return this;
    },

    _initFromDOM: function () {
      if (this.$element.data('width'))
        this.$element.css('width', this.$element.data('width'));

      if (this.$element.data('height')) {
        this.$element.css('height', this.$element.data('height'));
        this.$container.css('height', this.$element.height() - this.$actions.height() - this.$info.height());
      }

      return this;
    },

    _updateActions: function () {
      if (this.options.sort.enabled)
        this.$element.data('sort', this.$sort.val());

      if (this.options.direction.enabled)
        this.$element.data('direction', this.$direction.val());

      if (this.options.filters.enabled) {
        var val = [];

        this.$actions.find('input[type=checkbox]:checked').each(function () {
          val.push($(this).val());
        });

        this.$element.data('filters', val.join(', '));
      }

      this.fetch();
    },

    getUrl: function () {
      var url = ('function' === typeof this.options.url ? this.options.url(this.options) : this.options.url),
        options = ['sort', 'direction', 'filters'],
        value = '';

      url += -1 !== url.indexOf('?') ? '&uwidget' : '?uwidget';

      for (var i = 0; i < options.length; i++) {
        value = this.$element.data([options[i]] + '');

        if (this.options[options[i]].enabled && value.length)
          url += '&' + this.options[options[i]].name + '=' + value;
      }

      return url;
    },

    fetch: function () {
      var that = this,
        url = that.getUrl();

      this.$element
        .removeClass('error')
        .removeClass('fetched')
        .addClass('fetching');

      if ('undefined' !== typeof this._xhrCache[url])
        return this._updateCollection.apply(this, this._xhrCache[url]);

      $.ajax($.extend(true, {}, {
        url: url
      }, that.$element.data('remoteOptions')))
        .done(function () {
          that._updateCollection.apply(that, arguments);
          that._xhrCache[url] = arguments;
        })
        .fail(function () {
          that.$container.addClass('error');
        })
        .always(function () {
          that.$container.removeClass('fetching');
        });
    },

    _updateCollection: function (collection) {
      this.$container.html('').addClass('fetched');
      collection = this.options.handler.apply(this, arguments);

      for (var i = 0; i < collection.length; i++)
        this.$container.append(tmpl(this.options.template, collection[i]));
    }
  };

  $.fn.UWidget = function (options) {
    return new UWidget(this, options);
  };

  // Simple JavaScript Templating
  // John Resig - http://ejohn.org/ - MIT Licensed
  (function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
          tmpl(document.getElementById(str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +

          // Introduce the data as local variables using with(){}
          "with(obj){p.push('" +

          // Convert the template into pure JavaScript
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
          + "');}return p.join('');");

      // Provide some basic currying to the user
      return data ? fn(data) : fn;
    };
  })();
})(window.jQuery);
