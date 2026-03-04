// Cargar los productos en la seccion destacados

document.addEventListener('DOMContentLoaded', function() {
    
    // IDs de los productos que se muestran en la seccion destacados
    let idsDestacados = [1, 16, 3, 7, 14, 20];
    
    // Buscar los elementos en el HTML
    let contenedor = document.getElementById('productos-destacados');
    let templateCard = document.getElementById('template-card');
    let templateMensaje = document.getElementById('template-mensaje');
    
    // Verificar que existan los elementos
    if (!contenedor) {
        return;
    }
    
    if (!templateCard) {
        return;
    }
    
    if (!templateMensaje) {
        return;
    }
    
    // Función auxiliar para mostrar mensajes
    function mostrarMensaje(texto) {
        contenedor.innerHTML = '';
        let clon = templateMensaje.content.cloneNode(true);
        clon.querySelector('.mensaje-error').textContent = texto;
        contenedor.appendChild(clon);
    }
    
    // Cargar el catálogo de productos
    cargarCatalogo()
        .then(function() {
            
            // Filtrar solo los productos destacados
            let productosDestacados = productosPorIds(idsDestacados);
            
            if (productosDestacados.length === 0) {
                mostrarMensaje('No hay productos destacados');
                return;
            }
            
            contenedor.innerHTML = '';
            
            // Crear card de los productos destacados
            for (let i = 0; i < productosDestacados.length; i++) {
                let producto = productosDestacados[i];
                
                // Clonar el template
                let clon = templateCard.content.cloneNode(true);
                
                // LLenar la card con los datos del producto
                clon.querySelector('.card-name').textContent = producto.nombre;
                clon.querySelector('.card-desc').textContent = producto.descripcion;
                clon.querySelector('.card-price').textContent = '$' + producto.precio;
                
                let img = clon.querySelector('.card-img');
                img.src = producto.imagen;
                img.alt = producto.nombre;
                
                // Si no carga la imagen se muestra un placeholder
                img.onerror = function() {
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
        .catch(function() {
            mostrarMensaje('Error al cargar los productos. Intenta de nuevo.');
        });
});