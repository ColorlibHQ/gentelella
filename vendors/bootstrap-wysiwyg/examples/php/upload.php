<?php

	header ( 'Content-type: text/plain');
	echo "
		Now see here, you will see the output of the param most 
		interesting to PHP. \$_POST.
		
		Note, that if you cleanHtml(true) it will send multiple 
		input's (postedimage/[x]), which you can then use to
		decode and store.
		
		Otherwise, it will send it all in the single form field.
		
		print_r(\$_POST);
	";	
	print_r($_POST);