<?php 
 /**
  * 
  */
 class Conectar
 {
 	
 	public static function conexion()
 	{
 		try {
 			require('Config_local.php');
 			$conexion = mysqli_connect($servername,$username,$password,$database);
 			mysqli_query($conexion,"SET NAMES 'utf8'");
 		} catch (Exception $e) {
 			die("Error".$e->getMessage());
 			echo "Linea del Error".$e->getLine();
 		}
 		return $conexion;
 	}
 	public function ejecutar_consulta($db,$sql,$type,$params){
        $stmt = mysqli_prepare($db,$sql);
        if(!empty($params))$ok=mysqli_stmt_bind_param($stmt,$type,...$params);
        $ok = mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        mysqli_stmt_close($stmt);

        return $result;
    }
    public function ejecutar_consulta2($sql,$type,$params){
        $stmt = mysqli_prepare($db,$sql);
        if(!empty($params))$ok=mysqli_stmt_bind_param($stmt,$type,...$params);
        $ok = mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        mysqli_stmt_close($stmt);

        return $result;
    }
}
?>