/* Variables */
let listaEvaluaciones = [];
let listaPreguntas = [];
let opciones = [];
let listaMaterias = [];
let listaCursos = [];
let coddeeva;
var lista_celulares = [];
var dominio = 'https://www.aizama.net';

/* Variables para la evaluación del alumno */
let listaAlumnos = [];
let nombreAlumno;
let cursoAlumno;
let materiaAlumno;
let evaluacionPreguntas = [];
let evaluacionRespuesta = [];
let lista_de_notas = [];
let curso;
let paralelo;
let nro_evaluacion;
let nombre_materia_seleccionada;
let nombre_curso_seleccionado;

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
function noEvaluaron(){
    Swal.queue([{
                title: 'Advertencia',
                confirmButtonText: 'Aceptar',
                text: 'Se enviará una notificación a los tutores informando que el estudiante no realizó la evaluación',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#E6344A',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                preConfirm: function()
                {
                    listaAlumnos.forEach((alumno)=>{
                       if(!tieneNota(alumno.codalu)){
                           enviarMensaje2(alumno.codalu,0,"NO REALIZÓ SU EXAMEN");
                       } 
                    });
                }
            }]);
}
function obtenerNombreEstudiante(id){
    for (var i = 0; i < listaAlumnos.length; i++) {
        if(listaAlumnos[i].codalu==id)return listaAlumnos[i].nombre;
    }
    return "";
}
function enviarMensaje2(id,notaAl,obsAl){
   let nombre = obtenerNombreEstudiante(id);
   let codalu = id;
   let mensajeAlumno = `Evaluación/Selección nro.: ${nro_evaluacion} - Nota: ${notaAl}/100 - Materia: ${nombre_materia_seleccionada} - Obs.: ${obsAl}`;
   let mensajeTutor = `Evaluación/Selección nro.: ${nro_evaluacion} - Nota: ${notaAl}/100 - Alumno: ${nombre} - Materia: ${nombre_materia_seleccionada} - Curso: ${nombre_curso_seleccionado} - Obs.: ${obsAl}`;
   lista_celulares.forEach(
    (alumno)=>{
        if(alumno.codalu == codalu && alumno.celular!=""){
            $.get(
                "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeTutor+"&phone=591"+alumno.celular
                );
        }
    }
   );
   $.post(
        'data_agenda.php?op=alumno_celular',
        {codalu:codalu},
        (nroCelular)=>{
            if(nroCelular!=""){
                $.get(
                "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensajeAlumno+"&phone=591"+nroCelular
                );
            }
        }
        );
        
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
    

}
function tieneNota(codalu){
    for(let i = 0 ; i < lista_de_notas.length ; i++){
        if(lista_de_notas[i].codalu == codalu)return true;
    }
    return false;
}

