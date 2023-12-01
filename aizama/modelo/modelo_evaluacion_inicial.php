<?php 
	class Evaluacion_inicial
	{
		private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
		public function get_evaluaciones($gestion,$trimestre,$codalu){
			$sql = "SELECT * FROM evaluaciones_inicial WHERE gestion = ? AND trimestre = ? AND codalu = ? AND estado = 1";
			$type = "iii";
			$params = array($gestion,$trimestre,$codalu);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_evaluacion($gestion,$trimestre,$codalu,$evaluacion){
			$sql = "SELECT * FROM evaluaciones_inicial WHERE gestion = ? AND trimestre = ? AND codalu = ? AND evaluacion = ? AND estado = 1";
			$type = "iiii";
			$params = array($gestion,$trimestre,$codalu,$evaluacion);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save_evaluacion($gestion,$trimestre,$codalu,$evaluacion,$imagen,$fecha){
			$sql = "INSERT INTO evaluaciones_inicial(gestion,trimestre,codalu,evaluacion,imagen,estado,fecha) VALUES(?,?,?,?,?,1,?)";
			$type = "iiiiss";
			$params = array($gestion,$trimestre,$codalu,$evaluacion,$imagen,$fecha);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update_evaluacion($imagen,$fecha,$id){
			$sql = "UPDATE evaluaciones_inicial SET imagen = ? , fecha = ? WHERE id = ?";
			$type = "ssi";
			$params = array($imagen,$fecha,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function set_calificacion($calificacion,$id){
			$sql = "UPDATE evaluaciones_inicial SET calificacion = ? WHERE id = ?";
			$type = "si";
			$params = array($calificacion,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function delete_evaluacion($id){
			$sql = "UPDATE evaluaciones_inicial SET estado = 0 WHERE id = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>