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
function getMate(e,param)
{
	param = param.toUpperCase();
	if(isKeyEnter(e))
	{
		if (valid_materia(param))
		{
			getMateria(param);
			return true;
		}
	}
}
function valid_materia(id_mat){
	var html=$.ajax({type:"GET",url:'validar_materia.php',data:{id:id_mat},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('Esta materia no la dicta este profesor');
	  $('#vf_mza').val('');
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
//	eval(html);
//	$('#vf_nombre2').val(descri);
//	$('#vf_codalu').focus();
//	alert('Si este profesor dicta esta materia');
	return true;
}
function getCurso(id){

	var html=$.ajax({type:"GET",url:'get_curso.php',data:{id:id},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('No se encontraron registro con su criterio de busqueda.');
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
	eval(html);
	$('#vf_nombre').val(descrip);
	$('#vf_mza').focus();
	return true;
}
function getMateria(id){
	var html=$.ajax({type:"GET",url:'get_materia.php',data:{id:id},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('No se encontraron registro con su criterio de busqueda.');
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
	eval(html);
	$('#vf_nombre2').val(descri);
	$('#vf_codalu').focus();
	return true;
}
function getAlumnos(id,n_curso,c_mat){
	var html=$.ajax({type:"GET",url:'get_alumnos.php',data:{id:id},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('No se encontraron registro con su criterio de busqueda33.');
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
	eval(html);
	$('#vf_paterno').val(paterno);
	$('#vf_materno').val(materno);
	$('#vf_nombres').val(nombres);
	$('#vf_n_curso').val(curso);
	
	if ($('#vf_n_curso').val()==n_curso)
	{
		if ((get_notas(id,c_mat))==0)  // saca si ya tiene notas de esta materia
		{								// si es 0 no tiene notas
//			if (parseInt($('#vf_n1').val())==0)
			{
				$('#vf_n1').val('')
				$('#vf_n2').val('')
				$('#vf_n3').val('')
				$('#vf_n4').val('')
				$('#vf_n5').val('')
			}
		}
		$('#vf_n1').focus();
		return true;
	}
	else
	{
				$('#vf_n1').val('')
				$('#vf_n2').val('')
				$('#vf_n3').val('')
				$('#vf_n4').val('')
				$('#vf_n5').val('')
	  alert('El codigo de este alumno no pertenece a este curso');
		return false;
	}
}
function get_notas(id3,idm3)
{
	var html=$.ajax({type:"GET",url:'get_nota1_alu.php',data:{id4:id3,idm4:idm3},async:false}).responseText;
	if(html=='eNoResults'){  // no hay registro de notas de esta materia de este alumno
	  return 0;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	eval(html);
	$('#vf_n1').val(n1);
	$('#vf_n2').val(n2);
	$('#vf_n3').val(n3);
	$('#vf_n4').val(n4);
	$('#vf_n1').focus();
	$suma=parseInt($('#vf_n1').val()) + parseInt($('#vf_n2').val()) + parseInt($('#vf_n3').val()) + parseInt($('#vf_n4').val())
	$('#vf_n5').val($suma)
	return 1;
}
function Buscar()
{
	    	$('#vf_carnet').val('');
	    	$('#vf_carnet2').val('');
	    	$('#vf_carnet3').val('');
	    	$('#vf_paterno').val('');
		    $('#vf_materno').val('');
    		$('#vf_esposo').val('');
		    $('#vf_nombre').val('');
		    $('#vf_nombre2').val('');
			$('#vf_dir').val('');
			$('#vf_total').val(0);
			$('#vf_carnet3').focus();
			return true;
}

function grabar(id8,id9,id11,id12,id13,id14)
{
	var html=$.ajax({type:"GET",url:'grabar_eval_online.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:id14},async:false}).responseText;

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
	if(html=='eGrabado'){
//		alert('gol 4');
		$('#vf_n1').val('9');
		$('#vf_n5').val('FUERA DE TIEMPO');
	  return true;
	}
	if(html=='eCorrecto')
	{
//		alert('1');
		if(parseInt($('#vf_nota_final').val()) == 0)
		{
			$('#vf_nota_final').val(parseInt($('#vf_valor').val()));
		}
		else
		{
			$suma=parseInt($('#vf_nota_final').val()) + parseInt($('#vf_valor').val());
			$('#vf_nota_final').val($suma);
		}
		$('#vf_n5').val('CORRECTO');
		return true;
	}
	if(html=='eIncorrecto'){
	  $('#vf_n5').val('INCORRECTO');
	  return true;
	}
	alert('gol 5');

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
					alert('Grabado con exito !!!');
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
	var html=$.ajax({type:"GET",url:'get_grabado_preg.php',data:{id1:$codalu,id2:$codpre},async:false}	).responseText;

	if(html=='eNoResults'){
	// EL ALUMNO NO TIENE REGISTRADA NINGUNA RESPUESTA
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
	// EL ALUMNO YA TIENE REGISTRADA SU RESPUESTA
//	alert('oye 1');
	eval(html);
//	alert('oye 2');
//	$('#vf_n1').val(resp);
//	$('#vf_nota').val(nota);
//	$('#vf_fecha').val(fecha);
//	$('#vf_hora').val(hora);

    return true;
  }
}
function getDatosGrabados(id)
{
//		alert ('voy : ' + id);
	var html=$.ajax({type:"GET",url:'get_datos_eval.php',data:{id:id},async:false}).responseText;

//	alert ('voy : 1');
	if(html=='eFin'){
	  alert('Examen Finalizado');
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
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
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
	var html=$.ajax({type:"GET",url:'get_hora.php',data:{id:id1},async:false}).responseText;
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
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
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
	var html=$.ajax({type:"GET",url:'get_cantidad.php',data:{id:id1},async:false}).responseText;
//	alert ('bola 22');

	if(html=='eNoResults'){
		// no esta grabada la respuesta
	  alert('Fin de Archivo  23');
//	$('#vf_hora_inicio').val(hora2);
	  return false;
	}
	if(html=='eFin'){
		// no esta grabada la respuesta
	  alert('Fin de Archivo  24');
//	$('#vf_hora_inicio').val(hora2);
	  return 0;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
//	clearInputs();
// la pregunta esta grabada
//	alert ('hoy 1');
	eval(html);
//	alert ('hoy 2');
	$('#vf_contador').val(num);
    $('#vf_nota_final').val(notita);
//	$('#vf_n1').focus();
//	alert ('hoy 32' + $('#vf_contador').val());
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
	if ($('#vf_contador').val() == 5)
	{
		alert('Examen ya realizado y terminado por el alumno. NOTA FINAL SOBRE 100: ' + $('#vf_nota_final').val());
		$('#vf_contador').val('0');
	}
	else
	{
		$contador = parseInt($('#vf_contador').val());
		$contador=$contador+1;
		getSiguiente($contador);
		getObtHora(parseInt($('#vf_tiempo').val()));
		getDatosGrabados(parseInt($('#vf_codpre').val()));
		$('#vf_n1').focus();
	}
	return true;
  }
  else
  {
  if (parseInt($('#vf_numero').val()) == 0 && parseInt($('#vf_contador').val()) > 0)
  {
//	alert ('hoy 43');
	$contador = parseInt($('#vf_contador').val());
	getSiguemismo($contador,parseInt($('#vf_codpre').val()));
	getObtHora(parseInt($('#vf_tiempo').val()));
	getDatosGrabados(parseInt($('#vf_codpre').val()));
	$('#vf_n1').focus();
	return true;
  }
  else
  {
//	alert ('hoy 44');
	if (verificarGrabado())  // verifica si se grabo o esta grabado el que esta mostrando nada mas 
	{				// verifica con el codigo del alumno y codigo de pregunta
		$('#vf_n1').val('');
		$('#vf_n5').val('');
		$contador = parseInt($('#vf_contador').val());
		if (parseInt($('#vf_codpre').val()) == parseInt($('#vf_numero').val()))
		{
			$contador=$contador+1;
			getSiguiente($contador);
		}
		else
		{
//			getSiguemismo($contador);
			$contador = parseInt($('#vf_contador').val());
			getSiguemismo($contador,parseInt($('#vf_codpre').val()));
		}
//		  alert(' contador22 : ' + $contador);
//		alert('fo 1');
		getObtHora(parseInt($('#vf_tiempo').val()));
//		alert('fo 2');
		getDatosGrabados(parseInt($('#vf_codpre').val()));
//		alert('fo 3');
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
	var html=$.ajax({type:"GET",url:'get_pregunta.php',data:{id:id},async:false}).responseText;

	if(html=='eFin'){
	  alert('Examen Finalizado');
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
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
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
	var html=$.ajax({type:"GET",url:'get_preg_mismo.php',data:{id:id1,id2:id3},async:false}).responseText;

	if(html=='eFin'){
	  alert('Examen Finalizado');
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
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
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
	if (parseInt(param) < 0 || parseInt(param) > 3)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		if(isKeyEnter(e))  // presiono ENTER
		{
			//alert('siguiente');
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

function formSubmit()
{
	if (validarDato())
	{
		if (grabado($('#vf_codalu').val(),$('#vf_mza').val())==1)
		{
//			$('#fGrabar').submit();
			if(grabar($('#vf_codalu').val(),$('#vf_mza').val(),$('#vf_n1').val(),$('#vf_n2').val(),$('#vf_n3').val(),$('#vf_n4').val()))
			{
				alert('GRABADO CON EXITO');
		    	$('#vf_codalu').val('');
	    		$('#vf_n_curso').val('');
		    	$('#vf_paterno').val('');
			    $('#vf_materno').val('');
			    $('#vf_nombres').val('');
				$('#vf_n1').val('')
				$('#vf_n2').val('')
				$('#vf_n3').val('')
				$('#vf_n4').val('')
				$('#vf_n5').val('')
				$('#vf_codalu').focus();
				return true;
			}
			else
			{
				alert('NO SE GRABO !!!!!');
				return false;
			}
		}
		else
		{
			if (grabado($('#vf_codalu').val(),$('#vf_mza').val())==2)
			{
				if (regrabar($('#vf_codalu').val(),$('#vf_mza').val(),$('#vf_n1').val(),$('#vf_n2').val(),$('#vf_n3').val(),$('#vf_n4').val()))
				{
					alert('ACTUALIZADO CON EXITO');
			    	$('#vf_codalu').val('');
	    			$('#vf_n_curso').val('');
				    $('#vf_paterno').val('');
				    $('#vf_materno').val('');
				    $('#vf_nombres').val('');
					$('#vf_n1').val('')
					$('#vf_n2').val('')
					$('#vf_n3').val('')
					$('#vf_n4').val('')
					$('#vf_n5').val('')
					$('#vf_codalu').focus();
					return true;
				}
				else
				{
					alert('sin ACTUALIZAR');
					return false;
				}
			}
		}
	}
	else
	{
		alert('FALTAN DATOS PARA GRABAR ! O SON INCORRECTOS 1!!!');
		return false;
	}
}



$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
							   $('#btnGrabar1').bind('click',function(){formSubmit();});
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});
							   $('#btnNuevo').bind('click',function(){Nuevo();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
							   $('#btnVer').bind('click',function(){location.href='ver_datos.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){location.href='materias2do_p.php';});
							}
							)
