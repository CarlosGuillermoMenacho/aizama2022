$contador=0;
function getAlu(e,param,c_curso,c_materia)
{
	c_materia = c_materia.toUpperCase();
	if(isKeyEnter(e))
	{
		getAlumnos(param,c_curso,c_materia);
		return true;
	}
}
function getResultados(e,param)
{
	if(isKeyEnter(e))
	{
		if(parseInt(param)!=param)  //ESTO VERIFICA QUE EL DATO SEA NUMERO
		{
			alert ('El dato introducido no es correcto');
			$('#vf_codigo').val('');
			$('#vf_codigo').focus();
			return false;
		}
		getCurso(param);
		return true;
	}
}

function grabar(id8,id9,id11,id12,id13,id14)
{
//	  alert('No 1');

	var html=$.ajax({type:"GET",url:'grabar_prac_prof.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:id14},async:false}).responseText;
//	  alert('No 2');

	if(html=='eNoResults'){
	  alert('No EXISTE EL CODIGO EN EL PADRON ');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 6');
	  return false;
	}
	if(html=='eGrabado'){
		alert('jra 4');
		$('#vf_n1').val('9');
		$('#vf_n5').val('FUERA DE TIEMPO');
	  return true;
	}
	if(html=='eCorrecto')
	{
//		alert('jra 1');
		if(parseInt($('#vf_nota_final').val()) == 0)
		{
			$('#vf_nota_final').val(parseInt($('#vf_valor').val()));
		}
		else
		{
			$suma=parseInt($('#vf_nota_final').val()) + parseInt($('#vf_valor').val());
			$('#vf_nota_final').val($suma);
		}
		$('#vf_nota').val(parseInt($('#vf_valor').val()));
		$('#vf_n5').val('CORRECTO');
		return true;
	}
	if(html=='eIncorrecto'){
//		alert('jra 2');
	  $('#vf_n5').val('INCORRECTO');
	  return true;
	}

	if(html=='eFin2'){
	  alert('Fin 2 No tiene respuestas grabadas');
	  return 0;
	}

//	alert('gol 5');

}

function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)
	{
		if (!(verificarGrabado())) // si no esta grabado que grabe
		{
			if(grabar($('#vf_codalu').val(),$('#vf_codpre').val(),$('#vf_n1').val(),$('#vf_valor').val(),$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
			{	
				if (parseInt($('#vf_n1').val()) == 9)
				{
					alert('Grabado FUERA DE TIEMPO !!!');
				}
				else
				{
					if ($('#vf_n5').val() == 'INCORRECTO')
					{
						alert('Grabado con exito !!!  INCORRECTO  !!!');
					}
					else
					{
						alert('Grabado con exito !!!  CORRECTO  !!!');
					}
				}
				$('#btnSiguiente').focus();
				return true;
			}
			else
			{
				alert('NO Grabo  !!!');
				return false;
			}
		}
		else
		{
			alert('Esta respuesta ya esta grabada !!!');
			return true;
		}
	}
	else
	{
		return false;
	}
}

function clearInputs()
{
	$('#vf_catastro').val('');
	$('#vf_contrato').val('');
	$('#vf_nombre').val('');
	$('#vf_anterior').val('');
	$('#vf_actual').val('');
	$('#vf_promedio').val('');
	$('#vf_periodo').val('');
	$('#vf_nrocor').val('');
	$('#vf_medidor').val('');
	$('#vf_ubicacion').val('');
	$('#vf_clave').val('');
	$('#vf_desclave').val('');
	$('#vf_claveuso').val('');
	$('#vf_desclaveuso').val('');
	$('#vf_categoria').val('');
	$('#vf_descategoria').val('');
	$('#vf_grabados').val('');
}
function verificarGrabado()
{
//	codmate = codmate.toUpperCase();
	$codalu = parseInt($('#vf_codalu').val());
	$codpre = parseInt($('#vf_codpre').val());
//	alert('alumno: '+ $codalu +' pregunta: '+ $codpre);
  if (parseInt($codpre) == 0)
  {
	return true;  
  }
  else
  {
	var html=$.ajax({type:"GET",url:'get_grab_prac_prof.php',data:{id1:$codalu,id2:$codpre},async:false}	).responseText;

	if(html=='eNoResults'){
	// EL ALUMNO NO TIENE REGISTRADA NINGUNA RESPUESTA
//	alert ('hol qq');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
		return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 7');
	  return false;
	}
	// EL ALUMNO YA TIENE REGISTRADA SU RESPUESTA
//	alert('oye 1');
	eval(html);
//	alert('oye 2');
	$('#vf_n1').val(resp);
	$('#btnSiguiente').focus();
    return true;
  }
}
function getDatosGrabados(id)
{
//		alert ('voy : ' + id);
	var html=$.ajax({type:"GET",url:'get_datos_practicar_prof.php',data:{id:id},async:false}).responseText;

//	alert ('voy : 1');
	if(html=='eFin'){
	  alert('Examen Finalizado 2');
	  return false;
	}
//	alert ('voy : 2');
	if(html=='eNoResults'){
		// no esta grabada la respuesta
//	  alert('Fin de Archivo');
//	alert ('voy : 3');
//	$('#vf_hora_inicio').val(hora2);
//	alert ('voy : 4');
	  return true;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 8');
	  return false;
	}
//	clearInputs();
// la pregunta esta grabada
//	alert ('voy : grabao ' + id);
	eval(html);
	$('#vf_n1').val(resp);
	$('#vf_n5').val(nota);
	$('#vf_nota').val(nota);
	$('#vf_fecha').val(fecha);
	$('#vf_hora_inicio').val(hora_ini);
	$('#vf_hora_fin').val(hora_fin);
	$('#vf_nota_final').val(nota_final);
	$('#vf_tiempo2').val(tiempo);
	if (parseInt($('#vf_n1').val()) == 9)
	{
		$('#vf_n5').val('FUERA DE TIEMPO');
	}
	else
	{
		if (parseInt($('#vf_n5').val()) == 0)
		{
			$('#vf_n5').val('INCORRECTO');
		}
		else
		{
			$('#vf_n5').val('CORRECTO');
		}
	}
	$('#vf_n1').focus();
	return true;
}
function getObtHora(id1)
{
//	alert ('bola 1');
	var html=$.ajax({type:"GET",url:'get_hora_prof.php',data:{id:id1},async:false}).responseText;
//	alert ('bola 2');

	if(html=='eNoResults'){
		// no esta grabada la respuesta
//	  alert('Fin de Archivo');
//	$('#vf_hora_inicio').val(hora2);
	  return true;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 9');
	  return false;
	}
//	clearInputs();
// la pregunta esta grabada
	eval(html);
	$('#vf_hora_inicio').val(hora_ini);
	$('#vf_hora_fin').val(hora_fin);
	$('#vf_n1').focus();
	return true;
}

function cantidad_grabada(id1)
{   //id1 es el codigo del alumno, tambien necesita el nro de examen pero ese dato esta en $_SESSION['app_user_examen'] lo asigna advertencia1 o 2
//	alert ('bola 21');
	var html=$.ajax({type:"GET",url:'get_cant_prac_prof.php',data:{id:-888},async:false}).responseText;
//	alert ('bola 22');

	if(html=='eNoResults'){
		// no esta grabada la respuesta
	  alert('Fin de Archivo  23');
//	$('#vf_hora_inicio').val(hora2);
	  return false;
	}
	if(html=='eFin'){
		// no esta grabada la respuesta
	  alert('La materia NO tiene examen para evaluar');
//	$('#vf_hora_inicio').val(hora2);
	  return 99;
	}
	if(html=='eFin2'){
		// no esta grabada la respuesta
//	  alert('Fin 2 No tiene respuestas grabadas');
//	$('#vf_hora_inicio').val(hora2);
	  return 0;
	}
	if(html=='eFin3'){
		// no esta grabada la respuesta
	  alert('Fin 3 No tiene respuestas grabadas');
//	$('#vf_hora_inicio').val(hora2);
	  return 0;
	}
	if(html=='eFin4'){
		// no esta grabada la respuesta
//	  alert('Fin 4 No tiene respuestas grabadas');
//	$('#vf_hora_inicio').val(hora2);
	  return 0;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 1');
	  alert('bola 1');
	  return false;
	}
	alert ('hecho 210');
	eval(html);
	alert ('hecho 21');
	$('#vf_contador').val(num);
    $('#vf_nota_final').val(notita);
	return parseInt($('#vf_contador').val());
}
function Siguiente()
{
//	alert(' m 0');
  if (parseInt($('#vf_numero').val()) == 0 && parseInt($('#vf_contador').val()) == 0 && parseInt($('#vf_codpre').val()) == 0)
  {
//	alert(' m 1');
	$grabao = cantidad_grabada(parseInt($('#vf_codalu').val())); // saca la cantidad de preguntas respondidas por el alumno
//	alert(' m 2');
	$('#vf_contador').val($grabao); // se lo asigno al contador de preguntas
	if ($('#vf_contador').val() == 99)
	{
		alert('Examen NO existente');
		$('#vf_contador').val('0');
		return true;
	}
	else
	{
//		alert(' m 3');
		if ($('#vf_contador').val() == 5)
		{
			alert('Examen ya realizado y terminado por el alumno. NOTA FINAL : ' + $('#vf_nota_final').val()+'     SOBRE 100');
			//$('#vf_contador').val('0');
			$('#vf_n1').val('7');   // asigno 7 solo para poder salir
		}
		else
		{
//			alert(' m 4');

			$contador = parseInt($('#vf_contador').val());
			$contador=$contador+1;
//			alert('Nrosssss: ' + $contador);
			getSiguiente($contador);
//			alert('vol 1');
			getObtHora(parseInt($('#vf_tiempo').val()));
//			alert('vol 2');
			getDatosGrabados(parseInt($('#vf_codpre').val()));
//			alert('vol 3');
			$('#vf_n1').focus();
		}
//		alert(' m 5');
		return true;
	}
  }
  else
  {
//	  alert ('hoy 4333333');
	  if (parseInt($('#vf_numero').val()) == 0 && parseInt($('#vf_contador').val()) > 0)
	  {
		alert ('hoy 43');
		$contador = parseInt($('#vf_contador').val());
		getSiguemismo($contador,parseInt($('#vf_codpre').val()));
	//	getObtHora(parseInt($('#vf_tiempo').val()));
		getDatosGrabados(parseInt($('#vf_codpre').val()));
		$('#vf_n1').focus();
		return true;
	  }
	  else
	  {
	//	alert ('hoy 44');
		if (verificarGrabado())  // verifica si se grabo o esta grabado el que esta mostrando nada mas 
		{				// verifica con el codigo del alumno y codigo de pregunta
	//		alert ('hoy 45');
			$('#vf_n1').val('');
			$('#vf_n5').val('');
			$contador = parseInt($('#vf_contador').val());
	//		if (parseInt($('#vf_codpre').val()) == parseInt($('#vf_numero').val()))
			if (parseInt($('#vf_codpre').val()) >0 && parseInt($('#vf_numero').val()) > 0 && parseInt($('#vf_contador').val()) > 0 )
			{
	//			alert ('hoy 451');
				$contador=$contador+1;
				getSiguiente($contador);
				getObtHora(parseInt($('#vf_tiempo').val()));
			}
			else
			{
	//			alert ('hoy 452');
	//			getSiguemismo($contador);
				$contador = parseInt($('#vf_contador').val());
				getSiguemismo($contador,parseInt($('#vf_codpre').val()));
			}
	//		  alert(' contador22 : ' + $contador);
	//		alert('fo 1');
	//		getObtHora(parseInt($('#vf_tiempo').val()));
	//		alert('fo 2');
			getDatosGrabados(parseInt($('#vf_codpre').val()));
	//		alert('fo 3');
			$('#vf_nota').val('0');
			$('#vf_n1').focus();
			return true;
		}
		else
		{
			alert('Debe Responder la pregunta !!!');
			$('#vf_n1').focus();
			return false;
		}
	  }
  }
}

function getSiguiente(id)
{
//	alert('cv 1');
	var html=$.ajax({type:"GET",url:'get_practicar_prof.php',data:{id:id},async:false}).responseText;
//	alert('cv 2');

	if(html=='eFin'){
	  alert('Examen Finalizado 1');
      $('#vf_contador').val('6');
	  $('#vf_tiempo').val('9');
	  return false;
	}
//	alert('cv 3');
	if(html=='eNoResults1'){
	  alert('Sin Resultados, ni entro ');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('Sin Resultados ');
	  return false;
	}
	if(html=='eNo200'){
	  alert('Sin Resultados 200 ');
	  return false;
	}
	if(html=='eNo300'){
	  alert('Sin Resultados 300');
	  return false;
	}
	if(html=='eNo400'){
	  alert('Prueba de ingreso');
	  return false;
	}
//	alert('cv 4');
	if(html=='eNo1'){
	  alert('Falla en los parametros');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 2');
	  return false;
	}
//	alert ('tt1');
//	clearInputs();
	eval(html);
//	alert ('tt2');
    $('#vf_total').val(total);
    $('#vf_numero').val(num);
    $('#vf_valor').val(val);
    $('#vf_opcion1').val(n_o1);
    $('#vf_opcion2').val(n_o2);
    $('#vf_opcion3').val(n_o3);
    $('#vf_op1').val(o1);
    $('#vf_op2').val(o2);
    $('#vf_op3').val(o3);
    $('#vf_pregunta').val(pre);
    $('#vf_codpre').val(codpre);
    $('#vf_contador').val(cuenta);
    $('#vf_tiempo').val(tie);
    $('#vf_nota_final').val(notita);
	$('#vf_n1').focus();
		return true;
}
function getSiguemismo(id1,id3)
{
	var html=$.ajax({type:"GET",url:'get_prac_mismo_prof.php',data:{id:id1,id2:id3},async:false}).responseText;

	if(html=='eFin'){
	  alert('Examen Finalizado 3');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('Fin de Archivo');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 3');
	  return false;
	}
//	clearInputs();
	eval(html);
    $('#vf_total').val(total);
    $('#vf_numero').val(num);
    $('#vf_valor').val(val);
    $('#vf_opcion1').val(n_o1);
    $('#vf_opcion2').val(n_o2);
    $('#vf_opcion3').val(n_o3);
    $('#vf_op1').val(o1);
    $('#vf_op2').val(o2);
    $('#vf_op3').val(o3);
    $('#vf_pregunta').val(pre);
    $('#vf_codpre').val(codpre);
    $('#vf_contador').val(cuenta);
    $('#vf_tiempo').val(tie);
    $('#vf_nota_final').val(notita);
	$('#vf_n1').focus();
	return true;
}
function grabarAbandono(id8,id9,id11,id12,id13,id14)
{
	var html=$.ajax({type:"GET",url:'grabar_aban_prac_prof.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:id14},async:false}).responseText;

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
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 4');
	  return false;
	}
	if(html=='eGrabado'){
//		alert('gol 4');
//		$('#vf_n1').val('9');
//		$('#vf_n5').val('FUERA DE TIEMPO');
	  return true;
	}
}
function borrarAbandono(id8,id9,id11,id12,id13,id14)
{
//	  alert('No 1');

	var html=$.ajax({type:"GET",url:'borrar_aban_prac_prof.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:id14},async:false}).responseText;
//	  alert('No 2');

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
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos 5');
	  return false;
	}
	if(html=='eGrabado'){
//		alert('gol 4');
//		$('#vf_n1').val('9');
//		$('#vf_n5').val('FUERA DE TIEMPO');
	  return true;
	}
}

function Confirmar(cont,resp)
{
//	alert('numero: '+ cont);
  if(cont>5)
  {
	  if (borrarAbandono($('#vf_codalu').val(),-1,8,0,$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
	  {
			Salir();
			return true;
	  }
  }
  else
  {
	if (cont < 5)
	{
	    var txt;
    	var r = confirm("CONFIRMAR SI Desea ABANDONAR EL EXAMEN!. Recuerde que ya no podra evaluar de nuevo este examen");
	    if (r == true)
		{
			// debe grabar lo restante. Primero sacando lo que ya tienen grabao
			$grabao = cantidad_grabada(parseInt($('#vf_codalu').val())); // saca la cantidad de preguntas respondidas por el alumno
			cont = $grabao;
			cont = 5;  // le asigno 5 de una vez para que no grabe nada recuerde que es practica
			if (borrarAbandono($('#vf_codalu').val(),-1,8,0,$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
			{
				while (cont < 5)
				{
					if(grabarAbandono($('#vf_codalu').val(),-1,8,0,$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
					{
						++cont;
					}
					else
					{
						alert('Error en la grabacion del complemento a 5 respuestas');
					}
				}
			}
//			location.href='materias2do_p.php';
			Salir();
			return true;
			//txt = "You pressed OK!";
    	}
		else
		{
        	//txt = "You pressed Cancel!";
			$('#vf_n1').focus();
			return false;
	    }
	}
	else
	{
		if (cont == 5 && (resp == 1 || resp == 2 || resp == 3 || resp == 7 || resp == 8 || resp == 9))
		{
			if (borrarAbandono($('#vf_codalu').val(),-1,8,0,$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
			{
				Salir();
				return true;
			}
			else
			{
				Salir();
				return true;
			}
		}
		else
		{
			alert('Debe responder esta ultima pregunta, antes de salir');
			$('#vf_n1').focus();
			return false;
		}
	}
  }
}
function Salir()
{
		location.href='inicios.php';
		return true;
}


function Validar1(e,param)
{
  if(isKeyEnter(e))  // presiono ENTER
  {	
	if (parseInt(param) < 0 || parseInt(param) > 3)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		$('#btnSiguiente').focus();
		return true;
	}
  }
}
function Validar2(e,param)
{
//	alert('siguiente 0');
	if (parseInt(param) < 0 || parseInt(param) > 3)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		if(isKeyEnter(e))  // presiono ENTER
		{
		//	alert('siguiente');
			$('#btnSiguiente').focus();
			return true;
		}
		else
		{
			$('#vf_n1').focus();
			return false;
		}
	}
}

function validarDato()
{
		if (parseInt($('#vf_n1').val()) >= 0 && parseInt($('#vf_n1').val()) <= 3)
		{
			return true;
		}
		else
		{
			return false;
		}
}
function btnOpcion(val_resp)
{
		if (!(verificarGrabado())) // si no esta grabado que grabe
		{
			if(grabar($('#vf_codalu').val(),$('#vf_codpre').val(),val_resp,$('#vf_valor').val(),$('#vf_hora_inicio').val(),$('#vf_hora_fin').val()))
			{	
				if (parseInt($('#vf_n1').val()) == 9)
				{
					alert('Grabado FUERA DE TIEMPO !!!');
				}
				else
				{
					if ($('#vf_n5').val() == 'INCORRECTO')
					{
						alert('Grabado !!!  INCORRECTO  !!!');
					}
					else
					{
						alert('Grabado con exito !!!  CORRECTO  !!!');
					}
				}
				$('#btnSiguiente').focus();
				return true;
			}
			else
			{
				alert('NO Grabo  !!!');
				return false;
			}
		}
		else
		{
			alert('Esta respuesta ya esta grabada !!!');
			return true;
		}
}

function Opcion1()
{
	if(btnOpcion(1))  // presiono ENTER
	{
	//	alert('Opcion 1');
		$('#vf_n1').val(1);
		$('#btnSiguiente').focus();
		return true;
	}
	else
	{
		$('#vf_n1').focus();
		return false;
	}
}
function Opcion2()
{
	if(btnOpcion(2))  // presiono ENTER
	{
	//	alert('Opcion 2');
		$('#vf_n1').val(2);
		$('#btnSiguiente').focus();
		return true;
	}
	else
	{
		$('#vf_n1').focus();
		return false;
	}
}
function Opcion3()
{
	if(btnOpcion(3))  // presiono ENTER
	{
	//	alert('Opcion 3');
		$('#vf_n1').val(3);
		$('#btnSiguiente').focus();
		return true;
	}
	else
	{
		$('#vf_n1').focus();
		return false;
	}
}


$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
//							   $('#btnGrabar1').bind('click',function(){formSubmit();});
							   $('#btnOpcion1').bind('click',function(){Opcion1();});
							   $('#btnOpcion2').bind('click',function(){Opcion2();});
							   $('#btnOpcion3').bind('click',function(){Opcion3();});
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});
							   $('#btnNuevo').bind('click',function(){Nuevo();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
							   $('#btnVer').bind('click',function(){location.href='ver_datos.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){Confirmar($('#vf_contador').val(),$('#vf_n1').val());});
//							   $('#btnSiguiente').bind('click',function(){location.href='materias2do_p.php';});
							}
							)
