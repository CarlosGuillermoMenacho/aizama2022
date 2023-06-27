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
    // la respuesta de tipo escrita (vista alumno)
    case 'save_respuesta_escrita':
        $idpreg = isset($_POST['idpreg'])?$_POST['idpreg']:"";
        $idaem = isset($_POST['idaem'])?$_POST['idaem']:"";
        $respuesta = isset($_POST['respuesta'])?$_POST['respuesta']:"";

        if (empty($idaem)||empty($idpreg)||empty($respuesta)) {
            echo "errorParam";
            exit();
        } 
        $fechaActual = date("Y-m-d H:i:s");
        
        //Validando que la evaluacion esta en proceso
        require '../modelo/modelo_em_alumno.php';
        require '../modelo/em_alumno_preg_escrito.php';
        $pregunta_escrita = new alumno_preg_escrito($db);
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
                  if($pregunta_escrita->update_respuesta_esc( $respuesta, $idpreg)){
                     echo "ok";
                    exit();  
                  }
                     
                }
            }else{
                echo "noProc";
                exit();
            }

        break;



    default:
        # code...
        break;
}


?>