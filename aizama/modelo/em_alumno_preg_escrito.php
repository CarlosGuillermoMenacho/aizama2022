<?php 
	/**
	 * 
	 */
	class alumno_preg_escrito
	{
		private $db;
		private $pregunta_escrita;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->pregunta_escrita = array();
		}

        public function save_detalle_pregunta_escrita($id_preg, $respuesta, $fechaActual)
        {
            $consulta =" INSERT INTO em_alumno_preg_escrito (id_preg, respuesta, fechaReg)
            VALUES (?, ?, ?)";
            $resultado=mysqli_prepare($this->db, $consulta);
            $ok=mysqli_stmt_bind_param($resultado,"iss", $id_preg, $respuesta, $fechaActual);
            $ok=mysqli_stmt_execute($resultado);
            if ($ok) {
                mysqli_stmt_close($resultado);
                return true;
            }else{
                mysqli_stmt_close($resultado);
                return false;
            }
        }

		public function update_respuesta_esc( $respuesta,$idpreg){
			$fechaReg= date("Y-m-d H:i:s");
			$sql= "UPDATE em_alumno_preg_escrito 
			SET	respuesta=?,
				fechaReg=?
			WHERE id_preg=?";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"ssi", $respuesta, $fechaReg, $idpreg);	
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 	

		}
        public function get_detalle_pregunta_escrita($idpreg){
            $sql="SELECT * FROM em_alumno_preg_escrito WHERE id_preg=?";
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado, "i", $idpreg);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $idpreg, $respuesta);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"id_preg" => $idpreg,
                                    "respuesta" =>$respuesta
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
        }
		public function get_respuesta($idpreg)
		{
			$sql= "SELECT respuesta FROM em_alumno_preg_escrito WHERE id_preg=?";

			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $idpreg);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $respuesta);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $respuesta;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}
	}	
?>