let cursos=[];
let materias=[];
let lista=[];
let lista_evaluaciones=[];
let lista_alumnos=[];
let curso_seleccionado;
let paralelo_seleccionado;
let materia_seleccionada;
let tipo_seleccionado;
let codeva_seleccionado;
let nro_seleccionado;
let op_correcta;
let op_vf;
let id_vf_seleccionado;
let tipoC1_seleccionado;
let tipoC2_seleccionado;
let idaem_seleccionado;
let vf;
let rel = 0;
let num = 0;
let visible_global;
let preg_selected;
let modificando = false;
let control_indicadores = [];
let espera = 0;
function _checkoption (){//opcion escogida por el estudiante
    let opciones = document.querySelectorAll('.selector');
    let op = 1;
    op_correcta=0;
    opciones.forEach(opcion=>{
        if(opcion.checked)op_correcta=op;
        op++;
    });
}
function _resultado (){//obtiene opcion escogina por el estudiante vf
    let opciones = document.querySelectorAll('.resultado');
    let op = 1;
    op_vf=0;
    opciones.forEach(opcion=>{
        if(opcion.checked)op_vf=op;
        op++;
    });
}
const obtener_cursos = ()=>{
 
    $('#botones-M').css('display','none');
    $('#botones-L').css('display','none');
    $('#botones-E').css('display','none');
    $.post(
            "controlador/profesor_controlador.php?usr=doc&op=get_cursos",
            datos=>{
                cursos = datos.cursos;
                materias = datos.materias;
                cargarCursos();
            },
            "json"
            );
}
function obtener_nro_materia(codcur, codpar){
    $('.lista-Alumnos').css('display','none');
    let n=0;
    materias.forEach((fila) => {
        if (fila.codcur==codcur & fila.codpar==codpar)
            n++;
    });
    return n;
}
function cargarCursos() { 
    $('.form-calificar-evaluacion').css('display','none');
    $('.lista-Materias').css('display','none');
    $('.listaEvaluaciones').css('display','none');
    $('.form-preguntas').css('display','none');
    $('.form-EvaluacionMixta').css('display','none');
    $('#form-lista-preguntas').css('display','none');   
    $('.form-seleccion').css('display','none');
    $('.lista-curso').children().remove();
    $('.lista-curso').css('display', "block");
    for (var i = 0; i < cursos.length; i++) {
        let codcur=cursos[i]['codcur'];
        let codpar=cursos[i]['codpar'];
        let imagenCurso = cursos[i]['imagen'];
        let nombreCurso = cursos[i]['nombre'];
        let nroMateria = obtener_nro_materia(codcur, codpar);
      $('.lista-curso').append(
        `<li>
            <button class="btn-Curso" onclick="obtener_materias(${codcur},${codpar})">
                <img src="img/${imagenCurso}">
                <span class="nombreCurso">${nombreCurso}</span>
                <span class="badge">${nroMateria}</span>
            </button>
        </li>`  
      );
    }
}
const obtener_materias  = (codcur,codpar)=>{
    //$('#atras-curso').css('display','block');
    $('.lista-Alumnos').css('display','none');
    $('#botones-M').css('display','inline');
    $('#botones-L').css('display','none');
    $('#botones-E').css('display','none');
    $('.form-seleccion').css('display', 'none');
    $('.listaEvaluaciones').css('display','none');
    $('#form-lista-preguntas').css('display','none');
    $('.form-preguntas').css('display','none');
    $('.form-calificar-evaluacion').css('display','none');
    curso_seleccionado=codcur;
    paralelo_seleccionado=codpar;
    $.post(
             "controlador/materias_controlador.php?usr=doc&op=getMateriasProf",
             {codcur:codcur,
             codpar:codpar},
             datos=>{
                let status=datos.status;
                if (status=="ok"){
                    lista= datos.lista;
                }
                cargarMaterias();
            },
            "json"
            );
}
function cargarMaterias() {
    $('.lista-curso').css('display','none');
    $('.form-EvaluacionMixta').css('display','none');
    $('.lista-Materias').children().remove();
    $('.lista-Materias').css('display','block');
    for (var i = 0; i < lista.length; i++) {
        let codmat=lista[i]['codmat'];
        let imagenMateria = lista[i]['imagen'];
        let cadena= imagenMateria.substring(7);
        let nombreMateria = lista[i]['nombre'];
        let nroEval = lista[i]['evaluaciones'];
      $('.lista-Materias').append(
        `<li>
            <button
                class="btn-materia" 
                onclick="obtener_lista_Eval(${curso_seleccionado},${paralelo_seleccionado},'${codmat}')"
                >
                <img src="svg/svg_materia/${cadena}">
                <span class="nombreMateria">${nombreMateria}</span>
                <span class="badge">${nroEval}</span>
            </button>   
        </li>`
      );
    } 
}
const obtener_lista_Eval  = (codcur,codpar,codmat)=>{
    $('.form-calificar-evaluacion').css('display','none');
    $('.preg-resp').css('display','none');
    $('.lista-Alumnos').css('display','none');
    $('#botones-L').css('display','inline');
    $('#botones-E').css('display','none');
    $('.form-seleccion').css('display','none');
    $("#form-lista-preguntas").css('display','none');
    $('.form-EvaluacionMixta').css('display','none');
      materia_seleccionada=codmat;
     $.post(
                "controlador/evaluacion_mixta_controlador.php?usr=doc&op=getlista_evaluaciones_prof_cur_mat",
                {codcur:codcur,
                 codpar:codpar,
                 codmat:codmat},
              datos=>{
                 let status=datos.status;
                 if (status=="ok"){
                     lista= datos.lista;
                 }
                 cargarListaEval();
             },
             "json"
            );
}
function cargarListaEval() {
    $('.lista-Materias').css('display','none');
    $('.listaEvaluaciones').css('display','block');
    $('.lista-Evaluaciones').children().remove();
    control_indicadores = [];
    for (var i = 0; i < lista.length; i++) {
        let nroEval = lista[i]['nro'];
        let nombreEvaluacion = lista[i]['descripcion'];
        let codeva=lista[i]['id'];
        let indicador = lista[i]['indicador'];;
        control_indicadores.push([codeva,indicador]);
      $('.lista-Evaluaciones').append(
        `<li class="btn-evaluacion">
            <span class="badge">${nroEval}</span>
            <div class="btn-textarea">
                <div>
                    <button class="btn-evaluacion2"
                    onclick="obtenerFormulario(${codeva})">
                    <span class="nombreEvaluacion">${nombreEvaluacion} </span>
                    </button>
                </div>
                <div>  
                    <textarea class="indicador" style="padding:5px; max-height:50px;" placeholder="Indicador" >${indicador}</textarea>
                </div>
            </div>
            <div><img src="svg/chevron-right.svg"></div>  
        </li>`  
      );
    }
    document.querySelectorAll('.indicador').forEach( item => {
        item.addEventListener("keyup", ()=>{
            if(espera > 0){
                espera = 3;
            }else{
                espera = 3;
                bucle();
            }
        });
    });
    $('#agregar-eval').click(()=>nueva_Evaluacion());
}
const guardar_Indicador = () => {
    let inputs_indicadores = document.querySelectorAll('.indicador');
    for (var i = 0; i < inputs_indicadores.length; i++) {
        let tex_ind = inputs_indicadores[i].value.trim();
        if( tex_ind != control_indicadores[i][1]){
            control_indicadores[i][1] = tex_ind;
            let codpract = control_indicadores[i][0];
            $.post(
                    'controlador/indicador_controlador.php?op=save_indicador',
                    {id:codpract,texto:tex_ind,tipe:5},
                    response => {
                        if(response.status == "eSession"){
                            alert("La sesión ha expirado...");
                            location.href = "docentes.php";
                        }
                        if(response.status == "ok"){
                            mostrar_mensaje("Guardado exitosamente","success");
                            //pedirPracticos();
                        }
                    },
                    "json"
                  );
            console.log(control_indicadores);
        }
    }
}
const mostrar_mensaje = (mensaje,estilo) => {
    if(estilo == "success"){
        $('#notificacion').removeClass('no-visible');
        $('#notificacion').addClass("notifications_success");
        $('#notificacion').addClass('visible');
        setTimeout(()=>{
            $('#notificacion').removeClass('visible');
            //$('#notificacion').removeClass("notifications_success");
            $('#notificacion').addClass('no-visible');
        },3000);
    }
}
const task = i => {
    return new Promise((res,rej)=>{
        setTimeout(()=>{
        res(i);
        },1000)
    });
    
}
async function bucle(){
    while(espera > 0){
        let time = await task(espera);
        console.log(time);
        espera--;
    }
    guardar_Indicador();
}
const limpiar_form = ()=>{
    $('#descrip').val("");
    $('.fecha').val("");
    $('.hora').val("");
    $('#Nota').val("");
    $('#duracion').val("");
    $('#nropregunta').val("");
    $('#cant-preguntas').text("");
    $('#badge-ne').text("");
    document.getElementById('descrip').readOnly = false; 
    document.getElementById('fechaini').readOnly = false;
    document.getElementById('horaini').readOnly = false;
    document.getElementById('fechafin').readOnly = false;
    document.getElementById('horafin').readOnly = false;
    let inputs = document.querySelectorAll('.input');
    inputs.forEach(input=>{
        input.readOnly = false;
    });
}
const nueva_Evaluacion = ()=>{
    $('#visiblecheck').css('display','none');
    $('.contenido-formulario').css('display','block')
    $('#eliminar-form').css('display','none');
    $('#guardar-form').css('display','block');
    $('#actualizar-form').css('display','none');
    limpiar_form();
    $('#botones-E').css('display','inline');
    $('.listaEvaluaciones').css('display','none');
    $('.form-EvaluacionMixta').css('display','block');
    $('#header-principal').css('display','block');
    $('.preguntas-revisar').css('display','none');
    $('#nombrecurso').text(getNombreCurso(curso_seleccionado,paralelo_seleccionado));
    $('#nombremat').text(getNombreMateria(materia_seleccionada));
}
const getNombreCurso = (codcur,codpar)=>{
    for (var i = 0; i < cursos.length; i++) {
        if(cursos[i].codcur==codcur&cursos[i].codpar==codpar){
            return cursos[i].nombre;
        }
    }
    return "Sin Nombre";
}
const getNombreMateria = codmat=>{
    for (var i = 0; i < materias.length; i++) {
        if(materias[i].codmat==codmat)return materias[i].nombre;
    }
    return "Sin Nombre";
}
function obtenerFormulario(codeva){
    $(".tipo-respuesta").css("display","none");
    codeva_seleccionado=codeva;
    $('.preg-resp').css('display','none');
    $('.form-calificar-evaluacion').css('display','none');
    $('.lista-Alumnos').css('display','none');
    $('.contenido-formulario').css('display','block');
    $('#botones-E').css('display','inline');
    $('.listaEvaluaciones').css('display','none');
    $('.form-EvaluacionMixta').css('display','block');
    $('#header-principal').css('display','block');
    $('.form-lista-preguntas').css('display','none');
    $('.form-seleccion').css('display','none');
        $.post(
            "controlador/evaluacion_mixta_controlador.php?usr=doc&op=get_datos_evaluacion",
            {codeva:codeva},
        datos=>{
            let status=datos.status;
            if (status=="ok"){
                lista= datos.lista;
            } 
            cargar_formulario(codeva);
        },
        "json"
        );
}
const cargar_formulario = (codeva)=>{
    document.getElementById('descrip').readOnly = true;
    codeva_seleccionado=codeva;
    $('#visiblecheck').css('display','block');
    $('#guardar-form').css('display','none');
    $('#actualizar-form').css('display','block');
    $('#eliminar-form').css('display','block');
    $('.preguntas-revisar').css('display','block');
    $('#nombrecurso').text(getNombreCurso(curso_seleccionado,paralelo_seleccionado));
    $('#nombremat').text(getNombreMateria(materia_seleccionada));
        for (var i = 0; i < lista.length; i++) {
            let nroEval= lista[i]['nro'];
            $('#badge-ne').text(nroEval);
            $('#descrip').val(lista[i]['descripcion']);
            let fechaini = lista[i]['inicio'];
            let fechafin = lista[i]['fin'];
            let fechai= fechaini.substring(0,10);
            let horai = fechaini.substring(11,16);
            let fechaf= fechafin.substring(0,10);
            let horaf = fechafin.substring(11,16);
            $('#fechaini').val(fechai);
            $('#horaini').val(horai);
            $('#fechafin').val(fechaf);
            $('#horafin').val(horaf);
            $('#Nota').val(lista[i]['nota']);
            $('#duracion').val(lista[i]['tiempo']);
            $('#nropregunta').val(lista[i]['preguntas']);
            $('#cant-preguntas').text(lista[i]['banco']);
            let visible = lista[i]['visible'];
            visible_global=visible;
            let vis = document.getElementById('visible');
             if (visible_global==1){
                vis.checked = true;
                document.getElementById('descrip').readOnly = true; 
                document.getElementById('horaini').readOnly = true;
                document.getElementById('horafin').readOnly = true;
                let inputs = document.querySelectorAll('.input');
                inputs.forEach(input=>{
                    input.readOnly = true;
                });          
             }else{
                vis.checked = false;
                document.getElementById('descrip').readOnly = false; 
                document.getElementById('fechaini').readOnly = false;
                document.getElementById('horaini').readOnly = false;
                document.getElementById('fechafin').readOnly = false;
                document.getElementById('horafin').readOnly = false;
                let inputs = document.querySelectorAll('.input');
                inputs.forEach(input=>{
                    input.readOnly = false;
                }); 
             }
            nro_seleccionado = nroEval;
        }
        $('#actualizar-form').click(()=>update_evaluacion(codeva));
        $('#eliminar-form').click(()=>delete_evaluacion(codeva));
}
const validar_form = ()=>{
    let descripcion = $('#descrip').val();
    let fechai = $('#fechaini').val();
    let fechaf = $('#fechafin').val();
    let horai = $('#horai').val();
    let horaf = $('#horaf').val();
    let nota = $('#Nota').val();
    let duracion = $('#duracion').val();
    let nro_Preguntas = $('#nropregunta').val();
    if(descripcion==""||fechai==""||fechaf==""||horai==""||horaf==""||
       nota==""||duracion==""||nro_Preguntas=="")return false;
    return true;
}
const update_evaluacion = codeva=>{
    if(validar_form()){
        Swal.fire({
            title: 'Alerta',
            text: "Se realizarán cambios en la evaluacion...\ndesea continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
                if (result.isConfirmed) {
                    let formData = new FormData($('.form-EvaluacionMixta')[0]);
                    formData.append("codeva",codeva);
                    let request = $.ajax({
                                          url: "controlador/evaluacion_mixta_controlador.php?usr=doc&op=update_evaluacion_mixta",
                                          type: "POST",
                                          data: formData,
                                          processData: false,  // tell jQuery not to process the data
                                          contentType: false,
                                          async:false   // tell jQuery not to set contentType
                                        }).responseText;
                    if(request=="ok"){
                        Swal.fire("Evaluación guardada exitosamente...");
                        obtener_lista_Eval(curso_seleccionado, paralelo_seleccionado, materia_seleccionada);
                    }
                    if (request=="errorCantPreguntas") {
                        Swal.fire("No tiene suficientes preguntas regristradas para habilitar examen");                       
                    }
                   if (request=="errorHora"){
                        Swal.fire("La fecha inicio no puede ser menor a la fecha actual...");
                    }  
                    if (request=="errorTime"){
                        Swal.fire("La fecha final es menor a la fecha inicio...");
                    } 
                    if(request=="errorNota"){
                        Swal.fire("La nota debe ser menor o igual a 100");
                    }
                    if (request=="NoExistecombinaciones") {
                        Swal.fire("No se generó evaluación porque no existen combinaciones de preguntas");           
                    }     
                }
              }); 

    }else{
        Swal.fire("Debe llenar los campos  requeridos...");
    }
}
const guardar_evaluacion = ()=>{
    if(validar_form()){
        let formData = new FormData($('.form-EvaluacionMixta')[0]);
        formData.append("codcur",curso_seleccionado);
        formData.append("codpar",paralelo_seleccionado);
        formData.append("codmat",materia_seleccionada);
        let request = $.ajax({
                              url: "controlador/evaluacion_mixta_controlador.php?usr=doc&op=save_evaluacion_mixta",
                              type: "POST",
                              data: formData,
                              processData: false,  // tell jQuery not to process the data
                              contentType: false,
                              async:false   // tell jQuery not to set contentType
                            }).responseText;
        if(request=="ok"){
            Swal.fire("Evaluación guardada exitosamente");
            obtener_lista_Eval(curso_seleccionado,paralelo_seleccionado,materia_seleccionada);
        }
        if (request=="errorTime"){
            Swal.fire("La fecha final es menor a la fecha inicio...");
        }
        if (request=="errorHora"){
            Swal.fire("La fecha inicio no puede ser menor a la fecha actual...");
        }
        if(request=="errorNota"){
            Swal.fire("La nota debe ser menor o igual a 100");
        }    
    }else{
        Swal.fire("Debe llenar los campos requeridos...");
    }
}
const delete_evaluacion = codeva=>{
    Swal.fire({
        title: 'Alerta',
        text: "Se eliminará la evaluacion...\ndesea continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
            if (result.isConfirmed) {
              $.post(
                    "controlador/evaluacion_mixta_controlador.php?usr=doc&op=Delete_evaluacion_mixta",
                    {codeva:codeva,
                    nro:nro_seleccionado}, 
                    data=>{
                        if (data.trim()=="ok") { 
                            Swal.fire("Evaluacion eliminada exitosamente...");
                            obtener_lista_Eval(curso_seleccionado, paralelo_seleccionado, materia_seleccionada);
                        }
                    }
                );     
            }
    });     
}
const obtener_banco_preguntas = (codeva)=>{
    $('.form-seleccion').css('display','none');

    $.post(
        "controlador/pregunta_em_controlador.php?usr=doc&op=get_preguntas-tipo-imagen",
        {codeva:codeva},
      datos=>{
         let status=datos.status;
         if (status=="ok"){
             lista= datos.lista;
         } 
         cargar_banco_preguntas(codeva);
     },
     "json"
     );
}  
function cargar_banco_preguntas(codeva){
    console.log("cargar_banco_preguntas");
    console.log(visible_global);
    codeva_seleccionado=codeva;
    $('.listapreguntas').children().remove();
    $('#form-lista-preguntas').css('display','block');
    $('.form-preguntas').css('display','none');
    $('.lista-preguntas').css('display','block');
    $('.contenido-formulario').css('display','none');
    $('.form-seleccion').css('display','none');    
   for (var i = 0; i < lista.length; i++) {
        let pregunta = lista[i]['pregunta'];
        let imagen = lista[i]['imagen'];
        let codpreg = lista[i]['codpreg'];
        let tipo =  lista[i]['tipo'];
      $('.listapreguntas').append(
        `<li>
            <button type= "button"class="btn-pregunta" 
                onclick="obtener_Formulario_pregunta(${codpreg},${tipo})">
                <span class="badge">${i+1}</span>
                <span class="enunciado">${pregunta}</span>
                <img src="img/${imagen}">
            </button>
        </li>` 
      );
      if (visible_global==1) {
            $('#agregar-preguntas').css('display','none');
        }else{
            $('#agregar-preguntas').css('display','block');
        }
    }
    $("html, body").animate({ scrollTop: $("#agregar-preguntas").offset().top }, 800);
}
const get_formulario_preguntas = ()=>{
    $(".tipo-respuesta").css("display","BLOCK");
    $('#form-lista-preguntas').css('display','none');
    $('.form-seleccion').css('display','none');
    $('.form-escrito').css('display','none');
    $('.form-verdadero-falso').css('display','none');
    $('.form-relacionamiento').css('display','none');
    $('#header-principal').css('display','block');
    $('#header-secundario').css('display','none');
    $.post(
        "controlador/tipo_imagen_pregunta_controlador.php?usr=doc&op=get_img_tipo",
        datos=>{
         let status=datos.status;
         if (status=="ok"){
             lista= datos.lista;
         } 
         cargar_form_preguntas();
     },
     "json"
     );
}
const cargar_form_preguntas=()=>{
    $('.tipopreguntas').children().remove();
    $('.form-preguntas').css('display','block');
    $('#nombrecurso1').text(getNombreCurso(curso_seleccionado,paralelo_seleccionado));
    $('#nombremat1').text(getNombreMateria(materia_seleccionada));
    for (var i = 0; i < lista.length; i++) {
        let idtipo = lista[i]['id'];
        let imagen = lista[i]['link'];
        let nombre = lista[i]['nombre'];
        let descripcion = lista[i]['descripcion'];
      $('.tipopreguntas').append(
        `<li>
            <button type="button" class="ico-tipo" onclick="form_tipo_pregunta(${idtipo})">
                <img src="img/${imagen}">
                <p><span class="text-primario">${nombre}</span></br>${descripcion}</p>
            </button>
        </li>` 
      );
    }
}
const limpiar_form_tipo = ()=>{
    let input= document.getElementById("idimagen");
    input.value='';
    $('.position-relative').css('display','none');
    $('.pregunta-text').val("");
    $('#nota-seleccion').val("");
    $('#input-nota').val("");
    $('.opcion').children().remove();  
    $('.resp-flechas').children().remove();
    num=0;
}
const carga_formulario =(idtipo)=>{
    tipo_seleccionado=idtipo;
    switch (idtipo) {
        case 1:
            $('.input-imagen').css('display','block');
            $('.opciones').css('display','none');
            $('.respuesta-verdadero').css('display','none');
            $('.resp-flechas').css('display','none');
            $('#agregar-relacion').css('display','none');
            break;
        case 2:
            $('.input-imagen').css('display','block');
            $('.opciones').css('display','block');
            $('#agregar-relacion').css('display','none');
            $('.respuesta-verdadero').css('display','none');
            $('.resp-flechas').css('display','none');
            break;
        case 3:
            $('.input-imagen').css('display','block');
            $('.opciones').css('display','none');
            $('.respuesta-verdadero').css('display','block');
            $('.resp-flechas').css('display','none');
            $('#agregar-relacion').css('display','none');
            break;
        case 4:
            $('.input-imagen').css('display','none');
            $('.opciones').css('display','none');
            $('.respuesta-verdadero').css('display','none');
            $('.resp-flechas').css('display','block');
            $('#agregar-relacion').css('display','block');
            break;
        default:
            break;
    }
}
const form_tipo_pregunta = (idtipo) =>{
    limpiar_form_tipo();
    $('.Guardar-tipo').css('display','block');
    $(".Actualizar-tipo").css('display','none');
    $("#cancelar-form-tipo").css('display','none');
    $("#cancelar-escrito").css('display','block');
    $('.form-preguntas').css('display','none');
    $('.form-seleccion').css('display','block');
    $('.input-imagen').css('display','block'); 
        carga_formulario(idtipo);
    $('.Eliminar-tipo').css('display','none');
}
function rango(correcto){  
    for (let i = 0; i < correcto.length; i++) {
        return (correcto[i].value!=0 && correcto[i].value!="" && correcto[i].value<=correcto.length);     
    }
}
function sumaE(correcto){
    let s=0;
    for (let i = 0; i < correcto.length; i++) {
        n = parseInt(correcto[i].value);
        s+=n;    
    }
    return s;
}
function sumatoria(n){
    if(n==1) return 1; 
        return n + sumatoria(n-1); 
}
function diferentes(correcto){
    return sumaE(correcto)==sumatoria(correcto.length);
}
const validar_form_pregunta = ()=>{
    let pregunta = $('.pregunta-text').val();
    let nota = $('.input-nota').val();
    if(pregunta==""||nota=="")return false;
    
    if(tipo_seleccionado==2){
            _checkoption();
            let opciones=document.getElementsByName("opcion[]");
            for (let i = 0; i < opciones.length; i++) {
                if (opciones[i].value=="")return false;      
            }
            if(op_correcta==0)return false;
            return true;
        }
        if(tipo_seleccionado==3){
            _resultado();
            if(op_vf==0)return false;
        }
        if(tipo_seleccionado==4){
            let tipo1=document.getElementsByName("tipoC1[]");
            let tipo2=document.getElementsByName("tipoC2[]");
            let campo1=document.getElementsByName("campo1[]");
            let campo2=document.getElementsByName("campo2[]");
            let imagen1=document.getElementsByName("imagen1[]");
            let imagen2=document.getElementsByName("imagen2[]");
            let correcto=document.getElementsByName("correcto[]");
             
            for (let i = 0; i < correcto.length; i++) {
                
                if (tipo1[i].value==1) { 
                    if(imagen1[i].value=="")return false;
                } else {
                    if (campo1[i].value=="")return false;
                }
                if (tipo2[i].value==1) {
                    if(imagen2[i].value=="")return false;
                } else {
                    if (campo2[i].value=="")return false;
                }
                if (tipo1[i].value==""||tipo2[i].value=="")return false;
            }  
                return rango(correcto) && diferentes(correcto);
        } 
    return true;   
}
const guardar_pregunta = () =>{
    if(validar_form_pregunta()){
        let formData = new FormData($('.form-seleccion')[0]);
        formData.append("codeva",codeva_seleccionado);
        formData.append("tipo",tipo_seleccionado);
        if (tipo_seleccionado==2){//
            formData.append("checkoption",op_correcta);
        }
        let request = $.ajax({
                              url: "controlador/pregunta_em_controlador.php?usr=doc&op=guardar_detalle_pregunta",
                              type: "POST",
                              data: formData,
                              processData: false,  // tell jQuery not to process the data
                              contentType: false,
                              async:false   // tell jQuery not to set contentType
                            }).responseText;                  
        if(request=="ok"){
            Swal.fire("Pregunta guardada exitosamente");
            obtener_banco_preguntas(codeva_seleccionado);

        } if (request=="errorFile"){
            Swal.fire("solo acepta imágenes .PNG, .JPG y .JPEG");
        } 
    }else{
        Swal.fire("Debe llenar los campos requeridos correctamente...");
    }  
}
const obtener_Formulario_pregunta = (codpreg, tipo_seleccionado) =>{
   $('.form-seleccion').css('display','block');
   $('.insertar-imagen').children().remove();
        $.post(
            "controlador/pregunta_em_controlador.php?usr=doc&op=get_detalle_de_pregunta",
            {codpreg:codpreg, tipo:tipo_seleccionado},
        datos=>{
            let status=datos.status;
            if (status=="ok"){
                lista= datos.lista;
            } 
            cargar_formulario_pregunta(codpreg,tipo_seleccionado);
        },
        "json"
        ); 
}
function delete_opcion (event, codpreg,idopcion, nro){
    Swal.fire({
        title: 'Alerta',
        text: "Se eliminará la opcion...\ndesea continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
    }).then((result) => {
            if (result.isConfirmed) {
              $.post(
                    "controlador/opcion_em_controlador.php?usr=doc&op=delete_opcion",
                    {codpreg:codpreg,
                    idopcion:idopcion,
                    nro:nro},
                    data=>{
                        if (data=="Ok") {
                            Swal.fire("Opcion eliminada exitosamente...");
                            event.path[2].remove();
                            _checkoption();
                        }
                    }
                );     
            }
    }); 
}
function cargar_formulario_pregunta(codpreg, tipo_seleccionado)
{ 
    preg_selected = codpreg;
    $('.position-relative').children().remove();
    $('.position-relative').css('display','block');   
    $('.opcion').children().remove();  
    $('.resp-flechas').children().remove();
    $("#cancelar-escrito").css('display','none');
    $("#cancelar-form-tipo").css('display','block');
    $(".form-lista-preguntas").css('display','none');
     $('.Guardar-tipo').css('display','none');   
    if (visible_global==1) {
        $(".Actualizar-tipo").css('display','none');
        $('.Eliminar-tipo').css('display','none'); 
    }else{
        $(".Actualizar-tipo").css('display','block');
        $('.Eliminar-tipo').css('display','block'); 
    }
     
    num=0;
       for (var i = 0; i < lista.length; i++) {
            let idtipo = lista[i]['tipo'];
            $('.input-nota').val(lista[i]['nota']);
            $('.pregunta-text').val(lista[i]['pregunta']);
            let imagen = lista[i]['imagen'];
            let codimg = lista[i]['codimg'];
            if (imagen!="" && idtipo!=4) {
              $('.position-relative').append(
                `<div class="position"> 
                    <div> Eliminar </div>
                    <button type="button" class="btn-eliminar" 
                        onclick="delete_imagen(${codimg})">
                        <img src="svg/close.svg">
                    </button>
                </div>
                <div class="imagen">
                    <img src="resources/${imagen}" id="IdImg">
                </div>` 
              );  
            }    
            if (idtipo==2) {
                $('#agregar-relacion').css('display','none');
                let lista_opciones=lista[i]['opciones'];
                let op=lista[i]['op_correcta'];
                  for (let i = 0; i < lista_opciones.length; i++) {
                        let opcion = lista_opciones[i]['em_o_opcion'];
                        let idopcion = lista_opciones[i]['em_o_id'];
                        let nro = lista_opciones[i]['em_o_nro'];
                        if (op==nro){
                            $('.opcion').append(
                                `<div>
                                    <Label>Opcion</Label>
                                    <input class="opcion-text" id="opcion-input-text" type="text"name="opcion[]" value="${opcion}">
                                    <input type="radio" name="checkoption" class="selector" onclick="_checkoption();">
                                </div>`  
                            ); 
                        }else{
                                $('.opcion').append(
                                `<div>
                                    <Label>Opcion</Label>
                                    <input class="opcion-text" id="opcion-input-text" type="text"name="opcion[]" value="${opcion}">
                                    <input type="radio" name="checkoption" class="selector" onclick="_checkoption();">
                                    <button class="eliminar-opcion puntero ocultar" id="rev-eliminar" onclick="delete_opcion(event,${codpreg},${idopcion}, ${nro})"><img src="svg/close.svg"></button>
                                </div>`  
                            ); 
                        }  
                    }
                   input_checked(op);          
            }
            if (idtipo==3){  
                $('#agregar-relacion').css('display','none');   
                let v_f = lista[i]['v_f'];
                let id_vf = lista[i]['id_vf'];
                id_vf_seleccionado=id_vf;
                   /* Evaluaciones_mixtas.php*/
                    //obtiene la opcion escogida por eldocente
                    console.log("opcion..obtenida: ",v_f);
                    input_checked_vf(v_f);
                    
            }
            if (idtipo==4){
                $('#agregar-relacion').css('display','block');
                let lista_relaciones=lista[i]['relaciones'];
                for (let i = 0; i < lista_relaciones.length; i++) {
                    let idrelacion = lista_relaciones[i]['id'];
                    let campo1 = lista_relaciones[i]['campo1'];
                    let campo2 = lista_relaciones[i]['campo2'];
                    let correcta = lista_relaciones[i]['op_correcto'];
                    let nro = lista_relaciones[i]['nro'];
                    let t1 = lista_relaciones[i]['tipo1'];
                    let t2 = lista_relaciones[i]['tipo2'];
                
                    if (t1==1 && t2==1){
                        $('.resp-flechas').append(
                            `<div>
                                <div class="detalle-enun agregado" id="${rel+1}">

                                <div class="num"><label class="num-enu">${nro}</label> </div>
                                <div style="display:none;" class="texto tex1" id="textc1${rel+1}"> 
                                <textarea class= "text-rel1" id="textarea-text" name="campo1[]" ></textarea> 
                            </div>
                    
                            <div style="display:none;" class="text-imagen relacion1" id="teximgc1${rel+1}"> 
                                <div class= "text-img campo1">
                                    <button class="text">
                                        <img src="svg/text1.svg" alt="" onclick="agregar_textC1('textc1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">      
                                    </button>
                                    <button class="img" >
                                        <img src="svg/imagen1.svg" alt="" class="add-photo" onclick="agregar_imagenC1('box-img1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">                                  
                                    </button>
                                        <input type="hidden" name="tipoC1[]" class="tipo1" id="tipoc1${rel+1}" value="${t1}"> 
                                </div>
                            </div>
        
                            <div class="text-ima" id="box-img1${rel+1}" style="display:block;">
                                <div class="container">
                                    <img id="imagen1${rel+1}" src="resources/${campo1}" name="img1">
                                </div>
                                <input type="file" class="inputimg" id="inputC1${rel+1}" name="imagen1[]" accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen1${rel+1}')"hidden>                            
                                <div class="inputselect" onclick="selectimg('inputC1${rel+1}');"> seleccionar archivo</div>
                            </div>
                    
                            <div class="trazado"> 
                                <div> 
                                    <button style="display:block;" class="btn-elim " id="c1${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar('textc1${rel+1}','teximgc1${rel+1}','box-img1${rel+1}','c1${rel+1}','tipoc1${rel+1}');"> </button>
                                </div>
                            </div>
        
                            <div class="opcion-enun"><input type="number" min="0"  name="correcto[]" value="${correcta}"></div>

                                    <div style="display:none;" class="texto tex2" id="textc2${rel+1}">
                                        <textarea class= "text-rel2" id="textarea-text" name="campo2[]"></textarea>
                                    </div>
                            
                                    <div style="display:none;" class="text-imagen relacion2" id="teximgc2${rel+1}">
                                        <div class="text-img campo2">
                                            <button class="text">
                                                <img src="svg/text1.svg" alt="" class="add-text" onclick="agregar_textC2('textc2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button>
                                            <button class="img">
                                                <img src="svg/imagen1.svg" alt="" onclick="agregar_imagenC2('box-img2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button>
                                            <input type="hidden" name="tipoC2[]" class="tipo2" id="tipoc2${rel+1}" value="1"> 
                                        </div>
                                    </div>
                                    <div class="text-ima" id="box-img2${rel+1}" style="display:block;">
                                        <div class="container">
                                            <img id="imagen2${rel+1}" src="resources/${campo2}" name="img2">
                                        </div>
                                        <input type="file" class="inputimg" id="inputC2${rel+1}" name="imagen2[]"  accept="image/png, image/jpeg, image/jpg"  onchange="cargaImagen(event,'imagen2${rel+1}')"hidden>
                                        <div class="inputselect" onclick="selectimg('inputC2${rel+1}');"> seleccionar archivo</div>
                                    </div> 
    
                                    <button style="display:block;" class="btn-elim" id="c2${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar2('textc2${rel+1}','teximgc2${rel+1}','box-img2${rel+1}','c2${rel+1}','tipoc2${rel+1}');"></button>
                                    <button class="btn-elim" id="eliminar-relacion" onclick="delete_relacion(event,${codpreg},${idrelacion}, ${nro})"><img src="svg/close.svg"></button>
                                </div>
                            </div>`  
                        );
                        rel++;
                        num++;
                    }
                    if (t1==1 && t2==2){
                        $('.resp-flechas').append(
                            `<div>
                                <div class="detalle-enun agregado" id="${rel+1}">
                                    <div class="num"><label class="num-enu">${nro}</label> </div>
                            
                                    <div style="display:none;" class="texto tex1" id="textc1${rel+1}"> 
                                        <textarea class= "text-rel1" id="textarea-text" name="campo1[]" ></textarea> 
                                    </div>
                            
                                    <div style="display:none;" class="text-imagen relacion1" id="teximgc1${rel+1}"> 
                                        <div class= "text-img campo1">
                                            <button class="text">
                                                <img src="svg/text1.svg" alt="" onclick="agregar_textC1('textc1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">      
                                            </button>
                                            <button class="img" >
                                                <img src="svg/imagen1.svg" alt="" class="add-photo" onclick="agregar_imagenC1('box-img1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">                                  
                                            </button>
                                            <input type="hidden" name="tipoC1[]" class="tipo1" id="tipoc1${rel+1}" value="${t1}"> 
                                        </div>
                                    </div>
    
                                    <div class="text-ima" id="box-img1${rel+1}" style="display:block;">
                                        <div class="container">
                                            <img id="imagen1${rel+1}" src="resources/${campo1}">
                                        </div>
                                        <input type="file" class="inputimg" id="inputC1${rel+1}" name="imagen1[]" accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen1${rel+1}')"hidden>                            
                                        <div class="inputselect" onclick="selectimg('inputC1${rel+1}');"> seleccionar archivo</div>
                                    </div>
                
                                    <div class="trazado"> 
                                        <div> 
                                            <button style="display:block;" class="btn-elim " id="c1${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar('textc1${rel+1}','teximgc1${rel+1}','box-img1${rel+1}','c1${rel+1}','tipoc1${rel+1}');"> </button>
                                        </div>
                                    </div>
    
                                    <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${correcta}"></div>
                            
                                    <div style="display:block;" class="texto tex2" id="textc2${rel+1}">
                                        <textarea class= "text-rel2" id="textarea-text" name="campo2[]">${campo2}</textarea>
                                    </div>
                            
                                    <div style="display:none;" class="text-imagen relacion2" id="teximgc2${rel+1}">
                                        <div class="text-img campo2">
                                            <button class="text">
                                                <img src="svg/text1.svg" alt="" class="add-text" onclick="agregar_textC2('textc2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button>
                                            <button class="img">
                                                <img src="svg/imagen1.svg" alt="" onclick="agregar_imagenC2('box-img2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button>
                                            <input type="hidden" name="tipoC2[]" class="tipo2" id="tipoc2${rel+1}" value="${t2}"> 
                                        </div>
                                    </div>
                                    <div class="text-ima" id="box-img2${rel+1}" style="display:none;">
                                        <div class="container">
                                            <img id="imagen2${rel+1}" >
                                        </div>
                                        <input type="file" class="inputimg" id="inputC2${rel+1}" name="imagen2[]"  accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen2${rel+1}')"hidden>
                                        <div class="inputselect" onclick="selectimg('inputC2${rel+1}');"> seleccionar archivo</div>
                                    </div> 
                                    <button style="display:block;" class="btn-elim" id="c2${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar2('textc2${rel+1}','teximgc2${rel+1}','box-img2${rel+1}','c2${rel+1}','tipoc2${rel+1}');"></button>
                                    <button class="btn-elim" id="eliminar-relacion" onclick="delete_relacion(event,${codpreg},${idrelacion}, ${nro})"><img src="svg/close.svg"></button>
                                </div>
                            </div>`  
                        );
                        rel++;
                        num++;
                    }
                    if (t1==2 && t2==2){
                        $('.resp-flechas').append(
                            `<div>
                                <div class="detalle-enun agregado" id="${rel+1}">
                                    <div class="num"><label class="num-enu">${nro}</label> </div>
                            
                                    <div style="display:block;" class="texto tex1" id="textc1${rel+1}"> 
                                      <textarea class= "text-rel1" id="textarea-text" name="campo1[]" >${campo1}</textarea> 
                                    </div>
                            
                                    <div style="display:none;" class="text-imagen relacion1" id="teximgc1${rel+1}"  > 
                                        <div class= "text-img campo1">
                                            <button class="text">
                                                <img src="svg/text1.svg" alt="" onclick="agregar_textC1('textc1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">      
                                             </button>
                                            <button class="img" >
                                                 <img src="svg/imagen1.svg" alt="" class="add-photo" onclick="agregar_imagenC1('box-img1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">                                  
                                            </button>
                                            <input type="hidden" name="tipoC1[]" class="tipo1" id="tipoc1${rel+1}" value="${t2}"> 
                                        </div>
                                    </div>
    
                                    <div class="text-ima" id="box-img1${rel+1}" style="display:none;">
                                        <div class="container">
                                             <img id="imagen1${rel+1}">
                                        </div>    
                                         <input type="file" class="inputimg" id="inputC1${rel+1}" name="imagen1[]" accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen1${rel+1}')"hidden>                            
                                         <div class="inputselect" onclick="selectimg('inputC1${rel+1}');"> seleccionar archivo</div>
                                    </div>
                
                                    <div class="trazado"> 
                                        <div> 
                                            <button style="display:block;" class="btn-elim " id="c1${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar('textc1${rel+1}','teximgc1${rel+1}','box-img1${rel+1}','c1${rel+1}','tipoc1${rel+1}');"> </button>
                                        </div>
                                    </div>
    
                                    <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${correcta}"></div>
                            
                                    <div style="display:block;" class="texto tex2" id="textc2${rel+1}">
                                        <textarea class= "text-rel2" id="textarea-text" name="campo2[]" >${campo2}</textarea>
                                    </div>
                            
                                    <div style="display:none;" class="text-imagen relacion2" id="teximgc2${rel+1}">
                                        <div class="text-img campo2">
                                            <button class="text">
                                                <img src="svg/text1.svg" alt="" class="add-text" onclick="agregar_textC2('textc2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button>
                                            <button class="img">
                                                <img src="svg/imagen1.svg" alt="" onclick="agregar_imagenC2('box-img2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button>
                                            <input type="hidden" name="tipoC2[]" class="tipo2" id="tipoc2${rel+1}" value="${t2}"> 
                                        </div>
                                    </div>

                                    <div class="text-ima" id="box-img2${rel+1}" style="display:none;">
                                        <div class="container">
                                            <img id="imagen2${rel+1}">
                                        </div>
                                        <input type="file" class="inputimg" id="inputC2${rel+1}" name="imagen2[]"  accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen2${rel+1}')"hidden>
                                        <div class="inputselect" onclick="selectimg('inputC2${rel+1}');"> seleccionar archivo</div>
                                    </div> 
                                    <button style="display:block;" class="btn-elim" id="c2${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar2('textc2${rel+1}','teximgc2${rel+1}','box-img2${rel+1}','c2${rel+1}','tipoc2${rel+1}');"></button>
                                    <button class="btn-elim" id="eliminar-relacion" onclick="delete_relacion(event,${codpreg},${idrelacion}, ${nro})"><img src="svg/close.svg"></button>
                                </div>
                            </div>`  
                        );
                        rel++;num++;
                    }
                    if (t1==2 && t2==1){
                        $('.resp-flechas').append(
                            `<div>
                                <div class="detalle-enun agregado" id="${rel+1}">
                                    <div class="num"><label class="num-enu">${nro}</label> </div>
                            
                                    <div style="display:block;" class="texto tex1" id="textc1${rel+1}"> 
                                        <textarea class= "text-rel1" id="textarea-text" name="campo1[]">${campo1}</textarea> 
                                    </div>
                            
                                    <div style="display:none;" class="text-imagen relacion1" id="teximgc1${rel+1}"  > 
                                        <div class= "text-img campo1">
                                            <button class="text">
                                                <img src="svg/text1.svg" alt="" onclick="agregar_textC1('textc1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">      
                                            </button>
                                            <button class="img" >
                                                <img src="svg/imagen1.svg" alt="" class="add-photo" onclick="agregar_imagenC1('box-img1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">                                  
                                            </button>
                                             <input type="hidden" name="tipoC1[]" class="tipo1" id="tipoc1${rel+1}" value="${t1}"> 
                                        </div>
                                    </div>
    
                                    <div class="text-ima" id="box-img1${rel+1}" style="display:none;">
                                        <div class="container">
                                            <img id="imagen1${rel+1}" >
                                        </div>
                                        <input type="file" class="inputimg" id="inputC1${rel+1}" name="imagen1[]" accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen1${rel+1}')"hidden>       
                                        <div class="inputselect" onclick="selectimg('inputC1${rel+1}');"> seleccionar archivo</div>
                                    </div>
                
                                    <div class="trazado"> 
                                        <div> 
                                            <button style="display:block;" class="btn-elim " id="c1${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar('textc1${rel+1}','teximgc1${rel+1}','box-img1${rel+1}','c1${rel+1}','tipoc1${rel+1}');"> </button>
                                        </div>
                                     </div>
    
                                    <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${correcta}"></div>
                            
                                    <div style="display:none;" class="texto tex2" id="textc2${rel+1}">
                                        <textarea class= "text-rel2" id="textarea-text" name="campo2[]" ></textarea>
                                    </div>
                            
                                    <div style="display:none;" class="text-imagen relacion2" id="teximgc2${rel+1}">
                                        <div class="text-img campo2">
                                            <button class="text">
                                                <img src="svg/text1.svg" alt="" class="add-text" onclick="agregar_textC2('textc2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button> 
                                            <button class="img">
                                                <img src="svg/imagen1.svg" alt="" onclick="agregar_imagenC2('box-img2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                            </button>
                                            <input type="hidden" name="tipoC2[]" class="tipo2" id="tipoc2${rel+1}" value="${t2}"> 
                                        </div>
                                    </div>
                                    <div class="text-ima" id="box-img2${rel+1}" style="display:block;">
                                        <div class="container">
                                            <img id="imagen2${rel+1}" src="resources/${campo2}">
                                        </div>    
                                        <input type="file" class="inputimg" id="inputC2${rel+1}" name="imagen2[]"  accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen2${rel+1}')" hidden>
                                        <div class="inputselect" onclick="selectimg('inputC2${rel+1}');"> seleccionar archivo</div>
                                    </div>  
                                    <button style="display:block;" class="btn-elim" id="c2${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar2('textc2${rel+1}','teximgc2${rel+1}','box-img2${rel+1}','c2${rel+1}','tipoc2${rel+1}');"></button>
                                    <button class="btn-elim" id="eliminar-relacion" onclick="delete_relacion(event,${codpreg},${idrelacion}, ${nro})"><img src="svg/close.svg"></button>
                                </div>
                            </div>`  
                        );
                        rel++; num++;
                    } 
                }
            }
            tipo_seleccionado=idtipo;
        }
        carga_formulario(tipo_seleccionado);
        $("#actualizar-escrito").click(()=>update_pregunta(codpreg));
        $("#eliminar-escrito").click(()=>delete_pregunta(codpreg));
        
}
const delete_imagen = (codimg)=>{
    Swal.fire({
        title: 'Alerta',
        text: "Se eliminará la imagen...\ndesea continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
            if (result.isConfirmed) {
              $.post(
                    "controlador/imagen_em_controlador.php?usr=doc&op=delete_imagen",
                    {codimg:codimg}, 
                    data=>{
                        if (data=="Ok") {
                            Swal.fire("Imagen eliminada exitosamente...");
                            $('.position-relative').css('display','none');
                        }
                    }
                );     
            }
    });     
}
const validar_form_preg = ()=>{
    let pregunta = $('.pregunta-text').val();
    let nota = $('.input-nota').val(); 
    if(pregunta==""||nota=="")return false;
    if(tipo_seleccionado==2){
        _checkoption();
        let opciones=document.getElementsByName("opcion[]");
        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].value=="")return false;      
        }
        if(op_correcta==0)return false;
        return true;
    }
    if(tipo_seleccionado==3){
        _resultado();
        if(op_vf==0)return false;
    }
    if(tipo_seleccionado==4){
        let tipo1=document.getElementsByName("tipoC1[]");
        let tipo2=document.getElementsByName("tipoC2[]");
        let campo1=document.getElementsByName("campo1[]");
        let campo2=document.getElementsByName("campo2[]");
        //let imagen1=document.getElementsByName("imagen1[]");
        //let imagen2=document.getElementsByName("imagen2[]");
        let correcto=document.getElementsByName("correcto[]");
        for (let i = 0; i < correcto.length; i++) {
            if (tipo1[i].value==2) { 
                if (campo1[i].value=="") return false;
            }
            if (tipo2[i].value==2) {
                if (campo2[i].value=="") return false;
            }
            if (tipo1[i].value==""||tipo2[i].value=="")return false;
        }
            return rango(correcto) && diferentes(correcto);
    }
    return true;    
}
function delete_relacion (event, codpreg,idrelacion, nro){
        Swal.fire({
            title: 'Alerta',
            text: "Se eliminará la relación...\ndesea continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
        }).then((result) => {
                if (result.isConfirmed) {
                $.post(
                        "controlador/relacionar_controlador.php?usr=doc&op=delete_relacion",
                        {codpreg:codpreg,
                        idrelacion:idrelacion,
                        nro:nro},
                        data=>{
                            if (data.trim()=="ok") { 
                                //Swal.fire("Relación eliminada exitosamente...");
                                event.path[2].remove();
                                num--;
                            }
                        },"text"
                    );     
                }
        }); 
}
const update_pregunta = (codpreg)=>{
    if(validar_form_preg()){
        Swal.fire({
            title: 'Alerta',
            text: "Se realizarán cambios en la pregunta...\ndesea continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
                if (result.isConfirmed) {
                    let formData = new FormData($('.form-seleccion')[0]);
                    formData.append("codeva",codeva_seleccionado);
                    formData.append("tipo",tipo_seleccionado);
                    formData.append("codpreg",codpreg);
                    formData.append("checkoption",op_correcta);
                    formData.append("resultado",op_vf);
                    formData.append("id_vf",id_vf_seleccionado);
                    let request = $.ajax({
                                          url: "controlador/pregunta_em_controlador.php?usr=doc&op=update_detalle_pregunta",
                                          type: "POST",
                                          data: formData,
                                          processData: false,  // tell jQuery not to process the data
                                          contentType: false,
                                          async:false   // tell jQuery not to set contentType
                                        }).responseText;
                    if(request=="ok"){
                        Swal.fire("preguntas guardada exitosamente...");
                        obtener_banco_preguntas(codeva_seleccionado);
                    }   
                }
              }); 
    }else{
        Swal.fire("Debe llenar los campos  requeridos correctamente...");
    }
}
const delete_pregunta = codpreg=>{
    console.log(`Pregunta a eliminar ${codpreg}`);
    Swal.fire({
        title: 'Alerta',
        text: "Se eliminará la pregunta...\ndesea continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
            if (result.isConfirmed) {
              $.post(
                    "controlador/pregunta_em_controlador.php?usr=doc&op=delete_pregunta",
                    {codpreg:preg_selected},
                    data=>{
                        if (data=="Ok") {
                            Swal.fire("Pregunta eliminada exitosamente...");
                            obtener_banco_preguntas(codeva_seleccionado);
                        }
                    }
                );     
            }
    }); 
}
const obtener_lista_alumnos=(codcur, codpar, codeva)=>{
    //document.getElementById('descrip').readOnly = true;
    $(".tipo-respuesta").css("display","none");
    $(".form-calificar-evaluacion").css('display','none');
    $('.contenido-formulario').css('display','none');
    $('.lista-Alumnos').css('display','block');
    curso_seleccionado=codcur;
    paralelo_seleccionado=codpar;
    codeva_seleccionado=codeva;
    $.post(
             "controlador/evaluacion_mixta_controlador.php?usr=doc&op=getListaAlumnos",
             {codcur:codcur,
             codpar:codpar,
             codeva:codeva},
             datos=>{
                let status=datos.status;
                if (status=="ok"){
                    lista_alumnos= datos.lista_alumnos;
                }
                cargarAlumnos();
            },
            "json"
            );
}
const validarNotasModificadas = () => {
    let inputs = document.getElementsByName("input_nota_modificada");
    let nota_evaluacion = lista[0].nota;
    for (var i = 0; i < inputs.length; i++) {
        let valor = inputs[i].value;
        if(valor != ""){
            if(valor < 1 || valor > 100){
                inputs[i].focus();
                alert(`La nota debe ser entre 1 y ${nota_evaluacion} pts.`);
                return false;
            }
        }
    }
    return true;
}
const guardarNotasModificadas = ()=>{
    if(validarNotasModificadas()){
        let inputs = document.getElementsByName("input_nota_modificada");
        let notasGuardar = [];
        for (var i = 0; i < lista_alumnos.length; i++) {
            let codalu = lista_alumnos[i].codigo;
            let idEvalAlu = lista_alumnos[i].id;
            let notaFinal = lista_alumnos[i].notafinal;
            let notaModificada = inputs[i].value;
            let nombre = `${lista_alumnos[i].paterno} ${lista_alumnos[i].materno} ${lista_alumnos[i].nombre}`;
            if(idEvalAlu == null && notaModificada != "")notasGuardar.push([codalu,codeva_seleccionado,notaModificada,nombre]);
            if(idEvalAlu != null && notaModificada != notaFinal&&notaFinal!=null)notasGuardar.push([codalu,codeva_seleccionado,notaModificada,nombre]);
        }

        if(notasGuardar.length > 0){
            $.post(
                    'controlador/em_alumno_controlador.php?op=update_notas&usr=doc',
                    {data : JSON.stringify(notasGuardar)},
                    data =>{
                        if(data == "ok"){
                            obtener_lista_alumnos(curso_seleccionado,paralelo_seleccionado,codeva_seleccionado);
                            Swal.fire("Notas registradas exitosamente...!!!");
                        }
                    },
                    "text"
                  );
        } else {
            alert("No se realizaron cambios...");
        }

        
    }


}
const cargarAlumnos=()=>{
    $('.lista-alum').children().remove();
    $(".btn-atras").css('display','block');
    for (var i = 0; i < lista_alumnos.length; i++) {
        let idaem = lista_alumnos[i]['id'];
        let nombres= lista_alumnos[i]['nombre'];
        let paterno = lista_alumnos[i]['paterno'];
        let materno = lista_alumnos[i]['materno'];
        let notafinal =lista_alumnos[i]['notafinal'];
        let style="background-color:cadetblue;border-radius:7px;height:24px;padding:6px;";
        if(idaem===null){
            style=""; 
            notafinal="No Realizado";
        }
        if (notafinal===null) {
            style="background-color:#dd6666e6;border-radius:7px;";
            notafinal="No calificado";                
        }
        $('.lista-alum').append(
            `<li>
                <div class="grid">
                    <div class="conte"><button class="nro-alumno  " onclick="obtener_preguntas_alumno(${idaem})"><span class="badge-num">${i+1}</span>
                        <span class="nombreAlumno">${paterno} ${materno} ${nombres} </span>
                        <span class="notaAlumno" style=${style}>${notafinal}</span>
                        <img src="svg/chevron-right.svg">
                        </button>
                    </div>
                </div> 
            </li>`
        );
    } 
    $('.lista-alum').append(
            `<li>
                <div style="text-align:center;">
                    <button class="Actualizar_2" onclick="modificarNotas();">Cambiar Notas</button>
                </div>   
            </li>`
        ); 

}
const modificarNotas = ()=>{
    $('.lista-alum').children().remove();
    $(".btn-atras").css('display','block');
    for (var i = 0; i < lista_alumnos.length; i++) {
        let idaem = lista_alumnos[i]['id'];
        let nombres= lista_alumnos[i]['nombre'];
        let paterno = lista_alumnos[i]['paterno'];
        let materno = lista_alumnos[i]['materno'];
        let notafinal =lista_alumnos[i]['notafinal'];
        let placeholder = "";
        let style="background-color:white;border-radius:7px;height:24px;padding:6px;";
        if(idaem===null){
            style="background-color:white;border-radius:7px;height:24px;padding:6px;"; 
            placeholder="No Realizado";
            notafinal="";
            
        } else if (notafinal===null) {
            notafinal="";
            style="background-color:white;border-radius:7px;height:24px;padding:6px;";
            placeholder="No calificado";               
        }
        $('.lista-alum').append(
            `<li>
                <div class="grid">
                    <div class="conte">
                        <div class="nro-alumno2" ><span class="badge-num">${i+1}</span>
                            <span class="nombreAlumno">${paterno} ${materno} ${nombres} </span>
                            <input type="text" class="notaAlumno" name = "input_nota_modificada" style="${style}" placeholder="${placeholder}" value="${notafinal}" onkeypress = "return validar_dato(this,event)">
                            <img src="svg/chevron-right.svg">
                        </div>
                    </div>
                </div>   
            </li>`
        );
    }
    $('.lista-alum').append(
            `<li>
                <div style="text-align:center;">
                    <button class="Actualizar_2" onclick="guardarNotasModificadas();">Guardar</button>
                </div>   
            </li>`
        ); 
    modificando = true;

}
const validar_dato = (obj , evt) => {
    var code = (evt.which) ? evt.which : evt.keyCode;
    if (code<48 || code>57)return false;
    let valor = `${obj.value}${evt.key}`;
    let nota_evaluacion = lista[0].nota;
    if (valor > nota_evaluacion || valor == 0)return false;
    return true;

}
const obtener_preguntas_alumno =(idaem)=>{
    idaem_seleccionado = idaem;  
    $.post(
        "controlador/em_alum_pregunta_controlador.php?usr=doc&op=get_preg_alum",
             {idaem:idaem},
             datos=>{
                let status=datos.status;
                if (status=="ok"){
                    lista= datos.lista;
                    $('.lista-Alumnos').css('display','none');
                    $('.form-calificar-evaluacion').css('display','block');
                    cargar_preguntas();
                }else{
                    Swal.fire({
                        title: 'El estudiante todavía no realizó la evaluación...',
                        confirmButtonText: `OK`,
                       })

                }    
            },
            "json"
    );
}
const getNombreAlumno = idaem_seleccionado => {
    for (var i = 0; i < lista_alumnos.length; i++) {
        if(lista_alumnos[i].id==idaem_seleccionado) return lista_alumnos[i].paterno+" "+lista_alumnos[i].materno+" "+lista_alumnos[i].nombre;
    }
    return "Sin Nombre";
}
const getNotaAlumno = idaem_seleccionado=>{
    for (var i = 0; i < lista_alumnos.length; i++) {
        if(lista_alumnos[i].id==idaem_seleccionado) return lista_alumnos[i].notafinal;
    }
    return "Sin Nota";
}
/*---*/
function sumarNotas(){
    let notafinal = 0;
    lista.forEach((lista)=>{
        if (lista["notaC"]!=""&& lista["notaC"]!= null) notafinal = notafinal + parseInt(lista["notaC"]);
    });
    return notafinal;
}
function sumar() {
    let total = 0;
    $(".pts").each(function() {
      if (isNaN(parseFloat($(this).val()))) {
        total += 0;
      } else {
        total += parseFloat($(this).val());
      }
    });
    document.getElementById('nota-final').innerHTML = total;
    $('#nota-final').val(total);
  }

