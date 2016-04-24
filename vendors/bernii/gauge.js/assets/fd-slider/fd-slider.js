/*
 * Unobtrusive Slider Control / HTML5 Input Range polyfill
 * http://www.frequency-decoder.com/
 *
 * Copyright 2010, 2011, Brian McAllister
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
var fdSlider = (function() {
        var sliders           = {},     
            uniqueid          = 0,
            mouseWheelEnabled = true,            
            fullARIA          = true,
            describedBy       = "fd-slider-describedby",
            varSetRules       = {
                onfocus:true,
                onvalue:true
            }, 
            noRangeBar        = false,           
            html5Animation    = "jump",               
            isOpera           = Object.prototype.toString.call(window.opera) === "[object Opera]",
            fpRegExp          = /^([-]{0,1}[0-9]+(\.[0-9]+){0,1})$/,
            stepRegExp        = /^([0-9]+(\.[0-9]+){0,1})$/;
            
        var parseJSON = function(str) {
                // Check we have a String
                if(typeof str !== 'string' || str == "") { return {}; };                 
                try {
                        // Does a JSON (native or not) Object exist                              
                        if(typeof JSON === "object" && JSON.parse) {                                              
                                return window.JSON.parse(str);  
                        // Genious code taken from: http://kentbrewster.com/badges/                                                      
                        } else if(/mousewheelenabled|fullaria|describedby|norangebar|html5animation|varsetrules/.test(str.toLowerCase())) {                                               
                                var f = Function(['var document,top,self,window,parent,Number,Date,Object,Function,',
                                        'Array,String,Math,RegExp,Image,ActiveXObject;',
                                        'return (' , str.replace(/<\!--.+-->/gim,'').replace(/\bfunction\b/g,'function-') , ');'].join(''));
                                return f();                          
                        };
                } catch (e) { };                              
                
                return {"err":"Could not parse the JSON object"};                                            
        };
        
        var affectJSON = function(json) {
                if(typeof json !== "object") { return; };
                for(key in json) {
                        value = json[key];                                                                
                        switch(key.toLowerCase()) { 
                                case "mousewheelenabled":
                                        mouseWheelEnabled = !!value;
                                        break;                                                               
                                case "fullaria":
                                        fullARIA = !!value;
                                        break;
                                case "describedby":
                                        describedBy = String(value);
                                        break; 
                                case "norangebar":
                                        noRangeBar = !!value;
                                        break;                                    
                                case "html5animation":
                                        html5Animation = String(value).search(/^(jump|tween|timed)$/i) != -1 ? String(value).toLowerCase() : "jump";
                                        break;                                
                                case "varsetrules":
                                        if("onfocus" in value) {
                                                varSetRules.onfocus = !!value.onfocus;
                                        };
                                        if("onvalue" in value) {
                                                varSetRules.onvalue = !!value.onvalue;
                                        };
                                        break;                                                                                                                                                                                                 
                        };          
                };        
        };
              
        // Classic event functions                 
        var addEvent = function(obj, type, fn) {                
                if( obj.attachEvent ) {
                        obj["e"+type+fn] = fn;
                        obj[type+fn] = function(){obj["e"+type+fn]( window.event );};
                        obj.attachEvent( "on"+type, obj[type+fn] );
                } else { obj.addEventListener( type, fn, true ); }
        };
        var removeEvent = function(obj, type, fn) {
                try {
                        if( obj.detachEvent ) {
                                obj.detachEvent( "on"+type, obj[type+fn] );
                                obj[type+fn] = null;                        
                        } else { obj.removeEventListener( type, fn, true ); }
                } catch(err) {};
        };
        var stopEvent = function(e) {
                e = e || window.event;
                if(e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                };
                
                /*@cc_on@*/
                /*@if(@_win32)
                e.cancelBubble = true;
                e.returnValue = false;
                /*@end@*/
                
                return false;
        };        
        var preventDefault = function(e) {
                e = e || window.event;
                if(e.preventDefault) {
                        e.preventDefault();
                        return;
                };
                e.returnValue = false;
        };
        
        // Add/Remove classname utility functions
        var addClass = function(e,c) {
                if(new RegExp("(^|\\s)" + c + "(\\s|$)").test(e.className)) { return; };
                e.className += ( e.className ? " " : "" ) + c;
        };
        
        var removeClass = function(e,c) {
                e.className = !c ? "" : e.className.replace(new RegExp("(^|\\s)" + c + "(\\s|$)"), " ").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        };
       
        // Returns an Object of key value pairs indicating which sliders have values
        // that have been "set" by the user
        var getValueSet = function() {
                var obj = {};
                for(id in sliders) {
                        obj[id] = sliders[id].getValueSet();
                };
                return obj;
        };
        
        // Sets the valueSet variable for a specific slider
        var setValueSet = function(sliderId, tf) {                 
                if(!(sliderId in sliders)) return;
                sliders[sliderId].setValueSet(!!tf);             
        };
                                                             
        // Javascript instantiation of a slider (input type="text" or select list)       
        var createSlider = function(options) {
                if(!options || !options.inp || !options.inp.tagName || options.inp.tagName.search(/^input|select/i) == -1) { return false; };                
                
                options.html5Shim = false;                
                
                if(options.inp.tagName.toLowerCase() == "select") {  
                        if(options.inp.options.length < 2) {
                                return false;
                        };
                        options.min             = 0;                                                                                      
                        options.max             = options.inp.options.length - 1;                                                              
                        options.step            = 1;    
                        options.precision       = 0;   
                        options.scale           = false;
                        options.forceValue      = true;                                                                     
                } else {  
                        if(String(options.inp.type).search(/^text$/i) == -1) {
                                return false;
                        };                      
                        options.min        = options.min && String(options.min).search(fpRegExp) != -1 ? +options.min : 0;
                        options.max        = options.max && String(options.max).search(fpRegExp) != -1 ? +options.max : 100;                        
                        options.step       = options.step && String(options.step).search(stepRegExp) != -1 ? options.step : 1;
                        options.precision  = options.precision && String(options.precision).search(/^[0-9]+$/) != -1 ? options.precision : (String(options.step).search(/\.([0-9]+)$/) != -1 ? String(options.step).match(/\.([0-9]+)$/)[1].length : 0);                              
                        options.scale      = options.scale || false;
                        options.forceValue = ("forceValue" in options) ? !!options.forceValue : false;
                };
                
                options.maxStep    = options.maxStep && String(options.maxStep).search(stepRegExp) != -1 ? +options.maxStep : +options.step * 2;
                options.classNames = options.classNames || "";
                options.callbacks  = options.callbacks || false;
                
                destroySingleSlider(options.inp.id);
                sliders[options.inp.id] = new fdRange(options);
                return true;
        };  
        
        var getAttribute = function(elem, att) {
                return elem.getAttribute(att) || "";
        };
        
        // HTML5 input type="range" shim - called onload or onDomReady
        var init = function() {
                var inputs = document.getElementsByTagName("input"),
                    options;    
                    
                for(var i = 0, inp; inp = inputs[i]; i++) {                         
                                             
                        if(inp.tagName.toLowerCase() == "input" 
                           && 
                           inp.type.toLowerCase() == "text" 
                           && 
                           (getAttribute(inp, "min") && getAttribute(inp, "min").search(fpRegExp) != -1 
                            || 
                            getAttribute(inp, "max") && getAttribute(inp, "max").search(fpRegExp) != -1
                            || 
                            getAttribute(inp, "step") && getAttribute(inp, "step").search(/^(any|([0-9]+(\.[0-9]+){0,1}))$/i) != -1
                           )) {
                           
                                // Skip elements that have already been created are are resident in the DOM
                                if(inp.id && document.getElementById("fd-slider-"+inp.id)) { 
                                        continue;                                                                
                                // Destroy elements that have already been created but not resident in the DOM
                                } else if(inp.id && !document.getElementById("fd-slider-"+inp.id)) {
                                        destroySingleSlider(inp.id);
                                };
                                
                                // Create an id for the form element if necessary
                                if(!inp.id) { inp.id = "fd-slider-form-elem-" + uniqueid++; };                      
                                                                
                                // Basic option Object        
                                options = {
                                        inp:            inp,                                                               
                                        callbacks:      [],                                         
                                        animation:      html5Animation,                                        
                                        vertical:       getAttribute(inp, "data-fd-slider-vertical") ? true : !!(inp.offsetHeight > inp.offsetWidth),
                                        classNames:     getAttribute(inp, "data-fd-slider-vertical"),
                                        html5Shim:      true
                                };
                                
                                if(options.vertical && !getAttribute(inp, "data-fd-slider-vertical")) {
                                        options.inpHeight = inp.offsetHeight;
                                };
                                                                                                                      
                                options.min             = getAttribute(inp, "min") || 0;
                                options.max             = getAttribute(inp, "max") || 100;
                                options.step            = getAttribute(inp, "step").search(/^any$/i) != -1 ? options.max - options.min : getAttribute(inp, "step").search(stepRegExp) != -1 ? inp.getAttribute("step") : 1;
                                options.precision       = String(options.step).search(/\.([0-9]+)$/) != -1 ? String(options.step).match(/\.([0-9]+)$/)[1].length : 0;        
                                options.maxStep         = options.step * 2; 
                                                                                       
                                destroySingleSlider(options.inp.id);
                                sliders[options.inp.id] = new fdRange(options);
                        };                       
                };
                
                return true;
        };             
        var destroySingleSlider = function(id) {
                if(id in sliders) { 
                        sliders[id].destroy(); 
                        delete sliders[id]; 
                        return true;
                };
                return false;
        };
        var destroyAllsliders = function(e) {
                for(slider in sliders) { sliders[slider].destroy(); };
                sliders = [];                        
        };
        var unload = function(e) {
                destroyAllsliders();
                sliders = null;                         
        };                  
        var resize = function(e) {
                for(slider in sliders) { sliders[slider].onResize(); };        
        };             
        var onDomReady = function() {
                removeEvent(window, "load",   init);
                init();
        };    
        var removeOnLoadEvent = function() {                      
                removeEvent(window, "load",   init);                 
        };  
                           
        function fdRange(options) {
                var inp         = options.inp,
                    disabled    = false,
                    tagName     = inp.tagName.toLowerCase(),                      
                    min         = +options.min,
                    max         = +options.max,
                    rMin        = +options.min,
                    rMax        = +options.max, 
                    range       = Math.abs(max - min),
                    step        = tagName == "select" ? 1 : +options.step,
                    maxStep     = options.maxStep ? +options.maxStep : step * 2,
                    precision   = options.precision || 0,
                    steps       = Math.ceil(range / step),
                    scale       = options.scale || false,                
                    hideInput   = !!options.hideInput,                                                 
                    animation   = options.animation || "",                                        
                    vertical    = !!options.vertical,
                    callbacks   = options.callbacks || {},
                    classNames  = options.classNames || "",                    
                    html5Shim   = !!options.html5Shim,                  
                    defaultVal  = max < min ? min : min + ((max - min) / 2), 
                    forceValue  = html5Shim || !!options.forceValue,
                    inpHeight   = html5Shim && vertical && ("inpHeight" in options) ? options.inpHeight : false,                   
                    timer       = null,
                    kbEnabled   = true,                                    
                    sliderH     = 0,
                    sliderW     = 0, 
                    tweenX      = 0,
                    tweenB      = 0,
                    tweenC      = 0,
                    tweenD      = 0,
                    frame       = 0,
                    x           = 0,                    
                    y           = 0,                                       
                    rMaxPx      = 0,
                    rMinPx      = 0,
                    handlePos   = 0,                    
                    destPos     = 0,                    
                    mousePos    = 0,
                    stepPx      = 0,
                    userSet     = false,
                    touchEvents = false,
                    outerWrapper,
                    wrapper,
                    handle,
                    rangeBar,
                    bar;                                 
                 
                // Make sure we have a negative step if the max < min  
                if(max < min) {                           
                        step    = -Math.abs(step);
                        maxStep = -Math.abs(maxStep);
                };
                
                // Add the 100% scale mark if needs be
                if(scale) {
                        scale[100] = max;
                };
                
                // Set the "userSet" variable programmatically for this slider
                function valueSet(tf) {
                        tf = !!tf;
                        if(tf != userSet) {
                                userSet = tf;
                                valueToPixels(getWorkingValueFromInput());
                        };
                };
                
                function disableSlider(noCallback) {                         
                        if(disabled && !noCallback) { return; };
                        
                        try {   
                                
                                removeEvent(handle, "focus",     onFocus);
                                removeEvent(handle, "blur",      onBlur);  
                                                      
                                if(!isOpera) {
                                        removeEvent(handle, "keydown",   onKeyDown);  
                                        removeEvent(handle, "keypress",  onKeyPress); 
                                } else {
                                        removeEvent(handle, "keypress",  onKeyDown);
                                };                                            
                                
                                removeEvent(outerWrapper, "mouseover",  onMouseOver);
                                removeEvent(outerWrapper, "mouseout",   onMouseOut);
                                removeEvent(outerWrapper, "mousedown",  onMouseDown);
                                removeEvent(outerWrapper, "touchstart", onMouseDown);
                                                        
                                if(mouseWheelEnabled) {
                                        if (window.addEventListener && !window.devicePixelRatio) window.removeEventListener('DOMMouseScroll', trackMouseWheel, false);
                                        else {
                                                removeEvent(document, "mousewheel", trackMouseWheel);
                                                removeEvent(window,   "mousewheel", trackMouseWheel);
                                        };
                                };
                        } catch(err) {};
                        
                        clearTimeout(timer);
                        removeClass(outerWrapper, "fd-slider-focused");
                        removeClass(outerWrapper, "fd-slider-active");
                        
                        addClass(outerWrapper, "fd-slider-disabled");
                        outerWrapper.setAttribute("aria-disabled", true);                        
                        inp.disabled = disabled = true;
                        
                        if(!noCallback) {
                                callback("disable");
                        };                        
                };
                
                function enableSlider(noCallback) {                         
                        if(!disabled && !noCallback) return;                        
                        
                        addEvent(handle, "focus",      onFocus);
                        addEvent(handle, "blur",       onBlur);   
                        
                        if(!isOpera) {
                                addEvent(handle, "keydown",   onKeyDown);  
                                addEvent(handle, "keypress",  onKeyPress); 
                        } else {
                                addEvent(handle, "keypress",  onKeyDown);
                        };
                                                
                        addEvent(outerWrapper, "touchstart", onMouseDown);
                        addEvent(outerWrapper, "mousedown",  onMouseDown); 
                        addEvent(outerWrapper, "mouseover",  onMouseOver);
                        addEvent(outerWrapper, "mouseout",   onMouseOut);
                                                                                                                                       
                        removeClass(outerWrapper, "fd-slider-disabled");
                        outerWrapper.setAttribute("aria-disabled", false);                         
                        inp.disabled = disabled = touchEvents = false;                          
                        
                        if(!noCallback) {
                                callback("enable");
                        };
                };
                
                // Destroys a slider
                function destroySlider() {                        
                        // Clear any timeouts
                        clearTimeout(timer);
                        
                        // Remove pointers to DOM nodes
                        wrapper = bar = handle = outerWrapper = timer = null;
                        
                        // Call the "destroy" callback
                        callback("destroy");
                        
                        // Delete the callback functions
                        callbacks = null;
                };
                
                // Calculates the pixel increment etc
                function redraw() {
                        locate();
                        // Internet Explorer requires the try catch
                        try {
                                var sW  = outerWrapper.offsetWidth,
                                    sH  = outerWrapper.offsetHeight,
                                    hW  = handle.offsetWidth,
                                    hH  = handle.offsetHeight,
                                    bH  = bar.offsetHeight,
                                    bW  = bar.offsetWidth, 
                                    mPx = vertical ? sH - hH : sW - hW;                                
                                   
                                stepPx = mPx / steps;                                
                                rMinPx = Math.max(scale ? percentToPixels(valueToPercent(rMin)) : Math.abs((rMin - min) / step) * stepPx, 0);    
                                rMaxPx = Math.min(scale ? percentToPixels(valueToPercent(rMax)) : Math.abs((rMax - min) / step) * stepPx, Math.floor(vertical ? sH - hH : sW - hW));    
                                
                                sliderW = sW;
                                sliderH = sH;                                
                                
                                // Use the input value
                                valueToPixels(html5Shim || forceValue ? getWorkingValueFromInput() : (tagName == "select" ? inp.selectedIndex : parseFloat(inp.value)));
                                
                        } catch(err) {};
                        callback("redraw");
                };
               
                // Calls a callback function
                function callback(type) {                                              
                        if(!html5Shim) {                          
                                if(callbacks.hasOwnProperty(type)) {  
                                        var cbObj = {"disabled":disabled, "elem":inp, "value":tagName == "select" ? inp.options[inp.selectedIndex].value : inp.value};
                                                                                                        
                                        // Call all functions in sequence 
                                        for(var i = 0, func; func = callbacks[type][i]; i++) {
                                                func.call(inp, cbObj);
                                        };                                       
                                }; 
                        } else if(type.match(/^(blur|focus|change)$/i)) {                                                                       
                                if(typeof(document.createEventObject) != 'undefined') {
                                        try {
                                                var e = document.createEventObject();
                                                inp.fireEvent('on' + type.toLowerCase(), e);
                                        } catch(err){ };
                                } else if(typeof(document.createEvent) != 'undefined') {
                                        var e = document.createEvent('HTMLEvents');                                        
                                        e.initEvent(type, true, true);
                                        inp.dispatchEvent(e);
                                };                                                        
                        };    
                };

                // FOCUS & BLUR events
                function onFocus(e) {
                        addClass(outerWrapper, 'fd-slider-focused');
                        
                        // Is the value said to have been set by the user onfocus
                        if(varSetRules.onfocus) { 
                                userSet = true;
                                valueToPixels(getWorkingValueFromInput()); 
                        };
                        
                        // If mousewheel events required then add them
                        if(mouseWheelEnabled) {
                                addEvent(window, 'DOMMouseScroll', trackMouseWheel);
                                addEvent(document, 'mousewheel', trackMouseWheel);
                                if(!isOpera) addEvent(window,   'mousewheel', trackMouseWheel); 
                        }; 
                        
                        // Callback...
                        callback("focus");                        
                        return true;                      
                };
                
                function onBlur(e) {                          
                        removeClass(outerWrapper, 'fd-slider-focused');
                        
                        // Remove mousewheel events if necessary
                        if(mouseWheelEnabled) {
                                removeEvent(document, 'mousewheel', trackMouseWheel);
                                removeEvent(window, 'DOMMouseScroll', trackMouseWheel);
                                if(!isOpera) removeEvent(window,   'mousewheel', trackMouseWheel);
                        };
                        
                        kbEnabled = true;
                        
                        // Callback...
                        callback("blur");
                };
                
                // MOUSEWHEEL events
                function trackMouseWheel(e) {
                        if(!kbEnabled) return;
                        e = e || window.event;
                        var delta = 0;
                            
                        if (e.wheelDelta) {
                                delta = e.wheelDelta/120;
                                // Older versions of Opera require a small hack to inverse the delta
                                if (isOpera && window.opera.version() < 9.2) delta = -delta;
                        } else if(e.detail) {
                                delta = -e.detail/3;
                        };
                        
                        if(vertical) { delta = -delta; };
                        
                        if(delta) {                                
                                var value = getWorkingValueFromInput();
                                   
                                value += (delta < 0) ? -step : step;
                                                        
                                userSet = true;
                                valueToPixels(getValidValue(value));                        
                        };
                        
                        return stopEvent(e);
                };                  
                
                // KEYBOARD events
                function onKeyPress(e) {                        
                        e = e || window.event;  
                        // Let all non-hijacked keyboard events pass                       
                        if((e.keyCode >= 33 && e.keyCode <= 40) || !kbEnabled || e.keyCode == 45 || e.keyCode == 46) {                                 
                                return stopEvent(e);
                        };
                        return true;
                };               
                        
                function onKeyDown(e) {
                        if(!kbEnabled) return true;

                        e = e || window.event;
                        var kc = e.keyCode != null ? e.keyCode : e.charCode;
                        
                        if ( kc < 33 || (kc > 40 && (kc != 45 && kc != 46))) return true;

                        var value = getWorkingValueFromInput();
                        
                        if( kc == 37 || kc == 40 || kc == 46 || kc == 34) {
                                // left, down, ins, page down                                                              
                                value -= (e.ctrlKey || kc == 34 ? +maxStep : +step);                                   
                        } else if( kc == 39 || kc == 38 || kc == 45 || kc == 33) {
                                // right, up, del, page up                                                                  
                                value += (e.ctrlKey || kc == 33 ? +maxStep : +step);                                
                        } else if( kc == 35 ) {
                                // max                                
                                value = rMax;                                
                        } else if( kc == 36 ) {
                                // min                                
                                value = rMin;
                        };  
                        
                        userSet = true;
                        valueToPixels(getValidValue(value));
                        
                        callback("update");                          
                                                                
                        // Opera doesn't let us cancel key events so the up/down arrows and home/end buttons will scroll the screen - which sucks                        
                        preventDefault(e);
                };                                                
                    
                // MOUSE & TOUCH events  
                
                // Mouseover the slider          
                function onMouseOver(e) {                        
                        addClass(outerWrapper, 'fd-slider-hover');
                };  
                
                // Mouseout of the slider              
                function onMouseOut(e) {
                        // Should really check we are not still in the slider
                        removeClass(outerWrapper, 'fd-slider-hover');
                };
                
                // Mousedown on the slider 
                function onMouseDown(e) {
                        e = e || window.event;
                        
                        // Stop page scrolling
                        preventDefault(e);
                                  
                        // Grab the event target                        
                        var targ;                          
                        if (e.target) targ = e.target;
                        else if (e.srcElement) targ = e.srcElement;
                        if(targ.nodeType == 3) targ = targ.parentNode;

                        // Are we using touchEvents
                        if(e.touches) {                                            
                                // Skip gestures                                
                                if(e.targetTouches && e.targetTouches.length != 1) {                                        
                                        return false;
                                };
                                                                
                                e = e.touches[0];                                
                                touchEvents = true;                                
                        };
                        
                        // Stop any animation timers
                        clearTimeout(timer);
                        timer = null;
                        
                        // Not keyboard enabled
                        kbEnabled = false;
                        
                        // User has set a value
                        userSet   = true;                                      
                                      
                        // Handle mousedown - initiate drag
                        if(targ.className.search("fd-slider-handle") != -1) {                                
                                mousePos  = vertical ? e.clientY : e.clientX;
                                handlePos = parseInt(vertical ? handle.offsetTop : handle.offsetLeft)||0;                        
                                
                                // Set a value on first click even if no movement 
                                trackMouse(e);
                                
                                if(!touchEvents) {                                    
                                        addEvent(document, 'mousemove', trackMouse);
                                        addEvent(document, 'mouseup', stopDrag);
                                } else {
                                        addEvent(document, 'touchmove', trackMouse);
                                        addEvent(document, 'touchend', stopDrag);  
                                        // Remove mouseEvents to stop them firing after the touch event
                                        removeEvent(outerWrapper, "mousedown", onMouseDown);                     
                                };                                
                                      
                                addClass(outerWrapper, 'fd-slider-active');                        
                                addClass(document.body, "fd-slider-drag-" + (vertical ? "vertical" : "horizontal"));
                                
                        // Wrapper mousedown - initiate animation to click point
                        } else {                        
                                locate();                                                  
                                
                                var posx        = 0,
                                    sLft        = 0,
                                    sTop        = 0;
        
                                // Internet Explorer doctype woes
                                if (document.documentElement && document.documentElement.scrollTop) {
                                        sTop = document.documentElement.scrollTop;
                                        sLft = document.documentElement.scrollLeft;
                                } else if (document.body) {
                                        sTop = document.body.scrollTop;
                                        sLft = document.body.scrollLeft;
                                };
        
                                if (e.pageX)            posx = vertical ? e.pageY : e.pageX;
                                else if (e.clientX)     posx = vertical ? e.clientY + sTop : e.clientX + sLft;
                                
                                posx -= vertical ? y + Math.round(handle.offsetHeight / 2) : x + Math.round(handle.offsetWidth / 2);                         
                                posx = snapToPxValue(posx);                                                        
                                                         
                                // Tween animation to click point
                                if(animation == "tween") {
                                        addClass(outerWrapper, 'fd-slider-active');
                                        tweenTo(posx);                                                                                     
                                // Progressive increment to click point    
                                } else if(animation == "timed") {  
                                        addClass(outerWrapper, 'fd-slider-active');     
                                        addEvent(document, touchEvents ? 'touchend' : 'mouseup', onDocMouseUp);                                                                                 
                                        destPos = posx;
                                        onTimer();
                                // Immediate jump to click point 
                                } else {
                                        pixelsToValue(posx);
                                        //addEvent(document, touchEvents ? 'touchend' : 'mouseup', onMouseUp);                                                      
                                };                                                                                   
                        };
                        
                        return stopEvent(e);                                                      
                };
                
                // Progressive increment to click point - clear the animation timer and remove the mouseup/touchend event
                function onDocMouseUp( e ) {                
                        e = e || window.event;
                        
                        preventDefault(e);                        
                        removeEvent(document, touchEvents ? 'touchend' : 'mouseup', onDocMouseUp);
                        removeClass(outerWrapper, "fd-slider-active");
                        
                        clearTimeout(timer);
                        timer     = null;
                        kbEnabled = true;                             
                
                        return stopEvent(e);
                }; 
                
                // Mouseup or touchend event on the document to stop drag
                function stopDrag(e) {                                              
                        e = e || window.event;
                        
                        preventDefault(e);
                        
                        if(touchEvents) {                                 
                                removeEvent(document, 'touchmove', trackMouse);
                                removeEvent(document, 'touchend',   stopDrag);                                  
                        } else {
                                removeEvent(document, 'mousemove', trackMouse);
                                removeEvent(document, 'mouseup',   stopDrag);
                        };
                        
                        kbEnabled   = true;                        
                        removeClass(document.body, "fd-slider-drag-" + (vertical ? "vertical" : "horizontal"));                        
                        removeClass(outerWrapper, "fd-slider-active");
                              
                        return stopEvent(e);
                }; 
                                   
                // Mousemove or touchmove event on the drag handle
                function trackMouse(e) {                                                                      
                        e = e || window.event; 
                        
                        preventDefault(e);
                         
                        if(e.touches) {
                                // Skip gestures
                                if(e.targetTouches && e.targetTouches.length != 1) {                                        
                                        return false;
                                };                                
                                e = e.touches[0];
                        };
                                                                   
                        pixelsToValue(snapToPxValue(handlePos + (vertical ? e.clientY - mousePos : e.clientX - mousePos))); 
                        
                        return false;                                         
                };
                
                // Increments the slider by "inc" steps
                function increment(inc) {                                       
                        var value = getWorkingValueFromInput();                                              
                        userSet   = true;                                                  
                        value += inc * step;
                        valueToPixels(getValidValue(value));  
                };
                
                // Attempts to locate the on-screen position of the slider
                function locate(){
                        var curleft = 0,
                            curtop  = 0,
                            obj     = outerWrapper;
                            
                        // Try catch for IE's benefit
                        try {
                                while (obj.offsetParent) {
                                        curleft += obj.offsetLeft;
                                        curtop  += obj.offsetTop;
                                        obj      = obj.offsetParent;
                                };
                        } catch(err) {};
                        x = curleft;
                        y = curtop;
                };
                
                // Used during the progressive animation to click point
                function onTimer() {
                        var xtmp = parseInt(vertical ? handle.offsetTop : handle.offsetLeft, 10);
                        xtmp = Math.round((destPos < xtmp) ? Math.max(destPos, Math.floor(xtmp - stepPx)) : Math.min(destPos, Math.ceil(xtmp + stepPx)));                  
                        
                        pixelsToValue(snapToPxValue(xtmp));
                        if(xtmp != destPos) timer = setTimeout(onTimer, steps > 20 ? 50 : 100);
                        else {
                                kbEnabled = true;
                                removeClass(outerWrapper, "fd-slider-active");  
                                
                                callback("finalise");
                        };
                };

                var tween = function(){
                        frame++;
                        var c = tweenC,
                            d = 20,
                            t = frame,
                            b = tweenB,
                            x = Math.ceil((t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b);

                        pixelsToValue(t == d ? tweenX : x);
                        
                        if(t!=d) {
                                // Call the "move" callback on each animation increment
                                callback("move");
                                timer = setTimeout(tween, 20);
                        } else {
                                clearTimeout(timer);
                                timer     = null;
                                kbEnabled = true;
                                                                
                                removeClass(outerWrapper, "fd-slider-focused"); 
                                removeClass(outerWrapper, "fd-slider-active");  
                                
                                // Call the "finalise" callback whenever the animation is complete
                                callback("finalise");
                        };
                };

                function tweenTo(tx){
                        kbEnabled = false;
                        tweenX    = parseInt(tx, 10);
                        tweenB    = parseInt(vertical ? handle.offsetTop : handle.offsetLeft, 10);
                        tweenC    = tweenX - tweenB;
                        tweenD    = 20;
                        frame     = 0;
                                              
                        if(!timer) { timer = setTimeout(tween, 20); };
                };
                
                // Returns a value within the range 
                function checkValue(value) {
                        if(isNaN(value) || value === "" || typeof value == "undefined") {                                                                                          
                                userSet = false;
                                return defaultVal;                                                
                        } else if(value < Math.min(rMin,rMax)) {                                                              
                                userSet = false; 
                                return Math.min(rMin,rMax);                                 
                        } else if(value > Math.max(rMin,rMax)) {                                
                                userSet = false;  
                                return Math.max(rMin,rMax);                                
                        };
                        userSet = true;
                        return value;
                };
                
                // Returns a value within a range - uses the form element value as base
                function getWorkingValueFromInput() {                        
                        return getValidValue(tagName == "input" ? parseFloat(inp.value) : inp.selectedIndex);
                };
                
                // Returns a value within the range
                function getValidValue(value) {
                        return (isNaN(value) || value === "" || typeof value == "undefined") ? defaultVal : Math.min(Math.max(value, Math.min(rMin,rMax)), Math.max(rMin,rMax));             
                };
                
                // Calculates value according to pixel position of slider handle
                function pixelsToValue(px) {                                                                                            
                        var val = getValidValue(scale ? percentToValue(pixelsToPercent(px)) : vertical ? max - (Math.round(px / stepPx) * step) : min + (Math.round(px / stepPx) * step));                                                                                                                                                                         
                        
                        handle.style[vertical ? "top" : "left"] = (px || 0) + "px";
                        redrawRange();                                      
                        setInputValue((tagName == "select" || step == 1) ? Math.round(val) : val);                         
                };                
                
                // Calculates pixel position according to form element value
                function valueToPixels(val) { 
                        var clearVal = false,
                            value;
                                                            
                        // Allow empty values for non-polyfill sliders
                        if((typeof val == "undefined" || isNaN(val) || val === "") && tagName == "input" && !(html5Shim || forceValue)) {                                
                                value    = defaultVal;
                                clearVal = true;
                                userSet  = false;    
                        } else {                               
                                value = checkValue(val);                                   
                        };
                        
                        handle.style[vertical ? "top" : "left"] = (scale ? percentToPixels(valueToPercent(value)) : vertical ? Math.round(((max - value) / step) * stepPx) : Math.round(((value - min) / step) * stepPx)) + "px"; 
                        redrawRange();                          
                        setInputValue(clearVal ? "" : value);                                                                                                                                                                       
                };

                // Rounds a pixel value to the nearest "snap" point on the slider scale
                function snapToPxValue(px) {                             
                        if(scale) {                                
                                return Math.max(Math.min(rMaxPx, px), rMinPx);                        
                        } else {                
                                var rem = px % stepPx;
                                if(rem && rem >= (stepPx / 2)) { px += (stepPx - rem); } 
                                else { px -= rem;  };     
                                
                                if(px < Math.min(Math.abs(rMinPx), Math.abs(rMaxPx))) px = Math.min(Math.abs(rMinPx), Math.abs(rMaxPx));
                                else if(px > Math.max(Math.abs(rMinPx), Math.abs(rMaxPx))) px = Math.max(Math.abs(rMinPx), Math.abs(rMaxPx));
                                         
                                return Math.min(Math.max(px, 0), rMaxPx); 
                        };       
                };     
                
                // Calculates a value according to percentage of distance handle has travelled
                function percentToValue(pct) {
    	                var st = 0, 
                            fr = min,
                            value;

                        for(var s in scale) {                                 
    	                        if(!scale.hasOwnProperty(s)) {
                                        continue;
                                };
                                
                                if(pct >= st && pct <= +s ) {
                                        value = fr + ((pct - st) * (+scale[s] - fr) ) / (+s - st);
    	                        };

    	                       st = +s;
    	                       fr = +scale[s];
    	               };

  	               return value;   
                };
                
                // Calculates the percentage handle position according to form element value
                function valueToPercent(value) {  	  
                        var st  = 0, 
                            fr  = min, 
                            pct = 0;

                        for(var s in scale) {
                                if(!scale.hasOwnProperty(s)) {
                                        continue;
                                };
                                
                                if(value >= fr && value <= +scale[s]){
                                        pct = st + (value - fr) * (+s - st) / (+scale[s] - fr);
                                };

                                st = +s; 
                                fr = +scale[s];
                        };  
                        
                        return pct;           
                };
                
                function percentToPixels(percent) {
                        return ((outerWrapper[vertical ? "offsetHeight" : "offsetWidth"] - handle[vertical ? "offsetHeight" : "offsetWidth"]) / 100) * percent;                
                };
                
                function pixelsToPercent(pixels) {
                        return pixels / ((outerWrapper[vertical ? "offsetHeight" : "offsetWidth"] - outerWrapper[handle ? "offsetHeight" : "offsetWidth"]) / 100);
                };
                
                // Sets the form element with a valid value
                function setInputValue(val) {
                        callback("update");
                                                                                                    
                        // If the user has not set this value or has entered an incorrect value then set a class
                        // to enable styling of the slider
                        if(!userSet) {                                
                                addClass(outerWrapper, "fd-slider-no-value");
                        } else {
                                removeClass(outerWrapper, "fd-slider-no-value");
                        };
                        
                        if(tagName == "select") {
                                try {                                                                          
                                        val = parseInt(val, 10);                                        
                                        if(inp.selectedIndex === val) return;
                                        inp.options[val].selected = true;                                                                             
                                } catch (err) {};
                        } else {                                                                                                                                                                                                                                                                                                                                   
                                if(val != "") {
                                        val = (min + (Math.round((val - min) / step) * step)).toFixed(precision);                                  
                                };
                                if(inp.value === val) {                                                          
                                        return;
                                };
                                inp.value = val;                                 
                        };
                                               
                        updateAriaValues();                        
                        callback("change");
                };
                                
                function checkInputValue(value) {                        
                        return !(isNaN(value) || value === "" || value < Math.min(rMin,rMax) || value > Math.max(rMin,rMax));                
                };
                
                function setSliderRange(newMin, newMax) {
                        if(rMin > rMax) {
                                newMin = Math.min(min, Math.max(newMin, newMax));
                                newMax = Math.max(max, Math.min(newMin, newMax));                                
                                rMin   = Math.max(newMin, newMax);
                                rMax   = Math.min(newMin, newMax);
                        } else {
                                newMin = Math.max(min, Math.min(newMin, newMax));
                                newMax = Math.min(max, Math.max(newMin, newMax));                                
                                rMin   = Math.min(newMin, newMax);
                                rMax   = Math.max(newMin, newMax);
                        };         
                        
                        if(defaultVal < Math.min(rMin, rMax)) defaultVal = Math.min(rMin, rMax);
                        else if(defaultVal > Math.max(rMin, rMax)) defaultVal = Math.max(rMin, rMax);                        
                			
                        handle.setAttribute("aria-valuemin",  rMin);
                        handle.setAttribute("aria-valuemax",  rMax);
			                      
                        checkValue(tagName == "input" ? parseFloat(inp.value) : inp.selectedIndex);                        		
                        redraw();
                };
                
                function redrawRange() {
                        if(noRangeBar) {
                                return;
                        };
                        if(vertical) {                       
                                rangeBar.style["height"] = (bar.offsetHeight - handle.offsetTop) + "px";
                        } else {                                
                                rangeBar.style["width"] = handle.offsetLeft + "px"; 
                        };			
                };
                
                function findLabel() {
                        var label = false,
                            labelList = document.getElementsByTagName('label');
                        // loop through label array attempting to match each 'for' attribute to the id of the current element
                        for(var i = 0, lbl; lbl = labelList[i]; i++) {
                                // Internet Explorer requires the htmlFor test
                                if((lbl['htmlFor'] && lbl['htmlFor'] == inp.id) || (lbl.getAttribute('for') == inp.id)) {
                                        label = lbl;
                                        break;
                                };
                        };
                        
                        if(label && !label.id) { label.id = inp.id + "_label"; };
                        return label;
                };
                
                function updateAriaValues() {                        
                        handle.setAttribute("aria-valuenow",  tagName == "select" ? inp.options[inp.selectedIndex].value : inp.value);
                        handle.setAttribute("aria-valuetext", tagName == "select" ? (inp.options[inp.selectedIndex].text ? inp.options[inp.selectedIndex].text : inp.options[inp.selectedIndex].value) : inp.value);
                };
                
                function onInputChange(e) {                       
                        userSet = true;
                        valueToPixels(tagName == "input" ? parseFloat(inp.value) : inp.selectedIndex);
                        updateAriaValues();                                                 
                };                  
                
                function valueSet(tf) {
                        userSet = !!tf;
                };
                
                (function() {                         
                                                
                        if(html5Shim || hideInput) { 
                                addClass(inp, "fd-form-element-hidden");                                                
                        } else {
                                addEvent(inp, 'change', onInputChange); 
                        };
                        
                        // Add stepUp & stepDown methods to input element if using the html5Shim
                        if(html5Shim) {
                                inp.stepUp   = function(n) { increment(n||1); };
                                inp.stepDown = function(n) { increment(n||-1); };                                
                        };
                        
                        outerWrapper              = document.createElement('span');
                        outerWrapper.className    = "fd-slider" + (vertical ? "-vertical " : " ") + (!html5Shim ? " fd-slider-no-value " : "") + classNames;
                        outerWrapper.id           = "fd-slider-" + inp.id;
                        
                        if(vertical && inpHeight) {
                                outerWrapper.style.height = inpHeight + "px";  
                        };
                        
                        wrapper                   = document.createElement('span');
                        wrapper.className         = "fd-slider-inner";

                        bar                       = document.createElement('span');
                        bar.className             = "fd-slider-bar";
                        
                        if(!noRangeBar) {
                                rangeBar                  = document.createElement('span');
                                rangeBar.className        = "fd-slider-range";
                        };
                        
                        if(fullARIA) {
                                handle            = document.createElement('span');                                
                                handle.tabIndex   = 0;
                        } else {
                                handle            = document.createElement('a');                                 
                                handle.setAttribute("href", "#");
                        };
                        
                        handle.className          = "fd-slider-handle";                        
                        handle.appendChild(document.createTextNode(String.fromCharCode(160)));                         
                        
                        outerWrapper.appendChild(wrapper);
                        if(!noRangeBar) {
                                outerWrapper.appendChild(rangeBar);
                        };
                        outerWrapper.appendChild(bar);
                        outerWrapper.appendChild(handle);
                        
                        inp.parentNode.insertBefore(outerWrapper, inp);

                        /*@cc_on@*/
                        /*@if(@_win32)
                        handle.unselectable       = "on";
                        if(!noRangeBar) rangeBar.unselectable     = "on";
                        bar.unselectable          = "on";
                        wrapper.unselectable      = "on";
                        outerWrapper.unselectable = "on";                             
                        /*@end@*/                             
                        
                        // Add ARIA accessibility info programmatically 
                        outerWrapper.setAttribute("role",           "application"); 
                                               
                        handle.setAttribute("role",           "slider");
                        handle.setAttribute("aria-valuemin",  tagName == "select" ? inp.options[0].value : min);
                        handle.setAttribute("aria-valuemax",  tagName == "select" ? inp.options[inp.options.length - 1].value : max);                     
                        
                        var lbl = findLabel();
                        if(lbl) {                                 
                                handle.setAttribute("aria-labelledby", lbl.id);
                                handle.id = "fd-slider-handle-" + inp.id;
                                /*@cc_on
                                /*@if(@_win32)
                                lbl.setAttribute("htmlFor", handle.id);
                                @else @*/
                                lbl.setAttribute("for", handle.id);
                                /*@end
                                @*/
                        };
                        
                        // Are there page instructions 
                        if(document.getElementById(describedBy)) {                                  
                                handle.setAttribute("aria-describedby", describedBy);  
                        };                                               
                        
                        // Is the form element initially disabled
                        if(inp.getAttribute("disabled") == true) {                         
                                disableSlider(true);
                        } else {                                  
                                enableSlider(true);
                        };                            
                        
                        // Does an initial form element value mean the user has set a valid value?
                        // Note: This only works onload on IE                         
                        if(varSetRules.onvalue) {                                                                
                                userSet = true;                                  
                                checkValue(tagName == "input" ? parseFloat(inp.value) : inp.selectedIndex);
                        };
                                                                               
                        updateAriaValues();                        
                        callback("create");                            
                        redraw();                                                                                  
                })();
               
                return {
                        onResize:       function(e) { if(outerWrapper.offsetHeight != sliderH || outerWrapper.offsetWidth != sliderW) { redraw(); }; },
                        destroy:        function()  { destroySlider(); },
                        reset:          function()  { valueToPixels(tagName == "input" ? parseFloat(inp.value) : inp.selectedIndex); },
                        stepUp:         function(n) { increment(Math.abs(n)||1); },
                        stepDown:       function(n) { increment(-Math.abs(n)||-1); },
                        increment:      function(n) { increment(n); },
                        disable:        function()  { disableSlider(); },
                        enable:         function()  { enableSlider(); },
                        setRange:       function(mi, mx) { setSliderRange(mi, mx); },
                        getValueSet:    function() { return !!userSet; },
                        setValueSet:    function(tf) { valueSet(tf); },
                        ieCheckValue:   function() { if(varSetRules.onvalue) { userSet = true; checkValue(tagName == "input" ? parseFloat(inp.value) : inp.selectedIndex); updateAriaValues(); redraw(); }; }
                };
        }; 
               
        addEvent(window, "load",   init);
        addEvent(window, "resize", resize);        
        addEvent(window, "unload", unload);
        
        // Have we been passed JSON within the including script tag
        (function() {
                var scriptFiles       = document.getElementsByTagName('script'),                    
                    scriptInner       = String(scriptFiles[scriptFiles.length - 1].innerHTML).replace(/[\n\r\s\t]+/g, " ").replace(/^\s+/, "").replace(/\s+$/, ""),                    
                    json              = parseJSON(scriptInner); 
                            
                if(typeof json === "object" && !("err" in json)) {                          
                        affectJSON(json);
                };  
        })();
        
        // Add oldie class if needed for IE < 9
        /*@cc_on 
        @if (@_jscript_version < 9)
        addClass(document.documentElement, "oldie");
        @end 
        @*/
                        
        return {                                           
                createSlider:           function(opts) { createSlider(opts); },                    
                destroyAll:             function() { destroyAllsliders(); },
                destroySlider:          function(id) { return destroySingleSlider(id); },
                redrawAll:              function() { resize(); },
                increment:              function(id, numSteps) { if(!(id in sliders)) { return false; }; sliders[id].increment(numSteps); },
                stepUp:                 function(id, n) { if(!(id in sliders)) { return false; }; sliders[id].stepUp(Math.abs(n)||1); },
                stepDown:               function(id, n) { if(!(id in sliders)) { return false; }; sliders[id].stepDown(-Math.abs(n)||-1); },
                setRange:               function(id, newMin, newMax) { if(!(id in sliders)) { return false; }; sliders[id].setRange(newMin, newMax); },
                addEvent:               addEvent,
                removeEvent:            removeEvent,
                stopEvent:              stopEvent,
                updateSlider:           function(id) { if(!(id in sliders)) { return false; }; sliders[id].reset(); },        
                onDomReady:             function() { onDomReady(); },
                disable:                function(id) { if(!(id in sliders)) { return false; }; sliders[id].disable(); }, 
                enable:                 function(id) { if(!(id in sliders)) { return false; }; sliders[id].enable(); },
                getValueSet:            function() { return getValueSet(); },
                setValueSet:            function(a, tf) { setValueSet(a, tf); },
                setGlobalVariables:     function(json) { affectJSON(json); },
                removeOnload:           function() { removeOnLoadEvent(); }                      
        };
})();     