<?php 
class Lista_utiles
{
	private $db;
	public function __construct($conexion)
		{
			$this->db = $conexion;
			require_once'execute_sql.php';
			//$this->db = Conectar::conexion();

		}

	public function get_lista($curso,$gestion){
		$consulta ="SELECT * 
					FROM lista_utiles 
					WHERE cod_cur = ? AND gestion = ? ORDER BY cod_par ASC";
		require_once'execute_sql.php';
		$type = "ii";
		$params = array($curso,$gestion);
		$resultado = ejecutar_consulta($this->db,$consulta,$type,$params);
		$lista = array();		
		while ($fila = $resultado->fetch_object() ) {
			$lista[] = array(
						"id"=>$fila->id,
						"cod_par"=>$fila->cod_par,
						"codmat"=>$fila->cod_mat,
						"lista"=>$fila->descrip
						);
			}
		
		return $lista;
		mysqli_stmt_close($resultado);
		return $ok!=false;
	}
}
?>