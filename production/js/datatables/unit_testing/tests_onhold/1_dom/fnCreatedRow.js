// DATA_TEMPLATE: dom_data
oTest.fnStart( "fnCreatedRow tests" );

$(document).ready( function () {
	var tmp = 0;

	$('#example').dataTable( {
		fnCreatedRow: function () {
			tmp++;
		}
	} );
	
	oTest.fnTest( 
		"Row created is called once for each row on init",
		null,
		function () { return tmp===57; }
	);
	
	oTest.fnTest( 
		"Created isn't called back on other draws",
		function () { $('#example th:eq(1)').click(); },
		function () { return tmp===57; }
	);

	oTest.fnTest(
		"Three arguments for the function",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				fnCreatedRow: function () {
					if ( arguments.length !== 3 ) {
						tmp = false;
					}
				}
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"First argument is a TR element",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				fnCreatedRow: function () {
					if ( arguments[0].nodeName !== "TR" ) {
						tmp = false;
					}
				}
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"Second argument is an array with 5 elements",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				fnCreatedRow: function () {
					if ( arguments[1].length !== 5 ) {
						tmp = false;
					}
				}
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"Third argument is the data source for the row",
		function () { 
			oSession.fnRestore();
			tmp = true;

			$('#example').dataTable( {
				fnCreatedRow: function () {
					if ( arguments[1] !== this.fnSettings().aoData[ arguments[2] ]._aData ) {
						tmp = false;
					}
				}
			} );
		},
		function () { return tmp; }
	);

	oTest.fnTest(
		"TR element is tied to the correct data",
		function () { 
			oSession.fnRestore();
			tmp = false;

			$('#example').dataTable( {
				fnCreatedRow: function (tr, data, index) {
					if ( data[1] === "Firefox 1.0" ) {
						if ( $('td:eq(3)', tr).html() == "1.7" ) {
							tmp = true;
						}
					}
				}
			} );
		},
		function () { return tmp; }
	);
	
	
	
	oTest.fnComplete();
} );