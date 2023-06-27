const obtener_autoevaluaciones = ()=>{
    $.post(
        'controlador/auto_evaluaciones_controlador.php?op=get_autoevaluaciones_alu&usr=alu',
        data =>{
            if(data.status == "eSession"){
                location.href = "usuarios.php";
            }
            if(data.status == "ok"){
                mostrarRegistros(data.lista);
            }
        },
        "json"
          );   
};
const mostrarRegistros = reg => {
    $('#div_lista').empty();
    let bandera = false;
    reg.forEach(fila=>{
        bandera = !bandera;
        let stilo = "";
        if(bandera)stilo="stilo";
        let calif = "";
        if(fila.calificado){
            calif = `<div class="ser">Ser : ${fila.ser} pts.</div>
                     <div class="ser">Decidir : ${fila.decidir} pts.</div>`;
        }else{
            calif = `<div class="ser">Ser <input type="number" id="ser${fila.cod_autoevaluacion}" class="input_number"/></div>
                     <div class="ser">Decidir <input type="number" id="decidir${fila.cod_autoevaluacion}" class="input_number"/></div>
                     <div class="ser"><button class="btn_guardar" onclick="calificar(${fila.cod_autoevaluacion})">Guardar</button></div>`;
        }
        $('#div_lista').append(
                                `<div class="div_lista ${stilo}">
                                    <div class="materia">${fila.materia}</div>
                                    <div class="file"><a href="${fila.file}" target="_blank"><img src="images/icon_document.svg"/></a></div>
                                    ${calif}
                                 </div>`
                              );
    });
};
const calificar = codeva => {
    let ser = $(`#ser${codeva}`).val();
    let decidir = $(`#decidir${codeva}`).val();
    
    if(ser === "" || decidir === ""){
        $(`#ser${codeva}`).focus();
        Swal.fire("Debe ingresar las notas del SER y DECIDIR...!!!");
        return;
    }
    let s = parseInt(ser);
    let d = parseInt(decidir);
    if(s < 1 || s > 5 ){
        $(`#ser${codeva}`).focus();
        Swal.fire("La nota del SER debe ser entre 1 y 5 puntos...!!!");
        return;
    }
    if(d < 1 || d > 5 ){
        $(`#decidir${codeva}`).focus();
        Swal.fire("La nota del DECIDIR debe ser entre 1 y 5 puntos...!!!");
        return;
    }
    Swal.queue([{
    title: '¿Estás seguro?',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    showCancelButton: true,
    text:'Se gurdará las notas',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      document.querySelector('.swal2-styled.swal2-cancel').style.display ="none";
      return $.post(
            'controlador/auto_evaluaciones_controlador.php?op=calificar&usr=alu',
            {codeva:codeva,ser:ser,decidir:decidir},
            data => {
                if(data === "eSession"){
                    location.href = "usuarios.php";
                    return;
                }
                if(data === "ok"){
                    Swal.fire('Auto-evaluación registrada exitosamente...!!!');
                    obtener_autoevaluaciones();
                }
                
            },
            "text"
          );
    }
  }]);
    
};
$(document).ready(()=>{
    obtener_autoevaluaciones();
});