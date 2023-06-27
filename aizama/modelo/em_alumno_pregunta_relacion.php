<?php 
	/**
	 * 
	 */
	class alumno_pregunta_rel
	{
		private $db;
		private $pregunta_relacion;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->pregunta_relacion = array();
		}
		public function get_idpregunta($id){  
            $sql= "SELECT id_preg AS total FROM em_alumno_preg_rel WHERE id=?";
            $resultado=mysqli_prepare($this->db, $sql);
            $ok=mysqli_stmt_bind_param($resultado,"i", $id);               
            $ok=mysqli_stmt_execute($resultado);           
            if ($ok) {
                $ok= mysqli_stmt_bind_result($resultado, $total);
                 mysqli_stmt_fetch($resultado);
                 return $total;
             }else{
                 return false;
            }
    }	
        public function cantidad_em_relacion($id_preg){  
			$sql= "SELECT count(*) AS total FROM em_alumno_preg_rel WHERE id_preg=?";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"i", $id_preg);               
			$ok=mysqli_stmt_execute($resultado);           
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $total);
				 mysqli_stmt_fetch($resultado);
				 return $total;
			 }else{
				 return false;
			}
		}	
        public function save_detalle_pregunta_relacion($id_preg, $nro, $campo1, $tipo1, $op_correcto, $campo2, $tipo2,$op_alum)
        {
            $consulta =" INSERT INTO em_alumno_preg_rel (id_preg, nro, campo1, tipo1, op_correcto, campo2, tipo2, nro_alum)
            VALUES (?,?, ?, ?, ?, ?, ?,?)";
            $resultado=mysqli_prepare($this->db, $consulta);
            $ok=mysqli_stmt_bind_param($resultado,"iisiisii", $id_preg, $nro, $campo1, $tipo1, $op_correcto, $campo2, $tipo2, $op_alum);
            $ok=mysqli_stmt_execute($resultado);
            if ($ok) {
                mysqli_stmt_close($resultado);
                return true;
            }else{
                mysqli_stmt_close($resultado);
                return false;
            }
        }
// actualizar nro_alumno (respuesta alumno)
		public function update_respuesta_rel( $respuesta,$id){
			$sql= "UPDATE em_alumno_preg_rel 
			SET	nro_alum=?
			WHERE id=?";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"ii", $respuesta, $id);	
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 	
		}

        public function get_detalle_pregunta_relacion($idpreg){
            $sql="SELECT * FROM em_alumno_preg_rel  WHERE id_preg=?";
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado, "i", $idpreg);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $idpreg,$nro, $campo1, $tipo1,$op_correcto,$campo2,$tipo2,$nro_alum);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"id_preg" => $idpreg,
									"nro"=> $nro,
                                    "campo1" =>$campo1,
									"tipo1"=>$tipo1,
                                    "op_correcto"=>$op_correcto,
                                    "campo2"=>$campo2,
                                    "tipo2" =>$tipo2,
                                    "nro_alum"=>$nro_alum
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