function getAsignarMateria(id)
{
	var html=$.ajax({type:"GET",url:'asignar_materia.php',data:{id:id},async:false}).responseText;
	if(html=='eNoNumeric'){
	  alert('No numerico o variable no declarada');
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
	if(html=='eHecho'){
		// se asigno la materia correctamente
//	  alert('holassss');
	  return true;
	}
}

function lenguaje()
{
	$codm = 2;
	if (getAsignarMateria($codm))
	{
		location.href='pol_cs.php';
	}
}
function matematicas()
{
	$codm = 1;
	if (getAsignarMateria($codm))
	{
		location.href='pol_cs.php';
	}
}
function naturales()
{
	$codm = 5;
	if (getAsignarMateria($codm))
	{
		location.href='pol_cs.php';
	}
}
function sociales()
{
	$codm = 8;
	if (getAsignarMateria($codm))
	{
		location.href='pol_cs.php';
	}
}
function musica()
{
	$codm = 14;
	if (getAsignarMateria($codm))
	{
		location.href='pol_cs.php';
	}
}
function edu_fisica()
{
	$codm = 13;
	if (getAsignarMateria($codm))
	{
		location.href='pol_cs.php';
	}
}
function religion()
{
	$codm = 16;
	if (getAsignarMateria($codm))
	{
		location.href='pol_cs.php';
	}
}
function formSubmit()
{
	if (validarDato())
	{
		$('#fGrabar').submit();
		alert('GRABADO CON EXITO');
//		getSiguiente(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
//		$('#vf_grabao').val('Si');
//		$('#vf_actual').focus();
	    $('#vf_nombre').val('');
    	$('#vf_anterior').val('');
	    $('#vf_actual').val('');
    	$('#vf_clave').val('');
	    $('#vf_claveuso').val('');
		$('#vf_anterior').focus();
		$('#vf_nombre').focus();
		return true;
	}
	else
	{
		alert('FALTAN DATOS PARA GRABAR ! O SON INCORRECTOS !!!');
	}
}
function Salir()
{
	if ($('#vf_perfil').val() == 'PRIMARIA')
	{
		location.href='materias3ro_p.php';
		return true;
	}
	else
	{
		if ($('#vf_perfil').val() == 'SECUNDARIA')
		{
			location.href='materias3ro_s.php';
			return true;
		}
		else
		{
			location.href='materias3ro_i.php';
			return true;
		}
	}
}


$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
//							   $('#btnGrabar').bind('click',function(){formSubmit();});
//							   $('#btnGrabar').bind('click',function(){Grabar();});
//							   $('#btnAnterior').bind('click',function(){Anterior();});
//							   $('#btnSiguiente').bind('click',function(){Siguiente();});
//							   $('#btnLista').bind('click',function(){location.href='Lista.php';});
//							   $('#btn1').bind('click',function(){Volver();});
							   $('#btn1').bind('click',function(){lenguaje();});
							   $('#btn2').bind('click',function(){matematicas();});
							   $('#btn3').bind('click',function(){naturales();});
							   $('#btn4').bind('click',function(){sociales();});
							   $('#btn5').bind('click',function(){musica();});
							   $('#btn6').bind('click',function(){edu_fisica();});
							   $('#btn7').bind('click',function(){religion();});
							   $('#btnSalir').bind('click',function(){location.href='menu_secundaria.php';});
//							   $('#btnSalir').bind('click',function(){Salir();});
							   $('#btnSalir2').bind('click',function(){location.href='http://www.aizama.net';});
							}
							)
