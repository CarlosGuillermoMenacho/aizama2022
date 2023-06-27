<?php
session_start();
require 'includes/config.php';
require 'includes/functions.php';
if(isset($_POST['vf_usuario'])&&!empty($_POST['vf_usuario']) && isset($_POST['vf_clave'])&&!empty($_POST['vf_clave']))
{
  $eError[] = 'hola 1';
//  $db = odbc_connect(ODBC_NAME, ODBC_USER, ODBC_PASSWD, SQL_CUR_USE_ODBC) or die ('Error al intentar conectar con el servidor.');
	$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

  $vUsuario = strtoupper($_POST['vf_usuario']);
  $vClave   = strtoupper($_POST['vf_clave']);

  $sql = "SELECT p.codprof, p.apepro, p.nompro, p.clave FROM profe p WHERE p.codprof='".$vUsuario."' AND p.clave=".$vClave;

if(trim($_POST['vf_usuario'])<>"" && trim($_POST['vf_clave'])<>"")
/*ESTE IF ME PERMITE SALIR Y VOLVER A INDEX.PHP */
{
//  $result = odbc_exec($db, $sql);
  $result = mysqli_query($db, $sql);

//  $row = odbc_fetch_object($result);
  $row = mysqli_fetch_row($result);
  $eError = array();
//  if(trim($row->codprof)==$vUsuario)
  if(trim($row[0])==$vUsuario)
  {
//    if($row->clave==$vClave)
    if($row[3]==$vClave)
	{
		   $_SESSION['bandera'] = 0;
		   $_SESSION['app_user_active'] = true;
		   $_SESSION['app_user_type'] = "doc";
		   $_SESSION['auxiliar'] = $row[0]; //$row->codprof;   ESTE ES IMPORTANTE NO BORRAR se usa para dar practica de examen
	       $_SESSION['app_user_id']     = $row[0]; //$row->codprof;
	       $_SESSION['app_user_ape']   = $row[1]; //$row->apepro;
//		   $_SESSION['app_user_login']  = $row->login;
	       $_SESSION['app_user_nom']   = $row[2]; //$row->nompro;
	       $_SESSION['app_user_name']   = $row[1]; //$row->apepro;
		   $_SESSION['app_user_carnet']= '';
		   $_SESSION['app_user_nombre']= '';
	       $_SESSION['app_user_access'] = date("Y-n-j H:i:s");
		   $_SESSION['app_user_sysdat']= date("Y-n-j");

			$hora_actual = date("H:i:s");
			$detalle = 'Ingreso: Usr correcto: '.$_POST['vf_usuario'];
			$sql0logs = "INSERT INTO `logs` VALUES ('".$_SESSION['app_user_id']."','".$detalle."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  
			$result0logs = mysqli_query($db, $sql0logs);

	       //header('location: menu_docente.php');
	       header('location: inicios.php');
	       exit();
    }
	else
	{
		$hora_actual = date("H:i:s");
		$detalle = 'Ingreso: Clave incorrecta: '.$_POST['vf_clave'];
		$sql0logs = "INSERT INTO `logs` VALUES ('0','".$detalle."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  
		$result0logs = mysqli_query($db, $sql0logs);
 		$eError[] = 'Clave incorrecta';
    }    
  }
  else
  {
	$hora_actual = date("H:i:s");
	$detalle = 'Ingreso: Usr Incorrecto: '.$_POST['vf_usuario'];
	$sql0logs = "INSERT INTO `logs` VALUES ('0','".$detalle."','".$_SESSION['app_user_sysdat']."','".$hora_actual."','".$_SERVER['REMOTE_ADDR']."')";  
	$result0logs = mysqli_query($db, $sql0logs);
	$eError[] = 'Nombre de usuario incorrecto 4';	
  }
}
else
{
header('location: inicio_segundo.php');
	       exit();
}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>COLEGIO AIZAMA</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/style_login.css">
</head>
<body>
  <main class="login-user">
    <div class="contenedor-login-user">
      <form action="" method="post" id="fLogin">
        <div class="img-logo">
          <img src="images/logo.png" alt="Logotipo del Colegio">
        </div>
        <label for="nombre">Usuario:</label>
        <input type="text" id="vf_usuario" name="vf_usuario" placeholder="Tu código de docente">
        <label for="password" >Clave:</label>
        <input type="password" id="vf_clave" name="vf_clave" placeholder="Tu clave">
        <p style="color:red" >
            <?php
                if(!empty($eError)){
                  foreach($eError as $value)
                    echo $value, '<br />';
                }
            ?>
        </p>
        <input type="button" class="btn" id="btnAceptar" value="Ingresar">
        <input type="button" class="btn" id="btnSalir" value="Salir">
         <videos_profesor.php-->
         <a href="videos_tutoriales_profesores.php" target=_blank class="btn" style="text-decoration:none; background-color:#c4302b; padding:4px;">
            <div style="display:flex; align-items:center; justify-content:center;">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-youtube" width="44" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <rect x="3" y="5" width="18" height="14" rx="4" />
                  <path d="M10 9l5 3l-5 3z" />
                </svg> 
                <span>Ver videos</span> 
            </div>
         </a>
      </form>
    </div>
  </main>
  <script type="text/javascript" src="js/jquery.js"></script>
  <script type="text/javascript" src="js/app_docentes.js"></script>
</body>
</html>
