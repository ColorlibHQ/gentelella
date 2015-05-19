

/**
 * Generate the node required for the processing node
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Processing element
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlProcessing ( oSettings )
{
	var nProcessing = document.createElement( 'div' );
	
	if ( !oSettings.aanFeatures.r )
	{
		nProcessing.id = oSettings.sTableId+'_processing';
	}
	nProcessing.innerHTML = oSettings.oLanguage.sProcessing;
	nProcessing.className = oSettings.oClasses.sProcessing;
	oSettings.nTable.parentNode.insertBefore( nProcessing, oSettings.nTable );
	
	return nProcessing;
}


/**
 * Display or hide the processing indicator
 *  @param {object} oSettings dataTables settings object
 *  @param {bool} bShow Show the processing indicator (true) or not (false)
 *  @memberof DataTable#oApi
 */
function _fnProcessingDisplay ( oSettings, bShow )
{
	if ( oSettings.oFeatures.bProcessing )
	{
		var an = oSettings.aanFeatures.r;
		for ( var i=0, iLen=an.length ; i<iLen ; i++ )
		{
			an[i].style.visibility = bShow ? "visible" : "hidden";
		}
	}

	$(oSettings.oInstance).trigger('processing', [oSettings, bShow]);
}

