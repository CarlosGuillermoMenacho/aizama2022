
function getAsignarBimestre(id)
{
	var html=$.ajax({type:"GET",url:'asignar_bimestre1.php',data:{id:id},async:false}).responseText;
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
		location.href='ver_examenes.php';
		//location.href='materias2do_p.php';
	}
}
function segundo()
{
	$codb = 2;
	if (getAsignarBimestre($codb))
	{
		location.href='ver_examenes.php';
	}
}
function tercero()
{
	$codb = 3;
	if (getAsignarBimestre($codb))
	{
		location.href='ver_examenes.php';
//		location.href='materias2do_p.php';
	}
}
function cuarto()
{
	$codb = 4;
	if (getAsignarBimestre($codb))
	{
		location.href='ver_examenes.php';
//		location.href='materias2do_p.php';
	}
}

$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
							   $('#btnbimestre1').bind('click',function(){primero();});
							   $('#btnbimestre2').bind('click',function(){segundo();});
							   $('#btnbimestre3').bind('click',function(){tercero();});
							   $('#btnbimestre4').bind('click',function(){cuarto();});			 
							   $('#btnSalir').bind('click',function(){location.href='menu_docente.php';});
							}
							)