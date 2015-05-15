// DATA_TEMPLATE: js_data
oTest.fnStart( "fnInitComplete" );

/* Fairly boring function compared to the others! */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData
	} );
	var oSettings = oTable.fnSettings();
	var mPass;
	
	oTest.fnTest( 
		"Default should be null",
		null,
		function () { return oSettings.fnInitComplete == null; }
	);
	
	
	oTest.fnTest( 
		"Two arguments passed",
		function () {
			oSession.fnRestore();
			
			mPass = -1;
			$('#example').dataTable( {
				"aaData": gaaData,
				"fnInitComplete": function ( ) {
					mPass = arguments.length===2 && arguments[1]===undefined;
				}
			} );
		},
		function () { return mPass; }
	);
	
	
	oTest.fnTest( 
		"That one argument is the settings object",
		function () {
			oSession.fnRestore();
			
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"fnInitComplete": function ( oSettings ) {
					mPass = oSettings;
				}
			} );
		},
		function () { return oTable.fnSettings() == mPass; }
	);
	
	
	oTest.fnTest( 
		"fnInitComplete called once on first draw",
		function () {
			oSession.fnRestore();
			
			mPass = 0;
			$('#example').dataTable( {
				"aaData": gaaData,
				"fnInitComplete": function ( ) {
					mPass++;
				}
			} );
		},
		function () { return mPass == 1; }
	);
	
	oTest.fnTest( 
		"fnInitComplete never called there after",
		function () {
			$('#example_next').click();
			$('#example_next').click();
			$('#example_next').click();
		},
		function () { return mPass == 1; }
	);
	
	
	
	oTest.fnComplete();
} );