// DATA_TEMPLATE: empty_table
oTest.fnStart( "aoColumns.bUseRendered" );

/* bUseRendered is used to alter sorting data, if false then the original data is used for
 * sorting rather than the rendered data
 */

$(document).ready( function () {
	/* Check the default */
	var mTmp = 0;
	
	var oTable = $('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
		"aoColumns": [
			null,
			{ "fnRender": function (a) {
				if ( mTmp == 0 ) {
					mTmp++;
					return "aaa";
				} else
					return a.aData[a.iDataColumn];
			} },
			null,
			null,
			null
		]
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Default for bUseRendered is true - rendered data is used for sorting",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == 'aaa'; }
	);
	
	/* Limited to what we can do here as the sorting is done on the server side. So stop here. */
	
	
	
	
	oTest.fnComplete();
} );