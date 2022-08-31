//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//Eventos

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}


//Clases

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id); //Iteramos sobre gastos y nos traemos todos menos el que queremos eliminar
        this.calcularRestante();
    }

}

class UI {
    insertarPresupuesto(cantidad) {
        //Extrayendo los valores del objeto con destructing
        const { presupuesto, restante } = cantidad;
        //Insertando los valores en el html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }


    imprimirAlerta(mensaje, tipo) {
        //Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert'); //alert es una clase de boostrap

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger') //Es otra clase de boostrap
        } else {
            divMensaje.classList.add('alert-success') //Es otra clase de boostrap
        }

        //Agregamos el mensaje
        divMensaje.textContent = mensaje;

        //Insertamos el texto
        document.querySelector('.primario').insertBefore(divMensaje, formulario); //Pasamos lo que vamos a insertar y donde

        //Quitar texto después de unos segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); //Elimina el HTMl previo

        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; //Son clases de boostrap
            nuevoGasto.dataset.id = id;

            //Agregar el html del gasto
            nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span> 
            `; //Clases de boostrap

            //Botón para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //Comprobando 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menos
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

}

//Intanciando UI
const ui = new UI();
let presupuesto;


//Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupiuesto?');
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {//IsNaN comprueba si es un número
        window.location.reload(); //Recarga la pagina
    }

    //Presupuesto Válido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    //Leer datos del formulario
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validacion
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error')
        return; //Para que no se siga ejecutando código si se entra
    }

    //Genera un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() } //Lo mismo que el destructing pero al revés (object Literal) guarda en gasto el nombre y la cantidad
    //Añade un nuevo gasto al array de gastos
    presupuesto.nuevoGasto(gasto);

    //Mensaje de validación
    ui.imprimirAlerta('Gasto añadido correctamente')

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset();

}

function eliminarGasto(id) {
    //Elimina del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}