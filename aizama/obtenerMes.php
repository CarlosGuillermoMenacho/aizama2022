<?php
$meses = array(
				"Enero-January",
				"Febrero-February",
				"Marzo-March",
				"Abril-April",
				"Mayo-May",
				"Junio-June",
				"Julio-July",
				"Agosto-August",
				"Septiembre-September",
				"Octubre-October",
				"Noviembre-November",
				"Diciembre-December"
			);
if($_GET){
	$numeroMes = $_GET['mes'];//Número del mes 1 enere a 12 diciembre
	$year = date("Y");
	if($numeroMes > 0 && $numeroMes <= 12){
		$fecha = strtotime($year."-".$numeroMes."-1");
		$diaSemana = date("N",$fecha);
		$diasMes = date("t",$fecha);
		echo json_encode(array("first"=>$diaSemana,"dias"=>$diasMes,"mes"=>$numeroMes,"diaMes"=>"","nombreMes"=>$meses[$numeroMes-1]));
		exit();
	}else{
		echo "errorParam";
		exit();
	}
}else{
	$year = date("Y");
	$numeroMes = date("n");//Número del mes 1 enero a 12 diciembre

	$fecha = strtotime($year."-".$numeroMes."-1");
	$diaSemana = date("N",$fecha);
	$numeroDeDias = date("t");
	$diaMes = date("j");//Numero de día del mes
	echo json_encode(array("first"=>$diaSemana,"diaMes"=>$diaMes,"dias"=>$numeroDeDias,"mes"=>$numeroMes,"nombreMes"=>$meses[$numeroMes-1]));
} 

?>