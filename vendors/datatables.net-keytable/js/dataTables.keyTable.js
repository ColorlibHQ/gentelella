/*! KeyTable 2.1.2
 * ©2009-2016 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     KeyTable
 * @description Spreadsheet like keyboard navigation for DataTables
 * @version     2.1.2
 * @file        dataTables.keyTable.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2009-2016 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


var KeyTable = function ( dt, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw 'KeyTable requires DataTables 1.10.8 or newer';
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.keyTable,
		KeyTable.defaults,
		opts
	);

	// Internal settings
	this.s = {
		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		enable: true,

		/** @type {bool} Flag for if a draw is triggered by focus */
		focusDraw: false
	};

	// DOM items
	this.dom = {

	};

	// Check if row reorder has already been initialised on this table
	var settings = this.s.dt.settings()[0];
	var exisiting = settings.keytable;
	if ( exisiting ) {
		return exisiting;
	}

	settings.keytable = this;
	this._constructor();
};


$.extend( KeyTable.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * API methods for DataTables API interface
	 */
	
	/**
	 * Blur the table's cell focus
	 */
	blur: function ()
	{
		this._blur();
	},

	/**
	 * Enable cell focus for the table
	 *
	 * @param  {string} state Can be `true`, `false` or `-string navigation-only`
	 */
	enable: function ( state )
	{
		this.s.enable = state;
	},

	/**
	 * Focus on a cell
	 * @param  {integer} row    Row index
	 * @param  {integer} column Column index
	 */
	focus: function ( row, column )
	{
		this._focus( this.s.dt.cell( row, column ) );
	},

	/**
	 * Is the cell focused
	 * @param  {object} cell Cell index to check
	 * @returns {boolean} true if focused, false otherwise
	 */
	focused: function ( cell )
	{
		var lastFocus = this.s.lastFocus;

		if ( ! lastFocus ) {
			return false;
		}

		var lastIdx = this.s.lastFocus.index();
		return cell.row === lastIdx.row && cell.column === lastIdx.column;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the KeyTable instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		this._tabInput();

		var that = this;
		var dt = this.s.dt;
		var table = $( dt.table().node() );

		// Need to be able to calculate the cell positions relative to the table
		if ( table.css('position') === 'static' ) {
			table.css( 'position', 'relative' );
		}

		// Click to focus
		$( dt.table().body() ).on( 'click.keyTable', 'th, td', function () {
			if ( that.s.enable === false ) {
				return;
			}

			var cell = dt.cell( this );

			if ( ! cell.any() ) {
				return;
			}

			that._focus( cell, null, false );
		} );

		// Key events
		$( document ).on( 'keydown.keyTable', function (e) {
			that._key( e );
		} );

		// Click blur
		if ( this.c.blurable ) {
			$( document ).on( 'click.keyTable', function ( e ) {
				// Click on the search input will blur focus
				if ( $(e.target).parents( '.dataTables_filter' ).length ) {
					that._blur();
				}

				// If the click was inside the DataTables container, don't blur
				if ( $(e.target).parents().filter( dt.table().container() ).length ) {
					return;
				}

				// Don't blur in Editor form
				if ( $(e.target).parents('div.DTE').length ) {
					return;
				}

				that._blur();
			} );
		}

		if ( this.c.editor ) {
			dt.on( 'key.keyTable', function ( e, dt, key, cell, orig ) {
				that._editor( key, orig );
			} );
		}

		// Stave saving
		if ( dt.settings()[0].oFeatures.bStateSave ) {
			dt.on( 'stateSaveParams.keyTable', function (e, s, d) {
				d.keyTable = that.s.lastFocus ?
					that.s.lastFocus.index() :
					null;
			} );
		}

		// Reload - re-focus on the currently selected item. In SSP mode this
		// has the effect of keeping the focus in position when changing page as
		// well (which is different from how client-side processing works).
		dt.on( 'xhr.keyTable', function ( e ) {
			if ( that.s.focusDraw ) {
				// Triggered by server-side processing, and thus `_focus` will
				// do the refocus on the next draw event
				return;
			}

			var lastFocus = that.s.lastFocus;

			if ( lastFocus ) {
				that.s.lastFocus = null;

				dt.one( 'draw', function () {
					that._focus( lastFocus );
				} );
			}
		} );

		dt.on( 'destroy.keyTable', function () {
			dt.off( '.keyTable' );
			$( dt.table().body() ).off( 'click.keyTable', 'th, td' );
			$( document.body )
				.off( 'keydown.keyTable' )
				.off( 'click.keyTable' );
		} );

		// Initial focus comes from state or options
		var state = dt.state.loaded();

		if ( state && state.keyTable ) {
			// Wait until init is done
			dt.one( 'init', function () {
				var cell = dt.cell( state.keyTable );

				// Ensure that the saved cell still exists
				if ( cell.any() ) {
					cell.focus();
				}
			} );
		}
		else if ( this.c.focus ) {
			dt.cell( this.c.focus ).focus();
		}
	},




	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Blur the control
	 *
	 * @private
	 */
	_blur: function ()
	{
		if ( ! this.s.enable || ! this.s.lastFocus ) {
			return;
		}

		var cell = this.s.lastFocus;

		$( cell.node() ).removeClass( this.c.className );
		this.s.lastFocus = null;

		this._emitEvent( 'key-blur', [ this.s.dt, cell ] );
	},


	/**
	 * Get an array of the column indexes that KeyTable can operate on. This
	 * is a merge of the user supplied columns and the visible columns.
	 *
	 * @private
	 */
	_columns: function ()
	{
		var dt = this.s.dt;
		var user = dt.columns( this.c.columns ).indexes();
		var out = [];

		dt.columns( ':visible' ).every( function (i) {
			if ( user.indexOf( i ) !== -1 ) {
				out.push( i );
			}
		} );

		return out;
	},


	/**
	 * Perform excel like navigation for Editor by triggering an edit on key
	 * press
	 *
	 * @param  {integer} key Key code for the pressed key
	 * @param  {object} orig Original event
	 * @private
	 */
	_editor: function ( key, orig )
	{
		var dt = this.s.dt;
		var editor = this.c.editor;

		orig.stopPropagation();

		// Return key should do nothing - for textareas's it would empty the
		// contents
		if ( key === 13 ) {
			orig.preventDefault();
		}

		editor.inline( this.s.lastFocus.index() );

		// Excel style - select all text
		var input = $('div.DTE input, div.DTE textarea');
		if ( input.length ) {
			input[0].select();
		}

		// Reduce the keys the Keys listens for
		dt.keys.enable( 'navigation-only' );

		// On blur of the navigation submit
		dt.one( 'key-blur.editor', function () {
			if ( editor.displayed() ) {
				editor.submit();
			}
		} );

		// Restore full key navigation on close
		editor.one( 'close', function () {
			dt.keys.enable( true );
			dt.off( 'key-blur.editor' );
		} );
	},


	/**
	 * Emit an event on the DataTable for listeners
	 *
	 * @param  {string} name Event name
	 * @param  {array} args Event arguments
	 * @private
	 */
	_emitEvent: function ( name, args )
	{
		this.s.dt.iterator( 'table', function ( ctx, i ) {
			$(ctx.nTable).triggerHandler( name, args );
		} );
	},


	/**
	 * Focus on a particular cell, shifting the table's paging if required
	 *
	 * @param  {DataTables.Api|integer} row Can be given as an API instance that
	 *   contains the cell to focus or as an integer. As the latter it is the
	 *   visible row index - NOT the data index
	 * @param  {integer} [column] Not required if a cell is given as the first
	 *   parameter. Otherwise this is the column data index for the cell to
	 *   focus on
	 * @param {boolean} [shift=true] Should the viewport be moved to show cell
	 * @private
	 */
	_focus: function ( row, column, shift )
	{
		var that = this;
		var dt = this.s.dt;
		var pageInfo = dt.page.info();
		var lastFocus = this.s.lastFocus;

		if ( ! this.s.enable ) {
			return;
		}

		if ( typeof row !== 'number' ) {
			// Convert the cell to a row and column
			var index = row.index();
			column = index.column;
			row = dt
				.rows( { filter: 'applied', order: 'applied' } )
				.indexes()
				.indexOf( index.row );

			// For server-side processing normalise the row by adding the start
			// point, since `rows().indexes()` includes only rows that are
			// available at the client-side
			if ( pageInfo.serverSide ) {
				row += pageInfo.start;
			}
		}

		// Is the row on the current page? If not, we need to redraw to show the
		// page
		if ( pageInfo.length !== -1 && (row < pageInfo.start || row >= pageInfo.start+pageInfo.length) ) {
			this.s.focusDraw = true;

			dt
				.one( 'draw', function () {
					that.s.focusDraw = false;
					that._focus( row, column );
				} )
				.page( Math.floor( row / pageInfo.length ) )
				.draw( false );

			return;
		}

		// In the available columns?
		if ( $.inArray( column, this._columns() ) === -1 ) {
			return;
		}

		// De-normalise the server-side processing row, so we select the row
		// in its displayed position
		if ( pageInfo.serverSide ) {
			row -= pageInfo.start;
		}

		var cell = dt.cell( ':eq('+row+')', column, {search: 'applied'} );

		if ( lastFocus ) {
			// Don't trigger a refocus on the same cell
			if ( lastFocus.node() === cell.node() ) {
				return;
			}

			// Otherwise blur the old focus
			this._blur();
		}

		var node = $( cell.node() );
		node.addClass( this.c.className );

		// Shift viewpoint and page to make cell visible
		if ( shift === undefined || shift === true ) {
			this._scroll( $(window), $(document.body), node, 'offset' );

			var bodyParent = dt.table().body().parentNode;
			if ( bodyParent !== dt.table().header().parentNode ) {
				var parent = $(bodyParent.parentNode);

				this._scroll( parent, parent, node, 'position' );
			}
		}

		// Event and finish
		this.s.lastFocus = cell;

		this._emitEvent( 'key-focus', [ this.s.dt, cell ] );
		dt.state.save();
	},


	/**
	 * Handle key press
	 *
	 * @param  {object} e Event
	 * @private
	 */
	_key: function ( e )
	{
		if ( ! this.s.enable ) {
			return;
		}

		if ( e.keyCode === 0 || e.ctrlKey || e.metaKey || e.altKey ) {
			return;
		}

		// If not focused, then there is no key action to take
		var cell = this.s.lastFocus;
		if ( ! cell ) {
			return;
		}

		var that = this;
		var dt = this.s.dt;

		// If we are not listening for this key, do nothing
		if ( this.c.keys && $.inArray( e.keyCode, this.c.keys ) === -1 ) {
			return;
		}

		switch( e.keyCode ) {
			case 9: // tab
				this._shift( e, e.shiftKey ? 'left' : 'right', true );
				break;

			case 27: // esc
				if ( this.s.blurable && this.s.enable === true ) {
					this._blur();
				}
				break;

			case 33: // page up (previous page)
			case 34: // page down (next page)
				e.preventDefault();
				var index = dt.cells( {page: 'current'} ).nodes().indexOf( cell.node() );

				dt
					.one( 'draw', function () {
						var nodes = dt.cells( {page: 'current'} ).nodes();

						that._focus( dt.cell( index < nodes.length ?
							nodes[ index ] :
							nodes[ nodes.length-1 ]
						) );
					} )
					.page( e.keyCode === 33 ? 'previous' : 'next' )
					.draw( false );
				break;

			case 35: // end (end of current page)
			case 36: // home (start of current page)
				e.preventDefault();
				var indexes = dt.cells( {page: 'current'} ).indexes();

				this._focus( dt.cell(
					indexes[ e.keyCode === 35 ? indexes.length-1 : 0 ]
				) );
				break;

			case 37: // left arrow
				this._shift( e, 'left' );
				break;

			case 38: // up arrow
				this._shift( e, 'up' );
				break;

			case 39: // right arrow
				this._shift( e, 'right' );
				break;

			case 40: // down arrow
				this._shift( e, 'down' );
				break;

			default:
				// Everything else - pass through only when fully enabled
				if ( this.s.enable === true ) {
					this._emitEvent( 'key', [ dt, e.keyCode, this.s.lastFocus, e ] );
				}
				break;
		}
	},


	/**
	 * Scroll a container to make a cell visible in it. This can be used for
	 * both DataTables scrolling and native window scrolling.
	 *
	 * @param  {jQuery} container Scrolling container
	 * @param  {jQuery} scroller  Item being scrolled
	 * @param  {jQuery} cell      Cell in the scroller
	 * @param  {string} posOff    `position` or `offset` - which to use for the
	 *   calculation. `offset` for the document, otherwise `position`
	 * @private
	 */
	_scroll: function ( container, scroller, cell, posOff )
	{
		var offset = cell[posOff]();
		var height = cell.outerHeight();
		var width = cell.outerWidth();

		var scrollTop = scroller.scrollTop();
		var scrollLeft = scroller.scrollLeft();
		var containerHeight = container.height();
		var containerWidth = container.width();

		// Top correction
		if ( offset.top < scrollTop ) {
			scroller.scrollTop( offset.top );
		}

		// Left correction
		if ( offset.left < scrollLeft ) {
			scroller.scrollLeft( offset.left );
		}

		// Bottom correction
		if ( offset.top + height > scrollTop + containerHeight && height < containerHeight ) {
			scroller.scrollTop( offset.top + height - containerHeight );
		}

		// Right correction
		if ( offset.left + width > scrollLeft + containerWidth && width < containerWidth ) {
			scroller.scrollLeft( offset.left + width - containerWidth );
		}
	},


	/**
	 * Calculate a single offset movement in the table - up, down, left and
	 * right and then perform the focus if possible
	 *
	 * @param  {object}  e           Event object
	 * @param  {string}  direction   Movement direction
	 * @param  {boolean} keyBlurable `true` if the key press can result in the
	 *   table being blurred. This is so arrow keys won't blur the table, but
	 *   tab will.
	 * @private
	 */
	_shift: function ( e, direction, keyBlurable )
	{
		var that         = this;
		var dt           = this.s.dt;
		var pageInfo     = dt.page.info();
		var rows         = pageInfo.recordsDisplay;
		var currentCell  = this.s.lastFocus;
		var columns      = this._columns();

		if ( ! currentCell ) {
			return;
		}

		var currRow = dt
			.rows( { filter: 'applied', order: 'applied' } )
			.indexes()
			.indexOf( currentCell.index().row );

		// When server-side processing, `rows().indexes()` only gives the rows
		// that are available at the client-side, so we need to normalise the
		// row's current position by the display start point
		if ( pageInfo.serverSide ) {
			currRow += pageInfo.start;
		}

		var currCol = dt
			.columns( columns )
			.indexes()
			.indexOf( currentCell.index().column );

		var
			row = currRow,
			column = columns[ currCol ]; // row is the display, column is an index

		if ( direction === 'right' ) {
			if ( currCol >= columns.length - 1 ) {
				row++;
				column = columns[0];
			}
			else {
				column = columns[ currCol+1 ];
			}
		}
		else if ( direction === 'left' ) {
			if ( currCol === 0 ) {
				row--;
				column = columns[ columns.length - 1 ];
			}
			else {
				column = columns[ currCol-1 ];
			}
		}
		else if ( direction === 'up' ) {
			row--;
		}
		else if ( direction === 'down' ) {
			row++;
		}

		if ( row >= 0 && row < rows && $.inArray( column, columns ) !== -1
		) {
			e.preventDefault();

			this._focus( row, column );
		}
		else if ( ! keyBlurable || ! this.c.blurable ) {
			// No new focus, but if the table isn't blurable, then don't loose
			// focus
			e.preventDefault();
		}
		else {
			this._blur();
		}
	},


	/**
	 * Create a hidden input element that can receive focus on behalf of the
	 * table
	 *
	 * @private
	 */
	_tabInput: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var tabIndex = this.c.tabIndex !== null ?
			this.c.tabIndex :
			dt.settings()[0].iTabIndex;

		if ( tabIndex == -1 ) {
			return;
		}

		var div = $('<div><input type="text" tabindex="'+tabIndex+'"/></div>')
			.css( {
				position: 'absolute',
				height: 1,
				width: 0,
				overflow: 'hidden'
			} )
			.insertBefore( dt.table().node() );

		div.children().on( 'focus', function () {
			that._focus( dt.cell(':eq(0)', '0:visible', {page: 'current'}) );
		} );
	}
} );


