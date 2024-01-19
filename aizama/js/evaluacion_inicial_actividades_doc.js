let lista_cursos = [];
const get_actividades = curso => {
	$.post(
		"controlador/evaluacion_inicial_controlador.php?op=get_actividades_curso",
		{codcur:curso.codcur,codpar:curso.codpar},
		data => {

		},"json"
	)
}
const get_cursos = () =>{
	$.get(
		"controlador/profesor_controlador.php?op=get_cursos&usr=doc",
		data => {
			if (data.status == "eSession")Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión con su usuario y contraseña por favor...");
			
				lista_cursos = data.cursos;	
				if(lista_cursos.length == 1){
					get_actividades(lista_cursos[0]);
				}			
		},	
		"json"
	);
}
$(document).ready(()=>{
	get_cursos();
})