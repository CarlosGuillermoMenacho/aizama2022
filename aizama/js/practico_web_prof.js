/* Variables */
let listaPracticos = [];
let listaPreguntas = [];
let listaMaterias = [];
let listaCursos = [];

/* Variables para el practico del alumno */
let listaAlumnos = [];
let alumno_seleccionado;
let nombreAlumno;
let cursoAlumno;
let materiaAlumno;
let practicoPreguntas = [];
let practicoRespuesta = [];
let notaPractico;
let nroPractico;
var dominio = 'https://www.aizama.net';
var lista2=[];
var lista_celulares = [];
let curso;
let nombre_curso;
let nombre_materia;
let paralelo;


/* Peticion para los practicos */
function pedirPracticos() {
  let peticion = new XMLHttpRequest();
  peticion.open("POST", "practicos_web_json.php?op=gpwp", false);
  peticion.onload = function (e) {
    if (peticion.readyState === 4) {
      if (peticion.status === 200) {
        if(peticion.responseText == 'eSession') {
          Swal.fire('La Session ha expirado porfavor vuelva a ingresar con sus datos');
        } else {
          let jsonData = JSON.parse(peticion.responseText);
          if(jsonData['status'] == 'ok') {
            listaPracticos = jsonData['practicos'];
            listaPreguntas = jsonData['preguntas'];  
          } else if(jsonData['status'] == 'noPracticos') {
            listaPracticos = [];
          }
        }  
      } else {
        Swal.fire('Error en la petición')
      }
    }
  };
  peticion.send();
}
/* Petición para los cursos */
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
    return false;
  }
});

/* Petición para las materias */
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

/* Funciones */
function obtenerMaterias(curso, paralelo){
  $("#seleccionar_materia").empty();
  $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');
  for(var i = 0 ; i < listaMaterias.length; i++) {
      if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){
        $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');
      }
  }
}

function crearPractico() { 
  if (validarSelects()) {
      $('.preguntas').children().remove();
      $('#descripcion_practico').val('');
      $('.practico-nuevo').css("display", "block");
      $('.btn-nuevo').css("display", "none");
      $('.contenedor-table-general').css("display", "none");
  } else {
      Swal.fire('Seleccione curso y materia');
  }
}
function obtenerContactos (codalu){
    let lista20= [];
   	console.log(codalu);

	console.log(lista_celulares);
    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista20.push(celular.celular);
        }
        
    });
    return lista20;
}

function getmsgalu2(id,msg){
			//nombre_materia=toUpperCase(nombre_materia);
			nuevo_msg='Curso: '+nombre_curso+' Materia: '+nombre_materia+' - '+msg;
			let contactos = obtenerContactos(id);
			
	    	console.log(contactos);
			console.log(nombre_materia);
	    	contactos.forEach((contacto)=>{
	        $.get(
	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	            );
	        
	    	});
	    	$.post(
	    	    'data_agenda.php?op=alumno_celular',
	    	    {codalu:id},
	    	    (nroCelular)=>{
	    	        if(nroCelular!=""){
	    	            $.get(
            	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+nroCelular
            	            );
	    	        }
	    	    });
	
	        //    "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto

            var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = id;
            var emite = $('#id_usr').val();
            var msgr = msg;
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
function getmsgalu3(id,notaAl){
			//nombre_materia=toUpperCase(nombre_materia);
			
			let mensajeAlumno=`Práctico Nro.: ${nroPractico} - Nota: ${notaAl}/${notaPractico} - Curso: ${nombre_curso} - Materia: ${nombre_materia}`;
			let mensajeTutor=`Práctico Nro.: ${nroPractico} - Nota: ${notaAl}/${notaPractico} - Curso: ${nombre_curso} - Materia: ${nombre_materia} - Alumno: ${nombreAlumno}`;
			let contactos = obtenerContactos(id);
			
	    	console.log(contactos);
			console.log(nombre_materia);
	    	contactos.forEach((contacto)=>{
	        $.get(
	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeTutor+"&phone=591"+contacto
	            );
	        
	    	});
	    	$.post(
	    	    'data_agenda.php?op=alumno_celular',
	    	    {codalu:id},
	    	    (nroCelular)=>{
	    	        if(nroCelular!=""){
	    	            $.get(
            	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeAlumno+"&phone=591"+nroCelular
            	            );
	    	        }
	    	    });
	
	        //    "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto

            var m = document.getElementById("seleccionar_materia");
            var materia = m.options[m.selectedIndex].value;    

            var c_recibe = id;
            var emite = $('#id_usr').val();
            var msgr = mensajeTutor;
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
		  	alert('Mensaje enviado correctamente a la agenda y al Whatsapp de los tutores');	
		  	return true;
	}else{
		alert('Debe seleccionar: Curso y Materia o actualizar la página');
		return false;
	}

}
function validardatos1(){
	if ($('#seleccionar_curso').val()!='' && $('#seleccionar_materia').val()!=0) {
		return true;
	}
	$('#seleccionar_curso').focus();
	return false;
}


