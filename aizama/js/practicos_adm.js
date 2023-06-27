import {obtenerCurso, obtenerParalelos, obtenerMaterias } from "./peticion_adm_cpm.js";
import {cargarCursos, cargarParalelos, cargarMaterias, obtenerNivel} from "./peticion_adm_cpm.js";
/* variables */
let listaCursos=[];
let listaParalelos=[];
let listaMaterias=[];

let listaPracticos=[];
let listaPreguntas = [];
let listaPresentaciones = [];

/* Peticion */
function peticionPractico(curso,paralelo,materia ){
    /* Datos Enviar */
    let datosEnviar=new FormData();
    datosEnviar.append( "codcur",curso );
    datosEnviar.append( "codpar",paralelo );
    datosEnviar.append( "codmat",materia );

    /* Empieza la peticion */
    let peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function(){
        if (peticion.readyState==4 && peticion.status==200) {
            if (peticion.responseText == "errorParam") {
                console.log("Error de parametro");
            }
            let respuestaServidor = JSON.parse(peticion.responseText);
            if (respuestaServidor["status"]=="noPracticos") {
                listaPracticos=[];
                $(".contenedor-table-general").css("display","none");
                $(".contenedor-table-preguntas").css("display","none");
                $(".contenedor-table-presentacion").css("display","none");
                alert("No hay Practicos");

                return;
            }
            if (respuestaServidor["status"]=="ok") {
                listaPracticos = respuestaServidor["lista"];
                listaPreguntas = respuestaServidor["preguntas"];
                listaPresentaciones = respuestaServidor["presentaciones"];
                mostrarTabla();
            }
        } 
    }
    peticion.open("POST","practicos_json.php?op=gpadm", false);
    peticion.send(datosEnviar);

}

$(document).ready(function() {
    let nivelCurso;
    listaCursos = obtenerCurso();
    listaMaterias = obtenerMaterias();
    listaParalelos = obtenerParalelos();
    cargarCursos(listaCursos);

    $("#seleccionar_Curso").change( function()  {
        $(".contenedor-table-general").css("display","none");
        $(".contenedor-table-preguntas").css("display","none");
        $(".contenedor-table-presentacion").css("display","none");
        $('#seleccionar_Paralelo').html(`<option value="0" >-- Seleccionar paralelo --</option>`);
        $('#seleccionar_Materia').html(`<option value="0" >-- Seleccionar materia --</option>`);
        if ( $("#seleccionar_Curso").val() !=0 ) {
            cargarParalelos(listaParalelos);
            let codigoCurso = $("#seleccionar_Curso").val();
            nivelCurso = obtenerNivel(listaCursos, codigoCurso);     
        } else {
            $('#seleccionar_Paralelo').html(`<option value="0" >-- Seleccionar paralelo --</option>`);
            $('#seleccionar_Materia').html(`<option value="0" >-- Seleccionar materia --</option>`);
        }
    });

    $("#seleccionar_Paralelo").change( function()  {
        $('#seleccionar_Materia').html(`<option value="0" >-- Seleccionar materia --</option>`);
        $(".contenedor-table-general").css("display","none");
        $(".contenedor-table-preguntas").css("display","none");
        $(".contenedor-table-presentacion").css("display","none")
        if ( $("#seleccionar_Paralelo").val() !=0 ) {
            cargarMaterias(listaMaterias, nivelCurso);
        } else {
            $('#seleccionar_Materia').html(`<option value="0" >-- Seleccionar materia --</option>`);
        }
    });

    $("#seleccionar_Materia").change( function()  {
        $(".contenedor-table-preguntas").css("display","none");
        $(".contenedor-table-presentacion").css("display","none");
        if ( $("#seleccionar_Materia").val() !=0 ) {
            let codigoCurso=$("#seleccionar_Curso").val();
            let codigoParalelo=$("#seleccionar_Paralelo").val();
            let codigoMateria=$("#seleccionar_Materia").val();
            peticionPractico( codigoCurso,codigoParalelo,codigoMateria );
        
        } else {
            $(".contenedor-table-general").css("display","none");
        }
    });

    $(".btnAtras").click( () => {
        $(".contenedor-table-general").css("display","block");
        $(".contenedor-table-preguntas").css("display","none");
        $(".contenedor-table-presentacion").css("display","none");
    });

});



