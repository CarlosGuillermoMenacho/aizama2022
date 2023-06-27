function getAsignarExa(id)
{
//	alert('aqui');
	var html=$.ajax({type:"GET",url:'asignar_examen.php',data:{id:id},async:false}).responseText;
	if(html=='eNoNumeric'){
	  alert('No numerico o variable no declarada');
	  return false;
	}
	if(html=='eNo1'){
	  alert('No existe examen para este curso de esta materia');
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

function exa1()
{
	$code = 1;
	if (getAsignarExa($code))
	{
		location.href='advertencia5.php';
	}
}
function exa2()
{
//	alert('examen 2');
	$code = 2;
	if (getAsignarExa($code))
	{
		location.href='advertencia4.php';
	}
}
function Salir()
{
	if ($('#vf_perfil').val() == 'PRIMARIA')
	{
		location.href='materias4to_p.php';
		return true;
	}
	else
	{
		if ($('#vf_perfil').val() == 'SECUNDARIA')
		{
			location.href='materias4to_s.php';
			return true;
		}
		else
		{
			location.href='materias4to_i.php';
			return true;
		}
	}
}

$(document).ready(function()
						   {
							   $('#btne1').bind('click',function(){exa1();});
							   $('#btne2').bind('click',function(){exa2();});
//							   $('#btne1').bind('click',function(){location.href='advertencia1.php';});
//							   $('#btnSalir').bind('click',function(){location.href='materias2do_p.php';});
							   $('#btnSalir').bind('click',function(){Salir();});
							   $('#btnSalir2').bind('click',function(){location.href='http://www.aizama.net';});
//							   $('#btnSalir2').bind('click',function(){location.href='index.php';});
							}
							)
