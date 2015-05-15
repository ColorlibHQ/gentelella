// DATA_TEMPLATE: empty_table
oTest.fnStart( "bSort" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/arrays.txt"
	} );
	
	oTest.fnWaitTest( 
		"Sorting is on by default",
		null,
		function () { return $('#example tbody td:eq(0)').html() == "Gecko"; }
	);
	
	oTest.fnWaitTest( 
		"Sorting Asc by default class applied",
		null,
		function () { return $('#example thead th:eq(0)').hasClass("sorting_asc"); }
	);
	
	oTest.fnWaitTest(
		"Click on second column",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnWaitTest( 
		"Sorting class removed from first column",
		null,
		function () { return $('#example thead th:eq(0)').hasClass("sorting_asc") != true; }
	);
	
	oTest.fnWaitTest( 
		"Sorting asc class applied to second column",
		null,
		function () { return $('#example thead th:eq(1)').hasClass("sorting_asc"); }
	);
	
	oTest.fnWaitTest(
		"Reverse on second column",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	oTest.fnWaitTest( 
		"Sorting acs class removed from second column",
		null,
		function () { return $('#example thead th:eq(1)').hasClass("sorting_asc") != true; }
	);
	
	oTest.fnWaitTest( 
		"Sorting desc class applied to second column",
		null,
		function () { return $('#example thead th:eq(1)').hasClass("sorting_desc"); }
	);
	
	/* Check can disable */
	oTest.fnWaitTest( 
		"Pagiantion can be disabled",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bSort": false
			} );
		},
		function () { return $('#example tbody td:eq(3)').html() == "4"; }
	);
	
	oTest.fnWaitTest(
		"Click on second column has no effect",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(3)').html() == "4"; }
	);
	
	oTest.fnWaitTest(
		"Reverse on second column has no effect",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(3)').html() == "4"; }
	);
	
	/* Enable makes no difference */
	oTest.fnWaitTest( 
		"Sorting enabled override",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bSort": true
			} );
		},
		function () { return $('#example tbody td:eq(0)').html() == "Gecko"; }
	);
	
	
	
	oTest.fnComplete();
} );