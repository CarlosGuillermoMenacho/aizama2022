/* Variable */

var listaCursos=[];

var listaMaterias=[];

var listaDataSeleccionado=[];

var listaDataAlumnos=[];

var paralelo;

var curso;

let materia;

let lista_eval_escrito = [];

let lista_eval_seleccion = [];

let lista_practico_digital = [];

let lista_practico_web = [];

let lista_notas = [];

let trimestre;

let anio_escolaridad;



/* Peticiones */

/*$.post("obtener_curso_json.php?op=cp",function(respuesta){

  var jsonDataCursos = JSON.parse(respuesta);

    if (jsonDataCursos['status'] == 'ok') {

        listaCursos = jsonDataCursos['cursos'];

        for (let i = 0; i < listaCursos.length; i++) {

          var cursos = listaCursos[i]['nombre']; 

          $("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');

          $('.grid-2').css('display','grid');

      }

  }

  if(jsonDataCursos['status'] =='eSession') {

    location.href = 'docentes.php';

    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

    return;

  }

});
*/


/*$.post("obtener_materias_json.php?op=getmatprof",function(respuesta){

  var jsonDataMaterias = JSON.parse(respuesta);

  if (jsonDataMaterias['status'] == 'ok') {

    listaMaterias = jsonDataMaterias['materias'];

  }

  if(respuesta=='eSession') {

    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

    return false;

  }

});*/
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

const obtenerCuaderno = ()=>{

    $.post(

            'controlador/cuaderno_pedagogico_controlador.php?op=get_cuaderno_doc',

            {codcur:curso,codpar:paralelo,codmat:materia},

            data =>{

                if(data.status === "ok"){

                    lista_eval_escrito = data.lista.eval_escrito;

                    lista_eval_seleccion = data.lista.eval_seleccion;

                    lista_practico_digital = data.lista.practico_digital;

                    lista_practico_web = data.lista.practico_web;

                    lista_notas = data.lista.lista_notas;

                    trimestre = data.lista.trimestre;

                    anio_escolaridad = data.lista.anio_escolaridad;

                    mostrarCuaderno();

                }

                if(data.status === "eSession")location.href = 'docentes.php';

            },

            "json"

          );

}

