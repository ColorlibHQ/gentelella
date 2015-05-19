// DATA_TEMPLATE: empty_table
oTest.fnStart( "39 - nested null values" );

$(document).ready( function () {
	var test = false;

	$.fn.dataTable.ext.sErrMode = "throw";

	oTest.fnTest(
		"No default content throws an error",
		function () {
			try {
				$('#example').dataTable( {
					"aaData": [
						{ "a": "0", "b": {"c": 0} },
						{ "a": "1", "b": {"c": 3} },
						{ "a": "2", "b": null }
					],
					"aoColumns": [
						{ "mDataProp": "a" },
						{ "mDataProp": "b" },
						{ "mDataProp": "b.c" }
					]
				} );
			}
			catch(err) {
				test = true;
			}
		},
		function () { return test; }
	);

	oTest.fnTest(
		"Table renders",
		function () {
			oSession.fnRestore();
			
			$('#example').dataTable( {
				"aaData": [
					{ "a": "0", "b": {"c": 0} },
					{ "a": "1", "b": {"c": 3} },
					{ "a": "2", "b": null }
				],
				"aoColumns": [
					{ "mDataProp": "a" },
					{ "mDataProp": "b" },
					{ "mDataProp": "b.c", "sDefaultContent": "allan" }
				]
			} );
		},
		function () { return $('#example tbody td:eq(0)').html() === "0"; }
	);

	oTest.fnTest(
		"Default content applied",
		function () {
			oSession.fnRestore();
			
			$('#example').dataTable( {
				"aaData": [
					{ "a": "0", "b": {"c": 0} },
					{ "a": "1", "b": {"c": 3} },
					{ "a": "2", "b": null }
				],
				"aoColumns": [
					{ "mDataProp": "a" },
					{ "mDataProp": "b" },
					{ "mDataProp": "b.c", "sDefaultContent": "allan" }
				]
			} );
		},
		function () { return $('#example tbody td:eq(8)').html() === "allan"; }
	);
	
	oTest.fnComplete();
} );