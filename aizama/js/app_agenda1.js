var lista=[];
var indice=0;
var listaCursos = [];
var listaMaterias = [];
var lista_celulares = [];
var dominio = 'https://www.aizama.net'
var nombre_materia;
var nuevo_msg;
var nombre_curso='';

/* Variable*/
var curso;
var paralelo;
var index;

function obtenerCelulares(){
    $.post(
            "data_agenda.php?op=obtener_tutores_cel",
            {codcur:curso,codpar:paralelo},
            (datos,estado,xhr)=>{
                let status = datos.status;
                if(status=="ok"){
                    lista_celulares = datos.lista;
                    return;
                }
            },
            "json"
        );
    
}
function cargarLista()
{
	lista=[];
	$('#vf_n3').val("");
	$.ajax({
			type:"POST",
			url:"data_agenda.php?op=lista&paralelo="+paralelo,
			data:"cod_curso=" + curso,
			success:function(r){
				if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}
				var ac="";
				for (var i = 0; i < r.length; i++) {
					if (r[i]!=',') {
						ac=ac+r[i];	
					}else{
						lista.push(ac);
						ac="";
					} 
				}

				lista.push(ac);
				indice=0;
			}
			});
}
function init(){
	$.post("obtener_curso_json.php?op=cp",function(respuesta){
    var jsonDataCursos = JSON.parse(respuesta);
    	if (jsonDataCursos['status'] == 'ok') {     
			listaCursos = jsonDataCursos['cursos'];
			for (let i = 0; i < listaCursos.length; i++) {    
				var cursos = listaCursos[i]['nombre']; 
				$("#slccurso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
            }
        }
        if(respuesta=='eSession') {
            alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
            return false;
        }
    });
    $.post("obtener_materias_json.php?op=getmatprof",function(respuesta){
        var jsonDataMaterias = JSON.parse(respuesta);
        if (jsonDataMaterias['status'] == 'ok') {
            listaMaterias = jsonDataMaterias['materias'];
        }
        if(respuesta=='eSession') {
            alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
            return false;
        }
    });
}

function obtenerMaterias(curso, paralelo) {
    
    $("#slcmateria").empty();
	$("#slcmateria").append('<option value="0"> -- Seleccionar materia -- </option>');
	console.log(listaMaterias)
	for(var i = 0 ; i < listaMaterias.length; i++) {
		if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo){
            $("#slcmateria").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');
		}
    }
}	

