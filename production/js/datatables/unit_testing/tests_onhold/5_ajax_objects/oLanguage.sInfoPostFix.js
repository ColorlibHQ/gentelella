// DATA_TEMPLATE: empty_table
oTest.fnStart( "oLanguage.sInfoPostFix" );

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
		"Info post fix language is '' (blank) by default",
		null,
		function () { return oSettings.oLanguage.sInfoPostFix == ""; }
	);
	
	oTest.fnTest( 
		"Width no post fix, the basic info shows",
		null,
		function () { return document.getElementById('example_info').innerHTML = "Showing 1 to 10 of 57 entries"; }
	);
	
	
	oTest.fnWaitTest( 
		"Info post fix language can be defined",
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
					"sInfoPostFix": "unit test"
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oLanguage.sInfoPostFix == "unit test"; }
	);
	
	oTest.fnTest( 
		"Info empty language default is in the DOM",
		null,
		function () { return document.getElementById('example_info').innerHTML = "Showing 1 to 10 of 57 entries unit test"; }
	);
	
	
	oTest.fnWaitTest( 
		"Macros have no effect in the post fix",
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
					"sInfoPostFix": "unit _START_ _END_ _TOTAL_ test"
				}
			} );
		},
		function () { return document.getElementById('example_info').innerHTML = "Showing 1 to 10 of 57 entries unit _START_ _END_ _TOTAL_ test"; }
	);
	
	
	oTest.fnWaitTest( 
		"Post fix is applied after fintering info",
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
					"sInfoPostFix": "unit test"
				}
			} );
			oTable.fnFilter("nothinghere");
		},
		function () { return document.getElementById('example_info').innerHTML = "Showing 0 to 0 of 0 entries unit (filtered from 57 total entries) test"; }
	);
	
	
	oTest.fnComplete();
} );