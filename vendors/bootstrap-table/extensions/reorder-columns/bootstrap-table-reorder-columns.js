/**
 * @author: Dennis Hernández
 * @webSite: http://djhvscf.github.io/Blog
 * @version: v1.1.0
 */

!function ($) {

    'use strict';

    //From MDN site, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    var filterFn = function () {
        if (!Array.prototype.filter) {
            Array.prototype.filter = function(fun/*, thisArg*/) {
                'use strict';

                if (this === void 0 || this === null) {
                    throw new TypeError();
                }

                var t = Object(this);
                var len = t.length >>> 0;
                if (typeof fun !== 'function') {
                    throw new TypeError();
                }

                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];

                        // NOTE: Technically this should Object.defineProperty at
                        //       the next index, as push can be affected by
                        //       properties on Object.prototype and Array.prototype.
                        //       But that method's new, and collisions should be
                        //       rare, so use the more-compatible alternative.
                        if (fun.call(thisArg, val, i, t)) {
                            res.push(val);
                        }
                    }
                }

                return res;
            };
        }
    };

    $.extend($.fn.bootstrapTable.defaults, {
        reorderableColumns: false,
        maxMovingRows: 10,
        onReorderColumn: function (headerFields) {
            return false;
        },
        dragaccept: null
    });

    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'reorder-column.bs.table': 'onReorderColumn'
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initHeader = BootstrapTable.prototype.initHeader,
        _toggleColumn = BootstrapTable.prototype.toggleColumn,
        _toggleView = BootstrapTable.prototype.toggleView,
        _resetView = BootstrapTable.prototype.resetView;

    BootstrapTable.prototype.initHeader = function () {
        _initHeader.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.reorderableColumns) {
            return;
        }

        this.makeRowsReorderable();
    };

    BootstrapTable.prototype.toggleColumn = function () {
        _toggleColumn.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.reorderableColumns) {
            return;
        }

        this.makeRowsReorderable();
    };

    BootstrapTable.prototype.toggleView = function () {
        _toggleView.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.reorderableColumns) {
            return;
        }

        if (this.options.cardView) {
            return;
        }

        this.makeRowsReorderable();
    };

    BootstrapTable.prototype.resetView = function () {
        _resetView.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.reorderableColumns) {
            return;
        }

        this.makeRowsReorderable();
    };

    BootstrapTable.prototype.makeRowsReorderable = function () {
        var that = this;
        try {
            $(this.$el).dragtable('destroy');
        } catch (e) {}
        $(this.$el).dragtable({
            maxMovingRows: that.options.maxMovingRows,
            dragaccept: that.options.dragaccept,
            clickDelay:200,
            beforeStop: function() {
                var ths = [],
                    formatters = [],
                    columns = [],
                    columnsHidden = [],
                    columnIndex = -1,
                    optionsColumns = [];
                that.$header.find('th').each(function (i) {
                    ths.push($(this).data('field'));
                    formatters.push($(this).data('formatter'));
                });

                //Exist columns not shown
                if (ths.length < that.columns.length) {
                    columnsHidden = $.grep(that.columns, function (column) {
                       return !column.visible;
                    });
                    for (var i = 0; i < columnsHidden.length; i++) {
                        ths.push(columnsHidden[i].field);
                        formatters.push(columnsHidden[i].formatter);
                    }
                }

                for (var i = 0; i < ths.length; i++ ) {
                    columnIndex = $.fn.bootstrapTable.utils.getFieldIndex(that.columns, ths[i]);
                    if (columnIndex !== -1) {
                        columns.push(that.columns[columnIndex]);
                        that.columns.splice(columnIndex, 1);
                    }
                }

                that.columns = that.columns.concat(columns);

                filterFn(); //Support <IE9
                $.each(that.columns, function(i, column) {
                    var found = false,
                        field = column.field;
                    that.options.columns[0].filter(function(item) {
                        if(!found && item["field"] == field) {
                            optionsColumns.push(item);
                            found = true;
                            return false;
                        } else
                            return true;
                    })
                });

                that.options.columns[0] = optionsColumns;

                that.header.fields = ths;
                that.header.formatters = formatters;
                that.resetView();
                that.trigger('reorder-column', ths);
            }
        });
    };
}(jQuery);
