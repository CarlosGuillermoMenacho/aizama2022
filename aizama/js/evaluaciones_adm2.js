
/*------Variables-----*/
let listaCursos=[];
let listaParalelos=[];
let listaMaterias=[];
let listaEvaluaciones=[];
let listaPreguntas=[];
let listaOpciones=[];
let listaAlumnos=[];
let listaNotas=[];
var evaluacion;
let codigoCurso;
let codigoParalelo;
let codigoMateria;
let codigoExamen;



function cargarSelects(){
$.post("obtener_curso_json.php?op=ca",function(respuesta){
  var jsonData = JSON.parse(respuesta);
  if (jsonData['status'] == 'ok') {
      let niveles = jsonData['niveles'];
      listaCursos=niveles;
      $("#seleccionar_Curso").empty();
      $("#seleccionar_Curso").append('<option value="0"> -- Seleccionar curso -- </option>');
      for(var i = 0; i < niveles.length; i++ ) {
        $("#seleccionar_Curso").append('<option value ="'+(niveles[i]['codcur'])+'">' + niveles[i]['nombre'] + '</option>');
      }
  }
 
  if(jsonData['status'] == 'eSession') {
    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    return false;
  } else if (jsonData['status'] == 'noMaterias') {
      alert('Este colegio aun no tiene materias');
      
  } else if (jsonData['status'] == 'noPermitido') {
    alert('Esta permitido para los administrador');
  } 

});

$.post("paralelos_json.php",function(respuesta){
  var jsonData = JSON.parse(respuesta);
  if (jsonData['status'] == 'ok') {
      let paralelos = jsonData['paralelos'];
      $("#seleccionar_Paralelo").empty();
      $("#seleccionar_Paralelo").append('<option value="0">-- Seleccionar paralelo--</option>');
      for (var i = 0; i < paralelos.length; i++) {
      	$("#seleccionar_Paralelo").append('<option value="'+(paralelos[i]['codpar'])+'">'+paralelos[i]['nombre']+'</option>');
      }  
  }
  
});

$.post("obtener_materias_json.php?op=ma",function(respuesta){
    var jsonData = JSON.parse(respuesta);
    if (jsonData['status'] == 'ok') {
        let materias = jsonData['materias'];
        listaMaterias=materias; 
    }
});
}

function cargarMaterias(){
  $("#tabla-evaluaciones").css('display','none');
  $("#tabla-preguntas").css('display','none');
  $("#tabla-respuestas").css('display','none');
  $("#tabla-revisar").css('display','none');
  codigoCurso=$("#seleccionar_Curso").val();
  $('#seleccionar_Materia').empty();
  $('#seleccionar_Materia').append('<option value="0" >-- Seleccionar materia --</option>');
  if (codigoCurso>0) {
    let nivel=obtenerNivel();
    for (let i = 0; i < listaMaterias.length; i++) {
      if(nivel == listaMaterias[i]['nivel']){
        var codigoMateria = listaMaterias[i]['codmat'];
        var nombreMateria = listaMaterias[i]['nombre'];
        $('#seleccionar_Materia').append(`<option value="${codigoMateria}" >${nombreMateria}</option>`);
      }
    }
    
  }
}

function obtenerNivel(){
  for (var i = 0; i < listaCursos.length; i++) {
    if (listaCursos[i].codcur==codigoCurso)
      return listaCursos[i].nivel;
  }
  return "";
}

function pedirEvaluaciones(){
  $("#tabla-evaluaciones").css('display','none');
  codigoParalelo=$("#seleccionar_Paralelo").val();
  codigoMateria=$("#seleccionar_Materia").val();
  if (codigoCurso>0 && codigoParalelo>0 && codigoMateria!="0") {
    $.post(
          "evaluaciones_json.php?op=eval_adm2",
          {codcur:codigoCurso,codpar:codigoParalelo,codmat:codigoMateria},
          (datos)=>{
            let status=datos.status;
            if (status=="ok") {
              listaEvaluaciones=datos.lista;
              mostrarEvaluaciones();
            }
          },
          "json"
          )
        }
}

