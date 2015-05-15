// DATA_TEMPLATE: js_data
oTest.fnStart( "aaSortingFixed" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"No fixed sorting by default",
		null,
		function () {
			return oSettings.aaSortingFixed == null;
		}
	);
	
	
	oTest.fnTest( 
		"Fixed sorting on first column (string/asc) with user sorting on second column (string/asc)",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaData": gaaData,
				"aaSortingFixed": [['0','asc']]
			} );
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "Camino 1.0"; }
	);
	
	oTest.fnTest( 
		"Fixed sorting on first column (string/asc) with user sorting on second column (string/desc)",
		function () {
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	oTest.fnTest( 
		"Fixed sorting on fourth column (int/asc) with user sorting on second column (string/asc)",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"aaData": gaaData,
				"aaSortingFixed": [['3','asc']]
			} );
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnTest( 
		"Fixed sorting on fourth column (int/asc) with user sorting on second column (string/desc)",
		function () {
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody td:eq(1)').html() == "PSP browser"; }
	);
	
	
	oTest.fnComplete();
} );