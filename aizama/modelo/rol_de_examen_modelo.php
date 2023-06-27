<?php 
	class Rol_de_Examen
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}
		public function get_rol($id){
		    $sql ="SELECT * FROM rol_de_examen WHERE id = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_rol_curso($gestion,$trimestre,$codcur,$codpar){
		    $sql ="SELECT * FROM rol_de_examen WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND estado = 1 ORDER BY fecha,hora ASC";
			$type = "iiii";
			$params = array($gestion,$trimestre,$codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_rol_curso_materia($gestion,$trimestre,$codcur,$codpar,$codmat){
		    $sql ="SELECT * FROM rol_de_examen WHERE gestion = ? AND trimestre = ? AND codcur = ? AND codpar = ? AND codmat = ? AND estado = 1";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save($gestion,$trimestre,$codcur,$codpar,$codmat,$descripcion,$fecha,$hora,$fechareg,$codprof){
		    $sql ="INSERT INTO rol_de_examen(gestion,trimestre,codcur,codpar,codmat,descripcion,fecha,hora,estado,fechareg,codprof)
		    	   VALUES(?,?,?,?,?,?,?,?,1,?,?)";
			$type = "iiiissssss";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat,$descripcion,$fecha,$hora,$fechareg,$codprof);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function delete_rol($id,$fechareg,$codprof){
		    $sql ="UPDATE rol_de_examen SET estado = 0 , fechareg = ? ,codprof = ? WHERE id = ?";
			$type = "ssi";
			$params = array($fechareg,$codprof,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update_rol($id,$descripcion,$fecha,$hora,$fechareg,$codprof){
		    $sql ="UPDATE rol_de_examen SET descripcion = ?, fecha = ?, hora = ?, fechareg = ?, codprof = ? WHERE id = ?";
			$type = "sssssi";
			$params = array( $descripcion , $fecha , $hora , $fechareg , $codprof , $id );
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		
	}
?>