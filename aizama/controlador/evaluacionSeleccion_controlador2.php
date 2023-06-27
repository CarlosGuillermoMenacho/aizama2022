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
switch ($_GET['op']) {
	case 'getEvalaucionesSeleccionMes':
		$mes = isset($_POST['mes'])?$_POST['mes']:"";
		if(empty($mes)){
			echo "errorParam";
			exit();
		}	
		$year = date("Y");
		$codalu = $_SESSION['app_user_id'];
		require '../modelo/modelo_Alumno.php';
		$alumno = new Alumno($db);
		$datosAlumno = $alumno->getDatosAlumno($codalu);
		$codcur = $datosAlumno['codcur'];
		$codpar = $datosAlumno['codpar'];
		require '../modelo/modelo_Evaluacion.php';
		$evaluaciones = new Evaluacion_Seleccion($db);

		$lista = $evaluaciones->getEvaluacionesMes($year,$mes,$codcur,$codpar);
		echo json_encode($lista);
		break;
	case 'eval_family'://Se obtienen todas las evaluaciones realizadas y pendientes de los estudiantes de un tutor
		$codtut = $_SESSION['app_user_id'];
		$trimestre = $_SESSION['app_user_bimestre'];
		$gestion = date("Y");
		if(empty($codtut)){
			echo json_encode(array("status"=>"eSession"));
			exit();
		}
		require_once '../modelo/modelo_tutor.php';
		require_once '../modelo/modelo_Alumno.php';
		require_once '../modelo/modelo_materia.php';
		require_once '../modelo/modelo_Evaluacion2.php';
		$tutor = new Tutor($db);
		$alumno = new Alumno($db);
		$materia = new Materia($db);
		$practico = new Evaluacion_Seleccion($db);
		$arrayAlumnos = $tutor->get_alumnos($codtut);
		if (count($arrayAlumnos) == 0) {
			echo "noAlumnos";
			exit();
		}

		$lista_Alumnos = array();
		$arrayEvaluaciones = array();
		foreach ($arrayAlumnos as $codigo) {
			$datoAlumno = $alumno->getDatosAlumno($codigo);
			if(!empty($datoAlumno)){
				$lista_Alumnos[] = array("codalu"=>$codigo,"nombre"=>$datoAlumno["nombre"]); 
				$codcur = $datoAlumno["codcur"];
				$codpar = $datoAlumno["codpar"];
				$arrayEvaluaciones[] = array(
										"codalu"=>$codigo,
										"realizados"=>$practico->get_evaluaciones_realizadas($codigo,$trimestre,$gestion),
										"pendientes"=>$practico->get_evaluaciones_pendientes($codigo,$codcur,$codpar,$trimestre,$gestion),
										"materias"=>$materia->getMateriasCurso($codcur,$codpar)
										);
			}

		}
		echo json_encode(array("status"=>"ok","alumnos"=>$lista_Alumnos,"practicos"=>$arrayEvaluaciones),JSON_UNESCAPED_UNICODE);
		break;
	default:
		echo "errorGET";
		break;
}
?>