/* Peticion para las evaluacines */
function pedirEvaluaciones() {
  let peticion = new XMLHttpRequest();
  peticion.open("POST", "evaluaciones_json.php?op=gpwp", false);
  peticion.onload = function (e) {
    if (peticion.readyState === 4) {
      if (peticion.status === 200) {
        if(peticion.responseText == 'eSession') {
          Swal.fire('La Session ha expirado porfavor vuelva a ingresar con sus datos');
        } else {
          let jsonData = JSON.parse(peticion.responseText);
          if(jsonData['status'] == 'ok') {
            listaEvaluaciones = jsonData['evaluaciones'];
            listaPreguntas = jsonData['preguntas'];  
          } else if(jsonData['status'] == 'noEvaluaciones') {
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

function crearEvaluacion() { 
  if (validarSelects()) {
      $('.preguntas').children().remove();
      $('#descripcion_evaluacion').val('');
      $('.evaluacion-nuevo').css("display", "block");
      $('.btn-nuevo').css("display", "none");
      $('.contenedor-table-general').css("display", "none");
  } else {
      Swal.fire('Seleccione curso y materia');
  }
}

function agregarPregunta() {
  $('.preguntas').append( 
    `<div class="pregunta" style="margin-bottom:15px">
      <input type="text" placeholder="Escribe tu pregunta" style="background-color:#e1e1e1; border:none; border-radius:5px;padding:20px 10px;">
      <button style="margin-left:8px" onclick="eliminarPregunta(this)">
        <img src=images/close.svg alt="img" height="40px">
      </button>
      <input type="file" accept="image/*" onchange="cargarImagen(this)" style="display:block;">
    </div>`
  );
}

async function cargarImagen(DOM) {
  const extension = comprobarExtension(DOM.value);
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'PNG':
    case 'JPG':
    case 'JPEG':
      try {
        const imgBase64 = await resizeImage(DOM.files[0]);
        const divImage = document.createElement('div');
        const img = document.createElement('img');
        img.src = imgBase64;
        divImage.appendChild(img);
        DOM.parentElement.appendChild(divImage);
      } catch (error) {
        console.log(error);
      }    
      break;
    default:
      DOM.value = "";
      Swal.fire('Solo se aceptan imagenes');
      break;
  }  
}

const resizeImage = file => {
  return new Promise( ( resolve, reject ) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result.toString();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        } 
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve( canvas.toDataURL(file.type) )
      }
    }
  });
}


  



function verEvaluaciones() {
  limpiarEvaluaciones();
  $('.contenedor-table-filtrada').css('display','none');

  let nro = 1;
  listaEvaluaciones.forEach( evaluacion => {
    let fechai = evaluacion.f_inicio;
      let fechaf = evaluacion.i_fin;
      let horai = evaluacion.horai;
      let horaf = evaluacion.horaf;
      let formatofecha = evaluacion.formatoFecha;

      $('.contenedor-table-general').css("display", "block");
      $('#campos').append(`
        <tr> 
          <td data-label="Nro">${nro}</td>
          <td data-label="Descripción">${evaluacion.descripcion}</td>
          
          <td data-label="Revisar">
            <button onclick="preguntasEvaluacion(${evaluacion.codexa},${nro})">
              <img src="images/edit.svg" style="height:50px">
            </button>
          </td>
          
          <td data-label="Detalle">${formatofecha}</td>

        </tr>
      `);
      
      
      nro++;
    
    
  });
}

function preguntasEvaluacion(codexa,nro){
nro_evaluacion = nro;
document.getElementById('evaluacion-descrip').innerHTML=obtenerDescripcion(codexa);
  $('#tabla-respuestas').css('display','none');
coddeeva = codexa;
  $.post("evaluaciones_json.php?op=lista_Alumnos_Evaluaciones",
    {codexa:codexa,codcur:curso,codpar:paralelo},
    (datos,estado,xhr)=>{
      let status = datos ["status"];
      if (status == "ok") {
        listaAlumnos = datos ["lista_de_alumnos"];
        lista_de_notas = datos ["lista_de_notas"];
        mostrarTablaRevision(codexa);
      }
    },'json');
  }

function obtenerDescripcion(codexa) {

 for (var i = 0; i < listaEvaluaciones.length; i++) {
    if(listaEvaluaciones[i].codexa == codexa){
      return listaEvaluaciones[i].descripcion;
    }
  } 
  return "";
}

function obtenerFormato(fechai,fechaf,horai,horaf){

  var formatoi = new Date(fechai);
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

console.log(
  formatoi.toLocaleDateString("es-ES", options)
);

formatof = new Date(fechaf);
console.log(
  formatof.toLocaleDateString("es-ES", options)
  );
var formatofecha = 'Habilitado desde el ' + formatoi + 'a partir de las ' + horai + ' hasta la fecha del ' + formatof + 'hasta las ' + horaf ;
}


function editarEvaluación(idEvaluacion) {
  limpiarPreguntas();
  $('.contenedor-table-general').css("display", "none");
  $('#codevaluacion').val(idEvaluacion);
  $('.evaluacion-nuevo').css("display", "block");
  $('.btn-nuevo').css("display", "none");
  listaEvaluaciones.forEach( evaluacion => {
    if(evaluación.id == idEvaluacion) {
      $('#descripcion_evaluacion').val(evaluacion.descripcion);
      $('#fecha').val(evaluación.fecha);
      $('#hora').val(evaluación.hora);
      
      cargarPreguntasEvaluacion(idEvaluación);
    }
  });
}
function cargarPreguntasEvaluacion(idEvaluación) {
  listaPreguntas.forEach( preguntas => {
    if(preguntas.codevaluacion == idEvaluación) {
      const { tipo } = preguntas;
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

function limpiarEvaluaciones() {
  $('#campos').children().remove();
}
function limpiarTablaAlumno() {
  let alumnos = document.querySelector('#camposAlumnos');
  while (alumnos.firstChild) {
    alumnos.removeChild(alumnos.firstChild);
  }
}

function eliminarEvaluacion(evaluación) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Se eliminará esta evaluación",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      var req = new XMLHttpRequest();
      let formData = new FormData();
      formData.append('codevaluacion', evaluación);
      req.onreadystatechange = function (e) {
        if (req.readyState == 4) {
          if(req.status == 200) {
            if( req.responseText == 'ok') {
              limpiarEvaluaciones();
              pedirEvaluaciones();
              $('.btn-nuevo').css("display", "block");
              $('.evaluacion').css("display", "block");
              $('.evaluacion-nuevo').css("display", "none")
              verEvaluaciones(curso, paralelo, $('#seleccionar_materia').val());
              Swal.fire('Éxito', 'Evaluación eliminada correctamente', 'success');
            } else {
              Swal.fire('Error', 'Se produjo un error al eliminar la evaluación', 'error');
            }
          }
        }
      };
      req.open('POST', 'evaluaciones_json.php?op=dpwp', false);
      req.send(formData);
    }
  })
}


function revisarEvaluación(evaluacion) {
  $('.evaluacion-alumno').css('display','none');
  $('#codigoEvaluación').val(practico);
  /* Pide la lista alumnos para la revisión de prácticos */
  pedirAlumnos(evaluación);

  /* Mostrar la tabla de alumnos  */
  mostrarTablaRevision(evaluación);
  
}

function pedirAlumnos(evaluacion) {
  var req = new XMLHttpRequest();
  let formData = new FormData();
  formData.append('codevaluacion', evaluacion);
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
  req.open('POST', 'evaluaicion_escrita_alu.js?op=rpw', false);
  req.send(formData);
}

function obtenerNota(codalu) {
  for (var i = 0; i < lista_de_notas.length; i++) {
    if(lista_de_notas[i].codalu == codalu){
      return lista_de_notas[i].nota;
    }
  }
  return "";
}

function mostrarTablaRevision(evaluacion) {
  $('.contenedor-table-general').css('display', 'none');
  //$('.grid-2').css('display', 'none');
  $('.btn-nuevo').css('display', 'none');
  $('.contenedor-table-filtrada').css('display', 'block');
  if (listaAlumnos.length) {
    limpiarTablaAlumno();
    let nro = 1;
    listaAlumnos.forEach( alumno => {
      const { codalu, nombre} = alumno;
      let nota = obtenerNota(codalu);
      if(nota!=""){
        $('#camposAlumnos').append(`

            <tr>
              <td data-label="Nro">${nro}</td>
              <td class="alineacion-alumno" data-label="Alumno">${nombre}</td>
              <td data-label="Nota">${nota}</td>
              <td data-label="Revisar">
                <button onclick="obtenerExamen(${codalu})">
                  <img src="images/edit.svg" style="height:50px">
                </button>
              </td>
              <td data-label="Re-Evaluacion">
                <button onclick="habilitarReEvaluacion(${codalu})">
                  <img src="images/delete.svg" style="height:50px">
                </button>
              </td>
              
            </tr>
          `);
          nro++;

      }else{
        $('#camposAlumnos').append(`
            <tr>
              <td data-label="Nro">${nro}</td>
              <td class="alineacion-alumno" data-label="Alumno">${nombre}</td>
              <td data-label="Nota">${nota}</td>
              <td data-label="Revisar">&nbsp;</td>
              <td data-label="Re-Evaluacion">&nbsp;</td>
            </tr>
          `);
          nro++;
      }
      
      
    });
  } else {
    Swal.fire('No hay alumnos')
  }
}

function mostrarTablaRespuestas() {
  $('.contenedor-table-general').css('display','none');
  //$('.grid-2').css('display','none');
  $('.btn-nuevo').css('display','none');
  $('.contenedor-table-filtrada').css('display', 'none');
  $('#tabla-respuestas').css('display', 'block');
  $('#campos-respuestas').empty();
  if (listaPreguntas.length>0) {
    
    let nro = 1;
    listaPreguntas.forEach( alumno => {
      const {codpre,dir_imagen,fecha,nota,pregunta,respuesta,surespuesta,tiempo} = alumno;
      let opcion1 = obtenerOpcion(1,codpre);
      let opcion2 = obtenerOpcion(2,codpre);
      let opcion3 = obtenerOpcion(3,codpre);
      let imagen = dir_imagen==""?'<td>&nbsp;</td>':`<td><img src="resources/${dir_imagen}" width="100px" onclick="mostrarImagen('${dir_imagen}')" class="puntero"/></td>`
      if (respuesta == 1) {
        $('#campos-respuestas').append(`
            <tr>
              <td data-label="Nro">${nro}</td>
              <td class="alineacion-alumno" data-label="Pregunta">${pregunta}</td>
              ${imagen}
              <td data-label="Opcion 1" style="color:red;">${opcion1}</td>
              <td data-label="Opcion 2">${opcion2}</td>
              <td data-label="Opcion 3">${opcion3}</td>
              <td data-label="OpcionSelect">${surespuesta}</td>
              <td data-label="nota">${nota}</td>
              <td data-label="tiempo">${tiempo}</td>
              <td data-label="fecha">${fecha}</td>
            </tr>
          `);
      }
      if (respuesta == 2) {
        $('#campos-respuestas').append(`
            <tr>
              <td data-label="Nro">${nro}</td>
              <td class="alineacion-alumno" data-label="Pregunta">${pregunta}</td>
              ${imagen}
              <td data-label="Opcion 1" >${opcion1}</td>
              <td data-label="Opcion 2" style="color:red;">${opcion2}</td>
              <td data-label="Opcion 3">${opcion3}</td>
              <td data-label="OpcionSelect">${surespuesta}</td>
              <td data-label="nota">${nota}</td>
              <td data-label="tiempo">${tiempo}</td>
              <td data-label="fecha">${fecha}</td>
            </tr>
          `);
      }
      if (respuesta == 3) {
        $('#campos-respuestas').append(`
            <tr>
              <td data-label="Nro">${nro}</td>
              <td class="alineacion-alumno" data-label="Pregunta">${pregunta}</td>
              ${imagen}
              <td data-label="Opcion 1" >${opcion1}</td>
              <td data-label="Opcion 2" >${opcion2}</td>
              <td data-label="Opcion 3" style="color:red;">${opcion3}</td>
              <td data-label="OpcionSelect">${surespuesta}</td>
              <td data-label="nota">${nota}</td>
              <td data-label="tiempo">${tiempo}</td>
              <td data-label="fecha">${fecha}</td>
            </tr>
          `);
      }
          nro++;   
    });
  } else {
    Swal.fire('No hay alumnos')
  }
}
function mostrarImagen(resource) {
  Swal.fire({
        imageUrl: 'resources/'+resource
      });
}
function obtenerOpcion(nro,codpre) {

  console.log(codpre);
  for (var i = 0; i < opciones.length; i++) {
    if(opciones[i].codpre == codpre && opciones[i].n_opcion == nro){
       return opciones[i].opcion;
    }
  }
  return "";
}

function habilitarReEvaluacion(codalu) {
  Swal.queue
([{
    title: 'Advertencia',
    confirmButtonText: 'Aceptar',
    text: 'Se eliminarán todos los registros de la evaluación del estudiante',
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#E6344A',
    showLoaderOnConfirm: true,
    showCancelButton: true,
    preConfirm: function()
    {
        $.post("evaluaciones_json.php?op=re_habil_eval",
          {codalu:codalu,codexa:coddeeva},
          (datos,estado,xhr)=>{
          
            if (datos == "ok") {
              Swal.fire(
          'Estudiante habilitado para la Re-Evaluación'

          );
              preguntasEvaluacion(coddeeva);
       }
    },'text');
        
    }
}])
   
}

function obtenerExamen(codalu){
document.getElementById('nombre-estudiante').innerHTML=obtenerNombre(codalu);
  $.post("evaluaciones_json.php?op=lista_de_preguntas",
    {codalu:codalu,codexa:coddeeva},
    (datos,estado,xhr)=>{
      let status = datos ["status"];
      if (status == "ok") {
        listaPreguntas = datos ["lista"];
        opciones = datos ["lista_de_Opciones"];
        mostrarTablaRespuestas();
      }
    },'json');
  }



function obtenerNombre(codalu) {
  for (var i = 0; i < listaAlumnos.length; i++) {
    if(listaAlumnos[i].codalu == codalu){
      return listaAlumnos[i].nombre;
    }
  }
  return "";
}

function edicionEstudiante(codalu, evaluación) {
  let checked = document.getElementById(`check${codalu}`);
  
  /* Habilitar y desabilitar la edicion del practico para el estudiante */
  if (checked.checked) {
    habilitarEdicionEstudiante(evaluacion);
  } else {
    desabilitarEdicionEstudiante(evaluacion);
  }
}

function habilitarEdicionEstudiante(evaluación) {
  /* Parametros que voy a enviar para habilitar */
  let formData = new FormData();
  formData.append('idevaluaciónPres', evaluación);
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
  req.open('POST', 'evaluacion_escrita_alu.php?op=hpwa', false);
  req.send(formData);
}

function desabilitarEdicionEstudiante(evaluación) {
    /* Parametros que voy a enviar para habilitar */
    let formData = new FormData();
    formData.append('idevaluacionPres', evaluación);
  
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
    req.open('POST', 'evaluacion_escrita_alu.php?op=dpwa', false);
    req.send(formData);
}

function guardarNotaAlumno() {
  /* Datos que voy a enviar */
  let formData = new FormData();
  formData.append('idevaluacionpres', $('#codigoPresentacion').val());
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
              revisarEvaluaciones($('#codigoEvaluación').val());
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
      req.open('POST', 'evaluaciones_escritas.php?op=cpwa', false);
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

/* Boton de atras cuando se muestran las preguntas*/

function btnAtrasPreguntas() {
  $('.contenedor-table-general').css('display', 'none');
  $('.contenedor-table-filtrada').css('display', 'block');
  $('.grid-2').css('display', 'grid');
  $('.btn-nuevo').css('display', 'block'); 
  $('.contenedor-table-respuestas').css('display','none');
}


/* Muestra las evaluciones del alumno seleccionado */
function mostrarEvaluaciónAlumno(alumno, evaluaciones) {
  
  /* Pido el evaluación de alumno */
  pedirEvaluaciónAlumno(alumno, evaluaciones);

  /* Mostrar evaluación Alumno */
  verEvaluaciónAlumno();
  $('#codigoAlumno').val(alumno);
}

function pedirEvaluaciónAlumno(alumno, evaluaciones) {

  /* Datos que enviare para la peticion de la evaluación */
  let formData = new FormData();
  formData.append('codalu', alumno);
  formData.append('codevaluación', evaluación);

  /* Peticion del practico */
  let peticion = new XMLHttpRequest();
  peticion.open("POST", "evaluacion_alumnos.php?op=grpwa", false);
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
            evaluacionPreguntas = jsonData['preguntas'];
            evaluacionRespuesta = jsonData['respuestas'];
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

function verEvaluacionesAlumno() {
  informacionEvaluación();
  limpiarPreguntas();
  mostrarPreguntas();
  $('.contenedor-table-filtrada').css('display', 'none');
  $('.grid-2.grid-2__alumno').css('display', 'grid');
  $('.evaluación-alumno').css('display', 'block');
}

function atrasEvaluacionAlumno() {
  $('.evaluación-alumno').css('display', 'none');
  $('.contenedor-table-filtrada').css('display', 'block');
}

function informacionEvaluacion() {
  $('.evaluacion__nombre input').val(nombreAlumno);
  $('.evaluacion__curso input').val(cursoAlumno);
  $('.evaluacion__materia input').val(materiaAlumno);
  $('.evaluacion__nota input').val(notaAlumno);

}

function mostrarPreguntas() {
  let nro = 1;
  limpiarPreguntasAlumnos();
  evaluaciónPreguntas.forEach( (pregunta, i ) => {
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
  if( evaluaciónPreguntas.length > 0 ) {
    /* Variable donde retornare la respuesta */  
    let respuestaRetornar;
    evaluaciónRespuesta.forEach((respuesta, i) => {
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

function cancelarEvaluación() {
  $('.evaluacion-nuevo').css("display", "none");
  $('.evaluaciones').css("display", "block");
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
function obtenerEvaluaciones(){

var codmat=$('#seleccionar_materia').val();
  $.post("evaluaciones_json.php?op=obtenerEvaluaciones",
    {codcur:curso,codpar:paralelo,codmat:codmat},
    (datos,estado,xhr)=>{
      let status = datos ["status"];
      if (status == "ok") {
        listaEvaluaciones = datos ["evaluaciones"];
        
        listaPreguntas = datos ["preguntas"];
        opciones = datos ["opciones"];
        verEvaluaciones();
      }
    },'json');
}
$(document).ready(function() {
  $('.contenedor-table-alumno').css('display', 'none');
  $('#seleccionar_curso').change( ()=> {
    $('.evaluacion-nuevo').css("display", "none");
    if($('#seleccionar_curso').val() != 0) {
      $('.contenedor-table-general').css("display", "none");
      $('.contenedor-table-filtrada').css("display", "none");
      $('#tabla-respuestas').css("display", "none");
      var index = $('#seleccionar_curso').val();
      curso = listaCursos[index-1]['codcur'];
      paralelo = listaCursos[index-1]['codpar'];
      nombre_curso_seleccionado = listaCursos[index-1].nombre;
      obtenerMaterias(curso, paralelo);
      obtenerCelulares();
    } else {
      $('.contenedor-table-general').css("display", "none");
      $('.contenedor-table-filtrada').css("display", "none");
      $('#tabla-respuestas').css("display", "none");
      $('#seleccionar_materia').html('<option value="0"> -- Seleccionar materia -- </option>');
    }
  })
  
  $('#seleccionar_materia').change( ()=> {
    $('.evaluacion-nuevo').css("display", "none");
    $('.btn-nuevo').css("display", "block");
    if($('#seleccionar_materia').val() != 0) {
      $('#tabla-respuestas').css("display", "none");
      nombre_materia_seleccionada = $('select[name="seleccionar_materia"] option:selected').text();
      obtenerEvaluaciones();
    } else {
      $('.contenedor-table-general').css("display", "none");
      $('.contenedor-table-filtrada').css("display", "none");
      $('.evaluacion-nuevo').css("display", "none");
      $('#tabla-respuestas').css("display", "none");
    }
  })
  
  document.querySelector('#guardarNotaAlumnoBtn').addEventListener('click', guardarNotaAlumno);

  $('#btnAtrasAlumnosBtn').click(()=>verEvaluaciones());
  $('#btnAtrasPreguntasBtn').click(()=>preguntasEvaluacion(coddeeva));

});