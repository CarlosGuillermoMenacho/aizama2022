let lista = [];
const search = e => {
	if(e == "")return;
	let text = e.value.toUpperCase();
	$("#lista").empty();
	lista.forEach(a => {
		let aM = a.nombre.toUpperCase();
		if(aM.includes(text)){
			$("#lista").append(`
				  <div class="fila">
			        <div class="nombre">
			          ${a.nombre}
			        </div>
			        <button class="btn-submit" onclick="showFormulario(${a.codalu})">Habilitar</button>
			      </div>
			`);
		}
	})
}
const get_nombre = codalu => {
	for (var i = 0; i < lista.length; i++) {
		if(lista[i].codalu == codalu) return lista[i].nombre;
	}
	return "";
}
const showFormulario = codalu => {
	let nombre = get_nombre(codalu);
	$("#codalu").val(codalu);
	$(".nombre").html(nombre);
	$(".div-search").addClass("oculto");
	$(".div-formulario").removeClass("oculto");
}
const mostrar_lista = l => {
	$("#lista").empty();
	l.forEach(a => {
		$("#lista").append(`
			  <div class="fila">
		        <div class="nombre">
		          ${a.nombre}
		        </div>
		        <button class="btn-submit" onclick="showFormulario(${a.codalu})">Habilitar</button>
		      </div>
		`);
	});
	$(".div-search").removeClass("oculto");
}
const get_deshabilitados = () => {
	$.get(
		"controlador/alumno_controlador.php?op=get_deshabilitados&usr=adm",
		data => {
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado por favor vuelva a ingresar con su usuario y contraseña por favor...");
				return;
			}
			if(data.status == "ok"){
				lista = data.lista;
				mostrar_lista(lista);
			}
			if (data.status == "errorParam") {
				Swal.fire("Asegúrese de haber seleccionado curso y paralelo...");
				return;
			}
		},
		"json"
		);
}
const habilitar = () => {
	let formData = new FormData($("#formulario")[0]);
	let html = $.ajax(
		{
			url:"controlador/alumno_controlador.php?op=habilitar&usr=adm",
			type: "POST",
			data:formData,
			contentType: false, 	
			processData: false,
			async:false
		}
	).responseText;
	let data = JSON.parse(html);
	if(data.status == "eSession"){
		Swal.fire("La sesión ha finalizado por favor vuelva a ingresar con su usuario y contraseña por favor...");
		return;
	}
	if(data.status == "ok"){
		Swal.fire("Alumno habilitado exitosamente...");
		cancelar();
	}
}
const cancelar = () => {
	get_deshabilitados();
	$(".div-formulario").addClass("oculto");
	$(".div-formulario").empty();
	$(".div-formulario").append(
		`<form id="formulario">
			<input type="hidden" id="codalu" name="codalu">
		    <div class="titulo"><h2>Datos de habilitación</h2></div>
		    <div class="lista">
		    <div class="fila">
		        <div class="nombre">
		        </div>
		    </div>
		    </div>
		      <div class="div-select">
		        <select name="codcur" id="seleccionar_curso">
		          <option value="">Seleccione el curso...</option>
		          <option value="1">NIDITO</option>
		          <option value="2">POLLITO</option>
		          <option value="3">PREKINDER</option>
		          <option value="4">KINDER</option>
		          <option value="5">PRIMERO DE PRIMARIA</option>
		          <option value="6">SEGUNDO DE PRIMARIA</option>
		          <option value="7">TERCERO DE PRIMARIA</option>
		          <option value="8">CUARTO DE PRIMARIA</option>
		          <option value="9">QUINTO DE PRIMARIA</option>
		          <option value="10">SEXTO DE SECUNDARIA</option>
		          <option value="11">PRIMERO DE SECUNDARIA</option>
		          <option value="12">SEGUNDO DE SECUNDARIA</option>
		          <option value="13">TERCERO DE SECUNDARIA</option>
		          <option value="14">CUARTO DE SECUNDARIA</option>
		          <option value="15">QUINTO DE SECUNDARIA</option>
		          <option value="16">SEXTO DE SECUNDARIA</option>
		        </select>
		      </div>
		      <div class="div-select">
		        <select id="seleccionar_paralelo" name="codpar">
		          <option value="">Seleccione el paralelo...</option>
		          <option value="1">A</option>
		          <option value="2">B</option>
		          <option value="3">C</option>
		          <option value="4">D</option>
		          <option value="5">E</option>
		          <option value="6">F</option>
		        </select>
		      </div>
		      <div class="titulo"><h2>ACCESOS</h2></div>
		      <div class="div-accesos">
		        <div class="div-checkbox">
		          Plataforma <input type="checkbox" name="plataforma">
		        </div>
		        <div class="div-checkbox">
		          Evaluaciones <input type="checkbox" name="evaluacion">
		        </div>
		        <div class="div-checkbox">
		          Boletín <input type="checkbox" name="boletin">
		        </div>
		      </div>
		      <div class="div-btn">
		        <button class="btn-danger btn-100" onclick="cancelar();">CANCELAR</button>
		        <button class="btn-submit btn-100" onclick="habilitar()">ACEPTAR</button>  
		      </div>
		    </form>`
	);
}
$(document).ready(()=>{
	get_deshabilitados();
	$("#formulario").submit(e=>{e.preventDefault()});
})