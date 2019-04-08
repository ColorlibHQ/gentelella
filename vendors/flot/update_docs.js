/* jshint node: true*/

"use strict";

var literate = require('ljs');
var fs = require('fs');

var docs2generate = [
  ['docs/canvaswrapper.md', 'jquery.canvaswrapper.js'],
 // ['docs/colorhelpers.md', 'jquery.colorhelpers.js'],
  ['docs/absRelTime.md', 'jquery.flot.absRelTime.js'],
 // ['docs/axislabels.md', 'jquery.flot.axislabels.js'],
  ['docs/browser.md', 'jquery.flot.browser.js'],
  ['docs/composeImages.md', 'jquery.flot.composeImages.js'],
  ['docs/drawSeries.md', 'jquery.flot.drawSeries.js'],
  ['docs/hover.md', 'jquery.flot.hover.js'],
 // ['docs/legend.md', 'jquery.flot.legend.js'],
  ['docs/logaxis.md', 'jquery.flot.logaxis.js'],
  ['docs/navigate.md', 'jquery.flot.navigate.js'],
 // ['docs/selection.md', 'jquery.flot.selection.js'],
 // ['docs/symbol.md', 'jquery.flot.symbol.js'],
 // ['docs/touch.md', 'jquery.flot.touch.js'],
 // ['docs/touchNavigate.md', 'jquery.flot.touchNavigate.js'],
 // ['docs/uiConstants.md', 'jquery.flot.uiConstants.js']
];

docs2generate.forEach(function (doc) {
  console.log(doc[0], '...');
  var documentation = literate(doc[1], {
    code: false
  });

  fs.writeFileSync(doc[0], documentation);
});
