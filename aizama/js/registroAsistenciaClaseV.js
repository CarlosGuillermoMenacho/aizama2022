/* Variables */
var btn_buscar = document.querySelector('#btn_buscar'); 
var select_materia = document.querySelector('#seleccionar_materia');
var input_fecha = document.querySelector('#fecha');
var campos_tabla = document.querySelector('#campos');
var fechaText = document.querySelector('#fechaText');

var fechaActual;
var lista_alumnos = [];
var registroClaseVirtual = [];
var listaMaterias = [];
var clasesVirtuales = [];
var codigoClase;
var clases;
var licenciasAlumnos;

/* Dominio */
var dominio = 'https://www.aizama.net';

/* Fechas */
var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");

var fecha = new Date();
fechaText.textContent = diasSemana[fecha.getDay()] + ", " + fecha.getDate() + " de " + meses[fecha.getMonth()] + " de " + fecha.getFullYear() ;

/* Obteniendo curso y paralelo obtenidos por get */
var curso    = getParameterByName('curso');
var paralelo = getParameterByName('paralelo');
var nombre_Curso;
/* Peticion Registro Asistencia actual */
function obtenerListaAsistencia2(fechas) {
    var fechaLista = fechas;
    registroClaseVirtual = [];
    var peticion = new XMLHttpRequest();
    var data = new FormData();
    data.append('codcur', curso);
    data.append('codpar', paralelo);
    data.append('fecha',  fechaLista);
    peticion.onload = () => {
      if (peticion.status >= 200 && peticion.status < 300) {
        if( peticion.response == 'eSession' ) { 
            alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
            return;
        }
        let jsonData = JSON.parse(peticion.response);
        registroClaseVirtual = jsonData;
        if (registroClaseVirtual['status'] == 'ok') {
            licenciasAlumnos = registroClaseVirtual['licencias'];
            cargarMateria();
            codigoClase = $('#seleccionar_materia').val();
            mostrarTabla(codigoClase);
            $('#fechaText').text(registroClaseVirtual['dia']);
        } else if(registroClaseVirtual['status'] == 'eSession'){
            alert('La sesión ha finalizado...');
            location.href = "docentes.php";
            return;
        }else {
            $('#seleccionar_materia').empty();
            $('#seleccionar_materia').append( 
                `<option value="">-- Seleccionar materia --</option>`
            );
            $('#campos').children().remove();
            alert('No hay clases en estos momento')
            return;
        }
      } else {
        console.log('Error en la petición!');
        return;
      }
    }
    peticion.open('POST', 'asistencia_json.php?op=glp', false);
    peticion.send(data);
}
function obtenerListaAsistencia(fechas) {
    var fechaLista = fechas;
    registroClaseVirtual = [];
    var peticion = new XMLHttpRequest();
    var data = new FormData();
    data.append('codcur', curso);
    data.append('codpar', paralelo);
    data.append('fecha',  fechaLista);
    peticion.onload = () => {
      if (peticion.status >= 200 && peticion.status < 300) {
        if( peticion.response == 'eSession' ) { 
            alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
            return;
        }
        let jsonData = JSON.parse(peticion.response);
        registroClaseVirtual = jsonData;
        if (registroClaseVirtual['status'] == 'ok') {
            licenciasAlumnos = registroClaseVirtual['licencias'];
            cargarMateria();
            codigoClase = $('#seleccionar_materia').val();
            mostrarTabla(codigoClase);
            $('#fechaText').text(registroClaseVirtual['dia']);
        } else if(registroClaseVirtual['status'] == 'eSession'){
            alert('La sesión ha finalizado...');
            location.href="docentes.php";
            return;
        }else {
            $('#seleccionar_materia').empty();
            $('#seleccionar_materia').append( 
                `<option value="">-- Seleccionar materia --</option>`
            );
            $('#campos').children().remove();
            alert('No hay clases en estos momento')
            return;
        }
      } else {
        console.log('Error en la petición!');
        return;
      }
    }
    peticion.open('POST', 'asistencia_json.php?op=glp2', false);
    peticion.send(data);
}


/* Obtener las asistencias */
function saveAlistencia( codigoAlumno, codClase, estadoR ) {
    let alumno= codigoAlumno;
    let clase = codClase;
    let estadoE = estadoR;

    var peticion = new XMLHttpRequest();
    var data = new FormData();
    data.append('codalu', alumno);
    data.append('codclase', clase);
    data.append('estado',  estadoE);
    peticion.onload = () => {
      if (peticion.status >= 200 && peticion.status < 300) {
        if( peticion.response == 'ok' ) { 
            obtenerListaAsistencia(fechaActual);
        } else {
            alert('Hubo un error en el registro de asistencia');
            return;
        }
      }
    }
    peticion.open('POST', 'asistencia_json.php?op=asist', false);
    peticion.send(data);
}

function falta(estudiante, clase) {
    let codigoClase = clase;
    let codigoMateria = getMateria(codigoClase);
    let codigoEstudiante = estudiante;
    let codigoProfesor = $('#codprof').val();
    let msg = "El alumno no se encuentra presente en la clase.";
    sendMsg(codigoEstudiante, codigoProfesor, msg, codigoMateria);
    saveAlistencia( codigoEstudiante, codigoClase, '0');
}

