const btnCompra = document.querySelector('.compra');

btnCompra.addEventListener('click', () => {

   let datosLocalStorage = JSON.parse(localStorage.getItem('carrito'));
   let montoTotal = parseFloat(document.getElementById('total').textContent.replace('Monto total: $', ''));

   let idCompra = Math.floor(Math.random() * 100) + 1;
   let totalCompra = montoTotal;
   let productosCompra = []

   // Pusheo los productos al array productosCompra
   datosLocalStorage.forEach(e => {
      let producto = {
         id: e.id,
         titulo: e.title,
         precio: e.price
      }
      if (e.descuento) {
         producto["descuento"] = e.descuento;
      }
      productosCompra.push(producto)
   })

   let compras = {
      id: idCompra,
      productos: productosCompra,
      total: totalCompra
   }
   

   fetch('/api/compra', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(compras)
   })
      .then(response => {
         if (!response.ok) {
            throw new Error('Error en la solicitud');
         }
         return response.json();
      })
      .then(data => {
         console.log('Respuesta del servidor:', data);
         localStorage.removeItem('carrito');
         window.location.reload();
      })
      .catch(error => {
         console.error('Error:', error);
      });

})