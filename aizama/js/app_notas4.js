function getAlu(e,param,c_curso,c_materia)
{
	c_materia = c_materia.toUpperCase();
	if(isKeyEnter(e))
	{
		getAlumnos(param,c_curso,c_materia);
		return true;
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
		getCurso(param);
		return true;
	}
}
function getMate(e,param)
{
	param = param.toUpperCase();
	if(isKeyEnter(e))
	{
		if (valid_materia(param))
		{
			getMateria(param);
			return true;
		}
	}
}
function valid_materia(id_mat){
	var html=$.ajax({type:"GET",url:'validar_materia.php',data:{id:id_mat},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('Esta materia no la dicta este profesor');
	  $('#vf_mza').val('');
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
//	eval(html);
//	$('#vf_nombre2').val(descri);
//	$('#vf_codalu').focus();
//	alert('Si este profesor dicta esta materia');
	return true;
}
function getCurso(id){

	var html=$.ajax({type:"GET",url:'get_curso.php',data:{id:id},async:false}).responseText;
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
	$('#vf_nombre').val(descrip);
	$('#vf_mza').focus();
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
function getAlumnos(id,n_curso,c_mat){
	var html=$.ajax({type:"GET",url:'get_alumnos.php',data:{id:id},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('No se encontraron registro con su criterio de busqueda33.');
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
	$('#vf_paterno').val(paterno);
	$('#vf_materno').val(materno);
	$('#vf_nombres').val(nombres);
	$('#vf_n_curso').val(curso);
	
	if ($('#vf_n_curso').val()==n_curso)
	{
		if ((get_notas(id,c_mat))==0)  // saca si ya tiene notas de esta materia
		{								// si es 0 no tiene notas
//			if (parseInt($('#vf_n1').val())==0)
			{
				$('#vf_n1').val('')
				$('#vf_n2').val('')
				$('#vf_n3').val('')
				$('#vf_n4').val('')
				$('#vf_n5').val('')
			}
		}
		$('#vf_n1').focus();
		return true;
	}
	else
	{
				$('#vf_n1').val('')
				$('#vf_n2').val('')
				$('#vf_n3').val('')
				$('#vf_n4').val('')
				$('#vf_n5').val('')
	  alert('El codigo de este alumno no pertenece a este curso');
		return false;
	}
}
function get_notas(id3,idm3)
{
	var html=$.ajax({type:"GET",url:'get_nota4_alu.php',data:{id4:id3,idm4:idm3},async:false}).responseText;
	if(html=='eNoResults'){  // no hay registro de notas de esta materia de este alumno
	  return 0;
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
	$('#vf_n1').val(n1);
	$('#vf_n2').val(n2);
	$('#vf_n3').val(n3);
	$('#vf_n4').val(n4);
	$('#vf_n1').focus();
	$suma=parseInt($('#vf_n1').val()) + parseInt($('#vf_n2').val()) + parseInt($('#vf_n3').val()) + parseInt($('#vf_n4').val())
	$('#vf_n5').val($suma)
	return 1;
}
function Buscar()
{
	    	$('#vf_carnet').val('');
	    	$('#vf_carnet2').val('');
	    	$('#vf_carnet3').val('');
	    	$('#vf_paterno').val('');
		    $('#vf_materno').val('');
    		$('#vf_esposo').val('');
		    $('#vf_nombre').val('');
		    $('#vf_nombre2').val('');
			$('#vf_dir').val('');
			$('#vf_total').val(0);
			$('#vf_carnet3').focus();
			return true;
}
function Buscar_dato(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		getBuscar(param); //verifica si esta en el padron
		return true;
	}
}
function getBuscar(id)
{
	var html=$.ajax({type:"GET",url:'lista_buscar.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('ESTE CODIGO NO ESTA REGISTRADO !!!');
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
	eval(html);
    $('#vf_carnet').val(car);
    $('#vf_carnet2').val(id);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_nombre2').val(nombre);
    $('#vf_registro').val(nro_reg);
	$('#vf_lugar').focus();
		return true;
}
function getEncargado(id){
	var html=$.ajax({type:"GET",url:'get_encargado.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('No EXISTE EL CODIGO REGISTRADO EN ENCARGADOS, REGISTRELO PREVIAMENTE');
	$('#vf_carnet').focus();
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
	$('#vf_carnet2').focus();
		return true;
}
function getPadronEnc(id){
	var html=$.ajax({type:"GET",url:'get_padron_enc.php',data:{id:id},async:false}).responseText;

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
	eval(html);
    $('#vf_nombre2').val(nom);
	$('#vf_carnet2').focus();
		return true;
}
function Lugar(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		getLugar(param);
		return true;
	}
}


function getLugar(id){
	var html=$.ajax({type:"GET",url:'get_lugar.php',data:{id:id},async:false}).responseText;

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
	eval(html);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
	$('#vf_lugar').focus();
		return true;
}

function Padron(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		getPadron(param); //verifica si esta en el padron
		return true;
	}
}


function getPadron(id){
	var html=$.ajax({type:"GET",url:'get_padron.php',data:{id:id},async:false}).responseText;

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
	eval(html);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
	$('#vf_lugar').focus();
		return true;
}

function CargarContrato(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_nombre').val('');
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!')
			return;
		}
		param=param*10/10
//		SacarContrato(param);
		if (SacarContrato(param))
		{
			$('#vf_actual').focus();
		}
		else
		{
			$('#vf_contrato').focus();
		}
	}
	else
	{
		$('#vf_nombre').val('');
	}
}
function SacarContrato(id){
	var html=$.ajax({type:"GET",url:'sacar_contrato.php',data:{id:id},async:false}).responseText;
	
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
	clearInputs();
	eval(html);
    $('#vf_catastro').val(codcatastral);
	$('#vf_contrato').val(idcontrato);
	$('#vf_nombre').val(nombre);
	$('#vf_anterior').val(anterior);
	$('#vf_actual').val(lectura);
	$('#vf_promedio').val(promedio);
	$('#vf_nrocor').val(nrocor);
	$('#vf_periodo').val(periodo);
	$('#vf_medidor').val(nroseriemedidor);
	$('#vf_ubicacion').val(ubicacion);
	$('#vf_clave').val(clavelectura);
	$('#vf_desclave').val(deslectura);
	$('#vf_claveuso').val(claveuso);
	$('#vf_desclaveuso').val(desuso);
	$('#vf_categoria').val(idcategoria);
	$('#vf_descategoria').val(descategoria);
	$('#vf_grabados').val(grabados);
	if ($('#vf_actual').val()== '')
	{
		$('#vf_grabao').val('NO');
	}
	else
	{
		$('#vf_grabao').val('Si');
	}
	return true;
}


function getClaveUso(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_desclaveuso').val('');
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!')
			return;
		}
		param=param*10/10
		SacarClaveUso(param);
	}
}

function Sigue(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_actual').focus();
		return true;
	}
}
function Sigue2(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_clave').focus();
		return true;
	}
}
function Sigue3(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_claveuso').focus();
		return true;
	}
}
function Sigue4(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		$('#btnGrabar').focus();
		return true;
	}
}
function getGrab3(e,param)
{

	if(isKeyEnter(e))  //presiono enter
	{
		getGrab2(param);
		return true;
	}
}


