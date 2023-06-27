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
	
	$('#BA1').click(function(){
		AsignarBimestre(1);
		location.href='boletin_materia.php';			
	});
	$('#BA2').click(function(){
		AsignarBimestre(2);
		location.href='boletin_materia.php';			
	});
	$('#BA3').click(function(){
		AsignarBimestre(3);
		location.href='boletin_materia.php';			
	});
	$('#cuader_Adm1').click(function(){
		AsignarBimestre(1);
		location.href='centralizador_dir.php';			
	});
	$('#cuader_Adm2').click(function(){
		AsignarBimestre(2);
		location.href='centralizador_dir.php';			
	});
	$('#cuader_Adm3').click(function(){
		AsignarBimestre(3);
		location.href='centralizador_dir.php';			
	});
	$('#EVA1_adm').click(function(){
		AsignarBimestre(1);
		location.href='evaluaciones_adm2.php';
			
	});
	$('#EVA2_adm').click(function(){
		AsignarBimestre(2);
		location.href='evaluaciones_adm2.php';
			
	});
	$('#EVA3_adm').click(function(){
		AsignarBimestre(3);
		location.href='evaluaciones_adm2.php';			
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
	$('#AM1').click(function(){
		AsignarBimestre(1);
		location.href='gestion_prof_cur_mat.php';			
	});
	$('#AM2').click(function(){
		AsignarBimestre(2);
		location.href='gestion_eli_prof_cur_mat.php';			
	});
	$('#LU').click(function(){
		location.href='gestion_Utiles_adm.php';			
	});
	$('#CC').click(function(){
		location.href='cam_cont.php';			
	});
    $('#eel').click(function(){
        var html=$.ajax({type:"GET",url:'obtener_evento_adm_prof.php?op=evonline',async:false}).responseText;
		console.log(html);
		if(html==='noClase'){
		    alert('No hay Evento en linea...');
		}else{
		    window.open(html, '_blank');
		}
	});

	$('#salir').click(function(){
		location.href='inicio_segundo.php';			
	});


	$('#practico_adm1').click(function(){
		AsignarBimestre(1);
		location.href='practicos_adm.php';
	});
	
	$('#practico_adm2').click(function(){
		AsignarBimestre(2);
		location.href='practicos_adm.php';
	});
	$('#practico_adm3').click(function(){
		AsignarBimestre(3);
		location.href='practicos_adm.php';
	});

	$('#material_de_apoyo_adm1').click(function(){
		AsignarBimestre(1);
		location.href='material_de_apoyo_adm.php';
	});
	$('#material_de_apoyo_adm2').click(function(){
		AsignarBimestre(2);
		location.href='material_de_apoyo_adm.php';
	});
	$('#material_de_apoyo_adm3').click(function(){
		AsignarBimestre(3);
		location.href='material_de_apoyo_adm.php';
	});
 
	// Mostramos y ocultamos submenus
	$('.submenu').click(function(){
		$(this).children('.children').slideToggle();
	});

}