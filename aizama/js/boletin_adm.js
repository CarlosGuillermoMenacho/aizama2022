const d = document;
/* Select */
const formulario = d.querySelector("#formulario");
const select = d.querySelector("#select-alumno");
/* Codigo Alumno */
let codigo_alumno;
/* Informacion alumno */
const paralelo = d.querySelector(".paralelo-alumno");
const curso = d.querySelector(".curso-alumno");
const turno = d.querySelector(".turno-alumno");
var nivel;
/* Tabla */
const tabla = d.querySelector(".contenedor-table-general");
const tablaFiltrada = d.querySelector(".contenedor-table-filtrada");
const filaTabla = d.querySelector("#campos");
const filaTablaInicial = d.querySelector(".contenedor-table-filtrada #campos");
/* Lista de notas */
var boletin;

function obtenerNotas(nivel, containerTable) {
  for (let i = 0; i < boletin.length; i++) {
    const nombre_materia = boletin[i]["nommat"];
    const primer_trimestre = boletin[i]["first"];
    const segundo_trimestre = boletin[i]["second"];
    const tercer_trimestre = boletin[i]["third"];
    const nota_final = boletin[i]["final"];
    if (nivel != "1") {
      tablaFiltrada.classList.remove("active");
      tabla.classList.add("active");
      containerTable.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td data-label="Materia"> ${nombre_materia} </td>
          <td data-label="1er Trimestre"> ${primer_trimestre} </td>
          <td data-label="2er Trimestre"> ${segundo_trimestre} </td>
          <td data-label="3er Trimestre"> ${tercer_trimestre} </td>
          <td data-label="Nota Final"> ${nota_final} </td>
        </tr>`
      );
    } else {
      tabla.classList.remove("active");
      tablaFiltrada.classList.add("active");

      containerTable.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td data-label="Materia"> ${nombre_materia} </td>
          <td data-label="1er Trimestre" style="padding:24px 15px;" class=nota-literal> 
            ${primer_trimestre}
          </td>
          <td data-label="2er Trimestre" style="padding:24px 15px;" class=nota-literal> 
            ${segundo_trimestre}
          </td>
          <td data-label="3er Trimestre" style="padding:24px 15px;" class=nota-literal> 
            ${tercer_trimestre}
          </td>
        </tr>`
      );
    }
  }
}
function peticionNotas() {
  let peticion = new XMLHttpRequest();
  let respuesta;
  peticion.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      respuesta = JSON.parse(peticion.responseText);
    }
  };
  var formData = new FormData(document.forms.formulario);
  peticion.open("POST", "boletin_json.php?op=dir", false);
  peticion.send(formData);

  switch (respuesta["status"]) {
    case "sinMaterias":
      while (filaTabla.firstChild) {
        filaTabla.removeChild(filaTabla.firstChild);
      }
      d.querySelector(".info-alumno").style.display = "none";
      d.querySelector(".contenedor-tables").style.display = "none";
      alert("No tienes materias.");
      break;
    case "eSession":
      alert("La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos");
      location.href = "usuario.php";
      break;
    case "ok":
      $("#campos").children().remove();
      $(".contenedor-table-filtrada #campos").children().remove();
      boletin = respuesta["boletin"];
      nivel = respuesta["info"]["nivel"];
      paralelo.textContent = respuesta["info"]["paralelo"];
      curso.textContent = respuesta["info"]["curso"];
      turno.textContent = respuesta["info"]["turno"];
      let containerTable;
      if (nivel != "1") {
        containerTable = filaTabla;
        document.querySelector(".print__table thead tr").children[4].style.display =
          "block";
      } else {
        document.querySelector(".print__table thead tr").children[4].style.display =
          "none";
        containerTable = filaTablaInicial;
      }
      obtenerNotas(nivel, containerTable);

      /* Informacion Addicional para Imprimir */
      $(".print__info-curso span").text(
        `${respuesta["info"]["curso"]} - ${respuesta["info"]["paralelo"]}`
      );
      $(".print__info-turno span").text(respuesta["info"]["turno"]);
      const nombreAlumno = $("#select-alumno option:selected").text();
      $(".print__info-nombre span").text(nombreAlumno);
      d.querySelector(".info-alumno").style.display = "block";
      d.querySelector(".contenedor-tables").style.display = "flex";
      let containerTableImprimir = document.querySelector("#camposImprimir");
      $("#camposImprimir").children().remove();
      obtenerNotas(nivel, containerTableImprimir);
      break;
    default:
      d.querySelector(".info-alumno").style.display = "none";
      d.querySelector(".contenedor-tables").style.display = "none";
      alert("Este alumno no esta registrado.");
      break;
  }
}

/* Pido lista de alumno y relleno al select */
let peticion = new XMLHttpRequest();
let respuesta;
peticion.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    respuesta = JSON.parse(peticion.responseText);
    const lista_alumnos = respuesta["lista"];
    for (let i = 0; i < lista_alumnos.length; i++) {
      let codigo = lista_alumnos[i]["codigo"];
      let nombre = lista_alumnos[i]["nombre"];
      select.insertAdjacentHTML(
        "beforeend",
        `<option value=${codigo}>${nombre}</option>`
      );
    }
  }
};
peticion.open("POST", "alumno_json.php?op=lad", false);
peticion.send();

d.addEventListener("DOMContentLoaded", function () {
  d.querySelector(".info-alumno").style.display = "none";
  d.querySelector(".contenedor-tables").style.display = "none";

  /* Obtengo el codigo de alumno y pido el boletin*/
  $("#select-alumno").change(function () {
    if (select.value != 0) {
      codigo_alumno = $("#select-alumno");
      peticionNotas();
    }
  });
});