/*-------calificar----*/
const cargar_preguntas=()=>{
    $('.nombre-alumno').text(getNombreAlumno(idaem_seleccionado));
    $('.input-nota-alumno').val(sumarNotas());
    $('.preg-resp').css('display','block');
    $('.preg-resp').children().remove();
    //debugger;
    for (var i = 0; i < lista.length; i++) {
        let id = lista[i]['id'];
        let idaem = lista[i]['idaem'];
        let notaC = lista[i]['notaC'];
        let notapreg = lista[i]['notapreg'];
        let pregunta =lista[i]['pregunta'];
        let tipo = lista[i]['tipo'];
        let img = lista[i]['img'];
        let respuesta = lista[i]['respuesta'];

        let exit_imagen="";
        if (img===null) {
            exit_imagen=``;
        }else{
            exit_imagen=`<button><img src="resources/${img}"></button>`;
        }
        
        let descripcion = `<div> <div class="numero-pregunta">
                                    <label for="">Pregunta N°${i+1}</label> 
                                </div>
                            </div>`;   
        let obs = `<div> <div class="observacion-calificar">
                                        <div class="observacion">
                                            <textarea name="observacion[]" id="obs" cols="30" rows="3"placeholder="Inserte Observacion"></textarea> 
                                        </div>
                                    </div> 
                             </div>`;                     
        if (tipo==1) {
            if(respuesta==null){
                respuesta="";
            }
            let observaciones = lista[i]['observacion'];
            
            observaciones.forEach(fila=>{  
                    obs = `<div> <div class="observacion-calificar">
                                        <div class="observacion">
                                            <textarea name="observacion[]" id="obs" cols="30" rows="3"placeholder="Observacion">${fila.observacion}</textarea> 
                                        </div>
                                    </div> 
                             </div>`;  
            })
            $('.preg-resp').append(
                `<div>
                    ${descripcion}
                        <div class="descripcion-esc-rel">
                            <div class="pregunta-escrita">${pregunta}</div>
                            <div class="nota-imagen">
                                <input class="input pts" name="notaPregEsc[]" type="number" min="0" max="${notapreg}" value="${notaC}" onchange="sumar(this.value);">  /${notapreg}
                                <input type="hidden" name="notasPreg[]" value="${notapreg}">
                                <input type="hidden" name="tip[]" value="1">
                                <input type="hidden" name="idpregEsc[]" value=${id}>
                                ${exit_imagen}
                            </div>
                        </div>
                    <div class="respuesta-corregir">
                        <div class="respuesta-escrita"> 
                            <textarea readonly="readonly">${respuesta}</textarea>
                        </div>
                    </div>
                    ${obs}
                </div>`  
            ); 
        }
        if (tipo==2) {
            let opcorrecta =lista[i]['op_correcta'];
            let op_alum =lista[i]['op_correcta_alum'];
            let opciones =lista[i]['opciones'];
            let acumulador="";
            let correcto="";
            let vacio="";
            if (opcorrecta==op_alum) {
                notaC=notapreg;
                correcto=`<img class="op-correcta1"style="display:block;" src="svg/bien.svg" alt="">
                <img class="op-incorrecta1"style="display:none;" src="svg/close.svg" alt="">`;
            }else{
                notaC=0;
                correcto=`<img class="op-correcta1"style="display:none;" src="svg/bien.svg" alt="">
                <img class="op-incorrecta1"style="display:block;" src="svg/close.svg" alt="">`;
                
                if (op_alum===null) {
                    vacio=`<label class="vacio">"Sin responder"</label>`;  
                }
            }
            
            opciones.forEach(fila=>{  
                if ((fila.nro_op == opcorrecta && opcorrecta==op_alum)||(fila.nro_op==opcorrecta)){
                    acumulador = acumulador + `<div>
                    <Label>Opcion${fila.nro_op}:</Label>
                    <input class="opcion-text resp-correcta" id="opcion-input-text" type="text"name="opcion[]" value="${fila.opcion}" readonly="readonly">
                    </div>`;   
                    
                } else if(fila.nro_op != opcorrecta && fila.nro_op != op_alum){
                    acumulador = acumulador + `<div>
                    <Label>Opcion${fila.nro_op}:</Label>
                    <input class="opcion-text" id="opcion-input-text" type="text"name="opcion[]" value="${fila.opcion}" readonly="readonly">
                    </div>`;
                } else if ( fila.nro_op != opcorrecta && fila.nro_op == op_alum){
                     acumulador = acumulador+`<div>
                            <Label>Opcion${fila.nro_op}:</Label>
                            <input class="opcion-text resp-incorrecta" id="opcion-input-text" type="text"name="opcion[]" value="${fila.opcion}" readonly="readonly">
                            </div>` 
                }
            })
           
            $('.preg-resp').append(
                `<div>
                    ${descripcion}
                    <div class="descripcion-esc-rel">
                                    <div class="pregunta-escrita">${pregunta}</div>
                                    <div class="nota-imagen">
                                        <input class="input pts" type="number" name="notapregSel[]" min="0" max="${notapreg}" value="${notaC}" onchange="sumar(this.value);" readonly> /${notapreg}
                                        <input type="hidden" name="idpregSel[]" value="${id}">
                                        <input type="hidden" name="tip[]" value="2">
                                        ${exit_imagen}
                                    </div>
                                </div>
                    <div class="respuesta-seleccion">
                        <div class="opciones-cal">
                            ${acumulador}
                        </div>
                        <div class="bien-mal">
                            ${correcto}
                            ${vacio}
                        </div>
                    </div>
                </div>`  
            ); 
        }
        if (tipo==3) {
            let vf_alum = lista[i]['vf_alumno'];
            let vf = lista[i]['vf'];
            let correctovf="";
            if (vf==vf_alum) {
                notaC=notapreg;
                correctovf=`<img class="op-correcta1"style="display:block;" src="svg/bien.svg" alt="">
                <img class="op-incorrecta1"style="display:none;" src="svg/close.svg" alt="">`;
            }else{
                notaC=0;
                correctovf=`<img class="op-correcta1"style="display:none;" src="svg/bien.svg" alt="">
                <img class="op-incorrecta1"style="display:block;" src="svg/close.svg" alt="">`;

            }
                 $('.preg-resp').append(
                    `<div>
                        ${descripcion}
                        <div class="descripcion-esc-rel">
                                    <div class="pregunta-escrita">${pregunta}</div>
                                    <div class="nota-imagen">
                                        <input class="input pts" type="number" name="notapregvf[]" min="0" max="${notapreg}" value="${notaC}" onchange="sumar(this.value);" readonly> /${notapreg}
                                        <input type="hidden" name="idpregvf[]" value="${id}">
                                        <input type="hidden" name="tip[]" value="3">
                                        ${exit_imagen}
                                    </div>
                        </div>
                        <div class="respuesta-seleccion">
                            <div class="input-vf">
                                <div class="f-v"> 
                                    <input type="radio" class="resultadoAlum" id="false${i+1}" disabled>
                                    <label for="vf">Falso</label>
                                </div>
                                <div class="f-v">   
                                    <input type="radio" class="resultadoAlum" id="true${i+1}" disabled>
                                    <label for="vf">Verdadero</label>
                                </div>   
                            </div>
                            <div class="bien-mal">
                                ${correctovf}
                            </div>
                        </div>                    
                    </div>` 
                );
                _checked_vf(vf_alum,i+1);
                console.log("opcion escogida por el estudiante: ",vf_alum);
        }
        if (tipo==4) {
            let relaciones= lista[i]['relacion'];
            let acumulador="";
            let index=1;
            relaciones.forEach(fila=>{ 
                let correcto=`<div style="display:block;" class="rel-correcta"><img src="svg/bien.svg" alt=""></div>`
                let incorrecta=`<div class="rel-incorrecta"><img src="svg/close.svg" alt=""></div>`
                let correccion= (fila.op_correcto == fila.nro_alum)?correcto:incorrecta;  

                if(fila.tipo1==1 && fila.tipo2==2){   
                    acumulador = acumulador +`<div>
                    <div class="detalle-enun agregado" id="${rel+1}">
                        <div class="num"><label class="num-enu">${index++}</label> </div>
                        <div class="text-ima img-alumno" id="box-img1${rel+1}" style="display:block;">
                            <img id="imagen1${rel+1}" src="resources/${fila.campo1}">
                        </div>
                        <div class="trazado"> </div>
                        <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${fila.nro_alum}" readonly="readonly"></div>
                        <div style="display:block;" class="texto tex2" id="textc2${rel+1}">
                            <textarea class= "text-rel2" id="textarea-text-alum" name="campo2[]" readonly="readonly">${fila.campo2}</textarea>
                        </div>
                        <div></div>
                        <div class="corregir">  
                            ${correccion}
                        </div>
                    </div>
                </div>`
                }
                if(fila.tipo1==2 && fila.tipo2==2){
                    acumulador = acumulador +`<div>
                        <div class="detalle-enun agregado" id="${rel+1}">
                            <div class="num"><label class="num-enu">${index++}</label> </div>
                            <div style="display:block;" class="texto tex1" id="textc1${rel+1}"> 
                                <textarea class= "text-rel1" id="textarea-text-alum" name="campo1[]"  readonly="readonly">${fila.campo1}</textarea> 
                            </div>
                            <div class="trazado"></div>
                            <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${fila.nro_alum}" readonly="readonly"></div>
                            <div style="display:block;" class="texto tex2" id="textc2${rel+1}">
                                <textarea class= "text-rel2" id="textarea-text-alum" name="campo2[]"  readonly="readonly">${fila.campo2}</textarea>
                            </div>
                            <div></div>
                            <div class="corregir">  
                                ${correccion}
                            </div>
                        </div>
                    </div>` 
                    
                }
                if(fila.tipo1==1 && fila.tipo2==1){
                    acumulador = acumulador+`<div>
                    <div class="detalle-enun agregado" id="${rel+1}">
                        <div class="num"><label class="num-enu">${index++}</label> </div>
                            <div class="text-ima img-alumno" id="box-img1${rel+1}" style="display:block;">
                                    <img id="imagen1${rel+1}" src="resources/${fila.campo1}" name="img1">
                            </div>
                            <div class="trazado"></div>
                            <div class="opcion-enun"><input type="number" min="0"  name="correcto[]" value="${fila.nro_alum}" readonly="readonly"></div>
                            <div class="text-ima img-alumno" id="box-img2${rel+1}" style="display:block;">
                                <img id="imagen2${rel+1}" src="resources/${fila.campo2}" name="img2">
                            </div> 
                            <div></div>
                            <div class="corregir">  
                                ${correccion}
                            </div>
                        </div>` 
                }
                if(fila.tipo1==2 && fila.tipo2==1){
                    acumulador=acumulador+`<div>
                    <div class="detalle-enun agregado" id="${rel+1}">
                        <div class="num"><label class="num-enu">${index++}</label> </div>
                        <div style="display:block;" class="texto tex1" id="textc1${rel+1}"> 
                            <textarea class= "text-rel1" id="textarea-text-alum" name="campo1[]"  readonly="readonly">${fila.campo1}</textarea> 
                        </div>
                        <div class="trazado"> </div>
                        <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${fila.nro_alum}" readonly="readonly"></div>
                        <div class="text-ima img-alumno" id="box-img2${rel+1}" style="display:block;">  
                                <img id="imagen2${rel+1}" src="resources/${fila.campo2}">  
                        </div> 
                        <div></div>
                        <div class="corregir">  
                            ${correccion}
                        </div> 
                    </div>
                </div>` 
                }                            
            })
                    $('.preg-resp').append(
                        ` <div>
                            <div class="numero-pregunta">
                                <label class="">Pregunta N°${i+1}</label> 
                            </div>
                            <div class="descripcion-esc-rel">   
                                <div class="pregunta-seleccion">${pregunta}</div>
                                <div class="nota-imagen"> 
                                    <input class="input pts" type="number" name="notapregRel[]" min="0" max="${notapreg}" value="${notaC}" onchange="sumar(this.value);">  /${notapreg} 
                                    <input type="hidden" name="notasRelacion[]" value="${notapreg}">
                                    
                                    <input type="hidden" name="idpregRel[]" value="${id}">
                                    <input type="hidden" name="tip[]" value="4">

                                </div>

                            </div>
                            <div class="respuesta-relacionamiento">
                                <div class="detalle-enun-alum">
                                    ${acumulador}
                                </div>
                            </div> 
                        </div>`  
                    ); 
        } 
    } 
    sumar();
}
const validar_notas =() =>{
    let notapreg=document.getElementsByName("notaPregEsc[]");
    let notarel=document.getElementsByName("notaPregRel[]");
    if(notapreg==""||notarel=="")return false;
    return true; 
}
/**----------------*/
const guardar_notaC_observacion = () =>{ 
    if(validar_notas()){
        let formData = new FormData($('.form-calificar-evaluacion')[0]);
        formData.append("idaem",idaem_seleccionado);
        let request = $.ajax({
                              url: "controlador/em_alum_observaciones.php?usr=doc&op=guardar_observacion_notaC",
                              type: "POST",
                              data: formData,
                              processData: false,  // tell jQuery not to process the data
                              contentType: false,
                              async:false   // tell jQuery not to set contentType
                            }).responseText;
                   
        if(request=="Ok"){
            Swal.fire("Calificado correctamente");
            obtener_lista_alumnos(curso_seleccionado,paralelo_seleccionado,codeva_seleccionado);
        } 
        if(request=="errorNota"){
            Swal.fire("Campos vacios");
        } 
        if(request=="NotaMayor"){
            Swal.fire("La nota no puede ser mayor a la nota de la pregunta");
        } 
        
    }else{
        Swal.fire("Debe llenar los campos requeridos correctamente :()...");
    }    
}

