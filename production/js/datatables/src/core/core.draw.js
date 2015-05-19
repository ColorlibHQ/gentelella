/**
 * Create a new TR element (and it's TD children) for a row
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iRow Row to consider
 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
 *    DataTables will create a row automatically
 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
 *    if nTr is.
 *  @memberof DataTable#oApi
 */
function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
{
	var
		row = oSettings.aoData[iRow],
		rowData = row._aData,
		nTr, nTd, oCol,
		i, iLen;

	if ( row.nTr === null )
	{
		nTr = nTrIn || document.createElement('tr');

		/* Use a private property on the node to allow reserve mapping from the node
		 * to the aoData array for fast look up
		 */
		nTr._DT_RowIndex = iRow;

		/* Special parameters can be given by the data source to be used on the row */
		if ( rowData.DT_RowId )
		{
			nTr.id = rowData.DT_RowId;
		}

		if ( rowData.DT_RowClass )
		{
			nTr.className += ' '+rowData.DT_RowClass;
		}

		/* Process each column */
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			oCol = oSettings.aoColumns[i];

			nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );

			// Need to create the HTML if new, or if a rendering function is defined
			if ( !nTrIn || oCol.mRender || oCol.mData !== i )
			{
				nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
			}
		
			/* Add user defined class */
			if ( oCol.sClass !== null )
			{
				nTd.className += ' '+oCol.sClass;
			}

			// Visibility - add or remove as required
			row._anHidden[i] = oCol.bVisible ? null : nTd;
			if ( oCol.bVisible && ! nTrIn )
			{
				nTr.appendChild( nTd );
			}
			else if ( ! oCol.bVisible && nTrIn )
			{
				nTd.parentNode.removeChild( nTd );
			}

			if ( oCol.fnCreatedCell )
			{
				oCol.fnCreatedCell.call( oSettings.oInstance,
					nTd, _fnGetCellData( oSettings, iRow, i, 'display' ), rowData, iRow, i
				);
			}
		}

		row.nTr = nTr;

		_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
	}
}


/**
 * Create the HTML header for the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnBuildHead( oSettings )
{
	var i, nTh, iLen, j, jLen;
	var iThs = $('th, td', oSettings.nTHead).length;
	var iCorrector = 0;
	var jqChildren;
	
	/* If there is a header in place - then use it - otherwise it's going to get nuked... */
	if ( iThs !== 0 )
	{
		/* We've got a thead from the DOM, so remove hidden columns and apply width to vis cols */
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			nTh = oSettings.aoColumns[i].nTh;
			nTh.setAttribute('role', 'columnheader');
			if ( oSettings.aoColumns[i].bSortable )
			{
				nTh.setAttribute('tabindex', oSettings.iTabIndex);
				nTh.setAttribute('aria-controls', oSettings.sTableId);
			}

			if ( oSettings.aoColumns[i].sClass !== null )
			{
				$(nTh).addClass( oSettings.aoColumns[i].sClass );
			}
			
			/* Set the title of the column if it is user defined (not what was auto detected) */
			if ( oSettings.aoColumns[i].sTitle != nTh.innerHTML )
			{
				nTh.innerHTML = oSettings.aoColumns[i].sTitle;
			}
		}
	}
	else
	{
		/* We don't have a header in the DOM - so we are going to have to create one */
		var nTr = document.createElement( "tr" );
		
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			nTh = oSettings.aoColumns[i].nTh;
			nTh.innerHTML = oSettings.aoColumns[i].sTitle;
			nTh.setAttribute('tabindex', '0');
			
			if ( oSettings.aoColumns[i].sClass !== null )
			{
				$(nTh).addClass( oSettings.aoColumns[i].sClass );
			}
			
			nTr.appendChild( nTh );
		}
		$(oSettings.nTHead).html( '' )[0].appendChild( nTr );
		_fnDetectHeader( oSettings.aoHeader, oSettings.nTHead );
	}
	
	/* ARIA role for the rows */	
	$(oSettings.nTHead).children('tr').attr('role', 'row');
	
	/* Add the extra markup needed by jQuery UI's themes */
	if ( oSettings.bJUI )
	{
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			nTh = oSettings.aoColumns[i].nTh;
			
			var nDiv = document.createElement('div');
			nDiv.className = oSettings.oClasses.sSortJUIWrapper;
			$(nTh).contents().appendTo(nDiv);
			
			var nSpan = document.createElement('span');
			nSpan.className = oSettings.oClasses.sSortIcon;
			nDiv.appendChild( nSpan );
			nTh.appendChild( nDiv );
		}
	}
	
	if ( oSettings.oFeatures.bSort )
	{
		for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
		{
			if ( oSettings.aoColumns[i].bSortable !== false )
			{
				_fnSortAttachListener( oSettings, oSettings.aoColumns[i].nTh, i );
			}
			else
			{
				$(oSettings.aoColumns[i].nTh).addClass( oSettings.oClasses.sSortableNone );
			}
		}
	}
	
	/* Deal with the footer - add classes if required */
	if ( oSettings.oClasses.sFooterTH !== "" )
	{
		$(oSettings.nTFoot).children('tr').children('th').addClass( oSettings.oClasses.sFooterTH );
	}
	
	/* Cache the footer elements */
	if ( oSettings.nTFoot !== null )
	{
		var anCells = _fnGetUniqueThs( oSettings, null, oSettings.aoFooter );
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			if ( anCells[i] )
			{
				oSettings.aoColumns[i].nTf = anCells[i];
				if ( oSettings.aoColumns[i].sClass )
				{
					$(anCells[i]).addClass( oSettings.aoColumns[i].sClass );
				}
			}
		}
	}
}


