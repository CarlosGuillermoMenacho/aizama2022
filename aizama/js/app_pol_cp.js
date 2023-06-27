function getAsignarCurso(id)
{
	var html=$.ajax({type:"GET",url:'asignar_curso.php',data:{id:id},async:false}).responseText;
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

function Pri_1()  // primero de primaria
{
	$codm = 1;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'P1':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje1p.php';
				break;
			case 'P2':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica1p.php';
				break;
			case 'P3':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales1p.php';
				break;
			case 'P4':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales1p.php';
				break;
			case 'P5':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion1p.php';
				break;
			case 'P6':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores1p.php';
				break;
			case 'P7':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles1p.php';
				break;
			case 'P9':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica1p.php';
				break;
			case 'P10':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas1p.php';
				break;
			case 'P11':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica1p.php';
				break;
			case 'P14':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani1p.php';
				break;
			case 'P15':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion1p.php';
				break;
			case 'P16':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='t_estudio1p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Pri_2()
{
	$codm = 2;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'P1':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje2p.php';
				break;
			case 'P2':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica2p.php';
				break;
			case 'P3':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales2p.php';
				break;
			case 'P4':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales2p.php';
				break;
			case 'P5':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion2p.php';
				break;
			case 'P6':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores2p.php';
				break;
			case 'P7':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles2p.php';
				break;
			case 'P9':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica2p.php';
				break;
			case 'P10':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas2p.php';
				break;
			case 'P11':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica2p.php';
				break;
			case 'P14':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani2p.php';
				break;
			case 'P15':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion2p.php';
				break;
			case 'P16':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='t_estudio2p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Pri_3()
{
	$codm = 3;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'P1':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje3p.php';
				break;
			case 'P2':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica3p.php';
				break;
			case 'P3':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales3p.php';
				break;
			case 'P4':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales3p.php';
				break;
			case 'P5':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion3p.php';
				break;
			case 'P6':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores3p.php';
				break;
			case 'P7':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles3p.php';
				break;
			case 'P9':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica3p.php';
				break;
			case 'P10':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas3p.php';
				break;
			case 'P11':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica3p.php';
				break;
			case 'P14':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani3p.php';
				break;
			case 'P15':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion3p.php';
				break;
			case 'P16':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='t_estudio3p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Pri_4()
{
	$codm = 4;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'P1':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje4p.php';
				break;
			case 'P2':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica4p.php';
				break;
			case 'P3':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales4p.php';
				break;
			case 'P4':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales4p.php';
				break;
			case 'P5':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion4p.php';
				break;
			case 'P6':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores4p.php';
				break;
			case 'P7':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles4p.php';
				break;
			case 'P9':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica4p.php';
				break;
			case 'P10':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas4p.php';
				break;
			case 'P11':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica4p.php';
				break;
			case 'P14':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani4p.php';
				break;
			case 'P15':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion4p.php';
				break;
			case 'P16':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='t_estudio4p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Pri_5()
{
	$codm = 5;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'P1':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje5p.php';
				break;
			case 'P2':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica5p.php';
				break;
			case 'P3':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales5p.php';
				break;
			case 'P4':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales5p.php';
				break;
			case 'P5':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion5p.php';
				break;
			case 'P6':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores5p.php';
				break;
			case 'P7':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles5p.php';
				break;
			case 'P9':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica5p.php';
				break;
			case 'P10':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas5p.php';
				break;
			case 'P11':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica5p.php';
				break;
			case 'P14':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani5p.php';
				break;
			case 'P15':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion5p.php';
				break;
			case 'P16':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='t_estudio5p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Pri_6()
{
	$codm = 6;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'P1':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje6p.php';
				break;
			case 'P2':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica6p.php';
				break;
			case 'P3':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales6p.php';
				break;
			case 'P4':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales6p.php';
				break;
			case 'P5':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion6p.php';
				break;
			case 'P6':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores6p.php';
				break;
			case 'P7':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles6p.php';
				break;
			case 'P9':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica6p.php';
				break;
			case 'P10':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas6p.php';
				break;
			case 'P11':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica6p.php';
				break;
			case 'P14':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani6p.php';
				break;
			case 'P15':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion6p.php';
				break;
			case 'P16':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='t_estudio6p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
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
							   $('#btn1').bind('click',function(){Pri_1();});
							   $('#btn2').bind('click',function(){Pri_2();});
							   $('#btn3').bind('click',function(){Pri_3();});
							   $('#btn4').bind('click',function(){Pri_4();});
							   $('#btn5').bind('click',function(){Pri_5();});
							   $('#btn6').bind('click',function(){Pri_6();});
							   $('#btnSalir').bind('click',function(){location.href='pol_mp.php';});
//							   $('#btnSalir').bind('click',function(){Salir();});
							   $('#btnSalir2').bind('click',function(){location.href='http://www.aizama.net';});
							}
							)
