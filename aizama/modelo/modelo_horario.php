<?php 
	class Horario
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
		public function get_horarios(){
			
		}
		public function get_horario($codcur,$codpar){
		    $sql ="SELECT * FROM horario WHERE cod_cur = ? AND cod_par = ?";
			$type = "ii";
			$params = array($codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			if($fila = $result->fetch_object()){
			    return $fila->img_base64;
			}else{
			    return false;
			}
		}
		public function get_horario_id($id){
			$sql ="SELECT * FROM horario_curso2 WHERE id = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_horario_curso($codcur,$codpar){
			$sql ="SELECT * FROM horario_curso2 WHERE codcur = ? AND codpar = ? AND estado = 1";
			$type = "ii";
			$params = array($codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_horario_curso_dia($codcur,$codpar,$dia){
			$sql ="SELECT * FROM horario_curso2 WHERE codcur = ? AND codpar = ? AND dia = ? AND estado = 1";
			$type = "iii";
			$params = array($codcur,$codpar,$dia);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_horario_curso_dia_periodo($codcur,$codpar,$dia,$periodo){
			$sql ="SELECT * FROM horario_curso2 WHERE codcur = ? AND codpar = ? AND dia = ? AND periodo = ? AND estado = 1";
			$type = "iiii";
			$params = array($codcur,$codpar,$dia,$periodo);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save_horario($codcur,$codpar,$codmat,$dia,$periodo){
			$this->deshabilitar_horario($codcur,$codpar,$dia,$periodo);
			$sql ="INSERT INTO horario_curso2(codcur,codpar,codmat,dia,periodo,estado) VALUES(?,?,?,?,?,1)";
			$type = "iisii";
			$params = array($codcur,$codpar,$codmat,$dia,$periodo);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $this->db->insert_id;
		}
		public function update_horario($id,$codmat){
			$sql ="UPDATE horario_curso2 SET codmat = ? WHERE id = ?";
			$type = "si";
			$params = array($codmat,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
		}
		public function delete_horario($id){
			$sql ="UPDATE horario_curso2 SET estado = 0 WHERE id = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
		}
		public function deshabilitar_horario($codcur,$codpar,$dia,$periodo){
			$sql ="UPDATE horario_curso2 SET estado = 0 WHERE codcur = ? AND codpar = ? AND dia = ? AND periodo = ?";
			$type = "iiii";
			$params = array($codcur,$codpar,$dia,$periodo);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
		}
		
	}
?>