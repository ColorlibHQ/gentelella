// DATA_TEMPLATE: dom_data
oTest.fnStart( "bInfo" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable();
	
	oTest.fnTest( 
		"Info div exists by default",
		null,
		function () { return document.getElementById('example_info') != null; }
	);
	
	/* Check can disable */
	oTest.fnTest( 
		"Info can be disabled",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"bInfo": false
			} );
		},
		function () { return document.getElementById('example_info') == null; }
	);
	
	/* Enable makes no difference */
	oTest.fnTest( 
		"Info enabled override",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"bInfo": true
			} );
		},
		function () { return document.getElementById('example_info') != null; }
	);
	
	
	oTest.fnComplete();
} );