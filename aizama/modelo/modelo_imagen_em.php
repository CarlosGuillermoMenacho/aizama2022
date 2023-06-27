<?php 
	/**
	 * 
	 */
	class imagen_mixta
	{
		private $db;
		private $imagenes;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
			$this->imagenes = array();
		}

		public function guardar_imagen($codpreg,$link, $codprof)//
		{
			$estado=1;
			$fechaReg=date("Y-m-d H:i:s");
			$consulta = "INSERT INTO em_imagen (em_i_pregunta,
												em_i_link,
												em_i_fechaReg,
												em_i_codprof,
												em_i_estado)
						values(?,?,?,?,?)";
			$resultado=mysqli_prepare ($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado, "isssi", $codpreg, $link, $fechaReg, $codprof, $estado);		
			$ok=mysqli_stmt_execute($resultado);
			/*mysqli_stmt_close($resultado);
			return $ok!=false; */
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}

		public function delete_imagen($codimg, $codprof)
		{
			$fechaReg=date("Y-m-d H:i:s");
			$estado=0;
			$consulta="SELECT em_i_link FROM em_imagen WHERE em_i_estado = 1 and em_i_id=?";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"i", $codimg);
			$ok=mysqli_stmt_execute($resultado);
			$ok= mysqli_stmt_bind_result($resultado,$file);
			mysqli_stmt_fetch($resultado);
			mysqli_stmt_close($resultado);
			$consulta="UPDATE em_imagen SET em_i_estado=?,
											em_i_fechaReg=?,
											em_i_codprof=?
						WHERE em_i_id=?";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $estado, $fechaReg, $codprof, $codimg);
			$ok=mysqli_stmt_execute($resultado);

			if (file_exists("../resources/".$file)) 
			{
				unlink('../resources/'.$file);
				mysqli_stmt_close($resultado);
				
				if ($ok) {
					return true;
				}else{
					return false;
				}
			}else{
				echo "No existe imagen";
			}
		}

		public function update_imagen($codimg, $link, $codprof)
		{
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="SELECT em_i_link FROM em_imagen WHERE em_i_estado = 1 and 
			em_i_id = ?";
			$resultado = mysqli_prepare($this->db,$consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codimg);
			
			$ok=mysqli_stmt_execute($resultado);
			$ok= mysqli_stmt_bind_result($resultado,$file);
				mysqli_stmt_fetch($resultado);
				//unlink('../resources/'.$file);
				mysqli_stmt_close($resultado);
				
				$consulta = "UPDATE em_imagen SET em_i_link=?,
												em_i_fechaReg=?,
												em_i_codprof=?
							where em_i_id=?";
				$resultado=mysqli_prepare($this->db, $consulta);
				$ok=mysqli_stmt_bind_param($resultado,"sssi", $link, $fechaReg, $codprof, $codimg);
				$ok=mysqli_stmt_execute($resultado);
				
				if ($ok) {
					mysqli_stmt_close($resultado);
					return true;
				}else{
					mysqli_stmt_close($resultado);
					return false;
				}
		}
		
		public function get_imagen($codpreg)//1
		{	
			/*$consulta = $this->db->query("select em_i_link from em_imagen where em_i_pregunta = '".$codpreg."' and em_i_estado = 1");
			$lista_imagen = array();
			while($row = $consulta->fetch_object()){
				$lista_imagen[] = $row;
			}
			return $lista_imagen;*/
			$consulta= "SELECT *
			FROM em_imagen
			WHERE em_i_pregunta =? and em_i_estado = 1";

			$param=array($codpreg);
			$tipo = 'i';
			$result = ejecutar_consulta($this->db,$consulta, $tipo,$param);
			return $result;
		}

		public function get_link_imagen($codpreg)//1
		{	
			$sql = "SELECT em_i_link FROM em_imagen WHERE em_i_pregunta = ? and em_i_estado = 1 ";
			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codpreg);
			
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
		//---------------------------

	
	}		
?>
