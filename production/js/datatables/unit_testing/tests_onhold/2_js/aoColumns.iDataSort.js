// DATA_TEMPLATE: js_data
oTest.fnStart( "aoColumns.iDataSort" );

$(document).ready( function () {
	/* Should know that sorting already works by default from other tests, so we can jump
	 * right in here
	 */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData,
		"aoColumns": [
			null,
			{ "iDataSort": 4 },
			null,
			null,
			null
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Sorting on first column is uneffected",
		null,
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Gecko'; }
	);
	
	oTest.fnTest( 
		"Sorting on second column is the order of the fifth",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	oTest.fnTest( 
		"Reserve sorting on second column uses fifth column as well",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'X'; }
	);
	
	oTest.fnTest( 
		"Sorting on 5th column retains it's own sorting",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	
	oTest.fnTest( 
		"Use 2nd col for sorting 5th col and via-versa - no effect on first col sorting",
		function () {
			mTmp = 0;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"aoColumns": [
					null,
					{ "iDataSort": 4 },
					null,
					null,
					{ "iDataSort": 1 }
				]
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Gecko'; }
	);
	
	oTest.fnTest( 
		"2nd col sorting uses fifth col",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	oTest.fnTest( 
		"2nd col sorting uses fifth col - reversed",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'X'; }
	);
	
	oTest.fnTest( 
		"5th col sorting uses 2nd col",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'All others'; }
	);
	
	oTest.fnTest( 
		"5th col sorting uses 2nd col - reversed",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'Seamonkey 1.1'; }
	);
	
	
	oTest.fnComplete();
} );