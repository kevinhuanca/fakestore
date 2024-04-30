import traductor from "node-google-translate-skidz";

export async function traducir(texto) {
   let traducido = await traductor({
      text: texto,
      source: 'en',
      target: 'es'
   })
   return traducido.translation;
}