function agregarPregunta() {
  $('.preguntas').append( 
      `<div class="pregunta" style="margin-bottom:15px">
          <input type="text" placeholder="Escribe tu pregunta" style="background-color:#e1e1e1; border:none; border-radius:5px;padding:20px 10px;">
          <button style="margin-left:8px" onclick="eliminarPregunta(this)">
              <img src=images/close.svg alt="img" height="40px">
          </button>
    
      </div>`
  );
}

function eliminarPregunta(id) {
  let pregunta = id.parentElement;
  pregunta.remove();  
}
function cargarLista(fechaMSN,horaMSN,descripMSN)
{
	lista2=[];
	$.ajax({
			type:"POST",
			url:"data_agenda.php?op=lista&paralelo="+paralelo,
			data:"cod_curso=" + curso,
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

				getmsgallclass("Práctico web, presentar hasta: "+fechaMSN+' - '+horaMSN+' Desc.:'+descripMSN);

			}
			});
}
function obtenerCelulares(){
						//alert('Hola 2');

    $.post(
            "data_agenda.php?op=obtener_tutores_cel",
            {codcur:curso,codpar:paralelo},
            (datos,estado,xhr)=>{
				
                let status = datos.status;
				
                if(status=="ok"){
                    lista_celulares = datos.lista;
					//alert('Hola '+lista_celulares[0].celular);
					
					console.log('Hola 2: '+lista_celulares);
                    return;
                }
            },
            'json'
        );
    
}

function guardarPractico() {
  
  let preguntasAgregadas = document.querySelectorAll('.pregunta input');
  let cantidadPreguntas = preguntasAgregadas.length;
 
  /* FormData para enviar los datos */
  let formData = new FormData();
  formData.append('codcur', curso);
  formData.append('codpar', paralelo);
  formData.append('codmat', $('#seleccionar_materia').val());
  formData.append('npreg', cantidadPreguntas);
  formData.append('fecha', $('#fecha').val() );
  let fechaMSN = $('#fecha').val();
  let horaMSN = $('#hora').val();
  let descripMSN = $('#descripcion_practico').val();
  if( $('#hora').val() != "" && $('#fecha').val() != "" ) {
    formData.append('hora',  $('#hora').val() );
    formData.append('codpractico', $('#codpractico').val())
  } else {
    Swal.fire('Agrege fecha y hora al práctico ')
    return false;
  }
  if( $('#descripcion_practico').val() != '' ) {
    formData.append('descripcion', $('#descripcion_practico').val());
  } else {
    Swal.fire('Agrege una descripción a sus prácticos');
    return false;
  }
  if($('#nota_prac').val()!=""){
      formData.append('nota', $('#nota_prac').val());
  }else{
      Swal.fire('Agrege una nota a su práctico');
    return false;
  }

  
  /* Cargar preguntas para el FormData*/
  for( let i = 0; i< preguntasAgregadas.length; i++) {    
    let preguntasName = preguntasAgregadas[i].name=`preg${i+1}`;
    console.log(preguntasAgregadas[i]);
    let preguntas = preguntasAgregadas[i].value;
    console.log(preguntas);
    if( preguntasAgregadas[i].value != ''  ) {
      formData.append(preguntasName, preguntas);
    } else {
      Swal.fire('Agrege preguntas a sus campos creados');
      return false;
    }
  }

  if( cantidadPreguntas > 0) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se asignará el práctico",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function (e) {
          if (req.readyState == 4) {
            if(req.status == 200) {
              if( req.responseText == 'ok') {
                limpiarPracticos();
                pedirPracticos();
                $('.btn-nuevo').css("display", "block");
                $('.practico').css("display", "block");
                $('.practico-nuevo').css("display", "none")
                verPracticosWeb(curso, paralelo, $('#seleccionar_materia').val());
                Swal.fire('Éxito', 'Práctico asignado correctamente', 'success');
                cargarLista(fechaMSN,horaMSN,descripMSN);
              } else if( req.responseText == 'noEdit') { 
                Swal.fire('Error', 'No se puede editar', 'error');
              } else if( req.responseText == 'editFecha'){
                limpiarPracticos();
                pedirPracticos();
                $('.btn-nuevo').css("display", "block");
                $('.practico').css("display", "block");
                $('.practico-nuevo').css("display", "none")
                verPracticosWeb(curso, paralelo, $('#seleccionar_materia').val());
                Swal.fire('AVISO', 'Sólo se pudo actualizar la fecha y hora de presentación...', 'success');
              } else {
                Swal.fire('Error', 'Se produjo un error al asignar práctico', 'error');
              }
            }
          }
        };
        req.open('POST', 'practicos_web_json.php?op=spwp', false);
        req.send(formData);
      }
    })


    
  } else {
    Swal.fire('Debe tener al menos una pregunta');
  }
}

