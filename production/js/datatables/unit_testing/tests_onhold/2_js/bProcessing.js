// DATA_TEMPLATE: js_data
oTest.fnStart( "bProcessing" );

/* It's actually a bit hard to set this one due to the fact that it will only be shown
 * when DataTables is doing some kind of processing. The server-side processing is a bit
 * better to test this than here - so we just the interal functions to enable it and check
 * that it is available
 */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Processing is off by default",
		null,
		function () { return oSettings.oFeatures.bProcessing == false; }
	);
	
	oTest.fnTest( 
		"Processing div is not in the DOM",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	oTest.fnTest( 
		"Processing div cannot be shown",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	oTest.fnTest( 
		"Processing div cannot be hidden",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, false ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	
	/* Check can disable */
	oTest.fnTest( 
		"Processing can be enabled",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"bProcessing": true
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oFeatures.bProcessing == true; }
	);
	
	oTest.fnTest( 
		"Processing div is in the DOM",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing'); }
	);
	
	oTest.fnTest( 
		"Processing div is hidden by default",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing').style.visibility = "hidden"; }
	);
	
	oTest.fnTest( 
		"Processing div can be shown",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing').style.visibility = "visible"; }
	);
	
	oTest.fnTest( 
		"Processing div can be hidden",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, false ); },
		function () { return document.getElementById('example_processing').style.visibility = "hidden"; }
	);
	
	/* Enable makes no difference */
	oTest.fnTest( 
		"Processing disabled override",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"bProcessing": false
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oFeatures.bProcessing == false; }
	);
	
	oTest.fnTest( 
		"Processing div is not in the DOM",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	
	
	oTest.fnComplete();
} );