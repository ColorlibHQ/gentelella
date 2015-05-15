// DATA_TEMPLATE: dom_data
oTest.fnStart( "2914 - State saving with an empty array" );

$(document).ready( function () {
	document.cookie = "";
	$('#example').dataTable( {
		"bStateSave": true,
		"aaSorting": []
	} );
	
	oTest.fnTest( 
		"No sort",
		null,
		function () { return $('#example tbody td:eq(3)').html() == "4"; }
	);
	
	oTest.fnTest( 
		"Next page",
		function () {
			$('#example').dataTable().fnPageChange( 'next' );
		},
		function () { return $('#example tbody td:eq(1)').html() == "Camino 1.0"; }
	);
	
	oTest.fnTest( 
		"Destroy the table and remake it - checking we are still on the next page",
		function () {
			$('#example').dataTable( {
				"bStateSave": true,
					"aaSorting": [],
				"bDestroy": true
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "Camino 1.0"; }
	);
	
	oTest.fnCookieDestroy( $('#example').dataTable() );
	oTest.fnComplete();
} );