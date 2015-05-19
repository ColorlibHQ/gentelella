// DATA_TEMPLATE: empty_table
oTest.fnStart( "fnRowCallback" );

/* Note - fnRowCallback MUST return the first arguments (modified or not) */

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
	var mPass;
	
	oTest.fnWaitTest( 
		"Default should be null",
		null,
		function () { return oSettings.fnRowCallback == null; }
	);
	
	
	oTest.fnWaitTest( 
		"Four arguments passed",
		function () {
			oSession.fnRestore();
			
			mPass = -1;
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"fnRowCallback": function ( nTr ) {
					mPass = arguments.length;
					return nTr;
				}
			} );
		},
		function () { return mPass == 4; }
	);
	
	
	oTest.fnWaitTest( 
		"fnRowCallback called once for each drawn row",
		function () {
			oSession.fnRestore();
			
			mPass = 0;
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"fnRowCallback": function ( nTr, asData, iDrawIndex, iDataIndex ) {
					mPass++;
					return nTr;
				}
			} );
		},
		function () { return mPass == 10; }
	);
	
	oTest.fnWaitTest( 
		"fnRowCallback allows us to alter row information",
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
				"fnRowCallback": function ( nTr, asData, iDrawIndex, iDataIndex ) {
					$(nTr).addClass('unit_test');
					return nTr;
				}
			} );
		},
		function () { return $('#example tbody tr:eq(1)').hasClass('unit_test'); }
	);
	
	oTest.fnWaitTest( 
		"Data array has length matching columns",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"fnRowCallback": function ( nTr, asData, iDrawIndex, iDataIndex ) {
					if ( asData.length != 5 )
						mPass = false;
					return nTr;
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnWaitTest( 
		"Data array has length matching columns",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			var iCount = 0;
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"fnRowCallback": function ( nTr, asData, iDrawIndex, iDataIndex ) {
					if ( iCount != iDrawIndex )
						mPass = false;
					iCount++;
					return nTr;
				}
			} );
		},
		function () { return mPass; }
	);
	
	
	
	oTest.fnComplete();
} );