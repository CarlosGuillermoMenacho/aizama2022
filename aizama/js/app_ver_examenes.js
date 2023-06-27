function validar()
{
	if ($('#vf_codalu').val() == '')
	{
//		alert('1');
		return false;
	}
	else
	{
		if (parseInt($('#vf_codalu').val()) >= 0)
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
function ver_examenes()
{
	if (validar()){
		var jsVar1 = parseInt($('#vf_codalu').val());
		window.location.href = 'lista_de_examenes.php'+"?sw1="+jsVar1;		
	}
	else
	{
		alert('FALTAN DATOS PARA VISUALIZAR ! O SON INCORRECTOS !!!');
		return false;
	}	
}


$(document).ready(function()
				  {$('#btnSalir').bind('click',function(){location.href='nota_exa_bimestres.php';});
				   $('#btnVer_Ex').bind('click',function(){ver_examenes();});})

