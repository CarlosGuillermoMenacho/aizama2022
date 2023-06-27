function getAsignarMateria(id)
{
//	  alert('holassss   1');
	var html=$.ajax({type:"GET",url:'asignar_materia.php',data:{id:id},async:false}).responseText;
//	  alert('holassss   2');
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
//	  alert('holassss  3');
	  return true;
	}
}

function lenguaje()
{
	$codm = 2;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function matematicas()
{
	$codm = 1;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function naturales()
{
	$codm = 5;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function sociales()
{
	$codm = 8;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function musica()
{
	$codm = 14;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function edu_fisica()
{
	$codm = 13;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function religion()
{
	$codm = 16;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function ingles()
{
	$codm = 12;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function psicologia()
{
	$codm = 4;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function filosofia()
{
	$codm = 3;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function computacion()
{
	$codm = 17;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function biologia()
{
	$codm = 10;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function quimica()
{
	$codm = 7;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function fisica()
{
	$codm = 6;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function art_plasticas()
{
	$codm = 15;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
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
							   $('#btn8').bind('click',function(){ingles();});
							   $('#btn9').bind('click',function(){psicologia();});
							   $('#btn10').bind('click',function(){filosofia();});
							   $('#btn11').bind('click',function(){computacion();});
							   $('#btn12').bind('click',function(){biologia();});
							   $('#btn13').bind('click',function(){quimica();});
							   $('#btn14').bind('click',function(){fisica();});
							   $('#btn15').bind('click',function(){art_plasticas();});
							   $('#btnSalir').bind('click',function(){location.href='examen_primaria.php';});  // tb sirve para secundaria
							   $('#btnSalir2').bind('click',function(){location.href='http://www.aizama.net';});
							}
							)
