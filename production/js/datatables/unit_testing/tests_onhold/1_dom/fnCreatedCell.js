// DATA_TEMPLATE: dom_data
oTest.fnStart( "fnCreatedCell tests" );

$(document).ready( function () {
	var tmp = 0;

	$('#example').dataTable( {
		"aoColumnDefs": [ {
			fnCreatedCell: function () {
				tmp++;
			},
			"aTargets": ["_all"]
		} ]
	} );
	
	oTest.fnTest( 
		"Cell created is called once for each cell on init",
		null,
		function () { return tmp===285; }
	);
	
	oTest.fnTest( 
		"Created isn't called back on other draws",
		function () { $('#example th:eq(1)').click(); },
		function () { return tmp===285; }
	);

	oTest.fnTest(
		"Four arguments for the function",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments.length !== 4 ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ]
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"First argument is a TD element",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[0].nodeName !== "TD" ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ]
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"Second argument is the HTML value",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[1] != $('td').html() ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ]
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"Third argument is the data array",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[2].length !== 5 ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ]
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"Fourth argument is the data source for the row",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[2] !== this.fnSettings().aoData[ arguments[2] ]._aData ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ]
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"Fifth argument is the the col index",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[1] != $('td:eq('+arguments[4]+')', arguments[0].parentNode).html() ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ]
			} );
		},
		function () { return tmp; }
	);
	
	
	
	oTest.fnComplete();
} );