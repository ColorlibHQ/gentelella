// DATA_TEMPLATE: js_data
oTest.fnStart( "iDisplayLength" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable( {
		"aaData": gaaData
	} );
	
	oTest.fnTest( 
		"Default length is ten",
		null,
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnTest( 
		"Select menu shows 10",
		null,
		function () { return $('#example_length select').val() == 10; }
	);
	
	
	oTest.fnTest( 
		"Set initial length to 25",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaData": gaaData,
				"iDisplayLength": 25
			} );
		},
		function () { return $('#example tbody tr').length == 25; }
	);
	
	oTest.fnTest( 
		"Select menu shows 25",
		null,
		function () { return $('#example_length select').val() == 25; }
	);
	
	
	oTest.fnTest( 
		"Set initial length to 100",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaData": gaaData,
				"iDisplayLength": 100
			} );
		},
		function () { return $('#example tbody tr').length == 57; }
	);
	
	oTest.fnTest( 
		"Select menu shows 25",
		null,
		function () { return $('#example_length select').val() == 100; }
	);
	
	
	oTest.fnTest( 
		"Set initial length to 23 (unknown select menu length)",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaData": gaaData,
				"iDisplayLength": 23
			} );
		},
		function () { return $('#example tbody tr').length == 23; }
	);
	
	oTest.fnTest( 
		"Select menu shows 10 (since 23 is unknow)",
		null,
		function () { return $('#example_length select').val() == 10; }
	);
	
	
	oTest.fnComplete();
} );