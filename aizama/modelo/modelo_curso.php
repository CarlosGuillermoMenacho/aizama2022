<?php 

class Curso{

	

	private $db;

	

	public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
			require_once'execute_sql.php';
		}



	public function getNombreCurso($id){

		$sql= "SELECT descrip 

			   FROM cursos 

			   WHERE codigo = ?";



		$resultado=mysqli_prepare($this->db, $sql);

		$ok=mysqli_stmt_bind_param($resultado,"i", $id);

			

		$ok=mysqli_stmt_execute($resultado);

		$lista = array();

		if ($ok) {

			$ok= mysqli_stmt_bind_result($resultado,$nombre);

			if(mysqli_stmt_fetch($resultado)){

				return $nombre;

			}

			

			return "";

			mysqli_stmt_close($resultado);

		}else{

			mysqli_stmt_close($resultado);

			return false;

		}

	}

	public function obtener_ListaAlumnos($codcur,$codpar){

		

		$sql= "SELECT codigo, paterno, materno, nombres

			   FROM alumno

			   WHERE cod_cur = ? and cod_par = ? and estado = 1 ORDER BY paterno,materno,nombres asc";

		

		$resultado=mysqli_prepare($this->db, $sql);

		$ok=mysqli_stmt_bind_param($resultado,"ii", $codcur, $codpar);

			

		$ok=mysqli_stmt_execute($resultado);

		$lista = array();

		if ($ok) {

			$ok= mysqli_stmt_bind_result($resultado,$codigo,$paterno,$materno,$nombres);

			while(mysqli_stmt_fetch($resultado)){

				$lista[] = array(

							"codalu" => $codigo,

							//"codalu" => $codalu,

							"paterno" => $paterno,

							"materno" => $materno,

							"nombres" => $nombres

						);

			}

			return $lista;

			mysqli_stmt_close($resultado);

		}else{

			mysqli_stmt_close($resultado);

			return false;

		}



	}
	public function getListaAlumnosBloq($codcur,$codpar){
/*		$sql= "SELECT codigo,codalu,paterno,materno,nombres,clave,cel1,fotoperfil,nacido  

			   FROM alumno 

			   WHERE cod_cur = ? and cod_par = ? and estado = 1 ORDER BY paterno,materno,nombres asc";
*/
		$sql= "SELECT a.codigo,a.codalu,a.paterno,a.materno,a.nombres,a.clave,a.cel1,a.fotoperfil,u.servernt

			   FROM alumno a,usr u

			   WHERE cod_cur = ? and cod_par = ? and estado = 1 and a.codigo=u.id_usr and u.servernt='FALSO' ORDER BY a.paterno,a.materno,a.nombres asc";



		$resultado=mysqli_prepare($this->db, $sql);

		$ok=mysqli_stmt_bind_param($resultado,"ii", $codcur,$codpar);

			

		$ok=mysqli_stmt_execute($resultado);

		$lista = array();

		if ($ok) {

			$ok= mysqli_stmt_bind_result($resultado,$codigo,$codalu,$paterno,$materno,$nombres,$clave,$cel1,$foto,$nac);

			while(mysqli_stmt_fetch($resultado)){

				$lista[] = array(

							"codigo" => $codigo,

							"codalu" => $codalu,

							"paterno" => $paterno,

							"materno" => $materno,

							"nombres" => $nombres,

							"clave" => $clave,

							"cel" => $cel1,

							"foto" => $foto,

							"nacimiento"=>$nac

						);

			}		

			return $lista;

			//mysqli_stmt_close($resultado);

		}else{

			//mysqli_stmt_close($resultado);

			return false;

		}
	}

	public function getListaAlumnos($codcur,$codpar){

		$sql= "SELECT codigo,codalu,paterno,materno,nombres,clave,cel1,fotoperfil,nacido  

			   FROM alumno 

			   WHERE cod_cur = ? and cod_par = ? and estado = 1 ORDER BY paterno,materno,nombres asc";



		$resultado=mysqli_prepare($this->db, $sql);

		$ok=mysqli_stmt_bind_param($resultado,"ii", $codcur,$codpar);

			

		$ok=mysqli_stmt_execute($resultado);

		$lista = array();

		if ($ok) {

			$ok= mysqli_stmt_bind_result($resultado,$codigo,$codalu,$paterno,$materno,$nombres,$clave,$cel1,$foto,$nac);

			while(mysqli_stmt_fetch($resultado)){

				$lista[] = array(

							"codigo" => $codigo,

							"codalu" => $codalu,

							"paterno" => $paterno,

							"materno" => $materno,

							"nombres" => $nombres,

							"clave" => $clave,

							"cel" => $cel1,

							"foto" => $foto,

							"nacimiento"=>$nac

						);

			}		

			return $lista;

			//mysqli_stmt_close($resultado);

		}else{

			//mysqli_stmt_close($resultado);

			return false;

		}



	}

	public function getCursosIndex(){

		$consulta = "SELECT * FROM cursos";

		$result = mysqli_query($this->db,$consulta);

		$lista = array();

		while ($fila = $result->fetch_object()) {

			$lista[$fila->codigo]=array(

										"nombre"=>$fila->descrip,

										"nivel"=>$fila->nivel,

										"codniv"=>$fila->cod_niv

										);

		}

		return $lista;

	}

	public function get_imagen($codcur,$codpar){

		$sql= "SELECT img 

			   FROM cur_par_img 

			   WHERE codcur = ? and codpar = ? and estado = 1" ;



		$resultado=mysqli_prepare($this->db, $sql);

		$ok=mysqli_stmt_bind_param($resultado,"ii", $codcur,$codpar);

			

		$ok=mysqli_stmt_execute($resultado);

		if ($ok) {

			$ok= mysqli_stmt_bind_result($resultado,$img);

			if(mysqli_stmt_fetch($resultado)){

				return $img;

			}

			

			return false;

			mysqli_stmt_close($resultado);

		}else{

			mysqli_stmt_close($resultado);

			return false;

		}

	}
	public function get_cursos(){
		$consulta ="SELECT * FROM cursos";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		return $result;
	}
	public function get_nivel($codcur){
		$consulta ="SELECT cod_niv FROM cursos WHERE codigo = ?";
		$type = "i";
		$params = array($codcur);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
		if($fetch = $result->fetch_object())return $fetch->cod_niv;
		return null;
	}
	public function quitar_de_lista($codalu){
		$consulta ="UPDATE alumno SET cod_cur = 0 WHERE codigo = ?";
		$type = "i";
		$params = array($codalu);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
	}
	public function get_curso_materia($codcur,$codpar,$codmat){
		$consulta ="SELECT * FROM cur_mat WHERE cod_cur = ? AND cod_par = ? AND cod_mat = ?";
		$type = "iis";
		$params = array($codcur,$codpar,$codmat);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);
		return $result;	
	}
	public function habilitar_registro($id){
		$consulta ="UPDATE cur_mat SET estado = 1 WHERE id = ?";
		$type = "i";
		$params = array($id);
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);	
	}
	public function asignar_materia($codcur,$codpar,$codmat){
		$result = $this->get_curso_materia($codcur,$codpar,$codmat);
		if($row = $result->fetch_object()){
			$id = $row->id;
			$estado = $row->estado;
			if($estado == 0){
				$this->habilitar_registro($id);
			}
		}else{
			$consulta ="INSERT INTO cur_mat(cod_cur,cod_par,cod_mat,estado) VALUES(?,?,?,1)";
			$type = "iis";
			$params = array($codcur,$codpar,$codmat);
			$result = ejecutar_consulta($this->db,$consulta,$type,$params);
		}
	}
	public function get_cursos_asignados(){
		$consulta ="SELECT * FROM cur_mat where estado = 1 GROUP BY cod_cur,cod_par";
		$type = "";
		$params = array();
		$result = ejecutar_consulta($this->db,$consulta,$type,$params);
		return $result;
	}

}	

?>