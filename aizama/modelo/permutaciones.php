<?php 
class Permutaciones
{
		function permutacionesSR(&$lista,&$banco,&$razon,&$nota,&$permutaciones)
		{
			if(count($lista)==$razon ){
				if (sumaNota($lista) == $nota) {
					$permutaciones[] = $lista;
					echo json_encode($permutaciones);
				}

				return;
			}
				$k = 0;
				while($k < count($banco)){
					if(!in_array($banco[$k], $lista)){
						$lista[] = $banco[$k];
						permutacionesSR($lista, $banco, $razon, $nota,$permutaciones);
						$lista = array_pop($lista);
					}   
					$k++;
				}
		}
		function mochila($L1,$L2,$max,$i){
				$sum = suma($L2);
				if(count($L2)>5||$sum > $max)return;
				if($sum == $max && count($L2) == 5){
					$permutaciones[] = $L2;
					return;
				}
				
				
				$k = $i;
				while($k < count($L1)){
					$L2[] = $L1[$k];
					mochila($L1, $L2, $max, $k+1);
					$L2 = array_pop($L2);
					$k++;
				}
			}
		function suma($lista)
		{
			$sum = 0;
			foreach ($lista as $pregunta) {
				$sum = $sum + $pregunta['nota'];
			}
			return $sum;
		}
		function todosCombinados($listaIndex)
		{
			for ($i=0; $i < count($listaIndex); $i++) { 
				if($listaIndex[$i]!= -2){
					return false;
				}
			}
			return true;
		}
		function obtenerCombinaciones($banco,$razon,$nota)
		{
			$listaCombinaciones = array();
			$listaIndex = array();	
			for ($i=0; $i < $razon; $i++) { 
				$listaIndex[] = -1;
			}
			$combinacion = array();
			
			$index = 0; //Index de 0 a razon
			while(!$this->todosCombinados($listaIndex)&&count($listaCombinaciones)<500){
				if(count($combinacion) == $razon){
					if($this->sumaCombinacion($combinacion,$banco) == $nota){
						$listaCombinaciones[] = $this->obtenerId($combinacion,$banco);
					}
					array_pop($combinacion);
				}
				$pos = $listaIndex[$index] + 1;
				$pos = $pos == -1 ? $pos + 1 : $pos;
				if($pos < count($banco)){
					if(!in_array($pos,$combinacion)){
						$combinacion[] = $pos;
						$listaIndex[$index] = $pos;
						$index = $index + 1 < $razon ? $index + 1 : $index ;
					}else{
						$listaIndex[$index] = $pos;
					}
				}else{
					$listaIndex[$index] = -2;
					$index = $index > 0 ? $index - 1 : $index;
					array_pop($combinacion);
				}
			}
			return $listaCombinaciones;
		}
		function sumaCombinacion($listaPosiciones,$banco)
		{
			$sum = 0;
			foreach ($listaPosiciones as $pos) {
				$sum = $sum + $banco[$pos]['nota'];
			}
			return $sum;
		}
		function obtenerId($combinacion,$banco){
			$listaid = array();
			foreach ($combinacion as $pos) {
				$listaid[] = $banco[$pos]['em_p_id'];
			}
			return $listaid;
		}

		function sumaNota(&$lista)
		{
			$nota = 0;
			if (empty($lista))return 0;
			foreach ($lista as $pregunta) {
				$nota = $nota + $pregunta['nota'];
			}
			return $nota;
		}
			/*$banco = array();
			$banco[] = array("codpreg"=>1,"nota"=>20);
			$banco[] = array("codpreg"=>2,"nota"=>20);
			$banco[] = array("codpreg"=>3,"nota"=>25);
			$banco[] = array("codpreg"=>6,"nota"=>20);
			$banco[] = array("codpreg"=>4,"nota"=>50);
			$banco[] = array("codpreg"=>5,"nota"=>50);
			$banco[] = array("codpreg"=>7,"nota"=>50);
			$banco[] = array("codpreg"=>8,"nota"=>55);
			$banco[] = array("codpreg"=>9,"nota"=>25);
			$banco[] = array("codpreg"=>10,"nota"=>10);


		$razon = 5; //Número de preguntas que deben salirle al estudiante
		$nota = 100; //Nota del examen*/

		//$permutaciones = array();
		/*$lista = obtenerCombinaciones($banco,$razon,$nota);
		echo json_encode($lista);*/
		//mochila($lista,$banco,);
		//permutacionesSR($lista,$banco,$razon,$nota,$permutaciones);
		//Permutaciones sin repeticion
		/*function permutacionesSR($banco,$razon,$nota)
		{
			
		}*/

		//echo json_encode($permutaciones);
	}
?>