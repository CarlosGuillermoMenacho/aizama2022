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
    case 'get_img_tipo':
        require('../modelo/modelo_tipo_imagen_pregunta.php');
        $tipo = new tipo_imagen($db);

        $listatipo=$tipo->get_img_tipo();
        $result= array();
        
        foreach($listatipo as $tipo){
                $result[] = array(	
                                "id"=>$tipo['id'],
                                "link"=>$tipo['link'],
                                "nombre"=>$tipo['nombre'],
                                "descripcion"=>$tipo['descripcion']
                                );
                            }
        echo json_encode(array("status"=>"ok","lista"=>$result));
        break;
	
	default:
		echo "ErrorOP";
		break;
}

?>

 