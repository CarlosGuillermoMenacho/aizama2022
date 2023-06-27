<?php 
	class Autoevaluacion
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
		}

		public function save($gestion,$trimestre,$codcur,$codpar,$codmat,$file,$fechareg,$codprof){
			
			if($id = $this->existeRegistro($gestion,$trimestre,$codcur,$codpar,$codmat)){
			    
			    $oldFile  = $this->get_file($id);
			    if($oldFile != "NoFile")unlink("../autoevaluaciones/".$oldFile);
				$sql = "UPDATE auto_evaluaciones SET file = ? , fechareg = ? , codprof = ? WHERE id = ?";
				$type = "sssi";
				$params = array($file,$fechareg,$codprof,$id);
				
				$result = ejecutar_consulta($this->db,$sql,$type,$params);

				return true;
			}else{
				$sql = "INSERT INTO auto_evaluaciones(gestion,trimestre,codcur,codpar,codmat,file,fechareg,codprof,visible,estado) 
										 VALUES(?,?,?,?,?,?,?,?,0,1)";
				$type = "iiiissss";
				$params = array($gestion,$trimestre,$codcur,$codpar,$codmat,$file,$fechareg,$codprof);
				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				return true;
			}
		}
		public function get_auto_evaluaciones($gestion,$trimestre,$codcur,$codpar,$codmat){
			$sql = "SELECT * FROM auto_evaluaciones WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND codmat = ? AND estado = 1";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
        public function get_auto_evaluacion($gestion,$trimestre,$codcur,$codpar,$codmat){
			$sql = "SELECT * FROM auto_evaluaciones WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND codmat = ? AND estado = 1";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			if($fila = $result->fetch_object())return $fila;
			return null;
		}
		public function existeRegistro($gestion,$trimestre,$codcur,$codpar,$codmat)
		{
			$sql = "SELECT * FROM auto_evaluaciones WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND codmat = ? AND estado = 1";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			if($fila = $result->fetch_object()){
				return $fila->id;
			}else{
				return false;
			}
		}
		public function set_visible($id,$visible){
		    $sql = "UPDATE auto_evaluaciones SET visible = ? WHERE id = ?";
			$type = "ii";
			$params = array($visible,$id);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_file($id){
		    $sql = "SELECT * FROM auto_evaluaciones WHERE id = ?";
			$type = "i";
			$params = array($id);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			$fila = $result->fetch_object();
			return $fila->file;
			
		}
		public function get_autoevaluaciones_alu($gestion,$trimestre,$codcur,$codpar){
		    $sql = "SELECT * FROM auto_evaluaciones WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND visible = 1 AND estado = 1";
			$type = "iiii";
			$params = array($gestion,$trimestre,$codcur,$codpar);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		public function getAutoevaluacion($codeva){
			$sql = "SELECT * FROM auto_evaluaciones WHERE id = ? AND estado = 1";
			$type = "i";
			$params = array($codeva);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		
	}
?>