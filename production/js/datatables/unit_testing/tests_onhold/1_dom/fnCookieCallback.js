// DATA_TEMPLATE: dom_data
oTest.fnStart( "Cookie callback" );


$(document).ready( function () {
	var mPass;
	/* Note that in order to be fully effective here for saving state, there would need to be a
	 * stringify function to serialise the data array
	 */
	
	oTest.fnTest( 
		"null by default",
		function () {
			$('#example').dataTable();
		},
		function () { return $('#example').dataTable().fnSettings().fnCookieCallback == null; }
	);
	
	oTest.fnTest( 
		"Number of arguments",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"bStateSave": true,
				"fnCookieCallback": function (sName, oData, sExpires, sPath) {
					mPass = arguments.length;
					return sName + "=; expires=" + sExpires +"; path=" + sPath;
				}
			} );
		},
		function () { return mPass == 4; }
	);
	
	oTest.fnTest( 
		"Name",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"bStateSave": true,
				"fnCookieCallback": function (sName, oData, sExpires, sPath) {
					mPass = sName=="SpryMedia_DataTables_example_dom_data.php";
					return sName + "=; expires=" + sExpires +"; path=" + sPath;
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Data",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"bStateSave": true,
				"fnCookieCallback": function (sName, oData, sExpires, sPath) {
					mPass = typeof oData.iStart != 'undefined';
					return sName + "=; expires=" + sExpires +"; path=" + sPath;
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Expires",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"bStateSave": true,
				"fnCookieCallback": function (sName, oData, sExpires, sPath) {
					mPass = typeof sExpires == 'string';
					return sName + "=; expires=" + sExpires +"; path=" + sPath;
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Path",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"bStateSave": true,
				"fnCookieCallback": function (sName, oData, sExpires, sPath) {
					mPass = sPath.match(/media\/unit_testing\/templates/);
					return sName + "=; expires=" + sExpires +"; path=" + sPath;
				}
			} );
		},
		function () { return mPass; }
	);
	
	
	oTest.fnCookieDestroy( $('#example').dataTable() );
	oTest.fnComplete();
} );