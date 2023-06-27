let dataAlumnos = [];
let dataTutores = [];
let dataAluTut =  [];
let codigoAlumnoInput = document.querySelector('#codigoAlumnoInput');

const form = document.querySelector('#formulario');
const btnInicio = document.querySelector('#btnInicio');
const btnAnterior = document.querySelector('#btnAnterior');
const btnSiguiente = document.querySelector('#btnSiguiente');
const btnFin = document.querySelector('#btnFin');
const btnNuevo = document.querySelector('#btnNuevo');
const btnModificar = document.querySelector('#btnModificar');
const btnConsultar = document.querySelector('#btnConsultar');
const btnImprimir = document.querySelector('#btnImprimir');
const btnEliminar = document.querySelector('#btnEliminar');
const btnAgregar = document.querySelector('#btnAgregar');
const btnActualizar = document.querySelector('#btnActualizar');
const btnCancelar = document.querySelector('#btnCancelar');


/* Buttons opciones */
const btnVerKardexPagoGO = document.querySelector('#btnVerKardexPagoGO');
const btnActualizarDataColegio = document.querySelector('#btnActualizarColegio');

/* Mensaje  */
const tipoBecas = [
    'Normal (Sin Beca)', '1 Beca (3er Hijo)', '1 Beca (Aprovechamiento)', '1/2 Beca (Hijo Docente)',
    '1 Beca (Hijo Docente)', '1 Beca (Directorio)', '1 Beca (Deporte)', '1/2 Beca (Iglesia)',
    '1/2 Beca (Especial)', '1/2 Beca (Deporte)', '1/4 Beca (Caso Especial)'
];

const mensajeOpciones = {
    "eSession": {
        'message': "La sesión ha expirado por favor vuelva a ingresar",
        'icon': "error",
        'title': "Error"
    },
    "errorSQL": {
        'message': "Ocurrio un error por favor comuniquese con soporte",
        'icon': "error",
        'title': "Error"
    },
    "errorParam": {
        'message': "Ocurrio un error por favor comuniquese con soporte",
        'icon': "error",
        'title': "Error"
    },
    "ok": {
        'message': "La accion se ha completado",
        'icon': "success",
        'title': "Éxito"
    }
}
const dataTablaDB = {
    "datoAlumno": {
        "tabla": "alumno",
        "columnaId": "codigo"
    },
    "deporte": {
        "tabla": "dep_alumno",
        "columnaId": "dep_alu_codAlu"
    },
    "plataforma": {
        "tabla": "usr",
        "columnaId": "id_usr"
    }
}

const validarInput = (array) => {
    let data = {};
    let flag = false;
    array.forEach(inputElement => {
        const input = document.querySelector(`#${inputElement}`);
        if (input.value) {
            const name = input.name;
            const dataInput = { [name]: input.value };
            data = { ...data, ...dataInput };
        } else {
            flag = true;
        }

    });
    if (flag) {
        return false;
    }
    return data;
}

btnAgregar.addEventListener('click', () => {
    const url = 'get_info_alumno.php?peticion=add';
    const inputs = ['nombres', 'fechaNacimiento', 'curso', 'paralelo', 'sexo', 'estado', 'turno', 'nroCI', 'nroCuotas'];
    const data = validarInput(inputs);
    if (!data) {
        alert('Por favor inserte todos los campos');
        return;
    }
    const apellidoPaterno = document.querySelector('#apellidoPaterno');
    const apellidoMaterno = document.querySelector('#apellidoMaterno');
    if (apellidoPaterno.value === "" && apellidoMaterno.value === "") {
        alert('Por favor inserte un apellido');
        return;
    }
    Swal.fire({
        title: '¿Estas seguro?',
        text: "De realizar esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelmButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            /* Rellenando los datos que se enviara en el formData */
            let formData = {};
            const elementsForm = form.elements;
            [...elementsForm].forEach((element) => {
                let name = element.name;
                if (element.type == 'checkbox') {
                    if (element.checked) {
                        element.value = "1";
                    } else { element.value = "0"; }
                }
                const dataInput = { [name]: element.value };
                formData = { ...formData, ...dataInput };
            });

            const respuestaServidor = peticion(url, formData);
            if (respuestaServidor.status == "ok") {
                const { alumno } = respuestaServidor;
                const alumnoAgregado = alumno[0];
                codigoAlumnoInput.value = alumnoAgregado.codigo;
                const sizeObject = Object.keys(dataAlumnos.alumnos).length - 1;
                Object.assign(dataAlumnos.alumnos, {
                    [sizeObject]: alumnoAgregado
                });
                const indexArray = getPositionArray(dataAlumnos.alumnos, 'codigoAlumnoInput');
                if (indexArray > 0) {
                    resetearFormulario();
                    cargarDatosAlumno(dataAlumnos.alumnos[indexArray]);
                    inputDisabled();
                }
                btnNuevo.style.display = 'block';
                btnAgregar.style.display = 'none';
                btnCancelar.style.display = 'none';
                btnModificar.style.display = 'block';
                Swal.fire(
                    'Éxito',
                    'Alumno registrado correctamente',
                    'success');
            } else {
                Swal.fire(
                    'Error',
                    'No se pudo registrar correctamente',
                    'error');
            }
        }
    });
});

