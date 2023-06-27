<?php 
	class Autoevaluacion_alumno
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
		}
		public function save($codalu,$codeva,$ser,$decidir,$fechareg){
		    $sql = "INSERT INTO auto_evaluaciones_alu(codalu,cod_autoevaluacion,ser,decidir,fechareg,estado)
		                                       values(?,?,?,?,?,1)";
			$type = "iiiis";
			$params = array($codalu,$codeva,$ser,$decidir,$fechareg);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_registro($codalu,$codeva){
		    $sql = "SELECT * FROM auto_evaluaciones_alu WHERE codalu = ? AND cod_autoevaluacion = ? AND estado = 1";
			$type = "ii";
			$params = array($codalu,$codeva);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function set_ser($codalu,$codeva,$ser,$fechareg){
		    $sql = "UPDATE auto_evaluaciones_alu set ser = ?,fechareg = ? WHERE cod_autoevaluacion =? AND codalu = ? AND estado = 1";
			$type = "isii";
			$params = array($ser,$fechareg,$codeva,$codalu);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function set_decidir($codalu,$codeva,$decidir,$fechareg){
		    $sql = "UPDATE auto_evaluaciones_alu set decidir = ?,fechareg = ? WHERE cod_autoevaluacion =? AND codalu = ? AND estado = 1";
			$type = "isii";
			$params = array($decidir,$fechareg,$codeva,$codalu);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>