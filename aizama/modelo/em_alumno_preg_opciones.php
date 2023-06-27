<?php 
	/**
	 * 
	 */
	class alumno_pregunta_opciones
	{
		private $db;
		private $alumno_preg_op;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->alumno_preg_op = array();
		}

        public function save_pregunta_opcion($idpreg, $nro_op, $opcion)
        {
            $consulta =" INSERT INTO em_alumno_preg_opcion (id_preg, nro_op, opcion)
		 				 VALUES (?,?,?)";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iis", $idpreg, $nro_op, $opcion);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
        }
		public function get_detalle_preg_opciones($idpreg){
			$sql="SELECT * FROM em_alumno_preg_opcion WHERE id_preg=?";
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado, "i", $idpreg);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $idpreg, $nro_op, $opcion);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"idpreg" => $idpreg,
                                    "nro_op" =>$nro_op,
									"opcion"=>$opcion
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}
	}	
?>