btnActualizar.addEventListener('click', () => {
    const url = 'get_info_alumno.php?peticion=update';
    const idAlumno = document.querySelector('#codigo').value;
    if (idAlumno !== "") {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "De realizar esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelmButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                /* Rellenando los datos a actualizar que se enviara en el formData */
                let formData = {};
                const elementsForm = form.elements;
                [...elementsForm].forEach((element) => {
                    let name = element.name;
                    if (element.type == 'checkbox') {
                        if (element.checked) {
                            element.value = "1";
                        } else { element.value = "0"; }
                    }
                    
                    const dataInput = { [name]: element.value };
                    formData = { ...formData, ...dataInput };
                });
                formData.tutor1 = $('#codigoTutor1').val();
                formData.tutor2 = $('#codigoTutor2').val();
                formData.tutor3 = $('#codigoTutor3').val();
                console.log(formData);
                const respuestaServidor = peticion(url, formData);
                if (respuestaServidor.status == "ok") {
                    actualizarDataAlumno(respuestaServidor);
                    rellenarSelectBusqueda();
                    Swal.fire('Éxito', 'Alumno Actualizado correctamente', 'success');
                } else {
                    Swal.fire('Error', 'No se pudo actulizar los datos', 'error');
                }
                document.querySelector('#btnActualizar').style.display = 'none';
                document.querySelector('#btnCancelar').style.display = 'none';
                document.querySelector('#btnModificar').style.display = 'block';
                document.querySelector('#btnNuevo').style.display = 'block';
            }
        });
    } else {
        alert('Seleccione un alumno');
    }

});

btnActualizarDataColegio.addEventListener("click", () => {
    const url = "get_info_alumno.php?peticion=refreshDataColegio";
    const dataColegioActualizada = peticion(url);
    cargarDatosColegio(dataColegioActualizada);
});

btnVerKardexPagoGO.addEventListener('click', () => {
    const url = "get_info_alumno.php?peticion=kardexGO";
    const dataKardexGOAlumno = peticion(url, {
        "codigo": codigoAlumnoInput.value
    });
    if (dataKardexGOAlumno.status !== "ok") {
        Swal.fire('Error', 'Ocurrió un error por favor contacte con soporte', 'error');
        return;
    }
    const { kardex, pagado, saldo } = dataKardexGOAlumno;
    const nombreAlumno = `${$('#codigo').val()}: ${$('#nombres').val()} ${$('#apellidoPaterno').val()} ${$('#apellidoMaterno').val()}`;
    const tipoAlumno = $('#tipoAlumno').val();
    const totalPagar = $('#totalGastosOperativos').val();
    const curso = $('#curso').find('option:selected').text();
    const turno = $('#turno').find('option:selected').text();
    const usuarioWeb = $('#usuarioWeb').val();
    const dataKardexAlumno = {
        "nombre": nombreAlumno,
        "curso": curso,
        "tipoAlumno": tipoAlumno,
        "totalPagar": totalPagar,
        "usuarioWeb": usuarioWeb,
        "turno": turno
    };
    cargarDataKardexAlumno(kardex, pagado, saldo, dataKardexAlumno);
    document.querySelector('.modal').style.display = 'block';
    const htmlModal = document.querySelector('.modal').outerHTML;
    Swal.fire({
        title: 'Kardex de Pago Gastos Operativos',
        html: htmlModal,
        width: 900,
        showConfirmButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('.modal').style.display = 'none';
        }
    })
});


