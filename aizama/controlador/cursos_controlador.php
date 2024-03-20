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
	case 'get_cursos_a':
		$codusr = $_SESSION['app_user_id'];
		if(empty($codusr)){
			echo json_encode(array("status"=>"eSession"));	
			exit();			
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		require_once'../modelo/modelo_curso.php';
		require_once'../modelo/modelo_paralelo.php';
		$Curso = new Curso($db);
		$Paralelo = new Paralelo($db);
		$cursos = $Curso->getCursosIndex();
		$paralelos = $Paralelo->getParalelosIndex();
		$result = $Curso->get_cursos_alu();
		$__cursos = [];
		while ($row = $result->fetch_object()) {
			$imagen = $Curso->get_imagen($row->cod_cur,$row->cod_par);
			$__cursos[] = [
				"codcur"=>$row->cod_cur,
				"codpar"=>$row->cod_par,
				"curso"=>$cursos[$row->cod_cur]["nombre"]." - ".$paralelos[$row->cod_par],
				"imagen"=>$imagen
			];
		}
		echo json_encode(["status"=>"ok","cursos"=>$__cursos]);
		break;
	case 'get_materias_curso':
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
		require_once'../modelo/modelo_materia.php';
		$db = Conectar::conexion();
		$materia = new Materia($db);	
		$materias = $materia->getMateriasCurso($codcur,$codpar);
		echo json_encode(["status"=>"ok","materias"=>$materias]);	
		break;
	case 'get_materias_curso_adm':
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
		require_once'../modelo/modelo_curso.php';
		require_once'../modelo/modelo_materia.php';
		require_once '../modelo/modelo_Evaluacion.php';
		require_once '../modelo/modelo_material_de_apoyo.php';
		require_once '../modelo/modelo_practico.php';
		require_once'../modelo/modelo_practico_digital.php';
		$db = Conectar::conexion();
		$Curso = new Curso($db);
		$Practico = new Practico($db);
		$Material = new Material($db);
		$Evaluacion = new Evaluacion_Seleccion($db);
		$Materia = new Materia($db);
		$mat = $Materia->getMaterias();	
		$Practico = new Practico($db);
		$result = $Curso->get_materias($codcur,$codpar);
		$materias = [];
		$gestion = date("Y");	
		while ($row = $result->fetch_object()) {
			$result_prof = $Curso->get_profesor($gestion,$codcur,$codpar,$row->cod_mat);
			$codprof = "";
			$profesor = "";
			$cel = "";
			if($row_p = $result_prof->fetch_object()){
				$codprof = $row_p->CODPROF;
				$profesor = $row_p->nombre;
				$cel = $row_p->CELPRO;
			}
			$evaluaciones = $Evaluacion->get_evaluaciones_count($gestion,$codcur,$codpar,$row->cod_mat);
			$practicos = $Practico->get_practicos_count($gestion,$codcur,$codpar,$row->cod_mat);
			$material = $Material->get_material_count($gestion,$codcur,$codpar,$row->cod_mat);
			$materias[] = [
				"codmat"=>$row->cod_mat,
				"nombre"=>$mat[$row->cod_mat]["nombre"],
				"evaluaciones"=>$evaluaciones,
				"practicos"=>$practicos,
				"material"=>$material,
				"codprof"=>$codprof,
				"profesor"=>$profesor,
				"celular"=>$cel
			];
		}
		echo json_encode(["status"=>"ok","materias"=>$materias]);
		break;
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}
?>