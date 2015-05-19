// DATA_TEMPLATE: empty_table
oTest.fnStart( "fnServerData for Ajax sourced data" );

$(document).ready( function () {
	var mPass;
	
	oTest.fnTest( 
		"Argument length",
		function () {
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"fnServerData": function () {
					mPass = arguments.length;
				}
			} );
		},
		function () { return mPass == 4; }
	);
	
	oTest.fnTest( 
		"Url",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"fnServerData": function (sUrl, aoData, fnCallback, oSettings) {
					mPass = sUrl == "../../../examples/ajax/sources/arrays.txt";
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Data array",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"fnServerData": function (sUrl, aoData, fnCallback, oSettings) {
					mPass = aoData.length==0;
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Callback function",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"fnServerData": function (sUrl, aoData, fnCallback, oSettings) {
					mPass = typeof fnCallback == 'function';
				}
			} );
		},
		function () { return mPass; }
	);
	
	
	oTest.fnComplete();
} );