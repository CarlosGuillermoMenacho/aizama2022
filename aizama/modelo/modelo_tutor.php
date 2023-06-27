<?php 
class Tutor{
    private $db;
    
    public function __construct($conexion)
        {
            $this->db = $conexion;
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
			require_once("modelo_Alumno.php");
        }

    public function get_tutor($codtut){
    	$consulta="SELECT paterno,materno,nombres,cel 
    			   FROM tutor 
    			   WHERE cod_tut = ?";
        
        $resultado=mysqli_prepare($this->db,$consulta);
        $ok=mysqli_stmt_bind_param($resultado,"i",$codtut);
        $ok=mysqli_stmt_execute($resultado);
        if($ok){
        	$ok= mysqli_stmt_bind_result($resultado,$paterno,$materno,$nombres,$celular);
        	$respuesta = array();
        	if(mysqli_stmt_fetch($resultado)){
        		$respuesta = array(
        				"paterno"=>$paterno,
        				"materno"=>$materno,
        				"nombres"=>$nombres,
        				"celular"=>$celular
        				);
        	}
        	//mysqli_stmt_close($resultado);
        	return $respuesta;
        }
       // mysqli_stmt_close($resultado);
        return $ok!=false; 
    }
    public function get_all_tutores_alu(){
        $sql="SELECT DISTINCT a.codigo,a.cod_tut,t.cel FROM alu_tut a INNER JOIN tutor t where a.cod_tut = t.cod_tut AND a.estado = 1";
        $type="";
        $params=array();
        $result=ejecutar_consulta($this->db,$sql,$type,$params);
        return $result;
    }
    public function get_alumnoss($codtut){
		$sql="select * FROM alu_tut WHERE cod_tut=? AND estado=1";
		$type="i";
		$params=array($codtut);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		$lista_alumnos=array();
		require_once("modelo_Alumno.php");
		require_once("modelo_curso.php");
		require_once("modelo_paralelo.php");
		$Curso = new Curso($this->db);
		$Paralelo = new Paralelo($this->db);
		$alumno=new Alumno($this->db);
		while( $fila=$result->fetch_object()){
			$codalu=$fila->codigo;
			$nombre=$alumno->getDatosAlumno($codalu);
			$curso = $Curso->getNombreCurso($nombre['codcur']).' - '.$Paralelo->getNombreParalelo($nombre['codpar']);
			$lista_alumnos[]=array("codalu"=>$codalu,
									"nombre"=>$nombre['nombre'],
									"curso"=>$curso);
		}
		return $lista_alumnos;
	}  
    public function get_alumnos($codtut){
        $consulta="SELECT codigo 
                   FROM alu_tut 
                   WHERE cod_tut = ? and estado = 1";
        
        $resultado=mysqli_prepare($this->db,$consulta);
        $ok=mysqli_stmt_bind_param($resultado,"i",$codtut);
        $ok=mysqli_stmt_execute($resultado);
        if($ok){
            $ok= mysqli_stmt_bind_result($resultado,$codigo);
            $respuesta = array();
            while(mysqli_stmt_fetch($resultado)){
                $respuesta[] = $codigo;
            }
            //mysqli_stmt_close($resultado);
            return $respuesta;
        }
        //mysqli_stmt_close($resultado);
        return $ok!=false;
    }
    public function get_tutores($codcur,$codpar){
		$sql="SELECT DISTINCT a.codigo,t.cel  
			  FROM alumno a INNER JOIN alu_tut alt INNER JOIN tutor t ON
			  a.cod_cur = ? AND a.cod_par = ? AND 
			  a.codigo = alt.codigo AND a.estado = 1 AND 
			  alt.cod_tut = t.cod_tut AND alt.estado = 1 ";
		$type="ii";
		$params=array($codcur,$codpar);
		$result=ejecutar_consulta($this->db,$sql,$type,$params);
		return $result;
	} 
	public function get_tutor2($codtut){
    	$consulta="SELECT paterno,materno,nombres,cel 
    			   FROM tutor 
    			   WHERE cod_tut = ?";
        $type="i";
		$params=array($codtut);
		$result=ejecutar_consulta($this->db,$consulta,$type,$params);
        if($fetch = $result->fetch_object()){
        	$respuesta = array(
        			"paterno"=>$fetch->paterno,
        			"materno"=>$fetch->materno,
        			"nombres"=>$fetch->nombres,
        			"celular"=>$fetch->celular
        	);
        	return $respuesta;
        }else{
            $respuesta = array(
        			"paterno"=>"",
        			"materno"=>"",
        			"nombres"=>"",
        			"celular"=>""
        	);
        	return $respuesta;
        }
 
    }
    public function es_tutor($codtut,$codalu){
        $consulta="SELECT * 
                   FROM alu_tut  
                   WHERE codigo = ? AND cod_tut = ? AND estado = 1";
        $type="ii";
        $params=array($codalu,$codtut);
        $result=ejecutar_consulta($this->db,$consulta,$type,$params);
        if($fetch = $result->fetch_object())return true;
        return false;
    }  
    public function get_curso_tutor($phone){
        $consulta="SELECT DISTINCT c.descrip 
                   FROM alumno a INNER JOIN alu_tut alt ON a.codigo = alt.codigo AND a.estado = 1 AND alt.estado = 1 INNER JOIN cursos c ON a.cod_cur = c.codigo INNER JOIN tutor t ON alt.cod_tut = t.cod_tut AND t.cel = ?";
        $type="s";
        $params=array($phone);
        $result=ejecutar_consulta($this->db,$consulta,$type,$params);
        return $result;
    }
    public function get_all(){
       $consulta="SELECT * FROM tutor";
        $type="";
        $params=array();
        $result=ejecutar_consulta($this->db,$consulta,$type,$params);
        return $result; 
    }
}
?>