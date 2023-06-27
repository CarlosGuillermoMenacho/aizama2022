<?php 
session_start();
require_once"session_verify.php";
if($_SESSION['app_user_type'] != "adm"){
	header("Location: ../perfil.php");
}
if($_SESSION['app_user_id']==16){
    require 'header_dir.php';
}else{
    require 'header_adm.php';
}

?>
<link rel="stylesheet" type="text/css" href="css/gestion_alumnos_adm.css?v=<?php echo rand();?>">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" integrity="sha512-nMNlpuaDPrqlEls3IX/Q56H36qvBASwb3ipuo3MxeWbsQB1881ox0cRv7UPTgBlriqoynt35KjEwgGUeUXIPnw==" crossorigin="anonymous" />
<link rel="stylesheet" type="text/css" href="css/checkbox_style.css">
<div class="content">
	<div class="title"><h1>Gestión de Alumnos</h1></div>
	<div class="div-selects oculto">
		<select id="seleccionar_curso"><option value="">-- Seleccionar Curso --</option></select>
		<select id="seleccionar_paralelo"><option value="">-- Seleccionar Paralelo --</option></select>
		<select id="seleccionar_alumno"><option value="">-- Seleccionar Alumno --</option></select>
	</div>
</div>
<div class="main-div-escritorio">
    <div class="div-table-escritorio oculto">
        <div class="div-config">
            <button id="btn_lista_general" class="btn-config">Lista General</button>
            <button id="btn_congig" class="btn-config">Accesos</button>
        </div>
        <table>
            <thead id="head-escritorio">
                <tr>
                    <td>No.</td>
                    <td>Nombre</td>
                    <td>Código</td>
                    <td class="cur">Curso</td>
                    <td>Info.</td>
                    <td>Kardex</td>
                    <td>Agenda</td>
                </tr>
            </thead>
            <tbody id="body-escritorio">
                
            </tbody>
        </table>
            
    </div>
</div>
<div class="formulario_asignacion oculto">
    <div class="btn-close">
        <img src="images/close.svg" onclick="close_form();">
    </div>
    <div class="title-alumno">
        <h2>Datos del Estudiante</h2>
    </div>
    <form id="formulario">
        <div class="datos-form">
            <div class="datos-nombres">
                <div class="div-input">
                    <label>Apellido Paterno</label>
                    <input type="text" name="paterno" id="paterno" placeholder="Apellido Paterno...">
                </div>
                <div class="div-input">
                    <label>Apellido Materno</label>
                    <input type="text" name="materno" id="materno" placeholder="Apellido Materno...">
                </div>
                <div class="div-input">
                    <label>Nombres</label>
                    <input type="text" name="nombres" id="nombres" placeholder="Nombres...">
                </div>
            </div>
            <div class="usuario-clave">
                <div class="div-input">
                    <label>Usuario</label>
                    <input type="text" name="usuario" id="usuario" placeholder="Usuario...">
                </div>
                <div class="div-input">
                    <label>Clave</label>
                    <input type="text" name="clave" id="clave" placeholder="Clave...">
                </div>
                <div class="div-input">
                    <label>Gestión</label>
                    <input type="text" name="gestion" id="gestion" placeholder="Gestión...">
                </div>
            </div>  
            <div class="datos-curso">
                <div class="div-input div-slc">
                    <label>Curso</label>
                    <select id="slcform_curso"><option value="">-- Seleccionar Curso --</option></select>
                </div>
                <div class="div-input div-slc">
                    <label>Paralelo</label>
                    <select id="slcform_paralelo"><option value="">-- Seleccionar Paralelo --</option></select>
                </div>
            </div>
            <div class="btn-update-datos">
                <button id="btn-update-datos">ACTUALIZAR</button>
            </div>          
        </div>
        <div class="title-alumno">
            <h2>ACCESOS</h2>
        </div>
        <div class="datos-form">
            <div class="container-checkbox">
                <div class="div-checkbox">
                    <div style="display:flex; align-items:center;">
                        <img src="images/boletin_icon.svg" alt="icono" width="40px">
                        <h3 style="font-weight:normal; margin-left:10px">Boletín</h3>
                    </div>
                    <div class="checkbox-wrapper-64">
                      <label class="switch">
                        <input type="checkbox" id="cb-boletin" onclick="set_Boletin(this);">
                        <span class="slider"></span>
                      </label>
                    </div>
                </div>
                <div class="div-checkbox">
                    <div style="display:flex; align-items:center;">
                        <img src="images/icon-examen.svg" alt="icono" width="40px">
                        <h3 style="font-weight:normal; margin-left:10px">Evaluación</h3>
                    </div>
                    <div class="checkbox-wrapper-64">
                      <label class="switch">
                        <input type="checkbox" id="cb-evaluacion" onclick="set_Evaluacion(this);">
                        <span class="slider"></span>
                      </label>
                    </div>
                </div>
                <div class="div-checkbox">
                    <div style="display:flex; align-items:center;">
                        <img src="images/plataforma_icon.svg" alt="icono" width="40px">
                        <h3 style="font-weight:normal; margin-left:10px">Plataforma</h3>
                    </div>
                    <div class="checkbox-wrapper-64">
                      <label class="switch">
                        <input type="checkbox" id="cb-plataforma" onclick="set_Plataforma(this);">
                        <span class="slider"></span>
                      </label>
                    </div>
                </div>
            </div>         
        </div>
        <div class="title-alumno">
            <h2>TUTORES ASIGNADOS</h2>
        </div>
        <div class="datos-form">
            <div class="div-lista-tutores">
                <table>
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>Nombre</td>
                            <td>Código</td>
                            <td>Contacto</td>
                            <td style="text-align:center;">Opciones</td>
                        </tr>
                    </thead>
                    <tbody id="body-tutores">
                        <tr>
                            <td class="index">1</td>
                            <td>Carlos Guillermo Menacho Zárate</td>
                            <td>2045</td>
                            <td>77367545</td>
                            <td class="td-options">
                                <a style="display:flex;" href="https://api.whatsapp.com/send?phone=59177367545" target="_blank">
                                    <img class="icon-option" src="svg/whatsapp.svg" width="20px">
                                </a>
                                <img class="icon-option" src="svg/close.svg" width="20px">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="div-asignar-tutor">
                    <div>
                        <select id="seleccionar_tutor"><option value=""> -- Seleccione un tutor --</option></select>                    
                    </div>
                    <div class="btn-update-datos">
                        <button id="btn-asignar" >ASIGNAR</button>                        
                    </div>
                </div>
            </div>        
        </div>
    </form>
