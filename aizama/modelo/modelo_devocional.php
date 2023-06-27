<?php 
	/**
	 * 
	 */
	class Devocional
	{
		private $db;
		private $devocional;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->devocional = array();
		}

		public function guardar_devocional($fecha,$imagen, $texto, $fechaReg,$codProf, $estado)
		{   $consulta =" INSERT INTO devocional(fecha, imagen, texto, fechaReg, codprof, estado)
            VALUES (?,?,?,?,?,?)";
            $estado=1;
            $resultado=mysqli_prepare($this->db, $consulta);
            $ok=mysqli_stmt_bind_param($resultado,"sssssi", $fecha, $imagen, $texto,$fechaReg, $codProf, $estado);
            $ok=mysqli_stmt_execute($resultado);
            if ($ok) {
            mysqli_stmt_close($resultado);
            return true;
            }else{
            mysqli_stmt_close($resultado);
            return false;
            }
		}

        public function editar_devocional($fecha,$imagen, $texto, $fechaReg,$codProf)
        {   $consulta =" UPDATE devocional SET imagen = ?,
                                                texto = ?,
                                               fechaReg = ?,
                                                codprof = ?
                            where fecha = ?";
            $resultado=mysqli_prepare($this->db, $consulta);
            $ok=mysqli_stmt_bind_param($resultado,"sssss", $imagen,$texto, $fechaReg, $codProf, $fecha);
            $ok=mysqli_stmt_execute($resultado);
            if ($ok) {
                mysqli_stmt_close($resultado);
                return true;
            }else{
                mysqli_stmt_close($resultado);
                return false;
            }
        } 
        
        public function eliminar_devocional($fecha){
            $estado=0;
			$consulta= "UPDATE devocional set estado = ? where fecha =?";
			$resultado= mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"is",$estado, $fecha);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;	

        }
        public function get_devocional($fecha){
            $estado = 1;
			$sql = "SELECT * FROM devocional WHERE fecha = ? and estado=?";
			$resultado= mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"si", $fecha,$estado);
			$ok = mysqli_stmt_execute($resultado);

			if ($ok) {
				$ok = mysqli_stmt_bind_result($resultado, $id, $fecha,$imagen, $texto, $fechaReg,$codprof, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"fecha" => $fecha,
                                    "imagen" =>$imagen,
									"texto" => $texto,
									"fechaReg" => $fechaReg,
									"codprof" => $codprof,
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
		public function get_imagen($fecha){
			$estado=1;
			$consulta= "SELECT imagen 
				   FROM devocional 
				   WHERE fecha= ? and estado=?";
	
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"si", $fecha, $estado);
				
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$imagen);
				if(mysqli_stmt_fetch($resultado)){
					return $imagen;
				}
				return false;
				mysqli_stmt_close($resultado);
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}
		public function get_cant_devocional($fecha)
		{	$estado=1;
			$sql = "SELECT COUNT(*) as total FROM devocional WHERE fecha=? and estado = ?"; 

			$resultado= mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"si",$fecha, $estado);
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
//--------------------------------
	}	
?>