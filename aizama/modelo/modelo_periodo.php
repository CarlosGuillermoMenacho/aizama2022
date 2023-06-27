<?php 
	class Periodo
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
		public function get_periodos(){
		    $sql ="SELECT * FROM periodos WHERE estado = 1 ";
			$type = "";
			$params = array();
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}		
		public function get_periodos_nivel($nivel){
			$sql ="SELECT * FROM periodos WHERE nivel = ? AND estado = 1 ";
			$type = "i";
			$params = array($nivel);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_hora_periodo($nivel,$periodo){
			$sql ="SELECT * FROM periodos WHERE nivel = ? AND numero = ? AND estado = 1 ";
			$type = "ii";
			$params = array($nivel,$periodo);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>