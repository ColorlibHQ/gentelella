// DATA_TEMPLATE: empty_table
oTest.fnStart( "fnCreatedCell tests" );

$(document).ready( function () {
	var tmp = 0;
	var complete = false;

	$('#example').dataTable( {
		"bServerSide": true,
		"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
		"aoColumnDefs": [ {
			fnCreatedCell: function () {
				tmp++;
			},
			"aTargets": ["_all"]
		} ]
	} );
	
	oTest.fnWaitTest( 
		"Cell created is called once for each cell on init",
		null,
		function () { return tmp===50; }
	);
	
	oTest.fnWaitTest( 
		"Created is called back on other draws",
		function () { $('#example th:eq(1)').click(); },
		function () { return tmp===100; }
	);

	oTest.fnWaitTest(
		"Four arguments for the function",
		function () { 
			oSession.fnRestore();
			tmp = true;
			complete = false;

			$('#example').dataTable( {
				"bServerSide": true,
				"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments.length !== 4 ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ],
				fnInitComplete: function () {
					complete = true;
				}
			} );
		},
		function () { return (tmp && complete); }
	);

	oTest.fnWaitTest(
		"First argument is a TD element",
		function () { 
			oSession.fnRestore();
			tmp = true;
			complete = false;

			$('#example').dataTable( {
				"bServerSide": true,
				"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[0].nodeName !== "TD" ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ],
				fnInitComplete: function () {
					complete = true;
				}
			} );
		},
		function () { return (tmp && complete); }
	);

	oTest.fnWaitTest(
		"Second argument is the HTML value",
		function () { 
			oSession.fnRestore();
			tmp = true;
			complete = false;

			$('#example').dataTable( {
				"bServerSide": true,
				"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[1] != $('td').html() ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ],
				fnInitComplete: function () {
					complete = true;
				}
			} );
		},
		function () { return (tmp && complete); }
	);

	oTest.fnWaitTest(
		"Third argument is the data array",
		function () { 
			oSession.fnRestore();
			tmp = true;
			complete = false;

			$('#example').dataTable( {
				"bServerSide": true,
				"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[2].length !== 5 ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ],
				fnInitComplete: function () {
					complete = true;
				}
			} );
		},
		function () { return (tmp && complete); }
	);

	oTest.fnWaitTest(
		"Fourth argument is the data source for the row",
		function () { 
			oSession.fnRestore();
			tmp = true;
			complete = false;

			$('#example').dataTable( {
				"bServerSide": true,
				"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[2] !== this.fnSettings().aoData[ arguments[2] ]._aData ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ],
				fnInitComplete: function () {
					complete = true;
				}
			} );
		},
		function () { return (tmp && complete); }
	);

	oTest.fnWaitTest(
		"Fifth argument is the the col index",
		function () { 
			oSession.fnRestore();
			tmp = true;
			complete = false;

			$('#example').dataTable( {
				"bServerSide": true,
				"sAjaxSource": "../../../examples/server_side/scripts/server_processing.php",
				"aoColumnDefs": [ {
					fnCreatedRow: function () {
						if ( arguments[1] != $('td:eq('+arguments[4]+')', arguments[0].parentNode).html() ) {
							tmp = false;
						}
					},
					"aTargets": ["_all"]
				} ],
				fnInitComplete: function () {
					complete = true;
				}
			} );
		},
		function () { return (tmp && complete); }
	);
	
	
	
	oTest.fnComplete();
} );