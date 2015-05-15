// DATA_TEMPLATE: dom_data
oTest.fnStart( "fnFilter" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable();
	oTable.fnFilter(1);
	
	oTest.fnTest( 
		"Filtering with a non-string input is valid",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 10 of 32 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnComplete();
} );