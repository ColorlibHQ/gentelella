// DATA_TEMPLATE: dom_data
oTest.fnStart( "bInfiniteScroll" );


$(document).ready( function () {
	var oTable = $('#example').dataTable( {
		"bScrollInfinite": true,
		"sScrollY": "200px"
	} );
	
	oTest.fnTest( 
		"10 rows by default",
		null,
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnTest( 
		"Info",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 10 of 57 entries"; }
	);
	
	oTest.fnTest( 
		"Get nodes",
		null,
		function () { return $('#example tbody>tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Scroll on 20px adds 10 rows",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Info after 20px scroll",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 20 of 57 entries"; }
	);
	
	oTest.fnTest( 
		"Get nodes after 20px scroll",
		null,
		function () { return $('#example tbody>tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Scroll on 10px more results in the same number of rows",
		function () { $('div.dataTables_scrollBody').scrollTop(30); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Info after 10 more px scroll",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 20 of 57 entries"; }
	);
	
	oTest.fnWaitTest( 
		"Scroll to 240px adds another 10 rows",
		function () { $('div.dataTables_scrollBody').scrollTop(240); },
		function () { return $('#example tbody tr').length == 30; }
	);
	
	oTest.fnTest( 
		"Info after 240px scroll",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 30 of 57 entries"; }
	);
	
	oTest.fnTest( 
		"Get nodes after 240px scroll",
		null,
		function () { return $('#example tbody>tr').length == 30; }
	);
	
	oTest.fnTest( 
		"Filtering will drop back to 10 rows",
		function () { 
			$('div.dataTables_scrollBody').scrollTop(0);
			oTable.fnFilter('gec')
		},
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnTest( 
		"Info after filtering",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 10 of 20 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest( 
		"Get nodes after filtering",
		null,
		function () { return $('#example tbody>tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Scroll after filtering adds 10",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Get nodes after filtering",
		null,
		function () { return $('#example tbody>tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Sorting will drop back to 10 rows",
		function () { oTable.fnSort([[1,'asc']]) },
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Scroll after sorting adds 10",
		function () { $('div.dataTables_scrollBody').scrollTop(20); },
		function () { return $('#example tbody tr').length == 20; }
	);
	
	oTest.fnTest( 
		"Get nodes after scrolling",
		null,
		function () { return $('#example tbody>tr').length == 20; }
	);
	
	
	oTest.fnComplete();
} );