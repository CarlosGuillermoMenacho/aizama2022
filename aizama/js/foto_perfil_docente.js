let __lista = [];
const init = async () => {
	await $.get(
		"controlador/profesor_controlador.php?op=get_profesores&usr=adm",
		data => {
			if(data.status == "ok"){
				__lista = data.data;
			}
			if (data.status == "eSession") {
				Swal.fire("La sesión ha finalizado debe ingresar de nuevo con su usuario y contraseña por favor...");
			}
		},"json"

	);
}
const change_img = codalu => {
	$("#codalu").val(codalu);
	$("#imagen").click();
}
const mostrar_lista = lista => {
	$("#body").empty();
	let index = 1;
	lista.forEach(a => {
		let img = `<img id="img${a.codprof}" src="img/user.svg" style="width: 50px; border-radius: 50%; cursor: pointer;" onclick="change_img('${a.codprof}')"/>`;
		if(a.perfil != "")img = `<img id="img${a.codprof}" src="fotoperfil/${a.perfil}" style="width: 50px; border-radius: 50%; cursor: pointer;" onclick="change_img('${a.codprof}')"/>`;
		$("#body").append(
			`<tr>
                <td class="border-top index">${index}</td>
                <td class="border-td fecha">${a.apeprof} ${a.nompro}</td>
                <td class="border-td content-img">${img}</td>
            </tr>`
		);
		index++;
	});
}

$(document).ready( async ()=>{
	await init();
	mostrar_lista(__lista);
	$("#imagen").change(()=>{
		if($("#imagen").val() != ""){
			let codalu = $("#codalu").val();
			let formData = new FormData($("#formulario")[0]);
			let response = $.ajax({
				url:"controlador/profesor_controlador.php?op=set_foto_perfil&usr=adm",
				type: "POST",
				data:formData,
				contentType: false, 
				processData: false,
				async:false
			}).responseText;
			let data = JSON.parse(response);
			if(data.status == "ok"){
				$(`#img${codalu}`).attr("src",data.img);
				$("#imagen").val("");
			}
		}
	})
});