/**
 * Draw the header (or footer) element based on the column visibility states. The
 * methodology here is to use the layout array from _fnDetectHeader, modified for
 * the instantaneous column visibility, to construct the new layout. The grid is
 * traversed over cell at a time in a rows x columns grid fashion, although each 
 * cell insert can cover multiple elements in the grid - which is tracks using the
 * aApplied array. Cell inserts in the grid will only occur where there isn't
 * already a cell in that position.
 *  @param {object} oSettings dataTables settings object
 *  @param array {objects} aoSource Layout array from _fnDetectHeader
 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc, 
 *  @memberof DataTable#oApi
 */
function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
{
	var i, iLen, j, jLen, k, kLen, n, nLocalTr;
	var aoLocal = [];
	var aApplied = [];
	var iColumns = oSettings.aoColumns.length;
	var iRowspan, iColspan;

	if (  bIncludeHidden === undefined )
	{
		bIncludeHidden = false;
	}

	/* Make a copy of the master layout array, but without the visible columns in it */
	for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
	{
		aoLocal[i] = aoSource[i].slice();
		aoLocal[i].nTr = aoSource[i].nTr;

		/* Remove any columns which are currently hidden */
		for ( j=iColumns-1 ; j>=0 ; j-- )
		{
			if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
			{
				aoLocal[i].splice( j, 1 );
			}
		}

		/* Prep the applied array - it needs an element for each row */
		aApplied.push( [] );
	}

	for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
	{
		nLocalTr = aoLocal[i].nTr;
		
		/* All cells are going to be replaced, so empty out the row */
		if ( nLocalTr )
		{
			while( (n = nLocalTr.firstChild) )
			{
				nLocalTr.removeChild( n );
			}
		}

		for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
		{
			iRowspan = 1;
			iColspan = 1;

			/* Check to see if there is already a cell (row/colspan) covering our target
			 * insert point. If there is, then there is nothing to do.
			 */
			if ( aApplied[i][j] === undefined )
			{
				nLocalTr.appendChild( aoLocal[i][j].cell );
				aApplied[i][j] = 1;

				/* Expand the cell to cover as many rows as needed */
				while ( aoLocal[i+iRowspan] !== undefined &&
				        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
				{
					aApplied[i+iRowspan][j] = 1;
					iRowspan++;
				}

				/* Expand the cell to cover as many columns as needed */
				while ( aoLocal[i][j+iColspan] !== undefined &&
				        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
				{
					/* Must update the applied array over the rows for the columns */
					for ( k=0 ; k<iRowspan ; k++ )
					{
						aApplied[i+k][j+iColspan] = 1;
					}
					iColspan++;
				}

				/* Do the actual expansion in the DOM */
				aoLocal[i][j].cell.rowSpan = iRowspan;
				aoLocal[i][j].cell.colSpan = iColspan;
			}
		}
	}
}


/**
 * Insert the required TR nodes into the table for display
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnDraw( oSettings )
{
	/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
	var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
	if ( $.inArray( false, aPreDraw ) !== -1 )
	{
		_fnProcessingDisplay( oSettings, false );
		return;
	}
	
	var i, iLen, n;
	var anRows = [];
	var iRowCount = 0;
	var iStripes = oSettings.asStripeClasses.length;
	var iOpenRows = oSettings.aoOpenRows.length;
	
	oSettings.bDrawing = true;
	
	/* Check and see if we have an initial draw position from state saving */
	if ( oSettings.iInitDisplayStart !== undefined && oSettings.iInitDisplayStart != -1 )
	{
		if ( oSettings.oFeatures.bServerSide )
		{
			oSettings._iDisplayStart = oSettings.iInitDisplayStart;
		}
		else
		{
			oSettings._iDisplayStart = (oSettings.iInitDisplayStart >= oSettings.fnRecordsDisplay()) ?
				0 : oSettings.iInitDisplayStart;
		}
		oSettings.iInitDisplayStart = -1;
		_fnCalculateEnd( oSettings );
	}
	
	/* Server-side processing draw intercept */
	if ( oSettings.bDeferLoading )
	{
		oSettings.bDeferLoading = false;
		oSettings.iDraw++;
	}
	else if ( !oSettings.oFeatures.bServerSide )
	{
		oSettings.iDraw++;
	}
	else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
	{
		return;
	}
	
	if ( oSettings.aiDisplay.length !== 0 )
	{
		var iStart = oSettings._iDisplayStart;
		var iEnd = oSettings._iDisplayEnd;
		
		if ( oSettings.oFeatures.bServerSide )
		{
			iStart = 0;
			iEnd = oSettings.aoData.length;
		}
		
		for ( var j=iStart ; j<iEnd ; j++ )
		{
			var aoData = oSettings.aoData[ oSettings.aiDisplay[j] ];
			if ( aoData.nTr === null )
			{
				_fnCreateTr( oSettings, oSettings.aiDisplay[j] );
			}

			var nRow = aoData.nTr;
			
			/* Remove the old striping classes and then add the new one */
			if ( iStripes !== 0 )
			{
				var sStripe = oSettings.asStripeClasses[ iRowCount % iStripes ];
				if ( aoData._sRowStripe != sStripe )
				{
					$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
					aoData._sRowStripe = sStripe;
				}
			}
			
			/* Row callback functions - might want to manipulate the row */
			_fnCallbackFire( oSettings, 'aoRowCallback', null, 
				[nRow, oSettings.aoData[ oSettings.aiDisplay[j] ]._aData, iRowCount, j] );
			
			anRows.push( nRow );
			iRowCount++;
			
			/* If there is an open row - and it is attached to this parent - attach it on redraw */
			for ( var k=0 ; k<iOpenRows ; k++ )
			{
				if ( nRow == oSettings.aoOpenRows[k].nParent )
				{
					anRows.push( oSettings.aoOpenRows[k].nTr );
					break;
				}
			}
		}
	}
	else
	{
		/* Table is empty - create a row with an empty message in it */
		anRows[ 0 ] = document.createElement( 'tr' );
		
		if ( oSettings.asStripeClasses[0] )
		{
			anRows[ 0 ].className = oSettings.asStripeClasses[0];
		}

		var oLang = oSettings.oLanguage;
		var sZero = oLang.sZeroRecords;
		if ( oSettings.iDraw == 1 && oSettings.sAjaxSource !== null && !oSettings.oFeatures.bServerSide )
		{
			sZero = oLang.sLoadingRecords;
		}
		else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
		{
			sZero = oLang.sEmptyTable;
		}

		var nTd = document.createElement( 'td' );
		nTd.setAttribute( 'valign', "top" );
		nTd.colSpan = _fnVisbleColumns( oSettings );
		nTd.className = oSettings.oClasses.sRowEmpty;
		nTd.innerHTML = _fnInfoMacros( oSettings, sZero );
		
		anRows[ iRowCount ].appendChild( nTd );
	}
	
	/* Header and footer callbacks */
	_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0], 
		_fnGetDataMaster( oSettings ), oSettings._iDisplayStart, oSettings.fnDisplayEnd(), oSettings.aiDisplay ] );
	
	_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0], 
		_fnGetDataMaster( oSettings ), oSettings._iDisplayStart, oSettings.fnDisplayEnd(), oSettings.aiDisplay ] );
	
	/* 
	 * Need to remove any old row from the display - note we can't just empty the tbody using
	 * $().html('') since this will unbind the jQuery event handlers (even although the node 
	 * still exists!) - equally we can't use innerHTML, since IE throws an exception.
	 */
	var
		nAddFrag = document.createDocumentFragment(),
		nRemoveFrag = document.createDocumentFragment(),
		nBodyPar;
	
	if ( oSettings.nTBody )
	{
		nBodyPar = oSettings.nTBody.parentNode;
		nRemoveFrag.appendChild( oSettings.nTBody );
		
		/* When doing infinite scrolling, only remove child rows when sorting, filtering or start
		 * up. When not infinite scroll, always do it.
		 */
		if ( !oSettings.oScroll.bInfinite || !oSettings._bInitComplete ||
		 	oSettings.bSorted || oSettings.bFiltered )
		{
			while( (n = oSettings.nTBody.firstChild) )
			{
				oSettings.nTBody.removeChild( n );
			}
		}
		
		/* Put the draw table into the dom */
		for ( i=0, iLen=anRows.length ; i<iLen ; i++ )
		{
			nAddFrag.appendChild( anRows[i] );
		}
		
		oSettings.nTBody.appendChild( nAddFrag );
		if ( nBodyPar !== null )
		{
			nBodyPar.appendChild( oSettings.nTBody );
		}
	}
	
	/* Call all required callback functions for the end of a draw */
	_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
	/* Draw is complete, sorting and filtering must be as well */
	oSettings.bSorted = false;
	oSettings.bFiltered = false;
	oSettings.bDrawing = false;
	
	if ( oSettings.oFeatures.bServerSide )
	{
		_fnProcessingDisplay( oSettings, false );
		if ( !oSettings._bInitComplete )
		{
			_fnInitComplete( oSettings );
		}
	}
}


