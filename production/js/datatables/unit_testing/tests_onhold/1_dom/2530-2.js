// DATA_TEMPLATE: dom_data
oTest.fnStart( "User given with is left when no scrolling" );

$(document).ready( function () {
	$('#example')[0].style.width = "80%";
	$('#example').dataTable();
	
	oTest.fnTest( 
		"Check user width is left",
		null,
		function () { return $('#example').width() == 640; }
	);
	
	oTest.fnComplete();
} );