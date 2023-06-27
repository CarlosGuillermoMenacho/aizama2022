var codalu;

function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}
function validar_alumno(cod){
var html=$.ajax({type:"GET",url:'get_alumno.php',data:{id:cod},async:false}).responseText;
if (html=='eNoResults') {
	return false;
}
codalu=html;
return true;

}
function getalu(e,param)
{
	param = param.toUpperCase();
	if(isKeyEnter(e))
	{
		if (validar_alumno(param))
		{
			$('#nomalu').val(codalu);
			$('#btngrabar').focus();
			return true;
		}else{
			alert('El codigo ingresado no está en el sistema.');
		}

	}
	return false;
}
function grabar(){

	if (validar_alumno($('#codalu').val())) {
		var html=$.ajax({type:"GET",url:'reg_salida.php',data:{id:$('#codalu').val()},async:false}).responseText;
		if (html=='error') {
			alert("Error no se pudo registrar la salida");
			return false;
		}

		if (html=='eGrabado') {
			alert('Grabado con Exito');
			return true;
		}

	}else{
		alert("Debe ingresar un codigo valido");
		return false;
	}
}

$(document).ready(function()
						   {
							 
							   $('#btnsalir').bind('click',function(){location.href='menu_administracion.php';});

							   $('#btngrabar').bind('click',function(){grabar();});
							}
							)

