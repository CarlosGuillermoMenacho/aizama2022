let lista_alumnos = [];
const request_alumnos = () => {
	$.get(
		"controlador/alumno_controlador.php?op=get_all&usr=adm",
		datos => {
			if(datos.status == "eSession")location.href="administracion.php";
			if(datos.status == "noData")$('.no-cursos').removeClass('oculto');
			if (datos.status == "ok") {
				lista_alumnos = datos.lista;
				cargar_alumnos(0,0);
				//mostrar_lista(0,0);
			}


		},
		"json"
	)
}
const cargar_alumnos = (codcur,codpar) => {
	$(".div-content-lista").empty();
		
	if(codcur == 0){
		lista_alumnos.forEach(alumno => {
			$(".div-content-lista").append(
				`<div class="item_alumnos"><div class="div-codalu">${alumno.codalu}</div><div>${alumno.name}</div></div>`);
		});
	}

	if(codcur != 0){
		if(codpar == 0){
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur){
					$(".div-content-lista").append(
				`<div>${alumno.nombre}</div>`);
				}
			});
		}else{
			lista_alumnos.forEach(alumno => {
				if(alumno.codcur == codcur && alumno.codpar == codpar){
					$(".div-content-lista").append(
				`<div>${alumno.nombre}</div>`);
				}
			});
		}
	}
}
$(document).ready(()=>{
	$("#seleccionar_alumno").select2({width:"320px"});
	request_alumnos();
})