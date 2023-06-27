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
$_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
if (empty($_tipo_user)){
	echo "errorGET";
	exit();
}
if(!cliente_activo()){
	if ($_tipo_user=='doc') {
		header("Location: ../docentes.php");
	}
	if ($_tipo_user=='alu') {
		header("Location: ../usuario.php");
	}
	if ($_tipo_user=='adm') {
		header("Location: ../administracion.php");
	}
	exit();
}

if ($_GET) {
	switch ($_GET['op']){
		case 'get_eventos':
			$year = date("Y");
			require_once('../modelo/modelo_eventos.php');
			$evento = new Evento($db);
			$eventos = $evento->get_eventos($year);
			$lista = array();
			foreach($eventos as $fila){
				$lista[]=array(
							"admin"=>$fila['admin'],
							"descripcion"=>$fila['descripcion'],
							"fecha"=>$fila['fecha'],
							"horaf"=>substr($fila['horaf'],0,5),
							"horai"=>substr($fila['horai'],0,5),
							"id"=>$fila['id']
							);
			}
			echo json_encode($lista);
			break;
		case 'delete_evento':

			$id = isset($_POST['id'])?$_POST['id']:"";
			if(empty($id)){
				echo "errorParam";
				exit();
			}
			require_once '../modelo/modelo_eventos.php';
			$evento = new Evento($db);
			if($evento->delete_evento($id)){
				echo "ok";
			}else{
				echo "error";
			}
			break;
		case 'nuevo_evento':
			$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
			$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
			$inicio = isset($_POST['inicio'])?$_POST['inicio']:"";
			$fin = isset($_POST['fin'])?$_POST['fin']:"";
			$enlace = isset($_POST['enlace'])?$_POST['enlace']:"";
			if(empty($descripcion)||empty($fecha)||
			   empty($inicio)||empty($fin)){
				echo "errorParam";
				exit();
			}
			$fechaReg = date("Y-m-d H:i:s");
			$admin = $_SESSION['app_user_id'];

			require_once('../modelo/modelo_eventos.php');
			$evento = new Evento($db);
			if($evento->save_evento($descripcion,$fecha,$inicio,$fin,$fechaReg,$admin,$enlace)){
				echo "ok";
			}else{
				echo "error";
			}

			break;
		case 'update_evento':
			$id = isset($_POST['id'])?$_POST['id']:"";
			$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
			$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
			$inicio = isset($_POST['inicio'])?$_POST['inicio']:"";
			$fin = isset($_POST['fin'])?$_POST['fin']:"";
			if(empty($descripcion)||empty($fecha)||
			   empty($inicio)||empty($fin)){
				echo "errorParam";
				exit();
			}
			$fechaReg = date("Y-m-d H:i:s");
			$admin = $_SESSION['app_user_id'];

			require_once('../modelo/modelo_eventos.php');
			$evento = new Evento($db);
			if($evento->update_evento($id,$descripcion,$fecha,$inicio,$fin,$fechaReg,$admin)){
				echo "ok";
			}else{
				echo "error";
			}
			break;
		case 'get_eventos_mes':
			$mes = isset($_POST['mes'])?$_POST['mes']:"";
			if(empty($mes)){
				echo "errorParam";
				exit();
			}
			require_once('../modelo/modelo_eventos.php');
			$evento = new Evento($db);
			$eventos = $evento->get_eventos_mes($mes);
			$lista = array();
			foreach($eventos as $fila){
				$lista[] = array("evento"=>$fila['descripcion'].' de '.substr($fila['horai'],0,5)
						  .' hrs. a '.substr($fila['horaf'],0,5).' hrs.',
						  "dia"=>substr($fila['fecha'],8,2));
			}
			echo json_encode($lista);

			break;
		default:
		echo "errorOP";
			break;
	}
}else{
	echo "errorGET";
}

?>