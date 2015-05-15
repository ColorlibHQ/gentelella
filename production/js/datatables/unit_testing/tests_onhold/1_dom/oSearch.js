// DATA_TEMPLATE: dom_data
oTest.fnStart( "oSearch" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable();
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Default values should be blank",
		null,
		function () {
			var bReturn = oSettings.oPreviousSearch.sSearch == "" && 
			              !oSettings.oPreviousSearch.bRegex;
			return bReturn;
		}
	);
	
	/* This test might be considered iffy since the full object isn't given, but it's reasonable to
	 * expect DataTables to cope with this. It should just assumine regex false
	 */
	oTest.fnTest( 
		"Search term only in object",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"oSearch": {
					"sSearch": "Mozilla"
				}
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == "Gecko"; }
	);
	
	oTest.fnTest( 
		"New search will kill old one",
		function () {
			oTable.fnFilter("Opera");
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == "Presto"; }
	);
	
	oTest.fnTest( 
		"Search plain text term and escape regex true",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"oSearch": {
					"sSearch": "DS",
					"bRegex": false
				}
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == "Nintendo DS browser"; }
	);
	
	oTest.fnTest( 
		"Search plain text term and escape regex false",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"oSearch": {
					"sSearch": "Opera",
					"bRegex": true
				}
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == "Presto"; }
	);
	
	oTest.fnTest( 
		"Search regex text term and escape regex true",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"oSearch": {
					"sSearch": "1.*",
					"bRegex": false
				}
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == "No matching records found"; }
	);
	
	oTest.fnTest( 
		"Search regex text term and escape regex false",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"oSearch": {
					"sSearch": "1.*",
					"bRegex": true
				}
			} );
		},
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == "Gecko"; }
	);
	
	
	oTest.fnComplete();
} );