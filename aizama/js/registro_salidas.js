let lista = []; 
var dominio = 'https://www.principedepazsc.com';
let index_list = "";

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
        	if(datos.status == "eSession"){
        		Swal.fire("La sesión ha finalizado...\nVuelva a ingresar al sistema con su usuario y contraseña por favor...");
        		return;
        	}
            lista = datos.lista;
            let profesores = datos.prof;
            profesores.forEach(p=>{
            	lista.push(p);

            })
            cargar_alumnos();
        },
        "json"
    );
}

function cargar_curso() {
   
    for (var i = 0; i < lista.length; i++) {
        let curso = lista[i]['curso'];
         $('#input-curso').val(curso);
    }
    i++;
}

function validar_alumno(cod){
	return true;
}

function grabar(){
	console.log(index_list);
	if (index_list!="") {
		let datos = lista[index_list];
		if(datos.type == "s"){
			let html=$.ajax({type:"GET",url:'reg_hora_salida.php',data:{id:datos.codalu},async:false}).responseText;
			if (html=='error') {
				$("#info_text").val("Error no se pudo registrar la salida");
				return false;
			}
			if (html=='eYaGrabado') {
				$("#info_text").val('Ya registro su salida anteriormente');
				return false;
			}
			if (html=='eGrabado') {
			    getmsgalu(datos);
				$("#info_text").val('Grabado con Exito');
				
				return true;
			}
		}
		if(datos.type == "d"){
			let html=$.ajax({type:"POST",url:'asistencia_prof_json.php?op=asist_adm',data:{tipo:2,doc:datos.codalu},async:false}).responseText;
			if (html=='error') {
				$("#info_text").val("Error no se pudo registrar la salida");
				return false;
			}
			if (html=='yaRegistrado') {
				$("#info_text").val('Ya registro su salida anteriormente');
				return false;
			}
			if (html=='noIngreso') {
				$("#info_text").val('No hay registro de ingreso...');
				return false;
			}
			if (html=='ok') {
				$("#info_text").val('Grabado con Exito');
				if (datos.cel != null && datos.cel != "") {
					$.get(
				        "horaServidor.php",
				        (horaServidor)=>{
				            let msg=`*Notificación de Salida* Profesor: *${datos.solo_nombre}* Hora de Salida: *${horaServidor}*`;
				    	    let url = `whatsapp_msg.php?text=${msg}&phone=591${datos.cel}`;
							$.get(url);         
				        },
				        "text"
			        );
				}
				return true;
			}
		}
	}else{
		alert("Debe seleccionar uno de la lista...");
		return false;
	}
}

function getmsgalu(datos){
    
    $.get(
        "horaServidor.php",
        (horaServidor)=>{
            var msgr = "Hora de Salida a la Unidad Educativa: "+horaServidor;
            let msg=`*Notificación de Salida* Estudiante: *${datos.solo_nombre}* Curso: *${datos.curso}* Hora de Salida: *${horaServidor}*`;
    	    let contactos = datos.cel;
    	    console.log(contactos);
    	    contactos.forEach((contacto)=>{
                if (contacto.includes('+')){
                    contacto=contacto.slice(1);
                    let url = `whatsapp_msg.php?text=${msg}&phone=${contacto}`;
                    $.get(url);
                }
                else{
                	if(contacto!=""){
	                	let url =  `whatsapp_msg.php?text=${msg}&phone=591${contacto}`;
	        	        $.get(url);
                	}
                }
    	        
    	    });
            var c_recibe = datos.codal;
            var emite = "administracion";
            let nombre = "Sistema";

    		$.ajax({
                method: "POST",
                url: `${dominio}/agenda/mensajeSalida`,
                data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,nombre:nombre}),
                contentType: "application/json",
                success:function(data){
                      
                }
                });
        },
        "text"
        );

		  	return true;
	
}

$(document).ready(function(){
	$('#select-alu').select2();
	obtener_alumnos();
    $('#select-alu').change(() => {
        $('#input-curso').val("");
        index_list = $('#select-alu').val();
        $("#info_text").val("");
        if(index_list!=""){
            $('#input-codigo').val(lista[index_list].codalu);
            $('#input-curso').val(lista[index_list].curso);    	
        }
    });

	$('#btngrabar').bind('click',function(){grabar();});
})