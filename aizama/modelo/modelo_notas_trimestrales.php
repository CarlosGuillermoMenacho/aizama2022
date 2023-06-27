<?php 
	class NotasTrimestrales
	{
		private $db;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
		}

		public function existe($codalu,$codmat)
		{
			$sql = "SELECT * FROM notas WHERE codigo = ? AND cod_mat = ? AND estado = 1";
			$type = "is";
			$params = array($codalu,$codmat);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			if($fila = $result->fetch_object())return $fila;
			return false;
		}
		public function delete($id)
		{
			$sql = "UPDATE notas SET estado = 0 WHERE id = ?";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return;
		}
		public function save($codalu,$codmat,$trimestre,$nota,$usr)
		{
			$fila = $this->existe($codalu,$codmat);
			if($fila){
				$this->delete($fila->id);
				$fecha = date("Y-m-d");
				$hora = date("H-i-s");
				$params;
				$type = "isiiiisss";
				$sql = "INSERT INTO notas(codigo,cod_mat,nota1,nota2,nota3,nota4,estado,usr,fecha,hora)VALUES(?,?,?,?,?,?,1,?,?,?)";
				if($trimestre == 1)$params = array($codalu,$codmat,$nota,$fila->nota2,$fila->nota3,$fila->nota4,$usr,$fecha,$hora);	
				if($trimestre == 2)$params = array($codalu,$codmat,$fila->nota1,$nota,$fila->nota3,$fila->nota4,$usr,$fecha,$hora);
				if($trimestre == 3)$params = array($codalu,$codmat,$fila->nota1,$fila->nota2,$nota,$fila->nota4,$usr,$fecha,$hora);
				if($trimestre == 4)$params = array($codalu,$codmat,$fila->nota1,$fila->nota2,$fila->nota3,$nota,$usr,$fecha,$hora);

				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				return;
			}else{
				$fecha = date("Y-m-d");
				$hora = date("H-i-s");
				$params;
				$type = "isisss";
				$sql = "";
				$params = array($codalu,$codmat,$nota,$usr,$fecha,$hora);	
				if($trimestre == 1)$sql = "INSERT INTO notas(codigo,cod_mat,nota1,estado,usr,fecha,hora)VALUES(?,?,?,1,?,?,?)";
				if($trimestre == 2)$sql = "INSERT INTO notas(codigo,cod_mat,nota2,estado,usr,fecha,hora)VALUES(?,?,?,1,?,?,?)";
				if($trimestre == 3)$sql = "INSERT INTO notas(codigo,cod_mat,nota3,estado,usr,fecha,hora)VALUES(?,?,?,1,?,?,?)";
				if($trimestre == 4)$sql = "INSERT INTO notas(codigo,cod_mat,nota4,estado,usr,fecha,hora)VALUES(?,?,?,1,?,?,?)";

				$result = ejecutar_consulta($this->db,$sql,$type,$params);
				return;
			}
		}	
	}
?>