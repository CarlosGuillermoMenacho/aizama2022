let alumnos;
let lista_alumnos = [];
let lista = [];
let lista5 = [];
var codalu; 
var dominio = 'https://www.aizama.net';
let nombre_alumno;
let nombre_curso;
let hora_colegio;
let lista_celulares=[];
let cod_curso;
let cod_paralelo;

function cargar_alumnos() {
    $('#tabla').css('display',"block");
    for (var i = 0; i < lista.length; i++) {
        let nombre = lista[i]['nombre'];
        $('#select-alu').append(`<option value="${i}">${nombre}  </option>`);
    }
    i++;
}

function obtener_alumnos() {
    
    $.post(
        '../aizama/controlador/alumno_controlador_v2.php?op=get_all&usr=tut',
        datos => {
            lista = datos.lista;
            lista5 = datos.lista5;
            cargar_alumnos();
        },
        "json"
    );
}

function obtener_curso_alu(index) {
    
    $('#input-curso').val(lista[index].curso);
  
}

function cargar_curso() {
   
    for (var i = 0; i < lista.length; i++) {
        let curso = lista[i]['curso'];
       // $('#select-curso').append(`<option value="${i}">${curso}</option>`);
        $('#input-curso').val(curso);
    }
    i++;
}

function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}

function validar_alumno(cod){
//	var html=$.ajax({type:"GET",url:'get_alumno.php',data:{id:cod},async:false}).responseText;
//	if (html=='eNoResults') {
//		return false;
//	}
//	codalu=html;
	return true;
}