function getAlumnos(curso, paralelo) {
    let codigoCurso = curso;
    let codigoParalelo = paralelo;
	$.post('data_agenda.php?op=alumnos', {
              "cod_curso": codigoCurso,
              "cod_par": codigoParalelo
            },function(data) {
                if(data=='eSession') {
                    alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
                }
                $('#slcalumnos').html(data);
          });
}
function updateindice(){
	var c=0;
	while(lista[c]!=$('#slcalumnos').val())
		{
			c=c+1;
		}
	indice=c+1;
}
function getNombre(){
	$.ajax({
			type:"POST",
			url:"data_agenda.php?op=est",
			data:"cod_alu=" + $('#slcalumnos').val(),
			success:function(r){
				if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}

				$('#vf_n3').val(r);
			}
			});

}
function validardatos(){
	if ($('#slccurso').val()!=0 && $('#slcmateria').val()!=0 && $('#slcalumnos').val()!=0) {
		return true;
	}
	return false;
}
function validardatos1(){
	if ($('#slccurso').val()!='' && $('#slcmateria').val()!=0) {
		return true;
	}
	$('#slccurso').focus();
	return false;
}
function validarmsgalu(){
	if ($('#msnalu').val()!='') {
		return true;
	}
	return false;
}
function validarmsgclass(){
	if ($('#msncurso').val()!='') {
		return true;
	}
	return false;
}
function obtenerContactos (codalu){
    let lista2 = [];
    console.log(lista_celulares);
    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista2.push(celular.celular);
        }
        
    });
    return lista2;
}
function getmsgalu(id,msg){
	if (validardatos()&&validarmsgalu()) {
	     //   alert ('aqui 1');
	    //nombre_materia ='';
	    var selc_alumno = document.getElementById("slcalumnos");
        var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;
		nuevo_msg='Curso: '+nombre_curso+' - Materia: '+nombre_materia+' - Alumno: '+nombre_alumno+' - '+msg;
	    let contactos = obtenerContactos(id);
	    console.log(contactos);
	    contactos.forEach((contacto)=>{
	        $.get(
	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	            );
	        
	    });
		var formData = new FormData($("#fGrabar")[0]);
		var html1=$.ajax({url:"data_agenda2.php?op=getmsg&alu="+id+"&msg="+msg+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
	   var html=html1.trim();
		if(html=='eNoResults'){
			alert('No EXISTE EL CODIGO EN EL PADRON');
			$('#vf_recinto').focus();
		  	return false;
		}
		if(html=='error'){
		  	alert('No se pudo guardar.');
		 	return false;
		}
		if(html=='eSession'){
		  	alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
		  	return false;
		}
		if(html=='eGrabado')
		{
		   
             /*
            $.ajax({
            method: "POST",
            url: "http://www.aizama.net/agenda/mensaje",
            data: JSON.stringify({ codEst: "1",codEmit:"1",msg:"Hola"}),
            contentType: "application/json",
            success:function(data){
                if(data=="ok"){
                    alert("Enviado correctamente");
                }else{
                    alert('error');
                }    
            }
            }); */
            
		}
		var m = document.getElementById("slcmateria");
            var materia = m.options[m.selectedIndex].value;    
    		var e = document.getElementById("slcalumnos");
            var c_recibe = e.options[e.selectedIndex].value;
            var emite = $('#id_usr').val();
            var msgr = msg;
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeprof`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                        //alert("Mensaje enviado correctamente gol: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                        
                        alert("Mensaje enviado correctamente");
                    }else{
                        alert('error');
                    }    
                }
                });
             
		  	return true;
	}else{
		alert('Debe seleccionar: Curso, Materia y Alumnos o actualizar la pagina');
		return false;
	}
}
function obtenerNombreMateria(){
	let codmat = $('#slcmateria').val();
	for(let i = 0; listaMaterias.length; i++){
		if(listaMaterias[i].codmat==codmat){
			nombre_materia = listaMaterias[i].nombre;
			return;
		}

	}
}

function getmsgalu2(id,msg){

		nuevo_msg='Curso: '+nombre_curso+' - Materia: '+nombre_materia+' - '+msg;
    
        var selc_alumno = document.getElementById("slcalumnos");
        var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;
        let contactos = obtenerContactos(id);
	    console.log(contactos);
	    contactos.forEach((contacto)=>{
	        $.get(
	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
	            );
	        
	    });
		var formData = new FormData($("#fGrabar")[0]);
		var html1=$.ajax({url:"data_agenda2.php?op=getmsg&alu="+id+"&msg="+msg+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
	    var html=html1.trim();
		if(html=='eNoResults'){
		  	return false;
		}
		if(html=='error'){

		 	return false;
		}
		if(html=='eSession'){

		  	return false;
		}
		if(html=='eGrabado')
		{
            
		}
		var c_recibe = id;
		    /*var xhttp=new XMLHttpRequest();
		    xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.log(this.responseText);
                }
		     }
		     console.log(c_recibe);
		     xhttp.open('GET', `${dominio}/chat/nuevo?recibe=${c_recibe}`, true);
             xhttp.send();*/
             
            var m = document.getElementById("slcmateria");
            var materia = m.options[m.selectedIndex].value;    
    		var e = document.getElementById("slcalumnos");
//            var c_recibe = e.options[e.selectedIndex].value;
            var c_recibe = id;
            var emite = $('#id_usr').val();
            var msgr = msg;
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeprof`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                       // alert("Mensaje enviado correctamente gol de todos: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                    }else{
                        alert('error');
                    }    
                }
                });

		  	return true;
}

