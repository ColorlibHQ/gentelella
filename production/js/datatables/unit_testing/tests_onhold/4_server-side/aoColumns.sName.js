// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoColumns.sName" );

/* This has no effect at all in DOM methods - so we just check that it has applied the name */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
		"aoColumns": [
			null,
			null,
			null,
			{ "sName": 'unit test' },
			null
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Names are stored in the columns object",
		null,
		function () { return oSettings.aoColumns[3].sName =="unit test"; }
	);
	
	
	oTest.fnComplete();
} );