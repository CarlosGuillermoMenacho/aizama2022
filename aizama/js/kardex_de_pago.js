import * as requests from "./peticion_adm_cpm.js";

const selectCourse = document.querySelector("#seleccionar_Curso");

const selectParallel = document.querySelector("#seleccionar_Paralelo");

const selectStudent = document.querySelector("#seleccionar_Alumno");

const form = document.querySelector("#form");
const btn_gestion = document.getElementById('btn-gestion');

const selectTutors = document.querySelector("#seleccionar_Tutor");

var codalu;

let sendDataUpdate = {

  codcur: "",

  codpar: "",

  codalu: "",

  paterno: "",

  materno: "",

  nombres: "",

  usuario: "",

  clave: "",

  boletin: "",

  plataforma: "",

  evaluacion: "",

  tutores: "",

};



/* En esta variables se llenaran la informacion con las peticiones */

let infoStudents;

let nameCourses;

let nameParallel;

let studentsName;



/* Class */

class UI {

  constructor() {

    const tutors = [];

  }

  showTableStudents(students) {
    
    const containerTable = document.querySelector("#campos");

    let count = 1;

    this.clearTable("#campos");

    students.forEach((student) => {

      const { nombre, codalu } = student;

      const row = document.createElement("tr");

      const nro = document.createElement("td");

      nro.textContent = count;

      nro.dataset.label = "Nro";

      const name = document.createElement("td");

      name.textContent = nombre;

      name.classList.add("alinear-izquierda");

      name.dataset.label = "Nombre";

      const information = document.createElement("td");

      information.dataset.label = "Informacion";



      /* Button information */

      const buttonInformation = document.createElement("button");

      buttonInformation.style.cursor = "pointer";

      const imgInformation = document.createElement("img");

      imgInformation.src = "./images/edit.svg";

      imgInformation.style.height = "50px";

      buttonInformation.appendChild(imgInformation);

      buttonInformation.onclick = () => {

        /* Ocultar el select de tutor y volver a su valor por defecto */




        this.showDataStudents(codalu);

      };

      information.appendChild(buttonInformation);



      row.appendChild(nro);

      row.appendChild(name);

      row.appendChild(information);

      containerTable.appendChild(row);

      count++;

    });

  }

  showDataStudents(idStudent) {

    // Oculta tables selects
    codalu = idStudent;
    sendDataUpdate.codalu = idStudent;
    let gestion = $('#gestion').val();

    $.post(
          "../agendadigital/get_kardex_pago.php",
          {id : idStudent,gestion:gestion},
          function(datos,estado,xhr){    
            if (datos['status']=="200") {
              let indice = 1;
              let pagos = datos['pagos'];
              const table = document.querySelector("#campos_cardex");
              table.innerHTML="";

              //if(pagos.length==0){
                //alert("No ha realizado ningún pago");
                //return;
              //}
              pagos.forEach((pago)=>{

                const row = document.createElement("tr");
                
                const columnIndice = document.createElement("td");
                columnIndice.textContent = indice;
                columnIndice.dataset.label = "Nro";
                row.appendChild(columnIndice);

                const columnFecha = document.createElement("td");
                columnFecha.textContent = pago['fecha'];
                columnFecha.dataset.label = "Fecha";
                row.appendChild(columnFecha);

                const columnDetalle = document.createElement("td");
                columnDetalle.textContent = pago['detalle'];
                columnDetalle.dataset.label = "Detalle";
                row.appendChild(columnDetalle);

                const columnHaber = document.createElement("td");
                columnHaber.textContent = pago['haber'];
                columnHaber.dataset.label = "Monto";
                row.appendChild(columnHaber);

                const columnAcreedor = document.createElement("td");
                columnAcreedor.textContent = pago['acreedor'];
                columnAcreedor.dataset.label = "Saldo";
                row.appendChild(columnAcreedor);



                table.appendChild(row);
                indice++;



              });

              document.querySelector(".contenedor-table-general").style.display = "none";

              document.querySelector(".contenedor-selects").style.display = "none";

              document.querySelector(".title-principal").style.display = "none";

              document.querySelector(".formulario-alumno").style.display = "block";
            }
          }
          );

    



    // Trae los datos del alumno seleccionado

    const dataStudent = this.filterDataStudent(idStudent);

    const {

      paterno,

      materno,

      nombres,

      codcur,

      codpar,

      usuario,

      clave,

      plataforma,

      evaluacion,

      boletin,

      tutor,

    } = dataStudent[0];

    /* Rellernar a los inputs */

    document.getElementById("paterno").value = paterno+" "+materno+" "+nombres ;

    


    this.fillDataStudentObject(dataStudent[0]);



    /* Para cargar los tutores */





    /* Para cargar el select en el formulario */




  }

