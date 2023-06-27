/* Variables */
let materias = [];
let lista_alumno = [];
let evaluaciones = [];
let id_seleccionado;
let codmat_sel;
let codcur_sel;
let codpar_sel;
let nombreCurso;
const get_datos_alumno=()=>{
    $('#encabezado-principal').css('display','none');
    $.post(
        "controlador/alumno_controlador.php?usr=alu&op=get_datos_alu",
        datos=>{
            let status=datos.status;
            if (status=="ok"){
                lista_alumno= datos.lista_alumno;
                let codcur = lista_alumno.codcur;
                let codpar = lista_alumno.codpar;
                obtenerMaterias(codcur,codpar);
                obtener_cursos(codcur,codpar);
            }
        },
        "json"
        );
}
const obtener_cursos = (codcur,codpar)=>{
    codcur_sel=codcur;
    codpar_sel=codpar;
    $.post(
            "controlador/alumno_controlador.php?usr=alu&op=getNombreCurso",
            {codcur:codcur,
            codpar:codpar},
            datos=>{
                let status=datos.status;
                if (status=="ok"){
                    nombreCurso = datos.curso;
                }
            },
            "json"
            );
}
const obtenerMaterias=(codcur, codpar)=>{
    $('.materias').css('display','block');
    $('.contenedor-no-eval').css('display','none');
    $('.contenedor-table').css("display","none");
    $('.evaluaciones').css('display','none');
    $.post(
        "controlador/alumno_controlador.php?usr=alu&op=obtener_materias",
        {codcur:codcur,
         codpar:codpar},
        datos=>{
            let status=datos.status;
            if (status=="ok"){
                materias= datos.Materias;
            }
            cargarMaterias();
        },
        "json"
        );
}

function cargarMaterias() {
    $('.lista-materias').children().remove();
    $('.descripcion-eval').css('display','none');
    $('.contenedor-no-eval').css('display','none');
    for (var i = 0; i< materias.length; i++) {
        
        let codcur = materias[i]['cod_cur']; 
        let codpar = materias[i]['cod_par']; 
        let codmat = materias[i]['cod_mat'];
        let cant = materias[i]['cant_eva'];
        let nombreMateria = materias[i]['descri'];
        let imagenMateria = materias[i]['imagen'];
        codmat_sel=codmat;
        codcur_sel=codcur;
        codpar_sel=codpar;
        
           $('.lista-materias').append(
            `<li>
                <button class="info-materia" onclick="obtenerEvaluaciones(${codcur}, ${codpar}, '${codmat}')">
                    <div class="materia">
                        <img src="${imagenMateria}">
                        <p>${nombreMateria}</p>
                    </div>
                    <span class="badge">${cant}</span>
                </button>
            </li>`
          );
    }
}
const obtenerEvaluaciones=( codcur, codpar,codmat)=>{
    $('#h1-principal').css("display","block");
    codmat_sel=codmat;
    codcur_sel=codcur;
    codpar_sel=codpar;
    $.post(
    "controlador/evaluacion_mixta_controlador.php?usr=alu&op=obtener_materias_Evaluaciones",
    {codmat:codmat,
     codcur:codcur,
     codpar:codpar},
            datos=>{
                let status=datos.status;
                if (status=="ok"){
                    evaluaciones= datos.Evaluaciones;
                }
            mostrarTablaExamenes();
            $('#nombremat').text(getNombreMateria(codmat));
            },
            "json"
    ); 
}

const getNombreMateria = codmat=>{
	for (var i = 0; i < materias.length; i++) {
		if(materias[i].cod_mat==codmat)return materias[i].descri;
	}
	return "Sin Nombre";
}
const mostrarTablaExamenes=()=>{
    $('#atras-contenedor').css('display','block'); 
    $('.contenedor-table').css("display","block");
    $('.descripcion-eval').css('display','none');
    $('.materias').css('display','none');
    $('.evaluaciones').css('display','block');
    $('#campos').children().remove();
    $('.contenedor-tabla-button').css("display","block");
    $('.contenedor-lista-eval').addClass('active');
    if (evaluaciones.length>0) {
        $('.table').css('display','block');
        $('.contenedor-no-eval').css('display','none');
        
        for (let i = 0; i < evaluaciones.length; i++) {
        let id = evaluaciones[i]['id'];
        let codigoExamen =evaluaciones[i]['id'].toString();
        let notafinal = evaluaciones[i]['notafinal'];
        let detalle = evaluaciones[i]['detalle'];
        let descripcion = evaluaciones[i]['descripcion'];
        let disponible = evaluaciones[i]['disponible'];
        console.log("disponible: ", disponible);
        if (notafinal===null){
            notafinal="No Calificado";
        }
            switch (disponible) {
                case 0:
                    $('#campos').append(
                        `<tr>
                            <td data-label="Nro" >${i+1}</td>
                            <td data-label="Descripcion" >${descripcion}</td>
                            <td data-label="Detalle" >${detalle}</td>
                            <td data-label="Ver"> 
                                No disponible
                            </td>
                            <td data-label="Nota">Sin nota</td>
                            <td data-label="Ver">&nbsp;</td>
                        </tr>`
                        );
                break;
                case 1:
                    $('#campos').append(
                    `<tr>
                        <td data-label="Nro" >${i+1}</td>
                        <td data-label="Descripcion" >${descripcion}</td>
                        <td data-label="Detalle">${detalle}</td>
                        
                        <td data-label="Ver"> 
                            <button class="link" onclick="detalle_evaluacion(${id})">
                            <img src="images/icon-examen.svg">
                            </button>
                        </td>
                        <td data-label="Nota">&nbsp;</td>
                        <td data-label="Ver">&nbsp;</td>
                    </tr>`
                    );
                    break;
                case 2:
                    $('#campos').append(
                        `<tr>
                            <td data-label="Nro" >${i+1}</td>
                            <td data-label="Descripcion" >${descripcion}</td>
                            <td data-label="Detalle" >${detalle}</td>
                            
                            <td data-label="Ver"> 
                                Realizado
                            </td>
                            <td data-label="Nota">${notafinal}</td>
                            <td data-label="Ver"><a href="verEvaluacionMixta.php?i=${codigoExamen}" style="text-decoration:none;color:#043c5c">Revisar</a></td>
                        </tr>`
                    );
                    break;

                default:
                    break;
            }
        }
    }else{
        $('.table').css('display','none');
        $('.evaluaciones').css('display','none');
        $('.contenedor-no-eval').css('display','block');
        $('#atras-contenedor').css('display','none'); 
    }
    $('.principal').css('display','none');
}