/**
 * Redraw the table - taking account of the various features which are enabled
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnReDraw( oSettings )
{
	if ( oSettings.oFeatures.bSort )
	{
		/* Sorting will refilter and draw for us */
		_fnSort( oSettings, oSettings.oPreviousSearch );
	}
	else if ( oSettings.oFeatures.bFilter )
	{
		/* Filtering will redraw for us */
		_fnFilterComplete( oSettings, oSettings.oPreviousSearch );
	}
	else
	{
		_fnCalculateEnd( oSettings );
		_fnDraw( oSettings );
	}
}


/**
 * Add the options to the page HTML for the table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnAddOptionsHtml ( oSettings )
{
	/*
	 * Create a temporary, empty, div which we can later on replace with what we have generated
	 * we do it this way to rendering the 'options' html offline - speed :-)
	 */
	var nHolding = $('<div></div>')[0];
	oSettings.nTable.parentNode.insertBefore( nHolding, oSettings.nTable );
	
	/* 
	 * All DataTables are wrapped in a div
	 */
	oSettings.nTableWrapper = $('<div id="'+oSettings.sTableId+'_wrapper" class="'+oSettings.oClasses.sWrapper+'" role="grid"></div>')[0];
	oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;

	/* Track where we want to insert the option */
	var nInsertNode = oSettings.nTableWrapper;
	
	/* Loop over the user set positioning and place the elements as needed */
	var aDom = oSettings.sDom.split('');
	var nTmp, iPushFeature, cOption, nNewNode, cNext, sAttr, j;
	for ( var i=0 ; i<aDom.length ; i++ )
	{
		iPushFeature = 0;
		cOption = aDom[i];
		
		if ( cOption == '<' )
		{
			/* New container div */
			nNewNode = $('<div></div>')[0];
			
			/* Check to see if we should append an id and/or a class name to the container */
			cNext = aDom[i+1];
			if ( cNext == "'" || cNext == '"' )
			{
				sAttr = "";
				j = 2;
				while ( aDom[i+j] != cNext )
				{
					sAttr += aDom[i+j];
					j++;
				}
				
				/* Replace jQuery UI constants */
				if ( sAttr == "H" )
				{
					sAttr = oSettings.oClasses.sJUIHeader;
				}
				else if ( sAttr == "F" )
				{
					sAttr = oSettings.oClasses.sJUIFooter;
				}
				
				/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
				 * breaks the string into parts and applies them as needed
				 */
				if ( sAttr.indexOf('.') != -1 )
				{
					var aSplit = sAttr.split('.');
					nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
					nNewNode.className = aSplit[1];
				}
				else if ( sAttr.charAt(0) == "#" )
				{
					nNewNode.id = sAttr.substr(1, sAttr.length-1);
				}
				else
				{
					nNewNode.className = sAttr;
				}
				
				i += j; /* Move along the position array */
			}
			
			nInsertNode.appendChild( nNewNode );
			nInsertNode = nNewNode;
		}
		else if ( cOption == '>' )
		{
			/* End container div */
			nInsertNode = nInsertNode.parentNode;
		}
		else if ( cOption == 'l' && oSettings.oFeatures.bPaginate && oSettings.oFeatures.bLengthChange )
		{
			/* Length */
			nTmp = _fnFeatureHtmlLength( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 'f' && oSettings.oFeatures.bFilter )
		{
			/* Filter */
			nTmp = _fnFeatureHtmlFilter( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 'r' && oSettings.oFeatures.bProcessing )
		{
			/* pRocessing */
			nTmp = _fnFeatureHtmlProcessing( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 't' )
		{
			/* Table */
			nTmp = _fnFeatureHtmlTable( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption ==  'i' && oSettings.oFeatures.bInfo )
		{
			/* Info */
			nTmp = _fnFeatureHtmlInfo( oSettings );
			iPushFeature = 1;
		}
		else if ( cOption == 'p' && oSettings.oFeatures.bPaginate )
		{
			/* Pagination */
			nTmp = _fnFeatureHtmlPaginate( oSettings );
			iPushFeature = 1;
		}
		else if ( DataTable.ext.aoFeatures.length !== 0 )
		{
			/* Plug-in features */
			var aoFeatures = DataTable.ext.aoFeatures;
			for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
			{
				if ( cOption == aoFeatures[k].cFeature )
				{
					nTmp = aoFeatures[k].fnInit( oSettings );
					if ( nTmp )
					{
						iPushFeature = 1;
					}
					break;
				}
			}
		}
		
		/* Add to the 2D features array */
		if ( iPushFeature == 1 && nTmp !== null )
		{
			if ( typeof oSettings.aanFeatures[cOption] !== 'object' )
			{
				oSettings.aanFeatures[cOption] = [];
			}
			oSettings.aanFeatures[cOption].push( nTmp );
			nInsertNode.appendChild( nTmp );
		}
	}
	
	/* Built our DOM structure - replace the holding div with what we want */
	nHolding.parentNode.replaceChild( oSettings.nTableWrapper, nHolding );
}


/**
 * Use the DOM source to create up an array of header cells. The idea here is to
 * create a layout grid (array) of rows x columns, which contains a reference
 * to the cell that that point in the grid (regardless of col/rowspan), such that
 * any column / row could be removed and the new grid constructed
 *  @param array {object} aLayout Array to store the calculated layout in
 *  @param {node} nThead The header/footer element for the table
 *  @memberof DataTable#oApi
 */
function _fnDetectHeader ( aLayout, nThead )
{
	var nTrs = $(nThead).children('tr');
	var nTr, nCell;
	var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
	var bUnique;
	var fnShiftCol = function ( a, i, j ) {
		var k = a[i];
                while ( k[j] ) {
			j++;
		}
		return j;
	};

	aLayout.splice( 0, aLayout.length );
	
	/* We know how many rows there are in the layout - so prep it */
	for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
	{
		aLayout.push( [] );
	}
	
	/* Calculate a layout array */
	for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
	{
		nTr = nTrs[i];
		iColumn = 0;
		
		/* For every cell in the row... */
		nCell = nTr.firstChild;
		while ( nCell ) {
			if ( nCell.nodeName.toUpperCase() == "TD" ||
			     nCell.nodeName.toUpperCase() == "TH" )
			{
				/* Get the col and rowspan attributes from the DOM and sanitise them */
				iColspan = nCell.getAttribute('colspan') * 1;
				iRowspan = nCell.getAttribute('rowspan') * 1;
				iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
				iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;

				/* There might be colspan cells already in this row, so shift our target 
				 * accordingly
				 */
				iColShifted = fnShiftCol( aLayout, i, iColumn );
				
				/* Cache calculation for unique columns */
				bUnique = iColspan === 1 ? true : false;
				
				/* If there is col / rowspan, copy the information into the layout grid */
				for ( l=0 ; l<iColspan ; l++ )
				{
					for ( k=0 ; k<iRowspan ; k++ )
					{
						aLayout[i+k][iColShifted+l] = {
							"cell": nCell,
							"unique": bUnique
						};
						aLayout[i+k].nTr = nTr;
					}
				}
			}
			nCell = nCell.nextSibling;
		}
	}
}


/**
 * Get an array of unique th elements, one for each column
 *  @param {object} oSettings dataTables settings object
 *  @param {node} nHeader automatically detect the layout from this node - optional
 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
 *  @returns array {node} aReturn list of unique th's
 *  @memberof DataTable#oApi
 */
function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
{
	var aReturn = [];
	if ( !aLayout )
	{
		aLayout = oSettings.aoHeader;
		if ( nHeader )
		{
			aLayout = [];
			_fnDetectHeader( aLayout, nHeader );
		}
	}

	for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
	{
		for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
		{
			if ( aLayout[i][j].unique && 
				 (!aReturn[j] || !oSettings.bSortCellsTop) )
			{
				aReturn[j] = aLayout[i][j].cell;
			}
		}
	}
	
	return aReturn;
}

