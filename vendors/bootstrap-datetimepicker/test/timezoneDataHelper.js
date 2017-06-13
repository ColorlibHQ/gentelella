(function () {
    'use strict';
    $.ajax('node_modules/moment-timezone/data/packed/latest.json', {
        success: function (data) {
            moment.tz.load(data);
        },
        method: 'GET',
        dataType: 'json',
        async: false
    });
}());
