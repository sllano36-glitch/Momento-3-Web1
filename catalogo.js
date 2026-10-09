
const laboratorios = [
  { id: 1, nombre: "Genfar", ciudad: "Medellin", pais: "Colombia" },
  { id: 2, nombre: "MK", ciudad: "Bogota", pais: "Colombia" }
];

const medicamentos = [
  { id: 1, nombre: "Acetaminofen 500mg", precio: 3500, laboratorio_id: 1, estado_activo: true },
  { id: 2, nombre: "Ibuprofeno 400mg", precio: 5200, laboratorio_id: 2, estado_activo: true },
  { id: 3, nombre: "Amoxicilina 500mg", precio: 8900, laboratorio_id: 1, estado_activo: false }
];


const inputNombre = document.getElementById("inputNombre");
const inputPrecio = document.getElementById("inputPrecio");
const selectLaboratorio = document.getElementById("selectLaboratorio");
const inputBuscar = document.getElementById("inputBuscar");
const btnGuardar = document.getElementById("btnGuardar");
const btnMostrar = document.getElementById("btnMostrar");
const btnLimpiar = document.getElementById("btnLimpiar");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const lista = document.getElementById("listaMedicamentos");

function cargarLaboratorios() {
  laboratorios.forEach(lab => {
    const opcion = document.createElement("option");
    opcion.value = lab.id;
    opcion.textContent = lab.nombre;
    selectLaboratorio.appendChild(opcion);
  });
}

function mostrarMedicamentos(arreglo) {
  lista.innerHTML = ""; 
  if (arreglo.length === 0) {
    const vacio = document.createElement("li");
    vacio.textContent = "No hay medicamentos para mostrar.";
    vacio.className = "vacio";
    lista.appendChild(vacio);
  }

  arreglo.forEach(med => {
    const lab = laboratorios.find(l => l.id === med.laboratorio_id);
    const item = document.createElement("li");
    item.textContent = `${med.nombre} - $${med.precio} (Lab: ${lab.nombre})`;
    lista.appendChild(item);
  });

  contador.textContent = arreglo.length;
}


function avisar(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo; 
}

btnGuardar.addEventListener("clic", () => {
  const nombre = inputNombre.value.trim();
  const precio = Number(inputPrecio.value);
  const laboratorioId = Number(selectLaboratorio.value);

  if (nombre === "" || precio <= 0) {
    avisar("Escribe un nombre y un precio mayor a 0.", "error");
    return;
  }

  const nuevo = {
    id: medicamentos.length + 1,
    nombre: nombre,
    precio: precio,
    laboratorio_id: laboratorioId,
    estado_activo: true
  };

  medicamentos.push(nuevo); 

  avisar(`"${nombre}" se guardó correctamente.`, "ok");
  inputNombre.value = "";
  inputPrecio.value = "";
  inputBuscar.value = "";

  
  mostrarMedicamentos(medicamentos.filter(m => m.estado_activo));
});


btnMostrar.addEventListener("click", () => {
  inputBuscar.value = "";
  mostrarMedicamentos(medicamentos.filter(m => m.estado_activo));
});


inputBuscar.addEventListener("input", () => {
  const texto = inputBuscar.value.toLowerCase();

  const resultado = medicamentos.filter(m =>
    m.estado_activo && m.nombre.toLowerCase().includes(texto)
  );

  mostrarMedicamentos(resultado);
});

btnLimpiar.addEventListener("click", () => {
  lista.innerHTML = "";
  contador.textContent = 0;
  inputBuscar.value = "";
  avisar("", "");
});

cargarLaboratorios();