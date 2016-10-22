/**
 * @author Homer Glascock <HopGlascock@gmail.com>
 * @version: v1.0.0
 */

 !function ($) {
    "use strict";

    var sprintf = $.fn.bootstrapTable.utils.sprintf;

    var reInit = function (self) {
        self.initHeader();
        self.initSearch();
        self.initPagination();
        self.initBody();
    };

    $.extend($.fn.bootstrapTable.defaults, {
        showToggleBtn: false,
        multiToggleDefaults: [], //column names go here
    });

    $.fn.bootstrapTable.methods.push('hideAllColumns', 'showAllColumns');

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initToolbar = BootstrapTable.prototype.initToolbar;

    BootstrapTable.prototype.initToolbar = function () {

        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        var that = this,
            $btnGroup = this.$toolbar.find('>.btn-group');

        if (typeof this.options.multiToggleDefaults === 'string') {
            this.options.multiToggleDefaults = JSON.parse(this.options.multiToggleDefaults);
        }

        if (this.options.showToggleBtn && this.options.showColumns) {
            var showbtn = "<button class='btn btn-default hidden' id='showAllBtn'><span class='glyphicon glyphicon-resize-full icon-zoom-in'></span></button>",
                hidebtn = "<button class='btn btn-default' id='hideAllBtn'><span class='glyphicon glyphicon-resize-small icon-zoom-out'></span></button>";

            $btnGroup.append(showbtn + hidebtn);

            $btnGroup.find('#showAllBtn').click(function () { that.showAllColumns(); 
                $btnGroup.find('#hideAllBtn').toggleClass('hidden');
                $btnGroup.find('#showAllBtn').toggleClass('hidden');  
            });
            $btnGroup.find('#hideAllBtn').click(function () { that.hideAllColumns(); 
                $btnGroup.find('#hideAllBtn').toggleClass('hidden');
                $btnGroup.find('#showAllBtn').toggleClass('hidden');  
            });
        }
    };

    BootstrapTable.prototype.hideAllColumns = function () {
        var that = this,
            defaults = that.options.multiToggleDefaults;

        $.each(this.columns, function (index, column) {
            //if its one of the defaults dont touch it
            if (defaults.indexOf(column.field) == -1 && column.switchable) {
                column.visible = false;
                var $items = that.$toolbar.find('.keep-open input').prop('disabled', false);
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', false);
            }
        });

        reInit(that);
    };

    BootstrapTable.prototype.showAllColumns = function () {
        var that = this;
        $.each(this.columns, function (index, column) {
            if (column.switchable) {
                column.visible = true;
            }

            var $items = that.$toolbar.find('.keep-open input').prop('disabled', false);
            $items.filter(sprintf('[value="%s"]', index)).prop('checked', true);
        });

        reInit(that);

        that.toggleColumn(0, that.columns[0].visible, false);
    };
    
}(jQuery);