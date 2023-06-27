<?php 
	class Asistencia_Profesor
	{
		private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
		}
		public function get_asistencia($codprof,$fecha){
			$sql = "SELECT * FROM asistencias_prof WHERE codprof = ? AND fecha = ? AND estado = 1 AND tipo = 'E'";
			$type = "ss";
			$params = array($codprof,$fecha);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_salida($codprof,$fecha){
			$sql = "SELECT * FROM asistencias_prof WHERE codprof = ? AND fecha = ? AND estado = 1 AND tipo = 'S'";
			$type = "ss";
			$params = array($codprof,$fecha);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>