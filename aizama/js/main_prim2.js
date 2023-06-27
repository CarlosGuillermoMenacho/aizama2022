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

    $('#i_c').click(function(){
		hora_ingreso();			
	});
	$('#s_c').click(function(){
		hora_salida();			
	});
	$('#Em1').click(function(){
	    AsignarBimestre(1);
		Eval_realizadas(1);
		location.href='evaluaciones_mixta_alu.php';
			
	});
	$('#Em2').click(function(){
	    AsignarBimestre(2);
		Eval_realizadas(2);
		location.href='evaluaciones_mixta_alu.php';
			
	});
	$('#Em3').click(function(){
	    AsignarBimestre(3);
		Eval_realizadas(3);
		location.href='evaluaciones_mixta_alu.php';
	});	
    $('#cv').click(function(){
        var html=$.ajax({type:"GET",url:'programar_clase_virtual.php?op=cvonline',async:false}).responseText;
		console.log(html);
		if(html==='noClase'){
		    alert('No tienes clases en vivo...');
		}else{
		    window.open(html, '_blank');
		}
		
		//location.href='clases_v_secundaria.php';
			
	});

    let claseVirtual = 'clases_v_secundaria.php';
    let autoEval_alu = 'autoevaluaciones_alu.php';
	$('#CV1').click(function(){
		AsignarBimestre(1);
//		location.href='materias1ro_s.php';
		location.href=claseVirtual;
			
	});
	$('#CV2').click(function(){
		AsignarBimestre(2);
//		location.href='materias2do_s.php';
		location.href=claseVirtual;
	});
	$('#CV3').click(function(){
		AsignarBimestre(3);
//		location.href='materias3ro_s.php';
		location.href=claseVirtual;
	});
    $('#AutoEval1').click(function(){
		AsignarBimestre(1);
//		location.href='materias1ro_s.php';
		location.href=autoEval_alu;
			
	});
	$('#AutoEval2').click(function(){
		AsignarBimestre(2);
//		location.href='materias2do_s.php';
		location.href=autoEval_alu;
	});
	$('#AutoEval3').click(function(){
		AsignarBimestre(3);
//		location.href='materias3ro_s.php';
		location.href=autoEval_alu;
	});
    $('#eel').click(function(){
        var html=$.ajax({type:"GET",url:'obtener_evento.php?op=evonline',async:false}).responseText;
		console.log(html);
		if(html==='noClase'){
		    alert('No hay Evento en linea...');
		}else{
		    window.open(html, '_blank');
		}
	});
	
	
	$('#ad').click(function(){
		location.href='practicar_prim.php';
			
	});
    $('#Material1').click(function() {
        AsignarBimestre(1);
        location.href='material_apoyo_alumno.php';
    });
    $('#Material2').click(function() {
        AsignarBimestre(2);
        location.href='material_apoyo_alumno.php';
    });
    $('#Material3').click(function() {
        AsignarBimestre(3);
        location.href='material_apoyo_alumno.php';
    });

    let videosApoyo = 'videos_secundaria.php';
	$('#Video1').click(function(){
		AsignarBimestre(1);
		location.href=videosApoyo;
			
	});
	$('#Video2').click(function(){
		AsignarBimestre(2);
		location.href=videosApoyo;
			
	});
	$('#Video3').click(function(){
		AsignarBimestre(3);
		location.href=videosApoyo;
			
	});
	$('#P1').click(function(){
		AsignarBimestre(1);
		location.href='practicos_secundaria.php';
			
	});
	$('#P2').click(function(){
		AsignarBimestre(2);
		location.href='practicos_secundaria.php';
			
	});
	$('#P3').click(function(){
		AsignarBimestre(3);
		location.href='practicos_secundaria.php';
			
	});
	
	$('#PracticoWeb1').click(function(){
		AsignarBimestre(1);
		location.href='practicos_web_estudiante.php';
			
	});
	$('#PracticoWeb2').click(function(){
		AsignarBimestre(2);
		location.href='practicos_web_estudiante.php';
			
	});
	$('#PracticoWeb3').click(function(){
		AsignarBimestre(3);
		location.href='practicos_web_estudiante.php';
			
	});
	
	$('#E1').click(function(){
		AsignarBimestre(1);
		location.href='evaluacion_alumnos.php';
		//location.href='materias1ro_p.php';
	});
	$('#E2').click(function(){
		AsignarBimestre(2);
		location.href='evaluacion_alumnos.php';
		//location.href='materias2do_p.php';
	});
	$('#E3').click(function(){
		AsignarBimestre(3);
		location.href='evaluacion_alumnos.php';
		//location.href='materias3ro_p.php';			
	});
	
	$('#EE1').click(function(){
		AsignarBimestre(1);
		location.href='evaluacion_escrita_alu.php';
	});
	$('#EE2').click(function(){
		AsignarBimestre(2);
		location.href='evaluacion_escrita_alu.php';
	});
	$('#EE3').click(function(){
		AsignarBimestre(3);
		location.href='evaluacion_escrita_alu.php';
	});

	$('#ES1').click(function(){
		AsignarBimestre(1);
		location.href='evaluacion_alumnos_10p.php';
		//location.href='materias1ro_p.php';
	});
	$('#ES2').click(function(){
		AsignarBimestre(2);
		location.href='evaluacion_alumnos_10p.php';
		//location.href='materias2do_p.php';
	});
	$('#ES3').click(function(){
		AsignarBimestre(3);
		location.href='evaluacion_alumnos_10p.php';
		//location.href='materias3ro_p.php';			
	});
	
	$('#BN').click(function(){
		Boletin();		
	});
	$('#CC').click(function(){
		location.href='cam_cont_alu_prim.php';			
	});
	$('#salir').click(function(){
		location.href='usuario.php';			
	});
	// Mostramos y ocultamos submenus
	$('.submenu').click(function(){
		$(this).children('.children').slideToggle();
	});

}
function Eval_realizadas(id)
{
	var html=$.ajax({type:"GET",url:'eval_realizadas_alu.php',data:{id:id},async:false}).responseText;
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
function hora_salida()
{
   // console.log($('#boletin').val());
//   if($('#boletin').val()=='VERDADERO')
 /*  if($('#boletin').val()=='VERDADERO')
   {*/
	   location.href='hora_salida.php';
       return true;
  /* }
	else
	{
		alert('NO TIENE ACCESO A MARCAR SALIDA !!!, Comuniquese con el 77367545');
		return false; 
   } */
}
function hora_ingreso()
{
   // console.log($('#boletin').val());
//   if($('#boletin').val()=='VERDADERO')
/*   if($('#boletin').val()=='VERDADERO')
   {*/
	   location.href='hora_ingreso.php';
       return true;
  /* }
	else
	{
		alert('NO TIENE ACCESO A MARCAR INGRESO !!!, Comuniquese con el 77367545');
		return false; 
   } */
}


function Boletin()
{
    console.log($('#boletin').val());
   if($('#boletin').val()=='VERDADERO')
   {
	   location.href='boletin_alumno_primaria.php';
       return true;
   }
	else
	{
		alert('NO TIENE ACCESO A VER EL BOLETIN !!!, Comuniquese con el 77344300');
		return false; 
   } 
}