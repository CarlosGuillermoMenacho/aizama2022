<?php 
	/**
	 * 
	 */
	class alumno_pregunta_img
	{
		private $db;
		private $alumno_preg_img;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->alumno_preg_img = array();
		}

        public function save_detalle_preg_img($idpreg, $link)
        {
            $consulta =" INSERT INTO em_alumno_preguntas_img (idpreg, link)
		 				 VALUES (?,?)";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"is", $idpreg, $link);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
        }
		public function obtener_detalle($idpreg)
		{
			$sql="SELECT * FROM em_alumno_preguntas_img WHERE idpreg=?";
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $idpreg);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $idpreg, $link);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"idpreg" => $idpreg,
                                    "link" =>$link
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}

		public function obtener_link($idpreg)
		{
			$sql= "SELECT link FROM em_alumno_preguntas_img WHERE idpreg = ?";

			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $idpreg);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $link);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $link;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}
	}	
?>