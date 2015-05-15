// DATA_TEMPLATE: dom_data
oTest.fnStart( "asStripeClasses" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable();
	
	oTest.fnTest( 
		"Default row striping is applied",
		null,
		function () {
			return $('#example tbody tr:eq(0)').hasClass('odd') &&
			       $('#example tbody tr:eq(1)').hasClass('even') &&
			       $('#example tbody tr:eq(2)').hasClass('odd') &&
			       $('#example tbody tr:eq(3)').hasClass('even');
		}
	);
	
	oTest.fnTest( 
		"Row striping does not effect current classes",
		null,
		function () {
			return $('#example tbody tr:eq(0)').hasClass('gradeA') &&
			       $('#example tbody tr:eq(1)').hasClass('gradeA') &&
			       $('#example tbody tr:eq(2)').hasClass('gradeA') &&
			       $('#example tbody tr:eq(3)').hasClass('gradeA');
		}
	);
	
	oTest.fnTest( 
		"Row striping on the second page",
		function () { $('#example_next').click(); },
		function () {
			return $('#example tbody tr:eq(0)').hasClass('odd') &&
			       $('#example tbody tr:eq(1)').hasClass('even') &&
			       $('#example tbody tr:eq(2)').hasClass('odd') &&
			       $('#example tbody tr:eq(3)').hasClass('even');
		}
	);
	
	/* No striping */
	oTest.fnTest( 
		"No row striping",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"asStripeClasses": []
			} );
		},
		function () {
			return $('#example tbody tr:eq(0)')[0].className == "gradeA" &&
			       $('#example tbody tr:eq(1)')[0].className == "gradeA" &&
			       $('#example tbody tr:eq(2)')[0].className == "gradeA" &&
			       $('#example tbody tr:eq(3)')[0].className == "gradeA";
		}
	);
	
	/* Custom striping */
	oTest.fnTest( 
		"Custom striping [2]",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"asStripeClasses": [ 'test1', 'test2' ]
			} );
		},
		function () {
			return $('#example tbody tr:eq(0)').hasClass('test1') &&
			       $('#example tbody tr:eq(1)').hasClass('test2') &&
			       $('#example tbody tr:eq(2)').hasClass('test1') &&
			       $('#example tbody tr:eq(3)').hasClass('test2');
		}
	);
	
	
	/* long array of striping */
	oTest.fnTest( 
		"Custom striping [4]",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"asStripeClasses": [ 'test1', 'test2', 'test3', 'test4' ]
			} );
		},
		function () {
			return $('#example tbody tr:eq(0)').hasClass('test1') &&
			       $('#example tbody tr:eq(1)').hasClass('test2') &&
			       $('#example tbody tr:eq(2)').hasClass('test3') &&
			       $('#example tbody tr:eq(3)').hasClass('test4');
		}
	);
	
	oTest.fnTest( 
		"Custom striping is restarted on second page [2]",
		function () { $('#example_next').click(); },
		function () {
			return $('#example tbody tr:eq(0)').hasClass('test1') &&
			       $('#example tbody tr:eq(1)').hasClass('test2') &&
			       $('#example tbody tr:eq(2)').hasClass('test3') &&
			       $('#example tbody tr:eq(3)').hasClass('test4');
		}
	);
	
	
	oTest.fnComplete();
} );