// DATA_TEMPLATE: empty_table
oTest.fnStart( "iDisplayLength" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
		"aoColumns": [
			{ "mData": "engine" },
			{ "mData": "browser" },
			{ "mData": "platform" },
			{ "mData": "version" },
			{ "mData": "grade" }
		]
	} );
	
	oTest.fnWaitTest( 
		"Default length is ten",
		null,
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 10",
		null,
		function () { return $('#example_length select').val() == 10; }
	);
	
	
	oTest.fnWaitTest( 
		"Set initial length to 25",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"iDisplayLength": 25
			} );
		},
		function () { return $('#example tbody tr').length == 25; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 25",
		null,
		function () { return $('#example_length select').val() == 25; }
	);
	
	
	oTest.fnWaitTest( 
		"Set initial length to 100",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"iDisplayLength": 100
			} );
		},
		function () { return $('#example tbody tr').length == 57; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 25",
		null,
		function () { return $('#example_length select').val() == 100; }
	);
	
	
	oTest.fnWaitTest( 
		"Set initial length to 23 (unknown select menu length)",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"iDisplayLength": 23
			} );
		},
		function () { return $('#example tbody tr').length == 23; }
	);
	
	oTest.fnWaitTest( 
		"Select menu shows 10 (since 23 is unknow)",
		null,
		function () { return $('#example_length select').val() == 10; }
	);
	
	
	oTest.fnComplete();
} );