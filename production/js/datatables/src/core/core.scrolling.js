/**
 * Add any control elements for the table - specifically scrolling
 *  @param {object} oSettings dataTables settings object
 *  @returns {node} Node to add to the DOM
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlTable ( oSettings )
{
	/* Check if scrolling is enabled or not - if not then leave the DOM unaltered */
	if ( oSettings.oScroll.sX === "" && oSettings.oScroll.sY === "" )
	{
		return oSettings.nTable;
	}
	
	/*
	 * The HTML structure that we want to generate in this function is:
	 *  div - nScroller
	 *    div - nScrollHead
	 *      div - nScrollHeadInner
	 *        table - nScrollHeadTable
	 *          thead - nThead
	 *    div - nScrollBody
	 *      table - oSettings.nTable
	 *        thead - nTheadSize
	 *        tbody - nTbody
	 *    div - nScrollFoot
	 *      div - nScrollFootInner
	 *        table - nScrollFootTable
	 *          tfoot - nTfoot
	 */
	var
	 	nScroller = document.createElement('div'),
	 	nScrollHead = document.createElement('div'),
	 	nScrollHeadInner = document.createElement('div'),
	 	nScrollBody = document.createElement('div'),
	 	nScrollFoot = document.createElement('div'),
	 	nScrollFootInner = document.createElement('div'),
	 	nScrollHeadTable = oSettings.nTable.cloneNode(false),
	 	nScrollFootTable = oSettings.nTable.cloneNode(false),
		nThead = oSettings.nTable.getElementsByTagName('thead')[0],
	 	nTfoot = oSettings.nTable.getElementsByTagName('tfoot').length === 0 ? null : 
			oSettings.nTable.getElementsByTagName('tfoot')[0],
		oClasses = oSettings.oClasses;
	
	nScrollHead.appendChild( nScrollHeadInner );
	nScrollFoot.appendChild( nScrollFootInner );
	nScrollBody.appendChild( oSettings.nTable );
	nScroller.appendChild( nScrollHead );
	nScroller.appendChild( nScrollBody );
	nScrollHeadInner.appendChild( nScrollHeadTable );
	nScrollHeadTable.appendChild( nThead );
	if ( nTfoot !== null )
	{
		nScroller.appendChild( nScrollFoot );
		nScrollFootInner.appendChild( nScrollFootTable );
		nScrollFootTable.appendChild( nTfoot );
	}
	
	nScroller.className = oClasses.sScrollWrapper;
	nScrollHead.className = oClasses.sScrollHead;
	nScrollHeadInner.className = oClasses.sScrollHeadInner;
	nScrollBody.className = oClasses.sScrollBody;
	nScrollFoot.className = oClasses.sScrollFoot;
	nScrollFootInner.className = oClasses.sScrollFootInner;
	
	if ( oSettings.oScroll.bAutoCss )
	{
		nScrollHead.style.overflow = "hidden";
		nScrollHead.style.position = "relative";
		nScrollFoot.style.overflow = "hidden";
		nScrollBody.style.overflow = "auto";
	}
	
	nScrollHead.style.border = "0";
	nScrollHead.style.width = "100%";
	nScrollFoot.style.border = "0";
	nScrollHeadInner.style.width = oSettings.oScroll.sXInner !== "" ?
		oSettings.oScroll.sXInner : "100%"; /* will be overwritten */
	
	/* Modify attributes to respect the clones */
	nScrollHeadTable.removeAttribute('id');
	nScrollHeadTable.style.marginLeft = "0";
	oSettings.nTable.style.marginLeft = "0";
	if ( nTfoot !== null )
	{
		nScrollFootTable.removeAttribute('id');
		nScrollFootTable.style.marginLeft = "0";
	}
	
	/* Move caption elements from the body to the header, footer or leave where it is
	 * depending on the configuration. Note that the DTD says there can be only one caption */
	var nCaption = $(oSettings.nTable).children('caption');
	if ( nCaption.length > 0 )
	{
		nCaption = nCaption[0];
		if ( nCaption._captionSide === "top" )
		{
			nScrollHeadTable.appendChild( nCaption );
		}
		else if ( nCaption._captionSide === "bottom" && nTfoot )
		{
			nScrollFootTable.appendChild( nCaption );
		}
	}
	
	/*
	 * Sizing
	 */
	/* When x-scrolling add the width and a scroller to move the header with the body */
	if ( oSettings.oScroll.sX !== "" )
	{
		nScrollHead.style.width = _fnStringToCss( oSettings.oScroll.sX );
		nScrollBody.style.width = _fnStringToCss( oSettings.oScroll.sX );
		
		if ( nTfoot !== null )
		{
			nScrollFoot.style.width = _fnStringToCss( oSettings.oScroll.sX );	
		}
		
		/* When the body is scrolled, then we also want to scroll the headers */
		$(nScrollBody).scroll( function (e) {
			nScrollHead.scrollLeft = this.scrollLeft;
			
			if ( nTfoot !== null )
			{
				nScrollFoot.scrollLeft = this.scrollLeft;
			}
		} );
	}
	
	/* When yscrolling, add the height */
	if ( oSettings.oScroll.sY !== "" )
	{
		nScrollBody.style.height = _fnStringToCss( oSettings.oScroll.sY );
	}
	
	/* Redraw - align columns across the tables */
	oSettings.aoDrawCallback.push( {
		"fn": _fnScrollDraw,
		"sName": "scrolling"
	} );
	
	/* Infinite scrolling event handlers */
	if ( oSettings.oScroll.bInfinite )
	{
		$(nScrollBody).scroll( function() {
			/* Use a blocker to stop scrolling from loading more data while other data is still loading */
			if ( !oSettings.bDrawing && $(this).scrollTop() !== 0 )
			{
				/* Check if we should load the next data set */
				if ( $(this).scrollTop() + $(this).height() > 
					$(oSettings.nTable).height() - oSettings.oScroll.iLoadGap )
				{
					/* Only do the redraw if we have to - we might be at the end of the data */
					if ( oSettings.fnDisplayEnd() < oSettings.fnRecordsDisplay() )
					{
						_fnPageChange( oSettings, 'next' );
						_fnCalculateEnd( oSettings );
						_fnDraw( oSettings );
					}
				}
			}
		} );
	}
	
	oSettings.nScrollHead = nScrollHead;
	oSettings.nScrollFoot = nScrollFoot;
	
	return nScroller;
}


