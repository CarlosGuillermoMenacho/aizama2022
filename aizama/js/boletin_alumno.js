const d = document;

/* Informacion alumno */

const nombre_alumno = d.querySelector('.nombre-alumno'); 

const paralelo      = d.querySelector('.paralelo-alumno');

const curso         = d.querySelector('.curso-alumno');

const turno         = d.querySelector('.turno-alumno');

/* Tabla */

const filaTabla = d.querySelector('#campos');

var boletin = [];



function obtenerNotas() {

  for (let i = 0; i < boletin.length; i++) {

    const nombre_materia = boletin[i]['nommat'];
    const primer_trimestre = boletin[i]['first'];
    const segundo_trimestre = boletin[i]['second'];
    const tercer_trimestre = boletin[i]['third'];
    const nota_final = boletin[i]['final'];

    
    filaTabla.insertAdjacentHTML( 'beforeend',
      `<tr>
        <td data-label="Nro"> ${(i+1)} </td>
        <td data-label="Materia"> ${nombre_materia} </td>
        <td data-label="1er Trimestre"> ${primer_trimestre} </td>
        <td data-label="2er Trimestre"> ${segundo_trimestre} </td>
        <td data-label="3er Trimestre"> ${tercer_trimestre} </td>
        <td data-label="Nota Final"> ${nota_final} </td>
      </tr>`
    );
  

    
    d.querySelector('.contenedor-table-general').style.display= 'block';

  }

}

function peticionNotas() {

  let peticion = new XMLHttpRequest();

  let respuesta; 

  peticion.onreadystatechange = function() {

    if (this.readyState === 4 && this.status === 200) {

        respuesta = JSON.parse(peticion.responseText);

    }

  };

  peticion.open('POST', 'boletin_json.php?op=est', false);

  peticion.send();

  switch (respuesta['status']) {

    case 'sinMaterias':

      alert('No tienes materias.');  

      break;

    case 'eSession':

      alert('La sesion ha expirado, salga del sistema y vuelva a ingresar con sus datos');

      location.href='usuario.php';  

      break;

    case 'ok':

      boletin = respuesta['boletin'];

      const informacion_alumno = respuesta['info'];

      nombre_alumno.textContent = informacion_alumno['nombre'];

      paralelo.textContent = informacion_alumno['paralelo'];

      curso.textContent = informacion_alumno['curso'];

      turno.textContent = informacion_alumno['turno'];

      d.querySelector('.info-alumno').style.display= 'block';

      obtenerNotas();

      break;

    default:

      alert('Error parametros enviados.');

      break;

  }

};

document.addEventListener("DOMContentLoaded", function(event) {

  d.querySelector('.info-alumno').style.display= 'none';

  peticionNotas();

});