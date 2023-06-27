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
	exit();
}

switch ($_GET['op']) {
	case 'crearEvaluacion'://Se crea una nueva evaluación con datos vacíos
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";

		if(empty($codcur)||empty($codpar)||empty($codmat)){
			echo "errorParam";
			exit();
		}
		$gestion = date("Y");
		$fechaReg = date("Y-m-d H:i:s");
		$trimestre = $_SESSION['app_user_bimestre'];
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if($evaluacion->crear_evaluacion($gestion, $trimestre, $codcur, $codpar, $codmat, $codprof, $fechaReg)){
			echo "ok";
		}else{
			echo "error";
		}
		break;

	case 'save_evaluacion_mixta':
		$descripcion = isset($_POST['descripcion'])?($_POST['descripcion']):"";
		$fechaini = isset($_POST['fechaini'])?$_POST['fechaini']:"";
		$horaini = isset($_POST['horaini'])?$_POST['horaini']:"";
		$fechafin = isset($_POST['fechafin'])?$_POST['fechafin']:"";
		$horafin = isset($_POST['horafin'])?$_POST['horafin']:"";
		$nota = isset($_POST['nota'])?$_POST['nota']:"";
		$tiempo = isset($_POST['tiempo'])?$_POST['tiempo']:"";
		$preguntas = isset($_POST['preguntas'])?$_POST['preguntas']:"";
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
		$visible = isset($_POST['visible'])?$_POST['visible']:"";
		if ( empty($descripcion)||empty($fechaini)||empty($horaini)||
			empty($fechafin)||empty($horafin)||empty($nota)||empty($tiempo)||
			empty($preguntas)||empty($codcur)||empty($codpar)||empty($codmat)){
			echo "errorParam";
			exit();	
		}
		if (empty($visible)){
			$visible=0;
		}
		$fechaReg = date("Y-m-d H:i:s");
		$inicio= $fechaini." ".$horaini;
		$fin= $fechafin." ".$horafin;
		if(strtotime($fechaReg) > strtotime($inicio)){
			echo "errorHora";
			exit();
		}
		if(strtotime($fin)<strtotime($inicio)){
			echo "errorTime";
			exit();
		}
		if($nota>100){
			echo "errorNota";
			exit();
		}
		$gestion = date("Y");
		$trimestre = $_SESSION['app_user_bimestre'];
		$codProf = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if($evaluacion->save_evaluacion_mixta($gestion, $trimestre, $codcur, $codpar, $codmat, $inicio, $fin, $nota, $preguntas,$descripcion,$tiempo, $fechaReg, $codProf)){
			echo "ok";
			exit();
		}
			echo "error";
		break;

	case 'update_evaluacion_mixta':
		$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";
		$fechaini = isset($_POST['fechaini'])?$_POST['fechaini']:"";
		$horaini = isset($_POST['horaini'])?$_POST['horaini']:"";
		$fechafin = isset($_POST['fechafin'])?$_POST['fechafin']:"";
		$horafin = isset($_POST['horafin'])?$_POST['horafin']:"";
		$nota = isset($_POST['nota'])?$_POST['nota']:"";
		$preguntas = isset($_POST['preguntas'])?$_POST['preguntas']:"";
		$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
		$tiempo = isset($_POST['tiempo'])?$_POST['tiempo']:"";
		$visible = isset($_POST['visible'])?$_POST['visible']:"";

		if ( empty($codeva) || empty($fechaini)|| empty($horaini)||
		empty($fechafin)|| empty($horafin)|| empty($nota)|| empty($preguntas)||
		empty($descripcion)|| empty($tiempo) ) {
	   		echo "errorParam";
	   		exit();
  		}
		require('../modelo/modelo_evaluacion_mixta.php');
		require('../modelo/permutaciones.php');
		require('../modelo/modelo_pregunta_em.php');
		require('../modelo/modelo_curso.php');
		$evaluacion = new Evaluacion_mixta($db);
		$permutacion = new Permutaciones();
		$pregunta= new pregunta_mixta($db);
		$curso = new Curso($db);
		$fechaReg = date("Y-m-d H:i:s");
		$codprof = $_SESSION['app_user_id'];

		if (empty($visible)){
			$visible=0;
		}
		
		// obtiene todas las notas de las preguntas de una evaluacion para luego hacer una suma
		$preguntanota=$pregunta->get_notapreg($codeva);
		$sumanota=0; 
		foreach ($preguntanota as $notaPreg){
			$sumanota=$sumanota+$notaPreg['nota'];
		}
		
		$inicio= $fechaini." ".$horaini;
		$fin= $fechafin." ".$horafin;
		$banco=$evaluacion->obtener_banco($codeva);
		$datoseva=$evaluacion->get_detalle_Eva($codeva);
		$codcur=$datoseva[0]['codcur'];
		$codpar=$datoseva[0]['codpar'];
		$cantidadAlu=count($curso->getListaAlumnos($codcur,$codpar));
		
		if ($visible==1) {
			if(strtotime($fin)<strtotime($inicio)){
				echo "errorTime";
				exit();
			}
			if($nota>100){
				echo "errorNota";
				exit();
			}
			if ($preguntas>$banco) {
				echo "errorCantPreguntas";
				exit();
			}else{
				if ($sumanota>=$nota) {
					$listacombinaciones=$permutacion->obtenerCombinaciones($preguntanota,$preguntas,$nota);
					
					$cantCombinaciones=count($listacombinaciones);
					
					if ($cantCombinaciones==0) {
						echo "NoExistecombinaciones";
						exit();
					}else{
						if($cantCombinaciones<=$cantidadAlu){
							/*echo json_encode($listacombinaciones);
							exit();*/
							$nro_per=0;
							$evaluacion->delete_permutaciones($codeva);
							foreach ($listacombinaciones as $combinaciones) {
								$permutacion=json_encode($combinaciones);
								$nro_per++;
								$evaluacion->save_permutaciones($codeva, $nro_per, $permutacion, $fechaReg, $codprof);	
							}
						}else{
							$listaCombi=array();
							
							while (count($listaCombi) < $cantidadAlu) {
								$elem=$listacombinaciones[rand(0,$cantCombinaciones-1)];//escoge un elem del listacombi
								if (!in_array($elem, $listaCombi)) {
									$listaCombi[]=$elem;
									$cantlc=count($listaCombi);}	
							}
							$nro_per=0;
							$evaluacion->delete_permutaciones($codeva);
							//$listaCombi2 = barajar($listaCombi);
							foreach ($listaCombi as $combi) {
							    shuffle($combi);
								$permutacion=json_encode($combi);
								$nro_per++;
								$evaluacion->save_permutaciones($codeva, $nro_per, $permutacion, $fechaReg, $codprof);	
							}		
						}
					}

				}else{
					echo "errorNota.";
					exit();
				}
				//if(sumadenotapre<notaeva) error.	
				//$permutacion->obtenerCombinaciones($banco,$preguntas,$nota);
				//echo json_encode($permutacion);
				//exit();
			}

		}
		if( $evaluacion->update_evaluacion_mixta($codeva, $inicio, $fin, $nota, $preguntas, $descripcion,$tiempo, $fechaReg, $codprof,$visible)){
			echo "ok";
			exit();
		}
			echo "error";
		break;

	case 'get_evaluaciones_mixtas':
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->get_evaluaciones_mixtas()){
			echo "Ok";
		}else{
			echo "error";
		}
		break;

	case 'get_evaluaciones_profesor':
		$codprof = $_SESSION['app_user_id'];
		
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->get_evaluaciones_profesor($codprof)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;
	case 'get_evaluaciones_de_curso':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		if(empty($codcur)||empty($codpar)){
			echo "errorParam";
			exit();
		}

		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->get_evaluaciones_de_curso($codprof,$codcur,$codpar)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;
	case 'get_evaluacion_de_curso_trimestre':
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
	
		if(empty($codcur)||empty($codpar)){
			echo "errorParam";
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->get_evaluaciones_de_curso_trimestre($codprof,$codcur,$codpar,$trimestre)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;
	case 'get_evaluaciones_curso':
		$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
	
		if(empty($codcur)||empty($codpar)||empty($codmat)){
			echo "errorParam";
			exit();
		}
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		$result=array();
		$listaEvaluaciones= $evaluacion->get_evaluaciones_curso( $codmat, $codcur, $codpar);
		
		echo json_encode(array("status"=>"ok","lista_evaluaciones"=>$listaEvaluaciones));

		break;

	case 'updateInicio': //guarda o actualiza fecha y hora de evaluación
		$id_eva = isset($_POST['id_eva'])?$_POST['id_eva']:"";
		$inicio = isset($_POST['inicio'])?$_POST['inicio']:"";

		if ( empty($id_eva) || empty($inicio) ) {
			echo "errorParam";
			exit();
		}

		$fechaReg = date ("Y-m-d H:i:s" );
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->update_inicio($id_eva, $inicio, $codprof)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;
	
	case 'updateFin':
		$id_eva = isset($_POST["id_eva"])? $_POST["id_eva"]:"";
		$fin = isset($_POST["fin"])? $_POST["fin"]:"";
		if ( empty($id_eva) || empty($fin)){
			echo "errorParam";
			exit();
		}
		$fechaReg = date("Y-m-d H:i:s"); 
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->update_fin($id_eva, $fin, $codprof)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;

	case 'updateNota':
		$id_eva = isset($_POST["id_eva"])? $_POST["id_eva"]:"";
		$nota = isset($_POST["nota"])? $_POST["nota"]:"";
		if ( empty($id_eva) || empty($nota)){
			echo "errorParam";
			exit();
		}
		$fechaReg = date("Y-m-d H:i:s"); 
		$codprof = $_SESSION['app_user_id'];
		
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->update_nota($id_eva, $nota, $codprof)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;

	case 'updatePregunta':
		$id_eva = isset($_POST["id_eva"])? $_POST["id_eva"]:"";
		$pregunta = isset($_POST["pregunta"])? $_POST["pregunta"]:"";
		if ( empty($id_eva) || empty($pregunta)){
			echo "errorParam";
			exit();
		}
		$fechaReg = date("Y-m-d H:i:s"); 
		$codprof = $_SESSION['app_user_id'];
	
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->update_pregunta($id_eva, $pregunta, $codprof)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;
	case 'updateDescripcion':
		$id_eva = isset($_POST["id_eva"])? $_POST["id_eva"]:"";
		$descripcion = isset($_POST["descripcion"])? $_POST["descripcion"]:"";
		if ( empty($id_eva) || empty($descripcion)){
			echo "errorParam";
			exit();
		}
		$fechaReg = date("Y-m-d H:i:s"); 
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->update_descripcion($id_eva, $descripcion, $codprof)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;

	case 'updateTiempo':
		$id_eva = isset($_POST["id_eva"])? $_POST["id_eva"]:"";
		$tiempo = isset($_POST["tiempo"])? $_POST["tiempo"]:"";
		if ( empty($id_eva) || empty($tiempo)){
			echo "errorParam";
			exit();
		}
		$fechaReg = date("Y-m-d H:i:s"); 
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->update_tiempo($id_eva, $tiempo, $codprof)){
			echo "Ok";
		}else{
			echo "error";
		}
		break;

	case 'Delete_evaluacion_mixta':
		$codeva = isset($_POST["codeva"])? $_POST["codeva"]:"";
		$nro = isset ($_POST ["nro"] )? $_POST["nro"]:"";
		if ( empty($codeva)||empty($nro) ){
			echo "errorParam";
			exit();
		}

		$fechaReg = date("Y-m-d H:i:s"); 
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		if( $evaluacion->Delete_evaluacion_mixta ($codeva, $codprof, $nro)){
			echo "ok";
		}else{
			echo "error";
		}
		break;

	case 'getlista_evaluaciones_prof_cur_mat':
		$codcur = isset($_POST["codcur"])? $_POST["codcur"]:"";
		$codpar = isset($_POST["codpar"])? $_POST["codpar"]:"";
		$codmat = isset($_POST["codmat"])? $_POST["codmat"]:"";

		if ( empty($codcur)||empty($codpar)||empty($codmat) ){
			echo "errorParam";
			exit();
		}

		$gestion = date("Y");
		$trimestre = $_SESSION['app_user_bimestre']; 
		$codprof = $_SESSION['app_user_id'];
		require('../modelo/modelo_evaluacion_mixta.php');
		require_once'../tipo_indicador.php';
		$evaluacion = new Evaluacion_mixta($db);
		$listaEvaluaciones=$evaluacion->getlista_evaluaciones_prof_cur_mat ($codprof, $gestion,$trimestre,$codcur,$codpar,$codmat);
		$result=array();
		foreach ($listaEvaluaciones as $evaluacion){
			$sql = "SELECT * FROM indicador WHERE codigo = ".$evaluacion['id']." AND tipo = ".EVALUACION_MIXTA." AND estado = 1";
            $result_inidcador = mysqli_query($db,$sql);
            $indicador = "";
            if($row_indicador = $result_inidcador->fetch_object()){
                $indicador = $row_indicador->indicador;
            }
			$result[]=array(
				"id"=>$evaluacion['id'],
				"nro"=> $evaluacion['nro'],
				"descripcion"=>$evaluacion['descripcion'],
				"indicador"=>$indicador
			);
		}
		echo json_encode(array("status"=>"ok","lista"=>$result));
		
		break;

	case 'getEvaluacionesAlu'://Obtener la lista de materias y numero de evaluaciones
		$codalu = $_SESSION['app_user_id'];
		$trimestre = $_SESSION['app_user_bimestre'];
		if ( empty($codalu) || empty($trimestre) ){
			echo "errorParam";
			exit();
		}
		require_once('../modelo/modelo_Alumno.php');
		require_once('../modelo/modelo_materia.php');
		require_once('../modelo/modelo_evaluacion_mixta.php');
		
		$alumno = new Alumno($db);
		$datos = $alumno->getDatosAlumno($codalu);
		$codcur = $datos['codcur'];
		$codpar = $datos['codpar'];

		$materias = new Materia($db);
		$materiasCurso = $materias->materiasCurso($codcur,$codpar);
		$materiasAll = $materias->getMaterias();

		$gestion = date("Y");

		$evaluaciones = new Evaluacion_mixta($db);
		$listaEvaluaciones = $evaluaciones->getEvaluaciones_curso($gestion,$trimestre,$codcur, $codpar);

		$respuesta = array();

		foreach ($listaMaterias as $codmat) {
			$respuesta[] = array(
								"codmat" => $codmat,
								"nombre" => $materiasAll[$codmat]['nombre'],
								"imagen" => $materiasAll[$codmat]['imagen'],
								"evaluaciones" => contarEvaluaciones($listaEvaluaciones,$codmat)
								);
		}
		echo json_encode($respuesta);

		break;
	case 'getMateriasCurso'://retornará la lista de materias y cantidad de evaluaciones de un curso
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";

		if(empty($codcur) || empty($codpar)){
			echo "errorParam";
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		$gestion = date("Y");
		
		require '../modelo/modelo_evaluacion_mixta.php';
		require '../modelo/modelo_materia.php';

		$eval = new Evaluacion_mixta($db);
		$mat = new Materia($db);
		
		$listaEvaluaciones = $eval->contarEvaluacionesCurso($codcur,$codpar,$trimestre,$gestion);
		$listaMaterias = $mat->getMateriasCurso($codcur,$codpar);

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
							"evaluaciones"=>obtenerEvaluaciones($listaEvaluaciones,$materia['codmat'])
							);
		}
		echo json_encode(array("status"=>"ok","lista"=>$result));
		break;
	
	
	case 'getEvalucionesAdm'://Se obtendrá la lista de materias que tiene el profesor en un curso y la cantidad de evaluaciones por materia
		$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";

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
		
		$listaEvaluaciones = $eval->EvaluacionesCursoMaterias($codcur,$codpar,$codmat,$trimestre,$gestion);

		$result = array();
		foreach ($listaEvaluaciones as $evaluacion) {
			$result[] = array(
							"id" => $evaluacion['id'],			
							"descripcion" => $evaluacion['descripcion'],
							"fin" => substr($evaluacion['fin'],0,10),
							"horafin"=>substr($evaluacion['fin'],11,5),
							"inicio" => substr($evaluacion['inicio'],0,10),
							"horaini"=>substr($evaluacion['inicio'],11,5),
							"nota" => $evaluacion['nota'],
							"preguntas" => $evaluacion['preguntas'],
							"banco" => $evaluacion['banco']
							);
		}
		echo json_encode(array("status"=>"ok","lista"=>$result));
		break;

	case 'getPreguntas':
		$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";
		if(empty($codeva) || empty($codeva)){
			echo "errorParam";
			exit();
		}
		require_once '../modelo/modelo_evaluacion_mixta.php';
		require_once '../modelo/modelo_materia.php';
		require_once '../modelo/modelo_pregunta_em.php';
		require_once '../modelo/modelo_opcion_em.php';
		require_once '../modelo/modelo_opcion_correcta_em.php';
		require_once '../modelo/modelo_imagen_em.php';
		if($_tipo_user=="doc"){
			$codprof = $_SESSION['app_user_id'];
			require_once '../modelo/modelo_evaluacion_mixta.php';
			$preguntas_mixta = new pregunta_mixta($db);
			$preguntas = $preguntas_mixta->get_preguntas($codeva);
			$listaPreguntas = [];
			for ($i=0; $i < count($preguntas); $i++) { 
				$idPregunta = $preguntas[$i]['codpreg'];
				$imgn = new imagen_mixta($db);
				$img = $imgn->get_imagen($idPregunta);
				$opcion = new opciones_pregunta_seleccion($db);
				$opciones = $opcion->obtener_opcion($idPregunta);
				$correcta = new opcion_correcta($db);
				$op_correctas = $correcta->obtener_opcion_correcta($idPregunta);
				$data = [
					"img" => $img,
					"opciones" =>$opciones,
					"op_correctas" => $op_correctas,
					"preg" => $preguntas[$i]
				];
				
				$listaPreguntas[] = $data;
			}
			echo json_encode(array("status"=>"ok","preguntas"=>$listaPreguntas));
			exit();
		}
		
		break;
     case 'get_datos_evaluacion':
		$codeva = isset($_POST["codeva"])? $_POST["codeva"]:"";
		if ( empty($codeva) ){
			echo "errorParam";
			exit();
		}
		require('../modelo/modelo_evaluacion_mixta.php');
		$evaluacion = new Evaluacion_mixta($db);
		
		$listaEvaluaciones=$evaluacion->get_detalle_Eva($codeva);
		$result=array();
		foreach ($listaEvaluaciones as $evaluacion){
			$result[]=array(
				"id"=>$evaluacion['id'],
				"gestion"=>$evaluacion['gestion'],
				"trimestre"=>$evaluacion['trimestre'],
				"nro"=>$evaluacion['nro'],
				"codcur"=>$evaluacion['codcur'],
				"codpar"=>$evaluacion['codpar'],
				"codmat"=>$evaluacion['codmat'],
				"inicio"=>$evaluacion['inicio'],
				"fin"=>$evaluacion['fin'],
				"nota"=>$evaluacion['nota'],
				"preguntas"=>$evaluacion['preguntas'],
				"banco"=>$evaluacion['banco'],
				"descripcion"=>$evaluacion['descripcion'],
				"tiempo"=>$evaluacion['tiempo'],
				"fechaReg"=>$evaluacion['fechaReg'],
				"codprof"=>$evaluacion['codprof'],
				"visible"=>$evaluacion['visible'],
				"estado"=>$evaluacion['estado']
			);
		}
		echo json_encode(array("status"=>"ok","lista"=>$result));
		 break;
	
		 case 'getListaAlumnos':// obtiene la lista de alumnos de uno curso y paralelo 
			$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
			$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
			$codeva = isset($_POST['codeva'])?$_POST['codeva']:"";
			if(empty($codcur) || empty($codpar)||empty($codeva)){
				echo "errorParam";
				exit();
			}
			$gestion = date("Y");
			require '../modelo/modelo_curso.php';		
			require '../modelo/modelo_em_alumno.php';	
			$curso = new Curso($db);
			$alumno= new em_alumno($db);
			//$listaAlumnos = $curso->obtener_ListaAlumnos($codcur,$codpar);
			$listaAlumnos = $curso->getListaAlumnos($codcur,$codpar);
			
			$result = array();
				foreach ($listaAlumnos as $Alumno) {
					$codigo = $Alumno['codigo'];
					$id = $alumno->get_id_em_alumno($codigo, $codeva);					
					$notafinal = $alumno->get_notafinal_alumno($codigo, $codeva);
					$result[] = array(
									"id"=>$id,
									"codigo" => $Alumno['codigo'],
									"codalu" => $Alumno['codalu'],
									"paterno" => $Alumno['paterno'],
									"materno" => $Alumno['materno'],
									"nombre" => $Alumno['nombres'],
									"notafinal"=>$notafinal
									);								
				}
				echo json_encode(array("status"=>"ok","lista_alumnos"=>$result));
			break;
			/*-----------mgps----- */
			case 'obtener_materias_Evaluaciones':
				$gestion = date("Y");
				$trimestre = $_SESSION['app_user_bimestre'];
				$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
				$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
				$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
				if(empty($codmat) || empty($codcur)||empty($codmat)){
					echo "errorParam";
					exit();
				}
				require '../modelo/modelo_evaluacion_mixta.php';
				require '../modelo/modelo_em_alumno.php';
				$Evaluacion = new Evaluacion_mixta($db);
				$alumno = new em_alumno($db);
				$codalu = $_SESSION['app_user_id'];
				//echo "codalu",$codalu;
				$listaEvaluaciones=$Evaluacion->get_evaluacion_curso($gestion,$trimestre,$codcur, $codpar, $codmat);
				$fechaActual = date("Y-m-d H:i:s");
				$lista = array();
				foreach ($listaEvaluaciones as $evaluacion) {
						$codeva=$evaluacion['id'];
						//echo "codeva",$codeva;
						$fechaini =$evaluacion['inicio'];
						$fechafin = $evaluacion['fin'];	
						$estado=0;
						//$notafinal=null;
						$notafinal = $alumno->get_notafinal_alumno($codalu, $codeva);
						$evaluacion_alumno = $alumno-> get_eva_alumno($codalu, $codeva);
						if (  strtotime($fechaActual) <= strtotime($fechafin) && strtotime($fechaActual)>=strtotime($fechaini)){
							if(!empty($evaluacion_alumno)){
								$proceso=$evaluacion_alumno['proceso'];
								//echo "proceso: ",$proceso; 
								$fechafinalizacion=$evaluacion_alumno['fechafin'];
								if (strtotime($fechaActual )>strtotime($fechafinalizacion)) {
									$estado=2;//finalizado
									//echo $estado;
									if ($proceso==1){
										$id=$evaluacion_alumno['id'];
										$finalizado=$alumno->finalizar($id, $codalu, $codeva );
									}
								}else{
									if ($proceso==1) {
										$estado=1;
									}else{
										$estado=2;
									}
								}
							} else{
								$estado=1;
							}
						}else{
							if(!empty($evaluacion_alumno)){
								$estado=2;
							} else{
								$estado=0;								
							}
						}
					$lista[]=array(
						"id"=>$evaluacion['id'],
						"gestion"=>$evaluacion['gestion'],
						"trimestre"=>$evaluacion['trimestre'],
						"nro"=>$evaluacion['nro'],
						"codcur"=>$evaluacion['codcur'],
						"codpar"=>$evaluacion['codpar'],
						"codmat"=>$evaluacion['codmat'],
						"inicio"=>$evaluacion['inicio'],
						"fin"=>$evaluacion['fin'],
						"nota"=>$evaluacion['nota'],
						"preguntas"=>$evaluacion['preguntas'],
						"banco"=>$evaluacion['banco'],
						"descripcion"=>$evaluacion['descripcion'],
						"tiempo"=>$evaluacion['tiempo'],
						"fechaReg"=>$evaluacion['fechaReg'],
						"codprof"=>$evaluacion['codprof'],
						"disponible"=>$estado,
						"notafinal"=>$notafinal,
						"detalle"=>detalle($evaluacion['inicio'], $evaluacion['fin'])
					);		
				} 
				echo json_encode(array("status"=>"ok","Evaluaciones"=>$lista));
				break;
