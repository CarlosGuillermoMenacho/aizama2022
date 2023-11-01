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
	case 'getEvalaucionesSeleccionMes':
		$mes = isset($_POST['mes'])?$_POST['mes']:"";
		if(empty($mes)){
			echo "errorParam";
			exit();
		}	
		$year = date("Y");
		$codalu = $_SESSION['app_user_id'];
		require '../modelo/modelo_Alumno.php';
		$alumno = new Alumno($db);
		$datosAlumno = $alumno->getDatosAlumno($codalu);
		$codcur = $datosAlumno['codcur'];
		$codpar = $datosAlumno['codpar'];
		require '../modelo/modelo_Evaluacion.php';
		$evaluaciones = new Evaluacion_Seleccion($db);

		$lista = $evaluaciones->getEvaluacionesMes($year,$mes,$codcur,$codpar);
		echo json_encode($lista);
		break;
	case 'eval_family'://Se obtienen todas las evaluaciones realizadas y pendientes de los estudiantes de un tutor
		$codtut = $_SESSION['app_user_id'];
		$trimestre = $_SESSION['app_user_bimestre'];
		$gestion = date("Y");
		if(empty($codtut)){
			echo "errorParam";
			exit();
		}
		require_once '../modelo/modelo_tutor.php';
		require_once '../modelo/modelo_Alumno.php';
		require_once '../modelo/modelo_materia.php';
		require_once '../modelo/modelo_Evaluacion.php';
		$tutor = new Tutor($db);
		$alumno = new Alumno($db);
		$materia = new Materia($db);
		$practico = new Evaluacion_Seleccion($db);
		$arrayAlumnos = $tutor->get_alumnos($codtut);
		if (count($arrayAlumnos) == 0) {
			echo "noAlumnos";
			exit();
		}
		$lista_Alumnos = array();
		$arrayEvaluaciones = array();
		foreach ($arrayAlumnos as $codigo) {
			$datoAlumno = $alumno->getDatosAlumno($codigo);
			$lista_Alumnos[] = array("codalu"=>$codigo,"nombre"=>$datoAlumno["nombre"]); 
			$codcur = $datoAlumno["codcur"];
			$codpar = $datoAlumno["codpar"];
			$arrayEvaluaciones[] = array(
									"codalu"=>$codigo,
									"realizados"=>$practico->get_evaluaciones_realizadas($codigo,$trimestre,$gestion),
									"pendientes"=>$practico->get_evaluaciones_pendientes($codigo,$codcur,$codpar,$trimestre,$gestion),
									"materias"=>$materia->getMateriasCurso($codcur,$codpar)
									);

		}
		echo json_encode(array("status"=>"ok","alumnos"=>$lista_Alumnos,"practicos"=>$arrayEvaluaciones),JSON_UNESCAPED_UNICODE);
		break;
	case 'gepm'://Obtner todas las evaluaciones de un profesor
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		$gestion = date("Y");
		require_once '../modelo/modelo_Evaluacion.php';
		require_once '../modelo/modelo_indicador.php';
		$Evaluacion = new Evaluacion_Seleccion($db);
		$Indicador = new Indicador($db);
		$result = $Evaluacion->get_evaluaciones_prof($gestion,$trimestre,$codusr);
		$response = [];
		while ($row = $result->fetch_object()) {
			$ind_result = $Indicador->get_by_code_type($row->codexa,3); 
			$indicador = "";
			if($ind_row = $ind_result->fetch_object()){
				$indicador = $ind_row->indicador;
			}
			$response[] = [
				"codeva"=>$row->codexa,
				"codcur"=>$row->codigo,
				"codpar"=>$row->cod_par,
				"codmat"=>$row->codmat,
				"descripcion"=>$row->descrip,
				"nro_eva"=>$row->codeva,
				"fini"=>$row->f_inicio,
				"ffin"=>$row->f_fin,
				"hi"=>substr($row->horai,0,5),
				"hf"=>substr($row->horaf,0,5),
				"fechareg"=>"$row->fecha $row->hora",
				"preguntas"=>$row->tot_preg,
				"indicador"=>$indicador,
				"visible"=>$row->visible
			];
		}
		echo json_encode(["status"=>"ok","data"=>$response]);
		break;
	case 'update_evaluacion':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		$codcur =  isset($_POST["codcur"])?$_POST["codcur"]:"";
		$codpar =  isset($_POST["codpar"])?$_POST["codpar"]:"";
		$codexa =  isset($_POST["codexa"])?$_POST["codexa"]:"";
		$codmat =  isset($_POST["codmat"])?$_POST["codmat"]:"";
		$nro_eva =  isset($_POST["nro_eva"])?$_POST["nro_eva"]:"";
		$preguntas =  isset($_POST["preguntas"])?$_POST["preguntas"]:"";
		$indicador =  isset($_POST["indicador"])?$_POST["indicador"]:"";
		$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
		$fini =  isset($_POST["fini"])?$_POST["fini"]:"";
		$horaini =  isset($_POST["horaini"])?$_POST["horaini"]:"";
		$ffin =  isset($_POST["ffin"])?$_POST["ffin"]:"";
		$horafin =  isset($_POST["horafin"])?$_POST["horafin"]:"";
		$visible = isset($_POST["visible"])?1:0;
		$notificar = isset($_POST["notificar"])?1:0;
		
		if(empty($codcur) || empty($codpar) || empty($codexa) ||
		   empty($codmat) || empty($nro_eva) ||
		   empty($indicador) || empty($fini) || empty($ffin) ||
		   empty($horaini) || empty($horafin)|| empty($descripcion)){
			echo json_encode(["status"=>"errorParam"]);
		exit();
		}
		require_once"verificar_parametro.php";
		if(!is_entero($preguntas)){
			echo json_encode(["status"=>"errorPreguntas"]);
			exit();
		}
		if(!es_fecha($fini)){
			echo json_encode(["status"=>"errorFechaini"]);
			exit();
		}

		if(!es_fecha($ffin)){
			echo json_encode(["status"=>"errorFechafin"]);
			exit();
		}
		if(!es_hora($horaini)){
			echo json_encode(["status"=>"errorHoraini"]);
			exit();
		}	
		if(!es_hora($horafin)){
			echo json_encode(["status"=>"errorHorafin"]);
			exit();
		}
		if(strtotime("$fini $horaini") > strtotime("$ffin $horafin")){
			echo json_encode(["status"=>"errorFechas"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		require_once"../modelo/modelo_indicador.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$Indicador = new Indicador($db);
		$fecha = date("Y-m-d");
		$hora = date("H-i-s");
		$Evaluacion->update($codexa,$nro_eva,$descripcion,$fini,$horaini,$ffin,$horafin,$codusr,$fecha,$hora,$preguntas,$visible);
		$exist_indicador = $Indicador->get_by_code_type($codexa,3);
		if($row = $exist_indicador->fetch_object()){
			$Indicador->update_indicador_by_code_type($codexa,3,$indicador);
		}else{
			$Indicador->save($codexa,3,$indicador);
		}

		echo json_encode(["status"=>"ok"]);
		break;
	case 'save_evaluacion':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		$codcur =  isset($_POST["codcur"])?$_POST["codcur"]:"";
		$codpar =  isset($_POST["codpar"])?$_POST["codpar"]:"";
		$codmat =  isset($_POST["codmat"])?$_POST["codmat"]:"";
		$nro_eva =  isset($_POST["nro_eva"])?$_POST["nro_eva"]:"";
		$preguntas =  isset($_POST["preguntas"])?$_POST["preguntas"]:"";
		$indicador =  isset($_POST["indicador"])?$_POST["indicador"]:"";
		$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
		$fini =  isset($_POST["fini"])?$_POST["fini"]:"";
		$horaini =  isset($_POST["horaini"])?$_POST["horaini"]:"";
		$ffin =  isset($_POST["ffin"])?$_POST["ffin"]:"";
		$horafin =  isset($_POST["horafin"])?$_POST["horafin"]:"";
		if(empty($codcur) || empty($codpar) ||
		   empty($codmat) || empty($nro_eva) || 
		   empty($indicador) || empty($fini) || empty($ffin) ||
		   empty($horaini) || empty($horafin)|| empty($descripcion)){
			echo json_encode(["status"=>"errorParam"]);
		exit();
		}
		require_once"verificar_parametro.php";
		if(!is_entero($preguntas)){
			echo json_encode(["status"=>"errorPreguntas"]);
			exit();
		}
		if(!es_fecha($fini)){
			echo json_encode(["status"=>"errorFechaini"]);
			exit();
		}

		if(!es_fecha($ffin)){
			echo json_encode(["status"=>"errorFechafin"]);
			exit();
		}
		if(!es_hora($horaini)){
			echo json_encode(["status"=>"errorHoraini"]);
			exit();
		}	
		if(!es_hora($horafin)){
			echo json_encode(["status"=>"errorHorafin"]);
			exit();
		}
		if(strtotime("$fini $horaini") > strtotime("$ffin $horafin")){
			echo json_encode(["status"=>"errorFechas"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		require_once"../modelo/modelo_indicador.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$Indicador = new Indicador($db);
		$fecha = date("Y-m-d");
		$hora = date("H-i-s");
		$gestion = date("Y");
		$id = $Evaluacion->save($gestion,$trimestre,$codmat,$codcur,$nro_eva,$descripcion,$fini,$ffin,$horaini,$horafin,$codusr,$fecha,$hora,$codpar,$preguntas);
		$Indicador->save($id,3,$indicador);
		echo json_encode(["status"=>"ok"]);
		break;
	case 'banco':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codexa = isset($_POST["codexa"])?$_POST["codexa"]:"";
		if(empty($codexa)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$EV = new Evaluacion_Seleccion($db);
		$result = $EV->get_preguntas($codexa);
		$preguntas = [];
		while ($row = $result->fetch_object()) {
			$codpre = $row->codpre;
			$result2 = $EV->get_opciones($codpre);
			$opciones = [];
			while ($rowOP = $result2->fetch_object()) {
				$opciones[] = $rowOP;
			}
			$preguntas[] = [
				"codpreg"=>$codpre,
				"imagen"=>$row->dir_imagen,
				"numero"=>$row->numero,
				"pregunta"=>$row->pregunta,
				"respuesta"=>$row->respuesta,
				"tiempo"=>$row->tiempo,
				"opciones"=>$opciones
			];


		}
		echo json_encode(["status"=>"ok","data"=>$preguntas]);
		break;
	case 'save_pregunta':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$trimestre = $_SESSION['app_user_bimestre'];
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
			exit();
		}
		$codexa = isset($_POST["codexa"])?$_POST["codexa"]:"";
		$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
		$options = isset($_POST["text-option"])?$_POST["text-option"]:"";
		$tiempo = isset($_POST["tiempo"])?$_POST["tiempo"]:"";
		$respuesta = isset($_POST["opcion"])?$_POST["opcion"]:"";

		if(empty($codexa) || empty($descripcion) || empty($options) || empty($tiempo) || empty($respuesta)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$EV = new Evaluacion_Seleccion($db);
		$result = $EV->get_evaluacion_by_codexa($codexa);
		$evaluacion = "";
		if(!$evaluacion = $result->fetch_object()){
			echo json_encode(["status"=>"errorCodexa"]);
			exit();
		}
		$valor = $evaluacion->tot_preg == 5?20:10;
		$result = $EV->get_n_preguntas($codexa);
		$row = $result->fetch_object();
		$total = $row->total + 1;
		$fecha = date("Y-m-d");
		$hora = date("H-i-s");
		$nombreArchivo = "";
		if(count($options) < 2){
			echo json_encode(["status"=>"errorOptions"]);
			exit();
		}
		if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])){
			$ext=explode(".",$_FILES["imagen"]["name"]);
			if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png"){
				
				$fichero="../resources/";
				$nombreArchivo=$codusr."-".strtotime(date("Y-m-d H:i:s")).".".end($ext);								
				$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
			}
		}

		$codpreg = $EV->save_pregunta($codexa,$total,$descripcion,$respuesta,$valor,$tiempo,$codusr,$fecha,$hora,$nombreArchivo);
		$nop = 1;
		foreach ($options as $op) {
			$EV->save_opcion($codpreg,$nop,$op);
			$nop++;
		}
		echo json_encode(["status"=>"ok"]);
		break;
	case 'delete':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codexa =  isset($_POST["codexa"])?$_POST["codexa"]:"";
		if(empty($codexa)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$fecha = date("Y-m-d");
		$hora = date("H-i-s");
		$Evaluacion->delete($codexa,$codusr,$fecha,$hora);
		echo json_encode(["status"=>"ok"]);
		break;
	case 'print-eval':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codexa =  isset($_POST["codexa"])?$_POST["codexa"]:"";
		if(empty($codexa)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		require_once"../modelo/modelo_materia.php";
		require_once"../modelo/modelo_curso.php";
		require_once"../modelo/modelo_paralelo.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$Materia = new Materia($db);
		$Curso = new Curso($db);
		$Paralelo = new Paralelo($db);
		$result = $Evaluacion->get_evaluacion($codexa);
		if($row = $result->fetch_object()){
			$materias = $Materia->getMaterias();
			$cursos = $Curso->getCursosIndex();
			$paralelos = $Paralelo->getParalelosIndex();
			$tot_preg = $row->tot_preg;
			$evaluacion = [
				"descripcion"=>$row->descrip,
				"materia"=>$materias[$row->codmat]["nombre"],
				"curso"=>$cursos[$row->codigo]["nombre"]." - ".$paralelos[$row->cod_par],
				"gestion"=>date("Y")
			];
			$result = $Evaluacion->get_preguntas($codexa);
			$preguntas = [];
			while ($row_preg = $result->fetch_object()) {
				$preguntas[] = $row_preg;
			}
			if(count($preguntas)<$tot_preg){
				echo json_encode(["status"=>"bancoIncomplet"]);
				exit();
			}
			$b = [];
			while (count($b) < $tot_preg) {
				$b[] = array_splice($preguntas, rand(0,count($preguntas)-1),1);
			}

			$response = [];
			foreach ($b as $r) {
				$response[] = [
					"pregunta"=>$r[0]->pregunta,
					"imagen"=>$r[0]->dir_imagen
				];
			}
			echo json_encode(["status"=>"ok","preguntas"=>$response,"evaluacion"=>$evaluacion]);
		}else{
			echo json_encode(["status"=>"noEval"]);
			exit();
		}
		
		break;
	default:
		echo "errorGET";
		break;
}
?>