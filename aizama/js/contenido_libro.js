const url = "https://agendaaizama.net/biblioteca_digital/biblioteca_digital.php";
let temas = [];
let material = [];
let complementario = [];
let numero_de_tema;
let numero_de_material;
function get_datos_libro(){
	let id = document.getElementById('libro').value;

	$.post(
			url+"?op=get_libro",
			{ id : id},
			(datos,estado,xhr) => {
				if (datos['status']=="ok") {
					$('#curso').val(datos['curso']);
					$('#materia').val(datos['materia']);
					$('#descripcion').val(datos['edicion']);
					$('#editorial').val(datos['editorial']);
					$('#enlace').val(datos['nombre']);
				}
				
			},
			"json"
			);

}
function nuevo_tema(){
	let tema = document.getElementById('tema').value;
	let profe = document.getElementById('codprof').value;
	if (tema == "") {
		alert("Debe llenar los campos necesarios...!!!");
		$('#tema').focus();
		return;
	}
	let id = document.getElementById('libro').value;
	$.post(
			url+"?op=nuevo_tema",
			{ id : id,tema:tema,codprof:profe},
			(datos,estado,xhr) => {
				if (datos=="ok") {
					alert("Tema creado exitosamente...!!!");
					obtener_temas_del_libro();
				}
				
			},
			"text"
			);

}
function nuevo_material(){
	let enlace = document.getElementById('enlace_material').value;
	let descripcion = document.getElementById('descripcion_material').value;

	if (enlace == "" || descripcion == "") {
		
		if (enlace == "") {
			$('#enlace_material').focus();
		}else if (descripcion == "") {
			$('#descripcion_material').focus();
		}
		alert("Debe llenar los campos necesarios...!!!");
		return;
	}
	let profe = document.getElementById('codprof').value;
	$.post(
			url+"?op=nuevo_material",
			{ tema : numero_de_tema,descripcion: descripcion,enlace:enlace,codprof:profe},
			(datos,estado,xhr) => {
				if(datos == "ok"){
					alert('Material asignado exitosamente');
					$('#enlace_material').val("");
					$('#descripcion_material').val("");
					actualizar_datos();
				}
			},
			"text"
			);

}
function actualizar_datos(){
	let id = document.getElementById('libro').value;
	$.post(
			url+"?op=temas",
			{ libro : id},
			(datos,estado,xhr) => {
				temas = datos['temas'];
				material = datos['material'];
				complementario = datos['material_complementario'];
				verCont(numero_de_tema);				
			},
			"json"
			);
}
function actualizar_datos_comple(){
	let id = document.getElementById('libro').value;
	$.post(
			url+"?op=temas",
			{ libro : id},
			(datos,estado,xhr) => {
				temas = datos['temas'];
				material = datos['material'];
				complementario = datos['material_complementario'];
				verRecursos(numero_de_material);				
			},
			"json"
			);
}
function obtener_temas_del_libro(){
	let id = document.getElementById('libro').value;
	$.post(
			url+"?op=temas",
			{ libro : id},
			(datos,estado,xhr) => {
				temas = datos['temas'];
				material = datos['material'];
				complementario = datos['material_complementario'];
				mostrar_temas();
				
			},
			"json"
			);
}
function obtener_temas_del_libro_material(tema_id){
	let id = document.getElementById('libro').value;
	$.post(
			url+"?op=temas",
			{ libro : id},
			(datos,estado,xhr) => {
				temas = datos['temas'];
				material = datos['material'];
				complementario = datos['material_complementario'];
				verCont(tema_id);
				
			},
			"json"
			);
}
function obtener_temas_del_libro_comple(comple_id){
	let id = document.getElementById('libro').value;
	$.post(
			url+"?op=temas",
			{ libro : id},
			(datos,estado,xhr) => {
				temas = datos['temas'];
				material = datos['material'];
				complementario = datos['material_complementario'];
				verRecursos(comple_id);
				
			},
			"json"
			);
}
function mostrar_temas(){
	$('#form_tema').css('display','block');
	$('#campos').empty();
	temas.forEach((tema)=>{
		let numero = tema['tem_numero'];
		let nombre = tema['tem_nombre'];
		let id = tema['tem_id'];
		$('#campos').append(`<tr>
								<td data-label="Número">${numero}</td>
								<td data-label="Tema">${nombre}</td>
								<td data-label="Contenido">
									<button id="btnContenido" class="btn"  onClick="verCont(${id})">Ver</button>
								</td>
							 </tr>`);
	});
	$('#tabla_contenido').css('display','none');
	$('#form_material').css('display','none');
	$('#tabla').css('display','block');
	

}
function verCont(id_tema){
	numero_de_tema = id_tema;
	$('#form_tema').css('display','none');
	$('#form_material_complementario').css('display','none');
	$('#form_material').css('display','block');
	$('#campos_material').empty();
	material.forEach((mat)=>{
		let tema_id = mat['mate_tema'];
		if(tema_id==id_tema){
			let descr = mat['mate_descripcion'];
			let enlace = mat['mate_enlace'];
			let numero = mat['mate_numero'];
			let mate_id = mat['mate_id'];
			let mate_tema = mat['mate_tema'];
			$('#campos_material').append(`<tr>
											<td data-label="Número">${numero}</td>
											<td data-label="Descripción">${descr}</td>
											<td data-label="Enlace"><a target="_blank" href="${enlace}" style="text-decoration: none;">Abrir enlace</a></td>
											<td data-label="Recursos"><button id="btnContenido" class="btn" onClick="verRecursos(${mate_id})">Ver</button>
											</td>
											<td data-label="Opciones"><button style="color: #E6344A;" onclick="eliminarMaterial(${mate_id},${numero},${mate_tema})">Eliminar</button></td>
										  </tr>`);
		}
	});
	$('#tabla').css('display','none');
	$('#tabla_complementario').css('display','none');
	$('#tabla_contenido').css('display','block');


}
function eliminarMaterial(mate_id,mate_numero,tema_id) {
	$.post(
			url+"?op=eliminarMaterial",
			{id_material:mate_id,numero:mate_numero,tema_id:tema_id},
			(datos,estado,xhr)=>{
				if (datos=="ok") {
					alert("Material eliminado...!!!");
					obtener_temas_del_libro_material(mate_id);
				}
			},
			"text"

		);
}
function verRecursos(id_material){
	numero_de_material = id_material;
	$('#form_tema').css('display','none');
	$('#form_material').css('display','none');
	$('#form_material_complementario').css('display','block');
	$('#campos_material_complementario').empty();
	console.log(numero_de_material);

	complementario.forEach((compl)=>{

		let tema_id = compl['mat_com_material'];
				if(tema_id == numero_de_material){

			let descr = compl['mat_com_descripcion'];
			let enlace = compl['mat_com_enlace'];
			let numero = compl['mat_com_numero'];
			let comple_id = compl['mat_com_id'];
			let id_material = compl['mat_com_material'];
			$('#campos_material_complementario').append(`<tr>
															<td data-label="Número">${numero}</td>
															<td data-label="Descripción">${descr}</td>
															<td data-label="Enlace"><a target="_blank" href="${enlace}" style="text-decoration: none;">Abrir enlace</a></td>
															<td data-label="Opciones"><button style="color:#E6344A;" onclick="eliminarRecurso(${comple_id},${numero},${id_material})">Eliminar</button></td>
														 </tr>`);

		}
		
	});
	$('#tabla').css('display','none');
	$('#tabla_contenido').css('display','none');
	$('#tabla_complementario').css('display','block');
}
function eliminarRecurso(comple_id,comple_numero,id_material) {
	$.post(
			url+"?op=eliminarComple",
			{id_comple:comple_id,numero:comple_numero,id_material:id_material},
			(datos,estado,xhr)=>{
				if (datos=="ok") {
					alert("Recurso eliminado...!!!");
					obtener_temas_del_libro_comple(comple_id);
				}
			},
			"text"

		);
}
function nuevo_recurso(){
	let enlace = document.getElementById('enlace_material_complementario').value;
	let descripcion = document.getElementById('descripcion_material_complementario').value;

	if (enlace == "" || descripcion == "") {
		
		if (enlace == "") {
			$('#enlace_material_complementario').focus();
		}else if (descripcion == "") {
			$('#descripcion_material_complementario').focus();
		}
		alert("Debe llenar los campos necesarios...!!!");
		return;
	}
	let profe = document.getElementById('codprof').value;
	$.post(
			url+"?op=nuevo_recurso",
			{ material : numero_de_material,descripcion: descripcion,enlace:enlace,codprof:profe},
			(datos,estado,xhr) => {
				if(datos == "ok"){
					alert('Recurso asignado exitosamente');
					$('#enlace_material_complementario').val("");
					$('#descripcion_material_complementario').val("");
					actualizar_datos_comple();
				}
			},
			"text"
			);
}
function atras(){
	let id = document.getElementById('libro').value;
	location.href = 'registro_libros.php?lib='+id;
	return;
}
$(document).ready(function() {
	get_datos_libro();	
	obtener_temas_del_libro();
	$('#asignarMateria').click(()=>nuevo_tema());
	$('#asiganrmaterial').click(()=>nuevo_material());
	$('#asiganrmaterialcomplementario').click(()=>nuevo_recurso());
	$('#formulario').on('submit',(event)=>event.preventDefault());
	$('#btnAtrasAlumnosBtn').click(()=>mostrar_temas());
	$('#btnAtrasMaterial').click(()=>verCont(numero_de_tema));
	$('#btnAtras').click(()=>atras());
			
})