<?php 

class PracticoWeb{
	
	private $db;

	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}

	public function get_practicos_web($gestion,$trimestre,$codcur,$codpar,$codmat){
	    $sql = "SELECT * 
	            FROM practicos_web 
	            WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND 
	            codmat = ? AND estado = 1 ORDER BY id ASC";
		$type = "iiiis";
		$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	
	public function get_practicos_web_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat){
	    $sql = "SELECT id, codpractweb, codalumno, fecha, hora, nota 
	            FROM practicos_web_alumno WHERE codpractweb IN (SELECT id FROM practicos_web WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND 
	            codmat = ? AND estado = 1) AND estado > 0 ORDER BY codpractweb ASC";
		$type = "iiiis";
		$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

		$result = ejecutar_consulta($this->db,$sql,$type,$params);

		return $result;
	}
	public function get_practicos_fechas($profe,$fi,$ff){
		$sql = "SELECT * FROM practicos_web WHERE estado = 1 AND codprof = ? AND fechaReg >= ? AND fechaReg < ?";
		$type = "sss";
		$params = array($profe,$fi,$ff);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_practicos_prof($gestion,$codprof){
		$sql = "SELECT p.id,p.codcur,p.codpar,p.codmat,p.descripcion,p.fecha,p.hora,p.editable,p.nota FROM practicos_web p INNER JOIN prof_cur_mat pr ON p.gestion = ? AND p.codcur = pr.codcur AND p.codpar = pr.codpar AND p.codmat = pr.codmat AND p.estado = 1 AND pr.estado = 'activo' AND pr.prof = ?";
		$type = "is";
		$params = array($gestion,$codprof);
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
}
?>