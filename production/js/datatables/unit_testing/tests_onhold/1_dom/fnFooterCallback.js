// DATA_TEMPLATE: dom_data
oTest.fnStart( "fnFooterCallback" );

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable();
	var oSettings = oTable.fnSettings();
	var mPass;
	
	oTest.fnTest( 
		"Default should be null",
		null,
		function () { return oSettings.fnFooterCallback == null; }
	);
	
	
	oTest.fnTest( 
		"Five arguments passed",
		function () {
			oSession.fnRestore();
			
			mPass = -1;
			$('#example').dataTable( {
				"fnFooterCallback": function ( ) {
					mPass = arguments.length;
				}
			} );
		},
		function () { return mPass == 5; }
	);
	
	
	oTest.fnTest( 
		"fnRowCallback called once per draw",
		function () {
			oSession.fnRestore();
			
			mPass = 0;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					mPass++;
				}
			} );
		},
		function () { return mPass == 1; }
	);
	
	oTest.fnTest( 
		"fnRowCallback called on paging (i.e. another draw)",
		function () { $('#example_next').click(); },
		function () { return mPass == 2; }
	);
	
	
	oTest.fnTest( 
		"fnRowCallback allows us to alter row information",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					nFoot.getElementsByTagName('th')[0].innerHTML = "Displaying "+(iEnd-iStart)+" records";
				}
			} );
		},
		function () { return $('#example tfoot th:eq(0)').html() == "Displaying 10 records"; }
	);
	
	
	oTest.fnTest( 
		"Data array has length matching original data",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					if ( aasData.length != 57 )
					{
						mPass = false;
					}
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"Data array's column lengths match original data",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					for ( var i=0, iLen=aasData.length ; i<iLen ; i++ )
					{
						if ( aasData[i].length != 5 )
						{
							mPass = false;
						}
					}
				}
			} );
		},
		function () { return mPass; }
	);
	
	
	oTest.fnTest( 
		"iStart correct on first page",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					if ( iStart != 0 )
					{
						mPass = false;
					}
				}
			} );
		},
		function () { return mPass; }
	);
	
	
	oTest.fnTest( 
		"iStart correct on second page",
		function () {
			oSession.fnRestore();
			
			mPass = false;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					if ( iStart == 10 )
					{
						mPass = true;
					}
				}
			} );
			$('#example_next').click();
		},
		function () { return mPass; }
	);
	
	
	oTest.fnTest( 
		"iEnd correct on first page",
		function () {
			oSession.fnRestore();
			
			mPass = true;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					if ( iEnd != 10 )
					{
						mPass = false;
					}
				}
			} );
		},
		function () { return mPass; }
	);
	
	
	oTest.fnTest( 
		"iEnd correct on second page",
		function () {
			oSession.fnRestore();
			
			mPass = false;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					if ( iEnd == 20 )
					{
						mPass = true;
					}
				}
			} );
			$('#example_next').click();
		},
		function () { return mPass; }
	);
	
	
	oTest.fnTest( 
		"aiDisplay length is full data when not filtered",
		function () {
			oSession.fnRestore();
			
			mPass = false;
			$('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					if ( aiDisplay.length == 57 )
					{
						mPass = true;
					}
				}
			} );
		},
		function () { return mPass; }
	);
	
	oTest.fnTest( 
		"aiDisplay length is 9 when filtering on 'Mozilla'",
		function () {
			oSession.fnRestore();
			
			mPass = false;
			oTable = $('#example').dataTable( {
				"fnFooterCallback": function ( nFoot, aasData, iStart, iEnd, aiDisplay ) {
					if ( aiDisplay.length == 9 )
					{
						mPass = true;
					}
				}
			} );
			oTable.fnFilter( "Mozilla" );
		},
		function () { return mPass; }
	);
	
	
	
	oTest.fnComplete();
} );