/* Variable */
var listaCursos=[];
var listaMaterias=[];
var listaDataSeleccionado=[];
var listaDataAlumnos=[];
var paralelo;
var curso;

/* Peticiones */
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

function pedirDatos(tipoLista) {
  /* 
    1: Practicos Web
    2: Practicos
    3: Evaluaciones
    4: Asistencia
  */
  let url;
  switch (tipoLista) {
    case '1':
      url = 'reportes_json.php?op=gnpw';
      break;  
    case '2':
      url = 'reportes_json.php?op=gnpp';      
      break;
    case '3':
      url = 'reportes_json.php?op=gnep';
      break;
    case '4':
      url = 'reportes_json.php?op=glap';
      break;
    default:
      console.log('error');
      break;
  }
  /* Datos enviar a la peticoin */
  const formData = new FormData();
  formData.append('codcur', curso);
  formData.append('codpar', paralelo);
  formData.append('codmat', $('#seleccionar_materia').val());
  /* Peticion para el tipo de lista que selecciono */
  let peticion = new XMLHttpRequest();
  peticion.onreadystatechange = function () {
    if( peticion.readyState == 4) {
      if( peticion.status == 200 ) {
        if( peticion.responseText === 'eSession' ) {
          alert('La session expiro vuelva a ingresar con sus datos');
          return;
        } else if( peticion.responseText === 'noPracticos' || peticion.responseText === '' || peticion.responseText === 'noListaAlumnos' || peticion.responseText === 'noClases' ) {
          $('#buttonExport').css('display', 'none');
          $('.contenedor-table-general').css("display", "none");
          alert('No hay informacion');
          return;
        } else if ( peticion.responseText === 'eSession') {
          alert('La Session ha expirado por favor vuelva a ingresar con sus datos');
        }
        var jsonData = JSON.parse(peticion.responseText);
        if( jsonData['status'] == 'ok' ) {
          listaDataSeleccionado = jsonData['header_tabla'];
          listaDataAlumnos = jsonData['tabla'];
          mostrarTablaData();
          $('.contenedor-table-general').css("display", "block");
          rotateHeaderTable();
        }
      } else {
        alert('error en la peticion');
      }
    }

  }
  peticion.open('POST', url, false);
  peticion.send(formData);
}

$(document).ready(function() {

  $('#seleccionar_curso').change(function() {
    $('.contenedor-table-general').css('display', 'none');
    $('#buttonExport').css('display', 'none');
    $('#seleccionar_lista').val(0);
    $('#select2-seleccionar_lista-container').text("-- Seleccione tipo lista --");
    if( $('#seleccionar_curso').val() != 0 ) {
        var index = $('#seleccionar_curso').val();
        curso = listaCursos[index-1]['codcur'];
        paralelo = listaCursos[index-1]['codpar'];
        obtenerMateria(curso, paralelo);
    } else {
      $('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');
      $('#buttonExport').css('display', 'none');
    }
  });

  $('#seleccionar_materia').change(function() {
    $('.contenedor-table-general').css('display', 'none');
    $('#buttonExport').css('display', 'none');
    $('#seleccionar_lista').val(0);
    $('#select2-seleccionar_lista-container').text("-- Seleccione tipo lista --");
    if( $('#seleccionar_materia').val() != 0 ) {
      $('.grid-3:nth-child(3)').css('display', 'block');
      document.querySelector('.grid-3').lastElementChild.style.display = 'block';
    } else {
      document.querySelector('.grid-3').lastElementChild.style.display = 'none';
    }

  });
  
  $('#seleccionar_lista').change(function() {
    if( $('#seleccionar_curso').val() != 0 && $('#seleccionar_materia').val() != 0 && $('#seleccionar_lista').val() != 0) {
      document.querySelector('#buttonExport').style.display = 'block';
      let tipoLista = $('#seleccionar_lista').val();
      pedirDatos(tipoLista);
    } else if ( $('#seleccionar_lista').val() == 0 ) {
      $('.contenedor-table-general').css('display', 'none');
      $('#buttonExport').css('display', 'none');
    }
  });

  /* ButtonExport */
  $('#buttonExport').bind('click', function () {
    cargarExcel();  
  });

});

