// DATA_TEMPLATE: empty_table
oTest.fnStart( "bServerSide" );

/* All the other scripts blast the ssp processing */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php"
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Server side can be set to on",
		null,
		function () { return oSettings.oFeatures.bServerSide == true; }
	);
	
	oTest.fnComplete();
} );