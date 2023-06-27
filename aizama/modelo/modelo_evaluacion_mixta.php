<?php 
	/**
	 * 
	 */
	class Evaluacion_mixta 
	{
		private $db;
		private $evaluaciones;
 
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			$this->evaluaciones = array();
			require_once'execute_sql.php';
		}
			

		public function get_evaluaciones_mixtas()
		{
			$consulta = $this->db->query("select * from evaluacion_mixta");
			while($row = $consulta->fetch_object()){
				$this->evaluaciones[] = $row;
			}
			return $this->evaluaciones;

		}
		public function get_evaluaciones_profesor($codprof)
		{
			$consulta = $this->db->query("select * from evaluacion_mixta where em_codprof = '".$codprof."'");
			$lista_Evaluaciones = array();
			while($row = $consulta->fetch_object())
			{
				$lista_Evaluaciones[] = $row;
			}
			return $lista_Evaluaciones;
		}
		public function get_evaluaciones_gestion_profesor($gestion,$codprof)
		{
			$sql = "SELECT e.em_id,e.em_nro,e.em_codcur,e.em_codpar,e.em_codmat,e.em_inicio,e.em_fin,e.em_nota,e.em_preguntas,e.em_banco,e.em_descripcion,e.em_tiempo,e.em_visible FROM evaluacion_mixta e INNER JOIN prof_cur_mat p ON e.em_gestion = ? AND e.em_codcur = p.codcur AND e.em_codpar = p.codpar AND e.em_codmat = p.codmat AND e.em_estado = 1 AND p.prof = ? AND p.estado = 'activo'";
			$type = "is";
			$params = array($gestion,$codprof);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_evaluaciones_de_curso($codprof,$codcur,$codpar)
		{
			$consulta = $this->db->query("select * from evaluacion_mixta where em_codprof = '".$codprof."' and em_codcur=".$codcur." and em_codpar=".$codpar);
			$lista_Evaluaciones = array();
			while($row = $consulta->fetch_object())
			{
				$lista_Evaluaciones[] = $row;
			}

			return $lista_Evaluaciones;
		}

		public function get_evaluaciones_de_curso_trimestre($codprof,$codcur,$codpar,$trimestre)
		{
			$consulta = $this->db->query("select * from evaluacion_mixta where em_codprof = '".$codprof."' and em_codcur=".$codcur." and em_codpar=".$codpar." and em_trimestre=".$trimestre);
			$lista_Evaluaciones = array();
			while($row = $consulta->fetch_object())
			{
				$lista_Evaluaciones[] = $row;
			}
			return $lista_Evaluaciones;
		}

		public function get_evaluaciones_curso( $codmat, $codcur, $codpar)
		{
			$estado=1;
			$consulta = $this->db->query ("select * from evaluacion_mixta where em_codmat= '".$codmat."' and  em_codcur=".$codcur." and em_codpar=".$codpar." and em_estado=".$estado);

			$lista_Evaluaciones = array();
			while($row = $consulta->fetch_object())
			{
				$lista_Evaluaciones[] = $row;
			}
			return $lista_Evaluaciones;
		}
		//v.2--------------------------------------------
		public function get_evaluacion_curso( $gestion,$trimestre, $codcur, $codpar,$codmat)
		{
			$sql ="SELECT * from evaluacion_mixta where  em_gestion=? and em_trimestre=? and  em_codcur=? and em_codpar=? and em_codmat=? and em_visible=1 and em_estado=1";
			$resultado= mysqli_prepare($this->db, $sql);
			$ok = mysqli_stmt_bind_param($resultado,"iiiis",$gestion, $trimestre,  $codcur, $codpar, $codmat);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok = mysqli_stmt_bind_result($resultado, $em_id, $em_gestion, $em_trimestre, $em_nro, $em_codcur, $em_codpar, $em_codmat,$em_inicio, $em_fin, $em_nota, $em_preguntas,$em_banco,$em_descripcion, $em_tiempo,$em_fechaReg, $em_codprof,$em_visible,$em_estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $em_id,
									"gestion" => $em_gestion,
                                    "trimestre" =>$em_trimestre,
									"nro" => $em_nro,
									"codcur" => $em_codcur,
									"codpar" => $em_codpar,
									"codmat"=>$em_codmat,
									"inicio"=> $em_inicio,
									"fin"=>$em_fin,
									"nota"=>$em_nota,
									"preguntas"=>$em_preguntas,
									"banco"=>$em_banco,
									"descripcion"=>$em_descripcion,
									"tiempo"=>$em_tiempo,
									"fechaReg" => $em_fechaReg,
									"codprof"=>$em_codprof,
									"visible"=>$em_visible,
									"estado"=>$em_estado
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}

		public function cantidad_evaluaciones($gestion, $trimestre, $codcur, $codpar, $codmat)
		{  
			$sql= "SELECT count(*) AS total FROM evaluacion_mixta WHERE em_gestion=? and  em_trimestre=? and em_codcur=? and em_codpar=? and  em_codmat=? and em_estado=1";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"iiiis", $gestion, $trimestre, $codcur, $codpar, $codmat );
			
			$ok=mysqli_stmt_execute($resultado);
		
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

		public function cant_evaluaciones_materia( $codcur, $codpar, $codmat,$trimestre,$gestion)
		{  
		
			$sql= "SELECT count(*) AS total FROM evaluacion_mixta WHERE em_gestion = ? and em_trimestre = ? and em_codcur=? and em_codpar=? and  em_codmat=? and em_visible=1 and em_estado=1";

			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"iiiis",$gestion,$trimestre, $codcur, $codpar, $codmat );
			
			$ok=mysqli_stmt_execute($resultado);
		
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

		public function save_evaluacion_mixta($gestion, $trimestre,$codcur, $codpar, $codmat, $inicio, $fin, $nota, $preguntas,$descripcion,$tiempo, $fechaReg, $codProf)//evaluacion mixta prof. 1
		{	$consulta =" INSERT INTO evaluacion_mixta(em_gestion, em_trimestre, em_nro, em_codcur, em_codpar, em_codmat, em_inicio, em_fin, em_nota, em_preguntas,em_banco, em_descripcion, em_tiempo, em_fechaReg, em_codprof,em_visible, em_estado)
		 				 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			$nro = $this->cantidad_evaluaciones($gestion, $trimestre, $codcur, $codpar, $codmat);
			$nro++;
			$banco=0;
			$estado=1;
			$visible=0;
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iiiiisssisisissii", $gestion, $trimestre, $nro, $codcur, $codpar, $codmat, $inicio, $fin, $nota, $preguntas, $banco, $descripcion,$tiempo,$fechaReg, $codProf, $visible, $estado);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}

		public function update_evaluacion_mixta($codeva, $inicio, $fin, $nota, $preguntas, $descripcion,$tiempo, $fechaReg, $codProf, $visible)//1 evaluacion_mixta prof.
		{
			$consulta =" UPDATE evaluacion_mixta SET em_inicio = ?,
		    										em_fin = ?,
				    								em_nota = ?,
				    							    em_preguntas = ?,
				    								em_descripcion = ?,
				    								em_tiempo = ?,
				    								em_fechaReg = ?,
				    								em_codprof = ?,
													em_visible = ?
						where em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"ssiisissii", $inicio, $fin, $nota, $preguntas, $descripcion, $tiempo, $fechaReg, $codProf,$visible, $codeva);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		} 

		public function update_inicio($id_eva, $inicio, $codprof)
		{
			$fechaReg = date("Y-m-d H:i:s");
			$consulta =" UPDATE evaluacion_mixta SET em_inicio = ?,
													em_fechaReg=?,
													em_codprof=?
						WHERE em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"sssi", $inicio,$fechaReg, $codprof, $id_eva);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}

		public function update_fin($id_eva, $fin, $codprof){
			$fechaReg = date("Y-m-d H:i:s");
			$consulta =" UPDATE evaluacion_mixta SET em_fin = ?, 
													em_fechaReg=?,
													em_codprof=?
						WHERE em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"sssi", $fin, $fechaReg, $codprof, $id_eva);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}		

		public function update_nota($id_eva, $nota, $codprof){
			$fechaReg = date("Y-m-d H:i:s");

			$consulta =" UPDATE evaluacion_mixta SET em_nota = ?,
													em_fechaReg=?,
													em_codprof=?
			 			WHERE em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $nota,$fechaReg, $codprof, $id_eva);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}

		public function update_pregunta($id_eva, $pregunta, $codprof){
			$fechaReg = date("Y-m-d H:i:s");
			$consulta =" UPDATE evaluacion_mixta SET em_preguntas = ?,
													em_fechaReg=?,
													em_codprof=?
			 			WHERE em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $pregunta,$fechaReg, $codprof, $id_eva);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}

		public function update_descripcion($id_eva, $descripcion, $codprof){
			$fechaReg = date("Y-m-d H:i:s");
			$consulta =" UPDATE evaluacion_mixta SET em_descripcion = ?,
													em_fechaReg=?,
													em_codprof=?
			 			WHERE em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"sssi", $descripcion,$fechaReg, $codprof, $id_eva);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}

		public function update_tiempo($id_eva, $tiempo, $codprof){
			$fechaReg = date("Y-m-d H:i:s");
			$consulta =" UPDATE evaluacion_mixta SET em_tiempo = ?,
													em_fechaReg=?,
													em_codprof=?
			 			WHERE em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $tiempo, $fechaReg, $codprof, $id_eva);	
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}
		public function obtener_nro($codeva)
		{ 
				$consulta = $this->db->query("SELECT em_nro FROM evaluacion_mixta WHERE em_id = '".$codeva."'");
				$lista_Evaluaciones = array();
				while($row = $consulta->fetch_object()){
					$lista_Evaluaciones[] = $row;
				}
				return $lista_Evaluaciones;
		}

		public function Delete_evaluacion_mixta ($codeva, $codprof, $nro){//1 evaluacion_mixta prof
			$fechaReg = date("Y-m-d H:i:s");
			$estado=0;
			$visible=0;
			$consulta =" UPDATE evaluacion_mixta SET em_estado = ?,
													em_fechaReg=?,
													em_codprof=?,
													em_visible=?
			 			WHERE em_id = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"issii", $estado, $fechaReg, $codprof, $visible, $codeva);
			$ok = mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);

			$sql= "UPDATE evaluacion_mixta SET em_nro = em_nro-1 
			WHERE em_estado=1 and em_nro > ?";
  			$resultado=mysqli_prepare($this->db, $sql);
   			$ok=mysqli_stmt_bind_param($resultado,"i", $nro);
   			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);

   			$nro = $this->obtener_nro($codeva);
			return $ok!=false; 
		}


		public function crear_evaluacion($gestion, $trimestre, $codcur, $codpar, $codmat, $codprof, $fechaReg)
		{ 
			$nro = $this->cantidad_evaluaciones($gestion, $trimestre, $codcur, $codpar, $codmat);
			$nro++;
			$estado=1;			
			$consulta = "INSERT INTO evaluacion_mixta(em_gestion, em_trimestre, em_nro, em_codcur, em_codpar, em_codmat, em_codprof, em_fechaReg,  em_estado) VALUES (? ,? ,? ,? ,? ,? ,? ,? ,?)";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado, "iiiiisssi", $gestion, $trimestre, $nro, $codcur, $codpar, $codmat, $codprof, $fechaReg,$estado);	
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false; 
		}
		public function getlista_evaluaciones_prof_cur_mat($codprof, $gestion,$trimestre,$codcur,$codpar,$codmat)
		{// obteniene el numero y la descripcion de una evaluacion (1)
			$consulta= "SELECT em_id, em_nro, em_descripcion FROM evaluacion_mixta 
					  	WHERE em_codprof=? and em_gestion=? and em_trimestre=?
						   and em_codcur=? and em_codpar=? and em_codmat=?
					  	 and em_estado=1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"siiiis",$codprof, $gestion, $trimestre, $codcur, $codpar,$codmat);
			$ok=mysqli_stmt_execute($resultado);
			$fila = array();
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $id, $nro, $descripcion);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id"=>$id,
									"nro" => $nro,
									"descripcion" => $descripcion
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}

		public function getEvaluaciones_curso($gestion,$trimestre,$codcur, $codpar){
			//Obtener todas las evaluaciones de un curso
			$sql= "SELECT em_id,em_nro,em_codmat,em_inicio,em_fin,em_nota,em_preguntas,em_banco,
						  em_descripcion,em_tiempo,em_fechaReg,em_codprof,em_visible   
				   FROM evaluacion_mixta 
				   WHERE em_gestion = ? and em_trimestre = ? and 
				   		 em_codcur = ? and em_codpar = ? and  
				   		 em_estado = 1";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"iiii", $gestion, $trimestre, $codcur, $codpar);
			$ok=mysqli_stmt_execute($resultado);
			$fila = array();		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$id,$nro,$codmat,$inicio,$fin,$nota,$preguntas,$banco,$descripcion,$tiempo,$reg,$prof,$visible);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $id,
									"nro" => $nro,
									"codmat" => $codmat,
									"inicio" => $inicio,
									"fin" => $fin,
									"nota" => $nota,
									"preguntas" => $preguntas,
									"banco" => $banco,
									"descripcion" => $descripcion,
									"tiempo" => $tiempo,
									"reg" => $reg,
									"prof" => $prof,
									"visible" => $visible
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}
		//Funcion que devuelve la cantidad de evaluaciones por materia en un curso de un profesor por trimestre
		public function contarEvaluaciones($codprof,$codcur,$codpar,$trimestre,$gestion){
			$sql = "SELECT count(em.em_codmat),em.em_codmat  
					FROM prof_cur_mat pcm inner join evaluacion_mixta em on 
					pcm.codcur = em.em_codcur and pcm.codpar = em.em_codpar and 
					pcm.codmat = em.em_codmat and pcm.estado = 'activo' and 
					pcm.codcur = ? and pcm.codpar = ? and pcm.gestion = ? 
					and pcm.prof = ? and em.em_estado = 1 and em.em_trimestre = ? 
					group by em.em_codmat";
			$resultado = mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"iiisi",$codcur,$codpar,$gestion,$codprof,$trimestre);
			$ok=mysqli_stmt_execute($resultado);
			if($ok){
				$lista = array();
				$ok = mysqli_stmt_bind_result($resultado,$cont,$codmat);
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codmat" => $codmat,
									"evaluaciones" => $cont
									);
				}
			}
			return $lista;
		}
		public function contarEvaluacionesCurso($codcur,$codpar,$trimestre,$gestion){
			$sql = "SELECT count(em_codmat),em_codmat  
					FROM evaluacion_mixta 
					where em_codcur = ? and em_codpar = ? and em_gestion = ? 
					and em_estado = 1 and em_trimestre = ? 
					group by em_codmat";
			$resultado = mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"iiii",$codcur,$codpar,$gestion,$trimestre);
			$ok=mysqli_stmt_execute($resultado);
			if($ok){
				$lista = array();
				$ok = mysqli_stmt_bind_result($resultado,$cont,$codmat);
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codmat" => $codmat,
									"evaluaciones" => $cont
									);
				}
			}
			return $lista;
		}
		public function  EvaluacionesCursoMaterias($codcur,$codpar,$codmat,$trimestre,$gestion){
			$sql = "SELECT em_nro, em_descripcion, em_fin, em_inicio, em_nota, em_banco, em_preguntas
					FROM evaluacion_mixta 
					where /*em_id = ? and*/ em_codcur = ? and em_codmat = ? and em_codpar = ? and em_gestion = ? 
					and em_estado = 1 and em_trimestre = ?";
			$resultado = mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"isiii",$codcur,$codmat,$codpar,$gestion,$trimestre);
			$ok=mysqli_stmt_execute($resultado);
			if($ok){
				$lista = array();
				$ok = mysqli_stmt_bind_result($resultado,$em_nro,$em_descripcion, $em_fin, $em_inicio, $em_nota, $em_banco, $em_preguntas);
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $em_nro,
									"descripcion" => $em_descripcion,
									"fin" => $em_fin, 
									"inicio" => $em_inicio, 
									"nota" => $em_nota, 
									"banco" => $em_banco, 
									"preguntas" => $em_preguntas,
									"codmat" => $codmat
									);
				}
			}
			return $lista;
		}
		public function  EvaluacionesCursoMaterias2($codcur,$codpar,$codmat,$trimestre,$gestion){
			$sql = "SELECT em_id, em_descripcion, em_fin, em_inicio, em_nota, em_banco, em_preguntas
					FROM evaluacion_mixta 
					where /*em_id = ? and*/ em_codcur = ? and em_codmat = ? and em_codpar = ? and em_gestion = ? 
					and em_estado = 1 and em_trimestre = ?";
			$resultado = mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"isiii",$codcur,$codmat,$codpar,$gestion,$trimestre);
			$ok=mysqli_stmt_execute($resultado);
			if($ok){
				$lista = array();
				$ok = mysqli_stmt_bind_result($resultado,$em_id,$em_descripcion, $em_fin, $em_inicio, $em_nota, $em_banco, $em_preguntas);
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $em_id,
									"descripcion" => $em_descripcion,
									"fin" => $em_fin, 
									"inicio" => $em_inicio, 
									"nota" => $em_nota, 
									"banco" => $em_banco, 
									"preguntas" => $em_preguntas,
									"codmat" => $codmat
									);
				}
			}
			return $lista;
		}
		public function contarEvaluacionesAdm($codcur,$codpar,$trimestre,$gestion){
			$sql = "SELECT count(em.em_codmat),em.em_codmat  
					FROM cur_mat cm inner join evaluacion_mixta em on 
					cm.codcur = em.em_codcur and cm.codpar = em.em_codpar and 
					cm.codmat = em.em_codmat and pcm.estado = 'activo' and 
					cm.codcur = ? and cm.codpar = ? and em.em_estado = 1 and em.em_trimestre = ? 
					group by em.em_codmat";
			$resultado = mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"iiisi",$codcur,$codpar,$gestion,$trimestre);
			$ok=mysqli_stmt_execute($resultado);
			if($ok){
				$lista = array();
				$ok = mysqli_stmt_bind_result($resultado,$cont,$codmat);
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codmat" => $codmat,
									"evaluaciones" => $cont
									);
				}
			}
			return $lista;
		}
		//evaluacion mixta 04/09/2022
		public function obtener_banco($codeva)
		{ 
			$sql ="SELECT em_banco FROM evaluacion_mixta WHERE em_id =?";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"i", $codeva );
			$ok=mysqli_stmt_execute($resultado);
		
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado,$banco);
			 	mysqli_stmt_fetch($resultado);
			 	mysqli_stmt_close($resultado);
			 	return $banco;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}

		public function obtener_eva_visible($codeva){
			$consulta = "SELECT * FROM evaluacion_mixta WHERE em_visible=1 and em_estado=1 and em_id = ?";
			$resultado= mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i",$codeva);
			$ok = mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok = mysqli_stmt_bind_result($resultado, $em_id, $em_gestion, $em_trimestre, $em_nro, $em_codcur, $em_codpar, $em_codmat,$em_inicio, $em_fin, $em_nota, $em_preguntas,$em_banco,$em_descripcion, $em_tiempo,$em_fechaReg, $em_codprof,$em_visible,$em_estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"id" => $em_id,
									"gestion" => $em_gestion,
                                    "trimestre" =>$em_trimestre,
									"nro" => $em_nro,
									"codcur" => $em_codcur,
									"codpar" => $em_codpar,
									"codmat"=>$em_codmat,
									"inicio"=> $em_inicio,
									"fin"=>$em_fin,
									"nota"=>$em_nota,
									"preguntas"=>$em_preguntas,
									"banco"=>$em_banco,
									"descripcion"=>$em_descripcion,
									"tiempo"=>$em_tiempo,
									"fechaReg" => $em_fechaReg,
									"codprof"=>$em_codprof,
									"visible"=>$em_visible,
									"estado"=>$em_estado
									);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			}else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			}
		}
		
		//--
		public function get_datos_evaluacion($codeva){
			$sql = "SELECT em_id, em_gestion, em_trimestre, em_nro, em_codcur, 
					em_codpar, em_codmat, em_inicio, em_fin, em_nota, em_preguntas, 
					em_banco, em_descripcion, em_tiempo, em_fechaReg, em_codprof, 
					em_visible, em_estado
					FROM evaluacion_mixta 
					WHERE em_id = ? and em_estado = 1";
			$resultado = mysqli_prepare($this->db,$sql);
			$ok = mysqli_stmt_bind_param($resultado,"i",$codeva);
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
				$ok = mysqli_stmt_bind_result($resultado, $em_id, $em_gestion,
					$em_trimestre, $em_nro, $em_codcur,$em_codpar,$em_codmat,$em_inicio,
				    $em_fin,$em_nota,$em_preguntas,$em_banco,$em_descripcion,
				    $em_tiempo,$em_fechaReg,$em_codprof,$em_visible,$em_estado);
				mysqli_stmt_fetch($resultado);
				$resultado = array(
								"gestion"=>$em_gestion,
								"trimestre"=>$em_trimestre,
								"nro"=>$em_nro,
								"codcur"=>$em_codcur,
								"codpar"=>$em_codpar,
								"codmat"=>$em_codmat,
								"inicio"=>$em_inicio,
								"fin"=>$em_fin,
								"nota"=>$em_nota,
								"preguntas"=>$em_preguntas,
								"banco"=>$em_banco,
								"descripcion"=>$em_descripcion,
								"tiempo"=>$em_tiempo,
								"fechaReg"=>$em_fechaReg,
								"codprof"=>$em_codprof,
								"visible"=>$em_visible
								);
				return $resultado;
			}
			return $ok;
		}
		public function get_detalle_Eva($codeva)
		{//Obtiene todos los detalles de evaluacion mixta
			$consulta = "SELECT * FROM evaluacion_mixta 
			WHERE em_id = ? and em_estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok = mysqli_stmt_bind_param($resultado,"i",$codeva);
			$ok=mysqli_stmt_execute($resultado);
			$fila = array();
			if ($ok) {
				$ok= mysqli_stmt_bind_result($resultado, $codeva, $em_gestion,
				$em_trimestre, $em_nro, $em_codcur,$em_codpar,$em_codmat,$em_inicio,
				$em_fin,$em_nota,$em_preguntas,$em_banco,$em_descripcion,
				$em_tiempo,$em_fechaReg,$em_codprof,$em_visible,$em_estado);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
						"id"=>$codeva,
						"gestion"=>$em_gestion,
						"trimestre"=>$em_trimestre,
						"nro"=>$em_nro,
						"codcur"=>$em_codcur,
						"codpar"=>$em_codpar,
						"codmat"=>$em_codmat,
						"inicio"=>$em_inicio,
						"fin"=>$em_fin,
						"nota"=>$em_nota,
						"preguntas"=>$em_preguntas,
						"banco"=>$em_banco,
						"descripcion"=>$em_descripcion,
						"tiempo"=>$em_tiempo,
						"fechaReg"=>$em_fechaReg,
						"codprof"=>$em_codprof,
						"visible"=>$em_visible,
						"estado"=>$em_estado
						);
				}
				mysqli_stmt_close($resultado);
			 	return $lista;
			 }else{
			 	mysqli_stmt_close($resultado);
			 	return false;
			 }
		}
		//	Evaluacion_mixta::incrementar($codeva)
		public function incremetar_banco($db,$codeva){
		    require_once("modelo_pregunta_em.php");
		    $pregunta = new pregunta_mixta($this->db);
		    $preguntas = $pregunta->get_preguntas($codeva);
		    $banco = count($preguntas);
			$sql="UPDATE evaluacion_mixta SET em_banco = ?
			WHERE em_id=?";
			$type="ii";
			$params=array($banco,$codeva);
			$result=ejecutar_consulta($db, $sql, $type, $params);
			return true;
		}
		/*decrementar el banco de preguntas*/
		public function decremetar_banco($codeva){
		    require_once("modelo_pregunta_em.php");
		    $pregunta = new pregunta_mixta($this->db);
		    $preguntas = $pregunta->get_preguntas($codeva);
		    $banco = count($preguntas);
			$sql="UPDATE evaluacion_mixta SET em_banco = ?
			WHERE em_id=?";
			$resultado=mysqli_prepare($this->db, $sql);
			$ok=mysqli_stmt_bind_param($resultado,"ii", $banco,$codeva);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
			/*$type="i";
			$params=array($codeva);
			$result=Conectar::ejecutar_consulta($db, $sql, $type, $params);
			return true;*/	
		} 
		//--------------------------------
		public function get_eval_mixta_proceso($codalu){
			
			$sql = "SELECT ea.id,ea.codeva,ea.fechaini,ea.fechafin,em.em_descripcion,em.em_nro, em.em_tiempo,m.DESCRI
			FROM em_alumno ea, evaluacion_mixta em ,materia m 
			WHERE ea.codeva = em.em_id and em.em_codmat = m.codmat and ea.estado = 1 and ea.proceso = 1 and
			em.em_estado = 1 and ea.codalu = ?";
			$resultado = mysqli_prepare($this->db,$sql);
			$ok= mysqli_stmt_bind_param($resultado,"i", $codalu);
			$ok= mysqli_stmt_execute($resultado);

			if($ok){
				$ok = mysqli_stmt_bind_result($resultado, $id, $codeva, $fechaini, $fechafin, $descripcion, $nro, $tiempo, $materia);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[]=array(
						"id"=>$id,
						"codeva"=>$codeva,
						"fechaini"=>$fechaini,
						"fechafin"=>$fechafin,
						"descripcion"=>$descripcion,
						"nro"=>$nro,
						"tiempo"=>$tiempo,
						"materia"=>$materia
					);
				}
				mysqli_stmt_close($resultado);
				return $lista;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}

		public function save_permutaciones($codeva, $nro_per, $permutacion, $fechaReg, $codprof)//
		{	
			$consulta =" INSERT INTO em_permutacion(codeva, nro_per, permutacion, fechaReg, codprof, estado)
		 				 VALUES (?,?,?,?,?,?)";
			$estado=1;
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iisssi", $codeva, $nro_per, $permutacion, $fechaReg, $codprof, $estado);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				mysqli_stmt_close($resultado);
				return true;
			}else{
				mysqli_stmt_close($resultado);
				return false;
			}
		}
		public function delete_permutaciones($codeva)
		{	$fechaReg=date("Y-m-d H:i:s");
			$estado=0;
			$consulta ="UPDATE em_permutacion SET estado = ?,
			 									fechaReg = ?,
												codprof = ?
						WHERE codeva = ?";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"issi", $estado, $fechaReg, $codprof, $codeva);
			$ok=mysqli_stmt_execute($resultado);
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function get_permutaciones($codeva){
			$consulta ="SELECT permutacion
						FROM em_permutacion
						WHERE codeva = ? and estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"i", $codeva);
			$ok=mysqli_stmt_execute($resultado);
			if ($ok) {
				$ok = mysqli_stmt_bind_result($resultado, $permutacion);
				$lista = array();
				while (mysqli_stmt_fetch($resultado)) {
					$lista[]=$permutacion;
				}
				mysqli_stmt_close($resultado);
				return $lista;
			}				
		}
		public function get_evaluaciones_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat){
			$sql = "SELECT * FROM em_alumno WHERE estado = 1 AND codeva IN (SELECT em_id 
																					 FROM evaluacion_mixta 
																					 WHERE em_gestion = ? AND em_trimestre = ? AND 
																					 	   em_codcur = ? AND em_codpar = ? AND 
																					 	   em_codmat = ? AND em_estado = 1)";
			$type = "iiiis";
			$params = array($gestion,$trimestre,$codcur,$codpar,$codmat);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		public function get_evaluacion_fechas($profe,$fi,$ff){
			$sql = "SELECT * FROM evaluacion_mixta WHERE em_estado = 1 AND em_codprof = ? AND em_fechaReg >= ? AND em_fechaReg < ?";
			$type = "sss";
			$params = array($profe,$fi,$ff);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
	}
	

//--------------------------------	
?>