function mostrarEvaluaciones(){
  $("#campos").empty();   
  if (listaEvaluaciones.length>0 ){
  let indice=1;
  listaEvaluaciones.forEach((evaluacion)=>{
    let codexa=evaluacion.codexa;
    let descripcion=evaluacion.descripcion;
    let fechaf=evaluacion.fechaf;
    let fechai=evaluacion.fechai;
    let horaf=evaluacion.horaf;
    let horai=evaluacion.horai;
    $("#campos").append(`<tr>
                          <td data-label="Nro">${indice}</td>
                          <td data-label="Descripción">${descripcion}</td>
                          <td data-label="Fecha fin">${fechaf}</td>
                          <td data-label="Fecha inicio">${fechai}</td>
                          <td data-label="Hora fin">${horaf}</td>
                          <td data-label="Hora inicio">${horai}</td>
                          <td data-label="Opciones">
                            <button id="PregEvaluacion${codexa}">
                              <img src="images/ver.svg" height="50px" alt="icono">
                            </button>
                            <button id="RevisarEvaluacion${codexa}">
                              <img src="images/icon-examen.svg" height="50px" alt="icono">
                            </button>
                          </td>
                        </tr>`);
    indice++;
    document.getElementById(`PregEvaluacion${codexa}`).onclick = () => {
            verPregEvaluacion(`${codexa}`);
    }
    document.getElementById(`RevisarEvaluacion${codexa}`).onclick = () =>{
            verRevisarEvaluacion(`${codexa}`);
    }

  });
  $("#tabla-evaluaciones").css('display','block');
  $("#tabla-preguntas").css('display','none');
  }else{
    $("tabla-evaluaciones").css('display','none');
    $("#tabla-preguntas").css('display','none');
  }
}

function verPregEvaluacion(codexa){
  $("#tabla-evaluaciones").css('display','none');
  $("#tabla-preguntas").css('display','block');
  $.post(
          "evaluaciones_json.php?op=lista_de_preguntas_eval",
          {codexa:codexa},
          (datos)=>{
            let status=datos.status;
            if (status=="ok") {
              listaPreguntas=datos.lista;
              listaOpciones=datos.opciones;
              mostrarPregEvaluaciones();
            }
          },
          "json"
          )
}

function mostrarPregEvaluaciones(){
  $("#camposEvaluaciones").empty();
  let indice=1;
  listaPreguntas.forEach((preguntas)=>{
    let codpre=preguntas.codpre;
    let codexa=preguntas.codexa;
    let pregunta=preguntas.pregunta;
    let respuesta=preguntas.respuesta;
    let tiempo=preguntas.tiempo;
    let dir_imagen=preguntas.dir_imagen!=""?`<td data-label="Imagen"><img style="width:100px" src="resources/${preguntas.dir_imagen}" onclick="verImagen('${preguntas.dir_imagen}');"/></td>`:`<td data-label="Imagen">&nbsp;</td>`;

    let opciones=obtenerOpciones(codpre);
    $("#camposEvaluaciones").append(`<tr>
                                      <td data-label="Nro">${indice}</td>
                                      <td data-label="Preguntas">${pregunta}</td>
                                      ${dir_imagen}
                                      <td data-label="Opcion 1">${opciones[1]}</td>
                                      <td data-label="Opcion 2">${opciones[2]}</td>
                                      <td data-label="Opcion 3">${opciones[3]}</td>
                                      <td data-label="Opcion Correcta">${respuesta}</td>
                                      <td data-label="Tiempo">${tiempo}</td>
                                      
                                    </tr>`);
    indice++;
  });
  $("#tabla-evaluaciones").css('display','none');
  $("#tabla-preguntas").css('display','block');
}
function verImagen(imagen) {
  Swal.fire({
    imageUrl:`resources/${imagen}`
  });
}
function obtenerOpciones(codpre){
  let opciones=[];
  listaOpciones.forEach((opcion)=>{
    if (opcion.codpre==codpre) {
      opciones[opcion.n_opcion]=opcion.opcion;
    }
  });
  return opciones;
}

