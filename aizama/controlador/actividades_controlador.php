<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
$_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
if (empty($_tipo_user)){
	echo "errorGET";
	exit();
}
if(!cliente_activo()){
	if ($_tipo_user=='doc') {
		header("location: ../docentes.php");
	}
	if ($_tipo_user=='alu') {
		header("location: ../usuario.php");
	}
	if ($_tipo_user=='adm') {
		header("location: ../administracion.php");
	}
	exit();
}
switch ($_GET['op']) {
	case 'getAct_alu':
		$mes = isset($_POST['mes'])?$_POST['mes']:"";
		if(empty($mes)){
			echo "errorParam";
			exit();
		}	
		$year = date("Y");
		$mes = $mes>9?$mes:"0".$mes;
		$codalu = $_SESSION['app_user_id'];
		require_once('../modelo/modelo_Alumno.php');
		require_once('../modelo/modelo_actividad_curso.php');
		require_once('../modelo/modelo_materia.php');
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		$alumno = new Alumno($db);
		$materia = new Materia($db);
		$materias = $materia->getMaterias();

		$datosAlumno = $alumno->getDatosAlumno($codalu);
		$codcur = $datosAlumno['codcur'];
		$codpar = $datosAlumno['codpar'];

		$actividad = new Actividad_curso($db);
		$actividades = $actividad->getActividadesMes($codcur,$codpar,$mes,$year);

		$lista = array();

		foreach($actividades as $fila){
			$lista[] = array(
							"dia"=>substr($fila['fecha'], 5,2),
							"evento"=>$materias[$fila['codmat']]['nombre']." - ".$fila['descripcion']." desde las ".substr($fila['horai'], 0,5)." hrs. hasta las ".substr($fila['horaf'],0,5)." hrs."
							);
		}
		echo json_encode(array("status"=>"ok","lista"=>$lista));
		break;
	default:
	echo "errorOP";
	break;
}
?>