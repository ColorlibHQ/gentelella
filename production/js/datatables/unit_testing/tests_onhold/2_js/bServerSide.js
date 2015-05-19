// DATA_TEMPLATE: js_data
oTest.fnStart( "bServerSide" );

/* Not interested in server-side processing here other than to check that it is off */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Server side is off by default",
		null,
		function () { return oSettings.oFeatures.bServerSide == false; }
	);
	
	oTest.fnComplete();
} );