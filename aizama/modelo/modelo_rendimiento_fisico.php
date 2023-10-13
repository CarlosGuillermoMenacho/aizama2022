<?php 

class Actividad_fisica{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}

	public function get_all(){
	    $sql = "SELECT * 
	            FROM actividad_fisica 
	            WHERE estado = 1";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function get_actividad_curso($gestion,$codcur,$codpar){
	    $sql = "SELECT af.id,af.descripcion,af.id_evaluacion,eaf.descripcion as eval
	            FROM actividad_fisica af INNER JOIN evaluacion_actividad_fisica eaf ON af.estado = 1 AND af.gestion = ? AND af.codcur = ? AND af.codpar = ? AND af.id_evaluacion = eaf.id ORDER BY af.id ASC";
		$type = "iii";
		$params = array($gestion,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function get_registro_rendimiento_curso($id){
		$sql = "SELECT * FROM actividad_fisica_alumno WHERE id_actividad_fisica = ? AND estado = 1";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function save($gestion,$descripcion,$id_evaluacion,$codcur,$codpar,$codprof,$createdAt){
	    $sql = "INSERT INTO actividad_fisica(gestion,descripcion,id_evaluacion,codcur,codpar,codprof,estado,createdAt) VALUES(?,?,?,?,?,?,1,?)";
		$type = "isiiiss";
		$params = array($gestion,$descripcion,$id_evaluacion,$codcur,$codpar,$codprof,$createdAt);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $this->db->insert_id;
	}
	public function save_rendimiento($codalu,$id_actividad_fisica,$evaluacion,$observacion,$codprof,$createdAt){
	    $sql = "INSERT INTO actividad_fisica_alumno(codalu,id_actividad_fisica,evaluacion,observacion,estado,codprof,createdAt) VALUES(?,?,?,?,1,?,?)";
		$type = "iissss";
		$params = array($codalu,$id_actividad_fisica,$evaluacion,$observacion,$codprof,$createdAt);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $this->db->insert_id;
	}
	public function update($descripcion,$evaluacion,$codprof,$updateAt,$id){
	    $sql = "UPDATE actividad_fisica SET descripcion = ? , evaluacion = ? , codprof = ? , updateAt = ? WHERE id = ?";
		$type = "sissi";
		$params = array($descripcion,$evaluacion,$codprof,$updateAt,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function update_rendimiento($id,$evaluacion,$observacion,$codprof,$createdAt){
	    $sql = "UPDATE actividad_fisica_alumno SET evaluacion = ? , observacion = ? , codprof = ? , updateAt = ? WHERE id = ?";
		$type = "ssssi";
		$params = array($descripcion,$evaluacion,$codprof,$updateAt,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function delete($id){
	    $sql = "UPDATE actividad_fisica SET estado = 0 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function delete_rendimiento($id){
	    $sql = "UPDATE actividad_fisica_alumno SET estado = 0 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_observacion($id,$observacion,$codprof,$updateAt){
	    $sql = "UPDATE actividad_fisica_alumno SET observacion = ?,codprof = ? , updateAt = ? WHERE id = ?";
		$type = "sssi";
		$params = array($observacion,$codprof,$updateAt,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_evaluacion($id,$evaluacion,$codprof,$updateAt){
	    $sql = "UPDATE actividad_fisica_alumno SET evaluacion = ? ,codprof = ? , updateAt = ? WHERE id = ?";
		$type = "sssi";
		$params = array($evaluacion,$codprof,$updateAt,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_descripcion($id,$descripcion,$codprof,$updateAt){
	    $sql = "UPDATE actividad_fisica SET descripcion = ? ,codprof = ? , updateAt = ? WHERE id = ?";
		$type = "sssi";
		$params = array($descripcion,$codprof,$updateAt,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function set_type($id,$tipe,$codprof,$updateAt){
	    $sql = "UPDATE actividad_fisica SET id_evaluacion = ? ,codprof = ? , updateAt = ? WHERE id = ?";
		$type = "issi";
		$params = array($tipe,$codprof,$updateAt,$id);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}

}
?>