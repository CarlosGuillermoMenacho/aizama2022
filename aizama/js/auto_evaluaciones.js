var listaCursos;

var listaMaterias;

var index; 	

let curso; 	

let paralelo;

var nivel;

var listaAlumnos;

let lista_auto_evaluaciones = [];

let lista_notas = [];

let autoevaluacion_selected;
/* Otiene las materias que le pertenecen a ese profesor */

function obtenerMaterias() {

	//$("#seleccionar_materia").empty();

	//$("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');

	$(".contenedor-table-general").addClass('active');

	$(".contenedor-table-general tbody").children().remove();

	let index = 1;

	for(var i = 0 ; i < listaMaterias.length; i++) {

			if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){

          //$("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');

            let files_date = existe_autoevaluacion(curso,paralelo,listaMaterias[i].codmat);
            console.log(files_date)
            let check = "";
            let filedate = "";
            let btn  = "";
            if(files_date[0]!=""){
                if(files_date[0]=="NoFile"){
                    filedate = `Sin PDF`;
                }else{
                    filedate = `<a href="autoevaluaciones/${files_date[0]}" target="_blank">

                                <img src="${files_date[2]}" width = "60px"/>

                            </a>`;
                }
                check = `<input id="deci${(i+1)}" type="checkbox" ${files_date[1]} onclick="set_visible(this,${curso},${paralelo},'${listaMaterias[i].codmat}')">`;
                

                btn = `<button class="btn-revisar" onclick="revisar(${files_date[3]});">Revisar</button>`;
            }

           $('#campos').append(

	        `<tr>

	            <td data-label="Nro">${index} </td>

	            <td data-label="Materia">${listaMaterias[i].nombre}</td>

	            <td data-label="Cargar" class="cargar"> 

	                <input id="nota${(i+1)}" type="file" name="nota${(i+1)}">

                </td>
                <td>
                    <button class="btnCargar" onclick="guardar('nota${i+1}',${curso},${paralelo},'${listaMaterias[i].codmat}')">CREAR</button>
                </td>

                <td data-label="Evaluaci&oacute;n"> 

                    ${filedate}

                </td>

	            <td data-label="Visible"> 

	                ${check}

                </td>
                <td>
                    ${btn}
                </td>

	         </tr>`    

        );

        index++;

			}

    }
    $('#formulario2').addClass('oculto');
    $('#formulario').removeClass('oculto');


}
const revisar = autoEval =>{
    autoevaluacion_selected = autoEval;
    $.post(
            'controlador/auto_evaluaciones_controlador.php?op=get_lista_autoevaluaciones&usr=doc',
            {codeva:autoEval},
            data => {
                if(data.status == "eSession"){
                    location.href = "docentes.php";
                }
                if(data.status == "ok"){
                    lista_notas = data.lista;
                    mostrarNotas();
                }
            },
            "json"
          );
}
const mostrarNotas = () =>{
    $('#campos2').empty();
    let index = 1;
    lista_notas.forEach(fila =>{
        $('#campos2').append(
                            `<tr>
                                <td>
                                    ${index}
                                </td>
                                <td>
                                    ${fila.nombre}
                                </td>
                                <td>
                                    <input name="input_ser" type="number" min = "1" max="5" value="${fila.ser}">
                                </td>
                                <td>
                                    <input name="input_decidir" type="number" min = "1" max="5" value="${fila.decidir}">
                                </td>
                            </tr>`
                            );
        index++;
    });
    $('#formulario').addClass('oculto');
    $('#formulario2').removeClass('oculto');
}
const set_visible = (e,codcur,codpar,codmat)=>{

    $.post(

            "controlador/auto_evaluaciones_controlador.php?op=set_visible&usr=doc",

            {codcur:codcur,codpar:codpar,codmat:codmat,visible:e.checked},

            data => {

              if(data == "ok"){

                  if(e.checked){

                      Swal.fire("La autoevaluaci&oacute;n ahora est&aacute; visible para los estudiantes...!!!");

                  }else{

                      Swal.fire("La autoevaluaci&oacute;n ya no est&aacute; visible para los estudiantes...!!!");

                  }

              }else{

                  Swal.fire("Debe seleccionar un archivo en formato pdf...!!!");

                  e.checked = false;

              }

          },

          "text"

          );

          

}

