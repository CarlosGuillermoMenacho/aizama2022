<?php 
	/**
	 * 
	 */
	class alumno_preg_vf
	{
		private $db;
		private $pregunta_vf;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->pregunta_vf = array();
		}

        public function save_detalle_pregunta_vf($idpreg, $vf, $vf_alumno)
        {
            $consulta =" INSERT INTO em_alumno_preg_vf (id_preg, vf, vf_alum)
            VALUES (?, ?, ?)";
            $resultado=mysqli_prepare($this->db, $consulta);
            $ok=mysqli_stmt_bind_param($resultado,"iii", $idpreg, $vf, $vf_alumno);
            $ok=mysqli_stmt_execute($resultado);
            if ($ok) {
                mysqli_stmt_close($resultado);
                return true;
            }else{
                mysqli_stmt_close($resultado);
                return false;
            }
        }

		
        public function get_detalle_pregunta_vf($idpreg){
            $sql="SELECT * FROM em_alumno_preg_vf WHERE id_preg=?";
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado, "i", $idpreg);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $idpreg, $vf, $vf_alumno);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"id_preg" => $idpreg,
                                    "vf" =>$vf,
									"vf_alumno"=>$vf_alumno
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
        }
		public function get_respuesta_doc_vf($idpreg){
			$sql= "SELECT vf FROM em_alumno_preg_vf WHERE id_preg = ?";

			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $idpreg);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $vf);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $vf;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}
// actualizar 
		public function update_respuesta_alum_vf($idpreg, $alum_vf){
			$sql= "UPDATE em_alumno_preg_vf 
				   SET vf_alum = ? 
				   WHERE id_preg=?";

			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"ii", $alum_vf, $idpreg);	
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}

		public function get_respuesta_alum_vf($idpreg){
			$sql= "SELECT vf_alum FROM em_alumno_preg_vf WHERE id_preg = ?";
			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $idpreg);
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok){
				$ok= mysqli_stmt_bind_result($resultado, $vf_alumno);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $vf_alumno;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}
	}	
?>
