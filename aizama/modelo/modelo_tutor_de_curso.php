<?php 
	class Tutor_de_Aula
	{
		private $db;
		public function __construct($conexion)
        {
            $this->db = $conexion;
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
        }

		public function es_tutor($gestion,$codcur,$codpar)
		{
			$sql = "SELECT * FROM tutor_de_curso WHERE gestion = ? AND codcur = ? AND codpar = ? AND estado = 1";
			$type = "iii";
			$params = array($gestion,$codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			if($fila = $result->fetch_object())return true;
			return false;
		}

		
		
	}
?>