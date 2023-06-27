function Volver()
{

	switch (parseInt($('#vf_bi').val()))
	{
		case 1:
			{location.href='reg_practicos.php';}
			break
		case 2:
			{location.href='reg_practicos.php';}
			break
		case 3:
			{location.href='reg_practicos.php';}
			break
		case 4:
			{location.href='reg_practicos.php';}
			break
	}
	return true
}

$(document).ready(function()
						   {
							   $('#btnSalir').bind('click',function(){location.href='reg_practicos.php';});
//							   $('#btnSalir').bind('click',function(){Volver();});
//							   $('#btnGrabar').bind('click',function(){Grabar();});
							}
							)
