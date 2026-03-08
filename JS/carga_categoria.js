// Cargar productos según la categoría de la página

document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar que las funciones necesarias existen
    if (typeof cargarCatalogo === 'undefined') {
        return;
    }
    
    // Obtener el nombre del archivo actual
    let paginaActual = window.location.pathname.split('/').pop();
    let categoriaBuscada = '';
    
    // Asignar categoría según el nombre del archivo
    if (paginaActual === '00PC.html') categoriaBuscada = 'PC Ensamblados';
    else if (paginaActual === '01portatiles.html') categoriaBuscada = 'Portátiles';
    else if (paginaActual === '02CPU.html') categoriaBuscada = 'Procesadores';
    else if (paginaActual === '03GPU.html') categoriaBuscada = 'Tarjetas Gráficas';
    else if (paginaActual === '04board.html') categoriaBuscada = 'Placa Madre';
    else if (paginaActual === '05fuente.html') categoriaBuscada = 'Fuente de Poder';
    else if (paginaActual === '06RAM.html') categoriaBuscada = 'Memoria RAM';
    else if (paginaActual === '07HDD.html') categoriaBuscada = 'Almacenamiento';
    else if (paginaActual === '08refrigeracion.html') categoriaBuscada = 'Refrigeración';
    else if (paginaActual === '09chasis.html') categoriaBuscada = 'Chasis';
    else if (paginaActual === '10monitores.html') categoriaBuscada = 'Monitores';
    else if (paginaActual === '11mouse.html') categoriaBuscada = 'Mouse';
    else if (paginaActual === '12mousepad.html') categoriaBuscada = 'Mousepad';
    else if (paginaActual === '13teclados.html') categoriaBuscada = 'Teclados';
    else if (paginaActual === '14audio.html') categoriaBuscada = 'Diademas';
    else if (paginaActual === '15sillas.html') categoriaBuscada = 'Sillas';
    else if (paginaActual === '16streaming.html') categoriaBuscada = 'Streaming';
    
    // Buscar los elementos en el HTML
    let contenedor = document.getElementById('productos-categoria');
    let templateCard = document.getElementById('template-card');
    let templateMensaje = document.getElementById('template-mensaje');
    
    if (!contenedor) {
        return;
    }
    
    if (!templateCard) {
        return;
    }
    
    if (!templateMensaje) {
        return;
    }
    
    if (!categoriaBuscada) {
        mostrarMensaje(contenedor, templateMensaje, 'Categoría no encontrada');
        return;
    }
    
 
    function mostrarMensaje(contenedor, template, texto) {
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
        let clon = template.content.cloneNode(true);
        clon.querySelector('.mensaje-error').textContent = texto;
        contenedor.appendChild(clon);
    }
    
    // Cargar el catálogo y filtrar
    cargarCatalogo()
        .then(function() {
            
            let productosCategoria = productosPorCategoria(categoriaBuscada);
            
            if (productosCategoria.length === 0) {
                mostrarMensaje(contenedor, templateMensaje, 'No hay productos en esta categoría');
                return;
            }
            
            while (contenedor.firstChild) {
                contenedor.removeChild(contenedor.firstChild);
            }
            
            for (let i = 0; i < productosCategoria.length; i++) {
                let producto = productosCategoria[i];
                
                let clon = templateCard.content.cloneNode(true);
                
                clon.querySelector('.card-name').textContent = producto.nombre;
                clon.querySelector('.card-desc').textContent = producto.descripcion;
                clon.querySelector('.card-price').textContent = '$' + producto.precio;
                
                let img = clon.querySelector('.card-img');
                img.src = '../' + producto.imagen;
                img.alt = producto.nombre;
                
                img.onerror = function() {
                    this.src = '../images/placeholder.png';
                };
                
                let boton = clon.querySelector('.card-button');
                boton.onclick = function() {
                    if (typeof agregarProducto === 'function') {
                        agregarProducto(
                            producto.nombre,
                            producto.precio,
                            producto.imagen,
                            producto.id
                        );
                    } else {
                        mostrarMensaje(contenedor, templateMensaje, 'Error: El carrito no está funcionando');
                    }
                };
                
                contenedor.appendChild(clon);
            }
        })
        .catch(function() {
            mostrarMensaje(contenedor, templateMensaje, 'Error al cargar los productos');
        });
});