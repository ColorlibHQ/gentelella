# easyPieChart

> Lightweight plugin to render simple, animated and retina optimized pie charts

![Version](http://img.shields.io/version/2.1.6.png?color=green)
[![Build Status](https://travis-ci.org/rendro/easy-pie-chart.png)](https://travis-ci.org/rendro/easy-pie-chart)
[![Dependencies Status](https://david-dm.org/rendro/easy-pie-chart/dev-status.png)](https://david-dm.org/rendro/easy-pie-chart)
[![Analytics](https://ga-beacon.appspot.com/UA-46840672-1/easy-pie-chart/readme)](https://github.com/igrigorik/ga-beacon)



## Features
[![](https://github.com/rendro/easy-pie-chart/raw/master/demo/img/easy-pie-chart.png)](http://drbl.in/ezuc)

* highly customizable
* very easy to implement
* resolution independent (retina optimized)
* uses `requestAnimationFrame` for smooth animations on modern devices and
* works in all modern browsers, even in IE7+ with [excanvas](https://code.google.com/p/explorercanvas/wiki/Instructions)

#### framework support

* Vanilla JS *(no dependencies)* (~872 bytes)
* jQuery plugin (~921 bytes)
* Angular Module (~983 bytes)



## Get started
#### Installation

You can also use [bower](http://bower.io) to install the component:

```
$ bower install jquery.easy-pie-chart
```

#### jQuery

To use the easy pie chart plugin you need to load the current version of jQuery (> 1.6.4) and the source of the plugin.

```html
<div class="chart" data-percent="73" data-scale-color="#ffb400">73%</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="/path/to/jquery.easy-pie-chart.js"></script>
<script>
    $(function() {
        $('.chart').easyPieChart({
            //your options goes here
        });
    });
</script>
```

#### Vanilla JS

If you don't want to use jQuery, implement the Vanilla JS version without any dependencies.

```html
<div class="chart" data-percent="73">73%</div>

<script src="/path/to/easy-pie-chart.js"></script>
<script>
    var element = document.querySelector('.chart');
    new EasyPieChart(element, {
        // your options goes here
    });
</script>
```

#### AngularJS

```html
<div ng-controller="chartCtrl">
    <div easypiechart options="options" percent="percent"></div>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.9/angular.min.js"></script>
<script src="../dist/angular.easypiechart.min.js"></script>
<script>
    var app = angular.module('app', ['easypiechart']);
    app.controller('chartCtrl', ['$scope', function ($scope) {
        $scope.percent = 65;
        $scope.options = {
            animate:{
                duration:0,
                enabled:false
            },
            barColor:'#2C3E50',
            scaleColor:false,
            lineWidth:20,
            lineCap:'circle'
        };
    }]);
</script>
```



## Options
You can pass these options to the initialize function to set a custom look and feel for the plugin.

<table>
    <tr>
        <th>Property (Type)</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><strong>barColor</strong></td>
        <td>#ef1e25</td>
        <td>The color of the curcular bar. You can either pass a valid css color string, or a function that takes the current percentage as a value and returns a valid css color string.</td>
    </tr>
    <tr>
        <td><strong>trackColor</strong></td>
        <td>#f2f2f2</td>
        <td>The color of the track, or false to disable rendering.</td>
    </tr>
    <tr>
        <td><strong>scaleColor</strong></td>
        <td>#dfe0e0</td>
        <td>The color of the scale lines, false to disable rendering.</td>
    </tr>
    <tr>
        <td><strong>scaleLength</strong></td>
        <td>5</td>
        <td>Length of the scale lines (reduces the radius of the chart).</td>
    </tr>
    <tr>
        <td><strong>lineCap</strong></td>
        <td>round</td>
        <td>Defines how the ending of the bar line looks like. Possible values are: <code>butt</code>, <code>round</code> and <code>square</code>.</td>
    </tr>
    <tr>
        <td><strong>lineWidth</strong></td>
        <td>3</td>
        <td>Width of the chart line in px.</td>
    </tr>
    <tr>
        <td><strong>size</strong></td>
        <td>110</td>
        <td>Size of the pie chart in px. It will always be a square.</td>
    </tr>
        <tr>
        <td><strong>rotate</strong></td>
        <td>0</td>
        <td>Rotation of the complete chart in degrees.</td>
    </tr>
    <tr>
        <td><strong>animate</strong></td>
        <td>object</td>
        <td>Object with time in milliseconds and boolean for an animation of the bar growing (<code>{ duration: 1000, enabled: true }</code>), or false to deactivate animations.</td>
    </tr>
    <tr>
        <td><strong>easing</strong></td>
        <td>defaultEasing</td>
        <td>Easing function or string with the name of a <a href="http://gsgd.co.uk/sandbox/jquery/easing/" target="_blank">jQuery easing function</a></td>
    </tr>
</table>



## Callbacks
All callbacks will only be called if `animate` is not `false`.

<table>
    <tr>
        <th>Callback(params, ...)</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><strong>onStart(from, to)</strong></td>
        <td>Is called at the start of any animation.</td>
    </tr>
    <tr>
        <td><strong>onStep(from, to, currentValue)</strong></td>
        <td>Is called during animations providing the current value (the method is scoped to the context of th eplugin, so you can access the DOM element via <code>this.el</code>).</td>
    </tr>
    <tr>
        <td><strong>onStop(from, to)</strong></td>
        <td>Is called at the end of any animation.</td>
    </tr>
</table>



## Plugin api
#### jQuery

```javascript
$(function() {
    // instantiate the plugin
    ...
    // update
    $('.chart').data('easyPieChart').update(40);
    ...
    // disable animation
    $('.chart').data('easyPieChart').disableAnimation();
    ...
    // enable animation
    $('.chart').data('easyPieChart').enableAnimation();
});
```

#### Vanilla JS

```javascript
// instantiate the plugin
var chart = new EasyPieChart(element, options);
// update
chart.update(40);
// disable animation
chart.disableAnimation();
// enable animation
chart.enableAnimation();
```

###### Using a gradient

```javascript
new EasyPieChart(element, {
  barColor: function(percent) {
    var ctx = this.renderer.ctx();
    var canvas = this.renderer.canvas();
    var gradient = ctx.createLinearGradient(0,0,canvas.width,0);
        gradient.addColorStop(0, "#ffe57e");
        gradient.addColorStop(1, "#de5900");
    return gradient;
  }
});
```

#### AngularJS

For a value binding you need to add the `percent` attribute and bind it to your controller.

#### RequireJS

When using [RequireJS](http://requirejs.org) you can define your own name. Examples can be found in the `demo/requirejs.html`.



## Browser Support
Native support

* Chrome
* Safari
* FireFox
* Opera
* Internet Explorer 9+

Support for Internet Explorer 7 and 8 with [excanvas](https://code.google.com/p/explorercanvas/wiki/Instructions) polyfill.



## Test
To run the test just use the karma adapter of grunt: `grunt test`



## Credits
Thanks to [Rafal Bromirski](http://www.paranoida.com/) for designing [this dribble shot](http://drbl.in/ezuc) which inspired me building this plugin.



## Copyright
Copyright (c) 2014 Robert Fleischmann, contributors. Released under the MIT, GPL licenses
