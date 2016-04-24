/*
	Validator v1.0.5
	(c) 2012 Yair Even Or <http://dropthebit.com>
	
	MIT-style license.
*/

var validator = (function(){
	var message, tests, checkField, validate, mark, unmark, field, minmax, defaults,
		validateWords, lengthRange, lengthLimit, pattern, alertTxt, data,
		email_illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]]/,
		email_filter = /^.+@.+\..{2,3}$/;

	/* general text messages
	*/
	message = {
		invalid			: 'invalid input',
		empty			: 'please put something here',
		min				: 'input is too short',
		max				: 'input is too long',
		number_min		: 'too low',
		number_max		: 'too high',
		url				: 'invalid URL',
		number			: 'not a number',
		email			: 'email address is invalid',
		email_repeat	: 'emails do not match',
		password_repeat	: 'passwords do not match',
		repeat			: 'no match',
		complete		: 'input is not complete',
		select			: 'Please select an option'
	};
	
	// defaults
	defaults = { alerts:true };
	
	/* Tests for each type of field (including Select element)
	*/		
	tests = {
		sameAsPlaceholder : function(a){
			return $.fn.placeholder && a.attr('placeholder') !== undefined && data.val == a.prop('placeholder');
		},
		hasValue : function(a){
			if( !a ){
				alertTxt = message.empty;
				return false;
			}
			return true;
		},
		// 'linked' is a special test case for inputs which their values should be equal to each other (ex. confirm email or retype password)
		linked : function(a,b){
			if( b != a ){
				alertTxt = message[data.type + '_repeat'] || message.no_match;
				return false;
			}
			return true;
		},
		email : function(a){
			if ( !email_filter.test( a ) || a.match( email_illegalChars ) ){
				alertTxt = a ? message.email : message.empty;
				return false;
			}
			return true;
		},
		text : function(a){
			// make sure there are at least X number of words, each at least 2 chars long.
			// for example 'john F kenedy' should be at least 2 words and will pass validation
			if( validateWords ){
				var words = a.split(' ');
				// iterrate on all the words
				var wordsLength = function(len){
					for( var w = words.length; w--; )
						if( words[w].length < len )
							return false;
					return true;
				};
				
				if( words.length < validateWords || !wordsLength(2) ){
					alertTxt = message.complete;
					return false;
				}
				return true;
			}
			if( a.length < lengthRange[0] ){
				alertTxt = message.min;
				return false;
			}
			// check if there is max length & field length is greater than the allowed
			if( lengthRange[1] && a.length > lengthRange[1] ){
				alertTxt = message.max;
				return false;
			}
			// check if the field's value should obey any length limits, and if so, make sure the length of the value is as specified
			if( lengthLimit.length ){
				var obeyLimit = false;
				while( lengthLimit.length ){
					if( lengthLimit.pop() == a.length )
						obeyLimit = true;
				}
				if( !obeyLimit ){
					alertTxt = message.complete;
					return false;
				}
			}
			if( pattern ){
				var regex;
				switch( pattern ){
					case 'alphanumeric' :
						regex = /^[a-z0-9]+$/i;
						break;
					case 'numeric' :
						regex = /^[0-9]+$/i;
						break;
					case 'phone' :
						regex = /^\+?([0-9]|[-|' '])+$/i;
						break;
					default :
						regex = pattern;
				}
				try{
					if( regex && !eval(regex).test(a) )
						return false;
				}
				catch(err){
					console.log(err, field, 'regex is invalid');
					return false;
				}
			}
			return true;
		},
		number : function(a){
			// if not not a number
			if( isNaN(parseFloat(a)) && !isFinite(a) ){
				alertTxt = message.number;
				return false;
			}
			// not enough numbers
			else if( a.length < lengthRange[0] ){
				alertTxt = message.min;
				return false;
			}
			// check if there is max length & field length is greater than the allowed
			else if( lengthRange[1] && a.length > lengthRange[1] ){
				alertTxt = message.max;
				return false;
			}
			else if( minmax[0] && (a|0) < minmax[0] ){
				alertTxt = message.number_min;
				return false;
			}
			else if( minmax[1] && (a|0) > minmax[1] ){
				alertTxt = message.number_max;
				return false;
			}
			return true;
		},
		// Date is validated in European format (day,month,year)
		date : function(a){
			var day, A = a.split(/[-./]/g), i;
			// if there is native HTML5 support:
			if( field[0].valueAsNumber )
				return true;

			for( i = A.length; i--; ){
				if( isNaN(parseFloat(a)) && !isFinite(a) )
					return false;
			}
			try{
				day = new Date(A[2], A[1]-1, A[0]);
				if( day.getMonth()+1 == A[1] && day.getDate() == A[0] ) 
					return day;
				return false;
			}
			catch(er){
				console.log('date test: ', err);
				return false;
			}
		},
		url : function(a){
			// minimalistic URL validation 
			function testUrl(url){
				return /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/.test( url );
			}
			if( !testUrl( a ) ){
				console.log(a);
				alertTxt = a ? message.url : message.empty;
				return false;
			}
			return true;
		},
		hidden : function(a){
			if( a.length < lengthRange[0] ){
				alertTxt = message.min;
				return false;
			}
			if( pattern ){
				var regex;
				if( pattern == 'alphanumeric' ){
					regex = /^[a-z0-9]+$/i;
					if( !regex.test(a) ){
						return false;
					}
				}
			}
			return true;
		},
		select : function(a){
			if( !tests.hasValue(a) ){
				alertTxt = message.select;
				return false;
			}
			return true;
		}
	};
	
	/* marks invalid fields
	*/  
    mark = function(field, text){
		if( !text || !field || !field.length )
			return false;
		
		// check if not already marked as a 'bad' record and add the 'alert' object.
		// if already is marked as 'bad', then make sure the text is set again because i might change depending on validation
		var item = field.parents('.item'), warning;
        
        item.find('.alert').remove();
        
        if( defaults.alerts ){
            warning = $('<div>').addClass('alert').text( text );
            item.append( warning );
        }
        
        item.removeClass('bad');
        setTimeout(function(){
            item.addClass('bad');
        }, 0);
	};
	/* un-marks invalid fields
	*/
	unmark = function(field){
		if( !field || !field.length ){
			console.warn('no "field" argument, null or DOM object not found')
			return false;
		}
		field.parents('.item')
            .removeClass('bad')
            .find('.alert').animate({ marginLeft:32, opacity:0 }, 200, function(){
                $(this).remove();
            });
	};
	
	/* Checks a single form field by it's type and specific (custom) attributes
	*/
	function checkField(){
		field = $(this);
		// skip testing fields whom their type is not HIDDEN but they are HIDDEN via CSS.
		if( field[0].type !='hidden' && field.is(':hidden') )
			return true;

		field.data( 'valid',true );										// every field starts as 'valid=true' until proven otherwise
		field.data( 'type', field.attr('type') );						// every field starts as 'valid=true' until proven otherwise
		field.data( 'val', field[0].value.replace(/^\s+|\s+$/g, "") );	// cache the value of the field and trim it
		data = field.data();  											// cache the custom data attributes. first removes the DATA because jQuery has an 
		var v = data.val;
		
		// Check if there is a specific error message for that field, if not, use the default 'invalid' message
		alertTxt = message[field.prop('name')] || message.invalid;
		
		// SELECT / TEXTAREA nodes needs special treatment
		if( field[0].nodeName.toLowerCase() === "select" ){
			data.type = 'select';
		}
		if( field[0].nodeName.toLowerCase() === "textarea" ){
			data.type = 'text';
		}
		/* Gather Custom data attributes for specific validation:
		*/
		validateWords	= data['validateWords'] || 0;
		lengthRange 	= data['validateLengthRange'] ? (data['validateLengthRange']+'').split(',') : [1];
		lengthLimit		= data['validateLength'] ? (data['validateLength']+'').split(',') : false;
		minmax			= data['validateMinmax'] ? (data['validateMinmax']+'').split(',') : ''; // for type 'number', defines the mininum and/or maximum for the value as a number.
		pattern			= data['validatePattern'];

		/* Validate the field's value is different than the placeholder attribute (and attribute exists)
		* this is needed when fixing the placeholders for older browsers which does not support them.
		* in this case, make sure the "placeholder" jQuery plugin was even used before procceding
		*/
		if( tests.sameAsPlaceholder(field) ){
			alertTxt = msg.form.empty;
			data.valid = false;
		}

		// if this field is linked to another field (their values should be the same)
		if( data.validateLinked ){
			var linkedTo = data['validateLinked'].indexOf('#') == 0 ? $(data['validateLinked']) : $(':input[name=' + data['validateLinked'] + ']');
			data.valid = tests.linked( v, linkedTo.val() );
		}
		/* validate by type of field. use 'attr()' is preffered to get the actual value and not what the browsers sees for unsupported types.
		*/
		if( data.valid && (data.valid = tests.hasValue(v)) || data.type == 'select' )
			switch( data.type ){
				case 'email' :
					data.valid = tests.email(v);
					break;
				case 'text' :
					data.valid = tests.text(v);
					break;
				case 'tel' :
					pattern = pattern || 'phone';
					data.valid = tests.text(v);
					break;
				case 'password' :
					data.valid = tests.text(v);
					break;
				case 'number' :
					data.valid = tests.number(v);
					break;
				case 'date' :
					data.valid = tests.date(v);
					break;
				case 'url' :
					data.valid = tests.url(v);
					break;
				case 'select' :
					data.valid = tests.select(v);
					break;
				case 'hidden' :
					data.valid = tests.hidden(v);
					break;
			}

		if( field.hasClass('optional') && !data.val )
			data.valid = true;
		
		// mark / unmark the field, and set the general 'submit' flag accordingly
		if( data.valid )
			unmark( field );
		else{
			mark( field, alertTxt );
			submit = false;
		}
		
		return data.valid;
	}
	
	/* vaildates all the REQUIRED fields prior to submiting the form
	*/
	function checkAll( $form ){
		if( $form.length == 0 ){
			console.warn('element not found');
			return false;
		}

		var that = this,
			submit = true, // save the scope
			fieldsToCheck = $form.find(':input').filter('[required=required], .required, .optional').not('[disabled=disabled]');

		fieldsToCheck.each(function(){
			// use an AND operation, so if any of the fields returns 'false' then the submitted result will be also FALSE
			submit = submit * checkField.apply(this);
		});
		
		return !!submit;  // casting the variable to make sure it's a boolean
	}
	
	return {
		defaults 	: defaults,
		checkField 	: checkField,
		checkAll 	: checkAll,
		mark 		: mark,
		unmark		: unmark,
		message		: message,
		tests 		: tests
	}
})();