const data_practico = nro =>{

    if(nro < lista_practico_digital.length){

        let practico = lista_practico_digital[nro];

        let descripcion = practico.descrip;

        Swal.fire(`<div class="data_practico"><h1>Pr&aacute;ctico ${nro + 1}</h1><p>${descripcion}</p></div>`);

    }else{
        let __nro = lista_practico_digital.length - nro;

        let pract_web = lista_practico_web[__nro];

        let descripcion = pract_web.descrip;
        Swal.fire(`<div class="data_practico"><h1>Pr&aacute;ctico ${nro + 1}</h1><p>${descripcion}</p></div>`);

    }

    

}
const data_eval = nro =>{

    if(nro < lista_eval_seleccion.length){

        let practico = lista_eval_seleccion[nro];

        let descripcion = practico.descrip;

        Swal.fire(`<div class="data_practico"><h1>Evaluaci&oacute;n ${nro + 1}</h1><p>${descripcion}</p></div>`);

    }else{

        let __nro = nro - lista_eval_seleccion.length ;

        let pract_web = lista_eval_escrito[__nro];

        let descripcion = pract_web.descripcion;

        Swal.fire(`<div class="data_practico"><h1>Evaluaci&oacute;n ${nro}</h1><p>${descripcion}</p></div>`);
    }

    

}
const mostrarCuaderno = ()=>{

    let ndp = lista_practico_digital.length + lista_practico_web.length; //Número de prácticos

    let nde = lista_eval_escrito.length + lista_eval_seleccion.length; // Número de evaluaciones

    let cmp = "";

    for(let i = 0 ; i < nde ; i++){

        cmp = `${cmp}<td "data_pract" onclick="data_eval(${i});"><spam>E${ i + 1 }</spam></td>`;

    }

    if(cmp===""){

        cmp = "<td>&nbsp;</td>";

    }

    for(let i = 0 ; i < ndp ; i++){

        cmp = `${cmp}<td><spam class="data_pract" onclick="data_practico(${i});">P${ i + 1 }</spam></td>`;

    }

    if(ndp === 0){

        cmp = `${cmp}<td>&nbsp;</td>`;

        ndp=1;

    }

    if(nde ===0)nde = 1;

    $("#header_table").empty();

    $("#header_table").append(

                                `<tr>

                                    <td colspan="2">Año de Escolaridad : ${anio_escolaridad}</td>

                                    <td colspan="${nde + ndp + 4}">Evaluacion del Maestro</td>

                                    <td colspan="2">Autoeval</td>

                                    <td rowspan="3"><div class="vertical">Promedio Trimestral</div></td>

                                </tr>

                                <tr>

                                    <td colspan="2">Trimestre: ${trimestre}</td>

                                    <td rowspan="2"><div class="vertical">SER/10</div></td>

                                    <td colspan="${nde}">SABER/35</td>

                                    <td rowspan="2"><div class="vertical">Promedio</div</td>

                                    <td colspan="${ndp}">HACER/35</td>

                                    <td rowspan="2"><div class="vertical">Promedio</div></td>

                                    <td rowspan="2"><div class="vertical">Decidir/10</div></td>

                                    <td rowspan="2"><div class="vertical">Ser/5</div></td>

                                    <td rowspan="2"><div class="vertical">Decidir/5</div></td>

                                </tr>

                                <tr>

                                    <td>Nro.</td>

                                    <td>Apellidos y Nombres</td>

                                    ${cmp}

                                </tr>`

                             );

    $('#campos').empty();

    let index = 1;

    lista_notas.forEach(al =>{

        let nombreAlumno = al.nombre;

        let notaFinal = al.nota_final;

        let promedio_hacer = al.promedio_hacer;

        let promedio_saber = al.promedio_saber;

        let auto_ser = al.autoeval.ser;

        let auto_decidir = al.autoeval.decidir;

        let ser = al.ser_decidir.ser;

        let decidir = al.ser_decidir.decidir;

        

        let cmp = "";

        al.nota_eval_seleccion.forEach(nota=>{

            cmp = `${cmp}<td>${nota}</td>`;

        });

        al.nota_eval_escrito.forEach(nota=>{

            cmp = `${cmp}<td>${nota}</td>`;

        });

        if(cmp === "")cmp = "<td>&nbsp;</td>";

        cmp = `${cmp}<td>${promedio_saber}</td>`;

        al.nota_practico_digital.forEach(nota=>{

            cmp = `${cmp}<td>${nota}</td>`;

        });

        al.nota_practicos_web.forEach(nota=>{

            cmp = `${cmp}<td>${nota}</td>`;

        });

        if(ndp === 0)cmp = `${cmp}<td>&nbsp;</td>`;

        cmp = `${cmp}<td>${promedio_hacer}</td>`;

        $('#campos').append(

                            `<tr>

                                <td>${index}</td>

                                <td class="nombreAlumno">${nombreAlumno}</td>

                                <td>${ser}</td>

                                ${cmp}

                                <td>${decidir}</td>

                                <td>${auto_ser}</td>

                                <td>${auto_decidir}</td>

                                <td>${notaFinal}</td>

                            </tr>`
                           );
        index++;
    });
    $('#btn-select-pendientes').addClass('selected');
    $('#btn-select-presentados').removeClass('selected');
    $('#div_buttons').css('display',"block");

    $('.contenedor-table-general').css("display", "block");

}
const mostrarAsistencias = data =>{
    let anio_escolaridad = data.anio_escolaridad;
    let asistencias = data.asistencias;
    let fechas = data.fechas;
    let materia = data.materia;
    let mes = data.mes;
    let nivel = data.nivel;
    let profesor = data.profesor;
    let trimestre = data.trimestre;
    let anio = data.anio;
    $('#header_table').empty();
    $('#campos').empty();
    let __fechas = "";
    let __dias = "";

    fechas.forEach(fila =>{
        let __fecha = fila.fecha;
        let __dia = fila.dia;

        __fechas = `${__fechas}<td class="vertical">${__fecha}</td>`;
        __dias = `${__dias}<td>${__dia}</td>`;

    });

    $('#header_table').append(
                                   `<tr>
                                      <td colspan="3">Colegio Particular Aizama</td>

                                      <td colspan="${fechas.length + 3}">REGISTRO DE ASITENCIA - GESTION ESCOLAR ${anio}</td>

                                    </tr>

                                    <tr>

                                        <td colspan="3">Maestro: ${profesor} </td>

                                        <td colspan="${fechas.length + 3}">Área: ${materia}</td>


                                    </tr>

                                    <tr>
                                        <td>&nbsp;</td>
                                        <td colspan="2">${nivel}</td>

                                        <td colspan="${fechas.length}">ASISTENCIA</td>

                                        <td class="vertical" rowspan="4">ATRASOS</td>
                                        <td class="vertical" colspan="2" rowspan="2">AUSENCIAS</td>

                                    </tr>
                                    <tr>
                                      <td>&nbsp;</td>
                                      <td>AÑO DE ESCOLARIDAD: ${anio_escolaridad}</td>
                                      <td>MES</td>
                                      <td colspan="${fechas.length}">${mes}</td>

                                    </tr>
                                    <tr>
                                      <td>&nbsp;</td>
                                      <td>TRIMESTRE: ${trimestre}</td>
                                      <td class="vertical">FECHA</td>
                                      ${__fechas}
                                      <td class="vertical" rowspan="2">C/L</td>
                                      <td class="vertical" rowspan="2">S/L</td>
                                    </tr>
                                    <tr>
                                      <td>Nro.</td>
                                      <td colspan="2">APELLIDOS Y NOMBRES</td>
                                      ${__dias}

                                    </tr>`
                            );
    let campos = "";
    let index = 1;
    data.codigos.forEach( codalu =>{
        let __asis = asistencias[codalu].asistencias;
        let __reg = "";

        __asis.forEach(fila =>{
            __reg = `${__reg}<td>${fila}</td>`;
        });
        campos = `${campos}
                        <tr>

                            <td>${index}</td>

                            <td colspan="2">${asistencias[codalu].nombre}</td>

                            ${__reg}

                            <td>${asistencias[codalu].atrasos}</td>

                            <td>${asistencias[codalu].licencias}</td>

                            <td>${asistencias[codalu].faltas}</td>

                        </tr>`;
        index++;
    });
    

    $('#btn-select-pendientes').removeClass('selected');
    $('#btn-select-presentados').addClass('selected');

    $('#campos').append(campos);


}
function obtenerNivel(){
  for (var i = 0; i < listaCursos.length; i++) {
    if (listaCursos[i].codcur==curso)
      return listaCursos[i].nivel;
  }
  return "";
}
function cargarMaterias(){

  curso=$("#seleccionar_Curso").val();
  $('#seleccionar_Materia').empty();
  $('#seleccionar_Materia').append('<option value="0" >-- Seleccionar materia --</option>');
  if (curso>0) {
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

const get_asistencia = ()=>{

    $.post(
            'controlador/cuaderno_pedagogico_controlador.php?op=reg_asistencia_doc',
            {codcur:curso,codpar:paralelo,codmat:materia},
            data =>{
                if(data.status == "eSession")location.href = 'docentes.php';
                if (data.status == "ok") {
                    mostrarAsistencias(data);
                }
            },
            "json"
            );
}

$(document).ready(function() {
	 cargarSelects();
	  $("#seleccionar_Curso").change(()=>{cargarMaterias()});

    //$('.contenedor-table-general').css("display", "block");

  /*$('#seleccionar_curso').change(function() {

    $('.contenedor-table-general').css('display', 'none');

    if( $('#seleccionar_curso').val() !== 0 ) {

        var index = $('#seleccionar_curso').val();

        curso = listaCursos[index-1]['codcur'];

        paralelo = listaCursos[index-1]['codpar'];

        obtenerMateria(curso, paralelo);

    } else {

      $('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');

    }

  });*/


  $("#seleccionar_Paralelo").change(()=>{paralelo = $('#seleccionar_Paralelo').val();});
  $('#seleccionar_Materia').change(function() {

    $('.contenedor-table-general').css('display', 'none');

    $('#select2-seleccionar_lista-container').text("-- Seleccione tipo lista --");

     $('.contenedor-table-general').css("display", "none");

    if( $('#seleccionar_materia').val() !== 0 ) {

      materia = $('#seleccionar_Materia').val();

      obtenerCuaderno();

    }



  });

  $('#btn-select-pendientes').click(()=>obtenerCuaderno());

   $('#btn-select-presentados').click(()=>get_asistencia());
});

$(document).on('mouseenter click', '.popup-link', function() {

   var popupContent = $(this).parent('.popup-container').find('.popup-body');

   popupContent.addClass('show-popup');

})



$(document).on('mouseleave', '.popup-body', function() {

   $(".popup-body").removeClass('show-popup');

})



$(document).on('click touch', function(e) {

  if ( !e.target.classList.contains(".popup-body") ) {

    $(".popup-body").removeClass('show-popup');

  }

});



/* Obtiene las materias asignadas al profesor */

function obtenerMateria(curso, paralelo){

  $("#seleccionar_materia").empty();

  $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');

  for(var i = 0 ; i < listaMaterias.length; i++) {

      if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){

        $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');

      }

  }

}