//---------------------//
const obtener_Formulario_opciones = (codpreg) =>{
         $.post(
             "controlador/opcion_em_controlador.php?usr=doc&op=obtener_opcion",
             {codpreg:codpreg},
         datos=>{
             let status=datos.status;
             if (status=="ok"){
                 lista= datos.lista;
             } 
             cargar_formulario_opciones(codpreg);
         },
         "json"
         ); 
}

function removeElement(event) {
    event.path[2].remove();
}

(function load() {
    const agregar=document.getElementById("agregar-opcion");
    agregar.addEventListener("click", e=> {
        e.preventDefault();
        let div_opcion = document.createElement('div');
        div_opcion.innerHTML = `<div>
                                    <Label>Opcion</Label>
                                    <input class="opcion-text" id="opcion-input-text" type="text"name="opcion[]" value="">
                                    <input type="radio" name="checkoption" class="selector" onclick="_checkoption();">
                                    <button class="eliminar-opcion puntero ocultar" id="remover"onclick="removeElement(event)"><img src="svg/close.svg"></button>
                                </div>`;
        let div_opciones = document.getElementById('form-opcion');
        div_opciones.appendChild(div_opcion);
    });
})()

function DeleteElement(event) {
    event.path[2].remove();
    num--;
}

(function load() {
    const add = document.getElementById("agregar-relacion");
    add.addEventListener("click", e=> {
        e.preventDefault();
        let div_relacion = document.createElement('div');
           div_relacion.innerHTML = `<div>
                                        <div class="detalle-enun agregado" id="${rel+1}">
                                            <div class="num"><label class="num-enu">${num+1}</label> </div>
                                            <div style="display:none;" class="texto tex1" id="textc1${rel+1}"> 
                                                <textarea class= "text-rel1" id="textarea-text" name="campo1[]"></textarea> 
                                            </div>
                                            <div class="text-imagen relacion1" id="teximgc1${rel+1}"> 
                                                <div class= "text-img campo1">
                                                    <button class="text">
                                                        <img src="svg/text1.svg" alt="" onclick="agregar_textC1('textc1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">      
                                                    </button>
                                                    <button class="img" >
                                                        <img src="svg/imagen1.svg" alt="" class="add-photo" onclick="agregar_imagenC1('box-img1${rel+1}','teximgc1${rel+1}','c1${rel+1}','tipoc1${rel+1}');">                                  
                                                    </button>
                                                    <input type="hidden" name="tipoC1[]" class="tipo1" id="tipoc1${rel+1}"> 
                                                </div>
                                            </div>
                                            <div class="text-ima" id="box-img1${rel+1}" style="display:none;">
                                                <div class="container">
                                                    <img id="imagen1${rel+1}">
                                                </div>
                                                <input type="file" class="inputimg" id="inputC1${rel+1}" name="imagen1[]" accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen1${rel+1}')"hidden>                            
                                                <div class="inputselect" onclick="selectimg('inputC1${rel+1}');"> seleccionar archivo</div>
                                            </div>
                                            <div class="trazado"> 
                                                <div> 
                                                    <button style="display:none;" class="btn-elim " id="c1${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar('textc1${rel+1}','teximgc1${rel+1}','box-img1${rel+1}','c1${rel+1}','tipoc1${rel+1}');"> </button>
                                                </div>
                                            </div>
                                            <div class="opcion-enun"><input type="number" min="1" name="correcto[]"></div>
                                            <div style="display:none;" class="texto tex2" id="textc2${rel+1}">
                                                <textarea class= "text-rel2" id="textarea-text" name="campo2[]"></textarea>
                                            </div>
                                            <div class="text-imagen relacion2" id="teximgc2${rel+1}">
                                                 <div class="text-img campo2">
                                                    <button class="text">
                                                        <img src="svg/text1.svg" alt="" class="add-text" onclick="agregar_textC2('textc2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">                          
                                                    </button>
                                                    <button class="img">
                                                        <img src="svg/imagen1.svg" alt="" onclick="agregar_imagenC2('box-img2${rel+1}','teximgc2${rel+1}','c2${rel+1}','tipoc2${rel+1}');">
                                                    </button>
                                                    <input type="hidden" name="tipoC2[]" class="tipo2" id="tipoc2${rel+1}"> 
                                                </div>
                                            </div>
                                            <div class="text-ima" id="box-img2${rel+1}" style="display:none;">
                                                <div class="container">
                                                    <img id="imagen2${rel+1}">
                                                </div>
                                                <input type="file" class="inputimg" id="inputC2${rel+1}" name="imagen2[]"  accept="image/png, image/jpeg, image/jpg" onchange="cargaImagen(event,'imagen2${rel+1}')" hidden>
                                                <div class="inputselect" onclick="selectimg('inputC2${rel+1}');"> seleccionar archivo</div>
                                            </div> 
                                            <button style="display:none;" class="btn-elim" id="c2${rel+1}"><img src="svg/intercambiar.svg" onclick="cambiar2('textc2${rel+1}','teximgc2${rel+1}','box-img2${rel+1}','c2${rel+1}','tipoc2${rel+1}');"></button>
                                            <button class="btn-elim" id="eliminar-relacion" onclick="DeleteElement(event)"><img src="svg/close.svg"></button>
                                        </div>
                                    </div>  `;
        rel++;
        num++;
        let div_relacionar = document.getElementById('relacion');
        div_relacionar.appendChild(div_relacion);    
    });
})()

