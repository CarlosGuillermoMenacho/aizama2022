<?php 
function is_entero($param){
	return is_int($param) || ctype_digit($param) ? true : false;
}
function es_fecha($fecha){
	$f = explode("-",$fecha);
	if(count($f)==3){
		return checkdate($f[1],$f[2],$f[0]);
	}else{
		return false;
	}	
}
function es_hora($time)
{
    $pattern="/^([0-1][0-9]|[2][0-3])[\:]([0-5][0-9])$/";
    if(preg_match($pattern,$time))
        return true;
    return false;
}
?>