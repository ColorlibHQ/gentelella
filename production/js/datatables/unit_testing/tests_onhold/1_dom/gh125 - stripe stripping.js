// DATA_TEMPLATE: dom_data
oTest.fnStart( "Odd and even are stripped from all rows" );

$(document).ready( function () {
	$('table tbody tr').addClass( 'odd even' );
	$('table.display').dataTable();

	oTest.fnTest( 
		"Odd is applied to exactly 5 rows",
		null,
		function () {
			return $('#example tbody tr.odd').length === 5;
		}
	);

	oTest.fnTest( 
		"Even is applied to exactly 5 rows",
		null,
		function () {
			return $('#example tbody tr.even').length === 5;
		}
	);

	oTest.fnTest( 
		"First row is odd",
		null,
		function () {
			return $('#example tbody tr:eq(0)').hasClass('odd') &&
				! $('#example tbody tr:eq(0)').hasClass('even');
		}
	);

	oTest.fnTest( 
		"Second row is even",
		null,
		function () {
			return $('#example tbody tr:eq(1)').hasClass('even') &&
				! $('#example tbody tr:eq(1)').hasClass('odd');
		}
	);

	oTest.fnTest( 
		"Third row is odd",
		null,
		function () {
			return $('#example tbody tr:eq(2)').hasClass('odd') &&
				! $('#example tbody tr:eq(2)').hasClass('even');
		}
	);

	oTest.fnTest( 
		"Fourth row is even",
		null,
		function () {
			return $('#example tbody tr:eq(3)').hasClass('even') &&
				! $('#example tbody tr:eq(3)').hasClass('odd');
		}
	);
	
	oTest.fnComplete();
} );