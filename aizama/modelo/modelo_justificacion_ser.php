<?php 
	class Justificacion_ser
	{
		private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();

		}

		public function save($id_ser_decidir,$justificacion,$fechareg,$codprof){
			if($id = $this->existeRegistro($id_ser_decidir)){
				$sql = "UPDATE justificacion_ser SET justificacion = ?,fechareg = ?, codprof = ? WHERE id = ?";
				$type = "sssi";
				$params = array($justificacion,$fechareg,$codprof,$id);
				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				
				return true;
			}else if(!empty($justificacion)){
				$sql = "INSERT INTO justificacion_ser(id_ser_decidir,justificacion,fechareg,codprof,estado) 
										 VALUES(?,?,?,?,1)";
				$type = "isss";
				$params = array($id_ser_decidir,$justificacion,$fechareg,$codprof);
				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				return true;
			}
		}
		public function get_justificacion($id){
			$sql = "SELECT * FROM justificacion_ser WHERE id_ser_decidir = ? AND estado = 1";
			$type = "i";
			$params = array($id);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			if($fila = $result->fetch_object()){
				return $fila->justificacion;
			}else{
				return "";
			}
		}
		public function existeRegistro($id)
		{
			$sql = "SELECT * FROM justificacion_ser WHERE id_ser_decidir = ? AND estado = 1";
			$type = "i";
			$params = array($id);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			if($fila = $result->fetch_object()){
				return $fila->id;
			}else{
				return false;
			}
		}
		
	}
?>