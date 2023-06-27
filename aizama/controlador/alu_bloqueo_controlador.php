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
		case 'getPreinscripcion':
			$codalu = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codalu)){
				echo json_encode(array("status"=>"eSession"));
				exit();
			}
			require_once('../modelo/modelo_pre_inscripcion.php');
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			$preinscripcion = new PreIncripcion($db);
			$result = $preinscripcion->get_preinscripcion($codalu);
			if($fila = $result->fetch_object()){
				echo json_encode(array(
										"status"=>"ok",
										"datos"=>$fila
									)
								);
			}else{
				echo json_encode(array("status"=>"noData"));
			}
			break;
		case 'pre_inscripicion':
			$codalu = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codalu)){
				echo "eSession";
				exit();
			}
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once('../modelo/modelo_pre_inscripcion.php');
			$preinscripcion = new PreInscripcion($db);
			$gestion = date("Y");
			$gestion++;
			$fechareg = date("Y-m-d H:i:s");
			$result = $preinscripcion->save_preinscripcion($codalu,1,$gestion,$fechareg);
			echo "ok";
			break;
		case 'pre_inscripcion_family':
			$codtut = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
			if(empty($codtut)){
				echo json_encode(array("status"=>"eSession"));
		        exit();
			}
			
			$codalu = isset($_POST['codalu'])?$_POST['codalu']:"";
			$sn = isset($_POST['sn'])?$_POST['sn']:"";
			$modalidad = isset($_POST['modalidad'])?$_POST['modalidad']:"";
			$justificacion = isset($_POST['justificacion'])?$_POST['justificacion']:"";
			
			if(empty($codalu)||empty($sn)){
				echo json_encode(array("status"=>"errorParam"));
		        exit();
			}
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once("../modelo/modelo_kardex.php");
			require_once("../modelo/modelo_preinscripcion_blocked.php");
            $kardex = new Kardex($db);
            $gestion = date("Y");
            $block = new Blocked_Preinscripcion($db);
            $resul_bloq = $block->is_blocked($codalu);
            if($fetch = $resul_bloq->fetch_object()){
                echo json_encode(array("status"=>"blocked"));
            	exit();
            }
            $result = $kardex->pago_mes($codalu,$gestion,1);
           /* if(!$fila = $result->fetch_object()){
            	echo json_encode(array("status"=>"noKardex"));
            	exit();
            }*/

			require_once('../modelo/modelo_pre_inscripcion.php');
			$preinscripcion = new PreInscripcion($db);
			$gestion = date("Y");
			$gestion++;
			$fechareg = date("Y-m-d H:i:s");
			if($sn == "si")$result = $preinscripcion->save_preinscripcion($codalu,$modalidad,$gestion,$fechareg); 
		
			if($sn == "no")$result = $preinscripcion->save_preinscripcion($codalu,2,$gestion,$fechareg);
		
			if(!empty($justificacion))$preinscripcion->save_justificacion($codalu,$gestion,$justificacion);
			echo json_encode(array("status"=>"ok"));
			break;
		case 'pre_inscritos':
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once('../modelo/modelo_pre_inscripcion.php');
			$preinscripcion = new PreInscripcion($db);
			$gestion = date("Y") + 1;
			$result = $preinscripcion->get_preinscripciones($gestion);
			$lista = array();
			while ($fila = $result->fetch_object()) {
				$lista[] = $fila;
			}
			$status = "noData";
			if(count($lista>0))$status="ok";
			echo json_encode(array("status"=>$status,"lista"=>$lista));
			break;
		case 'no_inscritos':
			require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
			require_once('../modelo/modelo_pre_inscripcion.php');
			$preinscripcion = new PreInscripcion($db);
			$gestion = date("Y") + 1;
			$result = $preinscripcion->get_no_inscritos($gestion);
			$lista = array();
			while ($fila = $result->fetch_object()) {
				$lista[] = $fila;
			}
			$status = "noData";
			if(count($lista>0))$status="ok";
			echo json_encode(array("status"=>$status,"lista"=>$lista));
			break;
		case 'get_pre_inscripcion_family':
		    $codtut = $_SESSION['app_user_id'];
		    if(empty($codtut)){
		        echo json_encode(array("status"=>"eSession"));
		        exit();
		    }
		    require_once'../modelo/modelo_tutor.php';
		    require_once'../modelo/modelo_pre_inscripcion.php';
		    include'gestion_de_preinscripcion.php';
		    require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
		    $PreInscripcion = new PreInscripcion($db);
		    $Tutor = new Tutor($db);
		    $alumnos = $Tutor->get_alumnoss($codtut);
		    $response = array();
		    
		    
		    require_once('../modelo/modelo_preinscripcion_blocked.php');
            $mod_blo = new Blocked_Preinscripcion($db);
            
            
		    foreach($alumnos as $alumno){
		        $codalu = $alumno['codalu'];
		        $result = $mod_blo->is_blocked($codalu);
                $bloqueado = false;
                if($fila = $result->fetch_object())$bloqueado = true;
                
		        $result = $PreInscripcion->get_preinscripcion_alu($codalu,$gestion_preinscripcion);
		        if($fila = $result->fetch_object()){
		            $response[] = array(
		                               "alumno"=>$alumno,
		                               "preinscripcion"=>$fila,
		                               "gestion"=>$gestion_preinscripcion,
		                               "bloqueo"=>$bloqueado
		                               );
		        }else{
		            $response[] = array(
		                               "alumno"=>$alumno,
		                               "preinscripcion"=>"",
		                               "gestion"=>$gestion_preinscripcion,
		                               "bloqueo"=>$bloqueado
		                               
		                               );
		        }
		    }
		    
		    echo json_encode(array("status"=>"ok","datos"=>$response));
		    break;
		case 'alu_bloqueo_curso':
		    $coduser = $_SESSION['app_user_id'];
		    if(empty($coduser)){
		        echo json_encode(array("status"=>"eSession"));
		        exit();
		    }
		    $codcur = isset($_POST['codcur'])?$_POST['codcur']:"";
		    $codpar = isset($_POST['codpar'])?$_POST['codpar']:"";
		    	
		   	if(empty($codcur)||empty($codpar)){
		   	    echo json_encode(array("status"=>"errorParam"));
	            exit();
		    }
		    require_once'../modelo/conexion.php';
			$db = Conectar::conexion();
		    require_once'../modelo/modelo_curso.php';
		    $Curso = new Curso($db);
		    $lista_alumnos = $Curso->getListaAlumnosBloq($codcur,$codpar);
		    require_once'../modelo/modelo_alu_bloqueo.php';
		    $pre_ins = new PreInscripcion($db);
		    $response = array();
		    $gestion = date("Y") +1;
		    foreach($lista_alumnos as $alumno){
		        $codalu = $alumno['codigo'];
		        $nombre = $alumno['paterno']." ".$alumno['materno']." ".$alumno['nombres'];
//		        $result = $pre_ins->get_bloqueado_alu($codalu,$gestion);
		        $pre = "";
//		        if($fetch = $result->fetch_object())$pre = $fetch;
		        $response[] = array(
		                            "nombre"=>$nombre,
		                            "preinscripcion"=>$pre
		                           );
		    	    
		    }
		    echo json_encode(array("status"=>"ok","datos"=>$response));
		    break;
		    
		default:
			echo "errorOP";
			break;
	}
}else{
echo "errorGET";
}
?>
	