/*------por si acaso--------------
case 'obtener_materias_Evaluaciones':
				$gestion =2022;
				$trimestre =1;
				$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
				$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
				$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
				if(empty($codmat) || empty($codcur)||empty($codmat)){
					echo "errorParam";
					exit();
				}
				require '../modelo/modelo_evaluacion_mixta.php';
				require '../modelo/modelo_em_alumno.php';
				$Evaluacion = new Evaluacion_mixta();
				$alumno = new em_alumno();
				$codalu = $_SESSION['app_user_id'];
				//echo "codalu",$codalu;
				$listaEvaluaciones=$Evaluacion->get_evaluacion_curso($gestion,$trimestre,$codcur, $codpar, $codmat);
				$fechaActual = date("Y-m-d H:i:s");
				$lista = array();
				foreach ($listaEvaluaciones as $evaluacion) {
						$codeva=$evaluacion['id'];
						//echo "codeva",$codeva;
						$fechaini =$evaluacion['inicio'];
						$fechafin = $evaluacion['fin'];	
						$estado=0;
						$notafinal=null;
						echo "fechaini:",$fechaini;
						echo "-  fechafin:",$fechafin;
						echo "   -  fechaActual:",$fechaActual;
						exit();
						if (  strtotime($fechaActual) <= strtotime($fechafin) && strtotime($fechaActual)>=strtotime($fechaini)){
							echo "prubra disque final:(";
							exit();
							$notafinal = $alumno->get_notafinal_alumno($codalu, $codeva);
							$evaluacion_alumno = $alumno-> get_eva_alumno($codalu, $codeva);
							if(!empty($evaluacion_alumno)){
								//echo "entra?";
								$proceso=$evaluacion_alumno['proceso'];
								//echo "proceso: ",$proceso; 
								$fechafinalizacion=$evaluacion_alumno['fechafin'];
								if (strtotime($fechaActual )>strtotime($fechafinalizacion)) {
									//echo "fa>ff si";
									$estado=2;
									//echo $estado;
									if ($proceso==1){
										$id=$evaluacion_alumno['id'];
										$finalizado=$alumno->finalizar($id, $codalu, $codeva );
									}
								}else{
									if ($proceso==1) {
										$estado=1;
									}else{
										$estado=2;
									}
								}
							} else{
								$estado=1;
							}
						}
					//echo "estado",$estado;
					$lista[]=array(
						"id"=>$evaluacion['id'],
						"gestion"=>$evaluacion['gestion'],
						"trimestre"=>$evaluacion['trimestre'],
						"nro"=>$evaluacion['nro'],
						"codcur"=>$evaluacion['codcur'],
						"codpar"=>$evaluacion['codpar'],
						"codmat"=>$evaluacion['codmat'],
						"inicio"=>$evaluacion['inicio'],
						"fin"=>$evaluacion['fin'],
						"nota"=>$evaluacion['nota'],
						"preguntas"=>$evaluacion['preguntas'],
						"banco"=>$evaluacion['banco'],
						"descripcion"=>$evaluacion['descripcion'],
						"tiempo"=>$evaluacion['tiempo'],
						"fechaReg"=>$evaluacion['fechaReg'],
						"codprof"=>$evaluacion['codprof'],
						"disponible"=>$estado,
						"notafinal"=>$notafinal,
						"detalle"=>detalle($evaluacion['inicio'], $evaluacion['fin'])
					);		
				} 		
				echo json_encode(array("status"=>"ok","Evaluaciones"=>$lista));
				break;
*/
			case 'init_eval':
				$id = isset($_POST['id'])?$_POST['id']:"";
				if(empty($id)){
					echo "errorParam";
					exit();
				}
				$fechaActual = date("Y-m-d H:i:s");
				$codalu = $_SESSION['app_user_id'];
				require '../modelo/modelo_evaluacion_mixta.php';
				require '../modelo/modelo_em_alumno.php';
				require '../modelo/modelo_pregunta_em.php';
				require '../modelo/modelo_em_alumno_preguntas.php';
				require '../modelo/modelo_imagen_em.php';
				require '../modelo/em_alumno_pregunta_img.php';
				require '../modelo/modelo_opcion_em.php';
				require '../modelo/em_alumno_preg_opciones.php';
				require '../modelo/modelo_verdadero_falso.php';
				require '../modelo/em_alumno_preg_vf.php';
				require '../modelo/modelo_relacionar_em.php';
				require '../modelo/em_alumno_pregunta_relacion.php';
				require '../modelo/em_alumno_preg_op_correcta.php';
				require '../modelo/modelo_opcion_correcta_em.php';
				require '../modelo/em_alumno_preg_escrito.php';
				$pregunta_escrita = new alumno_preg_escrito($db);
				$opcion = new opcion_correcta($db);
				$pregunta_opcorrecta = new alumno_preg_opcorrecta($db); 
				$pregunta_relacion = new alumno_pregunta_rel($db);
				$relacionar = new relacionar_pregunta($db);
				$pregunta_vf = new alumno_preg_vf($db);
				$vf = new verdadero_falso($db);
				$em_opcion = new alumno_pregunta_opciones($db);
				$opciones = new opciones_pregunta_seleccion($db);
				$pregunta_img = new alumno_pregunta_img($db);
				$imagen = new imagen_mixta($db);
				$pregunta_alumno = new alumno_pregunta($db);
				$Evaluacion = new Evaluacion_mixta($db);
				$alumno = new em_alumno($db);
				$em_pregunta = new pregunta_mixta($db);
				$evaluacion = $Evaluacion->obtener_eva_visible($id); 
				if (!empty($Evaluacion)) {
					$lista =array();				
					foreach ($evaluacion as $eva) {
						$lista[]=array(
							"id"=>$eva['id'],
							"gestion"=>$eva['gestion'],
							"trimestre"=>$eva['trimestre'],
							"nro"=>$eva['nro'],
							"curso"=>$eva['codcur'],
							"paralelo"=>$eva['codpar'],
							"materia"=>$eva['codmat'],
							"inicio"=>$eva['inicio'],
							"fin"=>$eva['fin'],
							"nota"=>$eva['nota'],
							"preguntas"=>$eva['preguntas'],
							"banco"=>$eva['banco'],
							"descripcion"=>$eva['descripcion'],
							"tiempo"=>$eva['tiempo'],
							"fechaReg"=>$eva['fechaReg'],
							"codprof"=>$eva['codprof'],
							"visible"=>$eva['visible'],
							"estado"=>$eva['estado']	
						);
						$codeva=$eva['id'];
						$fechaini = $eva['inicio'];
						$fechafin=$eva['fin'];
						$time=$eva['tiempo'];
						$preguntas= $eva['preguntas'];
						if (strtotime($fechaActual)>= strtotime($fechaini)&& strtotime($fechaActual)<strtotime($fechafin)) {
							$eva_alumno = $alumno->get_eva_em_alumno($codalu, $codeva);
							if(!empty($eva_alumno)){
								$list=array();
								// validar si no hay em_alumno
									foreach ($eva_alumno as $eval) {
											echo "inProcces";
											exit();
									}
							}else{
								//Insertando nuevo registro de proceso
								$notafinal=null;//26/05
								$fechaFinal = strtotime('+'.$time.' minute',strtotime($fechaActual));
            					$ffin = date("Y-m-d H:i:s",$fechaFinal);

								$idaem=$alumno->save_evaluacion_alumno($codalu,$codeva,$fechaActual,$ffin,$notafinal);
								// obteniendo la cantidad de preguntas del examen
								$banco = $eva['banco']; 
								$preguntas = $eva['preguntas'];

								// Generando las preguntas aleatoriamente
								/*-----------------mio--------*/
								$listaper=$Evaluacion->get_permutaciones($codeva);
								$cantCombinaciones = count($listaper);
								$elem= $listaper[rand(0,$cantCombinaciones-1)];
								$lista_per=json_decode($elem);

								foreach($lista_per as $fila){
									$decodePreg = json_decode($fila);
									//obtener detalle de la pregunta de la base de datos
									$detalle_preg = $em_pregunta-> get_detalle_pregunta($decodePreg);
									//obtener todos los campos de la pregunta
									foreach ($detalle_preg as $det) {
										$codpreg = $det['codpreg'];
										$tipo=$det['tipo'];
										$pregunta=$det['pregunta'];
										$notaPreg=$det['nota'];
										$notaC=null;
										if($pregunta_alumno->save_detalle_pregunta_alumnos($idaem,$tipo,$pregunta,$notaPreg, $notaC)){
											//obtener imagen de pregunta, guardar detalle de imagen (no tome encuenta el tipo4-relacion)
											$preguntas_alu=$pregunta_alumno->get_preg_Eval($idaem);
											foreach ($preguntas_alu as $alu ) {
												$id_preg = $alu['id'];
											}
												$img = $imagen->get_link_imagen($codpreg);
												if (!empty($img)){
													$pregunta_img->save_detalle_preg_img($id_preg,$img);												
												}
											
	
											switch ($tipo) {
												case '1':
													$respuesta=null;
													$pregunta_escrita->save_detalle_pregunta_escrita($id_preg, $respuesta, $fechaActual);
													break;
	
												case '2':
													$lista_opciones = $opciones->obtener_opcion($codpreg);
													$op_correct = $opcion->obtener_opcion_correcta($codpreg);
													//$list=array();
													foreach ($lista_opciones as $op) {
														$o_codpreg =$op['em_o_pregunta'];
														$o_nro =$op['em_o_nro'];
														$o_opcion = $op['em_o_opcion'];
														$op_alumno=NULL;
														// guardar opciones de preguntas
														//$em_opcion->save_pregunta_opcion($o_codpreg, $o_nro, $o_opcion);	
														$em_opcion->save_pregunta_opcion($id_preg, $o_nro, $o_opcion);					
													}
													$pregunta_opcorrecta->save_detalle_em_alum_pregunta($id_preg, $op_correct, $op_alumno);
													break;
													
												case '3':
													$lista_vf = $vf->obtener_vf($codpreg);
													foreach ($lista_vf as $v_f) {
														$v_codpreg=$v_f['codpreg'];
														$v_vf=$v_f['f_v'];
														$vf_alumno=NULL;// guarda nulo
														//$em_vf=$pregunta_vf->save_detalle_pregunta_vf($v_codpreg, $v_vf, $vf_alumno);
														$em_vf=$pregunta_vf->save_detalle_pregunta_vf($id_preg, $v_vf, $vf_alumno);
													}
													
													break;
												case '4':
														$lista_relaciones = $relacionar->obtener_relaciones($codpreg);
														foreach ($lista_relaciones as $relacion) {
														$r_codpreg=$relacion['codpreg'];
														$nro=$relacion['nro']; 
														$campo1=$relacion['campo1']; 
														$tipo1=$relacion['tipo1'];
														$op_correcto=$relacion['op_correcto'];
														$campo2=$relacion['campo2'];
														$tipo2=$relacion['tipo2'];
														$op_alum=NULL;
														//$em_relacionar = $pregunta_relacion->save_detalle_pregunta_relacion($r_codpreg, $nro, $campo1, $tipo1, $op_correcto, $campo2, $tipo2,$op_alum);	
														$em_relacionar = $pregunta_relacion->save_detalle_pregunta_relacion($id_preg, $nro, $campo1, $tipo1, $op_correcto, $campo2, $tipo2,$op_alum);	
														}
													break;
	
												default:
													
													break;
											}
										}else{
											echo 'error';
										}
									}

								}
	
								/*-----------------mio--------*/

							}
							echo 'ok';
						}else{
							echo "expired";
							exit();
						}
					}
				}
				break;		
			/*----------------------- */
	default:
		echo "ErrorOP";
	break;
}
//Aquí se definirán funciones que serán utiles
function contarEvaluaciones($listaEvaluaciones,$codmat){
	$cont = 0;
	foreach ($listaEvaluaciones as $evaluacion) {
		// code...
	}
	return $cont;
}

