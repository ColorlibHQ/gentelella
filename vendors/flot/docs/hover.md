## jquery.flot.hover.js

This plugin is used for mouse hover and tap on a point of plot series.
It supports the following options:
```js
grid: {
    hoverable: false, //to trigger plothover event on mouse hover or tap on a point
    clickable: false //to trigger plotclick event on mouse hover
}
```

It listens to native mouse move event or click, as well as artificial generated
tap and touchevent.

When the mouse is over a point or a tap on a point is performed, that point or
the correscponding bar will be highlighted and a "plothover" event will be generated.

Custom "touchevent" is triggered when any touch interaction is made. Hover plugin
handles this events by unhighlighting all of the previously highlighted points and generates
"plothovercleanup" event to notify any part that is handling plothover (for exemple to cleanup
the tooltip from webcharts).
