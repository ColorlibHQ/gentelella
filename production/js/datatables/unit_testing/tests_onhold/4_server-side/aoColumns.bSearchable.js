// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoColumns.bSeachable" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php"
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Columns are searchable by default",
		function () { oTable.fnFilter("Camino"); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == "Camino 1.0"; }
	);
	
	/* NOT ACTUALLY GOING TO TEST BSEARCHABLE HERE. Reason being is that it requires the server
	 * side to alter it's processing, and this information about columns is not actually sent to
	 * the server
	 */
	
	
	oTest.fnComplete();
} );