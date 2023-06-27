$(document).ready(main);
  
var contador = 1;
 
function AsignarBimestre(id)
{
	var html=$.ajax({type:"GET",url:'asignar_bimestre.php',data:{id:id},async:false}).responseText;
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
function main () {
	$('#btn-menu').click(function(){
		if (contador == 1) {
			$('nav').animate({
				left: '0'
			});
			contador = 0;
		} else {
			contador = 1;
			$('nav').animate({
				left: '-100%'
			});
		}
	});

	$('#CV1').click(function(){
		AsignarBimestre(1);
		location.href='reg_clases.php';
			
	});
	$('#CV2').click(function(){
		AsignarBimestre(2);
		location.href='reg_clases.php';
			
	});
	$('#CV3').click(function(){
		AsignarBimestre(3);
		location.href='reg_clases.php';
			
	});
	$('#ad').click(function(){
		location.href='agenda.php';
			
	});
	$('#va').click(function(){
		location.href='view_ver_agenda.php';	
	});
	$('#Video1').click(function(){
		AsignarBimestre(1);
		location.href='reg_videos.php';
			
	});
	$('#Video2').click(function(){
		AsignarBimestre(2);
		location.href='reg_videos.php';
			
	});
	$('#Video3').click(function(){
		AsignarBimestre(3);
		location.href='reg_videos.php';
			
	});
	$('#P1').click(function(){
		AsignarBimestre(1);
		location.href='reg_practicos.php';
			
	});
	$('#P2').click(function(){
		AsignarBimestre(2);
		location.href='reg_practicos.php';
			
	});
	$('#P3').click(function(){
		AsignarBimestre(3);
		location.href='reg_practicos.php';
			
	});
	$('#E1').click(function(){
		AsignarBimestre(1);
		location.href='menu_evaluaciones.php';
			
	});
	$('#E2').click(function(){
		AsignarBimestre(2);
		location.href='menu_evaluaciones.php';
			
	});
	$('#E3').click(function(){
		AsignarBimestre(3);
		location.href='menu_evaluaciones.php';			
	});
	$('#N1').click(function(){
		AsignarBimestre(1);
		location.href='reg_notas1.php?bim=1';			
	});
	$('#N2').click(function(){
		AsignarBimestre(2);
		location.href='reg_notas1.php?bim=2';			
	});
	$('#N3').click(function(){
		AsignarBimestre(3);
		location.href='reg_notas1.php?bim=3';			
	});
	$('#BN').click(function(){
		location.href='boletin3.php';			
	});
	$('#EX1').click(function(){
		AsignarBimestre(1);
		location.href='ver_examenes.php';			
	});
	$('#EX2').click(function(){
		AsignarBimestre(2);
		location.href='ver_examenes.php';			
	});
	$('#EX3').click(function(){
		AsignarBimestre(3);
		location.href='ver_examenes.php';			
	});
	$('#LU').click(function(){
		location.href='gestion_Utiles.php';			
	});
	$('#salir').click(function(){
		location.href='docentes.php';			
	});


 
	// Mostramos y ocultamos submenus
	$('.submenu').click(function(){
		$(this).children('.children').slideToggle();
	});

}