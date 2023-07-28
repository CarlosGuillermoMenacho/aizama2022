let __lista = [];
const init = async () => {
	await $.get(
		"controlador/alumno_controlador.php?op=get_all&usr=adm",
		data => {
			if(data.status == "ok"){
				__lista = data.lista;
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
		let img = `<img id="img${a.codalu}" src="img/user.svg" style="width: 50px; border-radius: 50%; cursor: pointer;" onclick="change_img(${a.codalu})"/>`;
		if(a.foto != "")img = `<img id="img${a.codalu}" src="${a.foto}" style="width: 50px; border-radius: 50%; cursor: pointer;" onclick="change_img(${a.codalu})"/>`;
		$("#body").append(
			`<tr>
                <td class="border-top index">${index}</td>
                <td class="border-td fecha">${a.name}</td>
                <td class="border-td">${a.curso}</td>
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
				url:"controlador/alumno_controlador.php?op=foto_perfil&usr=adm",
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