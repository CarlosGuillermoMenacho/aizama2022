/* Variable */

var listaCursos;

var listaMaterias;

var jsonDataListaClass;



var paralelo1;

var curso1;

var lista=[];

var lista2=[];

var dominio = 'https://www.aizama.net';

var fecha1 ;

var hora_i1 ;

var hora_f1 ;

var titl1  ;

var descrip1 ;

var lista_celulares = [];

var nombre_curso='';

var nombre_materia;

var curso22;

var paralelo22;

/* Funciones */

function obtenerContactos (codalu){



    let lista2 = [];



    console.log(lista_celulares);



    lista_celulares.forEach((celular)=>{



        if(celular.codalu==codalu){



            lista2.push(celular.celular);



        }



        



    });



    return lista2;



}

function obtenerCelulares(curso,paralelo){

    curso22 = curso;

    paralelo22=paralelo;

    $.post(



            "data_agenda.php?op=obtener_tutores_cel",



            {codcur:curso,codpar:paralelo},



            (datos,estado,xhr)=>{



                let status = datos.status;



                if(status=="ok"){



                    lista_celulares = datos.lista;



                    return;



                }



            },



            "json"



        );



    



}

function  obtenerClass () {

    var formData = new FormData($("#formulario")[0]);

    var html=$.ajax({

    url:"programar_clase_virtual.php?op=cvp",

    type: "POST",

    data: formData,

    contentType: false,

    processData: false,

    async:false}).responseText;

    

    if (html == 'noClases') {

    jsonDataListaClass = '';

    Swal.fire('No existe clases asignadas para este curso');



    

    return false;

    } else {

      var jsonData = JSON.parse(html);

      if( jsonData['status'] == 'ok'  ) {

        jsonDataListaClass = jsonData['lista'];

        return true;

        }else{

            jsonDataListaClass = '';

        }

    return false;

 }

}

function mostrarDatosTabla() {

    $(".contenedor-table-general tbody").children().remove();

  if (obtenerClass()) {

    $(".contenedor-table-filtrada").removeClass('active');

    var tabla = document.querySelector(".contenedor-table-general");

    tabla.classList.add("active");

    for (var i = 0; i < jsonDataListaClass.length; i++) {

        var codigoMateria = jsonDataListaClass[i]['codMat'];

        var dataCampoId = jsonDataListaClass[i]['id'];

        var dataCampoTitulo = jsonDataListaClass[i]['titulo'];

        var dataCampoDescripcion = jsonDataListaClass[i]['descripcion'];

        var dataCampoFecha = jsonDataListaClass[i]['fecha'];

        var dataCampoHoraInicio = jsonDataListaClass[i]['horaIni'];

        var dataCampoHoraFin = jsonDataListaClass[i]['horaFin'];

        var dataCampoMateria = jsonDataListaClass[i]['materia'];

        var dataCampoLink = jsonDataListaClass[i]['link'];

        



        $('#campos').append('<tr>');

        $('#campos').append('<td data-label="Nro">' + (i+1) + '</td>');

        $('#campos').append('<td data-label="Titulo">' + dataCampoTitulo + '</td>');

        $('#campos').append('<td data-label="Descripcion">' + dataCampoDescripcion + '</td>');

        $('#campos').append('<td data-label="Fecha">' + dataCampoFecha + '</td>');

        $('#campos').append('<td data-label="Hora-Inicio">' + dataCampoHoraInicio + '</td>');

        $('#campos').append('<td data-label="Hora-Fin">' + dataCampoHoraFin + '</td>');

        $('#campos').append('<td data-label="Materia">' + dataCampoMateria + '</td>');

        

        /* Icono ver */

        $('#campos').append('<td data-label="Ver">' + '<a href="'+dataCampoLink+'" target="_blank">      <img src="images/ver.svg" alt="Icono ver" height="50px"> </a>' + '</td>');

        /* Icono editar */

        $('#campos').append('<td data-label="Editar">' + '<button onclick="editarFila(\'' + codigoMateria + '\', '+ dataCampoId+' )"> <img src="images/edit.svg" alt="Icono editar" height="50px"> </button>' + '</td>');

        

        /* Icono eliminar */

        $('#campos').append('<td data-label="Eliminar">' + '<button onclick="eliminarFila('+ dataCampoId +')" > <img src="images/delete.svg" alt="Icono eliminar" height="50px"> </button>' + '</td>');

        $('#campos').append('</tr>');

    }

  }else{

        $('.contenedor-table-general').removeClass('active');

        $('.contenedor-table-filtrada').removeClass('active');

  }

}



