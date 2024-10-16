document.addEventListener("DOMContentLoaded", function() {
    var svgObject = document.getElementById("mapa");
    
    svgObject.addEventListener("load", async function() {
        var svgDoc = svgObject.contentDocument;

        let corpenAike = svgDoc.getElementById("corpenAike");
        let deseado = svgDoc.getElementById("deseado");
        let guerAike = svgDoc.getElementById("guerAike");
        let lagoArgentino = svgDoc.getElementById("lagoArgentino");
        let lagoBuenosAires = svgDoc.getElementById("lagoBuenosAires");
        let magallanes = svgDoc.getElementById("magallanes");
        let rioChico = svgDoc.getElementById("rioChico");

        await fetchCoop();

        corpenAike.addEventListener('click', () => listLocalidad('Corpen Aike'));
        deseado.addEventListener('click', () => listLocalidad('Deseado'));
        guerAike.addEventListener('click', () => listLocalidad('Guer Aike'));
        lagoArgentino.addEventListener('click', () => listLocalidad('Lago Argentino'));
        lagoBuenosAires.addEventListener('click', () => listLocalidad('Lago Buenos Aires'));
        magallanes.addEventListener('click', () => listLocalidad('Magallanes'));
        rioChico.addEventListener('click', () => listLocalidad('Rio Chico'));
    });

});


const titleMap = document.querySelector('.map-inputs h2')
const inputLocalidad = document.querySelector('#inputLocalidad')
const dataLocalidad = document.querySelector('#localidad')
// ------------------------------------------------------------------
const inputCooperativa = document.querySelector('#inputCooperativa')
const dataCooperativa = document.querySelector('#cooperativa')
// ------------------------------------------------------------------
const coopInfo = document.querySelector('.information')
const titleCoop = document.querySelector('.information h2')
const textCoop = document.querySelector('.information p')
const listCoop = document.querySelector('.information ul')

// -------------------------------------- API --------------------------------------

let cooperativaData = [];

async function fetchCoop() {
    try {
        const response = await fetch('https://apicoopmut20241015005242.azurewebsites.net/api/Coop');
        cooperativaData = await response.json(); 
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// ------------------------------------------------------------------

function listLocalidad(departamento) {
        titleMap.textContent = departamento;
        inputLocalidad.value = ''
        inputCooperativa.value = ''
        // Limpiar opciones anteriores para evitar repeticiones
        dataLocalidad.innerHTML = '';

        // Filtrar las localidades del departamento seleccionado
        const localidadesFiltradas = cooperativaData.filter(coop => coop.Departamento === departamento);
    
        // Crear un conjunto (Set) para asegurar que cada localidad se agregue solo una vez
        const localidadesUnicas = new Set();
    
        // Añadir las localidades filtradas al conjunto
        localidadesFiltradas.forEach(coop => {
            localidadesUnicas.add(coop.Localidad); // Set solo acepta valores únicos
        });
    
        // Ahora iteramos sobre el conjunto y agregamos las localidades únicas al select
        localidadesUnicas.forEach(localidad => {
            dataLocalidad.innerHTML += `<option>${localidad}</option>`;
        });

            // Agregar evento para listar cooperativas cuando se selecciona una localidad
    inputLocalidad.addEventListener('input', () => listCooperativas(inputLocalidad.value));
}

function escapeHTML(text) {
    // Reemplaza las comillas dobles con el equivalente HTML &quot;
    return text.replace(/"/g, '&quot;');
}

function listCooperativas(localidad) {
    // Limpiar el datalist anterior
    dataCooperativa.innerHTML = '';

    // Filtrar las cooperativas de la localidad seleccionada
    const cooperativasFiltradas = cooperativaData.filter(coop => coop.Localidad === localidad);

    // Crear un conjunto de cooperativas únicas
    const cooperativasUnicas = new Set();

    // Añadir las cooperativas al conjunto
    cooperativasFiltradas.forEach(coop => {
        cooperativasUnicas.add(coop.Nombre); // Asumiendo que tienes un campo "NombreCooperativa"
    });

    // Iterar sobre el conjunto y añadir las cooperativas al datalist
    cooperativasUnicas.forEach(cooperativa => {
        let nombreCoop = escapeHTML(cooperativa)
        dataCooperativa.innerHTML += `<option>${nombreCoop}</option>`;
    });
}

function infoCoop (cooperativa){
    titleCoop.textContent = cooperativa.Nombre;
    textCoop.textContent = cooperativa.Articulo5;
    listCoop.innerHTML = `<li>Matrícula: ${cooperativa.Matricula}</li>
    <li>Objeto: ${cooperativa.Objeto}</li>
    <li>Cuit: ${cooperativa.Cuit}</li>
    <li>Fecha Alta: ${cooperativa.FechaAlta}</li>
    <li>Localidad: ${cooperativa.Localidad}</li>
    <li>Dirección: ${cooperativa.Direccion}</li>
    <li>Email: ${cooperativa.Email}</li>
    <li>Telefono: ${cooperativa.Telefono}</li>`

    coopInfo.classList.add("informationDisplay")

    coopInfo.scrollIntoView({
        behavior: 'smooth',  
        block: 'start'    
    });
}

inputCooperativa.addEventListener('input', () => {
    const selectedCooperativa = cooperativaData.find(coop => coop.Nombre === inputCooperativa.value);
    if (selectedCooperativa) {
        infoCoop(selectedCooperativa);
    } else {
        // Ocultar la sección si no se selecciona una cooperativa válida
        coopInfo.classList.remove("informationDisplay")
    }
});