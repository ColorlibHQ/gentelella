// DATA_TEMPLATE: js_data
oTest.fnStart( "sPaginationType" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Check two button paging is the default",
		null,
		function () { return oSettings.sPaginationType == "two_button"; }
	);
	
	oTest.fnTest( 
		"Check class is applied",
		null,
		function () { return $('#example_paginate').hasClass('paging_two_button'); }
	);
	
	oTest.fnTest( 
		"Two A elements are in the wrapper",
		null,
		function () { return $('#example_paginate a').length == 2; }
	);
	
	oTest.fnTest( 
		"We have the previous button",
		null,
		function () { return document.getElementById('example_previous'); }
	);
	
	oTest.fnTest( 
		"We have the next button",
		null,
		function () { return document.getElementById('example_next'); }
	);
	
	oTest.fnTest( 
		"Previous button is disabled",
		null,
		function () { return $('#example_previous').hasClass('paginate_disabled_previous'); }
	);
	
	oTest.fnTest( 
		"Next button is enabled",
		null,
		function () { return $('#example_next').hasClass('paginate_enabled_next'); }
	);
	
	/* Don't test paging - that's done by the zero config test script. */
	
	
	/* Two buttons paging */
	oTest.fnTest( 
		"Can enabled full numbers paging",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"sPaginationType": "full_numbers"
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.sPaginationType == "full_numbers"; }
	);
	
	oTest.fnTest( 
		"Check full numbers class is applied",
		null,
		function () { return $('#example_paginate').hasClass('paging_full_numbers'); }
	);
	
	
	var nFirst, nPrevious, nNext, nLast;
	oTest.fnTest( 
		"Jump to last page",
		function () {
			nFirst = $('div.dataTables_paginate a.first');
			nPrevious = $('div.dataTables_paginate a.previous');
			nNext = $('div.dataTables_paginate a.next');
			nLast = $('div.dataTables_paginate a.last');
			nLast.click();
		},
		function () {
			return document.getElementById('example_info').innerHTML == "Showing 51 to 57 of 57 entries";
		}
	);
	
	oTest.fnTest( 
		"Go to two pages previous",
		function () {
			nPrevious.click();
			nPrevious.click();
		},
		function () {
			return document.getElementById('example_info').innerHTML == "Showing 31 to 40 of 57 entries";
		}
	);
	
	oTest.fnTest( 
		"Next (second last) page",
		function () {
			nNext.click();
		},
		function () {
			return document.getElementById('example_info').innerHTML == "Showing 41 to 50 of 57 entries";
		}
	);
	
	oTest.fnTest( 
		"Jump to first page",
		function () {
			nFirst.click();
		},
		function () {
			return document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries";
		}
	);
	
	
	oTest.fnComplete();
} );