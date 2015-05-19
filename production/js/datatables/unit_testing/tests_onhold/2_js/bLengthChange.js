// DATA_TEMPLATE: js_data
oTest.fnStart( "bLengthChange" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable( {
		"aaData": gaaData
	} );
	
	oTest.fnTest( 
		"Length div exists by default",
		null,
		function () { return document.getElementById('example_length') != null; }
	);
	
	oTest.fnTest(
		"Four default options",
		null,
		function () { return $("select[name=example_length] option").length == 4; }
	);
	
	oTest.fnTest(
		"Default options",
		null,
		function () {
			var opts = $("select[name='example_length'] option");
			return opts[0].getAttribute('value') == 10 && opts[1].getAttribute('value') == 25 &&
				opts[2].getAttribute('value') == 50 && opts[3].getAttribute('value') == 100;
		}
	);
	
	oTest.fnTest(
		"Info takes length into account",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 57 entries"; }
	);
	
	/* Check can disable */
	oTest.fnTest( 
		"Change length can be disabled",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaData": gaaData,
				"bLengthChange": false
			} );
		},
		function () { return document.getElementById('example_length') == null; }
	);
	
	oTest.fnTest(
		"Information takes length disabled into account",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 57 entries"; }
	);
	
	/* Enable makes no difference */
	oTest.fnTest( 
		"Length change enabled override",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaData": gaaData,
				"bLengthChange": true
			} );
		},
		function () { return document.getElementById('example_length') != null; }
	);
	
	
	
	oTest.fnComplete();
} );