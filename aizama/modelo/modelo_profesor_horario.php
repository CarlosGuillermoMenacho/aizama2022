<?php 
	class ProfesorHorario
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
		public function get_all(){
		    $sql ="SELECT * FROM profesor_horario WHERE estado = 1 ";
			$type = "";
			$params = array();
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}		
		public function get_profesores($codcur,$codpar){
			$sql ="SELECT * FROM profesor_horario ph INNER JOIN horario_curso2 hc ON hc.codcur = ? AND hc.codpar = ? AND hc.id = ph.codclase AND ph.estado = 1 AND hc.estado = 1";
			$type = "ii";
			$params = array($codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save($codprof,$codclase,$codusr){
			$fechareg = date("Y-m-d H:i:s");
			$sql ="INSERT INTO profesor_horario(codprof,codclase,estado,fechareg,codusr) VALUES (?,?,1,?,?)";
			$type = "sisi";
			$params = array($codprof,$codclase,$fechareg,$codusr);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function delete($id){
			$fechareg = date("Y-m-d H:i:s");
			$sql ="UPDATE profesor_horario SET estado = 0, fechareg = ? WHERE id = ?";
			$type = "si";
			$params = array($fechareg,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>