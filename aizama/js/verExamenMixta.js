let preguntas_alu = [];
let info = [];
let Preg = 1;
let tiempo = 0;
let resta;
let idaem;
let materia;
let exit_imagen;
let tipo_seleccionado;
let rel = 0;
let fin=1;
let notafinal;
let op_alumno;// opcion escogida por el alumno
let op_vf; //v o f respuesta alumno
let rel_alumno; // respuesta del relacion  alumno

const input_checked = (op_alum) =>{
    op_alumno=op_alum;
    let opciones = document.querySelectorAll('.selector');
    if (op_alum !== null) {
        opciones[op_alumno-1].checked = true;
    }
}

const input_checked_vf = (vf_alumno) =>{
    let opciones = document.querySelectorAll('.resultadoAlum');
    if (vf_alumno !== null ){  
        opciones[vf_alumno-1].checked = true;
    }
}
// obtener id de una evaluacion en proceso.
const obtener_eval_proceso =()=>{
    let codeva = $('#codeva').val();
    $.post(
        "controlador/em_alumno_controlador.php?usr=alu&op=ver_evaluacion",
        {id:codeva},     
        datos=>{
                 let status = datos['status'];
                 if(status=="noEval"){
                    Swal.fire({
                        title: 'No se encontró ninguna evaluación disponible...!!!',
                        confirmButtonText: `OK`,
                      }).then((result) => {
                                        /* Read more about isConfirmed, isDenied below */
                                        if (result.isConfirmed) {
                                          location.href = "evaluaciones_mixta_alu.php";
                                        }
                                      })
                }
                if (status=="ok") {
                    info = datos['info'];
                    idaem = datos['id_eval'];
                    materia= datos['materia'];
                    obtener_preguntas_alumno(idaem);
                }
            },
            "json"
    );
}

const obtener_preguntas_alumno =(idaem)=>{
    idaem_seleccionado = idaem; 
    $('.lista-Alumnos').css('display','none');
    $('.form-calificar-evaluacion').css('display','block');
    $.post(
        "controlador/em_alum_pregunta_controlador.php?usr=doc&op=get_preg_eval_alum",
             {idaem:idaem},
             datos=>{
                let status=datos.status;
                if (status=="ok"){
                    preguntas_alu= datos.lista;
                    notafinal=datos.notafinal;
                    proceso=datos.proceso;
                }
                
                cargar_preguntas();
            },
            "json"
    );
}
const cargar_preguntas=()=>{
    document.getElementById('materia').innerHTML = "Materia: "+ materia;
    document.getElementById('descripcion').innerHTML = info[0]['descripcion'];
    let indice = 1;
    $('#botones').empty();
	preguntas_alu.forEach(()=>{
		$('#botones').append(
				`<button class="unselected" id="btn${indice}" onclick="mostrarPregunta(${indice})">${indice}</button>`
			);
		indice++;
	});
	mostrarPregunta(Preg);

}

