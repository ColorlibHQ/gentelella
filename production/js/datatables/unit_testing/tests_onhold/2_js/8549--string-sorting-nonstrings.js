// DATA_TEMPLATE: empty_table
oTest.fnStart( "8549 - string sorting non-string types" );

$(document).ready( function () {
	var test = false;

	$.fn.dataTable.ext.sErrMode = "throw";



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Shallow properties
	 */
	
	$('#example').dataTable( {
		"aaData": [
			[ null ],
			[ 5 ],
			[ "1a" ],
			[ new Date(0) ]
		],
		"aoColumns": [
			{ "sTitle": "Test" }
		]
	} );
	
	oTest.fnTest( 
		"Sorting works - first cell is empty",
		null,
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() === ""; }
	);
	
	oTest.fnTest( 
		"Second cell is 1a",
		null,
		function () { return $('#example tbody tr:eq(1) td:eq(0)').html() === "1a"; }
	);
	
	oTest.fnTest( 
		"Third cell is 5",
		null,
		function () { return $('#example tbody tr:eq(2) td:eq(0)').html() === "5"; }
	);
	
	
	oTest.fnComplete();
} );