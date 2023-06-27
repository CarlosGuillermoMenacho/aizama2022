const codigoAlumno = document.querySelector('#codigoAlumno').value;
const btnPresentado = document.querySelector('#btnPresentado');
const btnNoPresentado = document.querySelector('#btnNoPresentado');
const btnPendientes = document.querySelector('#btnPendientes');

const peticionData = async (tipoPeticion, trimestre, container) => {
  const url = `FragmentEvaluacionDataDB.php?peticion=${tipoPeticion}&idAlumno=${codigoAlumno}&trimestre=${trimestre}`;
  /* const url = `FragmentEvaluacionDataDB.php?peticion=noPresentado&idAlumno=2&trimestre=1`; */
  const peticion = await fetch(url);
  const dataServidor = await peticion.json();
  const { evaluaciones, alumno } = dataServidor;
  document.querySelector(`#${container}`).parentElement.children[0].style.display = "none";
  document.querySelector('#nombre').textContent = alumno;
  document.querySelector('#trimestre-info').textContent = trimestre;
  document.querySelector(`#${container}`).classList.add('animate__animated')
  document.querySelector(`#${container}`).classList.add('animate__fadeIn')
  switch (evaluaciones) {
    case 'noEvaluacionesAlumno':
      $(`#${container}`).children().remove();
      $(`#${container}`).append(`
        <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${container}')">
          Átras
        </button>
        <h3 class="f-normal">No tiene examenes realizados</h3>
      `);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
    case 'noEvaluaciones':
      $(`#${container}`).children().remove();
      $(`#${container}`).append(`
        <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${container}')">
          Átras
        </button>
        <h3 class="f-normal">no tiene examenes</h3>
      `);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
    case 'noEvaluacionesPendientes':
      $(`#${container}`).children().remove();
      $(`#${container}`).append(`
        <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${container}')">
          Átras
        </button>
        <h3 class="f-normal">No tiene examenes pendientes</h3>
      `);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
    default:
      if (evaluaciones[0].preguntas) {
        renderCardEvaluacionPresentada(evaluaciones, container);
      } else {
        renderCardEvaluacion(evaluaciones, container);
      }
      document.querySelector(`#${container}`).style.display = 'block';
      break;
  }

}

const renderCardEvaluacionPresentada = (data, idHTMLElement) => {
  $(`#${idHTMLElement}`).children().remove();
  $(`#${idHTMLElement}`).append(`
    <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${idHTMLElement}')">
      Átras
    </button>
  `);
  data.forEach(evaluaciones => {
    const { evaluacion, preguntas, notaTotalAlumno } = evaluaciones;
    const { descrip, materia, f_inicio, f_fin, horai, horaf } = evaluacion;
    const htmlPreguntasOpciones = getPreguntaOpcionesHTML(preguntas, descrip);
    $(`#${idHTMLElement}`).append(`
    <div class="card mb-4">
      <h3 class="no-margin mb-2">${materia}</h3>
      <p class="no-margin mb-2">${descrip}</p>
      <div class="d-flex flex-colum">
        <p class="no-margin f-bold">Nota: <span class="f-normal">${notaTotalAlumno} / 100</span></p>
        <p class="no-margin f-bold mr-4">
          Fecha Inicio: <span class="f-normal">${f_inicio}</span>
        </p>
        <p class="no-margin f-bold">Hora Inicio: <span class="f-normal">${horai}</span></p>
        <p class="no-margin f-bold">Hora Fin: <span class="f-normal">${horaf}</span></p>
        <p class="no-margin f-bold mr-4">
          Fecha Fin: <span class="f-normal">${f_fin}</span>
        </p>
      </div>
      <button class="d-block mb-4 btn-presentado" onclick="verExamenAlumno(this)">Ver</button>
      ${htmlPreguntasOpciones}
    </div>
    `);
  });
}

