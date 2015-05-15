// DATA_TEMPLATE: dom_data
oTest.fnStart( "2635 - Hiding column and state saving" );

$(document).ready( function () {
	$('#example').dataTable( {
		"bStateSave": true
	} );
	
	oTest.fnTest( 
		"Set the hidden column",
		function () {
			$('#example').dataTable().fnSetColumnVis( 2, false );
		},
		function () { return $('#example thead th').length == 4; }
	);
	
	oTest.fnTest( 
		"Destroy the table and remake it - checking one column was removed",
		function () {
			$('#example').dataTable( {
				"bStateSave": true,
				"bDestroy": true
			} );
		},
		function () { return $('#example thead th').length == 4; }
	);
	
	oTest.fnTest( 
		"Do it again without state saving and make sure we are back to 5 columns",
		function () {
			$('#example').dataTable( {
				"bDestroy": true
			} );
		},
		function () { return $('#example thead th').length == 5; }
	);
	
	oTest.fnCookieDestroy( $('#example').dataTable() );
	oTest.fnComplete();
} );