document.addEventListener('DOMContentLoaded', async () => {
    inputDisabled();
    const url = "get_info_alumno.php?peticion=all";
    const response = await fetch(url);
    const respuestaServidor = await response.json(); 
    const { alumnos, colegio, tutores, alu_tut  } = respuestaServidor;
    dataAluTut = [...alu_tut];
    dataTutores = [...tutores];
    dataAlumnos = { alumnos, colegio };
    cargarTutores('tutor1', dataTutores);
    cargarTutores('tutor2', dataTutores);
    cargarTutores('tutor3', dataTutores);
    cargarDatos(dataAlumnos);
    document.querySelector('.container-general').style.display = 'block';
    document.querySelector('.container-loader').style.display = 'none';
    $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
    $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
    $('#select2-tutor3-container').text($("#tutor3 option:selected").text());

    /* buttons */
    btnInicio.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';
        inputDisabled();
        const { alumnos, colegio } = dataAlumnos;
        resetearFormulario();
        cargarDatosColegio(colegio);
        cargarDatosAlumno(alumnos[0]);
        $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
        $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
        $('#select2-tutor3-container').text($("#tutor3 option:selected").text());    
    });
    btnAnterior.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';

        const { alumnos, colegio } = dataAlumnos;
        resetearFormulario();
        cargarDatosColegio(colegio);
        inputDisabled();
        const indexArray = getPositionArray(alumnos, 'codigoAlumnoInput');
        if (indexArray > 0) {
            cargarDatosAlumno(alumnos[indexArray - 1]);
        } else {
            cargarDatosAlumno(alumnos[0]);
        }
        $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
        $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
        $('#select2-tutor3-container').text($("#tutor3 option:selected").text());
    
    });
    btnSiguiente.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';

        const { alumnos, colegio } = dataAlumnos;
        resetearFormulario();
        cargarDatosColegio(colegio);
        inputDisabled();
        const indexArray = getPositionArray(alumnos, 'codigoAlumnoInput');
        const limiteIndexArray = alumnos.length - 1;
        if (indexArray < limiteIndexArray) {
            cargarDatosAlumno(alumnos[indexArray + 1]);
        } else {
            cargarDatosAlumno(alumnos[alumnos.length - 1]);
        }
        $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
        $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
        $('#select2-tutor3-container').text($("#tutor3 option:selected").text());
    
    });
    btnFin.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';

        const { alumnos, colegio } = dataAlumnos;
        resetearFormulario();
        inputDisabled();
        cargarDatosColegio(colegio);
        cargarDatosAlumno(alumnos[alumnos.length - 1]);
        $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
        $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
        $('#select2-tutor3-container').text($("#tutor3 option:selected").text());
    
    });

    btnNuevo.addEventListener('click', () => {
        form.reset();
        resetearFormulario();
        btnAgregar.style.display = 'block';
        btnCancelar.style.display = 'block';
        btnNuevo.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnModificar.style.display = 'none';
        document.querySelector('#fechaRegistro').value = obtenerFechaActual();
        document.querySelector('#boletin').checked = true;
        document.querySelector('#plataforma').checked = true;
        document.querySelector('#examen').checked = true;
        document.querySelector('#nroCuotas').value = '10';
        const { colegio } = dataAlumnos;
        cargarDatosColegio(colegio);
        enableDisabled();
        $('#select2-tutor1-container').text("-- Seleccione un tutor --");
        $('#select2-tutor2-container').text("-- Seleccione un tutor --");
        $('#select2-tutor3-container').text("-- Seleccione un tutor --");
    });
    btnModificar.addEventListener('click', () => {
        const codigo = document.querySelector('#codigo').value;
        if (codigo !== "") {
            enableDisabled();
            btnModificar.style.display = 'none';
            btnCancelar.style.display = 'block';
            btnActualizar.style.display = 'block';
            btnNuevo.style.display = 'none';
        } else {
            btnCancelar.style.display = 'none';
            btnActualizar.style.display = 'none';
            btnAgregar.style.display = 'none';
            btnModificar.style.display = 'block';
            btnNuevo.style.display = 'block';

            const { alumnos } = dataAlumnos;
            cargarDatosAlumno(alumnos[codigoAlumnoInput.value - 1]);
            inputDisabled();
            alert('Seleccione un alumno');
        }
    });

    btnCancelar.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';
        const { alumnos } = dataAlumnos;
        resetearFormulario();
        inputDisabled();
        const indexArray = getPositionArray(alumnos, 'codigoAlumnoInput');
        if (indexArray > 0) {
            cargarDatosAlumno(alumnos[indexArray]);
        } else {
            cargarDatosAlumno(alumnos[0]);
        }
        $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
        $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
        $('#select2-tutor3-container').text($("#tutor3 option:selected").text());
    });

    btnConsultar.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';

        form.reset();
        resetearFormulario();
        inputDisabled();
        const { colegio } = dataAlumnos;
        cargarDatosColegio(colegio);
        $('#selectBusquedaAlumno').css('display', 'grid');
        $('#busquedaAlumno').val("");
        $('#tutor1').val("");
        $('#tutor2').val("");
        $('#tutor3').val("");
        $('#select2-tutor1-container').text('-- Seleccionar tutor --');
        $('#select2-tutor2-container').text('-- Seleccionar tutor --');
        $('#select2-tutor3-container').text('-- Seleccionar tutor --');
        $('#select2-busquedaAlumno-container').text('-- Seleccionar alumno --');
        document.querySelector('#busquedaAlumno').disabled = false;
    });

    btnImprimir.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';

        const idAlumno = document.querySelector('#codigo').value;
        if (idAlumno !== "") {
            rellenarDatosImprimir();
            imprimir();
        } else {
            alert('Seleccione un alumno');
        }
    });
    btnEliminar.addEventListener('click', () => {
        btnCancelar.style.display = 'none';
        btnActualizar.style.display = 'none';
        btnAgregar.style.display = 'none';
        btnModificar.style.display = 'block';
        btnNuevo.style.display = 'block';

        const url = "get_info_alumno.php?peticion=delete";
        const idAlumno = document.querySelector('#codigo').value;
        if (idAlumno !== "") {
            Swal.fire({
                title: '¿Estas seguro?',
                text: "De realizar esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelmButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    const respuestaServidor = peticion(url, {
                        "codigo": idAlumno
                    });
                    respuestaServidor.status == "ok"
                        ? Swal.fire('Éxito', 'Alumno eliminado correctamente', 'success')
                        : Swal.fire('Error', 'No se pudo eliminar correctamente', 'error');
                }
            });
        } else {
            alert('Seleccione un alumno');
        }
    });

    /* Select para consultar por nombre */
    rellenarSelectBusqueda();
    $('#busquedaAlumno').change(() => {
        let codigoAlumno = document.querySelector('#busquedaAlumno');
        if (codigoAlumno.value !== "") {
            const { alumnos } = dataAlumnos;
            const indexArray = getPositionArray(alumnos, 'busquedaAlumno');
            if (indexArray === false) {
                alert('Alumno no encontrado');
                return;
            }
            resetearFormulario();
            cargarDatosAlumno(alumnos[indexArray]);
            $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
            $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
            $('#select2-tutor3-container').text($("#tutor3 option:selected").text());
            $('#selectBusquedaAlumno').css('display', 'none');
        }
    });
    /* sugerir las cuotas del alumno */
    $('#curso').change(() => {
        if ($('#curso').val() !== "") {
            const url = "get_info_alumno.php?peticion=getCuota";
            const dataCuota = peticion(url, {
                "idNivel": getNivelCurso($('#curso').val())
            });
            const { cuota, aporte } = dataCuota;
            document.querySelector('#cuotaMensual').value = cuota;
            document.querySelector('#cuotaMensual').disabled = false;
            document.querySelector('#totalGastosOperativos').value = aporte;
            // document.querySelector('#totalGastosOperativos').disabled = true;
        }
    });
    document.querySelector("#codigoTutor1").value = $('#tutor1').val();
    document.querySelector("#codigoTutor2").value = $('#tutor2').val();
    document.querySelector("#codigoTutor3").value = $('#tutor3').val();

    $('#tutor1').change(() => {
        document.querySelector("#tutor1").setAttribute('value', $('#tutor1').val());
        document.querySelector("#codigoTutor1").value = $('#tutor1').val();
        $('#select2-tutor1-container').text($("#tutor1 option:selected").text());
    });
    
    $('#tutor2').change(() => {
        document.querySelector("#tutor2").setAttribute('value', $('#tutor2').val());
        document.querySelector("#codigoTutor2").value = $('#tutor2').val();
        $('#select2-tutor2-container').text($("#tutor2 option:selected").text());
    });
    
    $('#tutor3').change(() => {
        document.querySelector("#tutor3").setAttribute('value', $('#tutor3').val());
        document.querySelector("#codigoTutor3").value = $('#tutor3').val();
        $('#select2-tutor3-container').text($("#tutor3 option:selected").text());
    });

});


