### Installation

You can also use [bower](http://bower.io) to install the component:

```
$ bower install jquery.easy-pie-chart
```

### jQuery

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

### Vanilla JS

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

### AngularJS

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
