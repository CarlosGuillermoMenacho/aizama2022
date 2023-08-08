let video_list = [];
const visto = id => {
	$.post(
		"controlador/videos_youtube_controlador.php?op=visto",
		{id:id},
		data => {
			console.log(data.status);
		},"json"
	);
}
const show_video = id => {
	for (var i = 0; i < video_list.length; i++) {
		if(video_list[i].id == id){
			let enlace = video_list[i].enlace.split("=");
			$("#frame").attr("src",`https://www.youtube.com/embed/${enlace[1]}?controls=1&autoplay=1`);
		}
	}
	visto(id);
}
const cargarVideos = lista => {
	let enlace = lista[0].enlace.split("=");
	$("#frame").removeClass("oculto");
	$("#frame").attr("src",`https://www.youtube.com/embed/${enlace[1]}?controls=1&autoplay=1`);
	lista.forEach(f => {
		$("#div-lista").append(
			`<div class="div-main-card" onclick="show_video(${f.id})">
		            <div class="div-video-screen">
		                <img src="miniaturas/${f.captura}">
		            </div>
		            <div class="div-video-tag">
		                <p class="title-video">${f.titulo}</p>
		                <p>Unidad Educativa Aizama</p>
		                <p>${f.vistas} . ${f.tiempo}</p>
		            </div>
		        </div>`
		);

	});
	$("#div-lista").removeClass("oculto");
}
const init = () => {
	$.get(
		"controlador/videos_youtube_controlador.php?op=get_videos",
		data => {
			if(data.status == "ok"){
				video_list = data.data;
				cargarVideos(video_list);
			}
		},"json"
	);
}
$(window).on("resize",function () {
        let width = $("#frame").width();
        $("#frame").height(width/1.8);
      console.log()
  })
$(document).ready(()=>{
	let width = $("#frame").width();
	$("#frame").height(width/1.8);
	init();
})