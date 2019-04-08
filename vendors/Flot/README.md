# flot [![Build Status](https://travis-ci.org/flot/flot.svg?branch=master)](https://travis-ci.org/flot/flot) [![CircleCI](https://circleci.com/gh/flot/flot.svg?style=svg)](https://circleci.com/gh/flot/flot) [![Coverage Status](https://coveralls.io/repos/github/flot/flot/badge.svg?branch=master)](https://coveralls.io/github/flot/flot?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/flot/flot.svg)](https://greenkeeper.io/)

## About ##

flot is a JavaScript plotting library for engineering and scientific
applications derived from Flot: <http://www.flotcharts.org/>

Take a look at the the examples in examples/index.html; they should give a good
impression of what flot can do, and the source code of the examples is probably
the fastest way to learn how to use flot.


## Installation ##

Just include the JavaScript file after you've included jQuery.

Generally, all modern browsers are supported.

You need at least jQuery 1.2.6, but try at least 1.3.2 for interactive
charts because of performance improvements in event handling.


## Basic usage ##

Create a placeholder div to put the graph in:

```html
<div id="placeholder"></div>
```

You need to set the width and height of this div, otherwise the plot
library doesn't know how to scale the graph. You can do it inline like
this:

```html
<div id="placeholder" style="width:600px;height:300px"></div>
```

You can also do it with an external stylesheet. Make sure that the
placeholder isn't within something with a display:none CSS property -
in that case, Flot has trouble measuring label dimensions which
results in garbled looks and might have trouble measuring the
placeholder dimensions which is fatal (it'll throw an exception).

Then when the div is ready in the DOM, which is usually on document
ready, run the plot function:

```js
$.plot($("#placeholder"), data, options);
```

Here, data is an array of data series and options is an object with
settings if you want to customize the plot. Take a look at the
examples for some ideas of what to put in or look at the
[API reference](API.md). Here's a quick example that'll draw a line
from (0, 0) to (1, 1):

```js
$.plot($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });
```

The plot function immediately draws the chart and then returns a plot
object with a couple of methods.

## Documentation and examples

API Documentation is available here: [API reference](docs/API.md)

About how the plugins work: [Plugins](docs/PLUGINS.md)

High level overview on how interactions are handled internally: [Interactions](docs/interactions.md)

Examples are included in the examples folder of this repository, but they can be tried out online as well: [Examples](https://rawgit.com/flot/flot/master/examples/index.html)

## CircleCI

[CircleCI](https://circleci.com/) is used in this repo to run [dont-break](https://www.npmjs.com/package/dont-break),
which checks if the current version of flot breaks unit tests on specified dependent projects.