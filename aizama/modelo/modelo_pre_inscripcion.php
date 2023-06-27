<?php 
class PreInscripcion{
	private $db;
	
	function __construct($conexion)
	{
		require_once("execute_sql.php");
		$this->db = $conexion;
	}

	public function get_preinscripciones($gestion){
		$sql = "SELECT a.codigo,concat(a.paterno,' ',a.materno,' ',a.nombres) AS nombre, pi.inscripcion   
				FROM pre_inscripcion pi INNER JOIN alumno a ON  
				pi.codalu = a.codigo and a.estado= 1 and pi.estado = 1 and pi.inscripcion != 2 and pi.gestion = ? 
				ORDER BY nombre ASC";
		$params = array($gestion);
		$type = "i";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
	public function get_no_inscritos($gestion){
		$sql = "SELECT a.codigo,concat(a.paterno,' ',a.materno,' ',a.nombres) AS nombre  
				FROM pre_inscripcion pi INNER JOIN alumno a ON  
				pi.codalu = a.codigo and pi.inscripcion = 2 and a.estado= 1 and pi.estado = 1 and pi.gestion = ? 
				ORDER BY nombre ASC";
		$params = array($gestion);
		$type = "i";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
	public function save_preinscripcion($codalu,$preinscripcion,$gestion,$fechareg){
		$sql = "INSERT INTO pre_inscripcion(codalu,inscripcion,gestion,fechareg,estado)
				VALUES(?,?,?,?,1)";
		$params = array($codalu,$preinscripcion,$gestion,$fechareg);
		$type = "iiis";
		$result=ejecutar_consulta($this->db, $sql, $type, $params);
		return true;
	}
	public function get_preinscripcion($codalu){
		$sql = "SELECT * 
				FROM pre_inscripcion 
				WHERE codalu = ? and estado = 1";
		$params = array($codalu);
		$type = "i";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
	public function get_preinscripcion_alu($codalu,$gestion){
		$sql = "SELECT * 
				FROM pre_inscripcion 
				WHERE codalu = ? and estado = 1 and gestion = ?";
		$params = array($codalu,$gestion);
		$type = "ii";

		$result=ejecutar_consulta($this->db, $sql, $type, $params);

		return $result;
	}
	public function update_preinscripcion($id,$preinscripcion,$gestion,$fechareg){
		$sql = "UPDATE pre_inscripcion SET inscripcion = ?, gestion = ? , fechareg = ?
				WHERE id = ?";
		$params = array($preinscripcion,$gestion,$fechareg,$id);
		$type = "iisi";
		$result=ejecutar_consulta($this->db, $sql, $type, $params);
		return true;
	}
	public function save_justificacion($codalu,$gestion,$justificacion){
	    $pre_Insc = $this->get_preinscripcion_alu($codalu,$gestion);
	    if($fetch = $pre_Insc->fetch_object()){
	        $id_preins = $fetch->id;
	        $sql = "INSERT INTO pre_inscripcion_justificacion(id_pre_incripcion,justificacion,estado)
    				VALUES(?,?,1)";
    		$params = array($id_preins,$justificacion);
    		$type = "is";
    		$result=ejecutar_consulta($this->db, $sql, $type, $params);
    		return true;
	    }
		
	}
		
}
?>