function verPracticosWeb(curso, paralelo, materia) {
  limpiarPracticos();
  let nro = 1;
  listaPracticos.forEach( practico => {
    if ( materia == practico.codmat && curso == practico.codcur && paralelo == practico.codpar ) {
      $('.contenedor-table-general').css("display", "block");
      $('#campos').append(`
        <tr> 
          <td data-label="Nro">${nro}</td>
          <td data-label="Descripción">${practico.descripcion}</td>
          <td data-label="Nota">${practico.nota}</td>
          <td data-label="Ver o Editar">
            <button onclick="editarPractico(${practico.id})">
              <img src="images/edit.svg" style="height:50px">
            </button>
          </td>
          <td data-label="Eliminar">
            <button onclick="eliminarPractico(${practico.id})">
              <img src="images/delete.svg" style="height:50px">
            </button>
          </td>
          <td data-label="Revisar">
            <button onclick="revisarPractico(${practico.id},${nro})">
              <img src="images/icon-examen.svg" style="height:50px">
            </button>
          </td>
          <td data-label="Revisar">${practico.fechalimite}</td>
        </tr>
      `);
      nro++;
    } 
  });
}

function editarPractico(idPractico) {
  limpiarPreguntas();
  $('.contenedor-table-general').css("display", "none");
  $('#codpractico').val(idPractico);
  $('.practico-nuevo').css("display", "block");
  $('.btn-nuevo').css("display", "none");
  listaPracticos.forEach( practico => {
    if(practico.id == idPractico) {
      $('#descripcion_practico').val(practico.descripcion);
      $('#fecha').val(practico.fecha);
      $('#hora').val(practico.hora);
      $('#nota_prac').val(practico.nota);
      
      cargarPreguntasPractico(idPractico);
    }
  });
}
function cargarPreguntasPractico(idPractico) {
  listaPreguntas.forEach( preguntas => {
    if(preguntas.codpractico == idPractico) {
      $('.preguntas').append( 
        `<div class="pregunta" style="margin-bottom:15px">
            <input type="text" value="${preguntas.pregunta}" style="background-color:#e1e1e1; border:none; border-radius:5px;padding:20px 10px;">
            <button style="margin-left:8px" onclick="eliminarPregunta(this)">
                <img src=images/close.svg alt="img" height="40px">
            </button>
        </div>`
      );
    }
  });
}

function limpiarPreguntas() {
  $('.preguntas').children().remove();
}

function limpiarPreguntasAlumnos() {
  $('.preguntas-alumnos').children().remove();
}

function limpiarPracticos() {
  $('#campos').children().remove();
}
function limpiarTablaAlumno() {
  let alumnos = document.querySelector('#camposAlumnos');
  while (alumnos.firstChild) {
    alumnos.removeChild(alumnos.firstChild);
  }
}

function eliminarPractico(practico) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Se eliminará este práctico",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('llegue');
      var req = new XMLHttpRequest();
      let formData = new FormData();
      formData.append('codpractico', practico);
      req.onreadystatechange = function (e) {
        if (req.readyState == 4) {
          if(req.status == 200) {
            if( req.responseText == 'ok') {
              limpiarPracticos();
              pedirPracticos();
              $('.btn-nuevo').css("display", "block");
              $('.practico').css("display", "block");
              $('.practico-nuevo').css("display", "none")
              verPracticosWeb(curso, paralelo, $('#seleccionar_materia').val());
              Swal.fire('Éxito', 'Práctico eliminado correctamente', 'success');
            } else {
              Swal.fire('Error', 'Se produjo un error al eliminar práctico', 'error');
            }
          }
        }
      };
      req.open('POST', 'practicos_web_json.php?op=dpwp', false);
      req.send(formData);
    }
  })
}
function obtenerNotaPractico(practico){
    for(let i = 0 ; i < listaPracticos.length; i++){
        if(listaPracticos[i].id==practico){
            return listaPracticos[i].nota;
        }
    }
    return "";
}