const cargarTutores = (id, data) => {
    $(`#${id}`).children().remove();
    $(`#${id}`).append(`
        <option value="" selected>-- Seleccione un tutor --</option>
    `);
    data.forEach( tutor => {
        const { cod_tut, paterno, materno, nombres } = tutor;
        const nombreCompleto = `${paterno} ${materno} ${nombres}`;
        $(`#${id}`).append(`
            <option value="${cod_tut}">${cod_tut}: ${nombreCompleto} ${tutor.cel}</option>
        `); 
    });
}

const cargarDatos = (data) => {
    const { alumnos, colegio } = data;
    cargarDatosColegio(colegio);
    cargarDatosAlumno(alumnos[0]);
}

const cargarDatosAlumno = (data) => {
    codigoAlumnoInput.value = data.codigo;
    /* Recorrer el formulario y comparando los name los input con la data [propiedades] */
    const elementsForm = form.elements;
    [...elementsForm].forEach(element => {
        const nameInputForm = element.name;
        if (data[nameInputForm]) {
            element.value = data[nameInputForm];
            element.setAttribute('value', data[nameInputForm]);
            if (element.name == "turno") {
                switch (data[nameInputForm]) {
                    case "Mañana":
                        element.value = "1";
                        break;
                    case "Tarde":
                        element.value = "2";
                        break;
                    case "Noche":
                        element.value = "3";
                        break;
                    default:
                        element.value = "";
                        break;
                }
            }
            /* para añadir el atributo selected al option seleccionando de acuerdo al valor del select */
            if (element.type === 'select-one') {
                const select = element.value;
                const arrayOptionsSelect = [...element.children];
                arrayOptionsSelect.forEach(option => {
                    if (select === option.value) {
                        option.setAttribute('selected', true);
                    } else if (select == "") {
                        option.setAttribute('value', "");
                        option.setAttribute('selected', true);
                    } else {
                        option.removeAttribute('selected');
                    }
                });
            }
            /* para añadir el atributo checked al checkbox */
            if (element.type === 'checkbox') {
                element.value == 1 ? element.checked = true : element.checked = false;
            }
        }
    });
    const tutores = getTutoresAlumno();
    if (tutores.length > 0) {
        let count = 1;
        tutores.map( tutor => { 
            $(`#tutor${count}`).val(tutor.cod_tut);
            count++;
        });
    }
}

