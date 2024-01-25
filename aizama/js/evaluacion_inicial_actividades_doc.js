let lista_cursos = [];
const revisar_actividad = (id,c,p) => {
	$.post(
		"controlador/evaluacion_inicial_controlador.php?op=revisar",
		{id:id,codcur:c,codpar:p},
		data => {

		},"json"
	);
}
const get_actividades = curso => {
	$.post(
		"controlador/evaluacion_inicial_controlador.php?op=get_actividades_curso",
		{codcur:curso.codcur,codpar:curso.codpar},
		data => {
			if (data.status == "ok") {
				$(".container").empty();

				let actividades = data.data;
				let index = 1;
				/*$(".container").append(
						`<div class="card" >
						    <img class="card-img-top" src="images/imagen.png" alt="Card image" style="width:100%">
						    <div class="card-body">
						      
						      <p class="card-text">Programar nueva actividad.</p>
						      <a href="#" class="btn btn-primary">Programar</a>
						    </div>
						  </div>`
					);*/
				actividades.forEach(a => {
					$(".container").append(
						`<div class="card" >
						    <img class="card-img-top" src="images/${a.captura}" alt="Card image" style="width:100%">
						    <div class="card-body">
						      <h4 class="card-title">Actividad ${index}</h4>
						      <p class="card-text">${a.descripcion}</p>
						      <a href="#" class="btn btn-primary" onclick="revisar_actividad(${a.id},${curso.codcur},${curso.codpar})">Revisar</a>
						    </div>
						  </div>`
					);
					index++;
				});
			}
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