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
	case 'save_evaluacion_alumno':
        $codeva= isset($_POST['codeva'])? $_POST['codeva']:"";
		if(empty($codeva)){
			echo "errorParam";
			exit();
		}
        $fechaActual=date("Y-m-d H:i:s");
        $fechaFin = strtotime('+'.$time.' minute',strtotime($fechaActual));
        $ffin = date("Y-m-d H:i:s",$fechaFin);
        $notafinal="";
        $codalu = $_SESSION['app_user_id'];
        require('../modelo/modelo_em_alumno.php');
        $alumno = new em_alumno($db);
        $evaluacion= $alumno->save_evaluacion_alumno($codalu, $codeva,$fechaini, $fechafin, $notafinal);
        break;

	case 'get_eval_proceso':
			$codalu = $_SESSION['app_user_id'];
			if(empty($codalu)){
				echo "errorParam";
				exit();
			}
			require('../modelo/modelo_em_alumno.php');
			$alumno = new em_alumno($db);
			$fechaActual = date("Y-m-d H:i:s");
			$lista_proceso=$alumno->get_eval_proceso($codalu);
			$lista = array();
			if (!empty($lista_proceso)) {
				foreach ($lista_proceso as $proceso) {
					$lista[]=array(
							"id"=> $proceso['id'],
							"codalu"=> $proceso['codalu'],
							"codeva"=>  $proceso['codeva'],
							"fechaini"=> $proceso['fechaini'],
							"fechafin"=> $proceso['fechafin'],
							"notafinal"=> $proceso['notafinal'],
							"proceso"=> $proceso['proceso'],
							"estado"=> $proceso['estado']
					);
					$id = $proceso['id'];
					$fechafin =  $proceso['fechafin'];
					$codeva = $proceso['codeva'];
					if(strtotime($fechaActual)<strtotime($fechafin)){
						echo $codeva;
						exit();
					}else{
						$alumno->finalizar($id,$codalu,$codeva);
						echo "sinproceso";
						exit();
					}
				}
			}else{
				echo "sinproceso";
				exit();
			}
			//echo json_encode(array("status"=>"ok","lista_alumnos"=>$lista));
		break;

	case 'get_id_eval_proceso':
		$codalu = $_SESSION['app_user_id'];
			if(empty($codalu)){
				echo "errorParam";
				exit();
			}
			require('../modelo/modelo_em_alumno.php');
			require('../modelo/modelo_evaluacion_mixta.php');
			require('../modelo/modelo_materia.php');
			$materia = new Materia($db);
			$evaluaciones =  new Evaluacion_mixta($db);
			$alumno = new em_alumno($db);
			$fechaActual = date("Y-m-d H:i:s");
			$lista_proceso=$alumno->get_eval_proceso($codalu);
			
			$lista = array();
				if (!empty($lista_proceso)) {
					foreach ($lista_proceso as $proceso) {
						$id = $proceso['id'];
						$fechafin =  $proceso['fechafin'];
						$codeva = $proceso['codeva'];
						
						$detalle_Eva = $evaluaciones->get_detalle_Eva($codeva);
						foreach ($detalle_Eva as $det) {
							$codmat= $det['codmat'];
							$nombre_materia=$materia->getNameMateria($codmat);
						}
		
						if(strtotime($fechaActual)<strtotime($fechafin)){
							$tiempo_restante = strtotime($fechafin) - strtotime($fechaActual);
							echo json_encode(array(
								"status"=>"ok",
								"resta"=>$tiempo_restante,
								"materia"=>$nombre_materia,
								"id_eval"=>$id,
								"info"=>$detalle_Eva
							));
							exit();
						}else{
							$alumno->finalizar($id,$codalu,$codeva);
							echo json_encode(array("status"=>"evalFinalizada"));
							exit();
						}
					}
				}else{
					echo json_encode(array("status"=>"noEval"));
					exit();
				}
		break;

		case 'FinalizarEvaluacion':
			$idaem= isset($_POST['idaem'])? $_POST['idaem']:"";
			if(empty($idaem)){
				echo "errorParam";
				exit();
			}			
			require('../modelo/modelo_em_alumno.php');
			$alumno = new em_alumno($db);
			if ($alumno->finalizarEvaluacion($idaem)) {
				echo "ok";
			}else{
				echo "error";
			}
			break;

		case 'EliminarEvaluacion':
			$idaem= isset($_POST['idaem'])? $_POST['idaem']:"";
			if(empty($idaem)){
				echo "errorParam";
				exit();
			}			
			require('../modelo/modelo_em_alumno.php');
			$alumno = new em_alumno($db);
			if ($alumno->eliminar_em_alumno($idaem)) {
				echo "ok";
			}else{
				echo "error";
			}
			break;

		case 'ver_evaluacion':// el alumno revisa las respuesta de su examen
			$fechaActual = date("Y-m-d H:i:s");
			$codalu = $_SESSION['app_user_id'];
			$codeva = isset($_POST['id'])?$_POST['id']:"";
			if (empty($codeva)) {
				echo "errorParam";
				exit();
			}
			require('../modelo/modelo_em_alumno.php');
			require('../modelo/modelo_evaluacion_mixta.php');
			require('../modelo/modelo_materia.php');
			$materia = new Materia($db);
			$evaluaciones =  new Evaluacion_mixta($db);
			$alumno = new em_alumno($db);
            //Obteniendo la evaluacion en proceso
			$detalle_proc= $alumno->get_eva_alumno($codalu, $codeva);
			
			if (!empty($detalle_proc)) {
				//foreach ($detalle_proc as $proceso) {

					//echo json_encode($proceso);
					/*$lista[]=array(
							"id"=> $proceso['id'],
							"codalu"=> $proceso['codalu'],
							"codeva"=>  $proceso['codeva'],
							"fechaini"=> $proceso['fechaini'],
							"fechafin"=> $proceso['fechafin'],
							"notafinal"=> $proceso['notafinal'],
							"proceso"=> $proceso['proceso'],
							"estado"=> $proceso['estado']
					);*/
					$id = $detalle_proc['id'];
					$fechafin =  $detalle_proc['fechafin'];
					$codeva = $detalle_proc['codeva'];
					/*$id = $proceso['id'];
					$fechafin =  $proceso['fechafin'];
					$codeva = $proceso['codeva'];*/
					$tiempo_restante = strtotime($fechafin) - strtotime($fechaActual);
					$detalle_Eva = $evaluaciones->get_detalle_Eva($codeva);
					foreach ($detalle_Eva as $det) {
						$codmat= $det['codmat'];
						$nombre_materia=$materia->getNameMateria($codmat);
					}
						echo json_encode(array(
							"status"=>"ok",
							"resta"=>$tiempo_restante,
							"materia"=>$nombre_materia,
							"id_eval"=>$id,
							"info"=>$detalle_Eva
						));
						exit();	
				//}
			}else{
				echo json_encode(array("status"=>"noEval"));
				exit();
			}   
			break;
		case 'update_notas':
			$codprof = $_SESSION['app_user_id'];
			if(empty($codprof)){
				echo "eSession";
				exit();
			}
			$fechaActual = date("Y-m-d H:i:s");
			$datos =json_decode($_POST['data']);
			if ($datos == null) {
				echo "errorData";
				exit();
			}

			require_once'../modelo/modelo_em_alumno.php';
			$evaluacion_alumno = new em_alumno($db);
			$evaluacion_alumno->update_notas($datos,$codprof,$fechaActual);
			echo "ok";
			break;
//--------------------------------		
	default:
		echo "ErrorOP";
	break;
}
?>