const getTutoresAlumno = () => {
    const codigoAlumno = document.querySelector('#codigo').value;
    const tutoresAlumno =  dataAluTut.filter( alumnoTutItem => alumnoTutItem.codigo == codigoAlumno );
    return tutoresAlumno;
}

const cargarDatosColegio = (data) => {
    const { cursos, totalActivos, totalRegistrados } = data;
    document.querySelector('#totalRegistrados').value = totalRegistrados;
    document.querySelector('#totalActivos').value = totalActivos;
    cargarTablaCursos(cursos);
}

const cargarTablaCursos = (data) => {
    $('#dataCursos').children().remove();
    data.forEach(curso => {
        const { nombre, paralelo, totalAlumnos } = curso;
        $('#dataCursos').append(
            `<tr>
                <td class="border px-2 py-2">${nombre}</td>
                <td class="border px-2 py-2">${paralelo}</td>
                <td class="border px-2 py-2">${totalAlumnos}</td>
            </tr>`
        );
    });
}

/* Funciones helpers */
const getPositionArray = (array, elementHTML = "codigo") => {
    let position = false;
    const idAlumno = document.querySelector(`#${elementHTML}`).value;
    if (!idAlumno) {
        return position;
    }
    array.forEach((alumno, key) => {
        const { codigo } = alumno;
        if (idAlumno == codigo) {
            position = key;
        }
    });
    return position;
}

