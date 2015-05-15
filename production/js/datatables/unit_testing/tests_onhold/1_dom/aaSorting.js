// DATA_TEMPLATE: dom_data
oTest.fnStart( "aaSorting" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable();
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Default sorting is single column",
		null,
		function () {
			return oSettings.aaSorting.length == 1 && typeof oSettings.aaSorting[0] == 'object';
		}
	);
	
	oTest.fnTest( 
		"Default sorting is first column asc",
		null,
		function () {
			return oSettings.aaSorting[0].length == 3 && oSettings.aaSorting[0][0] == 0 &&
				oSettings.aaSorting[0][1] == 'asc';
		}
	);
	
	oTest.fnTest( 
		"Sorting is applied",
		null,
		function () { return $('#example tbody td:eq(0)').html() == "Gecko"; }
	);
	
	
	oTest.fnTest( 
		"Custom sorting on single string column asc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['1','asc']]
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	
	oTest.fnTest( 
		"Custom sorting on single string column desc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['1','desc']]
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	
	oTest.fnTest( 
		"Custom sorting on single int column asc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['1','asc']]
			} );
		},
		function () { return $('#example tbody td:eq(3)').html() == "-"; }
	);
	
	
	oTest.fnTest( 
		"Custom sorting on single int column desc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['1','desc']]
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string asc / string asc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','asc'], ['1','asc']]
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "Camino 1.0"; }
	);
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string asc / string desc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','asc'], ['1','desc']]
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string desc / string asc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','desc'], ['1','asc']]
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "iPod Touch / iPhone"; }
	);
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string desc / string desc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','desc'], ['1','desc']]
			} );
		},
		function () { return $('#example tbody td:eq(1)').html() == "Safari 3.0"; }
	);
	
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string asc / int asc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','asc'], ['3','asc']]
			} );
		},
		function () { return $('#example tbody td:eq(3)').html() == "1"; }
	);
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string asc / int desc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','asc'], ['3','desc']]
			} );
		},
		function () { return $('#example tbody td:eq(3)').html() == "1.9"; }
	);
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string desc / int asc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','desc'], ['3','asc']]
			} );
		},
		function () { return $('#example tbody td:eq(3)').html() == "125.5"; }
	);
	
	oTest.fnTest( 
		"Multi-column sorting (2 column) - string desc / int desc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','desc'], ['3','desc']]
			} );
		},
		function () { return $('#example tbody td:eq(3)').html() == "522.1"; }
	);
	
	oTest.fnTest( 
		"Multi-column sorting (3 column) - string asc / int asc / string asc",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaSorting": [['0','asc'], ['3','asc'], ['1','asc']]
			} );
		},
		function () { return $('#example tbody tr:eq(7) td:eq(1)').html() == "Firefox 1.0"; }
	);
	
	
	oTest.fnComplete();
} );