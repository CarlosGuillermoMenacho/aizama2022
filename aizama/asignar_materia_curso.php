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
	if (isset($_POST['datos'])&&!empty($_POST['datos'])) {
		$datos = $_POST['datos'];
		for ($i = 0; $i < count($datos); $i++){
		    $codmat = $datos[$i][0];
		    $codcur = $datos[$i][1];
		    $codpar = $datos[$i][2];
		    $estado = $datos[$i][3];
		    
		    $sql = "select * from cur_mat where cod_cur=".$codcur." and 
		            cod_par=".$codpar." and cod_mat='".$codmat."'";
		   $result = mysqli_query($db,$sql);
		    
		    if($row = $result->fetch_object()){
		        $sql = "update cur_mat set estado = ".$estado." where 
		                cod_cur=".$codcur." and 
		                cod_par=".$codpar." and cod_mat='".$codmat."'";
		        $result = mysqli_query($db,$sql);
		    }else{
		        if($estado==1){
		            $sql = "insert into cur_mat(cod_cur,cod_par,cod_mat,estado) 
		                    values(".$codcur.",".$codpar.",'".$codmat."',1)";
		            $result = mysqli_query($db,$sql);
		        }
		    }
		}
		echo "ok";
		exit();
	}else{
		echo "errorParam";
	}
}else{
    echo "noPermitido";
}
?>