let listaClasesVirtuales = [];

const cargar_tabla_escritorio = ()=>{
    $("#body-escritorio").empty();
    let index = 1;
    listaClasesVirtuales.forEach(clase_virtual => {
        let curso = clase_virtual.curso;
        let enlace = clase_virtual.link;
        let estado = clase_virtual.estado;
        
        if(estado == 1){
            enlace = `<a href="${enlace}" target="_blank">${enlace}</a>`;
        }

        $("#body-escritorio").append(`
            <tr>
                <td class="index">${index}</td>
                <td class="border-td">${curso}</td>
                <td class="border-td danger">${enlace}</td>
            </tr>
        `); 
        index++;
        
    });
    $(".div-table-escritorio").removeClass("oculto");
}
const cargar_tabla_movil = () =>{
    $("#body-movil").empty();
    listaClasesVirtuales.forEach(clase_virtual =>{
        let curso = clase_virtual.curso;
        let enlace = clase_virtual.link;
        let estado = clase_virtual.estado;
        if(estado == 1){
            enlace = `<a href="${enlace}" target="_blank">${enlace}</a>`;
        }
        $("#body-movil").append(`
            <tr>
                <td class="border-td bold">${curso}</td>
            </tr>
            <tr>
                <td class="border-td danger">${enlace}</td>
            </tr>`);
    });
    $(".div-table-movil").removeClass("oculto");

}
const mostrar_clases_virtuales = () => {
    cargar_tabla_escritorio();
    cargar_tabla_movil();
}
const get_clases_virtuales = () => {
    $.get(
        "controlador/clase_virtual_controlador.php?op=get_cv",
        data =>{
            if (data.status == "eSession") {
                Swal.fire("La sesión ha finalizado, vuelva a iniciar sesión por favor...");
                return;
            }
            if (data.status == "noCursos") {
                Swal.fire("No tiene cursos asignados, solicite a administración para la habilitación de los cursos a su usuario...");
                return;
            }
            if (data.status == "ok") {
                
                listaClasesVirtuales = data.data;
                mostrar_clases_virtuales();
            }
        },
        "json"
    );
}

$(document).ready(()=>{
    get_clases_virtuales();
    $(".btn-refresh-movil").click(() => {
        $(".div-table-escritorio").addClass("oculto");
        $(".div-table-movil").addClass("oculto");
        get_horario();});
    $(".btn-refresh").click(() => {
        $(".div-table-escritorio").addClass("oculto");
        $(".div-table-movil").addClass("oculto");
        close_form();get_horario();
    });
});