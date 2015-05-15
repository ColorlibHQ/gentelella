// DATA_TEMPLATE: dom_data
oTest.fnStart( "fnInfoCallback checks" );

$(document).ready( function () {
	var mPass;
	
	$('#example').dataTable();
	
	/* Basic checks */
	oTest.fnTest( 
		"null by default",
		null,
		function () { return $('#example').dataTable().fnSettings().oLanguage.fnInfoCallback == null; }
	);
	
	oTest.fnTest( 
		"Agrument length",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"fnInfoCallback": function( oS, iStart, iEnd, iMax, iTotal, sPre ) {
					mPass = arguments.length;
					return sPre;
				}
			} );
		},
		function () { return mPass == 6; }
	);
	
	oTest.fnTest( 
		"Settings first",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"fnInfoCallback": function( oS, iStart, iEnd, iMax, iTotal, sPre ) {
					mPass = (oS == $('#example').dataTable().fnSettings()) ? true : false;
					return sPre;
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Start arg",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"fnInfoCallback": function( oS, iStart, iEnd, iMax, iTotal, sPre ) {
					return iStart;
				}
			} );
		},
		function () { return $('#example_info').html() == "1"; }
	);
	
	oTest.fnTest( 
		"End arg",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"fnInfoCallback": function( oS, iStart, iEnd, iMax, iTotal, sPre ) {
					return iEnd;
				}
			} );
		},
		function () { return $('#example_info').html() == "10"; }
	);
	
	oTest.fnTest( 
		"Max arg",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"fnInfoCallback": function( oS, iStart, iEnd, iMax, iTotal, sPre ) {
					return iMax;
				}
			} );
		},
		function () { return $('#example_info').html() == "57"; }
	);
	
	oTest.fnTest( 
		"Max arg - filter",
		function () {
			$('#example').dataTable().fnFilter("1.0");
		},
		function () { return $('#example_info').html() == "57"; }
	);
	
	oTest.fnTest( 
		"Total arg",
		function () {
			$('#example').dataTable( {
				"bDestroy": true,
				"fnInfoCallback": function( oS, iStart, iEnd, iMax, iTotal, sPre ) {
					return iTotal;
				}
			} );
		},
		function () { return $('#example_info').html() == "57"; }
	);
	
	oTest.fnTest( 
		"Total arg - filter",
		function () {
			$('#example').dataTable().fnFilter("1.0");
		},
		function () { return $('#example_info').html() == "3"; }
	);
	
	
	
	oTest.fnComplete();
} );