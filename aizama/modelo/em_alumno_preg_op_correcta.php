<?php 
	/**
	 * 
	*/
	class alumno_preg_opcorrecta
	{
		private $db;
		private $pregunta_opcorrecta;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->pregunta_opcorrecta = array();
		}
		
        public function save_detalle_em_alum_pregunta($idpreg, $op_correcta, $op_alumno)
        {
            $consulta =" INSERT INTO em_alumno_preg_op_correcta (id_preg, nro_op_correcta, nro_op_alum)
            VALUES (?,?,?)";
            $resultado=mysqli_prepare($this->db, $consulta);
            $ok=mysqli_stmt_bind_param($resultado,"iii", $idpreg, $op_correcta, $op_alumno);
            $ok=mysqli_stmt_execute($resultado);
            if ($ok) {
                mysqli_stmt_close($resultado);
                return true;
            }else{
                mysqli_stmt_close($resultado);
                return false;
            }
        }
		// actualizar respuesta de alumno
		public function update_respuesta_alum_op( $op_alumno, $idpreg){//evaluacion_mixta_alu
			$sql= "UPDATE em_alumno_preg_op_correcta
				   SET nro_op_alum = ? 
				   WHERE id_preg=?";

			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"ii", $op_alumno, $idpreg);	
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}


        public function get_detalle_oporrecta($id_preg)
        {
            $sql="SELECT * FROM em_alumno_preg_op_correcta WHERE id_preg=?";
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado, "i", $id_preg);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $id_preg, $nro_opcorrecta, $nro_opalumno);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"id_preg" => $id_preg,
                                    "nro_op_correcta" =>$nro_opcorrecta,
									"nro_op_alum"=>$nro_opalumno
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
        }

		public function get_oporrecta($id_preg)
        {
            $sql= "SELECT nro_op_correcta FROM em_alumno_preg_op_correcta WHERE id_preg=?";
			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $id_preg);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $op_correcta);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $op_correcta;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
        }
		public function get_oporrecta_alum($id_preg)
        {
            $sql= "SELECT nro_op_alum FROM em_alumno_preg_op_correcta WHERE id_preg=?";
			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $id_preg);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $op_correcta_alum);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $op_correcta_alum;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
        }
	}	
?>