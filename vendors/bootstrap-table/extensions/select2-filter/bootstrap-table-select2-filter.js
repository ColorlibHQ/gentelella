/**
 * @author: Jewway
 * @version: v1.0.0
 */

!function ($) {
  'use strict';

  function getCurrentHeader(that) {
    var header = that.$header;
    if (that.options.height) {
      header = that.$tableHeader;
    }

    return header;
  }

  function getFilterFields(that) {
    return getCurrentHeader(that).find('[data-filter-field]');
  }

  function setFilterValues(that) {
    var $filterElms = getFilterFields(that);
    if (!$.isEmptyObject(that.filterColumnsPartial)) {
      $filterElms.each(function (index, ele) {
        var $ele = $(ele),
            field = $ele.attr('data-filter-field'),
            value = that.filterColumnsPartial[field];

        if ($ele.is("select")) {
          $ele.val(value).trigger('change');
        }
        else {
          $ele.val(value);
        }
      });
    }
  }

  function createFilter(that, header) {
    var enableFilter = false,
        isVisible,
        html,
        timeoutId = 0;

    $.each(that.columns, function (i, column) {
      isVisible = 'hidden';
      html = [];

      if (!column.visible) {
        return;
      }

      if (!column.filter) {
        html.push('<div class="no-filter"></div>');
      } else {
        var filterClass = column.filter.class ? ' ' + column.filter.class : '';
        html.push('<div style="margin: 0px 2px 2px 2px;" class="filter' + filterClass + '">');

        if (column.searchable) {
          enableFilter = true;
          isVisible = 'visible'
        }

        switch (column.filter.type.toLowerCase()) {
          case 'input' :
            html.push('<input type="text" data-filter-field="' + column.field + '" style="width: 100%; visibility:' + isVisible + '">');
            break;
          case 'select':
            html.push('<select data-filter-field="' + column.field + '" style="width: 100%; visibility:' + isVisible + '"></select>');
            break;
        }
      }

      $.each(header.children().children(), function (i, tr) {
        tr = $(tr);
        if (tr.data('field') === column.field) {
          tr.find('.fht-cell').append(html.join(''));
          return false;
        }
      });
    });

    if (enableFilter) {
      var $inputs = header.find('input'),
          $selects = header.find('select');


      if ($inputs.length > 0) {
        $inputs.off('keyup').on('keyup', function (event) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(function () {
            that.onColumnSearch(event);
          }, that.options.searchTimeOut);
        });


        $inputs.off('mouseup').on('mouseup', function (event) {
          var $input = $(this),
              oldValue = $input.val();

          if (oldValue === "") {
            return;
          }

          setTimeout(function () {
            var newValue = $input.val();

            if (newValue === "") {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(function () {
                that.onColumnSearch(event);
              }, that.options.searchTimeOut);
            }
          }, 1);
        });
      }

      if ($selects.length > 0) {
        $selects.on('select2:select', function (event) {
          that.onColumnSearch(event);
        });
      }
    } else {
      header.find('.filter').hide();
    }
  }

  function initSelect2(that) {
    var $header = getCurrentHeader(that);

    $.each(that.columns, function (idx, column) {
      if (column.filter && column.filter.type === 'select') {
        var $selectEle = $header.find('select[data-filter-field=' + column.field + ']');

        if ($selectEle.length > 0 && !$selectEle.data().select2) {
          column.filter.data.unshift("");

          var select2Opts = {
            placeholder: "",
            allowClear: true,
            data: column.filter.data,
            dropdownParent: that.$el.closest(".bootstrap-table")
          };

          $selectEle.select2(select2Opts);
          $selectEle.on("select2:unselecting", function (event) {
            event.preventDefault();
            $selectEle.val(null).trigger('change');
            that.searchText = undefined;
            that.onColumnSearch(event);
          });
        }
      }
    });
  }

  $.extend($.fn.bootstrapTable.defaults, {
    filter: false,
    filterValues: {}
  });

  $.extend($.fn.bootstrapTable.COLUMN_DEFAULTS, {
    filter: undefined
  });

  var BootstrapTable = $.fn.bootstrapTable.Constructor,
      _init = BootstrapTable.prototype.init,
      _initHeader = BootstrapTable.prototype.initHeader,
      _initSearch = BootstrapTable.prototype.initSearch;

  BootstrapTable.prototype.init = function () {
    //Make sure that the filtercontrol option is set
    if (this.options.filter) {
      var that = this;

      if (!$.isEmptyObject(that.options.filterValues)) {
        that.filterColumnsPartial = that.options.filterValues;
        that.options.filterValues = {};
      }

      this.$el.on('reset-view.bs.table', function () {
        //Create controls on $tableHeader if the height is set
        if (!that.options.height) {
          return;
        }

        //Avoid recreate the controls
        if (that.$tableHeader.find('select').length > 0 || that.$tableHeader.find('input').length > 0) {
          return;
        }

        createFilter(that, that.$tableHeader);
      }).on('post-header.bs.table', function () {
        var timeoutId = 0;

        initSelect2(that);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          setFilterValues(that);
        }, that.options.searchTimeOut - 1000);
      }).on('column-switch.bs.table', function (field, checked) {
        setFilterValues(that);
      });
    }

    _init.apply(this, Array.prototype.slice.apply(arguments));
  };

  BootstrapTable.prototype.initHeader = function () {
    _initHeader.apply(this, Array.prototype.slice.apply(arguments));
    if (this.options.filter) {
      createFilter(this, this.$header);
    }
  };

  BootstrapTable.prototype.initSearch = function () {
    _initSearch.apply(this, Array.prototype.slice.apply(arguments));

    var that = this,
        filterValues = that.filterColumnsPartial;

    // Filter for client
    if (that.options.sidePagination === 'client') {
      this.data = $.grep(this.data, function (row, idx) {
        for (var field in filterValues) {
          var column = that.columns[$.fn.bootstrapTable.utils.getFieldIndex(that.columns, field)],
              filterValue = filterValues[field].toLowerCase(),
              rowValue = row[field];

          rowValue = $.fn.bootstrapTable.utils.calculateObjectValue(
              that.header,
              that.header.formatters[$.inArray(field, that.header.fields)],
              [rowValue, row, idx], rowValue);

          if (column.filterStrictSearch) {
            if (!($.inArray(field, that.header.fields) !== -1 &&
                (typeof rowValue === 'string' || typeof rowValue === 'number') &&
                rowValue.toString().toLowerCase() === filterValue.toString().toLowerCase())) {
              return false;
            }
          } else {
            if (!($.inArray(field, that.header.fields) !== -1 &&
                (typeof rowValue === 'string' || typeof rowValue === 'number') &&
                (rowValue + '').toLowerCase().indexOf(filterValue) !== -1)) {
              return false;
            }
          }
        }

        return true;
      });
    }
  };

  BootstrapTable.prototype.onColumnSearch = function (event) {
    var field = $(event.currentTarget).attr('data-filter-field'),
        value = $.trim($(event.currentTarget).val());

    if ($.isEmptyObject(this.filterColumnsPartial)) {
      this.filterColumnsPartial = {};
    }

    if (value) {
      this.filterColumnsPartial[field] = value;
    } else {
      delete this.filterColumnsPartial[field];
    }

    this.options.pageNumber = 1;
    this.onSearch(event);
  };

  BootstrapTable.prototype.setFilterData = function (field, data) {
    var that = this,
        $header = getCurrentHeader(that),
        $selectEle = $header.find('select[data-filter-field=\"' + field + '\"]');

    data.unshift("");
    $selectEle.empty();
    $selectEle.select2({
      data: data,
      placeholder: "",
      allowClear: true,
      dropdownParent: that.$el.closest(".bootstrap-table")
    });

    $.each(this.columns, function (idx, column) {
      if (column.field === field) {
        column.filter.data = data;
        return false;
      }
    });
  };

  BootstrapTable.prototype.setFilterValues = function (values) {
    this.filterColumnsPartial = values;
  };

  $.fn.bootstrapTable.methods.push('setFilterData');
  $.fn.bootstrapTable.methods.push('setFilterValues');

}(jQuery);