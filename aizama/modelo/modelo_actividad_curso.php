<?php 
class Actividad_curso
{
	private $db;
	public function __construct($conexion)
		{
			$this->db = $conexion;
			//$this->db = Conectar::conexion();
		}

	public function getActividades($codcur,$codpar,$gestion){
		$sql= "SELECT id,codmat,descripcion,codprof,fecha,horai,horaf,fechareg  
			   from actividad_curso  
			   where gestion = ? and codcur = ? and 
			   		 codpar = ? and estado = 1";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"iii",$gestion,$codcur, $codpar);
			
		$ok=mysqli_stmt_execute($resultado);
		$fila = array();
		
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$id,$codmat,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"id"=>$id,
								"codmat"=>$codmat,
								"descripcion"=>$descripcion,
								"codprof"=>$codprof,
								"fecha"=>$fecha,
								"horai"=>$horai,
								"horaf"=>$horaf,
								"fechareg"=>$fechareg
								);
				}
			 	return $lista;
		}else{
			return false;
		}
	}
	public function contActividades($codcur,$codpar,$gestion){
		$sql= "SELECT codmat, count(codmat) as n  
			   from actividad_curso  
			   where gestion = ? and codcur = ? and 
			   		 codpar = ? and estado = 1 group by codmat";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"iii",$gestion,$codcur, $codpar);
			
		$ok=mysqli_stmt_execute($resultado);
		$fila = array();
		
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$codmat,$n);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"codmat"=>$codmat,
								"actividades"=>$n
								);
				}
			 	return $lista;
		}else{
			return false;
		}
	}
	public function getActividadesMateria($codcur,$codpar,$codmat,$gestion){
		$sql= "SELECT id,codmat,descripcion,codprof,fecha,horai,horaf,fechareg  
			   from actividad_curso  
			   where gestion = ? and codcur = ? and 
			   		 codpar = ? and codmat = ? and estado = 1";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"iiis",$gestion,$codcur, $codpar,$codmat);
			
		$ok=mysqli_stmt_execute($resultado);
		$fila = array();
		
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$id,$codmat,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"id"=>$id,
								"descripcion"=>$descripcion,
								"codprof"=>$codprof,
								"fecha"=>$fecha,
								"horai"=>$horai,
								"horaf"=>$horaf,
								"fechareg"=>$fechareg
								);
				}
			 	return $lista;
		}else{
			return false;
		}
	}
	public function save_actividad($gestion,$codcur,$codpar,$codmat,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg){
		$sql= "INSERT INTO actividad_curso(gestion,codcur,codpar,codmat,descripcion,codprof,fecha,horai,horaf,fechareg,estado)
			   VALUES(?,?,?,?,?,?,?,?,?,?,?)";
		$estado = 1;
		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"iiisssssssi",$gestion,$codcur,$codpar,$codmat,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg,$estado);
			
		$ok=mysqli_stmt_execute($resultado);
		
		if ($ok) {
			mysqli_stmt_close($resultado);
			return true;
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
	public function update_actividad($id,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg){
		$sql= "UPDATE actividad_curso SET descripcion= ? , codprof = ? ,
										  fecha = ? , horai = ? , horaf = ?, 
										  fechareg = ? 
			   WHERE id = ? and estado = 1";
		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"ssssssi",$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg,$id);
			
		$ok=mysqli_stmt_execute($resultado);
		
		if ($ok) {
			mysqli_stmt_close($resultado);
			return true;
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
	public function delete_actividad($id){
		$sql= "UPDATE actividad_curso SET estado = 0  
			   WHERE id = ?";
		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"i",$id);
			
		$ok=mysqli_stmt_execute($resultado);
		
		if ($ok) {
			mysqli_stmt_close($resultado);
			return true;
		}else{
			mysqli_stmt_close($resultado);
			return false;
		}
	}
	public function getActividadesMes($codcur,$codpar,$mes,$gestion){
	    if(count($mes)==1)$mes ="0".$mes;
		$mes = "%-".$mes."-%";
		$sql= "SELECT ac.id,ac.codmat,ac.descripcion,ac.codprof,ac.fecha,ac.horai,ac.horaf,ac.fechareg ,m.descri 
			   FROM actividad_curso ac inner join materia m on ac.codmat=m.CODMAT 
			   and ac.gestion = ? and ac.codcur = ? and 
			   	     ac.codpar = ? and ac.fecha LIKE ? and 
			   	     ac.estado = 1";

		$resultado=mysqli_prepare($this->db, $sql);
		$ok=mysqli_stmt_bind_param($resultado,"iiis",$gestion,$codcur, $codpar,$mes);
			
		$ok=mysqli_stmt_execute($resultado);
		
		if ($ok) {
			$ok= mysqli_stmt_bind_result($resultado,$id,$codmat,$descripcion,$codprof,$fecha,$horai,$horaf,$fechareg,$materia);
			$lista = array();
			while (mysqli_stmt_fetch($resultado)) {
				$lista[] = array(
								"id"=>$id,
								"codmat"=>$codmat,
								"descripcion"=>$materia.' - '.$descripcion." desde las ".substr($horai,0,5)." hrs. hasta las ".substr($horaf,0,5),
								"codprof"=>$codprof,
								"fecha"=>$fecha,
								"horai"=>$horai,
								"horaf"=>$horaf,
								"fechareg"=>$fechareg,
								"dia"=>substr($fecha,8,2)
								);
				}
			 	return $lista;
		}else{
			return false;
		}
	}
}	
?>