<?php 
function ejecutar_consulta($db,$sql,$type,$params){
    $stmt = mysqli_prepare($db,$sql);
    if(!empty($params))$ok=mysqli_stmt_bind_param($stmt,$type,...$params);
    $ok = mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    mysqli_stmt_close($stmt);

    return $result;
}
?>