</div>
<div class="main-div-kardex-escritorio oculto">
    <div class="btn-close">
        <img src="images/close.svg" onclick="close_kardex();">
    </div>
    <div class="div-table-kardex-escritorio">
        <div class="title-kardex">
            <h2>KARDEX DE PAGO</h2>
            <div class="head-kardex">
                <p id="name-student">Estudiante: <b>CARLOS GUILLERMO MENACHO ZÁRATE</b></p>
                <div class="btn-gestion-kardex">
                    <input type="text" id="input-gestion" value="<?php echo date("Y");?>">
                    <div class="btn-gestion">
                        <button id="btn-gestion">Consultar</button>                        
                    </div>
                </div>
            </div>
            <div class="gestion-kardex">
                <p id="gestion-kardex">GESTIÓN 2023</p>
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
            <tbody id="body-kardex-escritorio">
                <tr class="onCursor">
                    <td class="index">1</td>
                    <td class="border-td2">2023-03-13</td>
                    <td class="border-td2">E/1a Cuota(Feb/2023)</td>
                    <td class="border-td right">270.00</td>
                    <td class="border-td right">3330.00</td>
                </tr>
            </tbody>
        </table>
            
    </div>
</div>
<div class="main-div-agenda-escritorio oculto">
     <div class="btn-close">
        <img src="images/close.svg" onclick="close_agenda();">
    </div>
    <div class="div-table-agenda-escritorio">
        <div class="title-agenda">
            <h2>AGENDA</h2>
            <div class="head-agenda">
                <p id="name-student-agenda">Estudiante: <b>CARLOS GUILLERMO MENACHO ZÁRATE</b></p>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <td colspan="9">
                        <div class="head-table-agenda">
                            <div class="div-print">
                                <img src="svg/imprimir.svg" onclick="print_agenda()">
                            </div>
                            <div class="div-search">
                                <input class="input-search" id="input_date_ini" type="date" placeholder="B&uacute;squeda..."/>
                                <input class="input-search" id="input_date" type="date" placeholder="B&uacute;squeda..."/><a class="btn-search" href="#" onclick="search_data();"><img src="svg/busqueda.svg"></a>
                            </div> 
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>No.</td>
                    <td>Mensaje</td>
                    <td>Hora</td>
                    <td>Emisor</td>
                    <td>Info.</td>
                </tr>
            </thead>
            <tbody id="body-agenda-escritorio">
                <tr class="onCursor">
                    <td class="index">1</td>
                    <td class="border-td2">Mensaje</td>
                    <td class="border-td2">17:20:30</td>
                    <td class="border-td">Juan Solares</td>
                    <td class="border-td">Matemáticas</td>
                </tr>
            </tbody>
        </table>
            
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>
<script type="text/javascript">
	$("#seleccionar_curso").select2({width:"250px"});
	$("#seleccionar_paralelo").select2({width:"250px"});
    $("#slcform_curso").select2({width:"250px"});
    $("#slcform_paralelo").select2({width:"250px"});
	$("#seleccionar_alumno").select2({width:"250px"});
    $("#seleccionar_tutor").select2({width:"250px"});
</script>
<script type="text/javascript" src="js/gestion_alumnos_adm.js?v=<?php echo rand();?>"></script>