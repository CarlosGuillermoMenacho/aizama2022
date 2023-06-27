var tabla;
let control_indicadores = [];
let espera = 0;

function obtenerEvaluaciones(){
        $.get(
                'get_numero_evaluaciones_json.php',
                (datos,estado,xhr)=>{
                    let status = datos['status'];
                     if (status=="ok") {
                       let lista= datos['lista'];
                       $("#seleccionar_Evaluacion").empty();
                       $("#seleccionar_Evaluacion").append('<option value ="0" >--Seleccionar número--</option>');
                       lista.forEach((nro)=>{
                       	 $("#seleccionar_Evaluacion").append(`<option value ="${nro}" > ${nro} </option>`);
                       })
                    }   
                 },
                 "json"
            );
    }

function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

    results = regex.exec(location.search);

    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}

var sw=getParameterByName('sw1');
var sw33=$('#seleccionar_Evaluacion').val();
//alert('Valor seleccionado: '+sw33);
function lista(examen){	
	//location.href='view_test_content.php?sw1='+examen+'&sw2='+sw;		
	location.href='view_test_content.php?sw1='+examen+'&sw2='+sw33;		
}

function listar(){
	tabla=$('#tbllistado').dataTable({
			language: {
        		"decimal": "",
        		"emptyTable": "No hay información",
        		"info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        		"infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        		"infoFiltered": "(Filtrado de _MAX_ total entradas)",
        		"infoPostFix": "",
        		"thousands": ",",
        		"lengthMenu": "Mostrar _MENU_ Entradas",
        		"loadingRecords": "Cargando...",
        		"processing": "Procesando...",
        		"search": "Buscar:",
        		"zeroRecords": "Sin resultados encontrados",
        		"paginate": {
            		"first": "Primero",
            		"last": "Ultimo",
            		"next": "Siguiente",
            		"previous": "Anterior"
        		}
    		},

		"aProcessing":true,
		"aServerSide":true,
		dom:'Bfrtip',
		"ajax":{
			url:'listar_evaluaciones.php?sw1='+sw,
			type: "get",
			dataType: "json",
			error: function(e){
				console.log(e.responseText);
			}
		}
	}).DataTable();
}
function listar_Sel(){
	sw33=$('#seleccionar_Evaluacion').val();
	//alert('Valor seleccionado 2 : '+sw33);
	if (sw33>0){
		//$("#tablaRegistros").dataTable().fnDestroy();
		$("#tbllistado").dataTable().fnDestroy();
		tabla=$('#tbllistado').dataTable({
				language: {
        		"decimal": "",
        		"emptyTable": "No hay información",
        		"info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        		"infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        		"infoFiltered": "(Filtrado de _MAX_ total entradas)",
        		"infoPostFix": "",
        		"thousands": ",",
        		"lengthMenu": "Mostrar _MENU_ Entradas",
        		"loadingRecords": "Cargando...",
        		"processing": "Procesando...",
        		"search": "Buscar:",
        		"zeroRecords": "Sin resultados encontrados",
        		"paginate": {
            		"first": "Primero",
            		"last": "Ultimo",
            		"next": "Siguiente",
            		"previous": "Anterior"
        		}
    		},

			"aProcessing":true,
			"aServerSide":true,
			dom:'Bfrtip',
			"ajax":{
				url:'listar_evaluaciones_10p.php?sw1='+sw33,
				type: "get",
				dataType: "json",
				error: function(e){
					console.log(e.responseText);
				}
			}
		}).DataTable();
		$.get(
			`listar_evaluaciones_10p.php?sw1=${sw33}`,
			data => {
				control_indicadores = data.indicadores;
				listeners();
			},"json"
			);
	}else{
		alert('Seleccione un número de evaluación...!!!');
	}
}
const listeners = () =>{
	document.querySelectorAll('.indicador').forEach( item => {
	        item.addEventListener("keyup", ()=>{
	            if(espera > 0){
	                espera = 3;
	            }else{
	                espera = 3;
	                bucle();
	            }
	        });
	    });
}
const task = i => {
    return new Promise((res,rej)=>{
        setTimeout(()=>{
        res(i);
        },1000)
    });
    
}
async function bucle(){
    while(espera > 0){
        let time = await task(espera);
        
        espera--;
    }
    guardar_Indicador();
}
const guardar_Indicador = () => {
    let inputs_indicadores = document.querySelectorAll('.indicador');
    for (var i = 0; i < inputs_indicadores.length; i++) {
        let tex_ind = inputs_indicadores[i].value.trim();
        if( tex_ind != control_indicadores[i][1]){
            control_indicadores[i][1] = tex_ind;
            let codpract = control_indicadores[i][0];
            $.post(
                    'controlador/indicador_controlador.php?op=save_indicador',
                    {id:codpract,texto:tex_ind,tipe:3},
                    response => {
                        if(response.status == "eSession"){
                            alert("La sesión ha expirado...");
                            location.href = "docentes.php";
                        }
                        if(response.status == "ok"){
                            mostrar_mensaje("Guardado exitosamente","success");
                            //update_registros(codpract,tex_ind);
                            //pedirPracticos();
                        }
                    },
                    "json"
                  );
        }
    }
}
const update_registros = (codpract,inid) => {

  for (var i = 0; i < listaPracticos.length; i++) {
    if(listaPracticos[i].id == codpract){
      listaPracticos[i].indicador = inid;
      return;
    }
  }
  return;
} 
const mostrar_mensaje = (mensaje,estilo) => {
    if(estilo == "success"){
        $('#notificacion').removeClass('no-visible');
        $('#notificacion').addClass("notifications_success");
        $('#notificacion').addClass('visible');
        setTimeout(()=>{
            $('#notificacion').removeClass('visible');
            //$('#notificacion').removeClass("notifications_success");
            $('#notificacion').addClass('no-visible');
        },3000);
    }
}
function crearEvaluacion(){
//location.href='mantenimiento.php';
	location.href='view_new_test.php?sw1='+sw;
}

$(document).ready(function()


				  { obtenerEvaluaciones();
				   	$('#seleccionar_Evaluacion').change(()=>listar_Sel());
    //$("#seleccionar_evaluacion").change(()=> ());

				   $('#btnSalir').bind('click',function(){location.href='inicios.php';});

				   $('#btnNuevo').bind('click',function(){crearEvaluacion()});

				   })



//listar();





