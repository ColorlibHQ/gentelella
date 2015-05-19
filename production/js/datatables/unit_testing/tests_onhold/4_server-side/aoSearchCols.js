// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoSearchCols" );

/* We could be here forever testing this one, so we test a limited subset on a couple of colums */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/filter_col.php"
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Default should be to have a empty colums array",
		null,
		function () {
			var bReturn = 
				oSettings.aoPreSearchCols[0].sSearch == 0 && !oSettings.aoPreSearchCols[0].bRegex &&
				oSettings.aoPreSearchCols[1].sSearch == 0 && !oSettings.aoPreSearchCols[1].bRegex &&
				oSettings.aoPreSearchCols[2].sSearch == 0 && !oSettings.aoPreSearchCols[2].bRegex &&
				oSettings.aoPreSearchCols[3].sSearch == 0 && !oSettings.aoPreSearchCols[3].bRegex &&
				oSettings.aoPreSearchCols[4].sSearch == 0 && !oSettings.aoPreSearchCols[4].bRegex;
			return bReturn;
		}
	);
	
	
	oTest.fnWaitTest( 
		"Search on a single column - no regex statement given",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/filter_col.php",
				"aoSearchCols": [
					null,
					{ "sSearch": "Mozilla" },
					null,
					{ "sSearch": "1" },
					null
				]
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() == "1"; }
	);
	
	oTest.fnWaitTest( 
		"Search on two columns - no regex statement given",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/filter_col.php",
				"aoSearchCols": [
					null,
					{ "sSearch": "Mozilla" },
					null,
					{ "sSearch": "1.5" },
					null
				]
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() == "1.5"; }
	);
	
	/* No regex escape searches here - would need to be implemented on the server-side */
	
	oTest.fnComplete();
} );