
console.log("[GCO-SYSTEM v1.0 ONLINE]");



const gco_urlLaboratorios =
  "https://6af31f07d2377d6c370489b7.mockapi.io/api/v1/Laboratorios";

const gco_urlMedicamentos =
  "https://6af31f07d2377d6c370489b7.mockapi.io/api/v1/Medicamentos";



let gco_laboratorios = [];
let gco_medicamentos = [];



const gco_inputNombre = document.getElementById("inputNombre");
const gco_inputPrecio = document.getElementById("inputPrecio");
const gco_selectLaboratorio = document.getElementById("selectLaboratorio");
const gco_inputBuscar = document.getElementById("inputBuscar");

const gco_btnGuardar = document.getElementById("btnGuardar");
const gco_btnMostrar = document.getElementById("btnMostrar");
const gco_btnLimpiar = document.getElementById("btnLimpiar");

const gco_mensaje = document.getElementById("mensaje");
const gco_contador = document.getElementById("contador");
const gco_lista = document.getElementById("listaMedicamentos");


function gco_avisar(gco_texto, gco_tipo) {

  gco_mensaje.textContent = gco_texto;
  gco_mensaje.className = gco_tipo;

}


function gco_cargarLaboratorios() {

  gco_selectLaboratorio.innerHTML = "";

  const gco_opcionInicial = document.createElement("option");

  gco_opcionInicial.value = "";
  gco_opcionInicial.textContent = "Selecciona un laboratorio";

  gco_selectLaboratorio.appendChild(gco_opcionInicial);

  gco_laboratorios.forEach(gco_lab => {

    const gco_opcion = document.createElement("option");

    gco_opcion.value = String(gco_lab.id);
    gco_opcion.textContent = gco_lab.nombre;

    gco_selectLaboratorio.appendChild(gco_opcion);

  });

}




function gco_mostrarMedicamentos(gco_arreglo) {

  gco_lista.innerHTML = "";

  if (gco_arreglo.length === 0) {

    const gco_vacio = document.createElement("li");

    gco_vacio.textContent = "No hay medicamentos para mostrar";
    gco_vacio.className = "vacio";

    gco_lista.appendChild(gco_vacio);

  } else {

    gco_arreglo.forEach(gco_med => {

      // buscar el laboratorio al que pertenece el medicamento
      const gco_lab = gco_laboratorios.find(gco_l =>

        String(gco_l.id) === String(gco_med.laboratorio_id)

      );

      const gco_item = document.createElement("li");

      gco_item.textContent =
        `${gco_med.nombre} - $${gco_med.precio} (Lab: ${gco_lab ? gco_lab.nombre : "Sin laboratorio"})`;

      gco_lista.appendChild(gco_item);

    });

  }

  gco_contador.textContent = gco_arreglo.length;

}


//  consultar los datos de MockAPI

async function gco_cargarDatos() {

  gco_lista.innerHTML = "";

  // mostrar que se estan cargando los datos
  const gco_cargando = document.createElement("li");

  gco_cargando.textContent = "Conectando con MockAPI...";
  gco_cargando.className = "cargando";

  gco_lista.appendChild(gco_cargando);

  try {

    // consultar los dos servicios al mismo tiempo
    const [gco_resLab, gco_resMed] = await Promise.all([
      fetch(gco_urlLaboratorios),
      fetch(gco_urlMedicamentos)
    ]);

    // comprobar que las respuestas sean correctas
    if (!gco_resLab.ok) {
      throw new Error(`Error al consultar laboratorios: ${gco_resLab.status}`);
    }

    if (!gco_resMed.ok) {
      throw new Error(`Error al consultar medicamentos: ${gco_resMed.status}`);
    }

    // obtener la informacion en formato json
    gco_laboratorios = await gco_resLab.json();
    gco_medicamentos = await gco_resMed.json();

    // comprobar que los datos recibidos sean arreglos
    if (
      !Array.isArray(gco_laboratorios) ||
      !Array.isArray(gco_medicamentos)
    ) {
      throw new Error("Los datos recibidos no tienen el formato correcto");
    }

    // actualizar la informacion de la pagina
    gco_cargarLaboratorios();

    const gco_activos = gco_medicamentos.filter(gco_m =>

      gco_m.estado_activo === true

    );

    gco_mostrarMedicamentos(gco_activos);

    gco_avisar("Datos cargados correctamente", "ok");

    console.log("Laboratorios cargados:", gco_laboratorios);
    console.log("Medicamentos cargados:", gco_medicamentos);

  } catch (gco_error) {

    console.error("No fue posible cargar la información:", gco_error);

    gco_lista.innerHTML = "";

    const gco_fallo = document.createElement("li");

    gco_fallo.textContent =
      "No se pudieron cargar los datos. Intenta más tarde.";

    gco_fallo.className = "error";

    gco_lista.appendChild(gco_fallo);

    gco_contador.textContent = 0;

    gco_avisar("Error al conectar con el servidor", "error");

  }

}



