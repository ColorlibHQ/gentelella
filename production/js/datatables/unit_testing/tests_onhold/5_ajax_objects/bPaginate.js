// DATA_TEMPLATE: empty_table
oTest.fnStart( "bPaginate" );

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
		"Pagiantion div exists by default",
		null,
		function () { return document.getElementById('example_paginate') != null; }
	);
	
	oTest.fnWaitTest(
		"Information div takes paging into account",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 57 entries"; }
	);
	
	/* Check can disable */
	oTest.fnWaitTest( 
		"Pagiantion can be disabled",
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
				"bPaginate": false
			} );
		},
		function () { return document.getElementById('example_paginate') == null; }
	);
	
	oTest.fnWaitTest(
		"Information div takes paging disabled into account",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 57 of 57 entries"; }
	);
	
	/* Enable makes no difference */
	oTest.fnWaitTest( 
		"Pagiantion enabled override",
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
				"bPaginate": true
			} );
		},
		function () { return document.getElementById('example_paginate') != null; }
	);
	
	
	
	oTest.fnComplete();
} );