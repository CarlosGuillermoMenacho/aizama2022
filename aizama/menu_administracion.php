<?php
session_start();
require"session_verify.php";
if ($_SESSION['app_user_nivel']=='portero'){
        require 'header_por.php';
    }else{
        if($_SESSION['app_user_id']==16){
            require 'header_dir.php';
        }else{
            require 'header_adm.php';
        }
        
    }

$_SESSION['app_bimestre'] = 0;

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=gb18030">

<title>Menu Docentes</title>
<link href="css/style3.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/app_menuadministracion.js"></script>
<script type="text/javascript" src="js/jquery.jPrintArea.js"></script>
<script>
</script></head>

<body>
<div id="app_container">
<div id="wLogin">
<form action="grabar_tabla.php" method="post" enctype="application/x-www-form-urlencoded" name="fGrabar" target="wPDFframe" id="fGrabar">
    
</form>
</div>
</div>
<div id="wPDF"></div>
</body>
</html>
<?php 
require 'footer.php';
?>
