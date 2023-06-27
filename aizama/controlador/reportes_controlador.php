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
if (!$_GET) {
	echo "errorGET";
	exit();
}
switch ($_GET['op']) {
	case 'reporte_1':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if(empty($codcur) || empty($codpar)){
			echo "errorParam";
			exit();
		}

		require_once '../modelo/modelo_curso.php';
		require_once '../modelo/modelo_Alumno.php';
		require_once '../modelo/modelo_paralelo.php';
		$curso = new Curso($db);
		$paralelo = new Paralelo($db);
		$nombre_curso = $curso->getNombreCurso($codcur);
		$nombre_paralelo = $paralelo->getNombreParalelo($codpar);
		$fecha = date("d-m-Y");
		$lista_alumnos = $curso->getListaAlumnos($codcur,$codpar);
		$res = array();
		$Alumno = new Alumno($db);
		foreach ($lista_alumnos as $alumno) {
			$codalu = $alumno['codigo'];
			$lista_tutores = $Alumno->get_tutores($codalu);
			$alumno_datos = array(
								"codigo"=>$codalu,
								"login"=>$alumno['codalu'],
								"nombre"=>$alumno['paterno'].' '.$alumno['materno'].' '.$alumno['nombres'],
								"celular"=>$alumno['cel'],
								"nac" => substr($alumno['codalu'],4,10)?substr($alumno['codalu'],4,10):""
								);
			$datos_tutores = array();
			foreach ($lista_tutores as $tutor) {
				$datos_tutores[] = array(
										"nombre"=>$tutor['paterno'].' '.$tutor['materno'].' '.$tutor['nombres'],
										"celular"=>$tutor['celular']
										);
			}
			$res[] = array("alumno" => $alumno_datos,"tutores"=>$datos_tutores);
		}
		if (count($res) == 0) {
			echo json_encode(array("status"=>"noData"));
			exit();
		}
		echo json_encode(array("status"=>"ok","lista"=>$res,"curso"=>$nombre_curso,"paralelo"=>$nombre_paralelo,"fecha"=>$fecha));
		break;

}

?>