function mostrarDatosTablaFiltrada() {

  var count = 0;

  var tabla = document.querySelector(".contenedor-table-filtrada");

    if( $('#seleccionar_materia').val() != 0 ){

        if(jsonDataListaClass!=''){

            $(".contenedor-table-filtrada tbody").children().remove();

            $('.contenedor-table-general').removeClass('active');

            tabla.classList.add("active");

            count = 1;

            for (var i = 0; i < jsonDataListaClass.length; i ++) {

                if( $('#seleccionar_materia').val() == jsonDataListaClass[i]['codMat']) {

                    var codigoMateria = jsonDataListaClass[i]['codMat'];

                    var dataCampoId = jsonDataListaClass[i]['id'];

                    var dataCampoTitulo = jsonDataListaClass[i]['titulo'];

                    var dataCampoDescripcion = jsonDataListaClass[i]['descripcion'];

                    var dataCampoFecha = jsonDataListaClass[i]['fecha'];

                    var dataCampoHoraInicio = jsonDataListaClass[i]['horaIni'];

                    var dataCampoHoraFin = jsonDataListaClass[i]['horaFin'];

                    var dataCampoLink = jsonDataListaClass[i]['link'];

                    $('.contenedor-table-filtrada #campos').append('<tr>');

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Nro"> '+count+'</td>');

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Titulo">' + dataCampoTitulo + '</td>');

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Descripcion">' + dataCampoDescripcion + '</td>');

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Fecha">' + dataCampoFecha + '</td>');

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Hora-Inicio">' + dataCampoHoraInicio + '</td>');

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Hora-Fin">' + dataCampoHoraFin + '</td>');

                    

                    /* Icono ver */

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Ver">' + '<a href="'+dataCampoLink+'" target="_blank">      <img src="images/ver.svg" alt="Icono ver" height="50px"> </a>' + '</td>');

                    /* Icono editar */ 

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Editar">' + '<button onclick="editarFila(\'' + codigoMateria + '\', '+ dataCampoId+')"> <img src="images/edit.svg" alt="Icono editar" height="50px"> </button>' + '</td>');

                    /* Icono eliminar */

                    $('.contenedor-table-filtrada #campos').append('<td data-label="Eliminar">' + '<button onclick="eliminarFila('+ dataCampoId +')" > <img src="images/delete.svg" alt="Icono eliminar" height="50px"> </button>' + '</td>');

                    

                    $('.contenedor-table-filtrada #campos').append('</tr>');

                    count++;

                }

            }

        }else{

            $('.contenedor-table-general').removeClass('active');

            $('.contenedor-table-filtrada').removeClass('active');

        }

    } else {

          $('.contenedor-table-filtrada').removeClass('active');

          mostrarDatosTabla();

          $('.contenedor-table-general').addClass('active'); 

    }

}





function obtenerCursos(curso, paralelo){

    $("#seleccionar_materia").empty();

    $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');

    for(var i = 0 ; i < listaMaterias.length; i++) {

        if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){

          $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');

        }

    }

    

}



function loadingData(id) {

 for(var i=0; i< jsonDataListaClass.length; i++) {

     if(jsonDataListaClass[i]['id'] == id )  {

         $('#titulo').val(jsonDataListaClass[i]['titulo']); 

         $('#enlace').val(jsonDataListaClass[i]['link']); 

         $('#fecha').val(jsonDataListaClass[i]['fecha']);

         $('#hora_inicio').val(jsonDataListaClass[i]['horaIni']);

         $('#hora_fin').val(jsonDataListaClass[i]['horaFin']); 

         $('#descripcion').val(jsonDataListaClass[i]['descripcion']);

         $('#id').val(id);

     }

 }

}





