// DATA_TEMPLATE: dom_data
oTest.fnStart( "oLanguage.sProcessing" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"bProcessing": true
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Processing language is 'Processing...' by default",
		null,
		function () { return oSettings.oLanguage.sProcessing == "Processing..."; }
	);
	
	oTest.fnTest( 
		"Processing language default is in the DOM",
		null,
		function () { return document.getElementById('example_processing').innerHTML = "Processing..."; }
	);
	
	
	oTest.fnTest( 
		"Processing language can be defined",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"bProcessing": true,
				"oLanguage": {
					"sProcessing": "unit test"
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oLanguage.sProcessing == "unit test"; }
	);
	
	oTest.fnTest( 
		"Processing language definition is in the DOM",
		null,
		function () { return document.getElementById('example_processing').innerHTML = "unit test"; }
	);
	
	
	oTest.fnComplete();
} );