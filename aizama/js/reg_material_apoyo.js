/* Variables */
var curso;
var paralelo;

var listaMateriales = [];
var listaMateriasMateriales = [];

var listaMaterias = [];

var listaAlumnos = [];
var lista=[];
var lista2=[];

var dominio = 'https://www.aizama.net';

var titl1 ;
var descrip1;

var lista_celulares = [];
var nuevo_msg;
var nombre_materia;
var nombre_curso;

function obtenerCelulares(){
						//alert('Hola 2');

    $.post(
            "data_agenda.php?op=obtener_tutores_cel",
            {codcur:curso,codpar:paralelo},
            (datos,estado,xhr)=>{
				
                let status = datos.status;
				
                if(status=="ok"){
                    lista_celulares = datos.lista;
					//alert('Hola '+lista_celulares[0].celular);
					
					//console.log(lista_celulares);
                    return;
                }
            },
            'json'
        );
    
}

function obtenerContactos (codalu){
    let lista20= [];
   	console.log(codalu);

	console.log(lista_celulares);
    lista_celulares.forEach((celular)=>{
        if(celular.codalu==codalu){
            lista20.push(celular.celular);
        }
        
    });
    return lista20;
}
function obtenerNombreMateria(){
	let codmat = $('#seleccionar_materia').val();
	for(let i = 0; listaMaterias.length; i++){
		if(listaMaterias[i].codmat==codmat){
			nombre_materia = listaMaterias[i].nombre;
			return;
		}

	}
}

function obtenerMaterias(curso, paralelo){
  $("#seleccionar_materia").empty();
  $("#seleccionar_materia").append('<option value="0"> -- Seleccionar materia -- </option>');
  for(var i = 0 ; i < listaMaterias.length; i++) {
      if(listaMaterias[i]['codcur'] == curso && listaMaterias[i]['codpar'] == paralelo) {
        $("#seleccionar_materia").append('<option value ="'+(listaMaterias[i]['codmat'])+'">' + listaMaterias[i]['nombre'] + '</option>');
      }
  }
}
function validarDatos() {
    if( $('#seleccionar_material').val() != 0 &&
        $('#seleccionar_materia').val() != 0 &&
        $('#seleccionar_curso').val() != 0 ) {
        return true;
    } else {
        return false;
    }
}
function validarDatosMaterial(codigoMaterial) {
    switch(codigoMaterial) {
        case'5':
        case'6':
        case'8': {
            if( $('#titulo').val() != '' &&
                $('#descripcion').val() != '' &&
                $('#enlace').val() != '') {
                return true;
            } else {
                return false;
            }
        }
        case '1':
        case '2':
        case '3':
        case '4':
        case '7': {
            if( $('#titulo').val() != '' &&
                $('#descripcion').val() != '') {
                if( $('#enlace').val() != '' || $('#file_material').val() != '' ) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }         
        }       
    }
}


function asignarMaterial() {    
//	cargarLista();
	titl1 = $('#titulo').val();
	descrip1 = $('#descripcion').val();
    console.log($('#titulo').val());
    console.log($('#descripcion').val());

    let tipoMaterial = $('#seleccionar_material').val();
    if( validarDatosMaterial(tipoMaterial) ) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se registrará este material de apoyo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Subiendo el material de apoyo',
                    html: 'cargando...',
                    timer: 500,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        var dataForm = new FormData($("#formulario")[0]);
                    
                        console.log( $('#file_material').val() );
                        var html=$.ajax({
                                url:"material_json.php?op=sm",
                                type: "POST",
                                data: dataForm,
                                contentType: false,
                                processData: false,
                            async:false}).responseText;
                        if( html == 'ok' ) {
                            
            				cargarLista();
                            limpiarFormBtn();
                            obtenerMaterial();
                            mostrarTablaPracticoFiltrada( curso, paralelo, $('#seleccionar_materia').val() );
                            Swal.fire(
                                'Asignación con éxito',
                                'Presione ok para salir',
                                'success'
                            );

                        } else if(html == 'errorFile') {
                            Swal.fire(
                                'Error',
                                'Inserte un archivo de acuerdo al tipo de material que eligió',
                                'error'
                            );
                        
                        } else if(html == 'errorLink') {
                            Swal.fire(
                                'Error',
                                'Inserte un enlace valido',
                                'error'
                            );
                        } 
                        else  {
                            Swal.fire(
                                'Error',
                                'Error en la asignación',
                                'error'
                            );
                            return false;
                        }     
                    }
                });
            }
        });
    } else {
        Swal.fire('Por favor rellene todo los campos');
        return false;
        
    }
        
    
}