function presente(estudiante, clase) {
    let codigoClase = clase;
    let codigoMateria = getMateria(codigoClase);
    let codigoEstudiante = estudiante;
    let codigoProfesor = $('#codprof').val();
    let msg = "El alumno se encuentra presente en la clase.";
    sendMsg(codigoEstudiante, codigoProfesor, msg, codigoMateria);
    saveAlistencia( codigoEstudiante, codigoClase, '1');
}

function licencia(estudiante, clase) {
    let codigoClase = clase;
    let codigoEstudiante = estudiante;
    Swal.fire({
        title: '¿Estas seguro?',
        text: "Se asignará esta licencia",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            saveAlistencia( codigoEstudiante, codigoClase, '2');
        }
    })
}

function cargarTabla(lista_alumnosR, codigoClaseR, estadoR) {
    let alumnos = lista_alumnosR;
    let codigoClase = codigoClaseR;
    let estado = estadoR;

    for( let i = 0; i < alumnos.length; i++ ) {
        let nombreAlumno = alumnos[i]['nombre'];  
        let codigoAlumno = alumnos[i]['codalu'];  
        let asistencia = alumnos[i]['asistencia'];
        if(estado == 1) {
            switch(asistencia) {
                case '0':
                    $('#campos').append(`<tr> 
                       <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">
                            <button onclick="presente(${codigoAlumno}, ${codigoClase})" class="btn-asistencia btn-presente">P</button>     
                        </td>
                    </tr>`);        
                    break;
                case '1':
                    $('#campos').append(`<tr> 
                        <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">Presente</td>
                    </tr>`);        
                    break;
                case 'sinregistro':
                    $('#campos').append(`<tr> 
                       <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">
                            <button onclick="presente(${codigoAlumno}, ${codigoClase})" class="btn-asistencia btn-presente">P</button>     
                            <button onclick="falta(${codigoAlumno}, ${codigoClase})" class="btn-asistencia btn-falta">F</button>
                            <button onclick="licencia(${codigoAlumno}, ${codigoClase})" class="btn-asistencia btn-presente">L</button>
                        </td>
                    </tr>`);        
                    break;
                case '2':
                    $('#campos').append(`<tr> 
                        <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">Licencia</td>                        
                    </tr>`);        
                    break;
                case 'licencia':
                    $('#campos').append(`<tr> 
                       <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">
                            <button onclick="mostrarDetalleLicencia(${codigoAlumno})" style="background-color:teal; padding:8px 10px; color:white; border:none;border-radius:5px; cursor:pointer; font-weight:bold; text-transform:uppercase;">Licencia</button>
                        </td>                        
                    </tr>`);        
                    break;
            }

        } else {
            switch(asistencia) {
                case '0':
                    $('#campos').append(`<tr>
                        <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">Falta</td>
                        </tr>`
                    );        
                    break;
                case '1':
                    $('#campos').append(`<tr>
                        <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">Presente</td>
                    </tr>`);        
                    break;
                case 'sinregistro':
                    $('#campos').append( `<tr>
                       <td data-label="Nro">${(i+1)}</td>
                        <td data-label="Nombre">${nombreAlumno}</td>
                        <td data-label="Asistencia">Sin registro</td>
                    </tr>`);        
                    break;
                case 'licencia':
                    $('#campos').append( 
                       `<tr>
                            <td data-label="Nro">${(i+1)}</td>
                            <td data-label="Nombre">${nombreAlumno}</td>
                            <td data-label="Asistencia">
                                <button onclick="mostrarDetalleLicencia(${codigoAlumno})" style="background-color:teal; padding:8px 10px; border:none; color:white; font-weight:bold; text-transform:uppercase; border-radius:5px; cursor:pointer;">Licencia</button>
                            </td>
                        </tr>`
                    );        
                    break;
                case '2':
                    $('#campos').append( 
                       `<tr>
                            <td data-label="Nro">${(i+1)}</td>
                            <td data-label="Nombre">${nombreAlumno}</td>
                            <td data-label="Asistencia">Licencia</td>
                        </tr>`
                    );        
                    break;
            }

        }
    }
}  

document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector('#curso').textContent = ObtenerNombreCurso();
    fechaActual = obtenerFecha();    
    obtenerListaAsistencia(fechaActual);
    
    $('#seleccionar_materia').change( () => {
        codigoClase = $('#seleccionar_materia').val();
        if($('#seleccionar_materia').val() != '') {
            mostrarTabla(codigoClase);
        }
    });

    /* Buscar */
    btn_buscar.addEventListener('click', () => {
      if( input_fecha.value != '' ) {
        let fechaBusqueda = input_fecha.value;
        console.log(fechaBusqueda);
        obtenerListaAsistencia2(fechaBusqueda);
      } else {
        alert('Porfavor seleccione la fecha');
      }
    });
})

