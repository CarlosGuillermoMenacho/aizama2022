<?php 
if(isset($_COOKIE['userinfo'])&&!empty($_COOKIE['userinfo'])){
	$cookie = json_decode($_COOKIE['userinfo']);
	$token = $cookie->token;
	require_once"modelo/modelo_sesion.php";
	require_once"modelo/conexion.php";
	$db = Conectar::conexion();
	$Session = new Session($db);
	$Session->delete_sesion($token);
	setcookie("userinfo","noToken",time() - 100);
}
echo "ok";
?>