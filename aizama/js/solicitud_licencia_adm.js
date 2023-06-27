let alumnos;
let lista_alumnos = [];
let lista = [];
let codalu;
let lista_licencia=[];
let licencia=[];
let id_seleccionado;
let fecha=fecha_actual();
function obtener_alumnos() {
    
    $.post(
        '../aizama/controlador/alumno_controlador.php?op=get_all&usr=tut',
        datos => {
            lista = datos.lista;
            cargar_alumnos();
        },
        "json"
    );
}
function fecha_actual() {
    let fecha = new Date();
    let mes = fecha.getMonth()+1; 
    let dia = fecha.getDate(); 
    let ano = fecha.getFullYear(); 
    if(dia<10)
          dia='0'+dia; //agrega cero si el menor de 10
    if(mes<10)
    mes='0'+mes //agrega cero si el menor de 10
    return  ano+"-"+mes+"-"+dia;
}
function cargar_alumnos() {
    $('#tabla').css('display',"block");
    for (var i = 0; i < lista.length; i++) {
        let nombre = lista[i]['nombre'];
        $('#select-alu').append(`<option value="${i}">${nombre}  </option>`);
    }
    i++;
}

function obtener_curso_alu(index) {
    
    $('#input-curso').val(lista[index].curso);
  
}

function cargar_curso() {
   
    for (var i = 0; i < lista.length; i++) {
        let curso = lista[i]['curso'];
       // $('#select-curso').append(`<option value="${i}">${curso}</option>`);
        $('#input-curso').val(curso);
    }
    i++;
}
const validar_form = ()=>{
    let motivo = $('#motivo-lic').val();
	let fechai = $('#f_ini').val();
    let fechaf = $('#f_fin').val();
	if(motivo==""||fechai==""||fechaf=="")return false;
	return true;
}
const limpiar_form = ()=>{
    $('#motivo-lic').val("");
    $('#f_ini').val("");
    $('#f_fin').val("");
}

const guardar_licencia = ()=>{
	if(validar_form()){
		let formData = new FormData($('#form-licencia')[0]);
        formData.append("codalu",codalu);
		let request = $.ajax({
							  url: "../aizama/controlador/licencias_controlador.php?usr=tut&op=guardar_licencia",
							  type: "POST",
							  data: formData,
							  processData: false,  // tell jQuery not to process the data
							  contentType: false,
							  async:false   // tell jQuery not to set contentType
							}).responseText;
		if(request=="ok"){
			Swal.fire("Licencia guardada exitosamente");
            obtener_licencias(codalu);
        }
        if (request=="errorHora1"){
            Swal.fire("La fecha final es menor a la fecha inicio...");
        }
        if (request=="errorHora2"){
            Swal.fire("Ya hay una licencia programada para esa fecha");
        }
        /*if (request=="errorFecha"){
            Swal.fire("No puede solicitar licencia para fechas anteriores a la actual");
        }*/
	}else{
		Swal.fire("Debe llenar los campos requeridos...");
	}
}
function obtener_licencias(codalu) {
    
    $('#tabla').css('display','block');
   limpiar_form();
    
    $('#actualizar_licencia').css('display',"none");
    $('#guardar_licencia').css('display','block')
    $('#lista-licencia-alumno').empty();
    $.post(
        '../aizama/controlador/licencias_controlador.php?op=get_licencias&usr=tut',
        {codalu:codalu},
        datos => {
            let status=datos.status;
                if (status=="ok"){
                    lista_licencia = datos.lista_licencia;
                }
            cargar_licencias();
        },
        "json"
    );
}
function cargar_licencias()
{ 
    let indice=1;
	lista_licencia.forEach((lic)=>{
    let id=lic['id'];
	let fechaini=lic['f_ini'];
	let fechafin=lic['f_fin'];
	let motivo=lic['obs'];
        
	$('#lista-licencia-alumno').append(
	                `<tr>
	                    <td data-label="Nro.">${indice}</td>
	                    <td data-label="Fecha Inicio">${fechaini}</td>
	                    <td data-label="Fecha Fin">${fechafin}</td>
                        <td data-label="Motivo">${motivo}</td>
                        
	                    <td data-label="Opción">
                            <div class="edit-eliminar">
                                <img id="editar${indice}" style="cursor:pointer;" src="images/edit.svg" onclick="obtener_licencia_id(${id})">
                                <img id="eliminar${indice}" style="cursor:pointer;" src="vista/svg/close.svg" onclick="eliminar_licencia(${id})">
                            </div>                  
                        </td>
                    </tr>`
	    );
        if (fechaini<fecha) {
           $(`#editar${indice}`).css('display','none');
           $(`#eliminar${indice}`).css('display','none');
        }
        indice++;
	});

}
const update_licencia = id=>{
    
	if(validar_form()){
		Swal.fire({
		    title: 'Alerta',
		    text: "Se realizarán cambios en la licencia...\ndesea continuar?",
		    icon: 'warning',
		    showCancelButton: true,
		    confirmButtonColor: '#3085d6',
		    cancelButtonColor: '#d33',
		    confirmButtonText: 'Si',
		    cancelButtonText: 'No'
		}).then((result) => {
			    if (result.isConfirmed) {
                    let formData = new FormData($('#form-licencia')[0]);
					formData.append("id",id_seleccionado);
                    formData.append("codalu",codalu);
                    
					let request = $.ajax({
										  url: "../aizama/controlador/licencias_controlador.php?op=Update_licencias&usr=tut",
										  type: "POST",
										  data: formData,
										  processData: false,  // tell jQuery not to process the data
										  contentType: false,
										  async:false   // tell jQuery not to set contentType
										}).responseText;
					if(request=="ok"){
                        Swal.fire("Licencia actualizada exitosamente...");
						obtener_licencias(codalu);
					}
                    if (request=="errorHora1"){
                        Swal.fire("La fecha inicio no puede ser menor a la fecha actual...");
                    }  
                    if (request=="errorHora2"){
                        Swal.fire("Ya hay una licencia programada para esa fecha");
                    }  
                    /*if (request=="errorFecha"){
                        Swal.fire("No puede solicitar licencia para fechas anteriores a la actual");
                    }*/
			    }
			  }); 
	}else{
		Swal.fire("Debe llenar los campos  requeridos...");
	}
}
const eliminar_licencia = id=>{
	Swal.fire({
	    title: 'Alerta',
	    text: "Se anulará la licencia...\ndesea continuar?",
	    icon: 'warning',
	    showCancelButton: true,
	    confirmButtonColor: '#3085d6',
	    cancelButtonColor: '#d33',
	    confirmButtonText: 'Si',
	    cancelButtonText: 'No'
	}).then((result) => {
		    if (result.isConfirmed) {
		      $.post(
					"../aizama/controlador/licencias_controlador.php?op=delete_licencias&usr=tut",
					{id:id}, 
					data=>{
                        //console.log(data.trim()+"hhhh");
						if (data.trim()=="Ok") { 
							Swal.fire("Licencia eliminada exitosamente...");
                            obtener_licencias(codalu);

						}
					}
				);     
		    }
	}); 	
}

