/**
 * Provide a common method for plug-ins to check the version of DataTables being used, in order
 * to ensure compatibility.
 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
 *    formats "X" and "X.Y" are also acceptable.
 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
 *    version, or false if this version of DataTales is not suitable
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    alert( $.fn.dataTable.fnVersionCheck( '1.9.0' ) );
 */
DataTable.fnVersionCheck = function( sVersion )
{
	var aThis = DataTable.ext.sVersion.split('.');
	var aThat = sVersion.split('.');
	var iThis, iThat;
	
	for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ){
		iThis = parseInt( aThis[i], 10 ) || 0;
		iThat = parseInt( aThat[i], 10 ) || 0;
		
		// Parts are the same, keep comparing
		if (iThis === iThat)
		{
			continue;
		}
		
		// Parts are different, return immediately
		return iThis > iThat;
	}
	return true;
};


/**
 * Check if a TABLE node is a DataTable table already or not.
 *  @param {node} nTable The TABLE node to check if it is a DataTable or not (note that other
 *    node types can be passed in, but will always return false).
 *  @returns {boolean} true the table given is a DataTable, or false otherwise
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    var ex = document.getElementById('example');
 *    if ( ! $.fn.DataTable.fnIsDataTable( ex ) ) {
 *      $(ex).dataTable();
 *    }
 */
DataTable.fnIsDataTable = function ( nTable )
{
	var o = DataTable.settings;

	for ( var i=0 ; i<o.length ; i++ )
	{
		if ( o[i].nTable === nTable || o[i].nScrollHead === nTable || o[i].nScrollFoot === nTable )
		{
			return true;
		}
	}

	return false;
};


/**
 * Get all DataTable tables that have been initialised - optionally you can select to
 * get only currently visible tables.
 *  @param {boolean} [bVisible=false] Flag to indicate if you want all (default) or 
 *    visible tables only.
 *  @returns {array} Array of TABLE nodes (not DataTable instances) which are DataTables
 *  @static
 *  @dtopt API-Static
 *
 *  @example
 *    var table = $.fn.dataTable.fnTables(true);
 *    if ( table.length > 0 ) {
 *      $(table).dataTable().fnAdjustColumnSizing();
 *    }
 */
DataTable.fnTables = function ( bVisible )
{
	var out = [];

	jQuery.each( DataTable.settings, function (i, o) {
		if ( !bVisible || (bVisible === true && $(o.nTable).is(':visible')) )
		{
			out.push( o.nTable );
		}
	} );

	return out;
};

