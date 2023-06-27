let __Alumnos = [];
const init = () => {
	$.get(
		"controlador/tutor_controlador.php?usr=tut&op=get_alumnos",
		data => {
			__Alumnos = data.lista_alumnos;
			cargarAlumnos(__Alumnos);
		},"json"
	);
}
const cargarAlumnos = alumnos => {
	if(alumnos.length == 0){
		Swal.fire("No tiene alumnos asignados...");
		return;
	}
	if(alumnos.length == 1){
		$(".div-lista-hijos").empty();
		$(".div-lista-hijos").append(
			`<div class="div-hijo" id="al${alumnos[0].codalu}">
			</div>`
		);
		mostrar_kardex(alumnos[0].codalu);
		return;
	}
	$(".div-lista-hijos").empty();
	alumnos.forEach(a => {
		$(".div-lista-hijos").append(
			`<div class="div-hijo" id="al${a.codalu}">
				<div id="al${a.codalu}" onclick="mostrar_kardex(${a.codalu});" style="cursor: pointer;" class="hijo">
					<h1>${a.nombre}</h1>	
				</div>
			</div>`
		);
	});
}
const get_alumno = codalu => {
	for (var i = 0; i < __Alumnos.length; i++) {
		if(__Alumnos[i].codalu == codalu)return __Alumnos[i];
	}
	return [];
}
const close_kardex = codalu => {
	$(`#al${codalu}`).empty();
	let a = get_alumno(codalu);
	$(`#al${codalu}`).append(
		`<div id="al${a.codalu}" onclick="mostrar_kardex(${a.codalu});" style="cursor: pointer;" class="hijo">
			<h1>${a.nombre}</h1>	
		</div>`
	);
}
const mostrar_kardex = codalu =>{
	$(`#al${codalu}`).empty();
	let alumno = get_alumno(codalu);
	$(`#al${codalu}`).append(
		`<div class="btn-close">
	        <img src="images/close.svg" onclick="close_kardex(${codalu});">
	    </div>
	    <div class="div-table-kardex-escritorio">
	        <div class="title-kardex">
	            <h2>KARDEX DE PAGO</h2>
	            <div class="head-kardex">
	            	<div>
		                <p id="name-student" style="font-size: .8em">
							Estudiante: <b>${alumno.nombre}</b>
						</p>
						<p id="name-student" style="font-size: .8em">
							Curso: <b>${alumno.curso}</b>
						</p>
	            	</div>
	                <div class="btn-gestion-kardex">
	                    <input type="text" id="input-gestion${codalu}" value="2023">
	                    <div class="btn-gestion">
	                        <button onclick="get_kardex(${codalu})">Consultar</button>                        
	                    </div>
	                </div>
	            </div>
	            <div class="gestion-kardex">
	                <p id="gestion-kardex${codalu}">GESTIÓN 2023</p>
	            </div>
	        </div>
	        <table>
	            <thead>
	                <tr>
	                    <td>No.</td>
	                    <td>Fecha</td>
	                    <td>Detalle</td>
	                    <td>Monto</td>
	                    <td>Saldo</td>
	                </tr>
	            </thead>
	            <tbody id="body-kardex-escritorio${codalu}">
	            </tbody>
	        </table>
	            
	    </div>`

	);
	get_kardex(codalu);
}
const get_kardex = codalu => {
	if(codalu == "")return;
	let gestion = $(`#input-gestion${codalu}`).val();
	$.post(
		"../agendadigital/get_kardex_pago.php",
		{id:codalu,gestion:gestion},
		data=>{
			if(data.status == "200"){
				$(`#gestion-kardex${codalu}`).text(`GESTIÓN ${data.gestion}`);
				$(`#body-kardex-escritorio${codalu}`).empty();
				let index = 1;
				$(`#input-gestion${codalu}`).val(data.gestion);
				data.pagos.forEach(pago=>{
					$(`#body-kardex-escritorio${codalu}`).append(
						`<tr class="onCursor">
		                    <td class="index">${index}</td>
		                    <td class="border-td2">${pago.fecha}</td>
		                    <td class="border-td2">${pago.detalle}</td>
		                    <td class="border-td right">${pago.haber}</td>
		                    <td class="border-td right">${pago.acreedor}</td>
		                </tr>`
					);
					index++;
				});

				//mostrar_kardex();

			}
		},"json"
	);
}

$(document).ready(()=>{
	init();
})