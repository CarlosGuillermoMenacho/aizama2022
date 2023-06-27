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
	function generateFileName()
	{
		$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_";
		$name = "";
		for($i=0; $i<3; $i++)
		$name.= $chars[rand(0,strlen($chars) - 1)];
		return $name;
	}
	switch ($_GET['op']) {
		case 'guardar_imagen':
			$codpreg=4;
			//$codpreg = isset ($_POST["codpre"])?$_POST["codpre"]:"";
			if (empty($codpreg)){
				echo "ErrorParam";
				exit();
			}
			$fechaReg = date("Y-m-d H:i:s"); 
			$codprof = $_SESSION['app_user_id'];
			if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])) 
			{
				$ext=explode(".",$_FILES["imagen"]["name"]);
				if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png") 
				{
					$fechaNueva= str_replace(":","-",$fechaReg);
					$fechaNueva= str_replace(" ","-",$fechaNueva);
					$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/aizama/resources/";
					$nombreArchivo=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
					$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
					require("../modelo/modelo_imagen_em.php");
					$imagenes= new imagen_mixta($db);
					if ($imagenes->guardar_imagen($codpreg,$nombreArchivo, $codprof))
					{
						echo "Ok";
					}else{
						echo "Error";
					}
				}
			}
			break;

		case 'delete_imagen':
			$codimg = isset ($_POST["codimg"]) ?$_POST["codimg"]:"";
			if (empty($codimg)){
				echo "ErrorParam";
				exit();
			}
			$fechaReg = date("Y-m-d H:i:s"); 
			$codprof = $_SESSION['app_user_id'];
			//$codprof = 'D39';
			require("../modelo/modelo_imagen_em.php");
			$imagenes= new imagen_mixta($db);
			if ($imagenes->delete_imagen($codimg, $codprof))
			{
				echo "Ok";
			}else{
				echo "Error";
			}
			break;

		case 'update_imagen':
			$codimg = isset ($_POST["codimg"]) ?$_POST["codimg"]:"";
			$codpreg = isset ($_POST["codpreg"]) ?$_POST["codpreg"]:"";
			
			if (empty($codimg)||empty($codpreg)){
				echo "ErrorParam";
				exit();
			}
			$fechaReg = date("Y-m-d H:i:s");
			$codprof = $_SESSION['app_user_id'];
			//$codprof ="D23";	
			if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name']))
			{
				$ext=explode(".",$_FILES["imagen"]["name"]);
				if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png")
				{
					$fechaNueva= str_replace(":","-",$fechaReg);
					$fechaNueva= str_replace(" ","-",$fechaNueva);
					$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/aizama/resources/";
					$nombreArchivo=$codprof.'-'.$codpreg.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);
					$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
					require("../modelo/modelo_imagen_em.php");
					$imagenes= new imagen_mixta($db);
					if ($imagenes->update_imagen($codimg, $nombreArchivo, $codprof))
					{
						echo "Ok";
					}else{
						echo "Error";
					}
				}	
			}
			break;

		case 'get_imagen':
			$codpreg = isset($_POST["codpreg"]) ?$_POST["codpreg"]:"";
			if (empty($codpreg)){
				echo "errorParam";
				exit();
			}
			require("../modelo/modelo_imagen_em.php");
			$imagenes= new imagen_mixta($db);
			if ($imagenes->get_imagen($codpreg))
			{
				echo "Ok";
			}else{
				echo "Error";
			}
			break;

	default:
		echo "ErrorOP";
		break;
	}
?>