const inputDisabled = () => {
    $('#selectBusquedaAlumno').css('display', 'none');
    const elementsForm = form.elements;
    [...elementsForm].forEach((element) => {
        if (element.type !== "button") {
            element.disabled = true;
        }
    });
}
const enableDisabled = () => {
    const elementsForm = form.elements;
    [...elementsForm].forEach((element) => {
        if (element.type !== "button") {
            element.disabled = false;
        }
    });
    document.querySelector('#codigo').disabled = true;
    /* document.querySelector('#tutor1').disabled = true;
    document.querySelector('#tutor2').disabled = true;
    document.querySelector('#tutor3').disabled = true; */
    document.querySelector('#usuarioWeb').disabled = true;
    document.querySelector('#totalActivos').disabled = true;
    document.querySelector('#totalRegistrados').disabled = true;
    document.querySelector('#fechaRegistro').disabled = true;
    // document.querySelector('#cuotaMensual').disabled = true;
    // document.querySelector('#tipoAlumno').disabled = true;
    // document.querySelector('#totalGastosOperativos').disabled = true;
    // document.querySelector('#nroCuotas').disabled = true;
    // document.querySelector('#codigoGlobalAlumno').disabled = true;
}


const rellenarDatosImprimir = () => {
    $('.print__grid-1').children().remove();
    $('.print__grid-2').children().remove();
    const elementDatosPersonales = document.querySelector('#datoPersonalAlumno');
    const cloneElementDatosPersonales = elementDatosPersonales.cloneNode(true);
    const elementPlataformaDeporte = document.querySelector('#plataformaDeportes');
    const clonePlataformaDeporte = elementPlataformaDeporte.cloneNode(true);
    const elementCuotasAlumnos = document.querySelector('#cuotasAlumnos');
    const cloneCuotasAlumnos = elementCuotasAlumnos.cloneNode(true);
    document.querySelector('.print__grid-1').appendChild(cloneElementDatosPersonales);
    document.querySelector('.print__grid-2').appendChild(clonePlataformaDeporte);
    document.querySelector('.print__grid-2').appendChild(cloneCuotasAlumnos);
}

const resetearFormulario = () => {
    const elementsForm = form.elements;
    [...elementsForm].forEach((element) => {
        if (element.type === 'text' || element.type === 'textarea' ||
            element.type === 'date') {
            element.setAttribute('value', "");
            element.value = '';

        } else if (element.type === 'select-one') {
            element.value = "";
            element.setAttribute('value', "");
            element.removeAttribute('selected');
            element.removeAttribute('data-select2-id');
            
        } else if (element.type === 'checkbox') {
            element.checked = false;
            element.removeAttribute('checked');
        }
    });
}

const rellenarSelectBusqueda = () => {
    $('#busquedaAlumno').children().remove();
    const { alumnos } = dataAlumnos;
    $('#busquedaAlumno').append('<option value="" selected>-- Seleccione un alumno --</option>');
    alumnos.forEach(alumno => {
        const { codigo, paterno, materno, nombres } = alumno;
        $('#busquedaAlumno').append(`
            <option value="${codigo}">
                ${paterno} ${materno} ${nombres}
            </option>
        `);
    })
}

