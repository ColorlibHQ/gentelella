<?php
	header( 'Expires: Sat, 26 Jul 1997 05:00:00 GMT' ); 
	header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' ); 
	header( 'Cache-Control: no-store, no-cache, must-revalidate' ); 
	header( 'Cache-Control: post-check=0, pre-check=0', false ); 
	header( 'Pragma: no-cache' ); 
?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="shortcut icon" type="image/ico" href="http://www.sprymedia.co.uk/media/images/favicon.ico" />
		
		<title>DataTables unit testing</title>
		<style type="text/css" title="currentStyle">
			@import "../../css/demo_page.css";
			@import "../../css/demo_table.css";
		</style>
		<script type="text/javascript" src="../../js/jquery.js"></script>
		<script type="text/javascript" src="../../js/jquery.dataTables.js"></script>
		<script type="text/javascript" src="../unit_test.js"></script>
		<?php
			$aScripts = explode( ":", $_GET['scripts'] );
			for ( $i=0 ; $i<count($aScripts) ; $i++ )
			{
				echo '<script type="text/javascript" src="../'.$aScripts[$i].'?rand='.rand().'"></script>'."\n";
			}
		?>
	</head>
	<body id="dt_example">
		<div id="container">
			<div class="full_width big">
				<i>DataTables</i> table with HTML elements template
			</div>
			
			<h1>Live example</h1>
			<div id="demo">
<table cellpadding="0" cellspacing="0" border="0" class="display" id="example">
	<thead>
		<tr>
			<th>Reflection</th>
			<th>Link</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td><a href="http://www.sprymedia.co.uk/article/DataTables">DataTables</a></td>
		</tr>
		<tr>
			<td>2</td>
			<td><a href="http://www.sprymedia.co.uk/article/Integrity">A link to Integrity</a></td>
		</tr>
		<tr>
			<td>3</td>
			<td><a href="http://www.sprymedia.co.uk/article/Integrity">Integrity</a></td>
		</tr>
		<tr>
			<td>4</td>
			<td>EIntegrity</td>
		</tr>
</table>
			</div>
			<div class="spacer"></div>
		</div>
	</body>
</html>