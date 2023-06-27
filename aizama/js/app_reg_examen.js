function addImage(e){
      var file = e.target.files[0];
      imageType = /image.*/;
    
      if (!file.type.match(imageType))
       return;
  
      var reader = new FileReader();
      reader.onload = fileOnload;
      reader.readAsDataURL(file);
     }
  
     function fileOnload(e) {
      var result=e.target.result;
      $('#imgSalida').attr("src",result);
     }
function init(){
	
	$.post("obtener_cursos.php?op=obtener",function(r){

	$("#vf_codigo").html(r);
});}
function recargarLista(){
		$.ajax({
			type:"POST",
			url:"obtener_materias.php",
			data:"cod_curso=" + $('#vf_codigo').val(),
			success:function(r){
				$('#vf_mza').html(r);
			}
		});
	}	



function Validar7(e,param)
{
	if(isKeyEnter(e))  // presiono ENTER
	{
		//alert('siguiente');
		$('#vf_op1').focus();
		return true;
	}
}
function Validar6(e,param)
{
	if(isKeyEnter(e))  // presiono ENTER
	{
		//alert('siguiente');
		$('#vf_re1').focus();
		return true;
	}
}
function Validar5(e,param)
{
	if(isKeyEnter(e))  // presiono ENTER
	{
		//alert('siguiente');
		$('#vf_op3').focus();
		return true;
	}
}
function Validar4(e,param)
{
	if(isKeyEnter(e))  // presiono ENTER
	{
		//alert('siguiente');
		$('#vf_op2').focus();
		return true;
	}
}

function Validar3(e,param)
{
	if (parseInt(param) < 0 || parseInt(param) > 9)
	{
		alert('El valor es invalido (debe ser entre 1 y 9 minutos)')
		return false;
	}
	else
	{
		if(isKeyEnter(e))  // presiono ENTER
		{
			//alert('siguiente');
			$('#btnGrabar1').focus();
			return true;
		}
		else
		{
			$('#vf_re2').focus();
			return false;
		}
	}
}

function Validar2(e,param)
{
	if (parseInt(param) < 0 || parseInt(param) > 3)
	{
		alert('El valor es invalido (el valor es entre 1 y 3)')
		return false;
	}
	else
	{
		if(isKeyEnter(e))  // presiono ENTER
		{
			//alert('siguiente');
			$('#vf_re2').focus();
			return true;
		}
	}
}

function getAlu(e,param,c_curso,c_materia)
{
//	alert ('El 3');
	c_materia = c_materia.toUpperCase();
	if(isKeyEnter(e))
	{
//		getAlumnos(param,c_curso,c_materia);
//		alert ('El 1');
		getCuestionario(param,c_curso,c_materia);
//		alert ('El 2');
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
	  alert('No se encontraron registros con su criterio de busqueda.');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  	alert("La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos");
	  	return false;
	}
	eval(html);
	$('#vf_nombre2').val(descri);
	$('#vf_codalu').focus();
	return true;
}
function getCuestionario(id,n_curso,c_mat)
{
//	alert('Este 1');
	var html=$.ajax({type:"GET",url:'get_examen.php',data:{id:id,id1:n_curso,id2:c_mat},async:false}).responseText;
//	alert('Este 2');
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



function validarDato()
{
	if ($('#vf_codigo').val() == '' || $('#vf_mza').val() == '' || $('#vf_codalu').val() == '' || $('#vf_n2').val() == '' || $('#vf_op1').val() == '' || $('#vf_op2').val() == '' || $('#vf_op3').val() == '' || $('#vf_re1').val() == '' || $('#vf_re2').val() == '')
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
function grabar(id8,id9,id11,id12,id13,op1,op2,op3,re1,re2)
{
//	alert('ya 1');
	var html=$.ajax({type:"GET",url:'grabar_examen1.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:op1,id7:op2,id8:op3,id9:re1,id10:re2},async:false}).responseText;
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
function grabar1()
{
//	alert('ya 1');
	//var html=$.ajax({type:"GET",url:'grabar_examen1.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:op1,id7:op2,id8:op3,id9:re1,id10:re2},async:false}).responseText;
//	alert('ya 2');
var formData = new FormData($("#fGrabar")[0]);
var html=$.ajax({url:"grabar_examenes.php?op=grabar",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
console.log(html);
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
		var curso = document.getElementById("vf_codigo");
		var cursoselect = curso.options[curso.selectedIndex].text;
		var materia = document.getElementById("vf_mza");
		var materiaselect = materia.options[materia.selectedIndex].text;
	    var jsVar3 = parseInt($('#vf_codalu').val());
    	var jsVar4 = cursoselect;
    	var jsVar5 = materiaselect;
		//    window.location.href = window.location.href + "?w1=" + jsVar1 + "&w2=" + jsVar2;
    	window.location.href = 'ver_examen.php' + "?w1=" + jsVar1 + "&w2=" + jsVar2 + "&w3=" + jsVar3 + "&w4=" + jsVar4 + "&w5=" + jsVar5;
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
			if(grabar1(/*$('#vf_codalu').val(),$('#vf_mza').val(),$('#vf_n2').val(),$('#vf_n3').val(),$('#vf_codigo').val(),$('#vf_op1').val(),$('#vf_op2').val(),$('#vf_op3').val(),$('#vf_re1').val(),$('#vf_re2').val()*/))
			{
				alert('GRABADO CON EXITO');
	    		$('#vf_n2').val('');
	    		$('#vf_op1').val('');
	    		$('#vf_op2').val('');
	    		$('#vf_op3').val('');
	    		$('#vf_re1').val('');
	    		$('#vf_re2').val('');
	    		$('#imagen').val('');
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

init();
$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
							   $('#btnGrabar1').bind('click',function(){formSubmit();});
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});
							   $('#btnNuevo').bind('click',function(){Nuevo();});
							   $('#imagen').change(function(e) {addImage(e);});
//							   $('#btnVer_Cu').bind('click',function(){location.href='ver_cuestion.php';});
							   $('#btnVer_Cu').bind('click',function(){Ver_cuestionario();});
							   $('#vf_codigo').change(function(){recargarLista();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
							   $('#btnVer').bind('click',function(){location.href='ver_datos_exa.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){location.href='m_examen.php';});
							  
							}
							)
