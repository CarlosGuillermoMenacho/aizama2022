<?php 
	/**
	 * 
	 */
	class alumno_observacion
	{
		private $db;
		private $observacion;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->observacion = array();
		}

        public function save_detalle_observacion($id_preg, $observacion, $codprof, $fechaReg, $estado)
        {
            $consulta =" INSERT INTO em_alum_observaciones(id_preg, observacion, codprof, fechaReg, estado)
		 				 VALUES (?,?,?,?,?)";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"isssi",$id_preg, $observacion, $codprof, $fechaReg, $estado);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!= false;
        }
		
        public function get_observacion($id_preg)
        {
            $sql = "SELECT * FROM em_alum_observaciones WHERE id_preg = ? ";
			$resultado= mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $id_preg);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok = mysqli_stmt_bind_result($resultado, $id, $id_preg, $observacion, $codprof, $fechaReg, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"id_preg" => $id_preg,
                                    "observacion" =>$observacion,
									"codprof" => $codprof,
									"fechaReg" => $fechaReg,
									"estado" => $estado
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
        }

		public function get_campo_observacion($idpreg)
		{
			$sql= "SELECT observacion FROM em_alum_observaciones WHERE id_preg = ?";

			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $idpreg);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $observacion);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $observacion;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}

        public function update_observacion($id, $observacion){
            $consulta = "UPDATE em_alum_observaciones SET observacion=? WHERE id=? ";
			$resultado = mysqli_prepare($this->db,$consulta);
			$ok = mysqli_stmt_bind_param($resultado, "si", $observacion, $id);

			$ok = mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
        } 
    //---------------------------------------------
	public function get_cant_observaciones($id_preg)
	{	$estado=1;
		$sql = "SELECT COUNT(*) as total FROM em_alum_observaciones WHERE id_preg=? and estado = ?"; 

		$resultado= mysqli_prepare($this->db, $sql);
		$ok = mysqli_stmt_bind_param($resultado,"ii",$id_preg, $estado);
		$ok = mysqli_stmt_execute($resultado);

		if ($ok) {
			$ok = mysqli_stmt_bind_result($resultado, $total);
			mysqli_stmt_fetch($resultado);
			mysqli_stmt_close($resultado);
			 return $total;
		}else{
			 mysqli_stmt_close($resultado);
			 return false;
		}
	}
}	
?>