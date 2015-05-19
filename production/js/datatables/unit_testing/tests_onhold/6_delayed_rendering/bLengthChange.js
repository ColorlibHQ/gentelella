// DATA_TEMPLATE: empty_table
oTest.fnStart( "bLengthChange" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
		"bDeferRender": true
	} );
	
	oTest.fnWaitTest( 
		"Length div exists by default",
		null,
		function () { return document.getElementById('example_length') != null; }
	);
	
	oTest.fnWaitTest(
		"Four default options",
		null,
		function () { return $("select[name=example_length] option").length == 4; }
	);
	
	oTest.fnWaitTest(
		"Default options",
		null,
		function () {
			var opts = $("select[name='example_length'] option");
			return opts[0].getAttribute('value') == 10 && opts[1].getAttribute('value') == 25 &&
				opts[2].getAttribute('value') == 50 && opts[3].getAttribute('value') == 100;
		}
	);
	
	oTest.fnWaitTest(
		"Info takes length into account",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 57 entries"; }
	);
	
	/* Check can disable */
	oTest.fnWaitTest( 
		"Change length can be disabled",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"bLengthChange": false
			} );
		},
		function () { return document.getElementById('example_length') == null; }
	);
	
	oTest.fnWaitTest(
		"Information takes length disabled into account",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 57 entries"; }
	);
	
	/* Enable makes no difference */
	oTest.fnWaitTest( 
		"Length change enabled override",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"bLengthChange": true
			} );
		},
		function () { return document.getElementById('example_length') != null; }
	);
	
	
	
	oTest.fnComplete();
} );