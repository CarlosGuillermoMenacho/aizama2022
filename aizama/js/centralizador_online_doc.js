import * as peticion from "./peticion_adm_cpm.js";
let listaCursos = [];
$(document).ready( ()=> {
$.post("obtener_curso_json.php?op=cp",function(respuesta){
  var jsonDataCursos = JSON.parse(respuesta);
    if (jsonDataCursos['status'] == 'ok') {
        listaCursos = jsonDataCursos['cursos'];
        for (let i = 0; i < listaCursos.length; i++) {
          var cursos = listaCursos[i]['nombre']; 
          $("#seleccionar_Curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
      }

  }
  if(respuesta=='eSession') {
    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
  }

}); 
$("#seleccionar_Curso").change( async () =>{
	let index = $("#seleccionar_Curso").val();
	if(index != "" && index != 0){
		 let request = await peticionBoletin(listaCursos[index - 1].codcur,listaCursos[index - 1].codpar);
		 const JSON_DATA = JSON.parse(request);
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
	}
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