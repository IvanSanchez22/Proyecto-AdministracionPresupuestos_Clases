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
    
    //Reinicia el formulario
    formulario.reset();

}