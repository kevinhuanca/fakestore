import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'node:fs';
import { traducir } from './traductor.js';

const app = express();

app.use(cors());
app.use(express.json())

app.use(express.static('public'));

app.get('/productos', (req, res) => {
   res.sendFile('productos.html', { root: 'public' });
})

app.get('/carrito', (req, res) => {
   res.sendFile('carrito.html', { root: 'public' });
})

app.get('/descuentos', (req, res) => {
   res.json(descuentos); // Envia el JSON como respuesta
});

// Envia el JSON con los productos traducidos y con el descuento
app.get('/api/productos', async (req, res) => {

   let descuentos = JSON.parse(fs.readFileSync('./descuentos.json', 'utf8'));

   try {
      const response = await axios.get('https://fakestoreapi.com/products/');
      const data = response.data;

      // Traduccion de los productos
      let productos = data.map(async (producto) => {
         let titulo = await traducir(producto.title);
         let descripcion = await traducir(producto.description);
         let categoria = await traducir(producto.category);
         producto.title = titulo;
         producto.description = descripcion;
         producto.category = categoria;

         // Agrego el descuento
         descuentos.forEach(descuento => {
            if (producto.id === descuento.id) {
               producto["descuento"] = descuento.descuento;
            }
         });

         return producto;
      });

      res.json(await Promise.all(productos));

   } catch (error) {
      console.error('Error al consumir la API:', error);
      res.status(500).json({ error: 'Error al consumir la API' });
   }
});

app.post('/api/compra', (req, res) => {

   const compra = req.body;
   // console.log(compra)

   // Obtengo el archivo JSON de las compras
   let compras = JSON.parse(fs.readFileSync('compras.json', 'utf8'));

   // Le pusheo la compra al array de compras
   compras.push(compra);

   // Guardo la compra en el archivo JSON
   const jsonDataCompra = JSON.stringify(compras, null, 2);
   fs.writeFileSync('compras.json', jsonDataCompra);

   res.json({
      message: "Compra registrada.",
   });

});

app.use((req, res) => {
   res.status(404).send(`
   <h1>404 Not Found</h1>
   <p>La pagina solicitada no existe.</p>
   <a href="/productos">Volver a inicio</a>
   `);
});

// server: puerto dinamico
// const server = app.listen(0, () => {
//    console.log(`Servidor iniciado en http://localhost:${server.address().port}`);
// })

// server: puerto fijo
app.listen(3000, () => {
   console.log(`Servidor iniciado en http://localhost:3000/productos`);
})
