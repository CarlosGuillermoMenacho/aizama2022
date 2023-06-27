const cargar_Selectores = ()=>{
		$.get(
			"obtener_curso_json.php?op=ca",
			respuesta=>{
	  			if (respuesta.status == 'ok') {
	      			niveles = respuesta.niveles;
	      			for(var i = 0; i < niveles.length; i++ ) {
	        			$("#slc-curso").append(`<option value ="${niveles[i].codcur}">${niveles[i].nombre}</option>`);
	      			}	
	  			}
	 
	  			if(respuesta['status'] == 'eSession') {
	    			alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	    			return false;
	  			} else if (respuesta['status'] == 'noMaterias') {
	      			alert('Este colegio aun no tiene materias');
	      
	  			} else if (respuesta['status'] == 'noPermitido') {
	    			alert('Esta permitido para los administradores');
	  			} 
			},
			"json"
		);
		$.get(
			"get_paralelos.php",
			respuesta=>{
	  			if (respuesta.status == 'ok') {
	      			let paralelos = respuesta.paralelos;
	      			for(var i = 0; i < paralelos.length; i++ ) {
	        			$("#slc-paralelo").append(`<option value ="${paralelos[i].codigo}">${paralelos[i].nombre}</option>`);
	      			}	
	  			}
	 
	  			if(respuesta['status'] == 'eSession') {
	    			alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	    			return false;
	  			} else if (respuesta['status'] == 'noMaterias') {
	      			alert('Este colegio aun no tiene materias');
	      
	  			} else if (respuesta['status'] == 'noPermitido') {
	    			alert('Esta permitido para los administrador');
	  			} 
			},
			"json"
		);

	}
	const cargar_lista = ()=>{
		let codcur = $('#slc-curso').val();
		let codpar = $('#slc-paralelo').val();
		if(codcur!="0" && codpar != "0"){
			$.post(
				"controlador/reportes_controlador.php?op=reporte_1&usr=adm",
				{codcur:codcur,codpar:codpar},
				data=>{
					if(data.status=="ok"){
						mostrar_reporte(data);
					}
					if(data.status == "noData"){
						$('#div-reporte').empty();
						$('.btnPrint').css('display','none');
					}
				},
				"json"
				);
		}else{
			$('#div-reporte').empty();
			$('.btnPrint').css('display','none');
		}
		return false;
	}
	const mostrar_reporte = data =>{
		let curso = data.curso;
		let paralelo = data.paralelo;
		let fecha = data.fecha;
		let lista = data.lista;
		$("#div-reporte").empty();
		$("#div-reporte").append(`<div class="cabecera">
								<div>
									<div>LISTA DE TUTORES</div>
									<div>${fecha}</div>
								</div>
								<div>
									<div>CURSO: ${curso}</div>
									<div>PARALELO: ${paralelo}</div>
								</div>
							</div>`);
		$('#div-reporte').append(
							`<div id="tabla" class="tabla">
								<div class="head-tabla">
									<div class="codigo-sena">Código/Seña</div>
									<div class="usuario">Usuario</div>
									<div class="fecha-nac">Fec. Nac.</div>
								</div>
							<div>`
							);
		lista.forEach(fila=>{
			let alumno = fila.alumno;
			$('#tabla').append(
								`<div class="content-alumno">
									<div class="codigo-alumno"><strong>Alumno: </strong>${alumno.codigo}</div>
									<div class="nombre-alumno">${alumno.nombre}</div>
									<div class="usuario-alumno">${alumno.login}</div>
									<div class="nac-alumno">${alumno.nac}</div>
								</div>`
								);
			let tutores = fila.tutores;
			tutores.forEach(tutor=>{
				$('#tabla').append(
									`<div class="content-tutores">
										<div class="nombre-tutor">Tutor: ${tutor.nombre}</div>
										<div class="telf-tutor">${tutor.celular}</div>
									</div>`
									);
			});

		});
		$('.btnPrint').css('display','block');

	}
	$(document).ready(()=>{
		$('#slc-curso').select2();
		$('#slc-paralelo').select2();
		cargar_Selectores();
		$('#slc-curso').change(()=>{
			cargar_lista();
		});
		$('#slc-paralelo').change(()=>{
			cargar_lista();
		});
		$('#btnPrint').click(()=>{
			let div = document.getElementById('div-reporte').innerHTML;
			let ventana = window.open('','','height=500px','width=500px');

			ventana.document.write('<link rel="stylesheet" type="text/css" href="css/reportes_adm.css">');
			ventana.document.write('<body>');
			ventana.document.write(div);
			ventana.document.write('</body>');
			ventana.document.close();
		});

	})