function cargarLista()
{
	lista2=[];
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
						lista2.push(ac);
						ac="";
					} 
				}

				lista2.push(ac);
				let fecha = $('#fecha').val();
				let hora = $('#hora').val();

				getmsgallclass("Material de apoyo: Título:"+titl1+' - Desc.:'+descrip1);
				
			}
			});
}

function validardatos1(){
	if ($('#seleccionar_curso').val()!='' && $('#seleccionar_materia').val()!=0) {
		return true;
	}
	$('#seleccionar_curso').focus();
	return false;
}
function getmsgalu2(id,msg){
    //nombre_materia=toUpperCase(nombre_materia);
    //console.log('paso 1');
    
	nuevo_msg='Curso: '+nombre_curso+' Materia: '+nombre_materia+' - '+msg;
	let contactos = obtenerContactos(id);
	
	//console.log(contactos);
	//console.log(nombre_materia);
	
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
	$.post(
	    	    'data_agenda.php?alumno_celular',
	    	    {codalu:id},
	    	    (nroCelular)=>{
	    	        if(nroCelular!=""){
                        if (nroCelular.includes('+')){
                            nroCelular=nroCelular.slice(1);
                	        $.get(
                	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone="+nroCelular
                	            );
                        }
                        else{
	        	            $.get(
                	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+nroCelular
            	                );
                        }
	    	        }
	    	    });

    //    "https://www.aizama.net/aizama/whatsapp_msg.php?text="+nuevo_msg+"&phone=591"+contacto

    var m = document.getElementById("seleccionar_materia");
    var materia = m.options[m.selectedIndex].value;    

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

function getmsgallclass(msg){
    console.log(lista2.length);
	if (validardatos1()&&lista2.length>0) {
		console.log(lista2.length);
		for (var i = 0; i < lista2.length; i++) {
			if(!getmsgalu2(lista2[i],msg)){
				alert('Error al enviar mensages,actualizar e intentar nuevamente');	
				return false;
			}

		}
		    //getmsgalu2(2,msg);
		
		    $('#msncurso').val("");
		    $('#msnalu').val("");
		  	alert('Mensajes enviado a los tutores');	
		  	return true;
	}else{
		alert('Debe seleccionar: Curso y Materia o actualizar la página');
		return false;
	}

}



function mostrarArchivo() {
    $("#enlace").css("display", "none");
    $("#enlace").val("");
    $('#mostrar_archivo').css("display", "none");
    $('#label_enlace').css("display", "none");
    $('#mostrar_enlace').css("display", "block");
    $("#file_material").css("display", "block");
    return false;
}
function mostrarEnlace() {
    $("#file_material").css("display", "none");
    $("#file_material").val("");
    $('#mostrar_enlace').css("display", "none");
    $('#mostrar_archivo').css("display", "block");
    $("#enlace").css("display", "block");
    $('#label_enlace').css("display", "block");
    return false;
    
}
function limpiarFormBtn() {
    $('#titulo').val('');
    $('#descripcion').val('');
    $('#enlace').val('');
    $('#file_material').val('');
}
function buttonCancelar() {
    $('#seleccionar_material').val(0);
    $('#select2-seleccionar_material-container').text("-- Seleccione el tipo de material --");
    $('#camposRellenar').children().remove();
    limpiarFormBtn();
}

function camposRellenar(codigoMaterial) {
    $('#camposRellenar').children().remove();
    switch (codigoMaterial) {
        case '1':
        case '2':
        case '3':
        case '7':
        case '4': {
            $('#camposRellenar').append(
                `  <div class="titulo">
                        <label>Título:</label>
                        <input type="text" name="titulo" id="titulo" placeholder="Escribe tu título">
                    </div>
                    
                    <div class="grid-2">
                        <div class="enlace" style="align-self:center;" >
                            <button onclick="return mostrarEnlace()" class="btn" id="mostrar_enlace">Enlace (Link)</button>
                            
                            <label id="label_enlace" style="display:none;">Enlace:</label>                            
                            <input type="text" name="enlace" id="enlace" style="display:none;" placeholder="Ejemplo https://www.deber.com">
                        </div>
                    
                        <div class="file" style="align-self: center; margin-bottom:10px">
                            <button onclick="return mostrarArchivo()" class="btn" id="mostrar_archivo">Archivo</button> 
                            <input type="file" name="file_material" id="file_material"  style="border:none; display:none;">
                            
                        </div>
                    </div>
                    

                    <label>Descripción:</label>
                    <input type="text" name="descripcion" id="descripcion" placeholder="Escribe una breve descripción" >       

                    <div class="asignar-button grid-2">
                        <input type="button" onclick="asignarMaterial()" class="btn-asignar" name="asignarMateria" id="asignarMateria" value="grabar">
                        <input type="button" onclick="buttonCancelar()" class="btn-asignar" value="cancelar">
                    </div> `
            );
            break;
        }
        case '5':
        case '6':
        case '8': {
            $('#camposRellenar').append(
                `  <div class="titulo">
                        <label>Título:</label>
                        <input type="text" name="titulo" id="titulo" placeholder="Escribe tu título">
                    </div>
                    
                    <div class="enlace">
                        <label>Enlace (Link):</label>
                        <input type="text" name="enlace" id="enlace" placeholder="Ejemplo https://www.deber.com">
                    </div>

                    <label>Descripción:</label>
                    <input type="text" name="descripcion" id="descripcion" placeholder="Escribe una breve descripción">       

                    <div class="asignar-button grid-2">
                        <input type="button" onclick="asignarMaterial()" class="btn-asignar" name="asignarMateria" id="asignarMateria" value="grabar">
                        <input type="button" onclick="buttonCancelar()" class="btn-asignar" value="cancelar">
                    </div> `
            );
            break;
            
        }
        default:
         alert('error');
        break;
    }
}


$.post("obtener_curso_json.php?op=cp",function(respuesta){
  var jsonDataCursos = JSON.parse(respuesta);
  if (jsonDataCursos['status'] == 'ok') {
      listaCursos = jsonDataCursos['cursos'];
      for (let i = 0; i < listaCursos.length; i++) {
          var cursos = listaCursos[i]['nombre']; 
          $("#seleccionar_curso").append('<option value ="'+ (i+1) +'">' + cursos + '</option>');
      }
  }
  if(respuesta=='eSession') {
    Swal.fire('No hay materiales registrados aun en este curso');
    return false;
  }
});

$.post("obtener_materias_json.php?op=getmatprof",function(respuesta){
    var jsonDataMaterias = JSON.parse(respuesta);
    if (jsonDataMaterias['status'] == 'ok') {
        listaMaterias = jsonDataMaterias['materias'];
  }
  if(respuesta=='eSession') {
    Swal.fire('No hay materiales registrados aun en este curso');
    return false;
  }
});

function obtenerMaterial() {
    var html =  $.ajax({
                    url:"material_json.php?op=map",
                    type: "POST",
                    async:false}).responseText;
    
    var jsonData = JSON.parse(html);
    if(jsonData['status'] == 'ok' ) {
        listaMateriales = jsonData['lista'];
    } else {
        Swal.fire('No hay materiales registrados aun en este curso');
    }
}

function eliminarPractico(idMaterialApoyo) {
    let idApoyo = idMaterialApoyo;
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará este material apoyo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            var html=$.ajax({
                url:"material_json.php?op=deletemat",
                type: "POST",
                data: {id:idApoyo},
            async:false}).responseText;
            if( html == 'ok' ) {
                limpiarFormBtn();
                obtenerMaterial();
                if ($('#seleccionar_materia').val() != 0) {
                    mostrarTablaPracticoFiltrada($('#codcur').val(), paralelo, $('#seleccionar_materia').val());
                } else if ( $('#seleccionar_materia').val() == 0 ) {
                    mostrarTablaPractico($('#codcur').val(),paralelo);
                }
                Swal.fire(
                    'Eliminación con éxito',
                    'Presione ok para salir',
                    'success'
                );
            } else  {
                Swal.fire(
                    'Error al eliminar material apoyo',
                    'Presione ok para salir',
                    'error'
                );
                return false;
            }
        }
    });
    
    
}
function mostrarTablaMateria(materia) {
    var count = 1;
    for( let j = 0; j < listaMateriasMateriales.length; j++ ) {
        if(listaMateriasMateriales[j]['codmat'] == materia) {
            let descripcion = listaMateriasMateriales[j]['descripcion'];
            let titulo = listaMateriasMateriales[j]['titulo'];
            let material = listaMateriasMateriales[j]['material'];
            let tipo = listaMateriasMateriales[j]['tipo'];
            let tipoMaterial = listaMateriasMateriales[j]['tipomaterial'];
            let id = listaMateriasMateriales[j]['id'];
            switch(tipoMaterial) {
                case '1': 
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/pdf.png" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                 
                            </td>
                        </tr>`  
                    );
                    count++;
                    break;
                case '2':
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/icono-docx.png" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                 
                            </td>
                        </tr>`  
                    );
                    count++;
                    break;
                case '3':
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/point.png" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                 
                            </td>
                        </tr>`  
                    );
                    count++;
                    break
                case '4':
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/excel.png" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                 
                            </td>
                        </tr>`  
                    );
                    count++;
                    break
                case '5':
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/icon_video.svg" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                 
                            </td>
                        </tr>`  
                    );
                    count++;
                    break;
                case '6':
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${(j+1)}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/musica.svg" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                 
                            </td>
                        </tr>`  
                    );
                    count++;
                    break;
                case '7':
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/icono_img.svg" height="50px" alt="icono_material">
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                 
                            </td>
                        </tr>`  
                    );
                    count++;
                    break
                case '8':
                    $('.contenedor-table-filtrada #campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}" target="_blank">
                                    <img src="images/icon-web.svg" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                                    
                            </td>
                        </tr>`  
                    );
                    count++;
                    break
                default:
                    alert('error');
                    break;
            }
            
        }
                
    }    
}
function mostrarTablaPracticoFiltrada(curso,paralelo, materia ){
    $('.contenedor-table-filtrada #campos').children().remove();
    $('.contenedor-table-general').css("display", "none");
    $('.contenedor-table-filtrada').css("display", "block");
    console.log(listaMateriales.length);
    console.log(listaMateriales);
    console.log();
    for( let i = 0; i < listaMateriales.length; i++ ) {
        console.log( typeof listaMateriales[i]['codcur'] );
        if( listaMateriales[i]['codcur'] == curso && listaMateriales[i]['codpar'] == paralelo ) {
            
            console.log('llego hasta aca');
            listaMateriasMateriales = listaMateriales[i]['materiales'];
            mostrarTablaMateria(materia);
        }
    }
}