/* Funciones */
function mostrarTablaData() {
  $('#campos').children().remove();
  $('#header_table').children().remove();
  /* Header de la tabla */
  $('#header_table').append(`
      <th>Nro</th>
      <th>Nombre</th>
  `);
  listaDataSeleccionado.forEach( header => {
    const { titulo } = header;
    $('#header_table').append(`
      <th style="color:white;font-weight:normal; padding:10px; position:relative;"><span class="rotate">${titulo}</span></th>
      `); 
  });

  /* Filas de la tabla */
  let row;
  listaDataAlumnos.forEach( alumno => {
    row = '<tr>'
    alumno.forEach( (campo, index) => {
      let dataLabel = document.querySelector('#header_table').children[index].textContent;
      row += `<td data-label="${dataLabel}">${campo}</td>`
    });
    row += '</tr>'
    $('#campos').append(row);
  });
}

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

/* Obtiene todos los datos Practicos, Examenes, Asistencia */
async function cargarExcel() {
  
  cleanContainerTable();
  const select = document.querySelector('#seleccionar_lista').children;
  try {
    await Promise.all( Array.from(select).map( async (select, index) => {
      if( select.value !== "0" ) {
        const dataTable = await getDataTablaExcel(select.value); 
        /* Si el length es mayor a 100 es un JSON */
        if( dataTable.length > 100  ) {
            const jsonData = JSON.parse(dataTable);
            renderTablaExcel(jsonData, index);
        }   
        
      }
    })); 
  } catch (error) {
    console.log(error);
  }
  const tableExcelExport = document.querySelectorAll(".container-table-excel table");
  const table2excel = new Table2Excel();
  const nameDocument = `${$('#seleccionar_curso option:selected').text()} - ${$('#seleccionar_materia option:selected').text()}`;
  table2excel.export(tableExcelExport, nameDocument);
}
function getDataTablaExcel(selectValue) {
  let url;
  switch (selectValue) {
    case '1':
      url = 'reportes_json.php?op=gnpw';
      break;  
    case '2':
      url = 'reportes_json.php?op=gnpp';      
      break;
    case '3':
      url = 'reportes_json.php?op=gnep';
      break;
    case '4':
      url = 'reportes_json.php?op=glap';
      break;
    default:
      console.log('error');
      break;
  }
  /* Datos enviar a la peticoin */
  const formData = new FormData();
  formData.append('codcur', curso);
  formData.append('codpar', paralelo);
  formData.append('codmat', $('#seleccionar_materia').val());
  return new Promise( (resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then( response => response.text())
      .then( data => resolve(data))
      .catch( error => reject(error)  )
  });
}

function renderTablaExcel(dataTabla, index) {
  let dataSetTable;
  switch (index) {
    case 1:
      dataSetTable = 'Practicos';
      break;
    case 2: 
      dataSetTable = 'Evaluaciones';
      break;
    case 3: 
      dataSetTable = 'Asistencia';
      break;
    default:
      dataSetTable = 'Error';
      break;
  }

  const container = document.querySelector('.container-table-excel');
  const template = document.querySelector('#templateTableExcel').content;
  const cloneTemplate = template.cloneNode(true);
  const fragment = document.createDocumentFragment();

  /* Name Hoja Excel */
  cloneTemplate.querySelector('table').setAttribute('data-excel-name', dataSetTable);

  /* Header Inicial */
  const columnNro        = document.createElement('td');
  columnNro.textContent  = 'Nro';
  const columnName       = document.createElement('td');
  columnName.textContent = 'Nombre';
  cloneTemplate.querySelector('#headerExcel').append(columnNro, columnName);

  

  const { header_tabla, tabla } = dataTabla;
  header_tabla.forEach( columnTable => {
    const { titulo }       = columnTable;
    const columnData       = document.createElement('td')
    columnData.textContent = titulo;
    //columnData.dataset.timestamp = titulo;
    cloneTemplate.querySelector('#headerExcel').appendChild(columnData);
  });

  /*  */
  tabla.forEach( alumno => {
    const row      = document.createElement('tr');
    alumno.forEach( data => {
      const td       = document.createElement('td');
      td.textContent = data;
      row.appendChild(td);
    });
    cloneTemplate.querySelector('#bodyExcel').appendChild(row);
  });

  fragment.appendChild(cloneTemplate);
  container.appendChild(fragment);
}

function rotateHeaderTable() {
  let headerHeight = 0;
  const headers90Grados = document.querySelector('.rotate');
  if( headers90Grados.clientWidth > headerHeight ) {
    headerHeight = headers90Grados.clientWidth;
  }
  headers90Grados.style.height = headerHeight;
  headerHeight += 20;
  headers90Grados.parentElement.style.height = `${headerHeight}px`;
}

function cleanContainerTable() {
  const container = document.querySelector(".container-table-excel");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

