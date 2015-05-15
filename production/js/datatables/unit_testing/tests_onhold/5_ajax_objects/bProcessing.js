// DATA_TEMPLATE: empty_table
oTest.fnStart( "bProcessing" );

/* It's actually a bit hard to set this one due to the fact that it will only be shown
 * when DataTables is doing some kind of processing. The server-side processing is a bit
 * better to test this than here - so we just the interal functions to enable it and check
 * that it is available
 */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
		"aoColumns": [
			{ "mData": "engine" },
			{ "mData": "browser" },
			{ "mData": "platform" },
			{ "mData": "version" },
			{ "mData": "grade" }
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Processing is off by default",
		null,
		function () { return oSettings.oFeatures.bProcessing == false; }
	);
	
	oTest.fnWaitTest( 
		"Processing div is not in the DOM",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	oTest.fnWaitTest( 
		"Processing div cannot be shown",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	oTest.fnWaitTest( 
		"Processing div cannot be hidden",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, false ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	
	/* Check can disable */
	oTest.fnWaitTest( 
		"Processing can be enabled",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"bProcessing": true
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oFeatures.bProcessing == true; }
	);
	
	oTest.fnWaitTest( 
		"Processing div is in the DOM",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing'); }
	);
	
	oTest.fnWaitTest( 
		"Processing div is hidden by default",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing').style.visibility = "hidden"; }
	);
	
	oTest.fnWaitTest( 
		"Processing div can be shown",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing').style.visibility = "visible"; }
	);
	
	oTest.fnWaitTest( 
		"Processing div can be hidden",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, false ); },
		function () { return document.getElementById('example_processing').style.visibility = "hidden"; }
	);
	
	/* Enable makes no difference */
	oTest.fnWaitTest( 
		"Processing disabled override",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"bProcessing": false
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oFeatures.bProcessing == false; }
	);
	
	oTest.fnWaitTest( 
		"Processing div is not in the DOM",
		function () { oTable.oApi._fnProcessingDisplay( oSettings, true ); },
		function () { return document.getElementById('example_processing') == null; }
	);
	
	
	
	oTest.fnComplete();
} );