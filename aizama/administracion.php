<?php
session_start();
require_once"includes/functions.php";
require_once"constantes.php";
$token = UID();

if(!isset($_COOKIE['userinfo'])||empty($_COOKIE['userinfo'])){
  $time = time()+$segundos;
  setcookie("userinfo",json_encode(["token"=>$token,"address"=>getClientIP(),"time"=>$time]),$time);
}else{
  $cookie =json_decode($_COOKIE['userinfo']);
  $token = $cookie->token;
  require_once"modelo/conexion.php";
  require_once"modelo/modelo_sesion.php";
  require_once"modelo/modelo_usuario.php";
  $db = Conectar::conexion();
  $Session = new Session($db);
  $result = $Session->get_session_data($token);
  if($row = $result->fetch_object()){
    $id_usr = $row->id_user;
    $tipo = $row->tipo;
    $_SESSION['app_user_id'] = $id_usr;
    $Usuario = new Usuario($db);
    $result = $Usuario->get_data($id_usr,$tipo);
    if($row = $result->fetch_object()){
      if($tipo == "adm"){
        $_SESSION['bandera'] = 0;
        $_SESSION['app_user_active'] = true;
        $_SESSION['app_user_type'] = "adm";
        $_SESSION['app_user_id']     = $id_usr; //$row->codprof;
        $_SESSION['app_user_ape']   = $row->APEPRO; //$row->apepro;
        $_SESSION['app_user_nivel']  = $row->NIVEL; //$row->nivel;
        $_SESSION['app_user_nom']   = $row->NOMPRO; //$row->nompro;
        $_SESSION['app_user_name']   = $row->NOMPRO; //$row->apepro;
        $_SESSION['app_user_carnet']= '';
        $_SESSION['app_user_nombre']= '';
        $_SESSION['app_user_access'] = date("Y-n-j H:i:s");
        $_SESSION['app_user_sysdat']= date("Y-n-j");
        header("Location: menu_administracion.php");
      }  
      if($tipo == "por"){
        $_SESSION['bandera'] = 0;
        $_SESSION['app_user_active'] = true;
        $_SESSION['app_user_type'] = "adm";
        $_SESSION['app_user_id']     = $id_usr; //$row->codprof;
        $_SESSION['app_user_ape']   = $row->APEPRO; //$row->apepro;
        $_SESSION['app_user_nivel']  = $row->NIVEL; //$row->nivel;
        $_SESSION['app_user_nom']   = $row->NOMPRO; //$row->nompro;
        $_SESSION['app_user_name']   = $row->NOMPRO; //$row->apepro;
        $_SESSION['app_user_carnet']= '';
        $_SESSION['app_user_nombre']= '';
        $_SESSION['app_user_access'] = date("Y-n-j H:i:s");
        $_SESSION['app_user_sysdat']= date("Y-n-j");
        header("Location: menu_portero.php");
      }     
    }else{
      $Session->delete($token);
      $time = time()+$segundos;
      setcookie("userinfo",json_encode(["token"=>UID(),"address"=>getClientIP(),"time"=>$time]),$time);
    }
  }

}
require 'includes/config.php';

if(isset($_POST['vf_usuario']) && isset($_POST['vf_clave']))

{

  $eError[] = 'hola 1';

	$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');



  $vUsuario = strtoupper($_POST['vf_usuario']);

  $vClave   = $_POST['vf_clave'];

  $sql = "SELECT cod_per,apepro,nompro,cargo,clave,nivel FROM personal WHERE cod_per=".$vUsuario." AND clave=".$vClave;





if(trim($_POST['vf_usuario'])<>"" && trim($_POST['vf_clave'])<>"")

/*ESTE IF ME PERMITE SALIR Y VOLVER A INDEX.PHP */

{

  $result = mysqli_query($db, $sql);



  $row = mysqli_fetch_row($result);

  $eError = array();

  if(trim($row[0])==trim($vUsuario))

  {

    if($row[4]==$vClave)

	{

        if($row[5]=='portero')

        {

    		$_SESSION['bandera'] = 0;

    		$_SESSION['app_user_active'] = true;

    		$_SESSION['app_user_type'] = "adm";

    	    $_SESSION['app_user_id']     = $row[0]; //$row->codprof;

    	    $_SESSION['app_user_ape']   = $row[1]; //$row->apepro;

            $_SESSION['app_user_nivel']  = $row[5]; //$row->nivel;

    	    $_SESSION['app_user_nom']   = $row[2]; //$row->nompro;

    	    $_SESSION['app_user_name']   = $row[2]; //$row->apepro;

    		$_SESSION['app_user_carnet']= '';

    		$_SESSION['app_user_nombre']= '';

    	    $_SESSION['app_user_access'] = date("Y-n-j H:i:s");

    		$_SESSION['app_user_sysdat']= date("Y-n-j");
        $cookie =json_decode($_COOKIE['userinfo']);
        $token = $cookie->token;
        $address = $cookie->address;
        $user = $row[0];
        $tipo = "por";
        $time = $cookie->time;
        $Session->save($token,$address,$user,$tipo,$time);
  	    header('location: menu_portero.php');

    	    exit();

        }

        else{

    		$_SESSION['bandera'] = 0;

    		$_SESSION['app_user_active'] = true;

    		$_SESSION['app_user_type'] = "adm";

    	    $_SESSION['app_user_id']     = $row[0]; //$row->codprof;

    	    $_SESSION['app_user_ape']   = $row[1]; //$row->apepro;

            $_SESSION['app_user_nivel']  = $row[5]; //$row->nivel;

    	    $_SESSION['app_user_nom']   = $row[2]; //$row->nompro;

    	    $_SESSION['app_user_name']   = $row[2]; //$row->apepro;

    		$_SESSION['app_user_carnet']= '';

    		$_SESSION['app_user_nombre']= '';

    	    $_SESSION['app_user_access'] = date("Y-n-j H:i:s");

    		$_SESSION['app_user_sysdat']= date("Y-n-j");
        $cookie =json_decode($_COOKIE['userinfo']);
        $token = $cookie->token;
        $address = $cookie->address;
        $user = $row[0];
        $tipo = "adm";
        $time = $cookie->time;
        $Session->save($token,$address,$user,$tipo,$time);
    

    	    header('location: menu_administracion.php');

    	    exit();

        }

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
function UID()
{
  date_default_timezone_set("UTC");
 
  $Uid=hash("md2",(string)microtime());
 
  return $Uid;
}
function getClientIP() {

    if (isset($_SERVER)) {

        if (isset($_SERVER["HTTP_X_FORWARDED_FOR"]))
            return $_SERVER["HTTP_X_FORWARDED_FOR"];

        if (isset($_SERVER["HTTP_CLIENT_IP"]))
            return $_SERVER["HTTP_CLIENT_IP"];

        return $_SERVER["REMOTE_ADDR"];
    }

    if (getenv('HTTP_X_FORWARDED_FOR'))
        return getenv('HTTP_X_FORWARDED_FOR');

    if (getenv('HTTP_CLIENT_IP'))
        return getenv('HTTP_CLIENT_IP');

    return getenv('REMOTE_ADDR');
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

        <input type="text" id="vf_usuario" name="vf_usuario" placeholder="Tu codigo de administrador">

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

      </form>

    </div>

  </main>

  <script type="text/javascript" src="js/jquery.js"></script>

  <script type="text/javascript" src="js/app_administracion.js"></script>

</body>

</html>

