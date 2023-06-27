<?php 
	/**
	 * 
	 */
	class pregunta_mixta 
	{
		private $db;
		private $preguntas;
		public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();
			$this->preguntas=array();
		}

		public function crear_preguntas($codeva, $fechaReg, $codprof, $tipo)
		{ 
			$estado=1;
			$consulta = "INSERT INTO em_preguntas(em_p_evaluacion, 
												em_p_fechaReg,
												em_p_codprof,
												em_p_tipo,
												em_p_estado)
						 VALUES (? ,? ,? ,?, ?)";

			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issii", $codeva, $fechaReg, $codprof, $tipo, $estado);
			
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}

		public function guardar_pregunta_nota($codpreg, $pregunta, $nota) 
		{
			$fechaReg=date("Y-m-d H:i:s");
			$consulta="UPDATE em_preguntas SET em_p_pregunta=?,
												em_p_nota=?,
												em_p_fechaReg=?
						WHERE em_p_id=?";

			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"sisi", $pregunta, $nota, $fechaReg, $codpreg);
			
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}
		 
		public function get_pregunta($codpreg){//  Obtiene el campo de pregunta de un codpreg
			$consulta = $this->db->query("select em_p_id, em_p_pregunta from em_preguntas where em_p_id = '".$codpreg."'");
			$lista_preguntas = array();
			while($row = $consulta->fetch_object()){
				$lista_preguntas[] = $row;
			}
			return $lista_preguntas;
		}

		public function get_nota($codpreg){// obtiene nota de una pregunta segun el codpreg
			$consulta = $this->db->query("select em_p_id, em_p_nota from em_preguntas where em_p_id = '".$codpreg."'");
			$lista_preguntas = array();
			while($row = $consulta->fetch_object()){
				$lista_preguntas[] = $row;
			}
			return $lista_preguntas;
		}
		

		public function get_preguntas_profesor($codprof){ // obtiene todas las preguntas de un profesor
			$consulta = $this->db->query("select * from evaluacion_mixta where em_codprof = '".$codprof."'");
			$lista_preguntas = array();
			while($row = $consulta->fetch_object()){
				$lista_preguntas[] = $row;
			}

			return $lista_preguntas; 
		}
		public function get_detalle_pregunta($codpreg){// obtiene todo el detalle de una pregunta
			/*$consulta = $this->db->query("select * from em_preguntas where em_p_id = '".$codpreg."'");
			$lista_preguntas = array();
			while($row = $consulta->fetch_object()){
				$lista_preguntas[] = $row;
			}

			return $lista_preguntas;*/
			$consulta="SELECT * FROM em_preguntas WHERE em_p_id =? and em_p_estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codpreg);
			$ok = mysqli_stmt_execute($resultado);
			if($ok){
				$ok= mysqli_stmt_bind_result($resultado, $codpreg, $codeva,
				$em_p_pregunta, $em_p_nota, $em_p_tipo, $em_p_fechaReg, $em_p_codprof,  $em_p_estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)){
						$lista[] = array(
							"codpreg" => $codpreg,
							"codeva" => $codeva,
							"pregunta" => $em_p_pregunta,
							"nota" => $em_p_nota,
							"tipo" => $em_p_tipo,
							"fechaReg" => $em_p_fechaReg,
							"codprof" => $em_p_codprof,
							"estado" => $em_p_estado
						);
				}	
				mysqli_stmt_close($resultado);
				return $lista;
			}
				mysqli_stmt_close($resultado);
			 	return false;

		}
		public function get_detalle_de_pregunta($codpreg,$tipo){
			$consulta ="SELECT * FROM em_preguntas WHERE em_p_id = ? and em_p_tipo = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"ii",$codpreg,$tipo);
			$ok=mysqli_stmt_execute($resultado);
			$fila= array();
			if($ok){
				$ok= mysqli_stmt_bind_result($resultado, $codpre, $em_p_evaluacion,
				$em_p_pregunta, $em_p_nota,$em_p_tipo, $em_p_fechaReg, $em_p_codprof,  $em_p_estado);
				$lista = array();
				mysqli_stmt_fetch($resultado);
					$lista = array(
						"codpreg"=>$codpreg,
						"codeva"=>$em_p_evaluacion,
						"pregunta"=>$em_p_pregunta,
						"nota"=>$em_p_nota,
						"tipo"=>$em_p_tipo,
						"fechaReg"=>$em_p_fechaReg,
						"codprof"=>$em_p_codprof,
						"estado"=>$em_p_estado
					);
				mysqli_stmt_close($resultado);
				return $lista;
			}else{
				mysqli_stmt_close($resultado);
			 	return false;
			}
		}

		public function update_pregunta($codpreg, $pregunta,$codprof){// actualiza el campo pregunta 

			$fechaReg=date("Y-m-d H:i:s");
			$consulta = " UPDATE em_preguntas SET em_p_pregunta=?,
		    								em_p_fechaReg = ?,
		    								em_p_codprof = ? 
		    		where em_p_id = ?";

		   	$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"sssi", $pregunta, $fechaReg, $codprof, $codpreg);
			
			$ok=mysqli_stmt_execute($resultado);
			/* mysqli_stmt_close($resultado);
			return $ok!=false; 		*/
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}

		public function update_nota ($codpreg, $nota, $codprof){ // actualiza la nota de una pregunta
			$fechaReg=date ("Y-m-d H:i:s");
			$consulta="UPDATE em_preguntas SET em_p_nota=?,
												em_p_fechaReg=?,
												em_p_codprof=?
						WHERE em_p_id=? ";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado, "issi", $nota, $fechaReg, $codprof,$codpreg);

			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}

  		public function update_detalle_de_pregunta($codpreg, $codeva,$pregunta ,$nota,$codprof,$tipo){ // actualiza todos los campos de una pregunta 
  			$fechaReg=date("Y-m-d H:i:s");
  			$consulta= "UPDATE em_preguntas SET em_p_evaluacion=?,
  												em_p_pregunta=?,
  												em_p_nota=?,
  												em_p_fechaReg=?,
  												em_p_codprof=?,
  												em_p_tipo=?
  						WHERE em_p_id=?";
  			$resultado=mysqli_prepare($this->db,$consulta);
  			$ok=mysqli_stmt_bind_param($resultado,"isissii",$codeva,$pregunta,$nota,$fechaReg,$codprof, $tipo,$codpreg);
  			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
  		}
		public function get_codeva($codpreg){
			$consulta = $this->db->query("SELECT em_p_evaluacion FROM em_preguntas WHERE em_p_id = '".$codpreg."'");
			$lista_preguntas = array();
			while($row = $consulta->fetch_object()){
				$lista_preguntas[] = $row;
			}
			return $lista_preguntas;
			
		}
		public function guardar_detalle_pregunta($codeva, $pregunta, $nota, $codprof, $tipo)
		{// Guarda todo el detalle de una pregunta de una evaluacion
			$fechaReg=date("Y-m-d H:i:s");

			$sql="SELECT insertar_pregunta_mixta(?,?,?,?,?,?,?) as id";
			$type= "isiissi";
			$params=array ($codeva, $pregunta, $nota, $tipo, $fechaReg,$codprof,1);
			$result=ejecutar_consulta($this->db, $sql, $type, $params);

			if ($fila=$result->fetch_object()){
				require_once("modelo_evaluacion_mixta.php");
				$evaluacionmixta = new Evaluacion_mixta($this->db);
				$evaluacionmixta->incremetar_banco($this->db,$codeva);
				return $fila->id;
			}else{
				return false;
			}
		}
		public function delete_pregunta($codpreg, $codprof){ // Elimina la pregunta
			$fechaReg=date("Y-m-d H:i:s");
			$estado=0;
			$consulta= "UPDATE em_preguntas SET em_p_estado=?,
												em_p_fechaReg=?,
												em_p_codprof=?
						WHERE em_p_id=?";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $estado, $fechaReg, $codprof, $codpreg);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;	
			/*$codeva= get_codeva($codpreg);
			
			if ($fila=$resultado->fetch_object()){
				require_once("../modelo/modelo_evaluacion_mixta.php");
				Evaluacion_mixta::decremetar_banco($this->db,$codeva);
				return $fila->em_p_evaluacion;
			}else{
				return false;
			}*/
		}
		public function get_tipo($codpreg)
		{// obtiene tipo de preguntas
			$consulta = $this->db->query("SELECT em_p_tipo FROM em_preguntas WHERE em_p_id = '".$codpreg."'");

			$lista_preguntas = array();
			while($row = $consulta->fetch_object()){
				$lista_preguntas[] = $row;
			}
			return $lista_preguntas;
		}
		
		public function get_preguntas($codeva)
		{// obtiene todas las preguntas de una evaluacion
			$consulta="SELECT em_p_id, em_p_evaluacion, em_p_pregunta, em_p_nota, 
					   em_p_tipo, em_p_fechaReg, em_p_codprof, em_p_estado 
					    FROM em_preguntas
			 			WHERE em_p_evaluacion= ? and em_p_estado=1";
			
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"i", $codeva);	
			$ok=mysqli_stmt_execute($resultado);
			$fila=array();
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$codpreg,$codeva,$pregunta,$nota,$tipo,$fechaReg,$codprof,$estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codpreg"=>$codpreg,
									"codeva"=>$codeva,
									"pregunta"=>$pregunta,
									"nota"=>$nota,
									"tipo"=>$tipo,
									"fechaReg"=>$fechaReg,
									"codprof"=>$codprof,
									"estado"=>$estado
									);
				}				
				mysqli_stmt_close($resultado);
				return $lista;
			}
				mysqli_stmt_close($resultado);
				return false;
		}

		public function delete_preguntas_Evaluacion($codeva,$codprof){// elimina todas las preguntas de una evaluacion
			$fechaReg=date("Y-m-d H:i:s");
			$estado=0;
			$consulta="UPDATE em_preguntas SET em_p_estado=?,
												em_p_fechaReg=?,
												em_p_codprof=?
						WHERE em_p_evaluacion=?";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $estado, $fechaReg, $codprof, $codeva);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function get_preguntas_eva($codeva)
		{	$consulta="SELECT * FROM em_preguntas WHERE em_p_evaluacion =? and em_p_estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codeva);
			$ok = mysqli_stmt_execute($resultado);
			if($ok){
				$ok= mysqli_stmt_bind_result($resultado, $codpreg, $codeva,
				$em_p_pregunta, $em_p_nota, $em_p_tipo, $em_p_fechaReg, $em_p_codprof,  $em_p_estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)){
						$lista[] = array(
							"codpreg" => $codpreg,
							"codeva" => $codeva,
							"pregunta" => $em_p_pregunta,
							"nota" => $em_p_nota,
							"tipo" => $em_p_tipo,
							"fechaReg" => $em_p_fechaReg,
							"codprof" => $em_p_codprof,
							"estado" => $em_p_estado
						);
				}	
				mysqli_stmt_close($resultado);
				return $lista;
			}
				mysqli_stmt_close($resultado);
			 	return false;
		} 
		//para las permutaciones
		public function get_notapreg($codeva){// obtiene todas las nota de una pregunta segun el codeva
			$consulta="SELECT em_p_id ,em_p_nota FROM em_preguntas WHERE em_p_evaluacion =? and em_p_estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codeva);
			$ok = mysqli_stmt_execute($resultado);
			if($ok){
				$ok= mysqli_stmt_bind_result($resultado, $em_p_id, $em_p_nota);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)){
						$lista[] = array(
							"em_p_id" => $em_p_id,
							"nota" => $em_p_nota
						);
				}	
				mysqli_stmt_close($resultado);
				return $lista;
			}
				mysqli_stmt_close($resultado);
			 	return false;
		}	
		
	}
?>