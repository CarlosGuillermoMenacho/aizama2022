var gNumFacturas=0;
var gTotalMonto=0;
var gTotalFactura=0;
var fctNumDoc=0;
var cortado=0;
var conexion=0;
var nfp=0;
var gDatos=Array();

function getResultados(e,param)
{
	if(isKeyEnter(e))
	{
		clearInputs();
		clearFactura();
		if(parseInt(param)!=param)  //ESTO VERIFICA QUE EL DATO SEA NUMERO
		{
			if (getAlumnos(param))
			{
				if (getNotas(param))
				{
					sacar_notas
					return true;
				}
				else
				{
					alert('Este alumno no tiene notas registradas');
					return false;
				}
			}
		}
		else
		{
			alert ('No existe el alumno, o el dato no es correcto')
			return false;
		}
	}
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
	tblHeader+='<th>No. Boleta</th>';
	tblHeader+='<th>Cobro</th>';
	tblHeader+='<th>Sin Vencto.</th>';
	tblHeader+='<th>Con Vencto.</th>';
	tblHeader+='<th>Emisión</th>';
	tblHeader+='<th>T.C.</th>';
	tblHeader+='<th>Mto. Acumulado</th>';
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
function getAlumnos(idsocio)
{
	var html=$.ajax({type:"GET",url:'get_alumnos.php',data:{id:idsocio},async:false}).responseText;
	if(html=='eNoResults')
	{
		alert('No tiene facturas pendientes.');
		$('#vf_codigo').focus();
		return;
	}
	else
	{
		if(html=='eParamError')
		{
			alert('Se han enviado parametros incorrectos.');
			$('#vf_codigo').focus();
			return;
		}
		else
		{
			$('#tblFactura').append(html);
			gTotalMonto=0;
			gNumFacturas=0;
			$('.dtotal').each(function(i){gTotalMonto+=parseFloat(this.value);gNumFacturas++;});
			$('#vf_totalmonto').val(gTotalMonto.toFixed(2));
			$('#vf_total').val(gNumFacturas);gTotalFactura=0;
			$('#vf_monto').val(gTotalFactura.toFixed(2));
			if(cortado==1)
			{	nfp=gNumFacturas-1;
				alert('Ud. tiene el servicio cortado para que se le reconecte debe cancelar: '+nfp);
				//alert('Ud. tiene el servicio cortado debe pasar por las oficinas de COOPAGUAS a solicitar su reconexion');
			}
			//$('#vf_fpagar').val(1); /* coloca a uno las facturas de pago */
			$('#vf_fpagar').focus();
		}
	}
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
	//alert('aqui entro 1');
	//$('#vf_fpagar').val(1);
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
$(document).ready(function()
						   {
							   $('#vf_codigo').removeAttr('disabled');
							   $('#vf_codigo').focus();
							   $('#btnProcesar').bind('click',function(){formSubmit();});
							   $('#btnReporte').bind('click',function(){location.href='reporte.php';});
							   $('#btnbuscar').bind('click',function(){location.href='buscar.php';});
							   $('#btnReimpresion').bind('click',function(){location.href='reimpresion.php';});
							   $('#btnCambiar').bind('click',function(){location.href='lla_cambiarse.php';});
							   $('#btnSalir').bind('click',function(){location.href='salir.php';});
							   }
							   )