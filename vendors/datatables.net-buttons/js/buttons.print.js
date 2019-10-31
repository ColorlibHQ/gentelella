/*!
 * Print button for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
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

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
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


var _link = document.createElement( 'a' );

/**
 * Convert a `link` tag's URL from a relative to an absolute address so it will
 * work correctly in the popup window which has no base URL.
 *
 * @param  {node}     el Element to convert
 */
var _relToAbs = function( el ) {
	var url;
	var clone = $(el).clone()[0];
	var linkHost;

	if ( clone.nodeName.toLowerCase() === 'link' ) {
		_link.href = clone.href;
		linkHost = _link.host;

		// IE doesn't have a trailing slash on the host
		// Chrome has it on the pathname
		if ( linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
			linkHost += '/';
		}

		clone.href = _link.protocol+"//"+linkHost+_link.pathname+_link.search;
	}

	return clone.outerHTML;
};


DataTable.ext.buttons.print = {
	className: 'buttons-print',

	text: function ( dt ) {
		return dt.i18n( 'buttons.print', 'Print' );
	},

	action: function ( e, dt, button, config ) {
		var data = dt.buttons.exportData( config.exportOptions );
		var addRow = function ( d, tag ) {
			var str = '<tr>';

			for ( var i=0, ien=d.length ; i<ien ; i++ ) {
				str += '<'+tag+'>'+d[i]+'</'+tag+'>';
			}

			return str + '</tr>';
		};

		// Construct a table for printing
		var html = '<table class="'+dt.table().node().className+'">';

		if ( config.header ) {
			html += '<thead>'+ addRow( data.header, 'th' ) +'</thead>';
		}

		html += '<tbody>';
		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			html += addRow( data.body[i], 'td' );
		}
		html += '</tbody>';

		if ( config.footer && data.footer ) {
			html += '<tfoot>'+ addRow( data.footer, 'th' ) +'</tfoot>';
		}

		// Open a new window for the printable table
		var win = window.open( '', '' );
		var title = config.title;

		if ( typeof title === 'function' ) {
			title = title();
		}

		if ( title.indexOf( '*' ) !== -1 ) {
			title= title.replace( '*', $('title').text() );
		}

		win.document.close();

		// Inject the title and also a copy of the style and link tags from this
		// document so the table can retain its base styling. Note that we have
		// to use string manipulation as IE won't allow elements to be created
		// in the host document and then appended to the new window.
		var head = '<title>'+title+'</title>';
		$('style, link').each( function () {
			head += _relToAbs( this );
		} );

		try {
			win.document.head.innerHTML = head; // Work around for Edge
		}
		catch (e) {
			$(win.document.head).html( head ); // Old IE
		}

		// Inject the table and other surrounding information
		win.document.body.innerHTML =
			'<h1>'+title+'</h1>'+
			'<div>'+
				(typeof config.message === 'function' ?
					config.message( dt, button, config ) :
					config.message
				)+
			'</div>'+
			html;

		if ( config.customize ) {
			config.customize( win );
		}

		setTimeout( function () {
			if ( config.autoPrint ) {
				win.print(); // blocking - so close will not
				win.close(); // execute until this is done
			}
		}, 250 );
	},

	title: '*',

	message: '',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};


return DataTable.Buttons;
}));
