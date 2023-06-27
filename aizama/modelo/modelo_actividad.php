<?php 
class Actividad{
    private $db;
    
    public function __construct($conexion)
    {
            $this->db = $conexion;
            require_once'execute_sql.php';
            require_once'modelo_practico_digital.php';
            require_once'modelo_practico_web.php'; 
            require_once'modelo_Evaluacion.php';  	
            require_once'modelo_evaluacion_escrita.php'; 
            require_once'modelo_evaluacion_mixta.php'; 		
    }
    public function tiene_actividad($profe,$fi,$ff){
        //Verificando practicos
        $Practico_digital = new PracticoDigital($this->db);
        $result = $Practico_digital->get_practicos_fechas($profe,$fi,$ff);
        if($fetch = $result->fetch_object())return true;

        $Practico_web = new PracticoWeb($this->db);
        $result = $Practico_web->get_practicos_fechas($profe,$fi,$ff);
        if($fetch = $result->fetch_object())return true;

        //Verificando Evaluaciones
        $Evaluacion_seleccion = new Evaluacion_Seleccion($this->db);
        $result = $Evaluacion_seleccion->get_evaluacion_fechas($profe,$fi,$ff);
        if($fetch = $result->fetch_object())return true;

        $Evaluacion_escrita = new EvaluacionEscrita($this->db);
        $result = $Evaluacion_escrita->get_evaluacion_fechas($profe,$fi,$ff);
        if($fetch = $result->fetch_object())return true;

        $Evaluacion_mixta = new Evaluacion_mixta($this->db);
        $result = $Evaluacion_mixta->get_evaluacion_fechas($profe,$fi,$ff);
        if($fetch = $result->fetch_object())return true;

        return false;
    }
        
}
?>