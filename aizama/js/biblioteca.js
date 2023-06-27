const terminoBusqueda = document.querySelector("#terminoBusqueda");
const btnBusqueda = document.querySelector("#btnBuscar");
/* Termino de busqueda */
terminoBusqueda.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    buscarBusqueda();
  }
});
btnBusqueda.addEventListener("click", buscarBusqueda);
async function buscarBusqueda() {
  if (terminoBusqueda.value.length > 3) {
    const formData = [{ key: "cadena", value: terminoBusqueda.value }];
    const url =
      "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=search";
    try {
      document.querySelector(".container-loader").style.display = "block";
      const dataBusqueda = await peticion(url, formData);
      setTimeout(() => {
        document.querySelector(".container-loader").style.display = "none";
      }, 250);
      const tabBusqueda = document.getElementsByClassName("tablinks")[2];
      activeTab(tabBusqueda, "busqueda");
      if (dataBusqueda.length > 0) {
        document.querySelector(".errorBusqueda").style.display = "none";
        mostrarTerminoBusqueda(dataBusqueda);
        document.querySelector(".contenedor-card-busqueda").style.display = "grid";
      } else {
        document.querySelector(".errorBusqueda").style.display = "block";
        document.querySelector(".contenedor-card-busqueda").style.display = "none";
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    Swal.fire("Por favor introduzca al menos 4 caracteres para la busqueda");
    return;
  }
}

const mostrarTerminoBusqueda = (dataBusqueda) => {
  $(".contenedor-card-busqueda").children().remove();
  dataBusqueda.forEach(async (data) => {
    const { lib_nombre, tem_id, tem_nombre, cur_nombre, edi_nombre, mat_nombre } = data;
    const material = await contenidoTemaBusqueda(tem_id);
    const contenido = material != "" ? material : "";
    $(".contenedor-card-busqueda").append(
      `
      <div>
        <h2 id="titulo-libro-busqueda">${lib_nombre}</h2>
        <div class="label-busqueda">
          <label>Curso: </label> <span>${cur_nombre}</span>
        </div>
        <div class="label-busqueda">
          <label>Materia: </label> <span>${mat_nombre}</span>
        </div>
        <div class="label-busqueda">
          <label>Editorial: </label> <span>${edi_nombre}</span>
        </div>
        <div class="tema-dropdown">
          <button type="button" onclick="drowpdown(this)">
            <h3>${tem_nombre}</h3>
            <img src="images/down-arrow.svg" width="22px" alt="icono">
          </button>
          ${contenido}
        </div>
      </div>
      `
    );
  });
};
const contenidoTemaBusqueda = async (idTema) => {
  const formData = [{ key: "tem_id", value: idTema }];
  const url =
    "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=materiales";
  try {
    const dataBusquedaMaterialTema = await peticion(url, formData);
    if (dataBusquedaMaterialTema != "") {
      const contenidoTema = obtenerContenidoTemaBusqueda(dataBusquedaMaterialTema);
      return contenidoTema;
    } else {
      return "";
    }
  } catch (error) {
    throw new Error(error);
  }
};
const obtenerContenidoTemaBusqueda = (materiales) => {
  let html = "";
  const { material, material_complementario } = materiales;
  material.forEach((item) => {
    const { mate_enlace, mate_id, mate_numero, mate_descripcion } = item;
    const materialComplementario = obtenerContenidoComplementarioTemaBusqueda(
      material_complementario,
      mate_id
    );
    let srcImage = "";
    if (mate_enlace.includes("drive") || mate_enlace.includes("docs")) {
      srcImage = "images/icon-presentation.svg";
    } else {
      srcImage = "images/icon-youtube.svg";
    }
    html += `
      <div id="dropdown" class="contenedor__contenido-tema">
        <a href="${mate_enlace}" target="_blank">
          <div class="enlace__tema">
            <span>${mate_numero}. ${mate_descripcion}</span>
            <img src="${srcImage}" alt="icono">
          </div> 
        </a>
        ${materialComplementario}
      </div>
    `;
  });
  return html;
};
const obtenerContenidoComplementarioTemaBusqueda = (array, idMaterial) => {
  let htmlMaterialComplementario = `
    <div class="recurso__button">
      <div class="contenido-tema__recurso-button">
        <button class="drop-btn-recursos" type="button" onclick="drowpdown(this)">
          Recursos 
        </button>
        <div id="dropdown" class="contenedor-contenido__recursos">
  `;
  const materialeComplementarioFiltrados = array.filter(
    (material) => material.mat_com_material == idMaterial
  );
  materialeComplementarioFiltrados.forEach((materialComplementario) => {
    const { mat_com_descripcion, mat_com_enlace } = materialComplementario;
    htmlMaterialComplementario += `<a target="_blank" href="${mat_com_enlace}" class="enlace__tema">
        <span>${mat_com_descripcion}</span>
         <img src="images/icon-youtube.svg" alt="icono">
      </a>`;
  });
  htmlMaterialComplementario += "</div></div></div> ";
  if (materialeComplementarioFiltrados.length > 0) {
    return htmlMaterialComplementario;
  } else {
    return "";
  }
};

/* -------------------------------------------------------- */
let cursos = [];
let materias = [];
let libros = [];

let materiasCursosSeleccionado = [];
let materiasIdCursoSeleccionado;

window.onload = async () => {
  try {
    /* Peticiones */
    const urlCurso =
      "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=cursos";
    const urlMateria =
      "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=materias";
    [cursos, materias] = await Promise.all([peticion(urlCurso), peticion(urlMateria)]);

    $(".contenedor-card-curso").children().remove();
    renderCard(cursos, "contenedor-card-curso", "pedirMateriaCurso");

    $(".contenedor-card-materia").children().remove();
    renderCard(materias, "contenedor-card-materia", "pedirLibroMateria");
  } catch (error) {
    throw new Error(error);
  }
};
const peticion = (url, data) => {
  if (data != null) {
    const formData = new FormData();
    data.forEach((item) => {
      const { key, value } = item;
      formData.append(key, value);
    });
    data = formData;
  } else {
    data = null;
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseText != "") {
          resolve(JSON.parse(xhr.responseText));
        } else {
          resolve("");
        }
      }
    };
    xhr.send(data);
  });
};