function revisarPractico(practico,nro) {
  $('.practico-alumno').css('display','none');
  $('#codigoPractico').val(practico);
  nroPractico = nro;
  notaPractico = obtenerNotaPractico(practico);
  /* Pide la lista alumnos para la revisión de prácticos */
  pedirAlumnos(practico);

  /* Mostrar la tabla de alumnos  */
  mostrarTablaRevision(practico);
  
}

function pedirAlumnos(practico) {
  var req = new XMLHttpRequest();
  let formData = new FormData();
  formData.append('codpractico', practico);
  req.onreadystatechange = function (e) {
    if (req.readyState == 4) {
      if(req.status == 200) {
        if (req.responseText === 'eSession') {
          Swal.fire('La Session ha expirado por favor vuelva a ingresar con sus datos');
        } else {
          let jsonData = JSON.parse(req.responseText);
          if (jsonData['status'] === 'ok' ) {
            listaAlumnos = jsonData['lista'];
          }
        } 

      } else {
        Swal.fire('Error en la petición');
      }
    }
  };
  req.open('POST', 'practicos_web_json.php?op=rpw', false);
  req.send(formData);
}



function mostrarTablaRevision(practico) {
  $('.contenedor-table-general').css('display', 'none');
  $('.grid-2').css('display', 'none');
  $('.btn-nuevo').css('display', 'none');
  $('.contenedor-table-filtrada').css('display', 'block');
  if (listaAlumnos.length) {
    limpiarTablaAlumno();
    let nro = 1;
    listaAlumnos.forEach( alumno => {
      const { codalu, nombre, estado, editable, fecha, hora, nota, idpracticopres } = alumno;
      console.log(typeof estado);
      switch (estado) {
        case '0':
          $('#camposAlumnos').append(`
            <tr>
              <td data-label="Nro">${nro}</td>
              <td class="alineacion-alumno" data-label="Alumno">${nombre}</td>
              <td data-label="Revisar"></td>
              <td data-label="Fecha"></td>
              <td data-label="Hora"></td>
              <td data-label="Nota"></td>
              <td data-label="Habilitar edición"></td>
            </tr>
          `);
          nro++;
          break;
        case '1':
          if (editable === '1') {
            $('#camposAlumnos').append(`
              <tr>
                <td data-label="Nro">${nro}</td>
                <td class="alineacion-alumno" data-label="Alumno">${nombre}</td>
                <td data-label="Revisar"> 
                  <button onclick="mostrarPracticoAlumno(${codalu}, ${practico})">
                    <img src="images/icon-examen.svg" alt="icono" height="50px" > 
                  </button>
                </td>
                <td data-label="Fecha">${fecha}</td>
                <td data-label="Hora">${hora}</td>
                <td data-label="Nota">${nota}</td>
                <td data-label="Habilitar edición">
                  <input type="checkbox" checked onclick="edicionEstudiante(${codalu}, ${idpracticopres})"  id="check${codalu}">
                </td>
              </tr>
            `);
          } else {
            $('#camposAlumnos').append(`
              <tr>
                <td data-label="Nro">${nro}</td>
                <td class="alineacion-alumno" data-label="Alumno">${nombre}</td>
                <td data-label="Revisar"> 
                  <button onclick="mostrarPracticoAlumno(${codalu}, ${practico})">
                    <img src="images/icon-examen.svg" alt="icono" height="50px" > 
                  </button>
                </td>
                <td data-label="Fecha">${fecha}</td>
                <td data-label="Hora">${hora}</td>
                <td data-label="Nota">${nota}</td>
                <td data-label="Habilitar edición">
                  <input type="checkbox" onclick="edicionEstudiante(${codalu}, ${idpracticopres})"  id="check${codalu}">
                </td>
              </tr>
            `);
          }
          
          nro++;
          break;
        
          default:
          break;
      }
    });
  } else {
    Swal.fire('No hay alumnos')
  }
}

