/*
Input Mask plugin binding
http://github.com/RobinHerbots/jquery.inputmask
Copyright (c) 2010 -  Robin Herbots
Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
*/
(function(factory) {
		if (typeof define === "function" && define.amd) {
			define(["jquery", "inputmask"], factory);
		} else if (typeof exports === "object") {
			module.exports = factory(require("jquery"), require("./inputmask"));
		} else {
			factory(jQuery, window.Inputmask);
		}
	}
	(function($, Inputmask) {
		$(document).ajaxComplete(function(event, xmlHttpRequest, ajaxOptions) {
			if ($.inArray("html", ajaxOptions.dataTypes) !== -1) {
				$(":input").each(function(ndx, lmnt) {
					if (lmnt.inputmask === undefined) {
						Inputmask().mask(lmnt);
					}
				});
			}
		}).ready(function() {
			$(":input").each(function(ndx, lmnt) {
				if (lmnt.inputmask === undefined) {
					Inputmask().mask(lmnt);
				}
			});
		});
	}));
