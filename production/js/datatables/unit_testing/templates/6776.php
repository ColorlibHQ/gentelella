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
    <div id="demo">
      <h1>Live example</h1>
      <table>
        <thead/>
        <tbody>
          <tr>
            <td>
            <div>
              <table cellpadding="0" cellspacing="0" border="0" class="display" id="example">
                <thead>
                  <tr>
                    <th>Rendering engine</th>
                    <th width="25%">Browser</th>
                    <th>Platform(s)</th>
                    <th>Engine version</th>
                    <th>CSS grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                  <tr class="odd gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td class="center"> 4</td>
                    <td class="center">X</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </body>
</html>