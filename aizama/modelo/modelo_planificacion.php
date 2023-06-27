<?php 
class Planificacion{
	private $db;
		
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
	public function save($fecha,$codcur,$codpar,$periodo,$codmat,$actividad,$act_compl,$recursos,$fechareg,$codprof){
		$consulta ="INSERT INTO planificacion(fecha,codcur,codpar,periodo,codmat,actividad,actividad_complementaria,recursos,fechareg,codprof,estado)
					VALUES (?,?,?,?,?,?,?,?,?,?,1)";
		$type = "siisssssss";
		$params = array($fecha,$codcur,$codpar,$periodo,$codmat,$actividad,$act_compl,$recursos,$fechareg,$codprof);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return true;
	}
	public function delete($id){
		$consulta ="UPDATE planificacion SET estado = 0 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return true;
	}
	public function restore($id){
		$consulta ="UPDATE planificacion SET estado = 1 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return true;
	}
	public function get_planificacion_curso($codcur,$codpar,$gestion){
		$gestion = $gestion."%";
		$consulta ="SELECT * 
					FROM planificacion 
					WHERE fecha LIKE ? AND codcur = ? AND codpar = ? AND estado = 1 ORDER BY fecha ASC";
		$type = "sii";
		$params = array($gestion,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_planificacion_curso_fecha($codcur,$codpar,$gestion,$fecha){
		
		$consulta ="SELECT * 
					FROM planificacion 
					WHERE fecha = ? AND codcur = ? AND codpar = ? AND estado = 1 ORDER BY fecha ASC";
		$type = "sii";
		$params = array($fecha,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_planificacion($id){
		$consulta ="SELECT * 
					FROM planificacion 
					WHERE id = ? AND estado = 1 ";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_planificacion_curso_materia($codcur,$codpar,$array_codmat){
		$consulta ="SELECT * 
					FROM planificacion 
					WHERE codcur = ? AND codpar = ? AND codmat = ? AND estado = 1 ";
		$type = "iis";
		$params = array($codcur,$codpar,$array_codmat[0]);
		for ($i=1; $i < count($array_codmat); $i++) { 
			$consulta = $consulta." UNION SELECT * 
									FROM planificacion 
									WHERE codcur = ? AND codpar = ? AND codmat = ? AND estado = 1";// code...
			$type = $type."iis";
			$params[] = $codcur;
			$params[] = $codpar;
			$params[] = $array_codmat[$i];
		}
		$consulta = $consulta." ORDER BY fecha ASC";
		
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_planificacion_fecha($fecha,$codcur,$codpar){
		$consulta ="SELECT * 
					FROM planificacion 
					WHERE fecha = ? AND codcur = ? AND codpar = ? AND estado = 1 ORDER BY periodo ASC";
		$type = "sii";
		$params = array($fecha,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_planificacion_fechas($fechai,$fechaf){
		$consulta ="SELECT * 
					FROM planificacion 
					WHERE fecha >= ? AND fecha <= ? AND estado = 1 ORDER BY codcur, codpar,fecha";
		$type = "ss";
		$params = array($fechai,$fechaf);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_planificaciones_prof($gestion,$codprof){
		
		$consulta ="SELECT p.id,p.fecha,p.codcur,p.codpar,p.periodo,p.codmat,p.actividad,p.actividad_complementaria,p.recursos,p.fechareg,p.codprof 
					FROM planificacion p INNER JOIN prof_cur_mat pc
					WHERE p.estado = 1 AND p.codcur = pc.codcur AND 
						  p.codmat = pc.codmat AND p.codpar = pc.codpar AND pc.estado = 'activo' AND 
						  pc.gestion = ? AND pc.prof = ? ORDER BY p.fecha DESC";
		$type = "is";
		$params = array($gestion,$codprof);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;	
	}
	public function get_periodos($fecha,$codcur,$codpar,$codprof,$gestion){
		$consulta ="SELECT p.periodo  
					FROM planificacion p INNER JOIN prof_cur_mat pm ON 
					 	 p.fecha = ? AND p.codcur = pm.codcur AND p.codpar = pm.codpar AND p.codmat = pm.codmat AND 
					 	 p.estado = 1 AND pm.prof = ? AND pm.gestion = ? AND pm.estado = 'activo' 
					UNION 
					SELECT periodo 
					FROM planificacion 
					WHERE fecha = ? AND codcur = ? AND codpar = ? AND estado = 1";
		$type = "ssisii";
		$params = array($fecha,$codprof,$gestion,$fecha,$codcur,$codpar);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}


}
?>