// registrar un medicamento


gco_btnGuardar.addEventListener("click", async () => {

  const gco_nombre = gco_inputNombre.value.trim();
  const gco_precio = Number(gco_inputPrecio.value);
  const gco_laboratorioId = gco_selectLaboratorio.value;

  // revisar que los campos esten completos
  if (
    gco_nombre === "" ||
    gco_inputPrecio.value.trim() === "" ||
    !Number.isFinite(gco_precio) ||
    gco_precio <= 0 ||
    gco_laboratorioId === ""
  ) {

    gco_avisar("Completa todos los campos correctamente", "error");

    return;

  }

  //preparar los datos del nuevo medicamento
  const gco_nuevo = {

    nombre: gco_nombre,
    precio: gco_precio,
    laboratorio_id: String(gco_laboratorioId),
    estado_activo: true

  };

  try {

    // enviar el nuevo medicamento a MockAPI
    const gco_respuesta = await fetch(gco_urlMedicamentos, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(gco_nuevo)

    });

    if (!gco_respuesta.ok) {

      throw new Error(`Error al guardar: ${gco_respuesta.status}`);

    }

    // obtener el medicamento que se acaba de registrar
    const gco_guardado = await gco_respuesta.json();

    gco_medicamentos.push(gco_guardado);

    // limpiar los campos del formulario
    gco_inputNombre.value = "";
    gco_inputPrecio.value = "";
    gco_inputBuscar.value = "";

    // actualizar la lista
    const gco_activos = gco_medicamentos.filter(gco_m =>

      gco_m.estado_activo === true

    );

    gco_mostrarMedicamentos(gco_activos);

    gco_avisar(
      `Medicamento "${gco_nombre}" guardado correctamente`,
      "ok"
    );

    console.log("Nuevo medicamento:", gco_guardado);

  } catch (gco_error) {

    console.error("Error al guardar el medicamento:", gco_error);

    gco_avisar(
      "No se pudo registrar el medicamento en MockAPI",
      "error"
    );

  }

});



// mostrar todos los medicamentos activos


gco_btnMostrar.addEventListener("click", () => {

  gco_inputBuscar.value = "";

  const gco_activos = gco_medicamentos.filter(gco_m =>

    gco_m.estado_activo === true

  );

  gco_mostrarMedicamentos(gco_activos);

  gco_avisar("Mostrando medicamentos activos", "ok");

});



//buscar un medicamento por su nombre


gco_inputBuscar.addEventListener("input", () => {

  const gco_texto = gco_inputBuscar.value.trim().toLowerCase();

  const gco_resultado = gco_medicamentos.filter(gco_m =>

    gco_m.estado_activo === true &&
    typeof gco_m.nombre === "string" &&
    gco_m.nombre.toLowerCase().includes(gco_texto)

  );

  gco_mostrarMedicamentos(gco_resultado);

});


//limpiar

gco_btnLimpiar.addEventListener("click", () => {

  gco_lista.innerHTML = "";

  gco_contador.textContent = 0;

  gco_inputBuscar.value = "";

  gco_avisar("", "");

});


gco_cargarDatos();
