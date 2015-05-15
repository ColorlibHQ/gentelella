// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoColumns.bSortable" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/arrays.txt"
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"All columns are sortable by default",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnWaitTest( 
		"Can disable sorting from one column",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"aoColumns": [
					null,
					{ "bSortable": false },
					null,
					null,
					null
				]
			} );
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() != "All others"; }
	);
	
	oTest.fnWaitTest( 
		"Disabled column has no sorting class",
		null,
		function () { return $('#example thead th:eq(1)').hasClass("sorting_asc") == false; }
	);
	
	oTest.fnWaitTest( 
		"Other columns can still sort",
		function () {
			$('#example thead th:eq(4)').click();
			$('#example thead th:eq(4)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == "X"; }
	);
	
	oTest.fnWaitTest( 
		"Disable sorting on multiple columns - no sorting classes",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"aoColumns": [
					null,
					{ "bSortable": false },
					null,
					{ "bSortable": false },
					null
				]
			} );
		},
		function () {
			var bReturn = 
				$('#example thead th:eq(1)').hasClass("sorting") ||
				$('#example thead th:eq(3)').hasClass("sorting")
			return bReturn == false;
		}
	);
	
	oTest.fnWaitTest( 
		"Sorting on disabled column 1 has no effect",
		function () {
			$('#example thead th:eq(1)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() != "All others"; }
	);
	
	oTest.fnWaitTest( 
		"Sorting on disabled column 2 has no effect",
		function () {
			$('#example thead th:eq(3)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() != "-"; }
	);
	
	oTest.fnWaitTest( 
		"Second sort on disabled column 2 has no effect",
		function () {
			$('#example thead th:eq(3)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() != "-"; }
	);
	
	oTest.fnWaitTest( 
		"Even with multiple disabled sorting columns other columns can still sort",
		function () {
			$('#example thead th:eq(4)').click();
			$('#example thead th:eq(4)').click();
		},
		function () { return $('#example tbody tr:eq(0) td:eq(4)').html() == "X"; }
	);
	
	
	oTest.fnComplete();
} );