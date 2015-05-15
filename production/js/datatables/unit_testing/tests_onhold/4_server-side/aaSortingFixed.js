// DATA_TEMPLATE: empty_table
oTest.fnStart( "aaSortingFixed" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php"
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"No fixed sorting by default",
		null,
		function () {
			return oSettings.aaSortingFixed == null;
		}
	);
	
	
	oTest.fnWaitTest( 
		"Fixed sorting on first column (string/asc) with user sorting on second column (string/asc)",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aaSortingFixed": [['0','asc']]
			} );
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "Camino 1.0"; }
	);
	
	oTest.fnWaitTest( 
		"Fixed sorting on first column (string/asc) with user sorting on second column (string/desc)",
		function () {
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	oTest.fnWaitTest( 
		"Fixed sorting on fourth column (int/asc) with user sorting on second column (string/asc)",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aaSortingFixed": [['3','asc']]
			} );
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnWaitTest( 
		"Fixed sorting on fourth column (int/asc) with user sorting on second column (string/desc)",
		function () {
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "PSP browser"; }
	);
	
	
	oTest.fnComplete();
} );