<?php 
session_start();
include_once'../includes/functions.php';
if(!cliente_activo()){
	echo json_encode(array("status"=>"eSession"));
	exit();
}
switch ($_GET['op']) {
	case 'get_agenda':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();					
		}
		$codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
		if(empty($codalu)){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}

		require_once'../modelo/modelo_agenda.php';
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_materia.php';
		require_once'../modelo/modelo_profesor.php';
		$db = Conectar::conexion();
		$Agenda = new Agenda($db);
		$Materia = new Materia($db);
		$Profesor = new Profesor($db);
		$materias = $Materia->getMaterias();
		$profesores = $Profesor->get_profesores_index();
		$result = $Agenda->get_mensages_alu($codalu);
		$response = [];

		while ($row = $result->fetch_object()) {
			$tipo = $row->tipo;
			if($tipo == 1){
				$emisor = isset($profesores[$row->codusr])?$profesores[$row->codusr]->APEPRO." ".$profesores[$row->codusr]->NOMPRO:$row->codusr;
				$asignatura = isset($materias[$row->emisor])?$materias[$row->emisor]["nombre"]:$row->emisor;
				$response[] = [
					"emisor"=>$emisor,
					"asignatura"=>$asignatura,
					"hora"=>$row->hora,
					"mensaje"=>$row->mensaje,
					"fecha"=>$row->fecha
				];				
			}
		}
		echo json_encode(["status"=>"ok","data"=>$response]);
		break;


	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}
?>