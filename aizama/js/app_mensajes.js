var msgList=[];
var indice;

function validarFecha(fecha){
    
    var fechaf = fecha.split("/");
    var day = fechaf[0];
    var month = fechaf[1];
    var year = fechaf[2];
    var date = new Date(year,month,'0');
    if((day-0)>(date.getDate()-0) || fecha==''){
        return false;
    }
    
    return true;
}

function convertDateFormat(string) {
        var info = string.split('/').reverse().join('-');
        return info;
}

function init(){
	
	$.post("obtener_cursos.php?op=obtener",function(r){
		if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}

	$("#slccurso").html(r);
	});
}

function validarMensaje(){

	return $('#mensaje').val()!='';
}

function validarCurso(){

	return $('#slccurso').val()!='';
}

function grabar(){

	if (validarMensaje()) {
		var html;
		var formData = new FormData($("#fGrabar")[0]);
		if ($('#colegio').prop("checked")) {
			html=$.ajax({url:"data_mensajes.php?op=save1",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
		}else{
			if (validarCurso()) {
				html=$.ajax({url:"data_mensajes.php?op=save2",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
			}else{
				alert('Debe seleccionar un curso para enviar mensajes, o seleccione colegio e intentelo nuevamente');
				return false;
			}
		
		}

		if(html=='eNoResults'){
			alert('No EXISTE EL CODIGO EN EL PADRON');
			$('#vf_recinto').focus();
			return false;
		}
		
		if(html=='error'){
			alert('No se pudo guardar.');
			return false;
		}
		
		if(html=='eSession'){
			alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
			return false;
		}
		
		if(html=='eGrabado'){
			alert('Enviado con √©xito');
			limpiar();	
			return true;
		}
	}else{
		alert('Debe escribir un mensaje.')
		return false;
	}		
}

function limpiar(){

	$('#mensaje').val("");
	$('#colegio').prop("checked","true");
	$('#slccurso').val("");
	$('#codigo').val("");
	$('#fecha').val("");
	$('#hora').val("");
	$('#codusr').val("");
	$('#nombre').val("");
	$('#estado').val("");
	$('#result').prop("style","visibility:hidden");
	$('#busqueda').prop("style","visibility:hidden");
	$('#busqueda1').prop("style","visibility:hidden");

	msgList=[];
	indice=0;
}

function mostrarbusqueda(){

	msgList=[];
	limpiar();
	$('#busqueda').prop("style","visibility:visible");
	$('#busqueda1').prop("style","visibility:visible");
	$('#result').prop("style","visibility:hidden");

}

function cargarResultados(lista){

	var ac="";
	var res=[];

		for (var i = 0; i < lista.length-1; i++) {
			if (lista[i]!='[' && lista[i]!=',' && lista[i]!='"' && lista[i]!=']') {
				ac=ac+lista[i];
			}
			if (lista[i]=='"' && ac.length>0) {
				res.push(ac);
				ac="";
			}
			if(lista[i]==']' && res.length>0){
				msgList.push(res);
				res=[];
			}

		}

		indice=0;

}

function actualizarSelect(id){
	$('#slccurso').val(id);
}

function cargarDatos(id){

if(id>=0 && id<msgList.length){
	indice=id;
	$('#codigo').val(msgList[id][0]);
	$('#fecha').val(msgList[id][1]);
	$('#hora').val(msgList[id][2]);
	if(msgList[id][3]==1){
		$('#colegio').prop("checked","true");
		$('#slccurso').val("");
	}else{
		$('#curso').prop("checked","true");
		actualizarSelect(msgList[id][4]);
	}
	$('#codusr').val(msgList[id][7]);
	$('#nombre').val(' '+msgList[id][8]+' '+msgList[0][9]);
	$('#mensaje').val(msgList[id][5]);
	if(msgList[id][6]==1){
		$('#estado').val(" Pendiente");
	}else{
		if(msgList[id][6]==2){
			$('#estado').val(" Enviado");	
		}
	}
	$('#cantmsg').html(id+1);


}else{
	return false;
}
	
}

function validarCodigo(){

	if ($('#codigo').val()!='' && parseInt($('#codigo').val())>0) {
		return true;
	}
	return false;
}

function busqueda(){

var html;
var formData = new FormData($("#fGrabar")[0]);
	if($('#chall').prop("checked")){
		html=$.ajax({url:"data_mensajes.php?op=buscar1",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
	}	

	if($('#chcodigo').prop("checked")){
		if (validarCodigo()) {
			html=$.ajax({url:"data_mensajes.php?op=buscar2",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;		
		}else{
			alert('Debe ingresar el codigo del mensaje que desea buscar.');
			$('#codigo').focus();
			return false;
		}
		
	}	

	if($('#chfecha').prop("checked")){
		if (validarFecha($('#fecha').val())) {
			html=$.ajax({url:"data_mensajes.php?op=buscar3",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;	
		}else{
			alert('Introduzca una fecha vallida.')
			$('#fecha').focus();
			return false;
		}
	}	

	if($('#chentorno').prop("checked")){
		if ($('#colegio').prop("checked")) {
			html=$.ajax({url:"data_mensajes.php?op=buscar4",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;	
		}else{
			if ($('#slccurso').val()!='') {
				html=$.ajax({url:"data_mensajes.php?op=buscar5",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
			}else{
				alert('Seleccione un curso para realizar la busqueda.');
				$('#slccurso').focus();
				return false;
			}
		}
	}	

	if($('#chall').prop("checked")){
		html=$.ajax({url:"data_mensajes.php?op=buscar1",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
	}	

	if(html=='eNoResult'){
		alert('No se obtuvieron resultados.');
		return false;
	}
	if (html=='eSession') {
		alert('La sesi√≥n ha finaliado, salga del sistema y vuelva a ingresar');
		return false;
	}

		cargarResultados(html);
		$('#codigo').val(msgList[0][0]);
		$('#fecha').val(msgList[0][1]);
		$('#hora').val(msgList[0][2]);
		if(msgList[0][3]==1){
			$('#colegio').prop("checked","true");
			$('#slccurso').val("");
		}else{
			$('#curso').prop("checked","true");
			actualizarSelect(msgList[0][4]);
		}
		$('#codusr').val(msgList[0][7]);
		$('#nombre').val(' '+msgList[0][8]+' '+msgList[0][9]);
		$('#mensaje').val(msgList[0][5]);
		if(msgList[0][6]==1){
			$('#estado').val(" Pendiente");
		}else{
			if(msgList[0][6]==2){
				$('#estado').val(" Enviado");	
			}
		}
		$('#cantmsg').html(indice+1);
		$('#resultados').html(msgList.length);
		$('#result').prop("style","visibility:visible");
		$('#busqueda').hide();
		$('#busqueda1').hide();

	
}

function validarDatos(){
	if (validarCodigo() && validarMensaje()) {
		return true;
	}
	return false;
}

function editar(){

	if (validarDatos()) {
		var html;
		var formData = new FormData($("#fGrabar")[0]);
		if($('#colegio').prop("checked")){
			html=$.ajax({url:"data_mensajes.php?op=modificar1",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
		}else{
			html=$.ajax({url:"data_mensajes.php?op=modificar2",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
		}
		if (html=='error') {
			alert('Error no se pudo actualizar.');
			return false;
		}
		if (html=='noUpdate') {
			alert('Ya no se puede modificar el mensaje!!!');
			return false;
		}
		if (html=='eGrabado') {

			alert('Modificado con ®¶xito');
			return true;
		}
	}else{
		alert('Debe elegir un mensaje que quiera modificar.');
		return false;
	}
}


init();

$(document).ready(function()
						   {							   
							   $('#btnEnviar').bind('click',function(){grabar();});
							   $('#btnnew').bind('click',function(){limpiar()});
							   $('#btnanterior').bind('click',function(){updateview(indice-1)});
							   $('#btnsiguiente').bind('click',function(){updateview(indice+1)});
							   $('#btnultimo').bind('click',function(){updateview(lista.length)});
							   $('#btnveragenda').bind('click',function(){cargar_observaciones()});
							   $('#btnBusqueda').bind('click',function(){mostrarbusqueda()});
							   $('#btnbuscar').bind('click',function(){busqueda()});
							   $('#btnInit').bind('click',function(){cargarDatos(0)});
							   $('#btnPreview').bind('click',function(){cargarDatos(indice-1)});
							   $('#btnNext').bind('click',function(){cargarDatos(indice+1)});
							   $('#btnFinish').bind('click',function(){cargarDatos(msgList.length-1)});
							   $('#btnSalir').bind('click',function(){location.href='menu_administracion.php';});
							   $('#btnmodif').bind('click',function(){editar()});
							   
							   
							}
							)