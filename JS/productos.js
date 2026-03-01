// Cragar los productios desde JSON

// Variable para guardar todos los productos
let catalogoProductos = [];

// Función para cargar los prodcutos

function cargarCatalogo() {

    // Determinar la ruta correcta 
    let rutaJSON;
    
    if (window.location.pathname.includes('/pages/')) {

        // Si se esta en alguna pagina dentro de pages
        rutaJSON = '../JS/data/productos.json';
    } else {
        // Si estamos en el indice (index.html)
        rutaJSON = './JS/data/productos.json';
    }
    
    console.log('Cargando JSON desde:', rutaJSON);
    
    return fetch(rutaJSON)
        .then(function(respuesta) {
            if (!respuesta.ok) {
                throw new Error('Error al cargar el archivo');
            }
            return respuesta.json();
        })
        .then(function(productos) {
            catalogoProductos = productos;
            return productos;
        })
        .catch(function(error) {
            console.warn('No se pudo cargar el catálogo:', error);
            return [];
        });
}

// Filtrar productos por categoría

function productosPorCategoria(categoria) {
    let resultado = [];
    for (let i = 0; i < catalogoProductos.length; i++) {
        if (catalogoProductos[i].categoria === categoria) {
            resultado.push(catalogoProductos[i]);
        }
    }
    return resultado;
}

// Filtrar productos por ID para la sección destacados

function productosPorIds(ids) {
    let resultado = [];
    for (let i = 0; i < catalogoProductos.length; i++) {
        for (let j = 0; j < ids.length; j++) {
            if (catalogoProductos[i].id === ids[j]) {
                resultado.push(catalogoProductos[i]);
                break;
            }
        }
    }
    return resultado;
}