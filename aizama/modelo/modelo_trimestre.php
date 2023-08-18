<?php 
	class Trimestre
	{
		private $db;
		
		public function __construct($conexion)
        {
            $this->db = $conexion;
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
        }

		public function get_trimestre($trimestre){
			$sql = "SELECT * FROM trimestre WHERE trimestre = ? AND estado = 1";
			$type = "i";
			$params = array($trimestre);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_trimestre_actual(){
			$fechaActual = date("Y-m-d");
			$sql = "SELECT * FROM trimestre WHERE inicio <= ? AND fin >= ? AND estado = 1";
			$type = "ss";
			$params = array($fechaActual,$fechaActual);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		
		
	}
?>