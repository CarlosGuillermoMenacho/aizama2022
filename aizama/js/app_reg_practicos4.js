var cursos = [];//Variable que obtendra la lista de los cursos de un profesor
var materias = []; //Variable que obtendra la lista de materias que tiene un profesor


function getAlu(e,param,c_curso,c_paralelo,c_materia,cantidad)
{
	if(validarSelects()){
    	c_materia = c_materia.toUpperCase();
    	if(isKeyEnter(e))
    	{
    		if (param>cantidad){
    			alert('El Nro de práctico que desea modificar, es invalido !!!!');
    			$('#vf_codalu').focus();
    		}else{
    			getCuestionario(param,c_curso,c_materia,c_paralelo);
    		}
    		return true;
    	}
	}else{
	    alert("Debe seleccionar Curso y Materia...");
	    return false;
	}
}
function validarSelects(){
  return $('#vf_codigo').val()>0&&$('#vf_mza').val()>0;  
}
function getAlu2(param,c_curso,c_paralelo,c_materia,cantidad)
{
	if(validarSelects()){
    	c_materia = c_materia.toUpperCase();
    
    		if (param>cantidad){
    			alert('El Nro de práctico que desea modificar, es invalido !!!!');
    			$('#vf_codalu').focus();
    		}else{
    			getCuestionario(param,c_curso,c_materia,c_paralelo);
    		}
    		return true;
	}else{
	    alert("Debe seleccionar Curso y Materia...");
	    return false;
	}
}
function getResultados(e,param)
{
	if(isKeyEnter(e))
	{
		if(parseInt(param)!=param)  //ESTO VERIFICA QUE EL DATO SEA NUMERO
		{
			alert ('El dato introducido no es correcto');
			$('#vf_codigo').val('');
			$('#vf_codigo').focus();
			return false;
		}
		$('#vf_codigo').val(param);
		getCurso(param);
		return true;
	}
}
function getMate(e,param)
{
	param = param.toUpperCase();
	if(isKeyEnter(e))
	{
		if (valid_materia(param,$('#vf_codigo').val()))
		{
			getMateria(param);
			return true;
		}
	}
}
function valid_materia(id_mat,id_curso,id_par){
	var html=$.ajax({type:"GET",url:'validar_materia_prac.php',data:{id:id_mat,id1:id_curso,codpar:id_par},async:false}).responseText;
	if(html=='eNoPrimaria'){
	  alert('Esta materia no corresponde al curso o al nivel');
	  $('#vf_mza').val('');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('Esta materia no la dicta este profesor');
	  $('#vf_mza').val(0);
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	eval(html);
	$('#vf_nombre2').val(descri);
	$('#vf_cantidad').val(total);
	$('#vf_codalu').focus();
//	alert('Si este profesor dicta esta materia');
	return true;
}

function getMateria(id){
	var html=$.ajax({type:"GET",url:'get_materia.php',data:{id:id},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('No se encontraron registro con su criterio de busqueda.');
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	eval(html);
	$('#vf_nombre2').val(descri);
	$('#vf_codalu').focus();
	return true;
}
function getCuestionario(id,n_curso,c_mat,c_par)
{
	var html=$.ajax({type:"GET",url:'get_cuestionario_prac.php',data:{id:id,id1:n_curso,id2:c_mat,codpar:c_par},async:false}).responseText;
	if(html=='Paso2'){
	  alert('Entro al paso 2');
	  return false;
	}
	if(html=='Paso1'){
	  alert('Entro al paso 1');
	  return false;
	}
	if(html=='eNoResults'){
	  alert('NO encontro practico');
		listar(id);
	//	alert ('hola 6');
		crearTabla(); 
		cargarLista();
		$('#vf_n3').val('0');
		$('#vf_n2').val("");
		$('#vf_n2').focus();
	  return true;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	eval(html);
	$('#vf_n2').val(descrip);
	$('#vf_n3').val(total);
	$('#vf_cod_cuest').val(cod_cuest);
	$('#vf_pract_no').val($('#vf_codalu').val());

	$('#vf_n2').focus();
//	alert ('hola 5');
	listar(id);
//	alert ('hola 6');
	crearTabla(); 
	cargarLista();

	
	return true;
}
function listar(nro_p){
//	alert ('hola 6.1');
	var bim = $('#bimestre').val();
	var codCurso = $('#vf_codigo').val();
	var codMateria = $('#vf_mza').val();	
	var tot_prac = $('#vf_cantidad').val();
	var nro_prac = nro_p;
	var cod_cuest = $('#vf_cod_cuest').val();

//	alert ('hola 7');
	if (parseInt(nro_prac)>parseInt(tot_prac)){
		var html=$.ajax({type:"POST",url:'get_practicos.php?op=lista_vacia',data:{materia:codMateria,curso:codCurso,bimestre:bim,nro_pract:nro_prac},async:false}).responseText;
	}else{
		var html=$.ajax({type:"POST",url:'get_practicos.php?op=lista_llena',data:{materia:codMateria,curso:codCurso,bimestre:bim,nro_pract:nro_prac,codi_cuest:cod_cuest},async:false}).responseText;
	}
	
 	lista = JSON.parse(html);
//	alert ('hola 8');
}
function crearTablaNueva(){
    var col = 3;
    var filas = lista.length;
    var tabla='<table border="1px solid;" style="border-collapse:collapse;width:550px;">';
    
    tabla+='<tr align="center"><td><b>No.</b></td><td align="center"><b>PREGUNTAS</b></td><td align="center"><b>ARCHIVO ADJUNTO</b></td>';
    tabla+="</tr>";
    
    for(i=0;i<filas;i++){
        tabla+="<tr>";
        tabla+="<td>"+(i+1)+ '</td><td><textarea id="alum'+(i+1)+'"name="alum'+(i+1)+'" type="text" rows="5" cols="50" MAXLENGTH="250" placeholder="Escriba aqui su pregunta..." style="border:0;outline: none;" ></textarea></td><td><input name="imag'+(i+1)+'" type="file" id="imag" ></td>';
        tabla+="</tr>";
    }
    tabla+="</table>";
    document.getElementById("TableNotasList").innerHTML=tabla;
    	$('#TableNotasList').show();
    	$('#btnGrabar2').show();
}

function crearTabla(){
    var col = 3;
    var filas = lista.length;
    var tabla='<table border="1px solid;" style="border-collapse:collapse;width:550px;">';
    
    tabla+='<tr align="center"><td><b>No.</b></td><td align="center"><b>PREGUNTAS</b></td><td align="center"><b>ARCHIVO CARGADO</b></td><td align="center"><b>ARCHIVO NUEVO</b></td>';
    tabla+="</tr>";
    
    for(i=0;i<filas;i++){
        var ext=getFileExtension(lista[i]['imagen']);
		var contenedor = "";
		if (ext == "jpg"||ext == "png"||ext == "jpeg") {
			contenedor = '<a href="resources/'+lista[i]['imagen']+'" target="_blank"><img src="resources/'+lista[i]['imagen']+'" alt="" style="width:100%;"></a>';
		}
		if (ext =="doc"||ext =="docx") {
			contenedor='<a href="resources/'+lista[i]['imagen']+'" target="_blank"><img src="images/icono-docx.png" alt="" style="width:100%;"></a>';
		}
		if (ext =="ppt"||ext =="pptx") {
			contenedor='<a href="resources/'+lista[i]['imagen']+'" target="_blank"><img src="images/point.png" alt="" style="width:100%;"></a>';
		}
		if (ext =="pdf") {
			contenedor='<a href="resources/'+lista[i]['imagen']+'" target="_blank"><img src="images/pdf.png" alt="" style="width:100%;"></a>';
		}
		if (ext =="xls"||ext =="xlsx") {
			contenedor='<a href="resources/'+lista[i]['imagen']+'" target="_blank"><img src="images/excel.png" alt="" style="width:100%;"></a>';
		}
        tabla+="<tr>";
        tabla+="<td>"+(i+1)+ '</td><td><div id="alum'+(i+1)+'"></div><textarea id="alum'+(i+1)+'" name="alum'+(i+1)+'" type="text" rows="5" cols="50" MAXLENGTH="250" placeholder="Escriba aqui su pregunta..." style="border:0;outline: none;" >'+lista[i]['pregunta']+'</textarea></td><td>'+contenedor+/*<input value="'+lista[i]['imagen']+'" type="text" name="img'+(i+1)+'" id="img'+(i+1)+'" disabled size="12" >*/'</td><td><input name="imag'+(i+1)+'" type="file" id="imag'+(i+1)+'" ></td>';
        tabla+="</tr>";
    }
    tabla+="</table>";
    document.getElementById("TableNotasList").innerHTML=tabla;
    	$('#TableNotasList').show();
    	$('#btnGrabar2').show();
}
function getFileExtension(filename) {
	return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}
function cargarLista(){
//	alert('Listo para cargar !!!!');
	for (var i = 0; i <lista.length; i++) {
		$('#alum'+(i+1)).val(lista[i]['nombre']);
		$('#nota'+(i+1)).val(lista[i]['nota']);
	}
}
function cargarListaNueva(){
	alert('Listo para cargar practico nuevo !!!!');
	for (var i = 0; i <lista.length; i++) {
		//$('#alum'+(i+1)).val(lista[i]['nombre']);
		//$('#nota'+(i+1)).val(lista[i]['nota']);
	}
}

function getClaveUso(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_desclaveuso').val('');
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!');
			return;
		}
		param=param*10/10
		SacarClaveUso(param);
	}
}

function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}


function clearInputs()
{
	$('#vf_catastro').val('');
	$('#vf_contrato').val('');
	$('#vf_nombre').val('');
	$('#vf_anterior').val('');
	$('#vf_actual').val('');
	$('#vf_promedio').val('');
	$('#vf_periodo').val('');
	$('#vf_nrocor').val('');
	$('#vf_medidor').val('');
	$('#vf_ubicacion').val('');
	$('#vf_clave').val('');
	$('#vf_desclave').val('');
	$('#vf_claveuso').val('');
	$('#vf_desclaveuso').val('');
	$('#vf_categoria').val('');
	$('#vf_descategoria').val('');
	$('#vf_grabados').val('');
}

function verificarImg()
{
	 var alto=document.getElementById('imgSalida').width;
	  var ancho=document.getElementById('imgSalida').height;
	 if(alto > 500 || ancho > 500){
		 alert("La dimension de la imagen no es correcta. Debe ser menor a: 500x500 pixels");
		 $('#imgSalida').hide();
		 $('#imagen').val("");
		 
		 return false;
				   }else{return true;}	 	
}

function validarDato()
{
	if ($('#vf_codigo').val() == '' || $('#vf_mza').val() == '' || $('#vf_codalu').val() == '' || $('#vf_n2').val() == '' || !verificarImg() )
	{
//		alert('1');
		return false;
	}
	else
	{
		if (parseInt($('#vf_codigo').val()) >= 0 && parseInt($('#vf_codalu').val()) >= 0 )
		{
			return true;
		}
		else
		{
//			alert('2');
			return false;
		}
	}
}

function grabado(id,codmate)
{
	codmate = codmate.toUpperCase();
	var html=$.ajax({type:"GET",url:'get_grabado_nota.php',data:{id1:id,id2:codmate},async:false}	).responseText;

	if(html=='eNoResults'){
//		solo por este motivo tiene que grabarse
	// EL ALUMNO NO TIENE REGISTRADA NINGUNA NOTA DE ESTA MATERIA
//	  return true;
	  return 1;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
		return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
    return 2;
}
function grabar(id8,id9,id11,id12,id13)
{
//	alert('ya 1');
	var html=$.ajax({type:"GET",url:'grabar_pregunta1.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13},async:false}).responseText;
//	alert('ya 2');

	if(html=='eNoResults'){
	  alert('No EXISTE EL CODIGO EN EL PADRON');
	$('#vf_recinto').focus();
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	if(html=='eGrabado')
	{
//		alert('ya 3');
		$('#vf_n3').val(parseInt($('#vf_n3').val())+1);
	  return true;
	}
}
function grabar1(id8)
{
//	alert('ya 1');
		var formData = new FormData($("#fGrabar")[0]);
        var html=$.ajax({url:"grabar_pregunta2.php?id1="+id8 ,type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
        console.log(html);

//	alert('ya 2');

	if(html=='eNoResults'){
	  alert('No EXISTE EL CODIGO EN EL PADRON');
	$('#vf_recinto').focus();
	  return false;
	}
	if(html=='eParamError'){
	  alert('Se han enviado parametros incorrectos.');
	  return false;
	}
	if(html=='eSession'){
	  alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  return false;
	}
	if(html=='eGrabado')
	{
//		alert('ya 3');
		$('#vf_n3').val(parseInt($('#vf_n3').val())+1);
	  return true;
	}
}
function validarVer()
{
	if ($('#vf_codigo').val() == '' || $('#vf_mza').val() == '' || $('#vf_codalu').val() == '')
	{
//		alert('1');
		return false;
	}
	else
	{
		if (parseInt($('#vf_codigo').val()) >= 0 && parseInt($('#vf_codalu').val()) >= 0 )
		{
			return true;
		}
		else
		{
//			alert('2');
			return false;
		}
	}
}

function Ver_cuestionario()
{
	if (validarVer())
	{
	    var jsVar1 = parseInt($('#vf_codigo').val());
    	var jsVar2 = $('#vf_mza').val();
	    var jsVar3 = parseInt($('#vf_codalu').val());
    	var jsVar4 = $('#vf_nombre').val();
    	var jsVar5 = $('#vf_nombre2').val();
		//    window.location.href = window.location.href + "?w1=" + jsVar1 + "&w2=" + jsVar2;
    	window.location.href = 'ver_cuestion.php' + "?w1=" + jsVar1 + "&w2=" + jsVar2 + "&w3=" + jsVar3 + "&w4=" + jsVar4 + "&w5=" + jsVar5;
		return true;
	}
	else
	{
		alert('FALTAN DATOS PARA VISUALIZAR ! O SON INCORRECTOS !!!');
		return false;
	}
}

function generarLista(){
	var listaN="[";
	for (var i = 0; i < lista.length-1; i++) {
		listaN+='{"codigo":'+(i+1)+',"nota":"'+$('#alum'+(i+1)).val()+'"},';
	}
	listaN+='{"codigo":'+(i+1)+',"nota":"'+$('#alum'+(lista.length)).val()+'"}]';
	return listaN;
	
//		listaN+='{"codigo":'+lista[i]['codigo']+',"nota":"'+$('#nota'+(i+1)).val()+'"},';
//	listaN+='{"codigo":'+lista[lista.length-1]['codigo']+',"nota":"'+$('#nota'+(lista.length)).val()+'"}]';
}

/*function formSubmit()
{
		alert('1!');
		var listaN = generarLista();
		alert('2!');
		var bim = $('#bimestre').val();
		var codCurso = $('#vf_codigo').val();
		var codMateria = $('#vf_mza').val();
		var descr = $('#vf_n2').val();
		var no_cues = $('#vf_pract_no').val();
		var formData = new FormData($('#fGrabar')[0]);

		var html=$.ajax({type:"POST",url:'get_practicos.php?op=saveNuevo',data:{materia:codMateria,lista:listaN,bimestre:bim,curso:codCurso,descripcion:descr,nro_cuest:no_cues},async:false}).responseText;
		var html2=$.ajax({type:"POST",url:'get_practicos.php?op=saveIMG',data:formData,contentType: false, processData: false,async:false}).responseText;
		alert('4!');
		html = $.trim(html);
		alert('5!');
		if(html=='ok'){
			alert('GRABADO EXITOSAMENTE!!!');
		}else{
			alert('NO SE GUARDÓ!!!');
		}
}*/

function formSubmit()
{
	var formData = new FormData($('#fGrabar')[0]);
	var html=$.ajax({url:"get_practicos.php?op=guardar",type: "POST",data:formData,contentType: false, processData: false,async:false}).responseText;
	html = $.trim(html);
	if(html=='ok'){
		alert('GRABADO EXITOSAMENTE!!!');
	}else{
		alert('NO SE GUARDÓ!!!');
	}
}
  function fileOnload(e) {
      var result=e.target.result;
      $('#imgSalida').attr("src",result);
	  $('#imgSalida').show();
  }
function addImage(e){
	var file = e.target.files[0];
    imageType = /image.*/;
    if ($('#imag').val()!="") {
    	if (!file.type.match(imageType))
       		return;
  
    	var reader = new FileReader();
    	reader.onload = fileOnload;
    	reader.readAsDataURL(file);
    }else{
     	$('#imgSalida').val("");
     	$('#imgSalida').hide();
    }
 }

function NuevoPractico(){
	$('#vf_n2').val("");
	$('#vf_codalu').val("");
	$('#vf_n3').val(0);
	$('#vf_n2').focus();
	var tot_prac = $('#vf_cantidad').val();
	var nuevo_nro= parseInt(tot_prac) + 1;
	$('#vf_pract_no').val(nuevo_nro);
	listar(nuevo_nro);
	crearTablaNueva(); 
	$('#vf_cod_cuest').val("");
//	cargarListaNueva();
 }
 function validarDatos(){
     if($('#vf_mza').val()>0){
         let codcur = cursos[$('#vf_codigo').val()-1]['codcur'];
         let codpar = cursos[$('#vf_codigo').val()-1]['codpar'];
         let codmat = materias[$('#vf_mza').val()-1]['codmat'];
         if (valid_materia(codmat,codcur,codpar))
    		{
    			getMateria(codmat);
    			$('#codmat').val(codmat);
    		}
     }
 }
 function recargar(){
     $('#vf_codalu').val($('#vf_pract_no').val());
     valid_materia($('#codmat').val(),$('#codcur').val(),$('#codpar').val());
     getCuestionario($('#vf_codalu').val(),$('#codcur').val(),$('#codmat').val(),$('#codpar').val());
 }
 function cargarSelectCurso(){
     for(let i = 0 ;i < cursos.length; i++){
         let nombre = cursos[i]['nombre'];
         $("#vf_codigo").append('<option value ="'+ (i+1) +'">' + nombre + '</option>'); 
     }
    
 }
function cargarCursos(){
    $.post("obtener_curso_json.php?op=cp",function(r){
		var respuesta = JSON.parse(r);
		let status = respuesta['status'];
		if(status=='eSession'){
    		alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    		location.href="docentes.php";
		}
		if(status == 'ok'){
		    cursos = respuesta['cursos'];
		    cargarSelectCurso();
		}
    });
}
function cargarSelectMaterias(){
    limpiarSelectMaterias();
    let curso = cursos[$('#vf_codigo').val()-1];
    for(let i = 0 ; i < materias.length ; i++){
        if(materias[i]['codcur']==curso['codcur']&&materias[i]['codpar']==curso['codpar']){
            $('#vf_mza').append($("<option>", {
                                value: i+1,
                                text: materias[i]['nombre']
                                }));
        }
    }
}
function obtenerMaterias(){
    $.post("obtener_materias_json.php?op=getmatprof",function(r){
        var respuesta = JSON.parse(r);
        let status = respuesta['status'];
		if(status=='eSession'){
    		alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
    		location.href="docentes.php";
		}
		if(status=='ok'){
    		materias = respuesta['materias'];
		}
    });
}
function validarSelectCurso(){
    if($('#vf_codigo').val()>0){
        $('#codpar').val(cursos[$('#vf_codigo').val()-1]['codpar']);
        $('#codcur').val(cursos[$('#vf_codigo').val()-1]['codcur']);
        cargarSelectMaterias();
    }else{
        limpiarSelectMaterias()
    }
}
function limpiarSelectMaterias(){
    const $selectMaterias = $('#vf_mza');
        $selectMaterias.empty();
        $selectMaterias.append($("<option>", {
                                value: 0,
                                text: 'Seleccionar Materia'
                                }));
}
$(document).ready(function()
						   {
						       cargarCursos();
						       obtenerMaterias();
						       $("#vf_codigo").change(function(){validarSelectCurso()});
						       $("#vf_mza").change(function(){validarDatos()});
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
                               $('#prcModif').bind('click',function(){getAlu2($('#vf_codalu').val(),$('#codcur').val(),$('#codpar').val(),$('#codmat').val(),$('#vf_cantidad').val());});
							   $('#btnNuevoP').bind('click',function(){NuevoPractico();});
							   $('#btnValidar').bind('click',function(){validarDatos();});
							   $('#btnGrabar1').bind('click',function(){formSubmit();recargar();});
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});
							   $('#btnNuevo').bind('click',function(){Nuevo();});
//							   $('#btnVer_Cu').bind('click',function(){location.href='ver_cuestion.php';});
							   $('#btnVer_Cu').bind('click',function(){Ver_cuestionario();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
							   $('#btnVer').bind('click',function(){location.href='ver_datos_p.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){location.href='m_practicos.php';});
							   $('#imag').change(function(e){addImage(e);});
							}
							)
							

