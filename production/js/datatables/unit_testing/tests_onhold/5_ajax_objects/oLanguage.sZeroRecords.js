// DATA_TEMPLATE: empty_table
oTest.fnStart( "oLanguage.sZeroRecords" );

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
		"Zero records language is 'No matching records found' by default",
		null,
		function () { return oSettings.oLanguage.sZeroRecords == "No matching records found"; }
	);
	
	oTest.fnWaitTest(
		"Text is shown when empty table (after filtering)",
		function () { oTable.fnFilter('nothinghere'); },
		function () { return $('#example tbody tr td')[0].innerHTML == "No matching records found" }
	);
	
	
	
	oTest.fnWaitTest( 
		"Zero records language can be defined",
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
					"sZeroRecords": "unit test"
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oLanguage.sZeroRecords == "unit test"; }
	);
	
	oTest.fnWaitTest(
		"Text is shown when empty table (after filtering)",
		function () { oTable.fnFilter('nothinghere2'); },
		function () { return $('#example tbody tr td')[0].innerHTML == "unit test" }
	);
	
	
	oTest.fnComplete();
} );