<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
require_once'../modelo/conexion.php';
$db = Conectar::conexion();
if(!cliente_activo()){
	echo json_encode(array("status"=>"eSession"));
	exit();
}

switch ($_GET['op']) {
	case 'save_indicador':
		$codigo = isset($_POST['id'])?$_POST['id']:"";
		$indicador = isset($_POST['texto'])?$_POST['texto']:"";
		$tipo = isset($_POST['tipe'])?$_POST['tipe']:"";

		if(empty($codigo)||empty($tipo)){
			echo "errorParam";
			exit();
		}

		require_once'../modelo/modelo_indicador.php';
		$Indicador = new Indicador($db);
		$result = $Indicador->save($codigo,$tipo,$indicador);
		echo json_encode(array("status"=>"ok"));
		
		break;
	
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}

?>