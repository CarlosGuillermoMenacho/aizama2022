const btnGuardar = document.querySelector('#guardarHorario');
const select_curso = document.querySelector('#seleccionar_curso');
const select_paralelo = document.querySelector('#seleccionar_paralelo');
const select_tipo = document.querySelector('#seleccionar_tipo');

let listaHorario = [];
let listaHorarioInfo = [];

let listaCurso = [];
let listaParalelos = [];

/* Mostrar tabla */
function mostrarTabla() {
    document.querySelector('.btn').style.display = 'block';
    $(".contenedor-table-general tbody").children().remove();
    let diaLunes = listaHorarioInfo[0]['dia'];
    let entradaLunes = listaHorarioInfo[0]['entrada'];
    let salidaLunes = listaHorarioInfo[0]['salida'];
    
    let diaMartes = listaHorarioInfo[1]['dia'];
    let entradaMartes = listaHorarioInfo[1]['entrada'];
    let salidaMartes = listaHorarioInfo[1]['salida'];
    
    let diaMiercoles = listaHorarioInfo[2]['dia'];
    let entradaMiercoles = listaHorarioInfo[2]['entrada'];
    let salidaMiercoles = listaHorarioInfo[2]['salida'];
    
    let diaJueves = listaHorarioInfo[3]['dia'];
    let entradaJueves = listaHorarioInfo[3]['entrada'];
    let salidaJueves = listaHorarioInfo[3]['salida'];
    
    let diaViernes = listaHorarioInfo[4]['dia'];
    let entradaViernes = listaHorarioInfo[4]['entrada'];
    let salidaViernes = listaHorarioInfo[4]['salida'];
    
    let diaSabado = listaHorarioInfo[5]['dia'];
    let entradaSabado = listaHorarioInfo[5]['entrada'];
    let salidaSabado = listaHorarioInfo[5]['salida'];
    
    
   
    $('#campos').append(
      `<tr>
        <td data-label="Dia">${diaLunes}</td>
        <td data-label="Entrada"><input value="${entradaLunes}" name="li" type="time"></td>
        <td data-label="Salida"><input value="${salidaLunes}" name="lf" type="time"></td>
      </tr>
      <tr>
        <td data-label="Dia">${diaMartes}</td>
        <td data-label="Entrada"><input value="${entradaMartes}" name="mai" type="time"></td>
        <td data-label="Salida"> <input value="${salidaMartes}" name="maf" type="time"></td>
      </tr>
        <td data-label="Dia">${diaMiercoles}</td>
        <td data-label="Entrada"><input value="${entradaMiercoles}" name="mii" type="time"></td>
        <td data-label="Salida"> <input value="${salidaMiercoles}" name="mif" type="time"></td>
       <tr> 
        <td data-label="Dia">${diaJueves}</td>
        <td data-label="Entrada"><input value="${entradaJueves}" name="ji" type="time"></td>
        <td data-label="Salida"> <input value="${salidaJueves}" name="jf" type="time"></td>
       </tr>
       <tr>
        <td data-label="Dia">${diaViernes}</td>
        <td data-label="Entrada"><input value="${entradaViernes}" name="vi" type="time"></td>
        <td data-label="Salida"> <input value="${salidaViernes}" name="vf" type="time"></td>
       </tr>
       <tr>
        <td data-label="Dia">${diaSabado}</td>
        <td data-label="Entrada"><input value="${entradaSabado}" name="si" type="time"></td>
        <td data-label="Salida"> <input value="${salidaSabado}" name="sf" type="time"></td>
      </tr>`
    );
 

}

/* Cargar Horario */
function cargarHorario(codigoCurso, codigoParalelo) {
  listaHorarioInfo = [];
  let curso = codigoCurso;
  let paralelo = codigoParalelo;
  for (let i = 0; i < listaHorario.length; i++) {
    let codigoCurso = listaHorario[i]['codcur'];
    let codigoParalelo = listaHorario[i]['codpar'];
    let codigoTipo = listaHorario[i]['tipo'];
    if( curso == codigoCurso &&
        paralelo == codigoParalelo ) {
         $('#seleccionar_tipo').val(codigoTipo);
         
      listaHorarioInfo = listaHorario[i]['horario'];
      console.log(listaHorarioInfo);
      mostrarTabla();
    }


  }
}

