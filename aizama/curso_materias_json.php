<?php 
session_start();
require 'includes/functions.php';
if(!cliente_activo())
{
	$response = array("status"=>"eSession");
    echo json_encode($response);
    exit();
}
$administrador = $_SESSION['app_user_id'];
			
require 'includes/config.php';
$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');
			
$sql = "select * from personal where cod_per=".$administrador;

$result = mysqli_query($db,$sql);

if ($row=$result->fetch_object()) {
				
	$sql = "select * from cur_mat where estado = 1";
	$result = mysqli_query($db,$sql);

	$llista = array();
	while ($row = $result->fetch_object()) {
		$lista[] = array(
						"codcur"=>$row->cod_cur,
						"codpar"=>$row->cod_par,
						"codmat"=>$row->cod_mat					
						);
	}
	if (count($lista)>0) {
		$respuesta = array(
							"status"=>"ok",
							"cursomaterias"=>$lista
						);

		echo json_encode($respuesta);
	}else{
		$respuesta = array("status"=>"noData");
		echo json_encode($respuesta);
	}
}else{
	$respuesta = array("status"=>"noPermitido");
	echo json_encode($respuesta);
}

?>