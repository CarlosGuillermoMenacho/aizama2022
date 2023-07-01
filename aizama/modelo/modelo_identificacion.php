<?php 
	class Identificacion
	{
		private $db;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
        
        public function get_preguntas(){
        	$sql = "SELECT * FROM preguntas_identificacion";
			$type = "";
			$params = array();
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
        }
	}
?>