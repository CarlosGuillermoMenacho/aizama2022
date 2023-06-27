function Buscar_dato(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		getBuscar(param); //verifica si esta en el padron
		return true;
	}
}
function getBuscar(id)
{
	var html=$.ajax({type:"GET",url:'enc_buscar.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('ESTE CODIGO NO ESTA REGISTRADO !!!');
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
    $('#vf_carnet').val(id);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_total').val(total);
    $('#vf_registro').val(nro_reg);
	$('#vf_lugar').focus();
		return true;
}
function Padron(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		getPadron(param); //verifica si esta en el padron
		return true;
	}
}
function getPadron(id){
	var html=$.ajax({type:"GET",url:'get_padron.php',data:{id:id},async:false}).responseText;

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
	eval(html);
    $('#vf_carnet').val(id);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_carnet3').val('');
	$('#vf_lugar').focus();
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

	var html=$.ajax({type:"GET",url:'enc_siguiente.php',data:{id:id},async:false}).responseText;

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
    $('#vf_carnet').val(carnet);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_registro').val(nro_reg);
	$('#vf_total').val(total);
    $('#vf_carnet3').val('');
		return true;
}
function getAnterior(id)
{
	var html=$.ajax({type:"GET",url:'enc_anterior.php',data:{id:id},async:false}).responseText;

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
    $('#vf_carnet').val(carnet);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_registro').val(nro_reg);
	$('#vf_total').val(total);
    $('#vf_carnet3').val('');
		return true;
}
function getInicio(id)
{
	var html=$.ajax({type:"GET",url:'enc_inicio.php',data:{id:id},async:false}).responseText;

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
    $('#vf_carnet').val(carnet);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_registro').val(nro_reg);
	$('#vf_total').val(total);
    $('#vf_carnet3').val('');
		return true;
}
function getFin(id)
{
	var html=$.ajax({type:"GET",url:'enc_fin.php',data:{id:id},async:false}).responseText;

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
    $('#vf_carnet').val(carnet);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_registro').val(nro_reg);
	$('#vf_total').val(total);
    $('#vf_carnet3').val('');
	$('#btnFin').focus();
		return true;
}
function Inicio()
{
	getInicio(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#btnInicio').focus();
}
function Fin()
{
	getFin(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#btnFin').focus();
}
function Siguiente()
{

	getSiguiente(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
//	getSiguiente(parame); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#btnSiguiente').focus();
}

function Anterior()
{
	getAnterior(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#btnAnterior').focus();
}

function grabado(id)
{
	var html=$.ajax({type:"GET",url:'get_grabado.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
//	  alert('Inicio de Archivo');
//		solo por este motivo tiene que grabarse
	  return true;
	}
	if(html=='eParamError'){
//	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
//	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	return false;
}
function Nuevo()
{
	    	$('#vf_carnet').val('');
	    	$('#vf_paterno').val('');
		    $('#vf_materno').val('');
    		$('#vf_esposo').val('');
		    $('#vf_nombre').val('');
			$('#vf_dir').val('');
			$('#vf_total').val(0);
			$('#vf_carnet').focus();
			return true;
}
function Buscar()
{
	    	$('#vf_carnet').val('');
	    	$('#vf_paterno').val('');
		    $('#vf_materno').val('');
    		$('#vf_esposo').val('');
		    $('#vf_nombre').val('');
			$('#vf_dir').val('');
			$('#vf_total').val(0);
			$('#vf_carnet3').focus();
			return true;
}
function validarDato()
{
	if ($('#vf_carnet').val() == '' || $('#vf_paterno').val() == '' || $('#vf_nombre').val() == '')
	{
		return false;
	}
	else
	{
		return true;
	}
}
function formSubmit()
{
	if (validarDato())
	{
		if (grabado($('#vf_carnet').val()))
		{
			$('#fGrabar').submit();
			alert('GRABADO CON EXITO');
	    	$('#vf_carnet').val('');
	    	$('#vf_paterno').val('');
		    $('#vf_materno').val('');
    		$('#vf_esposo').val('');
		    $('#vf_nombre').val('');
			$('#vf_dir').val('');
			$('#vf_total').val(0);
			$('#vf_carnet').focus();
			return true;
		}
		else
		{
		alert('ESTE REGISTRO YA ESTA GRABADO !!!');
		}
	}
	else
	{
		alert('FALTAN DATOS PARA GRABAR ! O SON INCORRECTOS !!!');
	}
}

$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
							   $('#btnGrabar').bind('click',function(){formSubmit();});
//							   $('#btnGrabar').bind('click',function(){Grabar();});
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});
							   $('#btnNuevo').bind('click',function(){Nuevo();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
//							   $('#btnImprimir_lista').bind('click',function(){Imprimir_1();});
							   $('#btnVer_lista').bind('click',function(){location.href='ver_lista.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){location.href='menu1.php';});
							}
							)
