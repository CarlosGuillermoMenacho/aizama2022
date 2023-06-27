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
let op_alumno;//op_alumno = 0; opcion escogida por el alumno
let op_vf; //op_vf = 0;v o f  respuesta alumno
let rel_alumno;//  respuesta del relacion  alumno
let proceso;

// opcion escogida por el estudiante
function _checkoption (){
    let opciones = document.querySelectorAll('.selector');
    let op = 1;
    op_alumno=0;
    opciones.forEach(opcion=>{
        if(opcion.checked)op_alumno=op;
        op++;
    });//console.log("op_alumnoescogida marca",op_alumno);
}
const input_checked = (op_alum) =>{
    op_alumno=op_alum;
    console.log("op_alumnomarcado",op_alumno);
    let opciones = document.querySelectorAll('.selector');
    if (op_alumno !== null) {
        opciones[op_alumno-1].checked = true;
    }
}
//obtiene opcion escogina por el estudiante vf
function _resultado (){
    let opciones = document.querySelectorAll('.resultadoAlum');
    let op = 1;
    op_vf=0;
    opciones.forEach(opcion=>{
        if(opcion.checked)op_vf=op;
        op++;
    });//console.log("opcion_escogida ALUM: ", op_vf)
}
const input_checked_vf = (vf_alumno) =>{
    console.log("input_Checked VF: ", vf_alumno); 
    console.log("input_Checked OP_vf: ", op_vf);
    op_vf=vf_alumno;
    let opciones = document.querySelectorAll('.resultadoAlum');
    if (vf_alumno !== null ){    
        //opciones[op_vf-1].checked = true;
        opciones[vf_alumno-1].checked = true;
    }
}
// obtener id de una evaluacion en proceso.
const obtener_eval_proceso =()=>{
    $.post(//get
        "controlador/em_alumno_controlador.php?usr=doc&op=get_id_eval_proceso",
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
                    resta = datos['resta'];
                    info = datos['info'];
                    idaem = datos['id_eval'];
                    materia= datos['materia'];
                    obtener_preguntas_alumno(idaem);
                }
                if(status=="evalFinalizada"){
                    Swal.fire({
                        title: 'El tiempo para resolver la evaluación ha terminado...!!!',
                        confirmButtonText: `OK`,
                       }).then((result) => {
                                        /* Read more about isConfirmed, isDenied below */
                                        if (result.isConfirmed) {
                                          location.href = "evaluaciones_mixta_alu.php";
                                        }
                               })
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
                    proceso=datos.proceso;
                }
                cargar_preguntas();
            },
            "json"
    );
}
const cargar_preguntas=()=>{
    document.getElementById('materia').innerHTML = "Materia: "+ materia;
	document.getElementById('tiempo').innerHTML = "Tiempo: "+getTiempo(info[0]['tiempo']);
    document.getElementById('descripcion').innerHTML = info[0]['descripcion'];
    let indice = 1;
    $('#botones').empty();
	preguntas_alu.forEach(()=>{
		$('#botones').append(
				`<button class="unselected" id="btn${indice}" onclick="guardarRespuesta(${indice})">${indice}</button>`
			);
		indice++;
	});
	mostrarPregunta(Preg);
	iniciarReloj();
}
function getTiempo(time) {
	let h = Math.floor(time/60);
	let m = time%60;
	let r = "";
	if (h == 1) r = h + " hora ";
	if (h > 1) r = h + " horas ";
	if (m == 1)	r = r + m +" minuto.";
	if (m > 1)	r = r + m +" minutos.";
	return r;
}
function contador(){
	let horaActual = new Date();
	let dif = Math.abs(Math.floor((horaActual.getTime() - hora_device.getTime())/1000));
	if(dif<2){
		hora_device = horaActual; 
		let minutos = Math.floor(tiempo/60)%60;
		let horas = Math.floor(tiempo/3600);
		let segundos = tiempo%60;
			if (horas<10) {
				document.getElementById('h1').innerHTML = '0';
				document.getElementById('h2').innerHTML = horas;
			}else{
				document.getElementById('h1').innerHTML = Math.floor(horas/10);
				document.getElementById('h2').innerHTML = horas%10;
			}
		if (minutos<10) {
			document.getElementById('m1').innerHTML = '0';
			document.getElementById('m2').innerHTML = minutos;
		}else{
			document.getElementById('m1').innerHTML = Math.floor(minutos/10);
			document.getElementById('m2').innerHTML = minutos%10;
		}
		if (segundos<10) {
			document.getElementById('s1').innerHTML = '0';
			document.getElementById('s2').innerHTML = segundos;
		}else{
			document.getElementById('s1').innerHTML = Math.floor(segundos/10);
			document.getElementById('s2').innerHTML = segundos%10;
		}
		if (tiempo==0) {
			clearInterval(timer);
			finalizarEvaluacion1();
		}
		tiempo--;
	}else{
		finalizarTimer();
	}

}
function finalizarEvaluacion1() {
    guardarRespuesta2(Preg+1);
	/*Swal.queue([{
					    title: 'Advertencia',
					    confirmButtonText: 'Aceptar',
					    text: 'Se finalizará la evaluación...',
					    cancelButtonText: 'Cancelar',
					    cancelButtonColor: '#E6344A',
					    showLoaderOnConfirm: true,
					    showCancelButton: true,
					    preConfirm: function()
					    {*/
                            //document.getElementById('respuesta').readOnly = true;
                            proceso=0;
                            if (tipo_seleccionado!=1) {
                                let radiobutton = document.querySelectorAll('.radio');
                                radiobutton.forEach(radio=>{
                                    radio.disabled=true;
                                });
                            }else{
                                document.getElementById('respuesta').readOnly = true;
                            }       
								return $.post(
											'controlador/em_alumno_controlador.php?op=FinalizarEvaluacion&usr=alu',
											{idaem:idaem},
											(datos,estado,xhr)=>{
												if (datos=="ok") {
													$('#btn-finalizar').css('display','none');
													$('#btn-salir').removeClass('display-none')
													fin = 0;
													finalizarTimer();
													Swal.fire({
						                          title: 'Evaluación finalizada...!!!',
						                          confirmButtonText: `OK`,
						                        })
												}
											},"text"
									);				        
					    /*} 
					}]);*/
		
}
function finalizarTimer(){
    clearInterval(timer);
        document.getElementById('h1').innerHTML = "0";
        document.getElementById('h2').innerHTML = "0";
        document.getElementById('m1').innerHTML = "0";
        document.getElementById('m2').innerHTML = "0";
        document.getElementById('s1').innerHTML = "0";
        document.getElementById('s2').innerHTML = "0";
}
function mostrarPregunta(nroPreg) {
    $('.detalle_pregunta').children().remove();
	$(`#btn${Preg}`).removeClass("selected");
	$(`#btn${Preg}`).addClass("unselected");
	$(`#btn${nroPreg}`).removeClass("unselected");
	//mostrarImagen(nroPreg);
	$(`#btn${nroPreg}`).addClass("selected");
	document.getElementById('npreg').innerHTML = "Pregunta "+nroPreg;
    //document.getElementById('pregunta').innerHTML = preguntas_alu[nroPreg-1]['pregunta'];
    /* preguntar de que tipo es  */
    let pregunta = preguntas_alu[nroPreg-1]['pregunta'];
    let tipo = preguntas_alu[nroPreg-1]['tipo'];
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
    let bloquear;
    //console.log("proseso",proceso);
    if (proceso===0) {
           // console.log("prosesoentro",proceso);
        if (tipo!=1) {
            bloquear=`disabled`;
        }else{
            bloquear=`readonly`;
        }
        
    }else{
        bloquear=``;
    }
    switch (tipo) {
        case 1:
            let respuesta= preguntas_alu[nroPreg-1]['respuesta']; 
            exit_respuesta="";
                if (respuesta===null) {
                    exit_respuesta=`<textarea id="respuesta" class="respuesta" ${bloquear} placeholder="Escribe aquí tu respuesta"></textarea>`;
                }else{
                    exit_respuesta=`<textarea id="respuesta" class="respuesta" ${bloquear}>${respuesta}</textarea>`;
                } 
            $('.detalle_pregunta').append(
                `<div>
                <label for="pregunta">Pregunta:</label>
                <p class="pregunta" id="pregunta">${pregunta}</p>
                <div style="text-align:center;">${exit_imagen}</div>
                <label for="respuesta">Respuesta:</label>
                ${exit_respuesta} 
                </div>`  
            ); 
            
            break;
        case 2:
            let opciones = preguntas_alu[nroPreg-1]['opciones'];
            let op_alum =preguntas_alu[nroPreg-1]['op_correcta_alum'];
            let acumulado ="";
            opciones.forEach(fila=>{
                acumulado = acumulado + `<div>
                    <Label>Opcion${fila.nro_op}:</Label>
                    <input class="opcion-text" id="opcion-input-text" type="text"name="opcion[]" value="${fila.opcion}" readonly="readonly">
                    <input type="radio" name="checkoption" class="selector radio" onclick="_checkoption();" ${bloquear}>
                    </div>`;
            })
            $('.detalle_pregunta').append(
                `<div>
                <label for="pregunta">Pregunta:</label>
                <p class="pregunta" id="pregunta">${pregunta}</p>
                <div style="text-align:center;">${exit_imagen}</div>
                <label for="respuesta">Respuesta:</label>
                    <div class="opciones-cal" style="text-align: center;">
                        ${acumulado}
                    </div> 
                </div>`  
            );
            /*if (op_alumno !== undefined) {
                //op_alum=op_alumno;
                console.log("op_alumno diferente a undefined",op_alumno);
            }*/
            console.log("op_alumnoescogida", op_alumno);
            console.log("muestra op_alumno global: ", op_alumno);
            console.log("muestra op_alum: local", op_alum);
            
            input_checked(op_alum); 

            break;
        case 3:
            let vf_alumno = preguntas_alu[nroPreg-1]['vf_alumno'];
            $('.detalle_pregunta').append(
                `<div>
                    <label for="pregunta">Pregunta:</label>
                    <p class="pregunta" id="pregunta">${pregunta}</p>
                    <div style="text-align:center;">${exit_imagen}</div>
                    <label for="respuesta">Respuesta:</label>
                    <div class="respuesta-seleccion">
                                <div class="input-vf" style= "margin:10px 70px;">
                                    <div class="f-v"> 
                                        <input type="radio" name="resultadoAlum" id="resultado_fv" class="resultadoAlum radio" onclick="_resultado();"${bloquear}>
                                        <label for="vf">Falso</label>
                                    </div>
                                    <div class="f-v">   
                                        <input type="radio" name="resultadoAlum" id="resultado_fv" class="resultadoAlum radio" onclick="_resultado();" ${bloquear}>
                                        <label for="vf">Verdadero</label>
                                    </div>   
                                </div>
                    </div>  
                </div>`  
            ); 
            /*if (op_vf !== undefined) {
                vf_alumno=op_vf;
            }*/
            //console.log("muestra op_vf: ", op_vf);
            //console.log("muestra vf_alumno: ", vf_alumno);
            input_checked_vf(vf_alumno); 

            break;
        case 4:
            let relaciones = preguntas_alu[nroPreg-1]['relacion'];
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
                            <img id="imagen1${rel+1}" src="resources/${fila.campo1}" alt="imagen " onclick="mostrarImgRelacion('imagen1${rel+1}');" >
                        </div>
                        <div class="trazado"> </div>
                        <div class="opcion-enun"><input class="radio" type="number" min="0" name="correcto[]" value="${fila.nro_alum}" ${bloquear}></div>
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

                            <div class="opcion-enun"><input type="number" class="radio" min="0" name="correcto[]" value="${fila.nro_alum}" ${bloquear}></div>
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
                            <div class="opcion-enun"><input type="number" class="radio" min="0"  name="correcto[]" value="${fila.nro_alum}" ${bloquear}></div>
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
                        <div class="opcion-enun"><input type="number" class="radio" min="0" name="correcto[]" value="${fila.nro_alum}" ${bloquear}></div>
                        <div class="text-ima img-alumno" id="box-img2${rel+1}" style="display:block;">  
                                <img id="imagen2${rel+1}" src="resources/${fila.campo2}" alt="imagen " onclick="mostrarImgRelacion('imagen2${rel+1}');" >  
                        </div> 
                        <div></div>
                        
                    </div>
                </div>` 
                }   
            rel++;
            console.log(rel);                            
            })
            
            $('.detalle_pregunta').append(
                `<div>
                    <label for="pregunta">Enunciado:</label>
                    <p class="pregunta" id="pregunta">${pregunta}</p>
                    <label for="respuesta">Respuesta:</label>
                    <div class="respuesta-relacionamiento" style="text-align:center;">
                        <div class="detalle-enun-alum">
                            ${acumulador}
                        </div>  
                    </div>
                </div>`  
            ); 
            break;    
        default:
            break;
    }
	
	//document.getElementById('respuesta').value = preguntas_alu[nroPreg-1]['respuesta'];
	Preg = nroPreg;
	
}
function mostrarImgRelacion(id){
    console.log(id);
	Swal.fire({
        
			imageUrl: document.getElementById(`${id}`).src
	});
}
/*function mostrarImgRelacion2(id2){
    console.log("imagen2",id2);
	Swal.fire({  
			imageUrl: document.getElementById(`${id2}`).src
	});
}*/
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
            let Ant = preguntas_alu[Preg-1]['op_correcta_alum'];
            if(op_alumno!== undefined &&op_alumno!=Ant&&fin!=0){
                preguntas_alu[Preg-1]['op_correcta_alum'] = op_alumno;
                //preguntas_alu[Preg-1]['op_correcta_alum'] = op_alumno;
                $.post(
                        'controlador/opcion_correcta_em_controlador.php?usr=alu&op=save_respuesta_op',
                        {idpreg:codpreg, op_alumno:op_alumno,idaem:idaem}
                    );
            }     
            //console.log("guardar op_alumno: ", op_alumno)   
            break;
        case 3:
            //let  resp_t3 = op_vf;
            let id_preg = preguntas_alu[Preg-1]['id'];
            let proc = preguntas_alu[Preg-1]['idaem'];
            let respAnt = preguntas_alu[Preg-1]['vf_alumno'];
            console.log("op_vf",op_vf);
            console.log("respAnt",respAnt);
            console.log("fin",fin);
            if(op_vf !== undefined &&op_vf!=respAnt&&fin!=0){
                preguntas_alu[Preg-1]['vf_alumno'] = op_vf;
                console.log("guardar vf_alumno: ", op_vf);
                $.post(
                        'controlador/verdadero_falso_Controlador.php?usr=alu&op=save_detalle_pregunta_vf',
                        {idpreg:id_preg, op_vf:op_vf,idaem:proc}
                    );  
            }          
            break;
        case 4: 
            // variable global rel_alumno;
            let relacion = preguntas_alu[Preg-1]['relacion'];
                for (let i= 0; i < relacion.length; i++) {
                    let idrel = relacion[i]['id'];
                    let id_aem = preguntas_alu[Preg-1]['idaem']; 
                    let anterior = relacion[i]['nro_alum'];
                    let rel_alumno=document.getElementsByName("correcto[]")[i].value;
                   
                    if(rel_alumno !="" && rel_alumno != anterior && fin !=0){
                    relacion[i]['nro_alum'] = rel_alumno;
                    $.post(
                            'controlador/relacionar_controlador.php?usr=alu&op=save_respuesta_relacion',
                            { id:idrel, idaem:id_aem, correcto:rel_alumno}/*,
                            datos=>{
                                if(datos=="errorcant"){
                                   Swal.fire({
                                       title: `El número ${rel_alumno} no es válido...!!!`,
                                       confirmButtonText: `OK`,
                                     })
                                   // mostrarPregunta(nroPreg);
                                }
                           },*/
                          // "json"
                        );    
                    }
                }
            break;
                
        default:
            break;
    }
	mostrarPregunta(nroPreg);
}
function mostrarImg(){//Muesta la imagen de la pregunta
	Swal.fire({
			imageUrl: document.getElementById('imagen').src
	});
}
function iniciarReloj(){
	tiempo = resta;
	hora_device = new Date();
	timer = setInterval('contador()',1000);
}

function salir(){
	location.href = "evaluaciones_mixta_alu.php";
}

function finalizarEvaluacion() {
    guardarRespuesta2(Preg+1);
	Swal.queue([{
					    title: 'Advertencia',
					    confirmButtonText: 'Aceptar',
					    text: 'Se finalizará la evaluación...',
					    cancelButtonText: 'Cancelar',
					    cancelButtonColor: '#E6344A',
					    showLoaderOnConfirm: true,
					    showCancelButton: true,
					    preConfirm: function()
					    {proceso=0;
                            if (tipo_seleccionado!=1) {
                                let radiobutton = document.querySelectorAll('.radio');
                                radiobutton.forEach(radio=>{
                                    radio.disabled=true;
                                });
                            }else{
                                document.getElementById('respuesta').readOnly = true;
                            }           
								return $.post(
											'controlador/em_alumno_controlador.php?op=FinalizarEvaluacion&usr=alu',
											{idaem:idaem},
											(datos,estado,xhr)=>{
												if (datos=="ok") {
													$('#btn-finalizar').css('display','none');
													$('#btn-salir').removeClass('display-none')
													fin = 0;
													finalizarTimer();
													Swal.fire({
						                          title: 'Evaluación finalizada...!!!',
						                          confirmButtonText: `OK`,
						                        })
												}
											},"text"
									);				        
					    } 
					}]);
		
}

function guardarRespuesta2(nroPreg) {
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
            let Ant = preguntas_alu[Preg-1]['op_correcta_alum'];
            if(op_alumno!== undefined &&op_alumno!=Ant&&fin!=0){
                preguntas_alu[Preg-1]['op_correcta_alum'] = op_alumno;
                $.post(
                        'controlador/opcion_correcta_em_controlador.php?usr=alu&op=save_respuesta_op',
                        {idpreg:codpreg, op_alumno:op_alumno,idaem:idaem}
                    );
            }     
            break;
        case 3:
            //let  resp_t3 = op_vf;
            let id_preg = preguntas_alu[Preg-1]['id'];
            let proc = preguntas_alu[Preg-1]['idaem'];
             
            let respAnt = preguntas_alu[Preg-1]['vf_alumno'];
            if(op_vf !== undefined &&op_vf!=respAnt&&fin!=0){
                preguntas_alu[Preg-1]['vf_alumno'] = op_vf;
                console.log("guardar2 op_vf: ", op_vf)   
                $.post(
                        'controlador/verdadero_falso_Controlador.php?usr=alu&op=save_detalle_pregunta_vf',
                        {idpreg:id_preg, op_vf:op_vf,idaem:proc}
                    );
            }          
            break;
        case 4: 
            // variable global rel_alumno;
            let relacion = preguntas_alu[Preg-1]['relacion'];
                for (let i= 0; i < relacion.length; i++) {
                    let idrel = relacion[i]['id'];
                    let id_aem = preguntas_alu[Preg-1]['idaem']; 
                    //console.log('id_aem: ', id_aem);
                    let anterior = relacion[i]['nro_alum'];
                    let rel_alumno=document.getElementsByName("correcto[]")[i].value;
                   
                    if(rel_alumno !="" && rel_alumno != anterior && fin !=0){
                    relacion[i]['nro_alum'] = rel_alumno;
                    //console.log("rel_Alumno: ", rel_alumno);
                    $.post(
                            'controlador/relacionar_controlador.php?usr=alu&op=save_respuesta_relacion',
                            { id:idrel, idaem:id_aem, correcto:rel_alumno}/*,
                            datos=>{
                                if(datos=="errorcant"){
                                   Swal.fire({
                                       title: `El número ${rel_alumno} no es válido...!!!`,
                                       confirmButtonText: `OK`,
                                     })
                                    mostrarPregunta(nroPreg-1);
                                }
                           },*/
                          // "json"
                        );    
                    }
                }
            break;
                
        default:
            break;
    }
}
function server_ping()//ping al servidor
{
    $.ajax({
        url:'controlador/ping_controlador.php',
        type: "POST"
    });
}
var validateSession = setInterval(server_ping, 5000);
$(document).ajaxError(function( event, request, settings ) {
        //When XHR Status code is 0 there is no connection with the server
        if (request.status == 0){ 
            //alert("Communication with the server is lost!");
              Swal.fire({
                title: 'Alerta',
                text: `No tienes Internet. Comprueba la conexión.`,
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Si',
            }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
            });   
        } 

});
/*---------------------------*/ 
$(document).ready(()=>{
    obtener_eval_proceso();
    server_ping();
});