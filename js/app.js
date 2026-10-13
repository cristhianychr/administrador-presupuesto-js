// VARIABLES Y SELECTORS
const formulario = document.querySelector('#agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');

// EVENTS
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}


// CLASSESS
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        // this.gastos.push(gasto);
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id );
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;
        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);
        // Quitar el HTML
        setTimeout(() => {
            divMensaje.remove();
        },3000);
    }

    imprimirListadoGastos(gastos) {
        this.limpiarHTML(); // Elimina el HTML previo
        
        // Iterar sobre los gastos 
        gastos.forEach( gasto => {
            const { nombre, cantidad, id} = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;
            
            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            // btnBorrar.textContent = 'Borrar';
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = function () {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastosListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while(gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
            // gastosListado.firstChild.remove();
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        // Comprobar 25%
        if( (presupuesto * 0.25) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto * 0.5) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-warning', 'alert-danger');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }
}

// Instanciar
const ui = new UI();
let presupuesto;

// FUNCTIONS
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');    

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    // Asignando el presupuesto
    presupuesto = new Presupuesto(presupuestoUsuario);
    
    ui.insertarPresupuesto(presupuesto);
}

// Añade gasto
function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // console.log('Agregando gasto');

    // Generar un object literal para el gasto
    const gasto = {nombre, cantidad, id: Date.now()};

    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Mensaje de exito
    ui.imprimirAlerta('Gasto agregado correctamente');

    // Imprimir gastos
    const {gastos, restante} = presupuesto;
    ui.imprimirListadoGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // Resetar formulario
    formulario.reset();
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    const {restante, gastos} = presupuesto;
    ui.imprimirListadoGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}