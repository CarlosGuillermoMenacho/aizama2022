<?php 
	class Evaluacion_inicial
	{
		private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
		public function get_all(){
			$sql = "SELECT * FROM evaluacion_inicial WHERE estado = 1";
			$type = "";
			$params = array();
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_all_trimestre($gestion,$trimestre){
			$sql = "SELECT * FROM evaluacion_inicial WHERE gestion = ? AND trimestre = ? AND estado = 1";
			$type = "ii";
			$params = array($gestion,$trimestre);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_evaluacion($id){
			$sql = "SELECT * FROM evaluacion_inicial WHERE id = ? AND estado = 1";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_all_curso($gestion,$codcur,$codpar){
			$sql = "SELECT * FROM evaluacion_inicial WHERE gestion = ? AND codcur = ? AND codpar = ? AND estado = 1";
			$type = "iii";
			$params = array($gestion,$codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}

		public function get_evaluaciones_profesor($gestion,$trimestre,$codprof){
			$sql = "SELECT DISTINCT ei.id, ei.codcur,ei.codpar,ei.codmat,ei.descripcion,ei.visible,ei.inicio,ei.fin,ei.fueradetiempo FROM evaluacion_inicial ei INNER JOIN prof_cur_mat p ON ei.gestion = ? AND ei.trimestre = ? AND ei.codcur = p.codcur AND ei.codpar = p.codpar  AND ei.estado = 1 AND p.estado = 'activo' AND p.gestion = ? AND p.prof = ?";
			$type = "iiis";
			$params = array($gestion,$trimestre,$gestion,$codprof);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_all_trimestre_curso($gestion,$trimestre,$codcur,$codpar){
			$sql = "SELECT * FROM evaluacion_inicial WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND estado = 1";
			$type = "iiii";
			$params = array($gestion,$trimestre,$codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}		
		public function save($gestion,$trimestre,$codcur,$codpar,$codmat,$descripcion,$visible,$inicio,$fin,$fuera_de_tiempo,$createdAt){
			$sql = "INSERT INTO evaluacion_inicial(gestion,trimestre,codcur,codpar,codmat,descripcion,visible,inicio,fin,fueradetiempo,createdAt,estado)
					VALUES(?,?,?,?,?,?,?,?,?,?,?,1)";
			$type = "iiiississis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat,$descripcion,$visible,$inicio,$fin,$fuera_de_tiempo,$createdAt);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $this->db->insert_id;
		}
		public function update($id,$descripcion,$visible,$inicio,$fin,$updateAt){
			$sql = "UPDATE evaluacion_inicial SET descripcion = ?, visible = ?, inicio = ?, fin = ?, updateAt = ? WHERE id = ?";
			$type = "sisssi";
			$params = array($descripcion,$visible,$inicio,$fin,$updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function set_fuera_de_tiempo($id,$timeout,$updateAt){
			$sql = "UPDATE evaluacion_inicial SET fueradetiempo = ?, updateAt = ? WHERE id = ?";
			$type = "isi";
			$params = array($timeout,$updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function delete($id,$updateAt){
			$sql = "UPDATE evaluacion_inicial SET estado = 0, updateAt = ? WHERE id = ?";
			$type = "si";
			$params = array($updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save_actividad($id_evaluacion,$id_actividad){
			$sql = "SELECT * FROM evaluacion_inicial_actividad WHERE id_evaluacion_inicial = ? AND id_actividad_evalaucion_incial = ? AND estado = 1";
			$type = "ii";
			$params = array($id_evaluacion,$id_actividad);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			if($row = $result->fetch_object())return;
			$sql = "INSERT INTO evaluacion_inicial_actividad(id_evaluacion_inicial,id_actividad_evalaucion_incial) VALUES(?,?,1)";
			$type = "ii";
			$params = array($id_evaluacion,$id_actividad);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function delete_actividad($id_evaluacion,$id_actividad){
			$sql = "UPDATE evaluacion_inicial_actividad SET estado = 0 WHERE id_evaluacion_inicial = ? AND id_actividad_evaluacion_inicial = ?";
			$type = "ii";
			$params = array($id_evaluacion,$id_actividad);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save_actividad_alumno($codalu,$id_evaluacion_alumno,$id_actividad,$captura,$ordenadas,$createdAt){
			$sql = "INSERT INTO evaluacion_inicial_actividad_alumno(codalu,id_evaluacion_alumno,id_actividad,captura,ordenadas,createdAt,estado)
					VALUES(?,?,?,?,?,?,1)";
			$type = "iiisss";
			$params = array($codalu,$id_evaluacion_alumno,$id_actividad,$captura,$ordenadas,$createdAt);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_actividad_alumno($codalu,$id_evaluacion_alumno,$id_actividad){
			$sql = "SELECT * FROM evaluacion_inicial_actividad_alumno WHERE estado = 1 AND codalu = ? AND id_evaluacion_alumno = ? AND id_actividad = ?";
			$type = "iii";
			$params = array($codalu,$id_evaluacion_alumno,$id_actividad);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update_captura_actividad_alumno($id,$captura,$ordenadas,$updateAt){
			$sql = "UPDATE evaluacion_inicial_actividad_alumno SET captura = ?,ordenadas = ? , updateAt = ? WHERE id = ?";
			$type = "sssi";
			$params = array($captura,$ordenadas,$updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update_observacion_actividad_alumno($id,$observacion,$updateAt){
			$sql = "UPDATE evaluacion_inicial_actividad_alumno SET observacion = ? , updateAt = ? WHERE id = ?";
			$type = "ssi";
			$params = array($observacion,$updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_evaluacion_en_proceso($codalu){
			$sql = "SELECT * FROM evaluacion_inicial_alumno WHERE codalu = ? AND proceso = 1 AND estado = 1";
			$type = "i";
			$params = array($codalu);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_evaluacion_alumno($codalu,$id_evaluacion){
			$sql = "SELECT * FROM evaluacion_inicial_alumno WHERE codalu = ? AND id_evaluacion = ? AND estado = 1";
			$type = "ii";
			$params = array($codalu,$id_evaluacion);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function calificar_evaluacion_alumno($id,$calificacion,$updateAt){
			$sql = "UPDATE evaluacion_inicial_alumno SET proceso = 0, calificacion = ?,updateAt = ? WHERE id = ?";
			$type = "ssi";
			$params = array($calificacion,$updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function iniciar_evaluacion($codalu,$id_evaluacion,$proceso,$createdAt){
			$sql = "INSERT INTO evaluacion_inicial_alumno(codalu,id_evaluacion,estado,proceso,createdAt) VALUES(?,?,1,?,?)";
			$type = "iiis";
			$params = array($codalu,$id_evaluacion,$proceso,$createdAt);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function finalizar_evaluacion($id,$updateAt){
			$sql = "UPDATE evaluacion_inicial_alumno SET proceso = 0 , updateAt = ? WHERE id = ?";
			$type = "si";
			$params = array($updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function delete_evaluacion_proceso($id,$updateAt){
			$sql = "UPDATE evaluacion_inicial_alumno SET estado = 0 , updateAt = ? WHERE id = ?";
			$type = "si";
			$params = array($updateAt,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_actividades($codeva){
			$sql = "SELECT a.id,a.descripcion,a.script,a.captura FROM evaluacion_inicial_actividad ea INNER JOIN evaluacion_inicial_actividades a ON ea.id_actividad_evaluacion_inicial = a.id AND ea.estado = 1 AND a.estado = 1 AND ea.id_evaluacion_inicial = ?";
			$type = "i";
			$params = array($codeva);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_actividades_all(){
			$sql = "SELECT id,descripcion,script,captura FROM evaluacion_inicial_actividades WHERE estado = 1";
			$type = "";
			$params = array();
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_actividades_curso($gestion,$trimestre,$codcur,$codpar){
			$sql = "SELECT a.id,a.descripcion,a.captura FROM evaluacion_inicial_actividad_programada e INNER JOIN evaluacion_inicial_actividades a ON e.id_actividad = a.id AND e.gestion = ? AND e.trimestre = ? AND e.codcur = ? AND e.codpar = ? AND e.estado = 1 ";
			$type = "iiii";
			$params = array($gestion,$trimestre,$codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function contar_actividades($codeva){
			$sql = "SELECT count(*) as total FROM evaluacion_inicial_actividad ea INNER JOIN evaluacion_inicial_actividades a ON ea.id_actividad_evaluacion_inicial = a.id AND ea.estado = 1 AND a.estado = 1 AND ea.id_evaluacion_inicial = ?";
			$type = "i";
			$params = array($codeva);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_actividad($id){
			$sql = "SELECT * FROM evaluacion_inicial_actividades WHERE id = ? AND estado = 1";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_actividad_relizada($id_actividad,$codcur,$codpar){
			$sql = "SELECT * FROM evaluacion_inicial_actividad_alumno e INNER JOIN alumno a AND e.id_actividad = ? AND e.estado = 1";
			$type = "i";
			$params = array($id_actividad);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>