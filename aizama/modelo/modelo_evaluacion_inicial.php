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
		public function get_all_curso($gestion,$codcur,$codpar){
			$sql = "SELECT * FROM evaluacion_inicial WHERE gestion = ? AND codcur = ? AND codpar = ? AND estado = 1";
			$type = "iii";
			$params = array($gestion,$codcur,$codpar);
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
		public function save($gestion,$trimestre,$codcur,$codpar,$descripcion,$visible,$inicio,$fin,$fuera_de_tiempo,$createdAt){
			$sql = "INSERT INTO evaluacion_inicial(gestion,trimestre,codcur,codpar,descripcion,visible,inicio,fin,fueradetiempo,createdAt,estado)
					VALUES(?,?,?,?,?,?,?,?,?,?,1)";
			$type = "iiiisissis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$descripcion,$visible,$inicio,$fin,$fuera_de_tiempo,$createdAt);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update($id,$descripcion,$visible,$inicio,$fin,$fuera_de_tiempo,$updateAt){
			$sql = "UPDATE evaluacion_inicial SET descripcion = ?, visible = ?, inicio = ?, fin = ?, fueradetiempo = ?, updateAt = ? WHERE id = ?";
			$type = "sissisi";
			$params = array($descripcion,$visible,$inicio,$fin,$fuera_de_tiempo,$updateAt,$id);
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
			$sql = "UPDATE evaluacion_inicial SET estado = 0 WHERE id_evaluacion_inicial = ? AND id_actividad_evalaucion_incial = ?";
			$type = "ii";
			$params = array($id_evaluacion,$id_actividad);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save_actividad_alumno($codalu,$id_evaluacion_alumno,$id_actividad,$captura,$createdAt){
			$sql = "INSERT INTO evaluacion_inicial_actividad_alumno(codalu,id_evaluacion_alumno,id_actividad,captura,createdAt,estado)
					VALUES(?,?,?,?,?,1)";
			$type = "iiiss";
			$params = array($codalu,$id_evaluacion_alumno,$id_actividad,$captura,$createdAt);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update_captura_actividad_alumno($id,$captura,$updateAt){
			$sql = "UPDATE evaluacion_inicial_actividad_alumno SET captura = ? , updateAt = ? WHERE id = ?";
			$type = "ssi";
			$params = array($captura,$updateAt,$id);
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
	}
?>