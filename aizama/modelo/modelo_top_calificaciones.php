<?php 
	class TopCalificaciones
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

		function save($gestion,$trimestre,$codalu,$codmat,$nota,$usr,$fechareg){
			$sql = "INSERT INTO top_calificaciones(gestion,trimestre,codalu,codmat,nota,usr,fechareg,estado) VALUES(?,?,?,?,?,?,?,1)";
			$type = "iiisiss";
			$params = array($gestion,$trimestre,$codalu,$codmat,$nota,$usr,$fechareg);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		function get($gestion,$trimestre,$codalu,$codmat){
			$sql = "SELECT * FROM top_calificaciones WHERE estado = 1 AND gestion = ? AND trimestre = ? AND codalu = ? AND codmat = ?";
			$type = "iiis";
			$params = array($gestion,$trimestre,$codalu,$codmat);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		function get_top($gestion,$trimestre){
			$sql = "SELECT * FROM top_calificaciones WHERE estado = 1 AND gestion = ? AND trimestre = ?";
			$type = "ii";
			$params = array($gestion,$trimestre);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		function get_top_curso($gestion,$trimestre,$codcur,$codpar){
			$sql = "SELECT * FROM top_calificaciones WHERE estado = 1 AND gestion = ? AND trimestre = ? AND codalu IN (SELECT codigo FROM alumno where estado = 1 AND cod_cur = ? AND cod_par = ?)";
			$type = "iiii";
			$params = array($gestion,$trimestre,$codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		function update($id,$nota,$usr,$fechareg){
			$sql = "UPDATE top_calificaciones SET nota = ?, usr = ?, fechareg = ? WHERE id = ?";
			$type = "issi";
			$params = array($nota,$usr,$fechareg,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		function delete($id){
			$sql = "UPDATE top_calificaciones SET estado = 0 WHERE id = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		
	}
?>