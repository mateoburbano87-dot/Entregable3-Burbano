// Cargar los producots en la seccion destacados

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando carga de productos destacados');
    
    // IDs de los productos que se muestran en la seccion destacados

    let idsDestacados = [1, 16, 3, 7, 14, 20];
    
    // Buscar los elementos en el HTML
    let contenedor = document.getElementById('productos-destacados');
    let template = document.getElementById('template-card');
    
    // Verificar que existan los elementos
    if (!contenedor) {
        console.error('No encontré el contenedor #productos-destacados');
        return;
    }
    
    if (!template) {
        console.error('No encontré el template #template-card');
        return;
    }
    
    // Cargar el catálogo de productos
    
    cargarCatalogo()
        .then(function() {
            console.log('Catálogo cargado. Total:', catalogoProductos.length);
            
            // Filtrar solo los productos destacados

            let productosDestacados = productosPorIds(idsDestacados);
            
            if (productosDestacados.length === 0) {
                contenedor.innerHTML = '<p class="mensaje-error">No hay productos destacados</p>';
                return;
            }
            
            
            contenedor.innerHTML = '';
            
            // Crear card de los productos destacados

            for (let i = 0; i < productosDestacados.length; i++) {
                let producto = productosDestacados[i];
                
                // Clonar el template

                let clon = template.content.cloneNode(true);
                
                // LLenar la card con los datos del producto

                clon.querySelector('.card-name').textContent = producto.nombre;
                clon.querySelector('.card-desc').textContent = producto.descripcion;
                clon.querySelector('.card-price').textContent = '$' + producto.precio;
                
                let img = clon.querySelector('.card-img');
                img.src = producto.imagen;
                img.alt = producto.nombre;
                
                // Si no carga la imagen se muestra un placeholder

                img.onerror = function() {
                    console.warn('No se pudo cargar la imagen:', producto.imagen);
                    this.src = 'images/placeholder.png';
                };
                
                // Configurar el botón para agregar al carrito

                let boton = clon.querySelector('.card-button');
                boton.onclick = function() {
                    agregarProducto(
                        producto.nombre,
                        producto.precio,
                        producto.imagen,
                        producto.id
                    );
                };
                
                // Agregar la card al contenedor
                
                contenedor.appendChild(clon);
            }
        })
        .catch(function(error) {
            console.error('Error al cargar productos:', error);
            contenedor.innerHTML = '<p class="mensaje-error">Error al cargar los productos. Intenta de nuevo.</p>';
        });
});