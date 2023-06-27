var gNumFacturas=0;
var gTotalMonto=0;
var gTotalFactura=0;
var fctNumDoc=0;
var cortado=0;
var conexion=0;
var nfp=0;
var gDatos=Array();
ecurso='';

function getResultados(e,param)
{
	if(isKeyEnter(e))
	{
//		clearInputs();
		clearFactura();
		if(parseInt(param)==param)  //ESTO VERIFICA QUE EL DATO SEA NUMERO
		{
			if (getAlumnos(param))
			{
				sacar_pagos(param,$('#vf_curso').val());
				return true;
			}
			else
			{
				alert('Este alumno no tiene notas registradas');
				return false;
			}
		}
		else
		{
			alert ('El dato no es correcto')
			return false;
		}
	}
}
function sacar_pagos(idalumno,idcurso)
{
	var html=$.ajax({type:"GET",url:'get_pagos.php',data:{id:idalumno},async:false}).responseText;
	if(html=='eNoResults')
	{
		alert('No tiene facturas pendientes.');
		$('#vf_codigo').focus();
		return false;
	}
	else
	{
		if(html=='eParamError')
		{
			alert('Se han enviado parametros incorrectos.');
			$('#vf_codigo').focus();
			return false;
		}
		else
		{
			$('#tblFactura').append(html);
			$('#vf_codigo').focus();
			return true;
		}
	}
}


function sacar_notas(idalumno,idcurso)
{
	if (idcurso=='1ro PRIMARIA' || idcurso=='2do PRIMARIA' || idcurso=='3ro PRIMARIA' || idcurso=='4to PRIMARIA' || idcurso=='5to PRIMARIA' || idcurso=='6to PRIMARIA')
	{
		var html=$.ajax({type:"GET",url:'get_todas_notas.php',data:{id:idalumno},async:false}).responseText;
	}
	else
	{
		if (idcurso=='1ro SECUNDARIA' || idcurso=='2do SECUNDARIA')
		{
			var html=$.ajax({type:"GET",url:'get_notas_1_2.php',data:{id:idalumno},async:false}).responseText;
		}
		else
		{
			if (idcurso=='3ro SECUNDARIA' || idcurso=='4to SECUNDARIA' || idcurso=='5to SECUNDARIA' || idcurso=='6to SECUNDARIA')
			{
				var html=$.ajax({type:"GET",url:'get_notas_3ro.php',data:{id:idalumno},async:false}).responseText;
			}
			else
			{
				alert('El curso de este alumno no esta registrado');
				$('#vf_codigo').focus();
				return false;
			}
		}
	}
	if(html=='eNoResults')
	{
		alert('No tiene facturas pendientes.');
		$('#vf_codigo').focus();
		return false;
	}
	else
	{
		if(html=='eParamError')
		{
			alert('Se han enviado parametros incorrectos.');
			$('#vf_codigo').focus();
			return false;
		}
		else
		{
			$('#tblFactura').append(html);
			$('#vf_codigo').focus();
			return true;
		}
	}
}
function getAlumnos(id)
{

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
//	$('#vf_paterno').val(paterno);
//	$('#vf_materno').val(materno);
	$('#vf_nombre').val(nombres);
	$('#vf_curso').val(curso);
	
//	$('#vf_nombre').val($('#vf_curso').val());  // ESTO FUNCIONA
	
		if ((get_notas(id))==0)  // saca si ya tiene notas de esta materia
		{								// si es 0 no tiene notas
			return false;
		}
		else
		{
			return true;
		}
}
function get_notas(id3)
{

	var html=$.ajax({type:"GET",url:'get_notas_alu.php',data:{id4:id3},async:false}).responseText;
	if(html=='eNoResults'){  // no hay registro de notas de este alumno
		alert('Este alumno no tiene Notas registradas');
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
	$('#vf_codigo').focus();
	return 1;
}

function getMate(e,param)
{
	if(isKeyEnter(e))
	{
		getMateria(param)
	}
}
function clearInputs()
{
	$('#vf_nombre').val('');
	$('#vf_direccion').val('');
	$('#vf_uv').val('');
	$('#vf_mza').val('');
	$('#vf_lote').val('');
	$('#vf_total').val('');
	$('#vf_totalmonto').val('');
	$('#vf_corte').removeAttr('checked');
	$('#vf_fpagar').val('');
	$('#vf_codigo').focus();
	$('#vf_reconex').val(0);
}
function clearFactura()
{
	var tblHeader='<thead>';
	tblHeader+='<tr>';
	tblHeader+='<th>Cod. Materia</th>';
	tblHeader+='<th>Nombre</th>';
	tblHeader+='<th>1er. Bim.</th>';
	tblHeader+='<th>2do. Bim.</th>';
	tblHeader+='<th>3er. Bim.</th>';
	tblHeader+='<th>4to. Bim.</th>';
	tblHeader+='<th>NOTA FINAL</th>';
	tblHeader+='</tr>';tblHeader+='</thead>';
	tblHeader+='<tbody id="tItems">';
	tblHeader+='</tbody>';
	$('#tblFactura').empty();
	$('#tblFactura').append(tblHeader);
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
	$('#vf_direccion').val(descri);
	return true;
}
function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}
function addMonto(e,index)
{
	if(isKeyEnter(e))
	{
		//$('#vf_fpagar').val(1);
		formSubmit();
		return;
	}
	gTotalFactura=0;
	if(index!='')
	{
		var ind=parseInt(index);
		if(ind!=index||ind<1||ind>gNumFacturas)
		{
			$('#vf_fpagar').val(1);
			return;
		}
	}
	else
	{
		$('#vf_monto').val('0.00');
		return;
	}
	var i=1;
	while(i<=index)
	{
		gTotalFactura+=parseFloat($('#F_'+i++).val());
	}
	$('#vf_monto').val(gTotalFactura.toFixed(2));
	//$('#vf_fpagar').val(1);
	//alert('aqui entro 2');
}

