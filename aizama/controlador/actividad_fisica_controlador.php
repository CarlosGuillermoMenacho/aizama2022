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
	case 'get_actividades':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if(empty($codcur)||empty($codpar)){
			echo json_encode(array("status"=>"errorParam"));
			exit();
		}

		require_once'../modelo/modelo_rendimiento_fisico.php';
		$AF = new Actividad_fisica($db);
		$gestion = date("Y");
		$result = $AF->get_actividad_curso($gestion,$codcur,$codpar);
		$actividades = [];
		while ($row = $result->fetch_object()) {
			$actividades[] = [
				"descripcion"=>$row->descripcion,
				"id"=>$row->id,
				"eval"=>$row->id_evaluacion,
				"evaluacion"=>$row->eval
			];
		}
		echo json_encode(["status"=>"ok","data"=>$actividades]);
		
		break;
	case 'get_evaluaciones':
		require_once'../modelo/modelo_evaluacion_actividad_fisica.php';
		$TAF = new Tipo_Evaluacion_Actividad_Fisica($db);
		$result = $TAF->get_all();
		$lista = [];
		while ($row = $result->fetch_object()) {
			$lista[] = [
				"id"=>$row->id,
				"descripcion"=>$row->descripcion
			];
		}
		echo json_encode(["status"=>"ok","data"=>$lista]);
		break;
	case 'save_actividad':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
		$id_eva = isset($_POST['id_eva'])?$_POST['id_eva']:"";
		$codprof =isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
		if(empty($codprof)){
			echo json_encode(array("status"=>"eSession"));
			exit();
		}
		if(empty($codcur)||empty($codpar||empty($descripcion)||empty($id_eva))){
			echo json_encode(array("status"=>"errorParam"));
			exit();
		}
		require_once'../modelo/modelo_rendimiento_fisico.php';
		require_once'../modelo/modelo_evaluacion_actividad_fisica.php';
		$TAF = new Tipo_Evaluacion_Actividad_Fisica($db);
		$AF = new Actividad_fisica($db);
		$gestion = date("Y");
		$createdAt = date("Y-m-d H:i:s");
		$id_inserted = $AF->save($gestion,$descripcion,$id_eva,$codcur,$codpar,$codprof,$createdAt);
		$result = $TAF->get($id_eva);
		$row = $result->fetch_object();
		$response = [
			"descripcion"=>$descripcion,
			"id"=>$id_inserted,
			"eval"=>$id_eva,
			"evaluacion"=>$row->descripcion
		];
		echo json_encode(["status"=>"ok","data"=>$response]);
		break;
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}

?>