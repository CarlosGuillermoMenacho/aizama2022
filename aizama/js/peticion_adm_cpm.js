/*Peticiones*/
export function obtenerCurso() {
    let respuestaRetornar;
    let peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function(){
        if (peticion.readyState==4 && peticion.status==200) {
            let response = JSON.parse(peticion.responseText);
            if( response['status'] == 'ok' ) {
                respuestaRetornar = response['niveles'];
                
            } else {
                return alert('No hay cursos');
            }
        } 
    }
    peticion.open("POST","obtener_curso_json.php?op=ca", false);
    peticion.send();    
    return respuestaRetornar;
}

export function obtenerParalelos() {
    let respuestaRetornar;
    let peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function(){
        if (peticion.readyState==4 && peticion.status==200) {
            let response = JSON.parse(peticion.responseText);
            if( response['status'] == 'ok' ) {
                respuestaRetornar = response['paralelos'];
            } else {
                alert('No hay paralelos');
            }
        } 
    }
    peticion.open("POST","get_paralelos.php", false);
    peticion.send();
    return respuestaRetornar;
}

export function obtenerEstudiantes() {
    let respuestaRetornar;
    let peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function(){
        if (peticion.readyState==4 && peticion.status==200) {
            let respuesta = JSON.parse(peticion.responseText);
            respuestaRetornar = respuesta['lista'];
        } 
    }
    peticion.open('POST', 'alumno_json.php?op=lad', false);
    peticion.send();
    return respuestaRetornar;
}

/* export function obtenerTutores() {
    let respuestaRetornar;
    let peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function(){
        if (peticion.readyState==4 && peticion.status==200) {
            let respuesta = JSON.parse(peticion.responseText);
            respuestaRetornar = respuesta['lista'];
        } 
    }
    peticion.open('POST', 'tutores_json.php', false);
    peticion.send();
    return respuestaRetornar;
} */

export function obtenerMaterias() {
    let respuestaRetornar;
    let peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function(){
        if (peticion.readyState==4 && peticion.status==200) {
            let response = JSON.parse(peticion.responseText);
            if( response['status'] == 'ok' ) {
                respuestaRetornar = response['materias'];
            } else {
                alert('No hay materias');
            }
        } 
    }
    peticion.open("POST","obtener_materias_json.php?op=ma", false);
    peticion.send();
    return respuestaRetornar;
}

export function cargarCursos(listaCursos){
    for(let i = 0; i < listaCursos.length; i++) {
        var codigoCurso = listaCursos[i]['codcur'];
        var nombreCurso = listaCursos[i]['nombre'];
        $('#seleccionar_Curso').append(`<option value="${codigoCurso}" >${nombreCurso}</option>`)
    }
}

export function cargarEstudiantes(listaEstudiantes, filtrar=false){
    $('#seleccionar_Alumno').children().remove();
    $('#seleccionar_Alumno').append(`<option value="">-- Seleccionar Alumno --</option>`);
    let codigoEstudiante;
    filtrar ? codigoEstudiante = 'codalu' : codigoEstudiante = 'codigo';
    console.log(codigoEstudiante);
    for(let i = 0; i < listaEstudiantes.length; i++) {
        var codigoAlumno = listaEstudiantes[i][codigoEstudiante];
        var nombreAlumno = listaEstudiantes[i]['nombre'];
        $('#seleccionar_Alumno').append(`<option value="${codigoAlumno}">${nombreAlumno}</option>`)
    }
}

export function cargarParalelos(listaParalelos){
    for(let i = 0; i < listaParalelos.length; i++) {
        var codigoParalelo = listaParalelos[i]['codigo'];
        var nombreParalelo = listaParalelos[i]['nombre'];
        $('#seleccionar_Paralelo').append(`<option value="${codigoParalelo}" >${nombreParalelo}</option>`)
    }
}

export function cargarMaterias(listaMaterias, nivel){
    for(let i = 0; i < listaMaterias.length; i++) {
        if ( nivel == listaMaterias[i]['nivel']) {
            var codigoMateria = listaMaterias[i]['codmat'];
            var nombreMateria = listaMaterias[i]['nombre'];
            $('#seleccionar_Materia').append(`<option value="${codigoMateria}" >${nombreMateria}</option>`);
        }
    }
}

export function cargarTutores(listaTutores){
    for(let i = 0; i < listaTutores.length; i++) {
        var codigo = listaTutores[i]['codtut'];
        var nombre = listaTutores[i]['nombre'];
        $('#seleccionar_Tutor').append(`<option value="${codigo}" >${nombre}</option>`);
    }
}



export function obtenerNivel(listaCursos, codigoCurso){
    for(let i = 0; i < listaCursos.length; i++) {
        var codigo = listaCursos[i]['codcur'];
        if (codigo==codigoCurso) {
            return listaCursos[i]['nivel'];
        }
    }
}



