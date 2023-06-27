/* Variables */

var listaCursos;

var listaMaterias;

var index; 	

var curso; 	

var paralelo;

var nivel;

var listaAlumnos;

let lista_notas = [];

function obtenerNotas() {

    var notaAlumnos = [];

    for(let i=0; i < listaAlumnos.length; i++) {

        let codigoAlumno = listaAlumnos[i]['codigo'];

        let nota = $('#nota'+(i+1)).val();

        console.log(nota);

        let notaAlumno = { 'codigo':codigoAlumno  , 'nota':nota }

        notaAlumnos.push(notaAlumno);

    }

    return notaAlumnos;

}



function guardarNota(nivel) {

    let nivelCurso     = nivel;

    let codigoMateria  = $('#seleccionar_materia').val();

    let notas = obtenerNotas();

    console.log(notas);

    let respuesta = "";

    if(nivelCurso != '1') {

        respuesta =$.ajax({

                         type:"POST",

                         url:'get_notas.php?op=saveListNota',

                         data:{

                             materia:codigoMateria,

                             lista:JSON.stringify(notas),

                             codpar:paralelo

                         },

                         async:false

                        }).responseText;

    } else {

        respuesta =$.ajax({

                         type:"POST",

                         url:'get_notas_ini.php?op=saveListNota',

                         data:{

                             materia:codigoMateria,

                             lista:JSON.stringify(notas),

                             codpar:paralelo

                         },

                         async:false

                        }).responseText;

    }

    if(respuesta == 'ok') {

        alert('Notas guardadas exitosamente!');

    } else {

        $.get(

 			`whatsapp_msg.php?phone=59177367545&text=${respuesta}`

 			)

	.fail((xhr,status,error)=>{

		 					alert(`No se pudo conectar con el servidor...\n${error}`);

		 					console.log(error);

		 				});

        alert('Error no se pudo guardar las notas');

    }

}
const get_nota = codalu => {

	for (var i = 0; i < lista_notas.length; i++) {
		if(lista_notas[i].codalu == codalu)return lista_notas[i].nota_final;
	}
	return "";
}
const copiar = (nota,ele)=>{
	$(`#${ele}`).val(nota);
}
function mostrarAlumnos() {

    $(".contenedor-table-general tbody").children().remove();

    $(".contenedor-table-filtrada tbody").children().remove();

	$(".contenedor-table-general").addClass('active');

	for (var i = 0; i < listaAlumnos.length; i++)  {

	    var nombre = listaAlumnos[i]['nombre'];	

	    var nota   = listaAlumnos[i]['nota'];

	    let nota_cuaderno = get_nota(listaAlumnos[i].codigo);
	    if(nota == null) {

	        nota = '';

	    }

	    $('#campos').append(

	        `<tr>

	            <td data-label="Nro">${(i+1)} </td>

	            <td data-label="Nombre">${nombre}</td>

	            <td data-label="Nota"> 

	                <input style="" id="nota${(i+1)}" type="number" placeholder="Pts" min="0" max="100" value="${nota}">

                </td>
                <td data-label="Nota"> 

	                ${nota_cuaderno}

                </td>
                <td data-label="Nota"> 

	                <button class="btn" style="cursor:pointer;" onclick="copiar(${nota_cuaderno},'nota${(i+1)}')">Copiar</button>

                </td>
	         </tr>`    

        );

	}

}

function mostrarAlumnos_inicial() {

	$(".contenedor-table-general").removeClass('active');

    $(".contenedor-table-general tbody").children().remove();

    $(".contenedor-table-filtrada tbody").children().remove();

	$(".contenedor-table-filtrada").addClass('active');

	for (var i = 0; i < listaAlumnos.length; i++)  {

	    var nombre = listaAlumnos[i]['nombre'];	

	    var nota   = listaAlumnos[i]['nota'];

	    if(nota == null) {

	        nota = '';

	    }

	    $('.contenedor-table-filtrada #campos').append(

	        `<tr>

	            <td data-label="Nro">${(i+1)} </td>

	            <td data-label="Nombre">${nombre}</td>

	            <div class="nota_textarea">

    	            <td data-label="Nota Literal" class="nota-literal" style="padding:24px 15px"> 

    	                <textarea id="nota${(i+1)}" placeholder="Nota Literal" rows="5" cols="30" maxlength="250" style="width:100%;" >${nota}</textarea>

                    </td>

	            </div>

	            

	         </tr>`    

        );

	}

}



