/* Variables */
const select_paralelo = document.querySelector('#seleccionar_paralelo');
let listaParalelos = [];
let listaClases = [];


/* Peticiones */
$.post("get_paralelos.php",function(respuesta){
    let response = JSON.parse(respuesta);
    if( response['status'] == 'ok' ) {
        listaParalelos = [];
        listaParalelos = response['paralelos'];
        cargarParalelos();
    } else {
        alert('No hay paralelos');
    }
});

function pedirClases(codigoParalelo) {
    let datosEnvio = new FormData();
    datosEnvio.append("codpar", codigoParalelo);
    let url = "programar_clase_virtual.php?op=getclassonline";
    let peticionServidor=new XMLHttpRequest();

    peticionServidor.onreadystatechange=function () {
        if(peticionServidor.readyState=== 4 && this.status===200) {
            console.log(peticionServidor.responseText);  
            if (peticionServidor.responseText=="noCursos") {
                alert("No Tiene Cursos Registrados");
                return;
            }
            let respuesta=JSON.parse(peticionServidor.responseText);
            if  (respuesta["status"]=="ok"){
                listaClases=respuesta["lista"];
                mostrarTabla();
            }
            

        }
        else {
            console.log("Hubo un eror en la peticion");
        }
    }
    peticionServidor.open("POST", url);
    peticionServidor.send(datosEnvio);
}


$(document).ready(function() {
    $("#seleccionar_paralelo").change( function() {
        if ( $("#seleccionar_paralelo").val() != 0 ) {
            let codigoParalelo = $("#seleccionar_paralelo").val();
            pedirClases(codigoParalelo);
        } else {
            $(".contenedor-table-general").css("display","none");
        }
    });
    
});

/* Funciones */
function mostrarTabla() {
    
    $("#campos").children().remove();
    let contador=1;
    listaClases.forEach(  function(clase) {
        const { curso, titulo, enlace } = clase;
        if (enlace != "") {
            $("#campos").append(`
            <tr>
                <td data-label="Nro">${contador}</td>
                <td class="cursoCampo" data-label="Curso">${curso}</td>
                <td class="tituloCampo" data-label="Título">${titulo}</td>
                <td data-label="Enlace">
                    <a href="${enlace}" target="_blank">
                        <img src="images/ver.svg" alt="icono" height="50px">
                    </a>    
                
                </td>
            </tr>
        `)
        contador++;
        } 
        else {
            $("#campos").append(`
                <tr>
                    <td data-label="Nro">${contador}</td>
                    <td class="cursoCampo" data-label="Curso">${curso}</td>
                    <td class="tituloCampo" data-label="Título"></td>
                    <td data-label="Enlace"></td>
                </tr>
            `)
            contador++;
        }
    });

    $(".contenedor-table-general").css("display", "block");
}

function cargarParalelos() {
    for(let i = 0; i < listaParalelos.length; i++) {
        var codigoParalelo = listaParalelos[i]['codigo'];
        var nombreParalelo = listaParalelos[i]['nombre'];
        $('#seleccionar_paralelo').append(`<option value="${codigoParalelo}" >${nombreParalelo}</option>`)
    }
}

