<?php 
header("Content-Type: application/json;charset=utf-8");
require 'includes/config.php';
require 'includes/functions.php';
$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
if ($_POST) {
	if (isset($_POST['codigo'])&&!empty($_POST['codigo'])&&isset($_POST['codtut'])&&!empty($_POST['codtut'])) {
		$codAlu = $_POST['codigo'];
        $codTutor = $_POST['codtut'];
		$sql = "select m.codmat, m.descri from alumno a inner join cur_mat cm on a.cod_cur=cm.cod_cur and a.cod_par=cm.cod_par inner join materia m on cm.cod_mat=m.codmat and cm.estado = 1 and a.estado = 1 and a.codigo =".$codAlu;
		$result = mysqli_query($db,$sql);
        
		$materias = array();
		while ($row = $result->fetch_object()) {
			$materias[]=array($row->codmat,utf8_encode($row->descri));
		}
        $mensajes = array();
        $sql2 = "select * from msg_pend where cod_tutor = ".$codTutor." and cod_est=".$codAlu;
        
        $result2 = mysqli_query($db,$sql2);
    
        while($row2 = $result2->fetch_object()){
            $mensajes[]=array($row2->id,$row2->cod_est,utf8_encode(tratarCadena($row2->mensaje)),utf8_encode($row2->emisor),$row2->codusr,$row2->tipousr,$row2->cod_tutor,$row2->fecha,$row2->hora,$row2->estado,$row2->tipo);
        }
        
		$respuesta = array(
							"status" => "ok",
							"materias" => $materias,
							"mensajes" => $mensajes
							);

		echo json_encode($respuesta);
	}else{
		echo "paramError";
	}
}else{
	echo "errorPOST";
}
function tratarCadena($cadena){
    $nuevacadena = "";
    for ($i=0; $i < strlen($cadena); $i++) { 
        if (substr($cadena, $i,1)=="'") {
            $nuevacadena .= "\\".substr($cadena, $i,1);
        }else{
             $nuevacadena .= substr($cadena, $i,1);
        }
    }
    return $nuevacadena;
}
?>