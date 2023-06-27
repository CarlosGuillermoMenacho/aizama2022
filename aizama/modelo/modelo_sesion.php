<?php 
	class Session
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
		}
		public function get_session_data($token){
		    $sql ="SELECT * FROM session WHERE token = ? ";
			$type = "s";
			$params = array($token);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}		
		public function save($token,$address,$user,$tipo,$time){
			$this->delete_expired_sessions($user,$tipo);
			$sql ="INSERT INTO session(token,address,id_user,tipo,tiempo) VALUES (?,?,?,?,?)";
			$type = "sssss";
			$params = array($token,$address,$user,$tipo,$time);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}

		public function update_session($token,$tiempo){
			$sql ="UPDATE session SET tiempo = ? WHERE token = ? ";
			$type = "ss";
			$params = array($tiempo,$token);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		function delete_expired_sessions($user,$tipo){
			$time = time();
			$sql ="DELETE FROM session WHERE id_user = ? AND tipo = ? AND tiempo < ? ";
			$type = "sss";
			$params = array($user,$tipo,$time);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
		}
		public function delete_sesion($token){
			$sql ="DELETE FROM session WHERE token = ?";
			$type = "s";
			$params = array($token);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
		}
	}
?>