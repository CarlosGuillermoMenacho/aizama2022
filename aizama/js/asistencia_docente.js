/* Variables */
var listaAsistencia = [];
var btnBuscar = document.querySelector('#buscarLista');
var fecha = document.querySelector('#fecha');

var diaText;

function mostrarTabla() {
    $('#dia').text(diaText);
    $(".contenedor-table-general tbody").children().remove();
    for(let i=0; i<listaAsistencia.length; i++) {
        let nombre = listaAsistencia[i]['nombre'];
        let ingreso = listaAsistencia[i]['ingreso'];
        let salida = listaAsistencia[i]['salida'];
        $('#campos').append(
            `<tr>
                <td data-label="Nro">${(i+1)}</td>
                <td data-label="Nombre">${nombre}</td>
                <td data-label="Ingreso">${ingreso}</td>
                <td data-label="Salida">${salida}</td>
            </tr>`
        );
    }
}

function peticionAsistencia(fecha) {
 
    $('#dia').text(dia);
    let fechaPeticion = fecha;
    var response;
    listaAsistencia = [];
    $.ajax({
        url : 'asistencia_prof_json.php?op=lista',
        data : {'fecha':fechaPeticion }, 
        method : 'POST',
        success : function(respuesta){
            response = respuesta;
            var jsonData = JSON.parse(response);
            if( jsonData['status'] == 'ok' ) {
                diaText = jsonData['dia']
                listaAsistencia = jsonData['lista'];
                mostrarTabla();
            } else if(jsonData['status'] == 'eSession') {
                alert('La session ha expirado, vuelva a ingresar al sistema');
            } else {
                alert('No hay docentes');
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
        fechaActual = `${year}-0${month}-0${day}`;
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
 
});
