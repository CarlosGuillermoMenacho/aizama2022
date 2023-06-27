<?php 
	/**
	 * 
	 */
	class DiasFestivos
	{
		private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
		}

		public function getFechas($mes,$year){
			$mess = strlen($mes)==2?$mes:"0".$mes;
			$fecha = $mess."-%";
			$consulta ="SELECT descripcion,fecha 
						FROM  dias_festivos 
						WHERE fecha LIKE ? and estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"s", $fecha);	
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
				$ok= mysqli_stmt_bind_result($resultado, $descripcion,$fecha);
				
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"descripcion"=>$descripcion,
									"fecha"=>$fecha,
									"dia"=>substr($fecha,3,2)
									);
				}

			}
			return $lista;
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function get_all(){
			$sql = "SELECT * FROM dias_festivos WHERE estado = 1";
			$type = "";
			$params = array();
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>