function validarCampos () {

  if ( $('#seleccionar_curso').val() != 0 && $('#seleccionar_materia').val() != 0 && /*$('#titulo').val() != '' &&*/$('#enlace').val() != '' && /*$('#descripcion').val() != '' && */$('#fecha').val() != '' && $('#hora_inicio').val() != '' && $('#hora_fin').val() != '') {

    return true;

  }

  return false;

}



function limpiarCampos() {

    $('#titulo').val("");

      $('#enlace').val("");

      $('#descripcion').val("");

      $('#fecha').val("");

      $('#hora_inicio').val("");

      $('#hora_fin').val("");

}





function asignarClase() {



  if (validarCampos()) {

    var formData = new FormData($("#formulario")[0]);

    var enviarDatos = $.ajax({

      url: 'programar_clase_virtual.php?op=program',

      type: 'POST',

      data: formData,

      contentType: false,

      processData: false,

      async: false

    }).responseText;

    

    if (enviarDatos == 'ok') {

      mostrarDatosTabla();

      if($('#seleccionar_materia').val() != 0) {

        mostrarDatosTablaFiltrada();

      }

      cargarLista();

      console.log('GolPrueba');

      console.log($('#titulo').val());

      console.log($('#descripcion').val());

      //cargarListaPrueba();



      limpiarCampos();

      $('#enlace').css("border-color", "#aaa");

      Swal.fire(

        'Grabado con exito',

        'Presione ok para salir',

        'success'

      );

    } else if (enviarDatos == 'errorTime') {

      Swal.fire('Error Datos', 'Verifique la Fecha, Hora Inicio y Hora Fin', 'error');

    } 

    else if(enviarDatos == 'enlaceNoValido'){

      $('#enlace').css("border-color", "red");

      $('#enlace').focus()

      Swal.fire('Error', 'El enlace ingresado no es valido', 'error');



    } else if(enviarDatos == 'noDisponible'){

      Swal.fire('Error', 'Este horario no esta disponible', 'error');

    }else{

        Swal.fire('Error', 'No se pudo registrar, la sesión ha expirado salga y vuelva a ingresar a la plataforma por favor!!!', 'error');

    }



  } else {

    Swal.fire('Faltan datos', 'Por favor rellene todo los campos', 'error');

  }

}

function cargarListaPrueba()

{

	lista2=[];

	$.ajax({

			type:"POST",

			url:"data_agenda.php?op=lista&paralelo="+paralelo1,

			data:"cod_curso=" + curso1,

			success:function(r){

				if(r=='eSession'){

	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

	  				return false;

					}

				var ac="";

				for (var i = 0; i < r.length; i++) {

					if (r[i]!=',') {

						ac=ac+r[i];	

					}else{

						lista2.push(ac);

						ac="";

					} 

				}



				lista2.push(ac);

			//	let fecha = $('#fecha').val();

			//	let hora_i = $('#hora_inicio').val();

			//	let hora_f = $('#hora_fin').val();

				//getmsgallclass("NUEVO Material de apoyo. "+fecha+' - '+hora);

				//getmsgallclass("NUEVO Material de apoyo. ");

			//	let titl = $('#titulo').val();

			//	let descrip = $('#descripcion').val();

            /*    console.log('Goles Prueba');

                console.log($('#fecha').val());

                console.log($('#hora_inicio').val());

                console.log($('#hora_fin').val());

                console.log($('#titulo').val());

                console.log($('#descripcion').val());

*/

                console.log(fecha1);

                console.log(hora_i1);

                console.log(hora_f1);

                console.log(titl1);

                console.log(descrip1);



				getmsgallclassPrueba("pruebaCLASE VIRTUAL: Fecha:"+fecha1+' Hora Desde:'+hora_i1+' Hasta:'+hora_f1+' Titulo:'+titl1+' Desc.:'+descrip1);

				

			}

			});

}



function cargarLista()

