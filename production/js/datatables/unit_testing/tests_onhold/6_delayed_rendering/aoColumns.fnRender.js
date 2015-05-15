// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoColumns.fnRender" );

$(document).ready( function () {
	/* Check the default */
	var mTmp = 0;
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
		"bDeferRender": true,
		"aoColumns": [
			null,
			{ "fnRender": function (a) {
				mTmp++;
				return a.aData[a.iDataColumn];
			} },
			null,
			null,
			null
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Single column - fnRender is called once for each row",
		null,
		function () { return mTmp == 57; }
	);
	
	oTest.fnWaitTest( 
		"Confirm that fnRender passes two arguments with four parameters",
		function () {
			mTmp = true;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"aoColumns": [
					null,
					{ "fnRender": function (a) {
						if ( arguments.length != 2 || typeof a.iDataRow=='undefined' ||
						 	typeof a.iDataColumn=='undefined' || typeof a.aData=='undefined' ||
						 	typeof a.mDataProp=='undefined' )
						{
							mTmp = false;
						}
						return a.aData[a.iDataColumn];
					} },
					null,
					null,
					null
				]
			} );
		},
		function () { return mTmp; }
	);
	
	oTest.fnWaitTest( 
		"fnRender iDataColumn is row number",
		function () {
			var iCount = 0;
			mTmp = true;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"aoColumns": [
					null,
					{ "fnRender": function (a) {
						if ( iCount != a.iDataRow )
						{
							mTmp = false;
						}
						iCount++;
						return a.aData[a.iDataColumn];
					} },
					null,
					null,
					null
				]
			} );
		},
		function () { return mTmp; }
	);
	
	oTest.fnWaitTest( 
		"fnRender iDataColumn is the column",
		function () {
			mTmp = true;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"aoColumns": [
					null,
					{ "fnRender": function (a) {
						if ( a.iDataColumn != 1 )
						{
							mTmp = false;
						}
						return a.aData[a.iDataColumn];
					} },
					null,
					null,
					null
				]
			} );
		},
		function () { return mTmp; }
	);
	
	oTest.fnWaitTest( 
		"fnRender aData is data array of correct size",
		function () {
			mTmp = true;
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"aoColumns": [
					null,
					{ "fnRender": function (a) {
						if ( a.aData.length != 5 )
						{
							mTmp = false;
						}
						return a.aData[a.iDataColumn];
					} },
					null,
					null,
					null
				]
			} );
		},
		function () { return mTmp; }
	);
	
	oTest.fnWaitTest( 
		"Passed back data is put into the DOM",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"aoColumns": [
					null,
					{ "fnRender": function (a) {
						return 'unittest';
					} },
					null,
					null,
					null
				]
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'unittest'; }
	);
	
	oTest.fnWaitTest( 
		"Passed back data is put into the DOM",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"aoColumns": [
					null,
					null,
					{ "fnRender": function (a) {
						return 'unittest1';
					} },
					{ "fnRender": function (a) {
						return 'unittest2';
					} },
					null
				]
			} );
		},
		function () {
			var bReturn = 
				$('#example tbody tr:eq(0) td:eq(2)').html() == 'unittest1' &&
				$('#example tbody tr:eq(0) td:eq(3)').html() == 'unittest2';
			return bReturn; }
	);
	
	
	
	
	
	oTest.fnComplete();
} );