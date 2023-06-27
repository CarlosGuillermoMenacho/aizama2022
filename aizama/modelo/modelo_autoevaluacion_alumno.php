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
		public function get_autoevaluacioines($gestion,$trimestre,$codcur,$codpar,$codmat){
			$sql = "SELECT * FROM auto_evaluaciones_alu WHERE estado = 1 AND cod_autoevaluacion IN (SELECT id 
																									FROM auto_evaluaciones 
																									WHERE gestion = ? AND trimestre = ? AND 
																										  codcur = ? AND codpar = ? AND 
																										  codmat = ? AND estado = 1)";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>