{

	lista2=[];

	$.ajax({

			type:"POST",

			url:"data_agenda.php?op=lista&paralelo="+paralelo1,

			data:"cod_curso=" + curso1,

			success:function(r){

				if(r=='eSession'){

	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

	  				return false;

					}

				var ac="";

				for (var i = 0; i < r.length; i++) {

					if (r[i]!=',') {

						ac=ac+r[i];	

					}else{

						lista2.push(ac);

						ac="";

					} 

				}



				lista2.push(ac);

		//		let fecha = $('#fecha').val();

		//		let hora_i = $('#hora_inicio').val();

		//		let hora_f = $('#hora_fin').val();

				//getmsgallclass("NUEVO Material de apoyo. "+fecha+' - '+hora);

				//getmsgallclass("NUEVO Material de apoyo. ");

		//		let titl = $('#titulo').val();

		//		let descrip = $('#descripcion').val();

			

				getmsgallclass("CLASE VIRTUAL: Fecha:"+fecha1+' Hora Desde:'+hora_i1+' Hasta:'+hora_f1+'\n Contenido:\n'+descrip1);

				

			}

			});

}



function validardatos1(){

	if ($('#seleccionar_curso').val()!='' && $('#seleccionar_materia').val()!=0) {

		return true;

	}

	$('#seleccionar_curso').focus();

	return false;

}

function getmsgalu2(id,msg){



            var m = document.getElementById("seleccionar_materia");

            var materia = m.options[m.selectedIndex].value;    



            var c_recibe = id;

            var emite = $('#id_usr').val();

            var msgr = msg;

            

            let nuevo_msg='Curso: '+nombre_curso+' - '+msg;

            let contactos = obtenerContactos(id);

            

            contactos.forEach((contacto)=>{



	        $.get(



	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto



	            );



	        



	    });

    		$.ajax({

                method: "POST",

                url: `${dominio}/agenda/mensajeprof`,

                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),

                contentType: "application/json",

                success:function(data){

                    if(data=="ok"){

                       // alert("Mensaje enviado correctamente gol de todos: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);

                    }else{

                        alert('error');

                    }    

                }

                });



		  	return true;

}



function getmsgallclass(msg){

    console.log(lista2.length);

	if (validardatos1()&&lista2.length>0) {

		console.log(lista2.length);

		for (var i = 0; i < lista2.length; i++) {

			if(!getmsgalu2(lista2[i],msg)){

				alert('Error al enviar mensages,actualizar e intentar nuevamente');	

				return false;

			}



		}

		    //getmsgalu2(2,msg);

		

		    $('#msncurso').val("");

		    $('#msnalu').val("");

		  	alert('Mensajes enviado a los tutores');	

		  	return true;

	}else{

		alert('Debe seleccionar: Curso y Materia o actualizar la página');

		return false;

	}

}

function getmsgallclassPrueba(msg){

    console.log(lista2.length);

	if (validardatos1()&&lista2.length>0) {

		console.log(lista2.length);

	/*	for (var i = 0; i < lista2.length; i++) {

			if(!getmsgalu2(lista2[i],msg)){

				alert('Error al enviar mensages,actualizar e intentar nuevamente');	

				return false;

			}



		}

		    */getmsgalu2(2,msg);

		

		    $('#msncurso').val("");

		    $('#msnalu').val("");

		  	alert('Mensajes enviado a los tutores');	

		  	return true;

	}else{

		alert('Debe seleccionar: Curso y Materia o actualizar la página');

		return false;

	}

}



