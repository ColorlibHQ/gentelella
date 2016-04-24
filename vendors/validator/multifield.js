var multifeild = {
	keypress : function(e){	
		var nextPrevField;
		// Ignore: [tab, left & right arrows]		
		if( /9|37|39/.test(e.keyCode) )			
			return;		
		// if hit Backspace key when the field it empty, go back one field		
		if( e.keyCode == 8 && !this.value )			
			nextPrevField = $(this).prev();
		// automatically move to the next field once user has filled the current one completely		
		else if( this.value.length == this.maxLength && e.keyCode != 8 )			
			nextPrevField = $(this).next();
		
		// set the caret at the END of the inupt element at hand
		if( nextPrevField )
			setCaret( nextPrevField[0], 100);
		
		function setCaret(input, pos){
			if (input.setSelectionRange) {
				input.focus();
				input.setSelectionRange(pos, pos);
			} else if (input.createTextRange) {
				var range = input.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		}
	},
	// After each 'change' event of any of the fields, combine all the values to the hidden input.	
	combine : function(e){		
		var hidden =  $(this).siblings('input[type=hidden]').val('');		
		$(this).siblings('input[type="text"]').andSelf().each( function(){			
			hidden[0].value += this.value;		
		});	
	}
};

$('div.multi').on({'keyup':multifeild.keypress, 'change':multifeild.combine}, 'input');
