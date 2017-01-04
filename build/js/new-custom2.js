/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args); 
                timeout = null; 
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100); 
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

	
	
// Sidebar
function init_sidebar() {
// TODO: This is some kind of easy fix, maybe we can improve this
var setContentHeight = function () {
	// reset height
	$RIGHT_COL.css('min-height', $(window).height());

	var bodyHeight = $BODY.outerHeight(),
		footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
		leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
		contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

	// normalize content
	contentHeight -= $NAV_MENU.height() + footerHeight;

	$RIGHT_COL.css('min-height', contentHeight);
};

  $SIDEBAR_MENU.find('a').on('click', function(ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }else
            {
				if ( $BODY.is( ".nav-sm" ) )
				{
					$SIDEBAR_MENU.find( "li" ).removeClass( "active active-sm" );
					$SIDEBAR_MENU.find( "li ul" ).slideUp();
				}
			}
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

// toggle small or large menu
$MENU_TOGGLE.on('click', function() {
		if ($BODY.hasClass('nav-md')) {
			$SIDEBAR_MENU.find('li.active ul').hide();
			$SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
		} else {
			$SIDEBAR_MENU.find('li.active-sm ul').show();
			$SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
		}

	$BODY.toggleClass('nav-md nav-sm');

	setContentHeight();
});

	// check active menu
	$SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

	$SIDEBAR_MENU.find('a').filter(function () {
		return this.href == CURRENT_URL;
	}).parent('li').addClass('current-page').parents('ul').slideDown(function() {
		setContentHeight();
	}).parent().addClass('active');

	// recompute content when resizing
	$(window).smartresize(function(){  
		setContentHeight();
	});

	setContentHeight();

	// fixed sidebar
	if ($.fn.mCustomScrollbar) {
		$('.menu_fixed').mCustomScrollbar({
			autoHideScrollbar: true,
			theme: 'minimal',
			mouseWheel:{ preventDefault: true }
		});
	}
};
// /Sidebar



// Panel toolbox
$(document).ready(function() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');
        
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200); 
            $BOX_PANEL.css('height', 'auto');  
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function() {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery


// iCheck
$(document).ready(function() {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck


// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}



// Accordion
$(document).ready(function() {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}


	function gd(year, month, day) {
		return new Date(year, month - 1, day).getTime();
	}
	  
	function init_flot_chart(){
		
		if( typeof ($.plot) === 'undefined'){ return; }
		
		console.log('init_flot_chart');
		
		
		
		 var arr_data1 = [
		  [gd(2012, 1, 1), 17],
		  [gd(2012, 1, 2), 74],
		  [gd(2012, 1, 3), 6],
		  [gd(2012, 1, 4), 39],
		  [gd(2012, 1, 5), 20],
		  [gd(2012, 1, 6), 85],
		  [gd(2012, 1, 7), 7]
		];

		var arr_data2 = [
		  [gd(2012, 1, 1), 82],
		  [gd(2012, 1, 2), 23],
		  [gd(2012, 1, 3), 66],
		  [gd(2012, 1, 4), 9],
		  [gd(2012, 1, 5), 119],
		  [gd(2012, 1, 6), 6],
		  [gd(2012, 1, 7), 9]
		];
		
		var arr_data3 = [
			[0, 1],
			[1, 9],
			[2, 6],
			[3, 10],
			[4, 5],
			[5, 17],
			[6, 6],
			[7, 10],
			[8, 7],
			[9, 11],
			[10, 35],
			[11, 9],
			[12, 12],
			[13, 5],
			[14, 3],
			[15, 4],
			[16, 9]
		];
		
		
	
	
		//flot options
		var plot3_options = {
		  series: {
			curvedLines: {
			  apply: true,
			  active: true,
			  monotonicFit: true
			}
		  },
		  colors: ["#26B99A"],
		  grid: {
			borderWidth: {
			  top: 0,
			  right: 0,
			  bottom: 1,
			  left: 1
			},
			borderColor: {
			  bottom: "#7F8790",
			  left: "#7F8790"
			}
		  }
		};
		
		
		var plot2_options = {
		  series: {
			lines: {
			  show: false,
			  fill: true
			},
			splines: {
			  show: true,
			  tension: 0.4,
			  lineWidth: 1,
			  fill: 0.4
			},
			points: {
			  radius: 0,
			  show: true
			},
			shadowSize: 2
		  },
		  grid: {
			verticalLines: true,
			hoverable: true,
			clickable: true,
			tickColor: "#d5d5d5",
			borderWidth: 1,
			color: '#fff'
		  },
		  colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
		  xaxis: {
			tickColor: "rgba(51, 51, 51, 0.06)",
			mode: "time",
			tickSize: [1, "day"],
			//tickLength: 10,
			axisLabel: "Date",
			axisLabelUseCanvas: true,
			axisLabelFontSizePixels: 12,
			axisLabelFontFamily: 'Verdana, Arial',
			axisLabelPadding: 10
		  },
		  yaxis: {
			ticks: 8,
			tickColor: "rgba(51, 51, 51, 0.06)",
		  },
		  tooltip: false
		};
		
		console.log('Placeholder: ' + $("#placeholder33x").length );
		
		var plot = $.plot($("#placeholder33x"), [{
		  label: "Registrations",
		  data: arr_data3,
		  lines: {
			fillColor: "rgba(150, 202, 89, 0.12)"
		  }, 
			points: {
				fillColor: "#fff"
			}
		}], plot3_options);
		/*
		*/
		
		
		$("#canvas_dahs").length && $.plot($("#canvas_dahs"), [
		  arr_data1, arr_data2
		], plot2_options);
		
		
		function flot2(){ 
		
			if(typeof ($.plot) === 'undefined'){ return; }
			console.log('init_flot_chart2'); 
			
			//define chart clolors ( you maybe add more colors if you want or flot will add it automatic )
			var chartColours = ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'];

			//generate random number for charts
			randNum = function() {
			  return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
			};

			var d1 = [];
			//var d2 = [];

			//here we generate data for chart
			for (var i = 0; i < 30; i++) {
			  d1.push([new Date(Date.today().add(i).days()).getTime(), randNum() + i + i + 10]);
			  //    d2.push([new Date(Date.today().add(i).days()).getTime(), randNum()]);
			}

			var chartMinDate = d1[0][0]; //first day
			var chartMaxDate = d1[20][0]; //last day

			var tickSize = [1, "day"];
			var tformat = "%d/%m/%y";

			//graph options
			var options = {
			  grid: {
				show: true,
				aboveData: true,
				color: "#3f3f3f",
				labelMargin: 10,
				axisMargin: 0,
				borderWidth: 0,
				borderColor: null,
				minBorderMargin: 5,
				clickable: true,
				hoverable: true,
				autoHighlight: true,
				mouseActiveRadius: 100
			  },
			  series: {
				lines: {
				  show: true,
				  fill: true,
				  lineWidth: 2,
				  steps: false
				},
				points: {
				  show: true,
				  radius: 4.5,
				  symbol: "circle",
				  lineWidth: 3.0
				}
			  },
			  legend: {
				position: "ne",
				margin: [0, -25],
				noColumns: 0,
				labelBoxBorderColor: null,
				labelFormatter: function(label, series) {
				  // just add some space to labes
				  return label + '&nbsp;&nbsp;';
				},
				width: 40,
				height: 1
			  },
			  colors: chartColours,
			  shadowSize: 0,
			  tooltip: true, //activate tooltip
			  tooltipOpts: {
				content: "%s: %y.0",
				xDateFormat: "%d/%m",
				shifts: {
				  x: -30,
				  y: -50
				},
				defaultTheme: false
			  },
			  yaxis: {
				min: 0
			  },
			  xaxis: {
				mode: "time",
				minTickSize: tickSize,
				timeformat: tformat,
				min: chartMinDate,
				max: chartMaxDate
			  }
			};
			var plot = $.plot($("#placeholder33x"), [{
			  label: "Email Sent",
			  data: d1,
			  lines: {
				fillColor: "rgba(150, 202, 89, 0.12)"
			  }, //#96CA59 rgba(150, 202, 89, 0.42)
			  points: {
				fillColor: "#fff"
			  }
			}], options);
			
		}
	
	} 
	
	
	function init_JQVmap(){

		//console.log('check init_JQVmap [' + typeof (VectorCanvas) + '][' + typeof (jQuery.fn.vectorMap) + ']' );	
		
		if(typeof (jQuery.fn.vectorMap) === 'undefined'){ return; }
		
		console.log('init_JQVmap');
	     
			$('#world-map-gdp').vectorMap({
				map: 'world_en',
				backgroundColor: null,
				color: '#ffffff',
				hoverOpacity: 0.7,
				selectedColor: '#666666',
				enableZoom: true,
				showTooltip: true,
				values: sample_data,
				scaleColors: ['#E6F2F0', '#149B7E'],
				normalizeFunction: 'polynomial'
			});
	};
			
	    
	function init_skycons(){
				
			if( typeof (Skycons) === 'undefined'){ return; }
			console.log('init_skycons');
		
			var icons = new Skycons({
				"color": "#73879C"
			  }),
			  list = [
				"clear-day", "clear-night", "partly-cloudy-day",
				"partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
				"fog"
			  ],
			  i;

			for (i = list.length; i--;)
			  icons.set(list[i], list[i]);

			icons.play();
	
	}  
	   
	   
	function init_chart_doughnut(){
				
			if( typeof (Chart) === 'undefined'){ return; }
			console.log('init_chart_doughnut');
	 
		if ($('.canvasDoughnut').length){
			
			var chart_doughnut_el = $('.canvasDoughnut');
			var chart_doughnut_options = { legend: false, responsive: false };
			var chart_doughnut_settings = {
					  type: 'doughnut',
					  tooltipFillColor: "rgba(51, 51, 51, 0.55)",
					  data: {
						labels: [
						  "Symbian",
						  "Blackberry",
						  "Other",
						  "Android",
						  "IOS"
						],
						datasets: [{
						  data: [15, 20, 30, 10, 30],
						  backgroundColor: [
							"#BDC3C7",
							"#9B59B6",
							"#E74C3C",
							"#26B99A",
							"#3498DB"
						  ],
						  hoverBackgroundColor: [
							"#CFD4D8",
							"#B370CF",
							"#E95E4F",
							"#36CAAB",
							"#49A9EA"
						  ]
						}]
					  },
					  options: chart_doughnut_options
					}
		
			var chart_doughnut = new Chart(chart_doughnut_el, chart_doughnut_settings);
		
		}  
	   
	}
	   
	function init_gauge() {
			
		if( typeof (Gauge) === 'undefined'){ return; }
		console.log('init_gauge');

		  var opts = {
		  lines: 12,
		  angle: 0,
		  lineWidth: 0.4,
		  pointer: {
			  length: 0.75,
			  strokeWidth: 0.042,
			  color: '#1D212A'
		  },
		  limitMax: 'false',
		  colorStart: '#1ABC9C',
		  colorStop: '#1ABC9C',
		  strokeColor: '#F0F3F3',
		  generateGradient: true
	  };
	  var target = document.getElementById('foo'),
		  gauge = new Gauge(target).setOptions(opts);

	  gauge.maxValue = 6000;
	  gauge.animationSpeed = 32;
	  gauge.set(3200);
	  gauge.setTextField(document.getElementById("gauge-text"));
	
	}   
	   
	 /* BOOTSTRAP DATERANGEPICKER */
			
	//1
	function init_bootstrap_daterangepicker() {
		
		if( typeof (daterangepicker) === 'undefined'){ return; }
		console.log('init_bootstrap_daterangepicker');
		
		var cb = function(start, end, label) {
		  console.log(start.toISOString(), end.toISOString(), label);
		  $('#reportrange_right span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		};

		var optionSet1 = {
		  startDate: moment().subtract(29, 'days'),
		  endDate: moment(),
		  minDate: '01/01/2012',
		  maxDate: '12/31/2020',
		  dateLimit: {
			days: 60
		  },
		  showDropdowns: true,
		  showWeekNumbers: true,
		  timePicker: false,
		  timePickerIncrement: 1,
		  timePicker12Hour: true,
		  ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		  },
		  opens: 'right',
		  buttonClasses: ['btn btn-default'],
		  applyClass: 'btn-small btn-primary',
		  cancelClass: 'btn-small',
		  format: 'MM/DD/YYYY',
		  separator: ' to ',
		  locale: {
			applyLabel: 'Submit',
			cancelLabel: 'Clear',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			firstDay: 1
		  }
		};

		$('#reportrange_right span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

		$('#reportrange_right').daterangepicker(optionSet1, cb);

		$('#reportrange_right').on('show.daterangepicker', function() {
		  console.log("show event fired");
		});
		$('#reportrange_right').on('hide.daterangepicker', function() {
		  console.log("hide event fired");
		});
		$('#reportrange_right').on('apply.daterangepicker', function(ev, picker) {
		  console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
		});
		$('#reportrange_right').on('cancel.daterangepicker', function(ev, picker) {
		  console.log("cancel event fired");
		});

		$('#options1').click(function() {
		  $('#reportrange_right').data('daterangepicker').setOptions(optionSet1, cb);
		});

		$('#options2').click(function() {
		  $('#reportrange_right').data('daterangepicker').setOptions(optionSet2, cb);
		});

		$('#destroy').click(function() {
		  $('#reportrange_right').data('daterangepicker').remove();
		});
		
	};  
	   
	/* SPARKLINES */
			
		function init_sparklines() {
			
			if( typeof (sparkline) === 'undefined'){ return; }
			console.log('init_sparklines');
			
			
			 $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
			  type: 'bar',
			  height: '125',
			  barWidth: 13,
			  colorMap: {
				'7': '#a1a1a1'
			  },
			  barSpacing: 2,
			  barColor: '#26B99A'
			});
			
			  $(".sparkline_two").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
				  type: 'bar',
				  height: '40',
				  barWidth: 9,
				  colorMap: {
					'7': '#a1a1a1'
				  },
				  barSpacing: 2,
				  barColor: '#26B99A'
				});

				$(".sparkline_three").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
				  type: 'line',
				  width: '200',
				  height: '40',
				  lineColor: '#26B99A',
				  fillColor: 'rgba(223, 223, 223, 0.57)',
				  lineWidth: 2,
				  spotColor: '#26B99A',
				  minSpotColor: '#26B99A'
				});
			
			$(".sparkline11").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3], {
			  type: 'bar',
			  height: '40',
			  barWidth: 8,
			  colorMap: {
				'7': '#a1a1a1'
			  },
			  barSpacing: 2,
			  barColor: '#26B99A'
			});
			
			 $(".sparkline22").sparkline([2, 4, 3, 4, 7, 5, 4, 3, 5, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6], {
			  type: 'line',
			  height: '40',
			  width: '200',
			  lineColor: '#26B99A',
			  fillColor: '#ffffff',
			  lineWidth: 3,
			  spotColor: '#34495E',
			  minSpotColor: '#34495E'
			});
	
			$(".sparkline_bar").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
			  type: 'bar',
			  colorMap: {
				'7': '#a1a1a1'
			  },
			  barColor: '#26B99A'
			});
			
			$(".sparkline_area").sparkline([5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
			  type: 'line',
			  lineColor: '#26B99A',
			  fillColor: '#26B99A',
			  spotColor: '#4578a0',
			  minSpotColor: '#728fb2',
			  maxSpotColor: '#6d93c4',
			  highlightSpotColor: '#ef5179',
			  highlightLineColor: '#8ba8bf',
			  spotRadius: 2.5,
			  width: 85
			});

			$(".sparkline_line").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
			  type: 'line',
			  lineColor: '#26B99A',
			  fillColor: '#ffffff',
			  width: 85,
			  spotColor: '#34495E',
			  minSpotColor: '#34495E'
			});

			$(".sparkline_pie").sparkline([1, 1, 2, 1], {
			  type: 'pie',
			  sliceColors: ['#26B99A', '#ccc', '#75BCDD', '#D66DE2']
			});

			$(".sparkline_discreet").sparkline([4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 2, 4, 3, 7, 8, 9, 7, 6, 4, 3], {
			  type: 'discrete',
			  barWidth: 3,
			  lineColor: '#26B99A',
			  width: '85',
			});
			
		};   
	   
	$(document).ready(function() {
				
				init_sparklines();
				init_flot_chart();
				init_sidebar();
				init_JQVmap();
				init_skycons();
				init_chart_doughnut();
				init_gauge();
				init_bootstrap_daterangepicker();
				
	});	
	

