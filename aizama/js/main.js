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
    $('#R1').click(function(){
		location.href='ingreso_prof.php';
			
	});
	$('#R2').click(function(){
		location.href='salida_prof.php';
			
	});
	$('#MCAL1').click(function(){
		AsignarBimestre(1);
		location.href='top_calificaciones_doc.php';
			
	});
	$('#MCAL2').click(function(){
		AsignarBimestre(2);
		location.href='top_calificaciones_doc.php';
			
	});
	$('#MCAL3').click(function(){
		AsignarBimestre(3);
		location.href='top_calificaciones_doc.php';
			
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
	$('#EM1').click(function(){
		AsignarBimestre(1);
		location.href='Evaluaciones_mixtas.php';
	});

	$('#EM2').click(function(){
		AsignarBimestre(2);
		location.href='Evaluaciones_mixtas.php';
	});

	$('#EM3').click(function(){
		AsignarBimestre(3);
		location.href='Evaluaciones_mixtas.php';
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
	$('#MaterialApoyo1').click(function(){
		AsignarBimestre(1);
		location.href='reg_material_apoyo.php';
			
	});
	$('#MaterialApoyo2').click(function(){
		AsignarBimestre(2);
		location.href='reg_material_apoyo.php';
			
	});
	$('#MaterialApoyo3').click(function(){
		AsignarBimestre(3);
		location.href='reg_material_apoyo.php';
			
	});

	$('#ROLE1').click(function(){
		AsignarBimestre(1);
		location.href='rol_de_examenes_doc.php';
			
	});
	$('#ROLE2').click(function(){
		AsignarBimestre(2);
		location.href='rol_de_examenes_doc.php';
			
	});
	$('#ROLE3').click(function(){
		AsignarBimestre(3);
		location.href='rol_de_examenes_doc.php';
			
	});
	
	$('#RevisionP1').click(function(){
		AsignarBimestre(1);
		location.href='revision_practicos_prof.php';
			
	});
	$('#RevisionP2').click(function(){
		AsignarBimestre(2);
		location.href='revision_practicos_prof.php';
			
	});
	$('#RevisionP3').click(function(){
		AsignarBimestre(3);
		location.href='revision_practicos_prof.php';
			
	});
	$('#PracticoDigital1').click(function(){
		AsignarBimestre(1);
		location.href='practicos_digital_prof.php';
			
	});
	$('#PracticoDigital2').click(function(){
		AsignarBimestre(2);
		location.href='practicos_digital_prof.php';
			
	});
	$('#PracticoDigital3').click(function(){
		AsignarBimestre(3);
		location.href='practicos_digital_prof.php';
			
	});
	
	$('#PracticoWeb1').click(function(){
		AsignarBimestre(1);
		location.href='practicos_web_prof.php';
			
	});
	$('#PracticoWeb2').click(function(){
		AsignarBimestre(2);
		location.href='practicos_web_prof.php';
			
	});
	$('#PracticoWeb3').click(function(){
		AsignarBimestre(3);
		location.href='practicos_web_prof.php';
	});
	
	$('#ReporteCuadernoPedagogico1').click(function(){
		AsignarBimestre(1);
		location.href='cuaderno_pedagogico_doc2.php';
		//location.href='reporte_cuaderno_pedagogico_prof.php';
			
	});
	$('#ReporteCuadernoPedagogico2').click(function(){
		AsignarBimestre(2);
		location.href='cuaderno_pedagogico_doc2.php';
	//	location.href='reporte_cuaderno_pedagogico_prof.php';
			
	});
	$('#ReporteCuadernoPedagogico3').click(function(){
		AsignarBimestre(3);
		location.href='cuaderno_pedagogico_doc2.php';
		//location.href='reporte_cuaderno_pedagogico_prof.php';
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
		//location.href='menu_evaluaciones.php';
		window.location.href = 'evaluaciones_seleccion_doc.php';			
	});
	$('#E2').click(function(){
		AsignarBimestre(2);
		//location.href='menu_evaluaciones.php';
		window.location.href = 'evaluaciones_seleccion_doc.php';			
	});
	$('#E3').click(function(){
		AsignarBimestre(3);
		//location.href='menu_evaluaciones.php';
		window.location.href = 'evaluaciones_seleccion_doc.php';			
	});
	$('#NSD1').click(function(){
		AsignarBimestre(1);
		location.href='reg_ser_decidir.php?bim=1';			
	});
	$('#NSD2').click(function(){
		AsignarBimestre(2);
		location.href='reg_ser_decidir.php?bim=2';			
	});
	$('#NSD3').click(function(){
		AsignarBimestre(3);
		location.href='reg_ser_decidir.php?bim=3';			
	});
	$('#AE1').click(function(){
		AsignarBimestre(1);
		location.href='auto_evaluaciones.php?bim=1';			
	});
	$('#AE2').click(function(){
		AsignarBimestre(2);
		location.href='auto_evaluaciones.php?bim=2';			
	});
	$('#AE3').click(function(){
		AsignarBimestre(3);
		location.href='auto_evaluaciones.php?bim=3';			
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
	$('#GEN1').click(function(){
		AsignarBimestre(1);
		location.href='generar_notas.php?bim=1';			
	});
	$('#GEN2').click(function(){
		AsignarBimestre(2);
		location.href='generar_notas.php?bim=2';			
	});
	$('#GEN3').click(function(){
		AsignarBimestre(3);
		location.href='generar_notas.php?bim=3';			
	});
	$('#BN').click(function(){
		location.href='boletin3.php';			
	});
	$('#EX1').click(function(){
		AsignarBimestre(1);
		location.href='evaluaciones_vr2.php';			
	});
	$('#EX2').click(function(){
		AsignarBimestre(2);
		location.href='evaluaciones_vr2.php';			
	});
	$('#EX3').click(function(){
		AsignarBimestre(3);
		location.href='evaluaciones_vr2.php';			
	});
	$('#LU').click(function(){
		location.href='gestion_Utiles.php';			
	});
	$('#BB').click(function(){
		location.href='registro_libros.php';			
	});
	$('#CC').click(function(){
		location.href='cam_cont_prof.php';			
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
		location.href='docentes.php';			
	});
    $('#EE1').click(function(){
		AsignarBimestre(1);
		location.href='evaluaciones_escritas.php';
			
	});
	$('#EE2').click(function(){
		AsignarBimestre(2);
		location.href='evaluaciones_escritas.php';
			
	});
	$('#EE3').click(function(){
		AsignarBimestre(3);
		location.href='evaluaciones_escritas.php';			
	});

 
	// Mostramos y ocultamos submenus
	$('.submenu').click(function(){
		$(this).children('.children').slideToggle();
	});

}