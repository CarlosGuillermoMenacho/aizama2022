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

function Sec_1()  // primero de primaria
{
	$codm = 1;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'S1':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica1p.php';
				break;
			case 'S2':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje1p.php';
				break;
			case 'S3':   // FILOSOFIA
				alert ('No hay material para esta materia en este curso');
				//location.href='filosofia1p.php';
				break;
			case 'S4':   // PSICOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='psicologia1p.php';
				break;
			case 'S5':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales1p.php';
				break;
			case 'S6':   // FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='fisica1p.php';
				break;
			case 'S7':   // QUIMICA
				alert ('No hay material para esta materia en este curso');
				//location.href='quimica1p.php';
				break;
			case 'S8':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales1p.php';
				break;
			case 'S9':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='tecnologia1p.php';
				break;
			case 'S10':   // BIOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='biologia1p.php';
				break;
			case 'S11':   // CIVICA
				alert ('No hay material para esta materia en este curso');
				//location.href='civica1p.php';
				break;
			case 'S12':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles1p.php';
				break;
			case 'S13':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica1p.php';
				break;
			case 'S14':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica1p.php';
				break;
			case 'S15':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas1p.php';
				break;
			case 'S16':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores1p.php';
				break;
			case 'S17':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion1p.php';
				break;
			case 'S18':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani1p.php';
				break;
			case 'S19':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion1p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Sec_2()
{
	$codm = 2;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'S1':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica1p.php';
				break;
			case 'S2':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje1p.php';
				break;
			case 'S3':   // FILOSOFIA
				alert ('No hay material para esta materia en este curso');
				//location.href='filosofia1p.php';
				break;
			case 'S4':   // PSICOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='psicologia1p.php';
				break;
			case 'S5':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales1p.php';
				break;
			case 'S6':   // FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='fisica1p.php';
				break;
			case 'S7':   // QUIMICA
				alert ('No hay material para esta materia en este curso');
				//location.href='quimica1p.php';
				break;
			case 'S8':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales1p.php';
				break;
			case 'S9':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='tecnologia1p.php';
				break;
			case 'S10':   // BIOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='biologia1p.php';
				break;
			case 'S11':   // CIVICA
				alert ('No hay material para esta materia en este curso');
				//location.href='civica1p.php';
				break;
			case 'S12':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles1p.php';
				break;
			case 'S13':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica1p.php';
				break;
			case 'S14':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica1p.php';
				break;
			case 'S15':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas1p.php';
				break;
			case 'S16':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores1p.php';
				break;
			case 'S17':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion1p.php';
				break;
			case 'S18':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani1p.php';
				break;
			case 'S19':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion1p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Sec_3()
{
	$codm = 3;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'S1':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica1p.php';
				break;
			case 'S2':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje1p.php';
				break;
			case 'S3':   // FILOSOFIA
				alert ('No hay material para esta materia en este curso');
				//location.href='filosofia1p.php';
				break;
			case 'S4':   // PSICOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='psicologia1p.php';
				break;
			case 'S5':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales1p.php';
				break;
			case 'S6':   // FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='fisica1p.php';
				break;
			case 'S7':   // QUIMICA
				alert ('No hay material para esta materia en este curso');
				//location.href='quimica1p.php';
				break;
			case 'S8':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales1p.php';
				break;
			case 'S9':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='tecnologia1p.php';
				break;
			case 'S10':   // BIOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='biologia1p.php';
				break;
			case 'S11':   // CIVICA
				alert ('No hay material para esta materia en este curso');
				//location.href='civica1p.php';
				break;
			case 'S12':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles1p.php';
				break;
			case 'S13':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica1p.php';
				break;
			case 'S14':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica1p.php';
				break;
			case 'S15':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas1p.php';
				break;
			case 'S16':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores1p.php';
				break;
			case 'S17':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion1p.php';
				break;
			case 'S18':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani1p.php';
				break;
			case 'S19':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion1p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Sec_4()
{
	$codm = 4;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'S1':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica1p.php';
				break;
			case 'S2':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje1p.php';
				break;
			case 'S3':   // FILOSOFIA
				alert ('No hay material para esta materia en este curso');
				//location.href='filosofia1p.php';
				break;
			case 'S4':   // PSICOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='psicologia1p.php';
				break;
			case 'S5':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales1p.php';
				break;
			case 'S6':   // FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='fisica1p.php';
				break;
			case 'S7':   // QUIMICA
				alert ('No hay material para esta materia en este curso');
				//location.href='quimica1p.php';
				break;
			case 'S8':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales1p.php';
				break;
			case 'S9':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='tecnologia1p.php';
				break;
			case 'S10':   // BIOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='biologia1p.php';
				break;
			case 'S11':   // CIVICA
				alert ('No hay material para esta materia en este curso');
				//location.href='civica1p.php';
				break;
			case 'S12':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles1p.php';
				break;
			case 'S13':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica1p.php';
				break;
			case 'S14':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica1p.php';
				break;
			case 'S15':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas1p.php';
				break;
			case 'S16':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores1p.php';
				break;
			case 'S17':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion1p.php';
				break;
			case 'S18':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani1p.php';
				break;
			case 'S19':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion1p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Sec_5()
{
	$codm = 5;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'S1':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica1p.php';
				break;
			case 'S2':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje1p.php';
				break;
			case 'S3':   // FILOSOFIA
				alert ('No hay material para esta materia en este curso');
				//location.href='filosofia1p.php';
				break;
			case 'S4':   // PSICOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='psicologia1p.php';
				break;
			case 'S5':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales1p.php';
				break;
			case 'S6':   // FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='fisica1p.php';
				break;
			case 'S7':   // QUIMICA
				alert ('No hay material para esta materia en este curso');
				//location.href='quimica1p.php';
				break;
			case 'S8':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales1p.php';
				break;
			case 'S9':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='tecnologia1p.php';
				break;
			case 'S10':   // BIOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='biologia1p.php';
				break;
			case 'S11':   // CIVICA
				alert ('No hay material para esta materia en este curso');
				//location.href='civica1p.php';
				break;
			case 'S12':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles1p.php';
				break;
			case 'S13':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica1p.php';
				break;
			case 'S14':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica1p.php';
				break;
			case 'S15':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas1p.php';
				break;
			case 'S16':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores1p.php';
				break;
			case 'S17':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion1p.php';
				break;
			case 'S18':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani1p.php';
				break;
			case 'S19':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion1p.php';
				break;
			default:
		    	text = "Codigo de materia no encontrado";
				break;
		}
	}
}
function Sec_6()
{
	$codm = 6;
	if (getAsignarCurso($codm))
	{
		switch ($('#vf_mat').val())
		{
			case 'S1':   // MATEMAT
				alert ('No hay material para esta materia en este curso');
				//location.href='matematica1p.php';
				break;
			case 'S2':   // LENGUAJE
				alert ('No hay material para esta materia en este curso');
				//location.href='lenguaje1p.php';
				break;
			case 'S3':   // FILOSOFIA
				alert ('No hay material para esta materia en este curso');
				//location.href='filosofia1p.php';
				break;
			case 'S4':   // PSICOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='psicologia1p.php';
				break;
			case 'S5':   // C. NATURALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_naturales1p.php';
				break;
			case 'S6':   // FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='fisica1p.php';
				break;
			case 'S7':   // QUIMICA
				alert ('No hay material para esta materia en este curso');
				//location.href='quimica1p.php';
				break;
			case 'S8':   // C. SOCIALES
				alert ('No hay material para esta materia en este curso');
				//location.href='c_sociales1p.php';
				break;
			case 'S9':   // TECNICAS DE ESTUDIO
				alert ('No hay material para esta materia en este curso');
				//location.href='tecnologia1p.php';
				break;
			case 'S10':   // BIOLOGIA
				alert ('No hay material para esta materia en este curso');
				//location.href='biologia1p.php';
				break;
			case 'S11':   // CIVICA
				alert ('No hay material para esta materia en este curso');
				//location.href='civica1p.php';
				break;
			case 'S12':   // INGLES
				alert ('No hay material para esta materia en este curso');
				//location.href='ingles1p.php';
				break;
			case 'S13':   // ED. FISICA
				alert ('No hay material para esta materia en este curso');
				//location.href='e_fisica1p.php';
				break;
			case 'S14':   // MUSICA
				alert ('No hay material para esta materia en este curso');
				//location.href='musica1p.php';
				break;
			case 'S15':   // ARTES PLASTICAS
				alert ('No hay material para esta materia en este curso');
				//location.href='a_plasticas1p.php';
				break;
			case 'S16':   // VALORES  - RELIGION
				alert ('No hay material para esta materia en este curso');
				//location.href='valores1p.php';
				break;
			case 'S17':   // COMPUTACION
				alert ('No hay material para esta materia en este curso');
				//location.href='computacion1p.php';
				break;
			case 'S18':   // GUARANI
				alert ('No hay material para esta materia en este curso');
				//location.href='guarani1p.php';
				break;
			case 'S19':   // NATACION
				alert ('No hay material para esta materia en este curso');
				//location.href='natacion1p.php';
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
							   $('#btn1').bind('click',function(){Sec_1();});
							   $('#btn2').bind('click',function(){Sec_2();});
							   $('#btn3').bind('click',function(){Sec_3();});
							   $('#btn4').bind('click',function(){Sec_4();});
							   $('#btn5').bind('click',function(){Sec_5();});
							   $('#btn6').bind('click',function(){Sec_6();});
							   $('#btnSalir').bind('click',function(){location.href='pol_ms.php';});
//							   $('#btnSalir').bind('click',function(){Salir();});
							   $('#btnSalir2').bind('click',function(){location.href='http://www.aizama.net';});
							}
							)
