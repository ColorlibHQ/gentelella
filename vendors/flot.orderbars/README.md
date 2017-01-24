flot-orderBars
==============

Fork of the Flot OrderBars plugin found here: http://www.benjaminbuffet.com/public/js/jquery.flot.orderBars.js

Improvements
============

### Compatability with Flot Stack Plugin
The main improvement I've made is compatability with the [Flot Stack plugin](https://github.com/flot/flot/blob/master/jquery.flot.stack.js).

To use the 2 together:
* Ensure that your data is well formed. Each series should contain a bars object with an order integer, like so:
```javascript
  var series = [];
  
  series.push({
      data: [], // your raw data
      bars: {
          order: 0
      }
  });
  
  series.push({
      data: [], // your raw data
      bars: {
          order: 1
      }
  });
```

* Ensure that the order bars plugin is loaded __before__ the stack plugin.

See the example for more information.