const selectimg =(img2)=>{
    $(`#${img2}`).click();
}
const cambiar =(textc1,teximgc1,boximg1,c1,idinput)=>{
        $(`#${textc1}`).css('display','none');   
        $(`#${boximg1}`).css('display','none');   
        $(`#${teximgc1}`).css('display','block');
        $(`#${idinput}`).val("");
    $(`#${c1}`).css('display','none');  
}
const cambiar2 =(textc2,teximgc2,boximg2,c2,idinput)=>{
        $(`#${textc2}`).css('display','none');   
        $(`#${boximg2}`).css('display','none');   
        $(`#${teximgc2}`).css('display','block');
        $(`#${idinput}`).val("");
        $(`#${c2}`).css('display','none'); 
}
const input_checked = (op) =>{
    op_correcta=op;
    let opciones = document.querySelectorAll('.selector');
    opciones[op-1].checked = true;
}
const input_checked_vf = (v_f) =>{
    let opciones = document.querySelectorAll('.resultado');
    opciones[v_f-1].checked = true;
}
const _checked_vf = (vf_alum,nro) =>{
    if(vf_alum!== null){
        if (vf_alum == 1){
            $(`#false${nro}`).attr('checked', true);
        }else{
            $(`#true${nro}`).attr('checked', true);
        }
        console.log("no me acuerdo que era vf: ",vf);
    } 
}
const agregar_imagenC1 = (boximg1,teximgc1,c1,idinput) =>{ 
    $(`#${boximg1}`).css('display','block'); 
    $(`#${teximgc1}`).css('display','none');
    $(`#${c1}`).css('display','block');  
    $(`#${idinput}`).val(1);
}
const agregar_textC1 = (textc1,teximgc1,c1,idinput) =>{
    $(`#${textc1}`).css('display','block');   
    $(`#${teximgc1}`).css('display','none');
    $(`#${c1}`).css('display','block');
    $(`#${idinput}`).val(2);
}
const agregar_imagenC2 = (boximgC2,teximgc2,c2,idinput) =>{
    $(`#${boximgC2}`).css('display','block'); 
    $(`#${teximgc2}`).css('display','none');
    $(`#${c2}`).css('display','block');  
    $(`#${idinput}`).val(1);
}
const agregar_textC2 = (textc2,teximgc2,c2,idinput) =>{
    $(`#${textc2}`).css('display','block');   
    $(`#${teximgc2}`).css('display','none');
    $(`#${c2}`).css('display','block');  
    $(`#${idinput}`).val(2);
}
function cargaImagen(event,imagen) {
    var Imagen = event.target.files[0];
    if (Imagen.type === "image/png" || Imagen.type === "image/jpeg"|| Imagen.type === "image/jpg") {
      document.getElementById(imagen).src = URL.createObjectURL(event.target.files[0]);
    } else {
      alert("De momento solo aceptamos imágenes PNG, JPG y JPEG");
    }
}
//reevaluar al alumno
const delete_evaluacion_alu = (idaem, nombre)=>{
    Swal.fire({
        title: 'Alerta',
        text: `Se eliminarán todos los registros de la evaluación de: ${nombre}\ndesea continuar?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
            if (result.isConfirmed) {
              $.post(
                    "controlador/em_alumno_controlador.php?usr=doc&op=EliminarEvaluacion",
                    {idaem:idaem},
                    data=>{
                        if (data=="ok") {
                            Swal.fire("Estudiante habilitado para la Re-Evaluación");
                            obtener_lista_alumnos_re(curso_seleccionado,paralelo_seleccionado,codeva_seleccionado);
                        }else{
                            Swal.fire({
                                title: 'El estudiante NO realizó la evaluación...',
                                confirmButtonText: `OK`,
                               })
                        } 
                    }
                );     
            }
    }); 
}
const obtener_lista_alumnos_re=(codcur, codpar, codeva)=>{
    $(".form-calificar-evaluacion").css('display','none');
    $('.contenido-formulario').css('display','none');
    $('.lista-Alumnos').css('display','block');
    curso_seleccionado=codcur;
    paralelo_seleccionado=codpar;
    codeva_seleccionado=codeva;
    $.post(
             "controlador/evaluacion_mixta_controlador.php?usr=doc&op=getListaAlumnos",
             {codcur:codcur,
             codpar:codpar,
             codeva:codeva},
             datos=>{
                let status=datos.status;
                if (status=="ok"){
                    lista_alumnos= datos.lista_alumnos;
                }
                cargarAlumnos_reevaluar();
            },
            "json"
        );
}
const cargarAlumnos_reevaluar=()=>{
    $('.lista-alum').children().remove();
    $(".btn-atras").css('display','block');
    for (var i = 0; i < lista_alumnos.length; i++) {
        let idaem = lista_alumnos[i]['id'];
        let nombres= lista_alumnos[i]['nombre'];
        let paterno = lista_alumnos[i]['paterno'];
        let materno = lista_alumnos[i]['materno'];
        let notafinal =lista_alumnos[i]['notafinal'];
        let nombreCompleto=paterno+" "+materno+" " +nombres;
        let style="background-color:cadetblue;border-radius:7px;height:24px;padding:6px;";
        let reevaluar="Reevaluar";
        if(idaem===null){
            style=""; 
            notafinal="No Realizado";
            reevaluar="";
        }
        if (notafinal===null) {
            style="background-color:#dd6666e6;border-radius:7px;height:24px;padding:6px;";
            notafinal="No calificado";
            reevaluar="Reevaluar";                
        }
        $('.lista-alum').append(
            `<li >
                <div class="grid">
                    <div class="conte"><button class="nro-alumno" onclick="delete_evaluacion_alu(${idaem},'${nombreCompleto}')"><span class="badge-num">${i+1}</span>
                        <span class="nombreAlumno">${paterno} ${materno} ${nombres} </span>
                        <span class="notaAlumno" style=${style}>${reevaluar}</span>
                        <img src="svg/chevron-right.svg">
                        </button>
                    </div>
                </div>   
            </li>`
        );
    } 
}
/*---------------------------*/ 
$(document).ready(()=>{
    obtener_cursos();
   // $('#atras-curso').css('display','none');
    $('#atras-lista').click(()=>{
        if (modificando) {
            modificando = false;
            obtener_lista_alumnos(curso_seleccionado,paralelo_seleccionado,codeva_seleccionado);
        } else {
            obtenerFormulario(codeva_seleccionado);
        }
    });
    $('#guardar-form').click(()=>guardar_evaluacion());
    $('#cancelar-form').click(()=>obtener_lista_Eval(curso_seleccionado,paralelo_seleccionado,materia_seleccionada));
    $("#guardar-escrito").click(()=>guardar_pregunta());
    $("#cancelar-form-tipo").click(()=>obtener_banco_preguntas(codeva_seleccionado));
    $("#cancelar-escrito").click(()=>get_formulario_preguntas());
    $('#botones-C').click(()=>obtener_cursos());
    $('#botones-M').click(()=>obtener_materias(curso_seleccionado,paralelo_seleccionado));
    $('#botones-L').click(()=>obtener_lista_Eval(curso_seleccionado,paralelo_seleccionado,materia_seleccionada));
    $('#botones-E').click(()=>obtenerFormulario(codeva_seleccionado)); 
    $('#atras-preg').click(()=>obtenerFormulario(codeva_seleccionado));
    $('#Atras').click(()=>obtenerFormulario(codeva_seleccionado));  
    $('.form-EvaluacionMixta').submit((e)=>{e.preventDefault()});
    $('.form-lista-preguntas').submit((e)=>{e.preventDefault()});
    $('.form-seleccion').submit((e)=>{e.preventDefault()});
    $('.form-calificar-evaluacion').submit((e)=>{e.preventDefault()});
    $('#Calificar').click(()=>guardar_notaC_observacion());
    $('#agregar-preguntas').click(()=>get_formulario_preguntas());
    $('#atras-svg').click(()=>obtener_lista_alumnos(curso_seleccionado,paralelo_seleccionado,codeva_seleccionado));
    $('#form-atras').click(()=>obtener_banco_preguntas(codeva_seleccionado));
    $('#boton-banco-preguntas').click(()=>obtener_banco_preguntas(codeva_seleccionado));
    $('#revisar-alumnos').click(()=>obtener_lista_alumnos(curso_seleccionado,paralelo_seleccionado,codeva_seleccionado));
    $('#boton-reevaluar').click(()=>obtener_lista_alumnos_re(curso_seleccionado,paralelo_seleccionado,codeva_seleccionado));
});