// Cargar productos según la categoría de la página

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando carga por categoría');
    
    // Verificar que las funciones necesarias existen

    if (typeof cargarCatalogo === 'undefined') {
        console.error('Error: No se encontró la función cargarCatalogo');
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
    
    console.log('Página:', paginaActual, 'Categoría:', categoriaBuscada);
    
    // Buscar los elementos en el HTML
    let contenedor = document.getElementById('productos-categoria');
    let template = document.getElementById('template-card');
    
    if (!contenedor) {
        console.error('No encontré el contenedor #productos-categoria');
        return;
    }
    
    if (!template) {
        console.error('No encontré el template #template-card');
        return;
    }
    
    if (!categoriaBuscada) {
        console.warn('No se pudo determinar la categoría');
        contenedor.innerHTML = '<p class="mensaje-error">Categoría no encontrada</p>';
        return;
    }
    
    // Cargar el catálogo y filtrar
    
    cargarCatalogo()
        .then(function() {
            console.log('Catálogo cargado. Total:', catalogoProductos.length);
            
            let productosCategoria = productosPorCategoria(categoriaBuscada);
            
            if (productosCategoria.length === 0) {
                contenedor.innerHTML = '<p class="mensaje-error">No hay productos en esta categoría</p>';
                return;
            }
            
            contenedor.innerHTML = '';
            
            for (let i = 0; i < productosCategoria.length; i++) {
                let producto = productosCategoria[i];
                
                let clon = template.content.cloneNode(true);
                
                clon.querySelector('.card-name').textContent = producto.nombre;
                clon.querySelector('.card-desc').textContent = producto.descripcion;
                clon.querySelector('.card-price').textContent = '$' + producto.precio;
                
                let img = clon.querySelector('.card-img');
                img.src = '../' + producto.imagen;
                img.alt = producto.nombre;
                
                img.onerror = function() {
                    console.warn('Imagen no encontrada:', '../' + producto.imagen);
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
                        console.error('La función agregarProducto no está disponible');
                        alert('Error: El carrito no está funcionando');
                    }
                };
                
                contenedor.appendChild(clon);
            }
        })
        .catch(function(error) {
            console.error('Error al cargar productos:', error);
            contenedor.innerHTML = '<p class="mensaje-error">Error al cargar los productos</p>';
        });
});