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
	echo json_encode(["status"=>"eSession"]);
	exit();
}
switch ($_GET['op']) {
	case 'getMateriasProf'://Se obtendrá la lista de materias que tiene el profesor en un curso y la cantidad de evaluaciones por materia
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if(empty($codcur) || empty($codpar)){
			echo "errorParam";
			exit();
		}

		$codprof = $_SESSION['app_user_id'];
		$trimestre = $_SESSION['app_user_bimestre'];
		$gestion = date("Y");

		require '../modelo/modelo_evaluacion_mixta.php';
		require '../modelo/modelo_materia.php';

		$eval = new Evaluacion_mixta($db);
		$mat = new Materia($db);
		
		$listaEvaluaciones = $eval->contarEvaluaciones($codprof,$codcur,$codpar,$trimestre,$gestion);
		$listaMaterias = $mat->getMateriasProf($codprof,$codcur,$codpar,$gestion);

		$result = array();
		foreach ($listaMaterias as $materia) {
			$result[] = array(
							"codmat" => $materia['codmat'],
							"nombre" => $materia['nombre'],
							"imagen" => $materia['imagen'],
							"evaluaciones"=>obtenerEvaluaciones($listaEvaluaciones,$materia['codmat'])
							);
		}
		echo json_encode(array("status"=>"ok","lista"=>$result));
		break;
	case 'get_materias_nivel':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";

		if(empty($codcur)){
			echo "errorParam";
			exit();
		}
		require_once"../modelo/modelo_curso.php";
		require_once"../modelo/modelo_materia.php";
		$Curso = new Curso($db);
		$nivel = $Curso->get_nivel($codcur);
		$Materia = new Materia($db);
		$result = $Materia->getMateriasNivel($nivel);
		$materias = [];
		while ($row = $result->fetch_object()) {
			$materias[] = [
				"codmat" => $row->CODMAT,
				"nombre" => $row->DESCRI
			];
		}
		echo json_encode(["status" => "ok","data"=>$materias]);
		break;
	case 'get_materias':
		require_once"../modelo/modelo_materia.php";
		$Materia = new Materia($db);
		$result = $Materia->getMaterias2();
		
		echo json_encode(["status" => "ok","data"=>$result]);
		break;
	default:
		echo "ErrorOP";
		break;
}
function obtenerEvaluaciones($listaEvaluaciones,$codmat){
	for ($i=0; $i < count($listaEvaluaciones) ; $i++) { 
		if($listaEvaluaciones[$i]['codmat']==$codmat){
			return $listaEvaluaciones[$i]['evaluaciones'];
		}
	}
	return 0;
}

?>

