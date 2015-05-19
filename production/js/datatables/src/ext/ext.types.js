

// Built in type detection. See model.ext.aTypes for information about
// what is required from this methods.
$.extend( DataTable.ext.aTypes, [
	// Numeric data type
	function ( data )
	{
		return data==='' || data==='-' || (!isNaN( parseFloat(data) ) && isFinite( data )) ?
			'numeric' : null;
	},
	
	// Dates (only those recognised by the browser's Date.parse)
	function ( data )
	{
		var parsed = Date.parse(data);
		return (parsed !== null && !isNaN(parsed)) || (typeof data==='string' && data.length===0) ?
			'date' : null;
	},
	
	// HTML
	function ( data )
	{
		return typeof data === 'string' && data.indexOf('<') != -1 && data.indexOf('>') != -1 ?
			'html' : null;
	}
] );

