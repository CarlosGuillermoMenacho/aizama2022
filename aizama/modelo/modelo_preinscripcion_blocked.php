<?php 
class Blocked_Preinscripcion{
	private $db;
	
	function __construct($conexion)
	{
		require_once("execute_sql.php");
		$this->db = $conexion;
	}
	public function get_lista(){
		$sql = "SELECT *  
				FROM pre_inscripcion_blocked 
				WHERE estado = 1";
		$params = array();
		$type = "";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
	public function save($codalu,$fechareg,$usr){
		$sql = "INSERT INTO pre_inscripcion_blocked(codalu,fechareg,usr,estado)
				VALUES (?,?,?,1)";
		$params = array($codalu,$fechareg,$usr);
		$type = "isi";
		$result=ejecutar_consulta($this->db, $sql, $type, $params);
		return true;
	}
	public function delete($codalu){
		$sql = "UPDATE pre_inscripcion_blocked SET estado = 0 
				WHERE codalu = ?";
		$params = array($codalu);
		$type = "i";
		$result=ejecutar_consulta($this->db, $sql, $type, $params);
		return  true;
	}	

	public function is_blocked($codalu){
		$sql = "SELECT *  
				FROM pre_inscripcion_blocked 
				WHERE codalu = ? and estado = 1";
		$params = array($codalu);
		$type = "i";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
	public function get_registro($codalu){
		$sql = "SELECT *  
				FROM pre_inscripcion_blocked 
				WHERE codalu = ? ";
		$params = array($codalu);
		$type = "i";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
	public function update($codalu,$fechareg,$estado,$usr){
		$sql = "UPDATE pre_inscripcion_blocked SET estado = ?, fechareg = ?, usr = ? 
				WHERE codalu = ?";
		$params = array($estado,$fechareg,$usr,$codalu);
		$type = "isii";
		$result=ejecutar_consulta($this->db, $sql, $type, $params);
		return  true;
	}
}
?>