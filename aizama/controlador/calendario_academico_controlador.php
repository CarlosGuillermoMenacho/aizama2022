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
	echo json_encode(["status"=>"eSession"]);
	exit();
}

if ($_GET) {
	switch ($_GET['op']){
		case 'get_calendario_academico':
			$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($usr)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$gestion = date("Y");
			require_once('../modelo/modelo_calendario_academico.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$CA = new Calendario_Academico($db);
			$result = $CA->get_gestion($gestion);
			$ca = [];
			while ($row = $result->fetch_object()) {
				$ca[] = [
					"id"=>$row->id,
					"descripcion"=>$row->descripcion,
					"fecha"=>$row->fecha
				];
			}

			$res = [
				"status"=>"ok",
				"calendario"=>$ca
			];
			echo json_encode($res);

			break;
		case 'save':
			$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($usr)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
			$fecha = isset($_POST["fecha"])?$_POST["fecha"]:"";

			if(empty($descripcion) || empty($fecha)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			require_once('../modelo/modelo_calendario_academico.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$CA = new Calendario_Academico($db);

			$gestion = date("Y");
			$fechareg = date("Y-m-d H:i:s");
			$CA->save($gestion,$descripcion,$fecha,$usr,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'update':
			$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($usr)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
			$fecha = isset($_POST["fecha"])?$_POST["fecha"]:"";
			$id = isset($_POST["id"])?$_POST["id"]:"";
			if(empty($descripcion) || empty($fecha) || empty($id)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			require_once('../modelo/modelo_calendario_academico.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$CA = new Calendario_Academico($db);

			$fechareg = date("Y-m-d H:i:s");
			$CA->update($id,$descripcion,$fecha,$usr,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'delete':
			$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($usr)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			
			$id = isset($_POST["id"])?$_POST["id"]:"";
			if(empty($id)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			require_once('../modelo/modelo_calendario_academico.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$CA = new Calendario_Academico($db);

			$fechareg = date("Y-m-d H:i:s");
			$CA->delete($id,$usr,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		default:
			echo "errorOP";
			break;
	}
}else{
	echo "errorGet";
}