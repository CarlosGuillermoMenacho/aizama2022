function Recinto(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		getRecinto(param);
		return true;
	}
}


function getRecinto(id){
	var html=$.ajax({type:"GET",url:'get_recinto.php',data:{id:id},async:false}).responseText;
	
	if(html=='eNoResults'){
	  alert('No EXISTE EL CODIGO DE RECINTO');
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
	eval(html);
    $('#vf_recinto').val(recinto);
	$('#vf_nombre').focus();
		alert(' OK !!!!!');
		return true;
}

function CargarContrato(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_nombre').val('');
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!')
			return;
		}
		param=param*10/10
//		SacarContrato(param);
		if (SacarContrato(param))
		{
			$('#vf_actual').focus();
		}
		else
		{
			$('#vf_contrato').focus();
		}
	}
	else
	{
		$('#vf_nombre').val('');
	}
}
function SacarContrato(id){
	var html=$.ajax({type:"GET",url:'sacar_contrato.php',data:{id:id},async:false}).responseText;
	
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
	clearInputs();
	eval(html);
    $('#vf_catastro').val(codcatastral);
	$('#vf_contrato').val(idcontrato);
	$('#vf_nombre').val(nombre);
	$('#vf_anterior').val(anterior);
	$('#vf_actual').val(lectura);
	$('#vf_promedio').val(promedio);
	$('#vf_nrocor').val(nrocor);
	$('#vf_periodo').val(periodo);
	$('#vf_medidor').val(nroseriemedidor);
	$('#vf_ubicacion').val(ubicacion);
	$('#vf_clave').val(clavelectura);
	$('#vf_desclave').val(deslectura);
	$('#vf_claveuso').val(claveuso);
	$('#vf_desclaveuso').val(desuso);
	$('#vf_categoria').val(idcategoria);
	$('#vf_descategoria').val(descategoria);
	$('#vf_grabados').val(grabados);
	if ($('#vf_actual').val()== '')
	{
		$('#vf_grabao').val('NO');
	}
	else
	{
		$('#vf_grabao').val('Si');
	}
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

function Sigue(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_actual').focus();
		return true;
	}
}
function Sigue2(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_clave').focus();
		return true;
	}
}
function Sigue3(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_claveuso').focus();
		return true;
	}
}
function Sigue4(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#btnGrabar').focus();
		return true;
	}
}
function getGrab3(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		getGrab2(param);
		return true;
	}
}


function getGrab2(id){
	var html=$.ajax({type:"GET",url:'get_grabado.php',data:{id:id},async:false}).responseText;
	
	if(html=='eNoResults'){
//	  alert('No se encontraron registro con su criterio de busqueda. MESA NO INTROD');
    $('#vf_anterior').val('');
    $('#vf_actual').val('');
    $('#vf_clave').val('');
    $('#vf_claveuso').val('');
	$('#vf_anterior').focus();
	  return true;
//	  return false;
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
    $('#vf_desclave').val(desclave);
    $('#vf_anterior').val(p1);
    $('#vf_actual').val(p2);
    $('#vf_clave').val(vb);
    $('#vf_claveuso').val(vn);
//    $('#vf_clave').val(id);
	$('#vf_anterior').focus();
		alert('Mesa ya grabada !!!!!');
		return true;
}

function getLect(e,param,prom,anterior)
{
		  alert('hola ');

	if(isKeyEnter(e))  //presiono enter
	{
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!')
			return;
		}
		if (parseInt(param) <= parseInt(anterior))
		{
			alert('PRECAUCION!! La lectura actual: '+parseInt(param)+'. Es MENOR a la anterior: '+parseInt(anterior)+'. VERIFIQUE!!!!: ');
		}
		else
		{
			cubos=param-anterior;
			nuevo_prom=((cubos-prom)*100)/prom;
			if (nuevo_prom >= 50)
			{
				//alert('El promedio de la lectura es mayor al 50 %');
				alert('Ojo ' + parseInt(nuevo_prom) + '%');
			}
		}
		$('#vf_clave').focus();
	}
}