function getalu(e,param)
{
	param = param.toUpperCase();
	if(isKeyEnter(e))
	{
		if (validar_alumno(param))
		{
			$('#nomalu').val(codalu);
			$('#btngrabar').focus();
			return true;
		}else{
			alert('El codigo ingresado no está en el sistema.');
		}

	}
	return false;
}
function grabar(codigo){
//	alert('1');

//	if (validar_alumno($('#codalu').val())) {
	if (validar_alumno(codigo)) {
	//	alert('2');
		var html=$.ajax({type:"GET",url:'reg_hora_retrazo.php',data:{id:codigo,id_usr:$('#codalu').val()},async:false}).responseText;
	//	alert('3');
		if (html=='error') {
			alert("Error no se pudo registrar la entrada");
			return false;
		}
		if (html=='eYaGrabado') {
			alert('Ya registro su entrada anteriormente');
			return false;
		}
		if (html=='eGrabado') {
		//	$('#codalu').val("");
		//	$('#nomalu').val("");
		//	$('#codalu').focus();
		    getmsgalu();
			alert('Grabado con Exito');
			
			return true;
		}

	}else{
		alert("Debe ingresar un codigo valido");
		return false;
	}
}
function getfecha(){
    let f = new Date();
    let y = f.getFullYear();
    let m = (f.getMonth()+1);
    let d = f.getDate();
    if(m<10){
        if(d<10){
            return '0'+d+'-0'+m+'-'+y;
        }else{
            return d+'-0'+m+'-'+y;
        }
    }else{
        if(d<10){
            return '0'+d+'-'+m+'-'+y;
        }else{
            return d+'-'+m+'-'+y;
        }
    }
}
function gethora(){
    let f = new Date();
    let h = f.getHours();
    let m = f.getMinutes();
    
    if(h<10){
        if(m<10){
            return '0'+h+':0'+m;
        }else{
            return '0'+h+':'+m;
        }
    }else{
        if(m<10){
            return h+':0'+m;
        }else{
            return h+':'+m;
        }
    }
}
function obtenerCelularTutor(alucod){
					//	alert('Hola 2 - Cod alumno: '+alucod);

    $.post(
            "data_agenda.php?op=obtener_cel_tutor",
            {codpar:alucod},
            (datos,estado,xhr)=>{
				
                let status = datos.status;
				
                if(status=="ok"){
                    lista_celulares = datos.lista;
				//	alert('Hola 3 - Celular : '+lista_celulares[0].celular);
					
				//	console.log(lista_celulares);
                    return;
                }
            },
            'json'
        );
    
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
function getmsgalu(){
    
    $.get(
        "horaServidor.php",
        (horaServidor)=>{
            //let hora = gethora();
            
            var msgr = "Hora de ingreso a la Unidad Educativa: "+hora_colegio;
            var msgr2 = "Hora que ingreso el estudiante: "+horaServidor;
            nuevo_msg='INGRESO CON RETRASO - Alumno: '+nombre_alumno+' - Curso: '+nombre_curso+' - '+msgr+' - '+msgr2;
    	    let contactos = obtenerContactos(codalu);
    	    console.log(contactos);
    	    contactos.forEach((contacto)=>{
                if (contacto.includes('+')){
                    contacto=contacto.slice(1);
                    $.get(
            	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+contacto
            	       );
                }
                else{
        	        $.get(
        	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto
    	                );
                }
    	        
    	    });
            //var c_recibe = $('#codalu').val();
            var c_recibe = codalu;
            var emite = "administracion";
            let nombre = "Sistema";
            //var fecha = getfecha();
            
            
    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeIngreso`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,nombre:nombre}),
                contentType: "application/json",
                success:function(data){
                    if(data=="ok"){
                        //alert("Mensaje enviado correctamente gol: "+c_recibe+" - "+emite+"-"+msgr+"-"+materia);
                        //alert("Mensaje enviado correctamente");
                    }else{
                        alert('error');
                    }    
                }
                });
        },
        "text"
        );

		  	return true;
	
}
function obtenerHoraColegio(cc,cp){
    let diad = $('#dia_d').val();
//    let horad=document.getElementById("hora");
    console.log(cc);
    console.log(cp);
    console.log(diad);
    for (let i=0;i<lista5.length;i++){
        if(lista5[i].cod_cur==cc && lista5[i].cod_par==cp){
                    console.log(lista5[i]);
            switch(diad){
                case "1":
                    $("#hora").html(lista5[i].lu_i);
                    break;
                case "2":
                    $("#hora").html(lista5[i].lu_i);
                    break;
                case "3":
                    $("#hora").html(lista5[i].lu_i);
                    break;
                case "4":
                    $("#hora").html(lista5[i].lu_i);
                    break;
                case "5":
                    $("#hora").html(lista5[i].lu_i);
                    break;
                case "6":
                    $("#hora").html(lista5[i].lu_i);
                    break;
            }
            console.log(lista5[i]);
            return;
        }
    }
}
$(document).ready(function()
						   {
						           $('#select-alu').select2({width:400});
                                hora_colegio=$('#hora_col').val();
					            obtener_alumnos();
                                $('#select-alu').change(() => {
                                    $('#input-curso').val("");
                                    let index = $('#select-alu').val();
                                    if(index!=""){
                                        codalu = lista[index].codalu;
                                        obtener_curso_alu(index);
                                        $('#input-codigo').val(codalu);

        						       nombre_alumno = lista[index].solo_nombre;
        						       nombre_curso = $('#input-curso').val();
        						       cod_curso = lista[index].codcur;
        						       cod_paralelo = lista[index].codpar;
        						       obtenerHoraColegio(cod_curso,cod_paralelo);
        						       obtenerCelularTutor(codalu);
                                    }
                                });

//						       nombre_alumno = $('#nombre_alumno').val();
						/*       nombre_alumno = '';
						       nombre_curso = $('#input-curso').val();
						       codalu = $('#input-codigo').val();
						       obtenerCelularTutor(codalu);*/
						//       let nivelAlumno = $('#nivel_alumno').val();
						/*	   $('#btnsalir').bind('click',function(){
    						       if(nivelAlumno == 'SECUNDARIA') {
    						           location.href = 'inicios_sec.php';	           
    						       } else if(nivelAlumno == 'PRIMARIA') {
							           location.href = 'inicios_prim.php';
    						       }
							   });
                                */
							   $('#btngrabar').bind('click',function(){grabar(codalu);});
							}
							)

