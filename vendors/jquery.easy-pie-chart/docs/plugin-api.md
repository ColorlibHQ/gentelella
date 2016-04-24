### jQuery

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

### Vanilla JS

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

##### Using a gradient

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

### AngularJS

For a value binding you need to add the `percent` attribute and bind it to your controller.

### RequireJS

When using [RequireJS](http://requirejs.org) you can define your own name. Examples can be found in the `demo/requirejs.html`.
