var codalu; 
var dominio = 'https://www.aizama.net';
let datos_prof = [];

function get_datos(){
	$.get(
		"controlador/profesor_controlador.php?op=get_datos&usr=doc",
		datos => {
			if (datos.status == "eSession")location.href = "docentes.php";
			if (datos.status == "noData")Swal.fire("No se obtubieron los datos del profesor...\nVuelva a iniciar sesi&oacute;n...");
			if (datos.status == "ok") {
				datos_prof = datos.data;
				console.log(datos_prof)
			}
		},
		"json"
	);
}

function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}

function validar_alumno(cod){
//	var html=$.ajax({type:"GET",url:'get_alumno.php',data:{id:cod},async:false}).responseText;
//	if (html=='eNoResults') {
//		return false;
//	}
//	codalu=html;
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
//	alert('1');

	if (validar_alumno($('#codalu').val())) {//Aqui se obtiene el codigo del profesor
//		alert('2');
		var html=$.ajax({type:"POST",url:'asistencia_prof_json.php?op=asist',data:{tipo:1},async:false}).responseText;
//		alert('3');
		if (html=='error') {
			alert("Error no se pudo registrar la entrada");
			return false;
		}
		if (html=='yaIngreso') {
			alert('Ya registro su entrada anteriormente');
			return false;
		}
		if (html=='ok') {
		//	$('#codalu').val("");
		//	$('#nomalu').val("");
		//	$('#codalu').focus();
			alert('Grabado con Exito');
			if (datos_prof.CELPRO != null && datos_prof.CELPRO != "") {
				$.get(
					"controlador/asistencias_profesor_controlador.php?op=getAsistenciaHoy",
					datos => {
						if (datos.status == "eSession")location.href = "docentes.php";
						if (datos.status == "noData")Swal.fire("No se obtubieron los datos del profesor...\nVuelva a iniciar sesi&oacute;n...");
						if (datos.status == "ok") {
							let fecha = datos.data.fecha;
							let dia = datos.data.dia;
							let hora = datos.data.hora;
							let mensaje = `${fecha} - ${dia}: Hora de ingreso ${hora}`;
							let celular = datos_prof.CELPRO;
							$.post(`https://www.aizama.net/aizama/whatsapp_msg.php?text=${mensaje}&phone=591${celular}`);
						}
					},
					"json"
				);
				 
			}
			return true;
		}

	}else{
		alert("Debe ingresar un codigo valido");
		return false;
	}
}

$(document).ready(function()
						   {
						       get_datos();
							   $('#btnsalir').bind('click',function(){
    						       
							           location.href = 'inicios.php';
    						       
							   });
                                
							   $('#btngrabar').bind('click',function(){grabar();});
							}
							)

