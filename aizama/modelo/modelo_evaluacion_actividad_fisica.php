<?php 

class Tipo_Evaluacion_Actividad_Fisica{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

	public function get_all(){
	    $sql = "SELECT * 
	            FROM evaluacion_actividad_fisica 
	            WHERE estado = 1";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function save($descripcion){
	    $sql = "INSERT INTO evaluacion_actividad_fisica(descripcion,estado) VALUES(?,1)";
		$type = "s";
		$params = array($descripcion);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function get($id){
	    $sql = "SELECT * 
	            FROM evaluacion_actividad_fisica 
	            WHERE estado = 1 AND id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function update($id){
	    $sql = "UPDATE evaluacion_actividad_fisica 
	    		SET descripcion = ? 
	            WHERE estado = 1 AND id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function delete($id){
	    $sql = "UPDATE evaluacion_actividad_fisica 
	    		SET estado = 0 
	            WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
}
?>