function mostrarTablaPractico(curso,paralelo) {
    $('#campos').children().remove();
    $('.contenedor-table-general').css("display", "block");
    $('.contenedor-table-filtrada').css("display", "none");
    for( let i = 0; i < listaMateriales.length; i++ ) {
        if( listaMateriales[i]['codcur'] == curso &&listaMateriales[i]['codpar'] == paralelo) {
            var count = 1;
            let materiales = listaMateriales[i]['materiales'];
            for( let j = 0; j < materiales.length; j++ ) {
                let nombreMateria = materiales[j]['nombre'];
                let descripcion = materiales[j]['descripcion'];
                let titulo = materiales[j]['titulo'];
                let material = materiales[j]['material'];
                let tipo = materiales[j]['tipo'];
                let tipoMaterial = materiales[j]['tipomaterial'];
                let id = materiales[j]['id'];
                switch(tipoMaterial) {
                    case '1': 
                    $('#campos').append(
                        `<tr>
                            <td data-label="Nro">${count}</td>
                            <td data-label="Materia">${nombreMateria}</td>
                            <td data-label="Título">${titulo}</td>
                            <td data-label="Descripción">${descripcion}</td>
                            <td data-label="Ver">
                                <a href="${material}">
                                    <img src="images/pdf.png" height="50px" alt="icono_material"> 
                                </>
                            </td>
                            <td data-label="Eliminar">
                                <button onclick="eliminarPractico(${id})">
                                    <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                </button>
                            </td>
                        </tr>`  
                    );
                    count++;
                    break;
                    case '2':
                        $('#campos').append(
                            `<tr>
                                <td data-label="Nro">${count}</td>
                                <td data-label="Materia">${nombreMateria}</td>
                                <td data-label="Título">${titulo}</td>
                                <td data-label="Descripción">${descripcion}</td>
                                <td data-label="Ver">
                                    <a href="${material}">
                                        <img src="images/icono-docx.png" height="50px" alt="icono_material"> 
                                    </a>
                                </td>
                                <td data-label="Eliminar">
                                    <button onclick="eliminarPractico(${id})">
                                        <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                    </button>
                                     
                                </td>
                            </tr>`  
                        );
                        count++;
                        break;
                    case '3':
                        $('#campos').append(
                            `<tr>
                                <td data-label="Nro">${count}</td>
                                <td data-label="Materia">${nombreMateria}</td>
                                <td data-label="Título">${titulo}</td>
                                <td data-label="Descripción">${descripcion}</td>
                                <td data-label="Ver">
                                    <a href="${material}">
                                        <img src="images/point.png" height="50px" alt="icono_material"> 
                                    </a>
                                </td>
                                <td data-label="Eliminar">
                                    <button onclick="eliminarPractico(${id})">
                                        <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                    </button>
                                </td>
                            </tr>`  
                        );
                        count++;
                        break
                    case '4':
                        $('#campos').append(
                            `<tr>
                                <td data-label="Nro">${count}</td>
                                <td data-label="Materia">${nombreMateria}</td>
                                <td data-label="Título">${titulo}</td>
                                <td data-label="Descripción">${descripcion}</td>
                                <td data-label="Ver">
                                    <a href="${material}">
                                        <img src="images/excel.png" height="50px" alt="icono_material"> 
                                    </a>
                                </td>
                                <td data-label="Eliminar">
                                    <button onclick="eliminarPractico(${id})">
                                        <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                    </button>
                                </td>
                            </tr>`  
                        );
                        count++;
                        break
                    case '5':
                        $('#campos').append(
                            `<tr>
                                <td data-label="Nro">${count}</td>
                                <td data-label="Materia">${nombreMateria}</td>
                                <td data-label="Título">${titulo}</td>
                                <td data-label="Descripción">${descripcion}</td>
                                <td data-label="Ver">
                                    <a href="${material}">
                                        <img src="images/icon_video.svg" height="50px" alt="icono_material"> 
                                    </a>
                                </td>
                                <td data-label="Eliminar">
                                    <button onclick="eliminarPractico(${id})">
                                        <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                    </button>                                    
                                </td>
                            </tr>`  
                        );
                        count++;
                        break;
                    case '6':
                        $('#campos').append(
                            `<tr>
                                <td data-label="Nro">${count}</td>
                                <td data-label="Materia">${nombreMateria}</td>
                                <td data-label="Título">${titulo}</td>
                                <td data-label="Descripción">${descripcion}</td>
                                <td data-label="Ver">
                                    <a href="${material}">
                                        <img src="images/musica.svg" height="50px" alt="icono_material"> 
                                    </a>
                                </td>
                                <td data-label="Eliminar">
                                    <button onclick="eliminarPractico(${id})">
                                        <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                    </button>                                   
                                </td>
                            </tr>`  
                        );
                        count++;
                        break;
                    case '7':
                        $('#campos').append(
                            `<tr>
                                <td data-label="Nro">${count}</td>
                                <td data-label="Materia">${nombreMateria}</td>
                                <td data-label="Título">${titulo}</td>
                                <td data-label="Descripción">${descripcion}</td>
                                <td data-label="Ver">
                                    <a href="${material}">
                                    <img src="images/icono_img.svg" height="50px" alt="icono_material"> 
                                    </a>
                                </td>
                                <td data-label="Eliminar">
                                    <button onclick="eliminarPractico(${id})">
                                        <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                    </button>                                   
                                </td>
                            </tr>`  
                        );
                        count++;
                        break
                    case '8':
                        $('#campos').append(
                            `<tr>
                                <td data-label="Nro">${count}</td>
                                <td data-label="Materia">${nombreMateria}</td>
                                <td data-label="Título">${titulo}</td>
                                <td data-label="Descripción">${descripcion}</td>
                                <td data-label="Ver">
                                    <a href="${material}">
                                        <img src="images/icon-web.svg" height="50px" alt="icono_material"> 
                                    </a>
                                </td>
                                <td data-label="Eliminar">
                                    <button onclick="eliminarPractico(${id})">
                                        <img src="images/delete.svg" height="50px" alt="icono_eliminar">   
                                    </button>
                                        
                                </td>
                            </tr>`  
                        );
                        count++;
                        break
                    default:
                        Swal.fire('Error');
                        break;
                }
            }
            
        }
        
    }
}


