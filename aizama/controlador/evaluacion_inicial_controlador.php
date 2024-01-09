<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
//require_once"../session_verify.php";

if(!cliente_activo()){
	echo json_encode(["status" => "eSession"]);
	exit();
}
switch ($_GET['op']) {
	case 'get_evaluaciones_alu':
	    $user = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
	    if(empty($user)){
	    	echo json_encode(["status"=>"eSession"]);
	    	exit();
	    }
		$trimestre = isset($_SESSION["app_user_bimestre"])?$_SESSION["app_user_bimestre"]:"";
		if(empty($trimestre)){
			echo json_encode(["status"=>"eTrimestre"]);
	    	exit();
		}
	    require_once'../modelo/conexion.php';
	    require_once"../modelo/modelo_Alumno.php";
	    require_once'../modelo/modelo_evaluacion_inicial.php';
		$db = Conectar::conexion();	
		$Alumno = new Alumno($db); 
		$datos = (object) $Alumno->getDatosAlumno($id);

		if(empty($datos)){
			echo json_encode(["status"=>"noAlumno"]);
	    	exit();
		}
	    $codcur = $datos->codcur;
	    $cdopar = $datos->codpar;
	    $gestion = date("Y");
	    $Evaluacion = new Evaluacion_inicial($db);
	    $result = $Evaluacion->get_all_trimestre_curso($gestion,$trimestre,$codcur,$codpar);
	    $evaluaciones = [];
	    $date = date("Y-m-d H:i:s");
	    $datetime = strtotime($date);
	    while ($row = $result->fetch_object()) {
	    	$visible = $row->visible;
	    	if($visible == 1){
	    		$estado = 0;//La evaluación estará disponible para realizar
	    		$id = $row->id;
	    		$timeout = $row->fueradetiempo;
	    		$inicio = strtotime($row->inicio);
	    		$fin = strtotime($row->fin);
	    		if(($datetime >= $inicio && $timeout == 1)||($datetime >= $inicio && $datetime < $fin))$estado = 1;//La evaluación se puede realizar
	    		$result2 = $Evaluacion->get_evaluacion_alumno($user,$id);
	    		if($row2 = $result2->fetch_object()){
	    			$proceso = $row2->proceso;
	    			if($proceso == 1 && $timeout == 1 || $proceso == 1 && $datetime < $fin)$estado = 2;//La evaluación está iniciada y puede ingresar
	    			if($proceso == 0)$estado = 3; //La evaluación está realizada y finalizada
	    		}else{
	    			if($timeout == 0 && $datetime > $fin)$estado = 4;//Ya no se puede realizar la evaluación
	    		}	    		

		    	$evaluaciones[] = [
		    		"codeva"=>$id,
		    		"descripcion"=>$row->descripcion,
		    		"estado"=>$estado,
		    		"inicio"=>$row->inicio,
		    		"fin"=>$timeout==0?$row->fin:""
		    	];
	    	}
	    }
	    echo json_encode(["status"=>"ok","evaluaciones"=>$evaluaciones]);
	    break;
	   case 'evaluar':
	   		$user = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
	    if(empty($user)){
	    	echo json_encode(["status"=>"eSession"]);
	    	exit();
	    }
		$codeva = isset($_POST["codeva"])?$_POST["codeva"]:"";
		if(empty($codeva)){
			echo json_encode(["status"=>"errorParam"]);
	    	exit();
		}
		require_once'../modelo/conexion.php';
		require_once'../modelo/modelo_evaluacion_inicial.php';
		$db = Conectar::conexion();
		$Evaluacion = new Evaluacion_inicial($db);
		$result = $Evaluacion->get_evaluacion_en_proceso($user);
		if($row = $result->fetch_object()){
			$id = $row->id_evaluacion;
			if($codeva != $id){
				echo json_encode(["status"=>"evalProceso","codeva"=>$id]);
	    		exit();
			}	
		}
		$result2 = $Evaluacion->get_evaluacion($codeva);
		if($row2 = $result->fetch_object()){
			$datetime =strtotime(date("Y-m-d H:i:s"));
			$inicio = $row2->inicio;
			$fin = $row2->fin;
			$timeout = $row2->fueradetiempo;
			
			$result = $Evaluacion->get_evaluacion_alumno($user,$codeva);
			if($row = $result->fetch_object()){
				$proceso = $row->proceso;
				if ($proceso == 0) {
					echo json_encode(["status"=>"evalFinalizada"]);
		    		exit();
				}else{
					if($timeout == 1){
						$result_actividad = $Evaluacion->get_actividades($codeva);
						if($row_act = $result_actividad->fetch_object()){
							echo json_encode(["status"=>"ok","actividad"=>$row_act->script]);
		    				exit();
						}else{
							echo json_encode(["status"=>"errorActividad"]);
		    				exit();
						}
					}
					if ($datetime < $fin) {
						$result_actividad = $Evaluacion->get_actividades($codeva);
						if($row_act = $result_actividad->fetch_object()){
							echo json_encode(["status"=>"ok","actividad"=>$row_act->script]);
		    				exit();
						}else{
							echo json_encode(["status"=>"errorActividad"]);
		    				exit();
						}
					}else{
						$date = date("Y-m-d H:i:s");
						$Evaluacion->finalizar_evaluacion($codeva,$date);
						echo json_encode(["status"=>"errorTimeout"]);
		    			exit();
					}
				}
			}
		}else{
			echo json_encode(["status"=>"errorEval"]);
	    	exit();
		}

	   	break;
	default:
		echo json_encode(["status"=>"errorOP"]);
		break;
}

?>