function formSubmit()
{
	var ind=parseInt($('#vf_fpagar').val());
	if(ind<1||ind>gNumFacturas)
	{
		$('#vf_fpagar').val(1);
		return;
	}
	if($('#vf_fpagar').val()!='')
	{
		//$('#vf_fpagar').val(1);   //aqui 04/08/14
		//alert('aqui entro');
		/* 18 de Mayo 2009 by Darwin */		
		$('#btnProcesar').attr({disabled:'disabled'}); //$('#btnProcesar').hide();
		$('#fMain').submit();
		setTimeout("$('#btnProcesar').removeAttr('disabled'); clearInputs(); clearFactura();",3000);
		$('#vf_codigo').val('');
	}
	else
	{
		alert('Introduzca la cantidad de facturas a pagar.');
		$('#vf_fpagar').focus();
	}
}

function Volver()
{

	switch (parseInt($('#vf_bit').val()))
	{
		case 0:
			{location.href='menu1.php';}
			break
		case 1:
			{location.href='reg_notas1.php';}
			break
		case 2:
			{location.href='reg_notas2.php';}
			break
		case 3:
			{location.href='reg_notas3.php';}
			break
		case 4:
			{location.href='reg_notas4.php';}
			break
	}
	return true
}

$(document).ready(function()
						   {
							   $('#vf_codigo').removeAttr('disabled');
							   $('#vf_codigo').focus();
							   $('#btnProcesar').bind('click',function(){formSubmit();});
							   $('#btnReporte').bind('click',function(){location.href='reporte.php';});
							   $('#btnbuscar').bind('click',function(){location.href='buscar.php';});
							   $('#btnReimpresion').bind('click',function(){location.href='reimpresion.php';});
							   $('#btnCambiar').bind('click',function(){location.href='lla_cambiarse.php';});
							   $('#btnSalir').bind('click',function(){location.href='menufamilia.php';});
//							   $('#btnSalir').bind('click',function(){Volver();});
							   }
							   )