function edicionEstudiante(codalu, practico) {
  let checked = document.getElementById(`check${codalu}`);
  
  /* Habilitar y desabilitar la edicion del practico para el estudiante */
  if (checked.checked) {
    habilitarEdicionEstudiante(practico);
  } else {
    desabilitarEdicionEstudiante(practico);
  }
}

function habilitarEdicionEstudiante(practico) {
  /* Parametros que voy a enviar para habilitar */
  let formData = new FormData();
  formData.append('idpracticoPres', practico);
  console.log('llego');
  /* Post para habiliar estudiante */
  var req = new XMLHttpRequest();
  req.onreadystatechange = function (e) {
    if (req.readyState == 4) {
      if(req.status == 200) {
        if (req.responseText === 'ok') {
          Swal.fire(
            'Éxito',
            'Edición habilitada',
            'success'
          );
        }
      } else {
        Swal.fire('Error al habilitar');
      }
    }
  };
  req.open('POST', 'practicos_web_json.php?op=hpwa', false);
  req.send(formData);
}

function desabilitarEdicionEstudiante(practico) {
    /* Parametros que voy a enviar para habilitar */
    let formData = new FormData();
    formData.append('idpracticoPres', practico);
  
    /* Post para habiliar estudiante */
    console.log('llego');
    var req = new XMLHttpRequest();
    req.onreadystatechange = function (e) {
      if (req.readyState == 4) {
        if(req.status == 200) {
          if (req.responseText === 'ok') {
            Swal.fire(
              'Éxito',
              'Edición desabilitada',
              'success'
            );
          }
        } else {
          Swal.fire('Error al desabilitar');
        }
      }
    };
    req.open('POST', 'practicos_web_json.php?op=dpwa', false);
    req.send(formData);
}

function guardarNotaAlumno() {
  /* Datos que voy a enviar */
  let notaAlumno = $('#nota').val();
  if(parseInt(notaAlumno)>parseInt(notaPractico)){
      Swal.fire('Nota Incorrecta. La nota debe ser menor o igual a la nota del Práctico.');
      return;
  }


  let formData = new FormData();
  formData.append('idpracticopres', $('#codigoPresentacion').val());
  if ($('#nota').val() != '') {
    formData.append('nota', $('#nota').val());
  } else {
    Swal.fire('Por favor introduzca la nota');
    return;
  }
  
  /* Peticion */
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta nota se guardará",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function (e) {
        if (req.readyState == 4) {
          if(req.status == 200) {
            if (req.responseText === 'ok') {
              desabilitarEdicionEstudiante($('#codigoPresentacion').val());
              revisarPractico($('#codigoPractico').val(),nroPractico);
              getmsgalu3(alumno_seleccionado,notaAlumno);
              Swal.fire( 
                'Éxito',
                'Nota guardada',
                'success'
              );
              
            } 
          } else {
            Swal.fire('Error en la petición');
          }
        }
      };
      req.open('POST', 'practicos_web_json.php?op=cpwa', false);
      req.send(formData);
    }
  })

  
  
}

/* Boton de atras cuando se muestra la lista de alumnos */
function btnAtrasAlumnos() {
  $('.contenedor-table-general').css('display', 'block');
  $('.contenedor-table-filtrada').css('display', 'none');
  $('.grid-2').css('display', 'grid');
  $('.btn-nuevo').css('display', 'block');
}


/* Muestra el practico de alumno seleccionado */
function mostrarPracticoAlumno(alumno, practico) {
  alumno_seleccionado = alumno;
  /* Pido el practico de alumno */
  pedirPracticoAlumno(alumno, practico);

  /* Mostrar Practico Alumno */
  verPracticoAlumno();
  $('#codigoAlumno').val(alumno);
}

function pedirPracticoAlumno(alumno, practico) {

  /* Datos que enviare para la peticion del practico */
  let formData = new FormData();
  formData.append('codalu', alumno);
  formData.append('codpractico', practico);

  /* Peticion del practico */
  let peticion = new XMLHttpRequest();
  peticion.open("POST", "practicos_web_json.php?op=grpwa", false);
  peticion.onload = function (e) {
    if (peticion.readyState === 4) {
      if (peticion.status === 200) {
        if(peticion.responseText == 'eSession') {
          Swal.fire('La Session ha expirado porfavor vuelva a ingresar con sus datos');
        } else {
          let jsonData = JSON.parse(peticion.responseText);
          if(jsonData['status'] == 'ok') {
            nombreAlumno = jsonData['alumno'];
            cursoAlumno = jsonData['curso'];
            materiaAlumno = jsonData['materia'];
            notaAlumno = jsonData['nota'];
            practicoPreguntas = jsonData['preguntas'];
            practicoRespuesta = jsonData['respuestas'];
            $('#codigoPresentacion').val( jsonData['codpresentacion'] );
          }
        }  
      } else {
        Swal.fire('Error en la peticion')
      }
    }
  };
  peticion.send(formData);
}