/* Funciones */
function mostrarTabla(codigoClase) {
    $('#campos').children().remove();
    clases = registroClaseVirtual['listas'];
    if(clases != null){
        for(let i = 0; i < clases.length; i++) {
            if(clases[i]['codclase'] == codigoClase) {
                lista_alumnos = clases[i]['lista'];
                var codigoClase = clases[i]['codclase'];
                var estado = clases[i]['estado'];
                cargarTabla(lista_alumnos, codigoClase, estado);
            }
        }
    }
}
function mostrarDetalleLicencia(idAlumno) {
    let detalle = licenciasAlumnos[idAlumno];
    Swal.fire({
       title: detalle
    });
}
function cargarMateria() {
    $('#seleccionar_materia').empty();
    clasesVirtuales = registroClaseVirtual['clases'];
    for(let i = 0; i < clasesVirtuales.length; i++) {
        let idClase = clasesVirtuales[i]['id'];
        let nombre = clasesVirtuales[i]['nombre'];
        let inicio = clasesVirtuales[i]['inicio'];
        let fin = clasesVirtuales[i]['fin'];
        let inicioClase = inicio.slice(0, -3);
        let finClase = fin.slice(0, -3);
        $('#seleccionar_materia').append( 
           `<option value="${idClase}">${nombre} ${inicioClase} A ${finClase}</option>`
        );
    }
}
function getMateria(codigoClase) {
    for(let i = 0; i < clasesVirtuales.length; i++) {
        if(codigoClase == clasesVirtuales[i]['id']) {
            return clasesVirtuales[i]['codmat'];
        }
    } 
    return false;
}
function obtenerNombreAlumno(codalu){
    for(let i = 0 ; i < lista_alumnos.length ; i++){
        if(lista_alumnos[i].codalu==codalu)return lista_alumnos[i].nombre;
    }
    return "";
}
function obtenerNombreMateria(codclase){
    for(let i = 0; i<clasesVirtuales.length ; i++){
        if(clasesVirtuales[i].id == codclase)return clasesVirtuales[i].nombre;
    }
    return "";
}
function sendMsg(c_recibe,emite,msgr,materia) {
    let nombreAlumno = obtenerNombreAlumno(c_recibe);
    let nombreMateria = obtenerNombreMateria(codigoClase);
    let fecha99 = document.getElementById('fechaText').innerHTML;
    let nmateria99 = $("#seleccionar_materia option:selected").text(); 
    let mensaje = `Fecha: ${fecha99} - Curso: ${nombre_Curso} - Materia: ${nmateria99} - Alumno: ${nombreAlumno} - ${msgr}`;
    //let mensaje = `Curso: ${nombre_Curso} - Materia: ${nombreMateria} - Alumno: ${nombreAlumno} - ${msgr}`;
    $.post(
            "data_agenda.php?op=obtener_cel_tutor",
            {codpar:c_recibe},
            (datos,estado,xhr)=>{
				
                let status = datos.status;
				
                if(status=="ok"){
                    let lista_celulares = datos.lista;
                    lista_celulares.forEach((celular)=>{
                        let cel = celular.celular;
                        if(cel!=""){
                            $.get(
                	            "https://www.aizama.net/aizama/whatsapp_msg.php?text="+mensaje+"&phone=591"+cel
                	           );
                        }
                         
                    });
				//	alert('Hola 3 - Celular : '+lista_celulares[0].celular);
					
				//	console.log(lista_celulares);
                    return;
                }
            },
            'json'
        );
   
	$.ajax({
        method: "POST",
        url: `${dominio}/agenda/mensajeprof`,
        data: JSON.stringify({ codEst: c_recibe, codEmit: emite,msg:msgr,codmat:materia}),
        contentType: "application/json",
        success:function(data){
            if( data=="ok" ) {
                alert("Mensaje enviado correctamente");
                return;
            } else {
                alert('error');
                return;
            }    
        }
    });
}
function obtenerFecha() {
    const date   = new Date()
    const day    = date.getDate()<10?`0${date.getDate()}`:date.getDate(),
          month  = (date.getMonth() + 1)<10?`0${date.getMonth()}`:date.getMonth(),
          year   = date.getFullYear()
        
    /*if(day < 10){
        fechaReturn = `${year}-${month}-0${day}`;
    }
    if( month < 10) {
        fechaReturn = `${year}-0${month}-${day}`;
    } else {
        fechaReturn = `${year}-${month}-${day}`;
    }*/
    return `${year}-${month}-${day}`;
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function ObtenerNombreCurso() {
    let nombreCurso; 
    const url = `getCurso_and_getParalelo.php?curso=${curso}&paralelo=${paralelo}`;
    var obtenerCurso = new XMLHttpRequest();
    obtenerCurso.onload = () => {
    if (obtenerCurso.status >= 200 && obtenerCurso.status < 300) {
        nombreCurso = obtenerCurso.response;
        nombre_Curso = nombreCurso;
    } else {
        console.log('Error en la petición!');
    }
    }
    obtenerCurso.open('POST', url, false);
    obtenerCurso.send();
    return nombreCurso;
}