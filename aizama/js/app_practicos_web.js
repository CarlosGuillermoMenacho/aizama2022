/* Variables */
let listaMaterias = [];
let listaPracticos = [];
let listaPreguntas = [];
let listaRespuestas = [];

/* Para que el textarea crezca de acuerdo al contenido */
function addAutoResize() {
    document.querySelectorAll('[data-autoresize]').forEach(function (element) {
      element.style.boxSizing = 'border-box';
      var offset = element.offsetHeight - element.clientHeight;
      element.addEventListener('input', function (event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 'px';
      });
      element.removeAttribute('data-autoresize');
    });
}


/* Peticion para los practicos preguntas respuestas */
function pedirPracticos() {
    limpiarMaterias();
    $('.contenedor-lista').css("display", "block");
    let peticion = new XMLHttpRequest();
    peticion.open("POST", "practicos_web_json.php?op=gpwa", false);
    peticion.onload = function (e) {
      if (peticion.readyState === 4) {
        if (peticion.status === 200) {
          if(peticion.responseText == 'eSession') {
            Swal.fire('La Session ha expirado porfavor vuelva a ingresar con sus datos');
          } else {
            let jsonData = JSON.parse(peticion.responseText);
            if(jsonData['status'] == 'ok') {
              listaMaterias = jsonData['materias'];
              listaPracticos = jsonData['practicos'];
              listaPreguntas = jsonData['preguntas'];  
              listaRespuestas = jsonData['respuestas'];  
            }
          }  
        } else {
          Swal.fire('Error en la petición')
        }
      }
    };
    peticion.send();
}

/* Mostrar materias */
function mostrarMaterias() {
    listaMaterias.forEach( materias => {
        $('.lista-materias').append(` 
        <li>
            <button id="${materias.codmat}" class="info-materia" onclick="mostrarTablaMateria(\'${materias.codmat}'\ , ${materias.practicos})">
                <div class="materia">
                    <img src="${materias.img}" >
                    <p>${materias.nombre}</p>
                </div>
                <span class="badge">${materias.practicos}</span>
            </button>
        </li>
        `);
    });
}

/* Mostrar Practicos por Materia */
function mostrarTablaMateria(materia, cantidadPracticos) {
    if( cantidadPracticos > 0) {
        $('.contenedor-lista').css("display", "none");
        limpiarTablas();
        var nro = 1;
        listaPracticos.forEach( practico => {
            if( materia == practico.codmat ) {
                $('#campos').append(`
                    <tr>
                        <td data-label="Nro">${nro}</td>
                        <td data-label="Descripción">${practico.descripcion}</td>
                        <td data-label="Ver">
                            <button onclick="mostrarPractico(${practico.idpractico}, ${practico.editable})">
                                <img src="images/icon-examen.svg" height="50px"> 
                            </button>
                        </td>
                        <td data-label="Nota">${practico.nota}</td>
                        <td data-label="Presentación">${practico.presentacion}</td>
                    </tr>
                `);
                nro++;                        
            }
        });
        $('.contenedor-table').css("display", "flex");
    } else {
        alert('No tiene practicos para esta materia');
    }
}

function mostrarPractico(idPractico, editable) {
    $('#codigoPractico').val(idPractico);
    $('.contenedor-table').css("display", "none");
    informacionPractico(idPractico);
    limpiarPreguntas();
    mostrarPreguntas(idPractico, editable);
    $('.practico').css("display", "block");
}



