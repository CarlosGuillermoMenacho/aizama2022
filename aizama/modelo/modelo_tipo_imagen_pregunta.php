<?php
class tipo_imagen{
    private $db;

    public function __construct($conexion)
        {
            $this->db = $conexion;
            require_once'execute_sql.php';
            //$this->db = Conectar::conexion();
        }

    public function get_imagen($idtipo){
        $consulta= "SELECT link 
               FROM em_tipo_imagen 
               WHERE id= ?";

        $resultado=mysqli_prepare($this->db, $consulta);
        $ok=mysqli_stmt_bind_param($resultado,"i", $idtipo);
            
        $ok=mysqli_stmt_execute($resultado);
        if ($ok) {
            $ok= mysqli_stmt_bind_result($resultado,$link);
            if(mysqli_stmt_fetch($resultado)){
                return $link;
            }
            
            return false;
            mysqli_stmt_close($resultado);

        }else{
            
            mysqli_stmt_close($resultado);
            return false;
        }
    }
    public function get_img_tipo(){
        $consulta = "SELECT * FROM em_tipo_imagen";
        $result = mysqli_query($this->db,$consulta);
        $lista= array();
        while($fila = $result->fetch_object()){
            $lista[] = array(
                        "id"=>$fila->id,
                        "link"=>$fila->link,
                        "nombre"=>$fila->nombre,
                        "descripcion"=>$fila->descripcion
            );
        }
        return $lista;
    }

}
?>