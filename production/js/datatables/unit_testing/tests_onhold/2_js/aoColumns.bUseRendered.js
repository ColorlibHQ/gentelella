// DATA_TEMPLATE: js_data
oTest.fnStart( "aoColumns.bUseRendered" );

/* bUseRendered is used to alter sorting data, if false then the original data is used for
 * sorting rather than the rendered data
 */

$(document).ready( function () {
	/* Check the default */
	var mTmp = 0;
	
	var oTable = $('#example').dataTable( {
		"aaData": gaaData,
		"aoColumns": [
			null,
			{ "fnRender": function (a) {
				if ( mTmp == 0 ) {
					mTmp++;
					return "aaa";
				} else
					return a.aData[a.iDataColumn];
			} },
			null,
			null,
			null
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Default for bUseRendered is true - rendered data is used for sorting",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'aaa'; }
	);
	
	oTest.fnTest( 
		"When bUseRendered is false, original data is used for sorting",
		function () {
			mTmp = 0;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"aoColumns": [
					null,
					{ 
						"bUseRendered": false,
						"fnRender": function (a) {
							if ( mTmp == 0 ) {
								mTmp++;
								return "aaa";
							} else {
								return a.aData[a.iDataColumn];
							}
						}
					},
					null,
					null,
					null
				]
			} );
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'All others'; }
	);
	
	
	oTest.fnTest( 
		"bUseRendered set to false on one columns and true (default) on two others",
		function () {
			mTmp = 0;
			var mTmp2 = 0;
			var mTmp3 = 0;
			
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"aoColumns": [
					{
						"fnRender": function (a) {
							if ( mTmp == 0 ) {
								mTmp++;
								return "aaa1";
							} else {
								return a.aData[a.iDataColumn];
							}
						}
					},
					{ 
						"bUseRendered": false,
						"fnRender": function (a) {
							if ( mTmp2 == 0 ) {
								mTmp2++;
								return "aaa2";
							} else {
								return a.aData[a.iDataColumn];
							}
						}
					},
					{
						"fnRender": function (a) {
							if ( mTmp3 == 0 ) {
								mTmp3++;
								return "zzz3";
							} else {
								return a.aData[a.iDataColumn];
							}
						}
					},
					null,
					null
				]
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'aaa1'; }
	);
	
	oTest.fnTest( 
		"Multi-column rendering - 2nd column sorting",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'All others'; }
	);
	
	oTest.fnTest( 
		"Multi-column rendering - 3rd column sorting",
		function () {
			$('#example thead th:eq(2)').click();
			$('#example thead th:eq(2)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(2)').html() == 'zzz3'; }
	);
	
	oTest.fnTest( 
		"Multi-column rendering - 4th column sorting",
		function () { $('#example thead th:eq(3)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() == '-'; }
	);
	
	oTest.fnTest( 
		"Multi-column rendering - 5th column sorting",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	
	
	
	oTest.fnComplete();
} );