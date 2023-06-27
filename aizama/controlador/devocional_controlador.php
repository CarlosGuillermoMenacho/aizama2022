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
	function generateFileName()
	{
		$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_";
		$name = "";
		for($i=0; $i<3; $i++)
		$name.= $chars[rand(0,strlen($chars) - 1)];
		return $name;
	}
	switch ($_GET['op']) {
			case 'guardar_devocional':
				$fecha = isset($_POST["fecha"])? $_POST["fecha"]:"";
				$texto = isset($_POST["texto"])? $_POST["texto"]:"";   
                if ( empty($fecha) || empty($texto)){
					echo "errorParam";
					exit();
				}
                $estado=1;
				$fechaReg = date("Y-m-d H:i:s"); 
				$codprof = $_SESSION['app_user_id'];
				require('../modelo/modelo_devocional.php');
				$devocional = new Devocional($db);
				$cant = $devocional->get_cant_devocional($fecha);
				if ($cant>1) {
					echo "errorCant";
					exit();
				} 
                if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])) 
				{
					$ext=explode(".",$_FILES["imagen"]["name"]);
					if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png") 
					{
						$fechaNueva= str_replace(":","-",$fechaReg);
						$fechaNueva= str_replace(" ","-",$fechaNueva);
						$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
						$nombreArchivo=$codprof.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
						$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
						
					}else{
						echo "errorFile";
						exit();
					}
				}
				if( $devocional->guardar_devocional($fecha,$nombreArchivo, $texto, $fechaReg,$codprof, $estado)){
					echo "ok";
				}else{
					echo "error";
				}
				break;

                case 'editar_devocional':
					$fecha = isset($_POST["fecha"])? $_POST["fecha"]:"";
					$texto = isset($_POST["texto"])? $_POST["texto"]:"";
                    if(empty($fecha)||empty($texto)){
						echo "errorParam";
						exit();
					}
					require('../modelo/modelo_devocional.php');
					$devocional = new Devocional($db);
					$fechaReg = date("Y-m-d H:i:s"); 
					$codprof = $_SESSION['app_user_id'];
					if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])) 
					{
						$ext=explode(".",$_FILES["imagen"]["name"]);
						if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png") 
						{
							$fechaNueva= str_replace(":","-",$fechaReg);
							$fechaNueva= str_replace(" ","-",$fechaNueva);
							$fichero=$_SERVER['DOCUMENT_ROOT']."/aizama/resources/";
							$nombreArchivo=$codprof.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
							$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
						}else{
							echo "errorFile";
							exit();
						}
					}else{
						$nombreArchivo= $devocional->get_imagen($fecha);
					}
					
					if( $devocional->editar_devocional($fecha, $nombreArchivo, $texto, $fechaReg, $codprof)){
						echo "ok";
					}else{
						echo "error";
					}
					break;

                case 'eliminar_devocional':
                    $fecha = isset($_POST["fecha"])? $_POST["fecha"]:"";
					if ( empty($fecha) ){
						echo "errorParam";
						exit();
					}

					$fechaReg = date("Y-m-d H:i:s"); 
					$codprof = $_SESSION['app_user_id'];
					require('../modelo/modelo_devocional.php');
					$devocional = new Devocional($db);
					if( $devocional->eliminar_devocional($fecha)){
						echo "ok";
					}else{
						echo "error";
					}
                    break;

                case 'get_devocional':
                    $fecha = isset($_POST["fecha"])? $_POST["fecha"]:"";
                    if ( empty($fecha) ){	
                        echo "errorParam";		
                        exit();
                    }
                    require('../modelo/modelo_devocional.php');
                    $devocional = new Devocional($db);
                    $detalle=$devocional->get_devocional ($fecha);
                    $result=array();
                    foreach ($detalle as $dev){
                        $result[]=array(
                            "id"=>$dev['id'],
                            "fecha"=> $dev['fecha'],
                            "imagen"=>$dev['imagen'],
                            "texto"=> $dev['texto'],
                            "fechaReg"=> $dev['fechaReg'],
                            "codprof"=>$dev['codprof'],
                            "estado"=>$dev['estado']
                        );
                    }
                    echo json_encode(array("status"=>"ok","lista"=>$result));
                    
                    break;

		default:
			echo "ErrorOP";
			break;
	}
?>