function getClaveLect(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_desclave').val('');
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!')
			return;
		}
		param=param*10/10
		getClave(param);
	}
}
function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}
function getClave(id){
	var html=$.ajax({type:"GET",url:'get_clave_lect.php',data:{id:id},async:false}).responseText;
	
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
    $('#vf_desclave').val(desclave);
    $('#vf_clave').val(id);
	$('#vf_claveuso').focus();
	return true;
}
function SacarClaveUso(id){
	var html=$.ajax({type:"GET",url:'get_clave_uso.php',data:{id:id},async:false}).responseText;
	
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
    $('#vf_desclaveuso').val(desclaveuso);
    $('#vf_claveuso').val(id);
	$('#vf_claveuso').focus();
	return true;
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

function getSiguiente(id)
{

	var html=$.ajax({type:"GET",url:'siguiente.php',data:{id:id},async:false}).responseText;

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
	clearInputs();
	eval(html);
    $('#vf_catastro').val(codcatastral);
	$('#vf_contrato').val(idcontrato);
	$('#vf_nombre').val(nombre);
	$('#vf_anterior').val(anterior);
	$('#vf_actual').val(lectura);
	$('#vf_promedio').val(promedio);
	$('#vf_nrocor').val(nrocor);
	$('#vf_periodo').val(periodo);
	$('#vf_medidor').val(nroseriemedidor);
	$('#vf_ubicacion').val(ubicacion);
	$('#vf_clave').val(clavelectura);
	$('#vf_desclave').val(deslectura);
	$('#vf_claveuso').val(claveuso);
	$('#vf_desclaveuso').val(desuso);
	$('#vf_categoria').val(idcategoria);
	$('#vf_descategoria').val(descategoria);
	$('#vf_grabados').val(grabados);
//	c_grab=$('#vf_actual').val()/10*10;
//	if (c_grab>= 0)
	if ($('#vf_actual').val()== '')
	{
		$('#vf_grabao').val('NO');
	}
	else
	{
		$('#vf_grabao').val('Si');
	}
	return true;
}
function getAnterior(id)
{
	var html=$.ajax({type:"GET",url:'anterior.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('Inicio de Archivo');
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
	clearInputs();
	eval(html);
    $('#vf_catastro').val(codcatastral);
	$('#vf_contrato').val(idcontrato);
	$('#vf_nombre').val(nombre);
	$('#vf_anterior').val(anterior);
	$('#vf_actual').val(lectura);
	$('#vf_promedio').val(promedio);
	$('#vf_periodo').val(periodo);
	$('#vf_nrocor').val(nrocor);
	$('#vf_medidor').val(nroseriemedidor);
	$('#vf_ubicacion').val(ubicacion);
	$('#vf_clave').val(clavelectura);
	$('#vf_desclave').val(deslectura);
	$('#vf_claveuso').val(claveuso);
	$('#vf_desclaveuso').val(desuso);
	$('#vf_categoria').val(idcategoria);
	$('#vf_descategoria').val(descategoria);
	$('#vf_grabados').val(grabados);
	if ($('#vf_actual').val()== '')
	{
		$('#vf_grabao').val('NO');
	}
	else
	{
		$('#vf_grabao').val('Si');
	}
	return true;
}

function Siguiente()
{

	getSiguiente(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
//	getSiguiente(parame); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#vf_actual').focus();
	$('#vf_actual').focus();
}

function Anterior()
{
	getAnterior(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#vf_actual').focus();
}

function validarDato()
{
	if ($('#vf_nombre').val() == '' || $('#vf_anterior').val() == '' || $('#vf_actual').val() == '' || $('#vf_clave').val() == '' || $('#vf_claveuso').val() == '')
	{
		return false;
	}
	else
	{
		if ($('#vf_nombre').val() > 0 && $('#vf_anterior').val() > 0 && $('#vf_actual').val() > 0 && $('#vf_clave').val() > 0 && $('#vf_claveuso').val() > 0 )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}


function getAsignarBimestre(id)
{
	var html=$.ajax({type:"GET",url:'asignar_bimestre.php',data:{id:id},async:false}).responseText;
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

function primero()
{
	$codb = 1;
	if (getAsignarBimestre($codb))
	{
		if ($('#vf_perfil').val() == 'PRIMARIA')
		{
			location.href='practicos_primaria.php';
		}
		else
		{
			if ($('#vf_perfil').val() == 'SECUNDARIA')
			{
				location.href='practicos_secundaria.php';
			}
			else
			{
				location.href='aviso_practicos.php';
			}
		}
	}
}
function segundo()
{
	$codb = 2;
	if (getAsignarBimestre($codb))
	{
		if ($('#vf_perfil').val() == 'PRIMARIA')
		{
			location.href='practicos_primaria.php';   // ESTE DESHABILITE
//			location.href='aviso1.php';
		}
		else
		{
			if ($('#vf_perfil').val() == 'SECUNDARIA')
			{
				location.href='practicos_secundaria.php';
			}
			else
			{
				location.href='aviso_practicos.php';
			}
		}
	}
}
function tercero()
{
	$codb = 3;
	if (getAsignarBimestre($codb))
	{
		if ($('#vf_perfil').val() == 'PRIMARIA')
		{
			location.href='practicos_primaria.php';   // ESTE DESHABILITE
//			location.href='aviso1.php';
		}
		else
		{
			if ($('#vf_perfil').val() == 'SECUNDARIA')
			{
				location.href='practicos_secundaria.php';
			}
			else
			{
				location.href='aviso_practicos.php';
			}
		}
	}
}
function cuarto()
{
	$codb = 4;
	if (getAsignarBimestre($codb))
	{
		if ($('#vf_perfil').val() == 'PRIMARIA')
		{
			location.href='practicos_primaria.php';   // ESTE DESHABILITE
//			location.href='aviso1.php';
		}
		else
		{
			if ($('#vf_perfil').val() == 'SECUNDARIA')
			{
				location.href='practicos_secundaria.php';
			}
			else
			{
				location.href='aviso_practicos.php';
			}
		}
	}
}

function Salir()
{
	if ($('#vf_perfil').val() == 'PRIMARIA')
	{
		location.href='menu_primaria.php';
		return true;
	}
	else
	{
		if ($('#vf_perfil').val() == 'SECUNDARIA')
		{
			location.href='menu_secundaria.php';
			return true;
		}
		else
		{
			location.href='menu_inicial.php';
			return true;
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


$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
//							   $('#btnGrabar').bind('click',function(){formSubmit();});
//							   $('#btnGrabar').bind('click',function(){Grabar();});
//							   $('#btnAnterior').bind('click',function(){Anterior();});
//							   $('#btnSiguiente').bind('click',function(){Siguiente();});
//							   $('#btnLista').bind('click',function(){location.href='Lista.php';});
//							   $('#btnbi1').bind('click',function(){location.href='materias1ro_p.php';});
							   $('#btnbi1').bind('click',function(){primero();});
							   $('#btnbi2').bind('click',function(){segundo();});
							   $('#btnbi3').bind('click',function(){tercero();});
							   $('#btnbi4').bind('click',function(){cuarto();});
//							   $('#btnbi2').bind('click',function(){location.href='materias2do_p.php';});
//							   $('#btnbi3').bind('click',function(){location.href='materias3ro_p.php';});
//							   $('#btnbi4').bind('click',function(){location.href='materias4to_p.php';});
//							   $('#btnSalir').bind('click',function(){location.href='alumno.php';});
							   $('#btnSalir').bind('click',function(){Salir();});
							}
							)
