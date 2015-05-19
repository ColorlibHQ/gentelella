$.extend( DataTable.ext.oSort, {
	/*
	 * text sorting
	 */
	"string-pre": function ( a )
	{
		if ( typeof a != 'string' )
		{
			if (a === null || a === undefined || !a.toString)
			{
				return '';
			}
			a = a.toString();
		}
		return a.toLowerCase();
	},

	// string-asc and -desc are retained only for compatibility with 
	"string-asc": function ( x, y )
	{
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	},
	
	"string-desc": function ( x, y )
	{
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	},
	
	
	/*
	 * html sorting (ignore html tags)
	 */
	"html-pre": function ( a )
	{
		return a.replace( /<.*?>/g, "" ).toLowerCase();
	},
	
	
	/*
	 * date sorting
	 */
	"date-pre": function ( a )
	{
		var x = Date.parse( a );
		
		if ( isNaN(x) || x==="" )
		{
			x = Date.parse( "01/01/1970 00:00:00" );
		}
		return x;
	},
	
	
	/*
	 * numerical sorting
	 */
	"numeric-pre": function ( a )
	{
		return (a=="-" || a==="") ? -Infinity : a*1;
	}
} );