  loadSelect(idDom, listData, type, valueSelect) {

    // type 1 = curso

    // type 2 = paralelo

    let codigo;

    let nameContainerSelect;

    if (type === 1) {

      nameContainerSelect = "curso_alumno";

      codigo = "codcur";

    } else {

      nameContainerSelect = "paralelo_alumno";

      codigo = "codigo";

    }

    const container = document.getElementById(`${idDom}`);

    for (let i = 0; i < listData.length; i++) {

      const nombre = listData[i]["nombre"];

      const valueList = listData[i][`${codigo}`];

      const option = document.createElement("option");

      option.value = valueList;

      option.textContent = nombre;

      container.appendChild(option);

    }

    container.value = valueSelect;

    const nameSelect = $(`#${idDom} :selected`).text();

    $(`#select2-${nameContainerSelect}-container`).text(nameSelect);

  }

  verifyCheck(idDOM, valueCheck) {

    const inputCheck = document.getElementById(`${idDOM}`);

    if (valueCheck === "1") {

      inputCheck.checked = true;

    } else {

      inputCheck.checked = false;

    }

  }

  filterDataStudent(idStudent) {

    const { lista } = infoStudents;

    const data = lista.filter((alumno) => {

      return idStudent === alumno.codalu;

    });

    return data;

  }

  clearTable(idDom) {

    const containerTable = document.querySelector(`${idDom}`);

    while (containerTable.firstChild) {

      containerTable.removeChild(containerTable.firstChild);

    }

  }

  showDataTutors(tutors) {

    let codigoTutores = [];

    this.clearTable("#rowTutores");

    const containerTutors = document.querySelector("#rowTutores");

    tutors.forEach((tutor) => {

      const { codtut, nombre, cedula, celular } = tutor;

      const row = document.createElement("tr");



      codigoTutores.push(codtut);



      const columnNameTutors = document.createElement("td");

      columnNameTutors.textContent = nombre;

      columnNameTutors.dataset.label = "Nombre";



      const columnCITutors = document.createElement("td");

      columnCITutors.textContent = cedula;

      columnCITutors.dataset.label = "Cedula Identidad";



      const columnPhoneTutors = document.createElement("td");

      columnPhoneTutors.textContent = celular;

      columnPhoneTutors.dataset.label = "Celular";



      const columnAccion = document.createElement("td");

      columnAccion.dataset.label = "Eliminar";

      const btnDelete = document.createElement("button");

      const imgBtn = document.createElement("img");

      btnDelete.type = "button";

      imgBtn.src = "images/close.svg";

      imgBtn.style.height = "35px";

      btnDelete.appendChild(imgBtn);

      btnDelete.onclick = () => {

        this.deleteTutor(tutors, codtut);

      };

      columnAccion.appendChild(btnDelete);



      row.appendChild(columnNameTutors);

      row.appendChild(columnCITutors);

      row.appendChild(columnPhoneTutors);

      row.appendChild(columnAccion);

      containerTutors.appendChild(row);

    });

    sendDataUpdate.tutores = codigoTutores;

  }

  deleteTutor(listTutors, idTutor) {

    this.tutors = listTutors.filter((tutor) => tutor.codtut !== idTutor);

    this.showDataTutors(this.tutors);

  }

  addTutor(tutorAdd) {

    const { codtut } = tutorAdd;

    if (!this.tutors.some((tutor) => tutor.codtut === codtut)) {

      this.tutors.push(tutorAdd);

      this.showDataTutors(this.tutors);

    } else {

      Swal.fire("Este tutor ya se encuentra asociado a este alumno");

      return;

    }

  }

  fillDataStudentObject(dataStudents) {

    /* Esta funcion sirve para rellenar datos que llegan de base de datos al objecto que sera enviado a base de datos si no hay cambios mantendra los datos por defecto que es donde estoy llenando ahora */

    const {

      paterno,

      materno,

      nombres,

      codcur,

      codpar,

      usuario,

      clave,

      plataforma,

      evaluacion,

      boletin,

    } = dataStudents;

    sendDataUpdate.codcur = codcur;

    sendDataUpdate.codpar = codpar;

    sendDataUpdate.paterno = paterno;

    sendDataUpdate.materno = materno;

    sendDataUpdate.nombres = nombres;

    sendDataUpdate.usuario = usuario;

    sendDataUpdate.clave = clave;

    sendDataUpdate.boletin = boletin;

    sendDataUpdate.plataforma = plataforma;

    sendDataUpdate.evaluacion = evaluacion;

  }

}