const peticion = (url, data) => {
    let respuestaServidor;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    const idAlumno = document.querySelector('#codigo').value;
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append('id', idAlumno);
    }
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            respuestaServidor = JSON.parse(this.responseText);
        }
    };
    xhr.open('POST', url, false);
    xhr.send(formData);
    return respuestaServidor;
}

const actualizarDataAlumno = (data) => {
    console.log(data);
    const { alumnos, colegio } = dataAlumnos;
    const { alumno: dataActualizada } = data;
    const indexAlumno = alumnos.findIndex((el) => el.codigo === dataActualizada.codigo);
    console.log(dataActualizada);
    alumnos[indexAlumno] = dataActualizada;
    resetearFormulario();
    cargarDatosAlumno(alumnos[indexAlumno]);
    cargarDatosColegio(colegio);
    inputDisabled();
}

/* Asignaciones de Becas */
const asignarBeca = idBeca => {
    const url = "http://192.168.100.65/aizama/aizama/get_info_alumno.php?peticion=updateBeca";
    const codigoAlumno = document.querySelector('#codigo').value;
    if (codigoAlumno !== "" && idBeca !== "") {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Se le asignara una beca",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) {
                const data = {
                    'codAlu': document.querySelector('#codigo').value,
                    'idBeca': idBeca
                };
                const resultadoPeticion = peticion(url, data);
                actualizarDataAlumno(resultadoPeticion);
                const { message, icon, title } = mensajeOpciones[resultadoPeticion.status];
                Swal.fire(title, message, icon);
                btnCancelar.style.display = 'none';
                btnActualizar.style.display = 'none';
                btnAgregar.style.display = 'none';
                btnModificar.style.display = 'block';
                btnNuevo.style.display = 'block';
            }
        });

    } else {
        alert('Seleccione un alumno');
    }

}

const getNivelCurso = (idCurso) => {
    $nivel = 0;
    if (idCurso > 0 && idCurso < 5) {
        $nivel = 1;
    } else if (idCurso > 4 && idCurso < 11) {
        $nivel = 2;
    } else if (idCurso > 10 && idCurso < 17) {
        $nivel = 3;
    }
    return $nivel;
}

const cargarDataKardexAlumno = (data, pagado, saldo, dataInfoAlumno) => {
    $('#kardex').children().remove();
    data.forEach(cuota => {
        const { codigo, detalle, recnum, fecha, haber, acreedor, estado } = cuota;
        $('#kardex').append(`
            <tr>
                <td class="border px-2 py-2">${codigo}</td>
                <td class="border px-2 py-2">${detalle}</td>
                <td class="border px-2 py-2">${recnum}</td>
                <td class="border px-2 py-2">${fecha}</td>
                <td class="border px-2 py-2">${haber}</td>
                <td class="border px-2 py-2">0.00</td>
                <td class="border px-2 py-2">${acreedor}</td>
                <td class="border px-2 py-2">${estado}</td>
            </tr>
        `);
    });

    $('#kardex_nombre').attr("value", dataInfoAlumno.nombre);
    $('#kardex_curso').attr("value", dataInfoAlumno.curso);
    $('#kardex_beca').attr("value", dataInfoAlumno.tipoAlumno);
    $('#kardex_gastoOperativo').attr("value", dataInfoAlumno.totalPagar);
    $('#kardex_pagado').attr("value", pagado);
    $('#kardex_saldo').attr("value", saldo);
    $('#kardex_usuarioWeb').attr("value", dataInfoAlumno.usuarioWeb);
    $('#kardex_turno').attr("value", dataInfoAlumno.turno);
}


function obtenerFechaActual() {
    let fechaReturn = "";
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (day < 10 && month < 10) {
        fechaReturn = `${year}-0${month}-0${day}`;
    } else if (day < 10) {
        fechaReturn = `${year}-${month}-0${day}`;
    } else if (month < 10) {
        fechaReturn = `${year}-0${month}-${day}`;
    } else {
        fechaReturn = `${year}-${month}-${day}`;
    }
    return fechaReturn;
}