const getPreguntaOpcionesHTML = (data, descrip) => {
  let opciones = "";
  let surespuesta = "";
  let divContainer = `<div class="container-pregunta">`;
  divContainer += `<h3 class="t-center">${descrip}</h3>`
  data.forEach(itemPregunta => {
    const { valor, nota, pregunta, respuesta, surespuest, dir_imagen } = itemPregunta;
    let imgHtml = "";
    if (dir_imagen != "") {
      imgHtml = `<img class="mb-4" src="resources/${dir_imagen}" alt="img-pregunta">`;
    }

    opciones = getOpciones(itemPregunta.opciones);
    const opcioneSeleccionanda = getOpcionSeleccionada($(opciones), respuesta, surespuest);
    divContainer += `<h4>${pregunta} </h4>`;
    divContainer += `${imgHtml}`;
    divContainer += `${opcioneSeleccionanda}`;
    divContainer += `<p class="no-margin f-bold">Nota: <span class="f-normal">${nota}</span></p>`;
    divContainer += `<p class="no-margin f-bold">Valor Pregunta: <span class="f-normal">${valor}</span></p>`;
    divContainer += `<p class="no-margin f-bold">Respuesta pregunta: <span class="f-normal">Opción ${respuesta}</span></p>`;
    divContainer += `<p class="no-margin f-bold">Su respuesta: <span class="f-normal">Opción ${surespuest}</span></p>`;
    divContainer += `<hr>`;
  });

  divContainer += `</div>`;
  return divContainer;
};

const getOpcionSeleccionada = (data, respuesta, surespuesta) => {
  let classNameOpcion = "opcion--incorrecta";
  if (respuesta == surespuesta) {
    classNameOpcion = "opcion--correcta";
  }
  let divOpciones = `<div class="opciones">`
  const opciones = data[0].children;
  for (let i = 0; i < opciones.length; i++) {
    if (i == surespuesta - 1) {
      divOpciones += `
        <div class="opcion ${classNameOpcion}">
          ${opciones[i].textContent}
        </div>
      `;
    } else {
      divOpciones += `
        <div class="opcion">
          ${opciones[i].textContent}
        </div>
      `;
    }
  }
  divOpciones += `</div>`;
  return divOpciones;
}

const getOpciones = (data) => {
  let divContainer = `<div class="opciones">`;
  data.forEach((itemOpcion) => {
    const { opcion } = itemOpcion;
    divContainer += `
      <div class="opcion">
        ${opcion}
      </div>
    `;
  });
  divContainer += `</div>`;
  return divContainer;
}

const verExamenAlumno = e => {
  const containerPreguntasOpciones = e.parentElement.children[4];
  if (containerPreguntasOpciones.classList.contains('activeContainerPreguntas')) {
    containerPreguntasOpciones.classList.remove('activeContainerPreguntas');
    e.textContent = 'Ver';
    return
  }
  containerPreguntasOpciones.classList.add('activeContainerPreguntas');
  containerPreguntasOpciones.classList.add('animate__animated');
  containerPreguntasOpciones.classList.add('animate__fadeIn');
  e.textContent = 'Ocultar';

}

const renderCardEvaluacion = (data, idHTMLElement) => {
  $(`#${idHTMLElement}`).children().remove();
  $(`#${idHTMLElement}`).append(`
    <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${idHTMLElement}')">
      Átras
    </button>
  `);

  data.forEach(item => {
    const { descrip, materia, f_inicio, f_fin, horai, horaf } = item;
    $(`#${idHTMLElement}`).append(`
      <div class="card mb-4">
        <h3 class="no-margin mb-2">${materia}</h3>
        <p class="no-margin mb-2">${descrip}</p>
        <div class="d-flex flex-colum">
          <p class="no-margin f-bold mr-4">
            Fecha Inicio: <span class="f-normal">${f_inicio}</span>
          </p>
          <p class="no-margin f-bold">Hora Inicio: <span class="f-normal">${horai}</span></p>
          <p class="no-margin f-bold">Hora Fin: <span class="f-normal">${horaf}</span></p>
          <p class="no-margin f-bold mr-4">
            Fecha Fin: <span class="f-normal">${f_fin}</span>
          </p>
        </div>
      </div>
    `);
  });
}

const btnAtras = (container) => {
  document.querySelector('#trimestre-info').textContent = "";
  document.querySelector(`#${container}`).style.display = 'none';
  document.querySelector(`#${container}`).parentElement.children[0].style.display = "block";
}

function activeTab(e, tabActive) {
  document.querySelector('#trimestre-info').textContent = "";
  const tabContents = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove('show');
  }

  const tabLinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }
  document.getElementById(tabActive).classList.add('show');
  document.getElementById(tabActive).classList.add('animate__animated');
  document.getElementById(tabActive).classList.add('animate__fadeIn');
  e.classList.add('active');
  document.querySelector(`#${tabActive}`).children[0].style.display = "block";
  document.querySelector(`#${tabActive}`).children[1].style.display = "none";

}