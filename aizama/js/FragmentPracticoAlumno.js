const codigoAlumno = document.querySelector('#codigoAlumno').value;
const btnPresentado = document.querySelector('#btnPresentado');
const btnNoPresentado = document.querySelector('#btnNoPresentado');
const btnPendientes = document.querySelector('#btnPendientes');


const peticionData = async (tipoPeticion, trimestre, container) => {
  const url = `FragmentPracticoDataDB.php?peticion=${tipoPeticion}&idAlumno=${codigoAlumno}&trimestre=${trimestre}`;
  const peticion = await fetch(url);
  const dataServidor = await peticion.json();
  const { practicos, alumno } = dataServidor;
  document.querySelector(`#${container}`).parentElement.children[0].style.display = "none";
  document.querySelector('#nombre').textContent = alumno;
  document.querySelector('#trimestre-info').textContent = trimestre;
  switch (practicos) {
    case 'noPracticos':
      $(`#${container}`).children().remove();
      $(`#${container}`).append(`
        <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${container}')">
          Átras
        </button>
        <h3 class="f-normal">No tiene prácticos</h3>
      `);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
    case 'noPracticosPendientes':
      $(`#${container}`).children().remove();
      $(`#${container}`).append(`
        <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${container}')">
          Átras
        </button>
        <h3 class="f-normal">No tiene prácticos pendientes para este trimestre</h3>
      `);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
    case 'noPracticosAlumno':
      $(`#${container}`).children().remove();
      $(`#${container}`).append(`
        <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${container}')">
          Átras
        </button>
        <h3 class="f-normal">No tiene prácticos realizados</h3>
      `);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
    case 'noAlumno':
      $(`#${container}`).children().remove();
      $(`#${container}`).append(`
        <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${container}')">
          Átras
        </button>
        <h3 class="f-normal">No se encontro a este alumno</h3>
      `);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
    default:
      renderInfoPractico(practicos, container);
      document.querySelector(`#${container}`).style.display = 'block';
      break;
  }

}

const renderInfoPractico = (data, idHTMLElement) => {
  $(`#${idHTMLElement}`).children().remove();
  $(`#${idHTMLElement}`).append(`
    <button class="d-block mb-4 trimestre__button" onclick="btnAtras('${idHTMLElement}')">
      Átras
    </button>
  `);
  data.forEach(item => {
    const { descrip, materia, fecha, hora, nota } = item;
    if (!nota) {
      nota = "";
    }
    if (item.notaAlumno) {
      if (item.notaAlumno == 0) {
        item.notaAlumno = "";
      }
      if (item.presentoTiempo) {
        $(`#${idHTMLElement}`).append(`
          <div class="card mb-4">
            <h3 class="no-margin mb-2">${materia}</h3>
            <p class="no-margin mb-2">${descrip}</p>
            <div class="d-flex flex-colum">
              <p class="no-margin f-bold mr-4">
                Fecha: <span class="f-normal">${fecha}</span>
              </p>
              <p class="no-margin f-bold mr-4">
                Hora: <span class="f-normal">${hora}</span>
              </p>
              <p class="no-margin f-bold">Pts: <span class="f-normal">${nota}</span></p>
              <p class="no-margin f-bold">Nota: <span class="f-normal">${item.notaAlumno}</span></p>
            </div>
          </div>
        `);
      } else {
        $(`#${idHTMLElement}`).append(`
          <div class="card mb-4">
            <h3 class="no-margin mb-2">${materia}</h3>
            <p class="no-margin mb-2">${descrip}</p>
            <div class="d-flex flex-colum">
              <p class="no-margin f-bold mr-4">
                Fecha: <span class="f-normal">${fecha}</span>
              </p>
              <p class="no-margin f-bold mr-4">
                Hora: <span class="f-normal">${hora}</span>
              </p>
              <p class="no-margin f-bold">Pts: <span class="f-normal">${nota}</span></p>
              <p class="no-margin f-bold">Nota: <span class="f-normal">${item.notaAlumno}</span></p>
              <p class="no-margin f-bold">No presento a tiempo</span></p>
            </div>
          </div>
        `);
      }
    } else {
      $(`#${idHTMLElement}`).append(`
        <div class="card mb-4">
          <h3 class="no-margin mb-2">${materia}</h3>
          <p class="no-margin mb-2">${descrip}</p>
          <div class="d-flex flex-colum">
            <p class="no-margin f-bold mr-4">
              Fecha: <span class="f-normal">${fecha}</span>
            </p>
            <p class="no-margin f-bold mr-4">
              Hora: <span class="f-normal">${hora}</span>
            </p>
            <p class="no-margin f-bold">Pts: <span class="f-normal">${nota}</span></p>
          </div>
        </div>
      `);
    }
  });
}

const btnAtras = (container) => {
  console.log(document.querySelector(`#${container}`));
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
  e.classList.add('active');
  document.querySelector(`#${tabActive}`).children[0].style.display = "block";
  document.querySelector(`#${tabActive}`).children[1].style.display = "none";

}