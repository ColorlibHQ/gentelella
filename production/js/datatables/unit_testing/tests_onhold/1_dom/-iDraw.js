// DATA_TEMPLATE: dom_data
oTest.fnStart( "iDraw - check that iDraw increments for each draw" );


$(document).ready( function () {
	var oTable = $('#example').dataTable();
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"After first draw, iDraw is 1",
		null,
		function () { return oSettings.iDraw == 1; }
	);
	
	oTest.fnTest( 
		"After second draw, iDraw is 2",
		function () { oTable.fnDraw() },
		function () { return oSettings.iDraw == 2; }
	);
	
	oTest.fnTest( 
		"After sort",
		function () { oTable.fnSort([[1,'asc']]) },
		function () { return oSettings.iDraw == 3; }
	);
	
	oTest.fnTest( 
		"After filter",
		function () { oTable.fnFilter('gecko') },
		function () { return oSettings.iDraw == 4; }
	);
	
	oTest.fnTest( 
		"After another filter",
		function () { oTable.fnFilter('gec') },
		function () { return oSettings.iDraw == 5; }
	);
	
	
	oTest.fnComplete();
} );