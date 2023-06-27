function validarForm()
{
	if($('#vf_clave').val()=='')
	{
		alert('Introduzca la clave actual.');
		$('#vf_clave').focus();
		return false;
	}
	if($('#vf_clave1').val()=='')
	{
		alert('Introduzca la nueva clave.');
		$('#vf_clave1').focus();
		return false;
	}
	if($('#vf_clave2').val()=='')
	{
		alert('Introduzca la confirmacion de la clave.');
		$('#vf_clave2').focus();
		return false;
	}
	if($('#vf_clave1').val()!=$('#vf_clave2').val())
	{
		alert('La confirmacion de la clave NO es la correcta.');
		$('#vf_clave2').focus();
		return false;
	}
	return true;
}
$(document).ready(function()
						   {
							   $('#vf_usuario').val('');
							   $('#vf_clave').val('');
							   $('#vf_usuario').focus();
							   $('#btnAceptar').bind('click',function(){if(validarForm()){$('#fLogin').submit();}});
							   $('#btnSalir').bind('click',function(){location.href='salir_camb_ent.php';});
							}
							)
