<?php 
session_start();
require '../includes/functions.php';
header("Content-type:text/html;charset=utf-8");
header('Access-Conotrol-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

if ($_GET) {
	switch ($_GET['op']) {
		case 'get_lista':
			require_once("../modelo/modelo_Alumno.php");
			require_once("../modelo/modelo_preinscripcion_blocked.php");
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$al = new Alumno($db);
			$resAl = $al->get_alumnos();
			$lista = array();
			while($fila = $resAl->fetch_object()){
				$lista[] = $fila;
			}
			$alblo = new Blocked_Preinscripcion($db);
			$resBl = $alblo->get_lista();
			$bloqued = array();
			while ($fila = $resBl->fetch_object()) {
				$bloqued[] = $fila;
			}
			echo json_encode(array("status"=>"ok","lista"=>$lista,"bloqued"=>$bloqued));
			break;
		case 'bloqueo':
			$codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
			$bloqueo = isset($_POST['bloqueo'])?$_POST['bloqueo']:"";

			if(empty($codalu)){
				echo "errorParam";
				exit();
			}
			$usr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($usr)){
				echo "eSession";
				exit();
			}
			$fechareg = date("Y-m-d H:i:s");
			require_once('../modelo/modelo_preinscripcion_blocked.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$mod_blo = new Blocked_Preinscripcion($db);
			$result = $mod_blo->get_registro($codalu);
			if($fila = $result->fetch_object()){
				if($fila->estado!=$bloqueo){
					$mod_blo->update($codalu,$fechareg,$bloqueo,$usr);
					echo "ok";
				}
			}else if ($bloqueo==1) {			
				$mod_blo->save($codalu,$fechareg,$usr);
				echo "ok";
			}
			break;
		default:
			echo "errorOP";
			break;
	}
}else{
echo "errorGET";
}
?>
	