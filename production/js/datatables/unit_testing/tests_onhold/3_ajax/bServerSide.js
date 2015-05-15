// DATA_TEMPLATE: empty_table
oTest.fnStart( "bServerSide" );

/* Not interested in server-side processing here other than to check that it is off */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/arrays.txt"
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Server side is off by default",
		null,
		function () { return oSettings.oFeatures.bServerSide == false; }
	);
	
	oTest.fnComplete();
} );