const ui = new UI();



document.addEventListener("DOMContentLoaded", async () => {

  document.querySelector(".container-loader").style.display = "flex";



  /* Request */

  await requestInitial();

  await requestStudents();

  document.querySelector(".container-general").style.display = "block";

  document.querySelector(".container-loader").style.display = "none";

  const { lista, tutores } = infoStudents;

  ui.showTableStudents(lista);


  

  $("#seleccionar_Alumno").change(() => {

    filterStudent();

  });

  $("#seleccionar_Tutor").change((e) => {

    if (selectTutors.value !== "") {

      const resultTutor = tutores.filter((tutor) => tutor.codtut === e.target.value);

      ui.addTutor({ ...resultTutor[0] });

    }

  });


  /* Rellenar el objecto a enviar para la actualizacion de los datos de los alumnos */

  document.querySelector("#paterno").addEventListener("input", fillData);




  //form.addEventListener("submit", updateDataStudents);
  //btn_gestion.addEventListener('click',ui.showDataStudents(codalu));

});
$('#btn-gestion').bind('click',()=>ui.showDataStudents(codalu));


/* Functions  */

function requestInitial() {

  nameCourses = requests.obtenerCurso();

  requests.cargarCursos(nameCourses);

  nameParallel = requests.obtenerParalelos();

  requests.cargarParalelos(nameParallel);

  studentsName = requests.obtenerEstudiantes();

  requests.cargarEstudiantes(studentsName);


  $("#seleccionar_Alumno").select2({ width: "100%" });


}



async function requestStudents() {

  try {

    const url = "alumno_json.php?op=aluhab";

    const response = await fetch(url);

    if (response === "eSession") {

      Swal.fire("La session ha expirado vuelva a ingresar con sus datos");

      location.href = "administracion.php";

      return;

    } else if (response === "noLista") {

      Swal.fire("No existe alumnos habilitados");

      return;

    } else {

      infoStudents = await response.json();

    }

  } catch (error) {

    console.log(error);

    return;

  }

}



function fillData(e) {

  sendDataUpdate[e.target.name] = e.target.value;

  console.log(sendDataUpdate);

}

function activeOptionStudents(e) {

  if (this.checked === false) {

    sendDataUpdate[e.target.name] = "0";

  } else {

    sendDataUpdate[e.target.name] = "1";

  }

  console.log(sendDataUpdate);

}



function filterStudent() {

  const { lista } = infoStudents;

  const resultFilter = lista

    .filter(filterStudentCourse)

    .filter(filterStudentParallel)

    .filter(filterStudentData);

  ui.showTableStudents(resultFilter);

}



function filterStudentCourse(list) {

  const { codcur } = list;

  return list;

}



function filterStudentParallel(list) {

  const { codpar } = list;



  return list;

}



function filterStudentData(list) {

  const { codalu } = list;

  if (selectStudent.value !== "") {

    return codalu === selectStudent.value;

  }

  return list;

}


function updateDataStudents(e) {

  e.preventDefault();

  console.log(sendDataUpdate);

  Swal.fire({

    title: "¿Estás seguro?",

    text: "Se actualizaran los datos del alumno",

    icon: "warning",

    showCancelButton: true,

    confirmButtonColor: "#3085d6",

    cancelButtonColor: "#d33",

    confirmButtonText: "Si",

    cancelButtonText: "No",

  }).then((result) => {

    if (result.isConfirmed) {

      const url = "alumno_json.php?op=sdalu";

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = async function () {

        if (this.readyState === 4 && this.status === 200) {

          if (this.responseText === "ok") {

            await requestStudents();

            ui.showDataStudents(sendDataUpdate.codalu);

            Swal.fire("Éxito", "Datos actualizados correctamente", "success");

          } else if (this.responseText === "errorParam") {

            Swal.fire("Error", "error al enviar los datos", "error");

          }

        }

      };

      xhr.open("POST", url, false);

      xhr.send(JSON.stringify(sendDataUpdate));

    }

  });

}


function peticion(url, data) {

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = async function () {

    if (this.readyState === 4 && this.status === 200) {

      if (this.responseText === "ok") {

        Swal.fire("Éxito", "Datos actualizados correctamente", "success");

      } else {

        Swal.fire("Error", "Ocurrio un error contactase con soporte", "error");

      }

    } else {

      Swal.fire("Error en la peticion");

    }

  };

  xhr.open("POST", url, false);

  xhr.send(data);

}