function obtenerEvaluaciones($listaEvaluaciones,$codmat){
	for ($i=0; $i < count($listaEvaluaciones) ; $i++) { 
		if($listaEvaluaciones[$i]['codmat']==$codmat){
			return $listaEvaluaciones[$i]['evaluaciones'];
		}
	}
	return 0;
}
//------------evaluaciones_mixta_Alu
function mismoMes($f_inicio,$f_fin){
	$anioi = date("Y",strtotime($f_inicio));
	$mesi = date("m",strtotime($f_inicio));
	$aniof = date("Y",strtotime($f_inicio));
	$mesf = date("m",strtotime($f_fin));
	return $anioi==$aniof&&$mesi==$mesf;
}
function detalle($f_ini,$f_f){
	$f_inicio = substr($f_ini,0,10);
	$horai = substr($f_ini,11,8);
  
	$f_fin = substr($f_f,0,10);
	$horaf = substr($f_f,11,8);
	$diai = substr($f_inicio,8,2);
	$diaf = substr($f_fin,8,2);
	
	if (strtotime($f_f)<strtotime(date("Y-m-d H:i:s"))) {
	  if ($f_inicio==$f_fin) {
		return "La evaluación estuvo habilitada el día ".formatodefecha($f_inicio)." desde las ".substr($horai, 0,5)." hrs. hasta las ".substr($horaf, 0,5)." hrs.";
	  }
	  if(mismoMes($f_inicio,$f_fin)){
		return "La evaluación estuvo habilitada desde las ".substr($horai, 0,5)." hrs. del día ".getndia($f_inicio)." ".$diai." hasta las ".substr($horaf, 0,5)." hrs. del día ".getndia($f_fin)." ".$diaf." de ".getnmes($f_inicio);
	  }
	  return "La evaluación estuvo habilitada desde las ".substr($horai, 0,5)." hrs. del día ".formatodefecha($f_inicio)." hasta las ".substr($horaf, 0,5)." hrs. del día ".formatodefecha($f_fin); 
	}
  
	if ($f_inicio==$f_fin) {
	  return "Evaluación disponible desde el día ".formatodefecha($f_inicio)." desde las ".substr($horai, 0,5)." hrs. hasta las ".substr($horaf, 0,5)." hrs.";
	}
	if(mismoMes($f_inicio,$f_fin)){
		return "Evaluación disponible desde las ".substr($horai, 0,5)." hrs. del día ".getndia($f_inicio)." ".$diai." hasta las ".substr($horaf, 0,5)." hrs. del día ".getndia($f_fin)." ".$diaf." de ".getnmes($f_inicio);
	}
	  return "Evaluación disponible desde las ".substr($horai, 0,5)." hrs. del día ".formatodefecha($f_inicio)." hasta las ".substr($horaf, 0,5)." hrs. del día ".formatodefecha($f_fin); 
}
function getndia($f_inicio){
	return getnombreDia(deleteCero(date('N',strtotime($f_inicio))));
}
function getnmes($f_inicio){
	return getnombreMes(deleteCero(date('m',strtotime($f_inicio))));
}
function getnombreMes($mes){
	$meses = array("enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");
	return $meses[$mes-1];
}
  
  function getnombreDia($dia){
	$dias = array("Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo");
	return $dias[$dia-1];
  }
  
  function formatodefecha($fecha){
	$time = strtotime($fecha);
	$numbDia = date("N",$time);
	  
	$nombreDia = getnombreDia($numbDia);
	
	$numbMes = date("n",$time);
	  
	$nombreMes = getnombreMes($numbMes);
	$anio = substr($fecha, 0,4);
	$dia = deleteCero(substr($fecha, 8,2));
  
	return $nombreDia.', '.$dia.' de '.$nombreMes.' de '.$anio;
	
  }
  function deleteCero($string){
  
	if (substr($string, 0,1)=='0') {
	  return substr($string, 1,1);
	}else{
	  return $string;
	}
  }
  

?>