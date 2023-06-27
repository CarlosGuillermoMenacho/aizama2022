/* Variables */
let listaCursos;
let curso;
let paralelo;
let nivel;

$.post("obtener_curso_json.php?op=cp",function(respuesta){

  var jsonDataCursos = JSON.parse(respuesta);

	if (jsonDataCursos['status'] == 'ok') {     

			listaCursos = jsonDataCursos['cursos'];

			for (let i = 0; i < listaCursos.length; i++) {    

				var cursos = listaCursos[i]['nombre']; 

				$("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');

      }

  }

  if(respuesta=='eSession') {

    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

    location.href ="http://www.aizama.net/aizama/docentes.php";

    return false;

  }

});
const obtener_notas = (codcur,codpar)=>{
	$.post(
		'boletin_json.php?op=materia',
		{codcur:codcur,codpar:codpar},
		data =>{
			if (data == "eSession") {
				Swal.fire('La sesión ha finalizado...');
				location.href = 'docentes.php';
				return;
			}

			const JSON_DATA = JSON.parse(data);

			switch(JSON_DATA['status']){
				case 'eSession':
					Swal.fire('La sesión ha finalizado...');
					location.href = 'docentes.php';
					break;

				case 'ok':
					mostrarTablaBoletin( JSON_DATA['header'], JSON_DATA['row'] );
					break;
			}
		},
		"text"
	).fail();
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

        const div = document.createElement('div');
        div.textContent = header[i];
        div.style = "text-align:left;writing-mode: vertical-lr; transform: rotate(180deg);";
        th.appendChild(div);

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
const generar_notas = (codcur,codpar)=>{
	$.post(
		'controlador/boletin_controlador.php?op=generar_notas',
		{codcur:codcur,codpar:codpar},
		data =>{
			if(data == 'eSession'){
				Swal.fire('La sesión ha finalizado...');
				location.href = 'docentes.php';
				return;
			}

			if (data == 'ok') {
				obtener_notas(codcur,codpar);
			}
		}
	).fail();

}
$(document).ready(function() {					    

	

	$("#seleccionar_curso").change(function(){
		if( $('#seleccionar_curso').val() != 0 ) {
				$(".contenedor-table-general").removeClass('active');
				$(".contenedor-table-filtrada").removeClass('active');

				index 	 = $('#seleccionar_curso').val();

				curso 	 = listaCursos[index-1]['codcur'];

                paralelo = listaCursos[index-1]['codpar'];

				nivel    = listaCursos[index-1]['codniv'];

				obtener_notas(curso,paralelo);
				$('#btn_generar_notas').css('display','block');
				$(".contenedor-tabla").css('display','block');

        } else {
        	$('#btn_generar_notas').css('display','none');
            $(".contenedor-tabla").css('display','none');

        }

	});


	$("#btn_generar_notas").click(function() {
   		generar_notas(curso,paralelo);

	});



});