function actualizarClase() {

    if (validarCampos()) {

        Swal.fire({

          title: 'Estas seguro',

          text: "Se actualizara los datos",

          icon: 'warning',

          showCancelButton: true,

          confirmButtonColor: '#3085d6',

          cancelButtonColor: '#d33',

          confirmButtonText: 'Si',

          cancelButtonText: 'Cancelar'

        }).then((result) => {

          if (result.isConfirmed) {

               $('#asignarMateria').css("display" ,"block");

                $('#actualizarCampos').removeClass('active');

                $('#cancelarActualizacion').removeClass('active');

               var formData = new FormData($("#formulario")[0]);

                var enviarDatos = $.ajax({

              url: 'programar_clase_virtual.php?op=updatecv',

              type: 'POST',

              data: formData,

              contentType: false,

              processData: false,

              async: false

            }).responseText;

            jsonDataListaClass = [];

            if (enviarDatos == 'ok') {

              $('#enlace').css("border-color", "#aaa");

              $('#asignarMateria').css("display" ,"block");

              $('#actualizarCampos').css("display", "none");

              $('#cancelarActualizacion').css("display", "none");

              obtenerClass();

              if($('#seleccionar_materia').val() != 0) {

                mostrarDatosTablaFiltrada();

                limpiarCampos();

              } else {

                mostrarDatosTablaGeneral();

              }

              Swal.fire(

                'Actualizacion con exito',

                'Presione ok para salir',

                'success'

              );

            } else if (enviarDatos == 'errorTime') {

              Swal.fire('Error en los datos', 'Verifique la Fecha, Hora Inicio y Hora Fin', 'error');

              $('#asignarMateria').css("display" ,"block");

              $('#actualizarCampos').css("display", "none");

              $('#cancelarActualizacion').css("display", "none");

              obtenerClass();

              mostrarDatosTablaFiltrada();

            } else if(enviarDatos == 'enlaceNoValido'){

              $('#enlace').css("border-color", "red");

              $('#enlace').focus()

              $('#asignarMateria').css("display" ,"none");

              $('#actualizarCampos').css("display", "block");

              $('#cancelarActualizacion').css("display", "block");

              obtenerClass();

              mostrarDatosTablaFiltrada();

              Swal.fire('Error', 'El enlace ingresado no es valido', 'error');



            }

            else {

              Swal.fire('Error', 'Este horario no esta disponible', 'error');

              $('#asignarMateria').css("display" ,"none");

              $('#actualizarCampos').css("display", "block");

              $('#cancelarActualizacion').css("display", "block");

              obtenerClass();

              mostrarDatosTablaFiltrada();

            }

            

          }

        });

    

        

        

  } else {

      Swal.fire('Faltan campos', 'Por favor llene todos los campos', 'error');

    

  }

}





/* Editar fila */

function editarFila(codigoMateria, id) {

  $('#enlace').css("border-color", "#aaa");

    $('#codmat').val(codigoMateria);

    let select = document.getElementById('seleccionar_materia');

  $('#asignarMateria').css("display" ,"none");

  $('#actualizarCampos').css("display", "block");

  $('#cancelarActualizacion').css("display", "block");  

    for(var i = 0 ; i < select.options.length; i++) {

        if(select.options[i].value == codigoMateria) {

                $('#seleccionar_materia option[value="'+codigoMateria+'"]').prop('selected', true);

               $("#seleccionar_materia").prop('selectedIndex', i);

            document.getElementById('select2-seleccionar_materia-container').innerHTML = select.options[i].textContent;

            mostrarDatosTablaFiltrada();

            

               break;

        }

    }  

    

  

  document.body.scrollTop = 0;

  document.documentElement.scrollTop = 0;

  loadingData(id);

}



function eliminarFila(id) {

  $('#enlace').css("border-color", "#aaa");

Swal.fire({

  title: 'Estas seguro',

  text: "Se eliminara la clase",

  icon: 'warning',

  showCancelButton: true,

  confirmButtonColor: '#3085d6',

  cancelButtonColor: '#d33',

  confirmButtonText: 'Si',

  cancelButtonText: 'Cancelar'

}).then((result) => {

  if (result.isConfirmed) {

       var enviarDatos = $.ajax({

      url: 'programar_clase_virtual.php?op=deletecv',

      type: 'POST',

      data: "id=" + id,

      async: false

    }).responseText;

    if (enviarDatos == 'ok') {

        limpiarCampos();

        $('#asignarMateria').css("display" ,"block");

        $('#actualizarCampos').css("display", "none");

        $('#cancelarActualizacion').css("display", "none");

        Swal.fire(

          'Clase Eliminada',

          'Se elimino la clase',

          'success'

        )

        

      if( $('#seleccionar_materia').val() == 0 ) {

        mostrarDatosTabla();

        

       } else {

           if(obtenerClass()) {

             mostrarDatosTablaFiltrada();

           } else {

            $(".contenedor-table-filtrada tbody").children().remove();

            $(".contenedor-table-general tbody").children().remove();

           }

           

       }      

        

    } else {

      Swal.fire('Error', 'No se pudo eliminar la clase', 'error');

    }

    

  }

});

    

}



/* Evitar enviar informacion del formulario 

   hasta que no de el de asignar

*/

