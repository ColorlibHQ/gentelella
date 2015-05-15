// DATA_TEMPLATE: empty_table
oTest.fnStart( "fnDrawCallback" );

/* Fairly boring function compared to the others! */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/arrays.txt"
	} );
	var oSettings = oTable.fnSettings();
	var mPass, bInit;
	
	oTest.fnWaitTest( 
		"Default should be null",
		null,
		function () { return oSettings.fnDrawCallback == null; }
	);
	
	
	oTest.fnWaitTest( 
		"One argument passed",
		function () {
			oSession.fnRestore();
			
			mPass = -1;
			bInit = false;
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"fnDrawCallback": function ( ) {
					mPass = arguments.length;
				},
				"fnInitComplete": function () {
					bInit = true;
				}
			} );
		},
		function () { return mPass == 1 && bInit; }
	);
	
	
	oTest.fnWaitTest( 
		"That one argument is the settings object",
		function () {
			oSession.fnRestore();
			
			bInit = false;
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"fnDrawCallback": function ( oSettings ) {
					mPass = oSettings;
				},
				"fnInitComplete": function () {
					bInit = true;
				}
			} );
		},
		function () { return oTable.fnSettings() == mPass && bInit; }
	);
	
	
	/* The draw callback is called once for the init and then when the data is added */
	oTest.fnWaitTest( 
		"fnRowCallback called once on first draw",
		function () {
			oSession.fnRestore();
			
			mPass = 0;
			bInit = false;
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"fnDrawCallback": function ( ) {
					mPass++;
				},
				"fnInitComplete": function () {
					bInit = true;
				}
			} );
		},
		function () { return mPass == 2 && bInit; }
	);
	
	oTest.fnWaitTest( 
		"fnRowCallback called once on each draw there after as well",
		function () {
			$('#example_next').click();
			$('#example_next').click();
			$('#example_next').click();
		},
		function () { return mPass == 5; }
	);
	
	
	
	
	
	oTest.fnComplete();
} );