/* Funciones */
function verPractico(practico) {
    $(".contenedor-table-general").css("display","none");
    $(".contenedor-table-preguntas").css("display","block");
    $("#camposPreguntas").children().remove();
    let count = 1;
    listaPreguntas[practico].forEach( preguntas => {
        const { archivo, extension, pregunta } = preguntas;
        let image = imagenExtension(extension);
        if( archivo != "") {
            $("#camposPreguntas").append(`<tr>
                <td data-label="Nro">${count}</td>
                <td data-label="Pregunta">${pregunta}</td>
                <td data-label="Material">
                    <a href="${archivo}" target="_blank">
                        <img src="${image}" height="50px">
                    </a>
                </td>
            </tr>`);                
        } else {
            $("#camposPreguntas").append(`<tr>
                <td data-label="Nro">${count}</td>
                <td data-label="Pregunta">${pregunta}</td>
                <td data-label="Material">No hay material</td>
            </tr>`);                
        }
        count++;
    });

}

function verPresentacion(practico) {
    $(".contenedor-table-general").css("display","none");
    $(".contenedor-table-preguntas").css("display","none");
    $(".contenedor-table-presentacion").css("display","block");
    $("#camposPresentacion").children().remove();
    let count = 1;
    console.log(listaPresentaciones[practico]);
    listaPresentaciones[practico].forEach( alumno => {
        const { nombre, fecha, hora, archivo ,nota} = alumno;
        if (archivo != "") {
            $("#camposPresentacion").append(`<tr>
                <td data-label="Nro">${count}</td>
                <td data-label="Nombre" class="alignIzquierda">${nombre}</td>
                <td data-label="Fecha">${fecha}</td>
                <td data-label="Hora">${hora}</td>
                <td data-label="Nota">${nota}</td>
                <td data-label="Archivo">
                    <a href="${archivo}" target="_blank">
                        <img src="images/icon_document.svg" height="50px" alt="icono">
                    </a>
                </td>
            </tr>`)
        } else {
            $("#camposPresentacion").append(`<tr>
                <td data-label="Nro">${count}</td>
                <td data-label="Nombre" class="alignIzquierda">${nombre}</td>
                <td data-label="Fecha"> </td>
                <td data-label="Hora"> </td>
                <td data-label="Nota"> </td>
                <td data-label="Archivo"> </td>
            </tr>`)
            
        }
        count++;
    });
}

function mostrarTabla(){
    $("#campos").children().remove();
    let contador = 1;
    listaPracticos.forEach(practico => {
        const { codpractico, descripcion, fechalimite, profesor, fecharegistro } =  practico;
        $("#campos").append(`<tr>
            <td data-label="Nro">${contador}</td>
            <td data-label="Profesor" class="alignIzquierda">${profesor}</td>
            <td data-label="Descripción" class="alignIzquierda">${descripcion}</td>
            <td data-label="Fecha registro">${fecharegistro}</td>
            <td data-label="Fecha límite">${fechalimite}</td>
            <td data-label="Ver">
                <button id="practico${codpractico}">
                    <img src="images/ver.svg" height="50px" alt="icono">
                </button>
            </td>
            <td data-label="Presentaciones">
                <button id="presentacion${codpractico}">
                    <img src="images/icon-examen.svg" height="50px" alt="icono">
                </button>
            </td>
        </tr>`);
        contador++;

        document.getElementById(`practico${codpractico}`).onclick = () => {
            verPractico(`${codpractico}`);
        }
        
        document.getElementById(`presentacion${codpractico}`).onclick = () => {
            verPresentacion(`${codpractico}`);
        }
    });

    $(".contenedor-table-general").css("display","block");
}

function imagenExtension(extension) {
    let imageSrc;
    switch (extension) {
        case "pdf":
            imageSrc = "images/pdf.png";               
            break;
        case "ppt":
        case "pptx":
            imageSrc = "images/point.png";               
            break;
        case "doc":
        case "docx":
            imageSrc = "images/icono-docx.png";               
            break;
        case "xls":
        case "xlsx":
            imageSrc = "images/excel.png";               
            break;
        case "pdf":
            imageSrc = "images/pdf.png";               
            break;
        case 'jpg':
        case 'JPG':
        case 'png':
        case 'jpeg':
        case 'JPEG':
        case 'svg':
            imageSrc = "images/icono_img.svg";
            break;
        default:
            imageSrc = "";
            break;
    }
    return imageSrc;
}