function cerrarLista(){
  $("#tabla-preguntas").css('display','none');
  $("#tabla-evaluaciones").css('display','block');
}


function verRevisarEvaluacion(codexa){
  $("#tabla-evaluaciones").css('display','none');
  $("#tabla-respuestas").css('display','none');
  
  $("#tabla-revisar").css('display','block');
  $.post(
          "evaluaciones_json.php?op=lista_Alumnos_Evaluaciones&usr=doc",
          {codexa:codexa,codcur:codigoCurso,codpar:codigoParalelo},
          (datos)=>{
            let status=datos.status;
            if (status=="ok") {
              listaAlumnos=datos.lista_de_alumnos;
              listaNotas=datos.lista_de_notas;
              evaluacion=codexa;
              mostrarRevisarEvaluaciones();
            }
          },
          "json"
          )
} 

function mostrarRevisarEvaluaciones(){
  $("#camposRevisar").empty();
  let indice=1;
  listaAlumnos.forEach((alumno)=>{
        let codalu = alumno['codalu'];
        let nombre = alumno['nombre'];
        
        if(evaluado(codalu)){
                let nota = obtenerNota(codalu);
                $('#camposRevisar').append(
                                            `<tr>
                                                <td data-label="No.">${indice}</td>
                                                <td data-label="Nombre" style="text-align:left;">${nombre}</td>
                                                <td data-label="Nota">${nota}</td>
                                                <td data-label="Opcion">
                                                    <button onclick="obtenerEvaluacion(${codalu});">
                                                       <img src="images/ver.svg" style="height:50px"/>
                                                    </button>
                                                 </td>
                                            </tr>`
                                            );
        }else{
            $('#camposRevisar').append(
                                            `<tr>
                                                <td data-label="No.">${indice}</td>
                                                <td data-label="Nombre" style="text-align:left;">${nombre}</td>
                                                <td data-label="Nota">&nbsp</td>
                                                <td data-label="Opción">No Realizado</td>
                                            </tr>`
                                            );
        }
        indice++;
    });
    $('#tabla-evaluaciones').css('display','none');
    $('#tabla-revisar').css('display','block');
}

function evaluado(codalu){
    for (var i = 0; i < listaNotas.length; i++) {
        if(listaNotas[i]['codalu']==codalu)return true;
    }

    return false;
}

function calificado(codalu){
    for (var i = 0; i < listaNotas.length; i++) {
        if(listaNotas[i]['codalu']==codalu&&listaNotas[i]['calificado']==1)return true;
    }

    return false;
}

function obtenerNota(codalu){
    for (var i = 0; i < listaNotas.length; i++) {
        if(listaNotas[i]['codalu']==codalu)return listaNotas[i]['nota'];
    }

    return "";
}
function obtenerEvaluacion(codalu){
document.getElementById('nombre-estudiante').innerHTML=obtenerNombre(codalu);
  $.post("evaluaciones_json.php?op=lista_de_preguntas",
    {codalu:codalu,codexa:evaluacion},
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

function mostrarTablaRespuestas() {
  $('#tabla-revisar').css('display','none');
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

function obtenerOpcion(nro,codpre) {

  console.log(codpre);
  for (var i = 0; i < opciones.length; i++) {
    if(opciones[i].codpre == codpre && opciones[i].n_opcion == nro){
       return opciones[i].opcion;
    }
  }
  return "";
}

function mostrarImagen(resource) {
  Swal.fire({
        imageUrl: 'resources/'+resource
      });
}



function cerrarLista1(){
  $("#tabla-revisar").css('display','none');
  $("#tabla-evaluaciones").css('display','block');
}


$(document).ready(()=>{
  cargarSelects();
  $("#seleccionar_Curso").change(()=>{cargarMaterias()});
  $("#seleccionar_Paralelo").change(()=>{pedirEvaluaciones()});
  $("#seleccionar_Materia").change(()=>{pedirEvaluaciones()});
  $(".btn-1").click(()=>cerrarLista());
  $(".btn").click(()=>cerrarLista1());
  $("#btnAtrasPreguntasBtn").click(()=>verRevisarEvaluacion(evaluacion));
});