function mostrarPreguntas(idPractico, editable) {
    limpiarPreguntaAlumnos();
    listaPreguntas.forEach( preguntas => {
        if( preguntas.codpractico == idPractico.toString() ) {
            switch (editable) {
                case 0:
                    let respuesta = mostrarRespuestas(preguntas.npreg, preguntas.codpractico);
                    $('.preguntas').append(`
                        <div class="pregunta" style="margin-bottom:10px">
                            <label>${preguntas.npreg}.- ${preguntas.pregunta}</label>
                            <textarea disabled row="2" id="${preguntas.npreg}" placeholder="tu respuesta" data-autoresize>${respuesta}
                            </textarea>
                        </div>
                    `);
                    break;           
                case 1:
                    let respuesta1 = mostrarRespuestas(preguntas.npreg, preguntas.codpractico);
                    $('.preguntas').append(`
                    <div class="pregunta" style="margin-bottom:10px">
                        <label>${preguntas.npreg}.- ${preguntas.pregunta}</label>
                        <textarea row="2" id="${preguntas.npreg}" placeholder="tu respuesta">${respuesta1}</textarea>
                    </div>
                    `);
                    break;
                default:
                    alert('error');
                    break;
            }
        }
    });
}

function mostrarRespuestas(numeroPregunta, idPractico) {
    if( listaPreguntas.length > 0 ) {
        let respuestaRetornar = "";
        listaRespuestas.forEach( respuestas => {
            const { codpractico, respuesta, npreg } = respuestas;
            if(codpractico == idPractico) {
                if( npreg == numeroPregunta ) {
                    respuestaRetornar = respuesta;    
                } 
            }
        });
        return respuestaRetornar;
    } else {
        return false;
    }
}
function informacionPractico(idPractico) {
    listaPracticos.forEach( practico => {
        if( idPractico == practico.idpractico ) {
            $('.practico__descripcion input').val(practico.descripcion);
            $('.practico__curso input').val(practico.curso);
            $('.practico__materia input').val(practico.materia);
        }
    });
}
function guardarPractico() {
    if( validarPreguntas() ) {
        let formData = new FormData();
        formData.append('codpractico', $('#codigoPractico').val())
        /* Obteniendo las respuestas para mandarlas */
        let listaRespuesta = document.querySelector('.preguntas').children;
        formData.append('nresp', listaRespuesta.length)
        for (let i = 0; i < listaRespuesta.length; i++) {
            formData.append( `resp${i+1}`, listaRespuesta[i].children[1].value);
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se guardarán las respuestas",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
    
                let peticion = new XMLHttpRequest();
                peticion.open("POST", "practicos_web_json.php?op=spwa", false);
                peticion.onload = function (e) {
                if (peticion.readyState === 4) {
                    if (peticion.status === 200) {
                        if(peticion.responseText == 'eSession') {
                            Swal.fire('La Session ha expirado porfavor vuelva a ingresar con sus datos');
                        } else if( peticion.responseText == 'ok') {
                            $('.practico').css("display", "none");
                            pedirPracticos();
                            mostrarMaterias();
                            Swal.fire(
                                'Éxito',
                                'Práctico guardado',
                                'success'  
                            );
                        } else if(peticion.responseText == 'errorLimite') {
                            Swal.fire(
                                'Error',
                                'La fecha límite expiró',
                                'error'  
                            );
                        } else {
                            Swal.fire('Error');
                        } 
                    } else {
                    Swal.fire('Error')
                    }
                }
                };
                peticion.send(formData);
            }
        });
    } else {
        Swal.fire('Por favor responda al menos una pregunta');
    }   
}

function validarPreguntas() {
    let respuesta = 0;
    let listaPreguntas = document.querySelector('.preguntas').children;
    for (let i = 0; i < listaPreguntas.length; i++) {
        if( listaPreguntas[i].children[1].value != '' ) {
            respuesta++;
        } 
    }
    if( respuesta > 0) {
        return true;
    } else {
        return false;
    }
}



function volverAtras() {
    $('.contenedor-table').css("display", "none")
    $('.contenedor-lista').css("display", "block")
}

function atrasPractico() {
    $('.contenedor-table').css("display", "flex");
    $('.practico').css("display", "none");
    
}
function limpiarMaterias() {
    $('.lista-materias').children().remove();
}
function limpiarTablas() {
    $('#campos').children().remove();
}
function limpiarPreguntas() {
    $('.preguntas').children().remove();
}

function limpiarPreguntaAlumnos() {
    $('.preguntas-alumnos').children().remove();
}

$(document).ready(function() {
    addAutoResize();
    pedirPracticos();
    mostrarMaterias();
});




