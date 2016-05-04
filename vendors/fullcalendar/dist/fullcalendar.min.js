/*!
 * FullCalendar v2.7.1
 * Docs & License: http://fullcalendar.io/
 * (c) 2016 Adam Shaw
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery","moment"],a):"object"==typeof exports?// Node/CommonJS
module.exports=a(require("jquery"),require("moment")):a(jQuery,moment)}(function(a,b){
// Merges an array of option objects into a single object
function c(a){return U(a,Va)}
// Given options specified for the calendar's constructor, massages any legacy options into a non-legacy form.
// Converts View-Option-Hashes into the View-Specific-Options format.
function d(b){var c,d={views:b.views||{}};
// iterate through all option override properties (except `views`)
return a.each(b,function(b,e){"views"!=b&&(
// could the value be a legacy View-Option-Hash?
a.isPlainObject(e)&&!/(time|duration|interval)$/i.test(b)&&-1==a.inArray(b,Va)?(c=null,a.each(e,function(a,e){/^(month|week|day|default|basic(Week|Day)?|agenda(Week|Day)?)$/.test(a)?(d.views[a]||(d.views[a]={}),d.views[a][b]=e):(c||(c={}),c[a]=e)}),c&&(d[b]=c)):d[b]=e)}),d}/* FullCalendar-specific DOM Utilities
----------------------------------------------------------------------------------------------------------------------*/
// Given the scrollbar widths of some other container, create borders/margins on rowEls in order to match the left
// and right space that was offset by the scrollbars. A 1-pixel border first, then margin beyond that.
function e(a,b){b.left&&a.css({"border-left-width":1,"margin-left":b.left-1}),b.right&&a.css({"border-right-width":1,"margin-right":b.right-1})}
// Undoes compensateScroll and restores all borders/margins
function f(a){a.css({"margin-left":"","margin-right":"","border-left-width":"","border-right-width":""})}
// Make the mouse cursor express that an event is not allowed in the current area
function g(){a("body").addClass("fc-not-allowed")}
// Returns the mouse cursor to its original look
function h(){a("body").removeClass("fc-not-allowed")}
// Given a total available height to fill, have `els` (essentially child rows) expand to accomodate.
// By default, all elements that are shorter than the recommended height are expanded uniformly, not considering
// any other els that are already too tall. if `shouldRedistribute` is on, it considers these tall rows and 
// reduces the available height.
function i(b,c,d){
// *FLOORING NOTE*: we floor in certain places because zoom can give inaccurate floating-point dimensions,
// and it is better to be shorter than taller, to avoid creating unnecessary scrollbars.
var e=Math.floor(c/b.length),f=Math.floor(c-e*(b.length-1)),g=[],h=[],i=[],k=0;j(b),// give all elements their natural height
// find elements that are below the recommended height (expandable).
// important to query for heights in a single first pass (to avoid reflow oscillation).
b.each(function(c,d){var j=c===b.length-1?f:e,l=a(d).outerHeight(!0);j>l?(g.push(d),h.push(l),i.push(a(d).height())):
// this element stretches past recommended height (non-expandable). mark the space as occupied.
k+=l}),
// readjust the recommended height to only consider the height available to non-maxed-out rows.
d&&(c-=k,e=Math.floor(c/g.length),f=Math.floor(c-e*(g.length-1))),
// assign heights to all expandable elements
a(g).each(function(b,c){var d=b===g.length-1?f:e,j=h[b],k=i[b],l=d-(j-k);// subtract the margin/padding
d>j&&// we check this again because redistribution might have changed things
a(c).height(l)})}
// Undoes distrubuteHeight, restoring all els to their natural height
function j(a){a.height("")}
// Given `els`, a jQuery set of <td> cells, find the cell with the largest natural width and set the widths of all the
// cells to be that width.
// PREREQUISITE: if you want a cell to take up width, it needs to have a single inner element w/ display:inline
function k(b){var c=0;// sometimes not accurate of width the text needs to stay on one line. insurance
return b.find("> span").each(function(b,d){var e=a(d).outerWidth();e>c&&(c=e)}),c++,b.width(c),c}
// Given one element that resides inside another,
// Subtracts the height of the inner element from the outer element.
function l(a,b){var c,d=a.add(b);// undo hack
// effin' IE8/9/10/11 sometimes returns 0 for dimensions. this weird hack was the only thing that worked
// grab the dimensions
return d.css({position:"relative",// cause a reflow, which will force fresh dimension recalculation
left:-1}),c=a.outerHeight()-b.outerHeight(),d.css({position:"",left:""}),c}
// borrowed from https://github.com/jquery/jquery-ui/blob/1.11.0/ui/core.js#L51
function m(b){var c=b.css("position"),d=b.parents().filter(function(){var b=a(this);return/(auto|scroll)/.test(b.css("overflow")+b.css("overflow-y")+b.css("overflow-x"))}).eq(0);return"fixed"!==c&&d.length?d:a(b[0].ownerDocument||document)}
// Queries the outer bounding area of a jQuery element.
// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
// Origin is optional.
function n(a,b){var c=a.offset(),d=c.left-(b?b.left:0),e=c.top-(b?b.top:0);return{left:d,right:d+a.outerWidth(),top:e,bottom:e+a.outerHeight()}}
// Queries the area within the margin/border/scrollbars of a jQuery element. Does not go within the padding.
// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
// Origin is optional.
// NOTE: should use clientLeft/clientTop, but very unreliable cross-browser.
function o(a,b){var c=a.offset(),d=q(a),e=c.left+t(a,"border-left-width")+d.left-(b?b.left:0),f=c.top+t(a,"border-top-width")+d.top-(b?b.top:0);return{left:e,right:e+a[0].clientWidth,// clientWidth includes padding but NOT scrollbars
top:f,bottom:f+a[0].clientHeight}}
// Queries the area within the margin/border/padding of a jQuery element. Assumed not to have scrollbars.
// Returns a rectangle with absolute coordinates: left, right (exclusive), top, bottom (exclusive).
// Origin is optional.
function p(a,b){var c=a.offset(),d=c.left+t(a,"border-left-width")+t(a,"padding-left")-(b?b.left:0),e=c.top+t(a,"border-top-width")+t(a,"padding-top")-(b?b.top:0);return{left:d,right:d+a.width(),top:e,bottom:e+a.height()}}
// Returns the computed left/right/top/bottom scrollbar widths for the given jQuery element.
// NOTE: should use clientLeft/clientTop, but very unreliable cross-browser.
function q(a){var b=a.innerWidth()-a[0].clientWidth,c={left:0,right:0,top:0,bottom:a.innerHeight()-a[0].clientHeight};// is the scrollbar on the left side?
return r()&&"rtl"==a.css("direction")?c.left=b:c.right=b,c}function r(){// responsible for caching the computation
return null===Wa&&(Wa=s()),Wa}function s(){// creates an offscreen test element, then removes it
var b=a("<div><div/></div>").css({position:"absolute",top:-1e3,left:0,border:0,padding:0,overflow:"scroll",direction:"rtl"}).appendTo("body"),c=b.children(),d=c.offset().left>b.offset().left;// is the inner div shifted to accommodate a left scrollbar?
return b.remove(),d}
// Retrieves a jQuery element's computed CSS value as a floating-point number.
// If the queried value is non-numeric (ex: IE can return "medium" for border width), will just return zero.
function t(a,b){return parseFloat(a.css(b))||0}
// Returns a boolean whether this was a left mouse click and no ctrl key (which means right click on Mac)
function u(a){return 1==a.which&&!a.ctrlKey}function v(a){if(void 0!==a.pageX)return a.pageX;var b=a.originalEvent.touches;return b?b[0].pageX:void 0}function w(a){if(void 0!==a.pageY)return a.pageY;var b=a.originalEvent.touches;return b?b[0].pageY:void 0}function x(a){return/^touch/.test(a.type)}function y(a){a.addClass("fc-unselectable").on("selectstart",z)}
// Stops a mouse/touch event from doing it's native browser action
function z(a){a.preventDefault()}
// Returns a new rectangle that is the intersection of the two rectangles. If they don't intersect, returns false
function A(a,b){var c={left:Math.max(a.left,b.left),right:Math.min(a.right,b.right),top:Math.max(a.top,b.top),bottom:Math.min(a.bottom,b.bottom)};return c.left<c.right&&c.top<c.bottom?c:!1}
// Returns a new point that will have been moved to reside within the given rectangle
function B(a,b){return{left:Math.min(Math.max(a.left,b.left),b.right),top:Math.min(Math.max(a.top,b.top),b.bottom)}}
// Returns a point that is the center of the given rectangle
function C(a){return{left:(a.left+a.right)/2,top:(a.top+a.bottom)/2}}
// Subtracts point2's coordinates from point1's coordinates, returning a delta
function D(a,b){return{left:a.left-b.left,top:a.top-b.top}}function E(b){var c,d,e=[],f=[];for("string"==typeof b?f=b.split(/\s*,\s*/):"function"==typeof b?f=[b]:a.isArray(b)&&(f=b),c=0;c<f.length;c++)d=f[c],"string"==typeof d?e.push("-"==d.charAt(0)?{field:d.substring(1),order:-1}:{field:d,order:1}):"function"==typeof d&&e.push({func:d});return e}function F(a,b,c){var d,e;for(d=0;d<c.length;d++)if(e=G(a,b,c[d]))return e;return 0}function G(a,b,c){return c.func?c.func(a,b):H(a[c.field],b[c.field])*(c.order||1)}function H(b,c){return b||c?null==c?-1:null==b?1:"string"===a.type(b)||"string"===a.type(c)?String(b).localeCompare(String(c)):b-c:0}/* FullCalendar-specific Misc Utilities
----------------------------------------------------------------------------------------------------------------------*/
// Computes the intersection of the two ranges. Returns undefined if no intersection.
// Expects all dates to be normalized to the same timezone beforehand.
// TODO: move to date section?
function I(a,b){var c,d,e,f,g=a.start,h=a.end,i=b.start,j=b.end;// in bounds at all?
return h>i&&j>g?(g>=i?(c=g.clone(),e=!0):(c=i.clone(),e=!1),j>=h?(d=h.clone(),f=!0):(d=j.clone(),f=!1),{start:c,end:d,isStart:e,isEnd:f}):void 0}
// Diffs the two moments into a Duration where full-days are recorded first, then the remaining time.
// Moments will have their timezones normalized.
function J(a,c){return b.duration({days:a.clone().stripTime().diff(c.clone().stripTime(),"days"),ms:a.time()-c.time()})}
// Diffs the two moments via their start-of-day (regardless of timezone). Produces whole-day durations.
function K(a,c){return b.duration({days:a.clone().stripTime().diff(c.clone().stripTime(),"days")})}
// Diffs two moments, producing a duration, made of a whole-unit-increment of the given unit. Uses rounding.
function L(a,c,d){// returnFloat=true
return b.duration(Math.round(a.diff(c,d,!0)),d)}
// Computes the unit name of the largest whole-unit period of time.
// For example, 48 hours will be "days" whereas 49 hours will be "hours".
// Accepts start/end, a range object, or an original duration object.
function M(a,b){var c,d,e;for(c=0;c<Ya.length&&(d=Ya[c],e=N(d,a,b),!(e>=1&&fa(e)));c++);return d}
// Computes the number of units (like "hours") in the given range.
// Range can be a {start,end} object, separate start/end args, or a Duration.
// Results are based on Moment's .as() and .diff() methods, so results can depend on internal handling
// of month-diffing logic (which tends to vary from version to version).
function N(a,c,d){return null!=d?d.diff(c,a,!0):b.isDuration(c)?c.as(a):c.end.diff(c.start,a,!0)}
// Intelligently divides a range (specified by a start/end params) by a duration
function O(a,b,c){var d;return R(c)?(b-a)/c:(d=c.asMonths(),Math.abs(d)>=1&&fa(d)?b.diff(a,"months",!0)/d:b.diff(a,"days",!0)/c.asDays())}
// Intelligently divides one duration by another
function P(a,b){var c,d;return R(a)||R(b)?a/b:(c=a.asMonths(),d=b.asMonths(),Math.abs(c)>=1&&fa(c)&&Math.abs(d)>=1&&fa(d)?c/d:a.asDays()/b.asDays())}
// Intelligently multiplies a duration by a number
function Q(a,c){var d;return R(a)?b.duration(a*c):(d=a.asMonths(),Math.abs(d)>=1&&fa(d)?b.duration({months:d*c}):b.duration({days:a.asDays()*c}))}
// Returns a boolean about whether the given duration has any time parts (hours/minutes/seconds/ms)
function R(a){return Boolean(a.hours()||a.minutes()||a.seconds()||a.milliseconds())}function S(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}
// Returns a boolean about whether the given input is a time string, like "06:40:00" or "06:00"
function T(a){return/^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(a)}
// Merges an array of objects into a single object.
// The second argument allows for an array of property names who's object values will be merged together.
function U(a,b){var c,d,e,f,g,h,i={};if(b)for(c=0;c<b.length;c++){
// collect the trailing object values, stopping when a non-object is discovered
for(d=b[c],e=[],f=a.length-1;f>=0;f--)if(g=a[f][d],"object"==typeof g)e.unshift(g);else if(void 0!==g){i[d]=g;// if there were no objects, this value will be used
break}
// if the trailing values were objects, use the merged value
e.length&&(i[d]=U(e))}
// copy values into the destination, going from last to first
for(c=a.length-1;c>=0;c--){h=a[c];for(d in h)d in i||(// if already assigned by previous props or complex props, don't reassign
i[d]=h[d])}return i}
// Create an object that has the given prototype. Just like Object.create
function V(a){var b=function(){};return b.prototype=a,new b}function W(a,b){for(var c in a)Y(a,c)&&(b[c]=a[c])}
// Copies over certain methods with the same names as Object.prototype methods. Overcomes an IE<=8 bug:
// https://developer.mozilla.org/en-US/docs/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug
function X(a,b){var c,d,e=["constructor","toString","valueOf"];for(c=0;c<e.length;c++)d=e[c],a[d]!==Object.prototype[d]&&(b[d]=a[d])}function Y(a,b){return ab.call(a,b)}
// Is the given value a non-object non-function value?
function Z(b){return/undefined|null|boolean|number|string/.test(a.type(b))}function $(b,c,d){if(a.isFunction(b)&&(b=[b]),b){var e,f;for(e=0;e<b.length;e++)f=b[e].apply(c,d)||f;return f}}function _(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a]}function aa(a){return(a+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;").replace(/"/g,"&quot;").replace(/\n/g,"<br />")}function ba(a){return a.replace(/&.*?;/g,"")}
// Given a hash of CSS properties, returns a string of CSS.
// Uses property names as-is (no camel-case conversion). Will not make statements for null/undefined values.
function ca(b){var c=[];return a.each(b,function(a,b){null!=b&&c.push(a+":"+b)}),c.join(";")}function da(a){return a.charAt(0).toUpperCase()+a.slice(1)}function ea(a,b){// for .sort()
return a-b}function fa(a){return a%1===0}
// Returns a method bound to the given object context.
// Just like one of the jQuery.proxy signatures, but without the undesired behavior of treating the same method with
// different contexts as identical when binding/unbinding events.
function ga(a,b){var c=a[b];return function(){return c.apply(a,arguments)}}
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// https://github.com/jashkenas/underscore/blob/1.6.0/underscore.js#L714
function ha(a,b,c){var d,e,f,g,h,i=function(){var j=+new Date-g;b>j?d=setTimeout(i,b-j):(d=null,c||(h=a.apply(f,e),f=e=null))};return function(){f=this,e=arguments,g=+new Date;var j=c&&!d;return d||(d=setTimeout(i,b)),j&&(h=a.apply(f,e),f=e=null),h}}
// Builds an enhanced moment from args. When given an existing moment, it clones. When given a
// native Date, or called with no arguments (the current time), the resulting moment will be local.
// Anything else needs to be "parsed" (a string or an array), and will be affected by:
//    parseAsUTC - if there is no zone information, should we parse the input in UTC?
//    parseZone - if there is zone information, should we force the zone of the moment?
function ia(c,d,e){var f,g,h,i,j=c[0],k=1==c.length&&"string"==typeof j;// flag for extended functionality
// clone it
// "parsing" is required
// accept strings like '2014-05', but convert to the first of the month
// for when we pass it on to moment's constructor
// no time part?
// arrays have no timezone information, so assume ambiguous zone
// otherwise, probably a string with a format
// let's record the inputted zone somehow
return b.isMoment(j)?(i=b.apply(null,c),ka(j,i)):S(j)||void 0===j?i=b.apply(null,c):(f=!1,g=!1,k?bb.test(j)?(j+="-01",c=[j],f=!0,g=!0):(h=cb.exec(j))&&(f=!h[5],g=!0):a.isArray(j)&&(g=!0),i=d||f?b.utc.apply(b,c):b.apply(null,c),f?(i._ambigTime=!0,i._ambigZone=!0):e&&(g?i._ambigZone=!0:k&&(i.utcOffset?i.utcOffset(j):i.zone(j)))),i._fullCalendar=!0,i}
// Misc Internals
// -------------------------------------------------------------------------------------------------
// given an array of moment-like inputs, return a parallel array w/ moments similarly ambiguated.
// for example, of one moment has ambig time, but not others, all moments will have their time stripped.
// set `preserveTime` to `true` to keep times, but only normalize zone ambiguity.
// returns the original moments if no modifications are necessary.
function ja(a,c){var d,e,f=!1,g=!1,h=a.length,i=[];
// parse inputs into real moments and query their ambig flags
for(d=0;h>d;d++)e=a[d],b.isMoment(e)||(e=Ta.moment.parseZone(e)),f=f||e._ambigTime,g=g||e._ambigZone,i.push(e);
// strip each moment down to lowest common ambiguity
// use clones to avoid modifying the original moments
for(d=0;h>d;d++)e=i[d],c||!f||e._ambigTime?g&&!e._ambigZone&&(i[d]=e.clone().stripZone()):i[d]=e.clone().stripTime();return i}
// Transfers all the flags related to ambiguous time/zone from the `src` moment to the `dest` moment
// TODO: look into moment.momentProperties for this.
function ka(a,b){a._ambigTime?b._ambigTime=!0:b._ambigTime&&(b._ambigTime=!1),a._ambigZone?b._ambigZone=!0:b._ambigZone&&(b._ambigZone=!1)}
// Sets the year/month/date/etc values of the moment from the given array.
// Inefficient because it calls each individual setter.
function la(a,b){a.year(b[0]||0).month(b[1]||0).date(b[2]||0).hours(b[3]||0).minutes(b[4]||0).seconds(b[5]||0).milliseconds(b[6]||0)}
// Single Date Formatting
// -------------------------------------------------------------------------------------------------
// call this if you want Moment's original format method to be used
function ma(a,b){return eb.format.call(a,b)}
// Formats `date` with a Moment formatting string, but allow our non-zero areas and
// additional token.
function na(a,b){return oa(a,ta(b))}function oa(a,b){var c,d="";for(c=0;c<b.length;c++)d+=pa(a,b[c]);return d}function pa(a,b){var c,d;// a token, like "YYYY"
// a grouping of other chunks that must be non-zero
return"string"==typeof b?b:(c=b.token)?fb[c]?fb[c](a):ma(a,c):b.maybe&&(d=oa(a,b.maybe),d.match(/[1-9]/))?d:""}
// Date Range Formatting
// -------------------------------------------------------------------------------------------------
// TODO: make it work with timezone offset
// Using a formatting string meant for a single date, generate a range string, like
// "Sep 2 - 9 2013", that intelligently inserts a separator where the dates differ.
// If the dates are the same as far as the format string is concerned, just return a single
// rendering of one date, without any separator.
function qa(a,b,c,d,e){var f;// works with moment-pre-2.8
// Expand localized format strings, like "LL" -> "MMMM D YYYY"
// BTW, this is not important for `formatDate` because it is impossible to put custom tokens
// or non-zero areas in Moment's localized format strings.
return a=Ta.moment.parseZone(a),b=Ta.moment.parseZone(b),f=(a.localeData||a.lang).call(a),c=f.longDateFormat(c)||c,d=d||" - ",ra(a,b,ta(c),d,e)}// expose
function ra(a,b,c,d,e){var f,g,h,i,j=a.clone().stripZone(),k=b.clone().stripZone(),l="",m="",n="",o="",p="";
// Start at the leftmost side of the formatting string and continue until you hit a token
// that is not the same between dates.
for(g=0;g<c.length&&(f=sa(a,b,j,k,c[g]),f!==!1);g++)l+=f;
// Similarly, start at the rightmost side of the formatting string and move left
for(h=c.length-1;h>g&&(f=sa(a,b,j,k,c[h]),f!==!1);h--)m=f+m;
// The area in the middle is different for both of the dates.
// Collect them distinctly so we can jam them together later.
for(i=g;h>=i;i++)n+=pa(a,c[i]),o+=pa(b,c[i]);return(n||o)&&(p=e?o+d+n:n+d+o),l+p+m}
// TODO: week maybe?
// Given a formatting chunk, and given that both dates are similar in the regard the
// formatting chunk is concerned, format date1 against `chunk`. Otherwise, return `false`.
function sa(a,b,c,d,e){var f,g;return"string"==typeof e?e:(f=e.token)&&(g=gb[f.charAt(0)],g&&c.isSame(d,g))?ma(a,f):!1}function ta(a){return a in hb?hb[a]:hb[a]=ua(a)}
// Break the formatting string into an array of chunks
function ua(a){for(var b,c=[],d=/\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g;b=d.exec(a);)b[1]?// a literal string inside [ ... ]
c.push(b[1]):b[2]?// non-zero formatting inside ( ... )
c.push({maybe:ua(b[2])}):b[3]?// a formatting token
c.push({token:b[3]}):b[5]&&// an unenclosed literal string
c.push(b[5]);return c}// export
// Class that all other classes will inherit from
function va(){}function wa(a,b){var c;
// ensure a constructor for the subclass, forwarding all arguments to the super-constructor if it doesn't exist
// build the base prototype for the subclass, which is an new object chained to the superclass's prototype
// copy each member variable/method onto the the subclass's prototype
// hack for IE8
// copy over all class variables/methods to the subclass, such as `extend` and `mixin`
return Y(b,"constructor")&&(c=b.constructor),"function"!=typeof c&&(c=b.constructor=function(){a.apply(this,arguments)}),c.prototype=V(a.prototype),W(b,c.prototype),X(b,c.prototype),W(a,c),c}function xa(a,b){W(b,a.prototype)}
// Returns `true` if the hits are identically equal. `false` otherwise. Must be from the same component.
// Two null values will be considered equal, as two "out of the component" states are the same.
function ya(a,b){return a||b?a&&b?a.component===b.component&&za(a,b)&&za(b,a):!1:!0}
// Returns true if all of subHit's non-standard properties are within superHit
function za(a,b){for(var c in a)if(!/^(component|left|right|top|bottom)$/.test(c)&&a[c]!==b[c])return!1;return!0}/* Utilities
----------------------------------------------------------------------------------------------------------------------*/
function Aa(a){// returns true if background OR inverse-background
var b=Ca(a);return"background"===b||"inverse-background"===b}// export
function Ba(a){return"inverse-background"===Ca(a)}function Ca(a){return _((a.source||{}).rendering,a.rendering)}function Da(a){var b,c,d={};for(b=0;b<a.length;b++)c=a[b],(d[c._id]||(d[c._id]=[])).push(c);return d}
// A cmp function for determining which non-inverted "ranges" (see above) happen earlier
function Ea(a,b){return a.start-b.start}
// Given a jQuery element that might represent a dragged FullCalendar event, returns an intermediate data structure
// to be used for Event Object creation.
// A defined `.eventProps`, even when empty, indicates that an event should be created.
function Fa(c){var d,e,f,g,h=Ta.dataAttrPrefix;
// pluck special-cased date/time properties
// accept 'time' as well
// fallback to standalone attribute values for each of the date/time properties
// accept 'time' as well
// massage into correct data types
return h&&(h+="-"),d=c.data(h+"event")||null,d&&(d="object"==typeof d?a.extend({},d):{},e=d.start,null==e&&(e=d.time),f=d.duration,g=d.stick,delete d.start,delete d.time,delete d.duration,delete d.stick),null==e&&(e=c.data(h+"start")),null==e&&(e=c.data(h+"time")),null==f&&(f=c.data(h+"duration")),null==g&&(g=c.data(h+"stick")),e=null!=e?b.duration(e):null,f=null!=f?b.duration(f):null,g=Boolean(g),{eventProps:d,startTime:e,duration:f,stick:g}}
// Computes whether two segments' columns collide. They are assumed to be in the same row.
function Ga(a,b){var c,d;for(c=0;c<b.length;c++)if(d=b[c],d.leftCol<=a.rightCol&&d.rightCol>=a.leftCol)return!0;return!1}
// A cmp function for determining the leftmost event
function Ha(a,b){return a.leftCol-b.leftCol}
// Builds an array of segments "levels". The first level will be the leftmost tier of segments if the calendar is
// left-to-right, or the rightmost if the calendar is right-to-left. Assumes the segments are already ordered by date.
function Ia(a){var b,c,d,e=[];for(b=0;b<a.length;b++){
// go through all the levels and stop on the first level where there are no collisions
for(c=a[b],d=0;d<e.length&&La(c,e[d]).length;d++);c.level=d,(e[d]||(e[d]=[])).push(c)}return e}
// For every segment, figure out the other segments that are in subsequent
// levels that also occupy the same vertical space. Accumulate in seg.forwardSegs
function Ja(a){var b,c,d,e,f;for(b=0;b<a.length;b++)for(c=a[b],d=0;d<c.length;d++)for(e=c[d],e.forwardSegs=[],f=b+1;f<a.length;f++)La(e,a[f],e.forwardSegs)}
// Figure out which path forward (via seg.forwardSegs) results in the longest path until
// the furthest edge is reached. The number of segments in this path will be seg.forwardPressure
function Ka(a){var b,c,d=a.forwardSegs,e=0;if(void 0===a.forwardPressure){// not already computed
for(b=0;b<d.length;b++)c=d[b],Ka(c),e=Math.max(e,1+c.forwardPressure);a.forwardPressure=e}}
// Find all the segments in `otherSegs` that vertically collide with `seg`.
// Append into an optionally-supplied `results` array and return.
function La(a,b,c){c=c||[];for(var d=0;d<b.length;d++)Ma(a,b[d])&&c.push(b[d]);return c}
// Do these segments occupy the same vertical space?
function Ma(a,b){return a.bottom>b.top&&a.top<b.bottom}function Na(c,d){function e(){T?h()&&(
// mainly for the public API
k(),i()):f()}function f(){U=O.theme?"ui":"fc",c.addClass("fc"),c.addClass(N.isTouch?"fc-touch":"fc-cursor"),O.isRTL?c.addClass("fc-rtl"):c.addClass("fc-ltr"),O.theme?c.addClass("ui-widget"):c.addClass("fc-unthemed"),T=a("<div class='fc-view-container'/>").prependTo(c),R=N.header=new Qa(N,O),S=R.render(),S&&c.prepend(S),i(O.defaultView),O.handleWindowResize&&(Y=ha(m,O.windowResizeDelay),a(window).resize(Y))}function g(){W&&W.removeElement(),R.removeElement(),T.remove(),c.removeClass("fc fc-touch fc-cursor fc-ltr fc-rtl fc-unthemed ui-widget"),Y&&a(window).unbind("resize",Y)}function h(){return c.is(":visible")}
// View Rendering
// -----------------------------------------------------------------------------------
// Renders a view because of a date change, view-type change, or for the first time.
// If not given a viewType, keep the current view but render different dates.
function i(b){ca++,
// if viewType is changing, remove the old view's rendering
W&&b&&W.type!==b&&(R.deactivateButton(W.type),H(),// prevent a scroll jump when view element is removed
W.removeElement(),W=N.view=null),
// if viewType changed, or the view was never created, create a fresh view
!W&&b&&(W=N.view=ba[b]||(ba[b]=N.instantiateView(b)),W.setElement(a("<div class='fc-view fc-"+b+"-view' />").appendTo(T)),R.activateButton(b)),W&&(Z=W.massageCurrentDate(Z),W.displaying&&Z.isWithin(W.intervalStart,W.intervalEnd)||h()&&(W.display(Z),I(),u(),v(),q())),I(),// undo any lone freezeContentHeight calls
ca--}function j(a){// isResize=true. will poll getSuggestedViewHeight() and isHeightAuto()
return h()?(a&&l(),ca++,W.updateSize(!0),ca--,!0):void 0}function k(){h()&&l()}function l(){// assumes elementVisible
X="number"==typeof O.contentHeight?O.contentHeight:"number"==typeof O.height?O.height-(S?S.outerHeight(!0):0):Math.round(T.width()/Math.max(O.aspectRatio,.5))}function m(a){!ca&&a.target===window&&W.start&&j(!0)&&W.trigger("windowResize",aa)}/* Event Fetching/Rendering
	-----------------------------------------------------------------------------*/
// TODO: going forward, most of this stuff should be directly handled by the view
function n(){// can be called as an API method
p(),// so that events are cleared before user starts waiting for AJAX
r()}function o(){// destroys old events if previously rendered
h()&&(H(),W.displayEvents(da),I())}function p(){H(),W.clearEvents(),I()}function q(){!O.lazyFetching||$(W.start,W.end)?r():o()}function r(){_(W.start,W.end)}
// called when event data arrives
function s(a){da=a,o()}
// called when a single event's data has been changed
function t(){o()}/* Header Updating
	-----------------------------------------------------------------------------*/
function u(){R.updateTitle(W.title)}function v(){var a=N.getNow();a.isWithin(W.intervalStart,W.intervalEnd)?R.disableButton("today"):R.enableButton("today")}/* Selection
	-----------------------------------------------------------------------------*/
// this public method receives start/end dates in any format, with any timezone
function w(a,b){W.select(N.buildSelectSpan.apply(N,arguments))}function x(){// safe to be called before renderView
W&&W.unselect()}/* Date
	-----------------------------------------------------------------------------*/
function y(){Z=W.computePrevDate(Z),i()}function z(){Z=W.computeNextDate(Z),i()}function A(){Z.add(-1,"years"),i()}function B(){Z.add(1,"years"),i()}function C(){Z=N.getNow(),i()}function D(a){Z=N.moment(a).stripZone(),i()}function E(a){Z.add(b.duration(a)),i()}
// Forces navigation to a view for the given date.
// `viewType` can be a specific view name or a generic one like "week" or "day".
function F(a,b){var c;b=b||"day",c=N.getViewSpec(b)||N.getUnitViewSpec(b),Z=a.clone(),i(c?c.type:null)}
// for external API
function G(){return N.applyTimezone(Z)}function H(){T.css({width:"100%",height:T.height(),overflow:"hidden"})}function I(){T.css({width:"",height:"",overflow:""})}/* Misc
	-----------------------------------------------------------------------------*/
function J(){return N}function K(){return W}function L(a,b){return void 0===b?O[a]:void("height"!=a&&"contentHeight"!=a&&"aspectRatio"!=a||(O[a]=b,j(!0)))}function M(a,b){// overrides the Emitter's trigger method :(
var c=Array.prototype.slice.call(arguments,2);return b=b||aa,this.triggerWith(a,b,c),O[a]?O[a].apply(b,c):void 0}var N=this;N.initOptions(d||{});var O=this.options;
// Exports
// -----------------------------------------------------------------------------------
N.render=e,N.destroy=g,N.refetchEvents=n,N.reportEvents=s,N.reportEventChange=t,N.rerenderEvents=o,// `renderEvents` serves as a rerender. an API method
N.changeView=i,// `renderView` will switch to another view
N.select=w,N.unselect=x,N.prev=y,N.next=z,N.prevYear=A,N.nextYear=B,N.today=C,N.gotoDate=D,N.incrementDate=E,N.zoomTo=F,N.getDate=G,N.getCalendar=J,N.getView=K,N.option=L,N.trigger=M;
// Language-data Internals
// -----------------------------------------------------------------------------------
// Apply overrides to the current language's data
var P=V(// make a cheap copy
Pa(O.lang));if(O.monthNames&&(P._months=O.monthNames),O.monthNamesShort&&(P._monthsShort=O.monthNamesShort),O.dayNames&&(P._weekdays=O.dayNames),O.dayNamesShort&&(P._weekdaysShort=O.dayNamesShort),null!=O.firstDay){var Q=V(P._week);// _week: { dow: # }
Q.dow=O.firstDay,P._week=Q}
// assign a normalized value, to be used by our .week() moment extension
P._fullCalendar_weekCalc=function(a){return"function"==typeof a?a:"local"===a?a:"iso"===a||"ISO"===a?"ISO":void 0}(O.weekNumberCalculation),
// Calendar-specific Date Utilities
// -----------------------------------------------------------------------------------
N.defaultAllDayEventDuration=b.duration(O.defaultAllDayEventDuration),N.defaultTimedEventDuration=b.duration(O.defaultTimedEventDuration),
// Builds a moment using the settings of the current calendar: timezone and language.
// Accepts anything the vanilla moment() constructor accepts.
N.moment=function(){var a;
// Force the moment to be local, because FC.moment doesn't guarantee it.
// don't give ambiguously-timed moments a local zone
// moment 2.8 and above
// pre-moment-2.8
return"local"===O.timezone?(a=Ta.moment.apply(null,arguments),a.hasTime()&&a.local()):a="UTC"===O.timezone?Ta.moment.utc.apply(null,arguments):Ta.moment.parseZone.apply(null,arguments),"_locale"in a?a._locale=P:a._lang=P,a},
// Returns a boolean about whether or not the calendar knows how to calculate
// the timezone offset of arbitrary dates in the current timezone.
N.getIsAmbigTimezone=function(){return"local"!==O.timezone&&"UTC"!==O.timezone},
// Returns a copy of the given date in the current timezone. Has no effect on dates without times.
N.applyTimezone=function(a){if(!a.hasTime())return a.clone();var b,c=N.moment(a.toArray()),d=a.time()-c.time();
// Safari sometimes has problems with this coersion when near DST. Adjust if necessary. (bug #2396)
// is the time result different than expected?
// add milliseconds
// does it match perfectly now?
return d&&(b=c.clone().add(d),a.time()-b.time()===0&&(c=b)),c},
// Returns a moment for the current date, as defined by the client's computer or from the `now` option.
// Will return an moment with an ambiguous timezone.
N.getNow=function(){var a=O.now;return"function"==typeof a&&(a=a()),N.moment(a).stripZone()},
// Get an event's normalized end date. If not present, calculate it from the defaults.
N.getEventEnd=function(a){return a.end?a.end.clone():N.getDefaultEventEnd(a.allDay,a.start)},
// Given an event's allDay status and start date, return what its fallback end date should be.
// TODO: rename to computeDefaultEventEnd
N.getDefaultEventEnd=function(a,b){var c=b.clone();return a?c.stripTime().add(N.defaultAllDayEventDuration):c.add(N.defaultTimedEventDuration),N.getIsAmbigTimezone()&&c.stripZone(),c},
// Produces a human-readable string for the given duration.
// Side-effect: changes the locale of the given duration.
N.humanizeDuration=function(a){return(a.locale||a.lang).call(a,O.lang).humanize()},
// Imports
// -----------------------------------------------------------------------------------
Ra.call(N,O);var R,S,T,U,W,X,Y,Z,$=N.isFetchNeeded,_=N.fetchEvents,aa=c[0],ba={},ca=0,da=[];// unzoned
// Main Rendering
// -----------------------------------------------------------------------------------
// compute the initial ambig-timezone date
Z=null!=O.defaultDate?N.moment(O.defaultDate).stripZone():N.getNow(),N.getSuggestedViewHeight=function(){return void 0===X&&k(),X},N.isHeightAuto=function(){return"auto"===O.contentHeight||"auto"===O.height},N.freezeContentHeight=H,N.unfreezeContentHeight=I,N.initialize()}function Oa(b){a.each(zb,function(a,c){null==b[a]&&(b[a]=c(b))})}
// Returns moment's internal locale data. If doesn't exist, returns English.
// Works with moment-pre-2.8
function Pa(a){var c=b.localeData||b.langData;return c.call(b,a)||c.call(b,"en")}/* Top toolbar area with buttons and title
----------------------------------------------------------------------------------------------------------------------*/
// TODO: rename all header-related things to "toolbar"
function Qa(b,c){function d(){var b=c.header;return n=c.theme?"ui":"fc",b?o=a("<div class='fc-toolbar'/>").append(f("left")).append(f("right")).append(f("center")).append('<div class="fc-clear"/>'):void 0}function e(){o.remove(),o=a()}function f(d){var e=a('<div class="fc-'+d+'"/>'),f=c.header[d];return f&&a.each(f.split(" "),function(d){var f,g=a(),h=!0;a.each(this.split(","),function(d,e){var f,i,j,k,l,m,o,q,r,s;// the element
"title"==e?(g=g.add(a("<h2>&nbsp;</h2>")),h=!1):((f=(b.options.customButtons||{})[e])?(j=function(a){f.click&&f.click.call(s[0],a)},k="",l=f.text):(i=b.getViewSpec(e))?(j=function(){b.changeView(e)},p.push(e),k=i.buttonTextOverride,l=i.buttonTextDefault):b[e]&&(j=function(){b[e]()},k=(b.overrides.buttonText||{})[e],l=c.buttonText[e]),j&&(m=f?f.themeIcon:c.themeButtonIcons[e],o=f?f.icon:c.buttonIcons[e],q=k?aa(k):m&&c.theme?"<span class='ui-icon ui-icon-"+m+"'></span>":o&&!c.theme?"<span class='fc-icon fc-icon-"+o+"'></span>":aa(l),r=["fc-"+e+"-button",n+"-button",n+"-state-default"],s=a('<button type="button" class="'+r.join(" ")+'">'+q+"</button>").click(function(a){s.hasClass(n+"-state-disabled")||(j(a),(s.hasClass(n+"-state-active")||s.hasClass(n+"-state-disabled"))&&s.removeClass(n+"-state-hover"))}).mousedown(function(){s.not("."+n+"-state-active").not("."+n+"-state-disabled").addClass(n+"-state-down")}).mouseup(function(){s.removeClass(n+"-state-down")}).hover(function(){s.not("."+n+"-state-active").not("."+n+"-state-disabled").addClass(n+"-state-hover")},function(){s.removeClass(n+"-state-hover").removeClass(n+"-state-down")}),g=g.add(s)))}),h&&g.first().addClass(n+"-corner-left").end().last().addClass(n+"-corner-right").end(),g.length>1?(f=a("<div/>"),h&&f.addClass("fc-button-group"),f.append(g),e.append(f)):e.append(g)}),e}function g(a){o.find("h2").text(a)}function h(a){o.find(".fc-"+a+"-button").addClass(n+"-state-active")}function i(a){o.find(".fc-"+a+"-button").removeClass(n+"-state-active")}function j(a){o.find(".fc-"+a+"-button").attr("disabled","disabled").addClass(n+"-state-disabled")}function k(a){o.find(".fc-"+a+"-button").removeAttr("disabled").removeClass(n+"-state-disabled")}function l(){return p}var m=this;
// exports
m.render=d,m.removeElement=e,m.updateTitle=g,m.activateButton=h,m.deactivateButton=i,m.disableButton=j,m.enableButton=k,m.getViewsWithButtons=l;
// locals
var n,o=a(),p=[]}function Ra(c){/* Fetching
	-----------------------------------------------------------------------------*/
// start and end are assumed to be unzoned
function d(a,b){// nothing has been fetched yet?
return!I||I>a||b>M}function e(a,b){I=a,M=b,S=[];var c=++Q,d=P.length;R=d;for(var e=0;d>e;e++)f(P[e],c)}function f(b,c){g(b,function(d){var e,f,g,h=a.isArray(b.events);if(c==Q){if(d)for(e=0;e<d.length;e++)f=d[e],g=h?f:s(f,b),g&&S.push.apply(S,w(g));R--,R||N(S)}})}function g(b,d){var e,f,h=Ta.sourceFetchers;for(e=0;e<h.length;e++){if(f=h[e].call(H,// this, the Calendar object
b,I.clone(),M.clone(),c.timezone,d),f===!0)
// the fetcher is in charge. made its own async request
return;if("object"==typeof f)
// the fetcher returned a new source. process it
return void g(f,d)}var i=b.events;if(i)a.isFunction(i)?(H.pushLoading(),i.call(H,// this, the Calendar object
I.clone(),M.clone(),c.timezone,function(a){d(a),H.popLoading()})):a.isArray(i)?d(i):d();else{var j=b.url;if(j){var k,l=b.success,m=b.error,n=b.complete;k=a.isFunction(b.data)?b.data():b.data;
// use a copy of the custom data so we can modify the parameters
// and not affect the passed-in object.
var o=a.extend({},k||{}),p=_(b.startParam,c.startParam),q=_(b.endParam,c.endParam),r=_(b.timezoneParam,c.timezoneParam);p&&(o[p]=I.format()),q&&(o[q]=M.format()),c.timezone&&"local"!=c.timezone&&(o[r]=c.timezone),H.pushLoading(),a.ajax(a.extend({},Ab,b,{data:o,success:function(b){b=b||[];var c=$(l,this,arguments);a.isArray(c)&&(b=c),d(b)},error:function(){$(m,this,arguments),d()},complete:function(){$(n,this,arguments),H.popLoading()}}))}else d()}}/* Sources
	-----------------------------------------------------------------------------*/
function h(a){var b=i(a);b&&(P.push(b),R++,f(b,Q))}function i(b){// will return undefined if invalid source
var c,d,e=Ta.sourceNormalizers;if(a.isFunction(b)||a.isArray(b)?c={events:b}:"string"==typeof b?c={url:b}:"object"==typeof b&&(c=a.extend({},b)),c){for(
// TODO: repeat code, same code for event classNames
c.className?"string"==typeof c.className&&(c.className=c.className.split(/\s+/)):c.className=[],
// for array sources, we convert to standard Event Objects up front
a.isArray(c.events)&&(c.origArray=c.events,// for removeEventSource
c.events=a.map(c.events,function(a){return s(a,c)})),d=0;d<e.length;d++)e[d].call(H,c);return c}}function j(b){P=a.grep(P,function(a){return!k(a,b)}),S=a.grep(S,function(a){return!k(a.source,b)}),N(S)}function k(a,b){return a&&b&&l(a)==l(b)}function l(a){// a normalized event source?
// get the primitive
return("object"==typeof a?a.origArray||a.googleCalendarId||a.url||a.events:null)||a}/* Manipulation
	-----------------------------------------------------------------------------*/
// Only ever called from the externally-facing API
function m(a){
// massage start/end values, even if date string values
a.start=H.moment(a.start),a.end?a.end=H.moment(a.end):a.end=null,x(a,n(a)),// will handle start/end/allDay normalization
N(S)}
// Returns a hash of misc event properties that should be copied over to related events.
function n(b){var c={};return a.each(b,function(a,b){o(a)&&void 0!==b&&Z(b)&&(// a defined non-object
c[a]=b)}),c}
// non-date-related, non-id-related, non-secret
function o(a){return!/^_|^(id|allDay|start|end)$/.test(a)}
// returns the expanded events that were created
function p(a,b){var c,d,e,f=s(a);if(f){for(c=w(f),d=0;d<c.length;d++)e=c[d],e.source||(b&&(O.events.push(e),e.source=O),S.push(e));return N(S),c}return[]}function q(b){var c,d;// inverse=true
// Remove events from array sources.
// This works because they have been converted to official Event Objects up front.
// (and as a result, event._id has been calculated).
for(null==b?// null or undefined. remove all events
b=function(){return!0}:a.isFunction(b)||(c=b+"",b=function(a){return a._id==c}),S=a.grep(S,b,!0),d=0;d<P.length;d++)a.isArray(P[d].events)&&(P[d].events=a.grep(P[d].events,b,!0));N(S)}function r(b){// not null, not undefined. an event ID
return a.isFunction(b)?a.grep(S,b):null!=b?(b+="",a.grep(S,function(a){return a._id==b})):S}/* Event Normalization
	-----------------------------------------------------------------------------*/
// Given a raw object with key/value properties, returns an "abstract" Event object.
// An "abstract" event is an event that, if recurring, will not have been expanded yet.
// Will return `false` when input is invalid.
// `source` is optional
function s(d,e){var f,g,h,i={};if(c.eventDataTransform&&(d=c.eventDataTransform(d)),e&&e.eventDataTransform&&(d=e.eventDataTransform(d)),
// Copy all properties over to the resulting object.
// The special-case properties will be copied over afterwards.
a.extend(i,d),e&&(i.source=e),i._id=d._id||(void 0===d.id?"_fc"+Bb++:d.id+""),d.className?"string"==typeof d.className?i.className=d.className.split(/\s+/):i.className=d.className:i.className=[],f=d.start||d.date,g=d.end,T(f)&&(f=b.duration(f)),T(g)&&(g=b.duration(g)),d.dow||b.isDuration(f)||b.isDuration(g))
// the event is "abstract" (recurring) so don't calculate exact start/end dates just yet
i.start=f?b.duration(f):null,// will be a Duration or null
i.end=g?b.duration(g):null,// will be a Duration or null
i._recurring=!0;else{if(f&&(f=H.moment(f),!f.isValid()))return!1;g&&(g=H.moment(g),g.isValid()||(g=null)),h=d.allDay,void 0===h&&(// still undefined? fallback to default
h=_(e?e.allDayDefault:void 0,c.allDayDefault)),t(f,g,h,i)}return i}
// Normalizes and assigns the given dates to the given partially-formed event object.
// NOTE: mutates the given start/end moments. does not make a copy.
function t(a,b,c,d){d.start=a,d.end=b,d.allDay=c,u(d),Sa(d)}
// Ensures proper values for allDay/start/end. Accepts an Event object, or a plain object with event-ish properties.
// NOTE: Will modify the given object.
function u(a){v(a),a.end&&!a.end.isAfter(a.start)&&(a.end=null),a.end||(c.forceEventDuration?a.end=H.getDefaultEventEnd(a.allDay,a.start):a.end=null)}
// Ensures the allDay property exists and the timeliness of the start/end dates are consistent
function v(a){null==a.allDay&&(a.allDay=!(a.start.hasTime()||a.end&&a.end.hasTime())),a.allDay?(a.start.stripTime(),a.end&&
// TODO: consider nextDayThreshold here? If so, will require a lot of testing and adjustment
a.end.stripTime()):(a.start.hasTime()||(a.start=H.applyTimezone(a.start.time(0))),a.end&&!a.end.hasTime()&&(a.end=H.applyTimezone(a.end.time(0))))}
// If the given event is a recurring event, break it down into an array of individual instances.
// If not a recurring event, return an array with the single original event.
// If given a falsy input (probably because of a failed buildEventFromInput call), returns an empty array.
// HACK: can override the recurring window by providing custom rangeStart/rangeEnd (for businessHours).
function w(b,c,d){var e,f,g,h,i,j,k,l,m,n=[];if(c=c||I,d=d||M,b)if(b._recurring){
// make a boolean hash as to whether the event occurs on each day-of-week
if(f=b.dow)for(e={},g=0;g<f.length;g++)e[f[g]]=!0;// holds the date of the current day
for(
// iterate through every day in the current range
h=c.clone().stripTime();h.isBefore(d);)e&&!e[h.day()]||(i=b.start,j=b.end,k=h.clone(),l=null,i&&(k=k.time(i)),j&&(l=h.clone().time(j)),m=a.extend({},b),t(k,l,!i&&!j,m),n.push(m)),h.add(1,"days")}else n.push(b);return n}/* Event Modification Math
	-----------------------------------------------------------------------------------------*/
// Modifies an event and all related events by applying the given properties.
// Special date-diffing logic is used for manipulation of dates.
// If `props` does not contain start/end dates, the updated values are assumed to be the event's current start/end.
// All date comparisons are done against the event's pristine _start and _end dates.
// Returns an object with delta information and a function to undo all operations.
// For making computations in a granularity greater than day/time, specify largeUnit.
// NOTE: The given `newProps` might be mutated for normalization purposes.
function x(b,c,d){
// diffs the dates in the appropriate way, returning a duration
function e(a,b){// date1 - date0
// date1 - date0
return d?L(a,b,d):c.allDay?K(a,b):J(a,b)}var f,g,h,i,j,k,l={};
// normalize new date-related properties
// is null or undefined?
// create normalized versions of the original props to compare against
// need a real end value, for diffing
// need to clear the end date if explicitly changed to null
// compute the delta for moving the start date
// compute the delta for moving the end date
// gather all non-date-related properties
// apply the operations to the event and all related events
// get events with this ID
return c=c||{},c.start||(c.start=b.start.clone()),void 0===c.end&&(c.end=b.end?b.end.clone():null),null==c.allDay&&(c.allDay=b.allDay),u(c),f={start:b._start.clone(),end:b._end?b._end.clone():H.getDefaultEventEnd(b._allDay,b._start),allDay:c.allDay},u(f),g=null!==b._end&&null===c.end,h=e(c.start,f.start),c.end?(i=e(c.end,f.end),j=i.subtract(h)):j=null,a.each(c,function(a,b){o(a)&&void 0!==b&&(l[a]=b)}),k=y(r(b._id),g,c.allDay,h,j,l),{dateDelta:h,durationDelta:j,undo:k}}
// Modifies an array of events in the following ways (operations are in order):
// - clear the event's `end`
// - convert the event to allDay
// - add `dateDelta` to the start and end
// - add `durationDelta` to the event's duration
// - assign `miscProps` to the event
//
// Returns a function that can be called to undo all the operations.
//
// TODO: don't use so many closures. possible memory issues when lots of events with same ID.
//
function y(b,c,d,e,f,g){var h=H.getIsAmbigTimezone(),i=[];
// normalize zero-length deltas to be null
return e&&!e.valueOf()&&(e=null),f&&!f.valueOf()&&(f=null),a.each(b,function(b,j){var k,l;k={start:j.start.clone(),end:j.end?j.end.clone():null,allDay:j.allDay},a.each(g,function(a){k[a]=j[a]}),l={start:j._start,end:j._end,allDay:d},u(l),c?l.end=null:f&&!l.end&&(l.end=H.getDefaultEventEnd(l.allDay,l.start)),e&&(l.start.add(e),l.end&&l.end.add(e)),f&&l.end.add(f),h&&!l.allDay&&(e||f)&&(l.start.stripZone(),l.end&&l.end.stripZone()),a.extend(j,g,l),Sa(j),i.push(function(){a.extend(j,k),Sa(j)})}),function(){for(var a=0;a<i.length;a++)i[a]()}}
// Returns an array of events as to when the business hours occur in the given view.
// Abuse of our event system :(
function z(b){var d,e=c.businessHours,f={className:"fc-nonbusiness",start:"09:00",end:"17:00",dow:[1,2,3,4,5],// monday - friday
rendering:"inverse-background"},g=H.getView();// `true` (which means "use the defaults") or an override object
// copy to a new object in either case
// if a whole-day series is requested, clear the start/end times
return e&&(d=a.extend({},f,"object"==typeof e?e:{})),d?(b&&(d.start=null,d.end=null),w(s(d),g.start,g.end)):[]}
// Determines if the given event can be relocated to the given span (unzoned start/end with other misc data)
function A(a,b){var d=b.source||{},e=_(b.constraint,d.constraint,c.eventConstraint),f=_(b.overlap,d.overlap,c.eventOverlap);return D(a,e,f,b)}
// Determines if an external event can be relocated to the given span (unzoned start/end with other misc data)
function B(b,c,d){var e,f;
// note: very similar logic is in View's reportExternalDrop
return d&&(e=a.extend({},d,c),f=w(s(e))[0]),f?A(b,f):C(b)}
// Determines the given span (unzoned start/end with other misc data) can be selected.
function C(a){return D(a,c.selectConstraint,c.selectOverlap)}
// Returns true if the given span (caused by an event drop/resize or a selection) is allowed to exist
// according to the constraint/overlap settings.
// `event` is not required if checking a selection.
function D(a,b,c,d){var e,f,g,h,i,j;
// the range must be fully contained by at least one of produced constraint events
if(null!=b){for(e=E(b),f=!1,h=0;h<e.length;h++)if(F(e[h],a)){f=!0;break}if(!f)return!1}for(g=H.getPeerEvents(a,d),h=0;h<g.length;h++)
// there needs to be an actual intersection before disallowing anything
if(i=g[h],G(i,a)){
// evaluate overlap for the given range and short-circuit if necessary
if(c===!1)return!1;if("function"==typeof c&&!c(i,d))return!1;
// if we are computing if the given range is allowable for an event, consider the other event's
// EventObject-specific or Source-specific `overlap` property
if(d){if(j=_(i.overlap,(i.source||{}).overlap),j===!1)return!1;
// if the peer event's overlap is a test function, pass the subject event as the first param
if("function"==typeof j&&!j(d,i))return!1}}return!0}
// Given an event input from the API, produces an array of event objects. Possible event inputs:
// 'businessHours'
// An event ID (number or string)
// An object with specific start/end dates or a recurring event (like what businessHours accepts)
function E(a){return"businessHours"===a?z():"object"==typeof a?w(s(a)):r(a)}
// Does the event's date range fully contain the given range?
// start/end already assumed to have stripped zones :(
function F(a,b){var c=a.start.clone().stripZone(),d=H.getEventEnd(a).stripZone();return b.start>=c&&b.end<=d}
// Does the event's date range intersect with the given range?
// start/end already assumed to have stripped zones :(
function G(a,b){var c=a.start.clone().stripZone(),d=H.getEventEnd(a).stripZone();return b.start<d&&b.end>c}// assumed to be a calendar
var H=this;
// exports
H.isFetchNeeded=d,H.fetchEvents=e,H.addEventSource=h,H.removeEventSource=j,H.updateEvent=m,H.renderEvent=p,H.removeEvents=q,H.clientEvents=r,H.mutateEvent=x,H.normalizeEventDates=u,H.normalizeEventTimes=v;
// imports
var I,M,N=H.reportEvents,O={events:[]},P=[O],Q=0,R=0,S=[];// holds events that have already been expanded
a.each((c.events?[c.events]:[]).concat(c.eventSources||[]),function(a,b){var c=i(b);c&&P.push(c)}),/* Business Hours
	-----------------------------------------------------------------------------------------*/
H.getBusinessHoursEvents=z,/* Overlapping / Constraining
	-----------------------------------------------------------------------------------------*/
H.isEventSpanAllowed=A,H.isExternalSpanAllowed=B,H.isSelectionSpanAllowed=C,H.getEventCache=function(){return S}}
// updates the "backup" properties, which are preserved in order to compute diffs later on.
function Sa(a){a._allDay=a.allDay,a._start=a.start.clone(),a._end=a.end?a.end.clone():null}var Ta=a.fullCalendar={version:"2.7.1",internalApiVersion:3},Ua=Ta.views={};Ta.isTouch="ontouchstart"in document,a.fn.fullCalendar=function(b){var c=Array.prototype.slice.call(arguments,1),d=this;// what this function will return (this jQuery object by default)
return this.each(function(e,f){// loop each DOM element involved
var g,h=a(f),i=h.data("fullCalendar");// the returned value of this single method call
// a method call
"string"==typeof b?i&&a.isFunction(i[b])&&(g=i[b].apply(i,c),e||(d=g),"destroy"===b&&h.removeData("fullCalendar")):i||(i=new vb(h,b),h.data("fullCalendar",i),i.render())}),d};var Va=[// names of options that are objects whose properties should be combined
"header","buttonText","buttonIcons","themeButtonIcons"];
// exports
Ta.intersectRanges=I,Ta.applyAll=$,Ta.debounce=ha,Ta.isInt=fa,Ta.htmlEscape=aa,Ta.cssToStr=ca,Ta.proxy=ga,Ta.capitaliseFirstLetter=da,/* Element Geom Utilities
----------------------------------------------------------------------------------------------------------------------*/
Ta.getOuterRect=n,Ta.getClientRect=o,Ta.getContentRect=p,Ta.getScrollbarWidths=q;
// Logic for determining if, when the element is right-to-left, the scrollbar appears on the left side
var Wa=null;/* Mouse / Touch Utilities
----------------------------------------------------------------------------------------------------------------------*/
Ta.preventDefault=z,/* General Geometry Utils
----------------------------------------------------------------------------------------------------------------------*/
Ta.intersectRects=A,/* Object Ordering by Field
----------------------------------------------------------------------------------------------------------------------*/
Ta.parseFieldSpecs=E,Ta.compareByFieldSpecs=F,Ta.compareByFieldSpec=G,Ta.flexibleCompare=H,/* Date Utilities
----------------------------------------------------------------------------------------------------------------------*/
Ta.computeIntervalUnit=M,Ta.divideRangeByDuration=O,Ta.divideDurationByDuration=P,Ta.multiplyDuration=Q,Ta.durationHasTime=R;var Xa=["sun","mon","tue","wed","thu","fri","sat"],Ya=["year","month","week","day","hour","minute","second","millisecond"];/* Logging and Debug
----------------------------------------------------------------------------------------------------------------------*/
Ta.log=function(){var a=window.console;return a&&a.log?a.log.apply(a,arguments):void 0},Ta.warn=function(){var a=window.console;return a&&a.warn?a.warn.apply(a,arguments):Ta.log.apply(Ta,arguments)};/* General Utilities
----------------------------------------------------------------------------------------------------------------------*/
var Za,$a,_a,ab={}.hasOwnProperty,bb=/^\s*\d{4}-\d\d$/,cb=/^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/,db=b.fn,eb=a.extend({},db);// function defined below
// Creating
// -------------------------------------------------------------------------------------------------
// Creates a new moment, similar to the vanilla moment(...) constructor, but with
// extra features (ambiguous time, enhanced formatting). When given an existing moment,
// it will function as a clone (and retain the zone of the moment). Anything else will
// result in a moment in the local zone.
Ta.moment=function(){return ia(arguments)},
// Sames as FC.moment, but forces the resulting moment to be in the UTC timezone.
Ta.moment.utc=function(){var a=ia(arguments,!0);
// Force it into UTC because makeMoment doesn't guarantee it
// (if given a pre-existing moment for example)
// don't give ambiguously-timed moments a UTC zone
return a.hasTime()&&a.utc(),a},
// Same as FC.moment, but when given an ISO8601 string, the timezone offset is preserved.
// ISO8601 strings with no timezone offset will become ambiguously zoned.
Ta.moment.parseZone=function(){return ia(arguments,!0,!0)},
// A clone method that works with the flags related to our enhanced functionality.
// In the future, use moment.momentProperties
db.clone=function(){var a=eb.clone.apply(this,arguments);
// these flags weren't transfered with the clone
return ka(this,a),this._fullCalendar&&(a._fullCalendar=!0),a},
// Week Number
// -------------------------------------------------------------------------------------------------
// Returns the week number, considering the locale's custom week number calcuation
// `weeks` is an alias for `week`
db.week=db.weeks=function(a){var b=(this._locale||this._lang)._fullCalendar_weekCalc;return null==a&&"function"==typeof b?b(this):"ISO"===b?eb.isoWeek.apply(this,arguments):eb.week.apply(this,arguments)},
// Time-of-day
// -------------------------------------------------------------------------------------------------
// GETTER
// Returns a Duration with the hours/minutes/seconds/ms values of the moment.
// If the moment has an ambiguous time, a duration of 00:00 will be returned.
//
// SETTER
// You can supply a Duration, a Moment, or a Duration-like argument.
// When setting the time, and the moment has an ambiguous time, it then becomes unambiguous.
db.time=function(a){
// Fallback to the original method (if there is one) if this moment wasn't created via FullCalendar.
// `time` is a generic enough method name where this precaution is necessary to avoid collisions w/ other plugins.
if(!this._fullCalendar)return eb.time.apply(this,arguments);if(null==a)// getter
return b.duration({hours:this.hours(),minutes:this.minutes(),seconds:this.seconds(),milliseconds:this.milliseconds()});// setter
this._ambigTime=!1,// mark that the moment now has a time
b.isDuration(a)||b.isMoment(a)||(a=b.duration(a));
// The day value should cause overflow (so 24 hours becomes 00:00:00 of next day).
// Only for Duration times, not Moment times.
var c=0;
// We need to set the individual fields.
// Can't use startOf('day') then add duration. In case of DST at start of day.
return b.isDuration(a)&&(c=24*Math.floor(a.asDays())),this.hours(c+a.hours()).minutes(a.minutes()).seconds(a.seconds()).milliseconds(a.milliseconds())},
// Converts the moment to UTC, stripping out its time-of-day and timezone offset,
// but preserving its YMD. A moment with a stripped time will display no time
// nor timezone offset when .format() is called.
db.stripTime=function(){var a;
// get the values before any conversion happens
// array of y/m/d/h/m/s/ms
// TODO: use keepLocalTime in the future
// set the internal UTC flag (will clear the ambig flags)
// set the year/month/date. time will be zero
// Mark the time as ambiguous. This needs to happen after the .utc() call, which might call .utcOffset(),
// which clears all ambig flags. Same with setUTCValues with moment-timezone.
return this._ambigTime||(a=this.toArray(),this.utc(),$a(this,a.slice(0,3)),this._ambigTime=!0,this._ambigZone=!0),this},
// Returns if the moment has a non-ambiguous time (boolean)
db.hasTime=function(){return!this._ambigTime},
// Timezone
// -------------------------------------------------------------------------------------------------
// Converts the moment to UTC, stripping out its timezone offset, but preserving its
// YMD and time-of-day. A moment with a stripped timezone offset will display no
// timezone offset when .format() is called.
// TODO: look into Moment's keepLocalTime functionality
db.stripZone=function(){var a,b;
// get the values before any conversion happens
// array of y/m/d/h/m/s/ms
// set the internal UTC flag (might clear the ambig flags, depending on Moment internals)
// will set the year/month/date/hours/minutes/seconds/ms
// the above call to .utc()/.utcOffset() unfortunately might clear the ambig flags, so restore
// Mark the zone as ambiguous. This needs to happen after the .utc() call, which might call .utcOffset(),
// which clears the ambig flags. Same with setUTCValues with moment-timezone.
return this._ambigZone||(a=this.toArray(),b=this._ambigTime,this.utc(),$a(this,a),this._ambigTime=b||!1,this._ambigZone=!0),this},
// Returns of the moment has a non-ambiguous timezone offset (boolean)
db.hasZone=function(){return!this._ambigZone},
// this method implicitly marks a zone
db.local=function(){var a=this.toArray(),b=this._ambigZone;
// ensure non-ambiguous
// this probably already happened via local() -> utcOffset(), but don't rely on Moment's internals
// If the moment was ambiguously zoned, the date fields were stored as UTC.
// We want to preserve these, but in local time.
// TODO: look into Moment's keepLocalTime functionality
return eb.local.apply(this,arguments),this._ambigTime=!1,this._ambigZone=!1,b&&_a(this,a),this},
// implicitly marks a zone
db.utc=function(){
// ensure non-ambiguous
// this probably already happened via utc() -> utcOffset(), but don't rely on Moment's internals
return eb.utc.apply(this,arguments),this._ambigTime=!1,this._ambigZone=!1,this},
// methods for arbitrarily manipulating timezone offset.
// should clear time/zone ambiguity when called.
a.each(["zone",// only in moment-pre-2.9. deprecated afterwards
"utcOffset"],function(a,b){eb[b]&&(// original method exists?
// this method implicitly marks a zone (will probably get called upon .utc() and .local())
db[b]=function(a){// setter
// these assignments needs to happen before the original zone method is called.
// I forget why, something to do with a browser crash.
return null!=a&&(this._ambigTime=!1,this._ambigZone=!1),eb[b].apply(this,arguments)})}),
// Formatting
// -------------------------------------------------------------------------------------------------
db.format=function(){return this._fullCalendar&&arguments[0]?na(this,arguments[0]):this._ambigTime?ma(this,"YYYY-MM-DD"):this._ambigZone?ma(this,"YYYY-MM-DD[T]HH:mm:ss"):eb.format.apply(this,arguments)},db.toISOString=function(){return this._ambigTime?ma(this,"YYYY-MM-DD"):this._ambigZone?ma(this,"YYYY-MM-DD[T]HH:mm:ss"):eb.toISOString.apply(this,arguments)},
// Querying
// -------------------------------------------------------------------------------------------------
// Is the moment within the specified range? `end` is exclusive.
// FYI, this method is not a standard Moment method, so always do our enhanced logic.
db.isWithin=function(a,b){var c=ja([this,a,b]);return c[0]>=c[1]&&c[0]<c[2]},
// When isSame is called with units, timezone ambiguity is normalized before the comparison happens.
// If no units specified, the two moments must be identically the same, with matching ambig flags.
db.isSame=function(a,b){var c;
// only do custom logic if this is an enhanced moment
// only do custom logic if this is an enhanced moment
return this._fullCalendar?b?(c=ja([this,a],!0),eb.isSame.call(c[0],c[1],b)):(a=Ta.moment.parseZone(a),eb.isSame.call(this,a)&&Boolean(this._ambigTime)===Boolean(a._ambigTime)&&Boolean(this._ambigZone)===Boolean(a._ambigZone)):eb.isSame.apply(this,arguments)},
// Make these query methods work with ambiguous moments
a.each(["isBefore","isAfter"],function(a,b){db[b]=function(a,c){var d;
// only do custom logic if this is an enhanced moment
// only do custom logic if this is an enhanced moment
return this._fullCalendar?(d=ja([this,a]),eb[b].call(d[0],d[1],c)):eb[b].apply(this,arguments)}}),Za="_d"in b()&&"updateOffset"in b,$a=Za?function(a,c){a._d.setTime(Date.UTC.apply(Date,c)),b.updateOffset(a,!1)}:la,_a=Za?function(a,c){a._d.setTime(+new Date(c[0]||0,c[1]||0,c[2]||0,c[3]||0,c[4]||0,c[5]||0,c[6]||0)),b.updateOffset(a,!1)}:la;
// addition formatting tokens we want recognized
var fb={t:function(a){// "a" or "p"
return ma(a,"a").charAt(0)},T:function(a){// "A" or "P"
return ma(a,"A").charAt(0)}};Ta.formatRange=qa;var gb={Y:"year",M:"month",D:"day",// day of month
d:"day",// day of week
// prevents a separator between anything time-related...
A:"second",// AM/PM
a:"second",// am/pm
T:"second",// A/P
t:"second",// a/p
H:"second",// hour (24)
h:"second",// hour (12)
m:"second",// minute
s:"second"},hb={};Ta.Class=va,
// Called on a class to create a subclass.
// Last argument contains instance methods. Any argument before the last are considered mixins.
va.extend=function(){var a,b,c=arguments.length;for(a=0;c>a;a++)b=arguments[a],c-1>a&&xa(this,b);return wa(this,b||{})},
// Adds new member variables/methods to the class's prototype.
// Can be called with another class, or a plain object hash containing new members.
va.mixin=function(a){xa(this,a)};var ib=Ta.EmitterMixin={callbackHash:null,on:function(a,b){return this.loopCallbacks(a,"add",[b]),this},off:function(a,b){return this.loopCallbacks(a,"remove",[b]),this},trigger:function(a){// args...
var b=Array.prototype.slice.call(arguments,1);return this.triggerWith(a,this,b),this},triggerWith:function(a,b,c){return this.loopCallbacks(a,"fireWith",[b,c]),this},/*
	Given an event name string with possible namespaces,
	call the given methodName on all the internal Callback object with the given arguments.
	*/
loopCallbacks:function(a,b,c){var d,e,f,g=a.split(".");for(d=0;d<g.length;d++)e=g[d],e&&(f=this.ensureCallbackObj((d?".":"")+e),f[b].apply(f,c))},ensureCallbackObj:function(b){return this.callbackHash||(this.callbackHash={}),this.callbackHash[b]||(this.callbackHash[b]=a.Callbacks()),this.callbackHash[b]}},jb=Ta.ListenerMixin=function(){var b=0,c={listenerId:null,/*
		Given an `other` object that has on/off methods, bind the given `callback` to an event by the given name.
		The `callback` will be called with the `this` context of the object that .listenTo is being called on.
		Can be called:
			.listenTo(other, eventName, callback)
		OR
			.listenTo(other, {
				eventName1: callback1,
				eventName2: callback2
			})
		*/
listenTo:function(b,c,d){if("object"==typeof c)// given dictionary of callbacks
for(var e in c)c.hasOwnProperty(e)&&this.listenTo(b,e,c[e]);else"string"==typeof c&&b.on(c+"."+this.getListenerNamespace(),// use event namespacing to identify this object
a.proxy(d,this))},/*
		Causes the current object to stop listening to events on the `other` object.
		`eventName` is optional. If omitted, will stop listening to ALL events on `other`.
		*/
stopListeningTo:function(a,b){a.off((b||"")+"."+this.getListenerNamespace())},/*
		Returns a string, unique to this object, to be used for event namespacing
		*/
getListenerNamespace:function(){return null==this.listenerId&&(this.listenerId=b++),"_listener"+this.listenerId}};return c}(),kb=va.extend(jb,{isHidden:!0,options:null,el:null,// the container element for the popover. generated by this object
margin:10,// the space required between the popover and the edges of the scroll container
constructor:function(a){this.options=a||{}},
// Shows the popover on the specified position. Renders it if not already
show:function(){this.isHidden&&(this.el||this.render(),this.el.show(),this.position(),this.isHidden=!1,this.trigger("show"))},
// Hides the popover, through CSS, but does not remove it from the DOM
hide:function(){this.isHidden||(this.el.hide(),this.isHidden=!0,this.trigger("hide"))},
// Creates `this.el` and renders content inside of it
render:function(){var b=this,c=this.options;this.el=a('<div class="fc-popover"/>').addClass(c.className||"").css({
// position initially to the top left to avoid creating scrollbars
top:0,left:0}).append(c.content).appendTo(c.parentEl),
// when a click happens on anything inside with a 'fc-close' className, hide the popover
this.el.on("click",".fc-close",function(){b.hide()}),c.autoHide&&this.listenTo(a(document),"mousedown",this.documentMousedown)},
// Triggered when the user clicks *anywhere* in the document, for the autoHide feature
documentMousedown:function(b){
// only hide the popover if the click happened outside the popover
this.el&&!a(b.target).closest(this.el).length&&this.hide()},
// Hides and unregisters any handlers
removeElement:function(){this.hide(),this.el&&(this.el.remove(),this.el=null),this.stopListeningTo(a(document),"mousedown")},
// Positions the popover optimally, using the top/left/right options
position:function(){var b,c,d,e,f,g=this.options,h=this.el.offsetParent().offset(),i=this.el.outerWidth(),j=this.el.outerHeight(),k=a(window),l=m(this.el);e=g.top||0,f=void 0!==g.left?g.left:void 0!==g.right?g.right-i:0,l.is(window)||l.is(document)?(l=k,b=0,c=0):(d=l.offset(),b=d.top,c=d.left),b+=k.scrollTop(),c+=k.scrollLeft(),g.viewportConstrain!==!1&&(e=Math.min(e,b+l.outerHeight()-j-this.margin),e=Math.max(e,b+this.margin),f=Math.min(f,c+l.outerWidth()-i-this.margin),f=Math.max(f,c+this.margin)),this.el.css({top:e-h.top,left:f-h.left})},
// Triggers a callback. Calls a function in the option hash of the same name.
// Arguments beyond the first `name` are forwarded on.
// TODO: better code reuse for this. Repeat code
trigger:function(a){this.options[a]&&this.options[a].apply(this,Array.prototype.slice.call(arguments,1))}}),lb=Ta.CoordCache=va.extend({els:null,// jQuery set (assumed to be siblings)
forcedOffsetParentEl:null,// options can override the natural offsetParent
origin:null,// {left,top} position of offsetParent of els
boundingRect:null,// constrain cordinates to this rectangle. {left,right,top,bottom} or null
isHorizontal:!1,// whether to query for left/right/width
isVertical:!1,// whether to query for top/bottom/height
// arrays of coordinates (offsets from topleft of document)
lefts:null,rights:null,tops:null,bottoms:null,constructor:function(b){this.els=a(b.els),this.isHorizontal=b.isHorizontal,this.isVertical=b.isVertical,this.forcedOffsetParentEl=b.offsetParent?a(b.offsetParent):null},
// Queries the els for coordinates and stores them.
// Call this method before using and of the get* methods below.
build:function(){var a=this.forcedOffsetParentEl||this.els.eq(0).offsetParent();this.origin=a.offset(),this.boundingRect=this.queryBoundingRect(),this.isHorizontal&&this.buildElHorizontals(),this.isVertical&&this.buildElVerticals()},
// Destroys all internal data about coordinates, freeing memory
clear:function(){this.origin=null,this.boundingRect=null,this.lefts=null,this.rights=null,this.tops=null,this.bottoms=null},
// When called, if coord caches aren't built, builds them
ensureBuilt:function(){this.origin||this.build()},
// Compute and return what the elements' bounding rectangle is, from the user's perspective.
// Right now, only returns a rectangle if constrained by an overflow:scroll element.
queryBoundingRect:function(){var a=m(this.els.eq(0));return a.is(document)?void 0:o(a)},
// Populates the left/right internal coordinate arrays
buildElHorizontals:function(){var b=[],c=[];this.els.each(function(d,e){var f=a(e),g=f.offset().left,h=f.outerWidth();b.push(g),c.push(g+h)}),this.lefts=b,this.rights=c},
// Populates the top/bottom internal coordinate arrays
buildElVerticals:function(){var b=[],c=[];this.els.each(function(d,e){var f=a(e),g=f.offset().top,h=f.outerHeight();b.push(g),c.push(g+h)}),this.tops=b,this.bottoms=c},
// Given a left offset (from document left), returns the index of the el that it horizontally intersects.
// If no intersection is made, or outside of the boundingRect, returns undefined.
getHorizontalIndex:function(a){this.ensureBuilt();var b,c=this.boundingRect,d=this.lefts,e=this.rights,f=d.length;if(!c||a>=c.left&&a<c.right)for(b=0;f>b;b++)if(a>=d[b]&&a<e[b])return b},
// Given a top offset (from document top), returns the index of the el that it vertically intersects.
// If no intersection is made, or outside of the boundingRect, returns undefined.
getVerticalIndex:function(a){this.ensureBuilt();var b,c=this.boundingRect,d=this.tops,e=this.bottoms,f=d.length;if(!c||a>=c.top&&a<c.bottom)for(b=0;f>b;b++)if(a>=d[b]&&a<e[b])return b},
// Gets the left offset (from document left) of the element at the given index
getLeftOffset:function(a){return this.ensureBuilt(),this.lefts[a]},
// Gets the left position (from offsetParent left) of the element at the given index
getLeftPosition:function(a){return this.ensureBuilt(),this.lefts[a]-this.origin.left},
// Gets the right offset (from document left) of the element at the given index.
// This value is NOT relative to the document's right edge, like the CSS concept of "right" would be.
getRightOffset:function(a){return this.ensureBuilt(),this.rights[a]},
// Gets the right position (from offsetParent left) of the element at the given index.
// This value is NOT relative to the offsetParent's right edge, like the CSS concept of "right" would be.
getRightPosition:function(a){return this.ensureBuilt(),this.rights[a]-this.origin.left},
// Gets the width of the element at the given index
getWidth:function(a){return this.ensureBuilt(),this.rights[a]-this.lefts[a]},
// Gets the top offset (from document top) of the element at the given index
getTopOffset:function(a){return this.ensureBuilt(),this.tops[a]},
// Gets the top position (from offsetParent top) of the element at the given position
getTopPosition:function(a){return this.ensureBuilt(),this.tops[a]-this.origin.top},
// Gets the bottom offset (from the document top) of the element at the given index.
// This value is NOT relative to the offsetParent's bottom edge, like the CSS concept of "bottom" would be.
getBottomOffset:function(a){return this.ensureBuilt(),this.bottoms[a]},
// Gets the bottom position (from the offsetParent top) of the element at the given index.
// This value is NOT relative to the offsetParent's bottom edge, like the CSS concept of "bottom" would be.
getBottomPosition:function(a){return this.ensureBuilt(),this.bottoms[a]-this.origin.top},
// Gets the height of the element at the given index
getHeight:function(a){return this.ensureBuilt(),this.bottoms[a]-this.tops[a]}}),mb=Ta.DragListener=va.extend(jb,{options:null,
// for IE8 bug-fighting behavior
subjectEl:null,subjectHref:null,
// coordinates of the initial mousedown
originX:null,originY:null,scrollEl:null,isInteracting:!1,isDistanceSurpassed:!1,isDelayEnded:!1,isDragging:!1,isTouch:!1,delay:null,delayTimeoutId:null,minDistance:null,constructor:function(a){this.options=a||{}},
// Interaction (high-level)
// -----------------------------------------------------------------------------------------------------------------
startInteraction:function(b,c){var d=x(b);if("mousedown"===b.type){if(!u(b))return;b.preventDefault()}this.isInteracting||(c=c||{},this.delay=_(c.delay,this.options.delay,0),this.minDistance=_(c.distance,this.options.distance,0),this.subjectEl=this.options.subjectEl,this.isInteracting=!0,this.isTouch=d,this.isDelayEnded=!1,this.isDistanceSurpassed=!1,this.originX=v(b),this.originY=w(b),this.scrollEl=m(a(b.target)),this.bindHandlers(),this.initAutoScroll(),this.handleInteractionStart(b),this.startDelay(b),this.minDistance||this.handleDistanceSurpassed(b))},handleInteractionStart:function(a){this.trigger("interactionStart",a)},endInteraction:function(a){this.isInteracting&&(this.endDrag(a),this.delayTimeoutId&&(clearTimeout(this.delayTimeoutId),this.delayTimeoutId=null),this.destroyAutoScroll(),this.unbindHandlers(),this.isInteracting=!1,this.handleInteractionEnd(a))},handleInteractionEnd:function(a){this.trigger("interactionEnd",a)},
// Binding To DOM
// -----------------------------------------------------------------------------------------------------------------
bindHandlers:function(){var b=this,c=1;this.isTouch?(this.listenTo(a(document),{touchmove:this.handleTouchMove,touchend:this.endInteraction,touchcancel:this.endInteraction,
// Sometimes touchend doesn't fire
// (can't figure out why. touchcancel doesn't fire either. has to do with scrolling?)
// If another touchstart happens, we know it's bogus, so cancel the drag.
// touchend will continue to be broken until user does a shorttap/scroll, but this is best we can do.
touchstart:function(a){c?// bindHandlers is called from within a touchstart,
c--:b.endInteraction(a)}}),this.scrollEl&&this.listenTo(this.scrollEl,"scroll",this.handleTouchScroll)):this.listenTo(a(document),{mousemove:this.handleMouseMove,mouseup:this.endInteraction}),this.listenTo(a(document),{selectstart:z,// don't allow selection while dragging
contextmenu:z})},unbindHandlers:function(){this.stopListeningTo(a(document)),this.scrollEl&&this.stopListeningTo(this.scrollEl)},
// Drag (high-level)
// -----------------------------------------------------------------------------------------------------------------
// extraOptions ignored if drag already started
startDrag:function(a,b){this.startInteraction(a,b),// ensure interaction began
this.isDragging||(this.isDragging=!0,this.handleDragStart(a))},handleDragStart:function(a){this.trigger("dragStart",a),this.initHrefHack()},handleMove:function(a){var b,c=v(a)-this.originX,d=w(a)-this.originY,e=this.minDistance;// current distance from the origin, squared
this.isDistanceSurpassed||(b=c*c+d*d,b>=e*e&&this.handleDistanceSurpassed(a)),this.isDragging&&this.handleDrag(c,d,a)},
// Called while the mouse is being moved and when we know a legitimate drag is taking place
handleDrag:function(a,b,c){this.trigger("drag",a,b,c),this.updateAutoScroll(c)},endDrag:function(a){this.isDragging&&(this.isDragging=!1,this.handleDragEnd(a))},handleDragEnd:function(a){this.trigger("dragEnd",a),this.destroyHrefHack()},
// Delay
// -----------------------------------------------------------------------------------------------------------------
startDelay:function(a){var b=this;this.delay?this.delayTimeoutId=setTimeout(function(){b.handleDelayEnd(a)},this.delay):this.handleDelayEnd(a)},handleDelayEnd:function(a){this.isDelayEnded=!0,this.isDistanceSurpassed&&this.startDrag(a)},
// Distance
// -----------------------------------------------------------------------------------------------------------------
handleDistanceSurpassed:function(a){this.isDistanceSurpassed=!0,this.isDelayEnded&&this.startDrag(a)},
// Mouse / Touch
// -----------------------------------------------------------------------------------------------------------------
handleTouchMove:function(a){
// prevent inertia and touchmove-scrolling while dragging
this.isDragging&&a.preventDefault(),this.handleMove(a)},handleMouseMove:function(a){this.handleMove(a)},
// Scrolling (unrelated to auto-scroll)
// -----------------------------------------------------------------------------------------------------------------
handleTouchScroll:function(a){
// if the drag is being initiated by touch, but a scroll happens before
// the drag-initiating delay is over, cancel the drag
this.isDragging||this.endInteraction(a)},
// <A> HREF Hack
// -----------------------------------------------------------------------------------------------------------------
initHrefHack:function(){var a=this.subjectEl;
// remove a mousedown'd <a>'s href so it is not visited (IE8 bug)
(this.subjectHref=a?a.attr("href"):null)&&a.removeAttr("href")},destroyHrefHack:function(){var a=this.subjectEl,b=this.subjectHref;
// restore a mousedown'd <a>'s href (for IE8 bug)
setTimeout(function(){// must be outside of the click's execution
b&&a.attr("href",b)},0)},
// Utils
// -----------------------------------------------------------------------------------------------------------------
// Triggers a callback. Calls a function in the option hash of the same name.
// Arguments beyond the first `name` are forwarded on.
trigger:function(a){this.options[a]&&this.options[a].apply(this,Array.prototype.slice.call(arguments,1)),
// makes _methods callable by event name. TODO: kill this
this["_"+a]&&this["_"+a].apply(this,Array.prototype.slice.call(arguments,1))}});/*
this.scrollEl is set in DragListener
*/
mb.mixin({isAutoScroll:!1,scrollBounds:null,// { top, bottom, left, right }
scrollTopVel:null,// pixels per second
scrollLeftVel:null,// pixels per second
scrollIntervalId:null,// ID of setTimeout for scrolling animation loop
// defaults
scrollSensitivity:30,// pixels from edge for scrolling to start
scrollSpeed:200,// pixels per second, at maximum speed
scrollIntervalMs:50,// millisecond wait between scroll increment
initAutoScroll:function(){var a=this.scrollEl;this.isAutoScroll=this.options.scroll&&a&&!a.is(window)&&!a.is(document),this.isAutoScroll&&
// debounce makes sure rapid calls don't happen
this.listenTo(a,"scroll",ha(this.handleDebouncedScroll,100))},destroyAutoScroll:function(){this.endAutoScroll(),// kill any animation loop
// remove the scroll handler if there is a scrollEl
this.isAutoScroll&&this.stopListeningTo(this.scrollEl,"scroll")},
// Computes and stores the bounding rectangle of scrollEl
computeScrollBounds:function(){this.isAutoScroll&&(this.scrollBounds=n(this.scrollEl))},
// Called when the dragging is in progress and scrolling should be updated
updateAutoScroll:function(a){var b,c,d,e,f=this.scrollSensitivity,g=this.scrollBounds,h=0,i=0;g&&(b=(f-(w(a)-g.top))/f,c=(f-(g.bottom-w(a)))/f,d=(f-(v(a)-g.left))/f,e=(f-(g.right-v(a)))/f,b>=0&&1>=b?h=b*this.scrollSpeed*-1:c>=0&&1>=c&&(h=c*this.scrollSpeed),d>=0&&1>=d?i=d*this.scrollSpeed*-1:e>=0&&1>=e&&(i=e*this.scrollSpeed)),this.setScrollVel(h,i)},
// Sets the speed-of-scrolling for the scrollEl
setScrollVel:function(a,b){this.scrollTopVel=a,this.scrollLeftVel=b,this.constrainScrollVel(),// massages into realistic values
// if there is non-zero velocity, and an animation loop hasn't already started, then START
!this.scrollTopVel&&!this.scrollLeftVel||this.scrollIntervalId||(this.scrollIntervalId=setInterval(ga(this,"scrollIntervalFunc"),// scope to `this`
this.scrollIntervalMs))},
// Forces scrollTopVel and scrollLeftVel to be zero if scrolling has already gone all the way
constrainScrollVel:function(){var a=this.scrollEl;this.scrollTopVel<0?// scrolling up?
a.scrollTop()<=0&&(// already scrolled all the way up?
this.scrollTopVel=0):this.scrollTopVel>0&&a.scrollTop()+a[0].clientHeight>=a[0].scrollHeight&&(// already scrolled all the way down?
this.scrollTopVel=0),this.scrollLeftVel<0?// scrolling left?
a.scrollLeft()<=0&&(// already scrolled all the left?
this.scrollLeftVel=0):this.scrollLeftVel>0&&a.scrollLeft()+a[0].clientWidth>=a[0].scrollWidth&&(// already scrolled all the way right?
this.scrollLeftVel=0)},
// This function gets called during every iteration of the scrolling animation loop
scrollIntervalFunc:function(){var a=this.scrollEl,b=this.scrollIntervalMs/1e3;// considering animation frequency, what the vel should be mult'd by
// change the value of scrollEl's scroll
this.scrollTopVel&&a.scrollTop(a.scrollTop()+this.scrollTopVel*b),this.scrollLeftVel&&a.scrollLeft(a.scrollLeft()+this.scrollLeftVel*b),this.constrainScrollVel(),// since the scroll values changed, recompute the velocities
// if scrolled all the way, which causes the vels to be zero, stop the animation loop
this.scrollTopVel||this.scrollLeftVel||this.endAutoScroll()},
// Kills any existing scrolling animation loop
endAutoScroll:function(){this.scrollIntervalId&&(clearInterval(this.scrollIntervalId),this.scrollIntervalId=null,this.handleScrollEnd())},
// Get called when the scrollEl is scrolled (NOTE: this is delayed via debounce)
handleDebouncedScroll:function(){
// recompute all coordinates, but *only* if this is *not* part of our scrolling animation
this.scrollIntervalId||this.handleScrollEnd()},
// Called when scrolling has stopped, whether through auto scroll, or the user scrolling
handleScrollEnd:function(){}});/* Tracks mouse movements over a component and raises events about which hit the mouse is over.
------------------------------------------------------------------------------------------------------------------------
options:
- subjectEl
- subjectCenter
*/
var nb=mb.extend({component:null,// converts coordinates to hits
// methods: prepareHits, releaseHits, queryHit
origHit:null,// the hit the mouse was over when listening started
hit:null,// the hit the mouse is over
coordAdjust:null,// delta that will be added to the mouse coordinates when computing collisions
constructor:function(a,b){mb.call(this,b),// call the super-constructor
this.component=a},
// Called when drag listening starts (but a real drag has not necessarily began).
// ev might be undefined if dragging was started manually.
handleInteractionStart:function(a){var b,c,d,e=this.subjectEl;this.computeCoords(),a?(c={left:v(a),top:w(a)},d=c,e&&(b=n(e),d=B(d,b)),this.origHit=this.queryHit(d.left,d.top),e&&this.options.subjectCenter&&(this.origHit&&(b=A(this.origHit,b)||b),d=C(b)),this.coordAdjust=D(d,c)):(this.origHit=null,this.coordAdjust=null),
// call the super-method. do it after origHit has been computed
mb.prototype.handleInteractionStart.apply(this,arguments)},
// Recomputes the drag-critical positions of elements
computeCoords:function(){this.component.prepareHits(),this.computeScrollBounds()},
// Called when the actual drag has started
handleDragStart:function(a){var b;mb.prototype.handleDragStart.apply(this,arguments),b=this.queryHit(v(a),w(a)),b&&this.handleHitOver(b)},
// Called when the drag moves
handleDrag:function(a,b,c){var d;mb.prototype.handleDrag.apply(this,arguments),d=this.queryHit(v(c),w(c)),ya(d,this.hit)||(this.hit&&this.handleHitOut(),d&&this.handleHitOver(d))},
// Called when dragging has been stopped
handleDragEnd:function(){this.handleHitDone(),mb.prototype.handleDragEnd.apply(this,arguments)},
// Called when a the mouse has just moved over a new hit
handleHitOver:function(a){var b=ya(a,this.origHit);this.hit=a,this.trigger("hitOver",this.hit,b,this.origHit)},
// Called when the mouse has just moved out of a hit
handleHitOut:function(){this.hit&&(this.trigger("hitOut",this.hit),this.handleHitDone(),this.hit=null)},
// Called after a hitOut. Also called before a dragStop
handleHitDone:function(){this.hit&&this.trigger("hitDone",this.hit)},
// Called when the interaction ends, whether there was a real drag or not
handleInteractionEnd:function(){mb.prototype.handleInteractionEnd.apply(this,arguments),// call the super-method
this.origHit=null,this.hit=null,this.component.releaseHits()},
// Called when scrolling has stopped, whether through auto scroll, or the user scrolling
handleScrollEnd:function(){mb.prototype.handleScrollEnd.apply(this,arguments),// call the super-method
this.computeCoords()},
// Gets the hit underneath the coordinates for the given mouse event
queryHit:function(a,b){return this.coordAdjust&&(a+=this.coordAdjust.left,b+=this.coordAdjust.top),this.component.queryHit(a,b)}}),ob=va.extend(jb,{options:null,sourceEl:null,// the element that will be cloned and made to look like it is dragging
el:null,// the clone of `sourceEl` that will track the mouse
parentEl:null,// the element that `el` (the clone) will be attached to
// the initial position of el, relative to the offset parent. made to match the initial offset of sourceEl
top0:null,left0:null,
// the absolute coordinates of the initiating touch/mouse action
y0:null,x0:null,
// the number of pixels the mouse has moved from its initial position
topDelta:null,leftDelta:null,isFollowing:!1,isHidden:!1,isAnimating:!1,// doing the revert animation?
constructor:function(b,c){this.options=c=c||{},this.sourceEl=b,this.parentEl=c.parentEl?a(c.parentEl):b.parent()},
// Causes the element to start following the mouse
start:function(b){this.isFollowing||(this.isFollowing=!0,this.y0=w(b),this.x0=v(b),this.topDelta=0,this.leftDelta=0,this.isHidden||this.updatePosition(),x(b)?this.listenTo(a(document),"touchmove",this.handleMove):this.listenTo(a(document),"mousemove",this.handleMove))},
// Causes the element to stop following the mouse. If shouldRevert is true, will animate back to original position.
// `callback` gets invoked when the animation is complete. If no animation, it is invoked immediately.
stop:function(b,c){function d(){this.isAnimating=!1,e.removeElement(),this.top0=this.left0=null,// reset state for future updatePosition calls
c&&c()}var e=this,f=this.options.revertDuration;this.isFollowing&&!this.isAnimating&&(// disallow more than one stop animation at a time
this.isFollowing=!1,this.stopListeningTo(a(document)),b&&f&&!this.isHidden?(// do a revert animation?
this.isAnimating=!0,this.el.animate({top:this.top0,left:this.left0},{duration:f,complete:d})):d())},
// Gets the tracking element. Create it if necessary
getEl:function(){var a=this.el;// hack to force IE8 to compute correct bounding box
// we don't want long taps or any mouse interaction causing selection/menus.
// would use preventSelection(), but that prevents selectstart, causing problems.
return a||(this.sourceEl.width(),a=this.el=this.sourceEl.clone().addClass(this.options.additionalClass||"").css({position:"absolute",visibility:"",// in case original element was hidden (commonly through hideEvents())
display:this.isHidden?"none":"",// for when initially hidden
margin:0,right:"auto",// erase and set width instead
bottom:"auto",// erase and set height instead
width:this.sourceEl.width(),// explicit height in case there was a 'right' value
height:this.sourceEl.height(),// explicit width in case there was a 'bottom' value
opacity:this.options.opacity||"",zIndex:this.options.zIndex}),a.addClass("fc-unselectable"),a.appendTo(this.parentEl)),a},
// Removes the tracking element if it has already been created
removeElement:function(){this.el&&(this.el.remove(),this.el=null)},
// Update the CSS position of the tracking element
updatePosition:function(){var a,b;this.getEl(),// ensure this.el
// make sure origin info was computed
null===this.top0&&(this.sourceEl.width(),a=this.sourceEl.offset(),b=this.el.offsetParent().offset(),this.top0=a.top-b.top,this.left0=a.left-b.left),this.el.css({top:this.top0+this.topDelta,left:this.left0+this.leftDelta})},
// Gets called when the user moves the mouse
handleMove:function(a){this.topDelta=w(a)-this.y0,this.leftDelta=v(a)-this.x0,this.isHidden||this.updatePosition()},
// Temporarily makes the tracking element invisible. Can be called before following starts
hide:function(){this.isHidden||(this.isHidden=!0,this.el&&this.el.hide())},
// Show the tracking element after it has been temporarily hidden
show:function(){this.isHidden&&(this.isHidden=!1,this.updatePosition(),this.getEl().show())}}),pb=Ta.Grid=va.extend(jb,{view:null,// a View object
isRTL:null,// shortcut to the view's isRTL option
start:null,end:null,el:null,// the containing element
elsByFill:null,// a hash of jQuery element sets used for rendering each fill. Keyed by fill name.
// derived from options
eventTimeFormat:null,displayEventTime:null,displayEventEnd:null,minResizeDuration:null,// TODO: hack. set by subclasses. minumum event resize duration
// if defined, holds the unit identified (ex: "year" or "month") that determines the level of granularity
// of the date areas. if not defined, assumes to be day and time granularity.
// TODO: port isTimeScale into same system?
largeUnit:null,dayDragListener:null,segDragListener:null,segResizeListener:null,externalDragListener:null,constructor:function(a){this.view=a,this.isRTL=a.opt("isRTL"),this.elsByFill={}},/* Options
	------------------------------------------------------------------------------------------------------------------*/
// Generates the format string used for event time text, if not explicitly defined by 'timeFormat'
computeEventTimeFormat:function(){return this.view.opt("smallTimeFormat")},
// Determines whether events should have their end times displayed, if not explicitly defined by 'displayEventTime'.
// Only applies to non-all-day events.
computeDisplayEventTime:function(){return!0},
// Determines whether events should have their end times displayed, if not explicitly defined by 'displayEventEnd'
computeDisplayEventEnd:function(){return!0},/* Dates
	------------------------------------------------------------------------------------------------------------------*/
// Tells the grid about what period of time to display.
// Any date-related internal data should be generated.
setRange:function(a){this.start=a.start.clone(),this.end=a.end.clone(),this.rangeUpdated(),this.processRangeOptions()},
// Called when internal variables that rely on the range should be updated
rangeUpdated:function(){},
// Updates values that rely on options and also relate to range
processRangeOptions:function(){var a,b,c=this.view;this.eventTimeFormat=c.opt("eventTimeFormat")||c.opt("timeFormat")||// deprecated
this.computeEventTimeFormat(),a=c.opt("displayEventTime"),null==a&&(a=this.computeDisplayEventTime()),b=c.opt("displayEventEnd"),null==b&&(b=this.computeDisplayEventEnd()),this.displayEventTime=a,this.displayEventEnd=b},
// Converts a span (has unzoned start/end and any other grid-specific location information)
// into an array of segments (pieces of events whose format is decided by the grid).
spanToSegs:function(a){},
// Diffs the two dates, returning a duration, based on granularity of the grid
// TODO: port isTimeScale into this system?
diffDates:function(a,b){return this.largeUnit?L(a,b,this.largeUnit):J(a,b)},/* Hit Area
	------------------------------------------------------------------------------------------------------------------*/
// Called before one or more queryHit calls might happen. Should prepare any cached coordinates for queryHit
prepareHits:function(){},
// Called when queryHit calls have subsided. Good place to clear any coordinate caches.
releaseHits:function(){},
// Given coordinates from the topleft of the document, return data about the date-related area underneath.
// Can return an object with arbitrary properties (although top/right/left/bottom are encouraged).
// Must have a `grid` property, a reference to this current grid. TODO: avoid this
// The returned object will be processed by getHitSpan and getHitEl.
queryHit:function(a,b){},
// Given position-level information about a date-related area within the grid,
// should return an object with at least a start/end date. Can provide other information as well.
getHitSpan:function(a){},
// Given position-level information about a date-related area within the grid,
// should return a jQuery element that best represents it. passed to dayClick callback.
getHitEl:function(a){},/* Rendering
	------------------------------------------------------------------------------------------------------------------*/
// Sets the container element that the grid should render inside of.
// Does other DOM-related initializations.
setElement:function(a){this.el=a,y(a),this.view.calendar.isTouch?this.bindDayHandler("touchstart",this.dayTouchStart):this.bindDayHandler("mousedown",this.dayMousedown),
// attach event-element-related handlers. in Grid.events
// same garbage collection note as above.
this.bindSegHandlers(),this.bindGlobalHandlers()},bindDayHandler:function(b,c){var d=this;
// attach a handler to the grid's root element.
// jQuery will take care of unregistering them when removeElement gets called.
this.el.on(b,function(b){return a(b.target).is(".fc-event-container *, .fc-more")||a(b.target).closest(".fc-popover").length?void 0:c.call(d,b)})},
// Removes the grid's container element from the DOM. Undoes any other DOM-related attachments.
// DOES NOT remove any content beforehand (doesn't clear events or call unrenderDates), unlike View
removeElement:function(){this.unbindGlobalHandlers(),this.clearDragListeners(),this.el.remove()},
// Renders the basic structure of grid view before any content is rendered
renderSkeleton:function(){},
// Renders the grid's date-related content (like areas that represent days/times).
// Assumes setRange has already been called and the skeleton has already been rendered.
renderDates:function(){},
// Unrenders the grid's date-related content
unrenderDates:function(){},/* Handlers
	------------------------------------------------------------------------------------------------------------------*/
// Binds DOM handlers to elements that reside outside the grid, such as the document
bindGlobalHandlers:function(){this.listenTo(a(document),{dragstart:this.externalDragStart,// jqui
sortstart:this.externalDragStart})},
// Unbinds DOM handlers from elements that reside outside the grid
unbindGlobalHandlers:function(){this.stopListeningTo(a(document))},
// Process a mousedown on an element that represents a day. For day clicking and selecting.
dayMousedown:function(a){this.clearDragListeners(),this.buildDayDragListener().startInteraction(a,{})},dayTouchStart:function(a){this.clearDragListeners(),this.buildDayDragListener().startInteraction(a,{delay:this.view.opt("longPressDelay")})},
// Creates a listener that tracks the user's drag across day elements.
// For day clicking and selecting.
buildDayDragListener:function(){var a,b,c=this,d=this.view,e=d.opt("selectable"),f=this.dayDragListener=new nb(this,{scroll:d.opt("dragScroll"),interactionStart:function(){a=f.origHit},dragStart:function(){d.unselect()},hitOver:function(d,f,h){h&&(// click needs to have started on a hit
// if user dragged to another cell at any point, it can no longer be a dayClick
f||(a=null),e&&(b=c.computeSelection(c.getHitSpan(h),c.getHitSpan(d)),b?c.renderSelection(b):b===!1&&g()))},hitOut:function(){a=null,b=null,c.unrenderSelection(),h()},interactionEnd:function(e){a&&d.triggerDayClick(c.getHitSpan(a),c.getHitEl(a),e),b&&
// the selection will already have been rendered. just report it
d.reportSelection(b,e),h(),c.dayDragListener=null}});return f},
// Kills all in-progress dragging.
// Useful for when public API methods that result in re-rendering are invoked during a drag.
// Also useful for when touch devices misbehave and don't fire their touchend.
clearDragListeners:function(){this.dayDragListener&&this.dayDragListener.endInteraction(),this.segDragListener&&this.segDragListener.endInteraction(),this.segResizeListener&&this.segResizeListener.endInteraction(),this.externalDragListener&&this.externalDragListener.endInteraction()},/* Event Helper
	------------------------------------------------------------------------------------------------------------------*/
// TODO: should probably move this to Grid.events, like we did event dragging / resizing
// Renders a mock event at the given event location, which contains zoned start/end properties.
// Returns all mock event elements.
renderEventLocationHelper:function(a,b){var c=this.fabricateHelperEvent(a,b);return this.renderHelper(c,b)},
// Builds a fake event given zoned event date properties and a segment is should be inspired from.
// The range's end can be null, in which case the mock event that is rendered will have a null end time.
// `sourceSeg` is the internal segment object involved in the drag. If null, something external is dragging.
fabricateHelperEvent:function(a,b){var c=b?V(b.event):{};// mask the original event object if possible
// force it to be freshly computed by normalizeEventDates
// this extra className will be useful for differentiating real events from mock events in CSS
// if something external is being dragged in, don't render a resizer
return c.start=a.start.clone(),c.end=a.end?a.end.clone():null,c.allDay=null,this.view.calendar.normalizeEventDates(c),c.className=(c.className||[]).concat("fc-helper"),b||(c.editable=!1),c},
// Renders a mock event. Given zoned event date properties.
// Must return all mock event elements.
renderHelper:function(a,b){},
// Unrenders a mock event
unrenderHelper:function(){},/* Selection
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of a selection. Will highlight by default but can be overridden by subclasses.
// Given a span (unzoned start/end and other misc data)
renderSelection:function(a){this.renderHighlight(a)},
// Unrenders any visual indications of a selection. Will unrender a highlight by default.
unrenderSelection:function(){this.unrenderHighlight()},
// Given the first and last date-spans of a selection, returns another date-span object.
// Subclasses can override and provide additional data in the span object. Will be passed to renderSelection().
// Will return false if the selection is invalid and this should be indicated to the user.
// Will return null/undefined if a selection invalid but no error should be reported.
computeSelection:function(a,b){var c=this.computeSelectionSpan(a,b);return c&&!this.view.calendar.isSelectionSpanAllowed(c)?!1:c},
// Given two spans, must return the combination of the two.
// TODO: do this separation of concerns (combining VS validation) for event dnd/resize too.
computeSelectionSpan:function(a,b){var c=[a.start,a.end,b.start,b.end];// sorts chronologically. works with Moments
return c.sort(ea),{start:c[0].clone(),end:c[3].clone()}},/* Highlight
	------------------------------------------------------------------------------------------------------------------*/
// Renders an emphasis on the given date range. Given a span (unzoned start/end and other misc data)
renderHighlight:function(a){this.renderFill("highlight",this.spanToSegs(a))},
// Unrenders the emphasis on a date range
unrenderHighlight:function(){this.unrenderFill("highlight")},
// Generates an array of classNames for rendering the highlight. Used by the fill system.
highlightSegClasses:function(){return["fc-highlight"]},/* Business Hours
	------------------------------------------------------------------------------------------------------------------*/
renderBusinessHours:function(){},unrenderBusinessHours:function(){},/* Now Indicator
	------------------------------------------------------------------------------------------------------------------*/
getNowIndicatorUnit:function(){},renderNowIndicator:function(a){},unrenderNowIndicator:function(){},/* Fill System (highlight, background events, business hours)
	--------------------------------------------------------------------------------------------------------------------
	TODO: remove this system. like we did in TimeGrid
	*/
// Renders a set of rectangles over the given segments of time.
// MUST RETURN a subset of segs, the segs that were actually rendered.
// Responsible for populating this.elsByFill. TODO: better API for expressing this requirement
renderFill:function(a,b){},
// Unrenders a specific type of fill that is currently rendered on the grid
unrenderFill:function(a){var b=this.elsByFill[a];b&&(b.remove(),delete this.elsByFill[a])},
// Renders and assigns an `el` property for each fill segment. Generic enough to work with different types.
// Only returns segments that successfully rendered.
// To be harnessed by renderFill (implemented by subclasses).
// Analagous to renderFgSegEls.
renderFillSegEls:function(b,c){var d,e=this,f=this[b+"SegEl"],g="",h=[];if(c.length){
// build a large concatenation of segment HTML
for(d=0;d<c.length;d++)g+=this.fillSegHtml(b,c[d]);
// Grab individual elements from the combined HTML string. Use each as the default rendering.
// Then, compute the 'el' for each segment.
a(g).each(function(b,d){var g=c[b],i=a(d);
// allow custom filter methods per-type
f&&(i=f.call(e,g,i)),i&&(i=a(i),i.is(e.fillSegTag)&&(g.el=i,h.push(g)))})}return h},fillSegTag:"div",// subclasses can override
// Builds the HTML needed for one fill segment. Generic enought o work with different types.
fillSegHtml:function(a,b){
// custom hooks per-type
var c=this[a+"SegClasses"],d=this[a+"SegCss"],e=c?c.call(this,b):[],f=ca(d?d.call(this,b):{});return"<"+this.fillSegTag+(e.length?' class="'+e.join(" ")+'"':"")+(f?' style="'+f+'"':"")+" />"},/* Generic rendering utilities for subclasses
	------------------------------------------------------------------------------------------------------------------*/
// Computes HTML classNames for a single-day element
getDayClasses:function(a){var b=this.view,c=b.calendar.getNow(),d=["fc-"+Xa[a.day()]];return 1==b.intervalDuration.as("months")&&a.month()!=b.intervalStart.month()&&d.push("fc-other-month"),a.isSame(c,"day")?d.push("fc-today",b.highlightStateClass):c>a?d.push("fc-past"):d.push("fc-future"),d}});/* Event-rendering and event-interaction methods for the abstract Grid class
----------------------------------------------------------------------------------------------------------------------*/
pb.mixin({mousedOverSeg:null,// the segment object the user's mouse is over. null if over nothing
isDraggingSeg:!1,// is a segment being dragged? boolean
isResizingSeg:!1,// is a segment being resized? boolean
isDraggingExternal:!1,// jqui-dragging an external element? boolean
segs:null,// the *event* segments currently rendered in the grid. TODO: rename to `eventSegs`
// Renders the given events onto the grid
renderEvents:function(a){var b,c=[],d=[];for(b=0;b<a.length;b++)(Aa(a[b])?c:d).push(a[b]);this.segs=[].concat(// record all segs
this.renderBgEvents(c),this.renderFgEvents(d))},renderBgEvents:function(a){var b=this.eventsToSegs(a);
// renderBgSegs might return a subset of segs, segs that were actually rendered
return this.renderBgSegs(b)||b},renderFgEvents:function(a){var b=this.eventsToSegs(a);
// renderFgSegs might return a subset of segs, segs that were actually rendered
return this.renderFgSegs(b)||b},
// Unrenders all events currently rendered on the grid
unrenderEvents:function(){this.handleSegMouseout(),// trigger an eventMouseout if user's mouse is over an event
this.clearDragListeners(),this.unrenderFgSegs(),this.unrenderBgSegs(),this.segs=null},
// Retrieves all rendered segment objects currently rendered on the grid
getEventSegs:function(){return this.segs||[]},/* Foreground Segment Rendering
	------------------------------------------------------------------------------------------------------------------*/
// Renders foreground event segments onto the grid. May return a subset of segs that were rendered.
renderFgSegs:function(a){},
// Unrenders all currently rendered foreground segments
unrenderFgSegs:function(){},
// Renders and assigns an `el` property for each foreground event segment.
// Only returns segments that successfully rendered.
// A utility that subclasses may use.
renderFgSegEls:function(b,c){var d,e=this.view,f="",g=[];if(b.length){// don't build an empty html string
// build a large concatenation of event segment HTML
for(d=0;d<b.length;d++)f+=this.fgSegHtml(b[d],c);
// Grab individual elements from the combined HTML string. Use each as the default rendering.
// Then, compute the 'el' for each segment. An el might be null if the eventRender callback returned false.
a(f).each(function(c,d){var f=b[c],h=e.resolveEventEl(f.event,a(d));h&&(h.data("fc-seg",f),// used by handlers
f.el=h,g.push(f))})}return g},
// Generates the HTML for the default rendering of a foreground event segment. Used by renderFgSegEls()
fgSegHtml:function(a,b){},/* Background Segment Rendering
	------------------------------------------------------------------------------------------------------------------*/
// Renders the given background event segments onto the grid.
// Returns a subset of the segs that were actually rendered.
renderBgSegs:function(a){return this.renderFill("bgEvent",a)},
// Unrenders all the currently rendered background event segments
unrenderBgSegs:function(){this.unrenderFill("bgEvent")},
// Renders a background event element, given the default rendering. Called by the fill system.
bgEventSegEl:function(a,b){return this.view.resolveEventEl(a.event,b)},
// Generates an array of classNames to be used for the default rendering of a background event.
// Called by the fill system.
bgEventSegClasses:function(a){var b=a.event,c=b.source||{};return["fc-bgevent"].concat(b.className,c.className||[])},
// Generates a semicolon-separated CSS string to be used for the default rendering of a background event.
// Called by the fill system.
bgEventSegCss:function(a){return{"background-color":this.getSegSkinCss(a)["background-color"]}},
// Generates an array of classNames to be used for the rendering business hours overlay. Called by the fill system.
businessHoursSegClasses:function(a){return["fc-nonbusiness","fc-bgevent"]},/* Handlers
	------------------------------------------------------------------------------------------------------------------*/
// Attaches event-element-related handlers to the container element and leverage bubbling
bindSegHandlers:function(){this.view.calendar.isTouch?this.bindSegHandler("touchstart",this.handleSegTouchStart):(this.bindSegHandler("mouseenter",this.handleSegMouseover),this.bindSegHandler("mouseleave",this.handleSegMouseout),this.bindSegHandler("mousedown",this.handleSegMousedown)),this.bindSegHandler("click",this.handleSegClick)},
// Executes a handler for any a user-interaction on a segment.
// Handler gets called with (seg, ev), and with the `this` context of the Grid
bindSegHandler:function(b,c){var d=this;this.el.on(b,".fc-event-container > *",function(b){var e=a(this).data("fc-seg");// grab segment data. put there by View::renderEvents
// only call the handlers if there is not a drag/resize in progress
// grab segment data. put there by View::renderEvents
// only call the handlers if there is not a drag/resize in progress
return!e||d.isDraggingSeg||d.isResizingSeg?void 0:c.call(d,e,b)})},handleSegClick:function(a,b){return this.view.trigger("eventClick",a.el[0],a.event,b)},
// Updates internal state and triggers handlers for when an event element is moused over
handleSegMouseover:function(a,b){this.mousedOverSeg||(this.mousedOverSeg=a,this.view.trigger("eventMouseover",a.el[0],a.event,b))},
// Updates internal state and triggers handlers for when an event element is moused out.
// Can be given no arguments, in which case it will mouseout the segment that was previously moused over.
handleSegMouseout:function(a,b){b=b||{},this.mousedOverSeg&&(a=a||this.mousedOverSeg,this.mousedOverSeg=null,this.view.trigger("eventMouseout",a.el[0],a.event,b))},handleSegTouchStart:function(a,b){var c,d=this.view,e=a.event,f=d.isEventSelected(e),g=d.isEventDraggable(e),h=d.isEventResizable(e),i=!1;f&&h&&(
// only allow resizing of the event is selected
i=this.startSegResize(a,b)),i||!g&&!h||(// allowed to be selected?
this.clearDragListeners(),c=g?this.buildSegDragListener(a):new mb,c._dragStart=function(){f||d.selectEvent(e)},c.startInteraction(b,{delay:f?0:this.view.opt("longPressDelay")}))},handleSegMousedown:function(a,b){var c=this.startSegResize(a,b,{distance:5});!c&&this.view.isEventDraggable(a.event)&&(this.clearDragListeners(),this.buildSegDragListener(a).startInteraction(b,{distance:5}))},
// returns boolean whether resizing actually started or not.
// assumes the seg allows resizing.
// `dragOptions` are optional.
startSegResize:function(b,c,d){return a(c.target).is(".fc-resizer")?(this.clearDragListeners(),this.buildSegResizeListener(b,a(c.target).is(".fc-start-resizer")).startInteraction(c,d),!0):!1},/* Event Dragging
	------------------------------------------------------------------------------------------------------------------*/
// Builds a listener that will track user-dragging on an event segment.
// Generic enough to work with any type of Grid.
buildSegDragListener:function(a){var b,c,d,e=this,f=this.view,i=f.calendar,j=a.el,k=a.event,l=this.segDragListener=new nb(f,{scroll:f.opt("dragScroll"),subjectEl:j,subjectCenter:!0,interactionStart:function(d){b=!1,c=new ob(a.el,{additionalClass:"fc-dragging",parentEl:f.el,opacity:l.isTouch?null:f.opt("dragOpacity"),revertDuration:f.opt("dragRevertDuration"),zIndex:2}),c.hide(),c.start(d)},dragStart:function(c){b=!0,e.handleSegMouseout(a,c),e.segDragStart(a,c),f.hideEvent(k)},hitOver:function(b,h,j){var m;
// starting hit could be forced (DayGrid.limit)
a.hit&&(j=a.hit),d=e.computeEventDrop(j.component.getHitSpan(j),b.component.getHitSpan(b),k),d&&!i.isEventSpanAllowed(e.eventToSpan(d),k)&&(g(),d=null),d&&(m=f.renderDrag(d,a))?(m.addClass("fc-dragging"),l.isTouch||e.applyDragOpacity(m),c.hide()):c.show(),h&&(d=null)},hitOut:function(){// called before mouse moves to a different hit OR moved out of all hits
f.unrenderDrag(),// unrender whatever was done in renderDrag
c.show(),// show in case we are moving out of all hits
d=null},hitDone:function(){// Called after a hitOut OR before a dragEnd
h()},interactionEnd:function(g){
// do revert animation if hasn't changed. calls a callback when finished (whether animation or not)
c.stop(!d,function(){b&&(f.unrenderDrag(),f.showEvent(k),e.segDragStop(a,g)),d&&f.reportEventDrop(k,d,this.largeUnit,j,g)}),e.segDragListener=null}});return l},
// Called before event segment dragging starts
segDragStart:function(a,b){this.isDraggingSeg=!0,this.view.trigger("eventDragStart",a.el[0],a.event,b,{})},
// Called after event segment dragging stops
segDragStop:function(a,b){this.isDraggingSeg=!1,this.view.trigger("eventDragStop",a.el[0],a.event,b,{})},
// Given the spans an event drag began, and the span event was dropped, calculates the new zoned start/end/allDay
// values for the event. Subclasses may override and set additional properties to be used by renderDrag.
// A falsy returned value indicates an invalid drop.
// DOES NOT consider overlap/constraint.
computeEventDrop:function(a,b,c){var d,e,f=this.view.calendar,g=a.start,h=b.start;// zoned event date properties
// if an all-day event was in a timed area and it was dragged to a different time,
// guarantee an end and adjust start/end to have times
// if switching from day <-> timed, start should be reset to the dropped date, and the end cleared
return g.hasTime()===h.hasTime()?(d=this.diffDates(h,g),c.allDay&&R(d)?(e={start:c.start.clone(),end:f.getEventEnd(c),allDay:!1},f.normalizeEventTimes(e)):e={start:c.start.clone(),end:c.end?c.end.clone():null,allDay:c.allDay},e.start.add(d),e.end&&e.end.add(d)):e={start:h.clone(),end:null,// end should be cleared
allDay:!h.hasTime()},e},
// Utility for apply dragOpacity to a jQuery set
applyDragOpacity:function(a){var b=this.view.opt("dragOpacity");null!=b&&a.each(function(a,c){
// Don't use jQuery (will set an IE filter), do it the old fashioned way.
// In IE8, a helper element will disappears if there's a filter.
c.style.opacity=b})},/* External Element Dragging
	------------------------------------------------------------------------------------------------------------------*/
// Called when a jQuery UI drag is initiated anywhere in the DOM
externalDragStart:function(b,c){var d,e,f=this.view;f.opt("droppable")&&(d=a((c?c.item:null)||b.target),e=f.opt("dropAccept"),(a.isFunction(e)?e.call(d[0],d):d.is(e))&&(this.isDraggingExternal||this.listenToExternalDrag(d,b,c)))},
// Called when a jQuery UI drag starts and it needs to be monitored for dropping
listenToExternalDrag:function(a,b,c){var d,e=this,f=this.view.calendar,i=Fa(a),j=e.externalDragListener=new nb(this,{interactionStart:function(){e.isDraggingExternal=!0},hitOver:function(a){d=e.computeExternalDrop(a.component.getHitSpan(a),// since we are querying the parent view, might not belong to this grid
i),d&&!f.isExternalSpanAllowed(e.eventToSpan(d),d,i.eventProps)&&(g(),d=null),d&&e.renderDrag(d)},hitOut:function(){d=null},hitDone:function(){// Called after a hitOut OR before a dragEnd
h(),e.unrenderDrag()},interactionEnd:function(b){d&&// element was dropped on a valid hit
e.view.reportExternalDrop(i,d,a,b,c),e.isDraggingExternal=!1,e.externalDragListener=null}});j.startDrag(b)},
// Given a hit to be dropped upon, and misc data associated with the jqui drag (guaranteed to be a plain object),
// returns the zoned start/end dates for the event that would result from the hypothetical drop. end might be null.
// Returning a null value signals an invalid drop hit.
// DOES NOT consider overlap/constraint.
computeExternalDrop:function(a,b){var c=this.view.calendar,d={start:c.applyTimezone(a.start),// simulate a zoned event start date
end:null};
// if dropped on an all-day span, and element's metadata specified a time, set it
return b.startTime&&!d.start.hasTime()&&d.start.time(b.startTime),b.duration&&(d.end=d.start.clone().add(b.duration)),d},/* Drag Rendering (for both events and an external elements)
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of an event or external element being dragged.
// `dropLocation` contains hypothetical start/end/allDay values the event would have if dropped. end can be null.
// `seg` is the internal segment object that is being dragged. If dragging an external element, `seg` is null.
// A truthy returned value indicates this method has rendered a helper element.
// Must return elements used for any mock events.
renderDrag:function(a,b){},
// Unrenders a visual indication of an event or external element being dragged
unrenderDrag:function(){},/* Resizing
	------------------------------------------------------------------------------------------------------------------*/
// Creates a listener that tracks the user as they resize an event segment.
// Generic enough to work with any type of Grid.
buildSegResizeListener:function(a,b){var c,d,e=this,f=this.view,i=f.calendar,j=a.el,k=a.event,l=i.getEventEnd(k),m=this.segResizeListener=new nb(this,{scroll:f.opt("dragScroll"),subjectEl:j,interactionStart:function(){c=!1},dragStart:function(b){c=!0,e.handleSegMouseout(a,b),e.segResizeStart(a,b)},hitOver:function(c,h,j){var m=e.getHitSpan(j),n=e.getHitSpan(c);d=b?e.computeEventStartResize(m,n,k):e.computeEventEndResize(m,n,k),d&&(i.isEventSpanAllowed(e.eventToSpan(d),k)?d.start.isSame(k.start)&&d.end.isSame(l)&&(d=null):(g(),d=null)),d&&(f.hideEvent(k),e.renderEventResize(d,a))},hitOut:function(){// called before mouse moves to a different hit OR moved out of all hits
d=null},hitDone:function(){// resets the rendering to show the original event
e.unrenderEventResize(),f.showEvent(k),h()},interactionEnd:function(b){c&&e.segResizeStop(a,b),d&&// valid date to resize to?
f.reportEventResize(k,d,this.largeUnit,j,b),e.segResizeListener=null}});return m},
// Called before event segment resizing starts
segResizeStart:function(a,b){this.isResizingSeg=!0,this.view.trigger("eventResizeStart",a.el[0],a.event,b,{})},
// Called after event segment resizing stops
segResizeStop:function(a,b){this.isResizingSeg=!1,this.view.trigger("eventResizeStop",a.el[0],a.event,b,{})},
// Returns new date-information for an event segment being resized from its start
computeEventStartResize:function(a,b,c){return this.computeEventResize("start",a,b,c)},
// Returns new date-information for an event segment being resized from its end
computeEventEndResize:function(a,b,c){return this.computeEventResize("end",a,b,c)},
// Returns new zoned date information for an event segment being resized from its start OR end
// `type` is either 'start' or 'end'.
// DOES NOT consider overlap/constraint.
computeEventResize:function(a,b,c,d){var e,f,g=this.view.calendar,h=this.diffDates(c[a],b[a]);
// build original values to work from, guaranteeing a start and end
// if an all-day event was in a timed area and was resized to a time, adjust start/end to have times
// apply delta to start or end
// if the event was compressed too small, find a new reasonable duration for it
// TODO: hack
// resizing the start?
// resizing the end?
return e={start:d.start.clone(),end:g.getEventEnd(d),allDay:d.allDay},e.allDay&&R(h)&&(e.allDay=!1,g.normalizeEventTimes(e)),e[a].add(h),e.start.isBefore(e.end)||(f=this.minResizeDuration||(d.allDay?g.defaultAllDayEventDuration:g.defaultTimedEventDuration),"start"==a?e.start=e.end.clone().subtract(f):e.end=e.start.clone().add(f)),e},
// Renders a visual indication of an event being resized.
// `range` has the updated dates of the event. `seg` is the original segment object involved in the drag.
// Must return elements used for any mock events.
renderEventResize:function(a,b){},
// Unrenders a visual indication of an event being resized.
unrenderEventResize:function(){},/* Rendering Utils
	------------------------------------------------------------------------------------------------------------------*/
// Compute the text that should be displayed on an event's element.
// `range` can be the Event object itself, or something range-like, with at least a `start`.
// If event times are disabled, or the event has no time, will return a blank string.
// If not specified, formatStr will default to the eventTimeFormat setting,
// and displayEnd will default to the displayEventEnd setting.
getEventTimeText:function(a,b,c){return null==b&&(b=this.eventTimeFormat),null==c&&(c=this.displayEventEnd),this.displayEventTime&&a.start.hasTime()?c&&a.end?this.view.formatRange(a,b):a.start.format(b):""},
// Generic utility for generating the HTML classNames for an event segment's element
getSegClasses:function(a,b,c){var d=this.view,e=a.event,f=["fc-event",a.isStart?"fc-start":"fc-not-start",a.isEnd?"fc-end":"fc-not-end"].concat(e.className,e.source?e.source.className:[]);
// event is currently selected? attach a className.
return b&&f.push("fc-draggable"),c&&f.push("fc-resizable"),d.isEventSelected(e)&&f.push("fc-selected"),f},
// Utility for generating event skin-related CSS properties
getSegSkinCss:function(a){var b=a.event,c=this.view,d=b.source||{},e=b.color,f=d.color,g=c.opt("eventColor");return{"background-color":b.backgroundColor||e||d.backgroundColor||f||c.opt("eventBackgroundColor")||g,"border-color":b.borderColor||e||d.borderColor||f||c.opt("eventBorderColor")||g,color:b.textColor||d.textColor||c.opt("eventTextColor")}},/* Converting events -> eventRange -> eventSpan -> eventSegs
	------------------------------------------------------------------------------------------------------------------*/
// Generates an array of segments for the given single event
// Can accept an event "location" as well (which only has start/end and no allDay)
eventToSegs:function(a){return this.eventsToSegs([a])},eventToSpan:function(a){return this.eventToSpans(a)[0]},
// Generates spans (always unzoned) for the given event.
// Does not do any inverting for inverse-background events.
// Can accept an event "location" as well (which only has start/end and no allDay)
eventToSpans:function(a){var b=this.eventToRange(a);return this.eventRangeToSpans(b,a)},
// Converts an array of event objects into an array of event segment objects.
// A custom `segSliceFunc` may be given for arbitrarily slicing up events.
// Doesn't guarantee an order for the resulting array.
eventsToSegs:function(b,c){var d=this,e=Da(b),f=[];return a.each(e,function(a,b){var e,g=[];for(e=0;e<b.length;e++)g.push(d.eventToRange(b[e]));
// inverse-background events (utilize only the first event in calculations)
if(Ba(b[0]))for(g=d.invertRanges(g),e=0;e<g.length;e++)f.push.apply(f,// append to
d.eventRangeToSegs(g[e],b[0],c));else for(e=0;e<g.length;e++)f.push.apply(f,// append to
d.eventRangeToSegs(g[e],b[e],c))}),f},
// Generates the unzoned start/end dates an event appears to occupy
// Can accept an event "location" as well (which only has start/end and no allDay)
eventToRange:function(a){return{start:a.start.clone().stripZone(),end:(a.end?a.end.clone():
// derive the end from the start and allDay. compute allDay if necessary
this.view.calendar.getDefaultEventEnd(null!=a.allDay?a.allDay:!a.start.hasTime(),a.start)).stripZone()}},
// Given an event's range (unzoned start/end), and the event itself,
// slice into segments (using the segSliceFunc function if specified)
eventRangeToSegs:function(a,b,c){var d,e=this.eventRangeToSpans(a,b),f=[];for(d=0;d<e.length;d++)f.push.apply(f,// append to
this.eventSpanToSegs(e[d],b,c));return f},
// Given an event's unzoned date range, return an array of "span" objects.
// Subclasses can override.
eventRangeToSpans:function(b,c){return[a.extend({},b)]},
// Given an event's span (unzoned start/end and other misc data), and the event itself,
// slices into segments and attaches event-derived properties to them.
eventSpanToSegs:function(a,b,c){var d,e,f=c?c(a):this.spanToSegs(a);for(d=0;d<f.length;d++)e=f[d],e.event=b,e.eventStartMS=+a.start,e.eventDurationMS=a.end-a.start;return f},
// Produces a new array of range objects that will cover all the time NOT covered by the given ranges.
// SIDE EFFECT: will mutate the given array and will use its date references.
invertRanges:function(a){var b,c,d=this.view,e=d.start.clone(),f=d.end.clone(),g=[],h=e;for(
// ranges need to be in order. required for our date-walking algorithm
a.sort(Ea),b=0;b<a.length;b++)c=a[b],c.start>h&&g.push({start:h,end:c.start}),h=c.end;
// add the span of time after the last event (if there is any)
// compare millisecond time (skip any ambig logic)
return f>h&&g.push({start:h,end:f}),g},sortEventSegs:function(a){a.sort(ga(this,"compareEventSegs"))},
// A cmp function for determining which segments should take visual priority
compareEventSegs:function(a,b){// earlier events go first
// tie? longer events go first
// tie? put all-day events first (booleans cast to 0/1)
return a.eventStartMS-b.eventStartMS||b.eventDurationMS-a.eventDurationMS||b.event.allDay-a.event.allDay||F(a.event,b.event,this.view.eventOrderSpecs)}}),Ta.isBgEvent=Aa,/* External-Dragging-Element Data
----------------------------------------------------------------------------------------------------------------------*/
// Require all HTML5 data-* attributes used by FullCalendar to have this prefix.
// A value of '' will query attributes like data-event. A value of 'fc' will query attributes like data-fc-event.
Ta.dataAttrPrefix="";/*
A set of rendering and date-related methods for a visual component comprised of one or more rows of day columns.
Prerequisite: the object being mixed into needs to be a *Grid*
*/
var qb=Ta.DayTableMixin={breakOnWeeks:!1,// should create a new row for each week?
dayDates:null,// whole-day dates for each column. left to right
dayIndices:null,// for each day from start, the offset
daysPerRow:null,rowCnt:null,colCnt:null,colHeadFormat:null,
// Populates internal variables used for date calculation and rendering
updateDayTable:function(){for(var a,b,c,d=this.view,e=this.start.clone(),f=-1,g=[],h=[];e.isBefore(this.end);)// loop each day from start to end
d.isHiddenDay(e)?g.push(f+.5):(f++,g.push(f),h.push(e.clone())),e.add(1,"days");if(this.breakOnWeeks){for(b=h[0].day(),a=1;a<h.length&&h[a].day()!=b;a++);c=Math.ceil(h.length/a)}else c=1,a=h.length;this.dayDates=h,this.dayIndices=g,this.daysPerRow=a,this.rowCnt=c,this.updateDayTableCols()},
// Computes and assigned the colCnt property and updates any options that may be computed from it
updateDayTableCols:function(){this.colCnt=this.computeColCnt(),this.colHeadFormat=this.view.opt("columnFormat")||this.computeColHeadFormat()},
// Determines how many columns there should be in the table
computeColCnt:function(){return this.daysPerRow},
// Computes the ambiguously-timed moment for the given cell
getCellDate:function(a,b){return this.dayDates[this.getCellDayIndex(a,b)].clone()},
// Computes the ambiguously-timed date range for the given cell
getCellRange:function(a,b){var c=this.getCellDate(a,b),d=c.clone().add(1,"days");return{start:c,end:d}},
// Returns the number of day cells, chronologically, from the first of the grid (0-based)
getCellDayIndex:function(a,b){return a*this.daysPerRow+this.getColDayIndex(b)},
// Returns the numner of day cells, chronologically, from the first cell in *any given row*
getColDayIndex:function(a){return this.isRTL?this.colCnt-1-a:a},
// Given a date, returns its chronolocial cell-index from the first cell of the grid.
// If the date lies between cells (because of hiddenDays), returns a floating-point value between offsets.
// If before the first offset, returns a negative number.
// If after the last offset, returns an offset past the last cell offset.
// Only works for *start* dates of cells. Will not work for exclusive end dates for cells.
getDateDayIndex:function(a){var b=this.dayIndices,c=a.diff(this.start,"days");return 0>c?b[0]-1:c>=b.length?b[b.length-1]+1:b[c]},/* Options
	------------------------------------------------------------------------------------------------------------------*/
// Computes a default column header formatting string if `colFormat` is not explicitly defined
computeColHeadFormat:function(){
// if more than one week row, or if there are a lot of columns with not much space,
// put just the day numbers will be in each cell
// if more than one week row, or if there are a lot of columns with not much space,
// put just the day numbers will be in each cell
return this.rowCnt>1||this.colCnt>10?"ddd":this.colCnt>1?this.view.opt("dayOfMonthFormat"):"dddd"},/* Slicing
	------------------------------------------------------------------------------------------------------------------*/
// Slices up a date range into a segment for every week-row it intersects with
sliceRangeByRow:function(a){var b,c,d,e,f,g=this.daysPerRow,h=this.view.computeDayRange(a),i=this.getDateDayIndex(h.start),j=this.getDateDayIndex(h.end.clone().subtract(1,"days")),k=[];// inclusive day-index range for segment
for(b=0;b<this.rowCnt;b++)c=b*g,d=c+g-1,e=Math.max(i,c),f=Math.min(j,d),e=Math.ceil(e),f=Math.floor(f),f>=e&&k.push({row:b,firstRowDayIndex:e-c,lastRowDayIndex:f-c,isStart:e===i,isEnd:f===j});return k},
// Slices up a date range into a segment for every day-cell it intersects with.
// TODO: make more DRY with sliceRangeByRow somehow.
sliceRangeByDay:function(a){var b,c,d,e,f,g,h=this.daysPerRow,i=this.view.computeDayRange(a),j=this.getDateDayIndex(i.start),k=this.getDateDayIndex(i.end.clone().subtract(1,"days")),l=[];// inclusive day-index range for segment
for(b=0;b<this.rowCnt;b++)for(c=b*h,d=c+h-1,e=c;d>=e;e++)f=Math.max(j,e),g=Math.min(k,e),f=Math.ceil(f),g=Math.floor(g),g>=f&&l.push({row:b,firstRowDayIndex:f-c,lastRowDayIndex:g-c,isStart:f===j,isEnd:g===k});return l},/* Header Rendering
	------------------------------------------------------------------------------------------------------------------*/
renderHeadHtml:function(){var a=this.view;return'<div class="fc-row '+a.widgetHeaderClass+'"><table><thead>'+this.renderHeadTrHtml()+"</thead></table></div>"},renderHeadIntroHtml:function(){return this.renderIntroHtml()},renderHeadTrHtml:function(){return"<tr>"+(this.isRTL?"":this.renderHeadIntroHtml())+this.renderHeadDateCellsHtml()+(this.isRTL?this.renderHeadIntroHtml():"")+"</tr>"},renderHeadDateCellsHtml:function(){var a,b,c=[];for(a=0;a<this.colCnt;a++)b=this.getCellDate(0,a),c.push(this.renderHeadDateCellHtml(b));return c.join("")},
// TODO: when internalApiVersion, accept an object for HTML attributes
// (colspan should be no different)
renderHeadDateCellHtml:function(a,b,c){var d=this.view;return'<th class="fc-day-header '+d.widgetHeaderClass+" fc-"+Xa[a.day()]+'"'+(1==this.rowCnt?' data-date="'+a.format("YYYY-MM-DD")+'"':"")+(b>1?' colspan="'+b+'"':"")+(c?" "+c:"")+">"+aa(a.format(this.colHeadFormat))+"</th>"},/* Background Rendering
	------------------------------------------------------------------------------------------------------------------*/
renderBgTrHtml:function(a){return"<tr>"+(this.isRTL?"":this.renderBgIntroHtml(a))+this.renderBgCellsHtml(a)+(this.isRTL?this.renderBgIntroHtml(a):"")+"</tr>"},renderBgIntroHtml:function(a){return this.renderIntroHtml()},renderBgCellsHtml:function(a){var b,c,d=[];for(b=0;b<this.colCnt;b++)c=this.getCellDate(a,b),d.push(this.renderBgCellHtml(c));return d.join("")},renderBgCellHtml:function(a,b){var c=this.view,d=this.getDayClasses(a);// if date has a time, won't format it
return d.unshift("fc-day",c.widgetContentClass),'<td class="'+d.join(" ")+'" data-date="'+a.format("YYYY-MM-DD")+'"'+(b?" "+b:"")+"></td>"},/* Generic
	------------------------------------------------------------------------------------------------------------------*/
// Generates the default HTML intro for any row. User classes should override
renderIntroHtml:function(){},
// TODO: a generic method for dealing with <tr>, RTL, intro
// when increment internalApiVersion
// wrapTr (scheduler)
/* Utils
	------------------------------------------------------------------------------------------------------------------*/
// Applies the generic "intro" and "outro" HTML to the given cells.
// Intro means the leftmost cell when the calendar is LTR and the rightmost cell when RTL. Vice-versa for outro.
bookendCells:function(a){var b=this.renderIntroHtml();b&&(this.isRTL?a.append(b):a.prepend(b))}},rb=Ta.DayGrid=pb.extend(qb,{numbersVisible:!1,// should render a row for day/week numbers? set by outside view. TODO: make internal
bottomCoordPadding:0,// hack for extending the hit area for the last row of the coordinate grid
rowEls:null,// set of fake row elements
cellEls:null,// set of whole-day elements comprising the row's background
helperEls:null,// set of cell skeleton elements for rendering the mock event "helper"
rowCoordCache:null,colCoordCache:null,
// Renders the rows and columns into the component's `this.el`, which should already be assigned.
// isRigid determins whether the individual rows should ignore the contents and be a constant height.
// Relies on the view's colCnt and rowCnt. In the future, this component should probably be self-sufficient.
renderDates:function(a){var b,c,d=this.view,e=this.rowCnt,f=this.colCnt,g="";for(b=0;e>b;b++)g+=this.renderDayRowHtml(b,a);
// trigger dayRender with each cell's element
for(this.el.html(g),this.rowEls=this.el.find(".fc-row"),this.cellEls=this.el.find(".fc-day"),this.rowCoordCache=new lb({els:this.rowEls,isVertical:!0}),this.colCoordCache=new lb({els:this.cellEls.slice(0,this.colCnt),// only the first row
isHorizontal:!0}),b=0;e>b;b++)for(c=0;f>c;c++)d.trigger("dayRender",null,this.getCellDate(b,c),this.getCellEl(b,c))},unrenderDates:function(){this.removeSegPopover()},renderBusinessHours:function(){var a=this.view.calendar.getBusinessHoursEvents(!0),b=this.eventsToSegs(a);this.renderFill("businessHours",b,"bgevent")},
// Generates the HTML for a single row, which is a div that wraps a table.
// `row` is the row number.
renderDayRowHtml:function(a,b){var c=this.view,d=["fc-row","fc-week",c.widgetContentClass];return b&&d.push("fc-rigid"),'<div class="'+d.join(" ")+'"><div class="fc-bg"><table>'+this.renderBgTrHtml(a)+'</table></div><div class="fc-content-skeleton"><table>'+(this.numbersVisible?"<thead>"+this.renderNumberTrHtml(a)+"</thead>":"")+"</table></div></div>"},/* Grid Number Rendering
	------------------------------------------------------------------------------------------------------------------*/
renderNumberTrHtml:function(a){return"<tr>"+(this.isRTL?"":this.renderNumberIntroHtml(a))+this.renderNumberCellsHtml(a)+(this.isRTL?this.renderNumberIntroHtml(a):"")+"</tr>"},renderNumberIntroHtml:function(a){return this.renderIntroHtml()},renderNumberCellsHtml:function(a){var b,c,d=[];for(b=0;b<this.colCnt;b++)c=this.getCellDate(a,b),d.push(this.renderNumberCellHtml(c));return d.join("")},
// Generates the HTML for the <td>s of the "number" row in the DayGrid's content skeleton.
// The number row will only exist if either day numbers or week numbers are turned on.
renderNumberCellHtml:function(a){var b;return this.view.dayNumbersVisible?(b=this.getDayClasses(a),b.unshift("fc-day-number"),'<td class="'+b.join(" ")+'" data-date="'+a.format()+'">'+a.date()+"</td>"):"<td/>"},/* Options
	------------------------------------------------------------------------------------------------------------------*/
// Computes a default event time formatting string if `timeFormat` is not explicitly defined
computeEventTimeFormat:function(){return this.view.opt("extraSmallTimeFormat")},
// Computes a default `displayEventEnd` value if one is not expliclty defined
computeDisplayEventEnd:function(){return 1==this.colCnt},/* Dates
	------------------------------------------------------------------------------------------------------------------*/
rangeUpdated:function(){this.updateDayTable()},
// Slices up the given span (unzoned start/end with other misc data) into an array of segments
spanToSegs:function(a){var b,c,d=this.sliceRangeByRow(a);for(b=0;b<d.length;b++)c=d[b],this.isRTL?(c.leftCol=this.daysPerRow-1-c.lastRowDayIndex,c.rightCol=this.daysPerRow-1-c.firstRowDayIndex):(c.leftCol=c.firstRowDayIndex,c.rightCol=c.lastRowDayIndex);return d},/* Hit System
	------------------------------------------------------------------------------------------------------------------*/
prepareHits:function(){this.colCoordCache.build(),this.rowCoordCache.build(),this.rowCoordCache.bottoms[this.rowCnt-1]+=this.bottomCoordPadding},releaseHits:function(){this.colCoordCache.clear(),this.rowCoordCache.clear()},queryHit:function(a,b){var c=this.colCoordCache.getHorizontalIndex(a),d=this.rowCoordCache.getVerticalIndex(b);return null!=d&&null!=c?this.getCellHit(d,c):void 0},getHitSpan:function(a){return this.getCellRange(a.row,a.col)},getHitEl:function(a){return this.getCellEl(a.row,a.col)},/* Cell System
	------------------------------------------------------------------------------------------------------------------*/
// FYI: the first column is the leftmost column, regardless of date
getCellHit:function(a,b){return{row:a,col:b,component:this,// needed unfortunately :(
left:this.colCoordCache.getLeftOffset(b),right:this.colCoordCache.getRightOffset(b),top:this.rowCoordCache.getTopOffset(a),bottom:this.rowCoordCache.getBottomOffset(a)}},getCellEl:function(a,b){return this.cellEls.eq(a*this.colCnt+b)},/* Event Drag Visualization
	------------------------------------------------------------------------------------------------------------------*/
// TODO: move to DayGrid.event, similar to what we did with Grid's drag methods
// Renders a visual indication of an event or external element being dragged.
// `eventLocation` has zoned start and end (optional)
renderDrag:function(a,b){
// if a segment from the same calendar but another component is being dragged, render a helper event
// always render a highlight underneath
// if a segment from the same calendar but another component is being dragged, render a helper event
return this.renderHighlight(this.eventToSpan(a)),b&&!b.el.closest(this.el).length?this.renderEventLocationHelper(a,b):void 0},
// Unrenders any visual indication of a hovering event
unrenderDrag:function(){this.unrenderHighlight(),this.unrenderHelper()},/* Event Resize Visualization
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of an event being resized
renderEventResize:function(a,b){return this.renderHighlight(this.eventToSpan(a)),this.renderEventLocationHelper(a,b)},
// Unrenders a visual indication of an event being resized
unrenderEventResize:function(){this.unrenderHighlight(),this.unrenderHelper()},/* Event Helper
	------------------------------------------------------------------------------------------------------------------*/
// Renders a mock "helper" event. `sourceSeg` is the associated internal segment object. It can be null.
renderHelper:function(b,c){var d,e=[],f=this.eventToSegs(b);// assigns each seg's el and returns a subset of segs that were rendered
// inject each new event skeleton into each associated row
// must return the elements rendered
return f=this.renderFgSegEls(f),d=this.renderSegRows(f),this.rowEls.each(function(b,f){var g,h=a(f),i=a('<div class="fc-helper-skeleton"><table/></div>');g=c&&c.row===b?c.el.position().top:h.find(".fc-content-skeleton tbody").position().top,i.css("top",g).find("table").append(d[b].tbodyEl),h.append(i),e.push(i[0])}),this.helperEls=a(e)},
// Unrenders any visual indication of a mock helper event
unrenderHelper:function(){this.helperEls&&(this.helperEls.remove(),this.helperEls=null)},/* Fill System (highlight, background events, business hours)
	------------------------------------------------------------------------------------------------------------------*/
fillSegTag:"td",// override the default tag name
// Renders a set of rectangles over the given segments of days.
// Only returns segments that successfully rendered.
renderFill:function(b,c,d){var e,f,g,h=[];// assignes `.el` to each seg. returns successfully rendered segs
for(c=this.renderFillSegEls(b,c),e=0;e<c.length;e++)f=c[e],g=this.renderFillRow(b,f,d),this.rowEls.eq(f.row).append(g),h.push(g[0]);return this.elsByFill[b]=a(h),c},
// Generates the HTML needed for one row of a fill. Requires the seg's el to be rendered.
renderFillRow:function(b,c,d){var e,f,g=this.colCnt,h=c.leftCol,i=c.rightCol+1;return d=d||b.toLowerCase(),e=a('<div class="fc-'+d+'-skeleton"><table><tr/></table></div>'),f=e.find("tr"),h>0&&f.append('<td colspan="'+h+'"/>'),f.append(c.el.attr("colspan",i-h)),g>i&&f.append('<td colspan="'+(g-i)+'"/>'),this.bookendCells(f),e}});/* Event-rendering methods for the DayGrid class
----------------------------------------------------------------------------------------------------------------------*/
rb.mixin({rowStructs:null,// an array of objects, each holding information about a row's foreground event-rendering
// Unrenders all events currently rendered on the grid
unrenderEvents:function(){this.removeSegPopover(),// removes the "more.." events popover
pb.prototype.unrenderEvents.apply(this,arguments)},
// Retrieves all rendered segment objects currently rendered on the grid
getEventSegs:function(){return pb.prototype.getEventSegs.call(this).concat(this.popoverSegs||[])},
// Renders the given background event segments onto the grid
renderBgSegs:function(b){
// don't render timed background events
var c=a.grep(b,function(a){return a.event.allDay});return pb.prototype.renderBgSegs.call(this,c)},
// Renders the given foreground event segments onto the grid
renderFgSegs:function(b){var c;
// render an `.el` on each seg
// returns a subset of the segs. segs that were actually rendered
// append to each row's content skeleton
return b=this.renderFgSegEls(b),c=this.rowStructs=this.renderSegRows(b),this.rowEls.each(function(b,d){a(d).find(".fc-content-skeleton > table").append(c[b].tbodyEl)}),b},
// Unrenders all currently rendered foreground event segments
unrenderFgSegs:function(){for(var a,b=this.rowStructs||[];a=b.pop();)a.tbodyEl.remove();this.rowStructs=null},
// Uses the given events array to generate <tbody> elements that should be appended to each row's content skeleton.
// Returns an array of rowStruct objects (see the bottom of `renderSegRow`).
// PRECONDITION: each segment shoud already have a rendered and assigned `.el`
renderSegRows:function(a){var b,c,d=[];// group into nested arrays
// iterate each row of segment groupings
for(b=this.groupSegRows(a),c=0;c<b.length;c++)d.push(this.renderSegRow(c,b[c]));return d},
// Builds the HTML to be used for the default element for an individual segment
fgSegHtml:function(a,b){var c,d,e=this.view,f=a.event,g=e.isEventDraggable(f),h=!b&&f.allDay&&a.isStart&&e.isEventResizableFromStart(f),i=!b&&f.allDay&&a.isEnd&&e.isEventResizableFromEnd(f),j=this.getSegClasses(a,g,h||i),k=ca(this.getSegSkinCss(a)),l="";
// Only display a timed events time if it is the starting segment
// we always want one line of height
// put a natural space in between
return j.unshift("fc-day-grid-event","fc-h-event"),a.isStart&&(c=this.getEventTimeText(f),c&&(l='<span class="fc-time">'+aa(c)+"</span>")),d='<span class="fc-title">'+(aa(f.title||"")||"&nbsp;")+"</span>",'<a class="'+j.join(" ")+'"'+(f.url?' href="'+aa(f.url)+'"':"")+(k?' style="'+k+'"':"")+'><div class="fc-content">'+(this.isRTL?d+" "+l:l+" "+d)+"</div>"+(h?'<div class="fc-resizer fc-start-resizer" />':"")+(i?'<div class="fc-resizer fc-end-resizer" />':"")+"</a>"},
// Given a row # and an array of segments all in the same row, render a <tbody> element, a skeleton that contains
// the segments. Returns object with a bunch of internal data about how the render was calculated.
// NOTE: modifies rowSegs
renderSegRow:function(b,c){
// populates empty cells from the current column (`col`) to `endCol`
function d(b){for(;b>g;)k=(r[e-1]||[])[g],k?k.attr("rowspan",parseInt(k.attr("rowspan")||1,10)+1):(k=a("<td/>"),h.append(k)),q[e][g]=k,r[e][g]=k,g++}var e,f,g,h,i,j,k,l=this.colCnt,m=this.buildSegLevels(c),n=Math.max(1,m.length),o=a("<tbody/>"),p=[],q=[],r=[];for(e=0;n>e;e++){
// levelCnt might be 1 even though there are no actual levels. protect against this.
// this single empty row is useful for styling.
if(f=m[e],g=0,h=a("<tr/>"),p.push([]),q.push([]),r.push([]),f)for(i=0;i<f.length;i++){for(// iterate through segments in level
j=f[i],d(j.leftCol),
// create a container that occupies or more columns. append the event element.
k=a('<td class="fc-event-container"/>').append(j.el),j.leftCol!=j.rightCol?k.attr("colspan",j.rightCol-j.leftCol+1):// a single-column segment
r[e][g]=k;g<=j.rightCol;)q[e][g]=k,p[e][g]=j,g++;h.append(k)}d(l),// finish off the row
this.bookendCells(h),o.append(h)}return{// a "rowStruct"
row:b,// the row number
tbodyEl:o,cellMatrix:q,segMatrix:p,segLevels:m,segs:c}},
// Stacks a flat array of segments, which are all assumed to be in the same row, into subarrays of vertical levels.
// NOTE: modifies segs
buildSegLevels:function(a){var b,c,d,e=[];for(
// Give preference to elements with certain criteria, so they have
// a chance to be closer to the top.
this.sortEventSegs(a),b=0;b<a.length;b++){
// loop through levels, starting with the topmost, until the segment doesn't collide with other segments
for(c=a[b],d=0;d<e.length&&Ga(c,e[d]);d++);
// `j` now holds the desired subrow index
c.level=d,
// create new level array if needed and append segment
(e[d]||(e[d]=[])).push(c)}
// order segments left-to-right. very important if calendar is RTL
for(d=0;d<e.length;d++)e[d].sort(Ha);return e},
// Given a flat array of segments, return an array of sub-arrays, grouped by each segment's row
groupSegRows:function(a){var b,c=[];for(b=0;b<this.rowCnt;b++)c.push([]);for(b=0;b<a.length;b++)c[a[b].row].push(a[b]);return c}}),/* Methods relate to limiting the number events for a given day on a DayGrid
----------------------------------------------------------------------------------------------------------------------*/
// NOTE: all the segs being passed around in here are foreground segs
rb.mixin({segPopover:null,// the Popover that holds events that can't fit in a cell. null when not visible
popoverSegs:null,// an array of segment objects that the segPopover holds. null when not visible
removeSegPopover:function(){this.segPopover&&this.segPopover.hide()},
// Limits the number of "levels" (vertically stacking layers of events) for each row of the grid.
// `levelLimit` can be false (don't limit), a number, or true (should be computed).
limitRows:function(a){var b,c,d=this.rowStructs||[];for(b=0;b<d.length;b++)this.unlimitRow(b),c=a?"number"==typeof a?a:this.computeRowLevelLimit(b):!1,c!==!1&&this.limitRow(b,c)},
// Computes the number of levels a row will accomodate without going outside its bounds.
// Assumes the row is "rigid" (maintains a constant height regardless of what is inside).
// `row` is the row number.
computeRowLevelLimit:function(b){function c(b,c){f=Math.max(f,a(c).outerHeight())}var d,e,f,g=this.rowEls.eq(b),h=g.height(),i=this.rowStructs[b].tbodyEl.children();
// Reveal one level <tr> at a time and stop when we find one out of bounds
for(d=0;d<i.length;d++)if(e=i.eq(d).removeClass("fc-limited"),f=0,e.find("> td > :first-child").each(c),e.position().top+f>h)return d;return!1},
// Limits the given grid row to the maximum number of levels and injects "more" links if necessary.
// `row` is the row number.
// `levelLimit` is a number for the maximum (inclusive) number of levels allowed.
limitRow:function(b,c){
// Iterates through empty level cells and places "more" links inside if need be
function d(d){// goes from current `col` to `endCol`
for(;d>w;)j=t.getCellSegs(b,w,c),j.length&&(m=f[c-1][w],s=t.renderMoreLink(b,w,j),r=a("<div/>").append(s),m.append(r),v.push(r[0])),w++}var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t=this,u=this.rowStructs[b],v=[],w=0;if(c&&c<u.segLevels.length){// hide elements and get a simple DOM-nodes array
// iterate though segments in the last allowable level
for(e=u.segLevels[c-1],f=u.cellMatrix,g=u.tbodyEl.children().slice(c).addClass("fc-limited").get(),h=0;h<e.length;h++){for(i=e[h],d(i.leftCol),// process empty cells before the segment
// determine *all* segments below `seg` that occupy the same columns
l=[],k=0;w<=i.rightCol;)j=this.getCellSegs(b,w,c),l.push(j),k+=j.length,w++;if(k){
// make a replacement <td> for each column the segment occupies. will be one for each colspan
for(m=f[c-1][i.leftCol],n=m.attr("rowspan")||1,o=[],p=0;p<l.length;p++)q=a('<td class="fc-more-cell"/>').attr("rowspan",n),j=l[p],s=this.renderMoreLink(b,i.leftCol+p,[i].concat(j)),r=a("<div/>").append(s),q.append(r),o.push(q[0]),v.push(q[0]);m.addClass("fc-limited").after(a(o)),// hide original <td> and inject replacements
g.push(m[0])}}d(this.colCnt),// finish off the level
u.moreEls=a(v),// for easy undoing later
u.limitedEls=a(g)}},
// Reveals all levels and removes all "more"-related elements for a grid's row.
// `row` is a row number.
unlimitRow:function(a){var b=this.rowStructs[a];b.moreEls&&(b.moreEls.remove(),b.moreEls=null),b.limitedEls&&(b.limitedEls.removeClass("fc-limited"),b.limitedEls=null)},
// Renders an <a> element that represents hidden event element for a cell.
// Responsible for attaching click handler as well.
renderMoreLink:function(b,c,d){var e=this,f=this.view;return a('<a class="fc-more"/>').text(this.getMoreLinkText(d.length)).on("click",function(g){var h=f.opt("eventLimitClick"),i=e.getCellDate(b,c),j=a(this),k=e.getCellEl(b,c),l=e.getCellSegs(b,c),m=e.resliceDaySegs(l,i),n=e.resliceDaySegs(d,i);"function"==typeof h&&(
// the returned value can be an atomic option
h=f.trigger("eventLimitClick",null,{date:i,dayEl:k,moreEl:j,segs:m,hiddenSegs:n},g)),"popover"===h?e.showSegPopover(b,c,j,m):"string"==typeof h&&// a view name
f.calendar.zoomTo(i,h)})},
// Reveals the popover that displays all events within a cell
showSegPopover:function(a,b,c,d){var e,f,g=this,h=this.view,i=c.parent();e=1==this.rowCnt?h.el:this.rowEls.eq(a),f={className:"fc-more-popover",content:this.renderSegPopoverContent(a,b,d),parentEl:this.el,top:e.offset().top,autoHide:!0,viewportConstrain:h.opt("popoverViewportConstrain"),hide:function(){g.segPopover.removeElement(),g.segPopover=null,g.popoverSegs=null}},this.isRTL?f.right=i.offset().left+i.outerWidth()+1:f.left=i.offset().left-1,this.segPopover=new kb(f),this.segPopover.show()},
// Builds the inner DOM contents of the segment popover
renderSegPopoverContent:function(b,c,d){var e,f=this.view,g=f.opt("theme"),h=this.getCellDate(b,c).format(f.opt("dayPopoverFormat")),i=a('<div class="fc-header '+f.widgetHeaderClass+'"><span class="fc-close '+(g?"ui-icon ui-icon-closethick":"fc-icon fc-icon-x")+'"></span><span class="fc-title">'+aa(h)+'</span><div class="fc-clear"/></div><div class="fc-body '+f.widgetContentClass+'"><div class="fc-event-container"></div></div>'),j=i.find(".fc-event-container");for(d=this.renderFgSegEls(d,!0),this.popoverSegs=d,e=0;e<d.length;e++)
// because segments in the popover are not part of a grid coordinate system, provide a hint to any
// grids that want to do drag-n-drop about which cell it came from
this.prepareHits(),d[e].hit=this.getCellHit(b,c),this.releaseHits(),j.append(d[e].el);return i},
// Given the events within an array of segment objects, reslice them to be in a single day
resliceDaySegs:function(b,c){
// build an array of the original events
var d=a.map(b,function(a){return a.event}),e=c.clone(),f=e.clone().add(1,"days"),g={start:e,end:f};
// slice the events with a custom slicing function
// force an order because eventsToSegs doesn't guarantee one
return b=this.eventsToSegs(d,function(a){var b=I(a,g);// undefind if no intersection
return b?[b]:[]}),this.sortEventSegs(b),b},
// Generates the text that should be inside a "more" link, given the number of events it represents
getMoreLinkText:function(a){var b=this.view.opt("eventLimitText");return"function"==typeof b?b(a):"+"+a+" "+b},
// Returns segments within a given cell.
// If `startLevel` is specified, returns only events including and below that level. Otherwise returns all segs.
getCellSegs:function(a,b,c){for(var d,e=this.rowStructs[a].segMatrix,f=c||0,g=[];f<e.length;)d=e[f][b],d&&g.push(d),f++;return g}});/* A component that renders one or more columns of vertical time slots
----------------------------------------------------------------------------------------------------------------------*/
// We mixin DayTable, even though there is only a single row of days
var sb=Ta.TimeGrid=pb.extend(qb,{slotDuration:null,// duration of a "slot", a distinct time segment on given day, visualized by lines
snapDuration:null,// granularity of time for dragging and selecting
snapsPerSlot:null,minTime:null,// Duration object that denotes the first visible time of any given day
maxTime:null,// Duration object that denotes the exclusive visible end time of any given day
labelFormat:null,// formatting string for times running along vertical axis
labelInterval:null,// duration of how often a label should be displayed for a slot
colEls:null,// cells elements in the day-row background
slatContainerEl:null,// div that wraps all the slat rows
slatEls:null,// elements running horizontally across all columns
nowIndicatorEls:null,colCoordCache:null,slatCoordCache:null,constructor:function(){pb.apply(this,arguments),// call the super-constructor
this.processOptions()},
// Renders the time grid into `this.el`, which should already be assigned.
// Relies on the view's colCnt. In the future, this component should probably be self-sufficient.
renderDates:function(){this.el.html(this.renderHtml()),this.colEls=this.el.find(".fc-day"),this.slatContainerEl=this.el.find(".fc-slats"),this.slatEls=this.slatContainerEl.find("tr"),this.colCoordCache=new lb({els:this.colEls,isHorizontal:!0}),this.slatCoordCache=new lb({els:this.slatEls,isVertical:!0}),this.renderContentSkeleton()},
// Renders the basic HTML skeleton for the grid
renderHtml:function(){// row=0
return'<div class="fc-bg"><table>'+this.renderBgTrHtml(0)+'</table></div><div class="fc-slats"><table>'+this.renderSlatRowHtml()+"</table></div>"},
// Generates the HTML for the horizontal "slats" that run width-wise. Has a time axis on a side. Depends on RTL.
renderSlatRowHtml:function(){
// Calculate the time for each slot
for(var a,c,d,e=this.view,f=this.isRTL,g="",h=b.duration(+this.minTime);h<this.maxTime;)a=this.start.clone().time(h),c=fa(P(h,this.labelInterval)),d='<td class="fc-axis fc-time '+e.widgetContentClass+'" '+e.axisStyleAttr()+">"+(c?"<span>"+aa(a.format(this.labelFormat))+"</span>":"")+"</td>",g+='<tr data-time="'+a.format("HH:mm:ss")+'"'+(c?"":' class="fc-minor"')+">"+(f?"":d)+'<td class="'+e.widgetContentClass+'"/>'+(f?d:"")+"</tr>",h.add(this.slotDuration);return g},/* Options
	------------------------------------------------------------------------------------------------------------------*/
// Parses various options into properties of this object
processOptions:function(){var c,d=this.view,e=d.opt("slotDuration"),f=d.opt("snapDuration");e=b.duration(e),f=f?b.duration(f):e,this.slotDuration=e,this.snapDuration=f,this.snapsPerSlot=e/f,this.minResizeDuration=f,this.minTime=b.duration(d.opt("minTime")),this.maxTime=b.duration(d.opt("maxTime")),c=d.opt("slotLabelFormat"),a.isArray(c)&&(c=c[c.length-1]),this.labelFormat=c||d.opt("axisFormat")||d.opt("smallTimeFormat"),c=d.opt("slotLabelInterval"),this.labelInterval=c?b.duration(c):this.computeLabelInterval(e)},
// Computes an automatic value for slotLabelInterval
computeLabelInterval:function(a){var c,d,e;
// find the smallest stock label interval that results in more than one slots-per-label
for(c=Jb.length-1;c>=0;c--)if(d=b.duration(Jb[c]),e=P(d,a),fa(e)&&e>1)return d;return b.duration(a)},
// Computes a default event time formatting string if `timeFormat` is not explicitly defined
computeEventTimeFormat:function(){return this.view.opt("noMeridiemTimeFormat")},
// Computes a default `displayEventEnd` value if one is not expliclty defined
computeDisplayEventEnd:function(){return!0},/* Hit System
	------------------------------------------------------------------------------------------------------------------*/
prepareHits:function(){this.colCoordCache.build(),this.slatCoordCache.build()},releaseHits:function(){this.colCoordCache.clear()},queryHit:function(a,b){var c=this.snapsPerSlot,d=this.colCoordCache,e=this.slatCoordCache,f=d.getHorizontalIndex(a),g=e.getVerticalIndex(b);if(null!=f&&null!=g){var h=e.getTopOffset(g),i=e.getHeight(g),j=(b-h)/i,k=Math.floor(j*c),l=g*c+k,m=h+k/c*i,n=h+(k+1)/c*i;return{col:f,snap:l,component:this,// needed unfortunately :(
left:d.getLeftOffset(f),right:d.getRightOffset(f),top:m,bottom:n}}},getHitSpan:function(a){var b,c=this.getCellDate(0,a.col),d=this.computeSnapTime(a.snap);return c.time(d),b=c.clone().add(this.snapDuration),{start:c,end:b}},getHitEl:function(a){return this.colEls.eq(a.col)},/* Dates
	------------------------------------------------------------------------------------------------------------------*/
rangeUpdated:function(){this.updateDayTable()},
// Given a row number of the grid, representing a "snap", returns a time (Duration) from its start-of-day
computeSnapTime:function(a){return b.duration(this.minTime+this.snapDuration*a)},
// Slices up the given span (unzoned start/end with other misc data) into an array of segments
spanToSegs:function(a){var b,c=this.sliceRangeByTimes(a);for(b=0;b<c.length;b++)this.isRTL?c[b].col=this.daysPerRow-1-c[b].dayIndex:c[b].col=c[b].dayIndex;return c},sliceRangeByTimes:function(a){var b,c,d,e,f=[];for(c=0;c<this.daysPerRow;c++)d=this.dayDates[c].clone(),e={start:d.clone().time(this.minTime),end:d.clone().time(this.maxTime)},b=I(a,e),b&&(b.dayIndex=c,f.push(b));return f},/* Coordinates
	------------------------------------------------------------------------------------------------------------------*/
updateSize:function(a){// NOT a standard Grid method
this.slatCoordCache.build(),a&&this.updateSegVerticals([].concat(this.fgSegs||[],this.bgSegs||[],this.businessSegs||[]))},getTotalSlatHeight:function(){return this.slatContainerEl.outerHeight()},
// Computes the top coordinate, relative to the bounds of the grid, of the given date.
// A `startOfDayDate` must be given for avoiding ambiguity over how to treat midnight.
computeDateTop:function(a,c){return this.computeTimeTop(b.duration(a-c.clone().stripTime()))},
// Computes the top coordinate, relative to the bounds of the grid, of the given time (a Duration).
computeTimeTop:function(a){var b,c,d=this.slatEls.length,e=(a-this.minTime)/this.slotDuration;
// compute a floating-point number for how many slats should be progressed through.
// from 0 to number of slats (inclusive)
// constrained because minTime/maxTime might be customized.
// an integer index of the furthest whole slat
// from 0 to number slats (*exclusive*, so len-1)
// how much further through the slatIndex slat (from 0.0-1.0) must be covered in addition.
// could be 1.0 if slatCoverage is covering *all* the slots
return e=Math.max(0,e),e=Math.min(d,e),b=Math.floor(e),b=Math.min(b,d-1),c=e-b,this.slatCoordCache.getTopPosition(b)+this.slatCoordCache.getHeight(b)*c},/* Event Drag Visualization
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of an event being dragged over the specified date(s).
// A returned value of `true` signals that a mock "helper" event has been rendered.
renderDrag:function(a,b){
// otherwise, just render a highlight
return b?this.renderEventLocationHelper(a,b):void this.renderHighlight(this.eventToSpan(a))},
// Unrenders any visual indication of an event being dragged
unrenderDrag:function(){this.unrenderHelper(),this.unrenderHighlight()},/* Event Resize Visualization
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of an event being resized
renderEventResize:function(a,b){return this.renderEventLocationHelper(a,b)},
// Unrenders any visual indication of an event being resized
unrenderEventResize:function(){this.unrenderHelper()},/* Event Helper
	------------------------------------------------------------------------------------------------------------------*/
// Renders a mock "helper" event. `sourceSeg` is the original segment object and might be null (an external drag)
renderHelper:function(a,b){return this.renderHelperSegs(this.eventToSegs(a),b)},
// Unrenders any mock helper event
unrenderHelper:function(){this.unrenderHelperSegs()},/* Business Hours
	------------------------------------------------------------------------------------------------------------------*/
renderBusinessHours:function(){var a=this.view.calendar.getBusinessHoursEvents(),b=this.eventsToSegs(a);this.renderBusinessSegs(b)},unrenderBusinessHours:function(){this.unrenderBusinessSegs()},/* Now Indicator
	------------------------------------------------------------------------------------------------------------------*/
getNowIndicatorUnit:function(){return"minute"},renderNowIndicator:function(b){
// seg system might be overkill, but it handles scenario where line needs to be rendered
//  more than once because of columns with the same date (resources columns for example)
var c,d=this.spanToSegs({start:b,end:b}),e=this.computeDateTop(b,b),f=[];
// render lines within the columns
for(c=0;c<d.length;c++)f.push(a('<div class="fc-now-indicator fc-now-indicator-line"></div>').css("top",e).appendTo(this.colContainerEls.eq(d[c].col))[0]);
// render an arrow over the axis
d.length>0&&// is the current time in view?
f.push(a('<div class="fc-now-indicator fc-now-indicator-arrow"></div>').css("top",e).appendTo(this.el.find(".fc-content-skeleton"))[0]),this.nowIndicatorEls=a(f)},unrenderNowIndicator:function(){this.nowIndicatorEls&&(this.nowIndicatorEls.remove(),this.nowIndicatorEls=null)},/* Selection
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of a selection. Overrides the default, which was to simply render a highlight.
renderSelection:function(a){this.view.opt("selectHelper")?// this setting signals that a mock helper event should be rendered
// normally acceps an eventLocation, span has a start/end, which is good enough
this.renderEventLocationHelper(a):this.renderHighlight(a)},
// Unrenders any visual indication of a selection
unrenderSelection:function(){this.unrenderHelper(),this.unrenderHighlight()},/* Highlight
	------------------------------------------------------------------------------------------------------------------*/
renderHighlight:function(a){this.renderHighlightSegs(this.spanToSegs(a))},unrenderHighlight:function(){this.unrenderHighlightSegs()}});/* Methods for rendering SEGMENTS, pieces of content that live on the view
 ( this file is no longer just for events )
----------------------------------------------------------------------------------------------------------------------*/
sb.mixin({colContainerEls:null,// containers for each column
// inner-containers for each column where different types of segs live
fgContainerEls:null,bgContainerEls:null,helperContainerEls:null,highlightContainerEls:null,businessContainerEls:null,
// arrays of different types of displayed segments
fgSegs:null,bgSegs:null,helperSegs:null,highlightSegs:null,businessSegs:null,
// Renders the DOM that the view's content will live in
renderContentSkeleton:function(){var b,c,d="";for(b=0;b<this.colCnt;b++)d+='<td><div class="fc-content-col"><div class="fc-event-container fc-helper-container"></div><div class="fc-event-container"></div><div class="fc-highlight-container"></div><div class="fc-bgevent-container"></div><div class="fc-business-container"></div></div></td>';c=a('<div class="fc-content-skeleton"><table><tr>'+d+"</tr></table></div>"),this.colContainerEls=c.find(".fc-content-col"),this.helperContainerEls=c.find(".fc-helper-container"),this.fgContainerEls=c.find(".fc-event-container:not(.fc-helper-container)"),this.bgContainerEls=c.find(".fc-bgevent-container"),this.highlightContainerEls=c.find(".fc-highlight-container"),this.businessContainerEls=c.find(".fc-business-container"),this.bookendCells(c.find("tr")),this.el.append(c)},/* Foreground Events
	------------------------------------------------------------------------------------------------------------------*/
renderFgSegs:function(a){return a=this.renderFgSegsIntoContainers(a,this.fgContainerEls),this.fgSegs=a,a},unrenderFgSegs:function(){this.unrenderNamedSegs("fgSegs")},/* Foreground Helper Events
	------------------------------------------------------------------------------------------------------------------*/
renderHelperSegs:function(b,c){var d,e,f,g=[];
// Try to make the segment that is in the same row as sourceSeg look the same
for(b=this.renderFgSegsIntoContainers(b,this.helperContainerEls),d=0;d<b.length;d++)e=b[d],c&&c.col===e.col&&(f=c.el,e.el.css({left:f.css("left"),right:f.css("right"),"margin-left":f.css("margin-left"),"margin-right":f.css("margin-right")})),g.push(e.el[0]);return this.helperSegs=b,a(g)},unrenderHelperSegs:function(){this.unrenderNamedSegs("helperSegs")},/* Background Events
	------------------------------------------------------------------------------------------------------------------*/
renderBgSegs:function(a){// TODO: old fill system
return a=this.renderFillSegEls("bgEvent",a),this.updateSegVerticals(a),this.attachSegsByCol(this.groupSegsByCol(a),this.bgContainerEls),this.bgSegs=a,a},unrenderBgSegs:function(){this.unrenderNamedSegs("bgSegs")},/* Highlight
	------------------------------------------------------------------------------------------------------------------*/
renderHighlightSegs:function(a){a=this.renderFillSegEls("highlight",a),this.updateSegVerticals(a),this.attachSegsByCol(this.groupSegsByCol(a),this.highlightContainerEls),this.highlightSegs=a},unrenderHighlightSegs:function(){this.unrenderNamedSegs("highlightSegs")},/* Business Hours
	------------------------------------------------------------------------------------------------------------------*/
renderBusinessSegs:function(a){a=this.renderFillSegEls("businessHours",a),this.updateSegVerticals(a),this.attachSegsByCol(this.groupSegsByCol(a),this.businessContainerEls),this.businessSegs=a},unrenderBusinessSegs:function(){this.unrenderNamedSegs("businessSegs")},/* Seg Rendering Utils
	------------------------------------------------------------------------------------------------------------------*/
// Given a flat array of segments, return an array of sub-arrays, grouped by each segment's col
groupSegsByCol:function(a){var b,c=[];for(b=0;b<this.colCnt;b++)c.push([]);for(b=0;b<a.length;b++)c[a[b].col].push(a[b]);return c},
// Given segments grouped by column, insert the segments' elements into a parallel array of container
// elements, each living within a column.
attachSegsByCol:function(a,b){var c,d,e;for(c=0;c<this.colCnt;c++)for(d=a[c],e=0;e<d.length;e++)b.eq(c).append(d[e].el)},
// Given the name of a property of `this` object, assumed to be an array of segments,
// loops through each segment and removes from DOM. Will null-out the property afterwards.
unrenderNamedSegs:function(a){var b,c=this[a];if(c){for(b=0;b<c.length;b++)c[b].el.remove();this[a]=null}},/* Foreground Event Rendering Utils
	------------------------------------------------------------------------------------------------------------------*/
// Given an array of foreground segments, render a DOM element for each, computes position,
// and attaches to the column inner-container elements.
renderFgSegsIntoContainers:function(a,b){var c,d;for(a=this.renderFgSegEls(a),c=this.groupSegsByCol(a),d=0;d<this.colCnt;d++)this.updateFgSegCoords(c[d]);return this.attachSegsByCol(c,b),a},
// Renders the HTML for a single event segment's default rendering
fgSegHtml:function(a,b){var c,d,e,f=this.view,g=a.event,h=f.isEventDraggable(g),i=!b&&a.isStart&&f.isEventResizableFromStart(g),j=!b&&a.isEnd&&f.isEventResizableFromEnd(g),k=this.getSegClasses(a,h,i||j),l=ca(this.getSegSkinCss(a));// just the start time text
// if the event appears to span more than one day...
// Don't display time text on segments that run entirely through a day.
// That would appear as midnight-midnight and would look dumb.
// Otherwise, display the time text for the *segment's* times (like 6pm-midnight or midnight-10am)
// Display the normal time text for the *event's* times
/* TODO: write CSS for this
				(isResizableFromStart ?
					'<div class="fc-resizer fc-start-resizer" />' :
					''
					) +
				*/
return k.unshift("fc-time-grid-event","fc-v-event"),f.isMultiDayEvent(g)?(a.isStart||a.isEnd)&&(c=this.getEventTimeText(a),d=this.getEventTimeText(a,"LT"),e=this.getEventTimeText(a,null,!1)):(c=this.getEventTimeText(g),d=this.getEventTimeText(g,"LT"),e=this.getEventTimeText(g,null,!1)),'<a class="'+k.join(" ")+'"'+(g.url?' href="'+aa(g.url)+'"':"")+(l?' style="'+l+'"':"")+'><div class="fc-content">'+(c?'<div class="fc-time" data-start="'+aa(e)+'" data-full="'+aa(d)+'"><span>'+aa(c)+"</span></div>":"")+(g.title?'<div class="fc-title">'+aa(g.title)+"</div>":"")+'</div><div class="fc-bg"/>'+(j?'<div class="fc-resizer fc-end-resizer" />':"")+"</a>"},/* Seg Position Utils
	------------------------------------------------------------------------------------------------------------------*/
// Refreshes the CSS top/bottom coordinates for each segment element.
// Works when called after initial render, after a window resize/zoom for example.
updateSegVerticals:function(a){this.computeSegVerticals(a),this.assignSegVerticals(a)},
// For each segment in an array, computes and assigns its top and bottom properties
computeSegVerticals:function(a){var b,c;for(b=0;b<a.length;b++)c=a[b],c.top=this.computeDateTop(c.start,c.start),c.bottom=this.computeDateTop(c.end,c.start)},
// Given segments that already have their top/bottom properties computed, applies those values to
// the segments' elements.
assignSegVerticals:function(a){var b,c;for(b=0;b<a.length;b++)c=a[b],c.el.css(this.generateSegVerticalCss(c))},
// Generates an object with CSS properties for the top/bottom coordinates of a segment element
generateSegVerticalCss:function(a){return{top:a.top,bottom:-a.bottom}},/* Foreground Event Positioning Utils
	------------------------------------------------------------------------------------------------------------------*/
// Given segments that are assumed to all live in the *same column*,
// compute their verical/horizontal coordinates and assign to their elements.
updateFgSegCoords:function(a){this.computeSegVerticals(a),// horizontals relies on this
this.computeFgSegHorizontals(a),// compute horizontal coordinates, z-index's, and reorder the array
this.assignSegVerticals(a),this.assignFgSegHorizontals(a)},
// Given an array of segments that are all in the same column, sets the backwardCoord and forwardCoord on each.
// NOTE: Also reorders the given array by date!
computeFgSegHorizontals:function(a){var b,c,d;if(this.sortEventSegs(a),b=Ia(a),Ja(b),c=b[0]){for(d=0;d<c.length;d++)Ka(c[d]);for(d=0;d<c.length;d++)this.computeFgSegForwardBack(c[d],0,0)}},
// Calculate seg.forwardCoord and seg.backwardCoord for the segment, where both values range
// from 0 to 1. If the calendar is left-to-right, the seg.backwardCoord maps to "left" and
// seg.forwardCoord maps to "right" (via percentage). Vice-versa if the calendar is right-to-left.
//
// The segment might be part of a "series", which means consecutive segments with the same pressure
// who's width is unknown until an edge has been hit. `seriesBackwardPressure` is the number of
// segments behind this one in the current series, and `seriesBackwardCoord` is the starting
// coordinate of the first segment in the series.
computeFgSegForwardBack:function(a,b,c){var d,e=a.forwardSegs;if(void 0===a.forwardCoord)// # of segments in the series
// use this segment's coordinates to computed the coordinates of the less-pressurized
// forward segments
for(// not already computed
e.length?(
// sort highest pressure first
this.sortForwardSegs(e),
// this segment's forwardCoord will be calculated from the backwardCoord of the
// highest-pressure forward segment.
this.computeFgSegForwardBack(e[0],b+1,c),a.forwardCoord=e[0].backwardCoord):
// if there are no forward segments, this segment should butt up against the edge
a.forwardCoord=1,
// calculate the backwardCoord from the forwardCoord. consider the series
a.backwardCoord=a.forwardCoord-(a.forwardCoord-c)/(// available width for series
b+1),d=0;d<e.length;d++)this.computeFgSegForwardBack(e[d],0,a.forwardCoord)},sortForwardSegs:function(a){a.sort(ga(this,"compareForwardSegs"))},
// A cmp function for determining which forward segment to rely on more when computing coordinates.
compareForwardSegs:function(a,b){
// put higher-pressure first
// put segments that are closer to initial edge first (and favor ones with no coords yet)
// do normal sorting...
return b.forwardPressure-a.forwardPressure||(a.backwardCoord||0)-(b.backwardCoord||0)||this.compareEventSegs(a,b)},
// Given foreground event segments that have already had their position coordinates computed,
// assigns position-related CSS values to their elements.
assignFgSegHorizontals:function(a){var b,c;for(b=0;b<a.length;b++)c=a[b],c.el.css(this.generateFgSegHorizontalCss(c)),c.bottom-c.top<30&&c.el.addClass("fc-short")},
// Generates an object with CSS properties/values that should be applied to an event segment element.
// Contains important positioning-related properties that should be applied to any event element, customized or not.
generateFgSegHorizontalCss:function(a){var b,c,d=this.view.opt("slotEventOverlap"),e=a.backwardCoord,f=a.forwardCoord,g=this.generateSegVerticalCss(a);// amount of space from right edge, a fraction of the total width
// double the width, but don't go beyond the maximum forward coordinate (1.0)
// convert from 0-base to 1-based
// add padding to the edge so that forward stacked events don't cover the resizer's icon
return d&&(f=Math.min(1,e+2*(f-e))),this.isRTL?(b=1-f,c=e):(b=e,c=1-f),g.zIndex=a.level+1,g.left=100*b+"%",g.right=100*c+"%",d&&a.forwardPressure&&(g[this.isRTL?"marginLeft":"marginRight"]=20),g}});/* An abstract class from which other views inherit from
----------------------------------------------------------------------------------------------------------------------*/
var tb=Ta.View=va.extend(ib,jb,{type:null,// subclass' view name (string)
name:null,// deprecated. use `type` instead
title:null,// the text that will be displayed in the header's title
calendar:null,// owner Calendar object
options:null,// hash containing all options. already merged with view-specific-options
el:null,// the view's containing element. set by Calendar
displaying:null,// a promise representing the state of rendering. null if no render requested
isSkeletonRendered:!1,isEventsRendered:!1,
// range the view is actually displaying (moments)
start:null,end:null,// exclusive
// range the view is formally responsible for (moments)
// may be different from start/end. for example, a month view might have 1st-31st, excluding padded dates
intervalStart:null,intervalEnd:null,// exclusive
intervalDuration:null,intervalUnit:null,// name of largest unit being displayed, like "month" or "week"
isRTL:!1,isSelected:!1,// boolean whether a range of time is user-selected or not
selectedEvent:null,eventOrderSpecs:null,// criteria for ordering events when they have same date/time
// classNames styled by jqui themes
widgetHeaderClass:null,widgetContentClass:null,highlightStateClass:null,
// for date utils, computed from options
nextDayThreshold:null,isHiddenDayHash:null,
// now indicator
isNowIndicatorRendered:null,initialNowDate:null,// result first getNow call
initialNowQueriedMs:null,// ms time the getNow was called
nowIndicatorTimeoutID:null,// for refresh timing of now indicator
nowIndicatorIntervalID:null,// "
constructor:function(a,c,d,e){this.calendar=a,this.type=this.name=c,// .name is deprecated
this.options=d,this.intervalDuration=e||b.duration(1,"day"),this.nextDayThreshold=b.duration(this.opt("nextDayThreshold")),this.initThemingProps(),this.initHiddenDays(),this.isRTL=this.opt("isRTL"),this.eventOrderSpecs=E(this.opt("eventOrder")),this.initialize()},
// A good place for subclasses to initialize member variables
initialize:function(){},
// Retrieves an option with the given name
opt:function(a){return this.options[a]},
// Triggers handlers that are view-related. Modifies args before passing to calendar.
trigger:function(a,b){// arguments beyond thisObj are passed along
var c=this.calendar;// arguments beyond thisObj
return c.trigger.apply(c,[a,b||this].concat(Array.prototype.slice.call(arguments,2),[this]))},/* Dates
	------------------------------------------------------------------------------------------------------------------*/
// Updates all internal dates to center around the given current unzoned date.
setDate:function(a){this.setRange(this.computeRange(a))},
// Updates all internal dates for displaying the given unzoned range.
setRange:function(b){a.extend(this,b),// assigns every property to this object's member variables
this.updateTitle()},
// Given a single current unzoned date, produce information about what range to display.
// Subclasses can override. Must return all properties.
computeRange:function(a){var b,c,d=M(this.intervalDuration),e=a.clone().startOf(d),f=e.clone().add(this.intervalDuration);// exclusively move backwards
// normalize the range's time-ambiguity
// whole-days?
// needs to have a time?
return/year|month|week|day/.test(d)?(e.stripTime(),f.stripTime()):(e.hasTime()||(e=this.calendar.time(0)),f.hasTime()||(f=this.calendar.time(0))),b=e.clone(),b=this.skipHiddenDays(b),c=f.clone(),c=this.skipHiddenDays(c,-1,!0),{intervalUnit:d,intervalStart:e,intervalEnd:f,start:b,end:c}},
// Computes the new date when the user hits the prev button, given the current date
computePrevDate:function(a){return this.massageCurrentDate(a.clone().startOf(this.intervalUnit).subtract(this.intervalDuration),-1)},
// Computes the new date when the user hits the next button, given the current date
computeNextDate:function(a){return this.massageCurrentDate(a.clone().startOf(this.intervalUnit).add(this.intervalDuration))},
// Given an arbitrarily calculated current date of the calendar, returns a date that is ensured to be completely
// visible. `direction` is optional and indicates which direction the current date was being
// incremented or decremented (1 or -1).
massageCurrentDate:function(a,b){return this.intervalDuration.as("days")<=1&&this.isHiddenDay(a)&&(a=this.skipHiddenDays(a,b),a.startOf("day")),a},/* Title and Date Formatting
	------------------------------------------------------------------------------------------------------------------*/
// Sets the view's title property to the most updated computed value
updateTitle:function(){this.title=this.computeTitle()},
// Computes what the title at the top of the calendar should be for this view
computeTitle:function(){return this.formatRange({
// in case intervalStart/End has a time, make sure timezone is correct
start:this.calendar.applyTimezone(this.intervalStart),end:this.calendar.applyTimezone(this.intervalEnd)},this.opt("titleFormat")||this.computeTitleFormat(),this.opt("titleRangeSeparator"))},
// Generates the format string that should be used to generate the title for the current date range.
// Attempts to compute the most appropriate format if not explicitly specified with `titleFormat`.
computeTitleFormat:function(){return"year"==this.intervalUnit?"YYYY":"month"==this.intervalUnit?this.opt("monthYearFormat"):this.intervalDuration.as("days")>1?"ll":"LL"},
// Utility for formatting a range. Accepts a range object, formatting string, and optional separator.
// Displays all-day ranges naturally, with an inclusive end. Takes the current isRTL into account.
// The timezones of the dates within `range` will be respected.
formatRange:function(a,b,c){var d=a.end;// all-day?
return d.hasTime()||(d=d.clone().subtract(1)),qa(a.start,d,b,c,this.opt("isRTL"))},/* Rendering
	------------------------------------------------------------------------------------------------------------------*/
// Sets the container element that the view should render inside of.
// Does other DOM-related initializations.
setElement:function(a){this.el=a,this.bindGlobalHandlers()},
// Removes the view's container element from the DOM, clearing any content beforehand.
// Undoes any other DOM-related attachments.
removeElement:function(){this.clear(),// clears all content
// clean up the skeleton
this.isSkeletonRendered&&(this.unrenderSkeleton(),this.isSkeletonRendered=!1),this.unbindGlobalHandlers(),this.el.remove()},
// Does everything necessary to display the view centered around the given unzoned date.
// Does every type of rendering EXCEPT rendering events.
// Is asychronous and returns a promise.
display:function(b){var c=this,d=null;return this.displaying&&(d=this.queryScroll()),this.calendar.freezeContentHeight(),this.clear().then(function(){// clear the content first (async)
return c.displaying=a.when(c.displayView(b)).then(function(){c.forceScroll(c.computeInitialScroll(d)),c.calendar.unfreezeContentHeight(),c.triggerRender()})})},
// Does everything necessary to clear the content of the view.
// Clears dates and events. Does not clear the skeleton.
// Is asychronous and returns a promise.
clear:function(){var b=this,c=this.displaying;return c?c.then(function(){// wait for the display to finish
return b.displaying=null,b.clearEvents(),b.clearView()}):a.when()},
// Displays the view's non-event content, such as date-related content or anything required by events.
// Renders the view's non-content skeleton if necessary.
// Can be asynchronous and return a promise.
displayView:function(a){this.isSkeletonRendered||(this.renderSkeleton(),this.isSkeletonRendered=!0),a&&this.setDate(a),this.render&&this.render(),this.renderDates(),this.updateSize(),this.renderBusinessHours(),// might need coordinates, so should go after updateSize()
this.startNowIndicator()},
// Unrenders the view content that was rendered in displayView.
// Can be asynchronous and return a promise.
clearView:function(){this.unselect(),this.stopNowIndicator(),this.triggerUnrender(),this.unrenderBusinessHours(),this.unrenderDates(),this.destroy&&this.destroy()},
// Renders the basic structure of the view before any content is rendered
renderSkeleton:function(){},
// Unrenders the basic structure of the view
unrenderSkeleton:function(){},
// Renders the view's date-related content.
// Assumes setRange has already been called and the skeleton has already been rendered.
renderDates:function(){},
// Unrenders the view's date-related content
unrenderDates:function(){},
// Signals that the view's content has been rendered
triggerRender:function(){this.trigger("viewRender",this,this,this.el)},
// Signals that the view's content is about to be unrendered
triggerUnrender:function(){this.trigger("viewDestroy",this,this,this.el)},
// Binds DOM handlers to elements that reside outside the view container, such as the document
bindGlobalHandlers:function(){this.listenTo(a(document),"mousedown",this.handleDocumentMousedown),this.listenTo(a(document),"touchstart",this.handleDocumentTouchStart),this.listenTo(a(document),"touchend",this.handleDocumentTouchEnd)},
// Unbinds DOM handlers from elements that reside outside the view container
unbindGlobalHandlers:function(){this.stopListeningTo(a(document))},
// Initializes internal variables related to theming
initThemingProps:function(){var a=this.opt("theme")?"ui":"fc";this.widgetHeaderClass=a+"-widget-header",this.widgetContentClass=a+"-widget-content",this.highlightStateClass=a+"-state-highlight"},/* Business Hours
	------------------------------------------------------------------------------------------------------------------*/
// Renders business-hours onto the view. Assumes updateSize has already been called.
renderBusinessHours:function(){},
// Unrenders previously-rendered business-hours
unrenderBusinessHours:function(){},/* Now Indicator
	------------------------------------------------------------------------------------------------------------------*/
// Immediately render the current time indicator and begins re-rendering it at an interval,
// which is defined by this.getNowIndicatorUnit().
// TODO: somehow do this for the current whole day's background too
startNowIndicator:function(){var a,c,d,e=this;// ms wait value
this.opt("nowIndicator")&&(a=this.getNowIndicatorUnit(),a&&(c=ga(this,"updateNowIndicator"),this.initialNowDate=this.calendar.getNow(),this.initialNowQueriedMs=+new Date,this.renderNowIndicator(this.initialNowDate),this.isNowIndicatorRendered=!0,d=this.initialNowDate.clone().startOf(a).add(1,a)-this.initialNowDate,this.nowIndicatorTimeoutID=setTimeout(function(){e.nowIndicatorTimeoutID=null,c(),d=+b.duration(1,a),d=Math.max(100,d),e.nowIndicatorIntervalID=setInterval(c,d)},d)))},
// rerenders the now indicator, computing the new current time from the amount of time that has passed
// since the initial getNow call.
updateNowIndicator:function(){this.isNowIndicatorRendered&&(this.unrenderNowIndicator(),this.renderNowIndicator(this.initialNowDate.clone().add(new Date-this.initialNowQueriedMs)))},
// Immediately unrenders the view's current time indicator and stops any re-rendering timers.
// Won't cause side effects if indicator isn't rendered.
stopNowIndicator:function(){this.isNowIndicatorRendered&&(this.nowIndicatorTimeoutID&&(clearTimeout(this.nowIndicatorTimeoutID),this.nowIndicatorTimeoutID=null),this.nowIndicatorIntervalID&&(clearTimeout(this.nowIndicatorIntervalID),this.nowIndicatorIntervalID=null),this.unrenderNowIndicator(),this.isNowIndicatorRendered=!1)},
// Returns a string unit, like 'second' or 'minute' that defined how often the current time indicator
// should be refreshed. If something falsy is returned, no time indicator is rendered at all.
getNowIndicatorUnit:function(){},
// Renders a current time indicator at the given datetime
renderNowIndicator:function(a){},
// Undoes the rendering actions from renderNowIndicator
unrenderNowIndicator:function(){},/* Dimensions
	------------------------------------------------------------------------------------------------------------------*/
// Refreshes anything dependant upon sizing of the container element of the grid
updateSize:function(a){var b;a&&(b=this.queryScroll()),this.updateHeight(a),this.updateWidth(a),this.updateNowIndicator(),a&&this.setScroll(b)},
// Refreshes the horizontal dimensions of the calendar
updateWidth:function(a){},
// Refreshes the vertical dimensions of the calendar
updateHeight:function(a){var b=this.calendar;// we poll the calendar for height information
this.setHeight(b.getSuggestedViewHeight(),b.isHeightAuto())},
// Updates the vertical dimensions of the calendar to the specified height.
// if `isAuto` is set to true, height becomes merely a suggestion and the view should use its "natural" height.
setHeight:function(a,b){},/* Scroller
	------------------------------------------------------------------------------------------------------------------*/
// Computes the initial pre-configured scroll state prior to allowing the user to change it.
// Given the scroll state from the previous rendering. If first time rendering, given null.
computeInitialScroll:function(a){return 0},
// Retrieves the view's current natural scroll state. Can return an arbitrary format.
queryScroll:function(){},
// Sets the view's scroll state. Will accept the same format computeInitialScroll and queryScroll produce.
setScroll:function(a){},
// Sets the scroll state, making sure to overcome any predefined scroll value the browser has in mind
forceScroll:function(a){var b=this;this.setScroll(a),setTimeout(function(){b.setScroll(a)},0)},/* Event Elements / Segments
	------------------------------------------------------------------------------------------------------------------*/
// Does everything necessary to display the given events onto the current view
displayEvents:function(a){var b=this.queryScroll();this.clearEvents(),this.renderEvents(a),this.isEventsRendered=!0,this.setScroll(b),this.triggerEventRender()},
// Does everything necessary to clear the view's currently-rendered events
clearEvents:function(){var a;this.isEventsRendered&&(a=this.queryScroll(),this.triggerEventUnrender(),this.destroyEvents&&this.destroyEvents(),this.unrenderEvents(),this.setScroll(a),this.isEventsRendered=!1)},
// Renders the events onto the view.
renderEvents:function(a){},
// Removes event elements from the view.
unrenderEvents:function(){},
// Signals that all events have been rendered
triggerEventRender:function(){this.renderedEventSegEach(function(a){this.trigger("eventAfterRender",a.event,a.event,a.el)}),this.trigger("eventAfterAllRender")},
// Signals that all event elements are about to be removed
triggerEventUnrender:function(){this.renderedEventSegEach(function(a){this.trigger("eventDestroy",a.event,a.event,a.el)})},
// Given an event and the default element used for rendering, returns the element that should actually be used.
// Basically runs events and elements through the eventRender hook.
resolveEventEl:function(b,c){var d=this.trigger("eventRender",b,b,c);// means don't render at all
return d===!1?c=null:d&&d!==!0&&(c=a(d)),c},
// Hides all rendered event segments linked to the given event
showEvent:function(a){this.renderedEventSegEach(function(a){a.el.css("visibility","")},a)},
// Shows all rendered event segments linked to the given event
hideEvent:function(a){this.renderedEventSegEach(function(a){a.el.css("visibility","hidden")},a)},
// Iterates through event segments that have been rendered (have an el). Goes through all by default.
// If the optional `event` argument is specified, only iterates through segments linked to that event.
// The `this` value of the callback function will be the view.
renderedEventSegEach:function(a,b){var c,d=this.getEventSegs();for(c=0;c<d.length;c++)b&&d[c].event._id!==b._id||d[c].el&&a.call(this,d[c])},
// Retrieves all the rendered segment objects for the view
getEventSegs:function(){
// subclasses must implement
return[]},/* Event Drag-n-Drop
	------------------------------------------------------------------------------------------------------------------*/
// Computes if the given event is allowed to be dragged by the user
isEventDraggable:function(a){var b=a.source||{};return _(a.startEditable,b.startEditable,this.opt("eventStartEditable"),a.editable,b.editable,this.opt("editable"))},
// Must be called when an event in the view is dropped onto new location.
// `dropLocation` is an object that contains the new zoned start/end/allDay values for the event.
reportEventDrop:function(a,b,c,d,e){var f=this.calendar,g=f.mutateEvent(a,b,c),h=function(){g.undo(),f.reportEventChange()};this.triggerEventDrop(a,g.dateDelta,h,d,e),f.reportEventChange()},
// Triggers event-drop handlers that have subscribed via the API
triggerEventDrop:function(a,b,c,d,e){this.trigger("eventDrop",d[0],a,b,c,e,{})},/* External Element Drag-n-Drop
	------------------------------------------------------------------------------------------------------------------*/
// Must be called when an external element, via jQuery UI, has been dropped onto the calendar.
// `meta` is the parsed data that has been embedded into the dragging event.
// `dropLocation` is an object that contains the new zoned start/end/allDay values for the event.
reportExternalDrop:function(b,c,d,e,f){var g,h,i=b.eventProps;
// Try to build an event object and render it. TODO: decouple the two
i&&(g=a.extend({},i,c),h=this.calendar.renderEvent(g,b.stick)[0]),this.triggerExternalDrop(h,c,d,e,f)},
// Triggers external-drop handlers that have subscribed via the API
triggerExternalDrop:function(a,b,c,d,e){
// trigger 'drop' regardless of whether element represents an event
this.trigger("drop",c[0],b.start,d,e),a&&this.trigger("eventReceive",null,a)},/* Drag-n-Drop Rendering (for both events and external elements)
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of a event or external-element drag over the given drop zone.
// If an external-element, seg will be `null`.
// Must return elements used for any mock events.
renderDrag:function(a,b){},
// Unrenders a visual indication of an event or external-element being dragged.
unrenderDrag:function(){},/* Event Resizing
	------------------------------------------------------------------------------------------------------------------*/
// Computes if the given event is allowed to be resized from its starting edge
isEventResizableFromStart:function(a){return this.opt("eventResizableFromStart")&&this.isEventResizable(a)},
// Computes if the given event is allowed to be resized from its ending edge
isEventResizableFromEnd:function(a){return this.isEventResizable(a)},
// Computes if the given event is allowed to be resized by the user at all
isEventResizable:function(a){var b=a.source||{};return _(a.durationEditable,b.durationEditable,this.opt("eventDurationEditable"),a.editable,b.editable,this.opt("editable"))},
// Must be called when an event in the view has been resized to a new length
reportEventResize:function(a,b,c,d,e){var f=this.calendar,g=f.mutateEvent(a,b,c),h=function(){g.undo(),f.reportEventChange()};this.triggerEventResize(a,g.durationDelta,h,d,e),f.reportEventChange()},
// Triggers event-resize handlers that have subscribed via the API
triggerEventResize:function(a,b,c,d,e){this.trigger("eventResize",d[0],a,b,c,e,{})},/* Selection (time range)
	------------------------------------------------------------------------------------------------------------------*/
// Selects a date span on the view. `start` and `end` are both Moments.
// `ev` is the native mouse event that begin the interaction.
select:function(a,b){this.unselect(b),this.renderSelection(a),this.reportSelection(a,b)},
// Renders a visual indication of the selection
renderSelection:function(a){},
// Called when a new selection is made. Updates internal state and triggers handlers.
reportSelection:function(a,b){this.isSelected=!0,this.triggerSelect(a,b)},
// Triggers handlers to 'select'
triggerSelect:function(a,b){this.trigger("select",null,this.calendar.applyTimezone(a.start),// convert to calendar's tz for external API
this.calendar.applyTimezone(a.end),// "
b)},
// Undoes a selection. updates in the internal state and triggers handlers.
// `ev` is the native mouse event that began the interaction.
unselect:function(a){this.isSelected&&(this.isSelected=!1,this.destroySelection&&this.destroySelection(),this.unrenderSelection(),this.trigger("unselect",null,a))},
// Unrenders a visual indication of selection
unrenderSelection:function(){},/* Event Selection
	------------------------------------------------------------------------------------------------------------------*/
selectEvent:function(a){this.selectedEvent&&this.selectedEvent===a||(this.unselectEvent(),this.renderedEventSegEach(function(a){a.el.addClass("fc-selected")},a),this.selectedEvent=a)},unselectEvent:function(){this.selectedEvent&&(this.renderedEventSegEach(function(a){a.el.removeClass("fc-selected")},this.selectedEvent),this.selectedEvent=null)},isEventSelected:function(a){
// event references might change on refetchEvents(), while selectedEvent doesn't,
// so compare IDs
return this.selectedEvent&&this.selectedEvent._id===a._id},/* Mouse / Touch Unselecting (time range & event unselection)
	------------------------------------------------------------------------------------------------------------------*/
// TODO: move consistently to down/start or up/end?
handleDocumentMousedown:function(a){
// touch devices fire simulated mouse events on a "click".
// only process mousedown if we know this isn't a touch device.
!this.calendar.isTouch&&u(a)&&(this.processRangeUnselect(a),this.processEventUnselect(a))},handleDocumentTouchStart:function(a){this.processRangeUnselect(a)},handleDocumentTouchEnd:function(a){
// TODO: don't do this if because of touch-scrolling
this.processEventUnselect(a)},processRangeUnselect:function(b){var c;
// is there a time-range selection?
this.isSelected&&this.opt("unselectAuto")&&(c=this.opt("unselectCancel"),c&&a(b.target).closest(c).length||this.unselect(b))},processEventUnselect:function(b){this.selectedEvent&&(a(b.target).closest(".fc-selected").length||this.unselectEvent())},/* Day Click
	------------------------------------------------------------------------------------------------------------------*/
// Triggers handlers to 'dayClick'
// Span has start/end of the clicked area. Only the start is useful.
triggerDayClick:function(a,b,c){this.trigger("dayClick",b,this.calendar.applyTimezone(a.start),// convert to calendar's timezone for external API
c)},/* Date Utils
	------------------------------------------------------------------------------------------------------------------*/
// Initializes internal variables related to calculating hidden days-of-week
initHiddenDays:function(){var b,c=this.opt("hiddenDays")||[],d=[],e=0;for(this.opt("weekends")===!1&&c.push(0,6),b=0;7>b;b++)(d[b]=-1!==a.inArray(b,c))||e++;if(!e)throw"invalid hiddenDays";this.isHiddenDayHash=d},
// Is the current day hidden?
// `day` is a day-of-week index (0-6), or a Moment
isHiddenDay:function(a){return b.isMoment(a)&&(a=a.day()),this.isHiddenDayHash[a]},
// Incrementing the current day until it is no longer a hidden day, returning a copy.
// If the initial value of `date` is not a hidden day, don't do anything.
// Pass `isExclusive` as `true` if you are dealing with an end date.
// `inc` defaults to `1` (increment one day forward each time)
skipHiddenDays:function(a,b,c){var d=a.clone();for(b=b||1;this.isHiddenDayHash[(d.day()+(c?b:0)+7)%7];)d.add(b,"days");return d},
// Returns the date range of the full days the given range visually appears to occupy.
// Returns a new range object.
computeDayRange:function(a){var b,c=a.start.clone().stripTime(),d=a.end,e=null;// the beginning of the day the range exclusively ends
// # of milliseconds into `endDay`
// If the end time is actually inclusively part of the next day and is equal to or
// beyond the next day threshold, adjust the end to be the exclusive end of `endDay`.
// Otherwise, leaving it as inclusive will cause it to exclude `endDay`.
// If no end was specified, or if it is within `startDay` but not past nextDayThreshold,
// assign the default duration of one day.
return d&&(e=d.clone().stripTime(),b=+d.time(),b&&b>=this.nextDayThreshold&&e.add(1,"days")),(!d||c>=e)&&(e=c.clone().add(1,"days")),{start:c,end:e}},
// Does the given event visually appear to occupy more than one day?
isMultiDayEvent:function(a){var b=this.computeDayRange(a);// event is range-ish
return b.end.diff(b.start,"days")>1}}),ub=Ta.Scroller=va.extend({el:null,// the guaranteed outer element
scrollEl:null,// the element with the scrollbars
overflowX:null,overflowY:null,constructor:function(a){a=a||{},this.overflowX=a.overflowX||a.overflow||"auto",this.overflowY=a.overflowY||a.overflow||"auto"},render:function(){this.el=this.renderEl(),this.applyOverflow()},renderEl:function(){return this.scrollEl=a('<div class="fc-scroller"></div>')},
// sets to natural height, unlocks overflow
clear:function(){this.setHeight("auto"),this.applyOverflow()},destroy:function(){this.el.remove()},
// Overflow
// -----------------------------------------------------------------------------------------------------------------
applyOverflow:function(){this.scrollEl.css({"overflow-x":this.overflowX,"overflow-y":this.overflowY})},
// Causes any 'auto' overflow values to resolves to 'scroll' or 'hidden'.
// Useful for preserving scrollbar widths regardless of future resizes.
// Can pass in scrollbarWidths for optimization.
lockOverflow:function(a){var b=this.overflowX,c=this.overflowY;a=a||this.getScrollbarWidths(),"auto"===b&&(b=a.top||a.bottom||this.scrollEl[0].scrollWidth-1>this.scrollEl[0].clientWidth?"scroll":"hidden"),"auto"===c&&(c=a.left||a.right||this.scrollEl[0].scrollHeight-1>this.scrollEl[0].clientHeight?"scroll":"hidden"),this.scrollEl.css({"overflow-x":b,"overflow-y":c})},
// Getters / Setters
// -----------------------------------------------------------------------------------------------------------------
setHeight:function(a){this.scrollEl.height(a)},getScrollTop:function(){return this.scrollEl.scrollTop()},setScrollTop:function(a){this.scrollEl.scrollTop(a)},getClientWidth:function(){return this.scrollEl[0].clientWidth},getClientHeight:function(){return this.scrollEl[0].clientHeight},getScrollbarWidths:function(){return q(this.scrollEl)}}),vb=Ta.Calendar=va.extend({dirDefaults:null,// option defaults related to LTR or RTL
langDefaults:null,// option defaults related to current locale
overrides:null,// option overrides given to the fullCalendar constructor
options:null,// all defaults combined with overrides
viewSpecCache:null,// cache of view definitions
view:null,// current View object
header:null,loadingLevel:0,// number of simultaneous loading tasks
isTouch:!1,
// a lot of this class' OOP logic is scoped within this constructor function,
// but in the future, write individual methods on the prototype.
constructor:Na,
// Subclasses can override this for initialization logic after the constructor has been called
initialize:function(){},
// Initializes `this.options` and other important options-related objects
initOptions:function(a){var b,e,f,g;a=d(a),b=a.lang,e=wb[b],e||(b=vb.defaults.lang,e=wb[b]||{}),f=_(a.isRTL,e.isRTL,vb.defaults.isRTL),g=f?vb.rtlDefaults:{},this.dirDefaults=g,this.langDefaults=e,this.overrides=a,this.options=c([vb.defaults,g,e,a]),Oa(this.options),this.isTouch=null!=this.options.isTouch?this.options.isTouch:Ta.isTouch,this.viewSpecCache={}},
// Gets information about how to create a view. Will use a cache.
getViewSpec:function(a){var b=this.viewSpecCache;return b[a]||(b[a]=this.buildViewSpec(a))},
// Given a duration singular unit, like "week" or "day", finds a matching view spec.
// Preference is given to views that have corresponding buttons.
getUnitViewSpec:function(b){var c,d,e;if(-1!=a.inArray(b,Ya))for(c=this.header.getViewsWithButtons(),a.each(Ta.views,function(a){c.push(a)}),d=0;d<c.length;d++)if(e=this.getViewSpec(c[d]),e&&e.singleUnit==b)return e},
// Builds an object with information on how to create a given view
buildViewSpec:function(a){
// iterate from the specific view definition to a more general one until we hit an actual View class
for(var d,e,f,g,h=this.overrides.views||{},i=[],j=[],k=[],l=a;l;)d=Ua[l],e=h[l],l=null,"function"==typeof d&&(d={"class":d}),d&&(i.unshift(d),j.unshift(d.defaults||{}),f=f||d.duration,l=l||d.type),e&&(k.unshift(e),f=f||e.duration,l=l||e.type);// valid?
// view is a single-unit duration, like "week" or "day"
// incorporate options for this. lowest priority
return d=U(i),d.type=a,d["class"]?(f&&(f=b.duration(f),f.valueOf()&&(d.duration=f,g=M(f),1===f.as(g)&&(d.singleUnit=g,k.unshift(h[g]||{})))),d.defaults=c(j),d.overrides=c(k),this.buildViewSpecOptions(d),this.buildViewSpecButtonText(d,a),d):!1},
// Builds and assigns a view spec's options object from its already-assigned defaults and overrides
buildViewSpecOptions:function(a){a.options=c([// lowest to highest priority
vb.defaults,// global defaults
a.defaults,// view's defaults (from ViewSubclass.defaults)
this.dirDefaults,this.langDefaults,// locale and dir take precedence over view's defaults!
this.overrides,// calendar's overrides (options given to constructor)
a.overrides]),Oa(a.options)},
// Computes and assigns a view spec's buttonText-related options
buildViewSpecButtonText:function(a,b){
// given an options object with a possible `buttonText` hash, lookup the buttonText for the
// requested view, falling back to a generic unit entry like "week" or "day"
function c(c){var d=c.buttonText||{};return d[b]||(a.singleUnit?d[a.singleUnit]:null)}
// highest to lowest priority
a.buttonTextOverride=c(this.overrides)||// constructor-specified buttonText lookup hash takes precedence
a.overrides.buttonText,// `buttonText` for view-specific options is a string
// highest to lowest priority. mirrors buildViewSpecOptions
a.buttonTextDefault=c(this.langDefaults)||c(this.dirDefaults)||a.defaults.buttonText||// a single string. from ViewSubclass.defaults
c(vb.defaults)||(a.duration?this.humanizeDuration(a.duration):null)||// like "3 days"
b},
// Given a view name for a custom view or a standard view, creates a ready-to-go View object
instantiateView:function(a){var b=this.getViewSpec(a);return new b["class"](this,a,b.options,b.duration)},
// Returns a boolean about whether the view is okay to instantiate at some point
isValidViewType:function(a){return Boolean(this.getViewSpec(a))},
// Should be called when any type of async data fetching begins
pushLoading:function(){this.loadingLevel++||this.trigger("loading",null,!0,this.view)},
// Should be called when any type of async data fetching completes
popLoading:function(){--this.loadingLevel||this.trigger("loading",null,!1,this.view)},
// Given arguments to the select method in the API, returns a span (unzoned start/end and other info)
buildSelectSpan:function(a,b){var c,d=this.moment(a).stripZone();return c=b?this.moment(b).stripZone():d.hasTime()?d.clone().add(this.defaultTimedEventDuration):d.clone().add(this.defaultAllDayEventDuration),{start:d,end:c}}});vb.mixin(ib),vb.defaults={titleRangeSeparator:" — ",// emphasized dash
monthYearFormat:"MMMM YYYY",// required for en. other languages rely on datepicker computable option
defaultTimedEventDuration:"02:00:00",defaultAllDayEventDuration:{days:1},forceEventDuration:!1,nextDayThreshold:"09:00:00",// 9am
// display
defaultView:"month",aspectRatio:1.35,header:{left:"title",center:"",right:"today prev,next"},weekends:!0,weekNumbers:!1,weekNumberTitle:"W",weekNumberCalculation:"local",
//editable: false,
//nowIndicator: false,
scrollTime:"06:00:00",
// event ajax
lazyFetching:!0,startParam:"start",endParam:"end",timezoneParam:"timezone",timezone:!1,
//allDayDefault: undefined,
// locale
isRTL:!1,buttonText:{prev:"prev",next:"next",prevYear:"prev year",nextYear:"next year",year:"year",// TODO: locale files need to specify this
today:"today",month:"month",week:"week",day:"day"},buttonIcons:{prev:"left-single-arrow",next:"right-single-arrow",prevYear:"left-double-arrow",nextYear:"right-double-arrow"},
// jquery-ui theming
theme:!1,themeButtonIcons:{prev:"circle-triangle-w",next:"circle-triangle-e",prevYear:"seek-prev",nextYear:"seek-next"},
//eventResizableFromStart: false,
dragOpacity:.75,dragRevertDuration:500,dragScroll:!0,
//selectable: false,
unselectAuto:!0,dropAccept:"*",eventOrder:"title",eventLimit:!1,eventLimitText:"more",eventLimitClick:"popover",dayPopoverFormat:"LL",handleWindowResize:!0,windowResizeDelay:200,// milliseconds before an updateSize happens
longPressDelay:1e3},vb.englishDefaults={// used by lang.js
dayPopoverFormat:"dddd, MMMM D"},vb.rtlDefaults={// right-to-left defaults
header:{// TODO: smarter solution (first/center/last ?)
left:"next,prev today",center:"",right:"title"},buttonIcons:{prev:"right-single-arrow",next:"left-single-arrow",prevYear:"right-double-arrow",nextYear:"left-double-arrow"},themeButtonIcons:{prev:"circle-triangle-e",next:"circle-triangle-w",nextYear:"seek-prev",prevYear:"seek-next"}};var wb=Ta.langs={};// initialize and expose
// TODO: document the structure and ordering of a FullCalendar lang file
// TODO: rename everything "lang" to "locale", like what the moment project did
// Initialize jQuery UI datepicker translations while using some of the translations
// Will set this as the default language for datepicker.
Ta.datepickerLang=function(b,c,d){
// get the FullCalendar internal option hash for this language. create if necessary
var e=wb[b]||(wb[b]={});
// transfer some simple options from datepicker to fc
e.isRTL=d.isRTL,e.weekNumberTitle=d.weekHeader,
// compute some more complex options from datepicker
a.each(xb,function(a,b){e[a]=b(d)}),
// is jQuery UI Datepicker is on the page?
a.datepicker&&(
// Register the language data.
// FullCalendar and MomentJS use language codes like "pt-br" but Datepicker
// does it like "pt-BR" or if it doesn't have the language, maybe just "pt".
// Make an alias so the language can be referenced either way.
a.datepicker.regional[c]=a.datepicker.regional[b]=// alias
d,
// Alias 'en' to the default language data. Do this every time.
a.datepicker.regional.en=a.datepicker.regional[""],
// Set as Datepicker's global defaults.
a.datepicker.setDefaults(d))},
// Sets FullCalendar-specific translations. Will set the language as the global default.
Ta.lang=function(b,d){var e,f;e=wb[b]||(wb[b]={}),d&&(e=wb[b]=c([e,d])),f=Pa(b),a.each(yb,function(a,b){null==e[a]&&(e[a]=b(f,e))}),vb.defaults.lang=b};
// NOTE: can't guarantee any of these computations will run because not every language has datepicker
// configs, so make sure there are English fallbacks for these in the defaults file.
var xb={buttonText:function(a){return{
// the translations sometimes wrongly contain HTML entities
prev:ba(a.prevText),next:ba(a.nextText),today:ba(a.currentText)}},
// Produces format strings like "MMMM YYYY" -> "September 2014"
monthYearFormat:function(a){return a.showMonthAfterYear?"YYYY["+a.yearSuffix+"] MMMM":"MMMM YYYY["+a.yearSuffix+"]"}},yb={
// Produces format strings like "ddd M/D" -> "Fri 9/15"
dayOfMonthFormat:function(a,b){var c=a.longDateFormat("l");// for the format like "M/D/YYYY"
// strip the year off the edge, as well as other misc non-whitespace chars
return c=c.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g,""),b.isRTL?c+=" ddd":c="ddd "+c,c},
// Produces format strings like "h:mma" -> "6:00pm"
mediumTimeFormat:function(a){// can't be called `timeFormat` because collides with option
return a.longDateFormat("LT").replace(/\s*a$/i,"a")},
// Produces format strings like "h(:mm)a" -> "6pm" / "6:30pm"
smallTimeFormat:function(a){return a.longDateFormat("LT").replace(":mm","(:mm)").replace(/(\Wmm)$/,"($1)").replace(/\s*a$/i,"a")},
// Produces format strings like "h(:mm)t" -> "6p" / "6:30p"
extraSmallTimeFormat:function(a){return a.longDateFormat("LT").replace(":mm","(:mm)").replace(/(\Wmm)$/,"($1)").replace(/\s*a$/i,"t")},
// Produces format strings like "ha" / "H" -> "6pm" / "18"
hourFormat:function(a){return a.longDateFormat("LT").replace(":mm","").replace(/(\Wmm)$/,"").replace(/\s*a$/i,"a")},
// Produces format strings like "h:mm" -> "6:30" (with no AM/PM)
noMeridiemTimeFormat:function(a){return a.longDateFormat("LT").replace(/\s*a$/i,"")}},zb={
// Produces format strings for results like "Mo 16"
smallDayDateFormat:function(a){return a.isRTL?"D dd":"dd D"},
// Produces format strings for results like "Wk 5"
weekFormat:function(a){return a.isRTL?"w[ "+a.weekNumberTitle+"]":"["+a.weekNumberTitle+" ]w"},
// Produces format strings for results like "Wk5"
smallWeekFormat:function(a){return a.isRTL?"w["+a.weekNumberTitle+"]":"["+a.weekNumberTitle+"]w"}};
// Initialize English by forcing computation of moment-derived options.
// Also, sets it as the default.
Ta.lang("en",vb.englishDefaults),Ta.sourceNormalizers=[],Ta.sourceFetchers=[];var Ab={dataType:"json",cache:!1},Bb=1;
// Returns a list of events that the given event should be compared against when being considered for a move to
// the specified span. Attached to the Calendar's prototype because EventManager is a mixin for a Calendar.
vb.prototype.getPeerEvents=function(a,b){var c,d,e=this.getEventCache(),f=[];for(c=0;c<e.length;c++)d=e[c],b&&b._id===d._id||f.push(d);return f};/* An abstract class for the "basic" views, as well as month view. Renders one or more rows of day cells.
----------------------------------------------------------------------------------------------------------------------*/
// It is a manager for a DayGrid subcomponent, which does most of the heavy lifting.
// It is responsible for managing width/height.
var Cb=Ta.BasicView=tb.extend({scroller:null,dayGridClass:rb,// class the dayGrid will be instantiated from (overridable by subclasses)
dayGrid:null,// the main subcomponent that does most of the heavy lifting
dayNumbersVisible:!1,// display day numbers on each day cell?
weekNumbersVisible:!1,// display week numbers along the side?
weekNumberWidth:null,// width of all the week-number cells running down the side
headContainerEl:null,// div that hold's the dayGrid's rendered date header
headRowEl:null,// the fake row element of the day-of-week header
initialize:function(){this.dayGrid=this.instantiateDayGrid(),this.scroller=new ub({overflowX:"hidden",overflowY:"auto"})},
// Generates the DayGrid object this view needs. Draws from this.dayGridClass
instantiateDayGrid:function(){
// generate a subclass on the fly with BasicView-specific behavior
// TODO: cache this subclass
var a=this.dayGridClass.extend(Db);return new a(this)},
// Sets the display range and computes all necessary dates
setRange:function(a){tb.prototype.setRange.call(this,a),// call the super-method
this.dayGrid.breakOnWeeks=/year|month|week/.test(this.intervalUnit),// do before setRange
this.dayGrid.setRange(a)},
// Compute the value to feed into setRange. Overrides superclass.
computeRange:function(a){var b=tb.prototype.computeRange.call(this,a);// get value from the super-method
// year and month views should be aligned with weeks. this is already done for week
// make end-of-week if not already
return/year|month/.test(b.intervalUnit)&&(b.start.startOf("week"),b.start=this.skipHiddenDays(b.start),b.end.weekday()&&(b.end.add(1,"week").startOf("week"),b.end=this.skipHiddenDays(b.end,-1,!0))),b},
// Renders the view into `this.el`, which should already be assigned
renderDates:function(){this.dayNumbersVisible=this.dayGrid.rowCnt>1,// TODO: make grid responsible
this.weekNumbersVisible=this.opt("weekNumbers"),this.dayGrid.numbersVisible=this.dayNumbersVisible||this.weekNumbersVisible,this.el.addClass("fc-basic-view").html(this.renderSkeletonHtml()),this.renderHead(),this.scroller.render();var b=this.scroller.el.addClass("fc-day-grid-container"),c=a('<div class="fc-day-grid" />').appendTo(b);this.el.find(".fc-body > tr > td").append(b),this.dayGrid.setElement(c),this.dayGrid.renderDates(this.hasRigidRows())},
// render the day-of-week headers
renderHead:function(){this.headContainerEl=this.el.find(".fc-head-container").html(this.dayGrid.renderHeadHtml()),this.headRowEl=this.headContainerEl.find(".fc-row")},
// Unrenders the content of the view. Since we haven't separated skeleton rendering from date rendering,
// always completely kill the dayGrid's rendering.
unrenderDates:function(){this.dayGrid.unrenderDates(),this.dayGrid.removeElement(),this.scroller.destroy()},renderBusinessHours:function(){this.dayGrid.renderBusinessHours()},
// Builds the HTML skeleton for the view.
// The day-grid component will render inside of a container defined by this HTML.
renderSkeletonHtml:function(){return'<table><thead class="fc-head"><tr><td class="fc-head-container '+this.widgetHeaderClass+'"></td></tr></thead><tbody class="fc-body"><tr><td class="'+this.widgetContentClass+'"></td></tr></tbody></table>'},
// Generates an HTML attribute string for setting the width of the week number column, if it is known
weekNumberStyleAttr:function(){return null!==this.weekNumberWidth?'style="width:'+this.weekNumberWidth+'px"':""},
// Determines whether each row should have a constant height
hasRigidRows:function(){var a=this.opt("eventLimit");return a&&"number"!=typeof a},/* Dimensions
	------------------------------------------------------------------------------------------------------------------*/
// Refreshes the horizontal dimensions of the view
updateWidth:function(){this.weekNumbersVisible&&(
// Make sure all week number cells running down the side have the same width.
// Record the width for cells created later.
this.weekNumberWidth=k(this.el.find(".fc-week-number")))},
// Adjusts the vertical dimensions of the view to the specified values
setHeight:function(a,b){var c,d,g=this.opt("eventLimit");
// reset all heights to be natural
this.scroller.clear(),f(this.headRowEl),this.dayGrid.removeSegPopover(),// kill the "more" popover if displayed
// is the event limit a constant level number?
g&&"number"==typeof g&&this.dayGrid.limitRows(g),c=this.computeScrollerHeight(a),this.setGridHeight(c,b),g&&"number"!=typeof g&&this.dayGrid.limitRows(g),b||(this.scroller.setHeight(c),d=this.scroller.getScrollbarWidths(),(d.left||d.right)&&(e(this.headRowEl,d),c=this.computeScrollerHeight(a),this.scroller.setHeight(c)),this.scroller.lockOverflow(d))},
// given a desired total height of the view, returns what the height of the scroller should be
computeScrollerHeight:function(a){return a-l(this.el,this.scroller.el)},
// Sets the height of just the DayGrid component in this view
setGridHeight:function(a,b){b?j(this.dayGrid.rowEls):i(this.dayGrid.rowEls,a,!0)},/* Scroll
	------------------------------------------------------------------------------------------------------------------*/
queryScroll:function(){return this.scroller.getScrollTop()},setScroll:function(a){this.scroller.setScrollTop(a)},/* Hit Areas
	------------------------------------------------------------------------------------------------------------------*/
// forward all hit-related method calls to dayGrid
prepareHits:function(){this.dayGrid.prepareHits()},releaseHits:function(){this.dayGrid.releaseHits()},queryHit:function(a,b){return this.dayGrid.queryHit(a,b)},getHitSpan:function(a){return this.dayGrid.getHitSpan(a)},getHitEl:function(a){return this.dayGrid.getHitEl(a)},/* Events
	------------------------------------------------------------------------------------------------------------------*/
// Renders the given events onto the view and populates the segments array
renderEvents:function(a){this.dayGrid.renderEvents(a),this.updateHeight()},
// Retrieves all segment objects that are rendered in the view
getEventSegs:function(){return this.dayGrid.getEventSegs()},
// Unrenders all event elements and clears internal segment data
unrenderEvents:function(){this.dayGrid.unrenderEvents()},/* Dragging (for both events and external elements)
	------------------------------------------------------------------------------------------------------------------*/
// A returned value of `true` signals that a mock "helper" event has been rendered.
renderDrag:function(a,b){return this.dayGrid.renderDrag(a,b)},unrenderDrag:function(){this.dayGrid.unrenderDrag()},/* Selection
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of a selection
renderSelection:function(a){this.dayGrid.renderSelection(a)},
// Unrenders a visual indications of a selection
unrenderSelection:function(){this.dayGrid.unrenderSelection()}}),Db={
// Generates the HTML that will go before the day-of week header cells
renderHeadIntroHtml:function(){var a=this.view;// needed for matchCellWidths
return a.weekNumbersVisible?'<th class="fc-week-number '+a.widgetHeaderClass+'" '+a.weekNumberStyleAttr()+"><span>"+aa(a.opt("weekNumberTitle"))+"</span></th>":""},
// Generates the HTML that will go before content-skeleton cells that display the day/week numbers
renderNumberIntroHtml:function(a){var b=this.view;// needed for matchCellWidths
return b.weekNumbersVisible?'<td class="fc-week-number" '+b.weekNumberStyleAttr()+"><span>"+this.getCellDate(a,0).format("w")+"</span></td>":""},
// Generates the HTML that goes before the day bg cells for each day-row
renderBgIntroHtml:function(){var a=this.view;return a.weekNumbersVisible?'<td class="fc-week-number '+a.widgetContentClass+'" '+a.weekNumberStyleAttr()+"></td>":""},
// Generates the HTML that goes before every other type of row generated by DayGrid.
// Affects helper-skeleton and highlight-skeleton rows.
renderIntroHtml:function(){var a=this.view;return a.weekNumbersVisible?'<td class="fc-week-number" '+a.weekNumberStyleAttr()+"></td>":""}},Eb=Ta.MonthView=Cb.extend({
// Produces information about what range to display
computeRange:function(a){var b,c=Cb.prototype.computeRange.call(this,a);
// ensure 6 weeks
// could be partial weeks due to hiddenDays
return this.isFixedWeeks()&&(b=Math.ceil(c.end.diff(c.start,"weeks",!0)),c.end.add(6-b,"weeks")),c},
// Overrides the default BasicView behavior to have special multi-week auto-height logic
setGridHeight:function(a,b){b=b||"variable"===this.opt("weekMode"),b&&(a*=this.rowCnt/6),i(this.dayGrid.rowEls,a,!b)},isFixedWeeks:function(){var a=this.opt("weekMode");// LEGACY: weekMode is deprecated
// LEGACY: weekMode is deprecated
return a?"fixed"===a:this.opt("fixedWeekCount")}});Ua.basic={"class":Cb},Ua.basicDay={type:"basic",duration:{days:1}},Ua.basicWeek={type:"basic",duration:{weeks:1}},Ua.month={"class":Eb,duration:{months:1},// important for prev/next
defaults:{fixedWeekCount:!0}};/* An abstract class for all agenda-related views. Displays one more columns with time slots running vertically.
----------------------------------------------------------------------------------------------------------------------*/
// Is a manager for the TimeGrid subcomponent and possibly the DayGrid subcomponent (if allDaySlot is on).
// Responsible for managing width/height.
var Fb=Ta.AgendaView=tb.extend({scroller:null,timeGridClass:sb,// class used to instantiate the timeGrid. subclasses can override
timeGrid:null,// the main time-grid subcomponent of this view
dayGridClass:rb,// class used to instantiate the dayGrid. subclasses can override
dayGrid:null,// the "all-day" subcomponent. if all-day is turned off, this will be null
axisWidth:null,// the width of the time axis running down the side
headContainerEl:null,// div that hold's the timeGrid's rendered date header
noScrollRowEls:null,// set of fake row elements that must compensate when scroller has scrollbars
// when the time-grid isn't tall enough to occupy the given height, we render an <hr> underneath
bottomRuleEl:null,initialize:function(){this.timeGrid=this.instantiateTimeGrid(),this.opt("allDaySlot")&&(// should we display the "all-day" area?
this.dayGrid=this.instantiateDayGrid()),this.scroller=new ub({overflowX:"hidden",overflowY:"auto"})},
// Instantiates the TimeGrid object this view needs. Draws from this.timeGridClass
instantiateTimeGrid:function(){var a=this.timeGridClass.extend(Gb);return new a(this)},
// Instantiates the DayGrid object this view might need. Draws from this.dayGridClass
instantiateDayGrid:function(){var a=this.dayGridClass.extend(Hb);return new a(this)},/* Rendering
	------------------------------------------------------------------------------------------------------------------*/
// Sets the display range and computes all necessary dates
setRange:function(a){tb.prototype.setRange.call(this,a),// call the super-method
this.timeGrid.setRange(a),this.dayGrid&&this.dayGrid.setRange(a)},
// Renders the view into `this.el`, which has already been assigned
renderDates:function(){this.el.addClass("fc-agenda-view").html(this.renderSkeletonHtml()),this.renderHead(),this.scroller.render();var b=this.scroller.el.addClass("fc-time-grid-container"),c=a('<div class="fc-time-grid" />').appendTo(b);this.el.find(".fc-body > tr > td").append(b),this.timeGrid.setElement(c),this.timeGrid.renderDates(),
// the <hr> that sometimes displays under the time-grid
this.bottomRuleEl=a('<hr class="fc-divider '+this.widgetHeaderClass+'"/>').appendTo(this.timeGrid.el),// inject it into the time-grid
this.dayGrid&&(this.dayGrid.setElement(this.el.find(".fc-day-grid")),this.dayGrid.renderDates(),
// have the day-grid extend it's coordinate area over the <hr> dividing the two grids
this.dayGrid.bottomCoordPadding=this.dayGrid.el.next("hr").outerHeight()),this.noScrollRowEls=this.el.find(".fc-row:not(.fc-scroller *)")},
// render the day-of-week headers
renderHead:function(){this.headContainerEl=this.el.find(".fc-head-container").html(this.timeGrid.renderHeadHtml())},
// Unrenders the content of the view. Since we haven't separated skeleton rendering from date rendering,
// always completely kill each grid's rendering.
unrenderDates:function(){this.timeGrid.unrenderDates(),this.timeGrid.removeElement(),this.dayGrid&&(this.dayGrid.unrenderDates(),this.dayGrid.removeElement()),this.scroller.destroy()},
// Builds the HTML skeleton for the view.
// The day-grid and time-grid components will render inside containers defined by this HTML.
renderSkeletonHtml:function(){return'<table><thead class="fc-head"><tr><td class="fc-head-container '+this.widgetHeaderClass+'"></td></tr></thead><tbody class="fc-body"><tr><td class="'+this.widgetContentClass+'">'+(this.dayGrid?'<div class="fc-day-grid"/><hr class="fc-divider '+this.widgetHeaderClass+'"/>':"")+"</td></tr></tbody></table>"},
// Generates an HTML attribute string for setting the width of the axis, if it is known
axisStyleAttr:function(){return null!==this.axisWidth?'style="width:'+this.axisWidth+'px"':""},/* Business Hours
	------------------------------------------------------------------------------------------------------------------*/
renderBusinessHours:function(){this.timeGrid.renderBusinessHours(),this.dayGrid&&this.dayGrid.renderBusinessHours()},unrenderBusinessHours:function(){this.timeGrid.unrenderBusinessHours(),this.dayGrid&&this.dayGrid.unrenderBusinessHours()},/* Now Indicator
	------------------------------------------------------------------------------------------------------------------*/
getNowIndicatorUnit:function(){return this.timeGrid.getNowIndicatorUnit()},renderNowIndicator:function(a){this.timeGrid.renderNowIndicator(a)},unrenderNowIndicator:function(){this.timeGrid.unrenderNowIndicator()},/* Dimensions
	------------------------------------------------------------------------------------------------------------------*/
updateSize:function(a){this.timeGrid.updateSize(a),tb.prototype.updateSize.call(this,a)},
// Refreshes the horizontal dimensions of the view
updateWidth:function(){
// make all axis cells line up, and record the width so newly created axis cells will have it
this.axisWidth=k(this.el.find(".fc-axis"))},
// Adjusts the vertical dimensions of the view to the specified values
setHeight:function(a,b){var c,d,g;
// reset all dimensions back to the original state
this.bottomRuleEl.hide(),// .show() will be called later if this <hr> is necessary
this.scroller.clear(),// sets height to 'auto' and clears overflow
f(this.noScrollRowEls),
// limit number of events in the all-day area
this.dayGrid&&(this.dayGrid.removeSegPopover(),c=this.opt("eventLimit"),c&&"number"!=typeof c&&(c=Ib),c&&this.dayGrid.limitRows(c)),b||(d=this.computeScrollerHeight(a),this.scroller.setHeight(d),g=this.scroller.getScrollbarWidths(),(g.left||g.right)&&(e(this.noScrollRowEls,g),d=this.computeScrollerHeight(a),this.scroller.setHeight(d)),this.scroller.lockOverflow(g),this.timeGrid.getTotalSlatHeight()<d&&this.bottomRuleEl.show())},
// given a desired total height of the view, returns what the height of the scroller should be
computeScrollerHeight:function(a){return a-l(this.el,this.scroller.el)},/* Scroll
	------------------------------------------------------------------------------------------------------------------*/
// Computes the initial pre-configured scroll state prior to allowing the user to change it
computeInitialScroll:function(){var a=b.duration(this.opt("scrollTime")),c=this.timeGrid.computeTimeTop(a);
// zoom can give weird floating-point values. rather scroll a little bit further
return c=Math.ceil(c),c&&c++,c},queryScroll:function(){return this.scroller.getScrollTop()},setScroll:function(a){this.scroller.setScrollTop(a)},/* Hit Areas
	------------------------------------------------------------------------------------------------------------------*/
// forward all hit-related method calls to the grids (dayGrid might not be defined)
prepareHits:function(){this.timeGrid.prepareHits(),this.dayGrid&&this.dayGrid.prepareHits()},releaseHits:function(){this.timeGrid.releaseHits(),this.dayGrid&&this.dayGrid.releaseHits()},queryHit:function(a,b){var c=this.timeGrid.queryHit(a,b);return!c&&this.dayGrid&&(c=this.dayGrid.queryHit(a,b)),c},getHitSpan:function(a){
// TODO: hit.component is set as a hack to identify where the hit came from
return a.component.getHitSpan(a)},getHitEl:function(a){
// TODO: hit.component is set as a hack to identify where the hit came from
return a.component.getHitEl(a)},/* Events
	------------------------------------------------------------------------------------------------------------------*/
// Renders events onto the view and populates the View's segment array
renderEvents:function(a){var b,c,d=[],e=[],f=[];
// separate the events into all-day and timed
for(c=0;c<a.length;c++)a[c].allDay?d.push(a[c]):e.push(a[c]);b=this.timeGrid.renderEvents(e),this.dayGrid&&(f=this.dayGrid.renderEvents(d)),this.updateHeight()},
// Retrieves all segment objects that are rendered in the view
getEventSegs:function(){return this.timeGrid.getEventSegs().concat(this.dayGrid?this.dayGrid.getEventSegs():[])},
// Unrenders all event elements and clears internal segment data
unrenderEvents:function(){
// unrender the events in the subcomponents
this.timeGrid.unrenderEvents(),this.dayGrid&&this.dayGrid.unrenderEvents()},/* Dragging (for events and external elements)
	------------------------------------------------------------------------------------------------------------------*/
// A returned value of `true` signals that a mock "helper" event has been rendered.
renderDrag:function(a,b){return a.start.hasTime()?this.timeGrid.renderDrag(a,b):this.dayGrid?this.dayGrid.renderDrag(a,b):void 0},unrenderDrag:function(){this.timeGrid.unrenderDrag(),this.dayGrid&&this.dayGrid.unrenderDrag()},/* Selection
	------------------------------------------------------------------------------------------------------------------*/
// Renders a visual indication of a selection
renderSelection:function(a){a.start.hasTime()||a.end.hasTime()?this.timeGrid.renderSelection(a):this.dayGrid&&this.dayGrid.renderSelection(a)},
// Unrenders a visual indications of a selection
unrenderSelection:function(){this.timeGrid.unrenderSelection(),this.dayGrid&&this.dayGrid.unrenderSelection()}}),Gb={
// Generates the HTML that will go before the day-of week header cells
renderHeadIntroHtml:function(){var a,b=this.view;// needed for matchCellWidths
return b.opt("weekNumbers")?(a=this.start.format(b.opt("smallWeekFormat")),'<th class="fc-axis fc-week-number '+b.widgetHeaderClass+'" '+b.axisStyleAttr()+"><span>"+aa(a)+"</span></th>"):'<th class="fc-axis '+b.widgetHeaderClass+'" '+b.axisStyleAttr()+"></th>"},
// Generates the HTML that goes before the bg of the TimeGrid slot area. Long vertical column.
renderBgIntroHtml:function(){var a=this.view;return'<td class="fc-axis '+a.widgetContentClass+'" '+a.axisStyleAttr()+"></td>"},
// Generates the HTML that goes before all other types of cells.
// Affects content-skeleton, helper-skeleton, highlight-skeleton for both the time-grid and day-grid.
renderIntroHtml:function(){var a=this.view;return'<td class="fc-axis" '+a.axisStyleAttr()+"></td>"}},Hb={
// Generates the HTML that goes before the all-day cells
renderBgIntroHtml:function(){var a=this.view;// needed for matchCellWidths
return'<td class="fc-axis '+a.widgetContentClass+'" '+a.axisStyleAttr()+"><span>"+(a.opt("allDayHtml")||aa(a.opt("allDayText")))+"</span></td>"},
// Generates the HTML that goes before all other types of cells.
// Affects content-skeleton, helper-skeleton, highlight-skeleton for both the time-grid and day-grid.
renderIntroHtml:function(){var a=this.view;return'<td class="fc-axis" '+a.axisStyleAttr()+"></td>"}},Ib=5,Jb=[{hours:1},{minutes:30},{minutes:15},{seconds:30},{seconds:15}];return Ua.agenda={"class":Fb,defaults:{allDaySlot:!0,allDayText:"all-day",slotDuration:"00:30:00",minTime:"00:00:00",maxTime:"24:00:00",slotEventOverlap:!0}},Ua.agendaDay={type:"agenda",duration:{days:1}},Ua.agendaWeek={type:"agenda",duration:{weeks:1}},Ta});