let lista_alumnos = [];
let alumno_selected = "";
const preinscribir = sn => {
    let justificacion = $('#justificacion').val();
    let modalidad = 1;
    let checkboxs = document.getElementsByName('modalidad');
    if (checkboxs[1].checked)modalidad = 3;
    $.post(
        "controlador/preinscripcion_controlador.php?op=pre_inscripcion_family",
        {codalu:alumno_selected,sn:sn,justificacion:justificacion,modalidad : modalidad},
        datos => {
            if(datos.status == "ok"){
                Swal.fire("Se ha registrado su respuesta exitosamente...");
                get_preinscripcion();
            }
            if(datos.status == "eSession")location.href = 'familia.php';
            if(datos.status == "noKardex")Swal.fire("El estudiante no está habilitado para pre - inscribir...\nConsulte si tiene sus cuotas canceladas hasta octubre...");
            if(datos.status == "blocked")Swal.fire("El estudiante ha sido bloqueado...\nConsulte en administraci&oacute;n...");
        },
        "json"
        );
};
const mostrarForm = codalu => {
      alumno_selected = codalu;
      $('#justificacion').val("");
      $("#tabla_lista").addClass('oculto');
      $("#formulario").removeClass('oculto');
      $("#btn-back").removeClass('oculto');
      let checkboxs = document.getElementsByName('modalidad');
      checkboxs[0].checked = true;
};
const mostrar_lista = () => {
    $("#body").empty();
    alumno_selected = "";
    let index = 1;
    lista_alumnos.forEach(alumno => {
        console.log(alumno);
        let fila = `<td class="border-td center"><a href="#" onClick="mostrarForm(${alumno.alumno.codalu});">Confirmar</a></td>`;
        
        if(alumno.preinscripcion !== ""){
            if(alumno.preinscripcion.inscripcion == 1){
                fila = '<td class="border-td center">Modalidad Presencial</td>';
            }
            if(alumno.preinscripcion.inscripcion == 3){
                fila = '<td class="border-td center">Modalidad Virtual</td>';
            }
            if(alumno.preinscripcion.inscripcion == 2){
                fila = '<td class="border-td center"> - </td>';
            }
        }
        if(alumno.bloqueo)fila = '<td class="border-td center" style="color: var(--c3);"> Bloqueado </td>';
            
        $("#body").append(`
                        <tr>
                            <td class="border-top index">${index}</td>
                            <td class="border-td">${alumno.alumno.nombre}</td>
                            ${fila}
                        </tr>   
                          `);
        index++;
      
    });
    $("#tabla_lista").removeClass('oculto');
    $("#formulario").addClass('oculto');
    $("#btn-back").addClass('oculto');
};
const get_preinscripcion = () => {
    $.get(
            'controlador/preinscripcion_controlador.php?op=get_pre_inscripcion_family',
            datos => {
                if(datos.status == "eSession"){
                    location.href = 'familia.php';
                }
                if(datos.status == "ok"){
                    lista_alumnos = datos.datos;
                    mostrar_lista();
                }
            },
            "json"
          );
};

$(document).ready(()=>{
    get_preinscripcion();
    
    
});