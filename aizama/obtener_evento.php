<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
require 'includes/functions.php';
if(!cliente_activo())
{
  echo json_encode(array("status"=>"eSession"));
  exit();
}
if ($_GET) {
	switch ($_GET['op']) {
		case 'evonline':
			require 'includes/config.php';

			$db = mysqli_connect($servername, $username, $password, $database) 
								or die('Error al intentar conectar con el servidor.');

			//Validando que el usuario sea alumno
			$sql = "select cod_cur,cod_par from alumno where codigo = ".$_SESSION['app_user_id'];
			
			$result = mysqli_query($db,$sql);

			if($row = $result->fetch_object()){
				$fecha = date("Y-m-d");
				$hora = date("H:i");
/*				$sql = "select link from claseVirtual where codCur=".$row->cod_cur." 
						and codPar=".$row->cod_par." and estado=1 and 
						fecha='".$fecha."' and horaIni<='".$hora."' and 
						horaFin>'".$hora."'";
						*/
				$sql = "select link from EventoVirtual where estado=1 and 
						fecha='".$fecha."' and horaIni<='".$hora."' and 
						horaFin>'".$hora."'";
				$result = mysqli_query($db,$sql);
				if ($row = $result->fetch_object()) {
					echo $row->link;
				}else{
					echo "noClase";
				}
			}else{
				echo "noPermitido";//El usuario no es alumno
			}
			break;
		default:
		    $respuesta = array("status"=>"errorOP");
			echo json_encode($respuesta);
			break;
	}
}else{
	echo "errorGET";
}
?>