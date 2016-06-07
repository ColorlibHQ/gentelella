// multifield - connects several input fields to each-other
// By Yair Even Or / 2011 / dropthebit.com
;(function(){
	var fixedEvent = 0;
	
	function funnel(e){
		fixedEvent++;
		var that = this;
		setTimeout(function(){
			keypress.call(that, e);
			fixedEvent = 0;
		},0);
	}
	
	function keypress(e){
		var nextPrevField,
			sel = [this.selectionStart, this.selectionEnd];

		if( !e.charCode && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 8 )			
			return;	

		// if hit Backspace key when caret was at the beginning, or if the 'left' arrow key was pressed and the caret was at the start -> go back to previous field	
		if( (e.keyCode == 8 && sel[1] == 0) || (e.keyCode == 37 && sel[1] == 0) )			
			setCaret( $(this).prev(':text')[0], 100);
		
		// if the 'right' arrow key was pressed and caret was at the end -> advance to the next field
		else if( e.keyCode == 39 && sel[1] == this.value.length )	
			setCaret( $(this).next(':text')[0], 0);
		
		// automatically move to the next field once user has filled the current one completely		
		else if( e.charCode && sel[1] == sel[0] && sel[0] == this.maxLength )
			setCaret( $(this).next(':text')[0], 100);

		function setCaret(input, pos){
			if( !input ) return;
			if (input.setSelectionRange){
				input.focus();
				input.setSelectionRange(pos, pos);
			}
			else if( input.createTextRange ){
				var range = input.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		}
		
		combine.apply(this);
	};
	// After each 'change' event of any of the fields, combine all the values to the hidden input.	
	function combine(){
		var hidden =  $(this).siblings('input[type=hidden]').val('')[0];		
		$(this.parentNode).find(':text').each( function(){			
			hidden.value += this.value;
		});
	}

	$('div.multi').on({'keydown.multifeild':funnel, 'keypress.multifeild':funnel, 'change.multifeild':combine}, 'input');
})();