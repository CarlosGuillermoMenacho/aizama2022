<?php 
session_start();
include_once'../includes/functions.php';
if(!cliente_activo()){
	echo json_encode(array("status"=>"eSession"));
	exit();
}
switch ($_GET['op']) {
	case 'get_cursos':
		require_once'../modelo/conexion.php';
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$db = Conectar::conexion();
		require_once'../modelo/modelo_curso.php';
		$Curso = new Curso($db);
		$curso_result = $Curso->get_cursos();
		$lista_cursos = [];
		while ($fetch = $curso_result->fetch_object()) {
			$lista_cursos[] = $fetch;
		}
		require_once'../modelo/modelo_paralelo.php';
		$Paralelo = new Paralelo($db);
		$par_result = $Paralelo->get_paralelos();
		$lista_paralelos = [];
		while ($fetch = $par_result->fetch_object()) {
			$lista_paralelos[] = $fetch;
		}
		if(!empty($lista_cursos)&&!empty($lista_paralelos)){
			echo json_encode(array("status"=>"ok","cursos"=>$lista_cursos,"paralelos"=>$lista_paralelos));
		}else{
			echo json_encode(array("status"=>"noData"));
		}
		break;
	case 'get_lista':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";
		$codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";

		if(empty($codcur) || empty($codpar)){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		require_once'../modelo/modelo_curso.php';
		$Curso = new Curso($db);
		$lista = $Curso->getListaAlumnos($codcur,$codpar);
		echo json_encode(["status"=>"ok","data"=>$lista]);
		break;
	case 'quitar_de_lista':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();
					
		}
		$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";

		if(empty($codalu)){
			echo json_encode(array("status"=>"errorParam"));	
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		require_once'../modelo/modelo_curso.php';
		$Curso = new Curso($db);
		$Curso->quitar_de_lista($codalu);
		echo json_encode(["status"=>"ok"]);
		break;
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}
?>