function getGrab2(id){
	var html=$.ajax({type:"GET",url:'get_grabado.php',data:{id:id},async:false}).responseText;
	
	if(html=='eNoResults'){
//	  alert('No se encontraron registro con su criterio de busqueda. MESA NO INTROD');
    $('#vf_anterior').val('');
    $('#vf_actual').val('');
    $('#vf_clave').val('');
    $('#vf_claveuso').val('');
	$('#vf_anterior').focus();
	  return true;
//	  return false;
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
    $('#vf_desclave').val(desclave);
    $('#vf_anterior').val(p1);
    $('#vf_actual').val(p2);
    $('#vf_clave').val(vb);
    $('#vf_claveuso').val(vn);
//    $('#vf_clave').val(id);
	$('#vf_anterior').focus();
		alert('Mesa ya grabada !!!!!');
		return true;
}

function getLect(e,param,prom,anterior)
{
		  alert('hola ');

	if(isKeyEnter(e))  //presiono enter
	{
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!')
			return;
		}
		if (parseInt(param) <= parseInt(anterior))
		{
			alert('PRECAUCION!! La lectura actual: '+parseInt(param)+'. Es MENOR a la anterior: '+parseInt(anterior)+'. VERIFIQUE!!!!: ');
		}
		else
		{
			cubos=param-anterior;
			nuevo_prom=((cubos-prom)*100)/prom;
			if (nuevo_prom >= 50)
			{
				//alert('El promedio de la lectura es mayor al 50 %');
				alert('Ojo ' + parseInt(nuevo_prom) + '%');
			}
		}
		$('#vf_clave').focus();
	}
}

