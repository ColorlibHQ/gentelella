// DATA_TEMPLATE: js_data
oTest.fnStart( "sAjaxSource" );

/* Not interested in ajax source here other than to check it's default */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Server side is off by default",
		null,
		function () { return oSettings.sAjaxSource == null; }
	);
	
	oTest.fnComplete();
} );