function grabar(id)
{
    let codi_alu =$('#slcalumnos').val();
    console.log('1er Codigo alumno: '+codi_alu);

	if (validardatos()) {
	    obtenerNombreMateria();
    	var formData = new FormData($("#fGrabar")[0]);
    	var html1=$.ajax({url:"data_agenda2.php?op=save&obs="+id+"&paralelo="+paralelo,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
    	var html=html1.trim();
    	console.log(html);
    	if(html=='eNoResults'){
    		  alert('No EXISTE EL CODIGO EN EL PADRON');
    		$('#vf_recinto').focus();
    		  return false;
    		}
     	if(html=='eSession'){
    		  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    		  return false;
    		}
      	if(html=='error'){
    		  alert('No se pudo guardar.');
    		  return false;
    	}else
    			//if(html=='eGrabado')
    	{
            var emite = $('#id_usr').val();
            var msgr = html;
    	    var selc_alumno = document.getElementById("slcalumnos");
            var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;
    		nuevo_msg='Curso: '+nombre_curso+' - Materia: '+nombre_materia+' - Alumno: '+nombre_alumno+' - '+msgr;

    	//	nuevo_msg='Emite: '+emite+': Curso: '+nombre_curso+' - '+msgr;
            var selc_alumno = document.getElementById("slcalumnos");
            var nombre_alumno = selc_alumno.options[selc_alumno.selectedIndex].text;
            let contactos = obtenerContactos(codi_alu);
            console.log('Codigo alumno: '+codi_alu);
    	    console.log('Aqui 2 Contactos: '+contactos);
    	    contactos.forEach((contacto)=>{
    	        $.get(
    	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
    	            );
    	    });

    	    
    		var m = document.getElementById("slcmateria");
            var materia = m.options[m.selectedIndex].value;    
    		var e = document.getElementById("slcalumnos");
            var c_recibe = e.options[e.selectedIndex].value;
//            var emite = $('#id_usr').val();
//            var msgr = html;
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeprof`,
                data: JSON.stringify({ 
                    codEst: c_recibe,
                    codEmit: emite,
                    msg:msgr,
                    codmat:materia
                }),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                        //alert("Mensaje enviado correctamente: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                        //alert("Mensaje enviado correctamente");
                        Swal.fire(
                          'Mensaje Enviado!',
                          'presiona ok para salir',
                          'success'
                        );
                    }else{
                        alert('error2424');
                    }    
                }
                }); 
    		  
    		return true;
		}
	}else{
		alert('Debe seleccionar: Curso, Materia y Alumnos o actualice la pagina');
		return false;
	}
}

function getmsgallclass(msg){
	if (validardatos1()&&validarmsgclass()&&lista.length>0) {
		for (var i = 0; i < lista.length; i++) {
			if(!getmsgalu2(lista[i],msg)){
				alert('Error al enviar mensages,actualizar e intentar nuevamente');	
				return false;
			}

		}
		
		    $('#msncurso').val("");
		    $('#msnalu').val("");
		  	alert('Mensaje enviado correctamente');	
		  	return true;
	}else{
		alert('Debe seleccionar: Curso y Materia o actualizar la página');
		return false;
	}

}
function updateview(index){
    if (index>0 && index<=lista.length) {
        indice=index;
        var nombre;
        nombre = document.getElementById('slcalumnos');
        var valor = nombre.options[indice].text;
        document.getElementById('select2-slcalumnos-container').innerHTML = valor;
        document.getElementById('slcalumnos').selectedIndex = indice;
        getNombre();	
    }
}
function asistencia(){
	if($('#slccurso').val() !=0 ){
		location.href='asistencia_claseVirtual2.php?curso='+curso+'&paralelo='+paralelo;
	}else{
		alert('Debe seleccionar un curso');
	}
}

$(document).ready(function()
						   {
						       
						       init();
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});		
							   
							   /* Selects */
							   $('#slccurso').change(function() {
							       if( $("#slccurso").val() != 0 ) {
    							       index 	 = $('#slccurso').val();
    							       curso 	= listaCursos[index-1]['codcur'];
                                       paralelo = listaCursos[index-1]['codpar'];
                                       nombre_curso = listaCursos[index-1]['nombre'];
                                       console.log(nombre_curso);


    							       obtenerMaterias(curso, paralelo);
    							       getAlumnos(curso, paralelo);
    							       cargarLista();
    							       obtenerCelulares();
    							       console.log(lista);
							       }
							   });
				
							   
							   
							   
							   $('#btnSalir').bind('click',function(){location.href='menu_docente.php';});
							   $('#btnprimero').bind('click',function(){updateview(1)});
							   $('#btnanterior').bind('click',function(){updateview(indice-1)});
							   $('#btnsiguiente').bind('click',function(){updateview(indice+1)});
							   $('#btnultimo').bind('click',function(){updateview(lista.length)});
							   $('#btn1').bind('click',function(){grabar(1);});
							   $('#btn2').bind('click',function(){grabar(2);});
							   $('#btn3').bind('click',function(){grabar(3);});
							   $('#btn4').bind('click',function(){grabar(4);});
							   $('#btn5').bind('click',function(){grabar(5);});
							   $('#btn6').bind('click',function(){grabar(6);});
							   $('#btn7').bind('click',function(){grabar(7);});
							   $('#btn8').bind('click',function(){grabar(8);});
							   $('#btn9').bind('click',function(){grabar(9);});
							   $('#btn10').bind('click',function(){grabar(10);});
							   $('#btn11').bind('click',function(){grabar(11);});
							   $('#btn12').bind('click',function(){grabar(12);});
							   $('#btn13').bind('click',function(){grabar(13);});
							   $('#btn14').bind('click',function(){grabar(14);});
							   $('#btn15').bind('click',function(){grabar(15);});
							   $('#btn16').bind('click',function(){grabar(16);});
							   $('#btn17').bind('click',function(){grabar(17);});
							   $('#btn18').bind('click',function(){grabar(18);});
							   $('#btn19').bind('click',function(){grabar(19);});
							   $('#btn20').bind('click',function(){grabar(20);});
							   $('#btn21').bind('click',function(){grabar(21);});
							   $('#btn22').bind('click',function(){grabar(22);});
							   $('#btn23').bind('click',function(){grabar(23);});
							   $('#btn24').bind('click',function(){grabar(24);});
							   
							   $('#btne2').bind('click',function(){
							       obtenerNombreMateria();
							       getmsgalu($('#slcalumnos').val(),$('#msnalu').val());
							   });
							   
							   $('#btne1').bind('click',function(){
							       obtenerNombreMateria();
							       getmsgallclass($('#msncurso').val());
							   });
							   $('#btnListAsist').bind('click',function(){asistencia()});
							   
							}
							)
