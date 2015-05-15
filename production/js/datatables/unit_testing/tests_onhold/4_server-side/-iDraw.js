// DATA_TEMPLATE: empty_table
oTest.fnStart( "iDraw - check that iDraw increments for each draw" );


$(document).ready( function () {
	var oTable = $('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php"
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"After first draw, iDraw is 1",
		null,
		function () { return oSettings.iDraw == 1; }
	);
	
	oTest.fnWaitTest( 
		"After second draw, iDraw is 2",
		function () { oTable.fnDraw() },
		function () { return oSettings.iDraw == 2; }
	);
	
	oTest.fnWaitTest( 
		"After sort",
		function () { oTable.fnSort([[1,'asc']]) },
		function () { return oSettings.iDraw == 3; }
	);
	
	oTest.fnWaitTest( 
		"After filter",
		function () { oTable.fnFilter('gecko') },
		function () { return oSettings.iDraw == 4; }
	);
	
	oTest.fnWaitTest( 
		"After another filter",
		function () { oTable.fnFilter('gec') },
		function () { return oSettings.iDraw == 5; }
	);
	
	
	oTest.fnComplete();
} );