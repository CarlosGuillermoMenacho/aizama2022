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
			case 'cantidad_opciones':
				$codpreg = isset($_POST["codpreg"])? $_POST["codpreg"]:"";
				if (empty($codpreg)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_opcion_em.php');
				$opciones = new opciones_pregunta_seleccion($db);
				if( $opciones->cantidad_opciones($codpreg)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;
			case 'guardar_opcion':
				$codpreg = isset($_POST["codpreg"])? $_POST["codpreg"]:"";
				$opcion = isset ($_POST["opcion"])? $_POST["opcion"]:"";
				if (empty($codpreg)||empty($opcion)) {
					echo "ErrorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				//$codprof = 'D39';
				require('../modelo/modelo_opcion_em.php');
				$opciones = new opciones_pregunta_seleccion($db);
				if( $opciones->guardar_opcion($codpreg, $opcion, $codprof)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;	

			case 'update_opcion':
				$idopcion = isset($_POST["idopcion"])? $_POST["idopcion"]:"";
				$opcion = isset ($_POST["opcion"])? $_POST["opcion"]:"";
				if (empty($idopcion)||empty($opcion)) {
					echo "ErrorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codProf = $_SESSION['app_user_id'];
				//$codProf = 'D39';
				require('../modelo/modelo_opcion_em.php');
				$opciones = new opciones_pregunta_seleccion($db);
				if( $opciones->editar_opcion($idopcion,$opcion,$codProf)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;

			case 'obtener_nro':
				$idopcion = isset($_POST["idopcion"])? $_POST["idopcion"]:"";
				if (empty($idopcion)) {
					echo "ErrorParam";
					exit();
				}

				require('../modelo/modelo_opcion_em.php');
				$opciones = new opciones_pregunta_seleccion($db);
				if( $opciones->obtener_nro($idopcion)){
					echo "Ok";
				}else{
					echo "error";
				}
				break;

			case 'delete_opcion':
				$idopcion = isset($_POST["idopcion"])? $_POST["idopcion"]:"";
				$codpreg = isset ($_POST["codpreg"])? $_POST["codpreg"]:"";
				$nro = isset ($_POST["nro"])? $_POST["nro"]:"";
				if (empty($idopcion)||empty($codpreg)||empty($nro)) 
				{
					echo "ErrorParam";
					exit();
				}
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				//$codprof = 'D39';
				require('../modelo/modelo_opcion_em.php');
				$opciones = new opciones_pregunta_seleccion($db);
				if( $opciones->eliminar_opcion($idopcion,$codpreg, $nro, $codprof))
				{
					echo "Ok";
				}else{
					echo "error";
				}
				break;

			case 'obtener_opcion':
				$codpreg = isset($_POST["codpreg"])? $_POST["codpreg"]:"";
				if (empty($codpreg)) {
					echo "ErrorParam";
					exit();
				}
				require('../modelo/modelo_opcion_em.php');
				$opciones = new opciones_pregunta_seleccion($db);
				if ($opciones->obtener_opcion($codpreg)) {
					echo "Ok";
				}else{
					echo"Error";
				}
				break;

			default:
				echo "ErrorOp";
				break;
		}
	


?>