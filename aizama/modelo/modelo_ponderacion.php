<?php 
	class Ponderacion
	{
		private $db;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}
        
        public function get_ponderacion($gestion){
        	$sql = "SELECT * FROM ponderacion WHERE gestion = ? AND estado = 1";
			$type = "i";
			$params = array($gestion);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
        }
	}
?>