<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
/*if(!cliente_activo()){
	echo "eSession";
	exit();
}*/
require_once'../modelo/conexion.php';
$db = Conectar::conexion();
if ($_GET) {
	switch ($_GET['op']){
		case 'get_calendario'://El obtendrá la lista de eventos o actividades del mes para un alumno
			$mes = isset($_POST['mes'])?$_POST['mes']:"";
			if(empty($mes)){
				$mes = date("m");//Mes actual
			}
			$codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
			if(empty($codalu))$codalu = $_SESSION['app_user_id'];
			$year = date("Y");

			require_once('../modelo/modelo_Alumno.php');
			require_once('../modelo/modelo_Evaluacion.php');
			require_once('../modelo/modelo_practico_digital.php');
			require_once('../modelo/modelo_actividad_curso.php');
			require_once('../modelo/modelo_eventos.php');
			require_once('../modelo/modelo_diasFestivos.php');

			$Alum = new Alumno($db);
			$datos_alumno = $Alum->getDatosAlumno($codalu);
			$codcur = $datos_alumno['codcur'];
			$codpar = $datos_alumno['codpar'];

			$Eval = new Evaluacion_Seleccion($db);
			$Prac = new PracticoDigital($db);
			$Act = new Actividad_curso($db);
			$Even = new Evento($db);
			$Fechas = new DiasFestivos($db);

			$lista_evaluaciones = $Eval->getEvaluacionesMes($year,$mes,$codcur,$codpar);
			$lista_practicos = $Prac->get_practicos_mes($codcur,$codpar,$mes,$year);
			$lista_actividades = $Act->getActividadesMes($codcur,$codpar,$mes,$year);
			$lista_eventos = $Even->get_eventos_mes($mes);
			$lista_fechasCivicas = $Fechas->getFechas($mes,$year);


			$res = array(
						"status"=>"ok",
						"evaluaciones"=>$lista_evaluaciones,
						"actividades"=>$lista_actividades,
						"eventos"=>$lista_eventos,
						"practicos"=>$lista_practicos,
						"fechas_civicas"=>$lista_fechasCivicas
						);
			echo json_encode($res);

			break;
		case 'calendario_profesor':
			$id_user = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($id_user)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$gestion = date("Y");
			
			require_once"../modelo/modelo_profesor.php";
			require_once"../modelo/modelo_practico_digital.php";
			require_once"../modelo/modelo_practico_web.php";
			require_once"../modelo/modelo_Evaluacion.php";
			require_once"../modelo/modelo_evaluacion_escrita.php";
			require_once"../modelo/modelo_evaluacion_mixta.php";
			require_once"../modelo/modelo_diasFestivos.php";
			require_once"../modelo/modelo_calendario.php";
			require_once"../modelo/modelo_curso.php";
			require_once"../modelo/modelo_paralelo.php";
			require_once"../modelo/modelo_materia.php";
			require_once"funciones.php";
			$Profesor = new Profesor($db);
			$PD = new PracticoDigital($db);
			$PW = new PracticoWeb($db);
			$ES = new Evaluacion_Seleccion($db);
			$EE = new EvaluacionEscrita($db);
			$EM = new Evaluacion_mixta($db);
			$DF = new DiasFestivos($db);
			$CA = new Calendario();
			$Curso = new Curso($db);
			$Paralelo = new Paralelo($db);
			$Materia = new Materia($db);
			$materias = $Materia->getMaterias();
			$paralelos = $Paralelo->getParalelosIndex();
			$cursos = $Curso->getCursosIndex();
			/*Obtener la lista de cursos y materias*/
			$result = $Profesor->get_cursos_prof($gestion,$id_user);
			$lista_curso_materia = [];
			if($result){
				while ($row = $result->fetch_object()) {
					$lista_curso_materia[] = [
						"codcur"=>$row->codcur,
						"codpar"=>$row->codpar,
						"codmat"=>$row->codmat,
						"curso"=>$cursos[$row->codcur]["nombre"]." - ".$paralelos[$row->codpar],
						"materia"=>$materias[$row->codmat]["nombre"]
					];
				}
			}
			/*Obtener la lista de practicos DIGITALES*/
			$result = $PD->get_practicos_prof($gestion,$id_user);
			$lista_practicos_digitales = [];
			if($result){
				while ($row = $result->fetch_object()) {
					$lista_practicos_digitales[] = [
						"id"=>$row->cod_cuest,
						"codcur"=>$row->cod_cur,
						"codpar"=>$row->cod_par,
						"codmat"=>$row->cod_mat,
						"descripcion"=>$row->descrip,
						"nro"=>$row->n_cuest==null?"":$row->n_cuest,
						"fecha"=>$row->fecha,
						"hora"=>$row->hora,
						"nota"=>$row->nota,
						"limite"=>$row->limite,
						"strtotime"=>strtotime("$row->fecha $row->hora"),
						"actividad"=>"Práctico Digital",
						"type"=>1,
						"curso"=>$cursos[$row->cod_cur]["nombre"]." - ".$paralelos[$row->cod_par],
						"materia"=>$materias[$row->cod_mat]["nombre"]
					];
				}
			}
			/*Obtener la lista de practicos WEB*/
			$result = $PW->get_practicos_prof($gestion,$id_user);
			$lista_practicos_web = [];
			if($result){
				while ($row = $result->fetch_object()) {
					$lista_practicos_web[] = [
						"id"=>$row->id,
						"codcur"=>$row->codcur,
						"codpar"=>$row->codpar,
						"codmat"=>$row->codmat,
						"descripcion"=>$row->descripcion,
						"fecha"=>$row->fecha,
						"hora"=>$row->hora,
						"editable"=>$row->editable,
						"nota"=>$row->nota,
						"strtotime"=>strtotime("$row->fecha $row->hora"),
						"actividad"=>"Práctico Web",
						"type"=>2,
						"curso"=>$cursos[$row->codcur]["nombre"]." - ".$paralelos[$row->codpar],
						"materia"=>$materias[$row->codmat]["nombre"]
					];
				}
			}
			/*Obtener la lista de evaluaciones SELECCION*/
			$result = $ES->get_all_evaluaciones_prof($gestion,$id_user);
			$lista_evaluaciones_seleccion = [];
			if($result){
				while ($row = $result->fetch_object()) {
					$lista_evaluaciones_seleccion[] = [
						"id"=>$row->id,
						"codexa"=>$row->codexa,
						"codmat"=>$row->codmat,
						"codcur"=>$row->codigo,
						"codpar"=>$row->cod_par,
						"nro"=>$row->codeva,
						"descripcion"=>$row->descrip,
						"fechaini"=>$row->f_inicio,
						"fechafin"=>$row->f_fin,
						"horaini"=>$row->horai,
						"horafin"=>$row->horaf,
						"preguntas"=>$row->tot_preg,
						"strtotime"=>strtotime("$row->f_inicio $row->horai"),
						"strtotimef"=>strtotime("$row->f_fin $row->horaf"),
						"actividad"=>"Evaluación de Selección",
						"type"=>3,
						"curso"=>$cursos[$row->codigo]["nombre"]." - ".$paralelos[$row->cod_par],
						"materia"=>$materias[$row->codmat]["nombre"]
					];
				}
			}
			/*Obtener la lista de evaluaciones ESCRITAS*/
			$result = $EE->get_evaluaciones_prof($gestion,$id_user);
			$lista_evaluaciones_escritas = [];
			if ($result) {
				while ($row = $result->fetch_object()) {
					$lista_evaluaciones_escritas[] = [
						"codexa"=>$row->id,
						"codcur"=>$row->codcur,
						"codpar"=>$row->codpar,
						"codmat"=>$row->codmat,
						"nro"=>$row->nro,
						"preguntas"=>$row->preguntas,
						"fechaini"=>$row->fecha_inicio,
						"fechafin"=>$row->fecha_fin,
						"tiempo"=>$row->tiempo,
						"fechai"=>substr($row->fecha_inicio, 0,10),
						"fechaf"=>substr($row->fecha_fin, 0,10),
						"horai"=>substr($row->fecha_inicio, 11),
						"horaf"=>substr($row->fecha_fin, 11),
						"descripcion"=>$row->descripcion,
						"visible"=>$row->completo,
						"nota"=>$row->nota,
						"strtotime"=>strtotime("$row->fecha_inicio"),
						"strtotimef"=>strtotime("$row->fecha_fin"),
						"actividad"=>"Evaluación Escrita",
						"type"=>4,
						"curso"=>$cursos[$row->codcur]["nombre"]." - ".$paralelos[$row->codpar],
						"materia"=>$materias[$row->codmat]["nombre"]
					];
				}
			}
			/*Obtener la lista de evaluaciones MIXTAS*/
			$result = $EM->get_evaluaciones_gestion_profesor($gestion,$id_user);
			$lista_evaluaciones_mixtas = [];
			if($result){
				while ($row = $result->fetch_object()) {
					$lista_evaluaciones_mixtas[] = [
						"codexa"=>$row->em_id,
						"nro"=>$row->em_nro,
						"codcur"=>$row->em_codcur,
						"codpar"=>$row->em_codpar,
						"codmat"=>$row->em_codmat,
						"inicio"=>$row->em_inicio,
						"fin"=>$row->em_fin,
						"fechai"=>substr($row->em_inicio, 0,10),
						"fechaf"=>substr($row->em_fin, 0,10),
						"horai"=>substr($row->em_inicio, 11),
						"horaf"=>substr($row->em_fin, 11),
						"nota"=>$row->em_nota,
						"preguntas"=>$row->em_preguntas,
						"banco"=>$row->em_banco,
						"descripcion"=>$row->em_descripcion,
						"tiempo"=>$row->em_tiempo,
						"visible"=>$row->em_visible,
						"strtotime"=>strtotime("$row->em_inicio"),
						"strtotime"=>strtotime("$row->em_fin"),
						"actividad"=>"Evaluación Mixta",
						"type"=>5,
						"curso"=>$cursos[$row->em_codcur]["nombre"]." - ".$paralelos[$row->em_codpar],
						"materia"=>$materias[$row->em_codmat]["nombre"]
					];
				}
			}
			$lista_dias_festivos = [];
			$result = $DF->get_all();
			if($result){
				while ($row = $result->fetch_object()) {
					$lista_dias_festivos[] = [
						"id"=>$row->id,
						"descripcion"=>$row->descripcion,
						"fecha"=>$gestion."-".$row->fecha
					];
				}
			}
			$hoy = [
				"mes" => date("n",strtotime(date("Y-m-d"))),
				"dia_mes"=>date("j",strtotime(date("Y-m-d"))),
				"dia_sem"=>date("N",strtotime(date("Y-m-d")))
			];
			echo json_encode(
				[
					"status"=>"ok",
					"data"=>[
						"curso_materias"=>$lista_curso_materia,
						"practicos_digitales"=>$lista_practicos_digitales,
						"practicos_web"=>$lista_practicos_web,
						"evaluaciones_seleccion"=>$lista_evaluaciones_seleccion,
						"evaluaciones_escritas"=>$lista_evaluaciones_escritas,
						"evaluaciones_mixtas"=>$lista_evaluaciones_mixtas,
						"dias_festivos"=>$lista_dias_festivos,
						"calendario"=>$CA->get_calendario($gestion),
						"hoy"=>$hoy
					]
				]
			);

			break;
		case 'calendario':
			$gestion = date("Y");
			require_once"../modelo/modelo_calendario.php";
			$CA = new Calendario();
			$hoy = [
				"mes" => date("n",strtotime(date("Y-m-d"))),
				"dia_mes"=>date("j",strtotime(date("Y-m-d"))),
				"dia_sem"=>date("N",strtotime(date("Y-m-d")))
			];
			echo json_encode(
				[
					"status"=>"ok",
					"data"=>[
						"calendario"=>$CA->get_calendario($gestion),
						"hoy"=>$hoy
					]
				]
			);
			break;
		case 'get_actividades_alu':
			$id_user = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($id_user)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$fecha_corta = "";
			$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
			if(empty($fecha))$fecha = date("Y-m-d");
			else {
				$fecha_corta = $fecha;
				$fecha = date("Y")."-".$fecha;
			}
			require_once"../modelo/modelo_planificacion.php";
			require_once"../modelo/modelo_Alumno.php";
			require_once"../modelo/modelo_materia.php";
			require_once"../modelo/modelo_practico_digital.php";
			require_once"../modelo/modelo_practico_web.php";
			require_once"../modelo/modelo_Evaluacion.php";
			require_once"../modelo/modelo_diasFestivos.php";
			require_once"../modelo/modelo_calendario_academico.php";
			$Alumno = new Alumno($db);
			$Materia = new Materia($db);
			$CA = new Calendario_Academico($db);
			$materias = $Materia->getMaterias();
			$PracticoDigital = new PracticoDigital($db);
			$PracticoWeb = new PracticoWeb($db);
			$Evaluacion_Seleccion = new Evaluacion_Seleccion($db);
			$DF = new DiasFestivos($db);
			$data_Alumno = $Alumno->getDatosAlumno($id_user);

			if(count($data_Alumno) == 0){
				echo json_encode(["status"=>"noPermitido"]);
				exit();
			}
			$codcur = $data_Alumno["codcur"];
			$codpar = $data_Alumno["codpar"];
			$gestion = date("Y");
			$Planificacion = new Planificacion($db);
			$result = $Planificacion->get_planificacion_curso_fecha($codcur,$codpar,$gestion,$fecha);
			$planificaciones = [];
			while ($row = $result->fetch_object()) {
				$planificaciones[] = [
					"actividad"=>$row->actividad,
					"complemento"=>$row->actividad_complementaria,
					"materia"=>$materias[$row->codmat]["nombre"],
					"p"=>$row->periodo,
					"periodo"=>json_decode($row->periodo)[0],
					"id"=>$row->id
				];
			}
			$result = $PracticoDigital->get_practicos_curso_fecha($codcur,$codpar,$fecha);
			$practicos = [];
			while ($row = $result->fetch_object()) {
				$practicos[] = [
					"descripcion"=>$row->descrip,
					"hora"=>substr($row->hora,0,5),
					"materia"=>$materias[$row->cod_mat]["nombre"],
					"tipo"=>"Práctico Digital"
				];
			}
			$result = $PracticoWeb->get_practicos_curso_fecha($codcur,$codpar,$fecha);
			while ($row = $result->fetch_object()) {
				$practicos[] = [
					"descripcion"=>$row->descripcion,
					"hora"=>substr($row->hora,0,5),
					"materia"=>$materias[$row->codmat]["nombre"],
					"tipo"=>"Práctico Web"
				];
			}
			$evaluaciones = [];
			$result = $Evaluacion_Seleccion->get_evaluacion_alumno_fecha($id_user,$codcur,$codpar,$fecha);
			while ($row = $result->fetch_object()) {
				$evaluaciones[] = [
					"descripcion"=>$row->descrip,
					"materia"=>$materias[$row->codmat]["nombre"],
					"estado"=>$row->realizado,
					"tipo"=>"Evaluación de selección"
				];
			}

			$result = $DF->get_fecha($fecha_corta);
			$dias_festivos = [];
			while ($row = $result->fetch_object()) {
				$dias_festivos[] = [
					"descripcion"=>$row->descripcion
				];
			}
			$result = $CA->get_fecha($fecha);
			$calendario_academico = [];
			while ($row = $result->fetch_object()) {
				$calendario_academico[] = [
					"descripcion"=>$row->descripcion,
					"file"=>$row->file
				];
			}
			echo json_encode([
				"status"=>"ok",
				"planificaciones"=>$planificaciones,
				"practicos"=>$practicos,
				"evaluaciones"=>$evaluaciones,
				"dias_festivos"=>$dias_festivos,
				"calendario_academico"=>$calendario_academico
			]);
			break;
		case 'get_actividades_familia':
			$id_user = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($id_user)){
				echo json_encode(["status"=>"eSession"]);
				exit();
			}
			$fecha_corta = "";
			$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
			if(empty($fecha))$fecha = date("Y-m-d");
			else {
				$fecha_corta = $fecha;
				$fecha = date("Y")."-".$fecha;
			}
			require_once"../modelo/modelo_planificacion.php";
			require_once"../modelo/modelo_Alumno.php";
			require_once"../modelo/modelo_materia.php";
			require_once"../modelo/modelo_practico_digital.php";
			require_once"../modelo/modelo_practico_web.php";
			require_once"../modelo/modelo_Evaluacion.php";
			require_once"../modelo/modelo_diasFestivos.php";
			require_once"../modelo/modelo_tutor.php";
			require_once"../modelo/modelo_calendario_academico.php";
			$Alumno = new Alumno($db);
			$Materia = new Materia($db);
			$Tutor = new Tutor($db);
			$alumnos = $Tutor->get_alumnoss($id_user);
			if(count($alumnos) == 0){
				echo json_encode(["status"=>"noAlumnos"]);
				exit();
			}
			$materias = $Materia->getMaterias();
			$PracticoDigital = new PracticoDigital($db);
			$PracticoWeb = new PracticoWeb($db);
			$Evaluacion_Seleccion = new Evaluacion_Seleccion($db);
			$DF = new DiasFestivos($db);
			$CA = new Calendario_Academico($db);
			$gestion = date("Y");
			$Planificacion = new Planificacion($db);
			$datos = [];
			foreach ($alumnos as $alu) {
				$data_Alumno = $Alumno->getDatosAlumno($alu["codalu"]);
				$codcur = $data_Alumno["codcur"];
				$codpar = $data_Alumno["codpar"];
				$result = $Planificacion->get_planificacion_curso_fecha($codcur,$codpar,$gestion,$fecha);
				$planificaciones = [];
				while ($row = $result->fetch_object()) {
					$planificaciones[] = [
						"actividad"=>$row->actividad,
						"complemento"=>$row->actividad_complementaria,
						"materia"=>$materias[$row->codmat]["nombre"],
						"p"=>$row->periodo,
						"periodo"=>json_decode($row->periodo)[0],
						"id"=>$row->id
					];
				}
				$result = $PracticoDigital->get_practicos_curso_fecha($codcur,$codpar,$fecha);
				$practicos = [];
				while ($row = $result->fetch_object()) {
					$practicos[] = [
						"descripcion"=>$row->descrip,
						"hora"=>substr($row->hora,0,5),
						"materia"=>$materias[$row->cod_mat]["nombre"],
						"tipo"=>"Práctico Digital"
					];
				}
				$result = $PracticoWeb->get_practicos_curso_fecha($codcur,$codpar,$fecha);
				while ($row = $result->fetch_object()) {
					$practicos[] = [
						"descripcion"=>$row->descripcion,
						"hora"=>substr($row->hora,0,5),
						"materia"=>$materias[$row->codmat]["nombre"],
						"tipo"=>"Práctico Web"
					];
				}
				$evaluaciones = [];
				$result = $Evaluacion_Seleccion->get_evaluacion_alumno_fecha($alu["codalu"],$codcur,$codpar,$fecha);
				while ($row = $result->fetch_object()) {
					$evaluaciones[] = [
						"descripcion"=>$row->descrip,
						"materia"=>$materias[$row->codmat]["nombre"],
						"estado"=>$row->realizado,
						"tipo"=>"Evaluación de selección"
					];
				}
				$datos[] = [
					"codalu"=>$alu["codalu"],
					"planificaciones"=>$planificaciones,
					"practicos"=>$practicos,
					"evaluaciones"=>$evaluaciones,
				];
			}

			$result = $DF->get_fecha($fecha_corta);
			$dias_festivos = [];
			while ($row = $result->fetch_object()) {
				$dias_festivos[] = [
					"descripcion"=>$row->descripcion
				];
			}
			$result = $CA->get_fecha($fecha);
			$calendario_academico = [];
			while ($row = $result->fetch_object()) {
				$calendario_academico[] = [
					"descripcion"=>$row->descripcion,
					"file"=>$row->file
				];
			}
			echo json_encode([
				"status"=>"ok",
				"actividades"=>$datos,
				"alumnos"=>$alumnos,
				"dias_festivos"=>$dias_festivos,
				"calendario_academico"=>$calendario_academico
			]);
			break;
		default:
			echo "errorOP";
			break;
	}
}else{
	echo "errorGet";
}