function verPracticoAlumno() {
  informacionPractico();
  limpiarPreguntas();
  mostrarPreguntas();
  $('.contenedor-table-filtrada').css('display', 'none');
  $('.grid-2.grid-2__alumno').css('display', 'grid');
  $('.practico-alumno').css('display', 'block');
}

function atrasPracticoAlumno() {
  $('.practico-alumno').css('display', 'none');
  $('.contenedor-table-filtrada').css('display', 'block');
}

function informacionPractico() {
  $('.practico__nombre input').val(nombreAlumno);
  $('.practico__curso input').val(cursoAlumno);
  $('.practico__materia input').val(materiaAlumno);
  $('.practico__nota input').val(notaAlumno);

}

function mostrarPreguntas() {
  let nro = 1;
  limpiarPreguntasAlumnos();
  practicoPreguntas.forEach( (pregunta, i ) => {
    /* Obtengo la respuesta de la pregunta */
    let respuesta = mostrarRespuestas(i);
    console.log(respuesta);
    /* Crear la pregunta con su respuesta obtenida */
    $('.preguntas-alumnos').append(`
        <div class="pregunta-alumno" style="margin-bottom:10px">
            <label>${nro}.- ${pregunta}</label>
            <textarea disabled row="2" id="${nro}" placeholder="tu respuesta" data-autoresize>${respuesta}</textarea>
        </div>
    `);
    nro++;
  });
}

function mostrarRespuestas(indexPregunta) {
  if( practicoPreguntas.length > 0 ) {
    /* Variable donde retornare la respuesta */  
    let respuestaRetornar;
    practicoRespuesta.forEach((respuesta, i) => {
      console.log(indexPregunta);
      console.log(i);
      if (i === indexPregunta) {
        respuestaRetornar = respuesta
      }
    });
    return respuestaRetornar;
  } else {
    return false;
  }
}

function limpiarPreguntas() {
  const preguntas = document.querySelector('.preguntas');
  while (preguntas.firstChild) {
    preguntas.removeChild(preguntas.firstChild);
  }
}

function cancelarPractico() {
  $('.practico-nuevo').css("display", "none");
  $('.practico').css("display", "block");
  $('.contenedor-table-general').css("display", "block");
  $('.btn-nuevo').css("display", "block");
}

function validarSelects() {
  if ( $('#seleccionar_materia').val() != 0 &&
    $('#seleccionar_curso').val() != 0  ) {
    return true;
  } else {
    return false;
  }
}
function obtenerNombreMateria(){
	let codmat = $('#seleccionar_materia').val();
	for(let i = 0; listaMaterias.length; i++){
		if(listaMaterias[i].codmat==codmat){
			nombre_materia = listaMaterias[i].nombre;
			return;
		}

	}
}

$(document).ready(function() {
  $('.contenedor-table-alumno').css('display', 'none');
  pedirPracticos();
  $('#seleccionar_curso').change( ()=> {
    $('.practico-nuevo').css("display", "none");
    $('.btn-nuevo').css("display", "block");
    
    if($('#seleccionar_curso').val() != 0) {
      var index = $('#seleccionar_curso').val();
      curso = listaCursos[index-1]['codcur'];
      paralelo = listaCursos[index-1]['codpar'];
      obtenerMaterias(curso, paralelo);
      nombre_curso = listaCursos[index-1]['nombre'];
      obtenerCelulares();
    } else {
      $('.contenedor-table-general').css("display", "none");
      $('#seleccionar_materia').html('<option value="0"> -- Seleccionar materia -- </option>');
    }
  })
  
  $('#seleccionar_materia').change( ()=> {
    $('.practico-nuevo').css("display", "none");
    $('.btn-nuevo').css("display", "block");
    if($('#seleccionar_materia').val() != 0) {
      verPracticosWeb(curso, paralelo, $('#seleccionar_materia').val());
      obtenerNombreMateria();
    } else {
      $('.contenedor-table-general').css("display", "none");
      $('.practico-nuevo').css("display", "none");
    }
  })

});