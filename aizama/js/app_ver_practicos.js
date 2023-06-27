function getAlu(e,param,c_curso,c_materia)

{

	c_materia = c_materia.toUpperCase();

	if(isKeyEnter(e))

	{

//		getAlumnos(param,c_curso,c_materia);

		getCuestionario(param,c_curso,c_materia);

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

function getCuestionario(id,n_curso,c_mat)

{

//		alert('11');

	var html=$.ajax({type:"GET",url:'get_cuestionario.php',data:{id:id,id1:n_curso,id2:c_mat},async:false}).responseText;

	if(html=='eNoResults'){

	  alert('Este Nro. de practico de esta materia en este curso NO esta registrado');

		$('#vf_n3').val('0');

		$('#vf_n2').focus();

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

//	alert ('hola 3');

	eval(html);

//	alert ('hola 4');

	$('#vf_n3').val(total);

	$('#vf_n2').focus();

	return true;

}



function getClaveUso(e,param)

{

	if(isKeyEnter(e))  //presiono enter

	{

		$('#vf_desclaveuso').val('');

		if(parseInt(param)!=param)

		{

			alert('Dato invalido !!!!')

			return;

		}

		param=param*10/10

		SacarClaveUso(param);

	}

}



function isKeyEnter(e)

{

	var evt=e?e:event;

	var key=window.Event?evt.which:evt.keyCode;

	if(key==13)	return true;return false;

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







function validarDato()

{

	if ($('#vf_codigo').val() == '' || $('#vf_mza').val() == '' || $('#vf_codalu').val() == '' || $('#vf_n2').val() == '')

	{

//		alert('1');

		return false;

	}

	else

	{

		if (parseInt($('#vf_codigo').val()) >= 0 && parseInt($('#vf_codalu').val()) >= 0 )

		{

			return true;

		}

		else

		{

//			alert('2');

			return false;

		}

	}

}



function grabado(id,codmate)

{

	codmate = codmate.toUpperCase();

	var html=$.ajax({type:"GET",url:'get_grabado_nota.php',data:{id1:id,id2:codmate},async:false}	).responseText;



	if(html=='eNoResults'){

//		solo por este motivo tiene que grabarse

	// EL ALUMNO NO TIENE REGISTRADA NINGUNA NOTA DE ESTA MATERIA

//	  return true;

	  return 1;

	}

	if(html=='eParamError'){

	  alert('Se han enviado parametros incorrectos.');

		return false;

	}

	if(html=='eSession'){

	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

	  return false;

	}

    return 2;

}

function grabar(id8,id9,id11,id12,id13)

{

//	alert('ya 1');

	var html=$.ajax({type:"GET",url:'grabar_pregunta1.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13},async:false}).responseText;

//	alert('ya 2');



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

		$('#vf_n3').val(parseInt($('#vf_n3').val())+1);

	  return true;

	}

}

function validarVer()

{

	if ($('#vf_codigo').val() == '' || $('#vf_mza').val() == '' || $('#vf_codalu').val() == '')

	{

//		alert('1');

		return false;

	}

	else

	{

		if (parseInt($('#vf_codigo').val()) >= 0 && parseInt($('#vf_codalu').val()) >= 0 )

		{

			return true;

		}

		else

		{

//			alert('2');

			return false;

		}

	}

}



function Ver_cuestionario()

{

	if (validarVer())

	{

	    var jsVar1 = parseInt($('#vf_codigo').val());

    	var jsVar2 = $('#vf_mza').val();

	    var jsVar3 = parseInt($('#vf_codalu').val());

    	var jsVar4 = $('#vf_nombre').val();

    	var jsVar5 = $('#vf_nombre2').val();
    	var vista = getParameterByName('vista');

		//    window.location.href = window.location.href + "?w1=" + jsVar1 + "&w2=" + jsVar2;

    	window.location.href = 'ver_cuestion_alu_sec.php' + "?w1=" + jsVar1 + "&w2=" + jsVar2 + "&w3=" + jsVar3 + "&w4=" + jsVar4.trim() + "&w5=" + jsVar5.trim()+"&vista="+vista;

		return true;

	}

	else

	{

		alert('FALTAN DATOS PARA VISUALIZAR ! O SON INCORRECTOS !!!');

		return false;

	}

}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function Salir()

{

	if ($('#vf_perfil').val() == 'PRIMARIA')

	{

		location.href='practicos_primaria.php';

		return true;

	}

	else

	{

		if ($('#vf_perfil').val() == 'SECUNDARIA')

		{
		    var vista=getParameterByName('vista');
		    if(vista=='1'){
            location.href='clases_v_secundaria.php';
		    }
            if(vista=='2'){
            location.href='videos_secundaria.php';
            }
            if(vista=='3'){
            location.href='practicos_secundaria.php';
            }
            
			

			return true;

		}

		else

		{

			location.href='practicos_inicial.php';

			return true;

		}

	}

}





function formSubmit()

{

	if (validarDato())

	{

			if(grabar($('#vf_codalu').val(),$('#vf_mza').val(),$('#vf_n2').val(),$('#vf_n3').val(),$('#vf_codigo').val()))

			{

				alert('GRABADO CON EXITO');

	    		$('#vf_n2').val('');

				$('#vf_n2').focus();

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

		alert('FALTAN DATOS PARA GRABAR ! O SON INCORRECTOS 1!!!');

		return false;

	}

}

function showVideo(){

    var request=$.ajax({url:"videos.php?op=gv",type:"POST",data:{"curso":$('#vf_codigo').val(),"materia":$('#vf_mza').val(),"numero":$('#vf_video').val()},async:false}).responseText;
    if(request.trim()!='noData'){
    	var videoJSON=JSON.parse(request);
    	$('#title').html(videoJSON.descrip);
    	$('#reproduce1').attr('href',videoJSON.link);
//    	$('#reproduce1').attr('src',videoJSON.link);
    	$('#linkdirec').attr('href',videoJSON.link);

    	$('#video1').show();
	}else{
    	alert("No hay video...!");
    }
}
function showClaseVirtual(){

    var request=$.ajax({url:"clases_v.php?op=gv",type:"POST",data:{"curso":$('#vf_codigo').val(),"materia":$('#vf_mza').val(),"numero":$('#vf_clases_v').val()},async:false}).responseText;
    if(request.trim()!='noData'){
    	var videoJSON=JSON.parse(request);
    	$('#title').html(videoJSON.descrip);
    	$('#reproduce1').attr('href',videoJSON.link);
//    	$('#reproduce1').attr('src',videoJSON.link);
    	$('#linkdirec').attr('href',videoJSON.link);

    	$('#video1').show();
	}else{
    	alert("No hay Clase Virtual...!");
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
//							   $('#btnVer_Cu').bind('click',function(){location.href='ver_cuestion.php';});
							   $('#btnVer_Cu').bind('click',function(){Ver_cuestionario();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
							   $('#btnVer').bind('click',function(){location.href='ver_datos.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){Salir();});
							   $('#btnVer_Vid').bind('click',function(){showVideo();});
							   $('#btnVer_clase_v').bind('click',function(){showClaseVirtual();});
							}
							)

