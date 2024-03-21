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
	case 'delete_examen':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codexa = isset($_POST["codexa"])?$_POST["codexa"]:"";
		$codalu = isset($_POST["codalu"])?$_POST["codalu"]:"";
		if(empty($codexa)||empty($codalu)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$EV = new Evaluacion_Seleccion($db);
		$EV->delete_examen($codexa,$codalu);
		echo json_encode(["status"=>"ok"]);
		break;
	case 'save_calificaciones':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codexa = isset($_POST["codexa"])?$_POST["codexa"]:"";
		$alumnos = isset($_POST["alumno"])?$_POST["alumno"]:"";
		$notas = isset($_POST["nota"])?$_POST["nota"]:"";
		if(empty($codexa)||empty($alumnos)||empty($notas)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$EV = new Evaluacion_Seleccion($db);
		for ($i=0; $i < count($alumnos); $i++) {
			$codalu = $alumnos[$i];
			$result = $EV->get_calificacion($codalu,$codexa);
			$row = $result->fetch_object();
			$n = $row->nota;
			$nota = $notas[$i];
			if($n != $nota && $nota <= 100){
				if($n == null)$EV->calificar($codexa,$codalu,$nota);
				else {
					$result = $EV->get_respuestas($codalu,$codexa);
					$respuestas = [];
					while ($row = $result->fetch_object()) {
						$respuestas[] = $row;
					}
					if(count($respuestas) == 1){
						$id = $respuestas[0]->id;
						if (empty($nota))$nota = null;
						$EV->set_nota($id,$nota);
					}
				}
			}
			
		}
		echo json_encode(["status"=>"ok"]);
		break;
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
		$preguntas =  isset($_POST["preguntas"])?$_POST["preguntas"]:0;
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
		if($visible == 1){
			$result = $Evaluacion->get_n_preguntas($codexa);
			$row = $result->fetch_object();
			if($row->total < $preguntas){
				echo json_encode(["status"=>"noVisible"]);
				exit();
			}
		}
		$fecha = date("Y-m-d");
		$hora = date("H-i-s");
		$Evaluacion->update($codexa,$nro_eva,$descripcion,$fini,$horaini,$ffin,$horafin,$codusr,$fecha,$hora,$preguntas,$visible);
		$nota = $preguntas == 5?20:10;
		$Evaluacion->set_notas_preguntas($codexa,$nota);
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
		echo json_encode(["status"=>"ok","codpre"=>$codpreg]);
		break;
	case 'update_pregunta':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codpre = isset($_POST["codpre"])?$_POST["codpre"]:"";
		$descripcion = isset($_POST["descripcion"])?$_POST["descripcion"]:"";
		$options = isset($_POST["text-option"])?$_POST["text-option"]:"";
		$tiempo = isset($_POST["tiempo"])?$_POST["tiempo"]:"";
		$img = isset($_POST["img"])?$_POST["img"]:"";
		$respuesta = isset($_POST["opcion"])?$_POST["opcion"]:"";

		if(empty($codpre) || empty($descripcion) || empty($options) || empty($tiempo) || empty($respuesta)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		if(count($options) < 2){
			echo json_encode(["status"=>"errorOptions"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$EV = new Evaluacion_Seleccion($db);
		$fecha = date("Y-m-d");
		$hora = date("H:i:s");
		if(count($options) < 2){
			echo json_encode(["status"=>"errorOptions"]);
			exit();
		}
		if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])){
			$ext=explode(".",$_FILES["imagen"]["name"]);
			if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png"){
				
				$fichero="../resources/";
				$img=$codusr."-".strtotime(date("Y-m-d H:i:s")).".".end($ext);								
				$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$img);
			}
		}

		$EV->update_pregunta($codpre,$descripcion,$respuesta,$tiempo,$codusr,$fecha,$hora,$img);
		$result = $EV->get_opciones($codpre);
		$opciones = [];
		while ($row = $result->fetch_object()) {
			$opciones[] = $row;
		}
		if(count($options) > count($opciones)){
			for ($i=0; $i < count($opciones); $i++) { 
				$EV->update_opcion($codpre,$i+1,$options[$i]);
			}
			$index = count($opciones);
			for ($i=$index; $i < count($options); $i++) { 
				$EV->save_opcion($codpre,$i+1,$options[$i]);
			}
		}
		if(count($options) == count($opciones)){
			for ($i=0; $i < count($opciones); $i++) { 
				$EV->update_opcion($codpre,$i+1,$options[$i]);
			}
		}
		if(count($options) < count($opciones)){
			for ($i=0; $i < count($options); $i++) { 
				$EV->update_opcion($codpre,$i+1,$options[$i]);
			}
			$index = count($options);
			for ($i=$index; $i < count($opciones); $i++) { 
				$EV->delete_opcion($codpre,$i+1);
			}
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
	case 'delete_pregunta':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codpreg =  isset($_POST["codpreg"])?$_POST["codpreg"]:"";
		if(empty($codpreg)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$Evaluacion->delete_pregunta($codpreg);
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
	case 'get_pregunta':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codpreg =  isset($_POST["codpre"])?$_POST["codpre"]:"";
		if(empty($codpreg)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$result = $Evaluacion->get_pregunta($codpreg);
		if ($row = (array)$result->fetch_object()) {	
			$result = $Evaluacion->get_opciones($codpreg);
			$op = [];
			while ($rowOP = $result->fetch_object()) {
				$op[] = $rowOP;
			}
			$row["opciones"] = $op;
			echo json_encode(["status"=>"ok","data"=>$row]);
		}else{
			echo json_encode(["status"=>"noPreg"]);
		}
		break;
	case 'get_calificaciones':
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
		require_once"../modelo/modelo_curso.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$result = $Evaluacion->get_evaluacion_by_codexa($codexa);
		if($row = $result->fetch_object()){
			$codcur = $row->codigo;
			$codpar = $row->cod_par;
			$Curso = new Curso($db);
			$result = $Curso->get_lista($codcur,$codpar);
			$lista_alumnos = [];
			while ($row = $result->fetch_object()) {
				$r_calif = $Evaluacion->get_calificacion($row->codigo,$codexa);
				$r_resp = $Evaluacion->get_respuestas($row->codigo,$codexa);
				$estado = 0;
				if($row_resp = $r_resp->fetch_object()){
					if($row_resp->codpre != null){
						$estado = 1;//Hizo el examen en plataforma
					}else{
						$estado == 2;//Fue calificado por el profesor
					}
				}
				$row_calif = $r_calif->fetch_object();
				$lista_alumnos[] = [
					"codalu"=>$row->codigo,
					"nombre"=>"$row->paterno $row->materno $row->nombres",
					"nota"=>$row_calif->nota,
					"estado"=>$estado
				];
			}
			echo json_encode(["status"=>"ok","data"=>$lista_alumnos]);
		}else{
			echo json_encode(["status"=>"noEval"]);
		}
		break;
	case 'get_respuestas':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codalu =  isset($_POST["codalu"])?$_POST["codalu"]:"";
		$codexa =  isset($_POST["codexa"])?$_POST["codexa"]:"";
		if(empty($codalu) || empty($codexa)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}
		require_once"../modelo/modelo_Evaluacion.php";
		require_once"../modelo/modelo_Alumno.php";
		require_once"../modelo/modelo_curso.php";
		require_once"../modelo/modelo_paralelo.php";
		require_once"../modelo/modelo_materia.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$Alumno = new Alumno($db);
		$Materia = new Materia($db);
		$Curso = new Curso($db);
		$Paralelo = new Paralelo($db);
		$cursos = $Curso->getCursosIndex();
		$paralelos = $Paralelo->getParalelosIndex();
		$materias = $Materia->getMaterias();
		$row = (object) $Alumno->getDatosAlumno($codalu);
		$nombre = $row->nombre;
		$curso = $cursos[$row->codcur]["nombre"]." - ".$paralelos[$row->codpar];
		$result = $Evaluacion->get_evaluacion_by_codexa($codexa);
		$evaluacion = "";
		$materia = "";
		if($row = $result->fetch_object()){
			$evaluacion = $row->descrip;
			$materia = $materias[$row->codmat]["nombre"];			
		}else{
			echo json_encode(["status"=>"noEval"]);
			exit();
		}
		$result = $Evaluacion->get_respuestas($codalu,$codexa);
		$respuestas = [];
		$nota = 0;
		while ($row = $result->fetch_object()) {
			$result_op = $Evaluacion->get_opciones($row->codpre);
			$opciones = [];
			while ($row_op = $result_op->fetch_object()) {
				$opciones[] = [
					"opcion"=>$row_op->opcion,
					"n_op"=>$row_op->n_opcion
				];
			}
			$nota = $nota + $row->nota;
			$respuestas[] = [
				"imagen"=>$row->dir_imagen,
				"horai"=>$row->hora_ini,
				"horaf"=>$row->hora_fin,
				"nota"=>$row->nota,
				"pregunta"=>$row->pregunta,
				"opcion"=>$row->respuesta,
				"respuesta"=>$row->surespuest,
				"opciones"=>$opciones
				
			];
		}
		echo json_encode(["status"=>"ok","data"=>$respuestas,"evaluacion"=>$evaluacion,"alumno"=>$nombre,"curso"=>$curso,"materia"=>$materia,"nota"=>$nota]);
		break;
	case 'get_evaluaciones':
		$codusr = $_SESSION["app_user_id"];
		if(empty($codusr)){
			echo json_encode(["status"=>"eSession"]);
			exit();
		}
		$codcur =  isset($_POST["codcur"])?$_POST["codcur"]:"";
		$codpar =  isset($_POST["codpar"])?$_POST["codpar"]:"";
		$codmat =  isset($_POST["codmat"])?$_POST["codmat"]:"";
		if(empty($codcur) || empty($codpar) || empty($codmat)){
			echo json_encode(["status"=>"errorParam"]);
			exit();
		}

		require_once"../modelo/modelo_Evaluacion.php";
		require_once"../modelo/modelo_evaluacion_escrita.php";
		require_once"../modelo/modelo_evaluacion_mixta.php";
		$Evaluacion = new Evaluacion_Seleccion($db);
		$EE = new EvaluacionEscrita($db);
		$EM = new Evaluacion_mixta($db);
		$gestion = date("Y");
		$result = $Evaluacion->get_evaluaciones_gestion_materia($gestion,$codcur,$codpar,$codmat);
		$evaluaciones = [];
		while ($row = $result->fetch_object()) {
			$realizados = 0;
			$no_realizado = 0;
			$banco = $row->banco;
			if($row->tipo == 1){
				if($banco == ""){
					$result_banco = $Evaluacion->get_n_preguntas($row->id);
					$banco = $result_banco->fetch_object()->total;					
				}
				$res_realizado = $Evaluacion->evaluacion_realizada($row->id,$codcur,$codpar);
				$realizados = $res_realizado->fetch_object()->total;
				$res_no_realizado = $Evaluacion->evaluacion_no_realizada($row->id,$codcur,$codpar);
				$no_realizado = $res_no_realizado->fetch_object()->total;
			}
			if($row->tipo == 2){
				if($banco == ""){
					$result_banco = $EE->get_n_preguntas($row->id);
					$banco = $result_banco->fetch_object()->total;					
				}
				$res_realizado = $EE->evaluacion_realizada($row->id,$codcur,$codpar);
				$realizados = $res_realizado->fetch_object()->total;
				$res_no_realizado = $EE->evaluacion_no_realizada($row->id,$codcur,$codpar);
				$no_realizado = $res_no_realizado->fetch_object()->total;
			}
			if($row->tipo == 3){
				$res_realizado = $EM->evaluacion_realizada($row->id,$codcur,$codpar);
				$realizados = $res_realizado->fetch_object()->total;
				$res_no_realizado = $EM->evaluacion_no_realizada($row->id,$codcur,$codpar);
				$no_realizado = $res_no_realizado->fetch_object()->total;
			}
			$evaluaciones[] = [
				"banco"=>$banco,
				"descripcion"=>$row->descripcion,
				"registro"=>$row->fecha,
				"fi"=>substr($row->fi,0,10),
				"ff"=>substr($row->ff,0,10),
				"hi"=>substr($row->fi,11,5),
				"hf"=>substr($row->ff,11,5),
				"id"=>$row->id,
				"nota"=>$row->nota,
				"preguntas"=>$row->preguntas,
				"tiempo"=>$row->tiempo,
				"tipo"=>$row->tipo,
				"tipo_nombre"=>$row->tipo_nombre,
				"trimestre"=>$row->trimestre,
				"realizados"=>$realizados,
				"pendientes"=>$no_realizado
			];
		}
		echo json_encode(["status"=>"ok","evaluaciones"=>$evaluaciones]);
		break;
	default:
		echo "errorGET";
		break;
}
?>