$(document).ready(function() {
  obtenerMaterial();
  $('#seleccionar_curso').change(function() {
    $('.material-apoyo').css("display", "none"); 
    $('#camposRellenar').children().remove();
    $('#seleccionar_material').val(0);
    $('#select2-seleccionar_material-container').text("-- Seleccione el tipo de material --");
    if( $('#seleccionar_curso').val() != 0 ) {  
      var index = $('#seleccionar_curso').val();
      curso = listaCursos[index-1]['codcur'];
      paralelo = listaCursos[index-1]['codpar'];
      $('#codcur').val(curso);
      $('#codpar').val(paralelo);
      obtenerMaterias(curso, paralelo);
      mostrarTablaPractico(curso,paralelo);
      obtenerCelulares();
        //    var index = $('#seleccionar_curso').val();
            console.log('index: '+index);
            curso = listaCursos[index-1]['codcur'];
            console.log('curso: '+curso);
 
            nombre_curso = listaCursos[index-1]['nombre'];
            console.log('curso: '+nombre_curso);

            paralelo = listaCursos[index-1]['codpar'];
            console.log('paralelo: '+paralelo);
      
    } else {
      $('.contenedor-table-general').css("display", "none");
      $('.contenedor-table-filtrada').css("display", "none");
      $('#seleccionar_materia').html('<option value ="0"> -- Seleccionar materia -- </option>');
      curso = '';
      paralelo = '';
    }
  });

  
  $('#seleccionar_materia').change(function() {
    $('#camposRellenar').children().remove();
    $('#seleccionar_material').val(0);
    $('#select2-seleccionar_material-container').text("-- Seleccione el tipo de material --");
    if($('#seleccionar_materia').val() != 0) {
        $('.material-apoyo').css("display", "block");
        let codigoCurso = $('#codcur').val();
        let codigoMateria = $('#seleccionar_materia').val();
        $('#codmat').val(codigoMateria);
        mostrarTablaPracticoFiltrada(codigoCurso,paralelo, codigoMateria);


        
        obtenerNombreMateria();
    } else {
        $('.material-apoyo').css("display", "none");
        mostrarTablaPractico($('#codcur').val(),paralelo);
        $('#codmat').val("");
        $('.contenedor-table-filtrada').css("display", "none");
    }
  });
  
  $('#seleccionar_material').change(function() {
    if($('#seleccionar_material').val() != 0) {
        let codigoMaterial = $('#seleccionar_material').val();
        camposRellenar(codigoMaterial);
    } else {
        $('#camposRellenar').children().remove();
    }
  });
  

});

