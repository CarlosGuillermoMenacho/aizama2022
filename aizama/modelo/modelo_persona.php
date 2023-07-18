<?php
class Persona {
    private $db;
    public function __construct($conexion){
        $this->db = $conexion;
        require_once"execute_sql.php";
    }
    public function es_alumno($nombre){
        require_once"modelo_Alumno.php";
        $Alumno = new Alumno($this->db);
        $result = $Alumno->get_all();
        $alumnos = [];
        while ($row = $result->fetch_object()) {
            $alumnos[] = [
                "codalu"=>$row->codigo,
                "paterno"=>$row->paterno,
                "materno"=>$row->materno,
                "nombres"=>$row->nombres
            ];
        }
        $array_name = explode(" ",$nombre);
        if(count($array_name)<3)return [];
        $paterno = $array_name[0];
        $match = $this->obtener_matchs_paterno($paterno,$alumnos);
        if(count($match)>0){
            $alumnos = $match;
            $materno = $array_name[1];
            $match = $this->obtener_matchs_materno($materno,$alumnos);
            if(count($match) == 0)return [];
        }
    }
    function obtener_matchs_paterno($paterno,$alumnos){
        $match = [];
        for ($i=0; $i < count($alumnos); $i++) { 
            if(strtoupper($alumnos[$i]["paterno"]) == strtoupper($paterno))$match[] = $alumnos[$i];
        }
        return $match;
    }
    function obtener_matchs_materno($materno,$alumnos){
        $match = [];
        for ($i=0; $i < count($alumnos); $i++) { 
            if(strtoupper($alumnos[$i]["materno"]) == strtoupper($materno))$match[] = $alumnos[$i];
        }
        return $match;
    }
}


?>