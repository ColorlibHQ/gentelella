

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Note that most of the paging logic is done in 
 * DataTable.ext.oPagination
 */

/**
 * Generate the node required for default pagination
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Pagination feature node
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlPaginate ( oSettings )
{
	if ( oSettings.oScroll.bInfinite )
	{
		return null;
	}
	
	var nPaginate = document.createElement( 'div' );
	nPaginate.className = oSettings.oClasses.sPaging+oSettings.sPaginationType;
	
	DataTable.ext.oPagination[ oSettings.sPaginationType ].fnInit( oSettings, nPaginate, 
		function( oSettings ) {
			_fnCalculateEnd( oSettings );
			_fnDraw( oSettings );
		}
	);
	
	/* Add a draw callback for the pagination on first instance, to update the paging display */
	if ( !oSettings.aanFeatures.p )
	{
		oSettings.aoDrawCallback.push( {
			"fn": function( oSettings ) {
				DataTable.ext.oPagination[ oSettings.sPaginationType ].fnUpdate( oSettings, function( oSettings ) {
					_fnCalculateEnd( oSettings );
					_fnDraw( oSettings );
				} );
			},
			"sName": "pagination"
		} );
	}
	return nPaginate;
}


/**
 * Alter the display settings to change the page
 *  @param {object} oSettings dataTables settings object
 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
 *    or page number to jump to (integer)
 *  @returns {bool} true page has changed, false - no change (no effect) eg 'first' on page 1
 *  @memberof DataTable#oApi
 */
function _fnPageChange ( oSettings, mAction )
{
	var iOldStart = oSettings._iDisplayStart;
	
	if ( typeof mAction === "number" )
	{
		oSettings._iDisplayStart = mAction * oSettings._iDisplayLength;
		if ( oSettings._iDisplayStart > oSettings.fnRecordsDisplay() )
		{
			oSettings._iDisplayStart = 0;
		}
	}
	else if ( mAction == "first" )
	{
		oSettings._iDisplayStart = 0;
	}
	else if ( mAction == "previous" )
	{
		oSettings._iDisplayStart = oSettings._iDisplayLength>=0 ?
			oSettings._iDisplayStart - oSettings._iDisplayLength :
			0;
		
		/* Correct for under-run */
		if ( oSettings._iDisplayStart < 0 )
		{
		  oSettings._iDisplayStart = 0;
		}
	}
	else if ( mAction == "next" )
	{
		if ( oSettings._iDisplayLength >= 0 )
		{
			/* Make sure we are not over running the display array */
			if ( oSettings._iDisplayStart + oSettings._iDisplayLength < oSettings.fnRecordsDisplay() )
			{
				oSettings._iDisplayStart += oSettings._iDisplayLength;
			}
		}
		else
		{
			oSettings._iDisplayStart = 0;
		}
	}
	else if ( mAction == "last" )
	{
		if ( oSettings._iDisplayLength >= 0 )
		{
			var iPages = parseInt( (oSettings.fnRecordsDisplay()-1) / oSettings._iDisplayLength, 10 ) + 1;
			oSettings._iDisplayStart = (iPages-1) * oSettings._iDisplayLength;
		}
		else
		{
			oSettings._iDisplayStart = 0;
		}
	}
	else
	{
		_fnLog( oSettings, 0, "Unknown paging action: "+mAction );
	}
	$(oSettings.oInstance).trigger('page', oSettings);
	
	return iOldStart != oSettings._iDisplayStart;
}

