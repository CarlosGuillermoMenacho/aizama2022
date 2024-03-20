<?php 

class Material{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

	public function get_material_gestion($gestion,$codcur,$codpar){
		$sql = "SELECT * FROM material_de_apoyo WHERE gestion = ? AND estado = 1 AND codcur = ? AND codpar = ? ";
		$type = "iii";
		$params = array($gestion,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_material_count($gestion,$codcur,$codpar,$codmat){
		$sql = "SELECT COUNT(*) as n FROM material_de_apoyo WHERE gestion = ? AND estado = 1 AND codcur = ? AND codpar = ? AND codmat = ?";
		$type = "iiis";
		$params = array($gestion,$codcur,$codpar,$codmat);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		$row = $result->fetch_object();
		return $row->n;
	}
	
}
?>