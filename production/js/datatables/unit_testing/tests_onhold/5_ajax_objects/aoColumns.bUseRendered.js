// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoColumns.bUseRendered" );

/* bUseRendered is used to alter sorting data, if false then the original data is used for
 * sorting rather than the rendered data
 */

$(document).ready( function () {
	/* Check the default */
	var mTmp = 0;
	
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
		"aoColumns": [
			{ "mData": "engine" },
			{
				"mData": "browser",
				"fnRender": function (a) {
					if ( mTmp == 0 ) {
						mTmp++;
						return "aaa";
					} else
						return a.aData['browser'];
				}
			},
			{ "mData": "platform" },
			{ "mData": "version" },
			{ "mData": "grade" }
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Default for bUseRendered is true - rendered data is used for sorting",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'aaa'; }
	);
	
	oTest.fnWaitTest( 
		"When bUseRendered is false, original data is used for sorting",
		function () {
			mTmp = 0;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumns": [
					{ "mData": "engine" },
					{ 
						"mData": "browser",
						"bUseRendered": false,
						"fnRender": function (a) {
							if ( mTmp == 0 ) {
								mTmp++;
								return "aaa";
							} else {
								return a.aData['browser'];
							}
						}
					},
					{ "mData": "platform" },
					{ "mData": "version" },
					{ "mData": "grade" }
				]
			} );
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'All others'; }
	);
	
	
	oTest.fnWaitTest( 
		"bUseRendered set to false on one columns and true (default) on two others",
		function () {
			mTmp = 0;
			var mTmp2 = 0;
			var mTmp3 = 0;
			
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumns": [
					{
						"mData": "engine",
						"fnRender": function (a) {
							if ( mTmp == 0 ) {
								mTmp++;
								return "aaa1";
							} else {
								return a.aData['engine'];
							}
						}
					},
					{ 
						"mData": "browser",
						"bUseRendered": false,
						"fnRender": function (a) {
							if ( mTmp2 == 0 ) {
								mTmp2++;
								return "aaa2";
							} else {
								return a.aData['browser'];
							}
						}
					},
					{
						"mData": "platform",
						"fnRender": function (a) {
							if ( mTmp3 == 0 ) {
								mTmp3++;
								return "zzz3";
							} else {
								return a.aData['platform'];
							}
						}
					},
					{ "mData": "version" },
					{ "mData": "grade" }
				]
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'aaa1'; }
	);
	
	oTest.fnWaitTest( 
		"Multi-column rendering - 2nd column sorting",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'All others'; }
	);
	
	oTest.fnWaitTest( 
		"Multi-column rendering - 3rd column sorting",
		function () {
			$('#example thead th:eq(2)').click();
			$('#example thead th:eq(2)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(2)').html() == 'zzz3'; }
	);
	
	oTest.fnWaitTest( 
		"Multi-column rendering - 4th column sorting",
		function () { $('#example thead th:eq(3)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() == '-'; }
	);
	
	oTest.fnWaitTest( 
		"Multi-column rendering - 5th column sorting",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	
	
	
	oTest.fnComplete();
} );