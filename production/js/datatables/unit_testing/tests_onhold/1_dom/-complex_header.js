// DATA_TEMPLATE: -complex_header
oTest.fnStart( "Complex header" );


$(document).ready( function () {
	$('#example').dataTable();
	
	oTest.fnTest( 
		"Sorting on colspan has no effect",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr td:eq(1)').html() == "Firefox 1.0"; }
	);
	
	oTest.fnTest( 
		"Sorting on non-unique TH and first TH has no effect",
		function () { $('#example thead th:eq(2)').click(); },
		function () { return $('#example tbody tr td:eq(1)').html() == "Firefox 1.0"; }
	);
	
	oTest.fnTest( 
		"Sorting on non-unique TH and second TH will sort",
		function () { $('#example thead th:eq(6)').click(); },
		function () { return $('#example tbody tr td:eq(4)').html() == "A"; }
	);
	
	oTest.fnTest( 
		"Sorting on non-unique TH and second TH will sort - reserve",
		function () { $('#example thead th:eq(6)').click(); },
		function () { return $('#example tbody tr td:eq(4)').html() == "X"; }
	);
	
	oTest.fnTest( 
		"Sorting on unique TH will sort",
		function () { $('#example thead th:eq(5)').click(); },
		function () { return $('#example tbody tr td:eq(3)').html() == "-"; }
	);
	
	oTest.fnTest( 
		"Sorting on unique TH will sort - reserve",
		function () { $('#example thead th:eq(5)').click(); },
		function () { return $('#example tbody tr td:eq(3)').html() == "522.1"; }
	);
	
	oTest.fnTest( 
		"Sorting on unique rowspan TH will sort",
		function () { $('#example thead th:eq(0)').click(); },
		function () { return $('#example tbody tr td:eq(0)').html() == "Gecko"; }
	);
	
	
	oTest.fnComplete();
} );