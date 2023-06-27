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
		$cod_curso=param;
		getCurso(param);
		return true;
	}
}
function getMate(e,param)
{
	param = param.toUpperCase();
	if(isKeyEnter(e))
	{
		if (valid_materia(param,$cod_curso))
		{
			getMateria(param);
			return true;
		}
	}
}
function valid_materia(id_mat,id_curso){
//	alert('1');
	var html=$.ajax({type:"GET",url:'validar_clases_v_prof.php',data:{id:id_mat,id1:id_curso},async:false}).responseText;
//	alert('2');
	if(html.trim()=='eNoPrimaria'){
	  alert('El codigo de materia no corresponde al curso o nivel');
	  $('#vf_mza').val('');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('El codigo de materia es incorrecto');
	  $('#vf_mza').val('');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eParamError2'){
	  alert('Parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
//	alert('3');
	eval(html);
//	alert('4');
	$('#vf_nombre2').val(descri);
	$('#vf_codalu').val(total);
	$('#vf_codalu').val(parseInt($('#vf_codalu').val())+1);
	$('#vf_n2').focus();
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
	var html=$.ajax({type:"GET",url:'get_cuestionario.php',data:{id:id,id1:n_curso,id2:c_mat},async:false}).responseText;
	if(html=='eNoResults'){
//	  alert('Este cuestionario no esta registrado');
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

function verificarImg()
{
	 var alto=document.getElementById('imgSalida').width;
	  var ancho=document.getElementById('imgSalida').height;
	 if(alto > 500 || ancho > 500){
		 alert("La dimension de la imagen no es correcta. Debe ser menor a: 500x500 pixels");
		 $('#imgSalida').hide();
		 $('#imagen').val("");
		 
		 return false;
				   }else{return true;}	 	
}

function validarDato()
{
	if ($('#vf_codigo').val() == '' || $('#vf_mza').val() == '' || $('#vf_codalu').val() == '' || $('#vf_n2').val() == '' || !verificarImg() )
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
	var html=$.ajax({type:"GET",url:'videos.php?op=sv',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13},async:false}).responseText;
//	alert('ya 2');

	if(html.trim()=='eNoResults'){
	  alert('No EXISTE EL CODIGO EN EL PADRON');
	$('#vf_recinto').focus();
	  return false;
	}
	if(html.trim()=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html.trim()=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	if(html.trim()=='eGrabado')
	{
//		alert('ya 3');
		$('#vf_n3').val(parseInt($('#vf_n3').val())+1);
	  return true;
	}
}
function grabar1(id8)
{
//	alert('ya 1');
		var formData = new FormData($("#fGrabar")[0]);
        var html=$.ajax({url:"clases_v.php?op=svl",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
 //      var html1=$.ajax({url:"http://190.181.61.20/upvideo/upvideo.php",type: "POST",data:{"video":"hola"},contentType: false, processData: false,async:false}).responseText;


//	alert('ya 2');

	if(html.trim()=='eNoResults'){
	  alert('No EXISTE EL CODIGO EN EL PADRON');
	$('#vf_recinto').focus();
	  return false;
	}
	if(html.trim()=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html.trim()=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	if(html.trim()=='eGrabado')
	{
//		alert('ya 3');
		$('#vf_codalu').val(parseInt($('#vf_codalu').val())+1);
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
		//    window.location.href = window.location.href + "?w1=" + jsVar1 + "&w2=" + jsVar2;
    	window.location.href = 'ver_cuestion.php' + "?w1=" + jsVar1 + "&w2=" + jsVar2 + "&w3=" + jsVar3 + "&w4=" + jsVar4 + "&w5=" + jsVar5;
		return true;
	}
	else
	{
		alert('FALTAN DATOS PARA VISUALIZAR ! O SON INCORRECTOS !!!');
		return false;
	}
}
function formSubmit()
{
	if (validarDato())
	{
			if(grabar1($('#vf_codalu').val())/*grabar($('#vf_codalu').val(),$('#vf_mza').val(),$('#vf_n2').val(),$('#vf_n3').val(),$('#vf_codigo').val())*/)
			{
				alert('GRABADO CON EXITO');
	    		$('#vf_n2').val('');
	    		$('#dir').val('');
				$('#vf_n2').focus();
				$('#imag').val("");
		    	$('#imgSalida').hide();
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
  function fileOnload(e) {
      var result=e.target.result;
      $('#imgSalida').attr("src",result);
	  $('#imgSalida').show();
  }
function addImage(e){
      var file = e.target.files[0];
      imageType = /image.*/;
    if ($('#imag').val()!="") {
     if (!file.type.match(imageType))
       return;
  
      var reader = new FileReader();
      reader.onload = fileOnload;
      reader.readAsDataURL(file);
     }else{
     	$('#imgSalida').val("");
     	$('#imgSalida').hide();
     }

 }
 function cargarCursos(){
    $.post("valid_cur_mat_prof.php?op=vcmp",function(r){
		if(r=='eSession'){
    		alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    		location.href="http://www.aizama.net";
		}
	    $("#vf_codigo").html(r);
    });
}
function cargarMaterias(){
    $.post("valid_cur_mat_prof.php?op=omcp",{ curso: $("#vf_codigo").val()} ,function(r){
		if(r=='eSession'){
    		alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    		location.href="http://www.aizama.net";
		}
	    $("#vf_mza").html(r);
    });
}
$(document).ready(function()
						   {
						       cargarCursos();
						       $("#vf_codigo").change(function(){cargarMaterias()});
						       $("#vf_mza").change(function(){valid_materia($('#vf_mza').val(),$('#vf_codigo').val())});
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
							   $('#btnVer').bind('click',function(){location.href='ver_datos_p.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){location.href='m_clases.php';});
							   $('#imag').change(function(e){addImage(e);});
							}
							)
							

