/*
 Input Mask plugin dependencyLib
 http://github.com/RobinHerbots/jquery.inputmask
 Copyright (c) 2010 -  Robin Herbots
 Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		factory();
	}
}
(function () {

	//helper functions

	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	function indexOf(list, elem) {
		var i = 0,
			len = list.length;
		for (; i < len; i++) {
			if (list[i] === elem) {
				return i;
			}
		}
		return -1;
	}

	var class2type = {},
		classTypes = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
	for (var nameNdx = 0; nameNdx < classTypes.length; nameNdx++) {
		class2type["[object " + classTypes[nameNdx] + "]"] = classTypes[nameNdx].toLowerCase();
	}

	function type(obj) {
		if (obj == null) {
			return obj + "";
		}
		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
		class2type[class2type.toString.call(obj)] || "object" :
			typeof obj;
	}

	function isWindow(obj) {
		return obj != null && obj === obj.window;
	}

	function isArraylike(obj) {
		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = "length" in obj && obj.length,
			ltype = type(obj);

		if (ltype === "function" || isWindow(obj)) {
			return false;
		}

		if (obj.nodeType === 1 && length) {
			return true;
		}

		return ltype === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}

	function isValidElement(elem) {
		return elem instanceof Element;
	}

	function DependencyLib(elem) {
		if (elem instanceof DependencyLib) {
			return elem;
		}
		if (!(this instanceof DependencyLib)) {
			return new DependencyLib(elem);
		}
		if (elem !== undefined && elem !== null && elem !== window) {
			this[0] = elem.nodeName ? elem : (elem[0] !== undefined && elem[0].nodeName ? elem[0] : document.querySelector(elem));
			if (this[0] !== undefined && this[0] !== null) {
				this[0].eventRegistry = this[0].eventRegistry || {};
			}
		}
	}

	DependencyLib.prototype = {
		on: function (events, handler) {
			if (isValidElement(this[0])) {
				var eventRegistry = this[0].eventRegistry,
					elem = this[0];

				function addEvent(ev, namespace) {
					//register domevent
					if (elem.addEventListener) { // all browsers except IE before version 9
						elem.addEventListener(ev, handler, false);
					} else if (elem.attachEvent) { // IE before version 9
						elem.attachEvent("on" + ev, handler);
					}
					eventRegistry[ev] = eventRegistry[ev] || {};
					eventRegistry[ev][namespace] = eventRegistry[ev][namespace] || [];
					eventRegistry[ev][namespace].push(handler);
				}

				var _events = events.split(" ");
				for (var endx = 0; endx < _events.length; endx++) {
					var nsEvent = _events[endx].split("."),
						ev = nsEvent[0],
						namespace = nsEvent[1] || "global";
					addEvent(ev, namespace);
				}
			}
			return this;
		},
		off: function (events, handler) {
			if (isValidElement(this[0])) {
				var eventRegistry = this[0].eventRegistry,
					elem = this[0];

				function removeEvent(ev, namespace, handler) {
					if (ev in eventRegistry === true) {
						//unbind to dom events
						if (elem.removeEventListener) { // all browsers except IE before version 9
							elem.removeEventListener(ev, handler, false);
						} else if (elem.detachEvent) { // IE before version 9
							elem.detachEvent("on" + ev, handler);
						}
						if (namespace === "global") {
							for (var nmsp in eventRegistry[ev]) {
								eventRegistry[ev][nmsp].splice(eventRegistry[ev][nmsp].indexOf(handler), 1);
							}
						} else {
							eventRegistry[ev][namespace].splice(eventRegistry[ev][namespace].indexOf(handler), 1);
						}
					}
				}

				function resolveNamespace(ev, namespace) {
					var evts = [],
						hndx, hndL;
					if (ev.length > 0) {
						if (handler === undefined) {
							for (hndx = 0, hndL = eventRegistry[ev][namespace].length; hndx < hndL; hndx++) {
								evts.push({
									ev: ev,
									namespace: namespace && namespace.length > 0 ? namespace : "global",
									handler: eventRegistry[ev][namespace][hndx]
								});
							}
						} else {
							evts.push({
								ev: ev,
								namespace: namespace && namespace.length > 0 ? namespace : "global",
								handler: handler
							});
						}
					} else if (namespace.length > 0) {
						for (var evNdx in eventRegistry) {
							for (var nmsp in eventRegistry[evNdx]) {
								if (nmsp === namespace) {
									if (handler === undefined) {
										for (hndx = 0, hndL = eventRegistry[evNdx][nmsp].length; hndx < hndL; hndx++) {
											evts.push({
												ev: evNdx,
												namespace: nmsp,
												handler: eventRegistry[evNdx][nmsp][hndx]
											});
										}
									} else {
										evts.push({
											ev: evNdx,
											namespace: nmsp,
											handler: handler
										});
									}
								}
							}
						}
					}

					return evts;
				}

				var _events = events.split(" ");
				for (var endx = 0; endx < _events.length; endx++) {
					var nsEvent = _events[endx].split("."),
						offEvents = resolveNamespace(nsEvent[0], nsEvent[1]);
					for (var i = 0, offEventsL = offEvents.length; i < offEventsL; i++) {
						removeEvent(offEvents[i].ev, offEvents[i].namespace, offEvents[i].handler);
					}
				}
			}
			return this;
		},
		trigger: function (events /* , args... */) {
			if (isValidElement(this[0])) {
				var eventRegistry = this[0].eventRegistry,
					elem = this[0];
				var _events = typeof events === "string" ? events.split(" ") : [events.type];
				for (var endx = 0; endx < _events.length; endx++) {
					var nsEvent = _events[endx].split("."),
						ev = nsEvent[0],
						namespace = nsEvent[1] || "global";
					if (document !== undefined && namespace === "global") {
						//trigger domevent
						var evnt, i, params = {
							bubbles: false,
							cancelable: true,
							detail: Array.prototype.slice.call(arguments, 1)
						};
						// The custom event that will be created
						if (document.createEvent) {
							try {
								evnt = new CustomEvent(ev, params);
							} catch (e) {
								evnt = document.createEvent("CustomEvent");
								evnt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
							}
							if (events.type) DependencyLib.extend(evnt, events);
							elem.dispatchEvent(evnt);
						} else {
							evnt = document.createEventObject();
							evnt.eventType = ev;
							if (events.type) DependencyLib.extend(evnt, events);
							elem.fireEvent("on" + evnt.eventType, evnt);
						}
					} else if (eventRegistry[ev] !== undefined) {
						arguments[0] = arguments[0].type ? arguments[0] : DependencyLib.Event(arguments[0]);
						if (namespace === "global") {
							for (var nmsp in eventRegistry[ev]) {
								for (i = 0; i < eventRegistry[ev][nmsp].length; i++) {
									eventRegistry[ev][nmsp][i].apply(elem, arguments);
								}
							}
						} else {
							for (i = 0; i < eventRegistry[ev][namespace].length; i++) {
								eventRegistry[ev][namespace][i].apply(elem, arguments);
							}
						}
					}
				}
			}
			return this;
		}
	};

	//static
	DependencyLib.isFunction = function (obj) {
		return type(obj) === "function";
	};
	DependencyLib.noop = function () {
	};
	DependencyLib.isArray = Array.isArray;
	DependencyLib.inArray = function (elem, arr, i) {
		return arr == null ? -1 : indexOf(arr, elem, i);
	};
	DependencyLib.valHooks = undefined;


	DependencyLib.isPlainObject = function (obj) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if (type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
			return false;
		}

		if (obj.constructor && !class2type.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	};

	DependencyLib.extend = function () {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !DependencyLib.isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (DependencyLib.isPlainObject(copy) || (copyIsArray = DependencyLib.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && DependencyLib.isArray(src) ? src : [];

						} else {
							clone = src && DependencyLib.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = DependencyLib.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	DependencyLib.each = function (obj, callback) {
		var value, i = 0;

		if (isArraylike(obj)) {
			for (var length = obj.length; i < length; i++) {
				value = callback.call(obj[i], i, obj[i]);
				if (value === false) {
					break;
				}
			}
		} else {
			for (i in obj) {
				value = callback.call(obj[i], i, obj[i]);
				if (value === false) {
					break;
				}
			}
		}

		return obj;
	};
	DependencyLib.map = function (elems, callback) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike(elems),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if (isArray) {
			for (; i < length; i++) {
				value = callback(elems[i], i);

				if (value != null) {
					ret.push(value);
				}
			}

			// Go through every key on the object,
		} else {
			for (i in elems) {
				value = callback(elems[i], i);

				if (value != null) {
					ret.push(value);
				}
			}
		}

		// Flatten any nested arrays
		return [].concat(ret);
	};

	DependencyLib.data = function (owner, key, value) {
		if (value === undefined) {
			return owner.__data ? owner.__data[key] : null;
		} else {
			owner.__data = owner.__data || {};
			owner.__data[key] = value;
		}
	};

	DependencyLib.Event = function CustomEvent(event, params) {
		params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};
		var evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}
	DependencyLib.Event.prototype = window.Event.prototype;

	window.dependencyLib = DependencyLib;
	return DependencyLib;
}));
