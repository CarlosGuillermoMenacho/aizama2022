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
	case 'get_cursos':
		$codprof = $_SESSION['app_user_id'];
		$gestion = date("Y");
		if (empty($codprof)) {
			header("Location: ../docentes.php");
			exit();
		}
		require_once('../modelo/modelo_profesor.php');
		require_once('../modelo/modelo_materia.php');
		require_once('../modelo/modelo_curso.php');
		require_once('../modelo/modelo_paralelo.php');
		$profesor = new Profesor($db);
		$materia = new Materia($db);
		$curso = new Curso($db);
		$paralelo = new Paralelo($db);

		$materias = $materia->getMaterias();
		$cursos = $curso->getCursosIndex();
		$lista = $profesor->get_prof_cur_mat($codprof,$gestion);
		$paralelos = $paralelo->getParalelosIndex();
		$listaCursos = array();
		$listaCursosMaterias = array();

		foreach($lista as $fila){
			if(!pertnece($fila,$listaCursos)){
				$listaCursos[] = array(	
										"codcur"=>$fila['codcur'],
										"codpar"=>$fila['codpar'],
										"nombre"=>$cursos[$fila['codcur']]['nombre'].' - '.$paralelos[$fila['codpar']],
										"imagen"=>$curso->get_imagen($fila['codcur'],$fila['codpar']),
										"materias"=>contar_Materias($fila['codcur'],$fila['codpar'],$lista)
										);
			}
			$listaCursosMaterias[] = array(
											"codcur"=>$fila['codcur'],
											"codpar"=>$fila['codpar'],
											"codmat"=>$fila['codmat'],
											"nombre"=>$materias[$fila['codmat']]['nombre'],
											"imagen"=>$materias[$fila['codmat']]["imagen"]
											);
		}
		echo json_encode(array("cursos"=>$listaCursos,"materias"=>$listaCursosMaterias));
		break;
	case 'get_materias':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		
		if(empty($codcur)||empty($codpar)){
			echo "errorParam";
			exit();
		}
		$codprof = $_SESSION['app_user_id'];
		$gestion = date("Y");

		require_once('../modelo/modelo_prof_cur_mat.php');
		require_once('../modelo/modelo_materia.php');
		require_once('../modelo/modelo_actividad_curso.php');
		$profcurmat = new Prof_cur_mat($db);
		$materia = new Materia($db);
		$actividad = new Actividad_curso($db);
		$lista = $profcurmat->get_materias($codprof,$codcur,$codpar,$gestion);
		$materias = $materia->getMaterias();
		$actividades = $actividad->contActividades($codcur,$codpar,$gestion);
		$respuesta = array();
		foreach ($lista as $mat) {
			$nombreMateria = $materias[$mat]['nombre'];
			$nActi = getActividades($mat,$actividades);
			$respuesta[] = array(
								"codmat"=>$mat,
								"nombre"=>$nombreMateria,
								"actividades"=>$nActi
								);
		}
		echo json_encode(array("status"=>"ok","lista"=>$respuesta));

		break;
	case 'get_actividades':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
		
		if(empty($codcur)||empty($codpar)||empty($codmat)){
			echo "errorParam";
			exit();
		}
		$gestion = date("Y");

		require_once('../modelo/modelo_actividad_curso.php');
		$actividad = new Actividad_curso($db);
		$actividades = $actividad->getActividadesMateria($codcur,$codpar,$codmat,$gestion);
		$respuesta = array();
		foreach ($actividades as $fila) {
			$respuesta[]=array(
							"id"=>$fila['id'],
							"descripcion"=>$fila['descripcion'],
							"fecha"=>$fila['fecha'],
							"horai"=>substr($fila['horai'],0,5),
							"horaf"=>substr($fila['horaf'],0,5)
								);
		}
		echo json_encode(array("status"=>"ok","lista"=>$respuesta));
		break;
	case 'save_actividad':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";

		$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
		$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
		$horai = isset($_POST['horai'])?$_POST['horai']:"";
		$horaf = isset($_POST['horaf'])?$_POST['horaf']:"";
		if(empty($codcur)||empty($codpar)||empty($codmat)||
		   empty($fecha)||empty($horai)||empty($horaf)){
			echo "errorParam";
			exit();
		}
		$gestion = date("Y");
		$codprof = $_SESSION['app_user_id'];
		$fechareg = date("Y-m-d H:i:s");
		require_once('../modelo/modelo_actividad_curso.php');
		$actividad = new Actividad_curso($db);
		if($actividad->save_actividad($gestion,$codcur,$codpar,$codmat,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg)){
			echo "ok";
			exit();
		}
		echo "error";
		break;
	case 'update_actividad':
		$id = isset($_POST['id'])?$_POST['id']:"";

		$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
		$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
		$horai = isset($_POST['horai'])?$_POST['horai']:"";
		$horaf = isset($_POST['horaf'])?$_POST['horaf']:"";
		if(empty($id)||empty($fecha)||empty($horai)||empty($horaf)){
			echo "errorParam";
			exit();
		}
		$gestion = date("Y");
		$codprof = $_SESSION['app_user_id'];
		$fechareg = date("Y-m-d H:i:s");

		require_once('../modelo/modelo_actividad_curso.php');
		$actividad = new Actividad_curso($db);
		if($actividad->update_actividad($id,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg)){
			echo "ok";
			exit();
		}
		echo "error";
		break;
	case 'delete_actividad':
		$id = isset($_POST['id'])?$_POST['id']:"";
		if(empty($id)){
			echo "errorParam";
			exit();
		}
		require_once('../modelo/modelo_actividad_curso.php');
		$actividad = new Actividad_curso($db);
		if($actividad->delete_actividad($id)){
			echo "ok";
			exit();
		}
		echo "error";
		break;
	case 'get_datos':

		$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
		if (empty($codusr)) {
			echo json_encode(array('status' => "eSession"));
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		require_once'../modelo/modelo_profesor.php';
		$Profesor = new Profesor($db);
		$result = $Profesor->get_profesor($codusr);
		if($fetch = $result->fetch_object()){
			echo json_encode(["status" => "ok","data" => $fetch]);
		}else{
			echo json_encode(["status" => "noData"]);
		}
		break;
	case 'gap':
		$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
		if (empty($codusr)) {
			echo json_encode(array('status' => "eSession"));
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		require_once'../modelo/modelo_profesor.php';
		$Profesor = new Profesor($db);
		$result = $Profesor->get_profesores();
		$lista = [];
		while ($fetch = $result->fetch_object()) {
			$lista[] = $fetch;
		}
		if(empty($lista)){
			echo json_encode(["status"=>"noData"]);
			exit;
		}
		echo json_encode(["status"=>"ok","data"=>$lista]);
		break;
}
function getActividades($codmat,$acti){
	for ($i=0; $i < count($acti); $i++) { 
		if($acti[$i]['codmat']==$codmat){
			return $acti[$i]['actividades'];
		}
	}
	return 0;
}
function pertnece($curso,$lista){
	for ($i=0; $i < count($lista)  ; $i++) { 
		if($lista[$i]['codcur']==$curso['codcur']&&
		   $lista[$i]['codpar']==$curso['codpar'])
			return true;
	}
	return false;
}
function contar_Materias($codcur,$codpar,$lista){
	$n = 0;
	foreach ($lista as $fila) {
		if($fila['codcur']==$codcur&&$fila['codpar']==$codpar)$n++;
	}
	return $n;
}
?>