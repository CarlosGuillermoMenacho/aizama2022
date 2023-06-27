<?php 
if(!isset($_COOKIE['userinfo'])||empty($_COOKIE['userinfo'])){
  header("Location: ../perfil.php");
}

$cookie =json_decode($_COOKIE['userinfo']);
$token = $cookie->token;
require_once"modelo/conexion.php";
require_once"modelo/modelo_sesion.php";
require_once"modelo/modelo_usuario.php";
require_once"constantes.php";
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
    switch ($tipo) {
    	case 'adm':
    	case 'por':
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
	      	$time = time()+$segundos;
	      	setcookie("userinfo",json_encode(["token"=>$token,"address"=>getClientIP(),"time"=>$time]),$time,"/aizama");
	      	$Session->update_session($token,$time);
    		break;
    	case 'doc':
    		$_SESSION['bandera'] = 0;
		   	$_SESSION['app_user_active'] = true;
		   	$_SESSION['app_user_type'] = "doc";
		   	$_SESSION['auxiliar'] = $id_usr; //$row->codprof;   ESTE ES IMPORTANTE NO BORRAR se usa para dar practica de examen
	       	$_SESSION['app_user_id']     = $id_usr; //$row->codprof;
	       	$_SESSION['app_user_ape']   = $row->APEPRO; //$row->apepro;
	       	$_SESSION['app_user_nom']   = $row->NOMPRO; //$row->nompro;
	       	$_SESSION['app_user_name']   = $row->APEPRO; //$row->apepro;
		   	$_SESSION['app_user_carnet']= '';
		   	$_SESSION['app_user_nombre']= '';
	       	$_SESSION['app_user_access'] = date("Y-n-j H:i:s");
		   	$_SESSION['app_user_sysdat']= date("Y-n-j");
		   	$time = time()+$segundos;
	      	setcookie("userinfo",json_encode(["token"=>$token,"address"=>getClientIP(),"time"=>$time]),$time,"/aizama");
	      	$Session->update_session($token,$time);
    		break;
    	case 'est':
    		$_SESSION['app_user_id'] = 0;
			$_SESSION['app_user_sysdat']= date("Y-n-j");
			$_SESSION['c_curso'] = 0;  // variable para practica on line
			$_SESSION['n_curso'] = '';  // variable para practica on line
			$_SESSION['usuario'] = $row->codalu;
		    $_SESSION['app_user_id']     = $id_usr;  // $row->id_usr;
	    	$_SESSION['app_user_name']   = $row->paterno . ' ' . $row->materno .' '. $row->nombres;
	    	$_SESSION['curso'] = $row->descrip." - ".$row->descripp;
	    	$_SESSION['app_curso']=$row->descrip." - ".$row->descripp;
	    	$time = time()+$segundos;
	      	setcookie("userinfo",json_encode(["token"=>$token,"address"=>getClientIP(),"time"=>$time]),$time,"/aizama");
	      	$Session->update_session($token,$time);
    		break;
    	case 'tut':
    		$_SESSION['bandera'] = 0;
		   	$_SESSION['app_user_active'] = true;
		   	$_SESSION['app_user_type'] = "tut";
	       	$_SESSION['app_user_id']     = $id_usr; //$row->codprof;
	       	$_SESSION['app_user_ape']   = $row->paterno." ".$row->materno; //$row->apepro;
	       	$_SESSION['app_user_nom']   = $row->nombres; //$row->nompro;
	       	$_SESSION['app_user_name']   = $row->paterno; //$row->apepro;
		   	$_SESSION['app_user_carnet']= '';
		   	$_SESSION['app_user_nombre']= '';
	       	$_SESSION['app_user_access'] = date("Y-n-j H:i:s");
		   	$_SESSION['app_user_sysdat']= date("Y-n-j");
		   	$time = time()+$segundos;
	      	setcookie("userinfo",json_encode(["token"=>$token,"address"=>getClientIP(),"time"=>$time]),$time,"/aizama");
	      	$Session->update_session($token,$time);
    		break;
    	default:
    		header("Location: ../perfil.php");
    		break;
    }
     
  }else{
    $Session->delete($token);
    header("Location: ../perfil.php");
  }
}else{
	header("Location: ../perfil.php");
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