const renderCard = (
  array,
  container,
  nombreFuncion,
  parametroOpcional = null,
  parametroOpcionalFuncion = null
) => {
  array.forEach((item) => {
    const { id, nombre, img } = item;
    $(`.${container}`).append(
      `<div class="card">
        <img src="${img}" alt="Imagen">
        <div class="card__contenido">
          <h3>${nombre}</h3>
          <button type="button" onclick="${nombreFuncion}(${id}, ${parametroOpcional})">Ver</button>
        </div>
      </div>`
    );
  });
};

const pedirMateriaCurso = async (idCurso) => {
  try {
    const url =
      "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=mc";
    const formData = [{ key: "curso", value: idCurso }];
    const dataMateriaCurso = await peticion(url, formData);
    materiasCursosSeleccionado = dataMateriaCurso;
    materiasIdCursoSeleccionado = idCurso;
    document.querySelector(".contenedor-card-curso").style.display = "none";
    if (dataMateriaCurso.length > 0) {
      document.querySelector(".container-curso-materia").style.display = "block";
      $(".contenedor-card-curso-materia").children().remove();
      renderCard(
        dataMateriaCurso,
        "contenedor-card-curso-materia",
        "pedirLibroMateriaCurso",
        idCurso,
        "atrasMateriaCurso"
      );
    } else {
      document.querySelector(".contenedor-card-curso").style.display = "grid";
      Swal.fire("No hay materias para este curso");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const pedirLibroMateria = async (idMateria) => {
  try {
    const url =
      "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=glm";
    const formData = [{ key: "materia", value: idMateria }];
    const dataLibroMateria = await peticion(url, formData);
    if (dataLibroMateria.length > 0) {
      let tituloLibroMateria = dataLibroMateria[0].lib_nombre;
      document.querySelector("#titulo-tema-materia").textContent = tituloLibroMateria;
      document.querySelector(".contenedor-card-materia").style.display = "none";
      document.querySelector(".container-materia-libro").style.display = "block";
      $(".contenedor-card-materia-libro").children().remove();
      renderCardLibro(
        dataLibroMateria,
        "contenedor-card-materia-libro",
        "contenedor-card-materia-libro-tema"
      );
    } else {
      Swal.fire("No hay libros para esta materia");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const renderCardLibro = (libros, containerCardLibro, containerTemas) => {
  libros.forEach((libro) => {
    const { lib_curso, lib_edicion, lib_editorial, lib_id, lib_link_img, lib_nombre } =
      libro;
    $(`.${containerCardLibro}`).append(
      `<div class="card">
        <img src="${lib_link_img}" alt="Imagen">
        <div class="card__contenido">
          <h3> ${lib_nombre}</h3>
          <div style="display:flex; align-items:center">
            <label>Editorial: </label>
            <p> ${lib_editorial}</p>
          </div>
          <div style="display:flex; align-items:center">
            <label>Edición: </label>
            <p> ${lib_edicion}</p>
          </div>
          <div style="display:flex; align-items:center">
            <label>Curso: </label>
            <p> ${lib_curso}</p>
          </div>
          <button type="button" onclick="pedirTemaLibro(${lib_id},  \'${containerTemas}\')">Ver</button>
        </div>
      </div>`
    );
  });
};

const pedirLibroMateriaCurso = async (idMateria, idCurso) => {
  try {
    const formData = [
      { key: "curso", value: idCurso },
      { key: "materia", value: idMateria },
    ];
    const url =
      "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=lcm";
    const dataLibroMateriaCurso = await peticion(url, formData);
    if (dataLibroMateriaCurso.length > 0) {
      let tituloLibroCurso = dataLibroMateriaCurso[0].lib_nombre;
      document.querySelector("#titulo-tema-curso").textContent = tituloLibroCurso;
      document.querySelector(".container-curso-materia").style.display = "none";
      document.querySelector(".container-curso-libro").style.display = "block";
      $(".contenedor-card-curso-libro").children().remove();

      renderCardLibro(
        dataLibroMateriaCurso,
        "contenedor-card-curso-libro",
        "contenedor-card-curso-tema"
      );
    } else {
      document.querySelector(".container-curso-materia").style.display = "block";
      Swal.fire("No hay libros para esta materia");
    }
  } catch (error) {
    throw new Error(error);
  }
};

/* Temas */
const pedirTemaLibro = async (idLibro, container) => {
  try {
    const formData = [{ key: "libro", value: idLibro }];
    const url =
      "https://www.agendaaizama.net/biblioteca_digital/biblioteca_digital.php?op=temas";
    const dataLibroTema = await peticion(url, formData);
    if (Object.keys(dataLibroTema.temas).length > 0) {
      const containerLibro = document.querySelector(`.${container}`).parentElement
        .parentElement;
      if (containerLibro.id == "curso") {
        $(".container-curso-libro").css("display", "none");
      } else {
        $(".container-materia-libro").css("display", "none");
      }
      document.querySelector(`.${container}`).parentElement.style.display = "block";
      mostrarTema(dataLibroTema, container);
    } else {
      Swal.fire("No hay temas para este libro");
      $(".container-curso-libro").css("display", "block");
    }
  } catch (error) {
    throw new Error(error);
  }
};
const mostrarTema = (temas, container) => {
  let htmlTema = "";
  temas["temas"].forEach((tema) => {
    const { tem_id, tem_numero, tem_nombre } = tema;
    const contenido = obtenerMaterialTema(
      temas["material"],
      temas["material_complementario"],
      tem_id
    );
    htmlTema += `
      <div class="tema-dropdown">
        <button type="button" class="dropdownButton" onclick="drowpdown(this)">
          <h3><strong>Tema${tem_numero}:</strong> ${tem_nombre}</h3>
          <img src="images/down-arrow.svg" width="22px" alt="icono">
        </button>
        ${contenido}
      </div>`;
  });
  document.querySelector(`.${container}`).innerHTML = htmlTema;
};

const obtenerMaterialTema = (materiales, materialesComplementarios, id) => {
  let htmlMaterial = "";
  materiales.forEach((material) => {
    if (material.mate_tema == id) {
      const { mate_descripcion, mate_enlace, mate_numero, mate_id } = material;
      const materialComplementario = obtenerMaterialComplementario(
        materialesComplementarios,
        mate_id
      );
      let srcImage = "";
      if (mate_enlace.includes("drive") || mate_enlace.includes("docs")) {
        srcImage = "images/icon-presentation.svg";
      } else {
        srcImage = "images/icon-youtube.svg";
      }
      htmlMaterial += `
        <div  id="dropdown" class="contenedor__contenido-tema">
          <a href="${mate_enlace}" target="_blank" class="enlace__tema">
            <span>${mate_numero}. ${mate_descripcion}</span>
            <img src="${srcImage}" alt="icono">
          </a>
          ${materialComplementario}
        </div>

                    
      `;
    }
  });
  return htmlMaterial;
};
const obtenerMaterialComplementario = (materialesComplementarios, idMaterial) => {
  let htmlMaterialComplementario = `
    <div class="recurso__button">
      <div class="contenido-tema__recurso-button">
        <button class="drop-btn-recursos" type="button" onclick="drowpdown(this)">
          Recursos 
        </button>
        <div id="dropdown" class="contenedor-contenido__recursos">
  `;
  const materialeComplementarioFiltrados = materialesComplementarios.filter(
    (material) => material.mat_com_material == idMaterial
  );
  materialeComplementarioFiltrados.forEach((materialComplementario) => {
    const { mat_com_descripcion, mat_com_enlace } = materialComplementario;
    htmlMaterialComplementario += `<a target="_blank" href="${mat_com_enlace}" class="enlace__tema">
        <span>${mat_com_descripcion}</span>
        <img src="images/icon-youtube.svg" alt="icono">
      </a>`;
  });
  htmlMaterialComplementario += "</div></div></div>";
  if (materialeComplementarioFiltrados.length > 0) {
    return htmlMaterialComplementario;
  } else {
    return "";
  }
};

/* Botones Atras */

/* Curso */
function atrasMateriaCurso() {
  document.querySelector(".container-curso-materia").style.display = "none";
  document.querySelector(".contenedor-card-curso").style.display = "grid";
}
function atrasMateriaCursoLibro() {
  document.querySelector(".container-curso-libro").style.display = "none";
  document.querySelector(".container-curso-materia").style.display = "block";
}
function atrasMateriaCursoLibroTema() {
  document.querySelector(".container-curso-tema").style.display = "none";
  document.querySelector(".container-curso-libro").style.display = "block";
}

/* Materia */
function atrasMateriaLibro() {
  document.querySelector(".container-materia-libro").style.display = "none";
  document.querySelector(".contenedor-card-materia").style.display = "grid";
}
function atrasMateriaLibroTema() {
  document.querySelector(".container-materia-tema").style.display = "none";
  document.querySelector(".container-materia-libro").style.display = "block";
}

function scrollTop() {}
