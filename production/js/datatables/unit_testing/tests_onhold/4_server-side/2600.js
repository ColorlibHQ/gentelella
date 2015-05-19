// DATA_TEMPLATE: empty_table
oTest.fnStart( "2600 - Display rewind when changing length" );

$(document).ready( function () {
	$('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php"
	} );
	
	oTest.fnWaitTest( 
		"Info correct on init",
		null,
		function () { return $('#example_info').html() == "Showing 1 to 10 of 57 entries"; }
	);
	
	oTest.fnWaitTest( 
		"Page 2",
		function () { $('#example_next').click(); },
		function () { return $('#example_info').html() == "Showing 11 to 20 of 57 entries"; }
	);
	
	oTest.fnWaitTest( 
		"Page 3",
		function () { $('#example_next').click(); },
		function () { return $('#example_info').html() == "Showing 21 to 30 of 57 entries"; }
	);
	
	oTest.fnWaitTest( 
		"Page 4",
		function () { $('#example_next').click(); },
		function () { return $('#example_info').html() == "Showing 31 to 40 of 57 entries"; }
	);
	
	oTest.fnWaitTest( 
		"Page 5",
		function () { $('#example_next').click(); },
		function () { return $('#example_info').html() == "Showing 41 to 50 of 57 entries"; }
	);
	
	oTest.fnWaitTest( 
		"Rewind",
		function () { $('#example_length select').val('100'); $('#example_length select').change(); },
		function () { return $('#example_info').html() == "Showing 1 to 57 of 57 entries"; }
	);
	
	oTest.fnComplete();
} );