/**
 * KeyTable default settings for initialisation
 *
 * @namespace
 * @name KeyTable.defaults
 * @static
 */
KeyTable.defaults = {
	/**
	 * Can focus be removed from the table
	 * @type {Boolean}
	 */
	blurable: true,

	/**
	 * Class to give to the focused cell
	 * @type {String}
	 */
	className: 'focus',

	/**
	 * Columns that can be focused. This is automatically merged with the
	 * visible columns as only visible columns can gain focus.
	 * @type {String}
	 */
	columns: '', // all

	/**
	 * Editor instance to automatically perform Excel like navigation
	 * @type {Editor}
	 */
	editor: null,

	/**
	 * Select a cell to automatically select on start up. `null` for no
	 * automatic selection
	 * @type {cell-selector}
	 */
	focus: null,

	/**
	 * Array of keys to listen for
	 * @type {null|array}
	 */
	keys: null,

	/**
	 * Tab index for where the table should sit in the document's tab flow
	 * @type {integer|null}
	 */
	tabIndex: null
};



KeyTable.version = "2.1.2";


$.fn.dataTable.KeyTable = KeyTable;
$.fn.DataTable.KeyTable = KeyTable;


DataTable.Api.register( 'cell.blur()', function () {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.keytable ) {
			ctx.keytable.blur();
		}
	} );
} );

DataTable.Api.register( 'cell().focus()', function () {
	return this.iterator( 'cell', function (ctx, row, column) {
		if ( ctx.keytable ) {
			ctx.keytable.focus( row, column );
		}
	} );
} );

DataTable.Api.register( 'keys.disable()', function () {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.keytable ) {
			ctx.keytable.enable( false );
		}
	} );
} );

DataTable.Api.register( 'keys.enable()', function ( opts ) {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.keytable ) {
			ctx.keytable.enable( opts === undefined ? true : opts );
		}
	} );
} );

// Cell selector
DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var focused = opts.focused;
	var kt = settings.keytable;
	var out = [];

	if ( ! kt || focused === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		if ( (focused === true &&  kt.focused( cells[i] ) ) ||
			 (focused === false && ! kt.focused( cells[i] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtk', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.keys;
	var defaults = DataTable.defaults.keys;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new KeyTable( settings, opts  );
		}
	}
} );


return KeyTable;
}));
