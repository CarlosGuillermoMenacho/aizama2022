var lista=[];
var indice=0;
var c_mate='';
function init(){
//	console.log(cur);
    $('#slcmateria').html('<option value="">Seleccionar Materia</option>');
    lista=[];
	$.ajax({
			type:"POST",
			url:"obtener_materias.php",
			data:"cod_curso=" + $('#vf_codi_curso').val(),
			success:function(r){
				if(r=='eSession'){
	  				alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');
	  				return false;
					}

				$('#slcmateria').html(r);
			}
	});
}
function validarVer(nro_p)
{
	if ($('#vf_codi_curso').val() == '' || $('#slcmateria').val() == '' || nro_p == '')
	{
//		alert('1');
		return false;
	}
	else
	{
		if (parseInt($('#vf_codi_curso').val()) >= 0 && parseInt(nro_p) >= 0 )
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

function listar(nro_p){
//	alert ('hola 6.1');
//	var bim = $('#bimestre').val();
	var codCurso = $('#vf_codi_curso').val();
	var codMateria = $('#slcmateria').val();	
//	var tot_prac = $('#vf_cantidad').val();
	var nro_prac = nro_p;
//	var cod_cuest = $('#vf_cod_cuest').val();

//	alert ('hola 7');
	if (parseInt(nro_prac)>0){
		var html=$.ajax({type:"POST",url:'get_lista_evaluaciones_ver.php?op=lista_llena',data:{materia:codMateria,curso:codCurso},async:false}).responseText;
	}
//	alert ('hola 6.8');
 	lista = JSON.parse(html);
//	alert ('hola 8');
}
function crearTabla(){
    var col = 3;
    var filas = lista.length;
    var tabla='<table border="1px solid;" style="border-collapse:collapse;width:550px;">';
    
    tabla+='<tr align="center"><td><b>No.</b></td><td align="center"><b>INSTRUCCIONES PARA EVALUACIONES VIRTUALES</b></td><td align="center"><b>EVALUAR</b></td><td align="center"><b>Fecha Inicio</b></td><td align="center"><b>Fecha Fin</b></td><td align="center"><b>NOTA</b></td><td align="center"><b>Observaciones</b></td>';
    tabla+="</tr>";
    
    for(i=0;i<filas;i++){
        tabla+="<tr>";
        tabla+="<td>"+(i+1)+ '</td><td><div id="alum'+(i+1)+'"></div><textarea id="alum'+(i+1)+'" type="text" rows="5" cols="50" MAXLENGTH="250" style="border:0;outline: none;" >'+lista[i]['pregunta']+'</textarea></td><td><input name="btn19" type="button" class="btn" id="btn19" value="Evaluar..." onclick="Ver_cuestionario('+(i+1)+')" /></td><td><input readonly size="10" id="fi'+(i+1)+'" type="text" value='+lista[i]['inicio']+'></td><td><input readonly size="10" id="ff'+(i+1)+'" type="text" value='+lista[i]['fin']+'></td><td><input readonly size="10" id="ff'+(i+1)+'" type="text" value='+lista[i]['nota']+'></td><td><textarea id="alum'+(i+1)+'" type="text" rows="5" cols="20" MAXLENGTH="250" style="border:0;outline: none;" >'+lista[i]['obs']+'</textarea></td>';
        tabla+="</tr>";
    }
    tabla+="</table>";
    document.getElementById("TableNotasList").innerHTML=tabla;
    	$('#TableNotasList').show();
    	$('#btnGrabar2').show();
}

function cargarLista(){
//	alert('Listo para cargar !!!!');
	for (var i = 0; i <lista.length; i++) {
		$('#alum'+(i+1)).val(lista[i]['nombre']);
		$('#nota'+(i+1)).val(lista[i]['nota']);
	}
}

function CargarVideo(){
	var n_curso=$('#vf_codi_curso').val();
	var c_mat=$('#slcmateria').val();
	console.log(c_mat);
	var html=$.ajax({type:"POST",url:'get_lista_evaluaciones.php',data:{id1:n_curso,id2:c_mat},async:false}).responseText;
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
		listar(c_mat);
	//	alert ('hola 6');
		crearTabla(); 
		cargarLista();
		$('#vf_n3').val('0');
		$('#vf_n3').focus();
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
	$('#vf_n3').val(total);
	$('#vf_n3').focus();
//	alert ('hola 5');
	if (parseInt($('#vf_n3').val())>0){
		listar($('#vf_n3').val());
		crearTabla(); 
		cargarLista();
	}
	else{
		lista=[];
		crearTabla();
		cargarLista();
	}
	
	return true;
	
}

function getAsignarMateria(id)
{
//	  alert('holassss   1');
	var html=$.ajax({type:"GET",url:'asignar_materia.php',data:{id:id},async:false}).responseText;
//	  alert('holassss   2');
	if(html=='eNoNumeric'){
	  alert('No numerico o variable no declarada');
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
	if(html=='eHecho'){
		// se asigno la materia correctamente
//	  alert('holassss  3');
	  return true;
	}
}

function lenguaje()
{
	$codm = 2;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function matematicas()
{
	$codm = 1;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function naturales()
{
	$codm = 5;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function sociales()
{
	$codm = 8;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function musica()
{
	$codm = 14;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function edu_fisica()
{
	$codm = 13;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function religion()
{
	$codm = 16;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function psicologia()
{
	$codm = 4;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function filosofia()
{
	$codm = 3;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function fisica()
{
	$codm = 6;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function quimica()
{
	$codm = 7;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function biologia()
{
	$codm = 10;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function civica()
{
	$codm = 11;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function ingles()
{
	$codm = 12;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}


function art_plasticas()
{
	$codm = 15;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function computacion()
{
	$codm = 17;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function geografia()
{
	$codm = 20;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function historia()
{
	$codm = 21;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}
function ortografia()
{
	$codm = 22;
	if (getAsignarMateria($codm))
	{
		location.href='lista_exa1s.php';
	}
}


function formSubmit()
{
	if (validarDato())
	{
		$('#fGrabar').submit();
		alert('GRABADO CON EXITO');
//		getSiguiente(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
//		$('#vf_grabao').val('Si');
//		$('#vf_actual').focus();
	    $('#vf_nombre').val('');
    	$('#vf_anterior').val('');
	    $('#vf_actual').val('');
    	$('#vf_clave').val('');
	    $('#vf_claveuso').val('');
		$('#vf_anterior').focus();
		$('#vf_nombre').focus();
		return true;
	}
	else
	{
		alert('FALTAN DATOS PARA GRABAR ! O SON INCORRECTOS !!!');
	}
}


$(document).ready(function()
						   {
								init();
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
//							   $('#btnGrabar').bind('click',function(){formSubmit();});
//							   $('#btnGrabar').bind('click',function(){Grabar();});
//							   $('#btnAnterior').bind('click',function(){Anterior();});
//							   $('#btnSiguiente').bind('click',function(){Siguiente();});
//							   $('#btnLista').bind('click',function(){location.href='Lista.php';});
//							   $('#btn1').bind('click',function(){Volver();});
							   $('#slcmateria').change(function(){CargarVideo();});	

							   $('#btn1').bind('click',function(){lenguaje();});
							   $('#btn2').bind('click',function(){matematicas();});
							   $('#btn3').bind('click',function(){naturales();});
							   $('#btn4').bind('click',function(){sociales();});
							   $('#btn5').bind('click',function(){musica();});
							   $('#btn6').bind('click',function(){edu_fisica();});
							   $('#btn7').bind('click',function(){religion();});
							   $('#btn8').bind('click',function(){ingles();});
							   $('#btn9').bind('click',function(){psicologia();});
							   $('#btn10').bind('click',function(){filosofia();});
							   $('#btn11').bind('click',function(){computacion();});
							   $('#btn12').bind('click',function(){biologia();});
							   $('#btn13').bind('click',function(){quimica();});
							   $('#btn14').bind('click',function(){fisica();});
							   $('#btn15').bind('click',function(){art_plasticas();});
							   $('#btn16').bind('click',function(){historia();});
							   $('#btn17').bind('click',function(){civica();});
							   $('#btn18').bind('click',function(){geografia();});
							   $('#btn19').bind('click',function(){ortografia();});
							   $('#btnSalir').bind('click',function(){location.href='examen_primaria.php';});  // tb sirve para secundaria
							   $('#btnSalir2').bind('click',function(){location.href='http://www.aizama.net';});
							}
							)
