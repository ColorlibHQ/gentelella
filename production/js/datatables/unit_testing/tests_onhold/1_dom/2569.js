// DATA_TEMPLATE: dom_data
oTest.fnStart( "Destroy with hidden columns" );

$(document).ready( function () {
	$('#example').dataTable( {
		"aoColumnDefs": [ 
			{ "bSearchable": false, "bVisible": false, "aTargets": [ 2 ] },
			{ "bVisible": false, "aTargets": [ 3 ] }
		]
	} );
	$('#example').dataTable().fnDestroy();
	
	oTest.fnTest( 
		"Check that the number of columns in table is correct",
		null,
		function () { return $('#example tbody tr:eq(0) td').length == 5; }
	);
	
	
	oTest.fnTest( 
		"And with scrolling",
		function () {
			$('#example').dataTable( {
				"sScrollY": 200,
				"aoColumnDefs": [ 
					{ "bSearchable": false, "bVisible": false, "aTargets": [ 2 ] },
					{ "bVisible": false, "aTargets": [ 3 ] }
				]
			} );
			$('#example').dataTable().fnDestroy();
		},
		function () { return $('#example tbody tr:eq(0) td').length == 5; }
	);
	
	oTest.fnComplete();
} );