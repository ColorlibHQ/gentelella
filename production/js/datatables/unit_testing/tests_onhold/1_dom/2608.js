// DATA_TEMPLATE: dom_data
oTest.fnStart( "2608 - State saving escaping filters" );

$(document).ready( function () {
	$('#example').dataTable( {
		"bStateSave": true
	} );
	
	oTest.fnTest( 
		"Set the filter",
		function () {
			$('#example_filter input').val( '\\s*CVM\\s*$' );
			$('#example_filter input').keyup();
		},
		function () { return $('#example_filter input').val() == '\\s*CVM\\s*$'; }
	);
	
	oTest.fnTest( 
		"Destroy the table and remake it - checking the filter was saved",
		function () {
			$('#example').dataTable( {
				"bStateSave": true,
				"bDestroy": true
			} );
		},
		function () { return $('#example_filter input').val() == '\\s*CVM\\s*$'; }
	);
	
	oTest.fnTest( 
		"Do it again without state saving and make sure filter is empty",
		function () {
			$('#example').dataTable( {
				"bDestroy": true
			} );
		},
		function () { return $('#example_filter input').val() == ''; }
	);
	
	oTest.fnTest( 
		"Clean up",
		function () {
			$('#example').dataTable( {
				"bStateSave": true,
				"bDestroy": true
			} );
			$('#example_filter input').val( '' );
			$('#example_filter input').keyup();
		},
		function () { return $('#example_filter input').val() == ''; }
	);
	
	oTest.fnCookieDestroy( $('#example').dataTable() );
	oTest.fnComplete();
} );