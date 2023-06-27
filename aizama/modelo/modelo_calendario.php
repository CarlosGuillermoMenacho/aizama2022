<?php 
/**
 * 
 */
class Calendario
{
	private $meses;
	private $calendario;
	function __construct()
	{
		$this->calendario = [];
		$this->meses = [
			["01","Enero"],
			["02","Febrero"],
			["03","Marzo"],
			["04","Abril"],
			["05","Mayo"],
			["06","Junio"],
			["07","Julio"],
			["08","Agosto"],
			["09","Septiembre"],
			["10","Octubre"],
			["11","Noviembre"],
			["12","Diciembre"]
		];
	}
	public function get_calendario($year){
		foreach ($this->meses as $mes) {
			$dias = date("t",strtotime("$year-$mes[0]"));
			$inicio = date("N",strtotime("$year-$mes[0]-01"));
			$this->calendario[] = [
				"mes"=>$mes[1],
				"dias"=>$dias,
				"inicio"=>$inicio
			];
		}
		return $this->calendario;
	}
}
?>