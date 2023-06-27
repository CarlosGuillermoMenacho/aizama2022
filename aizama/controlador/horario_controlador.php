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
require_once"../session_verify.php";
$db = Conectar::conexion();

if(!cliente_activo()){
	echo json_encode(["status" => "eSession"]);
	exit();
}
switch ($_GET['op']) {
	case 'get_horario_tutor':
	    $codtut = $_SESSION['app_user_id'];
	    if(empty($codtut)){
	        echo "<script>location.href='../familia.php';</script>"; 
	        exit();
	    }
	    $codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
	    if(empty($codalu)){
	        echo "errorParam";
	        exit();
	    }
	    require_once'../modelo/modelo_Alumno.php';
	    $Alumno = new Alumno($db);
	    $datos = $Alumno->getDatosAlumno($codalu);
	    $codcur = $datos['codcur'];
	    $codpar = $datos['codpar'];
	    
	    require_once'../modelo/modelo_horario.php';
	    $Horario = new Horario($db);
	    $imagen = $Horario->get_horario($codcur,$codpar);
	    echo $imagen;
	    break;
	case 'get_horario_curso':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
	        echo json_encode(["status"=>"eSession"]); 
	        exit();
	    }
	    $codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";
	    $codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";

	    if (empty($codcur)||empty($codpar)) {
	    	echo json_encode(["status"=>"errorParam"]); 
	        exit();
	    }
	    $horario = [];
	    $periodos = [];
	    require_once("../modelo/modelo_horario.php");
	    require_once("../modelo/modelo_periodo.php");
	    require_once("../modelo/modelo_curso.php");
	    require_once"../modelo/modelo_profesor_horario.php";
		
		$Curso = new Curso($db);
	    $nivel = $Curso->get_nivel($codcur);

	    if($nivel == null){
	    	echo json_encode(["status"=>"errorCurso"]); 
	        exit();
	    }
	    $Horario = new Horario($db);
	    $horario = [];
	    $result = $Horario->get_horario_curso($codcur,$codpar);
	    while ($row = $result->fetch_object()) {
	    	$horario[] = $row;
	    }
	    $Periodo = new Periodo($db);
	    $periodos = [];
	    $result = $Periodo->get_periodos_nivel($nivel);
	    while ($row = $result->fetch_object()) {
	    	$periodos[] = [
	    		"periodo"=>$row->numero,
	    		"horai"=>substr($row->horai,0,5),
	    		"horaf"=>substr($row->horaf,0,5)
	    	];
	    }
	    $profesores = [];
	    $ProfHorario = new ProfesorHorario($db);
	    $result = $ProfHorario->get_profesores($codcur,$codpar);
	    while ($row = $result->fetch_object()) {
	    	$profesores[] = [
	    		"id" => $row->id,
	    		"codprof" => $row->codprof,
	    		"codclase"=>$row->codclase
	    	];
	    }

	    echo json_encode(["status"=>"ok","data"=>["horario"=>$horario,"periodos"=>$periodos,"profesores"=>$profesores]]);
		break;
	case 'asignar_horario':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";
		$codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";
		$codmat = isset($_POST["codmat"])?$_POST["codmat"]:"";
		$dia = isset($_POST["dia"])?$_POST["dia"]:"";
		$periodo = isset($_POST["periodo"])?$_POST["periodo"]:"";
		$codprof = isset($_POST["codprof"])?$_POST["codprof"]:"";
		$gestion = date("Y");
		if (empty($codcur)||empty($codpar)||empty($codmat)||empty($dia)||empty($periodo)) {
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}

		require_once"../modelo/modelo_horario.php";
		require_once"../modelo/modelo_curso.php";
		$Horario = new Horario($db);
		$codclase = $Horario->save_horario($codcur,$codpar,$codmat,$dia,$periodo);
		$Curso = new Curso($db);
		$Curso->asignar_materia($codcur,$codpar,$codmat);
		if(empty($codprof)){
			echo json_encode(["status"=>"ok","codclase"=>$codclase]);
			exit();
		}
		require_once"../modelo/modelo_profesor_horario.php";
		require_once"../modelo/modelo_prof_cur_mat.php";

		$PCM = new Prof_cur_mat($db);
		$PCM->save($codprof,$codcur,$codmat,$codpar,$gestion);
		$MPH = new ProfesorHorario($db);
		$MPH->save($codprof,$codclase,$codusr);
		echo json_encode(["status"=>"ok"]);
		break;
	case 'delete':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$id = isset($_POST["id"])?$_POST["id"]:"";
		if (empty($id)) {
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_horario.php";
		$Horario = new Horario($db);
		$Horario->delete_horario($id);
		echo json_encode(["status"=>"ok"]);
		break;
	default:
		echo "ErrorOP";
		break;
}

?>

