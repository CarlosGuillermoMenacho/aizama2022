<?php 
session_start();
require '../includes/functions.php';
header("Content-type:text/html;charset=utf-8");
header('Access-Conotrol-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

if ($_GET) {
	switch ($_GET['op']) {
		case 'get_rol_de_examen':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}

			$trimestre = isset($_SESSION['app_user_bimestre'])?$_SESSION['app_user_bimestre']:"";
			if(empty($trimestre)){
				echo json_encode(array("status"=>"eTrimestre"));
				exit();
			}

			$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
			$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
			$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
			if(empty($codcur)||empty($codpar)||empty($codmat)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}

			$gestion = date("Y");

			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once'../modelo/rol_de_examen_modelo.php';
			$Rol = new Rol_de_Examen($db);
			$result = $Rol->get_rol_curso_materia($gestion,$trimestre,$codcur,$codpar,$codmat);
			$response = [];
			while ($fetch = $result->fetch_object()) {
				$response[] = $fetch;
			}
			if(count($response) > 0){
				echo json_encode(array("status"=>"ok","data"=>$response));
			}else{
				echo json_encode(array("status"=>"noData"));
				exit();
			}

			break;
		case 'save_new':
		    $codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}
			$trimestre = isset($_SESSION['app_user_bimestre'])?$_SESSION['app_user_bimestre']:"";
			if(empty($trimestre)){
				echo json_encode(array("status"=>"eTrimestre"));
				exit();
			}	
			$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
			$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
			$codmat = isset($_POST['codmat'])?$_POST['codmat']:"";
			$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
			$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
			$hora = isset($_POST['hora'])?$_POST['hora']:"";
			if(empty($codcur)||empty($codpar)||empty($codmat)||
			   empty($descripcion)||empty($fecha)||empty($hora)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$gestion = date("Y");
			$fechareg = date("Y-m-d H:i:s");
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once'../modelo/rol_de_examen_modelo.php';
			$Rol = new Rol_de_Examen($db);
			$result = $Rol->save($gestion,$trimestre,$codcur,$codpar,$codmat,$descripcion,$fecha,$hora,$fechareg,$codusr);
			echo json_encode(array("status"=>"ok"));
		    	break; 
		case 'delete_rol':
		   	$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}
			$id = isset($_POST['id'])?$_POST['id']:"";
			if(empty($id)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$fechareg = date("Y-m-d H:i:s");
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once'../modelo/rol_de_examen_modelo.php';
			$Rol = new Rol_de_Examen($db);
			$result = $Rol->delete_rol($id,$fechareg,$codusr);
			echo json_encode(array("status"=>"ok"));
		   	break;   
		case 'update_rol':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}
			$id = isset($_POST['id'])?$_POST['id']:"";
			$descripcion = isset($_POST['descripcion'])?$_POST['descripcion']:"";
			$fecha = isset($_POST['fecha'])?$_POST['fecha']:"";
			$hora = isset($_POST['hora'])?$_POST['hora']:"";
			if(empty($id)||empty($descripcion)||empty($fecha)||empty($hora)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$fechareg = date("Y-m-d H:i:s");
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once'../modelo/rol_de_examen_modelo.php';
			$Rol = new Rol_de_Examen($db);
			$result = $Rol->update_rol($id,$descripcion,$fecha,$hora,$fechareg,$codusr);
			echo json_encode(array("status"=>"ok"));

			break;
		case 'get_rol_alu':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}
			$trimestre = isset($_SESSION['app_user_bimestre'])?$_SESSION['app_user_bimestre']:"";
			if(empty($trimestre)){
				echo json_encode(array("status"=>"eTrimestre"));
				exit();
			}
			$gestion = date("Y");

			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once'../modelo/modelo_Alumno.php';
			$Alumno = new Alumno($db);
			$result = $Alumno->getDatosAlumno($codusr);
			if(count($result) == 0){
				echo json_encode(array("status"=>"noAlumno"));
				exit();
			}
			$codcur = $result['codcur'];
			$codpar = $result['codpar'];
			require_once'../modelo/rol_de_examen_modelo.php';
			$Rol = new Rol_de_Examen($db);
			$result = $Rol->get_rol_curso($gestion,$trimestre,$codcur,$codpar);
			require_once'../modelo/modelo_materia.php';
			$Materia = new Materia($db);
			$materias = $Materia->getMaterias();
			$response = [];
			require_once'funciones.php';
			while ($fetch = $result->fetch_object()) {
				$name_materia = $materias[$fetch->codmat]['nombre'];
				$descripcion = $fetch->descripcion;
				$fecha = $fetch->fecha;
				$hora = substr($fetch->hora, 0,5);
				$dia = getdialiteral($fecha);
				$response[] = [$name_materia,$descripcion,$dia,$fecha,$hora];
			}

			if(count($response) > 0){
				echo json_encode(array("status"=>"ok","data"=>$response));
			}else{
				echo json_encode(array("status"=>"noData"));
				exit();
			}
			break;
		case 'get_rol_tut':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}
			$trimestre = isset($_SESSION['app_user_bimestre'])?$_SESSION['app_user_bimestre']:"";
			if(empty($trimestre)){
				echo json_encode(array("status"=>"eTrimestre"));
				exit();
			}
			$codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
			
			if(empty($codalu)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$gestion = date("Y");

			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once"../modelo/modelo_tutor.php";
			$Tutor = new Tutor($db);
			if(!$Tutor->es_tutor($codusr,$codalu)){
				echo json_encode(["status"=>"noTutor"]);
				exit();
			}
			require_once'../modelo/modelo_Alumno.php';
			$Alumno = new Alumno($db);
			$result = $Alumno->getDatosAlumno($codalu);
			if(count($result) == 0){
				echo json_encode(array("status"=>"noAlumno"));
				exit();
			}
			$codcur = $result['codcur'];
			$codpar = $result['codpar'];
			require_once'../modelo/rol_de_examen_modelo.php';
			$Rol = new Rol_de_Examen($db);
			$result = $Rol->get_rol_curso($gestion,$trimestre,$codcur,$codpar);
			require_once'../modelo/modelo_materia.php';
			$Materia = new Materia($db);
			$materias = $Materia->getMaterias();
			$response = [];
			require_once'funciones.php';
			while ($fetch = $result->fetch_object()) {
				$name_materia = $materias[$fetch->codmat]['nombre'];
				$descripcion = $fetch->descripcion;
				$fecha = $fetch->fecha;
				$hora = substr($fetch->hora, 0,5);
				$dia = getdialiteral($fecha);
				$response[] = [$name_materia,$descripcion,$dia,$fecha,$hora];
			}

			if(count($response) > 0){
				echo json_encode(array("status"=>"ok","data"=>$response));
			}else{
				echo json_encode(array("status"=>"noData"));
				exit();
			}
			break;
		case 'get_rol_adm':
			$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codusr)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}
			$trimestre = isset($_SESSION['app_user_bimestre'])?$_SESSION['app_user_bimestre']:"";
			if(empty($trimestre)){
				echo json_encode(array("status"=>"eTrimestre"));
				exit();
			}
			$codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
			$codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
			
			if(empty($codcur)||empty($codpar)){
				echo json_encode(["status"=>"errorParam"]);
				exit();
			}
			$gestion = date("Y");
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once'../modelo/rol_de_examen_modelo.php';
			$Rol = new Rol_de_Examen($db);
			$result = $Rol->get_rol_curso($gestion,$trimestre,$codcur,$codpar);
			require_once'../modelo/modelo_materia.php';
			$Materia = new Materia($db);
			$materias = $Materia->getMaterias();
			$response = [];
			require_once'funciones.php';
			while ($fetch = $result->fetch_object()) {
				$name_materia = $materias[$fetch->codmat]['nombre'];
				$descripcion = $fetch->descripcion;
				$fecha = $fetch->fecha;
				$hora = substr($fetch->hora, 0,5);
				$dia = getdialiteral($fecha);
				$response[] = [$name_materia,$descripcion,$dia,$fecha,$hora];
			}

			if(count($response) > 0){
				echo json_encode(array("status"=>"ok","data"=>$response));
			}else{
				echo json_encode(array("status"=>"noData"));
				exit();
			}

			break;
		default:
			echo "errorOP";
			break;
	}
}else{
echo "errorGET";
}
?>
	