/* Variables */
var listaAsistencia = [];
var btnBuscar = document.querySelector('#buscarLista');
var fecha = document.querySelector('#fecha');

var fechaText; // Mostrar dia
var listaCursos = [];
var listaParalelos = [];


function cargarCursos() {
    for(let i = 0; i<listaCursos.length; i++) {
        var codigoCurso = listaCursos[i]['codigo'];
        var nombreCurso = listaCursos[i]['nombre'];
        $('#seleccionar_curso').append(`<option value="${codigoCurso}" >${nombreCurso}</option>`)
    }
}
function cargarParalelos() {
    
    for(let i = 0; i<listaParalelos.length; i++) {
        var codigoParalelo = listaParalelos[i]['codigo'];
        var nombreParalelo = listaParalelos[i]['nombre'];
        $('#seleccionar_paralelo').append(`<option value="${codigoParalelo}" >${nombreParalelo}</option>`)
    }
}

/* Peticion para los selects */
$.post("obtener_cursos_adm.php?op=adm",function(respuesta){
    let response = JSON.parse(respuesta);
    if( response['status'] == 'ok' ) {
        
        listaCursos = response['cursos'];
        cargarCursos();           
    } else {
        alert('No hay cursos');
    }
});

$.post("get_paralelos.php",function(respuesta){
    let response = JSON.parse(respuesta);
    if( response['status'] == 'ok' ) {
        listaParalelos = [];
        listaParalelos = response['paralelos'];
        
    } else {
        alert('No hay paralelos');
    }
});
function peticionParalelos() {
    cargarParalelos();
}







function mostrarTabla(codigoCurso, codigoParalelo ) {
    document.querySelector('.contenedor-tables').style.display = 'block';
    let curso = codigoCurso;
    let paralelo = codigoParalelo;
    $('#fechaText').text(fechaText);
    $(".contenedor-table-general tbody").children().remove();
    for(let i=0; i<listaAsistencia.length; i++) {
        let nombre = listaAsistencia[i]['nombre'];
        let nombreCurso = listaAsistencia[i]['curso'];
        let ingreso = listaAsistencia[i]['entrada'];
        let salida = listaAsistencia[i]['salida'];
        let codigoCurso = listaAsistencia[i]['codcur'];
        let codigoParalelo = listaAsistencia[i]['codpar'];
        
        if( curso != 0 && paralelo != 0) {
            if(codigoCurso == curso && codigoParalelo == paralelo ) {
                $('#campos').append(
                    `<tr>
                        <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombre}</td>
                        <td data-label="Curso">${nombreCurso}</td>
                        <td data-label="Ingreso">${ingreso}</td>
                        <td data-label="Salida">${salida}</td>
                    </tr>`
                );
            }
        } else if (curso != 0 && paralelo == 0 ) {
            if( codigoCurso == curso ) {
                $('#campos').append(
                    `<tr>
                        <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombre}</td>
                        <td data-label="Curso">${nombreCurso}</td>
                        <td data-label="Ingreso">${ingreso}</td>
                        <td data-label="Salida">${salida}</td>
                    </tr>`
                );
            }   
        }
        else {
            $('#campos').append(
                `<tr>
                    <td data-label="Nro">${(i+1)}</td>
                    <td data-label="Nombre">${nombre}</td>
                    <td data-label="Curso">${nombreCurso}</td>
                    <td data-label="Ingreso">${ingreso}</td>
                    <td data-label="Salida">${salida}</td>
                </tr>`
            );
        }
        
        
    }
}

function peticionAsistencia(fecha) {
    $('#seleccionar_curso').val(0);
    $('#select2-seleccionar_curso-container').text('-- Seleccionar curso --');
    $('#seleccionar_paralelo').val(0);
    $('#select2-seleccionar_paralelo-container').text('-- Seleccionar paralelo --');
    let fechaPeticion = fecha
    var response;
    listaAsistencia = [];
    $.ajax({
        url : 'asistencia_json.php?op=lista',
        data : {'fecha':fechaPeticion }, 
        method : 'POST', //en este caso
        success : function(respuesta){
            response = respuesta;
            var jsonData = JSON.parse(response);
            if( jsonData['status'] == 'ok' ) {
                fechaText = jsonData['dia'];
                listaAsistencia = jsonData['lista'];
                mostrarTabla(0, 0);
            } else if(jsonData['status'] == 'noAsistencias') {
                alert('No hay asistencia en este dia');
            } else {
                alert('No hay alumnos');
            }
        },
        error: function(error){
            alert("error en la peticion");
        }
    });
}

$(document).ready(function() {
    
    /* Fecha Actual */
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let fechaActual = '';    
    if(month < 10){
        fechaActual = `${year}-0${month}-${day}`;
    } else {
        fechaActual = `${year}-${month}-${day}`;
    }
    fecha.value = fechaActual;
    peticionAsistencia(fechaActual);
    
    /* Buscar Asistencia por fecha */
    btnBuscar.addEventListener('click', () => {
        if( fecha.value != '' ) {
            let fechaPeticion = fecha.value;
            peticionAsistencia(fechaPeticion); 
        } else {
            alert('Escoja una fecha');
        }
    });   
    $('#seleccionar_curso').change( ()=> {
        $('#seleccionar_paralelo').val(0);
        $('#select2-seleccionar_paralelo-container').text('-- Seleccionar paralelo --');
        document.querySelector('.contenedor-tables').style.display = 'none';
        if( $('#seleccionar_curso').val() != 0 ) {
            peticionParalelos();
            let codigoCurso = $('#seleccionar_curso').val();
            mostrarTabla(codigoCurso, 0);
        } else {
            
            $('#seleccionar_paralelo').html('<option value="0">-- Seleccionar Paralelo --</option>');
            mostrarTabla(0, 0);
        }
        
    });
    $('#seleccionar_paralelo').change( ()=> {
        let codigoCurso = $('#seleccionar_curso').val();
        if( $('#seleccionar_curso').val() != 0 && $('#seleccionar_paralelo').val() != 0 ) {
            let codigoParalelo = $('#seleccionar_paralelo').val();
            console.log(codigoCurso);
            console.log(codigoParalelo);
            mostrarTabla(codigoCurso, codigoParalelo);
        } else if( $('#seleccionar_paralelo').val() == 0 ) {
            mostrarTabla(codigoCurso, 0)
        }
    });

});
