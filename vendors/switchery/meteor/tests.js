'use strict';

Tinytest.add('Switchery integration', function (test) {

    var checkbox = document.createElement('input');
    checkbox.className = 'js-switch';
    var switchy = new Switchery(checkbox);

    test.instanceOf(switchy, Switchery, 'instantiation OK');
});