function volverAtras() {
    $('.contenedor-no-eval').css('display','none');
    $('.contenedor-table').css("display","none");
    $('.elija').text("elija una materia");
    $('.materias').css('display','block');
    $('.evaluaciones').css('display','none');
}
const detalle_evaluacion = (id) =>{
    $('#nombrecurso').text(nombreCurso);
    //$('#nombremateria').text(getNombreMateria(codmat_sel));
    $('.principal').css("display","block");
    $('.contenedor-table').css("display","none");
    $('#h1-principal').css("display","none");
    id_seleccionado=id;
    $('.evaluaciones').css('display','none');
    $('.descripcion-eval').css('display','block');
    for (let i = 0; i < evaluaciones.length; i++) {
        let em_id = evaluaciones[i].id;
        if (id==em_id) {
            let nroEval= evaluaciones[i].nro;
            let fechaini = evaluaciones[i].inicio;      
            let fechafin = evaluaciones[i].fin;
            let fechai= fechaini.substring(0,10);
            let horai = fechaini.substring(11,16);
            let fechaf= fechafin.substring(0,10);
            let horaf = fechafin.substring(11,16);
            $('#fechaini').val(fechai);
            $('#horaini').val(horai);
            $('#fechafin').val(fechaf);
            $('#horafin').val(horaf);
            $('#badge-ne').text(nroEval);
            $('#descrip').val(evaluaciones[i].descripcion);
            $('#Nota').val(evaluaciones[i].nota);
            $('#duracion').val(evaluaciones[i].tiempo);
            $('#nropregunta').val(evaluaciones[i].preguntas); 
        }
    }
}
const empezar=(codigoExamen)=>{
    $('#h1-principal').css('display','none');
    $('.principal').css('display','block');
    $.post(
        "controlador/em_alumno_controlador.php?usr=alu&op=get_eval_proceso",
        (datos, estado,xhr)=>{
            if(datos=="ok"){
                location.href = 'formato_evaluacion_mixta_alu.php';
                return;
            }
            if (datos == codigoExamen) {
                Swal.queue([{
                    title: 'Advertencia',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                    showCancelButton: true,
                    text: 'Tienes una evaluación ya iniciada... \n¿Deseas continuar con la evaluación?',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        location.href = 'formato_evaluacion_mixta_alu.php';
                    }
                }]);
            }
            if (datos == "sinproceso") {
                Swal.queue([{
                    title: 'Advertencia',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                    showCancelButton: true,
                    text: 'Una vez ingreses debes terminar la evaluación...',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        $.post(
                            "controlador/evaluacion_mixta_controlador.php?usr=alu&op=init_eval",
                            { id: codigoExamen },
                            //"evaluacion_escrita_json.php?op=init_eval&usr=alu", { id: codigoExamen },
                            (datos, estado, xhr) => {
                                if (datos == "ok") {
                                    location.href = 'formato_evaluacion_mixta_alu.php';
                                    return;
                                }
                                if (datos == "evalFinalized") {
                                    Swal.fire({
                                        title: 'El tiempo para realizar esta evaluación ha terminado...!!!',
                                        confirmButtonText: `OK`,
                                    }).then((result) => {
                                        /* Read more about isConfirmed, isDenied below */
                                        if (result.isConfirmed) {
                                            location.href = "evaluaciones_mixta_alu.php";
                                        }
                                    })
                                }
                                if (datos == "expired") {
                                    Swal.fire({
                                        title: 'La evaluación ya no está disponible...!!!',
                                        confirmButtonText: `OK`,
                                    }).then((result) => {
                                        /* Read more about isConfirmed, isDenied below */
                                        if (result.isConfirmed) {
                                            location.href = "evaluaciones_mixta_alu.php";
                                        }
                                    })
                                }

                            }
                        );
                    }
                }]);
            }  

        },
        "text"
    );
    
}

$(document).ready(function(e) {
    $('.contenedor-no-eval').css('display','none');
    get_datos_alumno();
    $('.Cancelar').click(()=>obtenerEvaluaciones( codcur_sel, codpar_sel,codmat_sel));
    $('.Guardar').click(()=>empezar(id_seleccionado));
    $('#atras-contenedor').click(()=>obtenerMaterias(codcur_sel, codpar_sel));
});