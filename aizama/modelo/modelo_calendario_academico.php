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
	            WHERE gestion = ? AND estado = 1 ORDER BY desde ASC";
		$type = "i";
		$params = array($gestion);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}

	public function save($gestion,$descripcion,$file,$desde,$hasta,$usr,$fechareg){
	    $sql = "INSERT INTO calendario_academico(gestion,descripcion,file,desde,hasta,estado,usr,createdAt)
	    		VALUES(?,?,?,?,?,1,?,?)";
		$type = "issssss";
		$params = array($gestion,$descripcion,$file,$desde,$hasta,$usr,$fechareg);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function update($id,$descripcion,$desde,$hasta,$usr,$fechareg){
	    $sql = "UPDATE calendario_academico SET descripcion = ? , desde = ?,hasta = ?, usr = ?, updateAt = ? WHERE id = ?";
		$type = "sssssi";
		$params = array($descripcion,$desde,$hasta,$usr,$fechareg,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_imagen($id,$file,$usr,$fechareg){
	    $sql = "UPDATE calendario_academico SET file = ?, usr = ?, updateAt = ? WHERE id = ?";
		$type = "sssi";
		$params = array($file,$usr,$fechareg,$id);
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
	public function get_fecha($fecha){
	    $sql = "SELECT * 
	            FROM calendario_academico 
	            WHERE desde <= ? AND hasta >= ? AND estado = 1";
		$type = "ss";
		$params = array($fecha,$fecha);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}
?>