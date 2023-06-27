function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function init(){
	var sw=getParameterByName('sw1');
	var html=$.ajax({type:"GET",url:'get_content_question.php',data:{id:sw},async:false}).responseText;
	//eval(html);
	let datos = JSON.parse(html);
	//console.log(datos);
	$('#pregunta').val(datos.pregunta);
	$('#op1').val(datos.op1);
	$('#op2').val(datos.op2);
	$('#op3').val(datos.op3);
	$('#resp').val(datos.respuesta);
	$('#time').val(datos.tiempo);
	if(datos.imagen==""){
		$('#imagenmuestra').hide();
	}else{
		var result="resources/"+datos.imagen;
	$('#imagenmuestra').attr("src",result);
	
	}
	$('#imagenactual').val(datos.imagen);
}
	
function guardar(){
	var formData = new FormData($("#fGrabar")[0]);
	var sw=getParameterByName('sw1');
    var html=$.ajax({url:"update_question.php?sw1="+sw,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
if(html=='eNoResults'){
	  alert('No EXISTE EL CODIGO EN EL PADRON');
	$('#vf_recinto').focus();
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	if(html=='eGrabado')
	{
//		alert('ya 3');
	  return true;
	}
	
	
}
function validar_opcion(e)
{
	if (parseInt(e) > 0 && parseInt(e) <= 3)
	{
		return true;
	}
	else
	{
		alert('El valor de la opcion es invalido (el valor es entre 1 y 3)')
		return false;	
	}
}
function verificarImg()
{
	 var alto=document.getElementById('imagenmuestra').width;
	  var ancho=document.getElementById('imagenmuestra').height;
	 if(alto > 500 || ancho > 500){
		 $('#imagen').val("");
		 alert("La dimension de la imagen no es correcta. Debe ser menor a: 500x500 pixels");
		 		var result="resources/"+$('#imagenactual').val();
				$('#imagenmuestra').attr("src",result);
		 return false;
				   }else{return true;}	 	
}

function validar_tiempo(e)
{
	if (parseInt(e) > 0 && parseInt(e) <= 30)
	{
		return true;
	}
	else
	{
		alert('El valor del tiempo NO es valido (el tiempo es entre 1 y 30 minutos)')
		return false;	
	}
}
  function fileOnload(e) {
      var result=e.target.result;
      $('#imagenmuestra').attr("src",result);
}
function addImage(e)
{
      var file = e.target.files[0];
      imageType = /image.*/; 
      if (!file.type.match(imageType))
       return;
      var reader = new FileReader();
      reader.onload = fileOnload;
      reader.readAsDataURL(file);
}

function validar(){
	if(verificarImg()&&validar_opcion($('#resp').val())&&validar_tiempo($('#time').val())){
		
		if(guardar()){
			alert('GRABADO CON EXITO');
			var sw=getParameterByName('sw3');
 var sw1=getParameterByName('sw2');

location.href='view_test_content.php?sw1='+sw+'&sw2='+sw1;
			return true;
		}else{
			alert('NO SE GRABO !!!!!');
				return false;
		}
 

	}else{
		return false;
	}
}
init();
$(document).ready(function()
				  {$('#btnCancelar').bind('click',function(){var sw=getParameterByName('sw3');var sw1=getParameterByName('sw2');location.href='view_test_content.php?sw1='+sw+'&sw2='+sw1;});
				   $('#imagen').change(function(e){addImage(e);});
				  $('#btnGuardar').bind('click',function(){validar()});

				   })