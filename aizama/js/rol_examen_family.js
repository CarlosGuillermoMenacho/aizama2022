
const mostrar_roles = (data,head) => {
	let campos = "";
	head.forEach(campo => {
		campos = `${campos}<td class="border-left">${campo}</td>`;
	});
	$("#head").empty();
	$("#body").empty();
	$("#head").append(
			`<tr>
                <td class="index">Nro.</td>
                ${campos}
            </tr>`
		);
	let index = 1;
	data.forEach(rol => {
		let materia = rol[0];
		let descripcion = rol[1];
		let dia = rol[2];
		let fecha = rol[3];
		let hora = rol[4];
		$("#body").append(`
		    <tr id="rol${index}">
		        <td class="border-top index">${index}</td>
		        <td class="border-td">${materia}</td>
		        <td class="border-td">${descripcion}</td>
		        <td class="border-td">${dia}</td>
		        <td class="border-td">${fecha}</td>
		        <td class="border-td">${hora}</td>
		    </tr>   
		`);
		index++;
	});
	$('#tabla_lista').removeClass('oculto');
	$(".btn-float-back").removeClass("oculto");
}

const get_rol = codalu => {
	$('#tabla_lista').addClass('oculto');
	$.post(
		"controlador/controlador_rol_de_examen.php?op=get_rol_tut",
		{codalu:codalu},
		data => {
			if(data.status == "eSession"){
				alert("La sesión ha expirado...");
				location.href = "familia.php";
			}
			if (data.status == "noData") {
				$("#noData").removeClass("oculto");
				$(".btn-float-back").removeClass("oculto");
				$('#tabla_lista').addClass('oculto');
			}
			if(data.status == "ok"){
				let head = ["materia","descripcion","dia","fecha","hora"];
				mostrar_roles(data.data,head);
			}
		},"json"
		);
}
const mostrar_alumnos = (data,head) => {
	
	let campos = "";
	head.forEach(campo => {
		campos = `${campos}<td class="border-left">${campo}</td>`;
	});
	$("#head").empty();
	$("#head").append(
			`<tr>
                <td class="index">Nro.</td>
                ${campos}
            </tr>`
		);
	let index = 1;
	$("#body").empty();
	data.forEach(row => {
		let codalu = row.codalu;
		let nombre = row.nombre;
		let curso = row.curso;
		$("#body").append(`
		    <tr id="rol${index}">
		        <td class="border-top index">${index}</td>
		        <td class="border-td">${nombre}</td>
		        <td class="border-td">${curso}</td>
		        <td class="border-td cel-op"><div class="cel-opciones"><img onclick="get_rol(${codalu})" src="images/lista.svg"/></div></td>
		    </tr>   
		`);
		index++;
	});
	$('#tabla_lista').removeClass('oculto');
}

const obtener_rol_examen = () => {
	$.get(
		"controlador/controlador_rol_de_examen.php?op=get_rol_alu",
		data => {
			if(data.status == "eSession"){
				alert("La sesión ha expirado...");
				location.href = "familia.php";
			}
			if (data.status == "noData") {
				$("#noData").removeClass("oculto");
				$('#tabla_lista').addClass('oculto');
			}
			if (data.status == "eTrimestre") {
				Swal.fire("Debe seleccionar el trimestre...");
			}
			if(data.status == "ok"){
				mostrar_tabla(data.data);
			}
		},"json"
		);
}
const obtener_alumnos = () => {
	$.get(
		"controlador/tutor_controlador.php?usr=tut&op=get_alumnos",
		data => {
			if(data.status == "eSession"){
				alert("La sesión ha expirado...");
				location.href = "usuarios.php";
			}
			if(data.status == "ok"){
				let lista_alumnos = data.lista_alumnos;
				let head = ["nombre","curso","rol de ex&aacute;menes"];
				
				mostrar_alumnos(lista_alumnos,head);

			}
		},"json"
		);
}
$(document).ready(()=>{
	obtener_alumnos();
	$(".btn-float-back").click(()=>{
		$('#tabla_lista').addClass('oculto');
		$(".btn-float-back").addClass("oculto");
		$("#noData").addClass("oculto");
		obtener_alumnos();
	})
})