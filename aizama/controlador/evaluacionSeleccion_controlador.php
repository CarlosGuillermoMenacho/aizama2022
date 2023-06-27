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
		   empty($codmat) || empty($nro_eva) || empty($preguntas) ||
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
		$visible = isset($_POST["visible"])?1:0;
		$notificar = isset($_POST["notificar"])?1:0;
		if(empty($codcur) || empty($codpar) ||
		   empty($codmat) || empty($nro_eva) || empty($preguntas) ||
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
		$id = $Evaluacion->save($gestion,$trimestre,$codmat,$codcur,$nro_eva,$descripcion,$fini,$ffin,$horaini,$horafin,$codusr,$fecha,$hora,$codpar,$preguntas,$visible);
		$Indicador->save($id,3,$indicador);
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
	default:
		echo "errorGET";
		break;
}
?>