function alumnos(){

    if( $('#seleccionar_materia').val() != 0 ) {

        var codMateria = $('#seleccionar_materia').val();	

    	var bim = $('#bimestre').val();

    	var html=$.ajax({

    						type:"POST",

    						url:'get_notas.php?op=lista',

    						data: { 

    								 materia:codMateria,

    								 codpar: paralelo,

    								 curso:curso,

    								 bimestre:bim

    							   },

    						async:false

    					}).responseText;

    	if(html == 'NoResult') {

            alert('No hay alumnos para este curso');

    	} else {

     	    listaAlumnos = JSON.parse(html);

    	    mostrarAlumnos();

    	}

    } else {

        $(".contenedor-table-general").removeClass('active');

		$(".contenedor-table-filtrada").removeClass('active');  

    }

	

}

function alumnos_inicial(){

    if( $('#seleccionar_materia').val() != 0 ){

        var codMateria = $('#seleccionar_materia').val();	

	    var bim = $('#bimestre').val();

    	var html=$.ajax({

						type:"POST",

						url:'get_notas_ini.php?op=lista',

						data:{

									materia:codMateria,

									curso:curso,

									codpar: paralelo,

									bimestre:bim

									}

						,async:false

					}).responseText;

		if(html == 'NoResult') {

	        alert('No hay alumnos para este curso');

	    } else {

     	    listaAlumnos = JSON.parse(html);

     	    mostrarAlumnos_inicial();

    	}

    } else {

        $(".contenedor-table-general").removeClass('active');

		$(".contenedor-table-filtrada").removeClass('active');   

    }

	

	

}
async function get_cuaderno (codcur,codpar,codmat){
	await $.post(
		"controlador/cuaderno_pedagogico_controlador.php?op=get_cuaderno_doc",
		{codcur:codcur,codpar:codpar,codmat:codmat},
		data => {
			if (data.status == "ok") {
				lista_notas = data.lista.lista_notas;

			}
		},"json"
	)
}


async function mostrarTabla(nivel) {

	let nivelCurso = nivel;

	if (nivelCurso != '1' ) {
		let codcur = listaCursos[$("#seleccionar_curso").val() - 1]["codcur"];
		let codpar = listaCursos[$("#seleccionar_curso").val() - 1]["codpar"];
		let codmat = $("#seleccionar_materia").val();
		await get_cuaderno(codcur,codpar,codmat);
		alumnos();

	} else {

		alumnos_inicial();

	}

	

}

/* Otiene las materias que le pertenecen a ese profesor */

function obtenerMaterias(curso, paralelo) {

	$("#seleccionar_materia").empty();

	$("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');

	for(var i = 0 ; i < listaMaterias.length; i++) {

			if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){

          $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');

			}

    }

}



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



$.post("obtener_materias_json.php?op=getmatprof",function(respuesta){

  var jsonDataMaterias = JSON.parse(respuesta);

    if (jsonDataMaterias['status'] == 'ok') {

        listaMaterias = jsonDataMaterias['materias'];

    }



    if(respuesta=='eSession') {

        alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

        location.href ="http://www.aizama.net/aizama/docentes.php";

        return false;

    }

});
const copiar_todo = () => {
	let c = 1;
	listaAlumnos.forEach(a =>{
		$(`#nota${c}`).val(get_nota(a.codigo));
		c++;
	})
}


$(document).ready(function() {					    


	$("#seleccionar_curso").change(function(){

		if( $('#seleccionar_curso').val() != 0 ) {

				$(".contenedor-table-general").removeClass('active');

				$(".contenedor-table-filtrada").removeClass('active');

				index 	 = $('#seleccionar_curso').val();

				curso 	 = listaCursos[index-1]['codcur'];

                paralelo = listaCursos[index-1]['codpar'];

				nivel    = listaCursos[index-1]['codniv']

                obtenerMaterias(curso, paralelo);

        } else {

            $(".contenedor-table-general").removeClass('active');

			$(".contenedor-table-filtrada").removeClass('active');

			$('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');

        }

	});



	$("#seleccionar_materia").change(function(){

		if( $('#seleccionar_curso').val() != 0 ) {

			$(".contenedor-table-general").removeClass('active');

			$(".contenedor-table-filtrada").removeClass('active');

			mostrarTabla(nivel);

		} 

	});

	

	$(".btn_grabarNota").click(function() {

        guardarNota(nivel);	    

	});



});