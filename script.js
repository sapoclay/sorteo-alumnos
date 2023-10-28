// Este evento se dispara cuando el DOM (la estructura de la página web) ha cargado completamente.
document.addEventListener('DOMContentLoaded', function () {
    let nombres = []; // Un arreglo para almacenar los nombres cargados desde el archivo JSON.

    // Esta función carga los nombres desde el archivo JSON usando la API de Fetch.
    function cargarNombres() {
        fetch('nombres.json') // Hace una petición para obtener el archivo 'nombres.json'.
            .then(response => {
                if (!response.ok) { // Si la respuesta no es satisfactoria (por ejemplo, un error HTTP), lanza un error.
                    throw new Error('No se pudo cargar la lista de nombres.');
                }
                return response.json(); // Convierte la respuesta en un objeto JSON.
            })
            .then(data => {
                if (!data || !data.nombres || !Array.isArray(data.nombres)) { // Si el JSON no tiene la estructura esperada, lanza un error.
                    throw new Error('El archivo de nombres tiene un formato incorrecto.');
                }
                nombres = data.nombres; // Almacena los nombres en la variable 'nombres'.
                mostrarNombresGuardados(); // Llama a la función para mostrar los nombres en la página.
            })
            .catch(error => { // Captura cualquier error que haya ocurrido en las promesas anteriores.
                console.error('Error:', error.message); // Imprime el mensaje de error en la consola.
                mostrarError(error.message); // Llama a la función para mostrar un mensaje de error en la página.
            });
    }

    // Esta función muestra los nombres guardados en el archivo JSON en la página HTML.
    function mostrarNombresGuardados() {
        const listaNombresGuardados = document.getElementById('nombres-guardados');
        listaNombresGuardados.innerHTML = nombres.map(nombre => `<li>${nombre}</li>`).join(''); // Crea una lista de elementos <li> con los nombres.
    }

    // Esta función guarda los nombres actualizados en el archivo JSON.
    function guardarNombres() {
        fetch('nombres.json', {
            method: 'POST', // Usa el método HTTP POST para enviar datos.
            headers: {
                'Content-Type': 'application/json' // Indica que el contenido es de tipo JSON.
            },
            body: JSON.stringify({ nombres }) // Convierte el arreglo de nombres a una cadena JSON y lo envía en el cuerpo de la petición.
        })
            .then(response => {
                if (!response.ok) { // Si la respuesta no es satisfactoria, lanza un error.
                    throw new Error('No se pudo guardar la lista de nombres.');
                }
            })
            .catch(error => { // Captura cualquier error que haya ocurrido en las promesas anteriores.
                console.error('Error:', error.message); // Imprime el mensaje de error en la consola.
                mostrarError(error.message); // Llama a la función para mostrar un mensaje de error en la página.
            });
        mostrarNombresGuardados(); // Llama a la función para actualizar la lista de nombres en la página.
    }

    // Esta función selecciona un nombre al azar y lo muestra en la página.
    function seleccionarNombre() {
        if (nombres.length > 0) {
            const indice = Math.floor(Math.random() * nombres.length); // Indice para seleccionar el nombre
            const nombreSeleccionado = nombres.splice(indice, 1); // Remueve el nombre seleccionado del array 'nombres'.
            const listaNombres = document.getElementById('lista-nombres');
            listaNombres.innerHTML = `FELICIDADES!! <li class="ganador">${nombreSeleccionado}</li>`; // Muestra un mensaje de felicitación.
            guardarNombres(); // Guarda los nombres actualizados en el archivo JSON.
        } else {
            alert("¡Todos los nombres han sido seleccionados! ¡Introduce nuevos nombres!"); // Muestra un mensaje de alerta si no hay más nombres.
        }
    }

    // Esta función añade un nuevo nombre a la lista.
    function añadirNombre(event) {
        event.preventDefault();
        const nuevoNombre = document.getElementById('nuevo-nombre').value;
        if (nuevoNombre.trim() !== "") {
            nombres.push(nuevoNombre); // Agrega el nuevo nombre al arreglo 'nombres'.
            guardarNombres(); // Guarda los nombres actualizados en el archivo JSON.
            document.getElementById('nuevo-nombre').value = ""; // Limpia el campo de entrada.
        }
    }

    // Esta función muestra un mensaje de error en la página por un tiempo determinado.
    function mostrarError(mensaje) {
        const mensajeError = document.getElementById('mensaje-error');
        mensajeError.textContent = mensaje;
        setTimeout(() => {
            mensajeError.textContent = "";
        }, 5000); // El mensaje de error desaparecerá después de 5 segundos.
    }

    cargarNombres(); // Llama a la función para cargar los nombres cuando el DOM esté completamente cargado.

    // Agrega escuchadores de eventos a los elementos de la página.
    document.getElementById('seleccionar').addEventListener('click', seleccionarNombre);
    document.getElementById('formulario-nuevo-nombre').addEventListener('submit', añadirNombre);
});