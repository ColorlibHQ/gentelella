// DATA_TEMPLATE: empty_table
oTest.fnStart( "oLanguage.sSearch" );

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
		"Search language is 'Search:' by default",
		null,
		function () { return oSettings.oLanguage.sSearch == "Search:"; }
	);
	
	oTest.fnTest(
		"A label input is used",
		null,
		function () { return $('label', oSettings.aanFeatures.f[0]).length == 1 }
	);
	
	oTest.fnTest( 
		"Search language default is in the DOM",
		null,
		function () { return $('label', oSettings.aanFeatures.f[0]).text()
		 	== "Search: "; }
	);
	
	
	oTest.fnWaitTest( 
		"Search language can be defined",
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
				"oLanguage": {
					"sSearch": "unit test"
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oLanguage.sSearch == "unit test"; }
	);
	
	oTest.fnTest( 
		"Info language definition is in the DOM",
		null,
		function () { return $('label', oSettings.aanFeatures.f[0]).text().indexOf('unit test') !== -1; }
	);
	
	
	oTest.fnWaitTest( 
		"Blank search has a no space (separator) inserted",
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
				"oLanguage": {
					"sSearch": ""
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return document.getElementById('example_filter').childNodes.length == 1; }
	);
	
	
	oTest.fnComplete();
} );