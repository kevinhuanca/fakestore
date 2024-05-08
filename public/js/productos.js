const cargando = document.querySelector('.cargando');

fetch('/api/productos')
   .then(response => response.json())
   .then(data => {
      data.forEach(producto => {

         if (!cargando == '') {
            cargando.style.display = 'none';
         }

         // Creo la card
         const card = document.createElement('div');
         card.classList.add('card');
         card.style.width = '20rem';
         card.style.marginBottom = '1rem';
         card.innerHTML = `
            <img src="${producto.image}" class="card-img-top" alt="...">
            <div class="oferta btn btn-warning">Oferta!</div>
            <div class="card-body">
               <h5 data-bs-toggle="tooltip" title="${producto.title}" class="card-title" style="cursor: default">${producto.title}</h5>
               <p data-bs-toggle="tooltip" title="${producto.description}" class="card-text texto-limitado" 
                  title="${producto.description}" style="cursor: default">${producto.description}</p>
               <p class="card-text">Categoria: ${producto.category}</p>
               <p class="card-text precio">$${producto.price}</p>
               <p class="oferta-contenedor"></p>
               <a href="#" class="btn btn-success agregar-carrito">Agregar al carrito</a>
            </div>
         `;
         document.querySelector('.row').appendChild(card);

         // Agrego estilos de la oferta
         if (producto.descuento) {
            let oferta = card.querySelector('.oferta');
            oferta.style.display = 'block';

            let ofertaContenedor = card.querySelector('.oferta-contenedor');
            ofertaContenedor.style.display = 'block';
            ofertaContenedor.innerHTML = `
            <div class="precio-tachado">$${producto.price}</div>
            <div class="oferta-porcentaje">-${producto.descuento}%</div>
            `;

            let valorPorcentaje = (producto.descuento / 100) * producto.price;
            let resultado = (producto.price - valorPorcentaje).toFixed(2);

            let precioActualizado = card.querySelector('.precio');
            precioActualizado.textContent = `$${resultado}`;
         }

         // Agrego el evento al agregar al boton
         const agregarCarritoBtn = card.querySelector('.agregar-carrito');
         agregarCarritoBtn.addEventListener('click', (event) => {
            event.preventDefault();

            agregarCarritoBtn.classList.add('disabled');
            agregarCarritoBtn.textContent = 'Agregado!';

            // Agrego el producto al localStorage
            let datosGuardados = localStorage.getItem('carrito');
            if (datosGuardados) {
               datosGuardados = JSON.parse(datosGuardados);
            } else {
               datosGuardados = [];
            }

            datosGuardados.push(producto);
            localStorage.setItem('carrito', JSON.stringify(datosGuardados));
         });

         // Desabilito el boton si ya esta en el localStorage
         let datosGuardados = localStorage.getItem('carrito');
         if (datosGuardados) {
            datosGuardados = JSON.parse(datosGuardados);
            let encontrado = datosGuardados.find(item => item.id === producto.id);
            if (encontrado) {
               agregarCarritoBtn.classList.add('disabled');
               agregarCarritoBtn.textContent = 'Agregado!';
            }
         }

      })

   });
