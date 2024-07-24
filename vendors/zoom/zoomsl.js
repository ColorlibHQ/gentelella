/*http://zoomsl.sergeland.ru Sergey Zaragulov skype: deeserge icq: 287295769 sergeland@mail.ru*/

(function ($, global) {
    "use strict";

    $.fn.imagezoomsl = function (options) {
        options = options || {};
        return this.each(function () { //return jQuery obj		
            if (!$(this).is("img")) return true;
            var that = this;
            setTimeout(function () {
                $(new Image()).on('load', function () {
                    sergelandimagezoomer.init($(that), options);
                }).attr('src', $(that).attr('src'));
            }, 30);
        });

    };

    var sergelandimagezoomer = {};
    $.extend(sergelandimagezoomer, {

        dsetting: { //default settings

            loadinggif: '', 
            loadopacity: 0.1, 
            loadbackground: '#878787', 


            // cursorshade
            cursorshade: true, 
            magnifycursor: 'crosshair', 
            cursorshadecolor: '#fff',
            cursorshadeopacity: 0.3, 
            cursorshadeborder: '1px solid black', 
            zindex: '', 
            stepzoom: 0.5,
            zoomrange: [2, 2],
            zoomstart: 2, 
            disablewheel: true, 


            // statusdiv
            showstatus: true, 
            showstatustime: 2000,
            statusdivborder: '1px solid black',
            statusdivbackground: '#C0C0C0',
            statusdivpadding: '4px',
            statusdivfont: 'bold 13px Arial',
            statusdivopacity: 0.8,


            //magnifier
            magnifierpos: 'right', // left/right
            magnifiersize: [0, 0], 
            magnifiereffectanimate: 'showIn', // fadeIn/showIn/slideIn
            innerzoom: false, 
            innerzoommagnifier: false, 
            descarea: false, // width n height				
            leftoffset: 15, 
            rightoffset: 15, 
            switchsides: true, 
            magnifierborder: '1px solid black', 


            textdnbackground: '#fff',
            textdnpadding: '10px',
            textdnfont: '13px/20px cursive',


            scrollspeedanimate: 5 /*4*/ , 
            zoomspeedanimate: 7,
            loopspeedanimate: 2.5 /*2.45342*/ ,		
            magnifierspeedanimate: 350,


            // appearance
            classmagnifier: "magnifier",
            classcursorshade: "cursorshade",
            classstatusdiv: "statusdiv",
            classtextdn: "textdn",
            classtracker: "tracker"

        },

        isie: (function () {
            var nAgt = navigator.userAgent;
            if (nAgt.indexOf("MSIE") != -1) return true;
            else return false;
        })(),

        highestzindex: function ($img) {

            var z = 0,
                $els = $img.parents().add($img),
                elz;
            $els.each(function () {
                elz = $(this).css('zIndex');
                elz = isNaN(elz) ? 0 : +elz;
                z = Math.max(z, elz);
            });
            return z;
        },

        getboundary: function (b, val, specs) {
            if (b == "left") {
                var rb = -specs.img.w * specs.newpower + specs.magnifier.w;
                return (val > 0) ? 0 : (val < rb) ? rb : val;
            } else {
                var tb = -specs.img.h * specs.newpower + specs.magnifier.h;
                return (val > 0) ? 0 : (val < tb) ? tb : val;
            }
        },

        controlLoop: function ($tracker) {
            var self = this,
                specs = $tracker.data('specs');
            if (!specs) return;

            var coords = specs.$img.offsetsl(),
                pageX = self.cld.pageX999 - coords.left,
                pageY = self.cld.pageY999 - coords.top;

            self.cld.destU += (self.cld.pageX999 - self.cld.destU) / 2.45342;
            self.cld.destV += (self.cld.pageY999 - self.cld.destV) / 2.45342;

            specs.$statusdiv.css({
                left: self.cld.destU - 10,
                top: self.cld.destV + 20
            });

            var csw = Math.round(specs.magnifier.w / specs.newpower),
                csh = Math.round(specs.magnifier.h / specs.newpower);

            self.cld.destK += (pageX - self.cld.destK) / specs.setting.loopspeedanimate;
            self.cld.destL += (pageY - self.cld.destL) / specs.setting.loopspeedanimate;

            specs.$cursorshade.css({
                left: specs.img.w > csw ? Math.min(specs.img.w - csw, Math.max(0, self.cld.destK - csw / 2)) + coords.left - specs.cursorshade999.border999.left999 : coords.left - specs.cursorshade999.border999.left999,
                top: specs.img.h > csh ? Math.min(specs.img.h - csh, Math.max(0, self.cld.destL - csh / 2)) + coords.top - specs.cursorshade999.border999.top999 : coords.top - specs.cursorshade999.border999.top999
            });

            if (specs.setting.innerzoommagnifier) {

                self.cld.destM += (self.cld.pageX999 - self.cld.destM) / specs.setting.loopspeedanimate;
                self.cld.destN += (self.cld.pageY999 - self.cld.destN) / specs.setting.loopspeedanimate;

                specs.$magnifier.css({
                    left: self.cld.destM - Math.round(specs.magnifier.w / 2),
                    top: self.cld.destN - Math.round(specs.magnifier.h / 2)
                });
                specs.$textdn.css({
                    left: self.cld.destM - Math.round(specs.magnifier.w / 2),
                    top: self.cld.destN + specs.magnifier.h / 2
                });
            }

            self.cld.currU += (pageX - self.cld.currU) / specs.setting.scrollspeedanimate;
            self.cld.currV += (pageY - self.cld.currV) / specs.setting.scrollspeedanimate;

            var newx = -self.cld.currU * specs.newpower + specs.magnifier.w / 2;
            var newy = -self.cld.currV * specs.newpower + specs.magnifier.h / 2;

            specs.$bigimage.css({
                left: self.getboundary('left', newx, specs),
                top: self.getboundary('top', newy, specs)
            });
            self.cld.controlTimer = setTimeout(function () {
                self.controlLoop($tracker);
            }, 30);

        },

        controlLoop2: function ($tracker) {

            var self = this,
                specs = $tracker.data('specs');
            if (!specs) return;

            specs.currM += (specs.newpower - specs.currM) / specs.setting.zoomspeedanimate;
            specs.currM = Math.round(specs.currM * 1000) / 1000;

            specs.$cursorshade.css({
                width: specs.img.w > Math.round(specs.magnifier.w / specs.currM) ? Math.round(specs.magnifier.w / specs.currM) : specs.img.w,
                height: specs.img.h > Math.round(specs.magnifier.h / specs.currM) ? Math.round(specs.magnifier.h / specs.currM) : specs.img.h
            });
            specs.$bigimage.css({
                width: Math.round(specs.currM * specs.bigimage.w * (specs.img.w / specs.bigimage.w)),
                height: Math.round(specs.currM * specs.bigimage.h * (specs.img.h / specs.bigimage.h))
            });

            self.cld.controlTimer2 = setTimeout(function () {
                self.controlLoop2($tracker);
            }, 30);

        },

        cld: {},

        showimage: function ($tracker) {

            var self = this,
                specs = $tracker.data('specs'),
                width = specs.setting.magnifiersize[0],
                height = specs.setting.magnifiersize[1],
                magcoords = {},
                coords = specs.$img.offsetsl(),
                func = function () {},
                left1 = 0,
                top1 = 0;

            magcoords.left = coords.left + (specs.setting.magnifierpos === 'left' ? -specs.magnifier.w - specs.setting.leftoffset : specs.img.w + specs.setting.rightoffset);
            if (specs.setting.switchsides && !specs.setting.innerzoom) {

                if (specs.setting.magnifierpos !== 'left' && magcoords.left + specs.magnifier.w + specs.setting.leftoffset >= $(window).width() && coords.left - specs.magnifier.w >= specs.setting.leftoffset)
                    magcoords.left = coords.left - specs.magnifier.w - specs.setting.leftoffset;
                else if (specs.setting.magnifierpos === 'left' && magcoords.left < 0)
                    magcoords.left = coords.left + specs.img.w + specs.setting.rightoffset;
            }

            left1 = magcoords.left;
            top1 = coords.top;
            specs.$magnifier.css({
                visibility: "visible",
                display: "none"
            });

            if (specs.setting.descarea) {
                left1 = $(specs.setting.descarea).offsetsl().left;
                top1 = $(specs.setting.descarea).offsetsl().top;
            }
            if (specs.setting.innerzoommagnifier) {
                left1 = self.cld.pageX999 - Math.round(specs.magnifier.w / 2);
                top1 = self.cld.pageY999 - Math.round(specs.magnifier.h / 2);
            }

            //*
            func = function () {

                specs.$textdn.stop(true, true).fadeIn(specs.setting.magnifierspeedanimate);
                if (!specs.setting.innerzoommagnifier)
                    specs.$textdn.css({
                        left: left1,
                        top: top1 + height
                    });
            } // */			

            if (specs.setting.innerzoom) {

                left1 = coords.left;
                top1 = coords.top;

                func = function () {
                    specs.$img.css({
                        visibility: "hidden"
                    });
                    specs.$textdn.css({
                        left: left1,
                        top: top1 + height
                    }).stop(true, true).fadeIn(specs.setting.magnifierspeedanimate);
                };
            }

            switch (specs.setting.magnifiereffectanimate) {
                case 'slideIn':
                    specs.$magnifier.css({
                            left: left1,
                            top: top1 - height / 3,
                            width: width,
                            height: height
                        })
                        .stop(true, true).show()
                        .animate({
                            top: top1
                        }, specs.setting.magnifierspeedanimate, "easeOutBounceSL", func);
                    break;
                case 'showIn':
                    specs.$magnifier.css({
                            left: coords.left + Math.round(specs.img.w / 2),
                            top: coords.top + Math.round(specs.img.h / 2),
                            width: Math.round(specs.magnifier.w / 5),
                            height: Math.round(specs.magnifier.h / 5)
                        })
                        .stop(true, true).show().css({
                            opacity: "0.1"
                        })
                        .animate({
                            left: left1,
                            top: top1,
                            opacity: "1",
                            width: width,
                            height: height

                        }, specs.setting.magnifierspeedanimate, func);
                    break;
                default:
                    specs.$magnifier.css({
                            left: left1,
                            top: top1,
                            width: width,
                            height: height
                        })
                        .stop(true, true)
                        .fadeIn(specs.setting.magnifierspeedanimate, func);
            }
            if (specs.setting.showstatus && (specs.title999 || specs.help))
                specs.$statusdiv.html(specs.title999 + '<div style="font-size:80%">' + specs.help + '</div>')
                .stop(true, true)
                .fadeIn().delay(specs.setting.showstatustime).fadeOut("slow");
            else specs.$statusdiv.hide();
        },

        hideimage: function ($tracker) {

            var self = this,
                specs = $tracker.data('specs'),
                coords = specs.$img.offsetsl();

            switch (specs.setting.magnifiereffectanimate) {

                case 'showIn':
                    specs.$magnifier.stop(true, true)
                        .animate({
                                left: coords.left + Math.round(specs.img.w / 2),
                                top: coords.top + Math.round(specs.img.h / 2),
                                opacity: "0.1",
                                width: Math.round(specs.magnifier.w / 5),
                                height: Math.round(specs.magnifier.h / 5)
                            },
                            specs.setting.magnifierspeedanimate,
                            function () {
                                specs.$magnifier.hide();
                            });
                    break;

                default:
                    specs.$magnifier.stop(true, true).fadeOut(specs.setting.magnifierspeedanimate);
            }

        },

        /* Init function start.  */
        init: function ($img, options, gallery) {

            var setting = $.extend({}, this.dsetting, options),
                basezindex = setting.zindex || this.highestzindex($img),
                img = {
                    w: $img.width(),
                    h: $img.height()
                },
                cld = new cld(),
                title = $img.attr("data-title") ? $img.attr("data-title") : '',
                help = $img.attr("data-help") ? $img.attr("data-help") : '',
                textdn = $img.attr("data-text-bottom") ? $img.attr("data-text-bottom") : '',
                self = this,
                newpower,
                key,
                $magnifier,
                $cursorshade,
                $statusdiv,
                $tracker,
                $textdn;

            if (img.h === 0 || img.w === 0) {
                $(new Image()).on('load', function () {
                    self.init($img, options);
                }).attr("src", $img.attr("src"));
                return;
            }

            $img.css({
                visibility: "visible"
            });
            setting.largeimage = $img.attr("data-large") || $img.attr("src");

            for (key in setting)
                if (setting[key] === '') setting[key] = this.dsetting[key];

            if (setting.zoomrange[0] < setting.zoomstart)
                newpower = setting.zoomstart;
            else newpower = setting.zoomrange[0];

            if (setting.magnifiersize.toString() === '0,0' ||
                setting.magnifiersize.toString() === '')
                if (setting.innerzoommagnifier)
                    setting.magnifiersize = [img.w / 2, img.h / 2];
                else setting.magnifiersize = [img.w, img.h];

            if (setting.descarea && $(setting.descarea).length) {
                if ($(setting.descarea).width() === 0 || $(setting.descarea).height() === 0)
                    setting.descarea = false;
                else setting.magnifiersize = [$(setting.descarea).width(), $(setting.descarea).height()];
            } else setting.descarea = false;

            if (setting.innerzoom) {
                setting.magnifiersize = [img.w, img.h];
                if (!options.cursorshade)
                    setting.cursorshade = false;
                if (!options.scrollspeedanimate)
                    setting.scrollspeedanimate = 10;
            }

            if (setting.innerzoommagnifier) {
                if (!options.magnifycursor)
                    if (window.chrome || window.sidebar)
                        setting.magnifycursor = "none";
                setting.cursorshade = false;
                setting.magnifiereffectanimate = "fadeIn";
            }

            function cld() {
                this.pageX999 = 0;
                this.pageY999 = 0;
            }

            function getspecs($bigimage) {

                $tracker.data("specs", {

                    setting: setting,
                    title999: title,
                    help: help,

                    $img: $img,
                    $magnifier: $magnifier,
                    $bigimage: $bigimage,
                    $statusdiv: $statusdiv,
                    $cursorshade: $cursorshade,
                    $textdn: $textdn,

                    img: img,
                    bigimage: {
                        w: $bigimage.width(),
                        h: $bigimage.height()
                    },
                    magnifier: {
                        w: $magnifier.width(),
                        h: $magnifier.height()
                    },
                    cursorshade999: {
                        w: $cursorshade.width(),
                        h: $cursorshade.height(),
                        border999: {
                            left999: parseInt($cursorshade.css("border-left-width")) || 0,
                            top999: parseInt($cursorshade.css("border-top-width")) || 0
                        }
                    },

                    currM: newpower,
                    newpower: newpower
                });

            }

            function isImageLoaded(img) {
                if (!img.complete)
                    return false;
                if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0)
                    return false;
                return true;
            }

            var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
            var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
            var lowestDelta, lowestDeltaXY;

            if ($.event.fixHooks) {
                for (var i = toFix.length; i;) {
                    $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
                }
            }

            $.event.special.mousewheel = {
                setup: function () {
                    if (this.addEventListener) {
                        for (var i = toBind.length; i;) {
                            this.addEventListener(toBind[--i], handler, false);
                        }
                    } else {
                        this.onmousewheel = handler;
                    }
                },

                teardown: function () {
                    if (this.removeEventListener) {
                        for (var i = toBind.length; i;) {
                            this.removeEventListener(toBind[--i], handler, false);
                        }
                    } else {
                        this.onmousewheel = null;
                    }
                }
            };

            function handler(event) {
                var orgEvent = event || window.event,
                    args = [].slice.call(arguments, 1),
                    delta = 0,
                    deltaX = 0,
                    deltaY = 0,
                    absDelta = 0,
                    absDeltaXY = 0,
                    fn;
                event = $.event.fix(orgEvent);
                event.type = "mousewheel";

                // Old school scrollwheel delta
                if (orgEvent.wheelDelta) {
                    delta = orgEvent.wheelDelta;
                }
                if (orgEvent.detail) {
                    delta = orgEvent.detail * -1;
                }

                // New school wheel delta (wheel event)
                if (orgEvent.deltaY) {
                    deltaY = orgEvent.deltaY * -1;
                    delta = deltaY;
                }
                if (orgEvent.deltaX) {
                    deltaX = orgEvent.deltaX;
                    delta = deltaX * -1;
                }

                // Webkit
                if (orgEvent.wheelDeltaY !== undefined) {
                    deltaY = orgEvent.wheelDeltaY;
                }
                if (orgEvent.wheelDeltaX !== undefined) {
                    deltaX = orgEvent.wheelDeltaX * -1;
                }

                // Look for lowest delta to normalize the delta values
                absDelta = Math.abs(delta);
                if (!lowestDelta || absDelta < lowestDelta) {
                    lowestDelta = absDelta;
                }
                absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
                if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
                    lowestDeltaXY = absDeltaXY;
                }

                // Get a whole value for the deltas
                fn = delta > 0 ? "floor" : "ceil";
                delta = Math[fn](delta / lowestDelta);
                deltaX = Math[fn](deltaX / lowestDeltaXY);
                deltaY = Math[fn](deltaY / lowestDeltaXY);

                // Add event and delta to the front of the arguments
                args.unshift(event, delta, deltaX, deltaY);

                return ($.event.dispatch || $.event.handle).apply(this, args);
            }

            $.fn.offsetsl = function () {
                var elem = this.get(0);

                function getOffsetSum(elem) {
                    var top999 = 0,
                        left999 = 0;
                    while (elem) {
                        top999 = top999 + parseInt(elem.offsetTop);
                        left999 = left999 + parseInt(elem.offsetLeft);
                        elem = elem.offsetParent;
                    }
                    return {
                        top: top999,
                        left: left999
                    }
                }
                if (elem.getBoundingClientRect)
                    return this.offset();
                else return getOffsetSum(elem)
            }

            $.easing.easeOutBounceSL = function (x, t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            }

            $magnifier = $("<div />")
                .attr({
                    "class": setting.classmagnifier
                })
                .css({
                    position: "absolute",
                    zIndex: basezindex,
                    width: setting.magnifiersize[0],
                    height: setting.magnifiersize[1],
                    left: -10000,
                    top: -10000,
                    visibility: "hidden",
                    overflow: "hidden"
                })
                .appendTo(document.body);

            if (!options.classmagnifier)
                $magnifier.css({
                    border: setting.magnifierborder
                });

            $cursorshade = $("<div />");
            if (setting.cursorshade) {
                $cursorshade.attr({
                        "class": setting.classcursorshade
                    })
                    .css({
                        zIndex: basezindex,
                        display: "none",
                        position: "absolute",
                        width: Math.round(setting.magnifiersize[0] / setting.zoomstart),
                        height: Math.round(setting.magnifiersize[1] / setting.zoomstart),
                        top: 0,
                        left: 0
                    })
                    .appendTo(document.body);

                if (!options.classcursorshade)
                    $cursorshade.css({
                        border: setting.cursorshadeborder,
                        opacity: setting.cursorshadeopacity,
                        backgroundColor: setting.cursorshadecolor
                    });
            }

            if (!setting.loadinggif)
                setting.loadinggif = "data:image/gif;base64,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";

            $statusdiv = $("<div />")
                .attr({
                    "class": setting.classstatusdiv + " preloadevt"
                })
                .css({
                    position: "absolute",
                    display: "none",
                    zIndex: basezindex,
                    top: 0,
                    left: 0
                })
                .html('<img src="' + setting.loadinggif + '" />')
                .appendTo(document.body);

            $tracker = $("<div />")
                .attr({
                    "class": setting.classtracker
                })
                .css({
                    zIndex: basezindex,
                    backgroundImage: self.isie ? "url(cannotbe)" : "none",
                    position: "absolute",
                    width: img.w,
                    height: img.h,
                    left: gallery ? $img.offsetsl().left : -10000,
                    top: gallery ? $img.offsetsl().top : -10000
                }).appendTo(document.body);

            $textdn = $("<div />");
            if (textdn) {
                $textdn.attr({
                        "class": setting.classtextdn
                    })
                    .css({
                        position: "absolute",
                        zIndex: basezindex,
                        left: 0,
                        top: 0,
                        display: "none"
                    })
                    .html(textdn)
                    .appendTo(document.body);
                if (!options.classtextdn)
                    $textdn.css({
                        border: setting.magnifierborder,
                        background: setting.textdnbackground,
                        padding: setting.textdnpadding,
                        font: setting.textdnfont
                    });
                $textdn.css({
                    width: setting.magnifiersize[0] - parseInt($textdn.css("padding-left")) - parseInt($textdn.css("padding-right"))
                });
            }
            $tracker.data("largeimage", setting.largeimage);


            // EVENTS			
            $(window).bind("resize", function () {
                var o = $img.offsetsl();
                if ($tracker.data("loadimgevt"))
                    $tracker.css({
                        left: o.left,
                        top: o.top
                    });
                $statusdiv.filter(".preloadevt").css({
                    left: o.left + img.w / 2 - $statusdiv.width() / 2,
                    top: o.top + img.h / 2 - $statusdiv.height() / 2,
                    visibility: 'visible'
                });
            });
            $(document).mousemove(function (e) {
                self.cld.docX = e.pageX;
                if (self.cld.pageX999 !== self.cld.docX) {
                    clearTimeout(self.cld.controlTimer);
                    clearTimeout(self.cld.controlTimer2);
                    $img.css({
                        visibility: "visible"
                    });
                }
            });
            $img.mouseover(function (e) {
                var o = $img.offsetsl();
                $tracker.css({
                    left: o.left,
                    top: o.top
                }).show();
            });
            $tracker.mouseover(function (e) {

                self.cld.pageX999 = e.pageX;
                self.cld.pageY999 = e.pageY;

                cld.pageX999 = e.pageX;
                cld.pageY999 = e.pageY;

                self.cld.docX = e.pageX;

                var o = $img.offsetsl(),
                    pageX = self.cld.pageX999 - o.left,
                    pageY = self.cld.pageY999 - o.top;

                self.cld.destK = pageX;
                self.cld.destL = pageY;

                self.cld.currU = pageX;
                self.cld.currV = pageY;

                self.cld.destM = self.cld.pageX999;
                self.cld.destN = self.cld.pageY999;

                self.cld.destU = self.cld.pageX999 - 10;
                self.cld.destV = self.cld.pageY999 + 20;

                $tracker.css({
                    cursor: setting.magnifycursor
                });
                setting.largeimage = $img.attr("data-large") || $img.attr("src");

                $statusdiv.show();
                clearTimeout(self.cld.controlTimer);
                clearTimeout(self.cld.controlTimer2);

                if (setting.largeimage !== $tracker.data('largeimage')) {

                    $(new Image()).on('load', function () {}).attr("src", setting.largeimage);

                    $($tracker).unbind();
                    $($statusdiv).remove();
                    $($cursorshade).remove();
                    $($magnifier).remove();
                    $($tracker).remove();
                    $($textdn).remove();

                    self.init($img, options, true);
                }
                if ($tracker.data("loadevt")) {
                    $cursorshade.fadeIn();
                    self.showimage($tracker);
                    self.controlLoop($tracker);
                    self.controlLoop2($tracker);
                }

            });
            $tracker.mousemove(function (e) {
                setting.largeimage = $img.attr("data-large") || $img.attr("src");
                if (setting.largeimage !== $tracker.data("largeimage")) {

                    $(new Image()).on('load', function () {}).attr("src", setting.largeimage);

                    $($tracker).unbind();
                    $($statusdiv).remove();
                    $($cursorshade).remove();
                    $($magnifier).remove();
                    $($tracker).remove();
                    $($textdn).remove();

                    self.init($img, options, true);
                }

                self.cld.pageX999 = e.pageX;
                self.cld.pageY999 = e.pageY;

                cld.pageX999 = e.pageX;
                cld.pageY999 = e.pageY;

                self.cld.docX = e.pageX;
            });
            $tracker.mouseout(function (e) {
                clearTimeout(self.cld.controlTimer);
                clearTimeout(self.cld.controlTimer2);
                $img.css({
                    visibility: "visible"
                });
                $textdn.hide();
                $cursorshade.add($statusdiv.not(".preloadevt")).stop(true, true).hide();
            });
            $tracker.one("mouseover", function (e) {

                var imgcoords = $img.offsetsl();
                var $bigimage = $('<img src="' + setting.largeimage + '"/>').css({
                    position: "relative",
                    maxWidth: "none"
                }).appendTo($magnifier);
                if (!self.loaded999[setting.largeimage]) {
                    $tracker.css({
                        opacity: setting.loadopacity,
                        background: setting.loadbackground
                    });
                    $tracker.data("loadimgevt", true);
                    $statusdiv.css({
                        left: imgcoords.left + img.w / 2 - $statusdiv.width() / 2,
                        top: imgcoords.top + img.h / 2 - $statusdiv.height() / 2,
                        visibility: 'visible'
                    });
                }
                $bigimage.bind("loadevt", function (event, e) {

                    if (e.type === "error") return;
                    $tracker.mouseout(function (e) { //image onmouseout
                        self.hideimage($tracker);
                        clearTimeout(self.cld.controlTimer);
                        clearTimeout(self.cld.controlTimer2);
                        $img.css({
                            visibility: "visible"
                        });
                        $textdn.hide();
                        $tracker.hide().css({
                            left: -10000,
                            top: -10000
                        });
                    });
                    $tracker.mouseover(function (e) { //image onmouseover
                        specs.currM = specs.newpower;
                    });
                    $tracker.data("loadimgevt", false);
                    $tracker.css({
                        opacity: 0,
                        cursor: setting.magnifycursor
                    });
                    $statusdiv.empty();
                    if (!options.classstatusdiv)
                        $statusdiv.css({
                            border: setting.statusdivborder,
                            background: setting.statusdivbackground,
                            padding: setting.statusdivpadding,
                            font: setting.statusdivfont,
                            opacity: setting.statusdivopacity
                        });
                    $statusdiv.hide().removeClass("preloadevt");
                    self.loaded999[setting.largeimage] = true;
                    getspecs($bigimage);
                    if (cld.pageX999 == self.cld.docX) {
                        $cursorshade.fadeIn();
                        self.showimage($tracker);
                        clearTimeout(self.cld.controlTimer);
                        clearTimeout(self.cld.controlTimer2);
                        self.controlLoop($tracker);
                        self.controlLoop2($tracker);
                    }

                    var specs = $tracker.data("specs");
                    $bigimage.css({
                        width: setting.zoomstart * specs.bigimage.w * (img.w / specs.bigimage.w),
                        height: setting.zoomstart * specs.bigimage.h * (img.h / specs.bigimage.h)
                    });
                    $tracker.data("loadevt", true);

                    if (setting.zoomrange && setting.zoomrange[1] > setting.zoomrange[0]) { //if zoom range enabled
                        $tracker.bind("mousewheel", function (e, delta) {
                            var zoomdir = delta < 0 ? "out" : "in",
                                power = specs.newpower,
                                newpower = (zoomdir == "in") ? Math.min(power + setting.stepzoom, setting.zoomrange[1]) : Math.max(power - setting.stepzoom, setting.zoomrange[0]);

                            specs.newpower = newpower;
                            specs.delta = delta;
                            e.preventDefault();
                        });

                    } else if (setting.disablewheel) {
                        $tracker.bind("mousewheel", function (e) {
                            e.preventDefault();
                        });
                    }

                }); //end $bigimage onload */

                if (isImageLoaded($bigimage.get(0)))
                    $bigimage.trigger("loadevt", {
                        type: "load"
                    });
                else $bigimage.bind("load error", function (e) {
                    $bigimage.trigger("loadevt", e)
                });
            });
        },
        loaded999: {}
    });
})(jQuery, window);