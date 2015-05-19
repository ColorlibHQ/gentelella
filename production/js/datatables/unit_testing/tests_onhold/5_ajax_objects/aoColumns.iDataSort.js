// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoColumns.iDataSort" );

$(document).ready( function () {
	/* Should know that sorting already works by default from other tests, so we can jump
	 * right in here
	 */
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
		"aoColumns": [
			{ "mData": "engine" },
			{ "mData": "browser", "iDataSort": 4 },
			{ "mData": "platform" },
			{ "mData": "version" },
			{ "mData": "grade" }
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Sorting on first column is uneffected",
		null,
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Gecko'; }
	);
	
	oTest.fnWaitTest( 
		"Sorting on second column is the order of the fifth",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	oTest.fnWaitTest( 
		"Reserve sorting on second column uses fifth column as well",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'X'; }
	);
	
	oTest.fnWaitTest( 
		"Sorting on 5th column retains it's own sorting",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	
	oTest.fnWaitTest( 
		"Use 2nd col for sorting 5th col and via-versa - no effect on first col sorting",
		function () {
			mTmp = 0;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumns": [
					{ "mData": "engine" },
					{ "mData": "browser", "iDataSort": 4 },
					{ "mData": "platform" },
					{ "mData": "version" },
					{ "mData": "grade", "iDataSort": 1 }
				]
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 'Gecko'; }
	);
	
	oTest.fnWaitTest( 
		"2nd col sorting uses fifth col",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'A'; }
	);
	
	oTest.fnWaitTest( 
		"2nd col sorting uses fifth col - reversed",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == 'X'; }
	);
	
	oTest.fnWaitTest( 
		"5th col sorting uses 2nd col",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'All others'; }
	);
	
	oTest.fnWaitTest( 
		"5th col sorting uses 2nd col - reversed",
		function () { $('#example thead th:eq(4)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'Seamonkey 1.1'; }
	);
	
	
	oTest.fnComplete();
} );