function getClaveLect(e,param)
{
	if(isKeyEnter(e))  //presiono enter
	{
		$('#vf_desclave').val('');
		if(parseInt(param)!=param)
		{
			alert('Dato invalido !!!!')
			return;
		}
		param=param*10/10
		getClave(param);
	}
}
function isKeyEnter(e)
{
	var evt=e?e:event;
	var key=window.Event?evt.which:evt.keyCode;
	if(key==13)	return true;return false;
}
function getClave(id){
	var html=$.ajax({type:"GET",url:'get_clave_lect.php',data:{id:id},async:false}).responseText;
	
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
    $('#vf_desclave').val(desclave);
    $('#vf_clave').val(id);
	$('#vf_claveuso').focus();
	return true;
}
function SacarClaveUso(id){
	var html=$.ajax({type:"GET",url:'get_clave_uso.php',data:{id:id},async:false}).responseText;
	
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
    $('#vf_desclaveuso').val(desclaveuso);
    $('#vf_claveuso').val(id);
	$('#vf_claveuso').focus();
	return true;
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

function getSiguiente(id)
{

	var html=$.ajax({type:"GET",url:'lista_siguiente.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('Fin de Archivo');
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
	clearInputs();
	eval(html);
    $('#vf_carnet').val(carnet);
    $('#vf_carnet2').val(carnet2);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_nombre2').val(nombre);
    $('#vf_registro').val(nro_reg);
	$('#vf_lugar').focus();
		return true;
}
function getAnterior(id)
{
	var html=$.ajax({type:"GET",url:'lista_anterior.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('Inicio de Archivo');
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
	clearInputs();
	eval(html);
    $('#vf_carnet').val(carnet);
    $('#vf_carnet2').val(carnet2);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_nombre2').val(nombre);
    $('#vf_registro').val(nro_reg);
	$('#vf_lugar').focus();
		return true;
}
function getInicio(id)
{
	var html=$.ajax({type:"GET",url:'lista_inicio.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('Inicio de Archivo');
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
	clearInputs();
	eval(html);
    $('#vf_carnet').val(carnet);
    $('#vf_carnet2').val(carnet2);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_nombre2').val(nombre);
    $('#vf_registro').val(nro_reg);
	$('#vf_lugar').focus();
		return true;
}
function getFin(id)
{
	var html=$.ajax({type:"GET",url:'lista_fin.php',data:{id:id},async:false}).responseText;

	if(html=='eNoResults'){
	  alert('Inicio de Archivo');
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
	clearInputs();
	eval(html);
    $('#vf_carnet').val(carnet);
    $('#vf_carnet2').val(carnet2);
    $('#vf_paterno').val(pat);
    $('#vf_materno').val(mat);
    $('#vf_esposo').val(esp);
    $('#vf_nombre').val(nom);
    $('#vf_dir').val(dom);
    $('#vf_nombre2').val(nombre);
    $('#vf_registro').val(nro_reg);
	$('#vf_lugar').focus();
		return true;
}
function Inicio()
{
	getInicio(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#vf_carnet').focus();
}
function Fin()
{
	getFin(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#vf_carnet').focus();
}
function Siguiente()
{
	getSiguiente(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#vf_carnet').focus();
}

function Anterior()
{
	getAnterior(1); // paso este valor 1 solo para que entre, no tiene ningun efecto
	$('#vf_actual').focus();
}
function Nuevo()
{
	    	$('#vf_carnet').val('');
		    $('#vf_nombre2').val('');
	    	$('#vf_carnet2').val('');
	    	$('#vf_paterno').val('');
		    $('#vf_materno').val('');
    		$('#vf_esposo').val('');
		    $('#vf_nombre').val('');
			$('#vf_dir').val('');
			$('#vf_otro').val('');
			$('#vf_otro2').val('');
			$('#vf_carnet').focus();
			return true;
}

function getOtro(id){
	var html=$.ajax({type:"GET",url:'get_padron_otro.php',data:{id:id},async:false}).responseText;

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
	eval(html);
    $('#vf_otro2').val(nom);
	return true;
}

function Validar1(e,param)
{
  if(isKeyEnter(e))  // presiono ENTER
  {	
	if (parseInt(param) > 20)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		$suma=0
		$suma=parseInt($('#vf_n1').val()) + parseInt($('#vf_n2').val()) + parseInt($('#vf_n3').val()) + parseInt($('#vf_n4').val())
		$('#vf_n5').val($suma)
		if (parseInt($('#vf_n2').val())==0)
		{
			$('#vf_n2').val('');
		}
		$('#vf_n2').focus();
		return true;
	}
  }
}
function Validar2(e,param)
{
  if(isKeyEnter(e))  // presiono ENTER
  {	
	if (parseInt(param) > 30)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		$suma=0
		$suma=parseInt($('#vf_n1').val()) + parseInt($('#vf_n2').val()) + parseInt($('#vf_n3').val()) + parseInt($('#vf_n4').val())
		$('#vf_n5').val($suma)
		if (parseInt($('#vf_n3').val())==0)
		{
			$('#vf_n3').val('');
		}
		$('#vf_n3').focus();
		return true;
	}
  }
}
function Validar3(e,param)
{
  if(isKeyEnter(e))  // presiono ENTER
  {	
	if (parseInt(param) > 30)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		$suma=0
		$suma=parseInt($('#vf_n1').val()) + parseInt($('#vf_n2').val()) + parseInt($('#vf_n3').val()) + parseInt($('#vf_n4').val())
		$('#vf_n5').val($suma)
		if (parseInt($('#vf_n4').val())==0)
		{
			$('#vf_n4').val('');
		}
		$('#vf_n4').focus();
		return true;
	}
  }
}
function Validar4(e,param)
{
  if(isKeyEnter(e))  // presiono ENTER
  {	
	if (parseInt(param) > 20)
	{
		alert('El valor es invalido')
		return false;
	}
	else
	{
		$suma=0;
		$suma=parseInt($('#vf_n1').val()) + parseInt($('#vf_n2').val()) + parseInt($('#vf_n3').val()) + parseInt($('#vf_n4').val());
		$('#vf_n5').val($suma);
		$('#btnGrabar1').focus()
		return true;
	}
  }
}

function validarDato()
{
	if ($('#vf_codigo').val() == '' || $('#vf_mza').val() == '' || $('#vf_codalu').val() == '' || $('#vf_n1').val() == '' || $('#vf_n2').val() == '' || $('#vf_n3').val() == '' || $('#vf_n4').val() == '')
	{
		return false;
	}
	else
	{
		if (parseInt($('#vf_n1').val()) >= 0 && parseInt($('#vf_n2').val()) >= 0 && parseInt($('#vf_n3').val()) >= 0 && parseInt($('#vf_n4').val()) >= 0)
		{
			return true;
		}
		else
		{
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
function grabar(id8,id9,id11,id12,id13,id14)
{
	var html=$.ajax({type:"GET",url:'grabar_registro4.php',data:{id1:id8,id2:id9,id3:id11,id4:id12,id5:id13,id6:id14},async:false}).responseText;

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
	if(html=='eGrabado'){
	  return true;
	}
}

function formSubmit()
{
	if (validarDato())
	{
		if (grabado($('#vf_codalu').val(),$('#vf_mza').val())==1)
		{
//			$('#fGrabar').submit();
			if(grabar($('#vf_codalu').val(),$('#vf_mza').val(),$('#vf_n1').val(),$('#vf_n2').val(),$('#vf_n3').val(),$('#vf_n4').val()))
			{
				alert('GRABADO CON EXITO');
		    	$('#vf_codalu').val('');
	    		$('#vf_n_curso').val('');
		    	$('#vf_paterno').val('');
			    $('#vf_materno').val('');
			    $('#vf_nombres').val('');
				$('#vf_n1').val('')
				$('#vf_n2').val('')
				$('#vf_n3').val('')
				$('#vf_n4').val('')
				$('#vf_n5').val('')
				$('#vf_codalu').focus();
				return true;
			}
			else
			{
				alert('NO SE GRABO !!!!!');
				return false;
			}
		}
		else
		{
			if (grabado($('#vf_codalu').val(),$('#vf_mza').val())==2)
			{
				if (regrabar($('#vf_codalu').val(),$('#vf_mza').val(),$('#vf_n1').val(),$('#vf_n2').val(),$('#vf_n3').val(),$('#vf_n4').val()))
				{
					alert('ACTUALIZADO CON EXITO');
			    	$('#vf_codalu').val('');
	    			$('#vf_n_curso').val('');
				    $('#vf_paterno').val('');
				    $('#vf_materno').val('');
				    $('#vf_nombres').val('');
					$('#vf_n1').val('')
					$('#vf_n2').val('')
					$('#vf_n3').val('')
					$('#vf_n4').val('')
					$('#vf_n5').val('')
					$('#vf_codalu').focus();
					return true;
				}
				else
				{
					alert('sin ACTUALIZAR');
					return false;
				}
			}
		}
	}
	else
	{
		alert('FALTAN DATOS PARA GRABAR ! O SON INCORRECTOS 1!!!');
		return false;
	}
}

function regrabar(c_alu,c_mat,n1,n2,n3,n4)
{
	c_mat = c_mat.toUpperCase();
	var html=$.ajax({type:"GET",url:'actualizar_nota4.php',data:{id1:c_alu,id2:c_mat,id3:n1,id4:n2,id5:n3,id6:n4},async:false}).responseText;
	if(html=='eNoResults'){
	  alert('No se actualizo');
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
	if(html=='eActualizado'){
	 // alert('Actualizado');   // se actualizo sin problemas
	  return true;
	}
}

$(document).ready(function()
						   {
//							   $('#btnGrabar').bind('click',function(){if(validarDato()){$('#fLogin').submit();}});
							   $('#btnGrabar1').bind('click',function(){formSubmit();});
							   $('#btnInicio').bind('click',function(){Inicio();});
							   $('#btnAnterior').bind('click',function(){Anterior();});
							   $('#btnSiguiente').bind('click',function(){Siguiente();});
							   $('#btnFin').bind('click',function(){Fin();});
							   $('#btnNuevo').bind('click',function(){Nuevo();});
							   $('#btnBuscar').bind('click',function(){Buscar();});
							   $('#btnVer').bind('click',function(){location.href='ver_datos.php';});
							   $('#btnEncargado').bind('click',function(){location.href='Encargado.php';});
							   $('#btnSalir').bind('click',function(){location.href='menu1.php';});
							}
							)