function obtener_licencia_id(id) {
    $('.botones').css('display','block')
    $('#guardar_licencia').css('display','none')
    $('#actualizar_licencia').css('display','block')
    $('#f_ini').focus();
    $.post(
        '../aizama/controlador/licencias_controlador.php?op=get_licencia_id&usr=tut',
        {id:id},
        datos => {
            let status=datos.status;
                if (status=="ok"){
                    licencia = datos.licencia;
                    console.log(licencia);
                }
            cargar_formulario_lic();
        },
        "json"
    );
}

const cargar_formulario_lic=()=>{
    for (let i = 0; i < licencia.length; i++) {
        let fechai = licencia[i]['f_ini'];
        let fechaf = licencia[i]['f_fin'];
        let motivo = licencia[i]['obs'];
        let id=licencia[i]['id'];
        id_seleccionado=id;
        $('#f_ini').val(fechai);
        $('#f_fin').val(fechaf);
        $('#motivo-lic').val(motivo);
    }
}

const limpiar = ()=>{
    $('#select-alu').val("");
    $('#input-curso').val("");
    $('#tabla').css('display','none');
    limpiar_form()
}


$(document).ready(() => {
    $('#select-alu').select2();
    /*$('#f_ini').change(()=>{
      
        let solicitud = document.getElementById("f_ini").value;
        
        if (solicitud>=fecha) {
            $('.botones').css('display','block')
        }else{
            $('.botones').css('display','none')
            Swal.fire("No puede solicitar licencia para fechas anteriores a la actual");
            //$('#f_ini').val(fecha);
        }
        $('#f_fin').val(solicitud);
    });*/
    $('#f_fin').bind("click",function(){
        $('#f_fin').val($('#f_ini').val());
    });
    
    $('#guardar_licencia').click(()=>guardar_licencia());
    $('#actualizar_licencia').click(()=>update_licencia());
    $('#cancelar_licencia').click(()=>limpiar());
    obtener_alumnos();
    $('#select-alu').change(() => {
        $('#input-curso').val("");
        let index = $('#select-alu').val();
        if(index!=""){
            codalu = lista[index].codalu;
            obtener_curso_alu(index);
            obtener_licencias(codalu);
        }
        
    });
    $('#form-licencia').submit((e)=>{e.preventDefault()});
});