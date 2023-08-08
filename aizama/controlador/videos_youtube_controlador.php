<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';

if ($_GET) {
	switch ($_GET['op']){
		case 'get_videos':
			require_once"../modelo/conexion.php";
			require_once"../modelo/modelo_video_youtube.php";
			$db = Conectar::conexion();
			$VY = new Videos_Youtube($db);

			$result = $VY->get_all();

			$videos = [];

			while ($row = $result->fetch_object()) {
				$vistas = "0 vistas";
				if($row->vistas > 0){
					if($row->vistas == 1)$vistas = "1 vista";
					else $vistas = "$row->vistas vistas";
				}
				$fechareg = new DateTime($row->createdAt);
				$hoy = new DateTime(date("Y-m-d H:i:s"));
				$diferncia = $fechareg->diff($hoy);
				$tiempo = "";
				if ($diferncia->y > 0) {
					if($diferncia->y == 1)$tiempo = "Hace 1 año";
					else $tiempo = "Hace $diferncia->y años";
				}else if($diferncia->m > 0){
					if($diferncia->m == 1)$tiempo = "Hace 1 mes";
					else $tiempo = "Hace $diferncia->m meses";
				}else if($diferncia->d > 0){
					if($diferncia->d == 1)$tiempo = "Hace 1 día";
					else $tiempo = "Hace $diferncia->d dias";
				}

				$videos[] = [
					"id"=>$row->id,
					"titulo"=>$row->titulo,
					"descripcion"=>$row->descripcion,
					"enlace"=>$row->enlace,
					"captura"=>$row->captura,
					"vistas"=>$vistas,
					"tiempo"=>$tiempo
				];
			}
			echo json_encode(["status"=>"ok","data"=>$videos]);
			break;
		case 'save':
			if(!cliente_activo()){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$id_user = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($id_user)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$titulo = isset($_POST["titulo"])?$_POST["titulo"]:"";
			$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
			$enlace = isset($_POST["enlace"])?$_POST["enlace"]:"";

			if(empty($titulo)||empty($descripcion)||empty($enlace)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$file = "";
			if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])){
				$ext=explode(".",$_FILES["imagen"]["name"]);
				if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png"){
						
					$fichero="../miniaturas/";
					$file=$id_user.'-'.strtotime(date("Y-m-d H:i:s")).'.'.end($ext);								
					$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$file);
				}else{
					echo json_encode(["status"=>"errorFileFormat"]);
					exit();
				}
			}else{
				echo json_encode(["status"=>"errorFile"]);
				exit();
			}
			$fechareg = date("Y-m-d H:i:s");
			require_once"../modelo/conexion.php";
			require_once"../modelo/modelo_video_youtube.php";
			$db = Conectar::conexion();
			$VY = new Videos_Youtube($db);
			$VY->save($titulo,$descripcion,$enlace,$file,$id_user,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'update':
			if(!cliente_activo()){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$id_user = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($id_user)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$id = isset($_POST["id"])?$_POST["id"]:"";
			$titulo = isset($_POST["titulo"])?$_POST["titulo"]:"";
			$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
			$enlace = isset($_POST["enlace"])?$_POST["enlace"]:"";

			if(empty($id)||empty($titulo)||empty($descripcion)||empty($enlace)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$fechareg = date("Y-m-d H:i:s");
			$file = "";
			require_once"../modelo/conexion.php";
			require_once"../modelo/modelo_video_youtube.php";
			$db = Conectar::conexion();
			$VY = new Videos_Youtube($db);
			if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])){
				$ext=explode(".",$_FILES["imagen"]["name"]);
				if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png"){
						
					$fichero="../miniaturas/";
					$file=$id_user.'-'.strtotime(date("Y-m-d H:i:s")).'.'.end($ext);								
					$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$file);
					$VY->set_captura($id,$file,$id_user,$fechareg);
				}else{
					echo json_encode(["status"=>"errorFileFormat"]);
					exit();
				}
			}
			$VY->update($id,$titulo,$descripcion,$enlace,$id_user,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'delete':
			if(!cliente_activo()){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$id_user = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
			if(empty($id_user)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$id = isset($_POST["id"])?$_POST["id"]:"";
			
			if(empty($id)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$fechareg = date("Y-m-d H:i:s");
			require_once"../modelo/conexion.php";
			require_once"../modelo/modelo_video_youtube.php";
			$db = Conectar::conexion();
			$VY = new Videos_Youtube($db);
			$VY->delete($id,$id_user,$fechareg);
			echo json_encode(["status"=>"ok"]);
			break;
		case 'visto':
			$id = isset($_POST["id"])?$_POST["id"]:"";
			
			if(empty($id)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			require_once"../modelo/conexion.php";
			require_once"../modelo/modelo_video_youtube.php";
			$db = Conectar::conexion();
			$VY = new Videos_Youtube($db);
			$VY->visto($id);
			echo json_encode(["status"=>"ok"]);
			break;
		default:
			echo "errorOP";
			break;
	}
}else{
	echo "errorGet";
}