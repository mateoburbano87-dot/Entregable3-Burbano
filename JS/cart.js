// Carrito de compras

let productosCarrito = [];
let modalFormulario = null;
let datosEnvio = null;

// Cargar carrito guardado
let carritoGuardado = localStorage.getItem('tomanTechCarrito');
if (carritoGuardado) {
    productosCarrito = JSON.parse(carritoGuardado);
}

let listaCarrito = document.getElementById('carrito-lista');
let totalSpan = document.getElementById('total-valor');
let botonVaciar = document.getElementById('boton-vaciar');
let templateCarrito = document.getElementById('template-carrito');
let templateMensajeCarrito = document.getElementById('template-mensaje-carrito');

// Función para agregar producto
function agregarProducto(nombre, precio, imagen, id) {
    let indiceExistente = -1;
    for (let i = 0; i < productosCarrito.length; i++) {
        if (productosCarrito[i].id === id) {
            indiceExistente = i;
            break;
        }
    }

    if (indiceExistente >= 0) {
        productosCarrito[indiceExistente].cantidad++;
    } else {
        productosCarrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarVistaCarrito();

    Swal.fire({
        title: '¡Agregado!',
        text: nombre,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

function guardarCarrito() {
    localStorage.setItem('tomanTechCarrito', JSON.stringify(productosCarrito));
}

function calcularTotal() {
    let total = 0;
    for (let i = 0; i < productosCarrito.length; i++) {
        total += productosCarrito[i].precio * productosCarrito[i].cantidad;
    }
    return total;
}

function quitarUnidad(id) {
    for (let i = 0; i < productosCarrito.length; i++) {
        if (productosCarrito[i].id == id) {
            if (productosCarrito[i].cantidad > 1) {
                productosCarrito[i].cantidad--;
            } else {
                productosCarrito.splice(i, 1);
            }
            break;
        }
    }
    guardarCarrito();
    actualizarVistaCarrito();
}

function eliminarProductoCompleto(id) {
    for (let i = 0; i < productosCarrito.length; i++) {
        if (productosCarrito[i].id == id) {
            productosCarrito.splice(i, 1);
            break;
        }
    }
    guardarCarrito();
    actualizarVistaCarrito();
}

function vaciarCarritoCompleto() {
    productosCarrito = [];
    guardarCarrito();
    actualizarVistaCarrito();
}

// Función auxiliar para mostrar mensaje en el carrito
function mostrarMensajeCarrito(texto) {
    if (!listaCarrito || !templateMensajeCarrito) return;
    
    listaCarrito.innerHTML = '';
    let clon = templateMensajeCarrito.content.cloneNode(true);
    clon.querySelector('.mensaje-carrito').textContent = texto;
    listaCarrito.appendChild(clon);
    if (totalSpan) totalSpan.textContent = '0';
}

// Funcion para mostrar el formulario de envio
function mostrarFormularioEnvio() {
    if (productosCarrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Agregá productos antes de finalizar la compra',
            icon: 'warning'
        });
        return;
    }

    let templateForm = document.getElementById('template-formulario-envio');
    if (!templateForm) {
        console.error('No se encontró el template del formulario');
        Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar el formulario',
            icon: 'error'
        });
        return;
    }

    let clon = templateForm.content.cloneNode(true);
    let total = calcularTotal();
    clon.querySelector('#modal-total').textContent = total;

    document.body.appendChild(clon);
    modalFormulario = document.getElementById('modal-envio');

    document.getElementById('cancelar-formulario').onclick = cerrarFormulario;

    let formulario = document.getElementById('formulario-envio');
    formulario.onsubmit = function (event) {
        event.preventDefault();
        validarYEnviarFormulario();
    };

    modalFormulario.onclick = function (event) {
        if (event.target === modalFormulario) {
            cerrarFormulario();
        }
    };
}

function cerrarFormulario() {
    if (modalFormulario) {
        modalFormulario.remove();
        modalFormulario = null;
    }
}

// Funcion para validar los campos del formulario
function validarCampo(input, errorSpan, validacion) {
    let valor = input.value.trim();
    let error = '';

    if (!valor) {
        error = 'Este campo es obligatorio';
    } else if (validacion) {
        if (validacion === 'email') {
            let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(valor)) {
                error = 'Ingresá un email válido';
            }
        } else if (validacion === 'telefono') {
            let regex = /^[0-9]{8,15}$/;
            if (!regex.test(valor.replace(/\s/g, ''))) {
                error = 'Ingresá un teléfono válido (solo números)';
            }
        }
    }

    if (error) {
        input.classList.add('error');
        errorSpan.textContent = error;
        return false;
    } else {
        input.classList.remove('error');
        errorSpan.textContent = '';
        return true;
    }
}