$('#formulario').on('submit', (e) => {

  e.preventDefault();

});



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

    return false;

  }

});

const getAvance = () => {
    
    if( $('#seleccionar_curso').val() != 0 && $('#fecha').val() != "") {
        let fecha = $('#fecha').val();
        $.post(
            "controlador/planificacion_controlador.php?op=get_planificacion_fecha",
            {codcur:curso1,codpar:paralelo1,fecha:fecha},
            data => {
                if(data.status == 'eSession')location.href = 'docentes.php';
                if(data.status == 'ok'){
                    let planif = "";
                    data.datos.forEach(plan => {
                        let per = plan.periodo;
                        per = per.replace("[","");
                        per = per.replace("]","");
                        planif = `${planif} Periodo: ${per} - Materia: ${plan.materia} - Actividad: ${plan.actividad}\n`;
                    });
                    $('#descripcion').val(planif);
                }
            },
            "json"
            );
    }

}

$(document).ready(function() {

    $("#fecha").change(()=>getAvance());

    $('#seleccionar_curso').change(function() {

    $('#enlace').css("border-color", "#aaa");

    $('#asignarMateria').css("display" ,"block");

    $('#actualizarCampos').css("display", "none");

    $('#cancelarActualizacion').css("display", "none");

    limpiarCampos();
    
    if( $('#seleccionar_curso').val() != 0 ) {

        var index = $('#seleccionar_curso').val();

        var curso = listaCursos[index-1]['codcur'];

        var paralelo = listaCursos[index-1]['codpar'];

        curso1 = listaCursos[index-1]['codcur'];

        paralelo1 = listaCursos[index-1]['codpar'];

        obtenerCelulares(curso1,paralelo1);

        

        let select_curso = document.getElementById("seleccionar_curso");

        nombre_curso  = select_curso.options[select_curso.selectedIndex].text;

        obtenerCursos(curso, paralelo);

        $(".contenedor-table-filtrada tbody").children().remove();

        $(".contenedor-table-general tbody").children().remove();

        $('#codcur').val(curso);

        $('#codpar').val(paralelo);

        mostrarDatosTabla();

    } else {

        $('.contenedor-table-general').removeClass('active');

        $('.contenedor-table-filtrada').removeClass('active');

        $('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');

    }

    

  });

  

  $('#seleccionar_materia').change(function() {

    $('#enlace').css("border-color", "#aaa");

    $('#asignarMateria').css("display" ,"block");

    $('#actualizarCampos').css("display", "none");

    $('#cancelarActualizacion').css("display", "none");

    limpiarCampos();

    if($('#seleccionar_materia').val() != 0) {

        var codigo_materia = $('#seleccionar_materia').val(); 

        let select_materia = document.getElementById("seleccionar_materia");

        nombre_materia  = select_materia.options[select_materia.selectedIndex].text;

        $('#codmat').val(codigo_materia);

        mostrarDatosTablaFiltrada();

    } else {

        mostrarDatosTabla();

        $(".contenedor-table-filtrada tbody").children().remove();

        $('#codmat').val("");

    }

  });



  $('#asignarMateria').bind('click', function () {

    $('#enlace').css("border-color", "#aaa"); 

    if( validarCampos()) {



		fecha1 = $('#fecha').val();

		hora_i1 = $('#hora_inicio').val();

		hora_f1 = $('#hora_fin').val();

		titl1 = $('#titulo').val();

		descrip1 = $('#descripcion').val();



        asignarClase();

     } else {

         Swal.fire('Faltan Datos', 'Por favor rellene todo los campos', 'error');

     }

     

  });

  $('#actualizarCampos').bind('click', function () {

    $('#enlace').css("border-color", "#aaa"); 

    if( validarCampos()) {

        actualizarClase();

     } else {

         Swal.fire('Faltan Datos', 'Por favor rellene todo los campos', 'error');

     }

     

  });

  $('#cancelarActualizacion').bind('click', function () {

    $('#enlace').css("border-color", "#aaa");

    limpiarCampos();

      $('#asignarMateria').css("display" ,"block");

      $('#actualizarCampos').css("display", "none");

      $('#cancelarActualizacion').css("display", "none");

    

  });

  

  

});