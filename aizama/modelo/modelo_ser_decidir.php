<?php 
	class SerDecidir
	{
		private $db;
		private $jus_ser;
		private $jus_dec;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
			require_once'modelo_justificacion_ser.php';
			require_once'modelo_justificacion_decidir.php';
			$this->jus_ser = new Justificacion_ser($conexion);
			$this->jus_dec = new Justificacion_decidir($conexion);
		}
        public function existeRegistro($gestion,$trimestre,$codalu,$codmat)
		{
			$sql = "SELECT * FROM ser_decidir WHERE gestion = ? AND trimestre = ? AND codalu = ? AND codmat = ? AND estado = 1";
			$type = "iiis";
			$params = array($gestion,$trimestre,$codalu,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			if($fila = $result->fetch_object()){
				return $fila->id;
			}else{
				return false;
			}
		}
		public function save($gestion,$trimestre,$codalu,$codmat,$ser,$decidir,$fechareg,$codprof,$ser_justificacion,$decidir_justificacion){
			$id = $this->existeRegistro($gestion,$trimestre,$codalu,$codmat);
			if($id){
				$sql = "UPDATE ser_decidir SET ser = ? , decidir = ? , fechareg = ? , codprof = ? WHERE id = ?";
				$type = "iissi";
				$params = array($ser,$decidir,$fechareg,$codprof,$id);
				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				
			    $this->jus_ser->save($id,$ser_justificacion,$fechareg,$codprof);
				$this->jus_dec->save($id,$decidir_justificacion,$fechareg,$codprof);
				return true;
			}else{
				$sql = "INSERT INTO ser_decidir(gestion,trimestre,codalu,codmat,ser,decidir,fechareg,codprof,estado) 
										 VALUES(?,?,?,?,?,?,?,?,1)";
				$type = "iiisiiss";
				$params = array($gestion,$trimestre,$codalu,$codmat,$ser,$decidir,$fechareg,$codprof);
				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				$id = $this->existeRegistro($gestion,$trimestre,$codalu,$codmat);
				$this->jus_ser->save($id,$ser_justificacion,$fechareg,$codprof);
				$this->jus_dec->save($id,$decidir_justificacion,$fechareg,$codprof);
				return true;
			}
		}
		public function get_ser_decidir($gestion,$trimestre,$codalu,$codmat){
			$sql = "SELECT * FROM ser_decidir WHERE gestion = ? AND trimestre = ? AND codalu = ? AND codmat = ? AND estado = 1";
			$type = "iiis";
			$params = array($gestion,$trimestre,$codalu,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			$datos = array();
			if($fila = $result->fetch_object()){
				$id_ser_decidir = $fila->id;
				$ser_justificacion = $this->jus_ser->get_justificacion($id_ser_decidir);
				$decidir_justificacion = $this->jus_dec->get_justificacion($id_ser_decidir);
				$datos = array(
							"id"=>$id_ser_decidir,
							"ser"=>$fila->ser,
							"decidir"=>$fila->decidir,
							"jus_ser"=>$ser_justificacion,
							"jus_dec"=>$decidir_justificacion);			
			}
			return $datos;
		}
		public function get_ser_decidir_materia($gestion,$trimestre,$codmat){
			$sql = "SELECT * FROM ser_decidir WHERE gestion = ? AND trimestre = ?  AND codmat = ? AND estado = 1";
			$type = "iis";
			$params = array($gestion,$trimestre,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
	}
?>