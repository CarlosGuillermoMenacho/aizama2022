function validarForm()
{
	if($('#vf_usuario').val()=='')
	{
		alert('Introduzca su nombre de usuario.');
		$('#vf_usuario').focus()
		return false;
	}
	if($('#vf_clave').val()=='')
	{
		alert('Introduzca su clave.');
		$('#vf_clave').focus()
	return false;
	}
	return true;
}
$(document).ready(function()
						   {
							   $('#vf_usuario').val('');
							   $('#vf_clave').val('');
							   $('#vf_centro').val(0);
							   $('#vf_usuario').focus();
							   $('#btnCancelar').bind('click',function(){location.href='index.php';});
							   $('#btnAceptar').bind('click',function(){if(validarForm()){$('#fLogin').submit();}});
							   
							}
							)