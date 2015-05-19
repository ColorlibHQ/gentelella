// DATA_TEMPLATE: dom_data
oTest.fnStart( "bSort" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable();
	
	oTest.fnTest( 
		"Sorting is on by default",
		null,
		function () { return $('#example tbody td:eq(0)').html() == "Gecko"; }
	);
	
	oTest.fnTest( 
		"Sorting Asc by default class applied",
		null,
		function () { return $('#example thead th:eq(0)').hasClass("sorting_asc"); }
	);
	
	oTest.fnTest(
		"Click on second column",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnTest( 
		"Sorting class removed from first column",
		null,
		function () { return $('#example thead th:eq(0)').hasClass("sorting_asc") != true; }
	);
	
	oTest.fnTest( 
		"Sorting asc class applied to second column",
		null,
		function () { return $('#example thead th:eq(1)').hasClass("sorting_asc"); }
	);
	
	oTest.fnTest(
		"Reverse on second column",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	oTest.fnTest( 
		"Sorting acs class removed from second column",
		null,
		function () { return $('#example thead th:eq(1)').hasClass("sorting_asc") != true; }
	);
	
	oTest.fnTest( 
		"Sorting desc class applied to second column",
		null,
		function () { return $('#example thead th:eq(1)').hasClass("sorting_desc"); }
	);
	
	/* Check can disable */
	oTest.fnTest( 
		"Pagiantion can be disabled",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"bSort": false
			} );
		},
		function () { return $('#example tbody td:eq(3)').html() == "4"; }
	);
	
	oTest.fnTest(
		"Disabled classes applied",
		null,
		function () { return $('#example thead th:eq(0)').hasClass('sorting_disabled'); }
	);
	
	oTest.fnTest(
		"Click on second column has no effect",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(3)').html() == "4"; }
	);
	
	oTest.fnTest(
		"Reverse on second column has no effect",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(3)').html() == "4"; }
	);
	
	/* Enable makes no difference */
	oTest.fnTest( 
		"Sorting enabled override",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"bSort": true
			} );
		},
		function () { return $('#example tbody td:eq(0)').html() == "Gecko"; }
	);
	
	
	
	oTest.fnComplete();
} );