function validarYEnviarFormulario() {
    let nombre = document.getElementById('nombre');
    let email = document.getElementById('email');
    let telefono = document.getElementById('telefono');
    let direccion = document.getElementById('direccion');
    let ciudad = document.getElementById('ciudad');
    let codigoPostal = document.getElementById('codigo-postal');
    let notas = document.getElementById('notas');

    let nombreValido = validarCampo(nombre, document.getElementById('error-nombre'));
    let emailValido = validarCampo(email, document.getElementById('error-email'), 'email');
    let telefonoValido = validarCampo(telefono, document.getElementById('error-telefono'), 'telefono');
    let direccionValido = validarCampo(direccion, document.getElementById('error-direccion'));
    let ciudadValido = validarCampo(ciudad, document.getElementById('error-ciudad'));
    let cpValido = validarCampo(codigoPostal, document.getElementById('error-codigo-postal'));

    if (nombreValido && emailValido && telefonoValido && direccionValido && ciudadValido && cpValido) {
        datosEnvio = {
            nombre: nombre.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim(),
            direccion: direccion.value.trim(),
            ciudad: ciudad.value.trim(),
            codigoPostal: codigoPostal.value.trim(),
            notas: notas.value.trim()
        };

        procesarCompraConDatos();
    }
}

function procesarCompraConDatos() {
    let total = calcularTotal();

    let mensaje = document.getElementById('template-resumen-compra').innerHTML
        .replace('{total}', total)
        .replace('{nombre}', datosEnvio.nombre)
        .replace('{email}', datosEnvio.email)
        .replace('{telefono}', datosEnvio.telefono)
        .replace('{direccion}', datosEnvio.direccion)
        .replace('{ciudad}', datosEnvio.ciudad)
        .replace('{codigoPostal}', datosEnvio.codigoPostal)
        .replace('{notas}', datosEnvio.notas || '');

    Swal.fire({
        title: '¡Compra realizada con éxito!',
        html: mensaje,
        icon: 'success',
        confirmButtonColor: '#28a745'
    });

    cerrarFormulario();
    vaciarCarritoCompleto();
    localStorage.setItem('ultimosDatosEnvio', JSON.stringify(datosEnvio));
}

function finalizarCompra() {
    mostrarFormularioEnvio();
}

// Funcion para actualizar la vista del carrito
function actualizarVistaCarrito() {
    if (!listaCarrito) return;

    if (productosCarrito.length === 0) {
        mostrarMensajeCarrito('El carrito está vacío');
        return;
    }

    listaCarrito.innerHTML = '';

    for (let i = 0; i < productosCarrito.length; i++) {
        let producto = productosCarrito[i];
        let clon = templateCarrito.content.cloneNode(true);

        let img = clon.querySelector('.imagen-producto-carrito');
        if (producto.imagen.startsWith('images/')) {
            img.src = '../' + producto.imagen;
        } else {
            img.src = producto.imagen;
        }
        img.alt = producto.nombre;

        clon.querySelector('.nombre-producto-carrito').textContent = producto.nombre;
        clon.querySelector('.detalle-producto-carrito').textContent = producto.cantidad + ' x $' + producto.precio;

        let subtotal = producto.precio * producto.cantidad;
        clon.querySelector('.subtotal-producto-carrito').textContent = 'Subtotal: $' + subtotal;

        let botonQuitar = clon.querySelector('.boton-quitar-uno');
        botonQuitar.onclick = function () {
            quitarUnidad(producto.id);
        };

        let botonEliminar = clon.querySelector('.boton-eliminar-todo');
        botonEliminar.onclick = function () {
            eliminarProductoCompleto(producto.id);
        };

        listaCarrito.appendChild(clon);
    }

    totalSpan.textContent = calcularTotal();
}

// Configurar eventos de los botones
if (botonVaciar) {
    botonVaciar.onclick = vaciarCarritoCompleto;
}

let footerCarrito = document.querySelector('.carrito-footer');
if (footerCarrito) {
    if (!document.querySelector('.boton-finalizar')) {
        let botonFinalizar = document.createElement('button');
        botonFinalizar.textContent = 'Finalizar Compra';
        botonFinalizar.className = 'boton-finalizar';
        botonFinalizar.onclick = finalizarCompra;
        footerCarrito.appendChild(botonFinalizar);
    }
}

actualizarVistaCarrito();