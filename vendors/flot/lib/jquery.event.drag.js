// Source: https://github.com/devongovett/jquery.event.drag/blob/451d90e1a737f49f613d0966082ce67582b0afd1/drag/jquery.event.drag.js
//
//	Warning! Make sure the hijack() is patch to work with any jquery version:
//
//   ($.event.dispatch || $.event.handle).call( elem, event );
//

/*!
jquery.event.drag.js ~ v1.6 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt
*/
;(function($){ // secure $ jQuery alias
/*******************************************************************************************/
// Created: 2008-06-04 | Updated: 2009-04-21
/*******************************************************************************************/
// Events: drag, dragstart, dragend
/*******************************************************************************************/

// jquery method
$.fn.drag = function( fn1, fn2, fn3 ){
	if ( fn2 ) this.bind('dragstart', fn1 ); // 2+ args
	if ( fn3 ) this.bind('dragend', fn3 ); // 3 args
	return !fn1 ? this.trigger('drag') // 0 args
		: this.bind('drag', fn2 ? fn2 : fn1 ); // 1+ args
	};

// local refs
var $event = $.event, $special = $event.special,

// special event configuration
drag = $special.drag = {
	not: ':input', // don't begin to drag on event.targets that match this selector
	distance: 0, // distance dragged before dragstart
	which: 1, // mouse button pressed to start drag sequence
	drop: false, // false to suppress drop events
	dragging: false, // hold the active target element
	setup: function( data ){
		data = $.extend({
			distance: drag.distance,
			which: drag.which,
			not: drag.not,
			drop: drag.drop
			}, data || {});
		data.distance = squared( data.distance ); //  x² + y² = distance²
		$event.add( this, "mousedown", handler, data );
		if ( this.attachEvent ) this.attachEvent("ondragstart", dontStart ); // prevent image dragging in IE...
		},
	teardown: function(){
		$event.remove( this, "mousedown", handler );
		if ( this === drag.dragging ) drag.dragging = drag.proxy = false; // deactivate element
		selectable( this, true ); // enable text selection
		if ( this.detachEvent ) this.detachEvent("ondragstart", dontStart ); // prevent image dragging in IE...
		}
	};

// prevent normal event binding...
$special.dragstart = $special.dragend = { setup:function(){}, teardown:function(){} };

// handle drag-releatd DOM events
function handler ( event ){
	var elem = this, returned, data = event.data || {};
	// mousemove or mouseup
	if ( data.elem ){
		// update event properties...
		elem = event.dragTarget = data.elem; // drag source element
		event.dragProxy = drag.proxy || elem; // proxy element or source
		event.cursorOffsetX = data.pageX - data.left; // mousedown offset
		event.cursorOffsetY = data.pageY - data.top; // mousedown offset
		event.offsetX = event.pageX - event.cursorOffsetX; // element offset
		event.offsetY = event.pageY - event.cursorOffsetY; // element offset
		}
	// mousedown, check some initial props to avoid the switch statement
	else if ( drag.dragging || ( data.which>0 && event.which!=data.which ) ||
		$( event.target ).is( data.not ) ) return;
	// handle various events
	switch ( event.type ){
		// mousedown, left click, event.target is not restricted, init dragging
		case 'mousedown':
			$.extend( data, $( elem ).offset(), {
				elem: elem, target: event.target,
				pageX: event.pageX, pageY: event.pageY
				}); // store some initial attributes
			$event.add( document, "mousemove mouseup", handler, data );
			selectable( elem, false ); // disable text selection
			drag.dragging = null; // pending state
			break; // prevents text selection in safari
		// mousemove, check distance, start dragging
		case !drag.dragging && 'mousemove':
			if ( squared( event.pageX-data.pageX )
				+ squared( event.pageY-data.pageY ) //  x² + y² = distance²
				< data.distance ) break; // distance tolerance not reached
			event.target = data.target; // force target from "mousedown" event (fix distance issue)
			returned = hijack( event, "dragstart", elem ); // trigger "dragstart", return proxy element
			if ( returned !== false ){ // "dragstart" not rejected
				drag.dragging = elem; // activate element
				drag.proxy = event.dragProxy = $( returned || elem )[0]; // set proxy
				}
		// mousemove, dragging
		case 'mousemove':
			if ( drag.dragging ){
				returned = hijack( event, "drag", elem ); // trigger "drag"
				if ( data.drop && $special.drop ){ // manage drop events
					$special.drop.allowed = ( returned !== false ); // prevent drop
					$special.drop.handler( event ); // "dropstart", "dropend"
					}
				if ( returned !== false ) break; // "drag" not rejected, stop
				event.type = "mouseup"; // helps "drop" handler behave
				}
		// mouseup, stop dragging
		case 'mouseup':
			$event.remove( document, "mousemove mouseup", handler ); // remove page events
			if ( drag.dragging ){
				if ( data.drop && $special.drop ) $special.drop.handler( event ); // "drop"
				hijack( event, "dragend", elem ); // trigger "dragend"
				}
			selectable( elem, true ); // enable text selection
			drag.dragging = drag.proxy = data.elem = false; // deactivate element
			break;
		}
	};

// set event type to custom value, and handle it
function hijack ( event, type, elem ){
	event.type = type; // force the event type
	var result = ($.event.dispatch || $.event.handle).call( elem, event );
	return result===false ? false : result || event.result;
	};

// return the value squared
function squared ( value ){ return Math.pow( value, 2 ); };

// suppress default dragstart IE events...
function dontStart(){ return ( drag.dragging === false ); };

// toggles text selection attributes
function selectable ( elem, bool ){
	if ( !elem ) return; // maybe element was removed ?
	elem = elem.ownerDocument ? elem.ownerDocument : elem;
	elem.unselectable = bool ? "off" : "on"; // IE
	if ( elem.style ) elem.style.MozUserSelect = bool ? "" : "none"; // FF
	$.event[ bool ? "remove" : "add" ]( elem, "selectstart mousedown", dontStart ); // IE/Opera
	};

/*******************************************************************************************/
})( jQuery ); // confine scope
