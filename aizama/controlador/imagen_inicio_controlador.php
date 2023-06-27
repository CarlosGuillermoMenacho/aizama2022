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
	/*if(!cliente_activo()){
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
				$fecha_ini = isset($_POST["fecha_ini"])? $_POST["fecha_ini"]:"";
				   
                if ( empty($fecha_ini)){
					echo "errorParam";
					exit();
				}
                $estado=1;
				$fechaReg = date("Y-m-d H:i:s"); 
				$usr = $_SESSION['app_user_id'];
				if(!cliente_activo()||empty($usr)){
					echo "eSession";
					exit();
				}
				require('../modelo/modelo_imagen_inicio.php');
				require_once('../modelo/conexion.php');
                $db = Conectar::conexion();
				$imageninicio = new imagen_de_inicio($db);
				$cant = $imageninicio->get_cant_imagen($fecha_ini);
				if ($cant>=1) {
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
						$fichero="../resources/";
						$nombreArchivo=$usr.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
						$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
						
					}else{
						echo "errorFile";
						exit();
					}
				}
				if( $imageninicio->guardar_imagen($fecha_ini,$nombreArchivo,$usr,$fechaReg,$estado)){
					echo "ok";
				}else{
					echo "error";
				}
				break;

                case 'editar_imagen':
					$fecha_ini = isset($_POST["fecha_ini"])? $_POST["fecha_ini"]:"";
                    if(empty($fecha_ini)){
						echo "errorParam";
						exit();
					}
					require('../modelo/modelo_imagen_inicio.php');
					require_once('../modelo/conexion.php');
                    $db = Conectar::conexion();
					$imageninicio = new imagen_de_inicio($db);
					$fechaReg = date("Y-m-d H:i:s"); 
					$usr = $_SESSION['app_user_id'];
					if(!cliente_activo()||empty($usr)){
						echo "eSession";
						exit();
					}
					if (file_exists($_FILES["imagen"]['tmp_name'])&&is_uploaded_file($_FILES["imagen"]['tmp_name'])) 
					{
						$ext=explode(".",$_FILES["imagen"]["name"]);
						if ($_FILES["imagen"]['type']=="image/jpg"||$_FILES["imagen"]['type']=="image/jpeg"||$_FILES["imagen"]['type']=="image/png") 
						{
							$fechaNueva= str_replace(":","-",$fechaReg);
							$fechaNueva= str_replace(" ","-",$fechaNueva);
							$fichero="../resources/";
							$nombreArchivo=$usr.'-'.$fechaNueva.'-'.generateFileName().'.'.end($ext);								
							$dato = move_uploaded_file($_FILES["imagen"]["tmp_name"],$fichero.$nombreArchivo);
						}else{
							echo "errorFile";
							exit();
						}
					}else{
						$nombreArchivo= $imageninicio->get_imagen($fecha_ini);
					}
					
					if( $imageninicio->editar_imagen($fecha_ini, $nombreArchivo, $usr,$fechaReg )){
						echo "ok";
					}else{
						echo "error";
					}
					break;

                case 'eliminar_imagen':
                    $fecha_ini = isset($_POST["fecha_ini"])? $_POST["fecha_ini"]:"";
					if ( empty($fecha_ini) ){
						echo "errorParam";
						exit();
					}

					$fechaReg = date("Y-m-d H:i:s"); 
					$usr = $_SESSION['app_user_id'];
					if(!cliente_activo()||empty($usr)){
						echo "eSession";
						exit();
					}
					require('../modelo/modelo_imagen_inicio.php');
					require_once('../modelo/conexion.php');
                    $db = Conectar::conexion();
					$imageninicio = new imagen_de_inicio($db);
					if( $imageninicio->eliminar_imagen($fecha_ini)){
						echo "ok";
					}else{
						echo "error";
					}
                    break;

                case 'obtener_imagen':
                    $fecha_ini = isset($_POST["fecha_ini"])? $_POST["fecha_ini"]:"";
                    if ( empty($fecha_ini)){	
                        echo "errorParam";		
                        exit();
                    }
                    require('../modelo/modelo_imagen_inicio.php');
                    require_once('../modelo/conexion.php');
                    $db = Conectar::conexion();
                    $imageninicio = new imagen_de_inicio($db);
                    $detalle=$imageninicio->obtener_imagen($fecha_ini);
                    $result=array();
                    foreach ($detalle as $dev){
                        $result[]=array(
                            "id"=>$dev['id'],
                            "fecha_ini"=> $dev['fecha_ini'],
                            "imagen"=>"../resources/".$dev['imagen'],
                            "fechaReg"=> $dev['fechaReg'],
                            "usr"=>$dev['usr'],
                            "estado"=>$dev['estado']
                        );
                    }
                    echo json_encode(array("status"=>"ok","lista"=>$result));
                    
                    break;
                
                case 'obtener_imagen_inicio':
                    require('../modelo/modelo_imagen_inicio.php');
                    require_once('../modelo/conexion.php');
                    $db = Conectar::conexion();
                    $imageninicio = new imagen_de_inicio($db);
			
                    
                    if($imagen=$imageninicio->obtener_imagen_inicio())
                    {
                    	if($imagen == "noImage"){
                    	    
                    		echo json_encode(array("status"=>"noImagen"));
                    		exit();
                    	}

                        echo json_encode(array("status"=>"ok","imagen"=>"aizama/resources/".$imagen));
                    }else{
                        echo "Error";
                    }
                    break;

		default:
			echo "ErrorOP";
			break;
	}
?>

