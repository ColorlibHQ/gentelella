
/**
 * Return the settings object for a particular table
 *  @param {node} nTable table we are using as a dataTable
 *  @returns {object} Settings object - or null if not found
 *  @memberof DataTable#oApi
 */
function _fnSettingsFromNode ( nTable )
{
	for ( var i=0 ; i<DataTable.settings.length ; i++ )
	{
		if ( DataTable.settings[i].nTable === nTable )
		{
			return DataTable.settings[i];
		}
	}
	
	return null;
}


/**
 * Return an array with the TR nodes for the table
 *  @param {object} oSettings dataTables settings object
 *  @returns {array} TR array
 *  @memberof DataTable#oApi
 */
function _fnGetTrNodes ( oSettings )
{
	var aNodes = [];
	var aoData = oSettings.aoData;
	for ( var i=0, iLen=aoData.length ; i<iLen ; i++ )
	{
		if ( aoData[i].nTr !== null )
		{
			aNodes.push( aoData[i].nTr );
		}
	}
	return aNodes;
}


/**
 * Return an flat array with all TD nodes for the table, or row
 *  @param {object} oSettings dataTables settings object
 *  @param {int} [iIndividualRow] aoData index to get the nodes for - optional 
 *    if not given then the return array will contain all nodes for the table
 *  @returns {array} TD array
 *  @memberof DataTable#oApi
 */
function _fnGetTdNodes ( oSettings, iIndividualRow )
{
	var anReturn = [];
	var iCorrector;
	var anTds, nTd;
	var iRow, iRows=oSettings.aoData.length,
		iColumn, iColumns, oData, sNodeName, iStart=0, iEnd=iRows;
	
	/* Allow the collection to be limited to just one row */
	if ( iIndividualRow !== undefined )
	{
		iStart = iIndividualRow;
		iEnd = iIndividualRow+1;
	}

	for ( iRow=iStart ; iRow<iEnd ; iRow++ )
	{
		oData = oSettings.aoData[iRow];
		if ( oData.nTr !== null )
		{
			/* get the TD child nodes - taking into account text etc nodes */
			anTds = [];
			nTd = oData.nTr.firstChild;
			while ( nTd )
			{
				sNodeName = nTd.nodeName.toLowerCase();
				if ( sNodeName == 'td' || sNodeName == 'th' )
				{
					anTds.push( nTd );
				}
				nTd = nTd.nextSibling;
			}

			iCorrector = 0;
			for ( iColumn=0, iColumns=oSettings.aoColumns.length ; iColumn<iColumns ; iColumn++ )
			{
				if ( oSettings.aoColumns[iColumn].bVisible )
				{
					anReturn.push( anTds[iColumn-iCorrector] );
				}
				else
				{
					anReturn.push( oData._anHidden[iColumn] );
					iCorrector++;
				}
			}
		}
	}

	return anReturn;
}


/**
 * Log an error message
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iLevel log error messages, or display them to the user
 *  @param {string} sMesg error message
 *  @memberof DataTable#oApi
 */
function _fnLog( oSettings, iLevel, sMesg )
{
	var sAlert = (oSettings===null) ?
		"DataTables warning: "+sMesg :
		"DataTables warning (table id = '"+oSettings.sTableId+"'): "+sMesg;
	
	if ( iLevel === 0 )
	{
		if ( DataTable.ext.sErrMode == 'alert' )
		{
			alert( sAlert );
		}
		else
		{
			throw new Error(sAlert);
		}
		return;
	}
	else if ( window.console && console.log )
	{
		console.log( sAlert );
	}
}


/**
 * See if a property is defined on one object, if so assign it to the other object
 *  @param {object} oRet target object
 *  @param {object} oSrc source object
 *  @param {string} sName property
 *  @param {string} [sMappedName] name to map too - optional, sName used if not given
 *  @memberof DataTable#oApi
 */
function _fnMap( oRet, oSrc, sName, sMappedName )
{
	if ( sMappedName === undefined )
	{
		sMappedName = sName;
	}
	if ( oSrc[sName] !== undefined )
	{
		oRet[sMappedName] = oSrc[sName];
	}
}


