// DATA_TEMPLATE: dom_data
oTest.fnStart( "oLanguage.sInfoEmpty" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable();
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Info empty language is 'Showing 0 to 0 of 0 entries' by default",
		function () { oTable.fnFilter("nothinghere"); },
		function () { return oSettings.oLanguage.sInfoEmpty == "Showing 0 to 0 of 0 entries"; }
	);
	
	oTest.fnTest( 
		"Info empty language default is in the DOM",
		null,
		function () {
			var bReturn = document.getElementById('example_info').innerHTML.replace( 
				' '+oSettings.oLanguage.sInfoFiltered.replace( '_MAX_', '57' ), "" ) ==
					"Showing 0 to 0 of 0 entries";
			return bReturn;
		}
	);
	
	
	oTest.fnTest( 
		"Info empty language can be defined",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"oLanguage": {
					"sInfoEmpty": "unit test"
				}
			} );
			oSettings = oTable.fnSettings();
			oTable.fnFilter("nothinghere");
		},
		function () { return oSettings.oLanguage.sInfoEmpty == "unit test"; }
	);
	
	oTest.fnTest( 
		"Info empty language default is in the DOM",
		null,
		function () {
			var bReturn = document.getElementById('example_info').innerHTML.replace( 
				' '+oSettings.oLanguage.sInfoFiltered.replace( '_MAX_', '57' ), "" ) ==
					"unit test";
			return bReturn;
		}
	);
	
	
	oTest.fnTest( 
		"Macro's replaced",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"oLanguage": {
					"sInfoEmpty": "unit _START_ _END_ _TOTAL_ test"
				}
			} );
			oTable.fnFilter("nothinghere");
		},
		function () {
			var bReturn = document.getElementById('example_info').innerHTML.replace( 
				' '+oSettings.oLanguage.sInfoFiltered.replace( '_MAX_', '57' ), "" ) ==
					"unit 1 0 0 test";
			return bReturn;
		}
	);
	
	
	oTest.fnComplete();
} );