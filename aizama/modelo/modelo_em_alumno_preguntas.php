<?php 
	/**
	 * 
	 */
	class alumno_pregunta
	{
		private $db;
		private $alumno_preg;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->alumno_preg = array();
		}

        public function save_detalle_pregunta_alumnos($idaem,$tipo,$pregunta,$notaPreg, $notaC)//guardar la pregunta que le toco al alumno
        {	
            $consulta =" INSERT INTO em_alumno_preguntas (idaem,tipo,pregunta,notaPreg, notaC,estado)
		 				 VALUES (?,?,?,?,?,1)";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iisii",$idaem,$tipo,$pregunta,$notaPreg, $notaC);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
        }

    //obtener todas las preguntas de una evaluacion de un alumno
        public function get_preg_Eval($idaem)
        {
            $sql="SELECT * FROM em_alumno_preguntas WHERE idaem=?";
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $idaem);
			$ok = mysqli_stmt_execute($resultado);

			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $idaem,$tipo, $pregunta, $notaPreg, $notaC, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"idaem" => $idaem,
                                    "tipo" =>$tipo,
									"pregunta" => $pregunta,
									"notapreg" => $notaPreg,
									"notaC" => $notaC
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
        }
		
	  //obtener todas las preguntas de una evaluacion de un alumno (codalu, codeva)	
    // actualizar la notacalificada
        public function update_notaC($id, $notaC){
            $consulta = "UPDATE em_alumno_preguntas SET notaC=? WHERE id=? ";
			$resultado = mysqli_prepare($this->db,$consulta);
			$ok = mysqli_stmt_bind_param($resultado, "ii", $notaC, $id);

			$ok = mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
        } 

		public function save_notac($notaC){
			$consulta =" INSERT INTO em_alumno_preguntas (idaem,tipo,pregunta,notaPreg, notaC)
		 				 VALUES (?,?,?,?,?)";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iisii",$idaem,$tipo,$pregunta,$notaPreg, $notaC);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}
    //---------------------------------------------
	}	
?>