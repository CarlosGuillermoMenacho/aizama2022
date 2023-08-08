<?php 

class Videos_Youtube{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

	public function get_all(){
	    $sql = "SELECT * 
	            FROM videos_youtube 
	            WHERE estado = 1 ORDER BY createdAt DESC";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}

	public function save($titulo,$descripcion,$enlace,$captura,$usr,$fechareg){
	    $sql = "INSERT INTO videos_youtube(titulo,descripcion,enlace,captura,estado,usr,createdAt)
	    		VALUES(?,?,?,?,1,?,?)";
		$type = "ssssss";
		$params = array($titulo,$descripcion,$enlace,$captura,$usr,$fechareg);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function update($id,$titulo,$descripcion,$enlace,$usr,$fechareg){
	    $sql = "UPDATE videos_youtube SET titulo = ?, descripcion = ? , enlace = ?, usr = ?, updateAt = ? WHERE id = ?";
		$type = "sssssi";
		$params = array($titulo,$descripcion,$enlace,$usr,$fechareg,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_captura($id,$captura,$usr,$fechareg){
	    $sql = "UPDATE videos_youtube SET captura = ?, usr = ?, updateAt = ? WHERE id = ?";
		$type = "sssi";
		$params = array($captura,$usr,$fechareg,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	
	public function delete($id,$usr,$fechareg){
	    $sql = "UPDATE videos_youtube SET usr = ?, updateAt = ?, estado = 0 WHERE id = ?";
		$type = "ssi";
		$params = array($usr,$fechareg,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function visto($id){
	    $sql = "UPDATE videos_youtube SET vistas = vistas + 1 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}

}
?>