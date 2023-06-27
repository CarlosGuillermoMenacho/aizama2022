<?php 
session_start();
include_once'../includes/functions.php';
if(!cliente_activo()){
	echo json_encode(array("status"=>"eSession"));
	exit();
}
switch ($_GET['op']) {
	case 'save':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$id = isset($_POST['id'])?$_POST['id']:"";
		$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
		$periodo = isset($_POST['periodo'])?$_POST['periodo']:"";
		$actividad = isset($_POST['actividad'])?$_POST['actividad']:"";
		$act_complementaria = isset($_POST['act_complementaria'])?$_POST['act_complementaria']:"";
		$recursos = isset($_POST['recursos'])?$_POST['recursos']:"";

		if(empty($fecha)||empty($codcur)||empty($codpar)||
		   empty($codmat)||empty($periodo)||empty($actividad)||
		   empty($recursos)){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}

		require_once'../modelo/modelo_planificacion.php';
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_prof_cur_mat.php';
		$db = Conectar::conexion();
		$PCM = new Prof_cur_mat($db);
		$gestion = date("Y");
		if(!$PCM->es_profesor($codusr,$codcur,$codmat,$codpar,$gestion)){
			echo json_encode(array("status"=>"noPermitido"));
		}
		$Planificacion = new Planificacion($db);
		$fechareg = date("Y-m-d H:i:s");
		if(!empty($id))$Planificacion->delete($id);
		$periodos_fecha = $Planificacion->get_periodos($fecha,$codcur,$codpar,$codusr,$gestion);
		$listaPeriodos = [];
		while ($fetch = $periodos_fecha->fetch_object()){
			$obj = json_decode($fetch->periodo);
			foreach ($obj as $p) {
				$listaPeriodos[] = $p;
			}
		}
		$obj = json_decode($periodo);
		
		for ($i=0; $i < count($obj) ; $i++) { 
			for ($j=0; $j < count($listaPeriodos) ; $j++) { 
				if($obj[$i]==$listaPeriodos[$j]){
					if(!empty($id))$Planificacion->restore($id);
					echo json_encode(array("status"=>"errorPeriodo"));
					exit();
				}
			}
		}

		$result = $Planificacion->save($fecha,$codcur,$codpar,$periodo,$codmat,$actividad,$act_complementaria,$recursos,$fechareg,$codusr);
		echo json_encode(array("status"=>"ok"));
		break;

	case 'delete':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$id = isset($_POST['id'])?$_POST['id']:"";
		if(empty($id)){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}
		require_once'../modelo/modelo_planificacion.php';
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_prof_cur_mat.php';
		$db = Conectar::conexion();
		$PCM = new Prof_cur_mat($db);
		$Planificacion = new Planificacion($db);
		$result = $Planificacion->get_planificacion($id);
		if($fetch = $result->fetch_object()){
			$codcur = $fetch->codcur;
			$codpar = $fetch->codpar;
			$codmat = $fetch->codmat;
			$gestion = date("Y");
			if(!$PCM->es_profesor($codusr,$codcur,$codmat,$codpar,$gestion)){
				echo json_encode(array("status"=>"noPermitido"));
			}
			$result = $Planificacion->delete($id);
			echo json_encode(array("status"=>"ok"));
		}else{
			echo json_encode(array("status"=>"noPermitido"));	
		}
		break;
	case 'get_planificacion_adm':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		if(empty($codcur)||empty($codpar)){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}
		require_once'../modelo/modelo_planificacion.php';
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_materia.php';
		include'funciones.php';
		$db = Conectar::conexion();
		$gestion = date("Y");

		$Planificacion = new Planificacion($db);
		$Materia = new Materia($db);
		$nombre_materias = $Materia->getMaterias();
		$result = $Planificacion->get_planificacion_curso($codcur,$codpar,$gestion);
		$response = array();
		while ($fetch = $result->fetch_object()) {
			$response[] = array(
								"id" => $fetch->id,
								"fecha" => $fetch->fecha,
								"dia" => getdialiteral($fetch->fecha),
								"periodo" => $fetch->periodo,
								"materia" => $nombre_materias[$fetch->codmat]['nombre'],
								"actividad" => $fetch->actividad,
								"actividad_complementaria"=>$fetch->actividad_complementaria,
								"recursos" => $fetch->recursos,
								"fechareg"=>$fetch->fechareg
							   );
		}
		if(!empty($response)){
			echo json_encode(array("status"=>"ok","datos"=>$response));
		}else{
			echo json_encode(array("status"=>"noData"));
		}
		break;
		case 'get_planificacion':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		if(empty($codcur)||empty($codpar)){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}
		require_once'../modelo/modelo_planificacion.php';
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_prof_cur_mat.php';
		require_once'../modelo/modelo_materia.php';
		include'funciones.php';
		$db = Conectar::conexion();
		$PCM = new Prof_cur_mat($db);
		$gestion = date("Y");
		$materias = $PCM->get_materias($codusr,$codcur,$codpar,$gestion);
		if(empty($materias)){
			echo json_encode(array("status"=>"noMaterias"));	
			exit();
		}
		$Planificacion = new Planificacion($db);
		$Materia = new Materia($db);
		$nombre_materias = $Materia->getMaterias();
		$result = $Planificacion->get_planificacion_curso_materia($codcur,$codpar,$materias);
		$response = array();
		while ($fetch = $result->fetch_object()) {
			$response[] = array(
								"id" => $fetch->id,
								"fecha" => $fetch->fecha,
								"dia" => getdialiteral($fetch->fecha),
								"periodo" => $fetch->periodo,
								"materia" => $nombre_materias[$fetch->codmat]['nombre'],
								"actividad" => $fetch->actividad,
								"actividad_complementaria"=>$fetch->actividad_complementaria,
								"recursos" => $fetch->recursos
							   );
		}
		if(!empty($response)){
			echo json_encode(array("status"=>"ok","datos"=>$response));
		}else{
			echo json_encode(array("status"=>"noData"));
		}
		break;
	case 'get_planificacion_fecha':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
		if(empty($codcur)||empty($codpar||empty($fecha))){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}
		require_once'../modelo/modelo_planificacion.php';
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_materia.php';
		include'funciones.php';
		$db = Conectar::conexion();
		$Planificacion = new Planificacion($db);
		$Materia = new Materia($db);
		$nombre_materias = $Materia->getMaterias();
		$result = $Planificacion->get_planificacion_fecha($fecha,$codcur,$codpar);
		$response = array();
		while ($fetch = $result->fetch_object()) {
			$response[] = array(
								"id" => $fetch->id,
								"fecha" => $fetch->fecha,
								"dia" => getdialiteral($fetch->fecha),
								"periodo" => $fetch->periodo,
								"materia" => $nombre_materias[$fetch->codmat]['nombre'],
								"actividad" => $fetch->actividad,
								"actividad_complementaria"=>$fetch->actividad_complementaria,
								"recursos" => $fetch->recursos
							   );
		}
		if(!empty($response)){
			echo json_encode(array("status"=>"ok","datos"=>$response));
		}else{
			echo json_encode(array("status"=>"noData"));
		}
		break;
	case 'get_planificacion_prof':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		require_once'../modelo/modelo_planificacion.php';
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_materia.php';
		require_once'../modelo/modelo_curso.php';
		require_once'../modelo/modelo_paralelo.php';

		include'funciones.php';
		$db = Conectar::conexion();
		$Planificacion = new Planificacion($db);
		$Curso = new Curso($db);
		$cursos = $Curso->getCursosIndex();
		$Paralelo = new Paralelo($db);
		$paralelos = $Paralelo->getParalelosIndex();
		$Materia = new Materia($db);
		$nombre_materias = $Materia->getMaterias();
		$gestion = date("Y");
		$result = $Planificacion->get_planificaciones_prof($gestion,$codusr);
		$response = array();
		while ($fetch = $result->fetch_object()) {
			$response[] = array(
								"id" => $fetch->id,
								"fecha" => $fetch->fecha,
								"dia" => getdialiteral($fetch->fecha),
								"periodo" => $fetch->periodo,
								"materia" => $nombre_materias[$fetch->codmat]['nombre'],
								"actividad" => $fetch->actividad,
								"actividad_complementaria"=>$fetch->actividad_complementaria,
								"recursos" => $fetch->recursos,
								"curso" => $cursos[$fetch->codcur]['nombre']." - ".$paralelos[$fetch->codpar],
								"codcur"=>$fetch->codcur,
								"codpar"=>$fetch->codpar,
								"codmat"=>$fetch->codmat
							   );
		}
		if(!empty($response)){
			echo json_encode(array("status"=>"ok","datos"=>$response));
		}else{
			echo json_encode(array("status"=>"noData"));
		}
		break;	
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}
?>