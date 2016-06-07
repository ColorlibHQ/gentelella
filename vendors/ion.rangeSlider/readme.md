![ion.rangeSlider](_tmp/logo-ion-range-slider.png)

> English description | <a href="readme.ru.md">Описание на русском</a>

Ion.RangeSlider. Is an easy, flexible and responsive range slider with tons of options.

***

* Version: 2.1.4
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/en.html">Project page and demos</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/ion.rangeSlider-2.1.4.zip">Download ZIP</a>

## Description
* Ion.RangeSlider — cool, comfortable, responsive and easily customizable range slider
* Supports events and public methods, has flexible settings, can be completely altered with CSS
* Cross-browser: Google Chrome, Mozilla Firefox 3.6+, Opera 12+, Safari 5+, Internet Explorer 8+
* Ion.RangeSlider supports touch-devices (iPhone, iPad, Nexus, etc.).
* Ion.RangeSlider freely distributed under terms of <a href="http://ionden.com/a/plugins/licence.html" target="_blank">MIT licence</a>.
* With this plugin you will be able to build beautiful range sliders, like this:

![ion.rangeSlider](http://ionden.com/a/plugins/ion.rangeSlider/static/img/ion-range-slider.png)

## Key features
* Skin support. (5 skins included and PSD for skin creation)
* Any number of sliders at one page without conflicts and big performance problems
* Two slider types single (1 slider) and double (2 sliders)
* Support of negative and fractional values
* Ability to set custom step and snap grid to step
* Support of custom values diapason
* Customisable grid of values
* Ability to disable UI elements (min and max, current value, grid)
* Postfixes and prefixes for your numbers ($20, 20 &euro; etc.)
* Additional postfix for maximum value (eg. $0 — $100<b>+</b>)
* Ability to prettify large numbers (eg. 10000000 -> 10 000 000 or 10.000.000)
* Slider writes its value right into input value field. This makes it easy to use in any html form
* Any slider value can be set through input data-attribute (eg. data-min="10")
* Slider supports disable param. You can set it true to make slider inactive
* Slider supports external methods (update, reset and remove) to control it after creation
* For advanced users slider has callbacks (onStart, onChange, onFinish, onUpdate). Slider pastes all its params to callback first argument as object
* Slider supports date and time


## Demos

* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo.html" class="switch__item">Basic demo</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_advanced.html" class="switch__item">Advanced demo</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_interactions.html" class="switch__item">Interactions demo</a>


## Dependencies

* <a href="http://jquery.com/" target="_blank">jQuery 1.8.x+</a>


## Usage

Add the following libraries to the page:
* jQuery
* ion.rangeSlider.min.js

Add the following stylesheets to the page:
* <a href="http://necolas.github.io/normalize.css/" target="_blank">normalize.css</a> (optional)
* ion.rangeSlider.css

Plus, a skin for the slider. 5 skins are included. Choose one:
* ion.rangeSlider.skinFlat.css + sprite-skin-flat.png
* ion.rangeSlider.skinHTML5.css + no images
* ion.rangeSlider.skinModern.css + sprite-skin-modern.png
* ion.rangeSlider.skinNice.css + sprite-skin-nice.png
* ion.rangeSlider.skinSimple.css + sprite-skin-simple.png

Or use the included PSD file and design a custom skin.


## Install with bower

* bower install ionrangeslider


## Install with npm

* npm install ion-rangeslider


## Initialisation

The slider overrides a native text <code>input</code> element.
```html
<input type="text" id="example_id" name="example_name" value="" />
```

To initialise the slider, call ionRangeSlider on the element:
```javascript
$("#example_id").ionRangeSlider();
```


## Demo for juniors

If your are new in web development and you are not sure how to correctly install the plugin to your web-page, please download
<a href="http://ionden.com/a/plugins/ion.rangeSlider/ionRangeSliderDemo.zip" class="button">this demo example</a>


## Migrating from 1.x to 2.x
* All params (except functions) are lowercase now: <b>param_name</b>, not paramName
* Same param names was changed: hasGrid &rarr; <b>grid</b>, onLoad &rarr; <b>onStart</b>
* Callbacks data object format was changed. Example: fromNumber &rarr; <b>from</b>
* Slider now writes it's result to value attribute and also to data-from and data-to attributes


## <a href="http://jsfiddle.net/IonDen/qv6yrjrv/" target="_blank">Experiments playground</a>


## Settings

<table class="options">
    <thead>
        <tr>
            <th>Option</th>
            <th>Defaults</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr class="options__step">
            <td>type<div><sup>data-type</sup></div></td>
            <td>"single"</td>
            <td>string</td>
            <td>Choose slider type, could be <code>single</code> - for one handle, or <code>double</code> for two handles</td>
        </tr>

        <tr>
            <td>min<div><sup>data-min</sup></div></td>
            <td>10</td>
            <td>number</td>
            <td>Set slider minimum value</td>
        </tr>
        <tr>
            <td>max<div><sup>data-max</sup></div></td>
            <td>100</td>
            <td>number</td>
            <td>Set slider maximum value</td>
        </tr>
        <tr>
            <td>from<div><sup>data-from</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Set start position for left handle (or for single handle)</td>
        </tr>
        <tr>
            <td>to<div><sup>data-to</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Set start position for right handle</td>
        </tr>
        <tr class="options__step">
            <td>step<div><sup>data-step</sup></div></td>
            <td>1</td>
            <td>number</td>
            <td>Set sliders step. Always > 0. Could be fractional.</td>
        </tr>

        <tr>
            <td>min_interval<div><sup>data-min-interval</sup></div></td>
            <td>—</td>
            <td>number</td>
            <td>Set minimum diapason between sliders. Only in "double" type</td>
        </tr>
        <tr class="options__step">
            <td>max_interval<div><sup>data-max-interval</sup></div></td>
            <td>—</td>
            <td>number</td>
            <td>Set maximum diapason between sliders. Only in "double" type</td>
        </tr>
        <tr class="options__step">
            <td>drag_interval<div><sup>data-drag-interval</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Allow user to drag whole range. Only in "double" type (beta)</td>
        </tr>

        <tr class="options__step">
            <td>values<div><sup>data-values</sup></div></td>
            <td>[]</td>
            <td>array</td>
            <td>Set up your own array of possible slider values. They could be numbers or strings. If the values array is set up, min, max and step param, are no longer can be changed.</td>
        </tr>

        <tr class="options__new">
            <td>from_fixed<div><sup>data-from-fixed</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Fix position of left (or single) handle.</td>
        </tr>
        <tr class="options__new">
            <td>from_min<div><sup>data-from-min</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Set minimum limit for left handle.</td>
        </tr>
        <tr class="options__new">
            <td>from_max<div><sup>data-from-max</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Set the maximum limit for left handle</td>
        </tr>
        <tr class="options__new">
            <td>from_shadow<div><sup>data-from-shadow</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Highlight the limits for left handle</td>
        </tr>

        <tr class="options__new">
            <td>to_fixed<div><sup>data-to-fixed</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Fix position of right handle.</td>
        </tr>
        <tr class="options__new">
            <td>to_min<div><sup>data-to-min</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Set the minimum limit for right handle</td>
        </tr>
        <tr class="options__new">
            <td>to_max<div><sup>data-to-max</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Set the maximum limit for right handle</td>
        </tr>
        <tr class="options__new options__step">
            <td>to_shadow<div><sup>data-to-shadow</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Highlight the limits for right handle</td>
        </tr>

        <tr>
            <td>prettify_enabled<div><sup>data-prettify-enabled</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Improve readability of long numbers. 10000000 &rarr; 10 000 000</td>
        </tr>
        <tr class="options__new">
            <td>prettify_separator<div><sup>data-prettify-separator</sup></div></td>
            <td>" "</td>
            <td>string</td>
            <td>Set up your own separator for long numbers. 10 000, 10.000, 10-000, etc.</td>
        </tr>
        <tr class="options__new options__step">
            <td>prettify<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Set up your own prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates.</td>
        </tr>

        <tr class="options__new options__step">
            <td>force_edges<div><sup>data-force-edges</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Slider will be always inside it's container.</td>
        </tr>

        <tr class="options__new">
            <td>keyboard<div><sup>data-keyboard</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Activates keyboard controls. Move left: &larr;, &darr;, A, S. Move right: &rarr;, &uarr;, W, D.</td>
        </tr>
        <tr class="options__new options__step">
            <td>keyboard_step<div><sup>data-keyboard-step</sup></div></td>
            <td>5</td>
            <td>number</td>
            <td>Movement step, than controling from keyboard. In percents.</td>
        </tr>

        <tr>
            <td>grid<div><sup>data-grid</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Enables grid of values.</td>
        </tr>
        <tr>
            <td>grid_margin<div><sup>data-grid-margin</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Set left and right grid borders.</td>
        </tr>
        <tr class="options__new">
            <td>grid_num<div><sup>data-grid-num</sup></div></td>
            <td>4</td>
            <td>number</td>
            <td>Number of grid units.</td>
        </tr>
        <tr class="options__new options__step">
            <td>grid_snap<div><sup>data-grid-snap</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Snap grid to sliders step (step param). If activated, grid_num will not be used.</td>
        </tr>

        <tr>
            <td>hide_min_max<div><sup>data-hide-min-max</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Hides min and max labels</td>
        </tr>
        <tr class="options__step">
            <td>hide_from_to<div><sup>data-hide-from-to</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Hide from and to lables</td>
        </tr>

        <tr>
            <td>prefix<div><sup>data-prefix</sup></div></td>
            <td>—</td>
            <td>string</td>
            <td>Set prefix for values. Will be set up right before the number: $100</td>
        </tr>
        <tr>
            <td>postfix<div><sup>data-postfix</sup></div></td>
            <td>—</td>
            <td>string</td>
            <td>Set postfix for values. Will be set up right after the number: 100k</td>
        </tr>
        <tr>
            <td>max_postfix<div><sup>data-max-postfix</sup></div></td>
            <td>—</td>
            <td>string</td>
            <td>Special postfix, used only for maximum value. Will be showed after handle will reach maximum right position. For example 0 — 100+</td>
        </tr>
        <tr class="options__new">
            <td>decorate_both<div><sup>data-decorate-both</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k — $100k or $10 — 100k</td>
        </tr>
        <tr class="options__new options__step">
            <td>values_separator<div><sup>data-values-separator</sup></div></td>
            <td>" — "</td>
            <td>string</td>
            <td>Set your own separator for close values. Used for "double" type. Default: 10 — 100. Or you may set: 10 to 100, 10 + 100, 10 &rarr; 100 etc.</td>
        </tr>
        
        <tr class="options__step">
            <td>input_values_separator<div><sup>data-input-values-separator</sup></div></td>
            <td>" ; "</td>
            <td>string</td>
            <td>Separator for double values in input value property.</td>
        </tr>

        <tr class="options__step">
            <td>disable<div><sup>data-disable</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Locks slider and makes it inactive.</td>
        </tr>

        <tr>
            <td>onStart<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. Is called on slider start.</td>
        </tr>
        <tr>
            <td>onChange<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. IS called on each values change.</td>
        </tr>
        <tr>
            <td>onFinish<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. Is called than user releases handle.</td>
        </tr>
        <tr class="options__new">
            <td>onUpdate<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Callback. Is called than slider is modified by external methods <code>update</code> or <code>reset</code>.</td>
        </tr>
    </tbody>
</table>


## Description of data passed to callbacks (onChange and etc.)
Result is object type and passed to callback as first argument:
```javascript
Obj: {
    "input": object,    // jQuery-link to input
    "slider": object,   // jQuery-link to sliders container
    "min": 0,           // MIN value
    "max": 1000,        // MAX values
    "from": 100,        // FROM value (left or single handle)
    "from_percent": 10, // FROM value in percents
    "from_value": 0,    // FROM index in values array (if used)
    "to": 900,          // TO value (right handle in double type)
    "to_percent": 90,   // TO value in percents
    "to_value": 0       // TO index in values array (if used)
}
```

## Creating slider (all params)
An example of a customised slider:
```javascript
$("#example").ionRangeSlider({
    min: 0,
    max: 10000,
    from: 1000,
    to: 9000,
    type: 'double',
    prefix: "$",
    grid: true,
    grid_num: 10
});
```

You can also initialise slider with <code>data-*</code> attributes of input tag:
```html
data-min="0"
data-max="10000"
data-from="1000"
data-to="9000"
data-type="double"
data-prefix="$"
data-grid="true"
data-grid-num="10"
```

## Public methods

To use public methods, at first you must save slider instance to variable:
```javascript
// Launch plugin
$("#range").ionRangeSlider({
    type: "double",
    min: 0,
    max: 1000,
    from: 200,
    to: 500,
    grid: true
});

// Saving it's instance to var
var slider = $("#range").data("ionRangeSlider");

// Fire public method
slider.reset();
```

There are 3 public methods:
```javascript
// UPDATE - updates slider to any new values
slider.update({
    from: 300,
    to: 400
});

// RESET - reset slider to it's first values
slider.reset();

// DESTROY - destroys slider and restores original input field
slider.destroy();
```


## One more look on demos

* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo.html" class="switch__item">Basic demo</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_advanced.html" class="switch__item">Advanced demo</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_interactions.html" class="switch__item">Interactions demo</a>

All plugins options are covered in demos.


### <a href="history.md">Update history</a>

***

#### Support Ion-series plugins development:

* Donate through Pledgie service: [![](https://pledgie.com/campaigns/25694.png?skin_name=chrome)](https://pledgie.com/campaigns/25694)

* Donate direct to my Paypal account: https://www.paypal.me/IonDen

* Donate direct to my Yandex.Money account: http://yasobe.ru/na/razrabotku
