// DATA_TEMPLATE: dom_data
oTest.fnStart( "fnRowCallback" );

/* Note - fnRowCallback MUST return the first arguments (modified or not) */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable();
	var oSettings = oTable.fnSettings();
	var mPass;
	
	oTest.fnTest( 
		"Default should be null",
		null,
		function () { return oSettings.fnRowCallback == null; }
	);
	
	
	oTest.fnTest( 
		"Four arguments passed",
		function () {
			oSession.fnRestore();
			
			mPass = -1;
			$('#example').dataTable( {
				"fnRowCallback": function ( nTr ) {
					mPass = arguments.length;
					return nTr;
				}
			} );
		},
		function () { return mPass == 4; }
	);
	
	
	oTest.fnTest( 
		"fnRowCallback called once for each drawn row",
		function () {
			oSession.fnRestore();
			
			mPass = 0;
			$('#example').dataTable( {
				"fnRowCallback": function ( nTr, asData, iDrawIndex, iDataIndex ) {
					mPass++;
					return nTr;
				}
			} );
		},
		function () { return mPass == 10; }
	);
	
	oTest.fnTest( 
		"fnRowCallback allows us to alter row information",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"fnRowCallback": function ( nTr, asData, iDrawIndex, iDataIndex ) {
					$(nTr).addClass('unit_test');
					return nTr;
				}
			} );
		},
		function () { return $('#example tbody tr:eq(1)').hasClass('unit_test'); }
	);
	
	oTest.fnTest( 
		"Data array has length matching columns",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			$('#example').dataTable( {
				"fnRowCallback": function ( nTr, asData, iDrawIndex, iDataIndex ) {
					if ( asData.length != 5 )
						mPass = false;
					return nTr;
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Data array has length matching columns",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			var iCount = 0;
			$('#example').dataTable( {
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