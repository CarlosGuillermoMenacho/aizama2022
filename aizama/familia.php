<?php
session_start();

require 'includes/config.php';
if(isset($_POST['vf_usuario']) && isset($_POST['vf_clave'])&&!empty($_POST['vf_usuario'])&&!empty($_POST['vf_clave']))
{
  $eError[] = 'hola 1';
//  $db = odbc_connect(ODBC_NAME, ODBC_USER, ODBC_PASSWD, SQL_CUR_USE_ODBC) or die ('Error al intentar conectar con el servidor.');
	$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');

  $vUsuario = strtoupper($_POST['vf_usuario']);
//  $vClave   = strtoupper($_POST['vf_clave']);
  $vClave   = trim($_POST['vf_clave']);

//  $sql = "SELECT p.codprof, p.apepro, p.nompro, p.clave FROM profe p WHERE p.codprof='".$vUsuario."' AND p.clave=".$vClave;
//  $sql = "SELECT id_usr,nombre_usr,login,password FROM usr WHERE login='".$vUsuario."' AND password=".$vClave;
  //$sql = "SELECT id_usr,nombre_usr,login,password FROM usr WHERE login='$vUsuario' AND password=$vClave";
//  $sql = "SELECT cod_per,apepro,nompro,cargo,clave FROM personal WHERE cod_per=".$vUsuario." AND clave=".$vClave;
  $sql = "SELECT cod_tut,paterno,nombres,materno,cel,ci FROM tutor WHERE ci='".$vUsuario."' AND cel='".$vClave."'";


if(trim($_POST['vf_usuario'])<>"" && trim($_POST['vf_clave'])<>"")
/*ESTE IF ME PERMITE SALIR Y VOLVER A INDEX.PHP */
{
  $result = mysqli_query($db, $sql);

  $row = mysqli_fetch_row($result);
  $eError = array();
  if(trim($row[5])==trim($vUsuario))
  {
    if($row[4]==$vClave)
	{
		   $_SESSION['bandera'] = 0;
		   $_SESSION['app_user_active'] = true;
		   $_SESSION['app_user_type'] = "adm";
	       $_SESSION['app_user_id']     = $row[0]; //$row->codprof;
	       $_SESSION['app_user_ape']   = $row[1]; //$row->apepro;
//		   $_SESSION['app_user_login']  = $row->login;
	       $_SESSION['app_user_nom']   = $row[2]; //$row->nompro;
	       $_SESSION['app_user_name']   = $row[2]; //$row->apepro;
		   $_SESSION['app_user_carnet']= '';
		   $_SESSION['app_user_nombre']= '';
	       $_SESSION['app_user_access'] = date("Y-n-j H:i:s");
		   $_SESSION['app_user_sysdat']= date("Y-n-j");

	       header('location: inicios_family.php');
	       exit();
    }
	else
	{
      $eError[] = 'Clave incorrecta';
    }    
  }else{
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
        <label for="nombre">Usuario Familia (Nro. Carnet):</label>
        <input type="password" id="vf_usuario" name="vf_usuario" placeholder="Tu cédula de identidad...">
        <label for="password" >Clave:</label>
        <input type="password" id="vf_clave" name="vf_clave" placeholder="Tu número de celular...">
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
        <a href="videos_tutoriales_familia.php" target=_blank class="btn" style="text-decoration:none; background-color:#c4302b; padding:4px;">
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
  <script type="text/javascript" src="js/app_administracion.js"></script>
</body>
</html>
