/**
 * Bootstrap Table Hebrew translation
 * Author: legshooter
 */
(function ($) {
    'use strict';

    $.fn.bootstrapTable.locales['he-IL'] = {
        formatLoadingMessage: function () {
            return 'טוען, נא להמתין...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return pageNumber + ' שורות בעמוד';
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return 'מציג ' + pageFrom + ' עד ' + pageTo + ' מ-' + totalRows + ' שורות';
        },
        formatSearch: function () {
            return 'חיפוש';
        },
        formatNoMatches: function () {
            return 'לא נמצאו רשומות תואמות';
        },
        formatPaginationSwitch: function () {
            return 'הסתר/הצג מספור דפים';
        },
        formatRefresh: function () {
            return 'רענן';
        },
        formatToggle: function () {
            return 'החלף תצוגה';
        },
        formatColumns: function () {
            return 'עמודות';
        },
        formatAllRows: function () {
            return 'הכל';
        }
    };

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['he-IL']);

})(jQuery);
