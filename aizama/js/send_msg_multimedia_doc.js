let cursos_del_profesor;
function obetner_cursos_del_profesor(){
  $.post(
      'obtener_curso_json.php?op=cp',
      (datos,estado,xhr)=>{
        let status = datos['status'];
        if (status=='ok') {
          cursos_del_profesor = datos['cursos'];
          cargarCursos();
        }
      },
      "json"
    );
}

function cargarCursos(){
  let indice = 1;
  cursos_del_profesor.forEach((curso)=>{
    let nombre = curso['nombre'];
    $('#seleccionar_curso').append(`<option value="${indice}">${nombre}</option>`);
    indice++;
  });
}
const validara_datos = ()=>{
  let codcur = $('#seleccionar_curso').val();
  let file = $('#input_file').val();
  if (codcur == "" || codcur == "0") {
    alert("Debe seleccionar un curso...!!!");
    $('#seleccionar_curso').focus();
    return false;
  }


  if (file == "") {
    alert("Debe seleccionar un archivo...!!!");
    $('#input_file').focus();
    return false;
  }

  return true;
}
$('#formulario').on('submit',(event)=>event.preventDefault());  
$(document).ready(function(){
  obetner_cursos_del_profesor();
    $('#btn_send').click(function(){
      if(validara_datos()){
        let formdata = new FormData($('#formulario')[0]);
        let indice = $('#seleccionar_curso').val();
        let codcur = cursos_del_profesor[indice - 1].codcur;
        let codpar = cursos_del_profesor[indice - 1].codpar;
        formdata.append("codcur",codcur);
        formdata.append("codpar",codpar);
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
