<?php 
	/**
	 * 
	 */
	class em_alumno 
	{
		private $db;
		private $alumno;

		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->alumno = array();
		}

		public function save_evaluacion_alumno($codalu, $codeva,$fechaini, $fechafin, $notafinal)
		{	$consulta ="SELECT insertar_evaluacion_alumno(?,?,?,?,?,?,?) as id";
			$proceso=1;
			$estado=1;
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iissiii", $codalu, $codeva, $fechaini, $fechafin, $notafinal, $proceso, $estado);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$id);
				mysqli_stmt_fetch($resultado);
				mysqli_stmt_close($resultado);
				return $id;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}

		// procedimiento para finalizar update proceso=0
		public function finalizar($id, $codalu, $codeva )
		{
			$consulta=" UPDATE em_alumno SET proceso = 0
						where id = ? and codalu=? and codeva=?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iii", $id, $codalu, $codeva);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}
		//FINALIZAR EVALUACION FORMATO_eM_ALU
		public function finalizarEvaluacion($id)
		{
			$consulta=" UPDATE em_alumno SET proceso = 0
						where id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"i", $id);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}
		//
		public function get_em_alumno($codalu)//obtener todas las evaluaciones de un alumno 
		{	$sql="SELECT * FROM em_alumno WHERE codalu=? and estado = ?";
			$estado=1;
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"ii", $codalu, $estado);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$id,$codalu,$codeva,$fechaini,$fechafin,$notafinal,$proceso, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"codalu" => $codalu,
									"codeva" => $codeva,
									"fechaini" => $fechaini,
									"fechafin" => $fechafin,
									"notafinal" => $notafinal,
									"proceso" => $proceso,
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

		public function get_notafinal_alumno($codalu, $codeva)//obtiene la nota final fizalizado
		{	
			$sql="SELECT notafinal FROM em_alumno WHERE codalu=? and codeva=? and proceso=? and estado = ?";
			$proceso=0;
			$estado=1;
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"iiii", $codalu, $codeva,$proceso, $estado);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $total);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $total;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
			/*if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,  $notafinal);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"notafinal" => $notafinal
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }*/
		}
		public function get_id_em_alumno($codalu, $codeva)//
		{	
			$sql="SELECT id FROM em_alumno WHERE codalu=? and codeva=? and estado = ?";
			$estado=1;
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"iii", $codalu, $codeva, $estado);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $total);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $total;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}
		//--------------------mgps--
		public function get_eva_alumno($codalu, $codeva)//obtiene la evaluacion alumno
		{	
			$sql="SELECT * FROM em_alumno WHERE codalu=? and codeva=? and estado = ?";
			$estado=1;
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"iii", $codalu, $codeva, $estado);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $codalu, $codeva, $fechaini, $fechafin, $notafinal, $proceso, $estado);
				if (mysqli_stmt_fetch($resultado)) {
					return array(
									"id" => $id,
									"codalu" => $codalu,
									"codeva" => $codeva,
									"fechaini" => $fechaini,
									"fechafin" => $fechafin,
									"notafinal" => $notafinal,
									"proceso" => $proceso,
									"estado" => $estado
									);
				}
				mysqli_stmt_close($resultado);
			 	return "";
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}	
		}
		public function get_eva_em_alumno($codalu, $codeva)//obtiene la evaluacion iniciada de un alumno
		{	
			$sql="SELECT * FROM em_alumno WHERE codalu=? and codeva=? and proceso=1 and estado = ?";
			$estado=1;
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"iii", $codalu, $codeva, $estado);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $codalu, $codeva, $fechaini, $fechafin, $notafinal, $proceso, $estado);
				if (mysqli_stmt_fetch($resultado)) {
					return array(
									"id" => $id,
									"codalu" => $codalu,
									"codeva" => $codeva,
									"fechaini" => $fechaini,
									"fechafin" => $fechafin,
									"notafinal" => $notafinal,
									"proceso" => $proceso,
									"estado" => $estado
									);
				}
				mysqli_stmt_close($resultado);
			 	return "";
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}	
		}
		public function get_eval_proceso($codalu){
			
			$sql= " SELECT * FROM em_alumno WHERE codalu = ? and estado = 1 and proceso = 1 
			 ";
			// // si no tomo en cuenta el proceso=1 me sale de la anterior evaluacion
			$resultado = mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $codalu);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $codalu, $codeva, $fechaini, $fechafin, $notafinal, $proceso, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"codalu" => $codalu,
									"codeva" => $codeva,
									"fechaini" => $fechaini,
									"fechafin" => $fechafin,
									"notafinal" => $notafinal,
									"proceso" => $proceso,
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

		//--------------------
		public function get_detalle_em_alumno($id)
		{	
			$sql="SELECT * FROM em_alumno WHERE id=? and estado = ?";
			$estado=1;
			$resultado= mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"ii", $id, $estado);
			$ok = mysqli_stmt_execute($resultado);
			
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $codalu, $codeva, $fechaini, $fechafin, $notafinal, $proceso, $estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"codalu" => $codalu,
									"codeva" => $codeva,
									"fechaini" => $fechaini,
									"fechafin" => $fechafin,
									"notafinal" => $notafinal,
									"proceso" => $proceso,
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
//-----evaluaciones_mixtas----
		public function eliminar_em_alumno( $id)
		{	
			$estado=0;
			$consulta= "UPDATE em_alumno set estado = ? where id =?";
			$resultado= mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado,"ii",$estado, $id);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;	
		}

		public function update_notafinal($id, $notafinal)
		{
			$consulta = "UPDATE em_alumno SET notafinal=? WHERE id=? ";
			$resultado = mysqli_prepare($this->db,$consulta);
			$ok = mysqli_stmt_bind_param($resultado, "ii", $notafinal, $id);

			$ok = mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function update_proceso($id)
		{	
			$proceso=0;
			$fechaReg=date ("Y-m-d H:i:s");
			$consulta="UPDATE em_alumno SET proceso = ? WHERE id=? ";
			$resultado=mysqli_prepare($this->db,$consulta);
			$ok=mysqli_stmt_bind_param($resultado, "ii", $proceso, $id);

			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function obtener_proceso($id)
		{
			$sql= "SELECT proceso FROM em_alumno WHERE id = ?";

			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $id);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $proceso);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $proceso;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}
		public function obtener_notafinal($id)
		{
			$sql= "SELECT notafinal FROM em_alumno WHERE id = ?";

			$resultado = mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"i", $id);
			
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $notafinal);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $notafinal;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}
		public function updateNotaFinal($codalu, $codeva,$fechaini, $fechafin, $notafinal)
		{	$consulta ="INSERT INTO em_alumno(codalu,codeva,fechaini,fechafin,notafinal,proceso,estado)
						VALUES(?,?,?,?,?,?,?)";
			$proceso=0;
			$estado=1;
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iissiii", $codalu, $codeva, $fechaini, $fechafin, $notafinal, $proceso, $estado);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}
		public function update_notas($array,$codprof,$fecha){
			foreach ($array as $fila) {
				$codalu = $fila[0];
				$codeva = $fila[1];
				$nota = $fila[2];
				$data_eval = $this->get_eva_alumno($codalu, $codeva);
				if(empty($data_eval)){
					$this->updateNotaFinal($codalu, $codeva,$fecha, $fecha, $nota);
				} else {
					$id = $data_eval['id'];
					$this->eliminar_em_alumno($id);
					$this->updateNotaFinal($codalu, $codeva,$fecha, $fecha, $nota);
				}
			}
		}
	}	
?>