/**
 * Update the various tables for resizing. It's a bit of a pig this function, but
 * basically the idea to:
 *   1. Re-create the table inside the scrolling div
 *   2. Take live measurements from the DOM
 *   3. Apply the measurements
 *   4. Clean up
 *  @param {object} o dataTables settings object
 *  @returns {node} Node to add to the DOM
 *  @memberof DataTable#oApi
 */
function _fnScrollDraw ( o )
{
	var
		nScrollHeadInner = o.nScrollHead.getElementsByTagName('div')[0],
		nScrollHeadTable = nScrollHeadInner.getElementsByTagName('table')[0],
		nScrollBody = o.nTable.parentNode,
		i, iLen, j, jLen, anHeadToSize, anHeadSizers, anFootSizers, anFootToSize, oStyle, iVis,
		nTheadSize, nTfootSize,
		iWidth, aApplied=[], aAppliedFooter=[], iSanityWidth,
		nScrollFootInner = (o.nTFoot !== null) ? o.nScrollFoot.getElementsByTagName('div')[0] : null,
		nScrollFootTable = (o.nTFoot !== null) ? nScrollFootInner.getElementsByTagName('table')[0] : null,
		ie67 = o.oBrowser.bScrollOversize,
		zeroOut = function(nSizer) {
			oStyle = nSizer.style;
			oStyle.paddingTop = "0";
			oStyle.paddingBottom = "0";
			oStyle.borderTopWidth = "0";
			oStyle.borderBottomWidth = "0";
			oStyle.height = 0;
		};
	
	/*
	 * 1. Re-create the table inside the scrolling div
	 */
	
	/* Remove the old minimised thead and tfoot elements in the inner table */
	$(o.nTable).children('thead, tfoot').remove();

	/* Clone the current header and footer elements and then place it into the inner table */
	nTheadSize = $(o.nTHead).clone()[0];
	o.nTable.insertBefore( nTheadSize, o.nTable.childNodes[0] );
	anHeadToSize = o.nTHead.getElementsByTagName('tr');
	anHeadSizers = nTheadSize.getElementsByTagName('tr');
	
	if ( o.nTFoot !== null )
	{
		nTfootSize = $(o.nTFoot).clone()[0];
		o.nTable.insertBefore( nTfootSize, o.nTable.childNodes[1] );
		anFootToSize = o.nTFoot.getElementsByTagName('tr');
		anFootSizers = nTfootSize.getElementsByTagName('tr');
	}
	
	/*
	 * 2. Take live measurements from the DOM - do not alter the DOM itself!
	 */
	
	/* Remove old sizing and apply the calculated column widths
	 * Get the unique column headers in the newly created (cloned) header. We want to apply the
	 * calculated sizes to this header
	 */
	if ( o.oScroll.sX === "" )
	{
		nScrollBody.style.width = '100%';
		nScrollHeadInner.parentNode.style.width = '100%';
	}
	
	var nThs = _fnGetUniqueThs( o, nTheadSize );
	for ( i=0, iLen=nThs.length ; i<iLen ; i++ )
	{
		iVis = _fnVisibleToColumnIndex( o, i );
		nThs[i].style.width = o.aoColumns[iVis].sWidth;
	}
	
	if ( o.nTFoot !== null )
	{
		_fnApplyToChildren( function(n) {
			n.style.width = "";
		}, anFootSizers );
	}

	// If scroll collapse is enabled, when we put the headers back into the body for sizing, we
	// will end up forcing the scrollbar to appear, making our measurements wrong for when we
	// then hide it (end of this function), so add the header height to the body scroller.
	if ( o.oScroll.bCollapse && o.oScroll.sY !== "" )
	{
		nScrollBody.style.height = (nScrollBody.offsetHeight + o.nTHead.offsetHeight)+"px";
	}
	
	/* Size the table as a whole */
	iSanityWidth = $(o.nTable).outerWidth();
	if ( o.oScroll.sX === "" )
	{
		/* No x scrolling */
		o.nTable.style.width = "100%";
		
		/* I know this is rubbish - but IE7 will make the width of the table when 100% include
		 * the scrollbar - which is shouldn't. When there is a scrollbar we need to take this
		 * into account.
		 */
		if ( ie67 && ($('tbody', nScrollBody).height() > nScrollBody.offsetHeight || 
			$(nScrollBody).css('overflow-y') == "scroll")  )
		{
			o.nTable.style.width = _fnStringToCss( $(o.nTable).outerWidth() - o.oScroll.iBarWidth);
		}
	}
	else
	{
		if ( o.oScroll.sXInner !== "" )
		{
			/* x scroll inner has been given - use it */
			o.nTable.style.width = _fnStringToCss(o.oScroll.sXInner);
		}
		else if ( iSanityWidth == $(nScrollBody).width() &&
		   $(nScrollBody).height() < $(o.nTable).height() )
		{
			/* There is y-scrolling - try to take account of the y scroll bar */
			o.nTable.style.width = _fnStringToCss( iSanityWidth-o.oScroll.iBarWidth );
			if ( $(o.nTable).outerWidth() > iSanityWidth-o.oScroll.iBarWidth )
			{
				/* Not possible to take account of it */
				o.nTable.style.width = _fnStringToCss( iSanityWidth );
			}
		}
		else
		{
			/* All else fails */
			o.nTable.style.width = _fnStringToCss( iSanityWidth );
		}
	}
	
	/* Recalculate the sanity width - now that we've applied the required width, before it was
	 * a temporary variable. This is required because the column width calculation is done
	 * before this table DOM is created.
	 */
	iSanityWidth = $(o.nTable).outerWidth();
	
	/* We want the hidden header to have zero height, so remove padding and borders. Then
	 * set the width based on the real headers
	 */
	
	// Apply all styles in one pass. Invalidates layout only once because we don't read any 
	// DOM properties.
	_fnApplyToChildren( zeroOut, anHeadSizers );
	 
	// Read all widths in next pass. Forces layout only once because we do not change 
	// any DOM properties.
	_fnApplyToChildren( function(nSizer) {
		aApplied.push( _fnStringToCss( $(nSizer).width() ) );
	}, anHeadSizers );
	 
	// Apply all widths in final pass. Invalidates layout only once because we do not
	// read any DOM properties.
	_fnApplyToChildren( function(nToSize, i) {
		nToSize.style.width = aApplied[i];
	}, anHeadToSize );

	$(anHeadSizers).height(0);
	
	/* Same again with the footer if we have one */
	if ( o.nTFoot !== null )
	{
		_fnApplyToChildren( zeroOut, anFootSizers );
		 
		_fnApplyToChildren( function(nSizer) {
			aAppliedFooter.push( _fnStringToCss( $(nSizer).width() ) );
		}, anFootSizers );
		 
		_fnApplyToChildren( function(nToSize, i) {
			nToSize.style.width = aAppliedFooter[i];
		}, anFootToSize );

		$(anFootSizers).height(0);
	}
	
	/*
	 * 3. Apply the measurements
	 */
	
	/* "Hide" the header and footer that we used for the sizing. We want to also fix their width
	 * to what they currently are
	 */
	_fnApplyToChildren( function(nSizer, i) {
		nSizer.innerHTML = "";
		nSizer.style.width = aApplied[i];
	}, anHeadSizers );
	
	if ( o.nTFoot !== null )
	{
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = "";
			nSizer.style.width = aAppliedFooter[i];
		}, anFootSizers );
	}
	
	/* Sanity check that the table is of a sensible width. If not then we are going to get
	 * misalignment - try to prevent this by not allowing the table to shrink below its min width
	 */
	if ( $(o.nTable).outerWidth() < iSanityWidth )
	{
		/* The min width depends upon if we have a vertical scrollbar visible or not */
		var iCorrection = ((nScrollBody.scrollHeight > nScrollBody.offsetHeight || 
			$(nScrollBody).css('overflow-y') == "scroll")) ?
				iSanityWidth+o.oScroll.iBarWidth : iSanityWidth;
		
		/* IE6/7 are a law unto themselves... */
		if ( ie67 && (nScrollBody.scrollHeight > 
			nScrollBody.offsetHeight || $(nScrollBody).css('overflow-y') == "scroll")  )
		{
			o.nTable.style.width = _fnStringToCss( iCorrection-o.oScroll.iBarWidth );
		}
		
		/* Apply the calculated minimum width to the table wrappers */
		nScrollBody.style.width = _fnStringToCss( iCorrection );
		o.nScrollHead.style.width = _fnStringToCss( iCorrection );
		
		if ( o.nTFoot !== null )
		{
			o.nScrollFoot.style.width = _fnStringToCss( iCorrection );
		}
		
		/* And give the user a warning that we've stopped the table getting too small */
		if ( o.oScroll.sX === "" )
		{
			_fnLog( o, 1, "The table cannot fit into the current element which will cause column"+
				" misalignment. The table has been drawn at its minimum possible width." );
		}
		else if ( o.oScroll.sXInner !== "" )
		{
			_fnLog( o, 1, "The table cannot fit into the current element which will cause column"+
				" misalignment. Increase the sScrollXInner value or remove it to allow automatic"+
				" calculation" );
		}
	}
	else
	{
		nScrollBody.style.width = _fnStringToCss( '100%' );
		o.nScrollHead.style.width = _fnStringToCss( '100%' );
		
		if ( o.nTFoot !== null )
		{
			o.nScrollFoot.style.width = _fnStringToCss( '100%' );
		}
	}
	
	
	/*
	 * 4. Clean up
	 */
	if ( o.oScroll.sY === "" )
	{
		/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
		 * the scrollbar height from the visible display, rather than adding it on. We need to
		 * set the height in order to sort this. Don't want to do it in any other browsers.
		 */
		if ( ie67 )
		{
			nScrollBody.style.height = _fnStringToCss( o.nTable.offsetHeight+o.oScroll.iBarWidth );
		}
	}
	
	if ( o.oScroll.sY !== "" && o.oScroll.bCollapse )
	{
		nScrollBody.style.height = _fnStringToCss( o.oScroll.sY );
		
		var iExtra = (o.oScroll.sX !== "" && o.nTable.offsetWidth > nScrollBody.offsetWidth) ?
		 	o.oScroll.iBarWidth : 0;
		if ( o.nTable.offsetHeight < nScrollBody.offsetHeight )
		{
			nScrollBody.style.height = _fnStringToCss( o.nTable.offsetHeight+iExtra );
		}
	}
	
	/* Finally set the width's of the header and footer tables */
	var iOuterWidth = $(o.nTable).outerWidth();
	nScrollHeadTable.style.width = _fnStringToCss( iOuterWidth );
	nScrollHeadInner.style.width = _fnStringToCss( iOuterWidth );

	// Figure out if there are scrollbar present - if so then we need a the header and footer to
	// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
	var bScrolling = $(o.nTable).height() > nScrollBody.clientHeight || $(nScrollBody).css('overflow-y') == "scroll";
	nScrollHeadInner.style.paddingRight = bScrolling ? o.oScroll.iBarWidth+"px" : "0px";
	
	if ( o.nTFoot !== null )
	{
		nScrollFootTable.style.width = _fnStringToCss( iOuterWidth );
		nScrollFootInner.style.width = _fnStringToCss( iOuterWidth );
		nScrollFootInner.style.paddingRight = bScrolling ? o.oScroll.iBarWidth+"px" : "0px";
	}

	/* Adjust the position of the header in case we loose the y-scrollbar */
	$(nScrollBody).scroll();
	
	/* If sorting or filtering has occurred, jump the scrolling back to the top */
	if ( o.bSorted || o.bFiltered )
	{
		nScrollBody.scrollTop = 0;
	}
}


/**
 * Apply a given function to the display child nodes of an element array (typically
 * TD children of TR rows
 *  @param {function} fn Method to apply to the objects
 *  @param array {nodes} an1 List of elements to look through for display children
 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
 *  @memberof DataTable#oApi
 */
function _fnApplyToChildren( fn, an1, an2 )
{
	var index=0, i=0, iLen=an1.length;
	var nNode1, nNode2;

	while ( i < iLen )
	{
		nNode1 = an1[i].firstChild;
		nNode2 = an2 ? an2[i].firstChild : null;
		while ( nNode1 )
		{
			if ( nNode1.nodeType === 1 )
			{
				if ( an2 )
				{
					fn( nNode1, nNode2, index );
				}
				else
				{
					fn( nNode1, index );
				}
				index++;
			}
			nNode1 = nNode1.nextSibling;
			nNode2 = an2 ? nNode2.nextSibling : null;
		}
		i++;
	}
}

