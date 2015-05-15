

/**
 * Generate the node required for user display length changing
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Display length feature node
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlLength ( oSettings )
{
	if ( oSettings.oScroll.bInfinite )
	{
		return null;
	}
	
	/* This can be overruled by not using the _MENU_ var/macro in the language variable */
	var sName = 'name="'+oSettings.sTableId+'_length"';
	var sStdMenu = '<select size="1" '+sName+'>';
	var i, iLen;
	var aLengthMenu = oSettings.aLengthMenu;
	
	if ( aLengthMenu.length == 2 && typeof aLengthMenu[0] === 'object' && 
			typeof aLengthMenu[1] === 'object' )
	{
		for ( i=0, iLen=aLengthMenu[0].length ; i<iLen ; i++ )
		{
			sStdMenu += '<option value="'+aLengthMenu[0][i]+'">'+aLengthMenu[1][i]+'</option>';
		}
	}
	else
	{
		for ( i=0, iLen=aLengthMenu.length ; i<iLen ; i++ )
		{
			sStdMenu += '<option value="'+aLengthMenu[i]+'">'+aLengthMenu[i]+'</option>';
		}
	}
	sStdMenu += '</select>';
	
	var nLength = document.createElement( 'div' );
	if ( !oSettings.aanFeatures.l )
	{
		nLength.id = oSettings.sTableId+'_length';
	}
	nLength.className = oSettings.oClasses.sLength;
	nLength.innerHTML = '<label>'+oSettings.oLanguage.sLengthMenu.replace( '_MENU_', sStdMenu )+'</label>';
	
	/*
	 * Set the length to the current display length - thanks to Andrea Pavlovic for this fix,
	 * and Stefan Skopnik for fixing the fix!
	 */
	$('select option[value="'+oSettings._iDisplayLength+'"]', nLength).attr("selected", true);
	
	$('select', nLength).bind( 'change.DT', function(e) {
		var iVal = $(this).val();
		
		/* Update all other length options for the new display */
		var n = oSettings.aanFeatures.l;
		for ( i=0, iLen=n.length ; i<iLen ; i++ )
		{
			if ( n[i] != this.parentNode )
			{
				$('select', n[i]).val( iVal );
			}
		}
		
		/* Redraw the table */
		oSettings._iDisplayLength = parseInt(iVal, 10);
		_fnCalculateEnd( oSettings );
		
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( oSettings.fnDisplayEnd() == oSettings.fnRecordsDisplay() )
		{
			oSettings._iDisplayStart = oSettings.fnDisplayEnd() - oSettings._iDisplayLength;
			if ( oSettings._iDisplayStart < 0 )
			{
				oSettings._iDisplayStart = 0;
			}
		}
		
		if ( oSettings._iDisplayLength == -1 )
		{
			oSettings._iDisplayStart = 0;
		}
		
		_fnDraw( oSettings );
	} );


	$('select', nLength).attr('aria-controls', oSettings.sTableId);
	
	return nLength;
}


/**
 * Recalculate the end point based on the start point
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnCalculateEnd( oSettings )
{
	if ( oSettings.oFeatures.bPaginate === false )
	{
		oSettings._iDisplayEnd = oSettings.aiDisplay.length;
	}
	else
	{
		/* Set the end point of the display - based on how many elements there are
		 * still to display
		 */
		if ( oSettings._iDisplayStart + oSettings._iDisplayLength > oSettings.aiDisplay.length ||
			   oSettings._iDisplayLength == -1 )
		{
			oSettings._iDisplayEnd = oSettings.aiDisplay.length;
		}
		else
		{
			oSettings._iDisplayEnd = oSettings._iDisplayStart + oSettings._iDisplayLength;
		}
	}
}

