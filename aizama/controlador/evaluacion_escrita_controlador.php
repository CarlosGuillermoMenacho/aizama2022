<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
//require_once"../session_verify.php";

if(!cliente_activo()){
	echo json_encode(["status" => "eSession"]);
	exit();
}
switch ($_GET['op']) {
	case 'get_banco':
	    $user = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
	    if(empty($user)){
	    	echo json_encode(["status"=>"eSession"]);
	    	exit();
	    }
		$codexa = isset($_POST["codexa"])?$_POST["codexa"]:"";
		if(empty($codexa)){
			echo json_encode(["status"=>"errorParam"]);
	    	exit();
		}
	    require_once'../modelo/conexion.php';
	    require_once'../modelo/modelo_evaluacion_escrita.php';
		$db = Conectar::conexion();	
		$EE = new EvaluacionEscrita($db); 
		$result = $EE->get_preguntas($codexa);
		$preguntas = [];
		while ($row = $result->fetch_object()) {
			$preguntas[] = $row;
		}
	    echo json_encode(["status"=>"ok","data"=>$preguntas]);
	    break;
	default:
		echo json_encode(["status"=>"errorOP"]);
		break;
}

?>

