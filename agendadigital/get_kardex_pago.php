<?php
header("Content-Type: application/json;charset=utf-8");

require 'includes/functions.php';

if($_POST){
	if(isset($_POST['id']) && is_numeric($_POST['id'])){
		require 'includes/config.php';
		$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');
		$gestion = isset($_POST['gestion'])?$_POST['gestion']:"";
		if(empty($gestion))$gestion = date('Y');
		$v_id = $_POST['id'];
		//$gestion = $_POST['gestion'];
		$alumno=array();
		$sql = "SELECT paterno,materno,nombres,curso FROM alumno WHERE codigo=".$v_id;
		$result = mysqli_query($db, $sql);
		if($row = $result->fetch_object()){
			$alumno = array(
					"paterno"=>utf8_encode(trim($row->paterno)),
					"materno"=>utf8_encode(trim($row->materno)),
					 "nombres"=>utf8_encode(trim($row->nombres)),
					 "curso"=>utf8_encode(trim($row->curso))
			);
		}

		
		$sql3 = "SELECT * FROM kar_alu WHERE estado=1 AND codigo=".$v_id." and ano_pago = ".$gestion." ORDER BY acreedor Desc";
		$result3 = mysqli_query($db, $sql3);

		$pagos=array();
		$acumulado = 0;
		$cont = 1;
		$acum_total=0;
		while($row3 = $result3->fetch_object()){
		//   $acumulado = ($row3[3] + $row3[4] + $row3[5]) / 3;
			$pagos[] = array(
					"codigo"=>(($row3->codigo)),
					"detalle"=>utf8_encode(trim($row3->detalle)),
					"fecha"=>utf8_encode(trim($row3->fecha)),
					"recnum"=>(($row3->recnum)),
					 "haber"=>(($row3->haber)),
					 "acreedor"=>(($row3->acreedor))

			);
		//   $acum_total = $acumulado + $acum_total;
		//   $cont++;
		}

		if (count($alumno)>0) {
			$array=array("status"=>'200',
					 "message"=>"DATOS OBTENIDOS EXITOSAMENTE",
					 "alumno"=>$alumno,
					 "pagos"=>$pagos,
					 "gestion"=>$gestion
					);
			echo json_encode($array);
		}else{
			$array=array(
						"status"=>"404",
						"message"=>"DATOS INCORRECTOS");
			echo json_encode($array);
		}

	}  
}else{
	$array=array(
				"status"=>"404",
				"message"=>"DATOS INCORRECTOS 22222");
	echo json_encode($array);
}
?>