import * as peticion from "./peticion_adm_cpm.js";
$(document).ready( ()=> {
    const LISTA_CURSOS = peticion.obtenerCurso();
    peticion.cargarCursos(LISTA_CURSOS);
    $('#seleccionar_Curso').change( ()=> {
        $('.contenedor-tabla').css('display', 'none');            
        if( $('#selecionar_Curso').val() != 0 ) {
            const LISTA_PARALELOS = peticion.obtenerParalelos();
            peticion.cargarParalelos(LISTA_PARALELOS);
            $('#select2-seleccionar_Paralelo-container').text("-- Seleccionar paralelo --");
            $('#seleccionar_Paralelo').val("0");        
        }; 
    });
    $('#seleccionar_Paralelo').change( async ()=> {
        $('.contenedor-tabla').css('display', 'none');
        if( $('#selecionar_Curso').val() != "0" && $('#selecionar_Paralelo').val() != "0" ) {
            
            try {
                const RESPUESTA_SERVIDOR = await peticionBoletin($('#seleccionar_Curso').val(), $('#seleccionar_Paralelo').val());
                if( RESPUESTA_SERVIDOR == "eSession" ) {
                    alert('La session ha expirado por favor vuelva a ingresar con sus datos');
                    return;
                } 
                const JSON_DATA = JSON.parse(RESPUESTA_SERVIDOR);
                switch ( JSON_DATA['status'] ) {
                    case 'eSession':
                        alert('La session ha expirado por favor vuelva a ingresar con sus datos');
                        break;
                    case 'sinMaterias':
                        alert('Este curso no tiene materias o alumnos');
                        break;
                    case 'ok': 
                        mostrarTablaBoletin( JSON_DATA['header'], JSON_DATA['row'] );
                        $('.contenedor-tabla').css('display', 'block');
                        break;
                    default:
                        alert('Ocurrio un erro comuniquese con soporte');
                        break;
                }
            } catch (error) { throw new Error(error); }
        }; 
    });
    
});

function peticionBoletin(curso, paralelo) {
    const FORM_DATA = new FormData();
    FORM_DATA.append('codcur', curso);
    FORM_DATA.append('codpar', paralelo);
    const URL = "controlador/boletin_controlador.php?op=get_notas_to_centralizador";
    return new Promise( (resolve, reject) => {
        const XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function () { 
            if (XHR.readyState == 4) {
                if(XHR.status == 200)
                    resolve(XHR.responseText);
                else
                    reject("ocurrio un error comuniquese con soporte");
            }
        }
        XHR.open('POST', URL);
        XHR.send(FORM_DATA);
    });
} 
function mostrarTablaBoletin(header, row) {
    const CONTAINER = document.querySelector('.contenedor-tabla');
    const TEMPLATE = document.querySelector('#templateTable');
    const FRAGMENT = document.createDocumentFragment(); 
    /* Header */
    const THEAD = TEMPLATE.content.querySelector('#headerTablaBoletin');
    let htmlHead = "<th>Nro</th> <th>Alumno</th>";
    for( let i = 0; i < header.length; i++ ) {
        const th = document.createElement('th');
        th.innerHTML = `<div class="vertical">${header[i]}</>`;
        //th.textContent = header[i];
        htmlHead += th.outerHTML;
    }  
    THEAD.innerHTML = htmlHead; 
    /* Row */
    const TBODY = TEMPLATE.content.querySelector('#filasTablaBoletin');
    let htmlRow = "";
    for( let i = 0; i < row.length; i++ ) {
        const tr = document.createElement('tr');
        llenarFilaTabla(tr, row[i]);
        htmlRow += tr.outerHTML;
    }
    TBODY.innerHTML = htmlRow;

    const TEMPLATE_CLONE = document.importNode(TEMPLATE.content, true);
    FRAGMENT.appendChild(TEMPLATE_CLONE);
    const div = document.createElement('div');
    div.appendChild(FRAGMENT);
    CONTAINER.innerHTML = div.innerHTML;

    /* Evento del boton para exportar a excel */
    document.querySelector('#exportarExcel').addEventListener( 'click', ()=> {
        const tableExport = new Table2Excel();
        tableExport.export(document.querySelector("#tableExcel"));
    });
}

function llenarFilaTabla(container, row) {
    for (let i = 0; i < row.length; i++) {
        const td = document.createElement('td');
        td.textContent = row[i];
        container.appendChild(td);
    }
}