const existe_autoevaluacion = (codcur,codpar,codmat)=>{

    for(let i = 0; i < lista_auto_evaluaciones.length; i++){

        if(lista_auto_evaluaciones[i].codcur == codcur && 

           lista_auto_evaluaciones[i].codpar == codpar && 

           lista_auto_evaluaciones[i].codmat == codmat){

               if(lista_auto_evaluaciones[i].visible == "1")return [lista_auto_evaluaciones[i].file,"checked","images/pdf.png",lista_auto_evaluaciones[i].id];

               return [lista_auto_evaluaciones[i].file,'',"images/pdf.png",lista_auto_evaluaciones[i].id];

               

           }

    }

    return ["","","",""];

}

const guardar = (element,codcur,codpar,codmat)=>{

    /*if($(`#${element}`).val()===""){

        alert("Debe seleccionar un archivo pdf...!!!");

        return;

    }*/

    let formdata = new FormData($("#formulario")[0]);

    formdata.append("codcur",codcur);

    formdata.append("codpar",codpar);

    formdata.append("codmat",codmat);

    formdata.append("file",element);

    html=$.ajax({

            url:"controlador/auto_evaluaciones_controlador.php?op=save&usr=doc",

            type: "POST",

            data:formdata,

            contentType: false, 

            processData: false,

            async:false}).responseText;

    if(html == "ok"){

        Swal.fire('Se ha guradado la autoevaluaci&oacute;n...!!!');

        obtener_autoevaluaciones2();

        

    }

    

}

function mostrarTabla(nivel) {

	/*let nivelCurso = nivel;

	if (nivelCurso != '1' ) {

		alumnos();

	} else {

		alumnos_inicial();

	}*/

}

const obtener_autoevaluaciones2 = ()=> {

   $.post("controlador/auto_evaluaciones_controlador.php?op=get_autoevaluaciones&usr=doc",

          data => {

              if(data.status == "ok"){

                  lista_auto_evaluaciones = data.lista;

                  obtenerMaterias();

              }

          },

          "json"

          ); 

}

const obtener_autoevaluaciones = ()=> {

   $.post("controlador/auto_evaluaciones_controlador.php?op=get_autoevaluaciones&usr=doc",

          data => {

              if(data.status == "ok"){

                  lista_auto_evaluaciones = data.lista;

              }

          },

          "json"

          ); 

}
const actualizar = ()=>{
    let formdata = new FormData($('#formulario2')[0]);
    formdata.append("lista",JSON.stringify(lista_notas));
    let input_ser = document.getElementsByName('input_ser');
    let input_decidir = document.getElementsByName('input_decidir');
    let index = 0;
    input_ser.forEach(fila =>{
        lista_notas[index].ser_ac = fila.value;
        lista_notas[index].decidir_ac = input_decidir[index].value;
        index++;
    });
    $.post(
            'controlador/auto_evaluaciones_controlador.php?op=actualizar&usr=doc',
            {lista:JSON.stringify(lista_notas),codeva:autoevaluacion_selected},
            data=>{
                if (data == "ok") {
                    revisar(autoevaluacion_selected);
                    Swal.fire('Notas actualizadas...!!!');
                }
                if (data == 'eSession') {
                    location.href = 'docentes.php';
                }
                if (data == 'errorNota') {
                    Swal.fire('No se actualizó...\nLas notas deben ser entre 1 y 5 puntos...!!!')
                }
            },
            "text"
            );
}

$(document).ready(function() {
    $('#formulario').submit(e=>{e.preventDefault()});
    $('#formulario2').submit(e=>{e.preventDefault()});

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

    obtener_autoevaluaciones();
    $('#btn-atras').click(()=>{obtenerMaterias();})
    $('#btn-actualizar').click(()=>{actualizar()});
	$("#seleccionar_curso").change(function(){

		if( $('#seleccionar_curso').val() != 0 ) {

				$(".contenedor-table-general").removeClass('active');

				index 	 = $('#seleccionar_curso').val();

				curso 	 = listaCursos[index-1]['codcur'];

                paralelo = listaCursos[index-1]['codpar'];

				nivel    = listaCursos[index-1]['codniv']

                obtenerMaterias();

                

        } else {

            $(".contenedor-table-general").removeClass('active');

			$('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');

        }

	});

	



	

});