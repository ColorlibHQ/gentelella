// DATA_TEMPLATE: dom_data
oTest.fnStart( "bJQueryUI" );

$(document).ready( function () {
	$('#example').dataTable( {
		"bJQueryUI": true
	} );
	
	oTest.fnTest( 
		"Header elements are fully wrapped by DIVs",
		null,
		function () {
			var test = true;
			$('#example thead th').each( function () {
				if ( this.childNodes > 1 ) {
					test = false;
				}
			} );
			return test;
		}
	);
	
	oTest.fnTest( 
		"One div for each header element",
		null,
		function () {
			return $('#example thead th div').length == 5;
		}
	);
	
	oTest.fnTest( 
		"One span for each header element, nested as child of div",
		null,
		function () {
			return $('#example thead th div>span').length == 5;
		}
	);
	
	oTest.fnComplete();
} );