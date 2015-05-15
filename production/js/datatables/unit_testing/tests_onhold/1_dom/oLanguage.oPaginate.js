// DATA_TEMPLATE: dom_data
oTest.fnStart( "oLanguage.oPaginate" );

/* Note that the paging language information only has relevence in full numbers */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( { "sPaginationType": "full_numbers" } );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"oLanguage.oPaginate defaults",
		null,
		function () {
			var bReturn = 
				oSettings.oLanguage.oPaginate.sFirst == "First" &&
				oSettings.oLanguage.oPaginate.sPrevious == "Previous" &&
				oSettings.oLanguage.oPaginate.sNext == "Next" &&
				oSettings.oLanguage.oPaginate.sLast == "Last";
			return bReturn;
		}
	);
	
	oTest.fnTest( 
		"oLanguage.oPaginate defaults are in the DOM",
		null,
		function () {
			var bReturn = 
				$('#example_paginate .first').html() == "First" &&
				$('#example_paginate .previous').html() == "Previous" &&
				$('#example_paginate .next').html() == "Next" &&
				$('#example_paginate .last').html() == "Last";
			return bReturn;
		}
	);
	
	
	oTest.fnTest( 
		"oLanguage.oPaginate can be defined",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sPaginationType": "full_numbers",
				"oLanguage": {
					"oPaginate": {
						"sFirst":    "unit1",
						"sPrevious": "test2",
						"sNext":     "unit3",
						"sLast":     "test4"
					}
				}
			} );
			oSettings = oTable.fnSettings();
		},
		function () {
			var bReturn = 
				oSettings.oLanguage.oPaginate.sFirst == "unit1" &&
				oSettings.oLanguage.oPaginate.sPrevious == "test2" &&
				oSettings.oLanguage.oPaginate.sNext == "unit3" &&
				oSettings.oLanguage.oPaginate.sLast == "test4";
			return bReturn;
		}
	);
	
	oTest.fnTest( 
		"oLanguage.oPaginate definitions are in the DOM",
		null,
		function () {
			var bReturn = 
				$('#example_paginate .first').html() == "unit1" &&
				$('#example_paginate .previous').html() == "test2" &&
				$('#example_paginate .next').html() == "unit3" &&
				$('#example_paginate .last').html() == "test4";
			return bReturn;
		}
	);
	
	
	oTest.fnComplete();
} );