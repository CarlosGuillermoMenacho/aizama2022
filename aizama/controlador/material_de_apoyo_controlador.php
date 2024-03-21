<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';

if(!cliente_activo()){
	echo json_encode(array("status"=>"eSession"));
	exit();
}

switch ($_GET['op']) {
	case 'get_material':
		$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codcur =  isset($_POST["codcur"])?$_POST["codcur"]:"";
		$codpar =  isset($_POST["codpar"])?$_POST["codpar"]:"";
		$codmat =  isset($_POST["codmat"])?$_POST["codmat"]:"";
		if(empty($codcur) || empty($codpar) || empty($codmat)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_material_de_apoyo.php';
		$db = Conectar::conexion();
		$MDA = new Material($db);
		$gestion = date("Y");
		$result = $MDA->get_material_gestion_materia($gestion,$codcur,$codpar,$codmat);
		$materiales = [];
		while ($row = $result->fetch_object()) {
			$materiales[] = [
				"material"=>$row->archivo,
				"descripcion"=>$row->descripcion,
				"titulo"=>$row->titulo,
				"trimestre"=>$row->trimestre,
				"fecha"=>$row->fecha,
				"hora"=>substr($row->hora,0,5)
			];
		}
		echo json_encode(["status"=>"ok","materiales"=>$materiales]);
		break;
	
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}

?>