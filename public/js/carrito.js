const carrito = localStorage.getItem('carrito');

if (carrito) {

   const productos = JSON.parse(carrito);
   const productosContainer = document.querySelector('.row');

   productos.forEach(producto => {

      // let precioActualizado = producto.descuento ? (producto.price - ((producto.descuento / 100) * producto.price)).toFixed(2) : producto.price;

      // Creo la card
      const card = document.createElement('div');
      card.classList.add('card');
      card.style.width = '20rem';
      card.style.marginBottom = '1rem';
      card.innerHTML = `
               <img class="card-img-top" src="${producto.image}" alt="Card image cap">

                  <div id="productos" class="card-body">
                     <h5 class="card-title texto-limitado">${producto.title}</h5>
                     <p class="card-text texto-limitado">${producto.description}</p>
                     <a href="#" class="eliminar btn btn-outline-danger">Eliminar</a>
                     
                     <button type="button" class="reducir btn btn-outline-dark grupo">-</button>
                     <span class="num">1</span>
                     <button type="button" class="aumentar btn btn-outline-dark grupo">+</button>

                     <span class="precioProducto">$${producto.price}</span>

                  </div>
         `;
      productosContainer.appendChild(card);

      // Eventos cantidad del producto
      const aumentar = card.querySelector('.aumentar');
      const reducir = card.querySelector('.reducir');
      const eliminar = card.querySelector('.eliminar');
      const numeroElemento = card.getElementsByClassName('num');
      const precioProducto = card.querySelector('.precioProducto');

      aumentar.addEventListener('click', () => {
         let numero = numeroElemento.item(0).textContent;
         numero++;
         numeroElemento.item(0).textContent = numero;

         // Actualizo el precio
         let nuevoPrecio = (producto.price * numero).toFixed(2);
         precioProducto.textContent = `$${nuevoPrecio}`;


      })

      reducir.addEventListener('click', () => {
         let numero = numeroElemento.item(0).textContent;
         if (numero > 1) {
            numero--;
            numeroElemento.item(0).textContent = numero;

            // Actualizo el precio
            let precioActual = precioProducto.textContent.replace('$', '');
            let nuevoPrecio = (precioActual - producto.price).toFixed(2);
            precioProducto.textContent = `$${nuevoPrecio}`;

         }


      })

      // Eventos eliminar del carro y localStorage
      eliminar.addEventListener('click', (event) => {
         event.preventDefault();
         card.remove(); // :o

         // Elimino del localStorage
         let productosDelCarrito = JSON.parse(localStorage.getItem('carrito'));
         productosSinElEliminado = productosDelCarrito.filter(e => e.id !== producto.id);

         localStorage.removeItem('carrito');
         localStorage.setItem('carrito', JSON.stringify(productosSinElEliminado));

         let sinProductos = document.querySelector('.sin-productos');
         let precioTotal = document.getElementById('total');

         if (productosSinElEliminado.length === 0) {
            sinProductos.style.display = 'flex';
            compra.style.display = 'none';
            precioTotal.style.display = 'none';
         }

      })


   }) // Ciere forEach de productos


} // Cierre if

const compra = document.querySelector('.compra');
const total = document.getElementById('total');
let sinProductos = document.querySelector('.sin-productos');

// Función para calcular el monto total
function calcularTotal() {
   let total = 0;
   let spansPrecio = document.querySelectorAll('.precioProducto');
   spansPrecio.forEach(function(span) {
       let precio = parseFloat((span.textContent).replace('$', ''));
       total += precio;
   });
   // Mostrar el total en el elemento con el id "total"
   document.getElementById('total').textContent = `Monto total: $${total.toFixed(2)}`;
}

// Calculo el total inicial
calcularTotal();

// Observar los cambios
let observer = new MutationObserver(function(mutations) {
   // Volver a calcular el total cada vez que haya una mutación en el contenedor de productos
   calcularTotal();
});

// Config observador
observer.observe(document.querySelector('.row'), { childList: true, subtree: true });

// Oculto el sin-productos y el compra lo libero
if (!document.querySelector('.row').textContent == '') {
   compra.style.display = 'inline';
   total.style.display = 'block';
} else {
   sinProductos.style.display = 'flex';
   compra.style.display = 'none';
   total.style.display = 'none';
}
