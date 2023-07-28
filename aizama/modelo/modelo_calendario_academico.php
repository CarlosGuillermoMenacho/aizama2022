<?php 

class Calendario_Academico{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

	public function get_all(){
	    $sql = "SELECT * 
	            FROM calendario_academico 
	            WHERE estado = 1";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}

	public function get_gestion($gestion){
	    $sql = "SELECT * 
	            FROM calendario_academico 
	            WHERE gestion = ? AND estado = 1 ORDER BY fecha ASC";
		$type = "i";
		$params = array($gestion);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}

	public function save($gestion,$descripcion,$fecha,$usr,$fechareg){
	    $sql = "INSERT INTO calendario_academico(gestion,descripcion,fecha,estado,usr,createdAt)
	    		VALUES(?,?,?,1,?,?)";
		$type = "issss";
		$params = array($gestion,$descripcion,$fecha,$usr,$fechareg);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function update($id,$descripcion,$fecha,$usr,$fechareg){
	    $sql = "UPDATE calendario_academico SET descripcion = ? , fecha = ?, usr = ?, updateAt = ? WHERE id = ?";
		$type = "ssssi";
		$params = array($descripcion,$fecha,$usr,$fechareg,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function delete($id,$usr,$fechareg){
	    $sql = "UPDATE calendario_academico SET usr = ?, updateAt = ?, estado = 0 WHERE id = ?";
		$type = "ssi";
		$params = array($usr,$fechareg,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	
}
?>