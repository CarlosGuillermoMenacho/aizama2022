var gNumFacturas=0;var gTotalMonto=0;var gTotalFactura=0;var fctNumDoc=0;var gDatos=Array();
function getResultadospag(e,param)
{
	if(isKeyEnter(e))
	{
		clearInputs();
		clearFactura();
		if(parseInt(param)!=param)
		{
			return;
		}
		if(getSociopag(param))
		{
			getFacturapag(param);
		}
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
function getSociopag(id)
{
	var html=$.ajax({type:"GET",url:'get_socio.php',data:{id:id},async:false}).responseText;
	if(html=='eNoResults')
	{
		alert('No se encontraron registro con su criterio de busqueda.');
		return false;
	}
	else
	{
		if(html=='eParamError')
		{
			alert('Se han enviado parametros incorrectos.');
			return false;
		}
		else
		{
			eval(html);
			$('#vf_direccion').val(direccion);
			$('#vf_uv').val(uv);
			$('#vf_mza').val(mza);
			$('#vf_lote').val(lote);
			$('#vf_nombre').val(nombre);
			$('#vf_categoria').val(categoria);
			$('#vf_nit').val(nit);
			fctNumDoc=num_doc;if(corte==1)$('#vf_corte').attr({checked:'checked'});
		}
	}
return true;
}
function getFacturapag(idsocio)
{
	var html=$.ajax({type:"GET",url:'get_facturapag.php',data:{id:idsocio},async:false}).responseText;
	if(html=='eNoResults')
	{
		alert('No realizo ningun pago de factura hoy.');
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
		if(ind!=index||ind<1||ind>gNumFacturas||ind!=1)
		{
			//$('#vf_fpagar').val(1);
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
}
function formSubmit()
{
	var ind=parseInt($('#vf_fpagar').val());
	/*if(ind<1||ind>gNumFacturas)
	{
		$('#vf_fpagar').val(1);
		return;
	}*/
	if($('#vf_fpagar').val()!='')
	{
		//$('#vf_fpagar').val(1);

		$('#btnReimprimir').hide();
		$('#fMain').submit();
		setTimeout("$('#btnReimprimir').show(); clearInputs(); clearFactura();",3000);
		$('#vf_codigo').val('');
	}
	else
	{
		alert('Introduzca la cantidad de Facturas que desea reimprimir.');
		$('#vf_fpagar').focus();
	}
}
$(document).ready(function()
						   {
							   $('#vf_codigo').removeAttr('disabled');
							   $('#vf_codigo').focus();
							   $('#btnReimprimir').bind('click',function(){formSubmit();});
							   $('#btnSalir').bind('click',function(){location.href='salir_rei.php';});
							   }
							   )