// ----------Variables----------
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];



// ----------Eventos----------
cargarEventListeners();
function cargarEventListeners() {
    // Agregar un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso)

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso)

    // Muestra los cursos de Local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse (localStorage.getItem('carrito') || []);

        carritoHTML()
    })

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Resetear el arreglo
        
        limpiarHTML(); // Elimina todo el HTML
    })
}


// ----------Funciones----------
function agregarCurso(e) {
    e.preventDefault(); // para prevenir que al dar click se haga scroll hacia arriba


    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
        muestrAlerta(e.target.parentElement)
    }
}

// Mostrar alerta exito
function muestrAlerta(div) {
    const exito = document.createElement('p');
    exito.textContent = "Agregado al carrito"
    exito.classList.add('alert-success')
    div.appendChild(exito)
    setTimeout(() => {
        exito.remove()
    }, 1500);
}
// Elimina cursos del carrito
function eliminarCurso(e) {
    console.log(e.target.classList);
    if(e.target.classList.contains("borrar-curso")){
        const cursoId = e.target.getAttribute('data-id');

        //Elimina del arreglo de articulosCarrito
        articulosCarrito = articulosCarrito.filter (curso => curso.id !== cursoId)

        carritoHTML();
    }
}


// Lee el contenido del HTML al que le dimos click y extrae la informacion del curso.
function leerDatosCurso(curso){
    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if(existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso // retorna el objeto actualizado
            } else {
                return curso // retorna los objetos que no estan dulpicados
            }
        })
        articulosCarrito = [...cursos];
    } else {
        // Agrega elementos a arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso]
    }

    console.log(infoCurso);

    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    //Limpiar el HTML para que no aparezcan repetidos cada vez que agregamos un curso
    limpiarHTML();
    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <img src = "${imagen}" width="100">
            </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td> 
                <a href="#" class="borrar-curso" data-id= ${id} > X </a>
            </td>

        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    })
    // Agregar el carrito de compras al storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHTML() {

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}