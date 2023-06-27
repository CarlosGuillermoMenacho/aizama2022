$(document).ready(function()
						   {
							   $('#vf_usuario').val('');
							   $('#vf_clave').val('');
							   $('#vf_usuario').focus();
							   $('#btnAceptar').bind('click',function(){location.href='buscar.php';});
							   $('#btnSalir').bind('click',function(){location.href='salir_cambiar.php';});
							}
							)
