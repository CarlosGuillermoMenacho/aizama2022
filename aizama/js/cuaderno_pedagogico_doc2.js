/* Variable */

var listaCursos=[];

var listaMaterias=[];

var listaDataSeleccionado=[];

var listaDataAlumnos=[];

var paralelo;

var curso;

let materia;
let materia_selected;
let lista_eval_escrito = [];

let lista_eval_seleccion = [];
let lista_mixta = [];

let lista_practico_digital = [];

let lista_practico_web = [];

let lista_notas = [];

let trimestre;

let anio_escolaridad;

let nivel_escolar;

let lista_indicadores = [];
/* Peticiones */

let data_asistencias = "";

$.post("obtener_curso_json.php?op=cp",function(respuesta){

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
const imprimir = ()=>{
    PrintElem('tabla_general');
}
function PrintElem(elem)
{
    var mywindow = window.open('', 'PRINT', 'height=800,width=700');

    mywindow.document.write('<html><head><title>Cuaderno Pedagógico</title>');
    mywindow.document.write('</head><link rel="stylesheet" href="css/style_print1.css"><body style="text-align: center;">');
    mywindow.document.write(`<div class="cabecera">
                                <div></div>
                                <div><h1>CUADERNO PEDAGÓGICO</h1></div>
                                <div class="div_img"><img src="images/logo.png"></div>
                            </div>`);
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write(`
                                <div style="margin-top: 80px;">
                                    <div class="firma_profesor_div">
                                        ${$('#user').text()}
                                        <br>
                                        <strong>Profesor</strong>
                                    </div>
                                </div>
                            </body></html>`);

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    //mywindow.print();
    //mywindow.close();

    return true;
}
const obtenerCuaderno = ()=>{
    materia_selected = $('#seleccionar_materia option:selected').text();
    $.post(

            'controlador/cuaderno_pedagogico_controlador.php?op=get_cuaderno_doc',

            {codcur:curso,codpar:paralelo,codmat:materia},

            data =>{

                if(data.status === "ok"){

                    lista_eval_escrito = data.lista.eval_escrito;

                    lista_eval_seleccion = data.lista.eval_seleccion;
                    lista_eval_mixta = data.lista.eval_mixta;
                    lista_practico_digital = data.lista.practico_digital;

                    lista_practico_web = data.lista.practico_web;

                    lista_notas = data.lista.lista_notas;

                    trimestre = data.lista.trimestre;

                    anio_escolaridad = data.lista.anio_escolaridad;

                    nivel_escolar = data.lista.nivel;
                    lista_indicadores = data.lista.indicadores;

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
        let __nro = nro - lista_practico_digital.length;

        let pract_web = lista_practico_web[__nro];

        let descripcion = pract_web.descripcion;
        Swal.fire(`<div class="data_practico"><h1>Pr&aacute;ctico ${nro + 1}</h1><p>${descripcion}</p></div>`);

    }

    

}
const data_eval = nro =>{

    if(nro < lista_eval_seleccion.length){

        let practico = lista_eval_seleccion[nro];

        let descripcion = practico.descrip;

        Swal.fire(`<div class="data_practico"><h1>Evaluaci&oacute;n ${nro + 1}</h1><p>${descripcion}</p></div>`);

    }else if(nro < lista_eval_escrito.length + lista_eval_seleccion.length){

        let __nro =   nro - lista_eval_seleccion.length;

        let pract_web = lista_eval_escrito[__nro];

        let descripcion = pract_web.descripcion;

        Swal.fire(`<div class="data_practico"><h1>Evaluaci&oacute;n ${nro + 1}</h1><p>${descripcion}</p></div>`);
    }else{
        let __nro =   nro - lista_eval_seleccion.length - lista_eval_escrito.length;

        let pract_web = lista_eval_mixta[__nro];

        let descripcion = pract_web.descripcion;

        Swal.fire(`<div class="data_practico"><h1>Evaluaci&oacute;n ${nro + 1}</h1><p>${descripcion}</p></div>`);
    }

    

}
const getIndicadorText = (codigo,tipo,index) => {
    for (var i = 0; i < lista_indicadores.length; i++) {
        if(lista_indicadores[i].codigo == codigo && lista_indicadores[i].tipo == tipo)return lista_indicadores[i].indicador == ""?index:lista_indicadores[i].indicador;
    }
    return index;
}
const getIndicadorPD = index =>{
    if(index >= lista_practico_digital.length){
        let codcuest = lista_practico_web[index - lista_practico_digital.length].id;
        return getIndicadorText(codcuest,2,`P${index + 1}`);
    }else{
        let codcuest = lista_practico_digital[index].cod_cuest;
        return getIndicadorText(codcuest,1,`P${index + 1}`);
    }
}
const mostrarCuaderno = ()=>{

    let ndp = lista_practico_digital.length + lista_practico_web.length; //Número de prácticos

    let nde = lista_eval_escrito.length + lista_eval_seleccion.length + lista_eval_mixta.length; // Número de evaluaciones


    let cmp = "";

    for(let i = 0 ; i < nde ; i++){
        let text_indicador = getIndicador_evaluacion(i);
        cmp = `${cmp}<td onclick="data_eval(${i});"><spam class="data_pract vertical">${text_indicador}</spam></td>`;

    }

    if(cmp===""){

        cmp = "<td>&nbsp;</td>";

    }

    for(let i = 0 ; i < ndp ; i++){
        let text_indicador = getIndicadorPD(i);
        cmp = `${cmp}<td><spam class="data_pract vertical" onclick="data_practico(${i});">${text_indicador}</spam></td>`;

    }

    if(ndp === 0){

        cmp = `${cmp}<td>&nbsp;</td>`;

        ndp=1;

    }

    if(nde ===0)nde = 1;

    $("#header_table").empty();

    $("#header_table").append(

                                `<tr>
                                    <td colspan="2" style="text-align:left;">Nivel: ${nivel_escolar}</td>

                                    <td colspan="${nde + ndp + 4}">Evaluaci&oacute;n del Maestro</td>

                                    <td colspan="2">Autoeval</td>

                                    <td rowspan="5"><div class="vertical">Promedio Trimestral</div></td>

                                </tr>

                                <tr>
                                    <td colspan="2" style="text-align:left;">Año de Escolaridad : ${anio_escolaridad}</td>

                                    <td rowspan="4"><div class="vertical">SER/10</div></td>

                                    <td rowspan="3" colspan="${nde}">SABER/35</td>

                                    <td rowspan="4"><div class="vertical">Promedio</div</td>

                                    <td colspan="${ndp}" rowspan="3">HACER/35</td>

                                    <td rowspan="4"><div class="vertical">Promedio</div></td>

                                    <td rowspan="4"><div class="vertical">Decidir/10</div></td>

                                    <td rowspan="4"><div class="vertical">Ser/5</div></td>

                                    <td rowspan="4"><div class="vertical">Decidir/5</div></td>

                                </tr>
                                <tr>
                                    <td colspan="2" style="text-align:left;">Trimestre : ${trimestre}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="text-align:left;">Materia : ${materia_selected}</td>
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

            cmp = `${cmp}<td style="text-align:center;">${nota}</td>`;

        });

        al.nota_eval_escrito.forEach(nota=>{

            cmp = `${cmp}<td style="text-align:center;">${nota}</td>`;

        });
        al.nota_eval_mixta.forEach(nota=>{
            cmp = `${cmp}<td style="text-align:center;">${nota}</td>`;
        });
        if(cmp === "")cmp = "<td>&nbsp;</td>";

        cmp = `${cmp}<td style="text-align:center;">${promedio_saber}</td>`;

        al.nota_practico_digital.forEach(nota=>{

            cmp = `${cmp}<td style="text-align:center;">${nota}</td>`;

        });

        al.nota_practicos_web.forEach(nota=>{

            cmp = `${cmp}<td style="text-align:center;">${nota}</td>`;

        });

        if(ndp === 0)cmp = `${cmp}<td>&nbsp;</td>`;

        cmp = `${cmp}<td style="text-align:center;">${promedio_hacer}</td>`;

        $('#campos').append(

                            `<tr>

                                <td style="text-align:center;">${index}</td>

                                <td class="nombreAlumno">${nombreAlumno}</td>

                                <td style="text-align:center;">${ser}</td>

                                ${cmp}

                                <td style="text-align:center;">${decidir}</td>

                                <td style="text-align:center;">${auto_ser}</td>

                                <td style="text-align:center;">${auto_decidir}</td>

                                <td style="text-align:center;">${notaFinal}</td>

                            </tr>`
                           );
        index++;
    });
    $('#btn-select-pendientes').addClass('selected');
    $('#btn-select-presentados').removeClass('selected');
    $('#div_buttons').css('display',"block");
    $('#div_buttons_asistencia').css('display',"none");
    $('.contenedor-table-general').css("display", "block");

}
const getIndicador_evaluacion = nro => {
    if(nro < lista_eval_seleccion.length){

        let codeva = lista_eval_seleccion[nro].id;
        return getIndicadorText(codeva,3,`E${nro + 1}`);

    }else if(nro < lista_eval_escrito.length + lista_eval_seleccion.length){

        let __nro =   nro - lista_eval_seleccion.length;

        let codeva = lista_eval_escrito[__nro].id;

        return getIndicadorText(codeva,4,`E${nro + 1}`);
    }else{
        let __nro =   nro - lista_eval_seleccion.length - lista_eval_escrito.length;
        console.log(__nro);
        let codeva = lista_eval_mixta[__nro].id;
        return getIndicadorText(codeva,5,`E${nro + 1}`);
    }
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

        __fechas = `${__fechas}<td><div class="vertical">${__fecha}</div></td>`;
        __dias = `${__dias}<td>${__dia}</td>`;

    });

    $('#header_table').append(
                                   `<tr>
                                      <td colspan="3">Colegio Particular Aizama</td>

                                      <td colspan="${fechas.length + 3}">REGISTRO DE ASISTENCIAS - GESTION ESCOLAR ${anio}</td>

                                    </tr>

                                    <tr>

                                        <td colspan="3">Maestro: ${profesor} </td>

                                        <td colspan="${fechas.length + 3}">Área: ${materia}</td>


                                    </tr>

                                    <tr>
                                        <td>&nbsp;</td>
                                        <td colspan="2">${nivel}</td>

                                        <td colspan="${fechas.length}">ASISTENCIA</td>

                                        <td rowspan="4"><div class="vertical">ATRASOS</div></td>
                                        <td colspan="2" rowspan="2"><div class="vertical">AUSENCIAS</div></td>

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
                                      <td><div class="vertical">FECHA</div></td>
                                      ${__fechas}
                                      <td rowspan="2"><div class="vertical">C/L</div></td>
                                      <td rowspan="2"><div class="vertical" >S/L</div></td>
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
            __reg = `${__reg}<td style="text-align:center;">${fila}</td>`;
        });
        campos = `${campos}
                        <tr>

                            <td style="text-align:center;">${index}</td>

                            <td colspan="2">${asistencias[codalu].nombre}</td>

                            ${__reg}

                            <td style="text-align:center;">${asistencias[codalu].atrasos}</td>

                            <td style="text-align:center;">${asistencias[codalu].licencias}</td>

                            <td style="text-align:center;">${asistencias[codalu].faltas}</td>

                        </tr>`;
        index++;
    });
    

    $('#btn-select-pendientes').removeClass('selected');
    $('#btn-select-presentados').addClass('selected');
    $('#btn_asistencia_materia').addClass('selected');
    $('#btn_asistencia_diaria').removeClass('selected');
    $('#div_buttons_asistencia').css('display',"block");
    $('#campos').append(campos);


}
const show_detalle = (e,index,codalu)=>{
    
    let detalle = data_asistencias.asistencias_diarias[codalu].asistencias[index][1];
    let text_detalle = "";
    detalle.forEach(fila =>{
        
        text_detalle = `${text_detalle}<strong>${fila[0]}</strong>: ${fila[1]}<br>`;

    });

    let div_popup = document.createElement('div');
    div_popup.classList.add('div-popup');
    div_popup.innerHTML = `<h2 class="titulo-popup">Detalle:</h2>
                            <p class="detalle">
                              ${text_detalle}
                            </p>`;
    div_popup.style = `
        position: absolute;
        width: 150px;
        border-radius: 5px;
        background: whitesmoke;
        padding: 5px;
        text-align: left;
        box-shadow: 0 3px 10px rgb(10 37 64 / 40%);
        z-index: 10;
    `;
    e.append(div_popup);
    setTimeout(() => {
        e.removeChild(div_popup);
    }, "5000")
    //console.log(data_elem);
}
const mostrarAsistenciasDiarias = data =>{
    let anio_escolaridad = data.anio_escolaridad;
    let asistencias = data.asistencias_diarias;
    let fechas = data.fechas_diarias;
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

        __fechas = `${__fechas}<td><div class="vertical">${__fecha}</div></td>`;
        __dias = `${__dias}<td>${__dia}</td>`;

    });

    $('#header_table').append(
                                   `<tr>
                                      <td colspan="3">Colegio Particular Aizama</td>

                                      <td colspan="${fechas.length + 3}">REGISTRO DE ASISTENCIAS - GESTION ESCOLAR ${anio}</td>

                                    </tr>

                                    <tr>

                                        <td colspan="3">Maestro: ${profesor} </td>

                                        <td colspan="${fechas.length + 3}">Asistencias Diarias</td>


                                    </tr>

                                    <tr>
                                        <td>&nbsp;</td>
                                        <td colspan="2">${nivel}</td>

                                        <td colspan="${fechas.length}">ASISTENCIA</td>

                                        <td rowspan="4"><div class="vertical">ATRASOS</div></td>
                                        <td colspan="2" rowspan="2"><div class="vertical">AUSENCIAS</div></td>

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
                                      <td><div class="vertical">FECHA</div></td>
                                      ${__fechas}
                                      <td rowspan="2"><div class="vertical">C/L</div></td>
                                      <td rowspan="2"><div class="vertical" >S/L</div></td>
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
        let position_fecha = 0;
        __asis.forEach(fila =>{
            if(fila != ""){
                __reg = `${__reg}<td style="text-align:center;cursor:pointer;" onclick="show_detalle(this,${position_fecha},${codalu})">${fila[0]}</td>`;
            }else{
                __reg = `${__reg}<td style="text-align:center;"></td>`;
            }
            position_fecha++;
        });
        campos = `${campos}
                        <tr>

                            <td style="text-align:center;">${index}</td>

                            <td colspan="2">${asistencias[codalu].nombre}</td>

                            ${__reg}

                            <td style="text-align:center;">${asistencias[codalu].atrasos}</td>

                            <td style="text-align:center;">${asistencias[codalu].licencias}</td>

                            <td style="text-align:center;">${asistencias[codalu].faltas}</td>

                        </tr>`;
        index++;
    });
    

    $('#btn-select-pendientes').removeClass('selected');
    $('#btn-select-presentados').addClass('selected');
    $('#btn_asistencia_materia').removeClass('selected');
    $('#btn_asistencia_diaria').addClass('selected');
    $('#div_buttons_asistencia').css('display',"block");
    $('#campos').append(campos);


}
const get_asistencia = ()=>{
    /*if(data_asistencias != ""){
        mostrarAsistencias(data_asistencias);
        return;
    }*/

    $.post(
            'controlador/cuaderno_pedagogico_controlador.php?op=reg_asistencia_doc',
            {codcur:curso,codpar:paralelo,codmat:materia},
            data =>{
                if(data.status == "eSession")location.href = 'docentes.php';
                if (data.status == "ok") {
                    data_asistencias = data;
                    mostrarAsistencias(data);
                }
            },
            "json"
            );
}

$(document).ready(function() {

  //  $('.contenedor-table-general').css("display", "block");
  $('#btn_asistencia_diaria').click(()=>mostrarAsistenciasDiarias(data_asistencias));
  $('#btn_asistencia_materia').click(()=>get_asistencia());

  $('#seleccionar_curso').change(function() {

    $('.contenedor-table-general').css('display', 'none');

    if( $('#seleccionar_curso').val() !== 0 ) {

        var index = $('#seleccionar_curso').val();

        curso = listaCursos[index-1]['codcur'];

        paralelo = listaCursos[index-1]['codpar'];

        obtenerMateria(curso, paralelo);

    } else {

      $('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');

    }

  });



  $('#seleccionar_materia').change(function() {

    $('.contenedor-table-general').css('display', 'none');

    $('#select2-seleccionar_lista-container').text("-- Seleccione tipo lista --");

     $('.contenedor-table-general').css("display", "none");

    if( $('#seleccionar_materia').val() !== 0 ) {

      materia = $('#seleccionar_materia').val();

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







