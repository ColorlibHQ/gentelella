// DATA_TEMPLATE: empty_table
oTest.fnStart( "5396 - fnUpdate with 2D arrays for a single row" );

$(document).ready( function () {
	$('#example thead tr').append( '<th>6</th>' );
	$('#example thead tr').append( '<th>7</th>' );
	$('#example thead tr').append( '<th>8</th>' );
	$('#example thead tr').append( '<th>9</th>' );
	$('#example thead tr').append( '<th>10</th>' );
	
	var aDataSet = [
    [
        "1",
        "홍길동",
        "1154315",
        "etc1",
        [
            [ "test1@daum.net", "2011-03-04" ],
            [ "test1@naver.com", "2009-07-06" ],
            [ "test4@naver.com", ",hide" ],
            [ "test5?@naver.com", "" ]
        ],
        "2011-03-04",
        "show"
    ],
    [
        "2",
        "홍길순",
        "2154315",
        "etc2",
        [
            [ "test2@daum.net", "2009-09-26" ],
            [ "test2@naver.com", "2009-05-21,hide" ], 
            [ "lsb@naver.com", "2010-03-05" ],
            [ "lsb3@naver.com", ",hide" ],
            [ "sooboklee9@daum.net", "2010-03-05" ]
        ],
        "2010-03-05",
        "show"
    ]
]
	
    var oTable = $('#example').dataTable({
        "aaData": aDataSet,
        "aoColumns": [
          { "mData": "0"},
          { "mData": "1"},
          { "mData": "2"},
          { "mData": "3"},
          { "mData": "4.0.0"},
          { "mData": "4.0.1"},
          { "mData": "4.1.0"},
          { "mData": "4.1.1"},
          { "mData": "5"},
          { "mData": "6"}
        ]
    });
	
	
	oTest.fnTest( 
		"Initialisation",
		null,
		function () {
			return $('#example tbody tr:eq(0) td:eq(0)').html() == '1';
		}
	);
	
	oTest.fnTest( 
		"Update row",
		function () {
      $('#example').dataTable().fnUpdate( [
          "0",
          "홍길순",
          "2154315",
          "etc2",
          [
              [ "test2@daum.net", "2009-09-26" ],
              [ "test2@naver.com", "2009-05-21,hide" ], 
              [ "lsb@naver.com", "2010-03-05" ],
              [ "lsb3@naver.com", ",hide" ],
              [ "sooboklee9@daum.net", "2010-03-05" ]
          ],
          "2010-03-05",
          "show"
      ], 1 );
		},
		function () {
			return $('#example tbody tr:eq(0) td:eq(0)').html() == '0';
		}
	);
	
	oTest.fnTest( 
		"Original row preserved",
		null,
		function () {
			return $('#example tbody tr:eq(1) td:eq(0)').html() == '1';
		}
	);
	
	
	
	oTest.fnComplete();
} );