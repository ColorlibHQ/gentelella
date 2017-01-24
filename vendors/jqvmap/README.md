![JQVMap](http://jqvmap.com/img/logo.png "JQVMap")

This project is a heavily modified version of [jVectorMap](https://github.com/bjornd/jvectormap) as it was in April of 2012.  I chose to start fresh rather than fork their project as my intentions were to take it in such a different direction that it would become incompatibale with the original source, rendering it near impossible to merge our projects together without extreme complications.

**Tests:** [![Circle CI](https://circleci.com/gh/manifestinteractive/jqvmap/tree/master.svg?style=svg&circle-token=7bce3b80868ea5ca32009a195c4436db91e5ea67)](https://circleci.com/gh/manifestinteractive/jqvmap/tree/master)


jQuery Vector Map
======

To get started, all you need to do is include the JavaScript and CSS files for the map you want to load ( contained in the `./dist` folder ).

#### Here is a sample HTML page for loading the World Map with default settings:

```html
<html>
  <head>
    <title>JQVMap - World Map</title>
    <link href="../dist/jqvmap.css" media="screen" rel="stylesheet" type="text/css">

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="../dist/jquery.vmap.js"></script>
    <script type="text/javascript" src="../dist/maps/jquery.vmap.world.js" charset="utf-8"></script>

    <script type="text/javascript">
    jQuery(document).ready(function() {
      jQuery('#vmap').vectorMap({ map: 'world_en' });
    });
    </script>
  </head>
  <body>
    <div id="vmap" style="width: 600px; height: 400px;"></div>
  </body>
</html>
```

Making it Pretty
======

While initializing a map you can provide parameters to change its look and feel.

```js
jQuery('#vmap').vectorMap(
{
    map: 'world_en',
    backgroundColor: '#a5bfdd',
    borderColor: '#818181',
    borderOpacity: 0.25,
    borderWidth: 1,
    color: '#f4f3f0',
    enableZoom: true,
    hoverColor: '#c9dfaf',
    hoverOpacity: null,
    normalizeFunction: 'linear',
    scaleColors: ['#b6d6ff', '#005ace'],
    selectedColor: '#c9dfaf',
    selectedRegions: null,
    showTooltip: true,
    onRegionClick: function(element, code, region)
    {
        var message = 'You clicked "'
            + region
            + '" which has the code: '
            + code.toUpperCase();

        alert(message);
    }
});
```

More Examples
------

You can see a variety of examples in the `./examples` folder.


Configuration Settings
------

**map** *'world_en'*

Map you want to load. Must include the javascript file with the name of the map you want. Available maps with this library are world_en, usa_en, europe_en and germany_en

**backgroundColor** *'#a5bfdd'*

Background color of map container in any CSS compatible format.

**borderColor** *'#818181'*

Border Color to use to outline map objects

**borderOpacity** *0.5*

Border Opacity to use to outline map objects ( use anything from 0-1, e.g. 0.5, defaults to 0.25 )

**borderWidth** *3*

Border Width to use to outline map objects ( defaults to 1 )

**color** *'#f4f3f0'*

Color of map regions.

**colors**

Colors of individual map regions. Keys of the colors objects are country codes according to ISO 3166-1 alpha-2 standard. Keys of colors must be in lower case.

**enableZoom** *boolean*

Whether to Enable Map Zoom ( true or false, defaults to true)

**hoverColor** *'#c9dfaf'*

Color of the region when mouse pointer is over it.

**hoverColors**

Colors of individual map regions when mouse pointer is over it. Keys of the colors objects are country codes according to ISO 3166-1 alpha-2 standard. Keys of colors must be in lower case.

**hoverOpacity** *0.5*

Opacity of the region when mouse pointer is over it.

**normalizeFunction** *'linear'*

This function can be used to improve results of visualizations for data with non-linear nature. Function gets raw value as the first parameter and should return value which will be used in calculations of color, with which particular region will be painted.

**scaleColors** *['#b6d6ff', '#005ace']*

This option defines colors, with which regions will be painted when you set option values. Array scaleColors can have more then two elements. Elements should be strings representing colors in RGB hex format.

**selectedColor** *'#333333'*

Color for a region when you select it

**selectedRegions** *['MO', 'FL', 'OR']*

This is the Region that you are looking to have preselected (two letter ISO code, defaults to null ). See [REGIONS.md](REGIONS.md)

**multiSelectRegion** *boolean*

Whether to enable more than one region to be selected at a time.

**showLabels** *boolean*

Whether to show ISO Code Labels ( true or false, defaults to false )

**showTooltip** *boolean*

Whether to show Tooltips on Mouseover ( true or false, defaults to true )

**onLoad** *function(event, map)*

Callback function which will be called when map is loading, returning the map event and map details.

**onLabelShow** *function(event, label, code)*

Callback function which will be called before label is shown. Label DOM object and country code will be passed to the callback as arguments.

**onRegionOver** *function(event, code, region)*

Callback function which will be called when the mouse cursor enters the region path. Country code will be passed to the callback as argument.

**onRegionOut** *function(event, code, region)*

Callback function which will be called when the mouse cursor leaves the region path. Country code will be passed to the callback as argument.

**onRegionClick** *function(event, code, region)*

Callback function which will be called when the user clicks the region path. Country code will be passed to the callback as argument. This callback may be called while the user is moving the map. If you need to distinguish between a "real" click and a click resulting from moving the map, you can inspect **$(event.currentTarget).data('mapObject').isMoving**.

**onRegionSelect** *function(event, code, region)*

Callback function which will be called when the selects a region. Country code will be passed to the callback as argument.

**onRegionDeselect** *function(event, code, region)*

Callback function which will be called when the deselects a region. Country code will be passed to the callback as argument.

**onResize** *function(event, width, height)*

Callback function which will be called when the map is resized.  Return event, width & height.

**pins** *{ "pk" : "pk_pin_metadata", "ru" : "ru_pin_metadata",	... }*

This option defines pins, which will be placed on the regions. The JSON can have only one element against one country code. Elements should be strings containing the HTML or id of the pin (depends on the 'pinMode' option explained next).

**pinMode** *content*

This option defines if the "pins" JSON contains the HTML strings of the pins or the ids of HTML DOM elements which are to be placed as pins.

If the pin mode is "content" (or not specified) then the parameter "pins" contains the stringified html content to be placed as the pins.

Example:

```js
jQuery('#vmap').vectorMap({
    map: 'world_en',
    pins: { "pk" : "\u003cimg src=\"pk.png\" /\u003e" /*serialized <img src="pk.png" />*/, ... },
    pinMode: 'content'
});
```

If the pin mode is "id" then the parameter "pins" contains the value of "id" attribute of the html (DOM) elements to be placed as pins.
Example:

```html
<script>
  jQuery('#vmap').vectorMap({
      map: 'world_en',
      pins: { "pk" : "pin_for_pk", "ru" : "pin_for_ru", ... },
      pinMode: 'id'
  });
</script>
<div style="display:none">
  <img id="pin_for_pk" src="pk.png" />
  <div id="pin_for_ru">...</div>
</div>
```

*Note:*

1) The pin is placed at the center of the rectangle bounding the country. So depending on the shape of the country, the pin might not land on the country itself. For instance, the pin for 'US' lands in the center of Alaska and rest of the US, which happens to be in the ocean between them.

2) If the "pinMode" is set to "id", then the html DOM elements having those ids are NOT COPIED to the desired position, they are TRANSFERRED. This means that the elements will be removed from their original positions and placed on the map.

Dynamic Updating
======

Most of the options can be changed after initialization using the following code:

```js
jQuery('#vmap').vectorMap('set', 'colors', {us: '#0000ff'});
```

Instead of colors can be used any parameter except callbacks. Callbacks can be added and deleted using standard jQuery patterns of working with events.
You can define callback function when you initialize JQVMap:

```js
jQuery('#vmap').vectorMap(
{
    onLoad: function(event, map)
    {

    },
    onLabelShow: function(event, label, code)
    {

    },
    onRegionOver: function(event, code, region)
    {

    },
    onRegionOut: function(event, code, region)
    {

    },
    onRegionClick: function(event, code, region)
    {

    },
    onResize: function(event, width, height)
    {

    }
});
```

Or later using standard jQuery mechanism:

```js
jQuery('#vmap').bind('load.jqvmap',
    function(event, map)
    {

    }
);
jQuery('#vmap').bind('labelShow.jqvmap',
    function(event, label, code)
    {

    }
);
jQuery('#vmap').bind('regionMouseOver.jqvmap',
    function(event, code, region)
    {

    }
);
jQuery('#vmap').bind('regionMouseOut.jqvmap',
    function(event, code, region)
    {

    }
);
jQuery('#vmap').bind('regionClick.jqvmap',
    function(event, code, region)
    {

    }
);
jQuery('#vmap').bind('resize.jqvmap',
    function(event, width, height)
    {

    }
);
```

Consider that fact that you can use standard features of jQuery events like event.preventDefault() or returning false from the callback to prevent default behavior of JQVMap (showing label or changing country color on hover). In the following example, when user moves mouse cursor over Canada label won't be shown and color of country won't be changed. At the same label for Russia will have custom text.

```js
jQuery('#vmap').vectorMap(
{
    onLabelShow: function(event, label, code)
    {
        if (code == 'ca')
        {
            // Hide the label
            event.preventDefault();
        }
        else if (code == 'ru')
        {
            // Plain TEXT labels
            label.text('Bears, vodka, balalaika');
        }
        else if (code == 'us')
        {
            // HTML Based Labels. You can use any HTML you want, this is just an example
            label.html('<div class="map-tooltip"><h1 class="header">Header</h1><p class="description">Some Description</p></div>');
        }
    },
    onRegionOver: function(event, code)
    {
        if (code == 'ca')
        {
            event.preventDefault();
        }
    },
});
```

Data Visualization
======

Here I want to demonstrate how visualization of some geographical-related data can be done using JQVMap. Let's visualize information about GDP in 2010 for every country. At first we need some data. Let it be site of International Monetary Fond. There we can get information in xsl format, which can be converted first to csv and then to json with any scripting language. Now we have file gdp-data.js with such content (globals are evil, I know, but just for the sake of simplification):

```js
var gdpData = {"af":16.63,"al":11.58,"dz":158.97,...};
```

Then connect it to the page and add some code to make visualization:

```js
var max = 0,
    min = Number.MAX_VALUE,
    cc,
    startColor = [200, 238, 255],
    endColor = [0, 100, 145],
    colors = {},
    hex;

//find maximum and minimum values
for (cc in gdpData)
{
    if (parseFloat(gdpData[cc]) > max)
    {
        max = parseFloat(gdpData[cc]);
    }
    if (parseFloat(gdpData[cc]) < min)
    {
        min = parseFloat(gdpData[cc]);
    }
}

//set colors according to values of GDP
for (cc in gdpData)
{
    if (gdpData[cc] > 0)
    {
        colors[cc] = '#';
        for (var i = 0; i<3; i++)
        {
            hex = Math.round(startColor[i]
                + (endColor[i]
                - startColor[i])
                * (gdpData[cc] / (max - min))).toString(16);

            if (hex.length == 1)
            {
                hex = '0'+hex;
            }

            colors[cc] += (hex.length == 1 ? '0' : '') + hex;
        }
    }
}

//initialize JQVMap
jQuery('#vmap').vectorMap(
{
    colors: colors,
    hoverOpacity: 0.7,
    hoverColor: false
});
```

Functions
======

There are seven functions that can be called on map container:

**zoomIn()** *Zoom one step in*

Usage:

```js
jQuery('#vmap').vectorMap('zoomIn');
```

**zoomOut()** *Zoom one step out*

Usage:

```js
jQuery('#vmap').vectorMap('zoomOut');
```

**getPinId(cc)** *Returns the html attribute "id" of the pin placed on the country whose country code is provided in "cc".*

Usage:

```js
var pinId = jQuery('#vmap').vectorMap('getPinId', 'pk');
```

**getPin(cc)** *Returns stringified HTML of the pin placed on the country whose country code is provided in "cc".*

Usage:

```js
var pinContent = jQuery('#vmap').vectorMap('getPin', 'pk');
```

**getPins()** *Returns an associative JSON string containing stringified HTML of all the pins.*

Usage:

```js
var pins = jQuery('#vmap').vectorMap('getPins');
```

**removePin(cc)** *Removes the pin from the country whose country code is specified in "cc".*

Usage:

```js
jQuery('#vmap').vectorMap('removePin', 'pk');
```

**removePins()** *Removes all the pins from the map.*

Usage:

```js
jQuery('#vmap').vectorMap('removePins');
```

Events
======

There are three events which you can use to bind your own callbacks to:

**drag** *When the map is dragged, this event is triggered.*

**zoomIn** *When the map is zoomed in, this event is triggered.*

**zoomOut** *When the map is zoomed out, this event is triggered.*

You can bind your routines to any of these events by using jQuery on()
For example:

```js
//Do something when the map is dragged
jQuery('#vmap').on('drag', function(event)
{
    console.log('The map is being dragged');
    //Do something
});
```

Custom Maps
======

So you want to create your own maps, or change some existing ones.  Awesome.  Make sure to check out [./create/README.md](./create) for details on how to do this.