function mostrarPregunta(nroPreg) {
    $('.detalle_pregunta').children().remove();
	$(`#btn${Preg}`).removeClass("selected");
	$(`#btn${Preg}`).addClass("unselected");
	$(`#btn${nroPreg}`).removeClass("unselected");
	$(`#btn${nroPreg}`).addClass("selected");
    if (notafinal===null) {
        document.getElementById('h1').innerHTML = "--No calificado--";
    }else{
        document.getElementById('h1').innerHTML = notafinal;
    }
    
	document.getElementById('npreg').innerHTML = "Pregunta "+nroPreg;
    /* preguntar de que tipo es  */
    let pregunta = preguntas_alu[nroPreg-1]['pregunta'];
    let tipo = preguntas_alu[nroPreg-1]['tipo'];
    let notaC = preguntas_alu[nroPreg-1]['notaC'];
    if (notaC===null) {
        notaC = "--No calificado--";
    }
    tipo_seleccionado= tipo;
    if (tipo!=4) {
      let img= preguntas_alu[nroPreg-1]['img']; 
       exit_imagen="";
        if (img===null) {
            exit_imagen=``;
        }else{
            exit_imagen=`<img id="imagen" src="resources/${img}" style="max-width: 200px; padding:15px;background: white;margin-top: 10px; display: block;" alt="imagen" onclick="mostrarImg();" />`;
        } 
    }
    switch (tipo) {
        case 1:
            let respuesta= preguntas_alu[nroPreg-1]['respuesta'];
            exit_respuesta="";
                if (respuesta===null) {
                    exit_respuesta=`<textarea id="respuesta" class="respuesta" placeholder="No inserto respuesta" readonly="readonly"></textarea>`;
                }else{
                    exit_respuesta=`<textarea id="respuesta" class="respuesta" readonly="readonly">${respuesta} </textarea>`;
                } 
            let observacion= preguntas_alu[nroPreg-1]['observacion']; 
                if (observacion===null) {
                    exit_obs=`<textarea id="respuesta" class="respuesta" placeholder="No hay observacion" readonly="readonly"></textarea>`;
                }else{
                    exit_obs=`<textarea id="respuesta" class="respuesta" readonly="readonly">${observacion} </textarea>`;
                } 

            $('.detalle_pregunta').append(
                `<div>
                    <div>
                    <label for="pregunta">Pregunta:</label>
                        <p class="pregunta" id="pregunta">${pregunta}</p>
                    </div>
    
                    <div style="text-align:center;">${exit_imagen}</div>
                    <label for="respuesta">Respuesta:</label>
                    ${exit_respuesta}
                    
                    <label for="observaciones">Observacion:</label>
                    ${exit_obs}
                    <div class=nota>
                        <label class="labelnotaC">Nota:</label> 
                        <p class="notaC" id="notaC">${notaC}</p>  
                    </div> 

                </div>`  
            ); 
            break;
        case 2:
            let opciones = preguntas_alu[nroPreg-1]['opciones'];
            let op_alum =preguntas_alu[nroPreg-1]['op_correcta_alum'];
            console.log(op_alum);
            let acumulado ="";
            opciones.forEach(fila=>{
                acumulado = acumulado + `<div>
                    <Label>Opcion${fila.nro_op}:</Label>
                    <input class="opcion-text" id="opcion-input-text" type="text"name="opcion[]" value="${fila.opcion}" readonly="readonly">
                    <input type="radio" name="checkoption" class="selector radio" disabled>
                    </div>`;
            })
            $('.detalle_pregunta').append(
                `<div>
                    <div>
                        <label for="pregunta">Pregunta:</label>
                        <p class="pregunta" id="pregunta">${pregunta}</p>
                    </div>
                        
                  
                    <div style="text-align:center;">${exit_imagen}</div>
                    <label for="respuesta">Respuesta:</label>
                    <div class="opciones-cal" style="text-align: center;">
                        ${acumulado}
                    </div> 
                    <div class=nota>
                        <label class="labelnotaC">Nota:</label>     
                            <p class="notaC" id="notaC">${notaC}</p>
                        </div>
                </div>`  
            );
           /* if (op_alumno !== undefined) {
                op_alum=op_alumno;
            }*/
            if (op_alum !== undefined) {
                op_alumno=op_alum;
            }
            input_checked(op_alum); 

            break;
        case 3:
            let vf_alumno = preguntas_alu[nroPreg-1]['vf_alumno'];
            $('.detalle_pregunta').append(
                `<div>
                    <div>
                        <label for="pregunta">Pregunta:</label>
                        <p class="pregunta" id="pregunta">${pregunta}</p>
                    </div>
                   
                        <div style="text-align:center;">${exit_imagen}</div>
                    <label for="respuesta">Respuesta:</label>
                    <div class="respuesta-seleccion">
                        <div class="input-vf" style= "margin:10px 70px;">
                            <div class="f-v"> 
                                <input type="radio" name="resultadoAlum" id="resultado_fv" class="resultadoAlum radio" disabled>
                                <label for="vf">Falso</label>
                            </div>
                            <div class="f-v">   
                                <input type="radio" name="resultadoAlum" id="resultado_fv" class="resultadoAlum radio" disabled>
                                <label for="vf">Verdadero</label>
                            </div>   
                        </div>
                    </div>
                     <div class=nota>
                     <label class="labelnotaC">Nota:</label> 
                        <p class="notaC" id="notaC">${notaC}</p>   
                    </div>
                    
                </div>`  
            ); 
            if (op_vf !== undefined) {
                vf_alumno=op_vf;
            }
            input_checked_vf(vf_alumno); 

            break;
        case 4:
            let relaciones = preguntas_alu[nroPreg-1]['relacion'];
            let acumulador="";
            let index=1;
            relaciones.forEach(fila=>{ 
                if(fila.tipo1==1 && fila.tipo2==2){   
                    acumulador = acumulador +`<div>
                    <div class="detalle-enun agregado" id="${rel+1}">
                        <div class="num"><label class="num-enu">${index++}</label> </div>
                        <div class="text-ima img-alumno" id="box-img1${rel+1}" style="display:block;">
                        <img id="imagen1${rel+1}" src="resources/${fila.campo1}" alt="imagen " onclick="mostrarImgRelacion('imagen1${rel+1}');" >
                        </div>
                        <div class="trazado"> </div>
                        <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${fila.nro_alum}" readonly="readonly"></div>
                        <div style="display:block;" class="texto tex2" id="textc2${rel+1}">
                            <textarea class= "text-rel2" id="textarea-text-alum" name="campo2[]" readonly="readonly">${fila.campo2}</textarea>
                        </div>
                        <div></div>
                        
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
                            
                        </div>
                    </div>` 
                    
                }
                if(fila.tipo1==1 && fila.tipo2==1){
                    acumulador = acumulador+`<div>
                    <div class="detalle-enun agregado" id="${rel+1}">
                        <div class="num"><label class="num-enu">${index++}</label> </div>
                            <div class="text-ima img-alumno" id="box-img1${rel+1}" style="display:block;">
                                <img id="imagen1${rel+1}" src="resources/${fila.campo1}" name="img1" alt="imagen " onclick="mostrarImgRelacion('imagen1${rel+1}');">
                            </div>
                            <div class="trazado"></div>
                            <div class="opcion-enun"><input type="number" min="0"  name="correcto[]" value="${fila.nro_alum}" readonly="readonly"></div>
                            <div class="text-ima img-alumno" id="box-img2${rel+1}" style="display:block;">
                            <img id="imagen2${rel+1}" src="resources/${fila.campo2}" name="img2" alt="imagen " onclick="mostrarImgRelacion('imagen2${rel+1}');">
                            </div> 
                            <div></div>
                            
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
                        <div class="opcion-enun"><input type="number" min="0" name="correcto[]" value="${fila.nro_alum}"readonly="readonly"></div>
                        <div class="text-ima img-alumno" id="box-img2${rel+1}" style="display:block;">  
                            <img id="imagen2${rel+1}" src="resources/${fila.campo2}" alt="imagen " onclick="mostrarImgRelacion('imagen2${rel+1}');" > 
                        </div> 
                        <div></div>
                        
                    </div>
                </div>` 
                }
                rel++;                            
            })
            $('.detalle_pregunta').append(
                `<div>
                    <div>
                    <label for="pregunta">Pregunta:</label>
                        <p class="pregunta" id="pregunta">${pregunta}</p>
                    </div>                    
                    
                    <label for="respuesta">Respuesta:</label>
                    <div class="respuesta-relacionamiento" style="text-align:center;">
                        <div class="detalle-enun-alum">
                            ${acumulador}
                        </div>  
                    </div>
                    <div class=nota>
                        <label class="labelnotaC">Nota:</label> 
                        <p class="notaC" id="notaC">${notaC}</p>
                    </div>
                </div>`  
            ); 
            break;    
        default:
            break;
    }
	Preg = nroPreg;
	
}
function mostrarImgRelacion(id){
    console.log(id);
	Swal.fire({
        
			imageUrl: document.getElementById(`${id}`).src
	});
}
function siguiente() {
	if (Preg<preguntas_alu.length) {
		guardarRespuesta(Preg+1);
	}
}
function anterior() {
	if (Preg>1) {
		guardarRespuesta(Preg-1);
	}
}
function guardarRespuesta(nroPreg) {
    switch (tipo_seleccionado) {
      
        case 1:
            /* verificar---- fin=1?*/ 
            let resp = $('#respuesta').val();
            let respA = preguntas_alu[Preg-1]['respuesta'];
            let idpreg = preguntas_alu[Preg-1]['id'];
            let id_proceso = preguntas_alu[Preg-1]['idaem'];  
            if(resp!=""&&resp!=respA&&fin!=0){
                preguntas_alu[Preg-1]['respuesta'] = resp;
                $.post(
                        'controlador/em_alumno_preg_escrito_controlador.php?usr=alu&op=save_respuesta_escrita',
                        {idpreg:idpreg,respuesta:resp,idaem:id_proceso}
                    );
            } 
            break;
        case 2:
            let codpreg = preguntas_alu[Preg-1]['id'];
            let idaem = preguntas_alu[Preg-1]['idaem']; 
            let Ant = preguntas_alu[Preg-1]['vf_alumno'];
            if(op_alumno!=""&&op_alumno!=Ant&&fin!=0){
                preguntas_alu[Preg-1]['respuesta'] = op_alumno;
                //preguntas_alu[Preg-1]['op_correcta_alum'] = op_alumno;
                
                $.post(
                        'controlador/opcion_correcta_em_controlador.php?usr=alu&op=save_respuesta_op',
                        {idpreg:codpreg, op_alumno:op_alumno,idaem:idaem}
                    );
            }     
            console.log("guardar op_alumno: ", op_alumno)   
            break;
        case 3:
            //let  resp_t3 = op_vf;
            let id_preg = preguntas_alu[Preg-1]['id'];
            let proc = preguntas_alu[Preg-1]['idaem']; 
            let respAnt = preguntas_alu[Preg-1]['vf_alumno'];
            if(op_vf!=""&&op_vf!=respAnt&&fin!=0){
                preguntas_alu[Preg-1]['respuesta'] = op_vf;
                //preguntas_alu[Preg-1]['vf_Alumno'] = op_vf;
                
                $.post(
                        'controlador/verdadero_falso_Controlador.php?usr=alu&op=save_detalle_pregunta_vf',
                        {idpreg:id_preg, op_vf:op_vf,idaem:proc}
                    );
            }
            console.log("guardar op_vf: ", op_vf)            
            break;
        case 4:
            let relacion = preguntas_alu[Preg-1]['relacion'];
                for (let i= 0; i < relacion.length; i++) {
                    let idrel = relacion[i]['id'];
                    let id_aem = preguntas_alu[Preg-1]['idaem']; 
                    console.log('id_aem: ', id_aem);
                    let anterior = relacion[i]['nro_alum'];
                    console.log('anterior: ', anterior);
                    let rel_alumno=document.getElementsByName("correcto[]")[i].value;
                   
                    if(rel_alumno !="" && rel_alumno != anterior && fin !=0){
                    relacion[i]['nro_alum'] = rel_alumno;
                    console.log("rel_Alumno: ", rel_alumno);
                    $.post(
                            'controlador/relacionar_controlador.php?usr=alu&op=save_respuesta_relacion',
                            { id:idrel, idaem:id_aem, correcto:rel_alumno}
                        );
                        console.log("idrel", idrel)
                }
                
                console.log("guardar rel_alumno: ", rel_alumno)
                    
                }
            break;
                
        default:
            break;
    }
	mostrarPregunta(nroPreg);
}
// hacaer una copia del guardar respuesta
function mostrarImg(){
	Swal.fire({
			imageUrl: document.getElementById('imagen').src
	});
}

function salir(){
	location.href = "evaluaciones_mixta_alu.php";
}

/*---------------------------*/ 
$(document).ready(()=>{
    obtener_eval_proceso();

});