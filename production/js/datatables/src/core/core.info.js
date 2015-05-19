/**
 * Generate the node required for the info display
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Information element
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlInfo ( oSettings )
{
	var nInfo = document.createElement( 'div' );
	nInfo.className = oSettings.oClasses.sInfo;
	
	/* Actions that are to be taken once only for this feature */
	if ( !oSettings.aanFeatures.i )
	{
		/* Add draw callback */
		oSettings.aoDrawCallback.push( {
			"fn": _fnUpdateInfo,
			"sName": "information"
		} );
		
		/* Add id */
		nInfo.id = oSettings.sTableId+'_info';
	}
	oSettings.nTable.setAttribute( 'aria-describedby', oSettings.sTableId+'_info' );
	
	return nInfo;
}


/**
 * Update the information elements in the display
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnUpdateInfo ( oSettings )
{
	/* Show information about the table */
	if ( !oSettings.oFeatures.bInfo || oSettings.aanFeatures.i.length === 0 )
	{
		return;
	}
	
	var
		oLang = oSettings.oLanguage,
		iStart = oSettings._iDisplayStart+1,
		iEnd = oSettings.fnDisplayEnd(),
		iMax = oSettings.fnRecordsTotal(),
		iTotal = oSettings.fnRecordsDisplay(),
		sOut;
	
	if ( iTotal === 0 )
	{
		/* Empty record set */
		sOut = oLang.sInfoEmpty;
	}
	else {
		/* Normal record set */
		sOut = oLang.sInfo;
	}

	if ( iTotal != iMax )
	{
		/* Record set after filtering */
		sOut += ' ' + oLang.sInfoFiltered;
	}

	// Convert the macros
	sOut += oLang.sInfoPostFix;
	sOut = _fnInfoMacros( oSettings, sOut );
	
	if ( oLang.fnInfoCallback !== null )
	{
		sOut = oLang.fnInfoCallback.call( oSettings.oInstance, 
			oSettings, iStart, iEnd, iMax, iTotal, sOut );
	}
	
	var n = oSettings.aanFeatures.i;
	for ( var i=0, iLen=n.length ; i<iLen ; i++ )
	{
		$(n[i]).html( sOut );
	}
}


function _fnInfoMacros ( oSettings, str )
{
	// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
	// internally
	var
		iStart = oSettings.oScroll.bInfinite ? 1 : oSettings._iDisplayStart+1,
		sStart = oSettings.fnFormatNumber( iStart ),
		iEnd = oSettings.fnDisplayEnd(),
		sEnd = oSettings.fnFormatNumber( iEnd ),
		iTotal = oSettings.fnRecordsDisplay(),
		sTotal = oSettings.fnFormatNumber( iTotal ),
		iMax = oSettings.fnRecordsTotal(),
		sMax = oSettings.fnFormatNumber( iMax );

	return str.
		replace(/_START_/g, sStart).
		replace(/_END_/g,   sEnd).
		replace(/_TOTAL_/g, sTotal).
		replace(/_MAX_/g,   sMax);
}

