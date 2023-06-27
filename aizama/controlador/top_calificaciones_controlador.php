<?php 
session_start();
include_once'../includes/functions.php';
if(!cliente_activo()){
	echo json_encode(array("status"=>"eSession"));
	exit();
}
switch ($_GET['op']) {
	case 'update':
		$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
		if(empty($usr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = isset($_SESSION["app_user_bimestre"])?$_SESSION["app_user_bimestre"]:"";
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		require_once"../modelo/conexion.php";
		require_once"../modelo/modelo_cuaderno_pedagogico.php";
		require_once"../modelo/modelo_top_calificaciones.php";
		$db = Conectar::conexion();
		$CP = new CuadernoPedagogico($db);
		$TOP = new TopCalificaciones($db);
		$gestion = date("Y");
		$result = $CP->get_all(2023,1);
		$fechareg = date("Y-m-d H:i:s");
		foreach ($result as $row) {
			$notas = $row["cuaderno"]["lista_notas"];
			$codmat = $row["codmat"];
			foreach ($notas as $nota) {
				$codalu = $nota["codalu"];
				$nota_final = $nota["nota_final"];
				$existe = $TOP->get($gestion,$trimestre,$codalu,$codmat);
				if($row = $existe->fetch_object()){
					$id = $row->id;
					$TOP->update($id,$nota_final,$usr,$fechareg);
				}else{
					$TOP->save($gestion,$trimestre,$codalu,$codmat,$nota_final,$usr,$fechareg);
				}
			}

		}

		echo json_encode(["status"=>"ok"]);

		break;
	case 'get_top': //TOP GLOBAL
		$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
		if(empty($usr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = isset($_SESSION["app_user_bimestre"])?$_SESSION["app_user_bimestre"]:"";
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		require_once"../modelo/conexion.php";
		require_once"../modelo/modelo_top_calificaciones.php";
		require_once"../modelo/modelo_Alumno.php";
		require_once"../modelo/modelo_curso.php";
		require_once"../modelo/modelo_paralelo.php";
		require_once"../modelo/modelo_cur_mat.php";
		require_once"../modelo/modelo_imagen_curso.php";
		require_once"../modelo/modelo_materia.php";
		
		$db = Conectar::conexion();
		
		$TOP = new TopCalificaciones($db);
		$Alumno = new Alumno($db);
		$Curso = new Curso($db);
		$Paralelo = new Paralelo($db);
		$CM = new CurMat($db); 
		$IC = new ImagenCurso($db);
		$Materia = new Materia($db);

		$materias = $Materia->getMaterias();
		$mat = $Materia->getMaterias2();
		$result = $CM->get_all();
		$cursos_materia = [];
		while ($row = $result->fetch_object()) {
			$cursos_materia[] = [
				"codcur"=>$row->cod_cur,
				"codpar"=>$row->cod_par,
				"codmat"=>$row->cod_mat
			];
		}

		$gestion = date("Y");
		$result = $Alumno->get_all();
		$alumnos = [];
		$array = [];
		$cursos = [];
		$__cursos = $Curso->getCursosIndex();
		$__paralelos = $Paralelo->getParalelosIndex();
		while ($row = $result->fetch_object()) {
			if($row->cod_cur > 4){
				$alumnos[] = [
					"codalu"=>$row->codigo,
					"nombre"=>"$row->paterno $row->materno $row->nombres",
					"codcur"=>$row->cod_cur,
					"codpar"=>$row->cod_par,
					"nivel"=>$__cursos[$row->cod_cur]["codniv"]
				];
				if(!in_array([$row->cod_cur,$row->cod_par], $array)){
					$array[] = [$row->cod_cur,$row->cod_par];
					$cursos[] = [
						"codcur"=>$row->cod_cur,
						"codpar"=>$row->cod_par,
						"nombre"=>$__cursos[$row->cod_cur]['nombre']." - ".$__paralelos[$row->cod_par],
						"imagen"=>$IC->get_imagen($row->cod_cur,$row->cod_par)];
				}
			}
		}
		sort($cursos);
		$result = $TOP->get_top($gestion,$trimestre);

		$top = [];
		$fecha = "";
		while ($row = $result->fetch_object()) {
			$fecha = $row->fechareg;
			$top[] = [
				"codalu"=>$row->codalu,
				"codmat"=>$row->codmat,
				"nota"=>$row->nota,
				"materia"=>$materias[$row->codmat]["nombre"]
			];
		}


		echo json_encode(["status"=>"ok","top"=>$top,"fecha"=>$fecha,"alumnos"=>$alumnos,"cursos"=>$cursos,"curmat"=>$cursos_materia,"materias"=>$mat]);
		break;
	case 'get_top_doc': //Top de para los profesores
		$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
		if(empty($usr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = isset($_SESSION["app_user_bimestre"])?$_SESSION["app_user_bimestre"]:"";
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		require_once"../modelo/conexion.php";
		require_once"../modelo/modelo_profesor.php";
		require_once"../modelo/modelo_curso.php";
		require_once"../modelo/modelo_paralelo.php";
		require_once"../modelo/modelo_cur_mat.php";
		require_once"../modelo/modelo_materia.php";
		require_once"../modelo/modelo_top_calificaciones.php";
		require_once"../modelo/modelo_imagen_curso.php";
		
		$db = Conectar::conexion();

		$Curso = new Curso($db);
		$Paralelo = new Paralelo($db);
		$CM = new CurMat($db);
		$Materia = new Materia($db);
		$TC = new TopCalificaciones($db);
		$IC = new ImagenCurso($db);

		$cursos = $Curso->getCursosIndex();
		$paralelos = $Paralelo->getParalelosIndex();
		$materias = $Materia->getMaterias();

		//Cursos del profesor
		$Profesor = new Profesor($db);
		$gestion = date("Y");
		$result = $Profesor->get_cursos_prof($gestion,$usr);
		$cursos_prof = [];
		$curso_materia = [];
		$mat = [];
		$lista_materias = [];
		$top_calificaciones = [];
		$alumnos = [];
		while ($row = $result->fetch_object()) {
			$result2 = $CM->get_materias($row->codcur,$row->codpar);
			while ($row2 = $result2->fetch_object()) {
				$curso_materia[] = [
					"codcur"=>$row2->cod_cur,
					"codpar"=>$row2->cod_par,
					"codmat"=>$row2->cod_mat	
				];
				if(!in_array($row2->cod_mat, $mat)){
					$mat[] = $row2->cod_mat;
					$lista_materias[] = [
						"codmat"=>$row2->cod_mat,
						"nombre"=>$materias[$row2->cod_mat]["nombre"],
						"imagen"=>$materias[$row2->cod_mat]["imagen"]
					];
				}
			}
			$result3 = $TC->get_top_curso($gestion,$trimestre,$row->codcur,$row->codpar);
			while ($row3 = $result3->fetch_object()) {
				$top_calificaciones[] = [
					"codalu"=>$row3->codalu,
					"codmat"=>$row3->codmat,
					"nota"=>$row3->nota
				];
			}
			$alumnos_curso = $Curso->obtener_ListaAlumnos($row->codcur,$row->codpar);
			foreach ($alumnos_curso as $a) {
				$alumnos[] = [
					"codalu"=>$a["codalu"],
					"nombre"=>$a["paterno"]." ".$a["materno"]." ".$a["nombres"],
					"codcur"=>$row->codcur,
					"codpar"=>$row->codpar
				];
			}
			$cursos_prof[] = [
				"codcur"=>$row->codcur,
				"codpar"=>$row->codpar,
				"nombre"=>$cursos[$row->codcur]["nombre"]." - ".$paralelos[$row->codpar],
				"imagen"=>$IC->get_imagen($row->codcur,$row->codpar)
			];
		}

		echo json_encode(["status"=>"ok","cursos"=>$cursos_prof,"curmat"=>$curso_materia,"materias"=>$lista_materias,"top"=>$top_calificaciones,"alumnos"=>$alumnos]);
		break;
	case 'update_top_cur':
		$usr = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
		if(empty($usr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = isset($_SESSION["app_user_bimestre"])?$_SESSION["app_user_bimestre"]:"";
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		$codcur = isset($_POST["codcur"])?$_POST["codcur"]:"";
		$codpar = isset($_POST["codpar"])?$_POST["codpar"]:"";

		require_once"../modelo/conexion.php";
		$db = Conectar::conexion();

		require_once"../modelo/modelo_cuaderno_pedagogico.php";
		require_once"../modelo/modelo_top_calificaciones.php";

		$CP = new CuadernoPedagogico($db);
		$TOP = new TopCalificaciones($db);

		$gestion = date("Y");

		$result = $CP->get_cuaderno_pedagogicos_curso($gestion,$trimestre,$codcur,$codpar);

		$fechareg = date("Y-m-d H:i:s");
		foreach ($result as $row) {
			$notas = $row["cuaderno"]["lista_notas"];
			$codmat = $row["codmat"];
			foreach ($notas as $nota) {
				$codalu = $nota["codalu"];
				$nota_final = $nota["nota_final"];
				$existe = $TOP->get($gestion,$trimestre,$codalu,$codmat);
				if($row = $existe->fetch_object()){
					$id = $row->id;
					$TOP->update($id,$nota_final,$usr,$fechareg);
				}else{
					$TOP->save($gestion,$trimestre,$codalu,$codmat,$nota_final,$usr,$fechareg);
				}
			}

		}

		echo json_encode(["status"=>"ok"]);


		break;
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}
?>