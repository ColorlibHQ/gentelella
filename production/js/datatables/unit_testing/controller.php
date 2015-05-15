<?php
	header( 'Expires: Sat, 26 Jul 1997 05:00:00 GMT' ); 
	header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' ); 
	header( 'Cache-Control: no-store, no-cache, must-revalidate' ); 
	header( 'Cache-Control: post-check=0, pre-check=0', false ); 
	header( 'Pragma: no-cache' ); 
?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
	"http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8">
		<title>DataTables unit test controller</title>
		
		<style type="text/css" media="screen">
			#controller {
				font: 12px/1.45em "Lucida Grande", Verdana, Arial, Helvetica, sans-serif;
				margin: 0;
				padding: 0 0 0 0.5em;
				color: #333;
				background-color: #fff;
			}
			
			#test_info {
				position: absolute;
				top: 0;
				right: 0;
				width: 50%;
				height: 100%;
				font-size: 11px;
				overflow: auto;
			}
			
			.error {
				color: red;
			}
			
			#controller h1 {
				color: #4E6CA3;
				font-size: 18px;
			}
		</style>
		
		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" charset="utf-8">
			var gaoTest = [
			<?php
				function fnReadDir( &$aReturn, $path )
				{
					$rDir = opendir( $path );
        	while ( ($file = readdir($rDir)) !== false )
					{
						if ( $file == "." || $file == ".." || $file == ".DS_Store" )
						{
							continue;
						}
						else if ( is_dir( $path.'/'.$file ) )
						{
							fnReadDir( $aReturn, $path.'/'.$file );
						}
						else
						{
							array_push( $aReturn, $path.'/'.$file );
						}
					}
					closedir($rDir);
				}
				
				/* Get the tests dynamically from the 'tests' directory, and their templates */
				$aFiles = array();
				fnReadDir( $aFiles, "tests" );
				
				for ( $i=0 ; $i<count($aFiles) ; $i++ )
				{
					$sTemplate;
					$fp = fopen( $aFiles[$i], "r" );
					fscanf( $fp, "// DATA_TEMPLATE: %s", $sTemplate );
					fclose( $fp );
					
					$aPath = explode('/', $aFiles[$i]);
					
					echo '{ '.
						'"sTemplate": "'.$sTemplate.'", '.
						'"sTest": "'.$aFiles[$i].'", '.
						'"sGroup": "'.$aPath[1].'"},'."\n";
				}
				
			?>
			null ];
			gaoTest.pop(); /* No interest in the null */
		</script>
		<script type="text/javascript" src="controller.js"></script>
	</head>
	<body id="controller">
		<h1>DataTables unit testing</h1>
		<div id="test_running">Running test: <span id="test_number"></span></div>
		<div id="test_info">
			<b>Test information:</b><br>
		</div>
	</body>
</html>