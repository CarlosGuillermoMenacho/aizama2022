/* Variable */
var listaCursos = [];
var listaAlumnos = [];

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

function mostrarTabla() {
    
    for( let i = 0; i < listaAlumnos.length; i++) {
        let nombre = listaAlumnos[i]['nombre'];
        let usuario = listaAlumnos[i]['user'];
        let clave = listaAlumnos[i]['clave'];
        $('#campos').append(
            `<tr>
                <td data-label="Nro">${(i + 1)}</td>
                <td data-label="Usuario">${usuario}</td>
                <td data-label="Clave">${clave}</td>
                <td data-label="Nombre">${nombre}</td>
            <tr>`
        );
    }
}

function pedirAlumnos(curso, paralelo) {
    var req = new XMLHttpRequest();
    var formData = new FormData();
    formData.append('codcur', curso);
    formData.append('codpar', paralelo);
    req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
        if(req.status == 200)
          var jsonData = JSON.parse(req.responseText);
          if( jsonData['status'] == 'ok') {
            $('#campos').children().remove();
            listaAlumnos = jsonData['lista'];
            console.log(listaAlumnos);
            
            mostrarTabla();
            $('.contenedor-table-general').css("display", "block");
          }
      }
    };
    req.open('POST', 'lista_alumnnos_usuario_clave.php?op=list_alu_usr_pass', false);
    req.send(formData);
  

}


$(document).ready(function() {
  
  $('#seleccionar_curso').change(function() {
    if( $('#seleccionar_curso').val() != 0 ) {
      let index = $('#seleccionar_curso').val();
      let curso = listaCursos[index-1]['codcur'];
      let paralelo = listaCursos[index-1]['codpar'];
      pedirAlumnos(curso, paralelo);
    } else {
      $('#campos').children().remove();
      $('.contenedor-table-general').css("display", "none");

    }
  });
});