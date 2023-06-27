import {obtenerCurso, obtenerParalelos, obtenerMaterias} from "./peticion_adm_cpm.js";
import {cargarCursos, cargarParalelos, cargarMaterias, obtenerNivel} from "./peticion_adm_cpm.js";

/* Variables */
let listaCursos = [];
let listaParalelos = [];
let listaMaterias = [];
let listaMaterialApoyo=[];


$(document).ready(function(){
    let nivelCurso;
    listaCursos=obtenerCurso();
    listaParalelos=obtenerParalelos();
    listaMaterias=obtenerMaterias();
    cargarCursos(listaCursos);

    $("#seleccionar_Curso").change(function(){
        $('#seleccionar_Paralelo').html(`<option value="0" >-- Selecionar paralelo --</option>`)
        $('#seleccionar_Materia').html(`<option value="0" >-- Seleccionar materia --</option>`);
        $('.contenedor-table-general').css("display", "none");
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
        $('.contenedor-table-general').css("display", "none");
        if ( $("#seleccionar_Paralelo").val() !=0 ) {
            cargarMaterias(listaMaterias, nivelCurso);
        } else {
            $('#seleccionar_Materia').html(`<option value="0" >-- Seleccionar materia --</option>`);
        }
    });

    $("#seleccionar_Materia").change( function()  {
        $('.contenedor-table-general').css("display", "none");
        if ( $("#seleccionar_Materia").val() !=0 ) {
            let codigoCurso=$("#seleccionar_Curso").val();
            let codigoParalelo=$("#seleccionar_Paralelo").val();
            let codigoMateria=$("#seleccionar_Materia").val();
            peticion( codigoCurso,codigoParalelo,codigoMateria );
        
        } else {

        }
    });


});

/* Funciones */
function peticion(curso,paralelo,materia ){
    let datosEnviar=new FormData();
    datosEnviar.append("codcur",curso);
    datosEnviar.append("codpar",paralelo);
    datosEnviar.append("codmat",materia);

    /* peticion */
    const url = "material_json.php?op=gmadm";
    fetch( url, {
            method: "POST",
            body: datosEnviar
        }).then( resolve =>  {
            return resolve.json();
        }).then( response => {
            console.log(response);
            const { status, materiales } = response;
            if (status === 'ok') {
                listaMaterialApoyo = materiales;
                mostrarTabla();
                $('.contenedor-table-general').css("display", "block");
            } else if ( status === 'noMaterial' ) {
                alert('No hay material de apoyo');
                $('.contenedor-table-general').css("display", "none");
            }
        }).catch( ()=> {
            console.log("Error en la peticion");
        });
    

}

/* Funciones */
function mostrarTabla(){
    let count=1;
    $("#campos").children().remove();
    listaMaterialApoyo.forEach(material =>{
        const{ titulo, descripcion, fecha, hora, archivo, tipo_material }=material;
        let imgSrc = getImage(tipo_material);
        $("#campos").append(`<tr>
            <td data-label="Nro">${count}</td>
            <td data-label="Título">${titulo}</td>
            <td data-label="Descripción">${descripcion}</td>
            <td data-label="Fecha">${fecha}</td>
            <td data-label="Hora">${hora}</td>
            <td data-label="Material"> 
                <a href="${archivo}" target="_blank">
                    <img src="${imgSrc}" height="50px">
                </a>
            </td>
        </tr>`)
        count++;
    })
}

const getImage = (tipo) => {
    let src;
    switch(tipo) {
        case "1":
            src = 'images/pdf.png';
            break;
        case "2":
            src = 'images/icono-docx.png';
            break;
        case "3":
            src = 'images/point.png';
            break;
        case "4":
            src = 'images/excel.png';
            break;
        case "5":
            src = 'images/icon_video.svg';
            break;
        case "6":
            src = 'images/musica.svg';
            break;
        case "7":
            src = 'images/icono_img.svg';
            break;
        case "8":
            src = 'images/icon-web.svg';
            break;
        default:
            break;
    }
    return src;
}


