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
					"desde"=>$row->desde,
					"hasta"=>$row->hasta,
					"file"=>$row->file
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
			$desde = isset($_POST["desde"])?$_POST["desde"]:"";
			$hasta = isset($_POST["hasta"])?$_POST["hasta"]:"";
			if(empty($descripcion) || empty($desde)|| empty($hasta)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			if(strtotime($desde)>strtotime($hasta)){
				echo json_encode(["status"=>"errorFecha"]);
				exit();
			}
			require_once('../modelo/modelo_calendario_academico.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$CA = new Calendario_Academico($db);

			$gestion = date("Y");
			$fechareg = date("Y-m-d H:i:s");
			$file = "";
			if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])){
				$ext=explode(".",$_FILES["imagen"]["name"]);
				if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png"){
						
					$fichero="../calendarioAcademico/";
					$file=$usr.'-'.strtotime(date("Y-m-d H:i:s")).'.'.end($ext);								
					$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$file);
				}else{
					echo json_encode(["status"=>"errorFileFormat"]);
					exit();
				}
			}
			$CA->save($gestion,$descripcion,$file,$desde,$hasta,$usr,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'update':
			$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($usr)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
			$desde = isset($_POST["desde"])?$_POST["desde"]:"";
			$hasta = isset($_POST["hasta"])?$_POST["hasta"]:"";
			$id = isset($_POST["id"])?$_POST["id"]:"";
			if(empty($descripcion) || empty($desde)|| empty($hasta) || empty($id)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			if(strtotime($desde)>strtotime($hasta)){
				echo json_encode(["status"=>"errorFecha"]);
				exit();
			}
			require_once('../modelo/modelo_calendario_academico.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$CA = new Calendario_Academico($db);

			$fechareg = date("Y-m-d H:i:s");
			$CA->update($id,$descripcion,$desde,$hasta,$usr,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'set_img':
			$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($usr)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$file = isset($_POST["file"])?$_POST["file"]:"";
			$id = isset($_POST["id"])?$_POST["id"]:"";
			if(empty($id)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])){
				$ext=explode(".",$_FILES["imagen"]["name"]);
				if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png"){
						
					$fichero="../calendarioAcademico/";
					$nombreArchivo=$usr.'-'.strtotime(date("Y-m-d H:i:s")).'.'.end($ext);								
					$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
					require_once('../modelo/modelo_calendario_academico.php');
					require_once'../modelo/conexion.php';
					$db = Conectar::conexion();
					$CA = new Calendario_Academico($db);
					$fechareg = date("Y-m-d H:i:s");
					$CA->set_imagen($id,$nombreArchivo,$usr,$fechareg);
					echo json_encode(["status"=>"ok","img"=>$nombreArchivo]);
				}else{
					echo json_encode(["status"=>"errorFileFormat"]);
					exit();
				}
			}else{
				echo json_encode(["status"=>"errorFile"]);
				exit();
			}
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