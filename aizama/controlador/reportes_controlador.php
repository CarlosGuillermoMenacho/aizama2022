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

if(!cliente_activo()){
	echo json_encode(["status"=>"eSession"]);
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
	case 'resumen':
		$user = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
		if(empty($user)){
			echo "eSession";
			exit();
		}
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if(empty($codcur) || empty($codpar)){
			echo "errorParam";
			exit();
		}
		require_once '../modelo/modelo_Evaluacion.php';
		require_once '../modelo/modelo_material_de_apoyo.php';
		require_once '../modelo/modelo_practico.php';
		require_once '../modelo/modelo_cur_mat.php';
		require_once"../modelo/modelo_materia.php";
		$Practico = new Practico($db);
		$Material = new Material($db);
		$Materia = new Materia($db);
		$materias = $Materia->getMaterias();
		$CM = new CurMat($db);
		$Evaluacion = new Evaluacion_Seleccion($db);
		$gestion = date("Y");
		$result = $Evaluacion->get_evaluaciones_gestion($gestion,$codcur,$codpar);
		$evaluaciones = [];
		while ($row = $result->fetch_object()) {
			$evaluaciones[] = $row;
		}
		$result = $Practico->get_practicos_gestion($gestion,$codcur,$codpar);
		$practicos = [];
		while ($row = $result->fetch_object()) {
			$practicos[] = $row;
		}
		$result = $Material->get_material_gestion($gestion,$codcur,$codpar);
		$materiales = [];
		while ($row = $result->fetch_object()) {
			$materiales[] = [
				"id"=>$row->id,
				"trimestre"=>$row->trimestre,
				"titulo"=>$row->titulo,
				"descripcion"=>$row->descripcion,
				"material"=>$row->archivo,
				"enlace"=>$row->enlace_o_archivo,
				"tipo"=>$row->tipo_material,
				"fecha"=>$row->fecha,
				"codmat"=>$row->codmat
			];
		}
		$result = $CM->get_materias($codcur,$codpar);
		$lista_materias = [];
		while ($row = $result->fetch_object()) {
			$lista_materias[] = [
				"codmat"=>$row->cod_mat,
				"materia"=>$materias[$row->cod_mat]['nombre']
			];
		}
		echo json_encode(["status"=>"ok","data"=>["evaluaciones"=>$evaluaciones,"materias"=>$lista_materias,"practicos"=>$practicos,"materiales"=>$materiales]]);
		break;

}

?>