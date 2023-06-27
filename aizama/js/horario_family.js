let alumnos;
let lista_alumnos = [];
let lista = [];
let codalu;
let lista_licencia=[];
let licencia=[];
let id_seleccionado;
let fecha=fecha_actual();
function obtener_alumnos() {
    
    $.post(
        '../aizama/controlador/tutor_controlador.php?op=get_alumnos&usr=tut',
        datos => {
            lista = datos.lista_alumnos;
            cargar_alumnos();
        },
        "json"
    );
}
function fecha_actual() {
    let fecha = new Date();
    let mes = fecha.getMonth()+1; 
    let dia = fecha.getDate(); 
    let ano = fecha.getFullYear(); 
    if(dia<10)
          dia='0'+dia; //agrega cero si el menor de 10
    if(mes<10)
    mes='0'+mes //agrega cero si el menor de 10
    return  ano+"-"+mes+"-"+dia;
}
function cargar_alumnos() {
    $('#tabla').css('display',"block");
    for (var i = 0; i < lista.length; i++) {
        let nombre = lista[i]['nombre'];
        $('#select-alu').append(`<option value="${i}">${nombre}  </option>`);
    }
    i++;
}

function obtener_horario(index) {
    codalu = lista[index].codalu;
    $.post(
            "controlador/horario_controlador.php?usr=tut&op=get_horario_tutor",
            {codalu:codalu},
            data=>{
                $("#imagen").attr("src",data);
            }
          );
  
}

const limpiar = ()=>{
    $('#select-alu').val("");
    limpiar_form()
}


$(document).ready(() => {
    
    obtener_alumnos();
    $('#select-alu').change(() => {
        let index = $('#select-alu').val();
        obtener_horario(index);
    });

});