$.post("obtener_curso_json.php?op=ca",function(respuesta){
  var jsonData = JSON.parse(respuesta);
  if (jsonData['status'] == 'ok') {
      niveles = jsonData['niveles'];
      $("#seleccionar_curso").empty();
      $("#seleccionar_curso").append('<option value="0"> -- Seleccionar curso -- </option>');
      for(var i = 0; i < niveles.length; i++ ) {
        $("#seleccionar_curso").append('<option value ="'+(niveles[i]['codcur'])+'">' + niveles[i]['nombre'] + '</option>');
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
      paralelos = jsonData['paralelos'];
     
  }
  
});
function cargarParalelos() {
  $("#seleccionar_paralelo").empty();
  $("#seleccionar_paralelo").append('<option value="0"> -- Seleccionar paralelo -- </option>');
  for(var i = 0; i < paralelos.length; i++ ) {
    $("#seleccionar_paralelo").append('<option value ="'+(paralelos[i]['codpar'])+'">' + paralelos[i]['nombre'] + '</option>');
  }
}
$("#seleccionar_curso").change(function(){
  let selectParalelo = document.getElementById('seleccionar_paralelo');   
    if($("#seleccionar_curso").val()!=0 ) {
        $('#seleccionar_paralelo option[value="0"]').prop('selected', true);
        $("#seleccionar_paralelo").prop('selectedIndex', 0);
        document.getElementById('select2-seleccionar_paralelo-container').innerHTML = selectParalelo.options[0].textContent;
        cargarParalelos();
    } else {
        $("#seleccionar_paralelo").empty();
        $("#seleccionar_paralelo").append('<option value="0"> -- Seleccionar paralelo -- </option>');
    } 
});
const validara_datos = ()=>{
  let codcur = $('#seleccionar_curso').val();
  let codpar = $('#seleccionar_paralelo').val();
  let file = $('#input_file').val();
  let mime_type = $('#mime_type').val();
  if (codcur == "" || codcur == "0") {
    alert("Debe seleccionar un curso...!!!");
    $('#seleccionar_curso').focus();
    return false;
  }
  if (codpar == "" || codpar == "0") {
    alert("Debe seleccionar un paralelo...!!!");
    $('#seleccionar_paralelo').focus();
    return false;
  }

  if (file == "") {
    alert("Debe seleccionar un archivo...!!!");
    $('#input_file').focus();
    return false;
  }
  if (mime_type == "") {
    alert("Debe indicar el tipo de archivo...!!!");
    $('#mime_type').focus();
    return false;
  }
  return true;
}
$('#formulario').on('submit',(event)=>event.preventDefault());  
$(document).ready(function(){
    $('#btn_send').click(function(){
      if(validara_datos()){
        let formdata = new FormData($('#formulario')[0]);
        formdata.append("codcur",$('#seleccionar_curso').val());
        formdata.append("codpar",$('#seleccionar_paralelo').val());
        $.ajax({
            url:"controlador/whatsapp_msg_multimedia_curso.php",
            type: "POST",
            data:formdata,
            contentType: false, 
            processData: false,
            async:true});
        Swal.fire("Mensaje enviado...!!!");
      }
    });
});