/**
 * Extend objects - very similar to jQuery.extend, but deep copy objects, and shallow
 * copy arrays. The reason we need to do this, is that we don't want to deep copy array
 * init values (such as aaSorting) since the dev wouldn't be able to override them, but
 * we do want to deep copy arrays.
 *  @param {object} oOut Object to extend
 *  @param {object} oExtender Object from which the properties will be applied to oOut
 *  @returns {object} oOut Reference, just for convenience - oOut === the return.
 *  @memberof DataTable#oApi
 *  @todo This doesn't take account of arrays inside the deep copied objects.
 */
function _fnExtend( oOut, oExtender )
{
	var val;
	
	for ( var prop in oExtender )
	{
		if ( oExtender.hasOwnProperty(prop) )
		{
			val = oExtender[prop];

			if ( typeof oExtender[prop] === 'object' && val !== null && $.isArray(val) === false )
			{
				$.extend( true, oOut[prop], val );
			}
			else
			{
				oOut[prop] = val;
			}
		}
	}

	return oOut;
}


/**
 * Bind an event handers to allow a click or return key to activate the callback.
 * This is good for accessibility since a return on the keyboard will have the
 * same effect as a click, if the element has focus.
 *  @param {element} n Element to bind the action to
 *  @param {object} oData Data object to pass to the triggered function
 *  @param {function} fn Callback function for when the event is triggered
 *  @memberof DataTable#oApi
 */
function _fnBindAction( n, oData, fn )
{
	$(n)
		.bind( 'click.DT', oData, function (e) {
				n.blur(); // Remove focus outline for mouse users
				fn(e);
			} )
		.bind( 'keypress.DT', oData, function (e){
			if ( e.which === 13 ) {
				fn(e);
			} } )
		.bind( 'selectstart.DT', function () {
			/* Take the brutal approach to cancelling text selection */
			return false;
			} );
}


/**
 * Register a callback function. Easily allows a callback function to be added to
 * an array store of callback functions that can then all be called together.
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
 *  @param {function} fn Function to be called back
 *  @param {string} sName Identifying name for the callback (i.e. a label)
 *  @memberof DataTable#oApi
 */
function _fnCallbackReg( oSettings, sStore, fn, sName )
{
	if ( fn )
	{
		oSettings[sStore].push( {
			"fn": fn,
			"sName": sName
		} );
	}
}


/**
 * Fire callback functions and trigger events. Note that the loop over the callback
 * array store is done backwards! Further note that you do not want to fire off triggers
 * in time sensitive applications (for example cell creation) as its slow.
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
 *  @param {string} sTrigger Name of the jQuery custom event to trigger. If null no trigger
 *    is fired
 *  @param {array} aArgs Array of arguments to pass to the callback function / trigger
 *  @memberof DataTable#oApi
 */
function _fnCallbackFire( oSettings, sStore, sTrigger, aArgs )
{
	var aoStore = oSettings[sStore];
	var aRet =[];

	for ( var i=aoStore.length-1 ; i>=0 ; i-- )
	{
		aRet.push( aoStore[i].fn.apply( oSettings.oInstance, aArgs ) );
	}

	if ( sTrigger !== null )
	{
		$(oSettings.oInstance).trigger(sTrigger, aArgs);
	}

	return aRet;
}


/**
 * From some browsers (specifically IE6/7) we need special handling to work around browser
 * bugs - this function is used to detect when these workarounds are needed.
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnBrowserDetect( oSettings )
{
	/* IE6/7 will oversize a width 100% element inside a scrolling element, to include the
	 * width of the scrollbar, while other browsers ensure the inner element is contained
	 * without forcing scrolling
	 */
	var n = $(
		'<div style="position:absolute; top:0; left:0; height:1px; width:1px; overflow:hidden">'+
			'<div style="position:absolute; top:1px; left:1px; width:100px; overflow:scroll;">'+
				'<div id="DT_BrowserTest" style="width:100%; height:10px;"></div>'+
			'</div>'+
		'</div>')[0];

	document.body.appendChild( n );
	oSettings.oBrowser.bScrollOversize = $('#DT_BrowserTest', n)[0].offsetWidth === 100 ? true : false;
	document.body.removeChild( n );
}

