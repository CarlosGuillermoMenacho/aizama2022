<?php 
/**
 * 
 */
class Evaluacion_Seleccion
{
	
	private $db;
		
		public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
		}

		public function getEvaluacionesMes($year,$mes,$codcur,$codpar){
			$mess = strlen($mes) == 2 ? $mes : "0".$mes;
			$fecha = $year.'-'.$mess.'%';

			$consulta ="SELECT m.descri,e.codeva,e.descrip,e.horaf,e.tot_preg,e.f_fin   
						FROM evaluacion e INNER JOIN materia m ON 
						e.codmat = m.codmat and e.gestion = ? and 
						e.codigo = ? and e.cod_par = ? and 
						e.f_fin LIKE ? and e.estado = 1";
			$resultado=mysqli_prepare($this->db, $consulta);
			$ok=mysqli_stmt_bind_param($resultado,"iiis",$year,$codcur,$codpar,$fecha);	
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
				$ok= mysqli_stmt_bind_result($resultado,$materia,$nroEval,$descripcion,$horaFin,$totalPreg,$fecha);
				
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"materia"=>$materia,
									"nroEval"=>$nroEval,
									"descripcion"=>utf8_decode($descripcion),
									"dia"=>substr($fecha,8,2)
									);
				}
			}
			return $lista;
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function get_evaluaciones_pendientes($codalu,$codcur,$codpar,$trimestre,$gestion){
			$consulta ="SELECT codexa,codmat,descrip,f_inicio,f_fin,horai,horaf,codeva 
						FROM evaluacion 
						WHERE codigo = ? and cod_par = ? and gestion = ? and bimestre = ? and estado = 1 and 
							  codexa NOT IN (SELECT codexa 
							  					FROM resp_alu_exa 
							  					WHERE codigo = ? GROUP BY codexa) order by codexa asc";
			$resultado=mysqli_prepare($this->db, $consulta);
			//return $year."-".$fecha."-".$codcur."-".$codpar;
			$ok=mysqli_stmt_bind_param($resultado,"iiiii",$codcur,$codpar,$gestion,$trimestre,$codalu);	
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
			$ok= mysqli_stmt_bind_result($resultado,$codexa,$cod_mat,$descrip,$fechai,$fechaf,$horai,$horaf ,$codeva);
					
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codexa"=>$codexa,
									"codmat"=>$cod_mat,
									"descripcion"=>$descrip,
									"fechai"=>$fechai,
									"fechaf"=>$fechaf,
									"horai"=>substr($horai,0,5),
									"horaf"=>substr($horaf,0,5),
									"codeva"=>$codeva
									);
				}
			}
			return $lista;
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}
		public function get_evaluaciones_realizadas($codalu,$trimestre,$gestion){
			$consulta ="SELECT e.codexa,e.descrip,sum(a.nota) as nota,e.codmat,e.codeva  
						FROM resp_alu_exa a INNER JOIN evaluacion e ON 
							 a.codexa = e.codexa and a.codigo = ? and 
							 e.bimestre = ? and e.gestion = ? and e.estado = 1 GROUP BY e.codexa";
			$resultado=mysqli_prepare($this->db, $consulta);
			//return $year."-".$fecha."-".$codcur."-".$codpar;
			$ok=mysqli_stmt_bind_param($resultado,"iii",$codalu,$trimestre,$gestion);	
			$ok=mysqli_stmt_execute($resultado);
			$lista = array();
			if($ok){
			$ok= mysqli_stmt_bind_result($resultado,$codexa,$descrip,$nota,$codmat,$codeva);
					
				while (mysqli_stmt_fetch($resultado)) {
					$lista[] = array(
									"codexa"=>$codexa,
									"codmat"=>$codmat,
									"descripcion"=>$descrip,
									"nota"=>$nota,
									"codeva"=>$codeva
									);
				}
			}
			return $lista;
			mysqli_stmt_close($resultado);
			return $ok!=false;
		}	

		public function get_evaluaciones($gestion,$trimestre,$codcur,$codpar,$codmat){
			$sql = "SELECT * 
					FROM evaluacion 
					WHERE gestion = ? AND bimestre = ? AND codmat = ? AND codigo = ? AND cod_par = ? AND estado = 1";
			$type = "iisii";
			$params = array($gestion,$trimestre,$codmat,$codcur,$codpar);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}

		public function get_evaluaciones_alumnos($gestion,$trimestre,$codcur,$codpar,$codmat){

			$type = "iisii";
			$sql = "SELECT codigo, sum(nota) as nota, codexa FROM resp_alu_exa WHERE codigo > 0 AND codexa IN (SELECT id FROM evaluacion WHERE gestion = ? AND bimestre = ? AND 
																								codmat = ? AND codigo =? AND 
																								cod_par = ? AND estado = 1) GROUP BY codigo,codexa";
			$params = array($gestion,$trimestre,$codmat,$codcur,$codpar);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		public function get_evaluaciones_alumno($gestion,$trimestre,$codcur,$codpar,$codmat,$codalu){

			$type = "iiisii";
			$sql = "SELECT codigo, sum(nota) as nota, codexa FROM resp_alu_exa WHERE codigo = ? AND codexa IN (SELECT id FROM evaluacion WHERE gestion = ? AND bimestre = ? AND 
																								codmat = ? AND codigo =? AND 
																								cod_par = ? AND estado = 1) GROUP BY codigo,codexa";
			$params = array($codalu,$gestion,$trimestre,$codmat,$codcur,$codpar);

			$result = ejecutar_consulta($this->db,$sql,$type,$params);

			return $result;
		}
		public function get_evaluacion_fechas($profe,$fi,$ff){
			$sql = "SELECT * FROM evaluacion WHERE estado = 1 AND usr = ? AND fecha >= ? AND fecha < ?";
			$type = "sss";
			$params = array($profe,$fi,$ff);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_evaluacion($id){
			$sql = "SELECT * FROM evaluacion WHERE estado = 1 AND id = ? ";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_calificacion($codalu,$codexa){
			$sql = "SELECT sum(nota) as nota FROM resp_alu_exa WHERE codigo = ? AND codexa = ? ";
			$type = "ii";
			$params = array($codalu,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function calificar($codexa,$codalu,$nota){
			$sql = "INSERT INTO resp_alu_exa(codigo,nota,fecha,hora_ini,codexa) VALUES (?,?,?,?,?)";
			$type = "iissi";
			$fecha = date("Y-m-d");
			$hora = date("H:i:s");
			$params = array($codalu,$nota,$fecha,$hora,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_respuestas($codalu,$codexa){
			$sql = "SELECT r.codpre,p.dir_imagen,r.hora_ini,r.hora_fin,r.nota,p.pregunta,r.surespuest,p.respuesta FROM resp_alu_exa r INNER JOIN preguntas p ON r.codpre = p.codpre AND r.codigo = ? AND r.codexa = ? ";
			$type = "ii";
			$params = array($codalu,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function count_respuestas($codalu,$codexa){
			$sql = "SELECT count(*) as total FROM resp_alu_exa WHERE codigo = ? AND codexa = ? ";
			$type = "ii";
			$params = array($codalu,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			$row = $result->fetch_object();
			return $row->total;	
		}
		public function set_nota($id,$nota){
			$sql = "UPDATE resp_alu_exa SET nota = ? WHERE id = ?";
			$type = "ii";
			$params = array($nota,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function delete_examen($codexa,$codalu){
			$sql = "UPDATE resp_alu_exa SET codigo = -codigo, codexa = -codexa WHERE codigo = ? AND codexa = ?";
			$type = "ii";
			$params = array($codalu,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_evaluacion_by_codexa($codexa){
			$sql = "SELECT * FROM evaluacion WHERE estado = 1 AND codexa = ? ";
			$type = "i";
			$params = array($codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_preguntas($id){
			$sql = "SELECT * FROM preguntas WHERE codexa = ? ";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function set_notas_preguntas($codexa,$nota){
			$sql = "UPDATE preguntas SET valor = ? WHERE codexa = ? ";
			$type = "ii";
			$params = array($nota,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_n_preguntas($id){
			$sql = "SELECT count(*) as total FROM preguntas WHERE codexa = ? ";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_opciones($id){
			$sql = "SELECT * FROM opciones WHERE codpre = ? ";
			$type = "i";
			$params = array($id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;	
		}
		public function get_evaluaciones_prof($gestion,$trimestre,$codprof){
			$sql = "SELECT e.id,e.codexa,e.codmat,e.codigo,e.cod_par,e.codeva,e.descrip,e.f_inicio,e.f_fin,e.horai,e.horaf,e.fecha,e.hora,e.tot_preg,e.visible FROM evaluacion e INNER JOIN prof_cur_mat p ON e.gestion = ? AND e.bimestre = ? AND e.codmat = p.codmat AND e.codigo = p.codcur AND e.cod_par = p.codpar AND e.estado = 1 AND p.prof = ? AND p.estado = 'activo' AND p.gestion = ?";
			$type = "iisi";
			$params = array($gestion,$trimestre,$codprof,$gestion);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;		
		}
		public function get_all_evaluaciones_prof($gestion,$codprof){
			$sql = "SELECT e.id,e.codexa,e.codmat,e.codigo,e.cod_par,e.codeva,e.descrip,e.f_inicio,e.f_fin,e.horai,e.horaf,e.fecha,e.hora,e.tot_preg,e.visible FROM evaluacion e INNER JOIN prof_cur_mat p ON e.gestion = ? AND e.codmat = p.codmat AND e.codigo = p.codcur AND e.cod_par = p.codpar AND e.estado = 1 AND p.prof = ? AND p.estado = 'activo' AND p.gestion = ?";
			$type = "isi";
			$params = array($gestion,$codprof,$gestion);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;		
		}
		public function update($codexa,$codeva,$descripcion,$fechai,$horai,$fechaf,$horaf,$usr,$fecha,$hora,$preguntas,$visible){
			$sql = "UPDATE evaluacion SET codeva = ?, descrip = ?, f_inicio = ?, f_fin = ?, horai = ?, horaf = ?, usr = ?, fecha = ?, hora = ?, tot_preg = ? ,visible = ? WHERE codexa = ?";
			$type = "issssssssiii";
			$params = array($codeva,$descripcion,$fechai,$fechaf,$horai,$horaf,$usr,$fecha,$hora,$preguntas,$visible,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update_pregunta($codpre,$descripcion,$respuesta,$tiempo,$codusr,$fecha,$hora,$img){
			$sql = "UPDATE preguntas SET pregunta = ?,respuesta = ?,tiempo = ?, codprof = ?, fecha = ?, hora = ?, dir_imagen = ? WHERE codpre = ?";
			$type = "siissssi";
			$params = array($descripcion,$respuesta,$tiempo,$codusr,$fecha,$hora,$img,$codpre);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function update_opcion($codpre,$n,$opcion){
			$sql = "UPDATE opciones SET opcion = ? WHERE codpre = ? AND n_opcion = ?";
			$type = "sii";
			$params = array($opcion,$codpre,$n);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function delete_opcion($codpre,$n){
			$sql = "UPDATE opciones SET codpre = -codpre WHERE codpre = ? AND n_opcion = ?";
			$type = "ii";
			$params = array($codpre,$n);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save($gestion,$trimestre,$codmat,$codcur,$nro,$descripcion,$fechai,$fechaf,$horai,$horaf,$usr,$fecha,$hora,$codpar,$preguntas){
			$sql = "INSERT INTO evaluacion(gestion,bimestre,codmat,codigo,codeva,descrip,f_inicio,f_fin,horai,horaf,usr,fecha,hora,cod_par,estado,tot_preg,visible) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,0)";
			$type = "iisiissssssssii";
			$params = array($gestion,$trimestre,$codmat,$codcur,$nro,$descripcion,$fechai,$fechaf,$horai,$horaf,$usr,$fecha,$hora,$codpar,$preguntas);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			$sql = "UPDATE evaluacion set codexa = ? where id = ?";
			$type = "ii";
			$id = $this->db->insert_id;
			$params = array($id,$id);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $id;
		}
		public function delete($codexa,$usr,$fecha,$hora){
			$sql = "UPDATE evaluacion SET estado = 0,usr = ?, fecha = ?,hora = ? WHERE id = ?";
			$type = "sssi";
			$params = array($usr,$fecha,$hora,$codexa);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function delete_pregunta($codpreg){
			$sql = "UPDATE preguntas SET codpre = ?,codexa = -codexa WHERE codpre = ?";
			$type = "si";
			$preg = "-$codpreg";
			$params = array($preg,$codpreg);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_pregunta($codpreg){
			$sql = "SELECT e.codexa,e.codmat,p.pregunta,p.respuesta,p.valor,p.tiempo,p.dir_imagen,e.tot_preg FROM preguntas p INNER JOIN evaluacion e ON p.codexa = e.codexa AND p.codpre = ?";
			$type = "i";
			$params = array($codpreg);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_evaluacion_alumno_fecha($codalu,$codcur,$codpar,$fecha){
			$sql = "SELECT codexa,bimestre,codmat,codeva,descrip,tot_preg,'Realizado' as realizado FROM evaluacion WHERE estado = 1 AND codigo = ? AND cod_par = ? AND f_inicio <= ? AND f_fin >= ? AND codexa IN (SELECT DISTINCT codexa FROM resp_alu_exa WHERE codigo = ?) UNION SELECT codexa,bimestre,codmat,codeva,descrip,tot_preg,'No realizado' as realizado FROM evaluacion WHERE estado = 1 AND codigo = ? AND cod_par = ? AND f_inicio <= ? AND f_fin >= ? AND codexa NOT IN (SELECT DISTINCT codexa FROM resp_alu_exa WHERE codigo = ?)";
			$type = "iissiiissi";
			$params = array($codcur,$codpar,$fecha,$fecha,$codalu,$codcur,$codpar,$fecha,$fecha,$codalu);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function save_pregunta($codexa,$numero,$pregunta,$respuesta,$valor,$tiempo,$codprof,$fecha,$hora,$imagen){
			$sql = "INSERT INTO preguntas(codexa,numero,pregunta,respuesta,valor,tiempo,codprof,fecha,hora,dir_imagen) VALUES(?,?,?,?,?,?,?,?,?,?)";
			$type = "iisiiissss";
			$params = array($codexa,$numero,$pregunta,$respuesta,$valor,$tiempo,$codprof,$fecha,$hora,$imagen);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			$id = $this->db->insert_id;
			return $id;
		}
		public function save_opcion($codpreg,$nop,$op){
			$sql = "INSERT INTO opciones(codpre,n_opcion,opcion) VALUES(?,?,?)";
			$type = "iis";
			$params = array($codpreg,$nop,$op);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_evaluaciones_gestion($gestion,$codcur,$codpar){
			$sql = "SELECT codexa as id,bimestre as trimestre,codmat,descrip as descripcion,fecha,'1' as tipo FROM evaluacion WHERE gestion = ? AND estado = 1 AND codigo = ? AND cod_par = ? UNION SELECT id , trimestre,codmat,descripcion,fechaReg as fecha, '2' as tipo FROM evaluacion_escrita WHERE gestion = ? AND estado = 1 AND codcur = ? AND codpar = ? UNION SELECT em_id as id, em_trimestre as trimestre, em_codmat as codmat,em_descripcion as descripcion,em_fechaReg as fecha, '3' as tipo FROM evaluacion_mixta WHERE em_gestion = ? AND em_estado = 1 AND em_codcur = ? AND em_codpar = ?";
			$type = "iiiiiiiii";
			$params = array($gestion,$codcur,$codpar,$gestion,$codcur,$codpar,$gestion,$codcur,$codpar);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			return $result;
		}
		public function get_evaluaciones_count($gestion,$codcur,$codpar,$codmat){
			$sql = "SELECT count(*) as n FROM evaluacion WHERE gestion = ? AND estado = 1 AND codigo = ? AND cod_par = ? AND codmat = ?";
			$type = "iiis";
			$params = array($gestion,$codcur,$codpar,$codmat);
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			$row = $result->fetch_object();
			$total = $row->n;
			$sql = "SELECT count(*) as n FROM evaluacion_escrita WHERE gestion = ? AND estado = 1 AND codcur = ? AND codpar = ? AND codmat = ?";
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			$row = $result->fetch_object();
			$total = $row->n + $total;
			$sql = "SELECT count(*) as n FROM evaluacion_mixta WHERE em_gestion = ? AND em_estado = 1 AND em_codcur = ? AND em_codpar = ? AND em_codmat = ?";
			$result = ejecutar_consulta($this->db,$sql,$type,$params);
			$row = $result->fetch_object();
			$total = $row->n + $total;
			return $total;
		}
}
?>