<?php
		session_start();
		header("Content-type:text/html;charset=utf-8");
		header('Access-Conotrol-Allow-Origin: *');
		header("Access-Control-Allow-Credentials: true");
		header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
		header('Access-Control-Max-Age: 1000');
		header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
		require '../includes/functions.php';
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		$_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
		/*if (empty($_tipo_user)){
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
		}*/
		switch ($_GET['op']) {
			case 'guardar_opcion_correcta':
				$codpre = isset ($_POST["codpre"])?$_POST["codpre"]:"";
				$nro = isset ($_POST["nro"])?$_POST["nro"]:"";
				if (empty($codpre)||empty($nro)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_opcion_correcta_em.php');
				$opcion = new opcion_correcta($db);
				if ($opcion->guardar_opcion_correcta($codpre, $nro)) 
				{
					echo "Ok";
				}else{
					echo "Error";
				}
				break;

			case 'update_opcion_correcta':
				$id = isset ($_POST["id"])?$_POST["id"]:"";
				$nro = isset ($_POST["nro"])?$_POST["nro"]:"";
				if (empty($id)||empty($nro)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_opcion_correcta_em.php');
				$opcion = new opcion_correcta($db);
				if ($opcion->editar_opcion_correcta($id,$nro)) 
				{
					echo "Ok";
				}else{
					echo "Error";
				}
				break;
				
			case 'delete_opcion_correcta':
				$id = isset ($_POST["id"])?$_POST["id"]:"";
				if (empty($id)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_opcion_correcta_em.php');
				$opcion = new opcion_correcta($db);
				if ($opcion->eliminar_opcion_correcta($id)) 
				{
					echo "Ok";
				}else{
					echo "Error";
				}
				break;

			case 'obtener_opcion_correcta':
				$codpre = isset ($_POST["codpre"])?$_POST["codpre"]:"";
				if (empty($codpre)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_opcion_correcta_em.php');
				$opcion= new opcion_correcta($db);
				if ($opcion->obtener_opcion_correcta($codpre)) 
				{
					echo "Ok";
				}else{
					echo "Error";
				}
				break;

			default:
				echo "ErrorOp";
				break;

			// guardar(actualizar)opcion del alumno(vista alumno)	
			case 'save_respuesta_op':
				$idpreg = isset($_POST['idpreg'])?$_POST['idpreg']:"";
				$idaem = isset($_POST['idaem'])?$_POST['idaem']:"";
				$op_alumno = isset($_POST['op_alumno'])?$_POST['op_alumno']:"";
		
				if (empty($idaem)||empty($idpreg)||empty($op_alumno)) {
					echo "errorParam";
					exit();
				} 
				$fechaActual = date("Y-m-d H:i:s");
				
				//Validando que la evaluacion esta en proceso
				require '../modelo/modelo_em_alumno.php';
				require '../modelo/em_alumno_preg_op_correcta.php';
				$pregunta_opcorrecta = new alumno_preg_opcorrecta($db);
				$em_alumno = new em_alumno($db);
				$detalle = $em_alumno->get_detalle_em_alumno($idaem);
					if (!empty($detalle)) {
						foreach ($detalle as $det) {
							$proceso = $det['proceso'];
						}
						if ($proceso==0) {
							echo "finalizado";
							exit();
						}else{
						  if($pregunta_opcorrecta->update_respuesta_alum_op($op_alumno, $idpreg)){
							 echo "ok";
							exit();  
						  }
							 
						}
					}else{
						echo "noProc";
						exit();
					}
		
				break;
		}
	

?>