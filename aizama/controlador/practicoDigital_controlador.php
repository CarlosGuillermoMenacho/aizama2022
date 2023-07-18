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
	if ($_tipo_user=='tut') {
		header("Location: ../familia.php");
	}
	exit();
}
switch ($_GET['op']) {
	case 'getPracticosMesAlu':
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
		require '../modelo/modelo_practico_digital.php';
		$practico = new PracticoDigital($db);

		$lista = $practico->get_practicos_mes($codcur,$codpar,$mes,$year);
		echo json_encode($lista,JSON_UNESCAPED_UNICODE);
		break;
	case 'get_practicos_tutor'://Se obtendran la lista de practicos presentados y no presentados por materia de cada estudiante de un tutor
		$codtut = $_SESSION['app_user_id'];
		if(empty($codtut)){
		    echo '<script>location.href = "family.php";</script>';
		    exit();		
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		$gestion = date("Y");
		if(empty($codtut)){
			echo "errorParam";
			exit();
		}
		require_once '../modelo/modelo_tutor.php';
		require_once '../modelo/modelo_Alumno.php';
		require_once '../modelo/modelo_practico_digital.php';
		require_once '../modelo/modelo_materia.php';
		$tutor = new Tutor($db);
		$alumno = new Alumno($db);
		$practico = new PracticoDigital($db);
		$materia = new Materia($db);
		$arrayAlumnos = $tutor->get_alumnos($codtut);
		if (count($arrayAlumnos) == 0) {
			echo "noAlumnos";
			exit();
		}
		//echo json_encode($arrayAlumnos);exit();
		$lista_Alumnos = array();
		$arrayPracticos = array();
		foreach ($arrayAlumnos as $codigo) {
			$datoAlumno = $alumno->getDatosAlumno($codigo);
			if(!empty($datoAlumno)){
			    $lista_Alumnos[] = array("codalu"=>$codigo,"nombre"=>$datoAlumno["nombre"]); 
    			$codcur = $datoAlumno["codcur"];
    			$codpar = $datoAlumno["codpar"];
    			$arrayPracticos[] = array(
    									"codalu"=>$codigo,
    									"presentados"=>$practico->get_practicos_presentados($codigo,$trimestre,$gestion),
    									"pendientes"=>$practico->get_practicos_pendientes($codigo,$codcur,$codpar,$trimestre,$gestion),
    									"materias"=>$materia->getMateriasCurso($codcur,$codpar)
    									);
			}
			

		}
		echo json_encode(array("status"=>"ok","alumnos"=>$lista_Alumnos,"practicos"=>$arrayPracticos),JSON_UNESCAPED_UNICODE);

		break;
	case 'get_practicos_alumno':
		$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		require_once '../modelo/modelo_Alumno.php';
		require_once '../modelo/modelo_practico_digital.php';
		require_once '../modelo/modelo_materia.php';
		$alumno = new Alumno($db);
		$practico = new PracticoDigital($db);
		$materia = new Materia($db);
		$trimestre = $_SESSION['app_user_bimestre'];
		$gestion = date("Y");
		$datoAlumno = $alumno->getDatosAlumno($codusr);
		
		if(!empty($datoAlumno)){
		    $lista_Alumnos[] = array("codalu"=>$codusr,"nombre"=>$datoAlumno["nombre"]); 
    		$codcur = $datoAlumno["codcur"];
    		$codpar = $datoAlumno["codpar"];
    		$arrayPracticos[] = array(
    								"codalu"=>$codusr,
    								"presentados"=>$practico->get_practicos_presentados($codusr,$trimestre,$gestion),
    								"pendientes"=>$practico->get_practicos_pendientes($codusr,$codcur,$codpar,$trimestre,$gestion),
    								"materias"=>$materia->getMateriasCurso($codcur,$codpar)
    								);
		}		
		echo json_encode(array("status"=>"ok","alumnos"=>$lista_Alumnos,"practicos"=>$arrayPracticos),JSON_UNESCAPED_UNICODE);
		
		break;
	default:
		echo "errorGET";
		break;
}
?>