/* Pedir Horario */
function getPeticionHorarioLista() {
    var peticion =new XMLHttpRequest();
    peticion.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          let respuesta = this.responseText;
          let jsonData = JSON.parse(respuesta);
          if(jsonData['status'] == 'ok') {
            listaHorario = jsonData['lista'];
          } else if(jsonData['status'] == 'noCurso') {
            alert('no hay cursos');
          } else {
            alert('error');
          }
    
    
      } 
    }
    peticion.open('POST', 'hora_col_json.php?op=amd', true);
    peticion.send();
}

function cargarCursos() {
    for(let i = 0; i<listaCursos.length; i++) {
        var codigoCurso = listaCursos[i]['codigo'];
        var nombreCurso = listaCursos[i]['nombre'];
        $('#seleccionar_curso').append(`<option value="${codigoCurso}" >${nombreCurso}</option>`)
    }
}

function cargarParalelos() {
    for(let i = 0; i<listaParalelos.length; i++) {
        var codigoParalelo = listaParalelos[i]['codigo'];
        var nombreParalelo = listaParalelos[i]['nombre'];
        $('#seleccionar_paralelo').append(`<option value="${codigoParalelo}" >${nombreParalelo}</option>`)
    }
}
/* Pedir cursos */
$.post("obtener_cursos_adm.php?op=adm",function(respuesta){
    let response = JSON.parse(respuesta);
    if( response['status'] == 'ok' ) {
        
        listaCursos = response['cursos'];
        cargarCursos();           
    } else {
        alert('No hay cursos');
    }
});
/* Pedir paralelos */
$.post("get_paralelos.php",function(respuesta){
    let response = JSON.parse(respuesta);
    if( response['status'] == 'ok' ) {
        listaParalelos = [];
        listaParalelos = response['paralelos'];
        
    } else {
        alert('No hay paralelos');
    }
});

function guardarHorario() {
  let formData = new FormData($('#registroHorario')[0]);
  console.log(formData);
  var peticion =new XMLHttpRequest();
  peticion.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        if ( this.responseText == 'ok') {
          alert('Horario Grabado');
        }  
    }
  }
  peticion.open('POST', 'hora_col_json.php?op=admsv', false);
  peticion.send(formData);
}


document.addEventListener("DOMContentLoaded", function(event) {
    getPeticionHorarioLista();
  document.querySelector('.btn').style.display = 'none';
  $('#seleccionar_curso').change( () => {
    document.querySelector('.btn').style.display = 'none';
    $('#seleccionar_paralelo').html('<option value="0">-- Seleccionar paralelo --</option>')
    $('#seleccionar_tipo').html('<option value="">-- Seleccionar tipo --</option>');
    $(".contenedor-table-general tbody").children().remove();
    
    if( select_curso.value != 0 ) {
        cargarParalelos();
    } 
  });
  $('#seleccionar_paralelo').change(() => {
    document.querySelector('.btn').style.display = 'none';
    $(".contenedor-table-general tbody").children().remove();
    if( select_paralelo.value != 0 ) {
        $('#seleccionar_tipo').html(
          `
            <option value="">-- Seleccionar tipo --</option>
            <option value="1">Normal</option>
            <option value="0">Invierno</option>
          `  
        );
        $('#seleccionar_tipo').val('');
        let tipo = '';
        let codigoCurso = select_curso.value;
        let codigoParalelo = select_paralelo.value;
        cargarHorario(codigoCurso, codigoParalelo);
    } else {
    }
  });
  
  
  
  
  
  btnGuardar.addEventListener('click', () => {
      console.log('llege');
      if(select_curso.value != 0 && 
         select_paralelo.value != 0  && 
         select_tipo.value != '' ) {
          guardarHorario();
          getPeticionHorarioLista();
      } else {
          alert('Debe seleccionar curso, paralelo, tipo horario');
      }
  });

});