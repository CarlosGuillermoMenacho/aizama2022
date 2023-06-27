<?php 
	/**
	 * 
	 */
class Alumno{
	
	private $db;
	
	public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once("execute_sql.php");
		}
    
	public function getDatosAlumno($id){
		$sql= "SELECT codalu,concat(paterno,' ',materno,' ',nombres)as nombre,
					  clave,cel1,cod_cur,cod_par,fotoperfil
			   FROM alumno 
			   WHERE codigo = ? and estado = 1";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"i", $id);
			
		$ok=mysqli_stmt_execute($resultado);
		$lista = array();
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$login,$nombres,$clave,$cel,$codcur,$codpar,$foto);
			if(mysqli_stmt_fetch($resultado)){
				$lista = array(
							"login" => $login,
							"nombre" => $nombres,
							"clave" => $clave,
							"cel" => $cel,
							"codcur" => $codcur,
							"codpar" => $codpar,
							"foto" => $foto
						);
			}
			
			return $lista;
			mysqli_stmt_close($resultado);
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
	public function get_tutores($codalu){
		$consulta="SELECT cod_tut 
    			   FROM alu_tut 
    			   WHERE codigo = ? and estado = 1";
        
        $resultado=mysqli_prepare($this->db,$consulta);
        $ok=mysqli_stmt_bind_param($resultado,"i",$codalu);
        $ok=mysqli_stmt_execute($resultado);
        if($ok){
        	$ok= mysqli_stmt_bind_result($resultado,$codtut);
        	$lista_tutores = array();
        	require_once'modelo_tutor.php';
        	$tutor = new Tutor($this->db);
        	while (mysqli_stmt_fetch($resultado)) {
        		$datos_tutor = $tutor->get_tutor($codtut);
        		$lista_tutores[] = $datos_tutor;
        	}
        	mysqli_stmt_close($resultado);
        	return $lista_tutores;
        }
	}
	public function get_all(){
	    $sql = "SELECT * FROM alumno WHERE estado = 1 order by paterno,materno,nombres asc";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function get_access_all(){
	  $sql = "SELECT a.codigo,a.paterno,a.materno,a.nombres,a.cod_cur,a.cod_par,u.servernt,u.usrimple,u.bdesktop FROM alumno a INNER JOIN usr u ON a.codigo = u.id_usr AND a.estado = 1 order by a.paterno,a.materno,a.nombres asc";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	}
	public function obtener_materias($cod_cur, $cod_par)
    {
      $estado = 1;
      $sql = "SELECT cod_cur, cod_par, cod_mat, imagen, DESCRI FROM cur_mat, materia WHERE cod_mat=CODMAT AND cod_cur =? and cod_par = ? and estado = 1 and materia.estado = ?";
      $resultado= mysqli_prepare($this->db, $sql);
      $ok = mysqli_stmt_bind_param($resultado,"iii",$cod_cur ,$cod_par,$estado);
      $ok = mysqli_stmt_execute($resultado);

        if ($ok) {
          $ok = mysqli_stmt_bind_result($resultado,$cod_cur, $cod_par,$cod_mat,$imagen, $descri );
          $lista = array();
		  while (mysqli_stmt_fetch($resultado)) {
            $lista[] = array(
                    "cod_cur" => $cod_cur,
                    "cod_par" =>$cod_par,
                    "cod_mat" => $cod_mat,
										"imagen" => $imagen,
                    "descri" => $descri
                    );
          }
          mysqli_stmt_close($resultado);
          return $lista;
        }else{
          mysqli_stmt_close($resultado);
          return false;
        }
    } 
		public function get_alumnos(){
			$sql = "SELECT *  
					FROM alumno 
					WHERE estado=1 ORDER BY paterno,materno,nombres ASC";
			$params = array();
			$type = "";

			$result=ejecutar_consulta($this->db, $sql, $type, $params);

			return $result;
		}
		public function set_surso($codalu,$codcur,$codpar){
			$sql = "UPDATE alumno SET cod_cur = ? , cod_par = ? WHERE codigo = ?";
			$params = array($codcur,$codpar,$codalu);
			$type = "iii";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
		}
		public function get_alumno($codalu){
			$sql = "SELECT a.paterno,a.materno,a.nombres,u.login,u.password,u.servernt,u.usrimple,u.bdesktop,u.impresora,a.cel1,a.cod_cur,a.cod_par,a.fotoperfil,a.cuota,a.ncuotas,a.aporte,a.nacido  
							FROM alumno a INNER JOIN usr u ON 
							a.codigo = u.id_usr AND a.estado = 1 AND
							a.codigo = ?";
			$params = array($codalu);
			$type = "i";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
		public function get_data_tutores($codalu){
			$sql = "SELECT concat(t.paterno,' ',t.materno,' ',t.nombres)as nombre,t.cel,t.cod_tut  
						  FROM alu_tut a INNER JOIN tutor t ON a.cod_tut = t.cod_tut AND a.estado = 1 AND a.codigo = ?";
			$params = array($codalu);
			$type = "i";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
		public function update($codalu,$paterno,$materno,$nombres,$usuario,$clave,$gestion,$codcur,$codpar){
			$sql = "UPDATE alumno SET codalu = ?,paterno = ?,materno = ?,nombres = ?,clave = ?,cod_cur = ?,cod_par = ? WHERE codigo = ?";
			$params = array($usuario,$paterno,$materno,$nombres,$clave,$codcur,$codpar,$codalu);
			$type = "sssssiii";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);

			$sql = "UPDATE usr SET nombre_usr = ?,login = ?,password = ?,impresora = ? WHERE id_usr = ?";
			$nombre_usr = "$paterno $materno $nombres";
			$params = array($nombre_usr,$usuario,$clave,$gestion,$codalu);
			$type = "ssssi";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
		public function set_boletin_access($codalu,$estado){
			$bdesktop = $estado == "V"?"VERDADERO":"FALSO";
			$sql = "UPDATE usr SET bdesktop = ? WHERE id_usr = ?";
			$params = array($bdesktop,$codalu);
			$type = "si";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
		public function set_evaluacion_access($codalu,$estado){
			$usrimple = $estado == "V"?"VERDADERO":"FALSO";
			$sql = "UPDATE usr SET usrimple = ? WHERE id_usr = ?";
			$params = array($usrimple,$codalu);
			$type = "si";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
		public function set_plataforma_access($codalu,$estado){
			$servernt = $estado == "V"?"VERDADERO":"FALSO";
			$sql = "UPDATE usr SET servernt = ? WHERE id_usr = ?";
			$params = array($servernt,$codalu);
			$type = "si";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
		public function delete_tutor($codalu,$codtut){
			$sql = "UPDATE alu_tut SET estado = 0 WHERE codigo = ? AND cod_tut = ?";
			$params = array($codalu,$codtut);
			$type = "ii";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
		}
		public function asignar_tutor($codalu,$codtut){
			$result = $this->es_tutor($codtut,$codalu);
			if(!$row = $result->fetch_object()){
				$result = $this->get_registro($codalu,$codtut);
				if($row = $result->fetch_object()){
					$sql = "UPDATE alu_tut SET estado = 1 WHERE nro = ?";
					$params = array($row->nro);
					$type = "i";
					$result=ejecutar_consulta($this->db, $sql, $type, $params);
					return $result;
				}else{
					$sql = "INSERT INTO alu_tut(codigo,cod_tut,parentesco,estado) VALUES(?,?,'tutor',1)";
					$params = array($codalu,$codtut);
					$type = "ii";
					$result=ejecutar_consulta($this->db, $sql, $type, $params);
					return $result;
				}
			}
		}
		public function es_tutor($codtut,$codalu){
			$sql = "SELECT * FROM alu_tut WHERE codigo = ? AND cod_tut = ? AND estado = 1";
			$params = array($codalu,$codtut);
			$type = "ii";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
		public function get_registro($codalu,$codtut){
			$sql = "SELECT * FROM alu_tut WHERE codigo = ? AND cod_tut = ?";
			$params = array($codalu,$codtut);
			$type = "ii";
			$result=ejecutar_consulta($this->db, $sql, $type, $params);
			return $result;
		}
}	
?>