<?php 
switch ($_GET['op']) {
	case 'get_to_send'://Obtiene las clases en vivos de los cursos que pasa clases el profesor
		
		require_once"../modelo/conexion.php";
	
		require_once"../modelo/modelo_msg_send.php";
		$db = Conectar::conexion();
		$Whatsapp = new Whatsapp($db);
		$result = $Whatsapp->get_msg_to_send();
		if($row = $result->fetch_object()){
		    echo json_encode(["status"=>"ok","data"=>$row]);
		}else{
		    echo json_encode(["status"=>"noData"]);
		}
		
		break;
	case 'msg_sended'://Obtiene las clases en vivos de los cursos que pasa clases el profesor
		$id = isset($_POST["id"])? $_POST["id"]:"";
		if(empty($id)){
		    echo json_encode(["status"=>"errorParam"]);
		    exit();
		}
		require_once"../modelo/conexion.php";
	
		require_once"../modelo/modelo_msg_send.php";
		$db = Conectar::conexion();
		$Whatsapp = new Whatsapp($db);
		$Whatsapp->set_msg_send($id);
		echo json_encode(["status"=>"ok"]);
		
		
		break;
	default:
		echo json_encode(array("status"=>"errorOP"));
		break;
}
?>