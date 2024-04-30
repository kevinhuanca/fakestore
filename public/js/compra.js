const btnCompra = document.querySelector('.compra');

const compras = [
   {
      id: 1,
      productos: 1,
      total: 1
   }
]

btnCompra.addEventListener('click', () => {

   let datosLocalStorage = JSON.parse(localStorage.getItem('carrito'));
   let montoTotal = parseFloat(document.getElementById('total').textContent.replace('Monto total: $', ''));
   
   // Agrego datos del carrito al array de compras
   compras[0].id = Math.floor(Math.random() * 100) + 1;
   compras[0].productos = datosLocalStorage;
   compras[0].total = montoTotal;

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